import mongoose from "mongoose";

const repairsSC = new mongoose.Schema(
  {
    repairNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customers",
      required: true,
    },

    device: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "devices",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Received",
        "Diagnosing",
        "WaitingApproval",
        "Repairing",
        "Testing",
        "Ready",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
      index: true,
    },

    statusHistory: [
      {
        status: {
          type: String,
          required: true,
        },

        note: String,

        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "users",
    },

    problem: {
      category: {
        type: String,
        required: true,
      },

      description: {
        type: String,
        required: true,
      },

      startedAt: Date,

      deviceWorking: String,

      notes: String,
    },

    estimatedCompletionDate: Date,

    diagnosis: String,

    solution: String,

    shipping: {
      street: String,

      postalCode: String,

      city: String,

      country: String,

      contactMethod: {
        type: String,
        enum: ["phone", "email", "whatsapp"],
      },
    },

    images: [
      {
        filename: {
          type: String,
          required: true,
        },

        path: {
          type: String,
          required: true,
        },

        uploadedByType: {
          type: String,
          enum: ["customer", "employee"],
          required: true,
        },

        category: {
          type: String,
          enum: ["incoming", "damage", "repair", "delivery"],
        },

        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    workflow: {
      received: {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        date: Date,
      },

      diagnosis: {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        date: Date,
      },

      repair: {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        date: Date,
      },

      delivery: {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        date: Date,
      },
    },

    workLogs: [
      {
        message: {
          type: String,
          required: true,
        },

        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },

  {
    timestamps: true,
  },
);

export default mongoose.model("repairs", repairsSC);
