'use server';

import { z } from 'zod';
import { getVenue } from '@/lib/venue';
import { rateLimited } from '@/lib/submissions';
import type { ActionState } from './types';

const newsletterSchema = z.object({
  firstName: z.string().trim().min(2, 'Enter your first name.').max(100, 'Keep this under 100 characters.'),
  email: z.string().trim().email('Enter a valid email.').max(254, 'That email is too long.'),
  website: z.string().max(0).optional().default(''),
});

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
    if (fieldErrors.website) return { status: 'ok', message: 'Thanks for subscribing!' };
    return { status: 'error', message: 'Please check the highlighted fields.', fieldErrors };
  }

  if (await rateLimited()) {
    return {
      status: 'error',
      message: 'That is a few sign-ups in a short while. Give it ten minutes and try again.',
    };
  }

  const { firstName, email } = parsed.data;
  const webhook = process.env.NEWSLETTER_SHEETS_WEBHOOK_URL;

  if (!webhook) {
    console.error('[newsletter] falta NEWSLETTER_SHEETS_WEBHOOK_URL — el alta NO se guardó');
    return {
      status: 'error',
      message: `Sign-up isn’t live yet. Write to us at ${(await getVenue()).email} and we’ll add you.`,
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, email, source: 'rooftopatriverside.com' }),
      signal: controller.signal,
    });

    if (!res.ok) throw new Error(`Apps Script respondió ${res.status}`);

    const cuerpo = (await res.json().catch(() => null)) as { result?: string; error?: string } | null;
    if (cuerpo?.result === 'error') throw new Error(`Apps Script: ${cuerpo.error}`);
  } catch (err) {
    console.error('[newsletter] no se pudo guardar el alta:', err);
    return { status: 'error', message: 'Something went wrong. Please try again in a moment.' };
  } finally {
    clearTimeout(timeout);
  }

  return { status: 'ok', message: 'Thanks for subscribing!' };
}
