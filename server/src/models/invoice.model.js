import mongoose from "mongoose";

// --------------------------------------------------
// PART INFO
// --------------------------------------------------

const partInfoSchema = new mongoose.Schema(
  {
    partNumber: {
      type: String,
      default: "",
    },

    name: {
      type: String,
      default: "",
    },

    brand: {
      type: String,
      default: "",
    },

    model: {
      type: String,
      default: "",
    },

    unit: {
      type: String,
      default: "pcs",
    },

    costPrice: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

// --------------------------------------------------
// INVOICE WORK ITEM
// --------------------------------------------------

const workItemSchema = new mongoose.Schema(
  {
    repairWorkItemId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
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
      required: true,
      default: 1,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    vat: {
      type: Number,
      default: 0,
      min: 0,
    },

    total: {
      type: Number,
      default: 0,
      min: 0,
    },

    partInfo: partInfoSchema,
  },
  { _id: true },
);

// --------------------------------------------------
// INVOICE
// --------------------------------------------------

const invoiceModel = new mongoose.Schema(
  {
    // --------------------------------------------------
    // RELATIONS
    // --------------------------------------------------

    repair: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "repairs",
      required: true,
      index: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customers",
      required: true,
      index: true,
    },

    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tenants",
      required: true,
      index: true,
    },

    // --------------------------------------------------
    // PAYMENT STATUS
    // --------------------------------------------------

    status: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
      index: true,
    },

    // --------------------------------------------------
    // DATES
    // --------------------------------------------------

    serviceDate: {
      type: Date,
      default: null,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    paymentTerms: {
      type: Number,
      default: 14,
    },

    // --------------------------------------------------
    // VAT / CURRENCY
    // --------------------------------------------------

    vatType: {
      type: String,
      enum: [
        "standard",
        "reverse_charge",
        "small_business",
      ],
      default: "standard",
    },

    currency: {
      type: String,
      default: "EUR",
    },

    // --------------------------------------------------
    // INVOICE ITEMS
    // --------------------------------------------------

    workItems: [workItemSchema],

    // --------------------------------------------------
    // TOTALS
    // --------------------------------------------------

    totals: {
      net: {
        type: Number,
        default: 0,
      },

      vat: {
        type: Number,
        default: 0,
      },

      total: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("invoices", invoiceModel);