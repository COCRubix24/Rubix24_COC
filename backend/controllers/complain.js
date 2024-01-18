import cloudinary from "../config/cloudinary.js"; // Import the Cloudinary configuration
import Complain from "../models/Complain.js";
import { StatusCodes } from "http-status-codes";
import Company from "../models/Company.js";

export const createComplain = async (req, res) => {
  console.log(req.body);
  const {
    companyName,
    email,
    name,
    phone,
    createdBy,
    isAnonymous,
    preferedLanguage,
    preferedContactMethod,
    pinataIPFS,
  } = req.body;
  if (
    !companyName ||
    !createdBy ||
    isAnonymous ||
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
    if (isAnonymous === true) {
      pinataIPFS = "https://ipfs.io/ipfs/" + pinataIPFS;
      const newComplain = {
        companyName: companyName,
        companyId: company._id,
        createdBy: createdBy,
        pinataIPFS: pinataIPFS,
        preferedLanguage: preferedLanguage,
        preferedContactMethod: preferedContactMethod,
      };
      const complain = await Complain.create(newComplain);
      res.status(201).json({ complain });
    } else {
      if (!email || !name || !phone) {
        throw new Error("Invalid credentials");
      }
      const newComplain = {
        companyName: companyName,
        companyId: company._id,
        email: email,
        name: name,
        phone: phone,
        createdBy: createdBy,
        pinataIPFS: pinataIPFS,
        preferedLanguage: preferedLanguage,
        preferedContactMethod: preferedContactMethod,
      };
      const complain = await Complain.create(newComplain);
      res.status(201).json({ complain });
    }
  } catch (error) {
    console.error(error);
  }
};
