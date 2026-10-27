'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ButtonLink } from '@/components/shared/Button';
import { ArrowRight } from '@/components/shared/Icon';
import {
  type VenueEvent,
  type Weekday,
  shortDate,
} from '@/content/events';
import { CalendarCard, EventCard } from './EventCard';
import { Controls } from './Controls';
import { CLOSED_DAYS, MAX_CARDS, VISIBLE, trackEdge, gapTrack, venueToday } from './utils';

export default function WhatsOn({
  upcoming,
  longMusic,
}: {
  readonly upcoming: readonly { readonly event: VenueEvent; readonly date: string }[];
  readonly longMusic: string;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [today, setToday] = useState<{ weekday: Weekday; date: string } | null>(null);
  const [index, setIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => setToday(venueToday()), []);

  const [visibleItems, setVisibleItems] = useState(1);

  useEffect(() => {
    const mqs = VISIBLE.map((v) => ({ ...v, m: window.matchMedia(v.mq) }));
    const apply = () => setVisibleItems(mqs.find((v) => v.m.matches)?.n ?? 1);
    apply();
    mqs.forEach((v) => v.m.addEventListener('change', apply));
    return () => mqs.forEach((v) => v.m.removeEventListener('change', apply));
  }, []);

  const events = (today === null ? upcoming : upcoming.filter((o) => o.date >= today.date)).slice(
    0,
    MAX_CARDS,
  );

  const isClosedToday = today !== null && CLOSED_DAYS.includes(today.weekday);

  const cards = [
    ...events.map((o) => `${o.event.title} (${shortDate(o.date)})`),
    'See the whole calendar',
  ];
  const maxIndex = Math.max(0, cards.length - visibleItems);

  const slides = cards.slice(0, maxIndex + 1);

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

  const [inside, setInside] = useState<readonly boolean[]>([]);

  const measureInside = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    if (!window.matchMedia('(min-width: 768px)').matches) {
      setInside([...track.children].map(() => true));
      return;
    }
    const box = track.getBoundingClientRect();
    const edge = trackEdge(track);
    const left = box.left + edge - 1;
    const right = box.right - edge + 1;
    setInside(
      [...track.children].map((child) => {
        const r = child.getBoundingClientRect();
        return r.left >= left && r.right <= right;
      }),
    );
  }, []);

  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setIndex(Math.min(maxIndexRef.current, Math.round(el.scrollLeft / step())));
    setCanPrev(el.scrollLeft > 1);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    measureInside();
  }, [measureInside]);

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
      className="band-arc relative z-[2] bg-deep grain pt-14 pb-closing-arc text-bone on-dark md:pt-18 lg:pt-22 desk:pt-[110px]"
    >
      <div className="page-box-wide">
        <h2
          id="whats-on-title"
          className="mx-auto max-w-[16ch] text-center font-display text-band font-extrabold uppercase"
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
      <div className="page-box-wide mt-block">
        <div
          ref={trackRef}
          onScroll={onScroll}
          tabIndex={0}
          role="group"
          aria-label="Upcoming events"
          className="-mx-edge -mt-2 -mb-5 flex snap-x snap-mandatory gap-4 overflow-x-auto md:gap-6 px-edge pt-3.5 pb-13 scroll-px-edge [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {events.map((o, i) => (
            <EventCard
              key={`${o.event.slug}-${o.date}`}
              event={o.event}
              date={o.date}
              isToday={today !== null && o.date === today.date}
              outside={inside.length > 0 && !inside[i]}
            />
          ))}

          <CalendarCard longMusic={longMusic} outside={inside.length > 0 && !inside[events.length]} />
        </div>
        <Controls
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
