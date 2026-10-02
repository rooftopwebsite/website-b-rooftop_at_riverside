'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowRight } from '@/components/shared/Icon';

const RECORTE: Record<number, string> = {
  3: 'sm:line-clamp-3',
  4: 'sm:line-clamp-4',
  5: 'sm:line-clamp-5',
  6: 'sm:line-clamp-6',
  7: 'sm:line-clamp-7',
  8: 'sm:line-clamp-8',
  9: 'sm:line-clamp-9',
  10: 'sm:line-clamp-10',
  11: 'sm:line-clamp-11',
  12: 'sm:line-clamp-12',
};

export default function CuerpoExpandible({
  id,
  titulo,
  lineas,
  children,
  despues,
}: {
  readonly id: string;
  readonly titulo: string;
  readonly lineas: number;
  readonly children: ReactNode;
  readonly despues?: ReactNode;
}) {
  const cuerpo = useRef<HTMLDivElement | null>(null);
  const [abierto, setAbierto] = useState(false);
  const [recorta, setRecorta] = useState(false);

  useEffect(() => {
    const el = cuerpo.current;
    if (!el || abierto) return;
    const medir = () => setRecorta(el.scrollHeight > el.clientHeight + 1);
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, [abierto]);

  return (
    <>
      <div
        ref={cuerpo}
        id={id}
        className={`mt-[8px] text-[16px] leading-[1.55] text-body/80 [&>*+*]:mt-[8px] ${abierto ? '' : RECORTE[Math.min(12, Math.max(3, lineas))]}`}
      >
        {children}
      </div>
      {despues}
      {recorta || abierto ? (
        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
          aria-controls={id}
          className="group relative z-10 mt-[14px] inline-flex w-fit items-center gap-2 border-b-2 border-sunset pb-0.5 font-body text-dato font-medium text-ink transition-colors hover:text-sunset-deep max-sm:hidden"
        >
          {abierto ? 'See less' : 'See more'}
          <span className="sr-only"> about {titulo}</span>
          <ArrowRight
            className={`size-3.5 text-sunset-deep transition-transform duration-200 ${abierto ? '-rotate-90' : 'rotate-90'}`}
            aria-hidden="true"
          />
        </button>
      ) : null}
    </>
  );
}
