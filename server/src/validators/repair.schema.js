import { z } from "zod";

export const repairSchema = z.object({
  customer: z.object({
    firstName: z.string().trim().min(2, "First name is required"),

    lastName: z.string().trim().min(2, "Last name is required"),

    email: z.string().trim().email("Invalid email"),

    phone: z.string().trim().min(6, "Phone is required"),

    company: z.string().trim().optional(),
  }),

  device: z.object({
    type: z.string().trim().min(1, "Device type required"),

    brand: z.string().trim().min(2, "Brand required"),

    model: z.string().trim().min(2, "Model required"),

    serialNumber: z.string().trim().optional(),

    purchaseDate: z.string().optional(),
  }),

  problem: z.object({
    category: z.string().trim().min(1, "Problem category required"),

    description: z.string().trim().min(10, "Description too short"),

    startedAt: z.string().trim().optional(),

    deviceWorking: z.string().min(1, "Device status required"),

    notes: z.string().trim().optional(),
  }),

  shipping: z.object({
    street: z.string().trim().min(3, "Street required"),

    postalCode: z.string().trim().min(4, "Postal code required"),

    city: z.string().trim().min(2, "City required"),

    country: z.string().trim().min(2, "Country required"),

    contactMethod: z.string().min(1, "Contact method required"),
  }),
});
