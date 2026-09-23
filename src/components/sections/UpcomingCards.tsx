import Link from 'next/link';
import { EventDialogProvider, VerMas } from '@/components/sections/EventDialogProvider';
import { EventPhoto, EventWhen, SpacePill } from '@/components/shared/EventCardParts';
import {
  cuerpoSinPrecios,
  dealsNombrados,
  type FeaturedDeal,
} from '@/components/shared/FeaturedEventCard';
import { ArrowSquareOut } from '@/components/shared/Icon';
import { isTicketed } from '@/content/events';
import type { Occurrence } from '@/lib/calendar';
import { eventDot, eventTypeLabel } from '@/lib/event-color';

/**
 * ══════════════════════════════════════════════════════════════════════════
 * LO QUE VIENE, EN TARJETAS CON AFICHE.
 *
 * ⚠️ REEMPLAZA A LA VISTA «LIST» DE `/whats-on`, que era lo primero que veía
 * quien entraba al calendario: días apilados, todo texto, sin una sola imagen,
 * aunque los eventos de la base traen afiche en `bannerUrl` desde el
 * 2026-09-11. Camila, 2026-09-17: «quiero que el calendario sea más visual, no
 * en una lista como tenemos ahora, necesito que sea más fácil de visualizar».
 *
 * ⚠️ ES LA VISTA «GRID» DEL MES, Y ANTES ERA «LOS PRÓXIMOS 15 DÍAS». Camila,
 * 2026-09-21: «en grid no mostraremos solo los próximos 15 días, mostraremos
 * todos los próximos y repetiremos los eventos cada día que corresponda; solo
 * separaremos por mes». Quién arma la lista es `upcomingInMonth()`; acá sólo
 * se dibuja.
 *
 * ⚠️ UNA TARJETA POR FECHA, Y ANTES ERA UNA POR EVENTO. Si Ross Brown toca
 * cuatro jueves, salen cuatro tarjetas. Es lo contrario de lo que decidimos el
 * 2026-09-17 —«la misma foto grande repetida dos veces se lee como un error de
 * carga»— y el cambio es deliberado: con la placa de fecha en cada tarjeta y un
 * solo mes por pantalla, la repetición se lee como agenda. Lo que la hace
 * legible es la placa, así que no se saca.
 *
 * ⚠️ CON ESO SE FUE EL RENGLÓN «ALSO ON», y no se perdió el dato: dentro del
 * mes cada repetición ES una tarjeta. Las del mes siguiente se ven cambiando de
 * mes en la barra. Ver `MonthBar`.
 *
 * ⚠️ LA OTRA VISTA ES LA GRILLA DEL CALENDARIO, y ahora son dos vistas y no dos
 * bloques apilados. Contestan preguntas distintas —«¿qué puedo hacer?» contra
 * «¿qué hay el 28?»— y la barra fija deja pasar de una a la otra sin perder el
 * mes ni el filtro.
 *
 * ⚠️ LA TARJETA ENTERA NO ES UN LINK, y es a propósito. La regla del
 * calendario es que algo sea clickeable SÓLO si hay entrada que comprar, y en
 * ese caso el destino es Eventbrite. Con la tarjeta entera envolviendo al
 * botón «Get tickets» habría un `<a>` adentro de otro `<a>`, que es HTML
 * inválido y que los lectores de pantalla anuncian como un solo link roto. El
 * link es el botón.
 * ══════════════════════════════════════════════════════════════════════════
 */
