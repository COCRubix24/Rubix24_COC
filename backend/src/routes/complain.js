import express from "express";
import {
  createComplain,
  getAllComplain,
  getSingleComplain,
  updateSingleComplain,
  getAllCompanyComplain,
  dashboardB,
  getComplaintsByDepartment,
} from "../controllers/complain.js";

const router = express.Router();

router.post("/createComplain", createComplain);
router.post("/getAllComplain", getAllComplain);
router.post("/getSingleComplain", getSingleComplain);
router.patch("/updateSingleComplain", updateSingleComplain);

router.post("/getAllCompanyComplain", getAllCompanyComplain);

router.post("/dashboardB", dashboardB);
router.post("/department", getComplaintsByDepartment);

export default router;
