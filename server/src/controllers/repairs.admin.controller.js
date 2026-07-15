import AppError from "../utils/app.error.js";
import catchAsync from "../middleware/catch.async.js";
import repairsSC from "../models/repairs.sc.js";

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
    .populate("createdBy")
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
