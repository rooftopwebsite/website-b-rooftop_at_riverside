/**
 * Botones y CTAs.
 *
 * ⚠️ La ley del color se aplica ACÁ, no en cada call site:
 *
 *   primary    fondo `sunset`, texto NEGRO (8.26:1). Nunca texto blanco:
 *              sobre naranja el blanco da 2.54:1.
 *   secondary  sin relleno, filo en tinta. El default para todo lo demás.
 *   dark       fondo tinta, texto papel. Para sobre crema.
 *   onDark     para dentro de una sección `deep`: relleno crema, texto deep.
 *
 * No hay variante `river`: el teal no es un color de superficie de CTA.
 * El naranja es el CTA PRIMARIO y por eso se usa poco — si todo es primario,
 * nada lo es, y el brief pide un solo bloque de acento por página.
 */

import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

const VARIANTS = {
  primary: 'bg-sunset text-ink hover:bg-[#e0741a] border border-transparent',
  secondary:
    'bg-transparent text-ink border border-ink/25 hover:border-ink hover:bg-ink hover:text-paper',
  dark: 'bg-ink text-paper border border-ink hover:bg-transparent hover:text-ink',
  onDark:
    'bg-cream text-deep border border-cream hover:bg-transparent hover:text-cream',
} as const;

const SIZES = {
  md: 'px-[22px] py-[13px] text-caption',
  lg: 'px-[30px] py-[18px] text-cta',
} as const;

export type ButtonVariant = keyof typeof VARIANTS;

const BASE = [
  'inline-flex items-center justify-center gap-[10px]',
  'font-body font-bold uppercase tracking-[0.14em]',
  'rounded-btn',
  'transition-colors duration-250 ease-brand',
  // Un tamaño de target cómodo. WCAG 2.5.8 pide 24×24 como mínimo;
  // 44px es el que usa el resto de la casa.
  'min-h-[44px]',
].join(' ');

function classes(variant: ButtonVariant, size: keyof typeof SIZES, className?: string) {
  return [BASE, VARIANTS[variant], SIZES[size], className].filter(Boolean).join(' ');
}

export function ButtonLink({
  href,
  variant = 'secondary',
  size = 'md',
  className,
  children,
  external = false,
  ...rest
}: {
  readonly href: string;
  readonly variant?: ButtonVariant;
  readonly size?: keyof typeof SIZES;
  readonly className?: string;
  readonly children: ReactNode;
  /**
   * Abre en otra pestaña con `rel="noopener"` y avisa por texto accesible.
   * Se usa en todo lo que sale a Eventbrite o a Toast.
   */
  readonly external?: boolean;
} & Omit<ComponentProps<typeof Link>, 'href' | 'className' | 'children'>) {
  const cls = classes(variant, size, className);

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        {...(rest as ComponentProps<'a'>)}
      >
        {children}
        <ExternalIcon />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    );
  }

  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: {
  readonly variant?: ButtonVariant;
  readonly size?: keyof typeof SIZES;
  readonly className?: string;
  readonly children: ReactNode;
} & ComponentProps<'button'>) {
  return (
    <button className={classes(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

/**
 * El indicador de «se abre en otra pestaña».
 *
 * ⚠️ Es un SVG y no un emoji: el brief prohíbe emojis como iconos, y además un
 * emoji lo lee el lector de pantalla con un nombre que no dice nada útil.
 * Va `aria-hidden` porque el aviso real lo da el `sr-only` de al lado.
 */
export function ExternalIcon({ className = '' }: { readonly className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className={['shrink-0', className].filter(Boolean).join(' ')}
    >
      <path
        d="M4.5 1.5H10.5V7.5M10.5 1.5L5 7M8 8.5V10.5H1.5V4H3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Link con flecha, para los CTA de texto. La flecha se desplaza en el hover. */
export function ArrowLink({
  href,
  children,
  className = '',
  external = false,
}: {
  readonly href: string;
  readonly children: ReactNode;
  readonly className?: string;
  readonly external?: boolean;
}) {
  const inner = (
    <>
      <span className="link-texto">{children}</span>
      <svg
        width="16"
        height="10"
        viewBox="0 0 16 10"
        fill="none"
        aria-hidden="true"
        className="shrink-0 transition-transform duration-250 ease-brand group-hover:translate-x-[4px]"
      >
        <path
          d="M0 5h14M10 1l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {external ? <span className="sr-only">(opens in a new tab)</span> : null}
    </>
  );

  const cls = [
    'group inline-flex items-center gap-[10px]',
    'font-body font-bold uppercase tracking-[0.14em] text-caption',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
