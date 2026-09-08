import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ButtonLink } from '@/components/shared/Button';
import PageHero from '@/components/shared/PageHero';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading } from '@/components/shared/Type';
import { EVENTS, eventBySlug, timeRange, whenLabel, type VenueEvent } from '@/content/events';
import { BRAND, addressLine } from '@/lib/brand';
import { breadcrumbJsonLd, jsonLdScript, pageMeta, SITE_URL } from '@/lib/seo';

/**
 * /whats-on/[slug] — un evento, una URL, renderizado en el servidor.
 *
 * Es literalmente el arreglo del error central: hoy ningún evento tiene URL
 * propia porque viven dentro de un iframe de terceros.
 */

export function generateStaticParams() {
  return EVENTS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = eventBySlug(slug);
  if (!event) return {};

  return pageMeta({
    title: `${event.title} — ${whenLabel(event)}`,
    description: event.summary,
    path: `/whats-on/${event.slug}`,
    ...(event.image
      ? {
          image: {
            url: event.image,
            width: 2400,
            height: 1600,
            alt: event.imageAlt ?? event.title,
          },
        }
      : {}),
  });
}

/**
 * JSON-LD `Event`, con `offers` cuando hay entrada.
 *
 * ⚠️ Los recurrentes se declaran con `eventSchedule` (`Schedule` de schema.org)
 * en vez de inventar un `startDate` puntual. Un evento semanal declarado con
 * una única fecha le miente a Google, que después muestra en el rich result
 * una fecha que ya pasó.
 */
function eventJsonLd(event: VenueEvent) {
  const location = {
    '@type': 'EventVenue',
    name: `${event.space} — ${BRAND.name}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BRAND.address.street,
      addressLocality: BRAND.address.locality,
      addressRegion: BRAND.address.region,
      postalCode: BRAND.address.postalCode,
      addressCountry: BRAND.address.country,
    },
  };

  const RRULE_DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.summary,
    url: `${SITE_URL}/whats-on/${event.slug}`,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location,
    organizer: { '@type': 'Organization', name: BRAND.name, url: SITE_URL },
    ...(event.image ? { image: [`${SITE_URL}${event.image}`] } : {}),
    ...(event.kind === 'recurring' && event.weekday !== null
      ? {
          eventSchedule: {
            '@type': 'Schedule',
            repeatFrequency: 'P1W',
            byDay: `https://schema.org/${RRULE_DAY[event.weekday]}`,
            startTime: event.startTime,
            endTime: event.endTime,
            scheduleTimezone: BRAND.address.timezone,
          },
        }
      : event.date
        ? { startDate: `${event.date}T${event.startTime}:00-05:00` }
        : {}),
    offers: {
      '@type': 'Offer',
      url: event.ticketUrl ?? `${SITE_URL}/whats-on/${event.slug}`,
      price: event.price ?? 0,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      ...(event.ticketUrl ? {} : { category: 'Free' }),
    },
  };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = eventBySlug(slug);
  if (!event) notFound();

  const isTicketed = Boolean(event.ticketUrl);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(eventJsonLd(event)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            breadcrumbJsonLd([
              { name: "What's On", path: '/whats-on' },
              { name: event.title, path: `/whats-on/${event.slug}` },
            ]),
          ),
        }}
      />

      <PageHero
        eyebrow={whenLabel(event)}
        title={event.title}
        lead={event.summary}
        image={event.image}
        imageAlt={event.imageAlt}
        crumbs={[
          { name: "What's On", path: '/whats-on' },
          { name: event.title, path: `/whats-on/${event.slug}` },
        ]}
      >
        <div className="flex flex-wrap items-center gap-[12px]">
          {isTicketed ? (
            <ButtonLink href={event.ticketUrl as string} variant="primary" size="lg" external>
              Get tickets
            </ButtonLink>
          ) : (
            <span className="inline-flex items-center rounded-btn bg-cream px-[16px] py-[12px] text-caption font-bold uppercase tracking-[0.14em]">
              Free · walk in
            </span>
          )}
          <ButtonLink href="/whats-on/calendar.ics" variant="secondary">
            Add to calendar
          </ButtonLink>
        </div>
      </PageHero>

      <Section band="lg">
        <div className="grid gap-[40px] lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-[64px]">
          <div>
            <Eyebrow tone="plum">What to expect</Eyebrow>
            <div className="mt-gap-bajada flex max-w-[62ch] flex-col gap-[14px] text-lead leading-[1.7] text-body/85">
              {event.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="mt-[32px] border-t border-ink/15 pt-[24px]">
              <p className="max-w-[60ch] text-[15px] leading-[1.65] text-body/70">
                Food comes from whichever trucks are in the yard that night — each takes its own
                orders. Drinks are at the Sunset Bar upstairs.
              </p>
            </div>
          </div>

          <aside className="lg:sticky lg:top-[110px] lg:self-start">
            <dl className="flex flex-col divide-y divide-ink/12 rounded-card border border-ink/12 px-[24px]">
              <div className="py-[18px]">
                <dt className="eyebrow text-body/60">When</dt>
                <dd className="mt-[6px] font-display text-d6 uppercase">{whenLabel(event)}</dd>
              </div>
              <div className="py-[18px]">
                <dt className="eyebrow text-body/60">Time</dt>
                <dd className="mt-[6px] text-[15px] tabular-nums">{timeRange(event)}</dd>
              </div>
              <div className="py-[18px]">
                <dt className="eyebrow text-body/60">Where</dt>
                <dd className="mt-[6px] text-[15px]">
                  {event.space}
                  <br />
                  <span className="text-body/65">{addressLine()}</span>
                </dd>
              </div>
              <div className="py-[18px]">
                <dt className="eyebrow text-body/60">Entry</dt>
                <dd className="mt-[6px] text-[15px]">
                  {isTicketed ? `Ticketed · $${event.price}` : 'Free, no ticket needed'}
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </Section>

      <Section tone="cream" band="md">
        <div className="flex flex-col items-start gap-[20px] sm:flex-row sm:items-center sm:justify-between">
          <Heading level={2} className="text-d5 lg:text-d4">
            The rest of the week
          </Heading>
          <ButtonLink href="/whats-on" variant="primary">
            Full calendar
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
