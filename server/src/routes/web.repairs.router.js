import express from "express";
import validate from "../middleware/validate.js";
import { repairsSchema, repairsUpdateSchema } from "../validations/repairs.schema.js";
import upload from '../middleware/upload.images.js';
import createRepairNumber from '../middleware/repair.number.middleware.js';
import {
  create,
  repairTrackController,
} from "../controllers/web.repairs.controller.js";

const router = express.Router()

router.post('/create', createRepairNumber, upload.array('images', 5), validate(repairsSchema), create)
router.get('/repair/track/:repairNumber', repairTrackController);


export default router;
