import { z } from 'zod';
import { PRODUCT_CATEGORIES, VENDOR_NEEDS } from '@/content/market';

export const marketVendorSchema = z.object({
  business: z.string().trim().min(2, 'Tell us the name of your business.').max(200, 'Keep this under 200 characters.'),
  name: z.string().trim().min(2, 'Enter your name so we know who is writing.').max(100, 'Keep this under 100 characters.'),
  email: z.string().trim().email('Enter a valid email.').max(254, 'That email is too long.'),
  phone: z
    .string()
    .trim()
    .max(30, 'That phone number is too long.')
    .refine(
      (v) => v.replace(/\D/g, '').length >= 10,
      'Enter a phone number with at least 10 digits.',
    ),
  link: z
    .string()
    .trim()
    .min(2, 'A website or an Instagram handle, so we can see what you make.')
    .max(300, 'That link is too long.'),
  category: z.enum(PRODUCT_CATEGORIES, { message: 'Choose what you sell.' }),
  products: z
    .string()
    .trim()
    .min(20, 'Describe what you sell in a sentence or two, at least.')
    .max(2000, 'Keep it under 2000 characters.'),
  dates: z.string().trim().min(2, 'Tell us which market dates you are after.').max(200, 'Keep this under 200 characters.'),
  needs: z
    .array(z.enum(VENDOR_NEEDS.map((n) => n.value) as [string, ...string[]]))
    .optional()
    .default([]),
  insurance: z.enum(['yes', 'no'], { message: 'Let us know if you carry insurance.' }),
  message: z.string().trim().max(2000).optional().default(''),
  website: z.string().max(0).optional().default(''),
});

export type MarketVendorInput = z.infer<typeof marketVendorSchema>;

export function marketVendorFromForm(fd: FormData) {
  return {
    ...Object.fromEntries(fd),
    needs: fd.getAll('needs').map(String),
  };
}
