'use client';

import Link from 'next/link';

/**
 * «Skip to content». Primero en el orden de tabulación y sólo visible al
 * enfocarlo. WCAG 2.4.1: sin esto, alguien navegando con teclado tiene que
 * pasar por los 13 destinos del header en cada página.
 *
 * ⚠️ ES UN `<Link>` Y POR ESO MUEVE EL FOCO A MANO. Con un `<a href="#main">`
 * nativo, el navegador corre el punto de partida del tabulador al destino del
 * ancla. `next/link` intercepta el clic y resuelve el hash con su router: la
 * página baja, pero el foco se queda en el skip link y el siguiente Tab vuelve
 * al header. Medido el 2026-09-23 al pasar todos los links a `Link`: el salto
 * caía en la barra de horarios, fuera de `<main>`. Por eso el `focus()`, que
 * pide el `tabIndex={-1}` del `<main>` en el layout.
 */
export default function SkipLink() {
  return (
    <Link
      href="#main"
      onClick={() => document.getElementById('main')?.focus()}
      className="sr-only rounded-btn focus:not-sr-only focus:fixed focus:top-[12px] focus:left-[12px] focus:z-[200] focus:bg-ink focus:px-[18px] focus:py-[12px] focus:font-body focus:text-caption focus:font-bold focus:uppercase focus:tracking-[0.14em] focus:text-paper"
    >
      Skip to content
    </Link>
  );
}
