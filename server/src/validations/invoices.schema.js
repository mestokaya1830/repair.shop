import { z } from 'zod';

// 1. Yedek Parça / Malzeme Bilgisi Şeması
export const partInfoSchema = z.object({
  partNumber: z.string().optional().default(''),
  name: z.string().optional().default(''),
  brand: z.string().optional().default(''),
  unit: z.string().optional().default('pcs'),
  costPrice: z.number().optional().default(0),
});

// 2. Fatura Kalemi (Work Item) Şeması
export const workItemSchema = z.object({
  workflowItemId: z.string().nullable().optional(),
  title: z.string().min(1, 'Başlık alanı zorunludur'),
  description: z.string().optional().default(''),
  quantity: z.number().min(0, 'Miktar 0 veya daha büyük olmalıdır').default(1),
  price: z.number().min(0, 'Fiyat 0 veya daha büyük olmalıdır').default(0),
  vat: z.number().min(0).max(100).optional().default(0),
  total: z.number().optional(),
  
  // Gömülü nesneler
  partInfo: partInfoSchema.optional(),
  workflowItem: z.record(z.unknown()).nullable().optional(), // Esnek obje/Mixed alan için
});

// 3. Müşteri Bilgileri Şeması
export const customerSchema = z.object({
  firstName: z.string().optional().default(''),
  lastName: z.string().optional().default(''),
  company: z.string().optional().default(''),
  address: z.string().optional().default(''),
  postalCode: z.string().optional().default(''),
  city: z.string().optional().default(''),
});

// 4. Ana Fatura (Invoice) Zod Şeması
export const invoicesModelhema = z.object({
  repairId: z.string().nullable().optional(),
  
  // Müşteri
  customer: customerSchema.optional(),

  // Hizmet Sağlayan (Tenant ID)
  tenantId: z.string({
    required_error: 'Tenant ID zorunludur',
  }),

  // Tarihler ve Koşullar
  serviceDate: z.coerce.date().nullable().optional(), // String tarih gelirse Date objesine çevirir
  date: z.coerce.date().default(() => new Date()),
  paymentTerms: z.number().int().positive().default(14),

  // Vergi Tipi
  vatType: z
    .enum(['standard', 'reverse_charge', 'small_business'])
    .default('standard'),

  // Para Birimi
  currency: z.string().default('EUR'),

  // Fatura Kalemleri
  workItems: z.array(workItemSchema).default([]),

  // Toplam Hesaplamaları
  totals: z.object({
    net: z.number().default(0),
    vat: z.number().default(0),
    total: z.number().default(0),
  }),
});