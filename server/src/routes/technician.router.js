import express from "express";
import auth from "../middleware/auth.js";

import {
  index,
  repairs,
  details,
  updateStatus,
  addWorkLog,
} from "../controllers/technician.controller.js";


const router = express.Router();


router.get("/", auth, index);
router.get("/repairs", auth, repairs);
router.get("/repairs/:id", auth, details);
router.patch("/repairs/:id/status", auth, updateStatus);
router.post("/repairs/:id/work-log", auth, addWorkLog);

export default router;
