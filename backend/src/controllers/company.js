import Company from "../models/Company.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

export const registerCompany = async (req, res, next) => {
  try {
    const { email } = req.body;

    const existingUser = await Company.findOne({ email });
    if (existingUser) {
      console.log("exist");
      return res
        .status(StatusCodes.CONFLICT)
        .json({ error: "User with this email already exists." });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newCompany = new Company({
      ...req.body,
      password: hash,
    });
    await newCompany.save();
    res.status(StatusCodes.OK).json({ newCompany });
  } catch (err) {
    next(err);
  }
};

export const loginCompany = async (req, res, next) => {
  console.log(req.body);
  try {
    const user = await Company.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "Company not found"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password,
    );
    if (!isPasswordCorrect) return next(createError(400, "Wrong password"));

    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
        email: user.email,
        name: user.name,
      },
      process.env.JWT,
      {
        expiresIn: "30d",
      },
    );

    const { password, ...companyy } = user._doc;

    const option = {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 6),
      httpOnly: false,
    };

    res
      .status(StatusCodes.OK)
      .cookie("access_token_company", token, option)
      .json(companyy);
  } catch (err) {
    next(err);
  }
};

export const getCompanyStatus = async (req, _) => {
  const { email } = req.body;
  try {
    const company = await Company.find({ email: email });
    return res.status(StatusCodes.OK).json(company);
  } catch (error) {
    console.error();
  }
};

export const companyVerification = (req, res, next) => {
  try {
    const token = req.cookies.access_token_company;
    if (!token) {
      return res.json({ status: false });
    }

    jwt.verify(token, process.env.JWT, async (err, data) => {
      if (err) {
        return res.json({ status: false });
      }

      const companyRes = await Company.findById(data.id);
      if (companyRes) {
        const { password, ...company } = companyRes._doc;
        return res.json({ status: true, company });
      } else {
        return res.json({ status: false });
      }
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (_, res) => {
  try {
    res.cookie("access_token_company", " ", { expires: new Date(0) });
    res.status(StatusCodes.OK).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};
