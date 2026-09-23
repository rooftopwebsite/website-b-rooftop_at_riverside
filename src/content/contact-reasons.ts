export interface ContactReason {
  readonly value: string;
  readonly label: string;
  readonly redirect?: { readonly href: string; readonly cta: string; readonly why: string };
}

export const CONTACT_REASONS: readonly ContactReason[] = [
  { value: 'general', label: 'General question' },
  {
    value: 'private-events',
    label: 'Private events',
    redirect: {
      href: '/events',
      cta: 'Plan an event',
      why: 'Event requests go through a form that asks for your date, guest count and food tier, so we can answer with real numbers instead of a follow up question.',
    },
  },
  {
    value: 'market',
    label: 'Neighborhood Market',
    redirect: {
      href: '/market',
      cta: 'Apply for a booth',
      why: 'Booth requests go through the market page, where the terms and the booth size are written out before you apply.',
    },
  },
  { value: 'careers', label: 'Working here' },
  { value: 'press', label: 'Press' },
  { value: 'other', label: 'Something else' },
] as const;

export const CONTACT_REASON_VALUES = CONTACT_REASONS.map((r) => r.value) as [string, ...string[]];

export const reasonByValue = (v: string): ContactReason | undefined =>
  CONTACT_REASONS.find((r) => r.value === v);
