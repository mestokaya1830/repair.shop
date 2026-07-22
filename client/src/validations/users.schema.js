import { z } from "zod";

export const usersSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["owner", "admin", "user"]).optional(),
  position: z
    .enum(["manager", "technician", "reception"])
    .optional()
    .or(z.literal("")),
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .trim(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").trim(),
  phone: z
    .string()
    .min(6, "Phone number is too short")
    .trim()
    .optional()
    .or(z.literal("")),
  street: z.string().trim().optional().or(z.literal("")),
  city: z.string().trim().optional().or(z.literal("")),
  postalCode: z.string().trim().optional().or(z.literal("")),
  country: z.string().trim().optional().or(z.literal("")),
  position: z.string().optional().or(z.literal("")),
  active: z.boolean().default(true),
});

// update user
export const usersUpdateSchema = z.object({
  role: z.enum(["owner", "admin", "user"]).optional(),
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .optional(),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .optional(),
  phone: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  position: z.string().optional(),
  active: z.boolean().optional(),
});
