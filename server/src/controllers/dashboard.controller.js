import catchAsync from "../middleware/catch.async.js";

import repairsSC from "../models/repairs.sc.js";
import customersSC from "../models/customers.sc.js";
import userSC from "../models/users.sc.js";

// Dashboard main
export const index = catchAsync(async (req, res) => {
  const [
    totalRepairs,
    pending,
    received,
    diagnosing,
    repairing,
    waitingApproval,
    testing,
    ready,
    delivered,
    cancelled,

    customers,
    technicians,
    admins,
    owners,
  ] = await Promise.all([
    repairsSC.countDocuments(),

    repairsSC.countDocuments({
      status: "Pending",
    }),

    repairsSC.countDocuments({
      status: "Received",
    }),

    repairsSC.countDocuments({
      status: "Diagnosing",
    }),

    repairsSC.countDocuments({
      status: "Repairing",
    }),

    repairsSC.countDocuments({
      status: "WaitingApproval",
    }),

    repairsSC.countDocuments({
      status: "Testing",
    }),

    repairsSC.countDocuments({
      status: "Ready",
    }),

    repairsSC.countDocuments({
      status: "Delivered",
    }),

    repairsSC.countDocuments({
      status: "Cancelled",
    }),

    customersSC.countDocuments(),

    userSC.countDocuments({
      "profile.position": "technician",
      active: true,
    }),

    userSC.countDocuments({
      role: "admin",
      active: true,
    }),

    userSC.countDocuments({
      role: "owner",
      active: true,
    }),
  ]);

  const recentActivity = await repairsSC.aggregate([
    {
      $unwind: "$statusHistory",
    },

    {
      $sort: {
        "statusHistory.createdAt": -1,
      },
    },

    {
      $limit: 10,
    },

    {
      $project: {
        repairNumber: 1,
        statusHistory: 1,
      },
    },
  ]);

  res.json({
    success: true,

    stats: {
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

      customers,

      technicians,

      admins,

      owners,
    },

    recentActivity,
  });
});
export const repairs = catchAsync(async (req, res) => {
  const filter = {};

  if (req.query.status) {
    filter.status = req.query.status;
  }
  const repairs = await repairsSC
    .find(filter)
    .populate("customer")
    .populate("device")
    .populate("assignedTo")
    .sort({
      createdAt: -1,
    })
    .lean();

  res.json({
    success: true,
    count: repairs.length,
    repairs,
  });
});

// Dashboard Customers

export const customers = catchAsync(async (req, res) => {
  const customers = await customersSC

    .find()

    .sort({
      createdAt: -1,
    })

    .lean();

  res.json({
    success: true,

    customers,
  });
});

// Dashboard Technicians

export const technicians = catchAsync(async (req, res) => {
  const technicians = await userSC

    .find({
      "profile.position": "technician",

      active: true,
    })

    .select("profile.firstName profile.lastName email")

    .lean();

  res.json({
    success: true,

    technicians,
  });
});

export const details = catchAsync(async (req, res, next) => {
  console.log(req.params)
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
