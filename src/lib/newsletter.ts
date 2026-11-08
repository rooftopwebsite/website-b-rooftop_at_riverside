import 'server-only';
import { fetchWithTimeout } from './http';
import { mailjetAuth, sendMail } from './mail';
import { signToken, verifyToken, type NewsletterClaims, type TokenCheck } from './newsletter-token';
import { prune } from './sanitize';
import { SITE_URL } from './seo';

const TIMEOUT_MS = 10_000;
const EMAIL_WINDOW_MS = 10 * 60 * 1000;
const MAX_KEYS = 1000;
const SENT = new Map<string, number[]>();

function secret(): string | null {
  return process.env.NEWSLETTER_TOKEN_SECRET || null;
}

function baseUrl(): string {
  return (process.env.NEWSLETTER_LINK_BASE_URL || SITE_URL).replace(/\/+$/, '');
}

export function newsletterConfigured(): boolean {
  return Boolean(mailjetAuth() && process.env.MAILJET_CONTACT_LIST_ID && secret());
}

export function checkNewsletterToken(token: string): TokenCheck {
  const key = secret();
  if (!key) return { ok: false, reason: 'invalid' };
  return verifyToken(token, key);
}

function alreadySentRecently(email: string, now: number): boolean {
  const key = email.toLowerCase();
  prune(SENT, now, EMAIL_WINDOW_MS, MAX_KEYS);
  const recent = (SENT.get(key) ?? []).filter((t) => now - t < EMAIL_WINDOW_MS);
  if (recent.length > 0) {
    SENT.set(key, recent);
    return true;
  }
  recent.push(now);
  SENT.set(key, recent);
  return false;
}

export type ConfirmationEmail = 'sent' | 'throttled' | 'failed';

export async function sendConfirmationEmail(claims: NewsletterClaims): Promise<ConfirmationEmail> {
  const key = secret();
  if (!key) {
    console.error('[newsletter] NEWSLETTER_TOKEN_SECRET is missing; no confirmation email was sent.');
    return 'failed';
  }
  if (alreadySentRecently(claims.email, Date.now())) return 'throttled';

  const link = `${baseUrl()}/newsletter/confirm?token=${signToken(claims, key)}`;
  const res = await sendMail({
    to: claims.email,
    subject: 'Confirm your subscription',
    text: [
      `Hi ${claims.firstName},`,
      '',
      'Thanks for signing up for news and events from Rooftop at Riverside.',
      'Confirm your subscription by opening this link and pressing the button:',
      '',
      link,
      '',
      'The link works for 24 hours. If you did not ask for this, ignore this email and we will not add you to the list.',
      '',
      'The Rooftop at Riverside team',
    ].join('\n'),
  });
  if (!res.ok) {
    SENT.delete(claims.email.toLowerCase());
    return 'failed';
  }
  return 'sent';
}

export async function addSubscriber({ email, firstName }: NewsletterClaims): Promise<boolean> {
  const auth = mailjetAuth();
  const listId = process.env.MAILJET_CONTACT_LIST_ID;
  if (!auth || !listId || !/^\d+$/.test(listId)) {
    console.error('[newsletter] Mailjet credentials or MAILJET_CONTACT_LIST_ID are not configured.');
    return false;
  }

  try {
    const res = await fetchWithTimeout(
      `https://api.mailjet.com/v3/REST/contactslist/${listId}/managecontact`,
      {
        method: 'POST',
        headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email: email, Name: firstName, Action: 'addnoforce' }),
      },
      { ms: TIMEOUT_MS },
    );
    if (!res.ok) {
      console.error('[newsletter] Mailjet could not add the contact:', res.status, await res.text());
      return false;
    }
    console.info(JSON.stringify({ event: 'newsletter.subscribed' }));
    return true;
  } catch (err) {
    console.error('[newsletter] Exception while adding the contact:', err);
    return false;
  }
}
