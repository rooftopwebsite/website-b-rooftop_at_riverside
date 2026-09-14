'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ButtonLink } from '@/components/shared/Button';
import { ArrowLeft, ArrowRight } from '@/components/shared/Icon';
import { PhotoPending } from '@/components/shared/PendingData';
import { activeTrucks } from '@/content/trucks';
import {
  type VenueEvent,
  type Weekday,
  recurringEvents,
  timeRange,
  weekdayLabel,
  whenLabel,
} from '@/content/events';
import { HAPPY_HOUR } from '@/lib/brand';

/**
 * «What's on» — la primera banda oscura de la home.
 *
 * Un carrusel de los eventos recurrentes, con el de HOY marcado, y debajo el
 * bloque de los camiones que están en el yard.
 *
 * ⚠️ Es la FUSIÓN de dos secciones que se pisaban, y eso no cambia con el
 * rediseño. Camila: «no entiendo la diferencia entre la sección Esta noche en
 * el Yard y Esta semana, ¿no debería ser toda una?». `TonightAtTheYard` y
 * `ThisWeek` leían la misma lista de recurrentes y la mostraban dos veces. Lo
 * que se conserva de la fusión es la inmediatez: la card de hoy va primera y
 * con el tag «Tonight».
 *
 * ⚠️ Client component, y no por gusto: necesita saber qué día es en Bonita
 * Springs. El servidor no puede — una página cacheada mostraría el jueves un
 * martes. El servidor pinta la semana completa, que ya es útil, y al montar se
 * reordena poniendo hoy adelante. Sin esto hay mismatch de hidratación y, peor,
 * se publica un dato que puede estar mal.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ PASÓ DE TRACK CON STAGGER A CARRUSEL CON CONTROLES — rediseño
 * `food-truck-club`. Es la cuarta forma de esta sección (tres tarjetas con
 * sombra → grilla asimétrica → track que sangra → carrusel), así que conviene
 * dejar escrito qué la hace distinta y no repetir la vuelta.
 *
 * Lo que cambia no es la fila, que ya sangraba: son los CONTROLES. Antes la
 * fila se arrastraba y nada decía que hubiera más de cuatro tarjetas — en
 * desktop, con el mouse, un `overflow-x` sin barra visible es contenido
 * invisible. Ahora hay flechas y puntos, y los puntos además dicen CUÁNTAS
 * son, que es la mitad del trabajo.
 *
 * ⚠️ Las flechas NO son decoración duplicada del scroll: son el único acceso
 * por teclado que no depende de tabular tarjeta por tarjeta. El contenedor
 * scrollea igual con rueda, trackpad y touch.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ El TOPE de tarjetas se queda. Hoy `recurringEvents()` devuelve cuatro,
 * pero si el cliente carga diez la home no puede convertirse en un catálogo:
 * para eso está `/whats-on`, que es adonde va el CTA.
 */

/**
 * Cuántas tarjetas de evento entran en la home antes de mandar al calendario.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ HOY EL CARRUSEL MUESTRA CUATRO, Y NO ES UN LÍMITE DEL COMPONENTE: ES
 * QUE NO HAY MÁS. Conviene tenerlo escrito porque «faltan tarjetas» parece un
 * bug y no lo es.
 *
 * El dashboard devuelve exactamente cuatro recurrentes —Wooftop Wednesdays,
 * Bingo Night, Ross Brown y La Noche · DJ David Cast— y la auditoría del
 * sitio viejo (`docs/current-site-inventory.md` §9) ya dejó constancia de que
 * los otros que nombra el brief, «Sunset Saturdays» y «Jazz Wednesdays», NO
 * EXISTEN en los datos del calendario. Inventarlos para llenar el carrusel
 * sería publicar eventos que no pasan.
 *
 * La lista canónica de recurrentes es la pregunta abierta #8 del pedido al
 * cliente. El tope está en 8 para que el día que lleguen no haya que tocar
 * nada: se cargan en el dashboard, `npm run sync:events`, y aparecen.
 * ══════════════════════════════════════════════════════════════════════════
 */
const MAX_CARDS = 8;

/** El aire entre tarjetas, en px. Lo necesita el cálculo del scroll. */
const CARD_GAP = 24;

/*
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ EL ANCHO DE TARJETA ES UNA FRACCIÓN DEL CONTENEDOR, y antes era `30vw`.
 * Es el cambio que arregla el «se ve raro con pocas cards» — pedido de Camila,
 * con la indicación de mirar cómo lo hacen los otros proyectos.
 *
 * Con `30vw` el ancho de la tarjeta no tenía NINGUNA relación con el ancho de
 * la caja, así que la fila terminaba donde caía: en la captura, la quinta
 * tarjeta —la naranja del calendario— quedaba cortada por la mitad contra el
 * borde de la pantalla, y los cinco puntos de abajo prometían cinco posiciones
 * cuando en realidad sólo había dos lugares a los que scrollear.
 *
 * El patrón de la casa es el de `happenings-slider` de santa-maría:
 * `w-full lg:w-[calc((100%-40px)/3)]`, o sea que entran N tarjetas EXACTAS por
 * vista y la última cierra contra el margen. Acá es lo mismo con nuestro
 * `gap-6` (24px): una tarjeta en mobile, dos en `md`, tres en `lg`.
 *
 * ⚠️ LOS TRES NÚMEROS ESTÁN ATADOS A `VISIBLES`, abajo. Si acá entran tres y
 * allá dice dos, los puntos cuentan mal.
 * ══════════════════════════════════════════════════════════════════════════
 */
const ANCHO = 'w-full md:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)]';

/** Cuántas tarjetas entran por vista en cada breakpoint. Espeja `ANCHO`. */
const VISIBLES = [
  { mq: '(min-width: 1024px)', n: 3 },
  { mq: '(min-width: 768px)', n: 2 },
] as const;

