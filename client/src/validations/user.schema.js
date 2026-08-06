import { z } from "zod";

const positionEnum = z.enum([
  "Owner",
  "Manager",
  "Technician",
  "Support",
  "Sales",
  "Accounting",
  "Warehouse",
])
.optional()
.or(z.literal(""))


export const userSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  password: z.string().min(8, "Password must be at least 8 characters"),
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
  position: positionEnum,
  isActive: z.boolean().default(true),
});

// update user
export const userUpdateSchema = z.object({
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
  position: positionEnum,
  isActive: z.boolean().optional(),
});
