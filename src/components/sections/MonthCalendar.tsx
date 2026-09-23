'use client';

import { useState } from 'react';
import EventDialog, { type EventoAbierto } from '@/components/sections/EventDialog';
import { Ticket } from '@/components/shared/Icon';
import { formatTime, isTicketed, standsOut, type VenueEvent } from '@/content/events';
import { dayNumber, monthDay, weekdayLong } from '@/lib/calendar';
import { colorKey, eventDot } from '@/lib/event-color';

const WEEKDAY_HEADERS = [
  { corto: 'Sun', largo: 'Sunday' },
  { corto: 'Mon', largo: 'Monday' },
  { corto: 'Tue', largo: 'Tuesday' },
  { corto: 'Wed', largo: 'Wednesday' },
  { corto: 'Thu', largo: 'Thursday' },
  { corto: 'Fri', largo: 'Friday' },
  { corto: 'Sat', largo: 'Saturday' },
] as const;

const LEYENDA =
  'flex items-center gap-[7px] text-caption font-bold uppercase tracking-[0.08em] text-body/70';

interface DayEvents {
  readonly date: string;
  readonly events: readonly { readonly event: VenueEvent }[];
}

export default function MonthCalendar({
  grid,
  eventsByDate,
  label,
  today,
  venueName,
}: {
  readonly grid: readonly (string | null)[][];
  readonly eventsByDate: ReadonlyMap<string, readonly { readonly event: VenueEvent }[]>;
  readonly label: string;
  readonly today: string;
  readonly venueName: string;
}) {
  const delMes = [...eventsByDate.values()].flatMap((l) => l.map((o) => o.event));
  const referencia = colorKey(delMes);
  const hayDestacados = delMes.some(standsOut);
  const hayEntradas = delMes.some(isTicketed);

  const agenda: readonly DayEvents[] = grid
    .flat()
    .filter((d): d is string => d !== null)
    .map((date) => ({ date, events: eventsByDate.get(date) ?? [] }))
    .filter((d) => d.events.length > 0);

  const [abierto, setAbierto] = useState<EventoAbierto | null>(null);

  return (
    <div className="mt-[28px]">
      <EventDialog abierto={abierto} onClose={() => setAbierto(null)} />
      <table className="hidden w-full table-fixed border-collapse lg:table">
        <caption className="sr-only">
          Events at {venueName} in {label}
        </caption>
        <thead>
          <tr>
            {WEEKDAY_HEADERS.map((d) => (
              <th
                key={d.corto}
                scope="col"
                className="pb-[8px] text-center text-caption font-bold uppercase tracking-[0.08em] text-body/70 lg:text-left lg:tracking-[0.12em]"
              >
                <span aria-hidden="true">{d.corto}</span>
                <span className="sr-only">{d.largo}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grid.map((week, wi) => (
            <tr key={wi}>
              {week.map((date, di) => {
                const events = date ? eventsByDate.get(date) : undefined;
                const esHoy = date === today;

                return (
                  <td
                    key={date ?? `empty-${wi}-${di}`}
                    className={[
                      'border-b border-r border-ink/10 p-[4px] align-top lg:p-[8px]',
                      di === 0 ? 'border-l' : '',
                      date ? '' : 'bg-ink/[0.02]',
                    ].join(' ')}
                  >
                    {date ? (
                      <div className="flex min-h-[54px] flex-col lg:min-h-[116px]">
                        <span
                          className={[
                            'grid size-[26px] shrink-0 place-items-center font-display text-d6 tabular-nums lg:size-[30px]',
                            esHoy ? 'rounded-pill bg-sunset font-semibold text-ink' : 'text-body/75',
                          ].join(' ')}
                        >
                          {esHoy ? <span className="sr-only">Today, </span> : null}
                          {dayNumber(date)}
                        </span>

                        {events && events.length > 0 ? (
                          <ul className="mt-[5px] flex list-none flex-col gap-[3px]">
                            {events.map(({ event }) => (
                              <li key={`chip-${date}-${event.slug}`}>
                                <Chip event={event} date={date} onOpen={setAbierto} />
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {referencia.length > 1 || hayDestacados ? (
        <ul className="mt-[16px] flex list-none flex-wrap gap-x-[18px] gap-y-[8px]">
          {referencia.length > 1
            ? referencia.map((c) => (
                <li key={c.id} className={LEYENDA}>
                  <span className={`size-[9px] shrink-0 rounded-pill ${c.dot}`} aria-hidden="true" />
                  {c.label}
                </li>
              ))
            : null}

          {hayDestacados ? (
            <li className={LEYENDA}>
              <span
                className="h-[14px] w-[22px] shrink-0 rounded-[5px] bg-cream"
                aria-hidden="true"
              />
              Limited run or ticketed
            </li>
          ) : null}

          {hayEntradas ? (
            <li className={LEYENDA}>
              <Ticket className="size-[13px] shrink-0" aria-hidden="true" />
              Tickets on Eventbrite
            </li>
          ) : null}
        </ul>
      ) : null}

      <div className="mt-[24px] lg:hidden">
        <h3 className="sr-only">Day by day in {label}</h3>
        <ul className="flex list-none flex-col gap-[22px] p-0">
          {agenda.map(({ date, events }) => (
            <li key={`agenda-${date}`}>
              <h4 className="m-0 flex items-baseline gap-[8px] border-b border-ink/15 pb-[8px]">
                <span className="font-display text-d6 font-bold uppercase leading-none tracking-[0.02em] text-ink">
                  {weekdayLong(date)}
                </span>
                <span
                  className={[
                    'grid min-w-[24px] place-items-center rounded-pill px-[6px] py-[2px] font-body text-caption font-bold tabular-nums leading-none',
                    date === today ? 'bg-sunset text-ink' : 'text-body/60',
                  ].join(' ')}
                >
                  {date === today ? <span className="sr-only">Today, </span> : null}
                  {monthDay(date)}
                </span>
              </h4>

              <ul className="mt-[10px] flex list-none flex-col gap-[8px] p-0">
                {events.map(({ event }) => (
                  <li key={`agenda-${date}-${event.slug}`}>
                    <AgendaCard event={event} date={date} onOpen={setAbierto} />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function AgendaCard({
  event,
  date,
  onOpen,
}: {
  readonly event: VenueEvent;
  readonly date: string;
  readonly onOpen: (a: EventoAbierto) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen({ event, date })}
      className={[
        'flex w-full items-start gap-[10px] rounded-card border border-ink/12 px-[12px] py-[10px] text-left transition-colors hover:border-ink/30',
        standsOut(event) ? 'bg-cream' : 'bg-paper',
      ].join(' ')}
    >
      <span
        className={`mt-[7px] size-[8px] shrink-0 rounded-pill ${eventDot(event)}`}
        aria-hidden="true"
      />
      <span className="flex min-w-0 flex-col">
        <span className="flex flex-wrap items-baseline gap-x-[8px] font-body text-caption font-bold uppercase tracking-[0.06em] tabular-nums text-body/70">
          {formatTime(event.startTime)}
          <span className="font-medium tracking-[0.04em] text-body/55">{monthDay(date)}</span>
        </span>
        <span className="mt-[3px] font-display text-d6 uppercase leading-[1.1] text-ink">
          {event.title}
        </span>
      </span>
      {isTicketed(event) ? (
        <Ticket className="mt-[6px] ml-auto size-[15px] shrink-0 text-body/70" aria-hidden="true" />
      ) : null}
      <span className="sr-only">— see details</span>
    </button>
  );
}

function Chip({
  event,
  date,
  onOpen,
}: {
  readonly event: VenueEvent;
  readonly date: string;
  readonly onOpen: (a: EventoAbierto) => void;
}) {
  const cuerpo = (
    <>
      <span
        className={`mt-[5px] size-[7px] shrink-0 rounded-pill ${eventDot(event)}`}
        aria-hidden="true"
      />
      <span className="flex min-w-0 items-baseline gap-[5px]">
        <span className="shrink-0 font-bold tabular-nums">{formatTime(event.startTime)}</span>
        <span className="truncate">{event.title}</span>
      </span>
      {isTicketed(event) ? (
        <Ticket className="mt-[3px] size-[13px] shrink-0" aria-hidden="true" />
      ) : null}
    </>
  );

  const clases = [
    'flex w-full gap-[6px] rounded-[5px] px-[5px] py-[3px] text-left text-[12px] leading-[1.35]',
    standsOut(event) ? 'bg-cream' : '',
    isTicketed(event) ? 'text-deep underline underline-offset-2 hover:text-terra' : 'text-ink',
  ]
    .filter(Boolean)
    .join(' ');

  if (isTicketed(event) && event.ticketUrl) {
    return (
      <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer" className={clases}>
        {cuerpo}
        <span className="sr-only">
          Buy tickets for {event.title} on Eventbrite (opens in a new tab)
        </span>
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onOpen({ event, date })}
      className={`${clases} ${standsOut(event) ? '' : 'hover:bg-ink/6'} transition-colors`}
    >
      {cuerpo}
      <span className="sr-only">— see details</span>
    </button>
  );
}
