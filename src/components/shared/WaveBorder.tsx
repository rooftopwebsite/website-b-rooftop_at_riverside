import { WAVE } from '@/lib/brand-art';

const SURFACES = {
  paper: 'var(--color-paper)',
  bone: 'var(--color-bone)',
  cream: 'var(--color-cream)',
  mint: 'var(--color-mint)',
  teal600: 'var(--color-teal600)',
  deep: 'var(--color-deep)',
  river: 'var(--color-river)',
  sunset: 'var(--color-sunset)',
} as const;

export type Surface = keyof typeof SURFACES;

export const SURFACE_BG: Record<Surface, string> = {
  paper: 'bg-paper',
  bone: 'bg-bone',
  cream: 'bg-cream',
  mint: 'bg-mint',
  teal600: 'bg-teal600',
  deep: 'bg-deep',
  river: 'bg-river',
  sunset: 'bg-sunset',
};

export const SURFACE_TEXT: Record<Surface, string> = {
  paper: 'text-paper',
  bone: 'text-bone',
  cream: 'text-cream',
  mint: 'text-mint',
  teal600: 'text-teal600',
  deep: 'text-deep',
  river: 'text-river',
  sunset: 'text-sunset',
};

export default function WaveBorder({
  from,
  to,
  className = '',
}: {
  readonly from: Surface;
  readonly to: Surface;
  readonly className?: string;
}) {
  const id = `rt-wave-gradient-${from}-${to}`;

  return (
    <div
      aria-hidden="true"
      className={['grain-layer relative w-full overflow-hidden leading-[0]', SURFACE_BG[from], className]
        .filter(Boolean)
        .join(' ')}
    >
      <svg
        width="100%"
        height={WAVE.heightRef}
        viewBox={`0 0 1600 ${WAVE.heightRef}`}
        preserveAspectRatio="xMinYMax slice"
        role="presentation"
        className="block"
      >
        <defs>
          <pattern
            id={id}
            width={WAVE.period}
            height={WAVE.heightRef}
            patternUnits="userSpaceOnUse"
          >
            <path d={WAVE.d} fill={SURFACES[to]} />
          </pattern>
        </defs>
        <rect className="rt-wave" width="4000" height={WAVE.heightRef} fill={`url(#${id})`} />
      </svg>
    </div>
  );
}
