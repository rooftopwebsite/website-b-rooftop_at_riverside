'use client';

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { useCssVar } from '@/lib/css-var';
import { useReducedMotion, useScroll, useMotionValueEvent } from 'motion/react';
import { GAMES } from '@/content/game-truck';

const CARD = { w: 280, gap: 24 };

const SPINES = ['bg-sunset', 'bg-river', 'bg-deep', 'bg-magenta'] as const;

export default function GameShelf({
  children,
  footer,
  wave,
}: {
  readonly children?: ReactNode;
  readonly footer?: ReactNode;
  readonly wave?: ReactNode;
}) {
  const reducedMotion = useReducedMotion();
  const heightRef = useRef<HTMLDivElement | null>(null);
  const track = useRef<HTMLUListElement | null>(null);
  const box = useRef<HTMLDivElement | null>(null);

  const [width, setWidth] = useState(0);
  const [left, setLeft] = useState(0);
  const [scrollable, setScrollable] = useState(false);
  const [p, setP] = useState(0);

  useEffect(() => {
    const measure = () => {
      setWidth(window.innerWidth);
      setLeft(box.current ? box.current.getBoundingClientRect().left : 0);
      setScrollable(
        window.matchMedia('(min-width: 64rem) and (hover: hover) and (pointer: fine)').matches,
      );
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: heightRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!scrollable || reducedMotion) return;
    setP(v);
  });

  const moved = scrollable && !reducedMotion;

  const pad = width >= 768 ? 32 : 16;
  const trackWidth = GAMES.length * CARD.w + (GAMES.length - 1) * CARD.gap + pad * 2;
  const maxShift = moved ? Math.max(0, left + trackWidth - width) : 0;
  const shift = -maxShift * p;

  useCssVar(heightRef, '--shift', moved ? `${shift.toFixed(1)}px` : null);
  useCssVar(heightRef, '--progress', moved ? p.toFixed(3) : null);
  useLayoutEffect(() => {
    const ul = track.current;
    if (!ul) return;
    Array.from(ul.children).forEach((li, i) => {
      const center = left + pad + i * (CARD.w + CARD.gap) + CARD.w / 2 + shift;
      const norm = width > 0 ? (center - width / 2) / width : 0;
      const turn = moved ? Math.max(-4, Math.min(4, norm * 7)) : 0;
      (li as HTMLElement).style.setProperty('--turn', `${turn.toFixed(2)}deg`);
    });
  }, [width, left, pad, shift, moved]);

  return (
    <div
      ref={heightRef}
      className="relative shelf:h-[280vh]"
    >
      <div
        ref={box}
        className="relative -mx-gutter overflow-hidden pb-[104px] sm:pb-[136px] md:-mx-gutter-lg shelf:sticky shelf:top-0 shelf:flex shelf:h-svh shelf:flex-col shelf:justify-center shelf:pt-24 shelf:pb-[168px]"
      >
        {children ? (
          <div className="page-box mb-block px-gutter md:px-gutter-lg">{children}</div>
        ) : null}

        <div
          role={moved ? undefined : 'region'}
          aria-label={moved ? undefined : 'The games on board, scroll sideways'}
          tabIndex={moved ? undefined : 0}
          className={[
            'px-gutter scroll-px-gutter md:px-gutter-lg md:scroll-px-gutter-lg',
            'overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
            moved ? 'shelf:snap-none shelf:overflow-x-visible' : 'snap-x snap-mandatory',
            'py-3 -my-3',
          ].join(' ')}
        >
        <ul
          ref={track}
          className={`m-0 flex list-none gap-6 p-0 ${moved ? 'translate-x-(--shift) will-change-transform' : ''}`}
        >
          {GAMES.map((g, i) => {
            return (
              <li
                key={g}
                className="w-[240px] shrink-0 origin-center snap-start rotate-[var(--turn,0deg)] lg:w-[280px]"
              >
                <article className="chamfer relative flex h-[150px] flex-col justify-between overflow-hidden bg-bone p-4 ring-1 ring-fog ring-inset lg:h-[180px] lg:p-5">
                  <span
                    aria-hidden="true"
                    className={`absolute inset-y-0 left-0 w-2 ${SPINES[i % SPINES.length]}`}
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
        {moved ? (
          <div aria-hidden="true" className="mt-10 hidden justify-center shelf:flex">
            <span className="h-0.5 w-[min(360px,60vw)] overflow-hidden rounded-pill bg-ink/15">
              <span
                className="block h-full origin-left scale-x-[var(--progress,0)] bg-sunset"
              />
            </span>
          </div>
        ) : null}

        {footer ? (
          <div className="page-box mt-8 px-gutter text-center md:px-gutter-lg">{footer}</div>
        ) : null}

        {wave}
      </div>
    </div>
  );
}
