import { CROSS_PADDING } from '@/components/shared/CompareSlab';
import { RevealItem, StaggerGroup } from '@/components/shared/Motion';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading } from '@/components/shared/Type';
import { BUYOUT_OPTIONS } from '@/content/spaces';

export default function EventSpaces() {
  return (
    <div>
      <Section
        tone="cream"
        band="lg"
        bandTop="none"
        innerClassName={CROSS_PADDING}
        labelledBy="spaces"
        className="band-arc z-[2] pb-closing"
      >
        <h2
          id="spaces"
          className="mx-auto max-w-[14ch] scroll-mt-28 text-center font-display text-band font-extrabold uppercase"
        >
          <span className="text-ink">Pick the space</span>{' '}
          <span className="text-sunset-deep">that fits</span>
        </h2>
        <p className="subhead mx-auto mt-gap-subhead max-w-[56ch] text-center text-body/80">
          Whatever the occasion, we have a space to make it yours. Book the whole place, the second
          floor or the rooftop patio, and set the scene for celebrations, gatherings, corporate
          events and everything in between.
        </p>
        <StaggerGroup as="ul" className="mt-block grid list-none gap-5 p-0 md:grid-cols-3">
          {BUYOUT_OPTIONS.map((o) => (
            <RevealItem as="li" key={o.slug} className="h-full">
              <article className="relative flex h-full flex-col gap-2.5 rounded-shell bg-paper p-7 card-shadow lg:p-9">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-3.5 rounded-shell border border-dashed border-deep/35"
                />
                <Eyebrow tone="terra">{o.label}</Eyebrow>
                <Heading level={3} className="m-0 text-d5 leading-[1.02] text-ink">
                  {o.title}
                </Heading>
                <p className="m-0 font-body text-base font-light leading-[1.6] text-body/80">
                  {o.body}
                </p>
              </article>
            </RevealItem>
          ))}
        </StaggerGroup>
      </Section>
    </div>
  );
}
