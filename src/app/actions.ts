'use server';

import { z } from 'zod';
import { BRAND } from '@/lib/brand';
import { sendMail } from '@/lib/mail';
import { EVENT_TYPES, FOOD_TIERS, GUEST_RANGES, REFERRAL_SOURCES } from '@/content/spaces';

/**
 * Server Actions de los dos formularios del sitio.
 *
 * ⚠️ La validación se repite ACÁ aunque el cliente ya valide. La del cliente es
 * para la experiencia; la del servidor es la que manda. Un POST a mano se salta
 * la primera entera.
 *
 * ⚠️ Los dropdowns se validan contra la MISMA lista que renderiza el formulario
 * (`z.enum` sobre las constantes de `content/spaces.ts`), así que no se pueden
 * desincronizar: si alguien agrega un tipo de evento en un lado y no en el otro,
 * TypeScript lo marca.
 */

export interface ActionState {
  readonly status: 'idle' | 'ok' | 'error';
  readonly message: string;
  /** Errores por campo, para pintarlos donde corresponde. */
  readonly fieldErrors?: Record<string, string>;
}

/* ==========================================================================
   Consulta de eventos
   ========================================================================== */

const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Your name is required.'),
  email: z.string().trim().email('Enter a valid email address, like you@example.com.'),
  phone: z
    .string()
    .trim()
    .refine((v) => v.replace(/\D/g, '').length >= 10, 'Enter a phone number with at least 10 digits.'),
  company: z.string().trim().optional().default(''),
  eventType: z.enum(EVENT_TYPES, { message: 'Choose a type of event.' }),
  date: z.string().trim().min(1, 'Event date is required.'),
  startTime: z.string().trim().optional().default(''),
  endTime: z.string().trim().optional().default(''),
  guests: z.enum(GUEST_RANGES, { message: 'Choose a guest count.' }),
  foodTier: z.enum(FOOD_TIERS.map((t) => t.value) as [string, ...string[]], {
    message: 'Choose a food tier.',
  }),
  comments: z.string().trim().max(4000).optional().default(''),
  referral: z.enum(REFERRAL_SOURCES).optional(),
  /**
   * Honeypot. Un campo oculto que una persona nunca llena y un bot sí.
   * Es la defensa antispam más barata y no le pide nada al usuario — a
   * diferencia de un captcha, que además es una barrera de accesibilidad.
   */
  website: z.string().max(0).optional().default(''),
});

export async function submitEventInquiry(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const parsed = inquirySchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    // Si cayó el honeypot no se dice por qué: se responde como éxito para no
    // enseñarle al bot dónde estuvo el problema.
    if (fieldErrors.website) return { status: 'ok', message: 'Thanks — your request is in.' };
    return { status: 'error', message: 'Please check the highlighted fields.', fieldErrors };
  }

  const d = parsed.data;
  const lines = [
    `New event inquiry from ${BRAND.name}`,
    '',
    `Name:        ${d.name}`,
    `Email:       ${d.email}`,
    `Phone:       ${d.phone}`,
    d.company ? `Company:     ${d.company}` : null,
    '',
    `Event type:  ${d.eventType}`,
    `Date:        ${d.date}`,
    d.startTime || d.endTime ? `Time:        ${d.startTime || '?'} – ${d.endTime || '?'}` : null,
    `Guests:      ${d.guests}`,
    `Food tier:   ${d.foodTier}`,
    d.referral ? `Heard via:   ${d.referral}` : null,
    '',
    d.comments ? `Comments:\n${d.comments}` : null,
  ]
    .filter((l) => l !== null)
    .join('\n');

  const res = await sendMail({
    to: process.env.EVENTS_INBOX ?? BRAND.contact.events,
    subject: `Event inquiry — ${d.name}, ${d.date} (${d.guests})`,
    text: lines,
    // Responder al mail va directo a quien consultó, no al buzón genérico.
    replyTo: d.email,
  });

  if (!res.ok) {
    return {
      status: 'error',
      message: `${res.message} You can reach us at ${BRAND.contact.events}.`,
    };
  }

  return { status: 'ok', message: 'Thanks — your request is in.' };
}

/* ==========================================================================
   Newsletter
   ========================================================================== */

const newsletterSchema = z.object({
  email: z.string().trim().email('Enter a valid email address, like you@example.com.'),
  website: z.string().max(0).optional().default(''),
});

export async function subscribeToNewsletter(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = newsletterSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    if (String(issue?.path[0]) === 'website') {
      return { status: 'ok', message: "You're on the list." };
    }
    return {
      status: 'error',
      message: issue?.message ?? 'Enter a valid email address.',
      fieldErrors: { email: issue?.message ?? 'Enter a valid email address.' },
    };
  }

  /**
   * ⚠️ Por ahora esto MANDA UN MAIL al buzón del venue, no da de alta en una
   * lista. El cliente usa Toast para email/SMS y todavía no tenemos ni el
   * acceso ni la lista de destino. Cuando estén, se reemplaza este envío por
   * el alta en la lista y el resto del formulario no cambia.
   */
  const res = await sendMail({
    to: process.env.NEWSLETTER_INBOX ?? BRAND.contact.email,
    subject: 'Newsletter signup',
    text: `New newsletter signup: ${parsed.data.email}`,
    replyTo: parsed.data.email,
  });

  if (!res.ok) return { status: 'error', message: res.message };
  return { status: 'ok', message: "You're on the list. See you at sunset." };
}
