import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ButtonLink } from '@/components/shared/Button';
import { HeroFadeUp } from '@/components/shared/Motion';
import Section from '@/components/shared/Section';
import { Accent, Eyebrow } from '@/components/shared/Type';

export const metadata: Metadata = {
  title: 'Page not found',
};

const RESCATE = [
  { label: 'Food trucks', href: '/food-trucks' },
  { label: 'Sunset Bar', href: '/sunset-bar' },
  { label: 'Hours and map', href: '/contact#find' },
] as const;

export default function NotFound() {
  return (
    <Section
      tone="bone"
      band="lg"
      labelledBy="not-found-title"
      className="flex min-h-[34rem] items-center"
      innerClassName="text-center"
    >
      <HeroFadeUp>
        <Eyebrow tone="terra" as="p" className="justify-center">
          Error: page not found
        </Eyebrow>
        <div
          aria-hidden="true"
          className="mt-gap-kicker flex items-center justify-center font-display text-[clamp(6rem,9vw,9rem)] leading-[0.85] font-extrabold uppercase text-deep"
        >
          <span>4</span>
          <span className="mx-[0.04em] inline-block w-[0.72em] rotate-6">
            <span className="sticker rt-flotar block">
              <Image
                src="/brand/sun-palm.svg"
                alt=""
                width={260}
                height={260}
                className="block h-auto w-full"
              />
            </span>
          </span>
          <span>4</span>
        </div>

        <h1
          id="not-found-title"
          className="m-0 mx-auto mt-gap-kicker max-w-[22ch] text-balance font-display text-banda font-extrabold uppercase leading-[0.9] text-ink"
        >
          Nothing&rsquo;s parked <Accent on="light">here</Accent>
        </h1>

        <p className="mx-auto mt-gap-bajada max-w-[52ch] font-body text-lead font-light leading-[1.55] text-body">
          The link may be from our old site, or the address has a typo. The bar,
          the trucks and the calendar are all still here.
        </p>

        <div className="mt-gap-cta flex flex-wrap justify-center gap-3">
          <ButtonLink href="/whats-on" variant="primary" size="lg">
            See What&rsquo;s On
          </ButtonLink>
          <ButtonLink href="/events" variant="outline" size="lg">
            Plan an Event
          </ButtonLink>
        </div>

        <nav aria-label="Other places to go" className="mt-gap-cta">
          <ul className="m-0 flex list-none flex-wrap justify-center gap-x-7 gap-y-2 p-0 font-body text-dato text-muted">
            {RESCATE.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="toque link-texto">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </HeroFadeUp>
    </Section>
  );
}
