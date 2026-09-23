'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import DishCard from '@/components/shared/DishCard';
import { Eyebrow, Heading } from '@/components/shared/Type';
import type { DishGroup } from '@/lib/restoexp';

function anclaDe(titulo: string): string {
  return titulo
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const ALTO_HEADER = 78;

export default function BarMenu({ grupos }: { readonly grupos: readonly DishGroup[] }) {
  const anclas = grupos.map((g) => anclaDe(g.title));
  const [activo, setActivo] = useState(anclas[0] ?? '');
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const barraRef = useRef<HTMLElement | null>(null);

  const altoBarra = useCallback(() => barraRef.current?.getBoundingClientRect().height ?? 0, []);

  useEffect(() => {
    if (anclas.length === 0) return;
    let pedido = 0;

    const revisar = () => {
      pedido = 0;
      const linea = ALTO_HEADER + altoBarra() + 24;
      let actual = anclas[0];
      for (const id of anclas) {
        const nodo = document.getElementById(id);
        if (nodo && nodo.getBoundingClientRect().top <= linea) actual = id;
      }
      setActivo((prev) => (prev === actual ? prev : actual));
    };

    const alScrollear = () => {
      if (pedido) return;
      pedido = requestAnimationFrame(revisar);
    };

    revisar();
    window.addEventListener('scroll', alScrollear, { passive: true });
    window.addEventListener('resize', alScrollear, { passive: true });
    return () => {
      if (pedido) cancelAnimationFrame(pedido);
      window.removeEventListener('scroll', alScrollear);
      window.removeEventListener('resize', alScrollear);
    };
  }, [anclas, altoBarra]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || scroller.scrollWidth <= scroller.clientWidth) return;
    const tab = scroller.querySelector<HTMLElement>(`[data-ancla="${activo}"]`);
    if (!tab) return;
    scroller.scrollTo({
      left: tab.offsetLeft - scroller.clientWidth / 2 + tab.clientWidth / 2,
      behavior: 'smooth',
    });
  }, [activo]);

  const saltar = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const nodo = document.getElementById(id);
    if (!nodo) return;
    e.preventDefault();
    const destino = nodo.getBoundingClientRect().top + window.scrollY - ALTO_HEADER - altoBarra();
    window.scrollTo({ top: Math.max(destino, 0), behavior: 'smooth' });
    setActivo(id);
    nodo.focus({ preventScroll: true });
  };

  return (
    <section
      aria-labelledby="carta-title"
      className="banda-arco relative z-[2] bg-bone grano pb-cierre"
    >
      <div className="caja-ancha pt-14 lg:pt-20">
        <Eyebrow tone="plum">The list</Eyebrow>
        <Heading level={2} id="carta-title" className="mt-gap-kicker text-d3 lg:text-d2">
          Everything we pour
        </Heading>
        <p className="mt-gap-bajada max-w-[62ch] text-lead text-body/80">
          Cocktails made daily with fresh juice and house syrups, upstairs, by us. Drafts from
          breweries down the road, and the cans everybody actually orders.
        </p>
      </div>
      <nav
        ref={barraRef}
        aria-label="Menu sections"
        className="sticky top-19.5 z-20 mt-8 border-b border-ink/10 bg-bone grano lg:mt-10"
      >
        <div
          ref={scrollerRef}
          className="flex gap-x-6 overflow-x-auto px-borde [scrollbar-width:none] lg:gap-x-8 [&::-webkit-scrollbar]:hidden"
        >
          {grupos.map((g) => {
            const id = anclaDe(g.title);
            const esActivo = id === activo;
            return (
              <a
                key={id}
                href={`#${id}`}
                data-ancla={id}
                onClick={(e) => saltar(e, id)}
                aria-current={esActivo ? 'true' : undefined}
                className={[
                  'shrink-0 border-b-2 py-4 font-body text-nav font-bold whitespace-nowrap transition-colors duration-200',
                  esActivo
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

      <div className="caja-ancha">
        {grupos.map((g) => {
          const id = anclaDe(g.title);
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
