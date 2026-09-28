import { OLA_SUAVE } from '@/lib/brand-art';
import { SURFACE_BG, SURFACE_TEXT, type Surface } from './WaveBorder';

const ALTO = 'h-[104px] sm:h-[136px] lg:h-[168px]';

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
      {to === 'teal600' ? <span className="piedra absolute inset-0" /> : null}
      <svg
        viewBox={OLA_SUAVE.viewBox}
        preserveAspectRatio="none"
        role="presentation"
        className={`rt-wave relative -ml-[5%] block w-[110%] ${ALTO} ${SURFACE_TEXT[from]}`}
      >
        <path
          d={OLA_SUAVE.d}
          fill="currentColor"
          transform={`translate(0 ${OLA_SUAVE.alto}) scale(1 -1)`}
        />
      </svg>
      {from === 'teal600' ? (
        <span
          className={`piedra rt-wave absolute top-0 -left-[5%] w-[110%] [mask-image:url('/textures/ola-suave-mask.svg')] [mask-size:100%_100%] ${ALTO}`}
        />
      ) : null}
    </div>
  );
}
