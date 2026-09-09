/**
 * Las primitivas tipográficas: Heading, Eyebrow y SectionHead.
 *
 * Existen para que la escala no se pueda romper desde una página. Los tamaños
 * salen de docs/house-tokens.md y el mapa responsive es el de The Orient.
 */

import type { ReactNode } from 'react';

export type HeadingLevel = 1 | 2 | 3 | 4;

/**
 * El mapa responsive de la casa.
 *
 * ⚠️ `hero` es el único peldaño que no viene de la escala medida, y está
 * justificado en globals.css: Steelfish es una condensada extrema y al mismo
 * cuerpo se lee bastante más chica que la Lusitana sobre la que se midió la
 * escala. Se usa SÓLO en el h1 del hero del home.
 */
/**
 * ⚠️ Steelfish llega hasta h3 y NO MÁS. Camila: «usémosla sólo para títulos
 * grandes, o sea h1, h2 y h3». El h4 y los títulos de card pasan a Jost
 * Medium en caja MIXTA, y eso es lo que hace `FUERA_DE_DISPLAY`.
 *
 * El motivo no es sólo gusto: a 20–24px una condensada de caja alta se lee
 * como una ETIQUETA y no como un título, así que competía con los eyebrows
 * —que son literalmente eso— en vez de encabezar el bloque.
 *
 * Va en caja MIXTA y a peso 500, que es lo que lo separa del eyebrow: los dos
 * comparten familia desde que Jost reemplazó a Bronx y a Futura, así que la
 * diferencia la hacen la caja y el tracking. Un título de card en caja alta
 * con 0.24em sería un eyebrow grande, no un título.
 */
const FUERA_DE_DISPLAY =
  'font-body font-medium text-[20px] leading-[1.3] tracking-[0.01em] normal-case lg:text-[24px]';

const SIZES: Record<HeadingLevel, string> = {
  1: 'text-d4 md:text-d3 lg:text-d2',
  2: 'text-d5 md:text-d4 lg:text-d3',
  3: 'text-d6 lg:text-d5',
  4: FUERA_DE_DISPLAY,
};

const ROLES = {
  section: null,
  hero: 'text-hero',
  card: FUERA_DE_DISPLAY,
  /** Rótulo de columna de footer y encabezados de bloque chico. */
  label: 'text-d7',
} as const;

export type HeadingRole = keyof typeof ROLES;

