import { z } from "zod";

//repairs
export const customersSchema = z.object({
  customer: z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(6, "Phone is required"),
    company: z.string().optional().or(z.literal("")),
  })
})