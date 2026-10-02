'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Martini } from '@/components/shared/Icon';
import { Heading } from '@/components/shared/Type';

const PAGINAS = [
  {
    src: '/menus/sunset-bar-1.webp',
    alt: 'Page one of the Sunset Bar menu: signature cocktails with their ingredients and prices, and the specials.',
  },
  {
    src: '/menus/sunset-bar-2.webp',
    alt: 'Page two of the Sunset Bar menu: bottled beer, draft beer, seltzers and canned beer, wine by the glass, and the happy hour box.',
  },
] as const;

const ANCHO = 1294;
const ALTO = 2000;

const FLECHA =
  'grid size-12 shrink-0 place-items-center rounded-pill bg-bone text-deep shadow-md transition-all duration-300 ease-brand hover:bg-paper active:scale-95 disabled:pointer-events-none disabled:opacity-40 lg:size-13';

const CARD =
  'group relative flex w-full flex-col items-center gap-6 overflow-hidden rounded-frame bg-deep grano px-7 py-10 text-center sombra-card transition-transform duration-300 ease-brand hover:-translate-y-1.5 sm:flex-row sm:gap-8 sm:px-10 sm:py-11 sm:text-left lg:gap-10 lg:px-12 lg:py-13';

function CardCarta({
  pdfUrl,
  onAbrir,
  children,
}: {
  readonly pdfUrl: string | null;
  readonly onAbrir: () => void;
  readonly children: ReactNode;
}) {
  if (pdfUrl) {
    return (
      <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className={CARD}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  return (
    <button type="button" onClick={onAbrir} className={CARD}>
      {children}
    </button>
  );
}

export default function MenuSheets({
  pdfUrl = null,
}: {
  readonly pdfUrl?: string | null;
} = {}) {
  const [indice, setIndice] = useState(0);
  const [abierto, setAbierto] = useState(false);
  const [zoom, setZoom] = useState<string | null>(null);
  const dialogoRef = useRef<HTMLDialogElement | null>(null);

  const pagina = PAGINAS[indice];
  const cerrar = useCallback(() => dialogoRef.current?.close(), []);

  useEffect(() => {
    const d = dialogoRef.current;
    if (!d) return;
    if (abierto && !d.open) d.showModal();
    if (!abierto && d.open) d.close();

    if (!abierto) return;
    const raiz = document.documentElement;
    const previoRaiz = raiz.style.overflow;
    const previoBody = document.body.style.overflow;
    raiz.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      raiz.style.overflow = previoRaiz;
      document.body.style.overflow = previoBody;
    };
  }, [abierto]);

  return (
    <section
      aria-labelledby="carta-title"
      className="banda-arco relative z-[2] bg-bone grano pb-cierre"
    >
      <div className="caja-ancha pt-14 text-center lg:pt-20">
        <Heading level={2} id="carta-title" className="text-banda text-ink">
          The bar menu
        </Heading>
        <p className="mx-auto mt-gap-bajada max-w-[58ch] text-pretty text-lead text-body/80">
          House cocktails with your preferred spirits, handcrafted daily with fresh juice and house
          syrups. Elegant wines, local drafts from our neighborhood breweries, and the crowd
          favorite bottles, cans and seltzers.
        </p>
        <div className="mx-auto mt-9 w-full max-w-[760px] lg:mt-12">
          <CardCarta pdfUrl={pdfUrl} onAbrir={() => setAbierto(true)}>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-3.5 rounded-shell border border-dashed border-paper/25"
            />
            <Martini
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-12 -left-10 size-60 -rotate-12 text-paper/[0.07] transition-transform duration-500 ease-brand group-hover:-rotate-6 sm:top-1/2 sm:bottom-auto sm:-left-12 sm:size-64 sm:-translate-y-[46%] lg:-left-10 lg:size-72"
            />
            <span className="relative flex flex-1 flex-col">
              <span className="font-body text-caption font-bold uppercase tracking-eyebrow text-cream">
                {pdfUrl ? 'Opens as a PDF' : `${PAGINAS.length} pages`}
              </span>
              <span className="mt-gap-kicker font-display text-d4 font-extrabold uppercase leading-[0.95] text-paper lg:text-d3">
                See the full menu
              </span>
              <span className="mt-gap-bajada text-balance font-body text-base font-light text-paper/80">
                Cocktails and specials, beer, wine and happy hour.
              </span>
            </span>
            <span
              aria-hidden="true"
              className="relative grid size-16 shrink-0 place-items-center rounded-pill bg-sunset text-ink transition-all duration-300 ease-brand group-hover:scale-110 group-hover:bg-cream lg:size-18"
            >
              <ArrowUpRight className="size-6 transition-transform duration-300 ease-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5 lg:size-7" />
            </span>
          </CardCarta>
        </div>
      </div>
      {pdfUrl ? null : (
      <dialog
        ref={dialogoRef}
        onClose={() => {
          setAbierto(false);
          setZoom(null);
        }}
        onClick={(e) => {
          if (e.target === dialogoRef.current) cerrar();
        }}
        aria-label="Sunset Bar menu"
        className="h-dvh max-h-dvh w-dvw max-w-dvw overflow-auto overscroll-contain bg-transparent p-0 backdrop:bg-ink/85 backdrop:backdrop-blur-sm"
      >
        {abierto ? (
          <>
            <div className="flex min-h-full w-full items-center justify-center p-4 sm:p-8">
              <Image
                unoptimized
                key={pagina.src}
                src={pagina.src}
                alt={pagina.alt}
                width={ANCHO}
                height={ALTO}
                onClick={() => setZoom(zoom ? null : pagina.src)}
                className={[
                  'block rounded-shell bg-paper shadow-2xl',
                  zoom
                    ? 'w-[1294px] max-w-none cursor-zoom-out'
                    : 'h-auto max-h-[86dvh] w-auto max-w-full cursor-zoom-in',
                ].join(' ')}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setIndice((i) => Math.max(0, i - 1));
                setZoom(null);
              }}
              disabled={indice === 0}
              aria-label="Previous page of the menu"
              className={`${FLECHA} fixed top-1/2 left-3 z-10 -translate-y-1/2 sm:left-6`}
            >
              <ArrowLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setIndice((i) => Math.min(PAGINAS.length - 1, i + 1));
                setZoom(null);
              }}
              disabled={indice === PAGINAS.length - 1}
              aria-label="Next page of the menu"
              className={`${FLECHA} fixed top-1/2 right-3 z-10 -translate-y-1/2 sm:right-6`}
            >
              <ArrowRight className="size-5" />
            </button>
            <p className="pointer-events-none fixed bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-pill bg-ink/80 px-4 py-2 font-body text-caption font-medium text-paper sm:bottom-6">
              Page {indice + 1} of {PAGINAS.length} · {zoom ? 'Tap to fit it back' : 'Tap to zoom in'}
            </p>

            <button
              type="button"
              onClick={cerrar}
              className="fixed top-4 right-4 z-10 flex items-center gap-2 rounded-pill bg-bone px-4 py-2.5 font-body text-base font-semibold text-ink shadow-lg sm:top-6 sm:right-6"
            >
              Close
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </>
        ) : null}
      </dialog>
      )}
    </section>
  );
}
