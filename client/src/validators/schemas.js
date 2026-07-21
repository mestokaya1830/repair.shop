import { z } from "zod";

// repairs
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

  shipping: z
    .object({
      street: z.string().min(3, "Street is required"),
      postalCode: z.string().min(3, "Postal code is required"),
      city: z.string().min(2, "City is required"),
      country: z.string().min(2, "Country is required"),
      contactMethod: z
        .enum(["phone", "email", "whatsapp"])
        .optional()
        .or(z.literal("")),
    })
    .optional(),
});

// login
export const loginSchema = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// user
export const usersSChema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["owner", "admin", "user"]),
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
  street: z.string().trim().optional().or(z.literal("")),
  city: z.string().trim().optional().or(z.literal("")),
  postalCode: z.string().trim().optional().or(z.literal("")),
  country: z.string().trim().optional().or(z.literal("")),
  position: z.string().optional().or(z.literal("")),
  active: z.boolean().default(true),
});

// update user
export const usersUpdateSChema = z.object({
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

// customer
export const customersSchema = z.object({
  source: z.enum(["web", "office"]),
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
    .min(6, "Phone must be at least 6 characters")
    .trim(),
  company: z.string().optional().or(z.literal("")),
  email: z.string().email("Invalid email"),
  street: z.string().optional().or(z.literal("")),
  postalCode: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  country: z.string().optional().or(z.literal("")),
  active: z.boolean().optional(),
});

// update customer
export const customersUpdateSChema = z.object({
  source: z.enum(["web", "office"]).optional(),
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .optional(),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .optional(),
  phone: z
    .string()
    .min(6, "Phone must be at least 6 characters")
    .optional(),
  company: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  street: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  active: z.boolean().optional(),
});

// device
export const devicesSchema = z.object({
  customer: z.string().min(1, "Customer is required"),
  type: z.string().min(2, "Device type is required"),
  brand: z.string().min(2, "Brand is required"),
  model: z.string().min(2, "Model is required"),
  serialNumber: z.string().optional(),
  purchaseDate: z.string().optional(),
  warrantyUntil: z.string().optional(),
  accessories: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

// update device
export const devicesUpdateSchema = z.object({
  customer: z.string().optional(),
  type: z
    .string()
    .min(2, "Device type must be at least 2 characters")
    .optional(),
  brand: z
    .string()
    .min(2, "Brand must be at least 2 characters")
    .optional(),
  model: z
    .string()
    .min(2, "Model must be at least 2 characters")
    .optional(),
  serialNumber: z.string().optional(),
  purchaseDate: z.string().optional(),
  warrantyUntil: z.string().optional(),
  accessories: z.array(z.string()).optional(),
  notes: z.string().optional(),
});