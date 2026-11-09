import type { ReactNode } from 'react';
import { Reveal } from './Motion';
import SoftWave from './SoftWave';
import { SURFACE_BG, type Surface } from './WaveBorder';
import { Eyebrow } from './Type';

export default function PageHeroWave({
  eyebrow,
  title,
  accent,
  lead,
  moreLead,
  from = 'paper',
  to = 'bone',
  children,
}: {
  readonly eyebrow?: string;
  readonly title: ReactNode;
  readonly accent?: string;
  readonly lead?: ReactNode;
  readonly moreLead?: ReactNode;
  readonly from?: Surface;
  readonly to?: Surface;
  readonly children?: ReactNode;
}) {
  return (
    <section aria-labelledby="page-title" className={`grain relative ${SURFACE_BG[from]}`}>
      <div className="page-box-wide pt-14 pb-28 text-center sm:pb-36 lg:pt-16 lg:pb-44">
        <Reveal>
          {eyebrow ? (
            <Eyebrow tone="deep" className="justify-center">
              {eyebrow}
            </Eyebrow>
          ) : null}

          <h1
            id="page-title"
            className="m-0 mx-auto mt-4 max-w-[18ch] text-balance font-display text-band font-extrabold uppercase leading-[0.9] text-ink"
          >
            {accent ? (
              <>
                <span className="text-sunset-deep">{accent}</span>{' '}
              </>
            ) : null}
            {title}
          </h1>

          {lead ? (
            <p className="mx-auto mt-7 max-w-[62ch] font-body text-lead font-light leading-[1.55] text-body">
              {lead}
            </p>
          ) : null}

          {moreLead ? (
            <p className="mx-auto mt-5 max-w-[62ch] font-body text-lead font-light leading-[1.55] text-body">
              {moreLead}
            </p>
          ) : null}

          {children ? (
            <div className="mt-9 flex flex-wrap justify-center gap-3">{children}</div>
          ) : null}
        </Reveal>
      </div>
      <SoftWave from={from} to={to} className="pointer-events-none absolute inset-x-0 -bottom-px" />
    </section>
  );
}