export default function UpcomingCards({
  items,
  today,
  deals,
  dealsLabel,
}: {
  readonly items: readonly Occurrence[];
  /**
   * Hoy en el huso del venue, para que la tarjeta de hoy diga «Today» en vez de
   * su fecha, igual que en el carrusel de la home.
   *
   * ⚠️ VIENE POR PROP Y NO SE CALCULA ACÁ. Ver `todayInVenue()`: el servidor de
   * Vercel corre en UTC, así que a las 9 de la noche en Bonita Springs un
   * `new Date()` de acá ya diría mañana y «Today» aparecería en la tarjeta
   * equivocada. La página lo resuelve una vez y lo reparte.
   */
  readonly today: string;
  /**
   * Las promos con precio que puede llegar a publicar una tarjeta.
   *
   * ⚠️ LLEGAN POR PROP Y SE FILTRAN CONTRA EL TEXTO DE CADA EVENTO, igual que
   * en `FeaturedEventCard` y por el mismo motivo: son de UN evento —los
   * domingos de fútbol— y la lista de acá tiene veinte. La tarjeta que no
   * nombre esos precios en su descripción no dibuja nada.
   */
  readonly deals?: readonly FeaturedDeal[];
  /** El rótulo de la plancha de precios. Va arriba de la lista. */
  readonly dealsLabel?: string;
  /*
   * ⚠️ ACÁ HUBO UNA PROP `featuredSlug` Y DURÓ UNA TARDE. El 2026-09-21 la
   * tarjeta del evento con el tag `featured` salía al doble de ancho y con
   * filete naranja; Camila, el mismo día: «mejor no la destaquemos, que sea
   * igual que las demás».
   *
   * ⚠️ CON ESTO, EL TAG `featured` DEL DASHBOARD YA NO MUEVE NADA EN EL SITIO.
   * `featuredEvent()` sigue existiendo en `content/events.ts` y
   * `sections/FeaturedEvent` sigue en el árbol, sin usar. Vale saberlo antes de
   * decirle al cliente que marque un evento como destacado: hoy no se nota.
   */
}) {
  return (
    /*
      ══════════════════════════════════════════════════════════════════════
      ⚠️ CADA FILA SE EMPAREJA SOLA, Y NINGUNA FILA MIDE LO QUE MIDE OTRA. Es
      el comportamiento por defecto de una grilla —la celda se estira al alto
      de su fila— y lo único que hubo que hacer fue sacarle `auto-rows-fr`.

      Esa clase era el problema que Camila marcó en amarillo el 2026-09-21: «no
      debería suceder que queden tan largas o con tanto espacio, que abracen el
      contenido». `auto-rows-fr` no empareja cada fila con la suya, empareja
      TODAS las filas entre sí, así que la fila más alta de la grilla —siempre
      la del destacado, que mide el doble de ancho— le imponía su alto a las
      tarjetas de todas las demás, y quedaban con medio cuerpo vacío abajo.

      ⚠️ Y EMPAREJAR POR FILA ES LO QUE SE PIDIÓ DESPUÉS, mirando desktop y
      tablet: «deben ajustarse al alto de su card compañera de fila». En una
      sola columna esto no hace nada, porque cada fila tiene una sola tarjeta:
      en mobile las tarjetas siguen midiendo lo que miden.
      ══════════════════════════════════════════════════════════════════════
    */
    <EventDialogProvider>
    <ul className="mt-[28px] grid list-none grid-cols-1 gap-[12px] p-0 sm:grid-cols-2 sm:gap-[20px] lg:grid-cols-3">
      {/*
        ⚠️ LA KEY LLEVA LA FECHA Y NO SÓLO EL SLUG. Desde que la lista es de
        ocurrencias, el mismo evento aparece varias veces en el mismo mes: con
        `key={slug}` React ve cuatro hermanos con la misma key y en desarrollo
        avisa, pero en producción lo que hace es peor —reusa el nodo equivocado
        al cambiar de mes y la placa de fecha queda pegada de la tarjeta vieja—.
      */}
      {items.map((item) => (
        <li key={`${item.event.slug}-${item.date}`}>
          <UpcomingCard item={item} today={today} deals={deals} dealsLabel={dealsLabel} />
        </li>
      ))}
    </ul>
    </EventDialogProvider>
  );
}

