import AppError from "../utils/app.error.js";
import catchAsync from "../middleware/catch.async.js";
import deviceSC from "../models/devices.sc.js";

export const index = catchAsync(async (req, res, next) => {
  const devices = await deviceSC.find().populate("customer").lean();

  if (devices.length === 0) {
    return next(new AppError("Devices not found", 404, "DEVICES_NOT_FOUND"));
  }

  res.json({
    success: true,

    devices,
  });
});

export const details = catchAsync(async (req, res, next) => {
  const device = await deviceSC
    .findById(req.params.id)
    .populate("customer")
    .lean();

  if (!device) {
    return next(new AppError("Device not found", 404, "DEVICE_NOT_FOUND"));
  }

  res.json({
    success: true,
    device,
  });
});

export const edit = catchAsync(async (req, res, next) => {
  const device = await deviceSC
    .findById(req.params.id)
    .populate("customer")
    .lean();

  if (!device) {
    return next(new AppError("Device not found", 404, "DEVICE_NOT_FOUND"));
  }

  res.json({
    success: true,
    device,
  });
});

export const update = catchAsync(async (req, res, next) => {
  const device = await deviceSC.findByIdAndUpdate(
    req.params.id,

    {
      $set: req.body,
    },

    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  if (!device) {
    return next(new AppError("Device not found", 404, "DEVICE_NOT_FOUND"));
  }

  res.json({
    success: true,
    data: device,
  });
});

export const create = catchAsync(async (req, res, next) => {
  const newDevice = await deviceSC.create({
    ...req.body,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    data: newDevice,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const device = await deviceSC.findByIdAndDelete(req.params.id);

  if (!device) {
    return next(new AppError("Device not found", 404, "DEVICE_NOT_FOUND"));
  }

  res.json({
    success: true,

    message: "Device deleted successfully",
  });
});
