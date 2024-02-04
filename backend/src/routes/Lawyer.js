import express from "express";
import {
  deleteLawyer,
  createLawyer,
  getLawyer,
  getLawyers,
} from "../controllers/Lawyer.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (_, _, cb) {
    cb(null, "uploads/");
  },
  filename: function (_, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "idCard", maxCount: 1 },
  ]),
  createLawyer,
);
router.delete("/:id", deleteLawyer);
router.get("/find/:id", getLawyer);
router.get("/", getLawyers);

export default router;
