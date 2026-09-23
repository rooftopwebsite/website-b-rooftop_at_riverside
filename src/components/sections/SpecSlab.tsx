import type { ComponentType, ReactNode } from 'react';
import type { IconProps } from '@/components/shared/Icon';
import { Heading } from '@/components/shared/Type';
import { RevealItem, StaggerGroup } from '@/components/shared/Motion';

export interface SpecNumber {
  readonly value: string;
  readonly label: string;
  readonly note?: ReactNode;
}

const CAJA = 'rounded-shell p-5 lg:p-8';
const CIFRA = 'font-display text-d2 font-extrabold leading-none tabular-nums lg:text-d1';
const PIE = 'font-body text-dato leading-[1.5]';

const MARCAS = ['bg-sunset', 'bg-river', 'bg-deep'] as const;

function Tile({
  Icon,
  tone,
  lado,
}: {
  readonly Icon: ComponentType<IconProps>;
  readonly tone: 'sunset' | 'cream';
  readonly lado: 'left' | 'right';
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
  cifra,
  cifraIcon,
  segunda,
  segundaIcon,
  invertidaTexto,
  invertidaDetalle,
  datos,
}: {
  readonly title: ReactNode;
  readonly id: string;
  readonly cifra: SpecNumber;
  readonly cifraIcon: ComponentType<IconProps>;
  readonly segunda: SpecNumber;
  readonly segundaIcon: ComponentType<IconProps>;
  readonly invertidaTexto: ReactNode;
  readonly invertidaDetalle: readonly string[];
  readonly datos: readonly (readonly [string, string])[];
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
      <div className="mt-bloque grid items-start gap-4 md:grid-cols-2 lg:gap-6">
        <StaggerGroup className="flex flex-col gap-4 lg:gap-6">
          <RevealItem>
            <article className={`relative bg-deeper pr-20 lg:pr-24 ${CAJA}`}>
              <Tile Icon={cifraIcon} tone="sunset" lado="left" />
              <p className={`m-0 ${CIFRA} text-cream`}>{cifra.value}</p>
              <p className={`m-0 mt-3 max-w-[34ch] ${PIE} text-bone/85`}>{cifra.label}</p>
            </article>
          </RevealItem>
          <RevealItem>
            <article className={`bg-bone grano text-body ${CAJA}`}>
              <p className="m-0 max-w-[34ch] font-body text-lead font-light leading-[1.5] text-ink">
                {invertidaTexto}
              </p>
              <ul className="m-0 mt-6 flex list-none flex-col border-t border-ink/15 p-0 pt-2">
                {invertidaDetalle.map((d, i) => (
                  <li
                    key={d}
                    className="flex items-center gap-3 border-b border-dashed border-ink/15 py-3.5 last:border-b-0 last:pb-0"
                  >
                    <span
                      aria-hidden="true"
                      className={`size-2.5 shrink-0 rounded-[3px] ${MARCAS[i % MARCAS.length]}`}
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
            <article className={`bg-deeper ring-1 ring-paper/15 ring-inset ${CAJA}`}>
              <dl className="m-0 flex flex-col gap-5">
                {datos.map(([rotulo, valor]) => (
                  <div key={rotulo}>
                    <dt className="font-body text-caption font-bold uppercase tracking-cta text-muted-dark">
                      {rotulo}
                    </dt>
                    <dd className="m-0 mt-1.5 font-body text-lead font-light leading-[1.4] text-paper">
                      {valor}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          </RevealItem>
          <RevealItem>
            <article className={`relative bg-deeper pr-20 lg:pr-24 ${CAJA}`}>
              <Tile Icon={segundaIcon} tone="cream" lado="right" />
              <p className={`m-0 ${CIFRA} text-cream`}>{segunda.value}</p>
              <p className={`m-0 mt-3 max-w-[34ch] ${PIE} text-bone/85`}>{segunda.label}</p>
              {segunda.note ? (
                <p className={`m-0 mt-2 max-w-[34ch] ${PIE} text-muted-dark`}>{segunda.note}</p>
              ) : null}
            </article>
          </RevealItem>
        </StaggerGroup>
      </div>
    </div>
  );
}
