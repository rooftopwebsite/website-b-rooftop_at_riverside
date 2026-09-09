import type { Metadata } from 'next';
import Link from 'next/link';
import { ButtonLink } from '@/components/shared/Button';
import PageHero from '@/components/shared/PageHero';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading } from '@/components/shared/Type';
import { type VenueEvent, timeRange } from '@/content/events';
import {
  dayNumber,
  groupByDay,
  longDate,
  monthGrid,
  monthKey,
  monthLabel,
  occurrencesInMonth,
  parseMonth,
  shiftMonth,
} from '@/lib/calendar';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  route: "/whats-on",
});

/**
 * /whats-on — el producto principal del venue.
 *
 * ⚠️ Todo esto se renderiza EN EL SERVIDOR. Es el error central que estamos
 * corrigiendo: el calendario actual es un iframe de un tercero que no devuelve
 * un solo nombre de evento en el HTML servido. Google no indexa nada.
 *
 * ⚠️ La navegación por mes va por QUERY STRING (`?month=2026-10`) y no por
 * estado de cliente, para que cada mes sea una URL que se puede compartir,
 * marcar y —lo importante— rastrear.
 */

const WEEKDAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export default async function WhatsOnPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; view?: string }>;
}) {
  const sp = await searchParams;
  const { year, month } = parseMonth(sp.month);
  const view = sp.view === 'month' ? 'month' : 'list';

  const occurrences = occurrencesInMonth(year, month);
  const byDay = groupByDay(occurrences);
  const grid = monthGrid(year, month);
  const eventsByDate = new Map(byDay.map((d) => [d.date, d.events]));

  const prev = shiftMonth(year, month, -1);
  const next = shiftMonth(year, month, 1);
  const label = monthLabel(year, month);

  const href = (m: { year: number; month: number }, v: string) =>
    `/whats-on?month=${monthKey(m.year, m.month)}&view=${v}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbJsonLd([{ name: "What's On", path: '/whats-on' }])),
        }}
      />

      <PageHero
        eyebrow="The calendar"
        title={"What's on this week"}
        lead="Live music five nights a week, Bingo on Wednesdays, and the dogs get their own day. Most of it is free."
        crumbs={[{ name: "What's On", path: '/whats-on' }]}
      >
        <div className="flex flex-wrap gap-[12px]">
          <ButtonLink href="/whats-on/calendar.ics" variant="secondary">
            Download iCal
          </ButtonLink>
          <ButtonLink
            href="https://calendar.google.com/calendar/r?cid=webcal://rooftopatriverside.com/whats-on/calendar.ics"
            variant="secondary"
            external
          >
            Add to Google Calendar
          </ButtonLink>
        </div>
      </PageHero>

      <Section band="md" labelledBy="cal-title">
        {/* ── Barra de navegación del mes ─────────────────────────────── */}
        <div className="flex flex-col gap-[16px] border-y border-ink/15 py-[16px] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-[12px]">
            <Link
              href={href(prev, view)}
              rel="prev"
              className="grid h-[40px] w-[40px] place-items-center rounded-btn border border-ink/20 transition-colors hover:border-ink hover:bg-ink hover:text-paper"
            >
              <span className="sr-only">Previous month, {monthLabel(prev.year, prev.month)}</span>
              <svg width="9" height="14" viewBox="0 0 9 14" fill="none" aria-hidden="true">
                <path d="M8 1L2 7l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Heading level={2} id="cal-title" className="text-d5 lg:text-d4">
              {label}
            </Heading>
            <Link
              href={href(next, view)}
              rel="next"
              className="grid h-[40px] w-[40px] place-items-center rounded-btn border border-ink/20 transition-colors hover:border-ink hover:bg-ink hover:text-paper"
            >
              <span className="sr-only">Next month, {monthLabel(next.year, next.month)}</span>
              <svg width="9" height="14" viewBox="0 0 9 14" fill="none" aria-hidden="true">
                <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {/* Conmutador de vista. Son LINKS, no botones: cada vista es una URL. */}
          <div className="flex items-center gap-[2px] rounded-btn border border-ink/20 p-[3px]">
            {(['list', 'month'] as const).map((v) => (
              <Link
                key={v}
                href={href({ year, month }, v)}
                aria-current={view === v ? 'true' : undefined}
                className={[
                  'rounded-btn px-[16px] py-[7px] text-caption font-bold uppercase tracking-[0.12em] transition-colors',
                  view === v ? 'bg-ink text-paper' : 'text-ink/60 hover:text-ink',
                ].join(' ')}
              >
                {v === 'list' ? 'List' : 'Month'}
              </Link>
            ))}
          </div>
        </div>

        {occurrences.length === 0 ? (
          <p className="mt-[40px] text-lead text-body/75">
            Nothing on the books for {label} yet. The calendar for next month lands around the 10th.
          </p>
        ) : view === 'list' ? (
          <ListView days={byDay} />
        ) : (
          <MonthView grid={grid} eventsByDate={eventsByDate} label={label} />
        )}
      </Section>

      {/* ── Nota sobre los recurrentes ─────────────────────────────────── */}
      <Section tone="cream" band="md">
        <div className="grid gap-[28px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-[64px]">
          <Heading level={2} className="text-d5 lg:text-d4">
            The standing lineup
          </Heading>
          <div className="flex flex-col gap-[12px] text-[16px] leading-[1.7] text-body/80">
            <p>
              Most of what&rsquo;s here repeats every week — Wooftop Wednesdays, Bingo Night, Ross
              Brown on Thursdays, DJ David Cast on Saturdays. One-off shows and festivals show up on
              the month they happen.
            </p>
            <p>
              Ticketed shows run in The Yard and sell through Eventbrite. Everything else is free
              and you just walk in.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}

/* ==========================================================================
   Vistas
   ========================================================================== */

function ListView({
  days,
}: {
  readonly days: readonly { date: string; events: readonly { event: VenueEvent }[] }[];
}) {
  return (
    <div className="mt-[32px] flex flex-col">
      {days.map(({ date, events }) => (
        <div key={date} className="grid gap-[8px] border-b border-ink/12 py-[24px] lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-[32px]">
          <h3 className="eyebrow pt-[4px] text-body/75">{longDate(date)}</h3>
          <ul className="flex flex-col gap-[2px]">
            {events.map(({ event }) => (
              <li key={`${date}-${event.slug}`}>
                <Link
                  href={`/whats-on/${event.slug}`}
                  className="group flex flex-col gap-[4px] py-[10px] sm:flex-row sm:items-baseline sm:justify-between sm:gap-[24px]"
                >
                  <span className="flex flex-col">
                    <span className="font-display text-d5 uppercase transition-colors group-hover:text-deep">
                      {event.title}
                    </span>
                    <span className="mt-[2px] text-[16px] leading-[1.5] text-body/75">
                      {event.summary}
                    </span>
                  </span>
                  <span className="shrink-0 text-caption font-bold tabular-nums text-body/75">
                    {timeRange(event)}
                    <span className="ml-[8px] font-normal text-body/75">{event.space}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function MonthView({
  grid,
  eventsByDate,
  label,
}: {
  readonly grid: readonly (string | null)[][];
  readonly eventsByDate: Map<string, readonly { event: VenueEvent }[]>;
  readonly label: string;
}) {
  return (
    // La grilla no entra en un teléfono, así que scrollea DENTRO de su propio
    // contenedor. El body nunca scrollea en horizontal.
    <div className="mt-[32px] overflow-x-auto" tabIndex={0} role="region" aria-label="Month calendar, scrollable">
      <table className="w-full min-w-[860px] table-fixed border-collapse">
        <caption className="sr-only">Events at Rooftop at Riverside in {label}</caption>
        <thead>
          <tr>
            {WEEKDAY_HEADERS.map((d) => (
              <th
                key={d}
                scope="col"
                className="border-b border-ink/20 pb-[10px] text-left eyebrow text-body/75"
              >
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grid.map((week, wi) => (
            <tr key={wi}>
              {week.map((date, di) => {
                const events = date ? eventsByDate.get(date) : undefined;
                return (
                  <td
                    key={date ?? `empty-${wi}-${di}`}
                    className={[
                      'h-[124px] border-b border-r border-ink/10 p-[8px] align-top',
                      di === 0 ? 'border-l' : '',
                      date ? '' : 'bg-ink/[0.02]',
                    ].join(' ')}
                  >
                    {date ? (
                      <>
                        <span className="block font-display text-d6 tabular-nums text-body/75">
                          {dayNumber(date)}
                        </span>
                        {events ? (
                          <ul className="mt-[4px] flex flex-col gap-[3px]">
                            {events.map(({ event }) => (
                              <li key={`${date}-${event.slug}`}>
                                <Link
                                  href={`/whats-on/${event.slug}`}
                                  className="block rounded-btn bg-cream px-[6px] py-[4px] text-[12px] leading-[1.3] font-bold transition-colors hover:bg-sunset"
                                >
                                  {event.title}
                                  <span className="block font-normal text-body/75">
                                    {timeRange(event)}
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </>
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
