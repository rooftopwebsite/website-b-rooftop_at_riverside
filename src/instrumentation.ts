const REQUERIDAS = [
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
  const faltan = REQUERIDAS.filter((nombre) => !process.env[nombre]);
  if (faltan.length > 0) {
    console.warn(`[env] Faltan variables: ${faltan.join(', ')}. El sitio arranca igual con sus respaldos.`);
  }
}
