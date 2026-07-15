import {z} from 'zod'
export const repairSchema = z.object({

  customer: z
    .string()
    .min(1, "Customer is required"),

  device: z
    .string()
    .min(1, "Device is required"),

  problem: z.object({
    category: z.string()
      .min(1, "Category is required"),

    description: z.string()
      .min(10, "Description is required"),

    deviceWorking: z.string()
      .min(1, "Device status is required"),

    notes: z.string()
      .optional()
      .or(z.literal("")),

  }),

});