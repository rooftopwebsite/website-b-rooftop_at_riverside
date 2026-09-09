import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Botones y CTAs.
 *
 * ⚠️ SE FUERON LAS PÍLDORAS. Eran «la firma del sistema» cuando la referencia
 * era visitors.now, y resultaron ser justo lo que alejaba el sitio de la casa:
 * ninguna de las cuatro referencias que Camila fijó como máximas —Showdown
 * Social, WeWork, Superside, Stripe— usa píldoras. Las cuatro usan radios
 * chicos. Ahora el botón es `rounded-btn`, que son 8px.
 *
 * ⚠️ LO QUE NO CAMBIA, y es lo más importante del archivo: **sobre naranja el
 * texto va en NEGRO.** Sunset Orange #F58521 es un tono medio; blanco encima
 * da 2.54:1 y no pasa AA en ningún tamaño. Negro da 8.26:1. Showdown puede
 * poner texto blanco sobre su azul porque su azul es oscuro; el nuestro no.
 * Es el error que más veces estuvo a punto de colarse.
 *
 * ⚠️ La etiqueta va en CAJA ALTA con tracking, como en las cuatro referencias.
 * Con Jost en 500 y 0.06em de tracking el botón deja de parecer un
 * control de aplicación y pasa a leerse como señalética, que es el registro
 * del rubro.
 *
 * Variantes:
 *   primary    relleno naranja, texto NEGRO. El CTA de conversión.
 *   secondary  filo de 1px sobre el hueso. Acompaña al primario.
 *   outline    filo más marcado, sin relleno. Terciario.
 *   dark       relleno tinta, texto papel. Para usar SOBRE el naranja o la crema.
 *   onDark     relleno crema, texto deep. Para dentro de una losa oscura.
 *   ghostDark  filo claro sin relleno, dentro de una losa oscura.
 */

const VARIANTS = {
  primary: 'bg-sunset text-ink hover:bg-[#e0741a]',
  secondary: 'bg-chalk text-ink ring-1 ring-fog hover:ring-ink/35',
  outline: 'bg-transparent text-ink ring-1 ring-ink/25 hover:ring-ink/55',
  dark: 'bg-ink text-paper hover:bg-ink/85',
  onDark: 'bg-cream text-deep hover:bg-paper',
  ghostDark: 'bg-transparent text-paper ring-1 ring-paper/35 hover:ring-paper/70',
} as const;

const SIZES = {
  sm: 'h-[38px] px-[16px] text-[12px]',
  md: 'h-[46px] px-[22px] text-[13px]',
  lg: 'h-[54px] px-[28px] text-[15px]',
} as const;

export type ButtonVariant = keyof typeof VARIANTS;

const BASE = [
  'inline-flex items-center justify-center gap-[9px]',
  'font-body font-medium uppercase tracking-[0.06em]',
  'rounded-btn',
  'transition-colors duration-200',
  'disabled:opacity-50 disabled:pointer-events-none',
].join(' ');

/**
 * ⚠️ Va con `cn` y NO con `join(' ')`. Con el join, una clase que venga por
 * props no PISA la de `BASE`: queda al lado, y en Tailwind el ganador lo
 * decide el orden del CSS emitido. Concretamente `className="hidden"` contra
 * el `inline-flex` de `BASE` perdía, así que el CTA del header no se ocultaba
 * en mobile y desbordaba la barra. Ver la nota de `lib/cn.ts`.
 */
function classes(variant: ButtonVariant, size: keyof typeof SIZES, className?: string) {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
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
  /** Abre en otra pestaña con `rel="noopener"` y lo avisa por texto. */
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
 * El chip de anuncio: la píldora que va arriba del titular del hero.
 *
 * Estructura de la referencia — etiqueta de color + texto + flecha — pero la
 * etiqueta va en `terra` y no en el acento: sobre blanco, `sunset` daría
 * 2.54:1 como texto. `terra` da 7.43:1 y mantiene la familia cálida.
 */
export function AnnouncementChip({
  tag,
  children,
  href,
}: {
  readonly tag: string;
  readonly children: ReactNode;
  readonly href: string;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-[10px] rounded-pill bg-paper py-[7px] pr-[14px] pl-[8px] shadow-btn ring-1 ring-fog transition-shadow duration-200 hover:ring-ink/20"
    >
      <span className="rounded-pill bg-cream px-[9px] py-[3px] font-body text-[11px] font-bold uppercase tracking-[0.1em] text-terra">
        {tag}
      </span>
      <span className="font-body text-[15px] font-medium text-body">{children}</span>
      <svg
        width="13"
        height="9"
        viewBox="0 0 16 10"
        fill="none"
        aria-hidden="true"
        className="shrink-0 text-body/75 transition-transform duration-200 group-hover:translate-x-[3px]"
      >
        <path
          d="M0 5h14M10 1l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}

/**
 * El indicador de «se abre en otra pestaña».
 *
 * ⚠️ Es un SVG y no un emoji: el brief prohíbe emojis como iconos, y un emoji
 * lo lee el lector de pantalla con un nombre que no dice nada útil.
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
        className="shrink-0 transition-transform duration-200 group-hover:translate-x-[4px]"
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

  const cls = ['group inline-flex items-center gap-[9px] font-body text-[16px] font-medium', className]
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
