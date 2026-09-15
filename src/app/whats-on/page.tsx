import type { Metadata } from 'next';
import Link from 'next/link';
import FeaturedEvent from '@/components/sections/FeaturedEvent';
import { ButtonLink } from '@/components/shared/Button';
import PageHero from '@/components/shared/PageHero';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import {
  activeFilters,
  isTicketed,
  matchesFilter,
  recurringEvents,
  timeRange,
  weekdayLabel,
  type VenueEvent,
} from '@/content/events';
import { HAPPY_HOUR } from '@/content/happy-hour';
import { fraseEntretenimiento } from '@/content/entertainment';
import { ArrowSquareOut } from '@/components/shared/Icon';
import { BRAND } from '@/lib/brand';
import { getVenue, venueAddressLine } from '@/lib/venue';
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
  searchParams: Promise<{ month?: string; view?: string; type?: string }>;
}) {
  const sp = await searchParams;
  const { year, month } = parseMonth(sp.month);
  const view = sp.view === 'month' ? 'month' : 'list';
  const type = sp.type ?? null;

  const venue = await getVenue();
  const semana = await recurringEvents();
  // Ver `content/entertainment.ts`: el número de noches no está confirmado.
  const musicaLarga = await fraseEntretenimiento();
  const filtros = activeFilters(semana);

  /*
   * ⚠️ EL FILTRO SE APLICA A LAS OCURRENCIAS DEL MES, no a la programación
   * semanal de abajo. La semana es la grilla fija del lugar y tiene que
   * leerse entera siempre: filtrarla dejaría a alguien creyendo que el
   * miércoles no pasa nada porque estaba mirando «Sports».
   */
  const occurrences = occurrencesInMonth(year, month).filter((o) => matchesFilter(o.event, type));
  const byDay = groupByDay(occurrences);
  const grid = monthGrid(year, month);
  const eventsByDate = new Map(byDay.map((d) => [d.date, d.events]));

  const prev = shiftMonth(year, month, -1);
  const next = shiftMonth(year, month, 1);
  const label = monthLabel(year, month);

  const href = (m: { year: number; month: number }, v: string, t: string | null = type) =>
    `/whats-on?month=${monthKey(m.year, m.month)}&view=${v}${t ? `&type=${t}` : ''}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbJsonLd([{ name: "What's On", path: '/whats-on' }])),
        }}
      />

      {/*
        ══════════════════════════════════════════════════════════════════
        JSON-LD `Event` DE LOS EVENTOS CON FECHA.

        ⚠️ Vivía en la ficha por evento, que se eliminó el 2026-09-15, así que
        se emite acá. Sin esto el calendario deja de aparecer en los
        resultados de eventos de Google, que es EXACTAMENTE el error del sitio
        viejo que vinimos a arreglar: su calendario es un iframe de un tercero
        y no devuelve un solo nombre de evento en el HTML servido.

        ⚠️ SÓLO LAS OCURRENCIAS CON FECHA CONCRETA. Un recurrente declarado
        con una única fecha le miente a Google, que después muestra en el rich
        result un día que ya pasó.

        ⚠️ `offers` SÓLO SI HAY `ticketUrl`. Sin entrada va
        `isAccessibleForFree: true`, que es el dato correcto y además es el que
        Google usa para mostrar «Free» en el resultado.
        ══════════════════════════════════════════════════════════════════
      */}
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
                  : { isAccessibleForFree: true }),
              })),
            ),
          }}
        />
      ) : null}

      <PageHero
        eyebrow="The calendar"
        title={"What's on this week"}
        lead={`${musicaLarga}, Bingo on Wednesdays, and the dogs get their own day. Most of it is free.`}
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

      {/*
        ⚠️ EL DESTACADO VA ANTES DEL CALENDARIO Y NO ADENTRO. Es un evento que
        se repite todas las semanas de la temporada, así que como fila del mes
        aparecería cuatro o cinco veces y ninguna se vería. Arriba, una sola
        vez y en grande, es lo que reemplaza a la página que tenía. Ver
        `FeaturedEvent`.
      */}
      <FeaturedEvent />

      <Section band="md" labelledBy="cal-title">
        {/*
          ══════════════════════════════════════════════════════════════
          LOS FILTROS. Son LINKS y no botones: cada filtro es una URL que se
          puede compartir, que el servidor resuelve, que funciona con
          JavaScript desactivado y que se puede medir en analítica.

          ⚠️ SÓLO SE DIBUJAN LOS QUE TIENEN EVENTOS. `activeFilters()` los
          calcula sobre la programación real: un filtro que al apretarlo da
          cero resultados es una promesa incumplida.

          ⚠️ `aria-current` marca el activo. El color no alcanza.
          ══════════════════════════════════════════════════════════════
        */}
        {filtros.length > 1 ? (
          <nav aria-label="Filter events by type" className="mb-[20px]">
            <ul className="flex list-none flex-wrap gap-[8px]">
              {[{ id: null as string | null, label: 'Everything' }, ...filtros].map((f) => {
                const activo = (f.id ?? null) === type;
                return (
                  <li key={f.id ?? 'all'}>
                    <Link
                      href={href({ year, month }, view, f.id ?? null)}
                      aria-current={activo ? 'true' : undefined}
                      className={[
                        'inline-block rounded-pill px-[16px] py-[7px] text-caption font-bold uppercase tracking-[0.1em] transition-colors',
                        activo
                          ? 'bg-ink text-paper'
                          : 'border border-ink/20 text-ink/70 hover:border-ink hover:text-ink',
                      ].join(' ')}
                    >
                      {f.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        ) : null}

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
          /*
            ⚠️ EL VACÍO DICE QUÉ HACER, y distingue los dos motivos: que no
            haya nada cargado ese mes, o que el filtro no tenga resultados. Un
            «no hay eventos» a secas deja a la persona sin salida.
          */
          <div className="mt-bloque max-w-[58ch]">
            <Heading level={3} role="card">
              {type ? 'Nothing of that kind this month' : `Nothing on the books for ${label} yet`}
            </Heading>
            <p className="mt-[10px] text-[16px] leading-[1.7] text-body/80">
              {type
                ? `Clear the filter to see everything on in ${label}. The standing weekly lineup below runs every week regardless.`
                : 'The calendar for the coming month usually lands around the 10th. The standing weekly lineup below runs every week regardless.'}
            </p>
            <div className="mt-[20px] flex flex-wrap gap-[12px]">
              {type ? (
                <ButtonLink href={href({ year, month }, view, null)} variant="primary">
                  See everything
                </ButtonLink>
              ) : null}
              <ButtonLink href={href(next, view)} variant="secondary">
                Try {monthLabel(next.year, next.month)}
              </ButtonLink>
            </div>
          </div>
        ) : view === 'list' ? (
          <ListView days={byDay} />
        ) : (
          <MonthView grid={grid} eventsByDate={eventsByDate} label={label} />
        )}
      </Section>

      {/*
        ══════════════════════════════════════════════════════════════════
        LA PROGRAMACIÓN SEMANAL FIJA.

        ⚠️ ES VISUALMENTE DISTINTA DEL CALENDARIO DE ARRIBA, y tiene que
        serlo: son dos cosas que se leen distinto. Arriba están las FECHAS
        —los shows puntuales, los que pueden llevar entrada—; acá abajo está
        la GRILLA, lo que pasa todas las semanas y nunca necesita ticket. Si
        se vieran iguales, alguien buscaría una entrada para el bingo.

        Por eso acá no hay fechas, hay DÍAS; el fondo es `bone` y no `paper`;
        y cada renglón es un día de la semana, no un evento suelto.

        ⚠️ EL HAPPY HOUR VA ACÁ Y ES EL DESTACADO. Es uno de los dos únicos
        lugares del sitio donde aparece (el otro es `/sunset-bar`), y es
        recurrente como el resto de esta grilla pero el único que es una
        oferta, así que va arriba y con la píldora de precio a la vista. Ver
        `content/happy-hour.ts`.

        ⚠️ NO SE FILTRA. Ver la nota del filtro arriba.
        ══════════════════════════════════════════════════════════════════
      */}
      <Section tone="bone" band="lg" labelledBy="semana-title">
        <SectionHead
          eyebrow="Every week"
          eyebrowTone="deep"
          id="semana-title"
          title="The standing lineup"
          lead="This part does not change. No tickets, no cover, no date to keep track of."
        />

        {/* El happy hour, destacado */}
        <div className="mt-[36px] rounded-card border-2 border-sunset bg-paper p-[24px] lg:p-[32px]">
          <div className="flex flex-col gap-[16px] lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Eyebrow tone="terra">Happy hour</Eyebrow>
              <Heading level={3} className="mt-[8px] text-d5 lg:text-d4">
                {HAPPY_HOUR.days}, {HAPPY_HOUR.time}
              </Heading>
            </div>
            <ul className="flex list-none flex-wrap gap-[8px]">
              {HAPPY_HOUR.deals.map((d) => (
                <li
                  key={d}
                  className="rounded-pill bg-cream px-[14px] py-[6px] font-display text-d7 uppercase tabular-nums text-ink"
                >
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* La grilla por día */}
        <ul className="mt-[28px] flex list-none flex-col">
          {semana.map((e) => (
            <li
              key={e.slug}
              className="grid gap-[6px] border-b border-ink/12 py-[18px] last:border-b-0 sm:grid-cols-[140px_minmax(0,1fr)_auto] sm:items-baseline sm:gap-[24px]"
            >
              <span className="eyebrow text-body/75">
                {e.weekday !== null ? weekdayLabel(e.weekday) : 'Every week'}
              </span>
              <span className="flex flex-col">
                <span className="font-display text-d6 uppercase lg:text-d5">{e.title}</span>
                <span className="mt-[2px] text-[16px] leading-[1.5] text-body/75">{e.summary}</span>
              </span>
              <span className="shrink-0 text-caption font-bold tabular-nums text-body/75">
                {timeRange(e)}
                <span className="ml-[8px] font-normal">{e.space}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-[28px] flex flex-col gap-[12px] text-[16px] leading-[1.7] text-body/80">
          <p>
            Ticketed shows run in The Yard and sell through Eventbrite. Everything on this list is
            free and you just walk in.
          </p>
          {/*
            ⚠️ ESTE CTA GENERAL SE QUEDA, ADEMÁS DEL DE CADA EVENTO. Desde el
            2026-09-15 cada evento con `ticketUrl` linkea a su propia página de
            Eventbrite (pedido de Camila). Éste es la puerta al perfil
            completo, para quien quiere ver qué hay a la venta sin saber
            todavía a qué show va. No se pisan: uno es «esta noche», el otro es
            «qué hay».
          */}
          {BRAND.eventbrite ? (
            <div className="mt-[8px]">
              <ButtonLink href={BRAND.eventbrite} variant="primary" external>
                See everything on Eventbrite
              </ButtonLink>
            </div>
          ) : null}
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
                <EventRow event={event} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/**
 * Una fila de evento.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ SÓLO ES UN LINK SI HAY ENTRADA QUE COMPRAR, y entonces sale AFUERA, a
 * Eventbrite. Antes linkeaba a `/whats-on/[slug]`, una ficha por evento que
 * se eliminó el 2026-09-15 por decisión de Camila: el calendario muestra todo
 * y el evento con entrada deriva directo al ticketing.
 *
 * ⚠️ EL AVISO DE QUE SE VA DEL SITIO ESTÁ ANTES DEL CLIC, no después. Lleva
 * las tres cosas: el ícono de enlace externo, el `rel="noopener noreferrer"`
 * y un texto para lector de pantalla que dice que abre en otra pestaña.
 *
 * ⚠️ SIN ENTRADA NO ES UN LINK Y NO ES UN BOTÓN MUERTO. Muestra «free entry»,
 * que es el dato que la persona necesita. Un evento clickeable que no lleva a
 * ninguna parte es peor que un evento que no es clickeable.
 * ══════════════════════════════════════════════════════════════════════════
 */
function EventRow({ event }: { readonly event: VenueEvent }) {
  const cuerpo = (
    <>
      <span className="flex flex-col">
        <span className="font-display text-d5 uppercase transition-colors group-hover:text-deep">
          {event.title}
        </span>
        <span className="mt-[2px] text-[16px] leading-[1.5] text-body/75">{event.summary}</span>
      </span>
      <span className="flex shrink-0 items-center gap-[12px] text-caption font-bold tabular-nums text-body/75">
        <span>
          {timeRange(event)}
          <span className="ml-[8px] font-normal">{event.space}</span>
        </span>
        {isTicketed(event) ? (
          <span className="inline-flex items-center gap-[5px] rounded-pill bg-sunset px-[12px] py-[4px] text-ink">
            Tickets
            <ArrowSquareOut className="size-3.5" aria-hidden="true" />
          </span>
        ) : (
          <span className="rounded-pill border border-ink/25 px-[12px] py-[4px] font-normal">
            Free entry
          </span>
        )}
      </span>
    </>
  );

  const clases =
    'group flex flex-col gap-[4px] py-[10px] sm:flex-row sm:items-baseline sm:justify-between sm:gap-[24px]';

  if (!isTicketed(event)) return <div className={clases}>{cuerpo}</div>;

  return (
    <a
      href={event.ticketUrl as string}
      target="_blank"
      rel="noopener noreferrer"
      className={clases}
    >
      {cuerpo}
      <span className="sr-only">Buy tickets on Eventbrite (opens in a new tab)</span>
    </a>
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
                                {/*
                                  ⚠️ Misma regla que en la vista de lista: es
                                  un link SÓLO si hay entrada, y sale afuera.
                                */}
                                {isTicketed(event) ? (
                                  <a
                                    href={event.ticketUrl as string}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block rounded-btn bg-sunset px-[6px] py-[4px] text-[12px] leading-[1.3] font-bold text-ink transition-colors hover:bg-sunset-hover"
                                  >
                                    {event.title}
                                    <span className="block font-normal">{timeRange(event)}</span>
                                    <span className="sr-only">
                                      Buy tickets (opens in a new tab)
                                    </span>
                                  </a>
                                ) : (
                                  <div className="rounded-btn bg-cream px-[6px] py-[4px] text-[12px] leading-[1.3] font-bold">
                                    {event.title}
                                    <span className="block font-normal text-body/75">
                                      {timeRange(event)}
                                    </span>
                                  </div>
                                )}
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
