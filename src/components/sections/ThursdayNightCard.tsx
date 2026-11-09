import { ButtonLink } from '@/components/shared/Button';
import { Martini } from '@/components/shared/Icon';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading } from '@/components/shared/Type';

export default function ThursdayNightCard({ href }: { readonly href: string }) {
  return (
    <Section band="sm" bandTop="none" labelledBy="tnf-title" className="pt-8 lg:pt-12">
      <div
        id="thursday-night-football"
        className="relative scroll-mt-28 overflow-hidden rounded-frame bg-deep grain px-7 py-10 text-center text-paper card-shadow sm:px-12 sm:py-12 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:px-16 lg:py-14 lg:text-left">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-3.5 rounded-shell border border-dashed border-paper/25"
        />
        <Martini
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -bottom-12 size-56 rotate-12 text-paper/[0.07] lg:size-72"
        />
        <div className="relative">
          <Eyebrow tone="cream">Every Thursday of the season</Eyebrow>
          <Heading
            level={2}
            id="tnf-title"
            className="m-0 mt-3 text-d3 leading-[0.98] text-paper sm:text-d2 lg:text-d1"
          >
            Thursday Night Football
          </Heading>
          <p className="mx-auto mt-4 max-w-[44ch] font-body text-lead font-light text-bone lg:mx-0">
            Cold drinks, big screens and a full game-day atmosphere. Grab a seat and make a night of
            it.
          </p>
        </div>
        <div className="relative mt-7 flex flex-col items-center gap-5 lg:mt-0 lg:shrink-0 lg:items-end">
          <span className="block w-max max-w-full shrink-0 whitespace-nowrap rounded-pill bg-sunset px-6 py-3.5 font-display text-d5 font-extrabold uppercase leading-none text-ink sm:text-d4 lg:text-d3">
            Open Until Midnight
          </span>
          <ButtonLink href={href} variant="onDark" size="lg" scroll={false}>
            See Thursday’s event
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
