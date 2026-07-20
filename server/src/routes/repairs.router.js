import express from "express";
import validate from "../middleware/validate.js";
import { repairSchema, repairUpdateSchema } from "../validators/schemas.js";
import auth from "../middleware/auth.js";
import upload from '../middleware/upload.images.js';
import createRepairNumber from '../middleware/reapir.number..middleware.js';
import {
  repairsController,
  repairTrackController,
  index,
  edit,
  details,
  update,
  updateStatus,
  create,
  remove,
  assignRepair,
  addWorkLog,
  reopenRepair
} from "../controllers/repairs.controller.js";


const router = express.Router()

router.post('/create', createRepairNumber, upload.array('images', 5), validate(repairSchema), create)
router.get('/repair/track/:repairNumber', repairTrackController);


router.get("/", auth, index);
router.get("/:id/details", auth, details);
router.get("/:id/edit", auth, edit);
router.patch("/:id/status", auth, updateStatus);
router.patch("/:id/update", auth, validate(repairUpdateSchema), update);
router.delete("/:id/remove", auth, remove);
router.patch("/:id/assign", auth, assignRepair);
router.patch("/:id/work-log", auth, addWorkLog);
router.patch("/:id/reopen", auth, reopenRepair);

export default router;
