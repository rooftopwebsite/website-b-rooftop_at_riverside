'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight } from '@/components/shared/Icon';
import { Heading } from '@/components/shared/Type';

const PAGINAS = [
  {
    src: '/menus/sunset-bar-1.webp',
    rotulo: 'Cocktails and specials',
    alt: 'Page one of the Sunset Bar menu: signature cocktails with their ingredients and prices, and the specials.',
  },
  {
    src: '/menus/sunset-bar-2.webp',
    rotulo: 'Beer, wine and happy hour',
    alt: 'Page two of the Sunset Bar menu: bottled beer, draft beer, seltzers and canned beer, wine by the glass, and the happy hour box.',
  },
] as const;

function Lamina({
  pdfUrl,
  rotulo,
  onAmpliar,
  className,
  children,
}: {
  readonly pdfUrl: string | null;
  readonly rotulo: string;
  readonly onAmpliar: () => void;
  readonly className: string;
  readonly children: ReactNode;
}) {
  if (pdfUrl) {
    return (
      <a
        href={pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open the full menu, ${rotulo} (opens in a new tab)`}
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onAmpliar}
      aria-label={`Enlarge the menu: ${rotulo}`}
      className={className}
    >
      {children}
    </button>
  );
}

const ANCHO = 1294;
const ALTO = 2000;

const FLECHA =
  'grid size-12 shrink-0 place-items-center rounded-pill bg-bone text-deep shadow-md transition-all duration-300 ease-brand hover:bg-paper active:scale-95 disabled:pointer-events-none disabled:opacity-40 lg:size-13';

const FLECHA_CARTA =
  'grid size-12 shrink-0 place-items-center rounded-pill bg-deep text-paper shadow-lg ring-1 ring-ink/15 transition-all duration-300 ease-brand hover:bg-deeper hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-30 lg:size-14';

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
        <p className="mx-auto mt-gap-bajada max-w-[58ch] text-lead text-body/80">
          Cocktails made daily with fresh juice and house syrups, upstairs, by us. Drafts from
          breweries down the road, and the cans everybody actually orders.
        </p>
        <div className="mx-auto mt-9 grid w-full max-w-[560px] grid-cols-[auto_minmax(0,1fr)_auto] items-center justify-items-center gap-x-3 gap-y-5 md:max-w-[720px] md:grid-cols-[auto_minmax(0,560px)_auto] md:gap-x-5 lg:mt-12 lg:max-w-[760px]">
          <button
            type="button"
            onClick={() => setIndice((i) => Math.max(0, i - 1))}
            disabled={indice === 0}
            aria-label="Previous page of the menu"
            className={`${FLECHA_CARTA} col-start-1 row-start-1`}
          >
            <ArrowLeft className="size-5 lg:size-6" />
          </button>
          <p
            aria-live="polite"
            className="col-start-2 row-start-1 m-0 text-center font-body text-caption font-semibold tracking-eyebrow text-ink/70 uppercase md:col-span-3 md:col-start-1 md:row-start-2"
          >
            Page {indice + 1} of {PAGINAS.length}
          </p>

          <button
            type="button"
            onClick={() => setIndice((i) => Math.min(PAGINAS.length - 1, i + 1))}
            disabled={indice === PAGINAS.length - 1}
            aria-label="Next page of the menu"
            className={`${FLECHA_CARTA} col-start-3 row-start-1`}
          >
            <ArrowRight className="size-5 lg:size-6" />
          </button>

          <div className="col-span-3 col-start-1 row-start-2 w-full md:col-span-1 md:col-start-2 md:row-start-1">
            <Lamina
              pdfUrl={pdfUrl}
              rotulo={pagina.rotulo}
              onAmpliar={() => setAbierto(true)}
              className="group block w-full cursor-zoom-in overflow-hidden rounded-shell bg-paper sombra-card transition-transform duration-300 ease-brand hover:-translate-y-1"
            >
              <Image
                key={pagina.src}
                src={pagina.src}
                alt={pagina.alt}
                width={ANCHO}
                height={ALTO}
                sizes="(min-width: 640px) 560px, 92vw"
                className="block h-auto w-full"
              />
              <span className="block px-5 py-4 text-center font-body text-caption font-medium text-muted transition-colors duration-200 group-hover:text-terra">
                {pdfUrl ? 'Tap to open the full menu' : 'Tap to enlarge'}
              </span>
            </Lamina>
          </div>
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
