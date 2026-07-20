import { z } from "zod";

//admin repairs
export const repairSchema = z.object({
  customer: z.string().min(1, "Customer is required"),

  device: z.string().min(1, "Device is required"),

  problem: z.object({
    category: z.string().min(1, "Category is required"),

    description: z.string().min(10, "Description is required"),

    deviceWorking: z.string().min(1, "Device status is required"),

    notes: z.string().optional().or(z.literal("")),
  }),

  reception: z
    .object({
      method: z.enum(["courier", "walk-in"]).optional(),

      location: z.string().optional().or(z.literal("")),

      courierCompany: z.string().optional().or(z.literal("")),

      trackingNumber: z.string().optional().or(z.literal("")),
    })
    .optional(),
});

//admin repairs update
export const repairUpdateSchema = z.object({
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
  customer: z.string().min(1, "Customer is required").optional(),
  device: z.string().min(1, "Device is required").optional(),
  problem: z
    .object({
      category: z.string().min(1, "Category is required").optional(),
      description: z.string().min(10, "Description is required").optional(),
      deviceWorking: z.string().min(1, "Device status is required").optional(),
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
export const userSchema = z.object({
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
export const deviceCreateSchema = z.object({
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

//update device
export const updateDeviceSchema = deviceCreateSchema.partial();

//customer
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

//update customer
export const updateCustomerSchema = z.object({
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
