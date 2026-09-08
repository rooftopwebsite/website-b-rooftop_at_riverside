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
const SIZES: Record<HeadingLevel, string> = {
  1: 'text-d4 md:text-d3 lg:text-d2',
  2: 'text-d5 md:text-d4 lg:text-d3',
  3: 'text-d6 lg:text-d5',
  4: 'text-[20px] leading-[1.3] lg:text-d6',
};

const ROLES = {
  section: null,
  hero: 'text-hero',
  card: 'text-d6 lg:text-d5',
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
        'font-display font-bold uppercase',
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
 * Eyebrow. Bronx en caja alta con 0.24em de tracking, siempre.
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
