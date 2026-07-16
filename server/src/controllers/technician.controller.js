import catchAsync from "../middleware/catch.async.js";
import AppError from "../utils/app.error.js";
import repairsSC from "../models/repairs.sc.js";

export const index = catchAsync(async (req, res, next) => {
  const repairs = await repairsSC
    .find({
      assignedTo: req.user._id,
    })
    .populate("customer")
    .populate("device")
    .sort({
      createdAt: -1,
    })
    .lean();

  if (!repairs) {
    return next(new AppError("Repairs not found", 404, "REPAIRS_NOT_FOUND"));
  }

  const stats = {
    total: repairs.length,
    pending: repairs.filter((repair) => repair.status === "Pending").length,
    repairing: repairs.filter((repair) => repair.status === "Repairing").length,
    completed: repairs.filter((repair) => repair.status === "Delivered").length,
  };

  res.json({
    success: true,
    stats,
    repairs,
  });
});

export const repairs = catchAsync(async (req, res, next) => {
  const repairs = await repairsSC
    .find({
      assignedTo: req.user._id,
    })
    .populate("customer")
    .populate("device")
    .sort({
      createdAt: -1,
    })
    .lean();

  res.json({
    success: true,
    repairs,
  });
});

export const details = catchAsync(async (req, res, next) => {
  console.log("test");
  const repair = await repairsSC
    .findOne({
      _id: req.params.id,
      assignedTo: req.user._id,
    })
    .populate("customer")
    .populate("device")
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

export const updateStatus = catchAsync(async (req, res, next) => {
  const { status, note } = req.body;

  const repair = await repairsSC.findOne({
    _id: req.params.id,
    assignedTo: req.user._id,
  });

  if (!repair) {
    return next(new AppError("Repair not found", 404, "REPAIR_NOT_FOUND"));
  }

  const allowedTransitions = {
    Received: ["Diagnosing"],
    Diagnosing: ["Repairing", "WaitingApproval"],
    Repairing: ["Testing"],
    Testing: ["Ready"],
    Ready: ["Delivered"],
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

export const addWorkLog = catchAsync(async (req, res, next) => {
  const { message } = req.body;

  const repair = await repairsSC.findOne({
    _id: req.params.id,
    assignedTo: req.user._id,
  });

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
    repair
  });
});
