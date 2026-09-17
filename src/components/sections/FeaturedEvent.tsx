import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from '@/components/shared/Icon';
import { Reveal } from '@/components/shared/Motion';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading } from '@/components/shared/Type';
import { featuredEvent, timeRange, weekdaysLabel } from '@/content/events';

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

/**
 * ══════════════════════════════════════════════════════════════════════════
 * EL EVENTO DESTACADO DEL CALENDARIO, EN GRANDE.
 *
 * ⚠️ EXISTE PORQUE UNA PÁGINA SE CONVIRTIÓ EN UN EVENTO. `/nfc-north-hq` —los
 * domingos de fútbol— era una landing propia con su hero y sus 152 líneas.
 * Revisando qué páginas secundarias tiene que tener el sitio, Camila la mandó
 * al calendario: «domingos de fútbol debería ser un evento recurrente del
 * calendario». Y después puso la condición que hace que el cambio no sea una
 * degradación: «irán en calendario pero con un espacio o card grande, mucho
 * más destacada».
 *
 * Esto es esa card. Sin ella, el fútbol habría pasado de tener una página
 * entera a ser una fila más entre Bingo y el DJ.
 *
 * ⚠️ NO ES UNA LISTA, ES UNO SOLO. Si hubiera dos destacados a la vez, el
 * recurso deja de destacar: son dos cards grandes seguidas y el calendario
 * arranca con dos pantallas antes de la primera fecha. `featuredEvent()`
 * devuelve el PRIMERO que lleve el tag y nada más.
 *
 * ⚠️ QUIÉN ES EL DESTACADO SE DECIDE EN EL DASHBOARD, no acá: es el evento que
 * lleva el tag `featured`. El cliente puede cambiarlo sin tocar el código, que
 * es la razón por la que el dato vive en la base y no en un `const` de este
 * archivo.
 *
 * ⚠️ SI NADIE LLEVA EL TAG, ESTO NO RENDERIZA NADA. El calendario arranca
 * directamente por la lista, como antes. Un bloque vacío con un título sería
 * peor que no tener bloque.
 * ══════════════════════════════════════════════════════════════════════════
 */
export default async function FeaturedEvent({
  deals,
  dealsLabel,
}: {
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
} = {}) {
  const event = await featuredEvent();
  if (!event) return null;

  const cuando =
    event.kind === 'recurring' && event.weekdays.length > 0
      ? weekdaysLabel(event.weekdays)
      : null;

  const parrafos = event.body.length > 0 ? event.body : [event.summary];

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
  const promos = (deals ?? []).filter((d) => parrafos.some((p) => nombraPrecio(p, d.price)));
  const cuerpo = parrafos.filter((p) => !promos.some((d) => nombraPrecio(p, d.price)));


  return (
    <Section tone="deep" band="md" labelledBy="featured-title">
      <Reveal>
        {/*
          ⚠️ VA AL CALENDARIO Y ANTES IBA A `/whats-on/<slug>`, QUE ES UN 404.
          La ruta por evento existió y se sacó el 2026-09-16 —está anotado en
          `app/sitemap.ts`, que ese mismo día dejó de listarlas—, pero este
          link se quedó apuntando ahí. El destino correcto mientras no exista
          la ficha es el calendario, que es donde está el resto de las fechas.
        */}
        <Link
          href="/whats-on"
          className="group relative grid overflow-hidden rounded-shell bg-deeper sombra-card lg:grid-cols-2"
        >
          {/*
            ══════════════════════════════════════════════════════════════════
            LA MITAD DERECHA: LA PLANCHA DE PRECIOS, O LA FOTO.

            ⚠️ LA PLANCHA COPIA EL BLOQUE «ON FOOTBALL SUNDAYS» DE `/sunset-bar`
            Y NO LA TARJETA CLARA DEL HAPPY HOUR, aunque el pedido nombre al
            happy hour. Son los dos bloques de la MISMA banda de esa página, uno
            debajo del otro, y el que corresponde es el de abajo por dos
            motivos: publica EXACTAMENTE estas tres promos —mismo nombre, misma
            mecánica, mismo precio— y está compuesto sobre fondo oscuro, que es
            lo que este hueco es.

            La tarjeta clara, además, es la plancha `bone` con filete punteado
            que ya está dos veces en el sitio, y su propio comentario dice que
            una TERCERA copia hay que subirla a `shared/` en el mismo commit.
            Este bloque no la necesita.

            ⚠️ EL NÚMERO EN `sunset` SOBRE OSCURO. Es el mismo tratamiento de
            allá y no es casual: la ley del color del repo prohíbe el naranja de
            marca como tinta sobre claro, no sobre oscuro. Acá el fondo es
            `ink`, así que el naranja entra sin bajar a `sunset-deep`.

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
                    className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-dashed border-bone/25 py-4.5 last:border-b"
                  >
                    <span className="min-w-[3.5ch] font-display text-d3 leading-none tabular-nums text-sunset">
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
              level={2}
              id="featured-title"
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

            <span className="mt-2 inline-flex w-fit items-center gap-2.5 font-body text-base font-semibold text-cream">
              See the night
              <ArrowRight className="size-4 transition-transform duration-300 ease-brand group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </Reveal>
    </Section>
  );
}
