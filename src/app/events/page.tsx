import type { Metadata } from 'next';
import Image from 'next/image';
import EventSpaces from '@/components/sections/EventSpaces';
import EventTypes from '@/components/sections/EventTypes';
import InquiryForm from '@/components/sections/InquiryForm';
import { ButtonLink } from '@/components/shared/Button';
import CompareSlab from '@/components/shared/CompareSlab';
import FormSlab from '@/components/shared/FormSlab';
import { RevealItem, StaggerGroup } from '@/components/shared/Motion';
import PlateHero from '@/components/shared/PlateHero';
import Section from '@/components/shared/Section';
import SoftWave from '@/components/shared/SoftWave';
import { Eyebrow, Heading } from '@/components/shared/Type';
import {
  DRINK_OPTIONS,
  ENHANCEMENTS,
  ENHANCEMENTS_NOTE,
  EVENTS_PDF,
  FEES,
  FOOD_OPTIONS,
  RENTAL,
  RENTAL_DEPOSIT,
  RENTAL_MINIMUM_HOURS,
  SMALL_PARTY_MAX,
} from '@/content/events-pricing';
import { AREAS_OF_INTEREST } from '@/content/spaces';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';
import { getVenue } from '@/lib/venue';

export const metadata: Metadata = pageMeta({
  route: '/events',
  image: {
    url: '/og/events.jpg',
    width: 1200,
    height: 630,
    alt: 'Guests with name badges seated along the bar at a private event at Rooftop at Riverside',
  },
});

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string | string[] }>;
}) {
  const sp = await searchParams;
  const pedidas = sp.area === undefined ? [] : Array.isArray(sp.area) ? sp.area : [sp.area];
  const areas = pedidas.filter((a) => AREAS_OF_INTEREST.some((x) => x.value === a));

  const venue = await getVenue();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbJsonLd([{ name: 'Events', path: '/events' }])),
        }}
      />

      <PlateHero
        question="Looking for a private event venue in Bonita Springs?"
        title={'Your event, '}
        titleAccent="two stories up"
        lead="A rooftop bar, a gated yard and four independent kitchens in downtown Bonita Springs, across from Riverside Park."
        photo="/images/events/events-hero-wide.webp"
        photoAlt="Guests with name badges seated along the bar at a private event at Rooftop at Riverside"
      >
        <ButtonLink href="#inquire" variant="primary" size="lg">
          Take me to the form
        </ButtonLink>
        <ButtonLink href="#spaces" variant="secondary" size="lg">
          See the spaces
        </ButtonLink>
      </PlateHero>

      <EventTypes />
      <CompareSlab
        from="mint"
        id="how-events-work"
        eyebrow="How it works"
        accent="Not a ballroom."
        title="A venue with four kitchens"
        lead="We're a venue with a bar, not a caterer. Here's the honest split."
        ours={{
          label: 'Here',
          rows: [
            'Four independent kitchens in the yard, so nobody is handed a plate they did not choose',
            'The bar is ours and our team runs it: open bar, drink tickets or consumption',
            'A stage with sound already on it, and gates that close for a ticketed door',
            'One point of contact from the first email to load-out',
          ],
        }}
        theirs={{
          label: 'A ballroom',
          rows: [
            'One kitchen and one set menu: everyone eats from the same list',
            'The bar, the catering and the room are quoted as one package',
            'A stage, a PA and a DJ booth get rented in for the night',
            'The room, the caterer and the AV each come with their own contact',
          ],
        }}
      />
      <EventSpaces />
      <SoftWave from="cream" to="deep" className="relative -mb-px" />

      <Section tone="deep" band="lg" labelledBy="cost-title">
        <div className="mx-auto max-w-[46rem] text-center">
          <Eyebrow tone="cream" className="justify-center">
            What it costs
          </Eyebrow>
          <h2
            id="cost-title"
            className="m-0 mx-auto mt-gap-kicker max-w-[16ch] font-display text-banda font-extrabold uppercase"
          >
            <span className="text-paper">The numbers,</span>{' '}
            <span className="text-sunset">up front</span>
          </h2>
          <p className="mx-auto mt-gap-bajada max-w-[56ch] font-body text-lead font-light text-paper/85">
            Renting the second floor, the three ways to feed everyone, the three ways to run the
            bar, and the fees that ride along. No quote needed to read this.
          </p>
        </div>
        <StaggerGroup as="ul" className="mt-bloque grid list-none gap-5 p-0 lg:grid-cols-2">
          <RevealItem as="li" className="h-full">
            <article className="flex h-full flex-col rounded-shell bg-deeper p-7 lg:p-9">
              <Heading level={3} role="label" className="text-cream">
                Renting the second floor
              </Heading>
              <dl className="m-0 mt-6 grid gap-5 sm:grid-cols-2">
                {RENTAL.map((r) => (
                  <div key={r.days} className="border-t border-dashed border-bone/25 pt-4">
                    <dt className="font-body text-caption font-medium uppercase tracking-eyebrow text-muted-dark">
                      {r.days}
                    </dt>
                    <dd className="m-0 mt-2 font-display text-d2 font-extrabold leading-none tabular-nums text-sunset">
                      ${r.perHour.toLocaleString('en-US')}
                      <span className="ml-1.5 font-body text-caption font-medium tracking-normal text-paper/80">
                        / hour
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="m-0 mt-auto pt-6 font-body text-base font-light leading-[1.6] text-bone/85">
                {RENTAL_MINIMUM_HOURS} hour minimum
                {RENTAL_DEPOSIT ? ', and a deposit holds the date' : ''}. That is the second floor:
                the rooftop bar, the patio, or both.
              </p>
            </article>
          </RevealItem>

          {[
            { key: 'food', title: 'Three ways to feed everyone', rows: FOOD_OPTIONS },
            { key: 'drink', title: 'Three ways to run the bar', rows: DRINK_OPTIONS },
          ].map(({ key, title, rows }) => (
            <RevealItem as="li" key={key} className="h-full">
              <article className="flex h-full flex-col rounded-shell bg-deeper p-7 lg:p-9">
                <Heading level={3} role="label" className="text-cream">
                  {title}
                </Heading>
                <ul className="m-0 mt-2 flex list-none flex-col p-0 lg:flex-1">
                  {rows.map((r) => (
                    <li
                      key={r.slug}
                      className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-dashed border-bone/25 py-4 last:border-b-0 last:pb-0 lg:flex-1 lg:content-center"
                    >
                      <p className="m-0 flex-1 font-display text-d6 font-bold uppercase leading-none text-paper">
                        {r.name}
                      </p>
                      <p className="m-0 shrink-0 font-display text-d6 font-bold leading-none tabular-nums text-sunset">
                        {r.price ?? 'Ask'}
                      </p>
                      <p className="m-0 basis-full font-body text-base font-light leading-[1.55] text-bone/85">
                        {r.body}
                      </p>
                    </li>
                  ))}
                </ul>
              </article>
            </RevealItem>
          ))}

          <RevealItem as="li" className="h-full">
            <article className="flex h-full flex-col rounded-shell bg-deeper p-7 lg:p-9">
              <div className="flex h-full flex-col gap-5">
                <div>
                  <Heading level={3} role="label" className="text-cream">
                    Add-ons
                  </Heading>
                  <ul className="m-0 mt-5 flex list-none flex-wrap gap-2 p-0">
                    {ENHANCEMENTS.map((e) => (
                      <li
                        key={e.name}
                        className="rounded-pill bg-paper/10 px-4 py-1.5 font-body text-caption font-medium text-paper ring-1 ring-paper/20 ring-inset"
                      >
                        {e.name}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="m-0 mt-auto border-t border-dashed border-bone/25 pt-4 font-body text-base font-light leading-[1.6] text-bone/85">
                  {ENHANCEMENTS_NOTE}
                </p>
              </div>
            </article>
          </RevealItem>
          <RevealItem as="li" className="h-full lg:col-span-2">
            <article className="flex h-full flex-col rounded-shell bg-deeper p-7 lg:p-9">
              <Heading level={3} role="label" className="text-cream">
                On top of that
              </Heading>
              <dl className="m-0 mt-5 grid gap-x-12 sm:grid-cols-3">
                {FEES.map((f) => (
                  <div
                    key={f.label}
                    className="flex items-baseline justify-between gap-4 border-b border-dashed border-bone/25 py-3.5 sm:border-b-0 sm:border-t sm:pt-4"
                  >
                    <dt className="font-body text-base font-light text-bone/85">{f.label}</dt>
                    <dd className="m-0 font-display text-d6 font-bold leading-none tabular-nums text-sunset">
                      {f.amount}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          </RevealItem>
        </StaggerGroup>
      </Section>
      <Section band="lg" labelledBy="game-truck-title">
        <div
          id="game-truck"
          className="relative scroll-mt-24 rounded-frame bg-bone grano p-6 pb-10 sm:p-9 sm:pb-12 lg:p-12"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-3.5 rounded-shell border border-dashed border-deep/35"
          />
          <div className="relative grid items-center gap-7 sm:grid-cols-2 sm:items-stretch sm:gap-9 lg:gap-14">
            <div className="relative aspect-[4/3] overflow-hidden rounded-shell sombra-card sm:aspect-auto sm:h-full sm:min-h-64">
              <Image
                src="/images/game-truck/truck-night.webp"
                alt="Two guests in Rooftop shirts playing on the gaming truck screens at night"
                fill
                sizes="(min-width: 1024px) 40vw, (min-width: 640px) 45vw, 100vw"
                className="object-cover"
              />
            </div>

            <div className="self-center">
              <Eyebrow tone="magenta">Add-on</Eyebrow>
              <Heading
                level={2}
                id="game-truck-title"
                className="mt-gap-kicker max-w-[16ch] text-d4 md:text-d3 lg:text-d2"
              >
                Park a <span className="text-sunset-deep">gaming truck</span> in the yard
              </Heading>
              <p className="mt-5 max-w-[46ch] font-body text-lead font-light leading-[1.5] text-ink">
                A trailer of screens and consoles pulls into the yard, plugs in and runs on its own
                staff. The guests who would rather play than mingle have somewhere to go, and
                nobody from your party has to run it.
              </p>
              <div className="mt-8">
                <ButtonLink href="/game-truck" variant="dark">
                  See the truck
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </Section>
      <FormSlab
        id="inquire"
        tone="bone"
        panelTone="paper"
        band="lg"
        className="banda-arco z-[2]"
        eyebrow="Next step"
        eyebrowTone="terra"
        title="One screen, two minutes"
        titleId="inquire-title"
        lead="Send it over and you get real numbers back, within one business day."
        aside={
          <div className="flex flex-col gap-9 md:grid md:grid-cols-2 md:items-start md:gap-8 lg:flex">
            <div className="flex flex-col gap-1.5">
              <p className="font-body text-base font-bold leading-[1.5] text-ink">
                Fewer than {SMALL_PARTY_MAX} guests?
              </p>
              <p className="max-w-[34ch] font-body text-base font-light leading-[1.6] text-body/75">
                That is a reservation, not a buyout. Call or write and we sort it out without the
                form.
              </p>
              <a
                href={`mailto:${venue.emailEvents}`}
                className="link-texto mt-1.5 font-body text-base"
              >
                {venue.emailEvents}
              </a>
              <a href={venue.phoneHref} className="link-texto font-body text-base">
                {venue.phone}
              </a>
            </div>
            <div className="rounded-shell bg-mint p-6">
              <Eyebrow tone="deep">Download</Eyebrow>
              <Heading level={3} role="card" className="mt-2.5">
                The events packet
              </Heading>
              <p className="mt-2.5 font-body text-base font-light leading-[1.7] text-ink/80">
                Spaces, food options, enhancements and the small print, in one file you can forward
                to whoever signs off on it.
              </p>
              <div className="mt-5">
                <ButtonLink
                  href={EVENTS_PDF.href}
                  variant="primary"
                  size="md"
                  external
                  className="w-full justify-center"
                >
                  {EVENTS_PDF.label}
                </ButtonLink>
                <p className="mt-2 text-center font-body text-micro font-medium text-ink/70">
                  {EVENTS_PDF.format}, {EVENTS_PDF.size}
                </p>
              </div>
            </div>
          </div>
        }
      >
        <InquiryForm defaultAreas={areas} />
      </FormSlab>
    </>
  );
}
