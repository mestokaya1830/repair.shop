import catchAsync from "../middleware/catch.async.js";
import repairSC from "../models/repairs.sc.js";
import logger from "../utils/logger.js";
import AppError from "../utils/app.error.js";

export const repairController = catchAsync(async (req, res) => {
  const images =
    req.files?.map((file) => ({
      filename: file.filename,
      path: file.path,
      category: "incoming",
      uploadedByType: "customer",
    })) || [];

  const result = await repairSC.create({
    repairNumber: req.repairNumber,
    status: "Pending",
    statusHistory: [
      {
        status: "Pending",
      },
    ],
    ...req.body,
    images,
  });

  res.status(201).json({
    success: true,
    data: result,
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
