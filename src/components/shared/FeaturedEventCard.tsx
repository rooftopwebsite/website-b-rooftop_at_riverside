import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from '@/components/shared/Icon';
import { Eyebrow, Heading } from '@/components/shared/Type';
import { type VenueEvent, timeRange, weekdaysLabel } from '@/content/events';

/**
 * Una promo con precio, para la plancha que reemplaza a la foto.
 *
 * ⚠️ EL TIPO SE DECLARA ACÁ Y NO SE IMPORTA DE `content/game-day.ts`, aunque
 * hoy el único que lo cumple sea `GameDayDeal`. Ese archivo se borra entero
 * cuando termine la temporada de fútbol —está escrito en su encabezado— y un
 * `import` desde acá haría que borrarlo rompa el calendario. Declarado acá, la
 * forma es estructural: el día que el bloque se borre, esta card sigue
 * compilando y simplemente vuelve a mostrar la foto.
 */
export interface FeaturedDeal {
  readonly name: string;
  readonly how: string;
  readonly price: string;
}

/**
 * ¿El texto nombra este precio?
 *
 * ⚠️ NO ALCANZA CON `includes`. «$3» está adentro de «$30» y «$25» adentro de
 * «$250»: con `includes` pelado, una promo de $3 se daría por nombrada en un
 * párrafo que habla de $30 y el párrafo entero se borraría del cuerpo.
 *
 * ⚠️ PERO EL PUNTO FINAL SÍ VALE, y la primera versión de esto lo daba por
 * inválido: cortaba ante cualquier dígito O punto detrás, y el párrafo del
 * cliente termina justo en «…two shots for $25.». Con esa regla la tercera promo
 * no se publicaba. Lo que descalifica a un precio es que siga habiendo NÚMERO:
 * un dígito, o un punto CON un dígito atrás ($2.50). Un punto de fin de oración
 * no es ninguna de las dos cosas.
 */
function nombraPrecio(texto: string, precio: string) {
  let i = texto.indexOf(precio);
  while (i >= 0) {
    const resto = texto.slice(i + precio.length);
    const uno = resto.charAt(0);
    const dos = resto.charAt(1);
    const sigueNumero = (uno >= '0' && uno <= '9') || (uno === '.' && dos >= '0' && dos <= '9');
    if (!sigueNumero) return true;
    i = texto.indexOf(precio, i + 1);
  }
  return false;
}

/** Los párrafos del evento, con `summary` como red por si no hay cuerpo. */
/**
 * Los párrafos del evento, con el respaldo de la bajada.
 *
 * ⚠️ SI LA BAJADA ES EL TÍTULO, NO HAY CUERPO. `summary` cae en `r.title`
 * cuando el evento no tiene descripción cargada (ver `content/events.ts`), así
 * que este respaldo publicaba el título DOS VECES en la misma tarjeta: una en
 * el `<h3>` y otra como párrafo debajo. Se veía como un error de carga.
 *
 * Apareció el 2026-09-21, al cargar los 36 eventos del calendario de Google:
 * el calendario del cliente no trae descripciones, así que de golpe hubo 36
 * tarjetas repitiendo su propio título. Antes no se notaba porque los ocho
 * eventos que había estaban todos escritos a mano en el dashboard.
 *
 * ⚠️ UNA TARJETA SIN TEXTO ES LO CORRECTO ACÁ, no un defecto: sigue teniendo
 * título, fecha, horario y espacio. Y el hueco es la señal de que falta pedirle
 * la descripción al cliente, que es justo lo que no queremos que pase callado.
 */
const parrafosDe = (event: VenueEvent) =>
  event.body.length > 0 ? event.body : event.summary === event.title ? [] : [event.summary];

/**
 * Cuáles de esas promos están REALMENTE nombradas en el texto del evento.
 *
 * ⚠️ SE EXPORTA PORQUE `/sunset-bar` NECESITA PREGUNTARLO. Ahí abajo del happy
 * hour se dibuja una card por cada evento del bar, y una sola de todas ellas
 * lleva la lista de precios: la de los domingos de fútbol. La página usa esto
 * para dos cosas que la card no puede resolver sola —dónde poner la nota de que
 * el happy hour regular sigue corriendo, y cuál de las cards va primera— sin
 * tener que nombrar al evento por su título.
 */
