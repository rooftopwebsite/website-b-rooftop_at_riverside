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
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LOS ANCLAS LAS MANEJA LENIS DESDE EL 2026-09-22, y antes las dejaba al
 * navegador (`anchors: false`).
 *
 * El motivo del cambio es un bug reportado como otra cosa. Camila, sobre el
 * CTA naranja del hero de `/events`: «debe scrollear directo al formulario;
 * hoy no hace nada». El ancla funcionaba —medido: `#inquire` queda a 95px del
 * viewport después del click— pero el formulario está a 7.800px del hero, y un
 * salto instantáneo de esa distancia no se lee como «bajé hasta el
 * formulario»: se lee como que la página se rompió y apareció otra. No hay
 * ningún tránsito que diga que es la misma página.
 *
 * Con Lenis, el mismo click recorre esos 7.800px animados. La distancia se ve.
 *
 * ⚠️ VA SIN `offset`, Y EL MOTIVO ESTÁ MEDIDO. La nota vieja daba por hecho que
 * dejar a Lenis manejar los anclas obligaba a duplicar el cálculo del header, y
 * la primera versión de este cambio lo duplicó: `anchors: { offset: -93 }`.
 * Resultado en el navegador —`/events#inquire` y `/events#spaces`, los dos
 * iguales— el destino quedaba a **189px** del tope en vez de a 93. O sea el
 * doble, menos el redondeo.
 *
 * La explicación es que Lenis SÍ respeta el `scroll-margin-top` del CSS, así
 * que el offset se sumaba encima. Sin él, el destino cae exactamente donde lo
 * pone la regla `:target` de `globals.css`, que sigue siendo el único lugar
 * donde ese número está escrito.
 *
 * ⚠️ ESA REGLA DEL CSS NO ES CÓDIGO MUERTO POR ESTO: es la que gobierna el
 * salto cuando alguien llega con la URL ya anclada (`/events#inquire` escrito
 * en la barra), cuando el sitio corre con `prefers-reduced-motion` —ahí Lenis
 * no se instancia— y si el JS no carga.
 * ══════════════════════════════════════════════════════════════════════════
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
    const lenis = new Lenis({ lerp: 0.16, smoothWheel: true, anchors: true });
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
