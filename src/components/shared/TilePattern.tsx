import { WAVE } from '@/lib/brand-art';

export default function TilePattern({
  height = 'h-[44px]',
  className = '',
}: {
  readonly height?: string;
  readonly className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={[
        'w-full bg-[url(/brand/tile-pattern.svg)] bg-size-[auto_100%] bg-center bg-repeat-x',
        height,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
}

export function TileMark({ className = '' }: { readonly className?: string }) {
  return (
    <svg
      width="52"
      height="12"
      viewBox="0 0 383.5 50"
      fill="none"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      className={className}
    >
      <path d={WAVE.d} fill="var(--color-river)" />
    </svg>
  );
}
