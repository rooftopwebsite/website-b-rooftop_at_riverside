import { z } from 'zod';
import { CONTACT_REASON_VALUES } from '@/content/contact-reasons';

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name so we know who is writing.').max(100, 'Keep this under 100 characters.'),
  email: z.string().trim().email('Enter a valid email.').max(254, 'That email is too long.'),
  phone: z
    .string()
    .trim()
    .max(30, 'That phone number is too long.')
    .refine(
      (v) => v === '' || v.replace(/\D/g, '').length >= 10,
      'Enter a phone number with at least 10 digits, or leave it empty.',
    )
    .optional()
    .default(''),
  reason: z.enum(CONTACT_REASON_VALUES, { message: 'Choose what your message is about.' }),
  message: z
    .string()
    .trim()
    .min(10, 'Tell us a little more, at least a sentence.')
    .max(4000, 'That is longer than we can take. Keep it under 4000 characters.'),
  website: z.string().max(0).optional().default(''),
});

export type ContactInput = z.infer<typeof contactSchema>;

export function contactFromForm(fd: FormData) {
  return Object.fromEntries(fd);
}
