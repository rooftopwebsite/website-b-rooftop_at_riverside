/**
 * El set de iconos del sitio.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ POR QUÉ ESTÁN DIBUJADOS ACÁ Y NO SE INSTALA PHOSPHOR.
 *
 * El diseño de origen (`_interno/design-source-bundle/…/Rooftop at Riverside -
 * Home.dc.html`, fuera de git desde el 2026-09-11: es material del cliente)
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

/**
 * La luna. Es el icono de «cerrado» en el pill del hero.
 *
 * ⚠️ Es un CRECIENTE dibujado como una sola silueta —un arco grande al que
 * le muerde otro arco— y no un círculo con una sombra encima. Con dos formas
 * superpuestas habría que pintar la mordida del color del fondo, y el pill
 * cambia de fondo según el estado. Así el contorno funciona sobre cualquier
 * superficie.
 */
export function Moon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20.6 14.4A8.7 8.7 0 0 1 9.6 3.4a8.7 8.7 0 1 0 11 11Z" />
    </Svg>
  );
}

/**
 * Dos corcheas unidas por la barra. El icono de «música en vivo».
 *
 * ⚠️ Las cabezas son círculos y no elipses inclinadas. A 26px —el tamaño al
 * que se usa, dentro del círculo naranja del hero— una elipse rotada se lee
 * como una mancha sucia; el círculo se lee como una nota.
 */
export function MusicNote(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9 17.4V5.5l11-2v11.9" />
      <circle cx="6.4" cy="17.4" r="2.6" />
      <circle cx="17.4" cy="15.4" r="2.6" />
    </Svg>
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

/**
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LOS TRES ESTÁN REDIBUJADOS. La primera versión se veía mal a 104px y
 * conviene dejar anotado QUÉ estaba mal, porque los tres errores son los
 * típicos de dibujar un icono pensándolo a 20px:
 *
 *   · El camión tenía las ruedas en `cy=17.8 r=1.9`, o sea que su borde
 *     superior quedaba en 15.9 mientras la caja terminaba en 16.5: las
 *     ruedas se montaban 0,6 sobre la carrocería. Y encima había tres
 *     segmentos de «piso» a la altura del EJE, que dejaban la caja flotando
 *     sobre una línea suelta. A 20px no se nota; a 104 es lo primero que se
 *     ve.
 *   · El confeti era directamente ilegible: un triángulo con cuatro marcas
 *     sueltas alrededor que no se leían como chispas ni como nada.
 *   · La copa estaba bien pero le faltaba peso: un triángulo hueco.
 *
 * Ahora las ruedas APOYAN (su borde superior toca el piso de la caja, 16 con
 * 16), el camión tiene ventanilla —que es lo que lo vuelve un food truck y
 * no una camioneta de reparto— y el confeti se reemplazó por globos.
 *
 * ⚠️ POR QUÉ GLOBOS Y NO UN CONFETI MEJOR DIBUJADO. Un popper es una forma
 * ambigua: cono más chispas se lee como cono más chispas, y hay que
 * interpretarlo. Dos globos con su nudo y su piolín se leen como fiesta sin
 * pensar, y no compiten con la copa de la tarjeta de al lado — que era el
 * otro riesgo, porque «brindis» habría puesto dos vidrios en tres tarjetas.
 * ══════════════════════════════════════════════════════════════════════════
 */

export function Truck(props: IconProps) {
  return (
    <Svg strokeWidth="1.4" {...props}>
      {/* La caja. Termina en 16, que es donde apoyan las ruedas. */}
      <path d="M3 8h11v8H3z" />
      {/* La ventanilla: es lo que lo vuelve un food truck. */}
      <path d="M5.6 10.4h5.8v3.2H5.6z" />
      {/* La trompa. */}
      <path d="M14 11h3.6L21 14.4V16h-7z" />
      <circle cx="7.2" cy="18" r="2" />
      <circle cx="17.4" cy="18" r="2" />
    </Svg>
  );
}

export function Martini(props: IconProps) {
  return (
    <Svg strokeWidth="1.4" {...props}>
      <path d="M3.5 5h17L12 13.5 3.5 5Z" />
      <path d="M12 13.5V20M8 20h8" />
      {/* La aceituna. Va RELLENA y es lo único macizo del dibujo: a 104px un
          triángulo hueco con un palito no tiene dónde apoyar la vista. */}
      <circle cx="15.2" cy="7.6" r="1.15" fill="currentColor" stroke="none" />
    </Svg>
  );
}

/**
 * Globos. El icono de «el lugar entero, cerrado para vos».
 *
 * ⚠️ Reemplaza a `Confetti`, que se llamaba así porque el prototipo pedía
 * `ph-confetti`. El nombre sigue al DIBUJO y no al prototipo: un componente
 * que se llama `Confetti` y dibuja globos es una trampa para el próximo que
 * lo busque.
 */
export function Balloons(props: IconProps) {
  return (
    <Svg strokeWidth="1.4" {...props}>
      <circle cx="8.8" cy="8.4" r="4.8" />
      {/* El nudo, un triángulo chico. Es el detalle que lo separa de «dos
          círculos con una línea». */}
      <path d="M8.8 13.2 7.7 15.1h2.2z" />
      <path d="M8.8 15.1c0 2.3 2.7 2.6 2.7 5.1" />
      <circle cx="17.2" cy="11" r="3.6" />
      <path d="M17.2 14.6 16.3 16.2h1.8z" />
      <path d="M17.2 16.2c0 1.7-1.9 2-1.9 4" />
    </Svg>
  );
}
