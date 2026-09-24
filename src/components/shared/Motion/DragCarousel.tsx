'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

export function DragCarousel({
  children,
  className = '',
  label,
}: {
  readonly children: ReactNode;
  readonly className?: string;
  readonly label: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let startX = 0;
    let startScroll = 0;
    let active = false;

    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      active = true;
      startX = e.clientX;
      startScroll = el.scrollLeft;
    };
    const move = (e: PointerEvent) => {
      if (!active) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) < 6) return;
      setDragging(true);
      el.scrollLeft = startScroll - dx;
    };
    const up = () => {
      active = false;
      requestAnimationFrame(() => setDragging(false));
    };

    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, []);

  return (
    <div className={className}>
      <div
        ref={ref}
        role="region"
        aria-label={label}
        tabIndex={0}
        onClickCapture={(e) => {
          if (dragging) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        className={[
          'flex snap-x snap-mandatory gap-[20px] overflow-x-auto',
          'pt-6 -mt-6 pb-21 -mb-21',
          'scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          dragging ? 'cursor-grabbing select-none' : 'cursor-grab',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </div>
    </div>
  );
}
