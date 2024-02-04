import { extraction } from "../controllers/ocrAi.js";
import express from "express";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (_, _, cb) {
    cb(null, "uploads/");
  },
  filename: function (_, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/extract", upload.single("receipt"), extraction);

export default router;
