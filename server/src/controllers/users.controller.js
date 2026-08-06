import AppError from "../utils/app.error.js";
import catchAsync from "../middleware/catch.async.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import repairModel from "../models/repair.model.js";
import logger from "../utils/logger.js";

export const create = catchAsync(async (req, res, next) => {
  let role;
  switch (req.user.role) {
    case "owner":
      role = "admin";
      break;

    case "admin":
      role = "user";
      break;

    default:
      return next(new AppError("You are not allowed to create users", 403));
  }

  console.log(role)
  const newUser = await userModel.create({
    ...req.body,
    password: await bcrypt.hash(req.body.password, 12),
    role,
  });

  logger.info(`User created ${newUser.email}`);

  res.status(201).json({
    success: true,
    data: newUser,
  });
});


export const index = catchAsync(async (req, res, next) => {
  if (req.user && req.user.role === "user") {
    return next(new AppError("You do not have permission to view users list.", 403));
  }

  const users = await userModel.find({ isActive: true, role: { $ne: "owner" } }).lean();

  res.json({
    success: true,
    results: users.length,
    data: users,
  });
});

export const details = catchAsync(async (req, res, next) => {
  const user = await userModel.findById(req.params.id).lean();

  if (!user) {
    return next(new AppError("User not found", 404, "USER_NOT_FOUND"));
  }

  const repairs = await repairModel
    .find({
      assignedTo: req.params.id,
    })
    .populate("customer")
    .populate("device")
    .lean();

  res.json({
    success: true,
    user,
    repairs,
  });
});

export const edit = catchAsync(async (req, res, next) => {
  const data = await userModel.findById(req.params.id).lean();
  if (!data) {
    return next(new AppError("User not found", 404, "USER_NOT_FOUND"));
  }
  res.json({
    success: true,
    data,
  });
});

export const updateUser = catchAsync(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  if (!user) {
    return next(new AppError("User not found", 404, "USER_NOT_FOUND"));
  }

  res.json({
    success: true,
    data: user,
  });
});

export const profile = catchAsync(async (req, res, next) => {
  const user = await userModel.findById(req.user._id).select("+password");
  if (!user) {
    return next(new AppError("User not found", 404, "USER_NOT_FOUND"));
  }

  res.json({
    success: true,
    user,
  });
});

export const updateProfile = catchAsync(async (req, res, next) => {
  const user = await userModel.findById(req.user._id);

  if (!user) {
    return next(new AppError("User not found", 404, "USER_NOT_FOUND"));
  }

  if (req.body.phone !== undefined) {
    user.phone = req.body.phone;
  }

  if (req.body.password) {
    user.password = await bcrypt.hash(req.body.password, 10);
  }

  await user.save();

  res.json({
    success: true,
    user,
  });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);

  if (!user) {
    return next(new AppError("User not found", 404, "USER_NOT_FOUND"));
  }

  user.isActive = false;

  await user.save();

  res.json({
    success: true,
    message: "User deactivated successfully",
  });
});
