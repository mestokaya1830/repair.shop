import AppError from "../utils/app.error.js";
import catchAsync from "../middleware/catch.async.js";
import repairsSC from "../models/repairs.sc.js";
import customersSC from "../models/customers.sc.js";
import devicesSC from "../models/devices.sc.js";

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
    repairsSC.countDocuments(baseFilter),

    repairsSC.countDocuments({ ...baseFilter, status: "Pending" }),
    repairsSC.countDocuments({ ...baseFilter, status: "Received" }),
    repairsSC.countDocuments({ ...baseFilter, status: "Diagnosing" }),
    repairsSC.countDocuments({ ...baseFilter, status: "WaitingApproval" }),
    repairsSC.countDocuments({ ...baseFilter, status: "Repairing" }),
    repairsSC.countDocuments({ ...baseFilter, status: "Testing" }),
    repairsSC.countDocuments({ ...baseFilter, status: "Ready" }),
    repairsSC.countDocuments({ ...baseFilter, status: "Delivered" }),
    repairsSC.countDocuments({ ...baseFilter, status: "Cancelled" }),

    // Customers & Devices (Tüm sistemdeki genel sayılar kalır)
    customersSC.countDocuments(),
    devicesSC.countDocuments(),

    // Recent Repairs - Taban filtre uygulanıyor
    repairsSC
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

  const repairs = await repairsSC
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
