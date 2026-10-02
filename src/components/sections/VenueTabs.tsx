'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useId, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from '@/components/shared/Icon';
import { PhotoPending } from '@/components/shared/PendingData';
import Section from '@/components/shared/Section';
import { SectionHead } from '@/components/shared/Type';
import { VENUE_AREAS } from '@/content/venue-areas';

const TOTAL = VENUE_AREAS.length;

const cifra = (n: number) => String(n).padStart(2, '0');

const PESO = { abierto: 'grow-[5.6]', encima: 'grow-[1.35]', cerrado: 'grow' } as const;

const FLECHA =
  'grid size-11 cursor-pointer place-items-center rounded-pill bg-deep text-cream ring-1 ring-deep transition-all duration-300 ease-brand hover:bg-sunset hover:text-ink active:scale-95';

export default function VenueTabs({ id = 'place-title' }: { readonly id?: string }) {
  const [activo, setActivo] = useState(0);
  const [encima, setEncima] = useState<number | null>(null);
  const [vista, setVista] = useState(0);
  const tira = useRef<HTMLUListElement | null>(null);
  const alScroll = () => {
    const t = tira.current;
    const card = t?.firstElementChild as HTMLElement | null;
    if (!t || !card) return;
    const paso = card.getBoundingClientRect().width + 16;
    setVista(Math.min(TOTAL - 1, Math.round(t.scrollLeft / paso)));
  };
  const irA = (i: number) => {
    const t = tira.current;
    const card = t?.firstElementChild as HTMLElement | null;
    if (!t || !card) return;
    t.scrollTo({ left: i * (card.getBoundingClientRect().width + 16), behavior: 'smooth' });
  };
  const base = useId();
  const area = VENUE_AREAS[activo]!;

  const tabId = (i: number) => `${base}-tab-${i}`;
  const panelId = `${base}-panel`;

  const mover = (paso: number) => {
    const siguiente = (activo + paso + TOTAL) % TOTAL;
    setActivo(siguiente);
    document.getElementById(tabId(siguiente))?.focus();
  };

  return (
    <Section tone="bone" band="lg" labelledBy={id}>
      <div className="flex flex-col gap-6 border-b border-fog pb-7 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <SectionHead
          eyebrow="The place"
          eyebrowTone="plum"
          id={id}
          title={
            <>
              A place for <span className="text-sunset-deep">every mood</span>
            </>
          }
          lead="One property, built in layers. The bar went on the roof because that is where the sunset is, and everything else grew underneath it."
        />
        <div className="flex shrink-0 gap-2 max-md:hidden">
          <button type="button" onClick={() => mover(-1)} className={FLECHA}>
            <span className="sr-only">Previous place</span>
            <ArrowLeft className="size-4" />
          </button>
          <button type="button" onClick={() => mover(1)} className={FLECHA}>
            <span className="sr-only">Next place</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
      <div className="mt-6 md:hidden">
        <ul
          ref={tira}
          onScroll={alScroll}
          tabIndex={0}
          aria-label="Places in the building"
          className="-mx-gutter flex snap-x snap-mandatory list-none gap-4 overflow-x-auto px-gutter pb-1 scroll-px-gutter [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {VENUE_AREAS.map((a) => (
            <li key={a.slug} className="w-[calc(100%-20px)] shrink-0 snap-start">
              <div className="relative aspect-[4/5] overflow-hidden rounded-ticket bg-fog">
                {a.photo ? (
                  <Image src={a.photo} alt={a.photoAlt ?? ''} fill sizes="90vw" className="object-cover" />
                ) : (
                  <PhotoPending brief={a.photoBrief} ratio="" className="absolute inset-0 h-full rounded-none border-0" />
                )}
                <span className="absolute bottom-3 left-3 flex max-w-[calc(100%-1.5rem)] flex-col gap-1 rounded-btn bg-bone px-3.5 py-2.5">
                  <span className="font-body text-caption font-bold uppercase tracking-eyebrow text-deep">{a.floor}</span>
                  <span className="font-display text-d6 font-bold uppercase leading-none text-deep">{a.name}</span>
                </span>
              </div>
              <p className="bajada m-0 mt-4 font-body text-base font-light">{a.body}</p>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex justify-center gap-2">
          {VENUE_AREAS.map((a, i) => (
            <button
              key={a.slug}
              type="button"
              onClick={() => irA(i)}
              aria-current={i === vista ? 'true' : undefined}
              className="grid size-11 place-items-center"
            >
              <span className="sr-only">{a.name}</span>
              <span
                aria-hidden="true"
                className={`size-2.5 rounded-pill transition-colors ${i === vista ? 'bg-sunset-deep' : 'bg-deep/30'}`}
              />
            </button>
          ))}
        </div>
      </div>
      <div
        role="tablist"
        aria-label="Places in the building"
        onMouseLeave={() => setEncima(null)}
        className="mt-6 hidden md:flex md:h-[300px] md:flex-row md:gap-2 lg:h-[380px] lg:gap-3 desk:h-[440px]"
      >
        {VENUE_AREAS.map((a, i) => {
          const abierta = i === activo;
          const peso = abierta ? PESO.abierto : encima === i ? PESO.encima : PESO.cerrado;

          return (
            <button
              key={a.slug}
              type="button"
              role="tab"
              id={tabId(i)}
              aria-selected={abierta}
              aria-controls={panelId}
              tabIndex={abierta ? 0 : -1}
              aria-label={`${a.name}, ${a.floor}`}
              onMouseEnter={() => setEncima(i)}
              onClick={() => setActivo(i)}
              onKeyDown={(e) => {
                const paso =
                  e.key === 'ArrowRight' || e.key === 'ArrowDown'
                    ? 1
                    : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
                      ? -1
                      : 0;
                if (paso === 0) return;
                e.preventDefault();
                mover(paso);
              }}
              className={`group relative min-h-[52px] shrink basis-0 cursor-pointer overflow-hidden rounded-ticket border-0 bg-fog p-0 transition-[flex-grow] duration-300 ease-brand md:min-h-0 md:min-w-[44px] ${peso}`}
            >
              {a.photo ? (
                <Image
                  src={a.photo}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 60vw, 92vw"
                  className="object-cover"
                />
              ) : null}

              {!a.photo && abierta ? (
                <PhotoPending
                  brief={a.photoBrief}
                  ratio=""
                  className="absolute inset-0 h-full rounded-none border-0"
                />
              ) : null}

              {a.photo ? (
                <span
                  aria-hidden="true"
                  className={[
                    'pointer-events-none absolute inset-0 transition-colors duration-300 ease-brand',
                    abierta ? 'bg-transparent' : 'bg-ink/50 group-hover:bg-ink/25',
                  ].join(' ')}
                />
              ) : null}

              {abierta ? (
                <span className="pointer-events-none absolute bottom-3 left-3 flex max-w-[calc(100%-1.5rem)] flex-col gap-1 rounded-btn bg-bone px-3.5 py-2.5 lg:bottom-5 lg:left-5">
                  <span className="font-body text-caption font-bold uppercase tracking-eyebrow text-deep">
                    {a.floor}
                  </span>
                  <span className="truncate font-display text-d6 font-bold uppercase leading-none text-deep lg:text-d5">
                    {a.name}
                  </span>
                </span>
              ) : (
                <span className="absolute bottom-3 left-3 flex max-w-[calc(100%-1.5rem)] items-center gap-2 rounded-btn bg-bone px-2.5 py-1">
                  <span className="font-body text-caption font-bold tabular-nums tracking-eyebrow text-deep">
                    {cifra(i + 1)}
                  </span>
                  <span className="truncate font-display text-d7 font-bold uppercase leading-none text-deep md:hidden">
                    {a.name}
                  </span>
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" id={panelId} aria-labelledby={tabId(activo)} className="mt-5 max-md:hidden">
        <p className="bajada m-0 max-w-[62ch] font-body text-base font-light">{area.body}</p>
      </div>
    </Section>
  );
}