export const dealsNombrados = (
  event: VenueEvent | null,
  deals: readonly FeaturedDeal[] = [],
): readonly FeaturedDeal[] =>
  event === null ? [] : deals.filter((d) => parrafosDe(event).some((p) => nombraPrecio(p, d.price)));

/**
 * El cuerpo del evento SIN los párrafos que dicen los precios.
 *
 * ⚠️ SE EXPORTA PORQUE LA TARJETA CHICA HACE LO MISMO. Desde el 2026-09-21 las
 * tarjetas de «lo que viene» de `/whats-on` también publican las promos en una
 * plancha propia —Camila: «¿por qué esta card no muestra la info de los
 * descuentos o promo en tragos? debe mostrar toda la info»—, así que necesitan
 * el mismo recorte: el párrafo en prosa que enumera los precios se va, porque
 * la plancha lo dice mejor y dos veces el mismo dato es ruido.
 *
 * ⚠️ SIN PROMOS QUE COINCIDAN DEVUELVE EL CUERPO ENTERO, que es lo que hace que
 * esto se caiga con gracia en los otros veinte eventos del calendario.
 */
export const cuerpoSinPrecios = (
  event: VenueEvent,
  promos: readonly FeaturedDeal[],
): readonly string[] => parrafosDe(event).filter((p) => !promos.some((d) => nombraPrecio(p, d.price)));

/**
 * El envoltorio de la card: un `Link` al calendario, o un `div` si no lleva CTA.
 *
 * ⚠️ ES UNA FUNCIÓN APARTE Y NO UN `const Envoltorio = link ? Link : 'div'`
 * ADENTRO DEL RENDER. Esa versión existió dos minutos y no compila: la unión
 * de los dos tipos hace que `href` quede opcional, y `LinkProps` lo exige.
 * Separado, cada rama se tipa sola.
 *
 * ⚠️ LAS CLASES LLEGAN POR PROP y son las mismas para las dos ramas. La card
 * se ve idéntica con link y sin él; lo único que cambia es si se puede
 * clickear. Ver la nota de `linkToCalendar`.
 */
function Envoltorio({
  link,
  className,
  children,
}: {
  readonly link: boolean;
  readonly className: string;
  readonly children: ReactNode;
}) {
  if (!link) return <div className={className}>{children}</div>;

  /*
    ⚠️ VA AL CALENDARIO Y ANTES IBA A `/whats-on/<slug>`, QUE ES UN 404. La
    ruta por evento existió y se sacó el 2026-09-16 —está anotado en
    `app/sitemap.ts`, que ese mismo día dejó de listarlas—, pero este link se
    quedó apuntando ahí. El destino correcto mientras no exista la ficha es el
    calendario, que es donde está el resto de las fechas.
  */
  return (
    <Link href="/whats-on" className={className}>
      {children}
    </Link>
  );
}

/**
 * ══════════════════════════════════════════════════════════════════════════
 * LA CARD GRANDE DEL EVENTO DESTACADO: media card de texto, media de precios.
 *
 * ⚠️ VIVE EN `shared/` Y NO ADENTRO DE `FeaturedEvent` PORQUE LA PIDEN DOS
 * PÁGINAS. Nació para `/whats-on` —es lo que reemplazó a la landing
 * `/nfc-north-hq`— y el 2026-09-17 Camila la mandó también a `/sunset-bar`:
 * «esto así tal cual pongámoslo debajo de happy hour, porque ahora estamos
 * nombrando el evento pero re diferente el diseño». Los domingos de fútbol se
 * publicaban en las dos páginas con dos formas distintas, y son la misma noche.
 *
 * ⚠️ NO BUSCA NADA Y NO SABE NADA DE TAGS: recibe el evento ya resuelto. Cada
 * página decide QUÉ evento le da y por qué —`/whats-on` el destacado,
 * `/sunset-bar` los que pasan en el bar— y esa regla se lee ahí, no acá.
 *
 * ⚠️ LO QUE CAMBIA ENTRE LAS DOS PÁGINAS ES EL ENVOLTORIO, NO LA CARD: allá va
 * sola en su banda oscura y acá van varias apiladas pegadas al happy hour,
 * dentro de la banda que ya existía. Por eso el componente no trae `Section` ni
 * márgenes propios.
 * ══════════════════════════════════════════════════════════════════════════
 */
