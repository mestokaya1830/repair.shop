import { z } from "zod";

export const userSchema = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),

  password: z.string().min(8, "Password must be at least 8 characters"),

  profile: z.object({
    firstName: z.string().min(2, "First name minimum 2 characters").trim(),
    lastName: z.string().min(2, "Last name minimum 2 characters").trim(),
    phone: z.string().optional().or(z.literal("")),
    position: z.string().optional().or(z.literal("")),

    address: z.object({
      street: z.string().optional().or(z.literal("")),
      city: z.string().optional().or(z.literal("")),
      postalCode: z.string().optional().or(z.literal("")),
      country: z.string().optional().or(z.literal("")),
    }),
  }),

  active: z.boolean().optional(),
});
