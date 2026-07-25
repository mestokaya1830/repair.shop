import AppError from "../utils/app.error.js";
import catchAsync from "../middleware/catch.async.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import usersSC from "../models/users.sc.js";
import repairsSC from "../models/repairs.sc.js";
import logger from "../utils/logger.js";

export const create = catchAsync(async (req, res, next) => {
  console.log(req.body);
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

  const newUser = await usersSC.create({
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
  const { search, role, isActive, position } = req.query;

const filter = {
  isActive: true,
};

  if (role) {
    filter.role = role;
  }

 if (isActive !== undefined && isActive !== "") {
    filter.isActive = isActive === "true";
  }
  if (position) {
    filter.position = position;
  }

  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }
  const users = await usersSC.find(filter).lean();

  res.json({
    success: true,
    data: users,
  });
});

export const details = catchAsync(async (req, res, next) => {
  const user = await usersSC.findById(req.params.id).lean();

  if (!user) {
    return next(new AppError("User not found", 404, "USER_NOT_FOUND"));
  }

  const repairs = await repairsSC
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
  const data = await usersSC.findById(req.params.id).lean();
  if (!data) {
    return next(new AppError("User not found", 404, "USER_NOT_FOUND"));
  }
  res.json({
    success: true,
    data,
  });
});

export const updateUser = catchAsync(async (req, res, next) => {
  const user = await usersSC.findByIdAndUpdate(
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
  const user = await usersSC.findById(req.user._id).select("+password");
  if (!user) {
    return next(new AppError("User not found", 404, "USER_NOT_FOUND"));
  }

  res.json({
    success: true,
    user,
  });
});

export const updateProfile = catchAsync(async (req, res, next) => {
  const user = await usersSC.findById(req.user._id);

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
  const user = await usersSC.findById(req.params.id);

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
