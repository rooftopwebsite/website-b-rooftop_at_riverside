import type { Metadata } from 'next';
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
  EVENTS_PDF,
  FOOD_OPTIONS,
  RENTAL_MINIMUM_HOURS,
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
    alt: 'Five friends in matching orange curly wigs and bright tropical outfits, laughing together at a night party at Rooftop at Riverside',
  },
});

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string | string[] }>;
}) {
  const sp = await searchParams;
  const requested = sp.area === undefined ? [] : Array.isArray(sp.area) ? sp.area : [sp.area];
  const areas = requested.filter((a) => AREAS_OF_INTEREST.some((x) => x.value === a));

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
        title={'The party they '}
        titleAccent="talk about"
        lead="Life gives us plenty of reasons to celebrate, and we're here for all of them. From casual get-togethers to unforgettable milestones, Rooftop at Riverside offers a one-of-a-kind setting in the heart of Downtown Bonita Springs. With flexible event spaces, a lively atmosphere, and customizable experiences, we'll help you create a celebration that's uniquely yours."
        photo="/images/events/events-hero.webp"
        photoMobileRatio="landscape"
        photoMobile="/images/events/events-hero-mobile.webp"
        photoKeepFaces
        photoAlt="Five friends in matching orange curly wigs and bright tropical outfits, laughing together at a night party at Rooftop at Riverside"
      >
        <ButtonLink href="#inquire" variant="primary" size="lg">
          Take me to the form
        </ButtonLink>
        <ButtonLink href="#spaces" variant="secondary" size="lg">
          More Information
        </ButtonLink>
      </PlateHero>

      <EventTypes />
      <CompareSlab
        from="mint"
        id="why-rooftop"
        accent="Why"
        title="Rooftop?"
        cta={{ label: 'Start planning', href: '#inquire' }}
        lead="Give your next event a setting that guests will remember. With a unique atmosphere, flexible spaces, and a rooftop experience that sets the scene, Rooftop is the perfect place to bring people together. Whether you're celebrating, connecting, or simply creating a great night, we make it easy to host an event that feels special from start to finish."
        ours={{
          label: 'Why Rooftop',
          rows: [
            'Gourmet food trucks in the Yard and a selection of preferred caterers, so there are plenty of ways to make your event deliciously your own.',
            'Full-service bar featuring refreshing drinks, cocktails, and our team to help with whatever you need.',
            "Two stages. The main stage downstairs in the Yard and the upstairs stage at the Rooftop Bar. There's plenty of room for live music, performances, and more.",
            'One point of contact from start to finish. Coordinating details and connecting you with the right people, planning is seamless from start to finish.',
          ],
        }}
      />
      <EventSpaces />
      <SoftWave from="cream" to="deep" className="relative -mb-px" />

      <Section tone="deep" band="lg" labelledBy="options-title">
        <div className="mx-auto max-w-[46rem] text-center">
          <Eyebrow tone="cream" className="justify-center">
            Your Event, Your Way
          </Eyebrow>
          <h2
            id="options-title"
            className="m-0 mx-auto mt-gap-kicker max-w-[16ch] font-display text-band font-extrabold uppercase"
          >
            <span className="text-paper">Ways to</span>{' '}
            <span className="text-sunset">Make It Yours</span>
          </h2>
          <p className="mx-auto mt-gap-subhead max-w-[56ch] font-body text-lead font-light text-paper/85">
            From food and bar options to those little extras that make an event your own, we&rsquo;ll help you put together a celebration that fits what you have in mind.
          </p>
        </div>
        <StaggerGroup as="ul" className="mt-block grid list-none gap-5 p-0 lg:grid-cols-2">
          {[
            { key: 'food', title: 'Ways to feed everyone', rows: FOOD_OPTIONS },
            { key: 'drink', title: 'Ways to run the bar', rows: DRINK_OPTIONS },
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
                      <p className="m-0 basis-full font-body text-base font-light leading-[1.55] text-bone/85">
                        {r.body}
                      </p>
                    </li>
                  ))}
                </ul>
              </article>
            </RevealItem>
          ))}

          <RevealItem as="li" className="h-full lg:col-span-2">
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
              </div>
            </article>
          </RevealItem>
        </StaggerGroup>
        <p className="m-0 mt-8 text-center font-body text-base font-light text-bone/85">
          {RENTAL_MINIMUM_HOURS} hour minimum upstairs.
        </p>
      </Section>
      <FormSlab
        id="inquire"
        tone="bone"
        panelTone="paper"
        band="lg"
        className="band-arc z-[2]"
        eyebrow="Next step"
        eyebrowTone="terra"
        title="Tell us about your party"
        titleId="inquire-title"
        lead="Tell us a little about your event, and we'll be in touch to go over the details, availability, and pricing."
        aside={
          <div
            className={
              EVENTS_PDF
                ? 'flex flex-col gap-9 md:grid md:grid-cols-2 md:items-start md:gap-8 lg:flex'
                : 'flex flex-col gap-9'
            }
          >
            <div className="flex flex-col gap-1.5">
              <p className="font-body text-base font-bold leading-[1.5] text-ink">
                Smaller Crew? We&rsquo;ve Got You!
              </p>
              <p className="max-w-[34ch] font-body text-base font-light leading-[1.6] text-body/75">
                Celebrating with fewer than 20 guests? Ask about reserving a section at Rooftop at
                Riverside! It&rsquo;s a great option for smaller gatherings that don&rsquo;t need the
                entire space. Feel free to give us a call, send an email, or fill out the inquiry
                form, whichever works best for you.
              </p>
              <a
                href={`mailto:${venue.emailEvents}`}
                className="link-text mt-1.5 font-body text-base"
              >
                {venue.emailEvents}
              </a>
              <a href={venue.phoneHref} className="link-text font-body text-base">
                {venue.phone}
              </a>
            </div>
            {EVENTS_PDF ? (
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
            ) : null}
          </div>
        }
      >
        <InquiryForm defaultAreas={areas} />
      </FormSlab>

      <Section tone="mint" band="lg" labelledBy="plan-event-title">
        <div className="mx-auto max-w-[40rem] text-center">
          <Heading level={2} id="plan-event-title" className="text-band text-ink">
            Let&rsquo;s Plan Your Event
          </Heading>
          <p className="mx-auto mt-gap-subhead max-w-[48ch] text-pretty font-body text-lead font-light text-body/85">
            Tell us a little about what you&rsquo;re planning, and we&rsquo;ll help you explore the
            options for your celebration.
          </p>
          <div className="mt-8 flex justify-center">
            <ButtonLink href="#inquire" variant="primary" size="lg">
              Inquire About Pricing
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
