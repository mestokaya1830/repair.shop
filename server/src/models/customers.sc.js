import mongoose from "mongoose";

const customersSC = new mongoose.Schema(
  {
    source: {
      type: String,
      enum: [
        "web",
        "office",
      ],
      required: true,
      index: true,
    },

    active: {
      type: Boolean,
      default: true,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    address: {
      street: String,
      postalCode: String,
      city: String,
      country: String,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


export default mongoose.model("customers", customersSC);

