import { z } from "zod";

export const devicesSchema = z.object({
  customer: z.string().min(1, "Customer is required"),
  type: z.string().min(2, "Device type is required"),
  brand: z.string().min(2, "Brand is required"),
  model: z.string().min(2, "Model is required"),
  serialNumber: z.string().optional(),
  purchaseDate: z.string().optional(),
  warrantyUntil: z.string().optional(),
  accessories: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

// update device
export const devicesUpdateSchema = z.object({
  customer: z.string().optional(),
  type: z
    .string()
    .min(2, "Device type must be at least 2 characters")
    .optional(),
  brand: z.string().min(2, "Brand must be at least 2 characters").optional(),
  model: z.string().min(2, "Model must be at least 2 characters").optional(),
  serialNumber: z.string().optional(),
  purchaseDate: z.string().optional(),
  warrantyUntil: z.string().optional(),
  accessories: z.array(z.string()).optional(),
  notes: z.string().optional(),
});
