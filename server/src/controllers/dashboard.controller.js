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
      "position": "technician",
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
  const data = await customersSC

    .find()

    .sort({
      createdAt: -1,
    })

    .lean();

  res.json({
    success: true,
    data,
  });
});

export const details = catchAsync(async (req, res, next) => {
  const data = await repairsSC
    .findById(req.params.id)
    .populate("customer")
    .populate("device")
    .populate("assignedTo")
    .populate("statusHistory.changedBy")
    .populate("workLogs.createdBy")
    .lean();

  res.json({
    success: true,
    data,
  });
});
