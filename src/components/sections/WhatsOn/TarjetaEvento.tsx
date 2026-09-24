'use client';

import Link from 'next/link';
import { ArrowRight } from '@/components/shared/Icon';
import { EventPhoto, EventWhen, SpacePill } from '@/components/shared/EventCardParts';
import { type VenueEvent } from '@/content/events';
import { ANCHO } from './utils';

export function EventCard({
  event,
  date,
  isToday,
  fuera,
}: {
  readonly event: VenueEvent;
  readonly date: string;
  readonly isToday: boolean;
  readonly fuera: boolean;
}) {
  const entradas = event.ticketUrl;
  const href = entradas ?? '/whats-on';
  const cta = entradas ? 'Get tickets' : 'See the calendar';

  const contenido = (
    <>
      <EventPhoto
        event={event}
        sizes="(min-width: 1024px) 400px, 260px"
        brief={`${event.title} en ${event.space}, de noche, con gente.`}
        tone="dark"
        imgClassName="object-cover transition-transform duration-500 ease-brand group-hover:scale-104"
      >
        <SpacePill>{event.space}</SpacePill>
      </EventPhoto>
      <div className="relative z-10 flex flex-1 flex-col bg-deeper px-7 pt-6.5 pb-7">
        <EventWhen event={event} date={date} isToday={isToday} fecha="text-cream" />

        <h3 className="m-0 mt-3.5 font-display text-d4 font-bold uppercase leading-none text-paper">
          {event.title}
        </h3>
        <p className="m-0 mt-3 line-clamp-2 min-h-[2lh] font-body text-base font-light text-paper/92">
          {event.summary === event.title ? '' : event.summary}
        </p>
        <span className="mt-auto inline-flex w-fit items-center gap-2.25 border-b-2 border-sunset pt-4.5 pb-0.75 font-body text-base font-semibold text-cream transition-colors duration-300 ease-brand group-hover:text-sunset">
          {cta}
          <ArrowRight className="size-4 shrink-0 transition-transform duration-300 ease-brand group-hover:translate-x-1" />
          {entradas ? <span className="sr-only">(opens in a new tab)</span> : null}
        </span>
      </div>
    </>
  );

  const clases =
    `group relative flex flex-col shrink-0 snap-start overflow-hidden rounded-shell bg-deeper sombra-card transition-[transform,opacity] duration-300 ease-brand hover:-translate-y-1.5 ${ANCHO} ${
      fuera ? 'pointer-events-none opacity-0' : ''
    }`;

  return entradas ? (
    <a href={entradas} target="_blank" rel="noopener noreferrer" className={clases} inert={fuera || undefined}>
      {contenido}
    </a>
  ) : (
    <Link href={href} className={clases} inert={fuera || undefined}>
      {contenido}
    </Link>
  );
}

export function CalendarCard({
  fuera,
  musicaLarga,
}: {
  readonly fuera: boolean;
  readonly musicaLarga: string;
}) {
  return (
    <Link
      href="/whats-on"
      inert={fuera || undefined}
      className={`group flex shrink-0 snap-start flex-col justify-between gap-8 rounded-shell bg-sunset p-7 sombra-card text-ink transition-[background-color,opacity] duration-300 ease-brand hover:bg-sunset-hover lg:p-9 ${ANCHO} ${
        fuera ? 'pointer-events-none opacity-0' : ''
      }`}
    >
      <span className="font-body text-caption font-medium uppercase tracking-eyebrow text-ink">
        Every week
      </span>

      <span>
        <span className="block font-display text-d2 font-extrabold uppercase leading-[0.9]">
          See the whole calendar
        </span>
        <span className="mt-4 block max-w-[26ch] font-body text-base font-light">
          {musicaLarga}, Bingo on Wednesdays and DJ sets late on Saturdays.
        </span>
      </span>

      <span className="grid size-13 place-items-center rounded-pill bg-ink text-sunset transition-transform duration-300 ease-brand group-hover:translate-x-1.5">
        <ArrowRight className="size-5" />
      </span>
    </Link>
  );
}
