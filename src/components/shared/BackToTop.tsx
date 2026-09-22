'use client';

import { useReducedMotion } from 'motion/react';
import { useSyncExternalStore } from 'react';
import { Rodillo } from './Button';
import { ArrowUp } from './Icon';

/**
 * ══════════════════════════════════════════════════════════════════════════
 * EL BOTÓN «BACK TO TOP».
 *
 * Un círculo de 44px anclado abajo a la derecha que aparece recién cuando se
 * bajó una pantalla entera. La posición, el tamaño y el comportamiento salen
 * de Showdown Social —una de las cuatro referencias que fijó Camila—: 44px, a
 * 37 del borde derecho y 72 del inferior, IGUAL en desktop y en mobile.
 *
 * ⚠️ DE LA REFERENCIA SE COPIA LA MECÁNICA, NO EL ESTILO. Lo que se ve es el
 * lenguaje de esta casa y nada más: el relleno `sunset` con la flecha en
 * NEGRO —blanco sobre naranja da 2.54:1 y no pasa AA; es el error que más
 * veces estuvo por colarse, ver `Button.tsx`—, la píldora, `shadow-card` y el
 * mismo `Rodillo` del hover que tienen los otros sesenta CTA.
 *
 * ⚠️ LA SOMBRA ES `shadow-card` Y NO `shadow-float`, que era la candidata
 * obvia por nombre. Dos motivos, y el segundo lo dio el guard:
 *
 *   · `shadow-float` cae 30px y desenfoca 70. Debajo de una tarjeta de 400px
 *     eso es una sombra; debajo de un disco de 44 es una mancha más grande que
 *     la pieza, y el botón deja de verse apoyado para verse despegado.
 *   · `npm run check:sombras` mide el alcance como `blur + spread`, o sea 52px
 *     para `shadow-float`: más que los 37 que hay hasta el borde de la
 *     pantalla, así que la reportaba como recortada. `shadow-card` alcanza 32 y
 *     entra. Es un elemento fijo contra el borde del viewport: acá el arreglo
 *     de siempre —padding en el contenedor que recorta— no existe.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LO DIFÍCIL DE ESTA PIEZA NO ES EL BOTÓN: ES QUE NO SE CHOQUE CON NADA.
 *
 * Un elemento fijo abajo a la derecha compite con todo lo demás que se fija
 * abajo. Son tres convivencias distintas y cada una se resuelve distinto:
 *
 *   1. LO QUE SE PEGA AL PIE. Hoy no hay nada; mañana está el banner de
 *      cookies, que este sitio todavía no tiene —ver la nota de `LEGALES` en
 *      `Footer.tsx`— y que la skill `paginas-legales` monta `fixed bottom-0`.
 *      Se resuelve con `--aviso-pie`, la variable declarada en `globals.css`:
 *      el botón la SUMA a su piso de 72px.
 *
 *      ⚠️ Y LA PUBLICA EL AVISO, NO LA MIDE EL BOTÓN. Es la única forma que
 *      funciona: un banner de consentimiento se monta DESPUÉS —lee su cookie,
 *      decide si corresponde, recién ahí aparece—, así que un botón que midiera
 *      el alto del aviso al montarse mediría cero y nadie le avisaría del
 *      cambio. Al revés anda solo: el aviso escribe su alto en el root y el
 *      botón lo lee en cada pintada.
 *
 *   2. EL FOOTER. Al llegar al fondo el botón no puede quedar encima de la fila
 *      de políticas ni de la barra de la agencia. Se resuelve midiendo cuánto
 *      de esa zona —marcada con `data-pie-cierre`— entró en pantalla y
 *      apoyándose 20px por encima.
 *
 *      ⚠️ NO SE LE AGREGA AIRE AL FOOTER PARA HACERLE LUGAR, que es la salida
 *      fácil y la equivocada: ese hueco lo pagarían las 23 rutas del sitio todo
 *      el tiempo por algo que sólo pasa en los últimos 200px de scroll. El
 *      botón sigue siendo `fixed` y frena solo.
 *
 *   3. LO QUE SE ABRE ENCIMA. El drawer de mobile es `z-[110]`, el
 *      `PageTransition` `z-[105]` y el `Preloader` `z-[120]`; los diálogos
 *      —`EventDialog`, `MenuSheets`— son `<dialog>` nativos y viven en la top
 *      layer, arriba de cualquier z-index. El botón va en `z-[60]`: por encima
 *      de todo lo que scrollea —el techo del contenido es el `z-50` del
 *      header— y por debajo de todo lo que tapa la pantalla.
 *
 *      ⚠️ ES 60 Y NO 90, aunque entre 50 y 105 cualquier número «funcione»
 *      hoy. El que decide es el banner de cookies del template de la casa, que
 *      en santa-maria va en `z-[70]`: con el botón en 90 se pintaría ENCIMA del
 *      aviso, y con 60 se le mete detrás. Geométricamente no se tocan nunca
 *      —para eso está `--aviso-pie`—, pero si algún día alguien monta el banner
 *      y se olvida de publicar su alto, el botón tapándole el texto a un aviso
 *      legal es mucho peor que el botón escondido detrás.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ EL SCROLL SE LEE CON `useSyncExternalStore` Y NO CON UN `useEffect` QUE
 * SETEA ESTADO AL MONTAR. La posición de scroll es estado del NAVEGADOR, no de
 * React: con el efecto, cada pintada arranca con el valor del servidor y lo
 * corrige en una segunda pasada —la cascada de renders que marca el linter de
 * React—, y encima deja una ventana en la que el botón ya está montado con el
 * dato viejo. Acá el snapshot se lee de `window` en la misma pintada.
 *
 * ⚠️ LOS DOS SNAPSHOTS DEVUELVEN PRIMITIVOS —un booleano y un entero— y no un
 * objeto. `getSnapshot` se llama en cada render y en cada evento, y un objeto
 * nuevo cada vez es distinto por identidad: React vuelve a renderizar para
 * siempre y avisa «The result of getSnapshot should be cached». El redondeo a
 * entero de `alzaDelPie` no es cosmético por el mismo motivo: sin él, medio
 * píxel de diferencia es un render.
 */

