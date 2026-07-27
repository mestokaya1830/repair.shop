import mongoose from "mongoose";

const communicationsSC = new mongoose.Schema(
  {
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

    device: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "devices",
    },

    type: {
      type: String,
      enum: ["phone", "email", "whatsapp", "note"],
      required: true,
    },

    contactPerson: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
    },

    message: {
      type: String,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model("communications", communicationsSC);
