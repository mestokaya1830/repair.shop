import { z } from "zod";

export const repairSchema = z.object({
  customer: z.object({
    firstName: z.string().min(2, "First name is required"),

    lastName: z.string().min(2, "Last name is required"),

    email: z.string().email("Invalid email"),

    phone: z.string().min(6, "Phone number is required"),

    company: z.string().optional().or(z.literal("")),
  }),

  device: z.object({
    type: z.string().min(1, "Device type is required"),

    brand: z.string().min(2, "Brand is required"),

    model: z.string().min(2, "Model is required"),

    serialNumber: z.string().optional().or(z.literal("")),

    purchaseDate: z.string().optional().or(z.literal("")),

    images: z.array(z.any()).max(5, "Maximum 5 images allowed").optional(),
  }),

  problem: z.object({
    category: z.string().min(1, "Problem category is required"),

    description: z.string().min(10, "Please describe the problem"),

    startedAt: z.string().optional().or(z.literal("")),

    deviceWorking: z.string().min(1, "Please select device status"),

    notes: z.string().optional().or(z.literal("")),
  }),

  shipping: z.object({
    street: z.string().min(3, "Street is required"),

    postalCode: z.string().min(3, "Postal code is required"),

    city: z.string().min(2, "City is required"),

    country: z.string().min(2, "Country is required"),

    contactMethod: z
      .enum(["phone", "email", "whatsapp"])
      .optional()
      .or(z.literal("")),
  }),
});
