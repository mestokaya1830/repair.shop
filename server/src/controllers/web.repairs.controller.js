import catchAsync from "../middleware/catch.async.js";
import customersSC from "../models/customers.sc.js";
import repairsSC from "../models/repairs.sc.js";
import devicesSC from "../models/devices.sc.js";
import logger from "../utils/logger.js";
import AppError from "../utils/app.error.js";


export const create = catchAsync(async (req, res, next) => {
  const data = req.body;
  
  const images =
  req.files?.map((file) => ({
    filename: file.filename,
    path: `repairs/${req.repairNumber}/${file.filename}`,
    category: "incoming",
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
      source: "web"
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
    source: " web"
  });

  // 3. REPAIR
  const repair = await repairsSC.create({
    repairNumber: req.repairNumber,
    customer: customer._id,
    device: device._id,
    status: "Pending",
    source: "web",
    statusHistory: [
      {
        status: "Pending",
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
