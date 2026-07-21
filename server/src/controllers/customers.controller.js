import AppError from "../utils/app.error.js";
import catchAsync from "../middleware/catch.async.js";
import customerSC from "../models/customers.sc.js";
import devicesSC from "../models/devices.sc.js";
import repairsSC from "../models/repairs.sc.js";

export const index = catchAsync(async (req, res, next) => {
  const data = await customerSC.find().lean();
  if (data.length === 0) {
    return next(
      new AppError("Customers not found", 402, "CUSTOMERS_NOT_FOUND"),
    );
  }
  res.json({
    success: true,
    data,
  });
});

export const details = catchAsync(async (req, res, next) => {
  const customer = await customerSC.findById(req.params.id);
  if (!customer) {
    return next(new AppError("Customer not found", 404, "CUSTOMER_NOT_FOUND"));
  }
  res.json({
    success: true,
    customer,
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

  const repairs = await repairsSC
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

  const repair = await repairsSC
    .findOne({
      _id: req.params.repairId,
      customer: req.params.id,
    })
    .populate("customer")
    .populate("device")
    .populate("assignedTo")
    .lean();

  if (!repair) {
    return next(
      new AppError(
        "Repair not found",
        404,
        "REPAIR_NOT_FOUND",
      ),
    );
  }


  res.json({
    success: true,
    data: repair,
  });

});

export const customerRepairs = catchAsync(async (req, res, next) => {
  const data = await repairsSC
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
  const customer = await customerSC.findById(req.params.id);
  if (!customer) {
    return next(new AppError("Customer not found", 404, "CUSTOMER_NOT_FOUND"));
  }
  res.json({
    success: true,
    customer,
  });
});

export const update = catchAsync(async (req, res, next) => {
  const customer = await customerSC.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  if (!customer) {
    return next(new AppError("Customer not found", 404, "CUSTOMER_NOT_FOUND"));
  }

  res.json({
    success: true,
    data: customer,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const customer = await customerSC.findByIdAndDelete(req.params.id);

  if (!customer) {
    return next(new AppError("Customer not found", 404, "CUSTOMER_NOT_FOUND"));
  }

  res.json({
    success: true,
    message: "Customer deleted successfully",
  });
});