export default function FeaturedEventCard({
  event,
  deals,
  dealsLabel,
  headingLevel = 2,
  headingId,
  linkToCalendar = true,
}: {
  readonly event: VenueEvent;
  /**
   * Las promos con precio que van en el lugar de la foto.
   *
   * ══════════════════════════════════════════════════════════════════════
   * ⚠️ LLEGAN POR PROP Y NO SE LEEN DE LA BASE, y es lo que mantiene a esta
   * card genérica. El destacado lo elige el cliente con un tag: mañana puede
   * ser el bingo, y el bingo no tiene lista de precios. Si el componente
   * fuera a buscar las promos de fútbol por su cuenta, se las pondría
   * también al bingo.
   *
   * ⚠️ Y SE FILTRAN CONTRA EL TEXTO DEL EVENTO, que es el segundo cerrojo.
   * Sólo se publica la promo cuyo precio APARECE en la descripción del
   * evento destacado. O sea que el bloque se apaga solo el día que el
   * cliente cambie el destacado o reescriba la descripción, sin que nadie
   * tenga que acordarse de sacar la prop.
   * ══════════════════════════════════════════════════════════════════════
   */
  readonly deals?: readonly FeaturedDeal[];
  /** El rótulo del bloque. Va arriba de la lista. */
  readonly dealsLabel?: string;
  /**
   * ⚠️ EL NIVEL DEL TITULAR ES PROP PORQUE DEPENDE DE DÓNDE CUELGUE. En
   * `/whats-on` la card abre su propia banda y el título es un `h2`. En
   * `/sunset-bar` cuelga de «Happy hour» (el `h2` de la banda) y de «What's on
   * up here» (el `h3` del grupo), así que ahí es `h4`. Fijarlo en 2 rompe el
   * orden de headings de esa página.
   */
  readonly headingLevel?: 2 | 3 | 4;
  /** El `id` del titular, para que la banda que la contiene pueda apuntarle. */
  readonly headingId?: string;
  /**
   * ══════════════════════════════════════════════════════════════════════
   * ⚠️ SI LA CARD ENTERA ES UN LINK AL CALENDARIO, Y SI DIBUJA «See the
   * night» — las dos cosas son la misma y por eso son una sola prop.
   *
   * En `/whats-on` sí: la card abre la página y el calendario está más
   * abajo, así que el CTA lleva a algún lado.
   *
   * En `/sunset-bar` NO. Camila, 2026-09-22, sobre la captura: «elimina ese
   * CTA». Ahí la card cuelga del happy hour y cuenta el domingo entero —el
   * día, el horario, el texto del cliente y las tres promos con su precio—,
   * así que «ver la noche» no ofrece nada que no esté ya en pantalla.
   *
   * ⚠️ Y CUANDO NO HAY CTA TAMPOCO HAY LINK. Un bloque de 400px clickeable
   * entero, sin una sola señal de que lo es, no es un link: es una trampa.
   * Con esto en `false` la card se dibuja como un `<div>` y deja de estar en
   * el recorrido del tabulador.
   * ══════════════════════════════════════════════════════════════════════
   */
  readonly linkToCalendar?: boolean;
}) {
  const cuando =
    event.kind === 'recurring' && event.weekdays.length > 0 ? weekdaysLabel(event.weekdays) : null;

  /*
    ══════════════════════════════════════════════════════════════════════════
    ⚠️ LA PLANCHA DE PRECIOS REEMPLAZA A LA FOTO, Y EL PÁRRAFO QUE LOS DICE SE
    VA DEL CUERPO. Camila, 2026-09-17: «que esta card no tenga imagen y en su
    lugar, donde ahora está el hueco para la imagen, pongamos la promo con los
    $ siguiendo la estética de happy hour en Sunset Bar».

    El motivo de fondo es que hoy esa mitad está VACÍA: el evento no tiene foto
    cargada, así que la card grande del calendario es media card de texto y
    media card de negro. Y lo que sí tiene es justo el material que pide una
    plancha: tres promos con su número.

    ⚠️ EL PÁRRAFO SE SACA DEL CUERPO, no se duplica. «$3 domestic drafts…, $4
    shots…, y cinco cervezas con dos shots por $25» es exactamente lo mismo que
    va a decir la plancha, en prosa y en cuerpo chico. Dejarlo sería leer dos
    veces el mismo dato, y la prosa es la versión peor de las dos.

    ⚠️ SE CAE CON GRACIA. Sin promos que coincidan, `parrafos` queda entero y la
    mitad derecha vuelve a ser la foto, que es exactamente el comportamiento de
    antes de este cambio.
    ══════════════════════════════════════════════════════════════════════════
  */
  const promos = dealsNombrados(event, deals);
  const cuerpo = cuerpoSinPrecios(event, promos);

  return (
    /*
      ⚠️ EL `text-left` NO ES DECORACIÓN: en `/sunset-bar` esta card cuelga del
      contenedor `text-center` que centra el titular «Happy hour» y su pastilla.
      Sin esto hereda el centrado y se deforma la card entera.

      ⚠️ SI ESTO ES UN `<a>` O UN `<div>` LO DECIDE `Envoltorio`, acá arriba.
    */
    <Envoltorio
      link={linkToCalendar}
      className="group relative grid overflow-hidden rounded-shell bg-deeper text-left sombra-card lg:grid-cols-2"
    >
      {/*
        ══════════════════════════════════════════════════════════════════
        LA MITAD DERECHA: LA PLANCHA DE PRECIOS, O LA FOTO.

        ⚠️ LA PLANCHA NACIÓ COPIANDO EL BLOQUE «ON FOOTBALL SUNDAYS» DE
        `/sunset-bar` Y NO LA TARJETA CLARA DEL HAPPY HOUR, aunque el pedido
        nombrara al happy hour: publicaba EXACTAMENTE estas tres promos y
        estaba compuesto sobre fondo oscuro, que es lo que este hueco es.

        ⚠️ ESE BLOQUE YA NO EXISTE. El 2026-09-17 esta card lo reemplazó
        también en `/sunset-bar`, así que la plancha no copia nada: ES la
        única forma en que estas tres promos se publican en el sitio.

        ⚠️ EL NÚMERO EN `sunset` SOBRE OSCURO. La ley del color del repo
        prohíbe el naranja de marca como tinta sobre claro, no sobre oscuro.
        Acá el fondo es `ink`, así que el naranja entra sin bajar a
        `sunset-deep`.

        ⚠️ VA EN `order-2` EN TODOS LOS TAMAÑOS, y la foto no. La foto abre
        la card en mobile porque una foto es lo que la hace reconocible de
        un scroll; tres precios sin contexto arriba del título, no. Acá el
        orden correcto es leer de qué noche se habla y después cuánto sale.
        ══════════════════════════════════════════════════════════════════
      */}
      {promos.length > 0 ? (
        <div className="relative order-2 flex flex-col justify-center bg-ink grano p-7 lg:min-h-[22rem] lg:p-12">
          {dealsLabel ? (
            <Eyebrow tone="cream" as="p">
              {dealsLabel}
            </Eyebrow>
          ) : null}

          <ul className="m-0 mt-5 flex list-none flex-col p-0">
            {promos.map((d) => (
              <li
                key={d.price}
                className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-dashed border-bone/25 py-4.5 last:border-b"
              >
                {/*
                  ⚠️ EL ANCHO MÍNIMO DEL PRECIO ES LO QUE ALINEA LOS TRES
                  NOMBRES, no un capricho: «$3» y «$25» no miden lo mismo, y
                  sin un mínimo cada nombre arrancaría en una columna distinta.
                  Con `tabular-nums` el dígito es de ancho fijo, así que 3ch
                  —el «$» más los dos dígitos de «$25»— es el mínimo que hace
                  falta.

                  ⚠️ ERA 3.5ch Y UN `gap-x-4`, y sumaban un hueco de casi 50px
                  entre «$3» y «2 MINUTE DRILL». Camila, 2026-09-21: «junta más
                  los títulos con los precios, está raro tan separado». Medio ch
                  de más no lo pedía nadie: era aire que no alineaba nada.
                */}
                <span className="min-w-[3ch] font-display text-d3 leading-none tabular-nums text-sunset">
                  {d.price}
                </span>
                <span className="font-display text-d5 uppercase tracking-eyebrow text-paper">
                  {d.name}
                </span>
                <span className="basis-full font-body text-base font-light text-bone/85">
                  {d.how}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="relative aspect-[16/10] w-full bg-ink lg:order-2 lg:aspect-auto lg:h-full lg:min-h-[22rem]">
          {event.image ? (
            <Image
              src={event.image}
              alt={event.imageAlt ?? ''}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 ease-brand group-hover:scale-104"
            />
          ) : null}
        </div>
      )}

      <div className="flex flex-col justify-center gap-4 p-7 lg:order-1 lg:p-12">
        <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
          <Eyebrow tone="cream" as="span">
            Every week
          </Eyebrow>
          {cuando ? (
            <span className="rounded-pill bg-cream px-2.5 py-0.75 font-body text-caption font-bold whitespace-nowrap text-deep">
              {cuando} · {timeRange(event)}
            </span>
          ) : null}
        </span>

        <Heading
          level={headingLevel}
          {...(headingId ? { id: headingId } : {})}
          className="m-0 font-display text-d3 font-bold uppercase leading-[0.98] text-paper lg:text-d2"
        >
          {event.title}
        </Heading>

        {/*
          ══════════════════════════════════════════════════════════════
          ⚠️ SE PUBLICA EL TEXTO ENTERO Y ANTES SÓLO LA PRIMERA ORACIÓN.
          `summary` es exactamente eso: lo que hay hasta el primer punto
          (ver el adaptador en `content/events.ts`). Sirve para una
          tarjeta chica, y era lo ÚNICO que salía del campo descripción
          en todo el sitio: lo que el cliente escribía después no se
          publicaba en ninguna parte.

          Dejó de alcanzar el 2026-09-17, con los eventos de la
          temporada de fútbol: las promos del bar con su precio y la
          dinámica del sorteo no entran en una oración, y no hay ficha
          por evento donde leerlas.

          ⚠️ EL PRIMER PÁRRAFO ES LA BAJADA GRANDE y el resto va en
          cuerpo normal. La jerarquía la escribe el cliente sin saberlo:
          el primer párrafo es el que resume, los que siguen detallan.

          ⚠️ `body` NUNCA ESTÁ VACÍO si hay descripción, pero si lo
          estuviera cae en `summary`, que en el peor caso es el título.
          ══════════════════════════════════════════════════════════════
        */}
        {cuerpo.map((parrafo, i) => (
          <p
            key={parrafo}
            className={
              i === 0
                ? 'm-0 max-w-[46ch] font-body text-lead font-light text-bone'
                : 'm-0 max-w-[52ch] font-body text-base font-light text-bone/85'
            }
          >
            {parrafo}
          </p>
        ))}

        {linkToCalendar ? (
          <span className="mt-2 inline-flex w-fit items-center gap-2.5 font-body text-base font-semibold text-cream">
            See the night
            <ArrowRight className="size-4 transition-transform duration-300 ease-brand group-hover:translate-x-1" />
          </span>
        ) : null}
      </div>
    </Envoltorio>
  );
}
