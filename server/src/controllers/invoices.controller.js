import AppError from "../utils/app.error.js";
import catchAsync from "../middleware/catch.async.js";
import { invoicesSchema } from '../validations/invoices.schema.js'
import invoicesSC from "../models/invoices.sc.js";

// --------------------------------------------------
// INDEX
// --------------------------------------------------

export const index = catchAsync(async (req, res) => {
  const invoices = await invoicesSC
    .find()
    // .populate("customer")
    // .populate("repair")
    .sort({
      createdAt: -1,
    })
    .lean();

  res.json({
    success: true,
    data: invoices,
  });
});

// --------------------------------------------------
// CREATE
// --------------------------------------------------


export const create = catchAsync(async (req, res, next) => {
  const repairId = req.body.repairId || req.body.repair;

  console.log(req.body)
  // 1. Aynı tamir (repair) için daha önceden fatura kesilmiş mi kontrolü
  if (repairId) {
    const exists = await invoicesSC.findOne({ repair: repairId });

    if (exists) {
      return next(
        new AppError(
          "Invoice already exists for this repair.",
          400,
          "INVOICE_ALREADY_EXISTS"
        )
      );
    }
  }

  const invoiceDate = req.body.date ? new Date(req.body.date) : new Date();
  const dueDate = new Date(invoiceDate);
  dueDate.setDate(dueDate.getDate() + Number(req.body.paymentTerms || 14));

  const invoice = await invoicesSC.create({
    ...req.body,
    repair: repairId,
    createdBy: req.user._id,
    dueDate: dueDate,
    invoiceNumber: "RE-2026-000001", // Şimdilik sabit / Sayaçtan üretilebilir
  });

  // 4. Başarılı Yanıt
  res.status(201).json({
    success: true,
    data: invoice,
  });
});
// --------------------------------------------------
// PAYMENT STATUS
// --------------------------------------------------

export const updatePaymentStatus = catchAsync(async (req, res, next) => {
  const invoice = await invoicesSC.findById(req.params.id);

  if (!invoice) {
    return next(
      new AppError("Invoice not found.", 404, "INVOICE_NOT_FOUND"),
    );
  }

  invoice.paid = req.body.paid;
  invoice.paidAt = req.body.paid ? new Date() : null;

  await invoice.save();

  res.json({
    success: true,
    data: invoice,
  });
});

export const details = catchAsync(async (req, res, next) => {
  const invoice = await invoicesSC
    .findById(req.params.id)
    .lean();

  if (!invoice) {
    return next(
      new AppError(
        "Invoice not found.",
        404,
        "INVOICE_NOT_FOUND",
      ),
    );
  }

  res.json({
    success: true,
    data: invoice,
  });
});