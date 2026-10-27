'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Button, ButtonLink } from '@/components/shared/Button';
import Section from '@/components/shared/Section';
import { Accent, Eyebrow } from '@/components/shared/Type';

const RESCUE_LINKS = [
  { label: 'Food trucks', href: '/food-trucks' },
  { label: 'Sunset Bar', href: '/sunset-bar' },
  { label: 'Hours and map', href: '/contact#find' },
] as const;

export default function ErrorPage({
  error,
  retry,
}: {
  readonly error: Error & { digest?: string };
  readonly retry: () => void;
}) {
  useEffect(() => {
    console.error('[error.tsx]', error.digest ?? error.message);
  }, [error]);

  return (
    <Section
      tone="bone"
      band="lg"
      labelledBy="error-title"
      className="flex min-h-[34rem] items-center"
      innerClassName="text-center"
    >
      <Eyebrow tone="terra" as="p" className="justify-center">
        Error: something went wrong
      </Eyebrow>

      <h1
        id="error-title"
        className="m-0 mx-auto mt-gap-kicker max-w-[22ch] text-balance font-display text-band font-extrabold uppercase leading-[0.9] text-ink"
      >
        This page took a <Accent on="light">detour</Accent>
      </h1>

      <p className="mx-auto mt-gap-subhead max-w-[52ch] font-body text-lead font-light leading-[1.55] text-body">
        Something on our side did not load. Try again in a moment. The bar, the
        trucks and the calendar are all still here.
      </p>

      <div className="mt-gap-cta flex flex-wrap justify-center gap-3">
        <Button type="button" variant="primary" size="lg" onClick={() => retry()}>
          Try again
        </Button>
        <ButtonLink href="/whats-on" variant="outline" size="lg">
          See What&rsquo;s On
        </ButtonLink>
      </div>

      <nav aria-label="Other places to go" className="mt-gap-cta">
        <ul className="m-0 flex list-none flex-wrap justify-center gap-x-7 gap-y-2 p-0 font-body text-data text-muted">
          {RESCUE_LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="hit-area link-text">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Section>
  );
}
