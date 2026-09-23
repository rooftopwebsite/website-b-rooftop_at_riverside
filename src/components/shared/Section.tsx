import type { ReactNode } from 'react';

const TONES = {
  paper: 'bg-paper grano text-body',
  bone: 'bg-bone grano text-body',
  cream: 'bg-cream grano text-body',
  mint: 'bg-mint grano text-body',
  deep: 'bg-deep grano text-paper on-dark',
  none: '',
} as const;

const PY = {
  sm: 'py-12 md:py-14 lg:py-15 desk:py-band-sm',
  md: 'py-band-sm md:py-18 lg:py-21 desk:py-band',
  lg: 'py-20 md:py-24 lg:py-28 desk:py-band-lg',
  xl: 'py-band md:py-28 lg:py-34 desk:py-band-xl',
  none: '',
} as const;

const PT = {
  sm: 'pt-12 md:pt-14 lg:pt-15 desk:pt-band-sm',
  md: 'pt-band-sm md:pt-18 lg:pt-21 desk:pt-band',
  lg: 'pt-20 md:pt-24 lg:pt-28 desk:pt-band-lg',
  xl: 'pt-band md:pt-28 lg:pt-34 desk:pt-band-xl',
  none: 'pt-0',
} as const;

const PB = {
  sm: 'pb-12 md:pb-14 lg:pb-15 desk:pb-band-sm',
  md: 'pb-band-sm md:pb-18 lg:pb-21 desk:pb-band',
  lg: 'pb-20 md:pb-24 lg:pb-28 desk:pb-band-lg',
  xl: 'pb-band md:pb-28 lg:pb-34 desk:pb-band-xl',
  none: 'pb-0',
} as const;

const WIDTHS = {
  site: 'caja',
  prose: 'mx-auto w-full max-w-[720px]',
  full: 'w-full',
} as const;

export type SectionTone = keyof typeof TONES;
export type SectionBand = keyof typeof PY;

export const GUTTER = 'px-gutter md:px-gutter-lg';

export default function Section({
  children,
  tone = 'paper',
  band = 'md',
  bandTop,
  bandBottom,
  width = 'site',
  className = '',
  innerClassName = '',
  labelledBy,
  label,
  id,
  as: Tag = 'section',
}: {
  readonly children: ReactNode;
  readonly tone?: SectionTone;
  readonly band?: SectionBand;
  readonly bandTop?: SectionBand;
  readonly bandBottom?: SectionBand;
  readonly width?: keyof typeof WIDTHS;
  readonly className?: string;
  readonly innerClassName?: string;
  readonly labelledBy?: string;
  readonly label?: string;
  readonly id?: string;
  readonly as?: 'section' | 'div' | 'article' | 'aside';
}) {
  const spacing =
    bandTop || bandBottom ? `${PT[bandTop ?? band]} ${PB[bandBottom ?? band]}` : PY[band];

  return (
    <Tag
      {...(id ? { id } : {})}
      {...(labelledBy ? { 'aria-labelledby': labelledBy } : {})}
      {...(label ? { 'aria-label': label } : {})}
      className={['relative', TONES[tone], spacing, GUTTER, className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={['relative z-[1]', WIDTHS[width], innerClassName].filter(Boolean).join(' ')}>
        {children}
      </div>
    </Tag>
  );
}
