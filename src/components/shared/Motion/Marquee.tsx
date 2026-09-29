import type { ReactNode } from 'react';

export function Marquee({
  children,
  durationClassName = '',
  className = '',
  itemClassName = '',
  label,
}: {
  readonly children: ReactNode;
  readonly durationClassName?: string;
  readonly className?: string;
  readonly itemClassName?: string;
  readonly label: string;
}) {
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label={label}
      className={['group/marquee overflow-hidden', className].filter(Boolean).join(' ')}
    >
      <div
        className={[
          'rt-marquee flex w-max group-hover/marquee:[animation-play-state:paused] group-focus-within/marquee:[animation-play-state:paused]',
          durationClassName,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className={['flex shrink-0', itemClassName].filter(Boolean).join(' ')}>{children}</div>
        <div className={['flex shrink-0', itemClassName].filter(Boolean).join(' ')} aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
