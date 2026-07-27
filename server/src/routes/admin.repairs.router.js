import express from "express";
import validate from "../middleware/validate.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.images.js";
import createRepairNumber from "../middleware/repair.number.middleware.js";

import {
  repairsSchema,
  repairsUpdateSchema,
  communicationSchema,
  statusUpdateSchema,
  assignRepairSchema,
  workItemSchema
} from "../validations/repairs.schema.js";

import {
  create,
  index,
  edit,
  details,
  update,
  updateStatus,
  deleteRepair,
  assignRepair,
  reopenRepair,
  getCommunications,
  createCommunication,
  addWorkItem
} from "../controllers/admin.repairs.controller.js";

const router = express.Router();

// --------------------------------------------------
// REPAIR CREATE
// --------------------------------------------------

router.post(
  "/create",
  auth,
  createRepairNumber,
  upload.array("images", 5),
  validate(repairsSchema),
  create,
);

// --------------------------------------------------
// REPAIR READ
// --------------------------------------------------

router.get("/", auth, index);

router.get("/:id/details", auth, details);

router.get("/:id/edit", auth, edit);

// --------------------------------------------------
// REPAIR UPDATE
// --------------------------------------------------

router.patch("/:id/status", auth, validate(statusUpdateSchema), updateStatus);

router.patch("/:id/update", auth, validate(repairsUpdateSchema), update);

router.patch("/:id/assign", auth, validate(assignRepairSchema), assignRepair);

router.patch("/:id/reopen", auth, reopenRepair);

// --------------------------------------------------
// COMMUNICATIONS
// --------------------------------------------------

router.get("/:id/communications", auth, getCommunications);

router.post(
  "/:id/communications",
  auth,
  validate(communicationSchema),
  createCommunication,
);

// --------------------------------------------------
// DELETE
// --------------------------------------------------

router.delete("/:id/remove", auth, deleteRepair);

// WORK ITEMS

router.patch("/:id/work-items", auth, validate(workItemSchema), addWorkItem);

export default router;
