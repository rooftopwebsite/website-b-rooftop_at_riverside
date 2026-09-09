import Image from 'next/image';

/**
 * Cortina de marca: el logo sobre el verde, y el fondo BARRIDO de izquierda a
 * derecha para dar lugar a la página.
 *
 * ⚠️ Es un SERVER COMPONENT y la animación es 100% CSS. No es un detalle de
 * implementación, es la corrección de un cuelgue real.
 *
 * La versión anterior tenía barra de progreso y porcentaje viviendo en estado
 * de React, con un `setInterval` que los movía: o sea que la cortina la
 * pintaba el servidor y **sólo el JS podía levantarla**. Medido en arranque en
 * frío, el HTML se servía a los 8.1s y la cortina se quedaba clavada en «0%»
 * 4.2s más, hasta que hidrataba. Camila lo reportó como que el sitio no
 * cargaba, y tenía razón: doce segundos de pantalla crema.
 *
 * Una animación de CSS corre sin JavaScript. Con esto la cortina se levanta
 * siempre, incluso si el JS no llega nunca — y el contenido de abajo ya está
 * completo, porque lo renderiza el servidor.
 *
 * ⚠️ Tampoco hay porcentaje. Camila: «saquemos el loading si trae problemas,
 * sólo pongamos el logo sobre fondo de color». Y de paso el porcentaje era una
 * mentira: no medía ninguna carga real, era un contador asintótico.
 *
 * ⚠️ Con `prefers-reduced-motion` no hay cortina EN ABSOLUTO —ver globals.css—
 * y no una más lenta. Es una pantalla que tapa el contenido: la versión
 * accesible es no mostrarla.
 *
 * ⚠️ No usa storage del navegador, que el brief prohíbe. Tampoco lo necesita:
 * al vivir en el layout, el elemento no se vuelve a montar en las navegaciones
 * del App Router, así que la animación corre una sola vez por carga completa.
 */
export default function Preloader() {
  return (
    // `aria-hidden` + `pointer-events-none`: es una cortina decorativa. El
    // contenido real ya está en el DOM debajo y el lector de pantalla lo lee
    // directo, sin enterarse de esto.
    <div
      aria-hidden="true"
      className="rt-preloader pointer-events-none fixed inset-0 z-[120] overflow-hidden bg-deep"
    >
      <div className="grid h-full place-items-center">
        <Image
          src="/brand/logo-reversed.svg"
          alt=""
          width={303}
          height={322}
          priority
          className="rt-preloader-logo w-[150px] lg:w-[190px]"
        />
      </div>

      {/*
        El filo del barrido: una banda de luz que viaja con el corte del
        `clip-path`. Es lo que hace que se lea como un BARRIDO y no como una
        desaparición: sin ella el verde simplemente se recorta.

        Va en `mix-blend-mode: screen` para que aclare el verde en vez de
        ensuciarlo con un gris, y nace y muere en transparente para que se lea
        como luz y no como un rectángulo con bordes.
      */}
      <div className="rt-preloader-edge absolute inset-y-0 left-0 w-[220px] mix-blend-screen" />
    </div>
  );
}
