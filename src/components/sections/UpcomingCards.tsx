import Image from 'next/image';
import {
  cuerpoSinPrecios,
  dealsNombrados,
  type FeaturedDeal,
} from '@/components/shared/FeaturedEventCard';
import { ArrowSquareOut } from '@/components/shared/Icon';
import { PhotoPending } from '@/components/shared/PendingData';
import { isTicketed, timeRange } from '@/content/events';
import { dayNumber, monthDay, monthShort, weekdayShort, type NextUp } from '@/lib/calendar';
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
 * ⚠️ ARRIBA VAN LAS CARAS Y ABAJO EL MAPA. Este bloque contesta «¿qué puedo
 * hacer estos días?» y la grilla del mes contesta «¿qué hay el 28?». Son dos
 * preguntas distintas y por eso son dos bloques y no dos pestañas: el
 * conmutador `List | Month` obligaba a elegir una y esconder la otra.
 *
 * ⚠️ UN EVENTO, UNA TARJETA. Quién decide eso es `nextByEvent()`, no este
 * componente; acá sólo se publica `alsoOn`. El porqué está en su nota.
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
  deals,
  dealsLabel,
}: {
  readonly items: readonly NextUp[];
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
    <ul className="mt-[28px] grid list-none grid-cols-1 gap-[20px] p-0 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.event.slug}>
          <UpcomingCard item={item} deals={deals} dealsLabel={dealsLabel} />
        </li>
      ))}
    </ul>
  );
}

/**
 * Las otras fechas, escritas como las escribiría una persona.
 *
 * ⚠️ NO ES UN `join(' and ')`. Con eso, el happy hour del fin de semana
 * publicaba «Also on Sun, Sep 20 and Sat, Sep 26 and Sun, Sep 27»: tres «and»
 * seguidos y el renglón más largo de la tarjeta. Van comas y un solo «and»
 * antes de la última.
 *
 * ⚠️ Y SIN EL DÍA DE LA SEMANA. `shortDate()` devuelve «Sun, Sep 20», y su
 * coma choca con las comas del enumerado: «Sun, Sep 20, Sat, Sep 26» son
 * cuatro fechas a simple vista. La fecha de arriba, la de la placa, ya dice
 * qué día de la semana es; acá alcanza con el número.
 *
 * ⚠️ TRES Y EL RESTO CONTADO. Un evento diario llenaría el renglón con catorce
 * fechas. Tres se leen; a la cuarta ya nadie las cuenta, y decir cuántas
 * quedan es más honesto que cortar la lista y no avisar.
 */
