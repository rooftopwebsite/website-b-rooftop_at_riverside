import { SOFT_WAVE } from '@/lib/brand-art';
import { SURFACE_BG, SURFACE_TEXT, type Surface } from './WaveBorder';

const HEIGHT = 'h-[104px] sm:h-[136px] lg:h-[168px]';

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
      className={['grain-layer w-full overflow-hidden leading-[0]', SURFACE_BG[to], className]
        .filter(Boolean)
        .join(' ')}
    >
      {to === 'teal600' ? <span className="stone absolute inset-0" /> : null}
      <svg
        viewBox={SOFT_WAVE.viewBox}
        preserveAspectRatio="none"
        role="presentation"
        className={`rt-wave relative -ml-[5%] block w-[110%] ${HEIGHT} ${SURFACE_TEXT[from]}`}
      >
        <path
          d={SOFT_WAVE.d}
          fill="currentColor"
          transform={`translate(0 ${SOFT_WAVE.heightRef}) scale(1 -1)`}
        />
      </svg>
      {from === 'teal600' ? (
        <span
          className={`stone rt-wave absolute top-0 -left-[5%] w-[110%] [mask-image:url('/textures/soft-wave-mask.svg')] [mask-size:100%_100%] ${HEIGHT}`}
        />
      ) : null}
    </div>
  );
}
