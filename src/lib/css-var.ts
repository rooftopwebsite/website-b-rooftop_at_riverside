'use client';

import { useLayoutEffect, type RefObject } from 'react';

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
