import { z } from "zod";

const invoiceWorkItemSchema = z.object({
  workflowItemId: z.string(),
  title: z.string().min(2),
  description: z.string().optional().default(""),
  quantity: z.number().min(1).default(1),
  price: z.number().min(0),
  vat: z.number().min(0).max(100).default(19),
  total: z.number().optional(),
});

export const invoicesSchema = z.object({
  repairId: z.string(),
  date: z.string(),
  serviceDate: z.string(),
  currency: z.string(),
  vatType: z
    .enum(["standard", "small_business", "reverse_charge"])
    .default("standard"),

  workItems: z.array(invoiceWorkItemSchema).min(1),
  totals: z.object({
    net: z.number(),
    vat: z.number(),
    total: z.number(),
  }),

  paymentTerms: z.number().optional(),
});
