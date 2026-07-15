import { z } from "zod";

export const repairSchema = z.object({
  customer: z.string().min(1, "Customer is required"),
  device: z.string().min(1, "Device is required"),
  problem: z.object({
    category: z.string().min(1, "Problem category is required"),
    description: z.string().min(10, "Please describe the problem"),
    startedAt: z.string().optional().or(z.literal("")),
    deviceWorking: z.string().optional().or(z.literal("")),
    notes: z.string().optional().or(z.literal("")),
  }),

  shipping: z
    .object({
      street: z.string().optional().or(z.literal("")),
      postalCode: z.string().optional().or(z.literal("")),
      city: z.string().optional().or(z.literal("")),
      country: z.string().optional().or(z.literal("")),
      contactMethod: z
        .enum(["phone", "email", "whatsapp"])
        .optional()
        .or(z.literal("")),
    })
    .optional(),
});

export const repairUpdateSchema = repairSchema.partial();
