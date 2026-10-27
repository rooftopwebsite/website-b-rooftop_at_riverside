'use client';

import Link from 'next/link';
import { useVenue } from '@/components/shared/VenueProvider';
import { useState } from 'react';
import { submitContact } from '@/app/actions/contact';
import {
  FormShell,
  InlineField,
  InlineSelect,
  SentPanel,
  SentenceArea,
  SentenceRow,
  SubmitButton,
  useSubmission,
} from '@/components/form/Fields';
import { contactFromForm, contactSchema } from '@/lib/schemas/contact';
import { Eyebrow, Heading } from '@/components/shared/Type';
import { CONTACT_REASONS, reasonByValue } from '@/content/contact-reasons';

const LABELS: Record<string, string> = {
  name: 'Your name',
  email: 'Email',
  phone: 'Phone',
  reason: 'What is this about',
  message: 'Your message',
};

const SENTENCE = {
  name: 'My name is',
  reason: 'and it is about',
  email: 'You can reach me at',
  phone: 'or call me on',
  message: 'Here is the whole of it:',
};

export default function ContactForm() {
  const venue = useVenue();
  const submission = useSubmission(submitContact);
  const { state } = submission;
  const [reason, setReason] = useState('');

  const redirect = reasonByValue(reason)?.redirect;

  if (state.status === 'ok') {
    return (
      <SentPanel className="rounded-shell border border-ink/15 bg-cream p-[32px] lg:p-[40px]">
        <Eyebrow tone="deep">Message sent</Eyebrow>
        <Heading level={2} className="mt-gap-kicker text-d5 lg:text-d4">
          It landed
        </Heading>
        <p className="mt-gap-subhead max-w-[52ch] text-lead text-body/80">{state.message}</p>
        <p className="mt-3 max-w-[52ch] text-[16px] leading-[1.65] text-body/75">
          If it is urgent, calling is faster:{' '}
          <a href={venue.phoneHref} className="link-text font-bold">
            {venue.phone}
          </a>
          .
        </p>
      </SentPanel>
    );
  }

  return (
    <FormShell submission={submission} schema={contactSchema} fromForm={contactFromForm}>
      <div className="flex flex-col gap-[10px]">
        <SentenceRow>
          <InlineField name="name" label={SENTENCE.name} required autoComplete="name" />
        </SentenceRow>

        <SentenceRow>
          <InlineSelect
            name="reason"
            label={SENTENCE.reason}
            required
            placeholder="choose one"
            options={CONTACT_REASONS.map((r) => ({ value: r.value, label: r.label }))}
            onValueChange={setReason}
          />
        </SentenceRow>

        <SentenceRow>
          <InlineField name="email" label={SENTENCE.email} type="email" required autoComplete="email" />
        </SentenceRow>

        <SentenceRow>
          <InlineField
            name="phone"
            label={SENTENCE.phone}
            type="tel"
            autoComplete="tel"
          />
        </SentenceRow>
      </div>

      {redirect ? (
        <div role="status" className="rounded-shell border border-ink/15 bg-paper p-[24px]">
          <Heading level={3} role="card">
            This one has its own page
          </Heading>
          <p className="mt-[10px] max-w-[54ch] text-[16px] leading-[1.7] text-body/80">
            {redirect.why}
          </p>
          <p className="mt-[18px]">
            <Link
              href={redirect.href}
              className="inline-flex h-10.5 items-center justify-center whitespace-nowrap rounded-pill bg-sunset px-[28px] font-body text-cta font-bold tracking-cta text-ink transition-colors hover:bg-sunset-hover"
            >
              {redirect.cta}
            </Link>
          </p>
        </div>
      ) : (
        <>
          <SentenceArea name="message" label={SENTENCE.message} required rows={6} maxLength={4000} />
          <div className="mt-[8px] flex flex-col items-center gap-[12px]">
            <SubmitButton idle="Send message" busy="Sending…" />
            <p className="text-[15px] text-body/70">We answer within one business day.</p>
          </div>
        </>
      )}
    </FormShell>
  );
}
