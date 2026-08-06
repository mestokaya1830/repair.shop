import express from "express";
import {
  index,
  create,
  edit,
  details,
  updateUser,
  profile,
  updateProfile,
  deleteUser
} from "../controllers/users.controller.js";
import auth from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import { userSchema, userUpdateSchema } from "../validations/user.schema.js";

const router = express.Router();

router.get("/", auth, index);
router.post("/create", auth, validate(userSchema), create);
router.get("/profile", auth, profile);
router.patch("/profile/update", auth, updateProfile);

router.get("/:id/details", auth, details);
router.get("/:id/edit", auth, edit);
router.patch("/:id/update", auth, validate(userUpdateSchema), updateUser);
router.patch("/:id/delete", auth, deleteUser);

export default router;
