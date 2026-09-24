'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export function SentPanel({
  className,
  children,
}: {
  readonly className?: string;
  readonly children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ block: 'center', behavior: quieto ? 'auto' : 'smooth' });
  }, []);
  return (
    <div
      ref={ref}
      role="status"
      tabIndex={-1}
      className={['outline-none', className].filter(Boolean).join(' ')}
    >
      {children}
    </div>
  );
}
