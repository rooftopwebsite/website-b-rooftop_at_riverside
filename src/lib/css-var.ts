'use client';

import { useLayoutEffect, type RefObject } from 'react';

/**
 * Escribe una variable CSS en un elemento, para los valores que sólo existen
 * en runtime: lo que mide un `ResizeObserver`, lo que se arrastra, lo que
 * avanza con el scroll.
 *
 * ⚠️ POR QUÉ EXISTE: el sitio no usa estilos en línea (regla del 2026-09-23).
 * Todo lo que se puede escribir se escribe como clase de Tailwind o en un CSS
 * Module. Lo que NO se puede es un número que recién se conoce en el
 * navegador: ahí el componente escribe `--algo` con este hook y la clase lo
 * lee (`h-(--alto)`, `translate-x-(--shift)`). El JSX queda sin `style` y el
 * estilo sigue viviendo en las clases.
 *
 * ⚠️ `useLayoutEffect` y no `useEffect`: la variable tiene que estar antes de
 * que el navegador pinte, o el primer cuadro sale con el valor viejo. En el
 * servidor no corre, y por eso toda clase que lea la variable lleva su
 * respaldo: `var(--alto, auto)`.
 *
 * `null` borra la variable, que devuelve al elemento a su respaldo.
 */
export function useCssVar(
  ref: RefObject<HTMLElement | SVGElement | null>,
  nombre: `--${string}`,
  valor: string | null,
) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (valor === null) el.style.removeProperty(nombre);
    else el.style.setProperty(nombre, valor);
  }, [ref, nombre, valor]);
}
