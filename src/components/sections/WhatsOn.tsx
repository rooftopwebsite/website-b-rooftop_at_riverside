'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ButtonLink } from '@/components/shared/Button';
import { ArrowLeft, ArrowRight } from '@/components/shared/Icon';
import { PhotoPending } from '@/components/shared/PendingData';
import { TAG } from '@/lib/tag';
import { activeTrucks } from '@/content/trucks';
import {
  type VenueEvent,
  type Weekday,
  recurringEvents,
  timeRange,
  weekdayLabel,
  whenLabel,
} from '@/content/events';

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
 * marcada. La marca fue el tag «Tonight» sobre el afiche hasta el 2026-09-16 y
 * hoy es la palabra «Today» en el renglón del día; el porqué del cambio está
 * abajo, en `EventCard`.
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

/**
 * El `px-8` del track, en px. Es el aire que se le deja a la sombra de las
 * tarjetas y NO cuenta como ventana: lo usa `medirDentro` para decidir qué
 * tarjeta entra entera. Si cambia la clase, cambia este número.
 */
const BORDE_TRACK = 32;

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

function EventCard({
  event,
  isToday,
  fuera,
}: {
  readonly event: VenueEvent;
  readonly isToday: boolean;
  /** No entra en la ventana del carrusel: se apaga. Ver el track. */
  readonly fuera: boolean;
}) {
  /*
   * ⚠️ A DÓNDE VA LA TARJETA: a la entrada si el evento la tiene, al
   * calendario si no. Hoy los cuatro recurrentes traen `ticketUrl` en `null`
   * —el campo existe en el dashboard y está vacío—, así que caen todas en
   * `/whats-on`. El día que carguen una entrada, la tarjeta cambia de destino
   * y de etiqueta sola.
   *
   * ⚠️ SIN ENTRADA VA AL CALENDARIO, no a una ficha por evento. Apuntaba a
   * `/whats-on/{slug}` y esa ruta se eliminó el 2026-09-15 por decisión de
   * Camila —el calendario muestra todo y el evento con entrada deriva a
   * Eventbrite—, así que las cuatro tarjetas recurrentes estaban linkeando a
   * un 404.
   */
  const entradas = event.ticketUrl;
  const href = entradas ?? '/whats-on';
  const cta = entradas ? 'Get tickets' : 'See the calendar';

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
        ══════════════════════════════════════════════════════════════════
        ⚠️ SON DOS CAJAS Y CADA UNA TIENE SU TRABAJO: la VENTANA fija lo que
        se ve y la CAJA DE RECORTE fija qué parte del afiche entra. Antes
        había una sola y por eso las tarjetas salían disparejas.

        Cómo era: la caja de recorte 4:5 se anclaba arriba de la tarjeta y el
        plate verde le tapaba el pie. O sea que EL ALTO VISIBLE DE LA FOTO
        ERA EL RESTO DE UNA CUENTA —alto de la tarjeta menos alto del
        plate—, y el plate mide distinto en cada tarjeta según cuántos
        renglones ocupen el título y la bajada. Camila lo vio en la home:
        «necesito que estas cards sean parejas, muestren la imagen al mismo
        tamaño, no algunas más grandes». Con «Bring the dog.» en un renglón
        y las otras dos en dos, la primera mostraba 30px más de foto.

        Cómo es: la ventana mide 7:5 SIEMPRE, arriba de todo y fuera del
        flujo del plate, así que la foto ya no depende de lo que diga el
        texto de abajo. La tarjeta dejó de tener proporción fija y ahora
        crece con su contenido; la fila flex las estira a todas al alto de
        la más alta y el sobrante cae en el plate, que es de un solo color.

        ⚠️ LOS 7:5 NO SON UN NÚMERO NUEVO: son los que ya se veían. Con el
        recorte 4:5 asomando por una ventana de 7:5, lo que entra es el 57 %
        de arriba de la caja, que es casi exactamente lo que dejaba el plate
        en la tarjeta de un renglón.

        ⚠️ Y LA CAJA DE RECORTE SIGUE SIENDO 4:5, no la ventana. El motivo
        está arriba: los afiches vienen en 1920×1080 con el vertical pegado
        en el medio, y sólo una caja vertical los devuelve. Poner la foto en
        la ventana con `object-cover` recortaría por los costados y «LIVE»
        volvería a quedar en «VE».
        ══════════════════════════════════════════════════════════════════
      */}
      <div className="relative aspect-[7/5] w-full shrink-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 aspect-[4/5] overflow-hidden">
          {event.image === null ? (
            /* ⚠️ El brief va en INGLÉS. Es texto VISIBLE, no un comentario: el
               hueco se publica marcado a propósito para que no pase callado. El
               borde punteado es lo que distingue «acá va algo» de «esto falló».

               ⚠️ El `pb-[42%]` no es aire: es la parte de la caja que la
               ventana no muestra. El hueco ocupa la caja entera y centra su
               texto, así que sin esto el brief quedaba centrado en los 500px y
               la mitad de abajo caía fuera de cuadro. */
            <PhotoPending
              brief={`${event.title} en ${event.space}, de noche, con gente.`}
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

        {/*
          ══════════════════════════════════════════════════════════════════
          ⚠️ ACÁ ESTABA EL TAG «TONIGHT» Y AHORA ESTÁ EL ESPACIO. Pedido de
          Camila, 2026-09-16: «donde tenemos el tag de Tonight saquémoslo y
          pongamos allí The Yard, Sunset Bar o la zona que corresponda».

          ⚠️ EL ESPACIO SE MUDÓ, NO SE DUPLICÓ. Vivía abajo, como rótulo en
          micro gris encima del CTA. Dejarlo en los dos lugares sería decir
          «The Yard» dos veces en una tarjeta de 400px.

          Y gana con la mudanza: arriba lo lee todo el mundo antes que el
          título, que es como funciona —primero dónde, después qué—, mientras
          que abajo era la línea más chica y más apagada de la tarjeta.

          ⚠️ LA PÍLDORA APARECE EN LAS CUATRO, y el tag anterior sólo en la
          de hoy. Por eso el naranja acá ya no significa «esto es hoy»: es el
          color de la etiqueta y nada más. Qué pasó con la marca de hoy está
          anotado abajo, en el renglón del día.

          ══════════════════════════════════════════════════════════════════
          ⚠️ Y POR ESO MISMO DEJÓ DE SER NARANJA MACIZA. Camila, 2026-09-16:
          «estos tags que sean suaves, no naranjas sólidos». Con el tag de
          hoy, el naranja era una alarma en una tarjeta de cuatro; repetido en
          las cuatro y diciendo un dato de ubicación, competía con lo único
          que tiene que gritar en esta sección, que es el horario.

          Ahora es un CRISTAL OSCURO: `deep` al 85 % con desenfoque detrás y
          un filete de crema al 25. Es el mismo gesto que una etiqueta sobre
          una foto en cualquier lado —recede, no tapa— y encima funciona mejor
          que el naranja sobre material que no controlamos.

          ⚠️ EL 85 % NO ES DECORATIVO, es el piso de contraste, y el peor caso
          es la píldora sobre una zona BLANCA del afiche —que existe: los
          flyers del local tienen fondos claros—. Medido:

              opacidad    sobre blanco      sobre la tarjeta
                 85 %       6,16:1              9,84:1
                 80 %       5,36:1              9,84:1
                 70 %       4,03:1             10,12:1

          O sea que el número que importa es la columna del medio, y 70 ya no
          pasa AA. Si alguna vez se toca la opacidad, se toca mirando esa
          columna y no cómo se ve sobre el verde, que siempre da bien.

          ══════════════════════════════════════════════════════════════════
          ⚠️ LA LETRA Y EL TAMAÑO NO SON DE ACÁ: SALEN DE `TAG`. Este tag pasó
          por dos pedidos seguidos el mismo día —primero «dales el tamaño de
          estos» señalando los chips de `YardSteps`, después «si los tags serán
          con letra minúscula que lo sean todos, debemos unificar»— y de ahí
          salió el molde común de `lib/tag.ts`. Lo que quedó acá es lo que sí
          es de este contexto: el cristal oscuro, el filete y el desenfoque.

          ⚠️ POR ESO YA NO VA EN CAJA ALTA. Era `uppercase tracking-eyebrow`,
          que en este sitio es el tratamiento de los rótulos de sección y de
          los CTA: un tag en mayúsculas con tracking se lee como un rótulo o
          como un botón, y esto no es ninguna de las dos.
          ══════════════════════════════════════════════════════════════════
        */}
        <span
          className={`absolute top-4 left-4 z-20 rounded-pill bg-deep/85 ${TAG} text-cream ring-1 ring-cream/25 backdrop-blur-[3px]`}
        >
          {event.space}
        </span>
      </div>

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
      {/*
        ══════════════════════════════════════════════════════════════════
        EL PLATE. TODO SE VE EN REPOSO, Y ANTES NO.

        ⚠️ ACÁ HABÍA UN MECANISMO DE INTERCAMBIO y se fue el 2026-09-15.
        Funcionaba así: el cajón medía 96px fijos, adentro había dos capas
        superpuestas —la bajada y la línea de CTA—, y el hover DESPLAZABA el
        plate 52px hacia abajo para que la bajada saliera de cuadro y el CTA
        entrara. De paso el fondo pasaba de `deeper` a `sunset` entero.

        Camila lo bajó con dos notas que son la misma: «el hover de estas
        cards es muy violento, el cambio es muy brusco» y «el cuerpo de la
        card no necesita achicarse en el status unhovered».

        El arreglo es el mismo para las dos: si el CTA se ve SIN hover, no hay
        nada que intercambiar. Se cae el cajón de alto fijo, se cae el
        desplazamiento, se caen los 52px calculados y se cae la capa en
        `opacity-0`. La tarjeta dice todo lo que tiene que decir desde el
        primer momento.

        ⚠️ Y ADEMÁS ARREGLA ALGO QUE NO ERA DE GUSTO: en un teléfono no hay
        hover, así que el CTA no aparecía NUNCA. Estaba en el árbol de
        accesibilidad —por eso el lector de pantalla lo anunciaba— pero quien
        miraba la tarjeta en un celular no veía a dónde llevaba.

        ⚠️ EL HOVER AHORA ES UN ACENTO, no una transformación. Cambia el color
        del CTA, corre la flecha y levanta la tarjeta un pelo. El fondo NO se
        pinta de naranja entero: eso era la mayor parte de lo que se sentía
        brusco.
        ══════════════════════════════════════════════════════════════════
      */}
      {/*
        ⚠️ EL PLATE ESTÁ EN EL FLUJO Y YA NO PEGADO AL PIE. Era
        `absolute inset-x-0 bottom-0` y por eso su alto —que cambia con los
        renglones del título y de la bajada— le comía a la foto por arriba.
        Ahora la ventana de la imagen manda y el plate ocupa lo que queda:
        `flex-1` para que llegue hasta abajo cuando la fila estira las
        tarjetas al alto de la más alta.
      */}
      <div className="relative z-10 flex flex-1 flex-col bg-deeper px-7 pt-6.5 pb-7">
        {/*
          El DÍA en `cream` y la HORA en una píldora sólida. Es la jerarquía
          que pidió Camila —«resaltar horario en cards events, pasa muy
          desapercibido el día y hora y es de lo más importante»— y se queda
          tal cual: la píldora es el único bloque de color macizo de la
          tarjeta en reposo, así que es lo primero que agarra el ojo.

          Ratios medidos: `cream` sobre `deeper` 11.87:1 y `deep` sobre
          `cream` 9.44:1.

          ⚠️ YA NO NECESITAN INVERTIRSE EN EL HOVER. Existía un juego de
          colores para cuando el plate se volvía naranja; sin esa vuelta, la
          píldora se queda en crema sobre verde, que es su mejor ratio.

          ══════════════════════════════════════════════════════════════════
          ⚠️ «TODAY» EN EL LUGAR DEL DÍA ES LO QUE QUEDA DEL TAG «TONIGHT».
          Cuando la píldora de arriba pasó a decir el espacio, la tarjeta se
          quedó sin ninguna marca de cuál de los cuatro eventos es el de hoy
          —y ese dato es la razón de ser de esta sección: la lista se reordena
          en el cliente justamente para poner el de hoy adelante—. Sin marca,
          reordenar no se nota.

          Ocupa el renglón del día porque es un día: reemplaza «WEDNESDAY», no
          se le suma, así que no entra ni un elemento nuevo ni una segunda
          píldora de color.

          ⚠️ DICE «TODAY» Y NO «TONIGHT», que es lo que decía el tag. El tag
          se dibujaba sobre el afiche y podía ser vago; acá está pegado al
          horario, y «TONIGHT · 12 PM – 8 PM» —el domingo de NFC North HQ— es
          directamente falso. «Today» es cierto a cualquier hora.
          ══════════════════════════════════════════════════════════════════
        */}
        <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
          <span className="font-body text-dato font-bold uppercase tracking-eyebrow text-cream">
            {isToday
              ? 'Today'
              : event.weekday !== null
                ? weekdayLabel(event.weekday)
                : whenLabel(event)}
          </span>
          <span className="rounded-pill bg-cream px-2.5 py-0.75 font-body text-caption font-bold whitespace-nowrap text-deep">
            {timeRange(event)}
          </span>
        </span>

        <h3 className="m-0 mt-3.5 font-display text-d4 font-bold uppercase leading-none text-paper">
          {event.title}
        </h3>

        {/*
          ══════════════════════════════════════════════════════════════════
          ⚠️ LA BAJADA OCUPA DOS RENGLONES SIEMPRE, diga lo que diga. El
          `line-clamp-2` pone el techo y el `min-h-[2lh]` pone el piso: una
          bajada de un renglón reserva el segundo igual. Pedido de Camila,
          2026-09-16: «contemplemos como si siempre mostrasen dos líneas de
          descripción».

          Sin el piso, «Bring the dog.» —un renglón— dejaba la tarjeta de
          Wooftop Wednesdays 24px más corta que las otras dos, y en una fila
          que estira eso salía como 24px MÁS de afiche. La ventana de la
          imagen ya lo resolvía por su lado; esto además alinea el CTA y el
          renglón del espacio entre tarjetas vecinas.

          ⚠️ `lh` ES LA UNIDAD CORRECTA ACÁ y no un `rem` calculado a mano: es
          el interlineado REAL de este párrafo, así que si mañana cambia
          `text-base` el piso lo sigue solo. Donde no exista, la propiedad se
          ignora y la tarjeta se comporta como antes: se degrada sola.
          ══════════════════════════════════════════════════════════════════
        */}
        <p className="m-0 mt-3 line-clamp-2 min-h-[2lh] font-body text-base font-light text-paper/92">
          {event.summary}
        </p>

        {/*
          ══════════════════════════════════════════════════════════════════
          ⚠️ EL CTA TIENE SU PROPIO RENGLÓN, Y COMPARTÍA EL ÚLTIMO CON EL
          ESPACIO. Pedido de Camila: «me gusta el cambio, pero no me gusta
          dónde está el CTA; quizá podría estar debajo, en otra línea».

          Compartir renglón lo ponía a la derecha, alineado a la derecha, en un
          bloque donde TODO LO DEMÁS arranca a la izquierda: el día, el título,
          la bajada y el espacio. Era el único elemento de la tarjeta que había
          que ir a buscar a otro lado, y además quedaba a 4px del borde
          derecho, que es donde la tarjeta se corta.

          Ahora los dos empiezan en el mismo eje.

          ⚠️ Y EL QUE COMPARTÍA EL RENGLÓN YA NO ESTÁ ACÁ: el rótulo del
          espacio se mudó a la píldora de arriba, sobre el afiche. Queda el
          CTA solo cerrando la tarjeta.

          ⚠️ `mt-auto` Y NO UN MARGEN FIJO. Es lo que empuja el CTA al pie del
          plate, así que en tres tarjetas vecinas los tres CTA caen a la misma
          altura aunque un título ocupe dos renglones y otro uno. El `pt-4.5`
          es el aire MÍNIMO contra la bajada, para cuando la tarjeta no estira
          y no hay sobrante que repartir.

          ⚠️ LLEVA EL FILETE DE 2px EN `sunset`, que es el mismo tratamiento
          que tienen los CTA de texto de `ThreeDoors` y de `FindUs`. Sin él, un
          CTA suelto a la izquierda y sin subrayado se lee como un tercer
          renglón de texto: el filete es lo que dice que se puede tocar.

          ⚠️ LA OPCIÓN DE PONERLO SOBRE EL AFICHE SE MIRÓ Y NO SE TOMÓ. Camila
          la propuso como alternativa —«o que aparezca sobre la imagen,
          oscureciéndola con un efecto»— y el problema es que los afiches son
          material del cliente con texto propio: los cuatro tienen el nombre
          del evento y la fecha impresos. Una capa oscura con un CTA encima
          taparía justo eso, y en dos de las cuatro el CTA caería sobre una
          cara. Queda anotado por si más adelante hay afiches con zona limpia.
          ══════════════════════════════════════════════════════════════════
        */}
        <span className="mt-auto inline-flex w-fit items-center gap-2.25 border-b-2 border-sunset pt-4.5 pb-0.75 font-body text-base font-semibold text-cream transition-colors duration-300 ease-brand group-hover:text-sunset">
          {cta}
          <ArrowRight className="size-4 shrink-0 transition-transform duration-300 ease-brand group-hover:translate-x-1" />
          {entradas ? <span className="sr-only">(opens in a new tab)</span> : null}
        </span>
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
  /*
   * ⚠️ SE FUE EL `aspect-[7/10]` Y ENTRÓ `flex flex-col`. La tarjeta tenía
   * proporción fija y sus dos piezas iban en absoluto adentro: la foto pegada
   * arriba y el plate pegado abajo, pisándose en el medio. Ahora las dos están
   * en el flujo, una arriba de la otra: la ventana de la imagen mide lo que
   * tiene que medir y el plate se estira con `flex-1`.
   *
   * ⚠️ EL ALTO AHORA LO DECIDE LA FILA, no esta clase. Las tarjetas son hijas
   * de un flex row sin `items-*`, o sea `stretch`: todas terminan con el alto
   * de la más alta, que es la que tiene el título más largo. Es exactamente lo
   * que se busca —parejas— y por eso no hace falta ni alto fijo ni proporción.
   */
  const clases =
    `group relative flex flex-col shrink-0 snap-start overflow-hidden rounded-shell bg-deeper sombra-card transition-[transform,opacity] duration-300 ease-brand hover:-translate-y-1.5 ${ANCHO} ${
      fuera ? 'pointer-events-none opacity-0' : ''
    }`;

  return entradas ? (
    <a href={entradas} target="_blank" rel="noopener noreferrer" className={clases} inert={fuera || undefined}>
      {contenido}
    </a>
  ) : (
    <Link href={href} className={clases} inert={fuera || undefined}>
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
function CalendarCard({
  fuera,
  musicaLarga,
}: {
  readonly fuera: boolean;
  readonly musicaLarga: string;
}) {
  return (
    <Link
      href="/whats-on"
      inert={fuera || undefined}
      className={`group flex shrink-0 snap-start flex-col justify-between gap-8 rounded-shell bg-sunset p-7 sombra-card text-ink transition-[background-color,opacity] duration-300 ease-brand hover:bg-sunset-hover lg:p-9 ${ANCHO} ${
        fuera ? 'pointer-events-none opacity-0' : ''
      }`}
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
          {musicaLarga}, Bingo on Wednesdays and DJ sets late on Saturdays. Almost
          all of it is free.
        </span>
      </span>

      <span className="grid size-13 place-items-center rounded-pill bg-ink text-sunset transition-transform duration-300 ease-brand group-hover:translate-x-1.5">
        <ArrowRight className="size-5" />
      </span>
    </Link>
  );
}

export default function WhatsOn({
  week,
  musicaLarga,
}: {
  readonly week: readonly VenueEvent[];
  readonly musicaLarga: string;
}) {
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

  /*
   * ══════════════════════════════════════════════════════════════════════
   * ⚠️ LAS TARJETAS QUE NO ENTRAN EN LA VENTANA SE APAGAN, Y ESO ES LO QUE
   * CIERRA EL PROBLEMA DE LA SOMBRA.
   *
   * Idea de Camila: «¿no podés hacer que las cards que no están visibles en el
   * carrusel estén con opacidad 0 o como ocultas? así no se ve la sombra».
   *
   * Cuatro intentos anteriores movieron el RECORTE buscando un lugar donde la
   * sombra de las visibles entrara y la de la siguiente no. No existe: la
   * sombra alcanza 32px y el gap mide 24, así que las dos ocupan el mismo
   * espacio. Con 0 de padding se corta la propia; con 24, entra la ajena.
   *
   * Apagando la tarjeta se apaga TAMBIÉN SU SOMBRA —es parte del mismo
   * elemento— y el conflicto desaparece: ya no hay nada de lo que viene
   * después que pueda asomar, así que el padding puede valer los 32px que la
   * sombra necesita y las visibles la muestran entera.
   *
   * ⚠️ SE MIDE EN CADA SCROLL Y NO SÓLO AL CRUZAR UN PUNTO DE ANCLAJE. El
   * índice sólo cambia en los saltos, así que durante un arrastre lento la
   * tarjeta entrante se quedaría invisible hasta el salto. Ver `medirDentro`.
   *
   * ⚠️ `pointer-events-none` + `inert` VAN CON EL `opacity-0`. Una tarjeta
   * invisible que igual recibe clics es una trampa, y `opacity: 0` NO saca del
   * orden de tabulación ni del árbol de accesibilidad: sin `inert`, tabular
   * por el carrusel pasaría por tres links que nadie ve. `aria-hidden` no
   * serviría —es una violación ponerlo sobre algo enfocable— y `inert` hace
   * las dos cosas de una vez.
   *
   * ⚠️ El teclado igual las alcanza: el track tiene `tabIndex={0}`, así que se
   * scrollea con las flechas y las tarjetas dejan de ser inert al entrar.
   *
   * ⚠️ MIENTRAS EL ARRAY ESTÉ VACÍO NO SE APAGA NADA. Es el primer pintado del
   * servidor, antes de que se haya podido medir: si el default fuera «apagada»,
   * el carrusel abriría en blanco y el HTML llegaría con las seis invisibles.
   * ══════════════════════════════════════════════════════════════════════
   */
  const [dentro, setDentro] = useState<readonly boolean[]>([]);

  /**
   * Recalcula qué tarjetas entran ENTERAS en la ventana del carrusel.
   *
   * ⚠️ MIDE GEOMETRÍA Y YA NO USA `IntersectionObserver`. El observer
   * funcionaba, pero tenía una forma de romperse que Camila encontró en
   * pantalla: «volviste a romper el carrusel este, habíamos quedado que sólo
   * se verían 3 cards y las demás se ocultarían con opacidad 0».
   *
   * La causa: el observer guardaba `[...track.children]` UNA VEZ, al montar, y
   * después traducía cada entrada a un índice con `cards.indexOf(e.target)`.
   * Ese array se queda viejo en cuanto los hijos cambian, y cambian en dos
   * momentos reales:
   *
   *   · cuando `today` se resuelve y la lista se REORDENA para poner el evento
   *     de hoy adelante — los nodos son los mismos pero la posición no, así que
   *     `dentro[i]` pasa a describir otra tarjeta;
   *   · en cada Fast Refresh mientras se trabaja, donde React reemplaza los
   *     nodos y el observer se queda mirando elementos que ya no están en el
   *     documento. Ahí `dentro` nunca se llena, `fuera` da `false` para todas y
   *     se ven las seis. Es exactamente lo que se ve en la captura.
   *
   * Midiendo no hay nada que se pueda desincronizar: se leen los hijos que hay
   * AHORA, se comparan contra el rectángulo del track y se devuelve un array
   * del largo correcto. No hay estado intermedio, no hay array capturado y no
   * hace falta volver a suscribir nada cuando la lista cambia.
   *
   * ⚠️ LOS 32px SON EL `px-8` DEL TRACK. El track se estira 32px más allá de la
   * caja de cada lado —ver la nota del `margin-inline` negativo— justamente para
   * que la sombra de las tarjetas no se recorte. Esos 32px NO son ventana: una
   * tarjeta que asoma ahí adentro está afuera. Si cambia el padding, cambia
   * este número.
   *
   * ⚠️ LA TOLERANCIA DE 1px ES POR LOS DPR FRACCIONALES de Windows (1,25 y
   * 1,5), que son la mitad del tráfico de escritorio de este sitio. Sin ella
   * una tarjeta perfectamente encuadrada mide 0,5px de más y se apaga sola.
   */
  const medirDentro = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const caja = track.getBoundingClientRect();
    const izq = caja.left + BORDE_TRACK - 1;
    const der = caja.right - BORDE_TRACK + 1;
    setDentro(
      [...track.children].map((hijo) => {
        const r = hijo.getBoundingClientRect();
        return r.left >= izq && r.right <= der;
      }),
    );
  }, []);

  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    /* El índice se topea en `maxIndex` por la misma razón que `scrollToCard`:
       al final del recorrido el scroll puede caer más allá del último punto de
       anclaje y dejar los puntos sin ninguno marcado. */
    setIndex(Math.min(maxIndexRef.current, Math.round(el.scrollLeft / step())));
    setCanPrev(el.scrollLeft > 1);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    medirDentro();
  }, [medirDentro]);

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
      className="banda-arco relative z-[2] bg-deep grano pt-14 pb-cierre-arco text-bone on-dark lg:pt-[110px]"
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

            ══════════════════════════════════════════════════════════════
            ⚠️ EL PADDING LATERAL ES EXACTAMENTE EL GAP (24px), Y ESE NÚMERO ES
            EL ÚNICO QUE CUMPLE LAS DOS COSAS A LA VEZ. Esto fue y volvió
            cuatro veces; conviene dejar las cuatro escritas.

              1 · Sin padding. El borde de recorte cae sobre el borde de la
                  primera y la última tarjeta y les corta la sombra al ras.
                  Camila: «la sombra sigue cortada a los laterales del frame».
              2 · Sangrado hasta el filo de la pantalla (56px). Entró la sombra
                  y entró también media tarjeta siguiente: «otra vez se ve la
                  4 card y cortada».
              3 · Sangrado con un degradé en los bordes. Descartado: «no pongas
                  degradé ni nada de eso».
              4 · Padding = gap. Acá.

            ⚠️ POR QUÉ 24 Y NO OTRO NÚMERO. La tarjeta siguiente arranca a un
            GAP de distancia del borde de la última visible. Si el padding vale
            lo mismo que el gap, el borde de recorte cae EXACTAMENTE sobre el
            borde de esa tarjeta: no asoma ni un píxel, y al mismo tiempo la
            sombra de las laterales tiene 24px de aire donde antes tenía cero.

            Un píxel más de padding y empieza a verse la tarjeta siguiente; uno
            menos y se vuelve a comer sombra. Es el único punto de equilibrio,
            y por eso los dos valores están atados: si cambia `gap-6`, cambia
            el padding con él.

            ⚠️ `sombra-card` PIDE 32px Y ACÁ TIENE 24, así que la cola más tenue
            se sigue cortando ocho píxeles. Es el resto que el layout no puede
            dar sin mostrar la tarjeta de al lado, y está aceptado: a esa
            distancia la sombra vale menos de un 10 % de su opacidad.

            ⚠️ EL MARGEN NEGATIVO VA COMO PROPIEDAD ARBITRARIA
            (`[margin-inline:-1.5rem]`) Y NO COMO `-mx-6`. Medido en el
            navegador, Tailwind no emite `-mx-*` en este proyecto —`-mt-2` y
            `-mb-5` sí salen, y de `-mx-6` no hay ninguna regla en el CSS—, así
            que la clase quedaba en el DOM sin hacer nada: el padding achicaba
            las tarjetas de 373 a 357px en vez de correr el borde de recorte.

            ⚠️ `scroll-px-6` VA CON EL `px-6`: sin él, `scrollLeft: 0` deja de
            ser un punto de anclaje válido y `snap-mandatory` abre el carrusel
            en la segunda tarjeta.

            ⚠️ SIGUEN VIÉNDOSE TRES TARJETAS. Eso lo decide `ANCHO`
            —`(100% - 48px) / 3` en `lg`—, no el recorte. El padding sólo mueve
            dónde se corta lo que no entra.
            ══════════════════════════════════════════════════════════════
          */
          className="[margin-inline:-2rem] -mt-2 -mb-5 flex snap-x snap-mandatory gap-6 overflow-x-auto px-8 pt-3.5 pb-13 scroll-px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {events.map((event, i) => (
            <EventCard
              key={event.slug}
              event={event}
              isToday={today !== null && event.weekday === today}
              fuera={dentro.length > 0 && !dentro[i]}
            />
          ))}

          {/* La última: el CTA al calendario. Ver `CalendarCard`. */}
          <CalendarCard musicaLarga={musicaLarga} fuera={dentro.length > 0 && !dentro[events.length]} />
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
        /*
          ⚠️ EL `gap` ES MÁS CHICO EN MOBILE Y LAS FLECHAS LLEVAN `shrink-0`.
          Camila: «ojo que esto en mobile debe ser redondo, no deformarse».

          La fila pide más ancho del que hay en un teléfono: dos flechas de
          52px, seis puntos de 44 y dos huecos de 20 son 408px contra los 342
          útiles de una pantalla de 390. Lo que sobra sale de donde el flex
          puede sacarlo, y por defecto puede sacarlo de todos: las flechas se
          achicaban a lo ancho y quedaban dos óvalos.

          `shrink-0` las deja redondas y manda la compresión a los puntos, que
          es donde no se ve: el punto es un `span` de 9px adentro de un botón
          de 44, así que el botón se angosta y el dibujo no se entera. Lo que
          se pierde es ancho de zona táctil, no forma.

          ⚠️ Y LA COMPRESIÓN NO PODÍA IR A LOS PUNTOS, que fue el primer
          intento: un `<div>` de puntos con ancho fijo tiene `min-width: auto`
          igual a su contenido, así que no cede un píxel y el sobrante sale por
          los costados de la fila. Camila lo vio en el acto: «pero mantené los
          márgenes».

          La cuenta hay que cerrarla de verdad, no repartirla. En mobile los
          puntos pasan a 36px de área —siguen arriba del mínimo de WCAG 2.5.8,
          que son 24— y el hueco de la fila baja a 12: 104 de flechas + 24 de
          huecos + 208 de puntos = 336, contra los 342 que deja el gutter.

          ⚠️ EL `flex-wrap` ES LA RED, no el mecanismo. Si algún día hay una
          tarjeta más, la fila se parte en dos renglones en vez de volver a
          romper el margen.
        */
        <div className="flex flex-wrap items-center justify-center gap-3 pt-6.5 sm:gap-5">
          {/*
            ⚠️ Las flechas se DESHABILITAN en los extremos en vez de quedar
            activas sin hacer nada. Un control que responde al hover, se
            aprieta y no pasa nada se lee como que el carrusel está roto;
            apagado se lee como que no hay más. `disabled` además lo saca del
            recorrido del tabulador y lo anuncia como no disponible.

            ══════════════════════════════════════════════════════════════
            ⚠️ VAN RELLENAS DE CREMA Y ANTES ERAN UN ARO DE 1px. Camila:
            «también están mal las flechas del carrusel, no puedo navegarlo».

            El aro no distinguía el estado activo del apagado. Habilitada era
            un círculo de `muted-dark` a 1px con la flecha en `bone`;
            deshabilitada, el mismo círculo al 30 % de opacidad. Sobre la losa
            verde esos dos dibujos se parecen demasiado, así que la flecha
            buena parecía apagada y nadie la aprieta.

            Ahora el estado es un CAMBIO DE MATERIAL y no de opacidad: activa
            es un disco macizo de crema con la flecha en `deep` —9,44:1, el
            mismo par que el botón `onDark` del sistema—, y apagada vuelve a
            ser el aro vacío. Lleno contra vacío se distingue de lejos.
            ══════════════════════════════════════════════════════════════
          */}
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            className="grid size-13 shrink-0 place-items-center rounded-pill bg-cream text-deep transition-all duration-300 ease-brand hover:bg-paper active:scale-95 disabled:pointer-events-none disabled:bg-transparent disabled:text-muted-dark disabled:ring-1 disabled:ring-muted-dark/50"
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

                  ⚠️ EN MOBILE EL ÁREA BAJA A 36px, y es la única medida donde
                  la cuenta no cerraba: a 390 el gutter deja 342 y la fila
                  pedía 384. Sigue arriba del mínimo de WCAG 2.5.8. Ver la nota
                  de la fila de controles.
                */
                className="group -mx-1 grid size-9 place-items-center rounded-pill sm:size-11"
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
            className="grid size-13 shrink-0 place-items-center rounded-pill bg-cream text-deep transition-all duration-300 ease-brand hover:bg-paper active:scale-95 disabled:pointer-events-none disabled:bg-transparent disabled:text-muted-dark disabled:ring-1 disabled:ring-muted-dark/50"
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
      </div>
    </section>
  );
}
