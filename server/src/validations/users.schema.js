import { z } from "zod";

const positionEnum = z.enum([
  "Owner",
  "Manager",
  "Technician",
  "Support",
  "Sales",
  "Accounting",
  "Warehouse",
]);

const roleEnum = z.enum(["owner", "admin", "user"]);

export const userModelhema = z.object({
  email: z.string().email("Invalid email").transform((val) => val.toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: roleEnum,
  firstName: z.string().min(2, "First name must be at least 2 characters").trim(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").trim(),
  phone: z.string().optional().default(""),
  street: z.string().optional().default(""),
  city: z.string().optional().default(""),
  postalCode: z.string().optional().default(""),
  country: z.string().optional().default("Germany"),
  position: positionEnum.optional().default("Technician"),
  isActive: z.boolean().optional().default(true),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email").transform((val) => val.toLowerCase()),
  password: z.string().min(1, "Password required"),
});

export const usersUpdateSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  position: positionEnum.optional(),
  role: roleEnum.optional(),
  isActive: z.boolean().optional(),
});