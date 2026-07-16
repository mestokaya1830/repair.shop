import express from "express";
import {
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
} from "../controllers/repairs.admin.controller.js";
import auth from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import { repairSchema, repairUpdateSchema } from "../validators/schemas.js";

const router = express.Router();

router.get("/", auth, index);
router.post("/create", auth, validate(repairSchema), create);

router.get("/:id/details", auth, details);
router.get("/:id/edit", auth, edit);
router.patch("/:id/status", auth, updateStatus);
router.patch("/:id/update", auth, validate(repairUpdateSchema), update);
router.delete("/:id/remove", auth, remove);
router.patch("/:id/assign", auth, assignRepair);
router.patch("/:id/work-log", auth, addWorkLog);
router.patch("/:id/reopen", auth, reopenRepair);

export default router;