/** A cuánto del borde derecho. Igual en las dos medidas, como la referencia. */
const DERECHA = 37;

/** El piso: a cuánto del borde inferior cuando no hay nada más abajo. */
const PISO = 72;

/** El aire que queda entre el botón y la zona de cierre del footer. */
const AIRE = 20;

/**
 * Los dos datos que cambian se escuchan en los mismos dos eventos, así que
 * comparten suscripción: `scroll` para el recorrido, y `resize` porque el
 * umbral ES un viewport y porque el footer se reacomoda al cambiar el ancho.
 *
 * ⚠️ `scroll` va `passive`. Sin eso el navegador tiene que esperar a ver si el
 * handler llama a `preventDefault` antes de pintar el scroll, que es
 * exactamente el jank que Lenis viene a evitar.
 */
function suscribir(alCambiar: () => void) {
  window.addEventListener('scroll', alCambiar, { passive: true });
  window.addEventListener('resize', alCambiar);
  return () => {
    window.removeEventListener('scroll', alCambiar);
    window.removeEventListener('resize', alCambiar);
  };
}

/** El umbral: una pantalla entera, ni más ni menos. */
function pasoUnaPantalla() {
  return window.scrollY > window.innerHeight;
}

/**
 * Cuánto tiene que levantarse el botón para no pisar el cierre del footer.
 *
 * Devuelve 0 mientras esa zona no entró en pantalla —o sea durante casi todo el
 * recorrido— y recién cuando asoma devuelve lo que asomó más los 20px de aire.
 * El `max()` del `bottom` se encarga de que eso mande sólo cuando supera al
 * piso; hasta entonces el botón se queda donde estaba.
 */
function alzaDelPie() {
  const zona = document.querySelector('[data-pie-cierre]');
  if (!zona) return 0;
  const asomo = window.innerHeight - zona.getBoundingClientRect().top;
  return asomo > 0 ? Math.round(asomo) + AIRE : 0;
}

