/**
 * «Skip to content». Primero en el orden de tabulación y sólo visible al
 * enfocarlo. WCAG 2.4.1: sin esto, alguien navegando con teclado tiene que
 * pasar por los 13 destinos del header en cada página.
 *
 * ⚠️ ES UN `<a>` NATIVO Y NO UN `<Link>`, a propósito. Con el ancla nativa el
 * navegador corre solo el punto de partida del tabulador a `#main`; `next/link`
 * resuelve el hash con su router y deja el foco en el skip link (medido el
 * 2026-09-23). Regla del sitio: anclas, `mailto:`, `tel:` y externos van como
 * `<a>`; `Link` es sólo para navegación interna.
 */
export default function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only rounded-btn focus:not-sr-only focus:fixed focus:top-[12px] focus:left-[12px] focus:z-[200] focus:bg-ink focus:px-[18px] focus:py-[12px] focus:font-body focus:text-caption focus:font-bold focus:uppercase focus:tracking-[0.14em] focus:text-paper"
    >
      Skip to content
    </a>
  );
}
