import { z } from "zod";

// create repair
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

// update repair
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
      startedAt: z.string().optional().or(z.literal("")),
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

  estimatedCost: z.number().optional(),

  internalNotes: z.string().optional().or(z.literal("")),
  reception: z
    .object({
      method: z.enum(["courier", "walk-in"]).optional(),
      location: z.string().optional().or(z.literal("")),
      courierCompany: z.string().optional().or(z.literal("")),
      trackingNumber: z.string().optional().or(z.literal("")),
    })
    .optional(),
});

export const communicationSchema = z.object({
  repairId: z.string().min(1, "Repair is required"),

  customerId: z.string().min(1, "Customer is required"),

  deviceId: z.string().min(1, "Device is required"),

  type: z.enum(["phone", "email", "whatsapp", "note"]),

  contactPerson: z.string().min(2, "Contact person is required").trim(),

  subject: z.string().optional().default(""),

  message: z.string().min(3, "Message is required").trim(),
});
// status update

export const statusUpdateSchema = z.object({

  status: z.enum([
    "Pending",
    "Received",
    "Diagnosing",
    "WaitingApproval",
    "Repairing",
    "Testing",
    "Ready",
    "Delivered",
    "Cancelled",
  ]),

  note: z.string()
    .optional()
    .or(z.literal("")),

});


// assign technician

export const assignRepairSchema = z.object({

  assignedTo: z.string()
    .min(1, "Technician is required"),

});

// add work item

export const workItemSchema = z.object({

  type: z.enum([
    "service",
    "part",
  ]),

  title: z
    .string()
    .min(2, "Title is required")
    .trim(),

  description: z
    .string()
    .optional()
    .or(z.literal("")),

  quantity: z
    .number()
    .min(1, "Quantity must be at least 1")
    .optional(),

  partInfo: z
    .object({

      name: z
        .string()
        .optional()
        .or(z.literal("")),

      brand: z
        .string()
        .optional()
        .or(z.literal("")),

      model: z
        .string()
        .optional()
        .or(z.literal("")),

      serialNumber: z
        .string()
        .optional()
        .or(z.literal("")),

      partNumber: z
        .string()
        .optional()
        .or(z.literal("")),

    })
    .optional(),

});