function repeticiones(fechas: readonly string[]): string {
  const partes: string[] = fechas.slice(0, 3).map(monthDay);
  const resto = fechas.length - partes.length;
  if (resto > 0) partes.push(`${resto} more ${resto === 1 ? 'date' : 'dates'}`);

  if (partes.length === 1) return partes[0];
  return `${partes.slice(0, -1).join(', ')} and ${partes[partes.length - 1]}`;
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
  deals,
  dealsLabel,
}: {
  readonly item: NextUp;
  readonly deals?: readonly FeaturedDeal[];
  readonly dealsLabel?: string;
}) {
  const { event, date, alsoOn } = item;
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

  return (
    /*
      ⚠️ `grano` NO ES DECORACIÓN ACÁ. La tarjeta es `bg-paper` sobre una
      sección `paper`: se pinta del color de su propia superficie y lo único
      que la delimita es el borde. Sin el grano queda como un parche liso
      recortado encima del fondo texturado, que es justo lo que `check:grano`
      detecta. Ver la regla en `scripts/check-grano.mjs`.
    */
    <article className="grano flex h-full flex-col overflow-hidden rounded-card border border-ink/12 bg-paper transition-colors hover:border-ink/30">
      {/*
        ══════════════════════════════════════════════════════════════════
        EL AFICHE.

        ⚠️ VENTANA 7:5 CON CAJA DE RECORTE 4:5, igual que en la tarjeta del
        carrusel de la home (`WhatsOn.tsx`), y por el mismo motivo que está
        anotado allá: los afiches llegan en 1920×1080 con el arte vertical
        pegado en el medio, así que una caja vertical anclada arriba es la
        única que los devuelve enteros. Poner la foto directo en la ventana
        con `object-cover` recorta por los costados y parte los títulos.
        ══════════════════════════════════════════════════════════════════
      */}
      <div className="relative aspect-[7/5] w-full shrink-0 overflow-hidden bg-bone">
        <div className="absolute inset-x-0 top-0 aspect-[4/5] overflow-hidden">
          {event.image === null ? (
            <PhotoPending
              brief={`Afiche de ${event.title} en ${event.space}.`}
              ratio=""
              className="absolute inset-0 h-full rounded-none border-0 border-dashed pb-[42%]"
            />
          ) : (
            <Image
              src={event.image}
              alt={event.imageAlt ?? ''}
              fill
              sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          )}
        </div>

        {/*
          LA PLACA DE FECHA.

          ⚠️ LLEVA EL MES, no sólo el día. La ventana son 15 días corridos, así
          que una de cada dos semanas cruza el fin de mes y «THU 2» sin el mes
          es una fecha que hay que adivinar. Ver `weekdayShort` y `monthShort`.
        */}
        {/* ⚠️ `shadow-btn`, el token del sistema, y no una sombra a mano: es
            una placa chica sobre una foto y ésa es la escala que le toca. Ver
            `--shadow-btn` en `globals.css`. */}
        <p className="absolute top-[12px] right-[12px] z-10 flex flex-col items-center rounded-btn bg-paper px-[12px] py-[8px] text-center leading-none shadow-btn">
          <span className="eyebrow text-body/70">{weekdayShort(date)}</span>
          <span className="my-[3px] font-display text-d4 font-semibold tabular-nums text-ink">
            {dayNumber(date)}
          </span>
          <span className="eyebrow text-body/70">{monthShort(date)}</span>
        </p>
      </div>

      <div className="flex grow flex-col p-[18px] lg:p-[20px]">
        {/* El punto de color y, al lado, el nombre del tipo. Ver `event-color.ts`. */}
        {tipo ? (
          <p className="flex items-center gap-[7px] text-caption font-bold uppercase tracking-[0.1em] text-body/70">
            <span className={`size-[9px] shrink-0 rounded-pill ${eventDot(event)}`} aria-hidden="true" />
            {tipo}
          </p>
        ) : null}

        <h3 className="mt-[8px] font-display text-d5 font-semibold uppercase leading-[1.05] text-ink lg:text-d4">
          {event.title}
        </h3>

        <p className="mt-[8px] text-caption font-bold tabular-nums text-body/75">
          {timeRange(event)}
          <span className="ml-[8px] font-normal">{event.space}</span>
        </p>

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
          {bloques.map((b) =>
            b.tipo === 'parrafo' ? (
              <p key={b.texto}>{b.texto}</p>
            ) : (
              <ol key={b.items[0]} className="m-0 flex list-none flex-col gap-[6px] p-0">
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
          <>
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
          </>
        ) : null}

        {/*
          ══════════════════════════════════════════════════════════════════
          LAS OTRAS VECES QUE PASA DENTRO DE LA VENTANA.

          ⚠️ ES LO QUE PAGA LA DEDUPLICACIÓN. Sin este renglón, mostrar cada
          evento una sola vez le esconde a alguien que no puede el jueves 17
          que hay otro el 24. Pedido de Camila, 2026-09-17: «si se repiten
          estar una sola vez y que en la card debería entenderse que también
          está este mismo evento esta x fecha».

          ⚠️ SON FECHAS CONCRETAS Y NO «every Thursday». El evento tiene
          temporada: se repite entre `from` y `until` y no para siempre (ver
          `happensOn`). «Every Thursday» seguiría prometiendo jueves después
          de que la temporada cierre; «Also on Thu, Sep 24» no puede mentir.
          ══════════════════════════════════════════════════════════════════
        */}
        {/*
          ══════════════════════════════════════════════════════════════════
          EL PIE DE LA TARJETA: LAS OTRAS FECHAS Y EL CTA, PEGADOS ABAJO.

          ⚠️ EL `mt-auto` ESTÁ ACÁ Y NO EN EL CTA, y ése es el arreglo. Camila,
          2026-09-21, con una línea cruzando las tres tarjetas de una fila: «haz
          que esto esté siempre abajo alineado». Lo tenía sólo el botón de
          entradas, así que la tarjeta CON botón apoyaba su pie en el piso y las
          que no lo tienen dejaban el «Also on» flotando donde terminara el
          texto: en la misma fila, los tres renglones caían a tres alturas.

          ⚠️ Y SE ALINEAN ENTRE TARJETAS PORQUE LA FILA YA LAS EMPAREJA. El
          `mt-auto` empuja el pie al fondo de SU tarjeta; que ese fondo sea el
          mismo para las tres lo hace la grilla. Las dos cosas van juntas: si
          alguna vez se vuelve a `items-start`, esto deja de alinear.

          ⚠️ EL BLOQUE NO SE DIBUJA VACÍO. Sin fechas repetidas y sin entrada no
          hay pie, y el `pt` no deja un colchón al final de la tarjeta.
          ══════════════════════════════════════════════════════════════════
        */}
        {alsoOn.length > 0 || (isTicketed(event) && event.ticketUrl) ? (
          <div className="mt-auto pt-[14px]">
            {alsoOn.length > 0 ? (
              <p className="m-0 text-caption font-bold text-body/70">Also on {repeticiones(alsoOn)}</p>
            ) : null}

            {isTicketed(event) && event.ticketUrl ? (
              <p className={alsoOn.length > 0 ? 'm-0 mt-[12px]' : 'm-0'}>
                <a
                  href={event.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-[7px] rounded-pill bg-sunset px-[16px] py-[8px] text-caption font-bold uppercase tracking-[0.1em] text-ink transition-colors hover:bg-sunset-hover"
                >
                  Get tickets
                  <ArrowSquareOut className="size-[14px] shrink-0" aria-hidden="true" />
                  <span className="sr-only">for {event.title} on Eventbrite (opens in a new tab)</span>
                </a>
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