function venueWeekday(): Weekday {
  const label = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
  }).format(new Date());
  const map: Record<string, Weekday> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return map[label] ?? 0;
}

/** Lunes y martes el lugar está cerrado. Dato del brief, no inventado. */
const CLOSED_DAYS: readonly Weekday[] = [1, 2];

function EventCard({ event, isToday }: { readonly event: VenueEvent; readonly isToday: boolean }) {
  /*
   * ⚠️ A DÓNDE VA LA TARJETA. La entrada si el evento la tiene, la página del
   * evento si no. Hoy los cuatro recurrentes traen `ticketUrl` en `null` —el
   * dashboard tiene el campo y está vacío—, así que en la práctica todas caen
   * en `/whats-on/{slug}`. El día que carguen una entrada, la tarjeta cambia
   * de destino y de etiqueta sola.
   */
  const entradas = event.ticketUrl;
  const href = entradas ?? `/whats-on/${event.slug}`;
  const cta = entradas ? 'Get tickets' : 'See this night';

  const contenido = (
    <>
      {/*
        ══════════════════════════════════════════════════════════════════
        ⚠️ LA IMAGEN VA A SANGRE Y RECORTADA EN 4:5, y esto pasó por cuatro
        formas. Conviene dejar el recorrido escrito para no repetirlo.

          1. Apaisada con alto fijo (`h-50` / `20vw`) — la del diseño, para
             fotos de ambiente.
          2. `aspect-[4/5]` — cuando las imágenes pasaron a ser los FLYERS
             del local, que vienen con el texto impreso.
          3. `aspect-video` — porque las imágenes salen del `bannerUrl` del
             dashboard y el recortador del dashboard impone 16:9.
          4. Acá: 4:5 otra vez, pero AHORA RECORTANDO.

        ⚠️ POR QUÉ VUELVE. La forma 3 componía el flyer entero adentro del
        16:9 y eso dejaba dos franjas verdes a los costados. Camila: «las
        fotos tipo flyer prefiero que se recorten».

        ⚠️ Y SE PUEDE RECORTAR SIN INVENTAR NADA, que es el dato que lo hace
        seguro. Bajé el archivo que sirve el dashboard: mide **1920×1080** y
        trae el afiche vertical ya compuesto en el medio, entre los píxeles
        520 y 1400, con las bandas PEGADAS EN EL ARCHIVO. No son un hueco de
        la caja: son parte de la imagen, y por eso ninguna caja apaisada las
        podía evitar.

        Una caja 4:5 con `object-cover` deja a la vista los píxeles 527 a
        1391 del original. El afiche va de 520 a 1400. O sea que el recorte
        cae casi exacto sobre el afiche y las bandas se van solas, sin
        números mágicos y sin tocar el archivo. Y no es casualidad: el
        dashboard mete un vertical en un horizontal, así que volver al
        vertical lo devuelve.

        ⚠️ Para un banner que SÍ sea una foto apaisada de verdad, esta misma
        caja hace un recorte al centro, que es lo que se espera de una foto.
        ══════════════════════════════════════════════════════════════════
      */}
      {/*
        ⚠️ LA CAJA DE LA IMAGEN SE ANCLA ARRIBA Y TIENE SU PROPIO 4:5; NO
        HEREDA EL ALTO DE LA TARJETA. Parece redundante —la tarjeta ya es
        `aspect-[4/5]`— y no lo es: las tarjetas viven en una fila flex, y
        una fila flex ESTIRA a sus hijos al alto del más alto. El más alto
        es la tarjeta naranja del final, que tiene un titular de cuatro
        renglones; en mobile eso lleva la tarjeta de 325px a 464, o sea a una
        proporción de 0.56, y con `inset-0` el recorte se comía los costados
        del afiche: «LIVE» quedaba en «VE».

        Con la caja anclada arriba y su proporción propia, el recorte es el
        mismo a cualquier alto. Lo que sobra por abajo cuando la fila estira
        queda detrás del plate, que es del MISMO color que la tarjeta, así
        que no se ve ni un borde.
      */}
      <div className="absolute inset-x-0 top-0 aspect-[4/5] overflow-hidden">
        {event.image === null ? (
          /* ⚠️ El brief va en INGLÉS. Es texto VISIBLE, no un comentario: el
             hueco se publica marcado a propósito para que no pase callado. El
             borde punteado es lo que distingue «acá va algo» de «esto falló».

             ⚠️ El `pb-[42%]` no es aire: es el alto del plate. El hueco ocupa
             la caja entera y centra su texto, así que sin esto el brief
             quedaba centrado en los 500px y la mitad de abajo caía detrás del
             plate. Con el padding, se centra en la franja que SÍ se ve. */
          <PhotoPending
            brief={`${event.title} at ${event.space}, at night, with people`}
            ratio=""
            tone="dark"
            className="absolute inset-0 h-full rounded-none border-0 border-dashed pb-[42%]"
          />
        ) : (
          <Image
            src={event.image}
            alt={event.imageAlt ?? ''}
            fill
            sizes="(min-width: 1024px) 400px, 260px"
            className="object-cover transition-transform duration-500 ease-brand group-hover:scale-104"
          />
        )}
      </div>

      {isToday ? (
        <span className="absolute top-4 left-4 z-20 rounded-pill bg-sunset px-3.5 py-2 font-body text-caption font-medium uppercase tracking-eyebrow text-ink">
          Tonight
        </span>
      ) : null}

      {/*
        ══════════════════════════════════════════════════════════════════
        ⚠️ EL PLATE, Y CÓMO SE MUEVE. En reposo cubre el pie de la tarjeta
        con todo el texto; al hacer hover BAJA 76px: la imagen se queda con
        ese espacio y el bloque de abajo —la bajada más el rótulo del
        espacio— se cambia por una sola línea de CTA.

        Idea de Camila: «con el hover podría adaptarse y mostrarse entera,
        achicándose la parte verde y convirtiéndose en el texto CTA». Está
        prototipada aparte, en `_interno/prototipos/`.

        ⚠️ EL PLATE NO CAMBIA DE ALTO: SE DESPLAZA. Animar el alto es animar
        layout y en un carrusel de cuatro tarjetas eso se ve como un tirón.
        Lo que se mueve es un `translate`, y la tarjeta —que tiene
        `overflow-hidden`— le recorta lo que sobra por abajo.

        ⚠️ LOS 52px NO SON UN NÚMERO DE GUSTO: son el alto del cajón (96)
        menos el alto de la línea de CTA con su aire (44). Por eso el corte
        cae siempre justo debajo del CTA, tenga el título uno o dos
        renglones. Si se toca uno de los tres números hay que tocar los
        otros dos.

        ⚠️ El fondo pasa a `sunset` porque en hover la tarjeta ES un CTA. Y
        el texto encima va NEGRO, que es la regla del repo para el naranja:
        blanco da 2.54:1.
        ══════════════════════════════════════════════════════════════════
      */}
      <div className="absolute inset-x-0 bottom-0 z-10 bg-deeper px-6 pt-5.5 pb-6.5 transition-[transform,background-color] duration-300 ease-brand group-hover:translate-y-13 group-hover:bg-sunset">
        {/*
          ══════════════════════════════════════════════════════════════════
          ⚠️ EL RÓTULO DICE DÍA + HORA, y antes decía sólo el día. Faltaba
          justamente lo que alguien necesita para decidir si viene: a qué
          hora empieza.

          El dato estaba en la base desde siempre (`startTime`/`endTime`) y
          la función que lo formatea —`timeRange`— ya existía en
          `content/events.ts`. Sencillamente no se estaba mostrando.

          ══════════════════════════════════════════════════════════════════
          ⚠️ SEGUNDA VUELTA: EL HORARIO PASÓ A SER LO SEGUNDO QUE SE LEE DE LA
          TARJETA, DESPUÉS DEL TÍTULO. Camila: «resaltar horario en cards
          events, pasa muy desapercibido el día y hora y es de lo más
          importante».

          Tenía razón por composición, no por tamaño: el rótulo iba en
          `text-caption` (13px), en `muted-dark` —que es el gris de las bajadas,
          o sea el tono de lo SECUNDARIO— y en el mismo renglón corrido que el
          día. Era un pie de foto arriba de un titular de 36px. En una tarjeta
          de evento, la hora es la mitad del dato: quien mira esto está
          decidiendo si puede venir.

          Ahora son dos piezas con dos jerarquías, y el contraste entre ellas es
          lo que hace el trabajo:

            · el DÍA en `cream`, negrita, caja alta. Sube de 13 a 15px y deja
              de ser gris: pasa a ser el mismo color que la marca usa para
              destacar sobre oscuro.
            · la HORA en una PÍLDORA de `cream` sólido con texto `deep`. Es el
              único bloque de color macizo de la tarjeta en reposo, y por eso
              es lo que el ojo agarra primero.

          ⚠️ LA PÍLDORA ES SÓLIDA Y NO UN TINTE. Con `bg-cream/15` se lee como
          un chip apagado —el mismo problema que tenían los tags del yard— y
          además se desarma en el hover, cuando el fondo pasa de `deeper` a
          `sunset` y un 15 % de crema sobre naranja no es ningún color. Sólida
          funciona sobre los dos.

          ⚠️ EN EL HOVER SE INVIERTE. El cajón pasa a `sunset` y el texto a
          `ink`; si la píldora se quedara en crema, quedaría amarillo sobre
          naranja (1.71:1). Pasa a `ink` con la hora en `cream`: 14.91:1, y de
          paso sigue siendo el elemento más marcado de la tarjeta.

          Ratios medidos: `cream` sobre `deeper` 11.87:1 · `deep` sobre `cream`
          9.44:1 · `cream` sobre `ink` 14.91:1.

          ⚠️ SE FUE EL PUNTO MEDIO SEPARADOR. Existía para partir «Thursday ·
          6 – 8 PM» dentro de un renglón corrido; con la hora en su propia
          píldora, la separación la hace la forma y un punto en el medio sería
          ruido.
          ══════════════════════════════════════════════════════════════════
        */}
        <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
          <span className="font-body text-dato font-bold uppercase tracking-eyebrow text-cream transition-colors duration-300 ease-brand group-hover:text-ink">
            {event.weekday !== null ? weekdayLabel(event.weekday) : whenLabel(event)}
          </span>
          <span className="rounded-pill bg-cream px-2.5 py-0.75 font-body text-caption font-bold whitespace-nowrap text-deep transition-colors duration-300 ease-brand group-hover:bg-ink group-hover:text-cream">
            {timeRange(event)}
          </span>
        </span>

        <h3 className="m-0 mt-2.5 font-display text-d4 font-bold uppercase leading-none text-paper transition-colors duration-300 ease-brand group-hover:text-ink">
          {event.title}
        </h3>

        {/*
          ══════════════════════════════════════════════════════════════════
          ⚠️ EL CAJÓN QUE SE INTERCAMBIA. Alto FIJO de 96px, y de eso depende
          todo el mecanismo: es lo que permite que el plate se DESPLACE en vez
          de crecer. Adentro hay dos capas superpuestas en la misma esquina:

              arriba (44px)   la línea de CTA          ← la que queda
              todo el alto    la bajada + el espacio   ← la que se va

          Al bajar el plate 52px (96 − 44), lo único que sobrevive del cajón
          es esa primera franja. Los 44px son la línea de texto más el aire
          que hace de pie de la tarjeta: sin ellos el CTA quedaría pegado al
          borde de abajo.

          ⚠️ 96 Y NO 120, que fue el primer número. 120 daba lugar a tres
          renglones de bajada, y las bajadas reales miden uno o dos: en las
          tarjetas de «Bring the dog.» quedaban 56px de verde vacío abajo,
          que se leía como un error de maquetación. Con 96 el sobrante de la
          bajada más corta son 31px, que pasa por aire.

          ⚠️ La bajada va con `line-clamp-2`. El cajón es de alto fijo, así
          que una bajada larga se desbordaría sobre el CTA; el recorte es el
          seguro. Hoy ninguna de las cuatro llega a los dos renglones a 400px
          de ancho, o sea que no se pierde texto.
          ══════════════════════════════════════════════════════════════════
        */}
        <div className="relative mt-2.5 h-24">
          {/*
            ══════════════════════════════════════════════════════════════
            ⚠️ ES UNA COLUMNA CON `inset-0` Y NO UN BLOQUE CON `top-0`, Y ESO
            ES LO QUE ALINEA EL ESPACIO. Pedido de Camila: «alineá siempre
            abajo el nombre del espacio donde se realiza».

            Antes el rótulo del espacio colgaba de la bajada con un `mt-3.5`,
            así que su altura la decidía el largo del texto de arriba: «Bring
            the dog.» ocupa un renglón y «Live music on the rooftop every
            Thursday evening…» dos, y los tres rótulos quedaban en tres
            alturas distintas dentro de una fila de tarjetas iguales.

            Con el bloque estirado a todo el cajón (`inset-0`) y el rótulo en
            `mt-auto`, el espacio se apoya SIEMPRE en el piso del cajón, que
            mide 96px fijos en las cuatro tarjetas. Da igual cuántos renglones
            tenga la bajada.

            ⚠️ EL `mt-auto` NECESITA QUE EL PADRE SEA `flex-col` Y TENGA ALTO.
            Los dos vienen de acá: `inset-0` le da el alto del cajón —que es
            el `h-24` de afuera— y `flex-col` el eje. Volver a `top-0` deja el
            bloque midiendo su contenido y el `mt-auto` no tiene de dónde
            sacar el sobrante.
            ══════════════════════════════════════════════════════════════
          */}
          <div className="absolute inset-0 flex flex-col transition-opacity duration-300 ease-brand group-hover:opacity-0">
            <p className="m-0 line-clamp-2 font-body text-base font-light text-paper/92">
              {event.summary}
            </p>

            {/*
              ⚠️ SE FUE LA PÍLDORA DE «EVERY WEEK». Pedido de Camila: «sacá el
              tag de every week».

              Estaba para contestar «¿vuelve a pasar?» a quien no podía venir
              ese día, y el argumento no era malo; lo que lo vuelve
              innecesario es el rótulo de arriba, que dice el DÍA DE LA SEMANA
              —«Wednesday», «Thursday»— y no una fecha. Un día de la semana ya
              se lee como algo que se repite: la píldora estaba diciendo dos
              veces lo mismo, y encima con la forma de un control.

              El dato completo de recurrencia sigue estando en la página del
              evento y en el calendario de `/whats-on`.

              ⚠️ `event.kind` SIGUE EXISTIENDO y lo usan el calendario y la
              página de cada evento. Lo que se fue es este render, no el campo.
            */}
            <span className="mt-auto font-body text-micro uppercase tracking-cta text-muted-dark">
              {event.space}
            </span>
          </div>

          {/*
            La línea de CTA. `aria-hidden` NO: es texto real y forma parte del
            nombre accesible del link, que es lo que hace que en un lector de
            pantalla la tarjeta se anuncie como «Ross Brown … See this night»
            en vez de terminar en la bajada. Que en reposo esté en `opacity-0`
            no la saca del árbol de accesibilidad, y eso acá es lo correcto:
            en un teléfono no hay hover y el destino tiene que anunciarse
            igual.
          */}
          <span className="absolute inset-x-0 top-0 flex h-11 items-start gap-2 font-body text-base font-semibold text-ink opacity-0 transition-opacity duration-300 ease-brand group-hover:opacity-100">
            {cta}
            <ArrowRight className="size-4 shrink-0 translate-y-1 transition-transform duration-300 ease-brand group-hover:translate-x-1" />
            {entradas ? <span className="sr-only">(opens in a new tab)</span> : null}
          </span>
        </div>
      </div>
    </>
  );

  /*
   * ⚠️ LA TARJETA ENTERA ES EL LINK, y antes no era link en absoluto: el
   * carrusel mostraba cuatro eventos y ninguno llevaba a ningún lado.
   *
   * Que el destino esté en la tarjeta y no sólo en el CTA es lo que hace que
   * esto funcione EN UN TELÉFONO. El CTA aparece con el hover, y en touch no
   * hay hover: si el link viviera únicamente ahí, en mobile la tarjeta no
   * tendría dónde tocarse. Así, el hover es un adorno de escritorio y el
   * toque navega igual.
   */
  const clases =
    `group relative block aspect-[4/5] shrink-0 snap-start overflow-hidden rounded-shell bg-deeper sombra-card transition-transform duration-300 ease-brand hover:-translate-y-1.5 ${ANCHO}`;

  return entradas ? (
    <a href={entradas} target="_blank" rel="noopener noreferrer" className={clases}>
      {contenido}
    </a>
  ) : (
    <Link href={href} className={clases}>
      {contenido}
    </Link>
  );
}

