'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { BRAND } from '@/lib/brand';
import { NAV_CTA, NAV_MAIN, NAV_MORE } from '@/lib/nav';
import { ButtonLink } from './Button';
import { GUTTER } from './Section';
import StatusBar from './StatusBar';

/**
 * Header.
 *
 * Nav reducida de 5 + mega-menú «More» con una línea por link, doble CTA con
 * jerarquía distinta, y debajo una barra de estado de una línea.
 *
 * Alto 67px, 77px desde `desk` (1344). Fijo, opaco, sombra al scrollear.
 *
 * ⚠️ El corte del nav es `desk:` (1344) y NO `lg:` (922). Entre 768 y 1344 la
 * caja mide 880px y el logo + 5 items + 2 CTAs no entran. Regla de la casa: si
 * el logo tuviera que achicarse para entrar, ya va el header mobile.
 *
 * ⚠️ Comportamiento del «More», copiado de The Orient porque ya está resuelto:
 * abre por hover Y por click · `aria-expanded` + `aria-haspopup` · cierra con
 * Escape y con click afuera · el panel vive siempre en el DOM y se oculta con
 * `invisible`, que además lo saca del recorrido del tabulador.
 */

const SCROLL_THRESHOLD = 40;

function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return scrolled;
}

export default function Header() {
  const pathname = usePathname();
  const scrolled = useScrolled();
  const [moreOpen, setMoreOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement | null>(null);
  const drawerCloseRef = useRef<HTMLButtonElement | null>(null);

  const route = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
  const isCurrent = (href: string) => route === href || route.startsWith(`${href}/`);
  const moreActive = NAV_MORE.some((l) => isCurrent(l.href));

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMoreOpen(false);
      setDrawerOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    drawerCloseRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[99]">
        <header
          className={[
            'flex items-center bg-paper',
            'h-header-sm desk:h-header',
            'border-b transition-[box-shadow,border-color] duration-300',
            scrolled ? 'border-ink/10 shadow-[0_2px_18px_rgba(0,0,0,0.06)]' : 'border-transparent',
            GUTTER,
          ].join(' ')}
        >
          <div className="caja flex w-full items-center justify-between gap-[16px]">
            {/*
              Logo. Se reduce al scrollear: el lockup completo al tope, y una
              versión más chica una vez que el hero salió de pantalla. La
              transición es sobre `height`, no sobre `transform`, para que el
              resto de la barra no se mueva con él.
            */}
            <Link
              href="/"
              aria-label={`${BRAND.name} — home`}
              className="flex shrink-0 items-center"
            >
              <Image
                src="/brand/logo-lockup.png"
                alt=""
                width={140}
                height={148}
                priority
                className={[
                  'w-auto transition-[height] duration-300 ease-brand',
                  scrolled ? 'h-[38px] desk:h-[42px]' : 'h-[46px] desk:h-[58px]',
                ].join(' ')}
              />
              <span className="sr-only">{BRAND.name}</span>
            </Link>

            {/* ── Nav desktop ──────────────────────────────────────────── */}
            <nav aria-label="Main" className="hidden items-center desk:flex">
              {NAV_MAIN.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  aria-current={isCurrent(href) ? 'page' : undefined}
                  className={[
                    'relative px-[12px] py-[8px] font-body text-caption font-bold uppercase',
                    'tracking-[0.14em] whitespace-nowrap transition-colors duration-250',
                    isCurrent(href) ? 'text-ink' : 'text-ink/60 hover:text-ink',
                  ].join(' ')}
                >
                  {label}
                  {/* El filete marca SÓLO la página actual. El hover se limita
                      a pintar la tipografía: si el hover también dibujara la
                      línea, el gesto se confundiría con la señal de dónde estás. */}
                  {isCurrent(href) ? (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-[2px] left-[12px] h-[2px] w-[calc(100%-24px)] bg-sunset"
                    />
                  ) : null}
                </Link>
              ))}

              <div
                ref={moreRef}
                className="relative"
                onMouseEnter={() => setMoreOpen(true)}
                onMouseLeave={() => setMoreOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setMoreOpen((v) => !v)}
                  aria-expanded={moreOpen}
                  aria-haspopup="true"
                  className={[
                    'flex items-center gap-[8px] px-[12px] py-[8px]',
                    'font-body text-caption font-bold uppercase tracking-[0.14em]',
                    'whitespace-nowrap transition-colors duration-250',
                    moreActive ? 'text-ink' : 'text-ink/60 hover:text-ink',
                  ].join(' ')}
                >
                  More
                  <svg
                    width="10"
                    height="7"
                    viewBox="0 0 12 8"
                    fill="none"
                    aria-hidden="true"
                    className={`transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`}
                  >
                    <path
                      d="M1 1L6 6L11 1"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <div
                  className={[
                    'absolute top-full right-0 pt-[10px] transition-all duration-200',
                    moreOpen
                      ? 'visible translate-y-0 opacity-100'
                      : 'invisible pointer-events-none -translate-y-[4px] opacity-0',
                  ].join(' ')}
                >
                  <ul className="grid w-[560px] grid-cols-2 gap-[2px] rounded-card border border-ink/10 bg-paper p-[10px] shadow-card">
                    {NAV_MORE.map(({ label, href, hint }) => (
                      <li key={href}>
                        <Link
                          href={href}
                          onClick={() => setMoreOpen(false)}
                          aria-current={isCurrent(href) ? 'page' : undefined}
                          className="block rounded-btn px-[12px] py-[10px] transition-colors duration-200 hover:bg-cream"
                        >
                          <span className="block font-body text-[14px] font-bold uppercase tracking-[0.1em] text-ink">
                            {label}
                          </span>
                          {hint ? (
                            <span className="mt-[2px] block text-[13px] leading-[1.4] text-body/65">
                              {hint}
                            </span>
                          ) : null}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </nav>

            {/* ── Doble CTA ────────────────────────────────────────────── */}
            <div className="flex shrink-0 items-center gap-[10px]">
              <ButtonLink
                href={NAV_CTA.secondary.href}
                variant="secondary"
                className="hidden desk:inline-flex"
              >
                {NAV_CTA.secondary.label}
              </ButtonLink>
              <ButtonLink
                href={NAV_CTA.primary.href}
                variant="primary"
                className="hidden sm:inline-flex"
              >
                {NAV_CTA.primary.label}
              </ButtonLink>

              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-expanded={drawerOpen}
                aria-controls="mobile-nav"
                className="grid h-[44px] w-[44px] place-items-center desk:hidden"
              >
                <span className="sr-only">Open menu</span>
                <svg width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden="true">
                  <path d="M0 1h22M0 7h22M0 13h22" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Barra de estado. Información de alto valor y bajo costo visual: es la
            pregunta que más se hace del negocio y ocupa una línea. */}
        <StatusBar />
      </div>

      {/* ── Menú full-screen de mobile ─────────────────────────────────── */}
      <div
        id="mobile-nav"
        inert={!drawerOpen}
        className={[
          'fixed inset-0 z-[110] desk:hidden',
          drawerOpen ? 'visible' : 'invisible pointer-events-none',
        ].join(' ')}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className={[
            'absolute inset-0 flex flex-col bg-paper',
            'transition-[opacity,transform] duration-300 ease-brand',
            drawerOpen ? 'translate-y-0 opacity-100' : '-translate-y-[8px] opacity-0',
          ].join(' ')}
        >
          <div className={`flex h-header-sm shrink-0 items-center justify-between ${GUTTER}`}>
            <Image
              src="/brand/logo-lockup.png"
              alt=""
              width={110}
              height={116}
              className="h-[40px] w-auto"
            />
            <button
              ref={drawerCloseRef}
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="grid h-[44px] w-[44px] place-items-center"
            >
              <span className="sr-only">Close menu</span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>

          {/* La lista scrollea; los CTAs quedan fijos abajo. */}
          <nav aria-label="Site" className={`flex-1 overflow-y-auto pb-[24px] ${GUTTER}`}>
            <ul className="flex flex-col border-t border-ink/12">
              {[...NAV_MAIN, ...NAV_MORE].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setDrawerOpen(false)}
                    aria-current={isCurrent(href) ? 'page' : undefined}
                    className="flex items-center justify-between gap-[16px] border-b border-ink/12 py-[15px]"
                  >
                    <span
                      className={[
                        'font-display text-d5 uppercase',
                        isCurrent(href) ? 'text-ink' : 'text-ink/85',
                      ].join(' ')}
                    >
                      {label}
                    </span>
                    {/* Flecha por ítem: el brief la pide, y además marca el
                        borde derecho del target táctil. */}
                    <svg
                      width="16"
                      height="10"
                      viewBox="0 0 16 10"
                      fill="none"
                      aria-hidden="true"
                      className="shrink-0 text-ink/40"
                    >
                      <path
                        d="M0 5h14M10 1l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div
            className={`shrink-0 border-t border-ink/12 bg-paper pt-[16px] pb-[calc(16px+env(safe-area-inset-bottom))] ${GUTTER}`}
          >
            <div className="flex flex-col gap-[10px]">
              <ButtonLink
                href={NAV_CTA.primary.href}
                variant="primary"
                size="lg"
                onClick={() => setDrawerOpen(false)}
              >
                {NAV_CTA.primary.label}
              </ButtonLink>
              <ButtonLink
                href={NAV_CTA.secondary.href}
                variant="secondary"
                size="lg"
                onClick={() => setDrawerOpen(false)}
              >
                {NAV_CTA.secondary.label}
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
