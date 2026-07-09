import mongoose from "mongoose";

const repairSC = new mongoose.Schema({
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
        "Repairing",
        "Ready",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
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
      },
      model: {
        type: String,
        required: true,
      },
      serialNumber: {
        type: String,
      },
      purchaseDate: {
        type: String,
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
        type: String,
      },
      deviceWorking: {
        type: String,
        required: true,
      },
      notes: {
        type: String,
      },
    },


    shipping: {
      street: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      contactMethod: {
        type: String,
        required: true,
      },

    },

  },

  {
    timestamps: true,
  }

);


export default mongoose.model('repairs', repairSC);