/**
 * La última tarjeta del carrusel: el CTA al calendario completo.
 *
 * ⚠️ ES UNA TARJETA Y NO UN BOTÓN AL COSTADO, y ese es el punto. Un carrusel
 * que se termina en seco no dice qué hay después; uno que termina en una
 * tarjeta del mismo tamaño que las otras convierte el final del recorrido en
 * el destino. Quien llegó scrolleando hasta el final es exactamente quien
 * quiere ver más — y se lo encuentra sin volver arriba a buscar el botón.
 *
 * ⚠️ VA EN `sunset` Y NO EN `deeper` COMO LAS OTRAS. Es la única tarjeta que
 * no es un evento, así que no puede parecerse a las que sí lo son: si fuera
 * del mismo color, el ojo la cuenta como un quinto evento y recién al leerla
 * descubre que no. El naranja la separa de un vistazo.
 *
 * ⚠️ Texto NEGRO sobre el naranja. 8.26:1. Blanco daría 2.54:1 y está
 * prohibido en todo el sitio — es el error que más veces estuvo a punto de
 * colarse.
 */
function CalendarCard() {
  return (
    <Link
      href="/whats-on"
      className={`group flex shrink-0 snap-start flex-col justify-between gap-8 rounded-shell bg-sunset p-7 sombra-card text-ink transition-colors duration-300 ease-brand hover:bg-sunset-hover lg:p-9 ${ANCHO}`}
    >
      {/*
        ⚠️ `text-ink` OPACO y no `text-ink/70`. La primera versión bajaba la
        opacidad para que el rótulo pesara menos que el titular, y axe lo
        midió en 4.01:1 contra el 4.5:1 que pide un texto de 12px: sobre un
        campo de color, una opacidad no aclara el texto, lo MEZCLA con el
        naranja — el resultado (#513E1F) es un marrón que no está en la
        paleta y que nadie eligió.

        La jerarquía la hace el tamaño y la caja alta, que para eso está el
        eyebrow. Es la misma razón por la que existe el token `muted`.
      */}
      <span className="font-body text-caption font-medium uppercase tracking-eyebrow text-ink">
        Every week
      </span>

      <span>
        <span className="block font-display text-d2 font-extrabold uppercase leading-[0.9]">
          See the whole calendar
        </span>
        <span className="mt-4 block max-w-[26ch] font-body text-base font-light">
          Live music five nights a week, Bingo on Wednesdays and DJ sets late on Saturdays. Almost
          all of it is free.
        </span>
      </span>

      <span className="grid size-13 place-items-center rounded-pill bg-ink text-sunset transition-transform duration-300 ease-brand group-hover:translate-x-1.5">
        <ArrowRight className="size-5" />
      </span>
    </Link>
  );
}

