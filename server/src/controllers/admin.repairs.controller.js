import catchAsync from "../middleware/catch.async.js";
import customersModel from "../models/customers.model.js";
import repairsModel from "../models/repairs.model.js";
import devicesSC from "../models/devices.model.js";
import communicationsModel from "../models/communications.model.js";
import logger from "../utils/logger.js";
import AppError from "../utils/app.error.js";

export const create = catchAsync(async (req, res, next) => {
  const data = req.body;

  const source = "office";
  const createdBy = req.user._id;
  const status = "Pending";

  const images =
    req.files?.map((file) => ({
      filename: file.filename,
      path: `repairs/${req.repairNumber}/${file.filename}`,
      category: "incoming",
      uploadedByType: "user",
      uploadedBy: createdBy,
    })) || [];

  // 1. CUSTOMER

  let customer = await customersModel.findOne({
    email: data.customer.email,
  });

  if (!customer) {
    customer = await customersModel.create({
      firstName: data.customer.firstName,
      lastName: data.customer.lastName,
      phone: data.customer.phone,
      company: data.customer.company || "",
      email: data.customer.email,
      createdBy,
      source,
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
  const repair = await repairsModel.create({
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

//get all
export const index = catchAsync(async (req, res, next) => {
  const { search, status, source, createdBy, fromDate, toDate } = req.query;

  const filter = {};
  if (status) {
    filter.status = status;
  }

  if (source) {
    filter.source = source;
  }

  if (createdBy) {
    filter.createdBy = createdBy;
  }

  if (fromDate || toDate) {
    filter.createdAt = {};

    if (fromDate) {
      filter.createdAt.$gte = new Date(fromDate);
    }

    if (toDate) {
      const endDate = new Date(toDate);

      endDate.setHours(23, 59, 59, 999);

      filter.createdAt.$lte = endDate;
    }
  }

  const repairs = await repairsModel
    .find({
      isActive: true,
      ...filter,
    })
    .populate("customer")
    .populate("device")
    .populate("assignedTo")
    .populate("createdBy", "firstName lastName email role position")
    .sort({
      createdAt: -1,
    })
    .lean();
  res.json({
    success: true,
    repairs,
  });
});

// details
export const details = catchAsync(async (req, res, next) => {
  const repair = await repairsModel
    .findById(req.params.id)
    .populate("customer")
    .populate("device")
    .populate("assignedTo")
    .populate("statusHistory.changedBy")
    .populate("workItems.createdBy")
    .populate("createdBy", "firstName lastName email role position")

    .lean();

  if (!repair) {
    return next(new AppError("Repair not found", 404, "REPAIR_NOT_FOUND"));
  }

  res.json({
    success: true,

    data: repair,
  });
});
// edit
export const edit = catchAsync(async (req, res, next) => {
  const repair = await repairsModel
    .findById(req.params.id)
    .populate("customer")
    .populate("device")
    .populate("assignedTo", "firstName lastName email")
    .populate("createdBy", "firstName lastName email")
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
  const updateData = {
    status: req.body.status,
    assignedTo: req.body.assignedTo,
    estimatedCompletionDate: req.body.estimatedCompletionDate,
    problem: req.body.problem,
    diagnosis: req.body.diagnosis,
    solution: req.body.solution,
    approval: req.body.approval,
    reception: req.body.reception,
  };

  const repair = await repairsModel.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
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

//update status
export const updateStatus = catchAsync(async (req, res, next) => {
  const { status, note } = req.body;
  const repair = await repairsModel.findById(req.params.id);

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

  const repair = await repairsModel.findById(req.params.id);

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

  const repair = await repairsModel.findById(req.params.id);

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
  const repair = await repairsModel.findById(req.params.id);

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

//delete
export const deleteRepair = catchAsync(async (req, res, next) => {
  const repair = await repairsModel.findByIdAndUpdate(
    req.params.id,
    {
      isActive: false,
      deletedAt: new Date(),
      deletedBy: req.user._id,
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
    message: "Repair deleted successfully",
  });
});


export const addWorkItem = catchAsync(async (req, res, next) => {
  const repair = await repairsModel.findById(req.params.id);

  if (!repair) {
    return next(new AppError("Repair not found", 404, "REPAIR_NOT_FOUND"));
  }

  repair.workItems.push({
    ...req.body,

    createdBy: req.user._id,

    createdAt: new Date(),
  });

  await repair.save();

  res.json({
    success: true,

    data: repair.workItems,
  });
});

//create communications
export const createCommunication = catchAsync(async (req, res, next) => {
  const communication = await communicationsModel.create({
    repairId: req.body.repairId,

    customerId: req.body.customerId,

    deviceId: req.body.deviceId,

    type: req.body.type,

    contactPerson: req.body.contactPerson,

    subject: req.body.subject,

    message: req.body.message,

    createdBy: req.user?._id,
  });

  res.status(201).json({
    success: true,
    data: communication,
  });
});

// GET communications
export const getCommunications = catchAsync(async (req, res, next) => {
  const communications = await communicationsModel
    .find({
      repairId: req.params.repairId,
    })
    .populate("createdBy", "firstName lastName email role")
    .sort({
      createdAt: -1,
    });

  res.json({
    success: true,
    data: communications,
  });
});
