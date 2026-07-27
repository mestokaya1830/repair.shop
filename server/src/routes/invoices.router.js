import express from "express";

import {
  create,
  index,
  details,
  updatePaymentStatus,
} from "../controllers/admin.invoice.controller.js";

import auth from '../middleware/auth.js';

const router = express.Router();

router.get("/", auth, index);
router.post("/", auth, create);
router.get("/:id", auth, details);
router.patch("/:id/payment-status", auth, updatePaymentStatus);

export default router;
