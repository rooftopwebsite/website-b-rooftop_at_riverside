import { createHmac, timingSafeEqual } from 'node:crypto';

export const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
export const MIN_SECRET_LENGTH = 32;

const PURPOSE = 'newsletter-confirm.v1';

export interface NewsletterClaims {
  readonly email: string;
  readonly firstName: string;
}

export type TokenCheck =
  | { readonly ok: true; readonly claims: NewsletterClaims }
  | { readonly ok: false; readonly reason: 'invalid' | 'expired' };

function mac(payload: string, secret: string): Buffer {
  return createHmac('sha256', secret).update(`${PURPOSE}.${payload}`).digest();
}

export function signToken(claims: NewsletterClaims, secret: string, now = Date.now()): string {
  if (secret.length < MIN_SECRET_LENGTH) throw new Error('Newsletter token secret is too short.');
  const payload = Buffer.from(
    JSON.stringify({ e: claims.email, n: claims.firstName, x: now + TOKEN_TTL_MS }),
  ).toString('base64url');
  return `${payload}.${mac(payload, secret).toString('base64url')}`;
}

export function verifyToken(token: string, secret: string, now = Date.now()): TokenCheck {
  if (secret.length < MIN_SECRET_LENGTH) return { ok: false, reason: 'invalid' };

  const parts = token.split('.');
  if (parts.length !== 2) return { ok: false, reason: 'invalid' };
  const [payload, sig] = parts as [string, string];

  const given = Buffer.from(sig, 'base64url');
  const expected = mac(payload, secret);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return { ok: false, reason: 'invalid' };
  }

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      e?: unknown;
      n?: unknown;
      x?: unknown;
    };
    if (typeof data.e !== 'string' || typeof data.n !== 'string' || typeof data.x !== 'number') {
      return { ok: false, reason: 'invalid' };
    }
    if (now > data.x) return { ok: false, reason: 'expired' };
    return { ok: true, claims: { email: data.e, firstName: data.n } };
  } catch {
    return { ok: false, reason: 'invalid' };
  }
}
