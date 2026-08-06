import express from "express";
import validate from "../middleware/validate.js";
import { repairSchema, repairUpdateSchema } from "../validations/repair.schema.js";
import upload from '../middleware/upload.images.js';
import createRepairNumber from '../middleware/repair.number.middleware.js';
import {
  create,
  repairTrack,
} from "../controllers/web.repairs.controller.js";

const router = express.Router()

router.post('/create', createRepairNumber, upload.array('images', 5), validate(repairSchema), create)
router.get('/repair/track/:repairNumber', repairTrack);


export default router;
