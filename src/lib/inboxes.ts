import 'server-only';
import { BRAND } from './brand';

export type Inbox = 'contact' | 'events' | 'careers' | 'market' | 'booking';

const FALLBACK: Record<Inbox, string> = {
  contact: BRAND.contact.email,
  events: BRAND.contact.events,
  careers: BRAND.contact.hiring,
  market: BRAND.contact.email,
  booking: BRAND.contact.email,
};

const ENV: Record<Inbox, string> = {
  contact: 'MAIL_TO_CONTACT',
  events: 'MAIL_TO_EVENTS',
  careers: 'MAIL_TO_CAREERS',
  market: 'MAIL_TO_MARKET',
  booking: 'MAIL_TO_BOOKING',
};

function parse(raw: string | undefined): string[] {
  return (raw ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function inboxFor(box: Inbox): string[] {
  const deEnv = parse(process.env[ENV[box]]);
  return deEnv.length > 0 ? deEnv : [FALLBACK[box]];
}

export function publicInbox(box: Inbox): string {
  return inboxFor(box)[0]!;
}
