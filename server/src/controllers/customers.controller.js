import AppError from "../utils/app.error.js";
import catchAsync from "../middleware/catch.async.js";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import bcrypt from "bcryptjs";
import customerSC from "../models/customers.sc.js";

export const index = catchAsync(async (req, res, next) => {
  const customers = await customerSC.find().lean();
  if (customers.length === 0) {
    return next(
      new AppError("Customers not found", 404, "CUSTOMERS_NOT_FOUND"),
    );
  }
  res.json({
    success: true,
    customers,
  });
});

export const details = catchAsync(async (req, res, next) => {
  const customer = await customerSC.findById(req.params.id);
  if (!customer) {
    return next(new AppError("Customer not found", 404, "CUSTOMER_NOT_FOUND"));
  }
  res.json({
    success: true,
    customer,
  });
});

export const edit = catchAsync(async (req, res, next) => {
  const customer = await customerSC.findById(req.params.id);
  if (!customer) {
    return next(new AppError("Customer not found", 404, "CUSTOMER_NOT_FOUND"));
  }
  res.json({
    success: true,
    customer,
  });
});

export const update = catchAsync(async (req, res, next) => {
  const customer = await customerSC.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  if (!customer) {
    return next(new AppError("Customer not found", 404, "CUSTOMER_NOT_FOUND"));
  }

  res.json({
    success: true,
    data: customer,
  });
});

export const create = catchAsync(async (req, res, next) => {
  console.log(req.user);
  const customer = await customerSC.create({
    ...req.body,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    data: customer,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const customer = await customerSC.findByIdAndDelete(req.params.id);

  if (!customer) {
    return next(new AppError("Customer not found", 404, "CUSTOMER_NOT_FOUND"));
  }

  res.json({
    success: true,
    message: "Customer deleted successfully",
  });
});
