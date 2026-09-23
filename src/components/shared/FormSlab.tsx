import type { ReactNode } from 'react';
import Section, { type SectionBand, type SectionTone } from '@/components/shared/Section';
import { Eyebrow, Heading } from '@/components/shared/Type';

const PANEL = {
  bone: 'bg-bone',
  paper: 'bg-paper',
} as const;

export default function FormSlab({
  id,
  tone = 'paper',
  panelTone = 'bone',
  band = 'lg',
  className,
  eyebrow,
  eyebrowTone = 'terra',
  title,
  titleId,
  lead,
  aside,
  footer,
  children,
}: {
  readonly id?: string;
  readonly tone?: SectionTone;
  readonly panelTone?: keyof typeof PANEL;
  readonly band?: SectionBand;
  readonly className?: string;
  readonly eyebrow: string;
  readonly eyebrowTone?: 'deep' | 'terra' | 'plum' | 'cream';
  readonly title: ReactNode;
  readonly titleId: string;
  readonly lead?: ReactNode;
  readonly aside?: ReactNode;
  readonly footer?: ReactNode;
  readonly children: ReactNode;
}) {
  return (
    <Section
      id={id}
      tone={tone}
      band={band}
      labelledBy={titleId}
      className={['scroll-mt-24', className].filter(Boolean).join(' ')}
    >
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.5fr)] lg:gap-16">
        <div>
          <Eyebrow tone={eyebrowTone}>{eyebrow}</Eyebrow>
          <Heading level={2} id={titleId} className="mt-gap-kicker text-d4 md:text-d3 lg:text-d2">
            {title}
          </Heading>
          {lead ? (
            <p className="mt-gap-bajada max-w-[42ch] font-body text-lead font-light text-body/80">
              {lead}
            </p>
          ) : null}

          {aside ? (
            <>
              <hr className="mt-9 w-full border-0 border-t border-ink/15" />
              <div className="mt-6">{aside}</div>
            </>
          ) : null}
        </div>
        <div
          className={`relative rounded-frame ${PANEL[panelTone]} px-5 py-9 sm:px-9 sm:py-11`}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-3.5 rounded-shell border border-dashed border-deep/35"
          />
          <div className="relative">
            {children}
            {footer ? (
              <p className="mt-7 border-t border-ink/12 pt-6 font-body text-base font-light leading-[1.6] text-body/80">
                {footer}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </Section>
  );
}
