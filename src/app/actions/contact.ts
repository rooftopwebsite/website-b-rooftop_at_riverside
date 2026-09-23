'use server';

import { CONTACT_REASONS, reasonByValue } from '@/content/contact-reasons';
import { getVenue } from '@/lib/venue';
import { publicInbox } from '@/lib/inboxes';
import { contactFromForm, contactSchema } from '@/lib/schemas/contact';
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

  const parsed = contactSchema.safeParse(contactFromForm(formData));

  if (!parsed.success) {
    const fieldErrors = fieldErrorsFrom(parsed.error.issues);
    /*
     * El honeypot se contesta con un ok falso: un bot que recibe un error
     * reintenta con otra forma; uno que recibe ok se va.
     *
     * ⚠️ SE MIRA ACÁ, EN EL FALLO, Y NO DESPUÉS. El schema declara la trampa
     * con `max(0)`, así que una trampa llena NUNCA llega al `success`: el
     * chequeo que estaba más abajo no se ejecutaba jamás y el bot recibía un
     * error con la lista de campos. Corregido el 2026-09-23; los otros cuatro
     * formularios ya lo hacían así.
     */
    if (fieldErrors.website) return { status: 'ok', message: 'Thanks. Your message is in.' };
    return {
      status: 'error',
      message: 'Some fields need another look before this can go out.',
      fieldErrors,
    };
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

  /*
   * ⚠️ «WORKING HERE» VA A `hiring@` Y NO A `info@`: es el buzón que el sitio
   * vigente publica para eso, al lado del otro en el pie de cada página.
   */
  const inbox = parsed.data.reason === 'careers' ? 'careers' : 'contact';

  const result = await sendSubmission({
    form: 'contact',
    inbox,
    replyTo: parsed.data.email,
    subject: `Website contact: ${reasonLabel} (${parsed.data.name})`,
    data: {
      Name: parsed.data.name,
      Email: parsed.data.email,
      Phone: parsed.data.phone || '(not given)',
      About: reasonLabel,
      Message: parsed.data.message,
    },
  });

  if (!result.ok) {
    return {
      status: 'error',
      message: `We could not send that. Email us at ${publicInbox(inbox)} and it gets to the same place.`,
    };
  }

  return {
    status: 'ok',
    message: 'We read everything that comes in and answer within one business day.',
  };
}
