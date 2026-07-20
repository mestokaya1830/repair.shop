import mongoose from "mongoose";

const customerSC = new mongoose.Schema(
  {
    source: {
      type: String,
      enum: [
        "web",
        "admin",
      ],
      required: true,
      index: true,
    },
    profile: {
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


export default mongoose.model("customers", customerSC);

