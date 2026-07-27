import express from "express";
import auth from "../middleware/auth.js";

import { index, details } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/", auth, index);
router.get("/details", auth, details);

export default router;
