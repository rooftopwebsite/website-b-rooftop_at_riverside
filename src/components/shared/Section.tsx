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
  /**
   * ⚠️ `bone` es el tono que da RITMO sin gritar, y se agregó porque faltaba.
   *
   * La home había quedado en cinco secciones `paper` seguidas: sin alternancia
   * de fondo, una página larga se lee como un documento. Camila: «genera ritmo
   * en la página con uso de cambio de fondos».
   *
   * Los proyectos de la casa alternan MUCHO —yava tiene 24 secciones crema, 24
   * navy, 21 naranja; the-orient 24 crema— pero acá la alternancia tiene que
   * ser sutil, porque el amarillo saturado de `cream` ya se descartó como
   * fondo grande. `bone` contra `paper` es un escalón chico y suficiente:
   * medido da **1.08:1**, o sea que el corte se ve sin meter un campo de color.
   */
  bone: 'bg-bone text-body',
  cream: 'bg-cream text-body',
  /** `on-dark` invierte el anillo de foco a crema. Ver globals.css. */
  deep: 'bg-deep text-paper on-dark',
  none: '',
} as const;

const PY = {
  sm: 'py-12 lg:py-band-sm',
  md: 'py-band-sm lg:py-band',
  lg: 'py-20 lg:py-band-lg',
  xl: 'py-band lg:py-band-xl',
  none: '',
} as const;

const PT = {
  sm: 'pt-12 lg:pt-band-sm',
  md: 'pt-band-sm lg:pt-band',
  lg: 'pt-20 lg:pt-band-lg',
  xl: 'pt-band lg:pt-band-xl',
  none: 'pt-0',
} as const;

const PB = {
  sm: 'pb-12 lg:pb-band-sm',
  md: 'pb-band-sm lg:pb-band',
  lg: 'pb-20 lg:pb-band-lg',
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
      /*
        ⚠️ `grano` ES LA TEXTURA DE PELÍCULA y entra por acá para las 23 rutas
        de una sola vez: cada `Section` es un fondo liso, y son la enorme
        mayoría de los fondos lisos del sitio. Lo que no pasa por este
        componente —el footer, la barra del header, el hero de la home— lo
        escribe a mano. El porqué de cada número está en globals.css.

        ⚠️ El `relative` que ya estaba es lo que ancla el `::before` del grano.
        No estaba puesto para eso, pero ahora también sirve para eso: sacarlo
        deja el grano anclado al primer ancestro posicionado, que puede ser el
        documento entero.
      */
      className={['relative grano', TONES[tone], spacing, GUTTER, className]
        .filter(Boolean)
        .join(' ')}
    >
      {/*
        ⚠️ EL CONTENIDO VA EN UN CONTEXTO POR ENCIMA DEL GRANO. El `::before`
        está en `z-index: 0`; sin el `relative z-[1]` de acá, cualquier hijo que
        no cree su propio contexto queda pintado por debajo del ruido. Con
        opacidad 0.05 casi no se notaría, pero «casi» sobre texto es un velo.
      */}
      <div className={['relative z-[1]', WIDTHS[width], innerClassName].filter(Boolean).join(' ')}>
        {children}
      </div>
    </Tag>
  );
}
