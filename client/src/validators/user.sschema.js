import { z } from "zod";

export const userSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  profile: z.object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .trim(),

    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .trim(),

    phone: z
      .string()
      .min(6, "Phone number is too short")
      .trim()
      .optional()
      .or(z.literal("")),

    position: z.string().trim().optional().or(z.literal("")),

    address: z.object({
      street: z.string().trim().optional().or(z.literal("")),
      city: z.string().trim().optional().or(z.literal("")),
      postalCode: z.string().trim().optional().or(z.literal("")),
      country: z.string().trim().optional().or(z.literal("")),
    }),
  }),

  active: z.boolean().default(true),
});
