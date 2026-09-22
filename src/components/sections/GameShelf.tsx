'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion, useScroll, useMotionValueEvent } from 'motion/react';
import { GAMES } from '@/content/game-truck';

/**
 * EL ESTANTE: los juegos como una fila de cajas que el scroll hace pasar.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ PEDIDO DE CAMILA, 2026-09-22, con un spec de layout adjunto: «esto
 * podríamos ponerlo diferente, como un carrusel de cartas, pero cartas
 * temáticas, que parezcan algo de videojuego (…) y que el carrusel con el
 * scroll vaya pasando».
 *
 * DEL SPEC SE TOMA EL MECANISMO Y NADA MÁS, que es la regla del repo para las
 * referencias (`docs/design-references.md`). Lo que se toma son cuatro cosas:
 *
 *   · sección alta con el contenido `sticky`, de modo que el scroll VERTICAL
 *     desplaza un track horizontal;
 *   · la rotación de cada tarjeta sale de la distancia de su centro al centro
 *     del viewport: entran inclinadas, pasan derechas por el medio y salen
 *     inclinadas para el otro lado;
 *   · el tope de inclinación es ±4°;
 *   · una barra de progreso al pie.
 *
 * LO QUE NO SE TOMA es su sistema visual entero, que es de otra marca: ni
 * Geist, ni el naranja #E55100, ni la rejilla de 4px, ni los iconos Phosphor,
 * ni «badge en píldora con icono de estrella». Acá van Big Shoulders, los
 * tokens de la casa y la forma que sigue.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ CÓMO SE REPRESENTA UN VIDEOJUEGO EN UNA TARJETA SIN INVENTAR NADA. Es la
 * pregunta que hizo Camila y la parte que hubo que resolver, porque de los 23
 * títulos tenemos EXACTAMENTE eso: el nombre. No hay carátulas —serían arte
 * con derechos de terceros y además no las tenemos—, no sabemos en qué consola
 * corre cada uno, y el género por título sería un dato que agregamos nosotros.
 *
 * Así que la tarjeta no finge tener metadatos: es una CAJA DE JUEGO, y lo que
 * la hace leer como tal es la forma.
 *
 *   · `chaflan`, la esquina cortada del brand book. Su propia nota en
 *     `globals.css` dice que si se usa en todo «el sitio se vuelve una
 *     interfaz de videojuego», y por eso estaba reservada. Ésta es la única
 *     sección del sitio donde ese registro es el correcto, y hasta hoy la
 *     utilidad no tenía un solo call site.
 *   · la LOMERA de color en el canto izquierdo, que es lo que distingue una
 *     caja de otra en un estante de verdad. Rota entre cuatro tokens, así que
 *     la fila se lee de colores sin que el color signifique nada: es
 *     decoración declarada, no un dato disfrazado.
 *   · el índice arriba, en cifras tabulares.
 *   · el título abajo, en display y al cuerpo más grande que entre.
 *
 * ⚠️ `chaflan` NO VA EN NADA ENFOCABLE, y estas tarjetas no lo son: los juegos
 * no linkean a ningún lado. La advertencia está en `globals.css` —`clip-path`
 * recorta el anillo de foco— y si algún día la tarjeta se vuelve un link, el
 * anillo tiene que pasar a `box-shadow: inset`.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ESTO REEMPLAZA A UNA LISTA, Y ESA LISTA HABÍA REEMPLAZADO A UNA
 * MARQUESINA. Conviene dejar la cadena escrita porque el argumento de aquella
 * vez sigue siendo cierto y hay que explicar por qué esto no lo incumple.
 *
 * La marquesina se sacó porque «un padre que está eligiendo dónde hacer el
 * cumpleaños» necesita BUSCAR un título, y una tira en movimiento continuo es
 * lo contrario de eso.
 *
 * Este carrusel no se mueve solo: **lo mueve el dedo de quien scrollea**. Se
 * frena donde uno lo frena y se vuelve atrás. Ésa es la diferencia con una
 * marquesina y es lo que lo hace legible. Y para el caso de «quiero leerlos
 * todos de un vistazo» está el camino sin movimiento de abajo.
 *
 * ⚠️ HAY DOS MODOS Y LOS DOS MUESTRAN LOS 23 TÍTULOS:
 *
 *   desktop (≥1024) y con movimiento     sticky + track movido por el scroll
 *   mobile, o `prefers-reduced-motion`   fila normal con scroll horizontal
 *                                        y `scroll-snap`, sin sticky y sin
 *                                        transform
 *
 * El segundo no es un degradado pobre: es el camino que pide el brief («todo
 * tiene camino sin movimiento») y además es lo que la sección necesita en un
 * teléfono, donde un sticky que secuestra tres pantallas de scroll para una
 * lista es exactamente lo que nadie quiere.
 *
 * ⚠️ EL ALTO DE LA SECCIÓN ES FIJO Y NO SALE DEL LARGO DEL TRACK, que es como
 * lo calcula el spec (`100vh + maxShift * 1.1`). Con 23 tarjetas eso daría una
 * sección de casi ocho mil píxeles: ocho pantallas de scroll para la lista de
 * juegos de una página secundaria. Con el alto fijo en `280vh` el track entero
 * pasa en menos de tres pantallas y las tarjetas viajan algo más rápido que el
 * dedo, que para una vitrina es lo correcto.
 * ══════════════════════════════════════════════════════════════════════════
 */