/**
 * ══════════════════════════════════════════════════════════════════════════
 * UN RENGLÓN QUE EMPIEZA CON UN PRECIO ES UNA PROMO, NO UN PÁRRAFO.
 *
 * Camila, 2026-09-21: «mantengamos la forma de mostrar los ítems de los precios
 * en promo, y fijate que las cards que tengan promos así los muestren de la
 * misma forma».
 *
 * ⚠️ HABÍA DOS CLASES DE PRECIO EN LA MISMA GRILLA Y SE VEÍAN DISTINTO. Los de
 * los domingos de fútbol salen de `content/game-day.ts` —una lista curada, con
 * nombre y explicación— y ya se publicaban como viñetas. Los del happy hour, en
 * cambio, vienen escritos por el cliente como un renglón por oferta dentro de
 * la descripción del evento, así que la tarjeta los publicaba como tres
 * párrafos sueltos. Mismo dato, dos formas.
 *
 * ⚠️ ES EL MISMO PATRÓN QUE YA USA `content/happy-hour.ts` para armar su bloque
 * de precios: precio al principio del renglón, con «off» opcional, y el resto
 * es lo que se lleva. Está repetido a propósito y no importado: allá la regla
 * describe CÓMO SE CARGA el happy hour, acá describe CÓMO SE LEE cualquier
 * evento. El día que el cliente escriba así los precios de otra noche, esta
 * tarjeta ya sabe mostrarlos.
 *
 * ⚠️ Y POR ESO NO HAY QUE TOCAR NADA CUANDO APAREZCA OTRO. Una tarjeta con
 * renglones de precio los muestra en viñetas; una sin ellos no dibuja la lista.
 * ══════════════════════════════════════════════════════════════════════════
 */
const RENGLON_PRECIO = /^(\$\d+(?:\.\d{1,2})?(?:\s+off)?)\s+(.+)$/i;

/** Un renglón que arranca numerado: «1. Lo que sea» o «1) Lo que sea». */
const RENGLON_PASO = /^\d+[.)]\s+(.+)$/;

/**
 * Un pedazo del cuerpo ya interpretado: un párrafo o una tanda de pasos.
 *
 * ⚠️ SON BLOQUES EN ORDEN Y NO DOS LISTAS SEPARADAS, y eso importa: con los
 * pasos agrupados aparte, el renglón que el cliente escribió DESPUÉS de los
 * pasos —«lo que damos cambia semana a semana»— se dibujaba antes que ellos. El
 * orden del texto es del cliente y la tarjeta no lo reordena.
 */
type BloqueCuerpo =
  | { readonly tipo: 'parrafo'; readonly texto: string }
  | { readonly tipo: 'pasos'; readonly items: readonly string[] };

function preciosDelCuerpo(parrafos: readonly string[]): {
  readonly bloques: readonly BloqueCuerpo[];
  readonly promos: readonly FeaturedDeal[];
} {
  const bloques: BloqueCuerpo[] = [];
  const promos: FeaturedDeal[] = [];

  /** Los pasos seguidos se juntan en una sola lista; un párrafo la cierra. */
  const empujarPaso = (item: string) => {
    const ultimo = bloques[bloques.length - 1];
    if (ultimo && ultimo.tipo === 'pasos') {
      bloques[bloques.length - 1] = { tipo: 'pasos', items: [...ultimo.items, item] };
      return;
    }
    bloques.push({ tipo: 'pasos', items: [item] });
  };

  for (const parrafo of parrafos) {
    /*
      Se parte por salto de línea porque el editor del dashboard guarda cada
      bloque con UN salto: lo que allá son tres renglones, acá puede llegar como
      un solo párrafo con dos saltos adentro.
    */
    for (const renglon of parrafo
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)) {
      const m = RENGLON_PRECIO.exec(renglon);
      /*
        Mayúscula inicial, como hace el bloque de precios de `/sunset-bar` con
        los mismos renglones: el cliente escribe «drafts, bottles and cans» y
        acá el texto arranca la viñeta. No se toca nada más de lo que escribió.
      */
      if (m) {
        promos.push({ price: m[1], name: m[2].charAt(0).toUpperCase() + m[2].slice(1), how: '' });
        continue;
      }

      /*
        ⚠️ UN RENGLÓN QUE EMPIEZA CON «1.» ES UN PASO. Camila, 2026-09-21, sobre
        el sorteo de los domingos: «quiero que ese evento tenga su descripción
        más corta, más sencilla, quizá en items tipo pasos uno a uno».

        La descripción se reescribió en el dashboard como cuatro renglones
        numerados, y esto es lo que los publica como una lista ordenada en vez
        de como cuatro párrafos que arrancan con un número suelto. El número se
        SACA del texto y lo vuelve a poner la lista, así que no se ve dos veces.

        ⚠️ ES LA MISMA IDEA QUE LOS PRECIOS: la forma la decide cómo escribe el
        cliente, no una prop ni una lista curada. El día que otro evento se
        escriba en pasos, sale en pasos.
      */
      const paso = RENGLON_PASO.exec(renglon);
      if (paso) empujarPaso(paso[1]);
      else bloques.push({ tipo: 'parrafo', texto: renglon });
    }
  }

  return { bloques, promos };
}

