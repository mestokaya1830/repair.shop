import {z} from 'zod'

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  newPassword: z.string().min(8, "New Password must be at least 8 characters"),
});