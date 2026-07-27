import mongoose from "mongoose";

const repairsSC = new mongoose.Schema(
  {
    // -----------------------------------------------------------------
    // BASIC
    // -----------------------------------------------------------------

    isActive: {
      type: Boolean,
      default: true,
    },

    repairNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    source: {
      type: String,
      enum: ["web", "office"],
      required: true,
      index: true,
    },

    // -----------------------------------------------------------------
    // RELATIONS
    // -----------------------------------------------------------------

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

    // -----------------------------------------------------------------
    // REPAIR STATUS
    // -----------------------------------------------------------------

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

    // -----------------------------------------------------------------
    // REPAIR DETAILS
    // -----------------------------------------------------------------

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

    diagnosis: String,

    solution: String,

    estimatedCompletionDate: Date,

    // -----------------------------------------------------------------
    // COMMUNICATIONS
    // Customer conversations
    // Stored in separate communications collection
    // -----------------------------------------------------------------

    communications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "communications",
      },
    ],

    // -----------------------------------------------------------------
    // LOGISTICS
    // -----------------------------------------------------------------

    reception: {
      method: {
        type: String,
        enum: ["courier", "walk-in"],
      },

      location: String,

      receivedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },

      receivedAt: Date,

      courierCompany: String,

      trackingNumber: String,
    },

    approval: {
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },

      approvedAt: Date,

      note: String,
    },

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

    // -----------------------------------------------------------------
    // FILES
    // -----------------------------------------------------------------

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
          enum: ["customer", "user"],
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

    // -----------------------------------------------------------------
    // WORK ITEMS
    // Invoice Positions Source
    // -----------------------------------------------------------------

    workItems: [
      {
        date: {
          type: Date,
          default: Date.now,
        },

        type: {
          type: String,
          enum: ["service", "part"],
          required: true,
        },

        title: {
          type: String,
          required: true,
          trim: true,
        },

        description: {
          type: String,
          default: "",
          trim: true,
        },

        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },

        partInfo: {
          name: String,

          brand: String,

          model: String,

          serialNumber: String,

          partNumber: String,
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

    // -----------------------------------------------------------------
    // SYSTEM
    // -----------------------------------------------------------------

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },

    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },

    deletedAt: Date,
  },

  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model("repairs", repairsSC);
