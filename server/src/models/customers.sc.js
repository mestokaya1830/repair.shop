import mongoose from "mongoose";

const customerSC = new mongoose.Schema(
  {
    profile: {
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
        required: true,
        trim: true,
      },

      email: {
        type: String,
        trim: true,
        lowercase: true,
      },

      address: {
        street: {
          type: String,
          trim: true,
        },

        postalCode: {
          type: String,
          trim: true,
        },

        city: {
          type: String,
          trim: true,
        },

        country: {
          type: String,
          default: "Germany",
        },
      },
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("customers", customerSC);

