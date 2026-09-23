'use client';

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { useCssVar } from '@/lib/css-var';
import { useReducedMotion, useScroll, useMotionValueEvent } from 'motion/react';
import { GAMES } from '@/content/game-truck';

const CARD = { w: 280, gap: 24 };

const LOMERAS = ['bg-sunset', 'bg-river', 'bg-deep', 'bg-magenta'] as const;

export default function GameShelf({
  children,
  pie,
  ola,
}: {
  readonly children?: ReactNode;
  readonly pie?: ReactNode;
  readonly ola?: ReactNode;
}) {
  const reducido = useReducedMotion();
  const alto = useRef<HTMLDivElement | null>(null);
  const track = useRef<HTMLUListElement | null>(null);
  const caja = useRef<HTMLDivElement | null>(null);

  const [ancho, setAncho] = useState(0);
  const [izq, setIzq] = useState(0);
  const [scrollable, setScrollable] = useState(false);
  const [p, setP] = useState(0);

  useEffect(() => {
    const medir = () => {
      setAncho(window.innerWidth);
      setIzq(caja.current ? caja.current.getBoundingClientRect().left : 0);
      setScrollable(
        window.matchMedia('(min-width: 64rem) and (hover: hover) and (pointer: fine)').matches,
      );
    };
    medir();
    window.addEventListener('resize', medir);
    return () => window.removeEventListener('resize', medir);
  }, []);

  const { scrollYProgress } = useScroll({
    target: alto,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!scrollable || reducido) return;
    setP(v);
  });

  const movido = scrollable && !reducido;

  const pad = ancho >= 768 ? 32 : 16;
  const anchoTrack = GAMES.length * CARD.w + (GAMES.length - 1) * CARD.gap + pad * 2;
  const maxShift = movido ? Math.max(0, izq + anchoTrack - ancho) : 0;
  const shift = -maxShift * p;

  useCssVar(alto, '--shift', movido ? `${shift.toFixed(1)}px` : null);
  useCssVar(alto, '--progreso', movido ? p.toFixed(3) : null);
  useLayoutEffect(() => {
    const ul = track.current;
    if (!ul) return;
    Array.from(ul.children).forEach((li, i) => {
      const centro = izq + pad + i * (CARD.w + CARD.gap) + CARD.w / 2 + shift;
      const norm = ancho > 0 ? (centro - ancho / 2) / ancho : 0;
      const giro = movido ? Math.max(-4, Math.min(4, norm * 7)) : 0;
      (li as HTMLElement).style.setProperty('--giro', `${giro.toFixed(2)}deg`);
    });
  }, [ancho, izq, pad, shift, movido]);

  return (
    <div
      ref={alto}
      className="relative estante:h-[280vh]"
    >
      <div
        ref={caja}
        className="relative -mx-gutter overflow-hidden pb-[104px] sm:pb-[136px] md:-mx-gutter-lg estante:sticky estante:top-0 estante:flex estante:h-svh estante:flex-col estante:justify-center estante:pt-24 estante:pb-[168px]"
      >
        {children ? (
          <div className="caja mb-bloque px-gutter md:px-gutter-lg">{children}</div>
        ) : null}

        <div
          role={movido ? undefined : 'region'}
          aria-label={movido ? undefined : 'The games on board, scroll sideways'}
          tabIndex={movido ? undefined : 0}
          className={[
            'px-gutter scroll-px-gutter md:px-gutter-lg md:scroll-px-gutter-lg',
            'overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
            movido ? 'estante:snap-none estante:overflow-x-visible' : 'snap-x snap-mandatory',
            'py-3 -my-3',
          ].join(' ')}
        >
        <ul
          ref={track}
          className={`m-0 flex list-none gap-6 p-0 ${movido ? 'translate-x-(--shift) will-change-transform' : ''}`}
        >
          {GAMES.map((g, i) => {
            return (
              <li
                key={g}
                className="w-[240px] shrink-0 origin-center snap-start rotate-[var(--giro,0deg)] lg:w-[280px]"
              >
                <article className="chaflan relative flex h-[150px] flex-col justify-between overflow-hidden bg-bone p-4 ring-1 ring-fog ring-inset lg:h-[180px] lg:p-5">
                  <span
                    aria-hidden="true"
                    className={`absolute inset-y-0 left-0 w-2 ${LOMERAS[i % LOMERAS.length]}`}
                  />

                  <span className="relative pl-2 font-body text-micro font-bold tabular-nums tracking-cta text-muted">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="relative m-0 pl-2 font-display text-d5 font-extrabold uppercase leading-[0.95] text-ink">
                    {g}
                  </h3>
                </article>
              </li>
            );
          })}
        </ul>
        </div>
        {movido ? (
          <div aria-hidden="true" className="mt-10 hidden justify-center estante:flex">
            <span className="h-0.5 w-[min(360px,60vw)] overflow-hidden rounded-pill bg-ink/15">
              <span
                className="block h-full origin-left scale-x-[var(--progreso,0)] bg-sunset"
              />
            </span>
          </div>
        ) : null}

        {pie ? (
          <div className="caja mt-8 px-gutter text-center md:px-gutter-lg">{pie}</div>
        ) : null}

        {ola}
      </div>
    </div>
  );
}
