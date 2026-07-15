import { z } from "zod";

export const customerSchema = z.object({
  profile: z.object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .trim(),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .trim(),

    phone: z.string().min(6, "Phone must be at least 6 characters").trim(),
    email: z.string().email("Invalid email").optional().or(z.literal("")),

    address: z.object({
      street: z.string().optional(),
      postalCode: z.string().optional(),
      city: z.string().optional(),
      country: z.string().default("Germany"),
    }),
  }),
});


const customerUpdateSchema = z.object({
  profile: z
    .object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().email().optional().or(z.literal("")),
      address: z
        .object({
          street: z.string().optional(),
          postalCode: z.string().optional(),
          city: z.string().optional(),
          country: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

export default customerUpdateSchema;
