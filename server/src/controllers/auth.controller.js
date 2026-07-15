import AppError from "../utils/app.error.js";
import catchAsync from "../middleware/catch.async.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import userSC from "../models/users.sc.js";
import logger from "../utils/logger.js";

export const loginController = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userSC.findOne({ email }).select("+password");
  const isMatch = user && (await bcrypt.compare(password, user.password));
  if (!isMatch) {
    logger.warn({
      event: "LOGIN_FAILED",
      email: req.body.email,
      ip: req.ip,
    });
    return next(
      new AppError(
        "Invalid email or password",
        401,
        "INVALID+EMAIL_OR+PASSOWRD",
      ),
    );
  }
  logger.info({
    event: "LOGIN_SUCCESS",
    userId: user._id,
    role: user.role,
  });
  const token = jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    env.JWT_SECRET,
    {expiresIn: '1h'}
  );
  res.json({
    success: true,
    token,
  });
});

//first userSC
// const createFirstUser = async () => {
//   await userSC.create({
//     email: "mesfor@test.com",
//     password: await bcrypt.hash("12121212", 10),
//     role: "owner",
//     active: true,

//     profile: {
//       firstName: "mesto",
//       lastName: "kaya",
//       phone: "",
//       position: "owner",
//       address: {
//         street: "",
//         city: "",
//         postalCode: "",
//         country: "Germany",
//       },
//     },
//   });
// };

// createFirstUser()
