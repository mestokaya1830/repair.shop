import express from "express";
import auth from "../middleware/auth.js";

import {
  index,
  repairs,
  customers,
  details
} from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/", auth, index);
router.get("/repairs", auth, repairs);
router.get("/customers", auth, customers);
router.get("/repairs/:id/details", auth, details);

export default router;
