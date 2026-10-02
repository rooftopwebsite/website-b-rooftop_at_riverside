'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ButtonLink } from '@/components/shared/Button';
import { ArrowRight } from '@/components/shared/Icon';
import {
  type VenueEvent,
  type Weekday,
  shortDate,
} from '@/content/events';
import { CalendarCard, EventCard } from './TarjetaEvento';
import { Controles } from './Controles';
import { CLOSED_DAYS, MAX_CARDS, VISIBLES, bordeTrack, gapTrack, venueToday } from './utils';

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
    ? { a: 'See what’s', b: 'coming up' }
    : { a: 'Coming up', b: 'in the yard' };

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
        <Controles
          maxIndex={maxIndex}
          slides={slides}
          index={index}
          canPrev={canPrev}
          canNext={canNext}
          onPrev={() => scrollByCard(-1)}
          onNext={() => scrollByCard(1)}
          onDot={(i) => scrollToCard(i)}
        />
      </div>
    </section>
  );
}
