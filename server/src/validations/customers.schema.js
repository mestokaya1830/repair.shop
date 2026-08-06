import { z } from "zod";

// customers
export const customersModelhema = z.object({
  source: z.enum(["web", "office"], {
    required_error: "Source is required",
    invalid_type_error: "Source must be 'web' or 'office'",
  }).default("office"),
  isActive: z.boolean().default(true),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(6, "Phone is required"),
  company: z.string().optional().or(z.literal("")),
  street: z.string().optional().or(z.literal("")),
  postalCode: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  country: z.string().optional().or(z.literal("")).default("Germany"),
});