import type { ComponentType, ReactNode } from 'react';
import type { IconProps } from '@/components/shared/Icon';
import { Heading } from '@/components/shared/Type';
import { RevealItem, StaggerGroup } from '@/components/shared/Motion';

export interface SpecNumber {
  readonly value: string;
  readonly label: string;
  readonly note?: ReactNode;
}

const BOX = 'rounded-shell p-5 lg:p-8';
const FIGURE = 'font-display text-d2 font-extrabold leading-none tabular-nums lg:text-d1';
const CAPTION = 'font-body text-data leading-[1.5]';

const MARKS = ['bg-sunset', 'bg-river', 'bg-deep'] as const;

function Tile({
  Icon,
  tone,
  side,
}: {
  readonly Icon: ComponentType<IconProps>;
  readonly tone: 'sunset' | 'cream';
  readonly side: 'left' | 'right';
}) {
  return (
    <span
      aria-hidden="true"
      className={[
        'absolute top-4 right-4 z-10 grid size-12 place-items-center rounded-card lg:top-5 lg:right-5 lg:size-14',
        tone === 'sunset' ? 'bg-sunset text-ink' : 'bg-cream text-deep',
      ].join(' ')}
    >
      <Icon className="size-6" />
    </span>
  );
}

export default function SpecSlab({
  title,
  id,
  figure,
  figureIcon,
  second,
  secondIcon,
  invertedText,
  invertedDetail,
  data,
}: {
  readonly title: ReactNode;
  readonly id: string;
  readonly figure: SpecNumber;
  readonly figureIcon: ComponentType<IconProps>;
  readonly second: SpecNumber;
  readonly secondIcon: ComponentType<IconProps>;
  readonly invertedText: ReactNode;
  readonly invertedDetail: readonly string[];
  readonly data: readonly (readonly [string, string])[];
}) {
  return (
    <div className="mx-auto max-w-head">
      <Heading
        level={2}
        id={id}
        className="mx-auto max-w-[16ch] text-balance text-center text-d3 lg:text-d2"
      >
        {title}
      </Heading>
      <div className="mt-block grid items-start gap-4 md:grid-cols-2 lg:gap-6">
        <StaggerGroup className="flex flex-col gap-4 lg:gap-6">
          <RevealItem>
            <article className={`relative bg-deeper pr-20 lg:pr-24 ${BOX}`}>
              <Tile Icon={figureIcon} tone="sunset" side="left" />
              <p className={`m-0 ${FIGURE} text-cream`}>{figure.value}</p>
              <p className={`m-0 mt-3 max-w-[34ch] ${CAPTION} text-bone/85`}>{figure.label}</p>
            </article>
          </RevealItem>
          <RevealItem>
            <article className={`bg-bone grain text-body ${BOX}`}>
              <p className="m-0 max-w-[34ch] font-body text-lead font-light leading-[1.5] text-ink">
                {invertedText}
              </p>
              <ul className="m-0 mt-6 flex list-none flex-col border-t border-ink/15 p-0 pt-2">
                {invertedDetail.map((d, i) => (
                  <li
                    key={d}
                    className="flex items-center gap-3 border-b border-dashed border-ink/15 py-3.5 last:border-b-0 last:pb-0"
                  >
                    <span
                      aria-hidden="true"
                      className={`size-2.5 shrink-0 rounded-[3px] ${MARKS[i % MARKS.length]}`}
                    />
                    <span className="font-display text-d6 font-bold uppercase leading-none text-ink">
                      {d}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          </RevealItem>
        </StaggerGroup>

        <StaggerGroup className="flex flex-col gap-4 lg:mt-16 lg:gap-6">
          <RevealItem>
            <article className={`bg-deeper ring-1 ring-paper/15 ring-inset ${BOX}`}>
              <dl className="m-0 flex flex-col gap-5">
                {data.map(([label, value]) => (
                  <div key={label}>
                    <dt className="font-body text-caption font-bold uppercase tracking-cta text-muted-dark">
                      {label}
                    </dt>
                    <dd className="m-0 mt-1.5 font-body text-lead font-light leading-[1.4] text-paper">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          </RevealItem>
          <RevealItem>
            <article className={`relative bg-deeper pr-20 lg:pr-24 ${BOX}`}>
              <Tile Icon={secondIcon} tone="cream" side="right" />
              <p className={`m-0 ${FIGURE} text-cream`}>{second.value}</p>
              <p className={`m-0 mt-3 max-w-[34ch] ${CAPTION} text-bone/85`}>{second.label}</p>
              {second.note ? (
                <p className={`m-0 mt-2 max-w-[34ch] ${CAPTION} text-muted-dark`}>{second.note}</p>
              ) : null}
            </article>
          </RevealItem>
        </StaggerGroup>
      </div>
    </div>
  );
}
