import catchAsync from "../middleware/catch.async.js";
import customerModel from "../models/customer.model.js";
import repairModel from "../models/repair.model.js";
import deviceModel from "../models/device.model.js";
import communicationsModel from "../models/communication.model.js";
import logger from "../utils/logger.js";
import AppError from "../utils/app.error.js";


// const seedRepairs = async () => {
//   try {
//     const customers = [];
//     const devices = [];
//     const repairs = [];

//     const customerData = [
//       ["Max", "Müller", "max.mueller@example.com", "01761234501", "web"],
//       ["Anna", "Schmidt", "anna.schmidt@example.com", "01761234502", "web"],
//       ["Peter", "Weber", "peter.weber@example.com", "01761234503", "web"],
//       ["Laura", "Fischer", "laura.fischer@example.com", "01761234504", "web"],
//       ["Thomas", "Wagner", "thomas.wagner@example.com", "01761234505", "web"],

//       [
//         "Michael",
//         "Becker",
//         "michael.becker@example.com",
//         "01761234506",
//         "office",
//       ],
//       [
//         "Julia",
//         "Hoffmann",
//         "julia.hoffmann@example.com",
//         "01761234507",
//         "office",
//       ],
//       [
//         "Daniel",
//         "Schäfer",
//         "daniel.schaefer@example.com",
//         "01761234508",
//         "office",
//       ],
//       ["Sarah", "Koch", "sarah.koch@example.com", "01761234509", "office"],
//       [
//         "Andreas",
//         "Bauer",
//         "andreas.bauer@example.com",
//         "01761234510",
//         "office",
//       ],
//       [
//         "Sophie",
//         "Richter",
//         "sophie.richter@example.com",
//         "01761234511",
//         "office",
//       ],
//       ["Markus", "Klein", "markus.klein@example.com", "01761234512", "office"],
//       ["Lisa", "Wolf", "lisa.wolf@example.com", "01761234513", "office"],
//       [
//         "Christian",
//         "Schröder",
//         "christian.schroeder@example.com",
//         "01761234514",
//         "office",
//       ],
//       ["Nina", "Neumann", "nina.neumann@example.com", "01761234515", "office"],
//       [
//         "Stefan",
//         "Schwarz",
//         "stefan.schwarz@example.com",
//         "01761234516",
//         "office",
//       ],
//       [
//         "Maria",
//         "Zimmermann",
//         "maria.zimmermann@example.com",
//         "01761234517",
//         "office",
//       ],
//       ["Frank", "Braun", "frank.braun@example.com", "01761234518", "office"],
//       [
//         "Katharina",
//         "Krüger",
//         "katharina.krueger@example.com",
//         "01761234519",
//         "office",
//       ],
//       [
//         "Martin",
//         "Hartmann",
//         "martin.hartmann@example.com",
//         "01761234520",
//         "office",
//       ],
//     ];

//     const deviceData = [
//       ["Laptop", "Dell", "Latitude 5520", "DL5520-001"],
//       ["Laptop", "Lenovo", "ThinkPad T14", "LN-T14-002"],
//       ["Desktop", "HP", "ProDesk 600 G6", "HP600-003"],
//       ["Laptop", "Apple", "MacBook Pro 14", "MBP14-004"],
//       ["Laptop", "Acer", "Aspire 5", "AC-A5-005"],
//       ["Laptop", "Dell", "Inspiron 15", "DI15-006"],
//       ["Laptop", "Lenovo", "IdeaPad 5", "IP5-007"],
//       ["Desktop", "HP", "EliteDesk 800", "HE800-008"],
//       ["Laptop", "ASUS", "VivoBook 15", "ASV15-009"],
//       ["Laptop", "Acer", "Swift 3", "AS3-010"],
//       ["Laptop", "Dell", "XPS 13", "DX13-011"],
//       ["Laptop", "Lenovo", "ThinkBook 15", "LTB15-012"],
//       ["Desktop", "Dell", "OptiPlex 7090", "DO7090-013"],
//       ["Laptop", "HP", "Pavilion 15", "HPP15-014"],
//       ["Laptop", "Apple", "MacBook Air M2", "MBA2-015"],
//       ["Laptop", "ASUS", "ZenBook 14", "AZ14-016"],
//       ["Desktop", "HP", "ProDesk 400", "HP400-017"],
//       ["Laptop", "Lenovo", "Yoga Slim 7", "LYS7-018"],
//       ["Laptop", "Dell", "Latitude 7420", "DL7420-019"],
//       ["Laptop", "Acer", "TravelMate P2", "ATP2-020"],
//     ];

