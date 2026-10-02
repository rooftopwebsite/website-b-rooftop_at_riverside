export type ConfirmableForm = 'contact' | 'event-inquiry' | 'market-vendor' | 'musician' | 'job';

export interface FormConfirmation {
  readonly subject: string;
  readonly noun: string;
}

export const FORM_CONFIRMATIONS: Record<ConfirmableForm, FormConfirmation> = {
  contact: { subject: 'Got your message', noun: 'message' },
  'event-inquiry': { subject: 'Got your event request', noun: 'event request' },
  'market-vendor': { subject: 'Got your vendor request', noun: 'vendor request' },
  musician: { subject: 'Got your booking request', noun: 'booking request' },
  job: { subject: 'Got your application', noun: 'application' },
};

export function confirmationText(
  form: ConfirmableForm,
  { firstName, brandName }: { firstName?: string; brandName: string },
): string {
  return [
    firstName ? `Hi ${firstName},` : 'Hi there,',
    '',
    `Thanks for writing to us. Your ${FORM_CONFIRMATIONS[form].noun} came through, and someone from our team will get back to you as soon as we can.`,
    '',
    'Talk soon,',
    `The ${brandName} team`,
  ].join('\n');
}
