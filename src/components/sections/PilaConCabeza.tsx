'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useCssVar } from '@/lib/css-var';

const ESCALON = 24;

export default function PilaConCabeza({
  cabeza,
  fondo,
  children,
}: {
  readonly cabeza: ReactNode;
  readonly fondo: string;
  readonly children: ReactNode;
}) {
  const raiz = useRef<HTMLDivElement | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const [alto, setAlto] = useState(0);
  const [cola, setCola] = useState(0);

  useEffect(() => {
    const el = ref.current;
    const r = raiz.current;
    if (!el || !r) return;
    const medir = () => {
      setAlto(el.offsetHeight);
      const items = r.querySelectorAll(':scope > ul > li');
      const ultima = items[items.length - 1] as HTMLElement | undefined;
      setCola(ultima ? ultima.offsetHeight + ESCALON * (items.length - 1) : 0);
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    ro.observe(r);
    window.addEventListener('resize', medir);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', medir);
    };
  }, []);

  const medido = alto > 0;
  useCssVar(raiz, '--cabeza', `${alto}px`);
  useCssVar(raiz, '--cola', `${cola}px`);
  const encabezado = (
    <div ref={ref} className={`sticky top-[78px] z-20 -mx-gutter px-gutter pt-4 pb-8 ${fondo}`}>
      {cabeza}
    </div>
  );

  return (
    <div ref={raiz} className="relative [--cabeza:0px]">
      <div
        className={
          medido
            ? 'pointer-events-none absolute inset-x-0 top-0 bottom-(--cola) z-20 [&>*]:pointer-events-auto'
            : 'relative'
        }
      >
        {encabezado}
      </div>
      {medido ? <div aria-hidden="true" className="h-(--cabeza)" /> : null}
      {children}
    </div>
  );
}
