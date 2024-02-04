import Complain from "../models/Complain.js";
import { StatusCodes } from "http-status-codes";
import Company from "../models/Company.js";
import axios from "axios";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const createComplain = async (req, res) => {
  console.log(req.body);
  const {
    companyName,
    email,
    name,
    phone,
    createdBy,
    isAnonymous,
    description,
    preferedLanguage,
    preferedContactMethod,
    pinataIPFS,
  } = req.body;
  console.log(req.body);

  if (
    !companyName ||
    !createdBy ||
    !preferedLanguage ||
    !preferedContactMethod
  ) {
    throw new Error("Invalid credentials");
  }

  try {
    const company = await Company.findOne({
      companyName: { $regex: new RegExp(companyName, "i") },
    });

    if (!company) {
      throw new Error("Invalid company Name");
    }

    let complainData = null;

    if (isAnonymous === true) {
      complainData = {
        companyName: companyName,
        companyId: company._id,
        createdBy: createdBy,
        description: description,
        pinataIPFS: pinataIPFS,
        preferedLanguage: preferedLanguage,
        preferedContactMethod: preferedContactMethod,
      };
    } else {
      if (!email || !name || !phone) {
        throw new Error("Invalid credentials");
      }
      complainData = {
        companyName: companyName,
        companyId: company._id,
        email: email,
        name: name,
        phone: phone,
        createdBy: createdBy,
        description: description,
        pinataIPFS: pinataIPFS,
        preferedLanguage: preferedLanguage,
        preferedContactMethod: preferedContactMethod,
      };
    }

    const flaskApiResponse = await axios.post(
      "http://localhost:5000/classifyDept/",
      {
        input: description,
        depts: company.departments,
        pinataIPFS: pinataIPFS,
      },
    );
    console.log(flaskApiResponse.data);

    const flaskApiData = flaskApiResponse.data.result;

    Object.assign(complainData, {
      department: flaskApiData.deptSelected,
      keywords: flaskApiData.keywords,
    });

    const complain = await Complain.create(complainData);
    const msg = {
      to: complain.email,
      from: "moheetshendarkar@gmail.com",
      subject: "Your recent Case Details",
      html: `<html><h1>Company - ${complain.companyName}</h1><h5>Company ID - ${complain.companyId}</h5><h2>${complain.name}</h2><p>To view the receipt copy and paste - https://ipfs.io/ipfs/${complain.pinataIPFS}</p></html>`,
    };
    await sgMail.send(msg);
    res.status(StatusCodes.CREATED).json({ complain });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const getAllComplain = async (req, res) => {
  const { id } = req.body;
  console.log(id);
  try {
    const complains = await Complain.find({ createdBy: id }).sort("-createdAt");
    // if (!complains) {
    //   throw new Error("Invalid user id");
    // }
    res.status(StatusCodes.OK).json({ complains });
  } catch (error) {
    console.log(error);
  }
};

export const getSingleComplain = async (req, res) => {
  const { complainId } = req.body;
  try {
    const complain = await Complain.findOne({ _id: complainId });
    if (!complain) {
      throw new Error("Invalid Complain ID");
    }
    res.status(StatusCodes.OK).json({ complain });
  } catch (error) {
    console.log(error);
  }
};

export const updateSingleComplain = async (req, res) => {
  const { complainId, status } = req.body;
  try {
    if (!complainId || !status) {
      throw new Error("Invalid credentials");
    }
    const complain = await Complain.findByIdAndUpdate(
      { _id: complainId },
      {
        status: status,
      },
      {
        new: true,
      },
    );
    if (!complain) {
      throw new Error("Invalid complain ID");
    }
    res.status(StatusCodes.OK).json({ complain });
  } catch (error) {
    console.log(error);
  }
};

export const getAllCompanyComplain = async (req, res) => {
  const { id } = req.body;
  console.log(id);
  try {
    const complains = await Complain.find({ companyId: id });
    console.log("2", complains);
    // if (!complains) {
    //   throw new Error("Invalid user id");
    // }
    res.status(StatusCodes.OK).json({ complains });
  } catch (error) {
    console.log(error);
  }
};

export const dashboardB = async (req, res) => {
  const { companyId } = req.body;

  try {
    const totalComplains = await Complain.countDocuments({ companyId });
    const resolvedComplains = await Complain.countDocuments({
      companyId,
      status: "resolved",
    });
    const pendingComplains = await Complain.countDocuments({
      companyId,
      status: { $in: ["Submitted complain", "In progress"] },
    });

    const resolvedComplaints = await Complain.find({
      companyId,
      status: "resolved",
      createdAt: { $exists: true },
      updatedAt: { $exists: true },
    });

    const resolutionTimes = resolvedComplaints.map((complaint) => {
      const createdAt = complaint.createdAt.getTime();
      const updatedAt = complaint.updatedAt.getTime();
      const resolutionTimeInHours = (updatedAt - createdAt) / (1000 * 60 * 60); // Convert milliseconds to hours
      return resolutionTimeInHours;
    });

    const avgResolutionTime =
      resolutionTimes.reduce(
        (sum, { resolutionTime }) => sum + resolutionTime,
        0,
      ) / resolutionTimes.length;

    const departmentWiseData = await Complain.aggregate([
      {
        $match: {
          companyId,
          status: { $in: ["resolved", "In progress", "Submitted complain"] },
        },
      },
      {
        $group: {
          _id: "$department",
          resolved: {
            $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] },
          },
          pending: {
            $sum: {
              $cond: [
                { $in: ["$status", ["In progress", "Submitted complain"]] },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    res.json({
      totalComplains,
      resolvedComplains,
      pendingComplains,
      avgResolutionTime,
      departmentWiseData,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

export const getComplaintsByDepartment = async (req, res) => {
  const { companyId, department } = req.body;

  try {
    const complaints = await Complain.find({
      companyId,
      department,
    });

    res.status(StatusCodes.CREATED).json(complaints);
  } catch (error) {
    console.error("Error fetching complaints by department:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};