function UpcomingCard({
  item,
  today,
  deals,
  dealsLabel,
}: {
  readonly item: Occurrence;
  readonly today: string;
  readonly deals?: readonly FeaturedDeal[];
  readonly dealsLabel?: string;
}) {
  const { event, date } = item;
  const tipo = eventTypeLabel(event);

  /*
    ══════════════════════════════════════════════════════════════════════════
    ⚠️ LA TARJETA PUBLICA EL CUERPO ENTERO Y NO LA BAJADA DE UNA LÍNEA. Camila,
    2026-09-21, sobre la tarjeta de NFC North HQ: «¿por qué esta card no muestra
    la info de los descuentos o promo en tragos? debe mostrar toda la info».

    Tenía razón y el recorte era doble. Uno: `event.summary` es la PRIMERA
    ORACIÓN del primer párrafo —lo arma `content/events.ts`—, así que de un
    evento de tres párrafos se publicaba un renglón. Dos: los precios de ese
    evento viven en un párrafo aparte de la descripción, o sea justo en lo que
    el recorte tiraba.

    Ahora se publica `body` completo, menos el párrafo que enumera los precios,
    que sale en su propia plancha acá abajo. Es el mismo criterio que ya usa la
    card grande: la prosa es la peor versión de una lista de precios.

    ⚠️ `cuerpoSinPrecios` CAE EN `summary` si el evento no trae cuerpo, así que
    ninguna tarjeta se queda sin texto.
    ══════════════════════════════════════════════════════════════════════════
  */
  const curadas = dealsNombrados(event, deals);
  const { bloques, promos: escritas } = preciosDelCuerpo(cuerpoSinPrecios(event, curadas));
  /*
    Las curadas primero: traen nombre y explicación, así que son la lectura más
    completa. Las escritas por el cliente van detrás, con el mismo dibujo.
  */
  const promos = [...curadas, ...escritas];

  /*
    ══════════════════════════════════════════════════════════════════════════
    ⚠️ EN MOBILE LA TARJETA ES COMPACTA, desde el 2026-09-23. Camila marcó la
    de «Game day at the trucks» como la medida: foto al costado, fecha, hora,
    título y DOS renglones de descripción con puntos suspensivos. Lo que no
    entra —el resto del cuerpo, los pasos, las promos— se lee en el pop-up que
    abre «See more». Con dieciséis eventos, la grilla pasó de 5.670px a unos
    2.700 en un teléfono.

    ⚠️ `hayMas` DECIDE SI APARECE EL LINK, y es una cuenta a propósito
    aproximada: un párrafo de más de 60 caracteres ya no entra en dos renglones
    de la columna de texto a 390. Si la tarjeta muestra todo lo que tiene, no
    hay link que prometa más.

    Desde `sm` no cambia nada: vuelve la tarjeta completa de siempre.
    ══════════════════════════════════════════════════════════════════════════
  */
  const primero = bloques[0];
  const hayMas =
    bloques.length > 1 ||
    promos.length > 0 ||
    (primero !== undefined && (primero.tipo === 'pasos' || primero.texto.length > 60));

  return (
    /*
      ⚠️ `grano` NO ES DECORACIÓN ACÁ. La tarjeta es `bg-paper` sobre una
      sección `paper`: se pinta del color de su propia superficie y lo único
      que la delimita es el borde. Sin el grano queda como un parche liso
      recortado encima del fondo texturado, que es justo lo que `check:grano`
      detecta. Ver la regla en `scripts/check-grano.mjs`.
    */
    <article className="grano relative grid h-full grid-cols-[112px_minmax(0,1fr)] overflow-hidden rounded-card sm:flex sm:flex-col border border-ink/12 bg-paper transition-colors hover:border-ink/30">
      {/*
        ══════════════════════════════════════════════════════════════════
        EL AFICHE, CON LAS DOS PÍLDORAS ENCIMA.

        ⚠️ LA VENTANA YA NO ESTÁ ESCRITA ACÁ: SALE DE `EventPhoto`, que es la
        misma que usa el carrusel de la home. Camila, 2026-09-21: «las cards de
        la grilla deberían ser iguales o similares a las de la home, casi que
        hermanas o derivadas del mismo componente». Estaba copiada entre los dos
        archivos, con el costo clásico: la ventana se arregló dos veces y el
        segundo arreglo no era igual al primero. El porqué de la proporción está
        en `shared/EventCardParts.tsx`.

        ⚠️ EL ESPACIO PASÓ A SER UNA PÍLDORA SOBRE LA FOTO, y vivía abajo como
        letra chica al lado del horario. Es el mismo movimiento que Camila pidió
        en la home el 2026-09-16 —«pongamos allí The Yard, Sunset Bar o la zona
        que corresponda»— y gana por lo mismo: arriba se lee antes que el
        título, que es como funciona —primero dónde, después qué—.

        ⚠️ EL TIPO SE MUDÓ A LA SEGUNDA PÍLDORA y era un renglón propio con el
        punto de color encima del título. En la anatomía de la home ese lugar lo
        ocupa la fecha, así que el tipo habría quedado como un segundo rótulo
        peleando con ella. Arriba, al otro lado de la foto, dice lo mismo sin
        gastar un renglón.

        ⚠️ Y EL PUNTO DE COLOR SE QUEDA DENTRO DE LA PÍLDORA. Es el mismo código
        que la grilla del mes y su referencia: si acá el tipo se dijera sólo con
        palabras, la página tendría dos lenguajes para el mismo dato.
        ══════════════════════════════════════════════════════════════════
      */}
      <EventPhoto
        event={event}
        sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 112px"
        brief={`Afiche de ${event.title} en ${event.space}.`}
        fondo="bg-bone"
        ventana="max-sm:aspect-auto max-sm:h-full max-sm:min-h-28"
      >
        {/* En la columna de 112px de mobile las píldoras no entran: el
            espacio y el tipo se leen en el pop-up. */}
        <span className="max-sm:hidden">
          <SpacePill>{event.space}</SpacePill>
          {tipo ? (
            <SpacePill lado="der">
              <span className={`size-[8px] shrink-0 rounded-pill ${eventDot(event)}`} aria-hidden="true" />
              {tipo}
            </SpacePill>
          ) : null}
        </span>
      </EventPhoto>

      <div className="flex min-w-0 grow flex-col p-[14px] sm:p-[18px] lg:p-[20px]">
        {/*
          ⚠️ ACÁ ARRIBA HABÍA UNA PLACA DE FECHA APILADA sobre la esquina de la
          foto —«THU / 30 / OCT» en tres renglones— y se fue el 2026-09-21 con
          la unificación. El dato no se perdió: lo dice este renglón, que es el
          de la home, y encima ahora la hora va en píldora maciza, que era
          justamente lo que Camila pedía destacar —«resaltar horario en cards
          events, pasa muy desapercibido el día y hora»— y que la placa no
          hacía: la placa gritaba el día y dejaba la hora en letra chica.
        */}
        <EventWhen event={event} date={date} isToday={date === today} />

        <h3 className="mt-2 font-display text-d6 font-semibold uppercase leading-[1.05] text-ink sm:mt-3.5 sm:text-d5 lg:text-d4">
          {event.title}
        </h3>

        {/*
          ⚠️ EL CUERPO SE DIBUJA EN EL ORDEN EN QUE EL CLIENTE LO ESCRIBIÓ, y
          por eso es un solo recorrido y no un párrafo acá y una lista allá: un
          renglón después de los pasos tiene que salir después de los pasos.

          ⚠️ LOS PASOS VAN NUMERADOS Y EN VERDE, no en viñetas naranjas como los
          precios: son dos listas distintas que pueden convivir en la misma
          tarjeta y tienen que poder distinguirse. El precio es un dato suelto;
          el paso es una secuencia, y el número es lo que la ordena.

          ⚠️ ES UN `<ol>` DE VERDAD, con `list-none` y el número dibujado a mano.
          El marcador nativo no se puede alinear ni colorear sin pelearse con el
          navegador, y acá el número es parte del dibujo: verde, en negrita y con
          ancho fijo para que los renglones largos sangren parejos.
        */}
        <div className="mt-[8px] flex flex-col gap-[8px] text-[16px] leading-[1.55] text-body/80">
          {bloques.map((b, i) =>
            b.tipo === 'parrafo' ? (
              <p
                key={b.texto}
                className={i === 0 ? 'max-sm:line-clamp-2 max-sm:text-[15px] max-sm:leading-[1.5]' : 'max-sm:hidden'}
              >
                {b.texto}
              </p>
            ) : (
              <ol key={b.items[0]} className="m-0 flex list-none flex-col gap-[6px] p-0 max-sm:hidden">
                {b.items.map((paso, i) => (
                  <li key={paso} className="flex gap-[8px] text-[15px] leading-[1.5]">
                    <span className="w-[1.2em] shrink-0 font-bold tabular-nums text-deep">
                      {i + 1}.
                    </span>
                    <span>{paso}</span>
                  </li>
                ))}
              </ol>
            ),
          )}
        </div>

        {/*
          ══════════════════════════════════════════════════════════════════
          LAS PROMOS, EN UNA LISTA DE VIÑETAS.

          ⚠️ ERA UNA PLANCHA CON EL NÚMERO EN DISPLAY —la lectura de la card
          grande, en chico— Y OCUPABA MEDIA TARJETA. Camila, 2026-09-21:
          «cambiá la forma de mostrar la sección de tal forma que ocupe menos
          espacio y se lea mejor, puede ser en modo de listado con bullets y ya,
          algo simple».

          Y es correcto por jerarquía: acá los precios son un DATO más de la
          tarjeta, no el argumento de la página. El número en 22px sobre su
          propio fondo competía con el título del evento, que es lo que la
          tarjeta tiene que vender. En una línea por promo entran las tres en el
          alto que antes ocupaba una.

          ⚠️ EL PRECIO Y EL NOMBRE VAN JUNTOS EN NEGRITA Y EL RESTO EN CUERPO:
          un renglón que se escanea de un golpe —«$3 2 Minute Drill»— y la
          explicación detrás, que se lee sólo si interesa.

          ⚠️ LA VIÑETA ES `sunset-deep` Y NO `sunset`. Sobre claro, el naranja
          de marca da 2.35:1 y es lo único que la ley del color del repo prohíbe
          sin excepción. La plancha oscura de `/sunset-bar` sí puede usarlo.

          ⚠️ SE APAGA SOLA. Sin `deals`, o con un evento que no nombre esos
          precios, `promos` queda vacío y no se dibuja nada: las otras veinte
          tarjetas del calendario no se enteran de que esto existe.
          ══════════════════════════════════════════════════════════════════
        */}
        {promos.length > 0 ? (
          <div className="max-sm:hidden">
            {/*
              ⚠️ EL RÓTULO ES DE LAS PROMOS CURADAS Y SÓLO DE ELLAS. «Game day
              at the bar» es la frase que el cliente le puso a las tres del
              fútbol, no un título genérico de lista de precios: encima de los
              tres del happy hour decía que el happy hour es un día de partido,
              que es falso. Con precios escritos en la descripción, la lista va
              sin rótulo: el título de la tarjeta ya dice de qué noche son.
            */}
            {dealsLabel && curadas.length > 0 ? (
              <p className="mt-[14px] text-caption font-bold uppercase tracking-[0.1em] text-deep">
                {dealsLabel}
              </p>
            ) : null}
            <ul className="m-0 mt-[8px] flex list-none flex-col gap-[6px] p-0">
              {promos.map((d) => (
                <li key={d.price} className="flex gap-[8px] text-[15px] leading-[1.5] text-body/80">
                  <span
                    aria-hidden="true"
                    className="mt-[8px] size-[5px] shrink-0 rounded-pill bg-sunset-deep"
                  />
                  <span>
                    <strong className="font-bold text-ink">
                      {d.price} {d.name}
                    </strong>
                    {/* El punto medio separa el nombre de la explicación, así
                        que sin explicación no hay nada que separar: los precios
                        que el cliente escribe como renglón no la traen. */}
                    {d.how ? <> · {d.how}</> : null}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* En mobile toda la tarjeta abre el pop-up; el link se VE sólo si hay
            algo más que leer. Ver `VerMas`. Desde `sm` no existe. */}
        <VerMas event={event} date={date} visible={hayMas} className={hayMas ? 'mt-[10px] sm:hidden' : 'sm:hidden'} />

        {/*
          ══════════════════════════════════════════════════════════════════
          EL PIE DE LA TARJETA: EL CTA, PEGADO ABAJO.

          ⚠️ ACÁ ARRIBA VIVÍA EL RENGLÓN «ALSO ON <fechas>» y se fue el
          2026-09-21, junto con `nextByEvent()`. Existía porque la lista mostraba
          cada evento UNA vez en una ventana de quince días y había que avisar
          que se repetía; ahora la lista es el mes entero con una tarjeta por
          fecha, así que la repetición no se anuncia: se ve.

          ⚠️ EL `mt-auto` SE QUEDA Y SIGUE SIENDO OBLIGATORIO. Camila,
          2026-09-21, con una línea cruzando las tres tarjetas de una fila: «haz
          que esto esté siempre abajo alineado». Empuja el pie al fondo de SU
          tarjeta; que ese fondo sea el mismo para las tres lo hace la grilla,
          que empareja por fila. Las dos cosas van juntas: si alguna vez se
          vuelve a `items-start`, esto deja de alinear.

          ⚠️ EL BLOQUE NO SE DIBUJA VACÍO. Sin entrada que comprar no hay pie, y
          el `pt` no deja un colchón al final de la tarjeta.
          ══════════════════════════════════════════════════════════════════
        */}
        {isTicketed(event) && event.ticketUrl ? (
          <p className="relative z-10 m-0 mt-auto pt-[14px]">
            <Link
              href={event.ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-[7px] rounded-pill bg-sunset px-[16px] py-[8px] text-caption font-bold uppercase tracking-[0.1em] text-ink transition-colors hover:bg-sunset-hover"
            >
              Get tickets
              <ArrowSquareOut className="size-[14px] shrink-0" aria-hidden="true" />
              <span className="sr-only">for {event.title} on Eventbrite (opens in a new tab)</span>
            </Link>
          </p>
        ) : null}
      </div>
    </article>
  );
}
