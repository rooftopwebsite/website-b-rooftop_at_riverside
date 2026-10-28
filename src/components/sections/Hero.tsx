'use client';

import Image from 'next/image';
import { useVenue } from '@/components/shared/VenueProvider';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ButtonLink } from '@/components/shared/Button';
import { ArrowUpRight, Martini, MusicNote, Pause, Play, Sun, SunHorizon } from '@/components/shared/Icon';
import { useCssVar } from '@/lib/css-var';
import { venueStatus } from '@/lib/hours';

const NOTCH_PAD_X = 26;
const NOTCH_PAD_Y = 14;

const FRAME_DESKTOP = 1024;
const FRAME_AIR = 24;
const FRAME_MIN = 320;

const STATUS_MS = 4600;

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const subscribeToMotion = (notify: () => void) => {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener('change', notify);
  return () => mq.removeEventListener('change', notify);
};
const prefersStill = () => window.matchMedia(REDUCED_MOTION).matches;

export default function Hero({
  musicPhrase,
  happyHourPhrase,
}: {
  readonly musicPhrase: string;
  readonly happyHourPhrase: string;
}) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [still, setStill] = useState(false);
  const plateRef = useRef<HTMLParagraphElement | null>(null);
  const [notch, setNotch] = useState<{ w: number; h: number } | null>(null);
  const [frameHeight, setFrameHeight] = useState<number | null>(null);
  useCssVar(frameRef, '--frame-height', frameHeight ? `${frameHeight}px` : null);
  useCssVar(frameRef, '--notch-w', notch ? `${notch.w}px` : null);
  useCssVar(frameRef, '--notch-h', notch ? `${notch.h}px` : null);

  const reducedMotion = useSyncExternalStore(subscribeToMotion, prefersStill, () => false);

  const [statusIdx, setStatusIdx] = useState(0);
  const venue = useVenue();
  const [status, setStatus] = useState<ReturnType<typeof venueStatus>>(null);

  const syncFrame = useCallback(() => {
    const frame = frameRef.current;
    const box = frame?.parentElement;
    if (!frame || !box) return;

    if (window.innerWidth < FRAME_DESKTOP) {
      setFrameHeight(null);
      return;
    }

    const boxWidth = box.clientWidth;
    const top = frame.getBoundingClientRect().top + window.scrollY;
    const byScreen = window.innerHeight - top - FRAME_AIR;
    const byWidth = (boxWidth * 9) / 16;
    const h = Math.round(Math.max(FRAME_MIN, Math.min(byScreen, byWidth)));
    setFrameHeight((prev) => (prev === h ? prev : h));
  }, []);

  const syncNotch = useCallback(() => {
    const frame = frameRef.current;
    const plate = plateRef.current;
    if (!frame || !plate) return;
    const f = frame.getBoundingClientRect();
    const p = plate.getBoundingClientRect();
    const w = Math.max(0, Math.round(p.right - f.left + NOTCH_PAD_X));
    const h = Math.max(0, Math.round(p.bottom - f.top + NOTCH_PAD_Y));
    setNotch((prev) => (prev && prev.w === w && prev.h === h ? prev : { w, h }));
  }, []);

  useLayoutEffect(() => {
    const sync = () => {
      syncFrame();
      syncNotch();
    };

    sync();

    const onResize = () => sync();
    window.addEventListener('resize', onResize, { passive: true });

    const ro = new ResizeObserver(sync);
    if (frameRef.current) ro.observe(frameRef.current);
    if (plateRef.current) ro.observe(plateRef.current);

    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) sync();
    });

    return () => {
      cancelled = true;
      window.removeEventListener('resize', onResize);
      ro.disconnect();
    };
  }, [syncFrame, syncNotch]);

  useEffect(() => {
    setStatus(venueStatus(venue.hours, 'bar'));
  }, [venue.hours]);

  useEffect(() => {
    if (still || reducedMotion) return;
    const id = setInterval(() => setStatusIdx((i) => i + 1), STATUS_MS);
    return () => clearInterval(id);
  }, [still, reducedMotion]);

  const toggleMotion = () => {
    const video = videoRef.current;
    if (still) video?.play().catch(() => {});
    else video?.pause();
    setStill(!still);
  };

  const HAPPY = { text: happyHourPhrase, Icon: Martini, medal: 'bg-cream text-ink' };
  const MUSIC = { text: musicPhrase.replace(/(^|\s)[a-z]/g, (c) => c.toUpperCase()), Icon: MusicNote, medal: 'bg-river text-ink' };

  const messages = status
    ? status.isOpen
      ? [
          {
            text: status.closesAt ? `Open until ${status.closesAt}` : 'Open now',
            Icon: SunHorizon,
            medal: 'bg-sunset text-ink',
          },
          HAPPY,
          MUSIC,
        ]
      : [
          {
            text:
              status.reopensOn === 'today'
                ? 'Opening soon!'
                : status.reopensOn
                  ? `Opens ${status.reopensOn}${status.reopensAt ? ` at ${status.reopensAt}` : ''}!`
                  : 'See you soon!',
            Icon: Sun,
            medal: 'bg-sunset text-ink',
          },
          HAPPY,
          MUSIC,
        ]
    : [MUSIC];

  const message = messages[statusIdx % messages.length];

  return (
    <section className="relative bg-bone grain pt-9 lg:pt-10">
      <div className="page-box-wide">
      <div className="relative flex flex-wrap-reverse items-start justify-between gap-6">
        <h1 className="m-0 font-display text-titan font-extrabold uppercase text-ink">
          Eat, Drink
          <span className="sr-only">, Paradise at Rooftop at Riverside in downtown Bonita Springs</span>
        </h1>
        <p className="sr-only">{messages.map((m) => m.text).join('. ')}</p>
        <p
          aria-hidden="true"
          className="mb-1.5 flex flex-1 basis-85 items-center gap-2.5 rounded-pill bg-mint py-1.5 pr-1.5 pl-5 sm:mb-0 sm:self-stretch lg:gap-3.5 lg:py-2 lg:pr-2 lg:pl-6.5"
        >
          <span className="min-w-0 flex-1 truncate font-body text-[15px] font-medium whitespace-nowrap min-[400px]:text-pill text-ink">
            <span key={message.text} className="rt-roll block truncate">
              {message.text}
            </span>
          </span>
          <span
            key={`icon-${message.text}`}
            className={`rt-medal grid size-11 shrink-0 place-items-center rounded-pill lg:size-23 ${message.medal}`}
          >
            <message.Icon className="size-6 lg:size-11" strokeWidth="1.8" />
          </span>
        </p>
      </div>
      <div className="relative mt-3.5 lg:mt-6.5">
        <p
          ref={plateRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 -left-3.5 z-30 m-0 rounded-door bg-bone grain pr-1.5 pl-3.5 pt-[0.06em] pb-[0.1em] font-display text-titan font-extrabold uppercase text-sunset lg:px-7"
        >
          Paradise
        </p>
        <div
          ref={frameRef}
          className={`relative aspect-[6/5] w-full overflow-hidden rounded-frame bg-fog sm:aspect-video ${frameHeight ? 'h-(--frame-height)' : ''}`}
        >
          {reducedMotion ? (
            <Image
              src="/videos/hero-home.jpg"
              alt="The Rooftop at Riverside sign hanging over the sidewalk on Old 41, with the balcony and the palms behind it"
              fill
              preload
              sizes="(min-width: 1400px) 1288px, 100vw"
              className="object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              src="/videos/hero-home.mp4"
              poster="/videos/hero-home.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Rooftop at Riverside filmed from the sidewalk and from the air: the sign over Old 41, the white building with the yard and its games below, the bar inside with its screens, and the street on an event day"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          <div
            aria-hidden="true"
            className={`pointer-events-none absolute top-0 left-0 z-20 rounded-br-frame bg-bone grain ${
              notch ? 'h-(--notch-h) w-(--notch-w)' : 'h-[76px] w-[38%]'
            }`}
          >
            <span className="inverted-corner top-0 left-full" />
            <span className="inverted-corner top-full left-0" />
          </div>
          {reducedMotion ? null : (
            <button
              type="button"
              onClick={toggleMotion}
              aria-pressed={still}
              className="absolute right-3 bottom-3 z-30 grid size-11 cursor-pointer place-items-center rounded-pill bg-deep/85 text-cream ring-1 ring-cream/25 backdrop-blur-[3px] transition-colors hover:bg-deep lg:right-4 lg:bottom-4"
            >
              <span className="sr-only">Pause the video and the rotating messages</span>
              {still ? <Play className="size-4" /> : <Pause className="size-4" />}
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-start justify-between gap-x-10 gap-y-6 pt-6.5 pb-closing lg:pt-9">
        <p className="m-0 min-w-0 max-w-[62ch] flex-1 basis-[30rem] font-body text-lead font-light text-ink">
          Your favorite hotspot in Downtown Bonita Springs is waiting upstairs. Catch a cool breeze,
          a cold drink and the game on every TV at the Sunset Bar, then follow the live music
          downstairs to the Yard for some tasty American classics, Florida seafood with a twist,
          Caribbean fusion and Mexican street food. Bring the kids, bring your pets, and stay as long as you like.
        </p>
        <div className="flex flex-wrap items-center gap-3.5">
          <ButtonLink href="/whats-on" variant="primary" size="lg">
            What&rsquo;s on tonight
            <ArrowUpRight className="size-4" />
          </ButtonLink>
          <ButtonLink
            href="/events"
            variant="outline"
            size="lg"
            className="ring-ink hover:bg-ink hover:text-bone hover:ring-ink"
          >
            Now booking events
          </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
