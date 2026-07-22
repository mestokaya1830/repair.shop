import catchAsync from "../middleware/catch.async.js";
import customersSC from "../models/customers.sc.js";
import repairsSC from "../models/repairs.sc.js";
import devicesSC from "../models/devices.sc.js";
import logger from "../utils/logger.js";
import AppError from "../utils/app.error.js";

export const create = catchAsync(async (req, res, next) => {
  const data = req.body;

  const source = 'office';
  const createdBy = req.user._id;
  const status = Pending;

  const images =
    req.files?.map((file) => ({
      filename: file.filename,
      path: file.path,
      category: "incoming",
      uploadedByType: req.user ? "user" : "customer",
      uploadedBy: createdBy,
    })) || [];

  // 1. CUSTOMER

  let customer = await customersSC.findOne({
    email: data.customer.email,
  });

  if (!customer) {
    customer = await customersSC.create({
      firstName: data.customer.firstName,
      lastName: data.customer.lastName,
      phone: data.customer.phone,
      company: data.customer.company || "",
      email: data.customer.email,
      createdBy,
      source
    });
  }

  // 2. DEVICE
  const device = await devicesSC.create({
    type: data.device.type,
    brand: data.device.brand,
    model: data.device.model,
    serialNumber: data.device.serialNumber || "",
    purchaseDate: data.device.purchaseDate || null,
    customer: customer._id,
    createdBy,
    source,
  });

  // 3. REPAIR
  const repair = await repairsSC.create({
    repairNumber: req.repairNumber,
    customer: customer._id,
    device: device._id,
    status: "Pending",
    createdBy,
    source,
    statusHistory: [
      {
        status: "Pending",
        changedBy: createdBy,
      },
    ],
    problem: data.problem,
    shipping: data.shipping,
    images,
  });

  res.status(201).json({
    success: true,

    data: repair,
  });
});

export const repairTrackController = catchAsync(async (req, res, next) => {
  const { repairNumber } = req.params;
  const result = await repairsSC.findOne({ repairNumber });
  if (!result) {
    return next(
      new AppError("Repairnumber not found", 404, "REPAIR_NUMBER_NOT__FOUND"),
    );
  }
  res.json({
    success: true,
    data: result,
  });
});

const generateRepairNumber = () => {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `REP-${date}-${random}`;
};

// get all
export const index = catchAsync(async (req, res, next) => {
  const repairs = await repairsSC
    .find()
    .populate("customer")
    .populate("device")
    .populate("assignedTo")
    .populate("createdBy", "firstName lastName email role position")
    .sort({
      createdAt: -1,
    })
    .lean();

  if (repairs.length === 0) {
    return next(new AppError("Repairs not found", 404, "REPAIRS_NOT_FOUND"));
  }

  res.json({
    success: true,
    repairs,
  });
});

// details
export const details = catchAsync(async (req, res, next) => {
  const repair = await repairsSC
    .findById(req.params.id)
    .populate("customer")
    .populate("device")
    .populate("assignedTo")
    .populate("statusHistory.changedBy")
    .populate("workLogs.createdBy")
    .lean();

  if (!repair) {
    return next(new AppError("Repair not found", 404, "REPAIR_NOT_FOUND"));
  }

  res.json({
    success: true,
    repair,
  });
});

// edit
export const edit = catchAsync(async (req, res, next) => {
  const repair = await repairsSC
    .findById(req.params.id)
    .populate("customer")
    .populate("device")
    .lean();

  if (!repair) {
    return next(new AppError("Repair not found", 404, "REPAIR_NOT_FOUND"));
  }

  res.json({
    success: true,
    repair,
  });
});

// update
export const update = catchAsync(async (req, res, next) => {
  console.log("UPDATE BODY:", req.body);

  const repair = await repairsSC.findByIdAndUpdate(
    req.params.id,

    {
      $set: req.body,
    },

    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  if (!repair) {
    return next(new AppError("Repair not found", 404, "REPAIR_NOT_FOUND"));
  }

  res.json({
    success: true,
    data: repair,
  });
});

// delete
export const remove = catchAsync(async (req, res, next) => {
  const repair = await repairsSC.findByIdAndDelete(req.params.id);

  if (!repair) {
    return next(new AppError("Repair not found", 404, "REPAIR_NOT_FOUND"));
  }

  res.json({
    success: true,
    message: "Repair deleted successfully",
  });
});

//update status
export const updateStatus = catchAsync(async (req, res, next) => {
  const { status, note } = req.body;
  console.log(req.body.status);
  const repair = await repairsSC.findById(req.params.id);
  console.log(repair.status);

  if (!repair) {
    return next(new AppError("Repair not found", 404, "REPAIR_NOT_FOUND"));
  }

  const allowedTransitions = {
    Pending: ["Received"],
    Received: ["Diagnosing"],
    Diagnosing: ["WaitingApproval", "Repairing"],
    WaitingApproval: ["Repairing", "Cancelled"],
    Repairing: ["Testing"],
    Testing: ["Ready"],
    Ready: ["Delivered"],
    Delivered: [],
    Cancelled: [],
  };

  if (!allowedTransitions[repair.status]?.includes(status)) {
    return next(
      new AppError(
        `Cannot change status from ${repair.status} to ${status}`,
        400,
        "INVALID_STATUS_TRANSITION",
      ),
    );
  }

  repair.status = status;

  repair.statusHistory.push({
    status,

    note,

    changedBy: req.user._id,
  });

  await repair.save();

  res.json({
    success: true,

    repair,
  });
});

//assign repair
export const assignRepair = catchAsync(async (req, res, next) => {
  const { assignedTo } = req.body;

  const repair = await repairsSC.findById(req.params.id);

  if (!repair) {
    return next(new AppError("Repair not found", 404, "REPAIR_NOT_FOUND"));
  }

  repair.assignedTo = assignedTo;

  await repair.save();

  res.json({
    success: true,
    repair,
  });
});

//add worklog
export const addWorkLog = catchAsync(async (req, res, next) => {
  const { message } = req.body;

  const repair = await repairsSC.findById(req.params.id);

  if (!repair) {
    return next(new AppError("Repair not found", 404, "REPAIR_NOT_FOUND"));
  }

  repair.workLogs.push({
    message,
    createdBy: req.user._id,
  });

  await repair.save();

  res.json({
    success: true,

    repair,
  });
});

//reapoen
export const reopenRepair = catchAsync(async (req, res, next) => {
  const repair = await repairsSC.findById(req.params.id);

  if (!repair) {
    return next(new AppError("Repair not found", 404, "REPAIR_NOT_FOUND"));
  }

  if (repair.status !== "Delivered") {
    return next(
      new AppError(
        "Only delivered repairs can be reopened",
        400,
        "INVALID_STATUS",
      ),
    );
  }

  repair.status = "Received";

  repair.statusHistory.push({
    status: "Received",
    note: "Repair reopened by admin",
    changedBy: req.user._id,
  });

  await repair.save();

  res.json({
    success: true,
    repair,
  });
});

export const repairs = catchAsync(async (req, res, next) => {
  const filter = {};

  if (req.query.status) {
    filter.status = req.query.status;
  }

  const repairs = await repairsSC
    .find(filter)
    .populate("customer")
    .populate("device")
    .populate("assignedTo")
    .lean();
});
