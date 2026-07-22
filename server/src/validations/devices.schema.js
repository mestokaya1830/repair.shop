import {z} from 'zod'

//device
export const devicesSchema = z.object({
  type: z.string().min(2, "Device type is required"),
  brand: z.string().min(2, "Brand is required"),
  model: z.string().min(2, "Model is required"),
  serialNumber: z.string().optional().or(z.literal("")),
  purchaseDate: z.string().optional().or(z.literal("")),
  warrantyUntil: z.string().optional().or(z.literal("")),
  accessories: z.array(z.string()).optional(),
  notes: z.string().optional().or(z.literal("")),
});

//update device
export const deviceUpdateSchema = devicesSchema.partial();
