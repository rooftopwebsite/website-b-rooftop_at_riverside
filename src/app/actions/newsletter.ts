'use server';

import { z } from 'zod';
import { getVenue } from '@/lib/venue';
import {
  addSubscriber,
  checkNewsletterToken,
  newsletterConfigured,
  sendConfirmationEmail,
} from '@/lib/newsletter';
import { rateLimited } from '@/lib/submissions';
import type { ActionState } from './types';

const newsletterSchema = z.object({
  firstName: z.string().trim().min(2, 'Enter your first name.').max(100, 'Keep this under 100 characters.'),
  email: z.string().trim().email('Enter a valid email.').max(254, 'That email is too long.'),
  consent: z.literal('on', { error: 'Tick the box to subscribe.' }),
  website: z.string().max(0).optional().default(''),
});

const CHECK_YOUR_INBOX =
  'Almost there. Check your inbox for an email from us and press the link to confirm.';

export async function subscribeToNewsletter(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = newsletterSchema.safeParse(Object.fromEntries(formData) as Record<string, string>);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    if (fieldErrors.website) return { status: 'ok', message: CHECK_YOUR_INBOX };
    return { status: 'error', message: 'Please check the highlighted fields.', fieldErrors };
  }

  if (await rateLimited()) {
    return {
      status: 'error',
      message: 'That is a few sign-ups in a short while. Give it ten minutes and try again.',
    };
  }

  if (!newsletterConfigured()) {
    console.error('[newsletter] Mailjet or NEWSLETTER_TOKEN_SECRET is not configured; the signup was NOT started.');
    return {
      status: 'error',
      message: `Sign-up isn’t live yet. Write to us at ${(await getVenue()).email} and we’ll add you.`,
    };
  }

  const { firstName, email } = parsed.data;
  const sent = await sendConfirmationEmail({ email, firstName });

  if (sent === 'failed') {
    return { status: 'error', message: 'Something went wrong. Please try again in a moment.' };
  }

  return { status: 'ok', message: CHECK_YOUR_INBOX };
}

export async function confirmNewsletter(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const token = formData.get('token');
  const check = typeof token === 'string' ? checkNewsletterToken(token) : null;

  if (!check || !check.ok) {
    return {
      status: 'error',
      message:
        check && check.reason === 'expired'
          ? 'This link has expired. Sign up again and we will send you a fresh one.'
          : 'This link is not valid. Sign up again and we will send you a fresh one.',
    };
  }

  if (await rateLimited()) {
    return { status: 'error', message: 'Too many tries in a short while. Wait ten minutes and try again.' };
  }

  const added = await addSubscriber(check.claims);
  if (!added) {
    return { status: 'error', message: 'Something went wrong on our end. Please try the button again in a moment.' };
  }

  return { status: 'ok', message: 'You are subscribed. Welcome in!' };
}
