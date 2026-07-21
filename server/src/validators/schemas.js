import { z } from "zod";

//repairs
export const repairsSchema = z.object({
  customer: z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(6, "Phone is required"),
    company: z.string().optional().or(z.literal("")),
  }),

  device: z.object({
    type: z.string().min(1, "Device type is required"),
    brand: z.string().min(2, "Brand is required"),
    model: z.string().min(2, "Model is required"),
    serialNumber: z.string().optional().or(z.literal("")),
    purchaseDate: z.string().optional().or(z.literal("")),
  }),

  problem: z.object({
    category: z.string().min(1, "Category is required"),
    description: z.string().min(10, "Description is required"),
    deviceWorking: z.string().min(1, "Device status is required"),
    startedAt: z.string().optional().or(z.literal("")),
    notes: z.string().optional().or(z.literal("")),
  }),

  shipping: z
    .object({
      street: z.string().min(3),
      postalCode: z.string().min(3),
      city: z.string().min(2),
      country: z.string().min(2),
      contactMethod: z
        .enum(["phone", "email", "whatsapp"])
        .optional()
        .or(z.literal("")),
    })
    .optional(),

  reception: z
    .object({
      method: z.enum(["courier", "walk-in"]).optional(),

      location: z.string().optional().or(z.literal("")),

      courierCompany: z.string().optional().or(z.literal("")),

      trackingNumber: z.string().optional().or(z.literal("")),
    })
    .optional(),
});

//repairs update
export const repairsUpdateSchema = z.object({
  status: z
    .enum([
      "Pending",
      "Received",
      "Diagnosing",
      "WaitingApproval",
      "Repairing",
      "Testing",
      "Ready",
      "Delivered",
      "Cancelled",
    ])
    .optional(),

  estimatedCompletionDate: z.string().optional().or(z.literal("")),

  problem: z
    .object({
      category: z.string().optional(),
      description: z.string().optional(),
      deviceWorking: z.string().optional(),
      notes: z.string().optional().or(z.literal("")),
    })
    .optional(),

  diagnosis: z.string().optional().or(z.literal("")),

  solution: z.string().optional().or(z.literal("")),

  approval: z
    .object({
      status: z.enum(["pending", "approved", "rejected"]).optional(),

      note: z.string().optional().or(z.literal("")),
    })
    .optional(),
});

//login
export const loginSchema = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

//user
export const usersSChema = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  profile: z.object({
    firstName: z.string().min(2, "First name minimum 2 characters").trim(),
    lastName: z.string().min(2, "Last name minimum 2 characters").trim(),
    phone: z.string().optional().or(z.literal("")),
    address: z.object({
      street: z.string().optional().or(z.literal("")),
      city: z.string().optional().or(z.literal("")),
      postalCode: z.string().optional().or(z.literal("")),
      country: z.string().optional().or(z.literal("")),
    }),
  }),

  active: z.boolean().optional(),
});

//update user
export const usersUpdateSchema = z.object({
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

//device
export const devicesSchema = z.object({
  type: z.string().min(2, "Device type is required"),
  brand: z.string().min(2, "Brand is required"),
  model: z.string().min(2, "Model is required"),
  serialNumber: z.string().optional().or(z.literal("")),
  purchaseDate: z.string().optional().or(z.literal("")),
  warrantyUntil: z.string().optional().or(z.literal("")),
  accessories: z.array(z.string()).optional(),
  notes: z.string().optional().or(z.literal("")),
});

//update device
export const deviceUpdateSchema = devicesSchema.partial();

//customer
export const customersSChema = z.object({
  firstName: z.string().min(2).trim(),
  lastName: z.string().min(2).trim(),
  email: z.string().email(),
  phone: z.string().min(6),
  company: z.string().optional().or(z.literal("")),
});

//update customer
export const customersUpdateSChema = z.object({
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
