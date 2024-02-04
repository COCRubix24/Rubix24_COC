import {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
} from "../controllers/user.js";
import express from "express";
import { verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.put("/update/:id", verifyUser, updateUser);
router.delete("/:id", verifyUser, deleteUser);
router.get("/:id", verifyUser, getUser);
router.get("/", getUsers);

export default router;
