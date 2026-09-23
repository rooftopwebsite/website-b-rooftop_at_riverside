'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ButtonLink } from '@/components/shared/Button';
import { ArrowLeft, ArrowRight } from '@/components/shared/Icon';
import { EventPhoto, EventWhen, SpacePill } from '@/components/shared/EventCardParts';
import { activeTrucks } from '@/content/trucks';
import {
  type VenueEvent,
  type Weekday,
  shortDate,
} from '@/content/events';

const MAX_CARDS = 8;

const gapTrack = (track: HTMLElement) => parseFloat(getComputedStyle(track).columnGap) || 0;

const bordeTrack = (track: HTMLElement) => parseFloat(getComputedStyle(track).paddingLeft) || 0;

const ANCHO = 'w-[calc(100%-20px)] md:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)]';

const VISIBLES = [
  { mq: '(min-width: 1024px)', n: 3 },
  { mq: '(min-width: 768px)', n: 2 },
] as const;

function venueToday(): { readonly weekday: Weekday; readonly date: string } {
  const label = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
  }).format(new Date());
  const map: Record<string, Weekday> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const date = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  return { weekday: map[label] ?? 0, date };
}

const CLOSED_DAYS: readonly Weekday[] = [1, 2];

function EventCard({
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

function CalendarCard({
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

export default function WhatsOn({
  proximos,
  musicaLarga,
}: {
  readonly proximos: readonly { readonly event: VenueEvent; readonly date: string }[];
  readonly musicaLarga: string;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [today, setToday] = useState<{ weekday: Weekday; date: string } | null>(null);
  const [index, setIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => setToday(venueToday()), []);

  const [visibles, setVisibles] = useState(1);

  useEffect(() => {
    const mqs = VISIBLES.map((v) => ({ ...v, m: window.matchMedia(v.mq) }));
    const aplicar = () => setVisibles(mqs.find((v) => v.m.matches)?.n ?? 1);
    aplicar();
    mqs.forEach((v) => v.m.addEventListener('change', aplicar));
    return () => mqs.forEach((v) => v.m.removeEventListener('change', aplicar));
  }, []);

  const events = (today === null ? proximos : proximos.filter((o) => o.date >= today.date)).slice(
    0,
    MAX_CARDS,
  );

  const isClosedToday = today !== null && CLOSED_DAYS.includes(today.weekday);

  const tarjetas = [
    ...events.map((o) => `${o.event.title} (${shortDate(o.date)})`),
    'See the whole calendar',
  ];
  const maxIndex = Math.max(0, tarjetas.length - visibles);

  const slides = tarjetas.slice(0, maxIndex + 1);

  const step = () => {
    const track = trackRef.current;
    const card = track?.firstElementChild;
    return track && card ? card.getBoundingClientRect().width + gapTrack(track) : 320;
  };

  const scrollByCard = useCallback((dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * step(), behavior: 'smooth' });
  }, []);

  const scrollToCard = useCallback(
    (i: number) => {
      const el = trackRef.current;
      if (!el) return;
      el.scrollTo({ left: Math.max(0, Math.min(maxIndex, i)) * step(), behavior: 'smooth' });
    },
    [maxIndex],
  );

  const maxIndexRef = useRef(0);
  maxIndexRef.current = maxIndex;

  const [dentro, setDentro] = useState<readonly boolean[]>([]);

  const medirDentro = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    if (!window.matchMedia('(min-width: 768px)').matches) {
      setDentro([...track.children].map(() => true));
      return;
    }
    const caja = track.getBoundingClientRect();
    const borde = bordeTrack(track);
    const izq = caja.left + borde - 1;
    const der = caja.right - borde + 1;
    setDentro(
      [...track.children].map((hijo) => {
        const r = hijo.getBoundingClientRect();
        return r.left >= izq && r.right <= der;
      }),
    );
  }, []);

  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setIndex(Math.min(maxIndexRef.current, Math.round(el.scrollLeft / step())));
    setCanPrev(el.scrollLeft > 1);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    medirDentro();
  }, [medirDentro]);

  useEffect(() => {
    onScroll();
    window.addEventListener('resize', onScroll, { passive: true });
    return () => window.removeEventListener('resize', onScroll);
  }, [onScroll]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollLeft = 0;
    onScroll();
  }, [today, onScroll]);

  const headline = isClosedToday
    ? { a: 'Closed today,', b: 'back Wednesday' }
    : { a: 'Coming up', b: 'in the yard' };

  const trucks = activeTrucks();

  return (
    <section
      id="whats-on"
      aria-labelledby="whats-on-title"
      className="banda-arco relative z-[2] bg-deep grano pt-14 pb-cierre-arco text-bone on-dark md:pt-18 lg:pt-22 desk:pt-[110px]"
    >
      <div className="caja-ancha">
        <h2
          id="whats-on-title"
          className="mx-auto max-w-[16ch] text-center font-display text-banda font-extrabold uppercase"
        >
          <span className="block text-paper">{headline.a}</span>{' '}
          <span className="block text-sunset">{headline.b}</span>
        </h2>

        <div className="mt-6.5 flex justify-center lg:mt-10">
          <ButtonLink
            href="/whats-on"
            variant="onDark"
            size="lg"
            className="group transition-all duration-300 ease-brand active:scale-95"
          >
            Full calendar
            <ArrowRight className="size-4 transition-transform duration-300 ease-brand group-hover:translate-x-1" />
          </ButtonLink>
        </div>
      </div>
      <div className="caja-ancha mt-bloque">
        <div
          ref={trackRef}
          onScroll={onScroll}
          tabIndex={0}
          role="group"
          aria-label="Upcoming events"
          className="-mx-borde -mt-2 -mb-5 flex snap-x snap-mandatory gap-4 overflow-x-auto md:gap-6 px-borde pt-3.5 pb-13 scroll-px-borde [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {events.map((o, i) => (
            <EventCard
              key={`${o.event.slug}-${o.date}`}
              event={o.event}
              date={o.date}
              isToday={today !== null && o.date === today.date}
              fuera={dentro.length > 0 && !dentro[i]}
            />
          ))}

          <CalendarCard musicaLarga={musicaLarga} fuera={dentro.length > 0 && !dentro[events.length]} />
        </div>
        {maxIndex > 0 ? (
        <div className="flex flex-wrap items-center justify-center gap-3 pt-6.5 sm:gap-5">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            className="hidden size-13 shrink-0 place-items-center rounded-pill bg-cream md:grid text-deep transition-all duration-300 ease-brand hover:bg-paper active:scale-95 disabled:pointer-events-none disabled:bg-transparent disabled:text-muted-dark disabled:ring-1 disabled:ring-muted-dark/50"
          >
            <span className="sr-only">Previous events</span>
            <ArrowLeft />
          </button>
          <div className="flex gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide}
                type="button"
                onClick={() => scrollToCard(i)}
                aria-current={i === index ? 'true' : undefined}
                className="group -mx-1 grid size-9 place-items-center rounded-pill sm:size-11"
              >
                <span className="sr-only">{slide}</span>
                <span
                  className={[
                    'block size-2.25 rounded-pill transition-all duration-300 ease-brand',
                    'group-hover:scale-140',
                    i === index ? 'bg-sunset' : 'bg-muted-dark/40 group-hover:bg-muted-dark',
                  ].join(' ')}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            className="hidden size-13 shrink-0 place-items-center rounded-pill bg-cream md:grid text-deep transition-all duration-300 ease-brand hover:bg-paper active:scale-95 disabled:pointer-events-none disabled:bg-transparent disabled:text-muted-dark disabled:ring-1 disabled:ring-muted-dark/50"
          >
            <span className="sr-only">Next events</span>
            <ArrowRight />
          </button>
        </div>
        ) : null}
      </div>
      <div
        id="trucks"
        className="caja-ancha mt-12 border-t border-muted-dark/35 pt-7 lg:mt-22 lg:pt-11"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-5">
          <span className="font-body text-caption font-medium uppercase tracking-eyebrow text-muted-dark">
            In the yard
          </span>
          <Link
            href="/food-trucks"
            className="group flex items-center gap-2 font-body text-base text-cream transition-colors duration-200 hover:text-paper"
          >
            All {trucks.length === 4 ? 'four' : trucks.length} trucks
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
        <p className="mt-4.5 max-w-[62ch] font-body text-lead font-light text-paper">
          {trucks.map((t) => t.name).join(' · ')}. The roster rotates, and each truck takes its own
          orders and its own payment.
        </p>
      </div>
    </section>
  );
}
