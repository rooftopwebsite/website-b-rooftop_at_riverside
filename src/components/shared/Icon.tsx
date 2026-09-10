/**
 * El set de iconos del sitio.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ POR QUÉ ESTÁN DIBUJADOS ACÁ Y NO SE INSTALA PHOSPHOR.
 *
 * El diseño de origen (`docs/desing/…/Rooftop at Riverside - Home.dc.html`)
 * pide Phosphor y lo trae por CDN con dos `<link rel="stylesheet">` a unpkg —
 * uno para el peso `regular` y otro para el `fill`. En un prototipo eso está
 * bien; acá no, y por tres motivos medidos, no por purismo:
 *
 *   · Una hoja de estilos externa BLOQUEA el render. Son dos hojas, a un host
 *     de tercero, sin `preconnect`: DNS + TLS + descarga antes del primer
 *     píxel, y en el peor caso el sitio queda sin iconos si unpkg se cae.
 *   · Las dos hojas juntas bajan la familia de iconos ENTERA —más de mil
 *     glifos— para usar catorce.
 *   · Phosphor por CSS dibuja los iconos como un `@font-face`, o sea que son
 *     TEXTO. Con `font-display:swap` aparecen tarde, y hasta que aparecen el
 *     navegador dibuja el glifo de reemplazo de la fuente de sistema: en el
 *     hero eso es un cuadrado negro dentro del círculo naranja.
 *
 * Instalar `@phosphor-icons/react` tampoco: son 14 iconos en un sitio que hoy
 * no tiene una sola dependencia de UI.
 *
 * ⚠️ NO son las curvas de Phosphor calcadas. Están redibujados en la misma
 * grilla de 24 y con el mismo peso óptico, que es lo que hace falta para que
 * el conjunto se lea parejo. Si alguna vez hay que igualar el trazo original
 * al píxel, el lugar es este archivo y nada más.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ TODOS son `aria-hidden`. Un icono acá SIEMPRE acompaña a un texto o a un
 * `aria-label` del elemento que lo contiene; ninguno carga significado solo.
 * Si alguna vez uno queda sin texto al lado, el label va en el botón o el
 * link, no acá.
 *
 * ⚠️ El tamaño va por `className` (`size-4`, `size-5`…) y no por props de
 * ancho: así el icono hereda el `currentColor` y escala con la caja.
 */

import type { ReactNode, SVGProps } from 'react';

/**
 * Lo que recibe un icono desde afuera.
 *
 * ⚠️ Sin `children` y sin `viewBox`: el dibujo y la grilla los pone el
 * icono, no quien lo usa. Si un call site pudiera pasar `children`, el set
 * dejaría de ser un set.
 */
type IconProps = Omit<SVGProps<SVGSVGElement>, 'children' | 'viewBox'>;

/** Lo que recibe el envoltorio interno, que sí dibuja. */
type SvgProps = IconProps & { readonly children: ReactNode };

/**
 * El envoltorio común.
 *
 * `stroke-width` 1.7 sobre la grilla de 24 es el peso al que el set queda a la
 * par de Phosphor Regular. Los iconos rellenos (`SunHorizon`, `Dot`) pasan
 * `fill` y anulan el trazo.
 */
function Svg({ className = 'size-5', ...rest }: SvgProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 ${className}`}
      {...rest}
    />
  );
}

/* ── Flechas y cursores ──────────────────────────────────────────────────
   Las cuatro flechas comparten la misma punta (un chevron de 45°) para que
   girar una no cambie el peso del dibujo. */

export function ArrowRight(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </Svg>
  );
}

export function ArrowLeft(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20 12H5M11 6l-6 6 6 6" />
    </Svg>
  );
}

export function ArrowUpRight(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7 17 17 7M8 7h9v9" />
    </Svg>
  );
}

export function CaretDown(props: IconProps) {
  return (
    <Svg strokeWidth="2" {...props}>
      <path d="m5 9 7 7 7-7" />
    </Svg>
  );
}

export function CaretUp(props: IconProps) {
  return (
    <Svg strokeWidth="2" {...props}>
      <path d="m5 15 7-7 7 7" />
    </Svg>
  );
}

/** «Se abre afuera»: la flecha que sale de la caja. Va en Get directions. */
export function ArrowSquareOut(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M13 4h7v7M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </Svg>
  );
}

/* ── Redes ───────────────────────────────────────────────────────────────
   Las tres son marcas registradas y por eso se dibujan como CONTORNO y no
   como el logotipo relleno: un contorno es una referencia, un logotipo
   calcado es un uso de marca. Es lo que hace el diseño de origen. */

export function Instagram(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function Facebook(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15 8.2h-1.6a1.9 1.9 0 0 0-1.9 1.9V21M9.6 13.2h4.8" />
    </Svg>
  );
}

export function Google(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M21 12.2a9 9 0 1 1-2.6-6.3" />
      <path d="M21 12.2h-8.6" />
    </Svg>
  );
}

/* ── Marca y ambiente ────────────────────────────────────────────────────── */

/**
 * El sol sobre el horizonte. Es el icono del pill de estado del hero, y el
 * único RELLENO del set: va dentro de un círculo naranja de 80px, donde un
 * contorno de 1.7 desaparece.
 */
export function SunHorizon({ className = 'size-5', ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 ${className}`}
      {...rest}
    >
      <path d="M12 5.5a5.5 5.5 0 0 1 5.5 5.5 5.4 5.4 0 0 1-.3 1.8H6.8a5.4 5.4 0 0 1-.3-1.8A5.5 5.5 0 0 1 12 5.5Z" />
      <path
        d="M12 1.6v1.9M4.4 4.4l1.4 1.4M18.2 5.8l1.4-1.4M2.6 15.4h18.8M5.4 18.9h13.2M9 22.4h6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** El punto del estado en vivo. Relleno, 8px, al lado de «Open · closes 8 PM». */
export function Dot({ className = 'size-2', ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 ${className}`}
      {...rest}
    >
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

/* ── Las tres puertas ────────────────────────────────────────────────────
   Se dibujan a 72–104px, que es diez veces el tamaño de una flecha. A ese
   cuerpo el trazo de 1.7 se ve filoso, así que los tres bajan a 1.4: el peso
   ÓPTICO es el mismo porque escala con la caja. */

export function Truck(props: IconProps) {
  return (
    <Svg strokeWidth="1.4" {...props}>
      <path d="M2.5 6.5h11v10h-11z" />
      <path d="M13.5 9.5h3.8l3.2 3.4v3.6h-7z" />
      <circle cx="7" cy="17.8" r="1.9" />
      <circle cx="17" cy="17.8" r="1.9" />
      <path d="M8.9 17.8h6.2M2.5 17.8h2.6M19 17.8h1.5" />
    </Svg>
  );
}

export function Martini(props: IconProps) {
  return (
    <Svg strokeWidth="1.4" {...props}>
      <path d="M3.4 4.5h17.2L12 13.2 3.4 4.5Z" />
      <path d="M12 13.2V20M8 20h8M6.4 7.6h11.2" />
    </Svg>
  );
}

export function Confetti(props: IconProps) {
  return (
    <Svg strokeWidth="1.4" {...props}>
      <path d="m3 21 4.6-11.6L14.6 16.4 3 21Z" />
      <path d="m9.3 11.1 3.6 3.6" />
      <path d="M14.5 3.2v2.2M20.8 9.5h-2.2M19.2 4.8l-1.6 1.6M16.6 10.9a2.6 2.6 0 0 1 2.6-2.6" />
    </Svg>
  );
}
