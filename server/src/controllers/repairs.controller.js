import catchAsync from "../middleware/catch.async.js";
import repairSC from "../models/repairs.sc.js";
import logger from "../utils/logger.js";
import AppError from "../utils/app.error.js";

export const repairsController = catchAsync(async (req, res) => {
  const images =
    req.files?.map((file) => ({
      filename: file.filename,
      path: file.path,
      category: "incoming",
      uploadedByType: "customer",
    })) || [];

  // 1. Customer

  let customer = await customerSC.findOne({
    email: req.body.customer.email,
  });

  if (!customer) {
    customer = await customerSC.create({
      ...req.body.customer,
    });
  }

  // 2. Device

  const device = await deviceSC.create({
    ...req.body.device,

    customer: customer._id,
  });

  // 3. Repair

  const repair = await repairSC.create({
    repairNumber: req.repairNumber,
    customer: customer._id,
    device: device._id,
    status: "Pending",
    statusHistory: [
      {
        status: "Pending",
      },
    ],
    problem: req.body.problem,
    shipping: req.body.shipping,
    images,
  });

  res.status(201).json({
    success: true,
    data: repair,
  });
});

export const repairTrackController = catchAsync(async (req, res, next) => {
  const { repairNumber } = req.params;
  const result = await repairSC.findOne({ repairNumber });
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

// GET ALL
export const index = catchAsync(async (req, res, next) => {
  const repairs = await repairsSC
    .find()
    .populate("customer")
    .populate("device")
    .populate("assignedTo")
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

// GET DETAIL
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

// EDIT PAGE
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

// CREATE
export const create = catchAsync(async (req, res, next) => {
  const repair = await repairsSC.create({
    ...req.body,
    repairNumber: generateRepairNumber(),
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    data: repair,
  });
});

// UPDATE
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

// DELETE
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
