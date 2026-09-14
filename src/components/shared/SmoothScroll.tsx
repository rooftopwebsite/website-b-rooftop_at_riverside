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

    /*
      ⚠️ EL `lerp` SUBIÓ DE 0.1 A 0.16, o sea que el suavizado AFLOJA. Pedido
      de Camila: «debemos disminuir un poco el lenis para que no moleste tanto
      en el scroll».

      Qué significa el número: en cada frame Lenis mueve la página ese
      porcentaje de la distancia que le falta. Con 0.1 le quedaba un arrastre
      largo —la página seguía deslizándose bastante después de soltar la rueda,
      y ese retardo entre el gesto y lo que hace la pantalla es lo que se
      siente como que el scroll «va atrás»—. Con 0.16 el mismo gesto se resuelve
      en poco más de la mitad de frames y el suavizado se nota sólo en el
      arranque y en el frenado, que es para lo que está.

      ⚠️ NO SE PONE EN 1. Eso apagaría el suavizado del todo, y el sitio lo usa
      para algo más que gusto: el `PhotoDivider` y los reveals están calibrados
      contra un scroll continuo. El pedido es «un poco menos», no «sacarlo».

      ⚠️ Con `prefers-reduced-motion` Lenis no se instancia — ver el `return`
      de arriba—, así que este número no le llega a nadie que haya pedido menos
      movimiento.
    */
    const lenis = new Lenis({ lerp: 0.16, smoothWheel: true, anchors: false });
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
