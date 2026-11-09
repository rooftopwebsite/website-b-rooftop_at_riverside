'use server';

import { CONTACT_REASONS, reasonByValue } from '@/content/contact-reasons';
import { getVenue } from '@/lib/venue';
import { publicInbox } from '@/lib/inboxes';
import { contactFromForm, contactSchema } from '@/lib/schemas/contact';
import { rateLimited, sendSubmission } from '@/lib/submissions';
import { fieldErrorsFrom, type ActionState } from './types';

export async function submitContact(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const venue = await getVenue();

  const parsed = contactSchema.safeParse(contactFromForm(formData));

  if (!parsed.success) {
    const fieldErrors = fieldErrorsFrom(parsed.error.issues);
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

  const inbox = parsed.data.reason === 'careers' ? 'careers' : 'contact';

  const result = await sendSubmission({
    form: 'contact',
    inbox,
    replyTo: parsed.data.email,
    firstName: parsed.data.name,
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
    message: 'We read everything that comes in and answer within 24–48 hours.',
  };
}
