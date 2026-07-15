import mongoose from 'mongoose'

const userSC = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["owner", "admin", "user"],
      required: true,
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
      },

      address: {
        street: String,
        city: String,
        postalCode: String,
        country: String,
      },
      position: String,
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


export default mongoose.model('users', userSC)