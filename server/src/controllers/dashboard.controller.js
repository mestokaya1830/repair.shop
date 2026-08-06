import AppError from "../utils/app.error.js";
import catchAsync from "../middleware/catch.async.js";
import repairsModel from "../models/repairs.model.js";
import customersModel from "../models/customers.model.js";
import devicesSC from "../models/devices.model.js";

// Dashboard
export const index = catchAsync(async (req, res) => {
console.log(req.user.role)
  const baseFilter = {};
  if (req.user && req.user.role === "user") {
    baseFilter.assignedTo = req.user._id;
  }

  // 2. Sorguları çalıştırıyoruz
  const [
    totalRepairs,
    pending,
    received,
    diagnosing,
    waitingApproval,
    repairing,
    testing,
    ready,
    delivered,
    cancelled,

    totalCustomers,
    totalDevices,

    recentRepairs,
  ] = await Promise.all([
    // Repairs - Taban filtre uygulanıyor
    repairsModel.countDocuments(baseFilter),

    repairsModel.countDocuments({ ...baseFilter, status: "Pending" }),
    repairsModel.countDocuments({ ...baseFilter, status: "Received" }),
    repairsModel.countDocuments({ ...baseFilter, status: "Diagnosing" }),
    repairsModel.countDocuments({ ...baseFilter, status: "WaitingApproval" }),
    repairsModel.countDocuments({ ...baseFilter, status: "Repairing" }),
    repairsModel.countDocuments({ ...baseFilter, status: "Testing" }),
    repairsModel.countDocuments({ ...baseFilter, status: "Ready" }),
    repairsModel.countDocuments({ ...baseFilter, status: "Delivered" }),
    repairsModel.countDocuments({ ...baseFilter, status: "Cancelled" }),

    // Customers & Devices (Tüm sistemdeki genel sayılar kalır)
    customersModel.countDocuments(),
    devicesSC.countDocuments(),

    // Recent Repairs - Taban filtre uygulanıyor
    repairsModel
      .find(baseFilter)
      .populate("customer", "firstName lastName")
      .populate("assignedTo", "firstName lastName") // İsteğe bağlı: Atanan kişiyi de doldurabilirsin
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
  ]);

  res.json({
    success: true,
    data: {
      repairs: {
        total: totalRepairs,
        pending,
        received,
        diagnosing,
        waitingApproval,
        repairing,
        testing,
        ready,
        delivered,
        cancelled,
      },

      customers: {
        total: totalCustomers,
      },

      devices: {
        total: totalDevices,
      },

      recentRepairs,
    },
  });
});


export const details = catchAsync(async (req, res, next) => {
  const { status } = req.query;
  const filter = {};
  if (status) {
    filter.status = status;
  }

  const repairs = await repairsModel
    .find(filter)
    .populate("customer", "firstName lastName email phone")
    .populate("device", "brand model serialNumber")
    .sort({ createdAt: -1 })
    .lean();

  res.json({
    success: true,
    results: repairs.length,
    data: { repairs },
  });
});
