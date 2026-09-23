import SoftWave from './SoftWave';
import type { Surface } from './WaveBorder';
import Image from 'next/image';
import Section from './Section';
import { Eyebrow, Heading } from './Type';

export interface CompareColumn {
  readonly label: string;
  readonly rows: readonly string[];
}

export const PADDING_CRUCE = 'pt-52';

export default function CompareSlab({
  eyebrow,
  title,
  accent,
  lead,
  id,
  ours,
  theirs,
  from = 'bone',
}: {
  readonly eyebrow: string;
  readonly title: string;
  readonly accent?: string;
  readonly lead?: string;
  readonly id: string;
  readonly ours: CompareColumn;
  readonly theirs: CompareColumn;
  readonly from?: Surface;
}) {
  return (
    <>
      <SoftWave from={from} to="deep" className="relative" />
      <Section tone="deep" band="lg" bandTop="sm" bandBottom="none" labelledBy={id} innerClassName="!z-[3]">
        <div className="mx-auto max-w-[46rem] text-center">
          <Eyebrow tone="cream" className="justify-center">
            {eyebrow}
          </Eyebrow>
          <Heading level={2} id={id} className="mt-gap-kicker">
            {accent ? (
              <>
                <span className="text-sunset">{accent}</span>{' '}
              </>
            ) : null}
            {title}
          </Heading>
          {lead ? <p className="bajada mx-auto mt-gap-bajada text-paper/85">{lead}</p> : null}
        </div>
        <div className="relative z-10 mt-18 -mb-32 grid items-stretch gap-14 lg:mt-22 lg:grid-cols-2 lg:gap-10">
          {[
            { col: ours, nuestro: true },
            { col: theirs, nuestro: false },
          ].map(({ col, nuestro }) => (
            <div
              key={col.label}
              className="relative flex flex-col rounded-frame bg-bone grano px-6 pt-11 pb-10 text-center sm:px-10 sm:pt-12"
            >
              <span
                aria-hidden="true"
                className={[
                  'pointer-events-none absolute inset-3.5 rounded-shell border border-dashed',
                  nuestro ? 'border-teal600/55' : 'border-terra/45',
                ].join(' ')}
              />
              <Heading level={3} className="sr-only">
                {col.label}
              </Heading>

              <span
                aria-hidden="true"
                className="sticker absolute -top-px left-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
              >
                {nuestro ? (
                  <span className="block rounded-pill bg-bone px-5 py-3">
                    <Image
                      src="/brand/isotype-truck.svg"
                      alt=""
                      width={552}
                      height={390}
                      className="h-10 w-auto"
                    />
                  </span>
                ) : (
                  <span className="-rotate-4 block rounded-pill bg-bone px-5 py-2.5 ring-2 ring-terra/65 ring-inset">
                    <span className="block font-display text-d6 font-bold uppercase leading-none whitespace-nowrap text-terra">
                      {col.label}
                    </span>
                  </span>
                )}
              </span>

              <div className="relative flex flex-1 flex-col">
                <ul className="mt-6 flex list-none flex-col gap-6 p-0">
                  {col.rows.map((r) => (
                    <li key={r} className="flex flex-col items-center gap-2.5">
                      <span
                        aria-hidden="true"
                        className={[
                          'grid size-5.5 shrink-0 place-items-center rounded-pill text-[12px] font-bold',
                          nuestro ? 'bg-teal600 text-paper' : 'bg-terra text-paper',
                        ].join(' ')}
                      >
                        {nuestro ? '✓' : '✕'}
                      </span>
                      <span className="max-w-[46ch] font-body text-base leading-[1.5] text-ink">
                        <span className="sr-only">{nuestro ? 'Yes: ' : 'No: '}</span>
                        {r}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
