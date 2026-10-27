'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useCssVar } from '@/lib/css-var';

const STEP_OFFSET = 24;

export default function StackWithHead({
  head,
  background,
  children,
}: {
  readonly head: ReactNode;
  readonly background: string;
  readonly children: ReactNode;
}) {
  const root = useRef<HTMLDivElement | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const [heightRef, setHeight] = useState(0);
  const [tail, setTail] = useState(0);

  useEffect(() => {
    const el = ref.current;
    const r = root.current;
    if (!el || !r) return;
    const measure = () => {
      setHeight(el.offsetHeight);
      const items = r.querySelectorAll(':scope > ul > li');
      const last = items[items.length - 1] as HTMLElement | undefined;
      setTail(last ? last.offsetHeight + STEP_OFFSET * (items.length - 1) : 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    ro.observe(r);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const measured = heightRef > 0;
  useCssVar(root, '--head', `${heightRef}px`);
  useCssVar(root, '--tail', `${tail}px`);
  const header = (
    <div ref={ref} className={`sticky top-[78px] z-20 -mx-gutter px-gutter pt-4 pb-8 ${background}`}>
      {head}
    </div>
  );

  return (
    <div ref={root} className="relative [--head:0px]">
      <div
        className={
          measured
            ? 'pointer-events-none absolute inset-x-0 top-0 bottom-(--tail) z-20 [&>*]:pointer-events-auto'
            : 'relative'
        }
      >
        {header}
      </div>
      {measured ? <div aria-hidden="true" className="h-(--head)" /> : null}
      {children}
    </div>
  );
}
