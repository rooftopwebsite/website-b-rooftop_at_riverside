import type { ReactNode } from 'react';

const CLAMP: Record<number, string> = {
  3: 'sm:line-clamp-3',
  4: 'sm:line-clamp-4',
  5: 'sm:line-clamp-5',
  6: 'sm:line-clamp-6',
};

// Fixed-height text so every card in the grid stays the same size. The full text lives behind
// the card's "See more" button, which opens the event dialog.
export default function ExpandableBody({
  id,
  lines,
  children,
}: {
  readonly id: string;
  readonly lines: number;
  readonly children: ReactNode;
}) {
  return (
    <div
      id={id}
      className={`mt-[8px] text-[16px] leading-[1.55] text-body/80 [&>*+*]:mt-[8px] ${CLAMP[Math.min(6, Math.max(3, lines))]}`}
    >
      {children}
    </div>
  );
}
