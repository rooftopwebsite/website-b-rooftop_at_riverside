'use server';

import { marketVendorSchema } from '@/lib/schemas/market-vendor';
import { rateLimited, sendSubmission } from '@/lib/submissions';
import { getVenue } from '@/lib/venue';
import { fieldErrorsFrom, type ActionState } from './types';

/**
 * La solicitud de puesto del Neighborhood Market.
 *
 * ⚠️ `needs` SE LEE CON `getAll`, no con `Object.fromEntries`. Un grupo de
 * casillas llega como varios valores con el mismo nombre y `fromEntries` se
 * queda sólo con el último: alguien que tilda electricidad, mesa y carpa
 * habría enviado nada más «carpa». Es el error clásico de este control.
 */
export async function submitMarketVendor(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const crudo = {
    ...Object.fromEntries(formData),
    needs: formData.getAll('needs').map(String),
  };

  const parsed = marketVendorSchema.safeParse(crudo);

  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Some fields need another look before this can go out.',
      fieldErrors: fieldErrorsFrom(parsed.error.issues),
    };
  }

  if (parsed.data.website_hp) {
    return { status: 'ok', message: 'Thanks. Your request is in.' };
  }

  const venue = await getVenue();

  if (await rateLimited()) {
    return {
      status: 'error',
      message: `That is a few requests in a short while. Give it ten minutes, or call us at ${venue.phone}.`,
    };
  }

  const result = await sendSubmission({
    form: 'market-vendor',
    to: venue.email,
    replyTo: parsed.data.email,
    subject: `Market vendor: ${parsed.data.business}`,
    data: {
      business: parsed.data.business,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      website: parsed.data.website,
      category: parsed.data.category,
      products: parsed.data.products,
      dates: parsed.data.dates,
      needs: parsed.data.needs.length > 0 ? parsed.data.needs.join(', ') : '(nothing)',
      insurance: parsed.data.insurance,
      message: parsed.data.message || '(none)',
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
    message:
      'We look at what you make and whether it fits alongside what is already booked, and we answer within one business day.',
  };
}
