import { z } from "zod";


export const communicationSchema = z.object({

  repairId: z.string()
    .min(1, "Repair is required"),


  customerId: z.string()
    .min(1, "Customer is required"),


  deviceId: z.string()
    .min(1, "Device is required"),


  type: z.enum([
    "phone",
    "email",
    "whatsapp",
    "note",
  ]),


  contactPerson: z.string()
    .min(2, "Contact person is required")
    .trim(),


  subject: z.string()
    .optional()
    .default(""),


  message: z.string()
    .min(3, "Message is required")
    .trim(),

});