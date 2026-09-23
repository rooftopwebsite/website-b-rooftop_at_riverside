'use server';

import { publicInbox } from '@/lib/inboxes';
import { marketVendorFromForm, marketVendorSchema } from '@/lib/schemas/market-vendor';
import { rateLimited, sendSubmission } from '@/lib/submissions';
import { getVenue } from '@/lib/venue';
import { fieldErrorsFrom, type ActionState } from './types';

export async function submitMarketVendor(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = marketVendorSchema.safeParse(marketVendorFromForm(formData));

  if (!parsed.success) {
    const fieldErrors = fieldErrorsFrom(parsed.error.issues);
    if (fieldErrors.website) return { status: 'ok', message: 'Thanks. Your request is in.' };
    return {
      status: 'error',
      message: 'Some fields need another look before this can go out.',
      fieldErrors,
    };
  }

  const venue = await getVenue();

  if (await rateLimited()) {
    return {
      status: 'error',
      message: `That is a few requests in a short while. Give it ten minutes, or call us at ${venue.phone}.`,
    };
  }

  const d = parsed.data;
  const result = await sendSubmission({
    form: 'market-vendor',
    inbox: 'market',
    replyTo: d.email,
    subject: `Market vendor: ${d.business}`,
    data: {
      Business: d.business,
      Name: d.name,
      Email: d.email,
      Phone: d.phone,
      'Website or Instagram': d.link,
      Sells: d.category,
      Products: d.products,
      'Market dates': d.dates,
      Needs: d.needs.length > 0 ? d.needs.join(', ') : '(nothing)',
      Insurance: d.insurance === 'yes' ? 'Yes' : 'No',
      'Anything else': d.message || '(none)',
    },
  });

  if (!result.ok) {
    return {
      status: 'error',
      message: `We could not send that. Email us at ${publicInbox('market')} and it gets to the same place.`,
    };
  }

  return {
    status: 'ok',
    message:
      'We look at what you make and whether it fits alongside what is already booked, and we answer within one business day.',
  };
}
