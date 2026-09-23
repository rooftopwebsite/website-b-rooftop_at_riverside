import { z } from 'zod';
import {
  AREAS_OF_INTEREST,
  BAR_TIERS,
  BUDGET_RANGES,
  EVENT_SUBTYPES,
  FOOD_TIERS,
  GUEST_RANGES,
  REFERRAL_SOURCES,
} from '@/content/spaces';

export const inquirySchema = z
  .object({
    name: z.string().trim().min(2, 'Your name is required.').max(100, 'Keep this under 100 characters.'),
    email: z.string().trim().email('Enter a valid email.').max(254, 'That email is too long.'),
    phone: z
      .string()
      .trim()
      .max(30, 'That phone number is too long.')
      .refine((v) => v.replace(/\D/g, '').length >= 10, 'Enter a phone number with at least 10 digits.'),
    company: z.string().trim().max(160).optional().default(''),
    eventType: z.enum(EVENT_SUBTYPES, { message: 'Choose what kind of event it is.' }),
    date: z
      .string()
      .trim()
      .min(1, 'Event date is required.')
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Pick a date.')
      .refine((v) => v >= hoyEnFlorida(), 'Pick a date from today on.'),
    altDate: z
      .string()
      .trim()
      .optional()
      .default('')
      .refine((v) => v === '' || /^\d{4}-\d{2}-\d{2}$/.test(v), 'Pick a date.')
      .refine((v) => v === '' || v >= hoyEnFlorida(), 'Pick a date from today on.'),
    startTime: z.string().trim().max(200, 'Keep this under 200 characters.').optional().default(''),
    endTime: z.string().trim().max(200, 'Keep this under 200 characters.').optional().default(''),
    guests: z.enum(GUEST_RANGES, { message: 'Choose a guest count.' }),
    foodTier: z.enum(FOOD_TIERS.map((t) => t.value) as [string, ...string[]], {
      message: 'Choose a food tier.',
    }),
    barTier: z.preprocess((v) => (v === '' ? undefined : v), z.enum(BAR_TIERS).optional()),
    budget: z.enum(BUDGET_RANGES, { message: 'Pick a range, even a rough one.' }),
    areas: z
      .array(z.enum(AREAS_OF_INTEREST.map((a) => a.value) as [string, ...string[]]))
      .optional()
      .default([]),
    comments: z
      .string()
      .trim()
      .max(4000, 'Keep it under 4000 characters.')
      .optional()
      .default(''),
    referral: z.preprocess((v) => (v === '' ? undefined : v), z.enum(REFERRAL_SOURCES).optional()),
    website: z.string().max(0).optional().default(''),
  })
  .refine(
    (d) =>
      !d.startTime || !d.endTime || d.endTime > d.startTime || d.endTime < '04:00',
    { path: ['endTime'], message: 'End time has to be after the start time.' },
  )
  .refine((d) => !d.altDate || d.altDate !== d.date, {
    path: ['altDate'],
    message: 'Pick a different day than the first one.',
  });

export type InquiryInput = z.infer<typeof inquirySchema>;

export function hoyEnFlorida(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

export function inquiryFromForm(fd: FormData) {
  return {
    ...Object.fromEntries(fd),
    areas: fd.getAll('areas').map(String),
  };
}
