import { z } from "zod";

export const repairSchema = z.object({
  customer: z.object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters"),

    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters"),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please enter a valid email address"),

    phone: z.string().trim().min(6, "Phone number is required"),

    company: z.string().trim().optional(),
  }),

  device: z.object({
    type: z.string().trim().min(1, "Device type is required"),

    brand: z.string().trim().min(2, "Brand is required"),

    model: z.string().trim().min(2, "Model is required"),

    serialNumber: z.string().trim().optional(),

    purchaseDate: z.string().optional(),
  }),

  problem: z.object({
    category: z.string().trim().min(1, "Problem category is required"),

    description: z
      .string()
      .trim()
      .min(10, "Please describe the problem in more detail"),

    startedAt: z.string().trim().optional(),

    deviceWorking: z.string().min(1, "Please select device status"),

    notes: z.string().trim().optional(),
  }),

  shipping: z.object({
    street: z.string().trim().min(3, "Street address is required"),

    postalCode: z.string().trim().min(4, "Postal code is required"),

    city: z.string().trim().min(2, "City is required"),

    country: z.string().trim().min(2, "Country is required"),

    contactMethod: z.string().min(1, "Please select contact method"),
  }),
});
