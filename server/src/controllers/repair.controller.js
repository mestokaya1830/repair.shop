import AppError from '../utils/app.error.js';
import catchAsync from '../middleware/catch.async.js'
import repairSC from "../models/repair.sc.js";
import logger from "../logger/logger.js";
import { generateRepairNumber } from '../utils/request.number.js'


export const repairController = catchAsync(async (req, res) => {
  const result = await repairSC.create({
    repairNumber: generateRepairNumber(),
    ...req.body,
  });
  logger.info(`Repair request created ${result.repairNumber}`);
  res.status(201).json({
    success: true,
    data: result,
  })
})
