import AppError from "../utils/app.error.js";
import catchAsync from "../middleware/catch.async.js";
import customersModel from "../models/customer.model.js";
import devicesSC from "../models/device.model.js";
import repairModel from "../models/repair.model.js";


export const index = catchAsync(async (req, res, next) => {
  const filter = {};
  const { search, source, isActive, dateFrom, dateTo } = req.query;

  if (search) {
    filter.$or = [
      {
        "firstName": {
          $regex: search,
          $options: "i",
        },
      },
      {
        "lastName": {
          $regex: search,
          $options: "i",
        },
      },
      {
        email: {
          $regex: search,
          $options: "i",
        },
      },
      {
        "phone": {
          $regex: search,
          $options: "i",
        },
      },
      {
        "company": {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  // Source filter
  if (source) {
    filter.source = source;
  }

  // Active filter
  if (isActive !== undefined && isActive !== "") {
    filter.isActive = isActive === "true";
  }

  // Date range validation
  if (dateFrom && dateTo) {
    const startDate = new Date(dateFrom);
    const endDate = new Date(dateTo);

    if (endDate < startDate) {
      return next(
        new AppError(
          "End date cannot be earlier than start date",
          400,
          "INVALID_DATE_RANGE",
        ),
      );
    }
  }

  // Created date filter
  if (dateFrom || dateTo) {
    filter.createdAt = {};

    if (dateFrom) {
      filter.createdAt.$gte = new Date(dateFrom);
    }

    if (dateTo) {
      const endDate = new Date(dateTo);

      endDate.setHours(23, 59, 59, 999);

      filter.createdAt.$lte = endDate;
    }
  }

  const data = await customersModel
    .find(filter)
    .sort({
      createdAt: -1,
    })
    .lean();

  res.json({
    success: true,
    data,
  });
});

export const details = catchAsync(async (req, res, next) => {
  const data = await customersModel.findById(req.params.id);
  res.json({
    success: true,
    data,
  });
});

export const customerDevices = catchAsync(async (req, res, next) => {
  const data = await devicesSC
    .find({
      customer: req.params.id,
    })
    .lean();

  if (data.length === 0) {
    return next(new AppError("Devices not found", 404, "DEVICES_NOT_FOUND"));
  }

  res.json({
    success: true,
    data,
  });
});

export const deviceDetails = catchAsync(async (req, res, next) => {
  const device = await devicesSC
    .findOne({
      _id: req.params.deviceId,
      customer: req.params.id,
    })
    .populate("customer")
    .lean();

  if (!device) {
    return next(new AppError("Device not found", 404, "DEVICE_NOT_FOUND"));
  }

  const repairs = await repairModel
    .find({
      device: device._id,
    })
    .select("repairNumber status createdAt")
    .lean();

  res.json({
    success: true,
    data: {
      device,
      customer: device.customer,
      repairs,
    },
  });
});

export const repairDetails = catchAsync(async (req, res, next) => {
  const data = await repairModel
    .findOne({
      _id: req.params.repairId,
      customer: req.params.id,
    })
    .populate("customer")
    .populate("device")
    .populate("assignedTo")
    .lean();

  res.json({
    success: true,
    data,
  });
});

export const customerRepairs = catchAsync(async (req, res, next) => {
  const data = await repairModel
    .find({
      customer: req.params.id,
    })
    .populate("device", "brand model type")
    .lean();

  if (data.length === 0) {
    return next(new AppError("Repairs not found", 404, "REPAIRS_NOT_FOUND"));
  }

  res.json({
    success: true,
    data,
  });
});

export const edit = catchAsync(async (req, res, next) => {
  const data = await customersModel.findById(req.params.id);
  res.json({
    success: true,
    data,
  });
});

export const update = catchAsync(async (req, res, next) => {
  console.log('test')
  const data = await customersModel.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    {
      returnDocument: "after"
    },
  );

  res.json({
    success: true,
    data,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const device = await customersModel.findByIdAndUpdate(req.params.id,{isActive: false,},{new: true});

  res.json({
    success: true,
    message: "Customer deleted successfully",
  });
});
