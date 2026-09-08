/**
 * Sección de página.
 *
 * El ritmo vertical vive acá y no repetido en cada página. Cada paso es un PAR
 * mobile/desktop —en un teléfono 160px de aire arriba y abajo se comen la
 * pantalla— y el padding es SIEMPRE simétrico. Ver docs/house-tokens.md §4.
 *
 * ⚠️ El `tone` pinta un fondo OPACO. Si una foto no carga, el texto tiene que
 * seguir teniendo su fondo detrás para que el contraste medido siga siendo real.
 *
 * ⚠️ Los tonos disponibles son sólo cuatro, y es la ley del color:
 *   paper  el default. El sitio es blanco.
 *   cream  la ÚNICA superficie de color grande. Una o dos secciones por página.
 *   deep   la ÚNICA superficie oscura. Sunset Bar y footer.
 *   none   hereda el de la página.
 * No hay tono `sunset` ni `river`: el naranja y el teal no pintan secciones.
 */

import type { ReactNode } from 'react';

const TONES = {
  paper: 'bg-paper text-body',
  cream: 'bg-cream text-body',
  /** `on-dark` invierte el anillo de foco a crema. Ver globals.css. */
  deep: 'bg-deep text-paper on-dark',
  none: '',
} as const;

const PY = {
  sm: 'py-[48px] lg:py-band-sm',
  md: 'py-band-sm lg:py-band',
  lg: 'py-[80px] lg:py-band-lg',
  xl: 'py-band lg:py-band-xl',
  none: '',
} as const;

const PT = {
  sm: 'pt-[48px] lg:pt-band-sm',
  md: 'pt-band-sm lg:pt-band',
  lg: 'pt-[80px] lg:pt-band-lg',
  xl: 'pt-band lg:pt-band-xl',
  none: 'pt-0',
} as const;

const PB = {
  sm: 'pb-[48px] lg:pb-band-sm',
  md: 'pb-band-sm lg:pb-band',
  lg: 'pb-[80px] lg:pb-band-lg',
  xl: 'pb-band lg:pb-band-xl',
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
      className={['relative', TONES[tone], spacing, GUTTER, className].filter(Boolean).join(' ')}
    >
      <div className={[WIDTHS[width], innerClassName].filter(Boolean).join(' ')}>{children}</div>
    </Tag>
  );
}