export default function WhatsOn() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [today, setToday] = useState<Weekday | null>(null);
  const [index, setIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => setToday(venueWeekday()), []);

  /*
   * ⚠️ ARRANCA EN 1 Y NO EN 3. El servidor no sabe el ancho de la pantalla, y
   * de `visibles` dependen los puntos: con 3 en el primer pintado, un teléfono
   * publicaría menos puntos de los que hacen falta hasta que monte. Con 1, el
   * peor caso es que aparezcan un par de puntos de más por un instante, que no
   * miente sobre a dónde se puede llegar.
   */
  const [visibles, setVisibles] = useState(1);

  useEffect(() => {
    const mqs = VISIBLES.map((v) => ({ ...v, m: window.matchMedia(v.mq) }));
    const aplicar = () => setVisibles(mqs.find((v) => v.m.matches)?.n ?? 1);
    aplicar();
    mqs.forEach((v) => v.m.addEventListener('change', aplicar));
    return () => mqs.forEach((v) => v.m.removeEventListener('change', aplicar));
  }, []);

  const week = recurringEvents();

  /*
   * El orden: hoy primero, después el resto en su orden natural. Antes de
   * montar `today` es `null` y la lista sale sin reordenar — que es la semana
   * completa, información correcta y útil por sí sola.
   */
  const events = (
    today === null
      ? week
      : [...week.filter((e) => e.weekday === today), ...week.filter((e) => e.weekday !== today)]
  ).slice(0, MAX_CARDS);

  const isClosedToday = today !== null && CLOSED_DAYS.includes(today);

  /*
   * ══════════════════════════════════════════════════════════════════════
   * ⚠️ UN PUNTO POR POSICIÓN Y NO POR TARJETA, y antes era por tarjeta.
   *
   * Con cinco tarjetas y tres a la vista sólo hay TRES lugares a los que
   * scrollear: 0, 1 y 2. Los cinco puntos de antes prometían cinco, así que
   * los dos últimos no llevaban a ninguna parte nueva y la flecha se apagaba
   * con dos puntos todavía sin marcar. Es la mitad del «se ve raro».
   *
   * La cuenta es la de `happenings-slider` de santa-maría: `max = total −
   * visibles`, y los puntos son `max + 1`.
   * ══════════════════════════════════════════════════════════════════════
   */
  const tarjetas = [...events.map((e) => e.title), 'See the whole calendar'];
  const maxIndex = Math.max(0, tarjetas.length - visibles);

  /*
   * El texto de cada punto. Nombra la PRIMERA tarjeta de esa posición, que es
   * lo único que se puede decir con sentido: «ir a la posición 2» no dice
   * nada, el título del evento sí.
   */
  const slides = tarjetas.slice(0, maxIndex + 1);

  /*
   * ⚠️ EL PASO SE MIDE, no se guarda. El ancho de tarjeta es
   * `clamp(260px,30vw,400px)`, así que cambia con el viewport y con el zoom
   * del navegador. Leerlo del DOM en cada uso es más barato que mantener un
   * estado sincronizado con un `resize`.
   */
  const step = () => {
    const card = trackRef.current?.firstElementChild;
    return card ? card.getBoundingClientRect().width + CARD_GAP : 320;
  };

  const scrollByCard = useCallback((dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * step(), behavior: 'smooth' });
  }, []);

  /* ⚠️ Se clampea a `maxIndex`: el último punto es la última POSICIÓN, no la
     última tarjeta, así que `i` nunca puede pedir más scroll del que hay. */
  const scrollToCard = useCallback(
    (i: number) => {
      const el = trackRef.current;
      if (!el) return;
      el.scrollTo({ left: Math.max(0, Math.min(maxIndex, i)) * step(), behavior: 'smooth' });
    },
    [maxIndex],
  );

  /*
   * ⚠️ `canPrev`/`canNext` salen de la POSICIÓN DEL SCROLL y no del índice.
   * Con `justify-center-safe`, cuando las tarjetas entran enteras no hay
   * scroll posible y el índice se queda en 0 para siempre: si las flechas
   * dependieran del índice, «siguiente» quedaría habilitada apuntando a una
   * tarjeta que ya está a la vista. Midiendo el scroll, las dos se apagan
   * solas cuando no hay nada que correr.
   *
   * El margen de 1px absorbe el redondeo sub-píxel de los DPR fraccionales
   * (1.25 y 1.5 de Windows): sin él, `scrollLeft` llega a 811.5 contra un
   * máximo de 812 y la flecha nunca se apaga.
   */
  /*
   * ⚠️ `maxIndex` ENTRA POR UN REF Y NO POR LA LISTA DE DEPENDENCIAS.
   * `onScroll` está suscripto al `resize` y al `onScroll` del track; si
   * dependiera de `maxIndex`, cada cambio de breakpoint crearía un callback
   * nuevo y habría que desuscribir y volver a suscribir los dos listeners. El
   * ref deja el callback estable y siempre lee el valor de ahora.
   */
  const maxIndexRef = useRef(0);
  maxIndexRef.current = maxIndex;

  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    /* El índice se topea en `maxIndex` por la misma razón que `scrollToCard`:
       al final del recorrido el scroll puede caer más allá del último punto de
       anclaje y dejar los puntos sin ninguno marcado. */
    setIndex(Math.min(maxIndexRef.current, Math.round(el.scrollLeft / step())));
    setCanPrev(el.scrollLeft > 1);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  /* Al montar y en cada resize hay que recalcular: el ancho de tarjeta es
     fluido, así que un carrusel que desbordaba a 1440 puede entrar a 1920. */
  useEffect(() => {
    onScroll();
    window.addEventListener('resize', onScroll, { passive: true });
    return () => window.removeEventListener('resize', onScroll);
  }, [onScroll]);

  /*
   * ══════════════════════════════════════════════════════════════════════
   * ⚠️ VUELTA AL PRINCIPIO CUANDO CAMBIA EL ORDEN, y sin esto el carrusel
   * abre mostrando la SEGUNDA tarjeta. Medido: `scrollLeft: 424` —un ancho
   * de tarjeta más el gap— apenas termina de hidratar.
   *
   * La causa es la combinación de dos cosas que por separado están bien. El
   * servidor pinta los eventos en su orden natural; al montar, `today` deja
   * de ser `null` y la lista se REORDENA para poner el de hoy adelante. Ese
   * reordenamiento cambia los hijos de un contenedor con `snap-mandatory`, y
   * ahí el navegador está obligado a re-anclar: recalcula, y aterriza en el
   * punto de anclaje más cercano a donde estaba el contenido que antes tenía
   * enfrente, que ya no es el primero.
   *
   * Es un efecto y no un `key` en el contenedor a propósito: remontar el
   * track entero para corregir el scroll tiraría también el foco de quien
   * esté tabulando por las tarjetas.
   *
   * Corre en el montaje (`today === null`) y otra vez cuando se resuelve, o
   * sea dos veces y nunca más. No pelea con el visitante: para cuando
   * alguien puede llegar a scrollear, ya pasó.
   * ══════════════════════════════════════════════════════════════════════
   */
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollLeft = 0;
    onScroll();
  }, [today, onScroll]);

  /*
   * ⚠️ El titular cambia con el estado del lugar y no es un detalle de copy.
   * Un lunes, «This week in the yard» encabezando cuatro tarjetas de eventos
   * hace que alguien salga de casa. El lugar está cerrado lunes y martes.
   */
  const headline = isClosedToday
    ? { a: 'Closed today,', b: 'back Wednesday' }
    : { a: 'This week', b: 'in the yard' };

  const trucks = activeTrucks();

  return (
    <section
      id="whats-on"
      aria-labelledby="whats-on-title"
      /*
    Lleva `grano` como todas las superficies planas del sitio — la utilidad
    está documentada en globals.css. Las secciones que pasan por `<Section>` lo
    reciben solas; ésta está escrita a mano, así que lo escribe a mano.
      */
      className="grano banda-arco relative z-[2] bg-deep pt-14 pb-cierre-arco text-bone on-dark lg:pt-[110px]"
    >
      <div className="caja-ancha">
        <h2
          id="whats-on-title"
          className="mx-auto max-w-[16ch] text-center font-display text-banda font-extrabold uppercase"
        >
          <span className="block text-paper">{headline.a}</span>
          <span className="block text-sunset">{headline.b}</span>
        </h2>

        <div className="mt-6.5 flex justify-center lg:mt-10">
          {/* ⚠️ Era un `<Link>` con las clases del botón copiadas a mano. Ahora
              es el componente; lo único propio que queda es el `group` con el
              `active:scale-95`, que es el gesto de este bloque y no del
              sistema. Ver el encabezado de `Button.tsx`. */}
          <ButtonLink
            href="/whats-on"
            /* Crema y no naranja: es un CTA sobre la losa `deep`. El
               razonamiento y los ratios están en `EventsBanner`. */
            variant="onDark"
            size="lg"
            className="group transition-all duration-300 ease-brand active:scale-95"
          >
            Full calendar
            <ArrowRight className="size-4 transition-transform duration-300 ease-brand group-hover:translate-x-1" />
          </ButtonLink>
        </div>
      </div>

      {/* ── El carrusel ──────────────────────────────────────────────────
          ══════════════════════════════════════════════════════════════════
          ⚠️ VA CENTRADO, y antes sangraba por la derecha. El diseño lo
          componía con el padding izquierdo alineado a la página y el derecho
          mucho más grande (`clamp(16px,10vw,190px)`) para dejar ver que había
          más tarjetas. Se veía descolgado: con cuatro tarjetas la fila
          arrancaba pegada al borde izquierdo y dejaba 190px de aire a la
          derecha, o sea el bloque entero corrido respecto del titular
          centrado que tiene arriba y de los controles centrados que tiene
          abajo. Pedido de Camila.

          ⚠️ `justify-center-safe` y NO `justify-center` a secas. En un
          contenedor que scrollea, el centrado normal recorta el principio del
          contenido cuando desborda: los primeros píxeles quedan del lado
          negativo del scroll y no hay forma de llegar a ellos, ni con las
          flechas ni arrastrando. El modificador `safe` centra sólo mientras
          entre y vuelve a alinear al inicio cuando desborda, que es
          exactamente lo que hace falta acá — con cuatro tarjetas desborda en
          desktop y con una sola no.
          ══════════════════════════════════════════════════════════════════ */}
      <div className="caja-ancha mt-bloque">
        {/*
          ⚠️ `tabIndex={0}` + `role="group"` + label, y los tres son
          obligatorios. axe lo marcó como `scrollable-region-focusable`: un
          contenedor que scrollea y no recibe foco es contenido que alguien
          navegando con teclado no puede alcanzar — las flechas del teclado
          no mueven un `overflow-x` que no está enfocado, y tabular entra a
          las tarjetas pero no scrollea el track.

          Con foco, las flechas ← → del teclado scrollean el carrusel, que es
          el comportamiento nativo y no hace falta escribirlo.
        */}
        <div
          ref={trackRef}
          onScroll={onScroll}
          tabIndex={0}
          role="group"
          aria-label="This week’s events"
          /*
            ⚠️ SIN `px-borde`, SIN `scroll-px-borde` Y SIN `justify-center-safe`.
            Los tres estaban para parchar el mismo problema, que ya no existe:
            el track vive DENTRO de `caja-ancha` y las tarjetas son una
            fracción exacta de ese ancho, así que el primer anclaje es
            `scrollLeft: 0` porque no hay padding que correrlo, y no hay nada
            que centrar porque la fila mide lo que mide la caja.

            ══════════════════════════════════════════════════════════════
            ⚠️ EL PADDING LATERAL SE PROBÓ ACÁ ADENTRO Y HUBO QUE SACARLO, y
            conviene dejarlo escrito porque la idea vuelve sola.

            El argumento para meterlo era la sombra: con el padding afuera, el
            borde que recorta cae justo sobre el borde de la primera y la
            última tarjeta y `sombra-card` se corta a pico de costado. Cierto.
            Pero el costado de un carrusel NO es un borde cualquiera: es la
            ventana por la que se ve que hay más contenido. Corriéndola 56px
            hacia afuera, la CUARTA tarjeta asomaba media cortada dentro de la
            caja, que es peor que la sombra. Camila: «se ve un poco de la 4
            card y queda recortada y se ve mal, antes estaba bien».

            En el eje en que un contenedor scrollea, el recorte es diseño y no
            un defecto. Lo que sí es un defecto es el recorte en el eje
            TRANSVERSAL, y ese sigue resuelto abajo.
            ══════════════════════════════════════════════════════════════

            ⚠️ LOS `py` SE QUEDAN, Y NO SON AIRE. Declarar `overflow-x: auto`
            computa el `overflow-y` a `auto` también, así que este track
            recorta arriba y abajo aunque nadie haya pedido scroll vertical.
            Sin los `py`, `sombra-card` quedaba cortada al ras del borde
            inferior.

            ══════════════════════════════════════════════════════════════
            ⚠️ SEGUNDA MEDICIÓN, Y LOS NÚMEROS SUBIERON. Estaban en 8 y 32,
            calculados con `blur / 2 + spread` — la lectura literal del spec
            de `box-shadow`. Esa cuenta da el punto MEDIO del degradé, no
            dónde la sombra deja de verse: el desenfoque es una gaussiana de
            sigma = blur/2 y a esa distancia todavía queda cerca de un tercio
            del valor. Con una sombra al 55 % sobre una losa oscura, ese
            tercio se ve.

            Medido con perfil de píxeles: al borde del track la luminancia
            seguía 4 niveles por debajo del fondo, y ese escalón recto a lo
            ancho de las tres tarjetas es lo que Camila marcó dos veces
            —«sigo viendo la sombra contenida en un frame»—.

            Con la cuenta corregida (`blur + spread`), `shadow-card-dark`
            —`0 18px 44px -12px`— alcanza 50px hacia abajo y 14 hacia arriba.
            De ahí `pt-3.5` y `pb-13`.

            ⚠️ LOS MÁRGENES NEGATIVOS MANTIENEN EL LAYOUT DONDE ESTABA. El
            padding creció 8px arriba y 20 abajo, y los dos se devuelven con
            `-mt-2` y `-mb-5`: el aire visible entre el titular, la fila y los
            controles es exactamente el de antes. Lo único que creció es la
            caja que RECORTA.
            ══════════════════════════════════════════════════════════════
          */
          className="-mt-2 -mb-5 flex snap-x snap-mandatory gap-6 overflow-x-auto pt-3.5 pb-13 [scrollbar-width:none] -mx-borde scroll-px-borde px-borde [&::-webkit-scrollbar]:hidden"
        >
          {events.map((event) => (
            <EventCard key={event.slug} event={event} isToday={today !== null && event.weekday === today} />
          ))}

          {/* La última: el CTA al calendario. Ver `CalendarCard`. */}
          <CalendarCard />
        </div>

        {/*
          ══════════════════════════════════════════════════════════════════
          ⚠️ LOS CONTROLES NO SE RENDERIZAN SI ENTRAN TODAS LAS TARJETAS, y
          es la otra mitad del «se ve raro con pocas cards».

          Cuando `maxIndex` es 0 no hay ningún lugar a donde ir: las dos
          flechas salían apagadas y quedaba UN punto solo, relleno, debajo de
          una fila que no scrollea. Un control único y deshabilitado no
          informa nada — sólo ocupa lugar y sugiere que algo no anda.

          Es lo que hace `happenings-slider` de santa-maría, que envuelve toda
          la botonera en `max > 0`.

          ⚠️ No alcanza con `canPrev`/`canNext`, que miden el scroll: esos dos
          también dicen la verdad, pero apagan las flechas dejando los puntos.
          Lo que decide si la botonera EXISTE es cuántas posiciones hay.
          ══════════════════════════════════════════════════════════════════
        */}
        {maxIndex > 0 ? (
        <div className="flex items-center justify-center gap-5 pt-6.5">
          {/*
            ⚠️ Las flechas se DESHABILITAN en los extremos en vez de quedar
            activas sin hacer nada. Un control que responde al hover, se
            aprieta y no pasa nada se lee como que el carrusel está roto;
            apagado se lee como que no hay más. `disabled` además lo saca del
            recorrido del tabulador y lo anuncia como no disponible.
          */}
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            className="grid size-13 place-items-center rounded-pill text-bone ring-1 ring-muted-dark transition-all duration-300 ease-brand hover:bg-bone hover:text-deep active:scale-95 disabled:pointer-events-none disabled:opacity-30"
          >
            <span className="sr-only">Previous events</span>
            <ArrowLeft />
          </button>

          {/*
            ⚠️ LOS PUNTOS AHORA SON BOTONES Y NO ADORNO. Estaban como `span`
            con `aria-hidden`, razonando que «dicen cuántas tarjetas hay y eso
            ya lo tiene quien tabula». Era verdad a medias: decían en cuál
            estás, que es información que nadie más da, y encima parecen
            clickeables — un punto relleno al lado de puntos vacíos, debajo de
            un carrusel, es un control en cualquier sitio del mundo. Que no
            respondiera era el bug.
          */}
          <div className="flex gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide}
                type="button"
                onClick={() => scrollToCard(i)}
                aria-current={i === index ? 'true' : undefined}
                /*
                  ⚠️ EL BOTÓN MIDE 44px Y EL PUNTO 9. La auditoría en seis
                  anchos los encontró en 24×24: cumplen el mínimo de WCAG
                  2.5.8 (24) pero quedan por debajo del target táctil
                  recomendado, y son cinco controles pegados uno al lado del
                  otro en la parte más angosta de la pantalla — el peor caso
                  posible para errarle.

                  Se agranda el ÁREA, no el dibujo: el `<button>` es
                  invisible y el punto adentro sigue midiendo 9px. Es la
                  técnica estándar y no cambia nada de lo que se ve.

                  ⚠️ El `-mx-1` recorta el aire que suman los cinco botones
                  de 44px, para que la fila de puntos no se separe de las
                  flechas más de lo que el diseño marca.
                */
                className="group -mx-1 grid size-11 place-items-center rounded-pill"
              >
                <span className="sr-only">{slide}</span>
                <span
                  className={[
                    'block size-2.25 rounded-pill transition-all duration-300 ease-brand',
                    'group-hover:scale-140',
                    i === index ? 'bg-sunset' : 'bg-muted-dark/40 group-hover:bg-muted-dark',
                  ].join(' ')}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            className="grid size-13 place-items-center rounded-pill text-bone ring-1 ring-muted-dark transition-all duration-300 ease-brand hover:bg-bone hover:text-deep active:scale-95 disabled:pointer-events-none disabled:opacity-30"
          >
            <span className="sr-only">Next events</span>
            <ArrowRight />
          </button>
        </div>
        ) : null}
      </div>

      {/* ── Los camiones que están hoy ───────────────────────────────── */}
      <div
        id="trucks"
        className="caja-ancha mt-12 border-t border-muted-dark/35 pt-7 lg:mt-22 lg:pt-11"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-5">
          <span className="font-body text-caption font-medium uppercase tracking-eyebrow text-muted-dark">
            In the yard
          </span>
          <Link
            href="/food-trucks"
            className="group flex items-center gap-2 font-body text-base text-cream transition-colors duration-200 hover:text-paper"
          >
            All {trucks.length === 4 ? 'four' : trucks.length} trucks
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/*
          ⚠️ Los nombres salen de `activeTrucks()` y NO están escritos acá. En
          el prototipo eran cuatro props de texto (`truckOne`… `truckFour`)
          porque un mockup no tiene de dónde leerlos. El roster ROTA: es el
          dato del sitio que más cambia, y transcribirlo a un componente es
          garantizar que en dos meses la home nombre un camión que ya no está.
        */}
        <p className="mt-4.5 max-w-[62ch] font-body text-lead font-light text-paper">
          {trucks.map((t) => t.name).join(' · ')}. The roster rotates, and each truck takes its own
          orders and its own payment.
        </p>
        <p className="mt-3.5 font-body text-base text-cream lg:text-dato">
          <strong className="font-semibold">Happy hour</strong> {HAPPY_HOUR.days},{' '}
          {HAPPY_HOUR.time}: {HAPPY_HOUR.deals.join(' · ')}
        </p>
      </div>
    </section>
  );
}
