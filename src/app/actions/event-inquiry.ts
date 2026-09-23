'use server';

import { z } from 'zod';
import { getVenue } from '@/lib/venue';
import { BRAND } from '@/lib/brand';
import { sendMail } from '@/lib/mail';
import {
  AREAS_OF_INTEREST,
  BAR_TIERS,
  BUDGET_RANGES,
  EVENT_SUBTYPES,
  FOOD_TIERS,
  GUEST_RANGES,
  REFERRAL_SOURCES,
} from '@/content/spaces';
import type { ActionState } from './types';

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

/* ==========================================================================
   Consulta de eventos
   ========================================================================== */

const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Your name is required.'),
  email: z.string().trim().email('Enter a valid email.'),
  phone: z
    .string()
    .trim()
    .refine((v) => v.replace(/\D/g, '').length >= 10, 'Enter a phone number with at least 10 digits.'),
  company: z.string().trim().optional().default(''),
  /**
   * ⚠️ PASÓ DE OCHO TIPOS PLANOS A FAMILIA + SUBTIPO, pedido de Camila el
   * 2026-09-15. El valor que viaja es «Corporate: Fundraiser or benefit», así
   * que el mail de la consulta se lee solo sin abrir nada.
   */
  eventType: z.enum(EVENT_SUBTYPES, { message: 'Choose what kind of event it is.' }),
  date: z.string().trim().min(1, 'Event date is required.'),
  /**
   * ⚠️ LA FECHA ALTERNATIVA ES OPCIONAL PERO SE PIDE SIEMPRE, y es el campo
   * que más llamadas ahorra: la mitad de las consultas caen en un sábado que
   * ya está tomado, y sin una segunda fecha eso son dos mails de ida y vuelta
   * antes de poder contestar algo.
   */
  altDate: z.string().trim().optional().default(''),
  startTime: z.string().trim().optional().default(''),
  endTime: z.string().trim().optional().default(''),
  guests: z.enum(GUEST_RANGES, { message: 'Choose a guest count.' }),
  foodTier: z.enum(FOOD_TIERS.map((t) => t.value) as [string, ...string[]], {
    message: 'Choose a food tier.',
  }),
  /**
   * ⚠️ OPCIONAL, al revés que la comida: se puede alquilar el lugar sin cerrar
   * la barra en un paquete. Ver la nota del campo en `InquiryForm`.
   */
  barTier: z.enum(BAR_TIERS).optional(),
  budget: z.enum(BUDGET_RANGES, { message: 'Pick a range, even a rough one.' }),
  /** Casillas: la action las lee con `getAll`, no con `fromEntries`. */
  areas: z
    .array(z.enum(AREAS_OF_INTEREST.map((a) => a.value) as [string, ...string[]]))
    .optional()
    .default([]),
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
  const raw = {
    ...Object.fromEntries(formData),
    areas: formData.getAll('areas').map(String),
  };
  const parsed = inquirySchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    // Si cayó el honeypot no se dice por qué: se responde como éxito para no
    // enseñarle al bot dónde estuvo el problema.
    if (fieldErrors.website) return { status: 'ok', message: 'Thanks. Your request is in.' };
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
    d.altDate ? `Alt date:    ${d.altDate}` : null,
    d.startTime || d.endTime ? `Time:        ${d.startTime || '?'} – ${d.endTime || '?'}` : null,
    `Guests:      ${d.guests}`,
    `Food tier:   ${d.foodTier}`,
    d.barTier ? `Bar package: ${d.barTier}` : null,
    `Budget:      ${d.budget}`,
    d.areas.length > 0 ? `Interested:  ${d.areas.join(', ')}` : null,
    d.referral ? `Heard via:   ${d.referral}` : null,
    '',
    d.comments ? `Comments:\n${d.comments}` : null,
  ]
    .filter((l) => l !== null)
    .join('\n');

  const res = await sendMail({
    to: process.env.EVENTS_INBOX ?? (await getVenue()).emailEvents,
    subject: `Event inquiry: ${d.name}, ${d.date} (${d.guests})`,
    text: lines,
    // Responder al mail va directo a quien consultó, no al buzón genérico.
    replyTo: d.email,
  });

  if (!res.ok) {
    return {
      status: 'error',
      message: `${res.message} You can reach us at ${(await getVenue()).emailEvents}.`,
    };
  }

  return { status: 'ok', message: 'Thanks. Your request is in.' };
}
