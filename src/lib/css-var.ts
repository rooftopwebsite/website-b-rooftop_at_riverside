'use client';

import { useLayoutEffect, type RefObject } from 'react';

export function useCssVar(
  ref: RefObject<HTMLElement | SVGElement | null>,
  name: `--${string}`,
  value: string | null,
) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (value === null) el.style.removeProperty(name);
    else el.style.setProperty(name, value);
  }, [ref, name, value]);
}
