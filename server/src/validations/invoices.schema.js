import { z } from "zod";

const invoiceWorkItemSchema = z.object({
  workflowItemId: z.string(),
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  quantity: z.number().min(1).default(1),
  unitPrice: z.number().min(0),
  vat: z.number().min(0).max(100).default(19),
  total: z.number().optional(),
});

export const invoicesSchema = z.object({
  repairId: z.string(),
  invoiceNumber: z.string().optional(),

  customer: z.object({
    customerId: z.string(),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    address: z.string().optional(),
    postalCode: z.string().optional(),
    city: z.string().optional(),
  }),

  repair: z.object({
    repairNumber: z.string(),
    device: z.object({
      brand: z.string(),
      model: z.string(),
      serialNumber: z.string().optional(),
    }),
  }),

  date: z.string(),
  serviceDate: z.string(),

  currency: z.enum(["EUR", "CHF"]),

  vatType: z.enum([
    "standard",
    "small_business",
    "reverse_charge",
  ]),

  workItems: z.array(invoiceWorkItemSchema)
    .min(1, "At least one work item required"),

  totals: z.object({
    net: z.number(),
    vat: z.number(),
    total: z.number(),
  }),

  paymentStatus: z.enum([
    "unpaid",
    "paid",
  ]),

  paymentTerms: z.number().optional(),
});