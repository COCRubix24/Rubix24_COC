import express from "express";
import {
  registerCompany,
  loginCompany,
  companyVerification,
  logout,
} from "../controllers/company.js";

const router = express.Router();

router.post("/registerCompany", registerCompany);
router.post("/loginCompany", loginCompany);

router.get("/currCompany", companyVerification);
router.get("/logout", logout);

export default router;
