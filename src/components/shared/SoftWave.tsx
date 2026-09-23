import { OLA_SUAVE } from '@/lib/brand-art';
import { SURFACE_BG, SURFACE_TEXT, type Surface } from './WaveBorder';

export default function SoftWave({
  from,
  to,
  className,
}: {
  readonly from: Surface;
  readonly to: Surface;
  readonly className: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={['grano-capa w-full overflow-hidden leading-[0]', SURFACE_BG[to], className]
        .filter(Boolean)
        .join(' ')}
    >
      <svg
        viewBox={OLA_SUAVE.viewBox}
        preserveAspectRatio="none"
        role="presentation"
        className={`rt-wave -ml-[5%] block h-[104px] w-[110%] sm:h-[136px] lg:h-[168px] ${SURFACE_TEXT[from]}`}
      >
        <path
          d={OLA_SUAVE.d}
          fill="currentColor"
          transform={`translate(0 ${OLA_SUAVE.alto}) scale(1 -1)`}
        />
      </svg>
    </div>
  );
}
