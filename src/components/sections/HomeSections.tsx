import { Marquee, RevealItem, StaggerGroup } from '@/components/shared/Motion';
import Section, { GUTTER } from '@/components/shared/Section';
import { SectionHead } from '@/components/shared/Type';
import { ArrowRight } from '@/components/shared/Icon';

export function HowThisPlaceWorks() {
  return (
    <section
      aria-labelledby="how-title"
      className="relative bg-bone grano pt-16 md:pt-20 lg:pt-24 desk:pt-30"
    >
      <StaggerGroup className="caja-ancha grid grid-cols-1 gap-7 lg:grid-cols-2 lg:gap-18">
        <RevealItem>
          <h2
            id="how-title"
            className="m-0 font-display text-[clamp(2.5rem,6vw,4.95rem)] font-extrabold uppercase leading-[0.9] text-ink"
          >
            Five businesses,{' '}
            <br />
            one set of stairs.
          </h2>
        </RevealItem>

        <RevealItem className="flex flex-col justify-between gap-4">
          <p className="m-0 font-body text-lead font-light text-ink">
            Four independent kitchens park in the yard, each one its own business. You order at the
            window and pay that truck. No table service, and the bar upstairs is ours.
          </p>
          <a
            href="#find-us"
            className="group inline-flex w-fit items-center gap-2.5 border-b-2 border-sunset pb-1 font-body text-dato font-medium text-ink transition-colors duration-200 hover:border-ink"
          >
            Come see it for yourself
            <ArrowRight className="size-3.75 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
        </RevealItem>
      </StaggerGroup>
    </section>
  );
}

export function ReviewsMarquee({
  reviews,
}: {
  readonly reviews: readonly { quote: string; author: string; source: string }[];
}) {
  if (reviews.length === 0) return null;

  return (
    <Section band="lg" labelledBy="reviews-title" width="full" className="px-0">
      <div className={GUTTER}>
        <div className="caja">
          <SectionHead
            eyebrow="What people say"
            id="reviews-title"
            title="Don't take our word for it"
          />
        </div>
      </div>
      <Marquee durationClassName="[--marquee-duration:45s]" className="mt-10" itemClassName="gap-5 pr-5">
        {reviews.map((r, i) => (
          <figure
            key={i}
            className="flex w-85 shrink-0 flex-col rounded-card border border-ink/12 p-6"
          >
            <blockquote className="flex-1 text-base leading-[1.65]">{r.quote}</blockquote>
            <figcaption className="mt-4 eyebrow text-body/75">
              {r.author} · {r.source}
            </figcaption>
          </figure>
        ))}
      </Marquee>
    </Section>
  );
}
