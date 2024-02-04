import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const updateUser = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body, password: hash },
      { new: true },
    );
    res.status(StatusCodes.OK).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(StatusCodes.OK).json("User has been deleted.");
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(StatusCodes.OK).json(user);
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (_, res, next) => {
  try {
    const users = await User.find();
    res.status(StatusCodes.OK).json(users);
  } catch (err) {
    next(err);
  }
};
