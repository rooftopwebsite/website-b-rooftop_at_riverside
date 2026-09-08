'use client';

import Lenis from 'lenis';
import { useReducedMotion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * Scroll suave con Lenis.
 *
 * ⚠️ Esto NO es scroll hijacking. Lenis interpola el movimiento de la rueda:
 * no cambia a dónde llegás, ni cuánto scrolleás, ni te fija en secciones. La
 * barra de scroll sigue siendo la real y el teclado funciona igual.
 *
 * ⚠️ Se apaga entero con `prefers-reduced-motion`. El scroll suave es
 * exactamente el tipo de movimiento que marea a quien pide menos animación.
 *
 * ⚠️ `anchors: false` a propósito: los saltos a `#parking` los maneja el
 * navegador con el `scroll-margin-top` de globals.css, que ya compensa el
 * header fijo. Dejando que Lenis los intercepte había que duplicar ese cálculo.
 */
export default function SmoothScroll() {
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: false });
    lenisRef.current = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  // Al navegar, Lenis conserva la posición interna: sin esto la página nueva
  // abre a mitad de scroll.
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
