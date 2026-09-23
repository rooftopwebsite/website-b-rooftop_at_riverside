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

/*
 * ⚠️ CADA TONO LLEVA `grano`. El grano del sitio NO es una capa sobre el
 * viewport: se pinta como `background-image` de la superficie, que es lo que
 * lo deja debajo del contenido. Camila: «los elementos no deben tener noise
 * effect, sólo los fondos». Ver la nota de la utilidad en globals.css.
 *
 * `none` no lleva: no pinta fondo, hereda el de la página.
 */
const TONES = {
  paper: 'bg-paper grano text-body',
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
  bone: 'bg-bone grano text-body',
  cream: 'bg-cream grano text-body',
  /**
   * ⚠️ `mint` ES LA CUARTA SUPERFICIE CLARA Y SE AGREGÓ EL 2026-09-21, para la
   * banda de las tarjetas de `/food-trucks`. Camila: «el C4F2EC lo quiero detrás
   * de las cards». Es `--color-mint`, que ya estaba en la paleta y hasta ahora
   * sólo se usaba en piezas chicas.
   *
   * ⚠️ NO REEMPLAZA A `cream`: estuvo un rato ocupando su lugar en las seis
   * secciones crema del sitio y Camila lo frenó —«que eso quede como antes»—.
   * Son dos superficies distintas para dos trabajos distintos: el crema sigue
   * siendo la banda cálida de las páginas de eventos y del market, y la menta es
   * el fondo de una sola fila de tarjetas.
   *
   * ⚠️ ES UN CAMPO DE COLOR DE VERDAD, no un escalón como `bone`. Usarlo en dos
   * secciones seguidas, o en una banda larga de texto, es exactamente lo que la
   * ley del color del repo evita. Hoy tiene un solo uso.
   */
  mint: 'bg-mint grano text-body',
  /** `on-dark` invierte el anillo de foco a crema. Ver globals.css. */
  deep: 'bg-deep grano text-paper on-dark',
  none: '',
} as const;

/*
 * ⚠️ CUATRO ESCALONES Y NO DOS, desde el 2026-09-23. El par mobile/desktop
 * saltaba de golpe en 1024: una banda `lg` pasaba de 80 a 128 en un pixel de
 * viewport, y el iPad vertical quedaba con el aire del teléfono. Ahora crece
 * en `md` (768), `lg` (1024) y `desk` (1344):
 *
 *     banda   390   768   1024   1344+
 *     sm       48    56     60     64
 *     md       64    72     84     96
 *     lg       80    96    112    128
 *     xl       96   112    136    160
 *
 * Las puntas son las de antes: el teléfono y el desktop grande no se enteran.
 */
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
