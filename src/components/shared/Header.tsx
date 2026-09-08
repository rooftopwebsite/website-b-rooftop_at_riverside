'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { BRAND } from '@/lib/brand';
import { NAV_CTA, NAV_MAIN, NAV_MORE } from '@/lib/nav';
import { ButtonLink } from './Button';
import { GUTTER } from './Section';

/**
 * Header.
 *
 * Arquitectura del patrón de la casa (The Orient + Showdown, ver
 * docs/house-tokens.md §5): 5 destinos a la vista, el resto en un desplegable
 * «More» con label + subtítulo, y dos CTAs fijos a la derecha.
 *
 * Alto 67px, 77px desde `desk` (1344). Fijo, opaco, con sombra al scrollear.
 *
 * ⚠️ El corte del nav es `desk:` (1344) y NO `lg:` (922). Entre 768 y 1344 la
 * caja mide 880px, y el logo + 5 items + 2 CTAs no entran ahí. Es la regla de
 * la casa: si el logo tuviera que achicarse para entrar, ya va el header mobile.
 *
 * ⚠️ Comportamiento del «More», copiado de The Orient porque ya está resuelto:
 * abre por hover Y por click (sirve con mouse y con teclado) · `aria-expanded`
 * y `aria-haspopup` cuentan el estado · cierra con Escape y con click afuera ·
 * el panel vive siempre en el DOM y se oculta con `invisible`, que además lo
 * saca del recorrido del tabulador (sin eso se puede tabular a links que no se ven).
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

  // Bloquea el scroll del fondo mientras el drawer está abierto, y manda el
  // foco al botón de cerrar para que el teclado entre al panel.
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
      <header
        className={[
          'fixed inset-x-0 top-0 z-[99] flex items-center bg-paper',
          'h-header-sm desk:h-header',
          'border-b transition-[box-shadow,border-color] duration-300',
          scrolled ? 'border-ink/10 shadow-[0_2px_18px_rgba(0,0,0,0.06)]' : 'border-transparent',
          GUTTER,
        ].join(' ')}
      >
        <div className="caja flex w-full items-center justify-between gap-[16px]">
          {/* Logo. El lockup completo es circular y no entra a la altura de un
              header; se usa el mismo archivo recortado por alto. */}
          <Link
            href="/"
            aria-label={`${BRAND.name} — home`}
            className="flex shrink-0 items-center gap-[10px]"
          >
            <Image
              src="/brand/logo-lockup.png"
              alt=""
              width={120}
              height={127}
              priority
              className="h-[46px] w-auto desk:h-[56px]"
            />
            <span className="sr-only">{BRAND.name}</span>
          </Link>

          {/* ── Nav desktop ────────────────────────────────────────────── */}
          <nav aria-label="Main" className="hidden items-center desk:flex">
            {NAV_MAIN.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                aria-current={isCurrent(href) ? 'page' : undefined}
                className={[
                  'relative px-[12px] py-[8px] font-body text-caption font-bold uppercase',
                  'tracking-[0.14em] whitespace-nowrap transition-opacity duration-250',
                  isCurrent(href) ? 'text-ink' : 'text-ink/60 hover:text-ink',
                ].join(' ')}
              >
                {label}
                {/* El filete marca SÓLO la página actual. El hover se limita a
                    pintar la tipografía: si el hover también dibujara la línea,
                    el gesto se confundiría con la señal de dónde estás. */}
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
                  'whitespace-nowrap transition-opacity duration-250',
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
                <ul className="grid w-[520px] grid-cols-2 gap-[2px] rounded-card border border-ink/10 bg-paper p-[10px] shadow-card">
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
                          <span className="mt-[2px] block text-[13px] leading-[1.4] text-body/60">
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

          {/* ── CTAs ───────────────────────────────────────────────────── */}
          <div className="flex shrink-0 items-center gap-[10px]">
            <ButtonLink
              href={NAV_CTA.secondary.href}
              variant="secondary"
              className="hidden desk:inline-flex"
            >
              {NAV_CTA.secondary.label}
            </ButtonLink>
            <ButtonLink href={NAV_CTA.primary.href} variant="primary" className="hidden sm:inline-flex">
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

      {/* ── Drawer mobile ─────────────────────────────────────────────────
          Un panel completo, no un dropdown: en mobile hay 13 destinos y una
          lista larga dentro de la barra sería imposible de usar. */}
      <div
        id="mobile-nav"
        inert={!drawerOpen}
        className={[
          'fixed inset-0 z-[110] desk:hidden',
          drawerOpen ? 'visible' : 'invisible pointer-events-none',
        ].join(' ')}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => setDrawerOpen(false)}
          className={[
            'absolute inset-0 bg-ink/40 transition-opacity duration-300',
            drawerOpen ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className={[
            'absolute inset-y-0 right-0 flex w-full max-w-[400px] flex-col bg-paper',
            'transition-transform duration-300 ease-brand',
            drawerOpen ? 'translate-x-0' : 'translate-x-full',
          ].join(' ')}
        >
          <div className={`flex h-header-sm shrink-0 items-center justify-between ${GUTTER}`}>
            <Image
              src="/brand/logo-lockup.png"
              alt=""
              width={100}
              height={106}
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

          <nav
            aria-label="Site"
            className={`flex-1 overflow-y-auto pb-[32px] ${GUTTER}`}
          >
            <ul className="flex flex-col">
              {NAV_MAIN.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setDrawerOpen(false)}
                    aria-current={isCurrent(href) ? 'page' : undefined}
                    className="block border-b border-ink/10 py-[16px] font-display text-d5 uppercase"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <ul className="mt-[24px] flex flex-col gap-[2px]">
              {NAV_MORE.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setDrawerOpen(false)}
                    aria-current={isCurrent(href) ? 'page' : undefined}
                    className="block py-[9px] font-body text-caption font-bold uppercase tracking-[0.14em] text-ink/70"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-[28px] flex flex-col gap-[10px]">
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
          </nav>
        </div>
      </div>
    </>
  );
}
