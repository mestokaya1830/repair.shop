import mongoose from "mongoose";

const repairSchema = new mongoose.Schema(
  {
    repairNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
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

        note: {
          type: String,
          trim: true,
        },

        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    estimatedCompletionDate: {
      type: Date,
    },

    customer: {
      firstName: {
        type: String,
        required: true,
        trim: true,
      },

      lastName: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      company: {
        type: String,
        trim: true,
      },
    },

    device: {
      type: {
        type: String,
        required: true,
      },

      brand: {
        type: String,
        required: true,
        trim: true,
      },

      model: {
        type: String,
        required: true,
        trim: true,
      },

      serialNumber: {
        type: String,
        trim: true,
      },

      purchaseDate: {
        type: Date,
      },
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

      startedAt: {
        type: Date,
      },

      deviceWorking: {
        type: String,
      },

      notes: {
        type: String,
      },
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
          ref: "User",
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
          ref: "User",
        },

        date: Date,
      },

      diagnosis: {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        date: Date,
      },

      repair: {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        date: Date,
      },

      delivery: {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
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
          ref: "User",
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },

  {
    timestamps: true,
  },
);

export default mongoose.model("Repair", repairSchema);
