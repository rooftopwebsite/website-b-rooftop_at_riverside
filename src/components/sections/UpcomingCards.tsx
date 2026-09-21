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
  featuredSlug = null,
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
  /**
   * El slug del evento que va EN GRANDE, ocupando dos columnas.
   *
   * ══════════════════════════════════════════════════════════════════════
   * ⚠️ REEMPLAZA A LA BANDA PROPIA DEL DESTACADO. Camila, 2026-09-21: «no
   * necesito esta card gigante acá; dentro de esa sección de 3 columnas poder
   * destacar algunas cards, las destacadas podrían ocupar dos lugares».
   *
   * ⚠️ ES UN SLUG Y NO UN BOOLEANO POR TARJETA porque quién es el destacado lo
   * decide el CLIENTE con un tag en el dashboard, y eso lo resuelve la página
   * —`featuredEvent()`— una sola vez. La grilla no sabe de tags.
   *
   * ⚠️ SI EL DESTACADO NO ENTRA EN LA VENTANA DE 15 DÍAS, NO PASA NADA: no hay
   * tarjeta con ese slug y las demás se acomodan solas. Nada que apagar.
   * ══════════════════════════════════════════════════════════════════════
   */
  readonly featuredSlug?: string | null;
}) {
  return (
    /*
      ⚠️ `auto-rows-fr` ES LO QUE MANTIENE PAREJA LA FILA con una tarjeta del
      doble de ancho adentro. Sin él, la fila que contiene a la ancha toma el
      alto de la ancha y las vecinas quedan flotando arriba, alineadas al tope.
    */
    <ul className="mt-[28px] grid list-none auto-rows-fr grid-cols-1 gap-[20px] p-0 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const destacada = item.event.slug === featuredSlug;
        return (
          <li key={item.event.slug} className={destacada ? 'sm:col-span-2' : ''}>
            <UpcomingCard item={item} deals={deals} dealsLabel={dealsLabel} wide={destacada} />
          </li>
        );
      })}
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

function UpcomingCard({
  item,
  deals,
  dealsLabel,
  wide = false,
}: {
  readonly item: NextUp;
  readonly deals?: readonly FeaturedDeal[];
  readonly dealsLabel?: string;
  /** ¿Es la tarjeta destacada, la que ocupa dos columnas? */
  readonly wide?: boolean;
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
  const promos = dealsNombrados(event, deals);
  const cuerpo = cuerpoSinPrecios(event, promos);

  return (
    /*
      ⚠️ `grano` NO ES DECORACIÓN ACÁ. La tarjeta es `bg-paper` sobre una
      sección `paper`: se pinta del color de su propia superficie y lo único
      que la delimita es el borde. Sin el grano queda como un parche liso
      recortado encima del fondo texturado, que es justo lo que `check:grano`
      detecta. Ver la regla en `scripts/check-grano.mjs`.
    */
    /*
      ⚠️ LA DESTACADA SE ACUESTA Y CAMBIA DE FILETE. Al doble de ancho, apilar
      afiche arriba y texto abajo daría una tarjeta de dos pantallas de alto: a
      760px de ancho, la ventana 7:5 del afiche mide 540 de alto ella sola. En
      fila, el afiche es una columna angosta al costado y el texto usa el ancho
      que ganó, que es para lo que se le dio.

      ⚠️ EL FILETE NARANJA ES LO ÚNICO QUE DICE «ÉSTA ES LA DESTACADA». No hay
      rótulo de «featured» y es a propósito: el doble de ancho ya lo grita, y
      una etiqueta que lo repita es la que después hay que traducir, mantener y
      explicar. El color sale de la marca, no de un gris.
    */
    <article
      className={[
        'grano flex h-full flex-col overflow-hidden rounded-card border bg-paper transition-colors',
        wide ? 'border-sunset/55 hover:border-sunset sm:flex-row' : 'border-ink/12 hover:border-ink/30',
      ].join(' ')}
    >
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
      <div
        className={[
          'relative aspect-[7/5] w-full shrink-0 overflow-hidden bg-bone',
          /* En la ancha el afiche es una columna vertical al costado: 3:4 es lo
             que deja ver el arte casi entero sin estirar el alto de la fila. */
          wide ? 'sm:aspect-[3/4] sm:w-[36%]' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
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

        <div className="mt-[8px] flex flex-col gap-[8px] text-[16px] leading-[1.55] text-body/80">
          {cuerpo.map((p) => (
            <p key={p}>{p}</p>
          ))}
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
            {dealsLabel ? (
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
                    </strong>{' '}
                    · {d.how}
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
        {alsoOn.length > 0 ? (
          <p className="mt-[10px] text-caption font-bold text-body/70">Also on {repeticiones(alsoOn)}</p>
        ) : null}

        {/* El CTA se pega abajo para que las tarjetas de una fila terminen parejas. */}
        {isTicketed(event) && event.ticketUrl ? (
          <p className="mt-auto pt-[16px]">
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
    </article>
  );
}
