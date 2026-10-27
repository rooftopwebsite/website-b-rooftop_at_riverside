'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowRight } from '@/components/shared/Icon';

const CLAMP: Record<number, string> = {
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

export default function ExpandableBody({
  id,
  title,
  lines,
  children,
  after,
}: {
  readonly id: string;
  readonly title: string;
  readonly lines: number;
  readonly children: ReactNode;
  readonly after?: ReactNode;
}) {
  const body = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [clamps, setClamps] = useState(false);

  useEffect(() => {
    const el = body.current;
    if (!el || isOpen) return;
    const measure = () => setClamps(el.scrollHeight > el.clientHeight + 1);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isOpen]);

  return (
    <>
      <div
        ref={body}
        id={id}
        className={`mt-[8px] text-[16px] leading-[1.55] text-body/80 [&>*+*]:mt-[8px] ${isOpen ? '' : CLAMP[Math.min(12, Math.max(3, lines))]}`}
      >
        {children}
      </div>
      {after}
      {clamps || isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-controls={id}
          className="group relative z-10 mt-[14px] inline-flex w-fit items-center gap-2 border-b-2 border-sunset pb-0.5 font-body text-data font-medium text-ink transition-colors hover:text-sunset-deep max-sm:hidden"
        >
          {isOpen ? 'See less' : 'See more'}
          <span className="sr-only"> about {title}</span>
          <ArrowRight
            className={`size-3.5 text-sunset-deep transition-transform duration-200 ${isOpen ? '-rotate-90' : 'rotate-90'}`}
            aria-hidden="true"
          />
        </button>
      ) : null}
    </>
  );
}