/** El ancho de la tarjeta y el hueco, en píxeles. Espejan las clases de abajo. */
const CARD = { w: 280, gap: 24 };

/**
 * Las cuatro lomeras.
 *
 * ⚠️ SON RELLENO Y NUNCA TEXTO, y por eso `river` puede estar acá: el token
 * tiene anotado «NUNCA como texto» —da 2.50:1 sobre claro— y como franja de
 * color no le debe contraste a nadie. Lo mismo vale para `sunset`.
 *
 * ⚠️ Y NO SIGNIFICAN NADA. No son géneros ni consolas: si el color clasificara
 * algo, habría que tener ese dato, y de estos 23 títulos sólo tenemos el
 * nombre. Rotan por índice, que es lo que hace que la fila se lea como un
 * estante y no como una tabla.
 *
 * ⚠️ LOS CUATRO CAMBIARON AL PASAR LA TARJETA A CLARO. Camila, 2026-09-22:
 * «me gustaría que sean cards claras con la línea de color que resalte». Sobre
 * la caja oscura funcionaban `mint` y `cream`, que son los dos tonos claros de
 * la paleta; sobre una tarjeta de hueso desaparecen. Los cuatro de ahora son
 * los que SÍ resaltan sobre claro, y los cuatro son tokens de la casa.
 */
const LOMERAS = ['bg-sunset', 'bg-river', 'bg-deep', 'bg-magenta'] as const;

