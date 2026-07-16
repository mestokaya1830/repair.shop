import AppError from "../utils/app.error.js";
import catchAsync from "../middleware/catch.async.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userSC from "../models/users.sc.js";
import logger from "../utils/logger.js";

export const index = catchAsync(async (req, res, next) => {
  const users = await userSC.find().lean();
  if (!users) {
    return next(new AppError("Users not found", 404, "USERS_NOT_FOUND"));
  }
  res.json({
    success: true,
    users,
  });
});

export const details = catchAsync(async (req, res, next) => {
  console.log('test')
  const user = await userSC.findById(req.params.id).lean();
  if (!user) {
    return next(new AppError("User not found", 404, "USER_NOT_FOUND"));
  }
  res.json({
    success: true,
    user,
  });
});

export const edit = catchAsync(async (req, res, next) => {
  const user = await userSC.findById(req.params.id).lean();
  if (!user) {
    return next(new AppError("User not found", 404, "USER_NOT_FOUND"));
  }
  res.json({
    success: true,
    user,
  });
});

export const updateUser = catchAsync(async (req, res, next) => {
  const user = await userSC.findByIdAndUpdate(
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
  const user = await userSC.findById(req.user._id).select("+password");
  if (!user) {
    return next(new AppError("User not found", 404, "USER_NOT_FOUND"));
  }

  res.json({
    success: true,
    user,
  });
});

export const updateProfile = catchAsync(async (req, res, next) => {
  const user = await userSC.findById(req.user._id);

  if (!user) {
    return next(new AppError("User not found", 404, "USER_NOT_FOUND"));
  }

  if (req.body.profile?.phone !== undefined) {
    user.profile.phone = req.body.profile.phone;
  }

  if (req.body.password) {
    user.password = await bcrypt.hash(req.body.password, 10);
  }

  await user.save();

  res.json({
    success: true,
    user
  });
});

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

  const newUser = await userSC.create({
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
