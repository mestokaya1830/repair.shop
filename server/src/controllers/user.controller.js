import AppError from "../utils/app.error.js";
import catchAsync from "../middleware/catch.async.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userSC from "../models/user.sc.js";
import logger from "../utils/logger.js";

export const getUserController = catchAsync(async (req, res, next) => {
  const users = await userSC.find().lean();
  if (!users) {
    return next(new AppError("Users not found", 404, "USERS_NOT_FOUND"));
  }
  res.json({
    success: true,
    users,
  });
});

export const detailUserController = catchAsync(async (req, res, next) => {
  const user = await userSC.findOne({ _id: req.params.id }).lean();
  if (!user) {
    return next(new AppError("User not found", 404, "USER_NOT_FOUND"));
  }
  res.json({
    success: true,
    user,
  });
});

export const editUserController = catchAsync(async (req, res, next) => {
  const user = await userSC.findOne({ _id: req.params.id }).lean();
  if (!user) {
    return next(new AppError("User not found", 404, "USER_NOT_FOUND"));
  }
  res.json({
    success: true,
    user,
  });
});

export const updateUserController = catchAsync(async (req, res, next) => {
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

export const addUserController = catchAsync(async (req, res, next) => {
  let role;
  switch (req.user.user.role) {
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