export default function GameShelf({
  children,
  pie,
  ola,
}: {
  readonly children?: ReactNode;
  /**
   * La aclaración que va debajo del carrusel.
   *
   * ⚠️ VIENE ACÁ ADENTRO Y NO DESPUÉS DEL COMPONENTE. Camila, 2026-09-22: «poné
   * esta aclaración centrada debajo, cerca del carrusel». Escrita afuera caía
   * después de la caja alta entera, o sea casi tres pantallas más abajo que las
   * tarjetas que explica: se leía como un párrafo huérfano al final de la
   * sección. Adentro del `sticky` viaja pegada a la fila.
   */
  readonly pie?: ReactNode;
  /**
   * La ola que separa esta sección de la siguiente.
   *
   * ⚠️ VIENE ACÁ ADENTRO PARA QUE ASOME MIENTRAS LA SECCIÓN ESTÁ PEGADA.
   * Camila, 2026-09-22: «quiero que acá, cuando queda sticky la sección, ya se
   * asome la ola de la sección siguiente».
   *
   * Escrita DESPUÉS de la sección —que es donde vive cualquier otra ola del
   * sitio— sólo aparecía en el último tramo del scroll: durante las casi tres
   * pantallas que dura el pegado, debajo de la caja no había más que el fondo
   * de la propia sección. Anclada al pie de la caja pegajosa, viaja con ella y
   * se ve todo el tiempo.
   *
   * ⚠️ Y POR ESO LA SECCIÓN VA CON `bandBottom="none"`: si tuviera su acolchado
   * de abajo, entre la ola y la banda siguiente quedarían 128px de aire y el
   * corte volvería a ser recto.
   */
  readonly ola?: ReactNode;
}) {
  const reducido = useReducedMotion();
  const alto = useRef<HTMLDivElement | null>(null);
  const track = useRef<HTMLUListElement | null>(null);
  /**
   * La caja pegajosa. Se mide para saber a qué altura de la PÁGINA arranca la
   * fila, que es lo que necesita la cuenta de la rotación.
   *
   * ⚠️ SE MIDE ÉSTA Y NO LA FILA porque la fila lleva el `transform`, y un
   * elemento transformado devuelve su posición YA DESPLAZADA: la cuenta que la
   * usara se mordería la cola. Esta caja nunca se transforma.
   */
  const caja = useRef<HTMLDivElement | null>(null);

  /**
   * ⚠️ `ancho` ES EL DEL VIEWPORT Y ARRANCA EN 0, no en un número supuesto.
   * Con un valor inventado, el primer render del servidor y el del cliente
   * calcularían desplazamientos distintos y React marcaría el desajuste. En 0
   * el `maxShift` da 0, o sea que el track arranca quieto y se acomoda en el
   * primer efecto.
   */
  const [ancho, setAncho] = useState(0);
  /** Dónde arranca la caja pegajosa dentro de la página. Ver el ref. */
  const [izq, setIzq] = useState(0);
  const [scrollable, setScrollable] = useState(false);
  const [p, setP] = useState(0);

  useEffect(() => {
    const medir = () => {
      setAncho(window.innerWidth);
      setIzq(caja.current ? caja.current.getBoundingClientRect().left : 0);
      /*
       * ⚠️ EL MODO LO DECIDE UNA MEDIA QUERY Y NO UN ANCHO SUELTO. `64rem` es
       * el `lg` de Tailwind y tiene que ser la MISMA condición que las clases
       * `lg:` de abajo, o el JS y el CSS discrepan en el pixel del corte. Es el
       * mismo patrón que usan `WhatsOn` y `YardSteps` para contar cuántas
       * tarjetas entran por vista.
       */
      setScrollable(window.matchMedia('(min-width: 64rem)').matches);
    };
    medir();
    window.addEventListener('resize', medir);
    return () => window.removeEventListener('resize', medir);
  }, []);

  const { scrollYProgress } = useScroll({
    target: alto,
    offset: ['start start', 'end end'],
  });

  /*
   * ⚠️ EL ESTADO SE ACTUALIZA POR EVENTO DE MOTION Y NO CON UN LISTENER DE
   * `scroll` PROPIO. `useMotionValueEvent` ya viene enganchado al ciclo de
   * `motion`, así que corre una vez por frame y no una vez por evento de rueda.
   * Con Lenis interpolando la rueda, un listener crudo dispara muchas más veces
   * de las que hay frames.
   */
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!scrollable || reducido) return;
    setP(v);
  });

  const movido = scrollable && !reducido;

  /*
   * La cuenta del track, en el mismo orden que el spec: ancho total, cuánto
   * sobra respecto del viewport, y cuánto se corrió.
   *
   * ⚠️ EL `pad` TIENE QUE SER EL MISMO NÚMERO QUE EL `px-` DE LA FILA, o la
   * cuenta del desplazamiento miente y la última tarjeta queda cortada o sobra
   * fondo al final. La fila usa `px-gutter md:px-gutter-lg`, que son 16px hasta
   * 768 y 32 de ahí para arriba: el mismo escalón, escrito acá.
   *
   * ⚠️ ESTUVO CON LA FÓRMULA DE `--spacing-borde` —`clamp(16px, 4vw, 56px)`— y
   * era el token equivocado. A 1440 daba 56 contra los 32 reales: 48px de
   * diferencia repartidos en los dos extremos del track.
   */
  const pad = ancho >= 768 ? 32 : 16;
  /*
   * ⚠️ EL RECORRIDO SE MIDE CONTRA LA PANTALLA Y NO CONTRA LA CAJA. El track
   * arranca en `izq + pad` y tiene que terminar con su última tarjeta entrando
   * por el borde derecho del VIEWPORT, no por el de la sección: desde que el
   * recorte lo hace el `body`, la fila se ve hasta el borde de la pantalla y
   * pararla antes dejaría las últimas tarjetas fuera de alcance.
   */
  const anchoTrack = GAMES.length * CARD.w + (GAMES.length - 1) * CARD.gap + pad * 2;
  const maxShift = movido ? Math.max(0, izq + anchoTrack - ancho) : 0;
  const shift = -maxShift * p;

  return (
    <div
      ref={alto}
      /*
        ⚠️ EL ALTO EXTRA SÓLO EXISTE DESDE `lg`. Abajo de eso la sección mide lo
        que mide su contenido y la fila se scrollea con el dedo. Si el alto
        estuviera siempre, en un teléfono habría dos pantallas y media de nada
        debajo de una fila que ya se puede recorrer sola.
      */
      className="relative lg:h-[280vh]"
    >
      {/*
        ══════════════════════════════════════════════════════════════════
        ⚠️ ESTA CAJA ES LA QUE RECORTA, Y AHORA RECORTA EN EL BORDE DE LA
        PANTALLA. Camila, 2026-09-22: «quiero que llegue al borde de la
        pantalla, no que se corte el frame».

        El `overflow-hidden` se queda —sin él, el track de 7.000px desborda el
        documento— pero lo que cambió es CONTRA QUÉ recorta. Antes esta caja
        vivía dentro de `caja`, que topa en 1280, así que en un monitor de 1440
        la fila se cortaba 80px antes del borde. Ahora la sección se declara
        `width="full"` y estos dos márgenes negativos cancelan su gutter: la
        caja mide exactamente el viewport y su recorte cae en el filo.

        ⚠️ SE PROBARON DOS CAMINOS ANTES Y LOS DOS SE DESCARTARON MIDIENDO:

          · `mx-[calc(50%-50vw)] w-screen` → `100vw` incluye la barra de
            scroll, así que dejaba 8px entre `scrollWidth` y `clientWidth` del
            documento. No era arrastrable, pero la medida quedaba sucia.
          · sacar el `overflow-hidden` y confiar en el `overflow-x: clip` del
            `body` → no alcanza: el documento se iba a 1.957px de desborde. El
            `clip` del body frena el ARRASTRE, no el crecimiento de la caja.

        Con `width="full"` y los márgenes negativos no hay `vw` que redondear
        ni desborde que tapar: el número es exacto en todas las anchuras.

        ⚠️ `clip` Y NO `hidden` EN EL BODY, Y ACÁ SE NOTA POR QUÉ: `hidden`
        crea un contenedor de scroll y un contenedor de scroll MATA el
        `position: sticky` de sus descendientes, que es exactamente lo que esta
        sección necesita. La nota larga está en `globals.css`.
        ══════════════════════════════════════════════════════════════════
      */}
      {/*
        ⚠️ NO OCUPA LA PANTALLA ENTERA, Y ESO ES DELIBERADO. Camila,
        2026-09-22: «la sección quiero que no ocupe el 100 % de la pantalla en
        desk, que asome un poco de la sección de abajo».

        `86svh` deja unos 120px de la banda siguiente asomando en un monitor de
        900, que es lo que le dice a alguien que la página sigue. Con la caja a
        pantalla completa el estante se comportaba como una portada: tres
        pantallas de scroll sin una sola pista de que abajo hay precios.

        ⚠️ `svh` Y NO `vh`, que es la unidad que el sitio ya usa en `PlateHero`:
        en un teléfono `vh` mide la pantalla SIN la barra del navegador, así que
        el bloque queda más alto de lo que se ve y el asomo desaparece justo
        donde más falta hace. Acá sólo aplica desde `lg`, pero la unidad se
        mantiene por coherencia.

        ⚠️ EL CONTENIDO ENTRA HOLGADO: encabezado (~300) + fila (180) + barra
        (40) + aclaración (~60) más los huecos dan unos 640 contra los 774 que
        deja `86svh` en 900. Si alguna de las cuatro piezas crece, esto hay que
        volver a medirlo.
      */}
      <div
        ref={caja}
        /*
          ⚠️ EL `pt-24` ES EL HUECO DEL HEADER. La caja se pega en `top-0` y el
          header del sitio mide 78px y es `sticky`, así que sin acolchado el
          contenido se centra en la pantalla ENTERA y el isotipo del camión
          queda por debajo de la barra. Con 96px arriba, el `justify-center`
          centra en lo que de verdad se ve.

          Es el mismo número que `EventTypes` usa para apilar sus losas: 78 de
          header más un respiro. Si el header cambia de alto, esto se mueve con
          él.
        */
        /*
          ⚠️ EL ACOLCHADO DE ABAJO ES EL ALTO EXACTO DE LA OLA, y los tres
          escalones espejan los suyos: `h-[104px] sm:h-[136px] lg:h-[168px]`.
          La ola va `absolute` al pie de esta caja, así que sin reservarle el
          lugar se monta encima de las tarjetas y se come la aclaración. Se vio
          en la página: la primera versión tapaba el renglón entero.

          Si algún día `SoftWave` cambia de alto, estos tres números se mueven
          con él.

          ⚠️ Y POR ESO LA CAJA VUELVE A `100svh`. Estuvo en `86svh` para que
          asomara la banda siguiente; con la ola adentro eso ya no hace falta,
          porque lo que asoma durante todo el pegado ES la ola. Con 86 y la ola
          reservada quedaban 510px para un contenido que mide unos 556, o sea
          que no entraba.

          La cuenta con 100svh en una pantalla de 900: 900 − 96 de header − 168
          de ola = 636 para unos 556 de contenido. Si alguna de las cuatro
          piezas crece, hay que volver a medir.
        */
        className="relative -mx-gutter overflow-hidden pb-[104px] sm:pb-[136px] md:-mx-gutter-lg lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col lg:justify-center lg:pt-24 lg:pb-[168px]"
      >
        {/*
          ⚠️ EL ENCABEZADO VIAJA ADENTRO DEL `sticky` Y LO PASA LA PÁGINA COMO
          `children`. Al principio quedaba afuera, y el efecto era el que el
          spec justamente evita: mientras la sección está pineada —casi tres
          pantallas— se veía una fila de tarjetas flotando en blanco, sin un
          rótulo que dijera qué son.

          En la referencia el titular está pineado con el track, y por eso el
          bloque se lee como una vitrina y no como un carrusel suelto.

          ⚠️ LO PASA LA PÁGINA Y NO SE ESCRIBE ACÁ porque el encabezado incluye
          el isotipo del camión, que es un `next/image` de servidor, y porque el
          `id` del `<h2>` es el destino del `aria-labelledby` de la sección. Un
          componente de cliente puede recibir hijos de servidor sin arrastrarlos
          al bundle.
        */}
        {/*
          ⚠️ EL ENCABEZADO VUELVE A LA CAJA. La sección se declaró `width="full"`
          para que la fila llegue al borde, así que sin esto el isotipo y el
          titular medirían el ancho entero de la pantalla y esta sección sería
          la única del sitio con otra medida de texto. `caja` + el gutter es
          exactamente el par que `Section` aplica por defecto.
        */}
        {children ? (
          <div className="caja mb-bloque px-gutter md:px-gutter-lg">{children}</div>
        ) : null}

        {/*
          ⚠️ LA FILA SANGRA HASTA EL BORDE Y POR ESO SALE DE LA CAJA. El
          `-mx-borde` la saca del gutter de la sección y el `px-borde` se lo
          devuelve por dentro, así que la primera tarjeta queda alineada con el
          título y la última se va de cuadro. Es el mismo par que usan las
          filas con snap de `WhatsOn` y `YardSteps`, y el `scroll-px-borde` es
          lo que hace que el snap frene en esa misma línea y no en el borde.

          ⚠️ EN DESKTOP EL CONTENEDOR NO SCROLLEA: lo mueve el `transform`. El
          `lg:overflow-visible` apaga el scroll horizontal ahí, porque con los
          dos activos el track se puede arrastrar Y correr, y las dos cosas se
          pelean.
        */}
        {/*
          ══════════════════════════════════════════════════════════════════
          ⚠️ EL `role="region"` VA EN EL DIV Y NO EN EL `<ul>`, y esto lo
          encontró axe el 2026-09-22 con DOS violaciones a la vez:

            · `listitem` (serious): un `role` explícito PISA la semántica
              nativa del elemento, así que la lista dejaba de ser una lista y
              sus 23 `<li>` quedaban huérfanos.
            · `aria-allowed-role` (minor): `region` no es un rol admitido
              sobre un `<ul>`.

          Separadas en dos elementos, el div es la región scrollable con
          nombre y la lista sigue siendo una lista. Es la misma construcción
          que ya tenía `DragCarousel`, que envuelve su fila en un div propio.

          ⚠️ Y LOS DOS FALLOS SÓLO APARECÍAN EN MOBILE, porque el rol se pone
          únicamente cuando la fila se scrollea con el dedo. En desktop el
          track lo mueve el scroll de la página y no hay región que anunciar.
          Auditar una sola anchura los habría dejado pasar.
          ══════════════════════════════════════════════════════════════════
        */}
        <div
          role={movido ? undefined : 'region'}
          aria-label={movido ? undefined : 'The games on board, scroll sideways'}
          tabIndex={movido ? undefined : 0}
          /*
            ⚠️ EL SCROLL HORIZONTAL SE APAGA CUANDO EL TRACK SE MUEVE SOLO, y
            la condición es `movido` —o sea JS— y NO una clase `lg:`. Estuvo un
            rato como `lg:overflow-x-visible` fijo y eso abría un agujero:

              desktop + `prefers-reduced-motion` → el transform no corre
              (correcto) pero el `overflow` tampoco dejaba scrollear, así que
              las últimas dieciséis tarjetas quedaban FUERA DE ALCANCE.

            Con la condición en JS, el único caso sin scroll propio es aquel en
            el que el scroll de la página ya mueve el track. En todos los demás
            —mobile, y desktop con movimiento reducido— la fila se recorre con
            el dedo, con la rueda o con el teclado.
          */
          /*
            ══════════════════════════════════════════════════════════════
            ⚠️ LA FILA SALE DE LA CAJA Y LLEGA AL BORDE DE LA PANTALLA.
            Camila, 2026-09-22: «que el carrusel llegue hasta el borde de la
            pantalla».

            No alcanzaba con sacarla del gutter: `Section` mete su contenido en
            `caja`, que topa en 1280, así que en un monitor ancho la fila se
            cortaba ahí y quedaban dos franjas de fondo a los lados.

            `mx-[calc(50%-50vw)] w-screen` la saca de CUALQUIER ancestro con
            ancho: centra el elemento y lo estira al viewport, sin importar
            cuántas cajas haya en el medio. Y el `px-gutter` de adentro le
            devuelve el margen, así que la primera tarjeta sigue alineada con el
            titular.

            ⚠️ `100vw` INCLUYE LA BARRA DE SCROLL y por eso esto normalmente
            mete unos 15px de desborde en desktop. Acá no pasa porque el `body`
            del sitio lleva `overflow-x: clip` —puesto para que la página no se
            pueda arrastrar de costado— y `clip` recorta sin crear contenedor de
            scroll, así que además no rompe el `sticky` de esta misma sección.
            Verificado midiendo `scrollWidth` contra `clientWidth` en siete
            anchuras.

            ⚠️ EL PADDING VA CON EL TOKEN `gutter` Y NO CON `borde`. Son dos
            distintos y es fácil agarrar el que no es:
              `--spacing-borde`       clamp(16px, 4vw, 56px)   lo usa `caja-ancha`
              `--spacing-gutter(-lg)` 16px / 32px desde `md`   lo usa `Section`
            Con `borde` la fila arrancaba 9,6px corrida respecto del titular a
            640px de ancho, que es donde los dos valores más se separan.
            ══════════════════════════════════════════════════════════════
          */
          className={[
            'px-gutter scroll-px-gutter md:px-gutter-lg md:scroll-px-gutter-lg',
            'overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
            movido ? 'lg:snap-none lg:overflow-x-visible' : 'snap-x snap-mandatory',
            /* El aire para que la sombra de la tarjeta no quede recortada por
               el propio `overflow-x-auto`. Mismo recurso que `DragCarousel`. */
            'py-3 -my-3',
          ].join(' ')}
        >
        <ul
          ref={track}
          className="m-0 flex list-none gap-6 p-0"
          style={movido ? { transform: `translateX(${shift.toFixed(1)}px)`, willChange: 'transform' } : undefined}
        >
          {GAMES.map((g, i) => {
            /*
              LA ROTACIÓN, que es el gesto del spec: sale de dónde está el
              CENTRO de la tarjeta respecto del centro de la pantalla.

              ⚠️ SE CALCULA EN EL RENDER Y NO EN CSS, y es una decisión de
              costo consciente: son 23 `<li>` sin estado propio, así que el
              re-render por frame es barato. La alternativa —una variable CSS
              con `clamp()` en grados— evita el re-render pero mete la cuenta
              entera en una sola línea de `calc()` que nadie puede leer ni
              depurar seis meses después.

              ⚠️ TOPE EN ±4°, que es el número del spec. Más que eso las
              tarjetas se leen como un abanico de cartas y deja de parecer un
              estante.
            */
            const centro = izq + pad + i * (CARD.w + CARD.gap) + CARD.w / 2 + shift;
            const norm = ancho > 0 ? (centro - ancho / 2) / ancho : 0;
            const giro = movido ? Math.max(-4, Math.min(4, norm * 7)) : 0;

            return (
              <li
                key={g}
                className="w-[240px] shrink-0 snap-start lg:w-[280px]"
                style={{
                  transform: `rotate(${giro.toFixed(2)}deg)`,
                  transformOrigin: 'center center',
                }}
              >
                {/*
                  LA CAJA. `chaflan` corta la esquina superior derecha y la
                  inferior izquierda —la asimetría es lo que le da dirección, y
                  está explicada en `globals.css`—, y `sombra-card` no se usa
                  porque `clip-path` no recorta una `box-shadow`: quedarían dos
                  esquinas de sombra flotando donde la tarjeta ya no tiene
                  material. Es la misma trampa que documenta el `troquel`.
                */}
                {/*
                  ⚠️ LA CAJA PASÓ A CLARA Y SE ACHATÓ, los dos el 2026-09-22 y
                  los dos por pedido: «me gustaría que sean cards claras con la
                  línea de color que resalte» y «que cada card sea mucho más
                  baja».

                  El alto bajó de 300/360 a 150/180, o sea a la mitad. A la
                  altura anterior la tarjeta tenía el nombre abajo y un campo
                  de color vacío arriba: con 23 títulos eso era un muro. Baja,
                  la fila se lee como un estante de cajas paradas, que es lo que
                  se quiso desde el principio.

                  ⚠️ LA TARJETA ES `bone` Y LA SECCIÓN ES `paper`. Es la regla
                  de `FormSlab`: el panel nunca es del color de su sección, o no
                  se despega. Y el filo de 1px es lo que define la caja ahora
                  que el color ya no lo hace.

                  ⚠️ LA LOMERA ENGORDÓ DE 6 A 8px. Sobre verde oscuro una
                  franja de 6 se leía; sobre hueso, con la tarjeta clara, el
                  contraste de la franja contra su propia tarjeta es lo único
                  que la sostiene, así que necesita cuerpo.
                */}
                <article className="chaflan relative flex h-[150px] flex-col justify-between overflow-hidden bg-bone p-4 ring-1 ring-fog ring-inset lg:h-[180px] lg:p-5">
                  {/* La lomera. Ver `LOMERAS`: es relleno y no significa nada. */}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-y-0 left-0 w-2 ${LOMERAS[i % LOMERAS.length]}`}
                  />

                  <span className="relative pl-2 font-body text-micro font-bold tabular-nums tracking-cta text-muted">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/*
                    ⚠️ ES UN `<h3>` Y NO UN `<span>`. La sección tiene un `<h2>`
                    y cada juego es un ítem con nombre propio: un lector de
                    pantalla puede recorrer el estante saltando de título en
                    título, que es exactamente lo que la lista anterior dejaba
                    hacer y lo que un carrusel rompe si los nombres son texto
                    suelto.

                    ⚠️ TODOS AL MISMO CUERPO, Y LOS LARGOS PARTEN EN VARIOS
                    RENGLONES. Camila, 2026-09-22: «que todas tengan mismo
                    tamaño tipográfico, y si necesitan que tengan más de una
                    línea el nombre».

                    Antes el cuerpo bajaba en tres escalones según el largo del
                    string, para que los nombres largos entraran en un renglón.
                    El efecto era el que ella marcó: en una fila de 23 cajas,
                    tres tamaños distintos se leen como un error de maquetación
                    y no como jerarquía, porque el largo del título no significa
                    nada.

                    ⚠️ `d5` SON 28px Y ENTRAN HASTA TRES RENGLONES. La caja mide
                    180 de alto menos 40 de acolchado menos el índice: quedan
                    unos 110, y tres renglones a 28 con interlínea 0,95 son 80.
                    El más largo, «Call of Duty Modern Warfare III», cae en dos.
                  */}
                  <h3 className="relative m-0 pl-2 font-display text-d5 font-extrabold uppercase leading-[0.95] text-ink">
                    {g}
                  </h3>
                </article>
              </li>
            );
          })}
        </ul>
        </div>

        {/*
          LA BARRA DE PROGRESO, que es la última pieza del spec.

          ⚠️ SÓLO EXISTE EN EL MODO MOVIDO. Abajo de `lg` la fila tiene su
          propio scroll y el navegador ya dice dónde estás; una barra que no
          se mueve con el dedo sería un control roto.

          ⚠️ VA `aria-hidden`. Es el reflejo de un scroll, no un dato: el
          progreso ya lo anuncia la región scrollable, y una barra sin rol
          leída en voz alta no dice nada útil.
        */}
        {movido ? (
          <div aria-hidden="true" className="mt-10 hidden justify-center lg:flex">
            <span className="h-0.5 w-[min(360px,60vw)] overflow-hidden rounded-pill bg-ink/15">
              <span
                className="block h-full origin-left bg-sunset"
                style={{ transform: `scaleX(${p.toFixed(3)})` }}
              />
            </span>
          </div>
        ) : null}

        {/*
          LA ACLARACIÓN, centrada y pegada al carrusel.

          ⚠️ VA ADENTRO DEL `sticky` Y DEBAJO DE LA BARRA, que es donde Camila
          la pidió: «centrada debajo, cerca del carrusel». Escrita después del
          componente caía al final de la caja alta, casi tres pantallas más
          abajo que las tarjetas de las que habla.

          ⚠️ VUELVE A LA CAJA, igual que el encabezado: la sección es
          `width="full"` para que la fila llegue al borde, así que sin esto el
          párrafo mediría el ancho entero de la pantalla.
        */}
        {pie ? (
          <div className="caja mt-8 px-gutter text-center md:px-gutter-lg">{pie}</div>
        ) : null}

        {/*
          LA OLA, anclada al pie de la caja pegajosa. Ver la nota de la prop:
          acá asoma durante todo el pegado, y no sólo en el último tramo.

          ⚠️ VA `absolute` Y NO EN FLUJO. En flujo empujaría el contenido hacia
          arriba y el `justify-center` dejaría de centrar lo que se ve. Anclada
          al borde de abajo, la fila sigue centrada en lo que queda visible.
        */}
        {ola}
      </div>
    </div>
  );
}
