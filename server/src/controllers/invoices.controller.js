import AppError from "../utils/app.error.js";
import catchAsync from "../middleware/catch.async.js";
import { invoiceSchema } from '../validations/invoice.schema.js'
import invoiceModel from "../models/invoice.model.js";
import repairModel from "../models/repair.model.js";
// --------------------------------------------------
// INDEX
// --------------------------------------------------

export const index = catchAsync(async (req, res) => {
  const invoices = await invoiceModel
    .find()
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
  const tenantId = req.body.tenantId;

  // --------------------------------------------------
  // VALIDATION
  // --------------------------------------------------

  if (!repairId) {
    return next(
      new AppError(
        "Repair is required.",
        400,
        "REPAIR_REQUIRED",
      ),
    );
  }

  if (!tenantId) {
    return next(
      new AppError(
        "Tenant is required.",
        400,
        "TENANT_REQUIRED",
      ),
    );
  }

  // --------------------------------------------------
  // GET REPAIR
  // --------------------------------------------------

  const repair = await repairModel
    .findById(repairId)
    .lean();

  if (!repair) {
    return next(
      new AppError(
        "Repair not found.",
        404,
        "REPAIR_NOT_FOUND",
      ),
    );
  }

  // --------------------------------------------------
  // CHECK EXISTING INVOICE
  // --------------------------------------------------

  const exists = await invoiceModel.findOne({
    repair: repairId,
  });

  if (exists) {
    return next(
      new AppError(
        "Invoice already exists for this repair.",
        400,
        "INVOICE_ALREADY_EXISTS",
      ),
    );
  }

  // --------------------------------------------------
  // INVOICE WORK ITEMS
  // --------------------------------------------------
 // --------------------------------------------------
// INVOICE WORK ITEMS
// --------------------------------------------------

const previewWorkItems = req.body.workItems || [];

const workItems = (repair.workItems || []).map(
  (repairItem) => {
    const invoiceItem = previewWorkItems.find(
      (item) =>
        String(item.workflowItemId) ===
        String(repairItem._id),
    );

    return {
      repairWorkItemId: repairItem._id,

      type: repairItem.type,

      title:
        invoiceItem?.title ||
        repairItem.title,

      description:
        invoiceItem?.description ??
        repairItem.description ??
        "",

      quantity: Number(
        invoiceItem?.quantity ??
          repairItem.quantity ??
          1,
      ),

      price: Number(
        invoiceItem?.price ?? 0,
      ),

      vat: Number(
        invoiceItem?.vat ?? 0,
      ),

      total: Number(
        invoiceItem?.total ?? 0,
      ),

      partInfo:
        invoiceItem?.partInfo ||
        repairItem.partInfo ||
        undefined,
    };
  },
);

  // --------------------------------------------------
  // TOTALS
  // --------------------------------------------------

  const totals = {
    net: Number(
      req.body.totals?.net ?? 0,
    ),

    vat: Number(
      req.body.totals?.vat ?? 0,
    ),

    total: Number(
      req.body.totals?.total ?? 0,
    ),
  };

  // --------------------------------------------------
  // CREATE INVOICE
  // --------------------------------------------------

  const invoice = await invoiceModel.create({
    repair: repair._id,

    customer: repair.customer,

    tenantId,

    status: "unpaid",

    serviceDate:
      req.body.serviceDate || null,

    date: req.body.date
      ? new Date(req.body.date)
      : new Date(),

    paymentTerms: Number(
      req.body.paymentTerms ?? 14,
    ),

    vatType:
      req.body.vatType || "standard",

    currency:
      req.body.currency || "EUR",

    workItems,

    totals,
  });

  // --------------------------------------------------
  // RESPONSE
  // --------------------------------------------------

  res.status(201).json({
    success: true,
    data: invoice,
  });
});
// --------------------------------------------------
// PAYMENT STATUS
// --------------------------------------------------

export const updatePaymentStatus = catchAsync(async (req, res, next) => {
  const invoice = await invoiceModel.findById(req.params.id);

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
  const invoice = await invoiceModel
    .findById(req.params.id)
    .populate("customer")
    .populate("repair")
    .populate("tenantId")
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