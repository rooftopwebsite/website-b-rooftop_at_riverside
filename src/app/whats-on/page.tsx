import type { Metadata } from 'next';
import MonthBar from '@/components/sections/MonthBar';
import MonthCalendar from '@/components/sections/MonthCalendar';
import UpcomingCards from '@/components/sections/UpcomingCards';
import { ButtonLink } from '@/components/shared/Button';
import PlateHero from '@/components/shared/PlateHero';
import Section from '@/components/shared/Section';
import { Heading } from '@/components/shared/Type';
import {
  activeFilters,
  getVenueEvents,
  isTicketed,
  matchesFilter,
} from '@/content/events';
import { GAME_DAY_DEALS, GAME_DAY_LABEL } from '@/content/game-day';
import { getVenue, venueAddressLine } from '@/lib/venue';
import {
  type CalendarView,
  diaSiguiente,
  monthGrid,
  monthKey,
  monthLabel,
  monthLabelShort,
  occurrencesByDate,
  occurrencesInMonth,
  parseMonth,
  parseView,
  shiftMonth,
  todayInVenue,
  upcomingInMonth,
} from '@/lib/calendar';
import { SITE_URL, breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  route: "/whats-on",
});

export default async function WhatsOnPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; type?: string; view?: string }>;
}) {
  const sp = await searchParams;
  const { year, month } = parseMonth(sp.month);
  const type = sp.type ?? null;
  const view = parseView(sp.view);
  const hoy = todayInVenue();

  const venue = await getVenue();
  const eventos = await getVenueEvents();
  const filtros = activeFilters(eventos);

  const occurrences = occurrencesInMonth(eventos, year, month).filter((o) =>
    matchesFilter(o.event, type),
  );
  const grid = monthGrid(year, month);
  const eventsByDate = occurrencesByDate(occurrences);

  const delGrid = upcomingInMonth(eventos, year, month, hoy).filter((o) =>
    matchesFilter(o.event, type),
  );

  const prev = shiftMonth(year, month, -1);
  const next = shiftMonth(year, month, 1);
  const label = monthLabel(year, month);

  const href = (
    m: { year: number; month: number },
    t: string | null = type,
    v: CalendarView = view,
  ) =>
    `/whats-on?month=${monthKey(m.year, m.month)}${t ? `&type=${t}` : ''}${
      v === 'calendar' ? '&view=calendar' : ''
    }`;

  const vacio = view === 'grid' ? delGrid.length === 0 : occurrences.length === 0;
  const mesPasado = view === 'grid' && occurrences.length > 0 && delGrid.length === 0;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbJsonLd([{ name: "What's On", path: '/whats-on' }])),
        }}
      />
      {occurrences.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdScript(
              occurrences.map(({ date, event }) => ({
                '@context': 'https://schema.org',
                '@type': 'Event',
                name: event.title,
                description: event.summary,
                startDate: `${date}T${event.startTime}:00`,
                ...(event.endTime !== event.startTime
                  ? { endDate: `${event.endsNextDay ? diaSiguiente(date) : date}T${event.endTime}:00` }
                  : {}),
                organizer: { '@type': 'Organization', name: venue.name, url: SITE_URL },
                eventStatus: 'https://schema.org/EventScheduled',
                eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
                location: {
                  '@type': 'Place',
                  name: `${event.space}, ${venue.name}`,
                  address: venueAddressLine(venue),
                },
                ...(event.image ? { image: event.image } : {}),
                ...(isTicketed(event)
                  ? {
                      offers: {
                        '@type': 'Offer',
                        url: event.ticketUrl,
                        availability: 'https://schema.org/InStock',
                      },
                    }
                  : {}),
              })),
            ),
          }}
        />
      ) : null}

      <PlateHero
        question="Looking for live music tonight in Bonita Springs?"
        title={"What's on "}
        titleAccent="this week"
        lead="Life is too short for boring weeknights. Live music, Bingo, NFC North prizes and Wooftop Wednesdays, with the people (and pets!) you love most."
        photo="/images/venue/whats-on-yard-wide.webp"
        photoAlt="A full yard on an event afternoon: long table, tent and people under the umbrellas"
      >
        <ButtonLink href="#cal-title" variant="primary" size="lg">
          See the calendar
        </ButtonLink>
      </PlateHero>
      <div>
        <MonthBar
          label={label}
          labelShort={monthLabelShort(year, month)}
          titleId="cal-title"
          prev={{ href: href(prev), label: `Previous month, ${monthLabel(prev.year, prev.month)}` }}
          next={{ href: href(next), label: `Next month, ${monthLabel(next.year, next.month)}` }}
          view={view}
          viewHref={(v) => href({ year, month }, type, v)}
          filters={[{ id: null as string | null, label: 'Everything' }, ...filtros].map((f) => ({
            id: f.id ?? null,
            label: f.label,
            href: href({ year, month }, f.id ?? null),
            current: (f.id ?? null) === type,
          }))}
        />
        <Section band="md" bandTop="sm" labelledBy="cal-title">
        {vacio ? (
          <div className="mt-bloque max-w-[58ch]">
            <Heading level={3} role="card">
              {mesPasado
                ? `${label} has already been and gone`
                : type
                  ? 'Nothing of that kind this month'
                  : `Nothing on the books for ${label} yet`}
            </Heading>
            <p className="mt-[10px] text-[16px] leading-[1.7] text-body/80">
              {mesPasado
                ? 'The grid only shows what is still to come. Switch to the calendar to look back at the month, or jump forward with the arrows.'
                : type
                  ? `Clear the filter to see everything on in ${label}.`
                  : 'The calendar for the coming month usually lands around the 10th.'}
            </p>
            <div className="mt-[20px] flex flex-wrap gap-[12px]">
              {type ? (
                <ButtonLink href={href({ year, month }, null)} variant="primary" scroll={false}>
                  See everything
                </ButtonLink>
              ) : null}
              <ButtonLink href={href(next)} variant="secondary" scroll={false}>
                Try {monthLabel(next.year, next.month)}
              </ButtonLink>
            </div>
          </div>
        ) : view === 'grid' ? (
          <UpcomingCards
            items={delGrid}
            today={hoy}
            deals={GAME_DAY_DEALS}
            dealsLabel={GAME_DAY_LABEL}
          />
        ) : (
          <div className="mt-[20px] rounded-frame border border-ink/12 bg-paper p-[18px] pt-[8px] sombra-card lg:mt-[28px] lg:p-[32px] lg:pt-[16px]">
            <MonthCalendar
              grid={grid}
              eventsByDate={eventsByDate}
              label={label}
              today={hoy}
              venueName={venue.name}
            />
          </div>
        )}
        </Section>
      </div>
    </>
  );
}
