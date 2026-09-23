'use server';

import { getVenue } from '@/lib/venue';
import { publicInbox } from '@/lib/inboxes';
import { inquiryFromForm, inquirySchema } from '@/lib/schemas/event-inquiry';
import { rateLimited, sendSubmission } from '@/lib/submissions';
import { fieldErrorsFrom, type ActionState } from './types';

/**
 * La consulta de eventos privados de `/events`.
 *
 * ⚠️ La validación se repite ACÁ aunque el cliente ya valide. La del cliente es
 * para la experiencia; la del servidor es la que manda. Un POST a mano se salta
 * la primera entera. El schema es el mismo objeto en los dos lados: ver
 * `lib/schemas/event-inquiry.ts`.
 *
 * ⚠️ HASTA EL 2026-09-23 ERA LA ÚNICA ACTION QUE LLAMABA A `sendMail` DIRECTO,
 * sin rate limit y con su propio armado del cuerpo. Ahora pasa por
 * `sendSubmission` como las otras cuatro: el buzón lo elige `lib/inboxes.ts`.
 */
export async function submitEventInquiry(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = inquirySchema.safeParse(inquiryFromForm(formData));

  if (!parsed.success) {
    const fieldErrors = fieldErrorsFrom(parsed.error.issues);
    // Si cayó el honeypot no se dice por qué: se responde como éxito para no
    // enseñarle al bot dónde estuvo el problema.
    if (fieldErrors.website) return { status: 'ok', message: 'Thanks. Your request is in.' };
    return { status: 'error', message: 'Please check the highlighted fields.', fieldErrors };
  }

  const venue = await getVenue();
  if (await rateLimited()) {
    return {
      status: 'error',
      message: `That is a few requests in a short while. Give it ten minutes, or call us at ${venue.phone}.`,
    };
  }

  const d = parsed.data;
  const hora =
    d.startTime || d.endTime ? `${d.startTime || '?'} to ${d.endTime || '?'}` : '(not given)';

  const result = await sendSubmission({
    form: 'event-inquiry',
    inbox: 'events',
    replyTo: d.email,
    subject: `Event inquiry: ${d.name}, ${d.date} (${d.guests})`,
    data: {
      Name: d.name,
      Email: d.email,
      Phone: d.phone,
      Company: d.company || '(not given)',
      'Event type': d.eventType,
      Date: d.date,
      'Second date': d.altDate || '(not given)',
      Time: hora,
      Guests: d.guests,
      'Food tier': d.foodTier,
      'Bar package': d.barTier ?? '(not chosen)',
      Budget: d.budget,
      'Interested in': d.areas.length > 0 ? d.areas.join(', ') : '(nothing ticked)',
      'Heard about us': d.referral ?? '(not given)',
      Comments: d.comments || '(none)',
    },
  });

  if (!result.ok) {
    return {
      status: 'error',
      message: `We could not send that. Email us at ${publicInbox('events')} and it gets to the same place.`,
    };
  }

  return { status: 'ok', message: 'Thanks. Your request is in.' };
}