export function Heading({
  level,
  role = 'section',
  className = '',
  id,
  children,
}: {
  readonly level: HeadingLevel;
  readonly role?: HeadingRole;
  readonly className?: string;
  readonly id?: string;
  readonly children: ReactNode;
}) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4';
  return (
    <Tag
      {...(id ? { id } : {})}
      className={[
        // Steelfish va SIEMPRE en caja alta: es una condensada de display,
        // en caja baja pierde el color de página que sostiene el diseño.
        //
        // ⚠️ Peso REGULAR, nunca alto. Camila: «en regular nunca en peso
        // alto». Estaba en `font-bold` en TODOS los niveles —no había un solo
        // título del sitio en Regular— y junto con el tracking negativo era la
        // causa de que la Steelfish se viera apelmazada.
        //
        // ⚠️ El tracking NO va acá. Lo pone cada escalón de la escala con su
        // `--text-*--letter-spacing`, así cada tamaño se lleva el suyo en
        // todos los breakpoints. Ver globals.css.
        //
        // `font-display` y `uppercase` los apagan h4 y `role="card"` con
        // `font-body` y `normal-case`, que ganan por venir después.
        'font-display font-normal uppercase',
        ROLES[role] ?? SIZES[level],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Tag>
  );
}

/**
 * El acento tipográfico DENTRO del titular.
 *
 * ⚠️ Va en COLOR y no en itálica. Camila: «usar cambio de color no itálica,
 * porque el brand no usa itálica». La referencia —wework, superside— lo hace
 * con una serif itálica de otra familia; acá no hay serif y no vamos a sumar
 * una cuarta familia por un acento, así que el contraste lo da el color.
 *
 * ⚠️ DOS colores según la superficie, y no uno. `sunset` sobre claro da
 * **2.48:1**: no alcanza ni el 3:1 que pide el texto grande (WCAG 1.4.3).
 * Sobre `deep` sí, 4.26:1. Sobre claro va `terra`, que da 7.43:1 sobre `paper`
 * y 6.47:1 sobre `cream` — y de paso es el color que ya usan los eyebrows, así
 * que no entra un color nuevo a la paleta.
 *
 * Medidos y descartados para claro: `river` 2.43:1 (falla), `tomato` 3.77:1
 * (pasa raspando, sólo texto grande), `plum` 13.15:1 y `deep` 10.55:1 (pasan,
 * pero siendo oscuros como el titular el acento no se lee como acento).
 */
export function Accent({
  on,
  children,
}: {
  /** La superficie sobre la que cae el titular, NO el color que se quiere. */
  readonly on: 'light' | 'dark';
  readonly children: ReactNode;
}) {
  return <span className={on === 'dark' ? 'text-sunset' : 'text-terra'}>{children}</span>;
}

/**
 * Eyebrow. Jost 500 en caja alta con 0.24em de tracking, siempre.
 *
 * ⚠️ Los tonos son sólo los que PASAN AA. No hay `sunset` ni `river`: sobre
 * blanco dan 2.54:1 y 2.50:1. Ver docs/contrast-audit.md.
 */
const EYEBROW_TONES = {
  deep: 'text-deep', // 10.83:1 sobre blanco · 9.44:1 sobre crema
  plum: 'text-plum', // 13.51:1 · 11.77:1
  terra: 'text-terra', //  7.43:1 ·  6.47:1
  magenta: 'text-magenta', // 5.64:1 ·  4.92:1
  cream: 'text-cream', //  9.44:1 sobre deep
  ink: 'text-ink',
} as const;

export function Eyebrow({
  children,
  tone = 'deep',
  className = '',
  as: Tag = 'p',
}: {
  readonly children: ReactNode;
  readonly tone?: keyof typeof EYEBROW_TONES;
  readonly className?: string;
  readonly as?: 'p' | 'span' | 'div';
}) {
  return (
    <Tag className={['eyebrow', EYEBROW_TONES[tone], className].filter(Boolean).join(' ')}>
      {children}
    </Tag>
  );
}

/**
 * El encabezado de sección completo: eyebrow + título + bajada.
 *
 * El ritmo interno sale de los tokens `gap-kicker` / `gap-bajada`, que ya
 * traen su escalón mobile. Ningún call site escribe un `lg:`.
 */
export function SectionHead({
  eyebrow,
  eyebrowTone,
  title,
  lead,
  level = 2,
  id,
  align = 'left',
  className = '',
  children,
}: {
  readonly eyebrow?: string;
  readonly eyebrowTone?: keyof typeof EYEBROW_TONES;
  readonly title: ReactNode;
  readonly lead?: ReactNode;
  readonly level?: HeadingLevel;
  readonly id?: string;
  readonly align?: 'left' | 'center';
  readonly className?: string;
  readonly children?: ReactNode;
}) {
  const centered = align === 'center';
  return (
    <div
      className={[
        centered ? 'mx-auto max-w-[760px] text-center' : 'max-w-[820px]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {eyebrow ? (
        <Eyebrow tone={eyebrowTone} className="mb-gap-kicker">
          {eyebrow}
        </Eyebrow>
      ) : null}
      <Heading level={level} id={id}>
        {title}
      </Heading>
      {lead ? (
        <p className="mt-gap-bajada max-w-[62ch] text-lead opacity-80">{lead}</p>
      ) : null}
      {children}
    </div>
  );
}
