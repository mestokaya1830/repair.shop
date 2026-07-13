import { z } from "zod";

export const updateUserSchema = z.object({
  profile: z
    .object({
      firstName: z
        .string()
        .min(2, "First name must be at least 2 characters")
        .optional(),

      lastName: z
        .string()
        .min(2, "Last name must be at least 2 characters")
        .optional(),

      phone: z.string().optional(),
      position: z.string().optional(),
      address: z
        .object({
          street: z.string().optional(),
          city: z.string().optional(),
          postalCode: z.string().optional(),
          country: z.string().optional(),
        })
        .optional(),
    })
    .optional(),

  active: z.boolean().optional(),
});
