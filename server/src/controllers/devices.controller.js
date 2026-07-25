import AppError from "../utils/app.error.js";
import catchAsync from "../middleware/catch.async.js";
import deviceSC from "../models/devices.sc.js";

export const index = catchAsync(async (req, res, next) => {
  const { search, type, brand, customer } = req.query;
  const filter = {};

  if (type) {
    filter.type = type;
  }

  if (brand) {
    filter.brand = brand;
  }

  if (customer) {
    filter.customer = customer;
  }

  if (search) {
    filter.$or = [
      { brand: { $regex: search, $options: "i" } },
      { model: { $regex: search, $options: "i" } },
      { serialNumber: { $regex: search, $options: "i" } },
    ];
  }

  const devices = await deviceSC.find(filter).populate("customer").lean();

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
  const device = await deviceSC.create({
    ...data.device,
    customer: customer._id,
    source: "web",
    createdBy: null,
  });

  res.status(201).json({
    success: true,
    data: newDevice,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const device = await deviceSC.findByIdAndUpdate(
    req.params.id,
    { active: false },
    { new: true },
  );

  res.json({
    success: true,
    message: "Device deleted successfully",
  });
});

export const customerDevices = catchAsync(async (req, res, next) => {
  const devices = await deviceSC
    .find({
      customer: req.params.customerId,
    })
    .lean();

  res.json({
    success: true,
    devices,
  });
});