//     const statuses = [
//       "Pending",
//       "Received",
//       "Diagnosing",
//       "WaitingApproval",
//       "Repairing",
//       "Testing",
//       "Ready",
//       "Delivered",
//       "Cancelled",
//       "Pending",
//       "Received",
//       "Diagnosing",
//       "Repairing",
//       "Testing",
//       "Ready",
//       "Delivered",
//       "Pending",
//       "Repairing",
//       "WaitingApproval",
//       "Received",
//     ];

//     for (let i = 0; i < 20; i++) {
//       // --------------------------------------------------
//       // CUSTOMER
//       // --------------------------------------------------

//       const [firstName, lastName, email, phone, source] = customerData[i];

//       const customer = await customerModel.create({
//         firstName,
//         lastName,
//         email,
//         phone,
//         source,
//         street: `Teststraße ${i + 1}`,
//         postalCode: `6031${i}`,
//         city: "Frankfurt",
//         country: "Germany",
//       });

//       customers.push(customer);

//       // --------------------------------------------------
//       // DEVICE
//       // --------------------------------------------------

//       const [type, brand, model, serialNumber] = deviceData[i];

//       const device = await deviceModel.create({
//         customer: customer._id,
//         type,
//         brand,
//         model,
//         serialNumber,
//         purchaseDate: new Date(2023, i % 12, 10),
//         accessories: ["Power Adapter"],
//       });

//       devices.push(device);

//       // --------------------------------------------------
//       // REPAIR
//       // --------------------------------------------------

//       const status = statuses[i];

//       const repair = await repairModel.create({
//         isActive: true,

//         repairNumber: `RE-2026-${String(i + 1).padStart(4, "0")}`,

//         source,

//         customer: customer._id,

//         device: device._id,

//         status,

//         assignedTo: null,

//         problem: {
//           category: i % 2 === 0 ? "Hardware" : "Software",

//           description:
//             i % 2 === 0
//               ? "Device does not start correctly."
//               : "Operating system has stability problems.",

//           deviceWorking: i % 2 === 0 ? "No" : "Yes",

//           notes: "Test repair created by seed.",
//         },

//         reception: {
//           method: source === "web" ? "courier" : "walk-in",

//           location: "Frankfurt",

//           receivedAt: new Date(),
//         },

//         approval: {
//           status:
//             status === "WaitingApproval"
//               ? "pending"
//               : status === "Cancelled"
//                 ? "rejected"
//                 : "approved",

//           approvedAt: status === "WaitingApproval" ? undefined : new Date(),
//         },

//         // --------------------------------------------------
//         // WORK ITEMS
//         // --------------------------------------------------

//         workItems: [
//           {
//             type: "service",
//             title: "Diagnostic",
//             description: "Hardware and software diagnostic",
//             quantity: 1,
//           },

//           ...(i % 3 === 0
//             ? [
//                 {
//                   type: "service",
//                   title: "Repair Service",
//                   description: "Device repair and testing",
//                   quantity: 1,
//                 },
//               ]
//             : []),

//           ...(i % 2 === 0
//             ? [
//                 {
//                   type: "part",
//                   title: "SSD 1TB",
//                   description: "Replacement SSD",
//                   quantity: 1,

//                   partInfo: {
//                     name: "SSD 1TB",
//                     brand: "Samsung",
//                     model: "870 EVO",
//                     partNumber: "MZ-77E1T0",
//                   },
//                 },
//               ]
//             : []),
//         ],

//         statusHistory: [
//           {
//             status: "Pending",
//             createdAt: new Date(),
//           },
//         ],
//       });

//       repairs.push(repair);
//     }

//     console.log("Customers created:", customers.length);
//     console.log("Devices created:", devices.length);
//     console.log("Repairs created:", repairs.length);

//     console.log("Repair seed completed successfully.");
//   } catch (error) {
//     console.error("Seed error:", error);
//   }
// };

// seedRepairs();

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

  let customer = await customerModel.findOne({
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
  const device = await deviceSC.create({
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
  const repair = await repairModel.create({
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
  const { search, status, source, createdBy, fromDate, toDate, technician } =
    req.query;

  const filter = {};
  if (status) {
    filter.status = status;
  }

  if (source) {
    filter.source = source;
  }

  if (technician) {
    const technicianValue = technician === "null" ? null : technician;
    filter.assignedTo = technicianValue;
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

  const repairs = await repairModel
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
  const repair = await repairModel
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
  const repair = await repairModel
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

  const repair = await repairModel.findByIdAndUpdate(
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
  const repair = await repairModel.findById(req.params.id);

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

  const repair = await repairModel.findById(req.params.id);

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

  const repair = await repairModel.findById(req.params.id);

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
  const repair = await repairModel.findById(req.params.id);

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
  const repair = await repairModel.findByIdAndUpdate(
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
  const repair = await repairModel.findById(req.params.id);

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
