import express from "express";
import validate from "../middleware/validate.js";
import { repairsSchema, repairsUpdateSchema } from "../validations/repairs.schema.js";
import auth from "../middleware/auth.js";
import upload from '../middleware/upload.images.js';
import {repairNumber} from '../utils/repair.number.js';
import {
  create,
  index,
  edit,
  details,
  update,
  updateStatus,
  remove,
  assignRepair,
  addWorkLog,
  reopenRepair
} from "../controllers/admin.repairs.controller.js";

const router = express.Router()

router.post('/create' ,auth, repairNumber, upload.array('images', 5), validate(repairsSchema), create)

router.get("/", auth, index);
router.get("/:id/details", auth, details);
router.get("/:id/edit", auth, edit);
router.patch("/:id/status", auth, updateStatus);
router.patch("/:id/update", auth, validate(repairsUpdateSchema), update);
router.delete("/:id/remove", auth, remove);
router.patch("/:id/assign", auth, assignRepair);
router.patch("/:id/work-log", auth, addWorkLog);
router.patch("/:id/reopen", auth, reopenRepair);

export default router;
