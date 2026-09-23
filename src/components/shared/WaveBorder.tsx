import { OLA } from '@/lib/brand-art';

const SURFACES = {
  paper: 'var(--color-paper)',
  bone: 'var(--color-bone)',
  cream: 'var(--color-cream)',
  mint: 'var(--color-mint)',
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
  deep: 'bg-deep',
  river: 'bg-river',
  sunset: 'bg-sunset',
};

export const SURFACE_TEXT: Record<Surface, string> = {
  paper: 'text-paper',
  bone: 'text-bone',
  cream: 'text-cream',
  mint: 'text-mint',
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
  const id = `rt-ola-${from}-${to}`;

  return (
    <div
      aria-hidden="true"
      className={['grano-capa relative w-full overflow-hidden leading-[0]', SURFACE_BG[from], className]
        .filter(Boolean)
        .join(' ')}
    >
      <svg
        width="100%"
        height={OLA.alto}
        viewBox={`0 0 1600 ${OLA.alto}`}
        preserveAspectRatio="xMinYMax slice"
        role="presentation"
        className="block"
      >
        <defs>
          <pattern
            id={id}
            width={OLA.periodo}
            height={OLA.alto}
            patternUnits="userSpaceOnUse"
          >
            <path d={OLA.d} fill={SURFACES[to]} />
          </pattern>
        </defs>
        <rect className="rt-wave" width="4000" height={OLA.alto} fill={`url(#${id})`} />
      </svg>
    </div>
  );
}
