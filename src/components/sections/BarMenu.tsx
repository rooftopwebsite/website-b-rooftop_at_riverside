'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import DishCard from '@/components/shared/DishCard';
import { Eyebrow, Heading } from '@/components/shared/Type';
import type { DishGroup } from '@/types/content';

function anchorOf(title: string): string {
  return title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const HEADER_HEIGHT = 78;

export default function BarMenu({ groups }: { readonly groups: readonly DishGroup[] }) {
  const anchors = groups.map((g) => anchorOf(g.title));
  const [active, setActive] = useState(anchors[0] ?? '');
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLElement | null>(null);

  const barHeight = useCallback(() => barRef.current?.getBoundingClientRect().height ?? 0, []);

  useEffect(() => {
    if (anchors.length === 0) return;
    let frameId = 0;

    const check = () => {
      frameId = 0;
      const line = HEADER_HEIGHT + barHeight() + 24;
      let current = anchors[0];
      for (const id of anchors) {
        const node = document.getElementById(id);
        if (node && node.getBoundingClientRect().top <= line) current = id;
      }
      setActive((prev) => (prev === current ? prev : current));
    };

    const handleScroll = () => {
      if (frameId) return;
      frameId = requestAnimationFrame(check);
    };

    check();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [anchors, barHeight]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || scroller.scrollWidth <= scroller.clientWidth) return;
    const tab = scroller.querySelector<HTMLElement>(`[data-anchor="${active}"]`);
    if (!tab) return;
    scroller.scrollTo({
      left: tab.offsetLeft - scroller.clientWidth / 2 + tab.clientWidth / 2,
      behavior: 'smooth',
    });
  }, [active]);

  const skip = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const node = document.getElementById(id);
    if (!node) return;
    e.preventDefault();
    const destination = node.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT - barHeight();
    window.scrollTo({ top: Math.max(destination, 0), behavior: 'smooth' });
    setActive(id);
    node.focus({ preventScroll: true });
  };

  return (
    <section
      aria-labelledby="bar-menu-title"
      className="band-arc relative z-[2] bg-bone grain pb-closing"
    >
      <div className="page-box-wide pt-14 lg:pt-20">
        <Eyebrow tone="plum">The list</Eyebrow>
        <Heading level={2} id="bar-menu-title" className="mt-gap-kicker text-d3 lg:text-d2">
          Everything we pour
        </Heading>
        <p className="mt-gap-subhead max-w-[62ch] text-lead text-body/80">
          Cocktails made daily with fresh juice and house syrups, upstairs, by us. Drafts from
          breweries down the road, and the cans everybody actually orders.
        </p>
      </div>
      <nav
        ref={barRef}
        aria-label="Menu sections"
        className="sticky top-19.5 z-20 mt-8 border-b border-ink/10 bg-bone grain lg:mt-10"
      >
        <div
          ref={scrollerRef}
          className="flex gap-x-6 overflow-x-auto px-edge [scrollbar-width:none] lg:gap-x-8 [&::-webkit-scrollbar]:hidden"
        >
          {groups.map((g) => {
            const id = anchorOf(g.title);
            const isActive = id === active;
            return (
              <a
                key={id}
                href={`#${id}`}
                data-anchor={id}
                onClick={(e) => skip(e, id)}
                aria-current={isActive ? 'true' : undefined}
                className={[
                  'shrink-0 border-b-2 py-4 font-body text-nav font-bold whitespace-nowrap transition-colors duration-200',
                  isActive
                    ? 'border-sunset text-ink'
                    : 'border-transparent text-body/70 hover:text-terra',
                ].join(' ')}
              >
                {g.title}
              </a>
            );
          })}
        </div>
      </nav>

      <div className="page-box-wide">
        {groups.map((g) => {
          const id = anchorOf(g.title);
          return (
            <section
              key={id}
              id={id}
              tabIndex={-1}
              aria-labelledby={`${id}-title`}
              className="scroll-mt-[136px] pt-12 lg:pt-16"
            >
              <Heading level={3} id={`${id}-title`} className="text-d4 lg:text-d3">
                {g.title}
              </Heading>
              {g.note ? (
                <p className="mt-2.5 max-w-[62ch] font-body text-base text-body/80">{g.note}</p>
              ) : null}

              <ul className="m-0 mt-6 grid list-none gap-4 p-0 sm:grid-cols-2 lg:gap-5 xl:grid-cols-3">
                {g.items.map((dish) => (
                  <li key={`${id}-${dish.name}`} className="contents-none">
                    <DishCard dish={dish} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

      </div>
    </section>
  );
}
