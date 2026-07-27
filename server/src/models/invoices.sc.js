import mongoose from "mongoose";

const invoicePositionSC = new mongoose.Schema(
  {
    workflowItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workflow",
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

    price: {
      type: Number,
      required: true,
      default: 0,
    },

    vat: {
      type: Number,
      default: 19,
    },

    netTotal: {
      type: Number,
      default: 0,
    },

    vatTotal: {
      type: Number,
      default: 0,
    },

    grossTotal: {
      type: Number,
      default: 0,
    }
  },
  {
    _id: true,
  },
);

const invoicesSC = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      unique: true,
      required: true,
    },

    repair: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repair",
      required: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    // Rechnungsdatum
    invoiceDate: {
      type: Date,
      default: Date.now,
    },

    // Leistungsdatum
    serviceDate: {
      type: Date,
      required: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    currency: {
      type: String,
      default: "EUR",
    },

    positions: [invoicePositionSC],

    totals: {
      net: {
        type: Number,
        default: 0,
      },

      vat: {
        type: Number,
        default: 0,
      },

      gross: {
        type: Number,
        default: 0,
      },
    },

    payment: {
      status: {
        type: String,
        enum: ["unpaid", "paid", "partial", "cancelled"],
        default: "unpaid",
      },

      paidAt: {
        type: Date,
        default: null,
      },

      method: {
        type: String,
        enum: ["bank", "cash", "card", "other"],
        default: null,
      },
    },

    notes: {
      type: String,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("invoice", invoicesSC);
