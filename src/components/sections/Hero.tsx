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

const MARCO_DESKTOP = 1024;
const MARCO_AIRE = 24;
const MARCO_MIN = 320;

const STATUS_MS = 4600;

const MOVIMIENTO = '(prefers-reduced-motion: reduce)';
const suscribirMovimiento = (avisar: () => void) => {
  const mq = window.matchMedia(MOVIMIENTO);
  mq.addEventListener('change', avisar);
  return () => mq.removeEventListener('change', avisar);
};
const prefiereQuieto = () => window.matchMedia(MOVIMIENTO).matches;

export default function Hero({
  fraseMusica,
  fraseHappyHour,
}: {
  readonly fraseMusica: string;
  readonly fraseHappyHour: string;
}) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [quieto, setQuieto] = useState(false);
  const plateRef = useRef<HTMLParagraphElement | null>(null);
  const [notch, setNotch] = useState<{ w: number; h: number } | null>(null);
  const [marco, setMarco] = useState<number | null>(null);
  useCssVar(frameRef, '--marco', marco ? `${marco}px` : null);
  useCssVar(frameRef, '--notch-w', notch ? `${notch.w}px` : null);
  useCssVar(frameRef, '--notch-h', notch ? `${notch.h}px` : null);

  const reducido = useSyncExternalStore(suscribirMovimiento, prefiereQuieto, () => false);

  const [statusIdx, setStatusIdx] = useState(0);
  const venue = useVenue();
  const [status, setStatus] = useState<ReturnType<typeof venueStatus>>(null);

  const syncMarco = useCallback(() => {
    const frame = frameRef.current;
    const caja = frame?.parentElement;
    if (!frame || !caja) return;

    if (window.innerWidth < MARCO_DESKTOP) {
      setMarco(null);
      return;
    }

    const anchoCaja = caja.clientWidth;
    const arriba = frame.getBoundingClientRect().top + window.scrollY;
    const porPantalla = window.innerHeight - arriba - MARCO_AIRE;
    const porAncho = (anchoCaja * 9) / 16;
    const h = Math.round(Math.max(MARCO_MIN, Math.min(porPantalla, porAncho)));
    setMarco((prev) => (prev === h ? prev : h));
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
      syncMarco();
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
  }, [syncMarco, syncNotch]);

  useEffect(() => {
    setStatus(venueStatus(venue.hours, 'bar'));
  }, [venue.hours]);

  useEffect(() => {
    if (quieto || reducido) return;
    const id = setInterval(() => setStatusIdx((i) => i + 1), STATUS_MS);
    return () => clearInterval(id);
  }, [quieto, reducido]);

  const alternarMovimiento = () => {
    const video = videoRef.current;
    if (quieto) video?.play().catch(() => {});
    else video?.pause();
    setQuieto(!quieto);
  };

  const HAPPY = { text: fraseHappyHour, Icon: Martini, medalla: 'bg-cream text-ink' };
  const MUSIC = { text: fraseMusica, Icon: MusicNote, medalla: 'bg-river text-ink' };

  const messages = status
    ? status.isOpen
      ? [
          {
            text: status.closesAt ? `Open until ${status.closesAt}` : 'Open now',
            Icon: SunHorizon,
            medalla: 'bg-sunset text-ink',
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
                  ? `Opens ${status.reopensOn}!`
                  : 'See you soon!',
            Icon: Sun,
            medalla: 'bg-sunset text-ink',
          },
          HAPPY,
          MUSIC,
        ]
    : [MUSIC];

  const message = messages[statusIdx % messages.length];

  return (
    <section className="relative bg-bone grano pt-9 lg:pt-10">
      <div className="caja-ancha">
      <div className="relative flex flex-wrap-reverse items-start justify-between gap-6">
        <h1 className="m-0 font-display text-titan font-extrabold uppercase text-ink">
          Bonita comes
          <span className="sr-only"> together</span>
        </h1>
        <p className="sr-only">{messages.map((m) => m.text).join('. ')}</p>
        <p
          aria-hidden="true"
          className="mb-1.5 flex flex-1 basis-85 items-center gap-2.5 rounded-pill bg-mint py-1.5 pr-1.5 pl-5 sm:mb-0 sm:self-stretch lg:gap-3.5 lg:py-2 lg:pr-2 lg:pl-6.5"
        >
          <span className="min-w-0 flex-1 truncate font-body text-pastilla font-medium whitespace-nowrap text-ink">
            <span key={message.text} className="rt-roll inline-block max-w-full truncate align-bottom">
              {message.text}
            </span>
          </span>
          <span
            key={`icono-${message.text}`}
            className={`rt-medalla grid size-11 shrink-0 place-items-center rounded-pill lg:size-23 ${message.medalla}`}
          >
            <message.Icon className="size-6 lg:size-11" strokeWidth="1.8" />
          </span>
        </p>
      </div>
      <div className="relative mt-3.5 lg:mt-6.5">
        <p
          ref={plateRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 -left-3.5 z-30 m-0 rounded-door bg-bone grano pr-1.5 pl-3.5 pt-[0.06em] pb-[0.1em] font-display text-titan font-extrabold uppercase text-sunset lg:px-7"
        >
          Together
        </p>
        <div
          ref={frameRef}
          className={`relative aspect-[6/5] w-full overflow-hidden rounded-frame bg-fog sm:aspect-video ${marco ? 'h-(--marco)' : ''}`}
        >
          {reducido ? (
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
            className={`pointer-events-none absolute top-0 left-0 z-20 rounded-br-frame bg-bone grano ${
              notch ? 'h-(--notch-h) w-(--notch-w)' : 'h-[76px] w-[38%]'
            }`}
          >
            <span className="esquina-inversa top-0 left-full" />
            <span className="esquina-inversa top-full left-0" />
          </div>
          {reducido ? null : (
            <button
              type="button"
              onClick={alternarMovimiento}
              aria-pressed={quieto}
              className="absolute right-3 bottom-3 z-30 grid size-11 cursor-pointer place-items-center rounded-pill bg-deep/85 text-cream ring-1 ring-cream/25 backdrop-blur-[3px] transition-colors hover:bg-deep lg:right-4 lg:bottom-4"
            >
              <span className="sr-only">Pause the video and the rotating messages</span>
              {quieto ? <Play className="size-4" /> : <Pause className="size-4" />}
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-start justify-between gap-x-10 gap-y-6 pt-6.5 pb-cierre lg:pt-9">
        <p className="m-0 min-w-0 max-w-[62ch] flex-1 basis-[30rem] font-body text-lead font-light text-ink">
          Picture a cold cocktail on the roof as the sun goes down, the smell of the grill drifting
          up from the yard, a band warming up and the game on every screen. Grab a seat, bring
          your people and stay as long as you like.
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
            Rent the place
          </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
