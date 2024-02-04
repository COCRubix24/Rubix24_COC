import { StatusCodes } from "http-status-codes";
import contact from "../models/contact.js";

export const createcontact = async (req, res, next) => {
  console.log(req.body);
  const newContact = new contact(req.body);
  try {
    const savedContact = await newContact.save();
    res.status(StatusCodes.OK).json(savedContact);
  } catch (err) {
    next(err);
  }
};

export const getcontact = async (_, res, next) => {
  try {
    const a = await contact.find();
    res.status(StatusCodes.OK).json(a);
  } catch (err) {
    next(err);
  }
};
