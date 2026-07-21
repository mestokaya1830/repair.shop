import mongoose from "mongoose";

const userSC = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: [
        "owner",
        "admin",
        "user",
      ],
      required: true,
      index: true,
    },

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

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    street: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
      index: true,
    },

    postalCode: {
      type: String,
      default: "",
    },

    country: {
      type: String,
      default: "Germany",
    },

    position: {
      type: String,
      default: "",
    },

    active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("users", userSC);