export default function BackToTop() {
  const reducido = useReducedMotion();

  /* En el servidor no hay scroll: el botón se sirve oculto y en su piso. Es lo
     correcto además de lo único posible — el HTML siempre se entrega arriba de
     todo. */
  const visible = useSyncExternalStore(suscribir, pasoUnaPantalla, () => false);
  const alza = useSyncExternalStore(suscribir, alzaDelPie, () => 0);

  return (
    <div
      /*
        ⚠️ EL ENVOLTORIO EXISTE PARA QUE HAYA DOS TIEMPOS. La entrada y la
        salida son de 450ms —el gesto de la referencia, que aparece y
        desaparece en vez de parpadear— y el hover del color es de 200ms, que es
        el de todos los botones del sitio. Con una sola caja habría que usar un
        solo número para las dos cosas, y a 450 el hover se arrastra.
      */
      aria-hidden={!visible}
      /*
        ⚠️ QUEDA MONTADO SIEMPRE, y por eso hay que apagarlo de verdad. Si se
        desmontara al ocultarse no habría nada que animar en la salida: se iría
        de golpe, que es justo lo que la referencia no hace.

        Montado y transparente, en cambio, sigue siendo un botón: se llevaría
        los clicks de lo que hay debajo y el tabulador pasaría por él. `inert`
        —el mismo mecanismo que usa el drawer del header— lo saca del árbol de
        accesibilidad, del foco y de los eventos de puntero de una sola vez.
      */
      inert={!visible}
      style={{
        /*
          ⚠️ ES UN `max()` DE CSS Y NO UNA CUENTA EN JS, y no es preferencia de
          estilo: uno de los dos candidatos depende de una variable que este
          componente no conoce y que no puede leer sin provocar un render. Los
          dos se comparan en el navegador, en cada pintada, gratis.

            · el piso    72px + lo que mida el aviso que esté fijo al pie
            · el freno   lo que asomó del cierre del footer + 20px de aire

          Gana el más alto, que es siempre el que evita el choque. Y cubre el
          caso en que los dos pasan a la vez —banner de cookies abierto y el
          visitante en el fondo de la página—, que es donde una suma de los dos
          dejaría el botón flotando en el medio de la pantalla.
        */
        bottom: `max(calc(${PISO}px + var(--aviso-pie, 0px)), ${alza}px)`,
        right: `${DERECHA}px`,
      }}
      className={[
        'fixed z-[60]',
        'transition-[opacity,transform] duration-[450ms] ease-brand',
        visible
          ? 'translate-y-0 opacity-100'
          : /* ⚠️ El desplazamiento se apaga con `prefers-reduced-motion` y el
               fundido NO. Lo que molesta a quien pide menos animación es que
               las cosas se muevan; una opacidad no se mueve, y sacarla también
               dejaría el botón apareciendo de golpe, que es peor. */
            `pointer-events-none opacity-0 ${reducido ? '' : 'translate-y-2'}`,
      ].join(' ')}
    >
      <button
        type="button"
        aria-label="Back to top"
        tabIndex={visible ? undefined : -1}
        onClick={() => {
          /*
            ⚠️ CON `prefers-reduced-motion` EL SALTO ES INSTANTÁNEO. Un
            recorrido animado de varias pantallas es exactamente el movimiento
            que esa preferencia viene a apagar, y acá es de los largos: desde el
            footer de `/events` son 8.000px de fotos pasando a toda velocidad.

            ⚠️ EL `behavior` VA EXPLÍCITO aunque `globals.css` ya ponga
            `scroll-behavior: smooth` en el `html` y lo apague bajo la misma
            preferencia. La opción del `scrollTo` PISA a la del CSS, así que
            escrito acá el comportamiento no depende de que esa regla siga
            existiendo ni de que Lenis no la toque.
          */
          window.scrollTo({ top: 0, behavior: reducido ? 'auto' : 'smooth' });
        }}
        /*
          La estética es la del `primary` de `Button.tsx`, clase por clase:
          mismo relleno, mismo hover, misma píldora, misma duración. Lo único
          que no sale de ahí es la caja —44px cuadrados en vez de la escala de
          `SIZES`— y la sombra, que acá tiene que existir porque el botón pasa
          por encima de fotos y de bandas oscuras. Ver la nota del encabezado.
        */
        className="rueda flex size-11 items-center justify-center rounded-pill bg-sunset text-ink shadow-card transition-colors duration-200 hover:bg-sunset-hover"
      >
        {/* La flecha rueda hacia arriba en el hover, que es hacia donde lleva el
            botón. El `Rodillo` ya se apaga solo con reduced-motion. */}
        <Rodillo>
          <ArrowUp className="size-5" />
        </Rodillo>
      </button>
    </div>
  );
}
