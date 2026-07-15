import { z } from "zod";

export const deviceCreateSchema = z.object({
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

export const deviceUpdateSchema = deviceCreateSchema.partial();
