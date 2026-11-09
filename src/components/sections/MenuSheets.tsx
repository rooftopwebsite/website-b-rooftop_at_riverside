'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUpRight, Martini } from '@/components/shared/Icon';
import { Heading } from '@/components/shared/Type';
import { COMING_SOON_TEXT, COMING_SOON_TITLE, type BarMenu } from '@/lib/bar-menu-types';

const CARD =
  'group relative flex w-full flex-col items-center gap-6 overflow-hidden rounded-frame bg-deep grain px-7 py-10 text-center card-shadow transition-transform duration-300 ease-brand hover:-translate-y-1.5 sm:flex-row sm:gap-8 sm:px-10 sm:py-11 sm:text-left lg:gap-10 lg:px-12 lg:py-13';

function MenuSheetCard({
  pdfUrl,
  onOpen,
  children,
}: {
  readonly pdfUrl: string | null;
  readonly onOpen: () => void;
  readonly children: ReactNode;
}) {
  if (pdfUrl) {
    return (
      <a id="bar-menu-button" href={pdfUrl} target="_blank" rel="noopener noreferrer" className={`${CARD} scroll-mt-28`}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  return (
    <button id="bar-menu-button" type="button" onClick={onOpen} aria-haspopup="dialog" className={`${CARD} scroll-mt-28`}>
      {children}
    </button>
  );
}

export default function MenuSheets({
  menu = { state: 'soon', title: COMING_SOON_TITLE, text: COMING_SOON_TEXT },
}: {
  readonly menu?: BarMenu;
} = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const pdfUrl = menu.state === 'pdf' ? menu.pdfUrl : null;
  const close = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (isOpen && !d.open) d.showModal();
    if (!isOpen && d.open) d.close();

    if (!isOpen) return;
    const root = document.documentElement;
    const previousRoot = root.style.overflow;
    const previousBody = document.body.style.overflow;
    root.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      root.style.overflow = previousRoot;
      document.body.style.overflow = previousBody;
    };
  }, [isOpen]);

  return (
    <section
      aria-labelledby="bar-menu-title"
      className="band-arc relative z-[2] bg-bone grain pb-closing"
    >
      <div className="page-box-wide pt-14 text-center lg:pt-20">
        <Heading level={2} id="bar-menu-title" className="text-band text-ink">
          The bar menu
        </Heading>
        <p className="mx-auto mt-gap-subhead max-w-[58ch] text-pretty text-lead text-body/80">
          From handcrafted cocktails made with your favorite spirits, fresh juices, and house-made
          syrups to a thoughtfully selected collection of wines and local drafts, there’s plenty to
          raise a glass to at Sunset Bar. Prefer to keep it classic? We’ve got your favorite
          bottles, cans, and seltzers ready to pour.
        </p>
        <div className="mx-auto mt-9 w-full max-w-[760px] lg:mt-12">
          <MenuSheetCard pdfUrl={pdfUrl} onOpen={() => setIsOpen(true)}>
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
                {pdfUrl ? 'Opens as a PDF' : 'Coming soon'}
              </span>
              <span className="mt-gap-kicker font-display text-d4 font-extrabold uppercase leading-[0.95] text-paper lg:text-d3">
                See the full menu
              </span>
            </span>
            <span
              aria-hidden="true"
              className="relative grid size-16 shrink-0 place-items-center rounded-pill bg-sunset text-ink transition-all duration-300 ease-brand group-hover:scale-110 group-hover:bg-cream lg:size-18"
            >
              <ArrowUpRight className="size-6 transition-transform duration-300 ease-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5 lg:size-7" />
            </span>
          </MenuSheetCard>
        </div>
      </div>
      {menu.state === 'soon' ? (
        <dialog
          ref={dialogRef}
          onClose={() => setIsOpen(false)}
          onClick={(e) => {
            if (e.target === dialogRef.current) close();
          }}
          aria-labelledby="bar-menu-soon-title"
          aria-describedby="bar-menu-soon-text"
          className="m-auto w-[calc(100%-2rem)] max-w-[34rem] overflow-visible bg-transparent p-0 text-left backdrop:bg-ink/85 backdrop:backdrop-blur-sm"
        >
          <div className="relative overflow-hidden rounded-frame bg-deep grain px-7 py-10 text-center text-paper card-shadow sm:px-12 sm:py-12">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-3.5 rounded-shell border border-dashed border-paper/25"
            />
            <Martini
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -bottom-12 size-56 rotate-12 text-paper/[0.07]"
            />
            <div className="relative flex flex-col items-center gap-gap-kicker">
              <span className="font-body text-caption font-bold uppercase tracking-eyebrow text-cream">
                Sunset Bar
              </span>
              <Heading
                level={2}
                id="bar-menu-soon-title"
                className="m-0 text-d3 leading-[0.98] text-paper sm:text-d2"
              >
                {menu.title}
              </Heading>
              <p
                id="bar-menu-soon-text"
                className="m-0 mt-2 max-w-[40ch] text-pretty font-body text-lead font-light text-paper/85"
              >
                {menu.text}
              </p>
              <button
                type="button"
                onClick={close}
                className="hit-area mt-6 inline-flex h-10.5 items-center justify-center gap-2.5 rounded-pill bg-cream px-7 font-body text-d7 font-semibold text-deep transition-colors duration-200 hover:bg-paper"
              >
                Close
                <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
            </div>
          </div>
        </dialog>
      ) : null}
    </section>
  );
}
