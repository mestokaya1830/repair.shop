import { z } from 'zod';

export const tenantsSchema = z.object({
 company: z
    .string({ required_error: 'Company / Tenant name is required' })
    .min(1, 'Company / Tenant name is required')
    .trim(),
  firstName: z
    .string({ required_error: 'Firstname is required' })
    .min(1, 'Firstname is required')
    .trim(),
  lastName: z
    .string({ required_error: 'Lastname is required' })
    .min(1, 'Lastname is required')
    .trim(),
  
  
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .or(z.literal('')) // Boş string verilmesine izin verir
    .default(''),

  phone: z.string().trim().default(''),
  website: z.string().trim().default(''),
  logoUrl: z.string().trim().default(''),
  currency: z.string().trim().default('EUR.de-DE'),

  address: z
    .object({
      street: z.string().trim().default(''),
      city: z.string().trim().default(''),
      postalCode: z.string().trim().default(''),
      country: z.string().trim().default(''),
    })
    .default({}),

  billingDetails: z
    .object({
      taxNumber: z.string().trim().default(''),
      vatId: z.string().trim().default(''),
      commercialRegister: z.string().trim().default(''),
    })
    .default({}),

  bankDetails: z
    .object({
      accountHolder: z.string().trim().default(''),
      bankName: z.string().trim().default(''),
      iban: z.string().trim().default(''),
      bic: z.string().trim().default(''),
    })
    .default({}),
});