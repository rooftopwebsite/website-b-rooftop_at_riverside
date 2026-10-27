const REQUIRED = [
  'RESEND_API_KEY',
  'RESEND_FROM',
  'MAIL_TO_CONTACT',
  'MAIL_TO_EVENTS',
  'MAIL_TO_CAREERS',
  'MAIL_TO_MARKET',
  'MAIL_TO_BOOKING',
  'NEWSLETTER_SHEETS_WEBHOOK_URL',
] as const;

export function register(): void {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const missing = REQUIRED.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    console.warn(`[env] Missing variables: ${missing.join(', ')}. The site still starts with its fallbacks.`);
  }
}
