'use client';

import Link from 'next/link';
import { useActionState, useId } from 'react';
import { useFormStatus } from 'react-dom';
import { subscribeToNewsletter } from '@/app/actions/newsletter';
import type { ActionState } from '@/app/actions/types';
import { Button } from './Button';
import { Heading } from './Type';

const INITIAL: ActionState = { status: 'idle', message: '' };

const INPUT_BASE =
  'h-10.5 w-full rounded-pill border bg-paper px-[22px] font-body text-[16px] text-ink transition-colors placeholder:text-body/45 focus-visible:border-deep';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="onDark" size="lg" disabled={pending} className="w-full sm:w-auto">
      {pending ? 'Adding…' : 'Join'}
    </Button>
  );
}

export default function NewsletterSignup() {
  const [state, action] = useActionState(subscribeToNewsletter, INITIAL);
  const id = useId();
  const fid = (field: string) => `${id}-${field}`;

  const errors = state.fieldErrors ?? {};

  return (
    <section
      aria-labelledby={`${id}-title`}
      className="relative isolate overflow-hidden rounded-shell bg-teal600 card-shadow px-6 py-10 [--lead-ink:var(--color-paper)] sm:px-9 lg:px-12 lg:py-12"
    >
      <span aria-hidden="true" className="stone pointer-events-none absolute inset-0 -z-10" />
          <div className="grid items-center gap-9 md:grid-cols-[1fr_1.15fr] md:gap-10 lg:gap-16">
            <div>
              <Heading level={2} id={`${id}-title`} className="m-0 text-d3 text-paper">
                Sign up
              </Heading>
              <p className="subhead mt-gap-subhead max-w-[38ch] font-body text-lead font-light">
                Stay up to date with all the latest from Rooftop at Riverside.
              </p>
            </div>
            {state.status === 'ok' ? (
              <p
                role="status"
                className="rounded-card border border-paper/20 bg-deep px-6 py-5 font-body text-lead text-paper"
              >
                {state.message}
              </p>
            ) : (
              <form action={action} noValidate className="flex flex-col gap-3">
                <div className="flex flex-col gap-3 desk:flex-row desk:items-start">
                  <div className="flex-1">
                    <label htmlFor={fid('firstName')} className="sr-only">
                      First name
                    </label>
                    <input
                      id={fid('firstName')}
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      placeholder="First name"
                      aria-invalid={errors.firstName ? true : undefined}
                      aria-describedby={errors.firstName ? fid('firstName-err') : undefined}
                      className={`${INPUT_BASE} ${errors.firstName ? 'border-2 border-tomato' : 'border-ink/20'}`}
                    />
                  </div>

                  <div className="flex-1">
                    <label htmlFor={fid('email')} className="sr-only">
                      Email
                    </label>
                    <input
                      id={fid('email')}
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Email"
                      aria-invalid={errors.email ? true : undefined}
                      aria-describedby={errors.email ? fid('email-err') : undefined}
                      className={`${INPUT_BASE} ${errors.email ? 'border-2 border-tomato' : 'border-ink/20'}`}
                    />
                  </div>

                  <SubmitButton />
                </div>
                <div>
                  <label htmlFor={fid('consent')} className="flex items-start gap-3 font-body text-data text-paper">
                    <input
                      id={fid('consent')}
                      name="consent"
                      type="checkbox"
                      aria-invalid={errors.consent ? true : undefined}
                      aria-describedby={errors.consent ? fid('consent-err') : undefined}
                      className="mt-0.5 size-5 shrink-0 cursor-pointer accent-sunset"
                    />
                    <span>
                      Yes, email me news and events from Rooftop at Riverside. I can unsubscribe at any
                      time. See the{' '}
                      <Link href="/privacy-policy" className="link-text underline">
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>
                  {errors.consent ? (
                    <p id={fid('consent-err')} className="mt-1 font-body text-data text-paper">
                      {errors.consent}
                    </p>
                  ) : null}
                </div>
                <div className="sr-only" aria-hidden="true">
                  <label htmlFor={fid('website')}>Leave this empty</label>
                  <input id={fid('website')} name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>
                <p aria-live="polite" className="sr-only">
                  {state.status === 'error' ? state.message : ''}
                </p>

                {state.status === 'error' ? (
                  <div className="flex flex-col gap-1">
                    {errors.firstName ? (
                      <p id={fid('firstName-err')} className="font-body text-data text-paper">
                        {errors.firstName}
                      </p>
                    ) : null}
                    {errors.email ? (
                      <p id={fid('email-err')} className="font-body text-data text-paper">
                        {errors.email}
                      </p>
                    ) : null}
                    {!errors.firstName && !errors.email && !errors.consent ? (
                      <p className="font-body text-data text-paper">{state.message}</p>
                    ) : null}
                  </div>
                ) : null}

                <p className="subhead text-center font-body text-micro desk:text-left">
                  No spam. Unsubscribe any time.
                </p>
              </form>
            )}
      </div>
    </section>
  );
}
