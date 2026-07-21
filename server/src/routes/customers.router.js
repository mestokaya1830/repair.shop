import express from "express";
import {
  index,
  edit,
  details,
  update,
  remove,
  customerDevices,
  customerRepairs,
  deviceDetails,
  repairDetails
} from "../controllers/customers.controller.js";
import auth from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import { customersSChema, updatecustomersSChema } from "../validators/schemas.js";

const router = express.Router();



router.get("/", auth, index);


router.get("/:id/details", auth, details);
router.get("/:id/devices", auth, customerDevices);
router.get("/:id/repairs", auth, customerRepairs);
router.get("/:id/devices/:deviceId/details", auth, deviceDetails) 
router.get("/:id/repairs/:repairId/details", auth, repairDetails)

router.get("/:id/edit", auth, edit);
router.patch("/:id/update", auth, validate(updatecustomersSChema), update);
router.delete("/:id/remove", auth, remove);

export default router;
