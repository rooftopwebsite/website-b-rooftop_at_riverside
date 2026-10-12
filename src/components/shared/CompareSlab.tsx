import SoftWave from './SoftWave';
import type { Surface } from './WaveBorder';
import Image from 'next/image';
import Section from './Section';
import { ButtonLink } from './Button';
import { Eyebrow, Heading } from './Type';

export interface CompareStep {
  readonly title: string;
  readonly body: string;
}

export interface CompareColumn {
  readonly label: string;
  readonly rows?: readonly string[];
  readonly steps?: readonly CompareStep[];
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
  cta,
}: {
  readonly eyebrow?: string;
  readonly title: string;
  readonly accent?: string;
  readonly lead?: string;
  readonly id: string;
  readonly ours: CompareColumn;
  readonly theirs?: CompareColumn;
  readonly from?: Surface;
  readonly cta?: { readonly label: string; readonly href: string };
}) {
  return (
    <>
      <SoftWave from={from} to="deep" className="relative" />
      <Section tone="deep" band="lg" bandTop="sm" bandBottom="none" labelledBy={id} innerClassName="!z-[3]">
        <div className="mx-auto max-w-[46rem] text-center">
          {eyebrow ? (
            <Eyebrow tone="cream" className="justify-center">
              {eyebrow}
            </Eyebrow>
          ) : null}
          <Heading level={2} id={id} className={eyebrow ? 'mt-gap-kicker' : undefined}>
            {accent ? (
              <>
                <span className="text-sunset">{accent}</span>{' '}
              </>
            ) : null}
            {title}
          </Heading>
          {lead ? <p className="bajada mx-auto mt-gap-bajada text-paper/85">{lead}</p> : null}
          {cta ? (
            <div className="mt-gap-cta flex justify-center">
              <ButtonLink href={cta.href} variant="onDark" size="lg">
                {cta.label}
              </ButtonLink>
            </div>
          ) : null}
        </div>
        <div
          className={[
            'relative z-10 mt-18 -mb-32 grid items-stretch gap-14 lg:mt-22 lg:gap-10',
            theirs ? 'lg:grid-cols-2' : 'mx-auto max-w-[40rem]',
          ].join(' ')}
        >
          {(theirs
            ? [
                { col: ours, nuestro: true },
                { col: theirs, nuestro: false },
              ]
            : [{ col: ours, nuestro: true }]
          ).map(({ col, nuestro }) => (
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
                {col.steps ? (
                  <ol className="mt-6 flex list-none flex-col gap-7 p-0">
                    {col.steps.map((s, i) => (
                      <li key={s.title} className="flex flex-col items-center gap-2.5">
                        <span
                          aria-hidden="true"
                          className="grid size-8 shrink-0 place-items-center rounded-pill bg-teal600 font-display text-d6 leading-none font-bold text-paper"
                        >
                          {i + 1}
                        </span>
                        <span className="font-display text-d5 font-bold uppercase leading-[1.05] text-ink">
                          <span className="sr-only">Step {i + 1}: </span>
                          {s.title}
                        </span>
                        <span className="max-w-[46ch] font-body text-base leading-[1.5] text-ink">
                          {s.body}
                        </span>
                      </li>
                    ))}
                  </ol>
                ) : null}
                {col.rows ? (
                  <ul className="mt-6 flex list-none flex-col gap-6 p-0">
                    {col.rows.map((r) => (
                      <li key={r} className="flex flex-col items-center gap-2.5">
                        <span
                          aria-hidden="true"
                          className={[
                            'grid size-5.5 shrink-0 place-items-center rounded-pill text-[14px] font-bold',
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
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
