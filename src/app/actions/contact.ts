'use server';

import { CONTACT_REASONS, reasonByValue } from '@/content/contact-reasons';
import { getVenue } from '@/lib/venue';
import { BRAND } from '@/lib/brand';
import { contactSchema } from '@/lib/schemas/contact';
import { rateLimited, sendSubmission } from '@/lib/submissions';
import { fieldErrorsFrom, type ActionState } from './types';

/**
 * El formulario de `/contact`.
 *
 * ⚠️ La validación se repite acá aunque el cliente ya valide. La del cliente
 * es para la experiencia; la del servidor es la que manda. Un POST a mano se
 * saltea la primera entera.
 *
 * ⚠️ Los dos motivos que tienen su propio flujo —eventos privados y market—
 * no se aceptan por acá ni siquiera si alguien fuerza el POST: se devuelve el
 * link, que es la respuesta correcta y no un error.
 */
export async function submitContact(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const venue = await getVenue();

  const parsed = contactSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Some fields need another look before this can go out.',
      fieldErrors: fieldErrorsFrom(parsed.error.issues),
    };
  }

  // El honeypot se contesta con un ok falso: un bot que recibe un error
  // reintenta con otra forma; uno que recibe ok se va.
  if (parsed.data.website) {
    return { status: 'ok', message: 'Thanks. Your message is in.' };
  }

  const redirect = reasonByValue(parsed.data.reason)?.redirect;
  if (redirect) {
    return {
      status: 'error',
      message: `${redirect.why} Use the form on that page instead.`,
      fieldErrors: { reason: 'This one is handled on its own page.' },
    };
  }

  if (await rateLimited()) {
    return {
      status: 'error',
      message:
        'That is a few messages in a short while. Give it ten minutes, or call us at ' +
        `${venue.phone}.`,
    };
  }

  const reasonLabel = CONTACT_REASONS.find((r) => r.value === parsed.data.reason)?.label ?? 'General';

  const result = await sendSubmission({
    form: 'contact',
    to: parsed.data.reason === 'careers' ? venue.emailHiring : venue.email,
    replyTo: parsed.data.email,
    subject: `Website contact: ${reasonLabel}`,
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || '(not given)',
      reason: reasonLabel,
      message: parsed.data.message,
    },
  });

  if (!result.ok) {
    return {
      status: 'error',
      message: `We could not send that. Email us at ${venue.email} and it gets to the same place.`,
    };
  }

  return {
    status: 'ok',
    message: 'We read everything that comes in and answer within one business day.',
  };
}
