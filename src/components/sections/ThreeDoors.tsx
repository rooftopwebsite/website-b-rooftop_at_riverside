import Link from 'next/link';
import type { ComponentType, SVGProps } from 'react';
import { ArrowRight, ArrowUpRight, Balloons, Martini, Truck } from '@/components/shared/Icon';
import { Reveal, RevealItem, StaggerGroup } from '@/components/shared/Motion';

/**
 * «Not a restaurant. Three of them.» — las tres unidades de negocio.
 *
 * Es la sección que corrige el malentendido de raíz: el lugar no es un
 * restaurante con varias cocinas, son tres cosas distintas en la misma
 * dirección. Va una sola vez en la home y es la única que las enumera.
 *
 * ⚠️ EL TITULAR ES LA SECCIÓN. «Not a restaurant» en negro y «Three of them»
 * en el acento cálido: la corrección y la respuesta, en el mismo renglón. Si
 * alguien lee sólo los titulares de la home, este es el que tiene que
 * llevarse.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ EL ACENTO ES `sunset-deep` Y NO `sunset` A SECAS, Y ES LA ÚNICA
 * DESVIACIÓN DELIBERADA RESPECTO DEL DISEÑO DE ORIGEN. Vale para los cuatro
 * lugares donde el prototipo pone naranja como color de TEXTO sobre superficie
 * clara: este titular, la placa «TOGETHER» del hero, «Across from Riverside
 * Park» en `FindUs` y los hovers de la nav.
 *
 * El motivo está medido, no es una preferencia:
 *
 *     #F58521 sobre #FAF6EA  →  2.35:1
 *     #E0741A sobre #FAF6EA  →  2.90:1
 *     mínimo WCAG AA para texto grande  →  3:1
 *
 * O sea que el naranja de marca ni siquiera pasa el umbral de titular de
 * 100px, que es el más permisivo que existe. `npm run a11y` lo marcó en 12
 * nodos de 8 páginas.
 *
 * `sunset` es un tono medio: funciona como RELLENO con texto negro encima
 * (8.26:1) y por eso el diseño lo usa bien en los botones, los campos y los
 * subrayados — todo eso se conserva tal cual. Lo que no puede es ser tinta
 * sobre claro: `COLOR_RULES.neverAsTextOnLight`.
 *
 * ⚠️ ACÁ ESTUVO `terra` (#A62000) Y SE FUE, y conviene dejar escrito por qué
 * para que no vuelva. Pasaba de sobra —7.43:1— pero a esa luminosidad el tono
 * se lee como ROJO LADRILLO, no como el naranja del logo, y el titular más
 * importante de la home terminaba con una palabra roja. Camila: «las palabras
 * destacadas en los títulos deben estar en naranja no en rojo».
 *
 * `sunset-deep` (#D66A0A) es `sunset` con el mismo hue (28.3°) y la misma
 * saturación (91 %), 10 puntos más oscuro: 3.28:1 sobre `bone`, que es la
 * superficie de esta sección. Pasa texto grande, que es la barra de un titular
 * de display. `terra` se queda donde tiene que decir ROJO: los errores de
 * formulario y los marcadores de dato pendiente.
 *
 * Sobre las bandas OSCURAS el acento sigue siendo `sunset` a secas, que ahí da
 * 4.26:1 y pasa — ver `WhatsOn` y `EventsBanner`, que no se tocaron.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LAS TRES PUERTAS SON CAMPOS DE COLOR CON UN ICONO, NO FOTOS — y este es
 * el cambio del rediseño que más conviene dejar argumentado, porque la
 * versión anterior tenía tres fotos y «sacar fotos» siempre parece un
 * retroceso.
 *
 * El problema de las fotos acá era que las tres muestran EL MISMO LUGAR. Una
 * foto del yard, una de la barra y una del venue cerrado son, las tres, el
 * mismo patio con la misma luz — el visitante ya vio ese patio cuatro veces
 * antes de llegar acá. Tres fotos que se parecen entre sí no distinguen tres
 * negocios: los funden.
 *
 * Tres campos de color planos y distintos hacen el trabajo contrario. Y el
 * color no es arbitrario, es el de cada unidad:
 *
 *     yard    `mint`    el verde claro del patio, de día
 *     bar     `cream`   el amarillo del atardecer — se llama Sunset Bar
 *     events  `river`   el teal de marca, el más saturado, para lo que más
 *                       factura
 *
 * ⚠️ Y ADEMÁS es lo que permite que los tres iconos se lean a 104px. Un
 * icono de línea sobre una foto necesita una capa oscura encima para tener
 * contraste; sobre un campo plano no necesita nada.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ LOS TRES CAMPOS LLEVAN EL ICONO EN `ink` Y NUNCA EN BLANCO. Los ratios
 * están medidos: negro sobre `mint` da 15.8:1, sobre `cream` 18.3:1 y sobre
 * `river` 8.4:1. Blanco sobre `river` daría 2.50:1 — `river` es tono medio y
 * está prohibido como color de texto. La regla vive en `COLOR_RULES`.
 *
 * ⚠️ LA TARJETA ENTERA ES UN SOLO LINK. En el prototipo el `<article>` tenía
 * el campo de color, el título, el párrafo y ABAJO un link de texto: cuatro
 * elementos donde sólo uno era clickeable, con una flecha dibujada arriba a
 * la derecha que parecía otro botón y no lo era. Acá el `<Link>` envuelve
 * todo, la flecha del campo es parte del mismo destino, y el texto de abajo
 * sigue existiendo como AFFORDANCE —dice adónde va— pero ya no es un segundo
 * target. Un solo destino, un solo tab stop, área de clic de 260px de alto.
 */

interface Door {
  readonly title: string;
  readonly body: string;
  readonly link: string;
  readonly href: string;
  /** El campo de color. Es una clase y no un hex: la paleta vive en el tema. */
  readonly field: string;
  readonly Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const DOORS: readonly Door[] = [
  {
    title: 'Four kitchens in the yard',
    body: 'Four independent kitchens under the rooftop, each one its own business. You order at the truck. The bar upstairs is ours.',
    link: 'Meet the trucks',
    href: '/food-trucks',
    field: 'bg-mint',
    Icon: Truck,
  },
  {
    title: 'The bar over the river',
    body: 'Craft cocktails made daily, local drafts, and the best west-facing seat in Bonita Springs.',
    link: 'See the bar',
    href: '/sunset-bar',
    field: 'bg-cream',
    Icon: Martini,
  },
  {
    title: 'The whole place, closed',
    body: 'The rooftop, the yard, the patio, or the entire venue with the gates shut, and one person coordinating all of it.',
    link: 'Plan an event',
    href: '/events',
    field: 'bg-river',
    Icon: Balloons,
  },
];

export default function ThreeDoors() {
  return (
    /*
    Lleva `grano` como todas las superficies planas del sitio — la utilidad
    está documentada en globals.css. Las secciones que pasan por `<Section>` lo
    reciben solas; ésta está escrita a mano, así que lo escribe a mano.
    */
    <section
      aria-labelledby="doors-title"
      className="grano relative bg-bone pt-16 pb-cierre lg:pt-30"
    >
      <div className="caja-ancha">
        {/* El encabezado entra como un bloque —titular y bajada juntos— y las
            tarjetas después, en cascada. Separar el titular de su bajada en
            dos entradas parte una sola idea en dos tiempos. */}
        <Reveal>
          <h2
            id="doors-title"
            className="mx-auto max-w-[18ch] text-center font-display text-banda font-extrabold uppercase"
          >
            <span className="text-ink">Not a restaurant.</span>{' '}
            <span className="text-sunset-deep">Three of them</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[60ch] text-center font-body text-lead font-light text-ink">
            A rooftop bar, a yard of independent kitchens, and a venue you can rent. Same address,
            three different nights.
          </p>
        </Reveal>

        {/*
          ⚠️ EL GAP ES DEL DOBLE EN MOBILE (48px contra 24). Pedido de Camila:
          «agregá más espacio entre estas cards acá en mobile».

          El mismo número no puede servir en las dos medidas porque el gap NO
          separa lo mismo. En la grilla de tres columnas separa tarjetas que
          están UNA AL LADO DE LA OTRA, y ahí 24px alcanzan: cada tarjeta tiene
          su campo de color que la delimita. Apiladas, en cambio, el gap cae
          entre el CTA de una tarjeta y el campo de color de la siguiente, o
          sea entre el final de un bloque de texto y el principio de una
          imagen — y 24px ahí hacen que el link de arriba parezca el pie de la
          tarjeta de abajo.
        */}
        <StaggerGroup as="ul" className="mt-bloque grid list-none grid-cols-1 gap-12 p-0 md:grid-cols-3 md:gap-6">
          {DOORS.map(({ title, body, link, href, field, Icon }) => (
            /*
              ══════════════════════════════════════════════════════════════
              ⚠️ `h-full` EN EL `<li>` Y EN EL `<a>`, Y `mt-auto` EN EL CTA. Es
              lo que alinea los tres «Meet the trucks / See the bar / Plan an
              event» en la misma línea de base. Pedido de Camila: «alinear ctas
              cards».

              Sin esto, cada CTA cuelga de lo que mida SU tarjeta: «Four
              kitchens in the yard» son dos renglones de titular y tres de
              párrafo, «The bar over the river» uno y dos. La diferencia se
              acumula y los tres links quedaban en tres alturas distintas, que
              en una fila de tres es lo primero que se ve.

              El `<li>` de una grilla ya se estira a la altura de la fila por
              `align-items: stretch`, pero el `<a>` de adentro no hereda eso:
              mide su contenido. De ahí los dos `h-full`, y de ahí que el
              `mt-auto` del CTA recién funcione cuando el `<a>` tiene altura
              que sobrar.
              ══════════════════════════════════════════════════════════════
            */
            <RevealItem as="li" key={href} className="h-full">
              <Link href={href} className="group flex h-full flex-col gap-3">
                {/*
                  ══════════════════════════════════════════════════════════
                  ⚠️ SON DOS ELEMENTOS HERMANOS Y NO UNO ADENTRO DEL OTRO, y
                  es lo que hace posible el mordisco.

                  La flecha vivía DENTRO del campo de color. Con la máscara
                  eso deja de funcionar: `mask` recorta al elemento Y A TODA SU
                  DESCENDENCIA, así que el círculo caía justo en el hueco que
                  la máscara saca y desaparecía con él.

                  Ahora el campo se enmascara solo y la flecha se posiciona
                  contra este envoltorio, que no tiene máscara ni
                  `overflow-hidden`. Por eso el envoltorio existe: es el marco
                  de referencia del `absolute`.
                  ══════════════════════════════════════════════════════════
                */}
                <div className="relative mb-2.5 h-50 lg:h-65">
                  <div
                    className={`mordisco grid size-full place-items-center overflow-hidden rounded-door ${field}`}
                  >
                    {/* ⚠️ El icono crece un 6 % en el hover y NADA MÁS se mueve.
                        El campo de color es la mitad de la tarjeta: escalarlo
                        entero movería el título y el párrafo de abajo, y una
                        tarjeta que se reacomoda al pasar el mouse se lee como
                        inestable. Sólo respira el dibujo. */}
                    <Icon className="size-18 text-ink transition-transform duration-300 ease-brand group-hover:scale-106 lg:size-26" />
                  </div>

                  {/*
                    La flecha es DECORATIVA: el destino ya lo dice el título y
                    el texto de abajo. Con `aria-hidden` en el `<span>` no se
                    anuncia dos veces.

                    ⚠️ EL `right-1 bottom-1` NO ES UN NÚMERO SUELTO: son los 4px
                    de `--mordisco-sangria`. El centro del círculo tiene que
                    caer exactamente en el centro del hueco que recorta la
                    máscara, o el aire deja de ser parejo alrededor. Si se
                    mueve uno, se mueve el otro.

                    ⚠️ EL CÍRCULO VA DEL COLOR DE SU PROPIA PUERTA (`field`) Y
                    NO EN `bone`. En `bone` era invisible: esta sección tiene
                    fondo `bone`, así que el círculo y la página eran el mismo
                    color y lo único que se veía era el hueco, con la flecha
                    flotando en el aire.

                    Del color del campo, el recurso se explica solo: es el
                    mismo material del campo, troquelado y corrido un paso. El
                    hueco del mordisco deja ver el `bone` de la página entre
                    los dos, y esa línea de fondo es la que hace legible el
                    corte.

                    ⚠️ EL HOVER YA NO LEVANTA LA FLECHA, Y SE FUE A PROPÓSITO.
                    Tenía `-translate-y-1`: con el círculo apoyado encima del
                    campo eso se leía como que la chapita flotaba, pero ahora
                    el círculo vive en un hueco troquelado a su medida y
                    moverlo lo saca del molde — se ve el borde del mordisco
                    asomando de un lado. El hover pasa al COLOR, que se queda
                    quieto: `bone` → `sunset`, que es el mismo cambio que ya
                    hacen los círculos de redes de `FindUs`. La flecha sigue en
                    `ink`, que sobre naranja da 6.73:1.
                  */}
                  <span
                    aria-hidden="true"
                    className={`absolute right-1 bottom-1 grid size-13.25 place-items-center rounded-pill text-ink transition-colors duration-300 ease-brand group-hover:bg-sunset ${field}`}
                  >
                    <ArrowUpRight />
                  </span>
                </div>

                {/*
                  ⚠️ `text-balance` — pedido de Camila junto con la alineación
                  de los CTA. Reparte las palabras entre los renglones en vez
                  de llenar el primero y dejar la última palabra sola abajo:
                  «The whole place, closed» pasaba de «THE WHOLE PLACE,» +
                  «CLOSED» a dos renglones parejos.

                  ⚠️ Va sólo en estos tres titulares y no en todos los del
                  sitio. `text-wrap: balance` obliga al navegador a componer el
                  bloque varias veces para encontrar el reparto, y el propio
                  estándar lo limita a unas pocas líneas: es para titulares
                  cortos, no para párrafos.

                  ══════════════════════════════════════════════════════════
                  ⚠️ EL `max-w-[15ch]` ES LO QUE FUERZA LOS DOS RENGLONES, y es
                  un pedido: «hacé que la card 2 tenga dos renglones de
                  título».

                  El problema no era la card 2 sola, era la FILA. «Four
                  kitchens in the yard» y «The whole place, closed» caen en dos
                  renglones por largo; «The bar over the river» entra justo en
                  uno. Resultado: dos titulares de dos líneas con uno de una
                  línea en el medio, y el párrafo de esa card arrancando 40px
                  más arriba que los otros dos. La fila se leía desalineada
                  aunque los CTA estuvieran al ras.

                  15ch es el número que parte los TRES en dos renglones: 22, 24
                  y 23 caracteres contra un ancho de 15 obliga al corte en los
                  tres casos, y `text-balance` reparte las palabras para que
                  las dos líneas queden parejas.

                  ⚠️ VA DE `lg` PARA ARRIBA. Por debajo la columna es más
                  angosta que 15ch y los tres se parten solos: clavar el ancho
                  ahí los llevaría a tres o cuatro renglones.
                  ══════════════════════════════════════════════════════════
                */}
                <h3 className="m-0 text-balance font-display text-d4 font-bold uppercase leading-[0.95] text-ink lg:max-w-[15ch] lg:text-d3">
                  {title}
                </h3>
                <p className="m-0 font-body text-dato font-light text-ink">{body}</p>

                {/* El `mt-auto` es la otra mitad de la alineación: empuja el
                    CTA al fondo de la tarjeta, que ahora tiene altura de
                    sobra. Ver la nota del `<li>`. */}
                <span className="mt-auto inline-flex w-fit items-center gap-2.25 border-b-2 border-sunset pt-2 pb-0.75 font-body text-base font-medium text-ink transition-colors duration-200 group-hover:text-sunset-deep">
                  {link}
                  <ArrowRight className="size-3.5 text-sunset-deep transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Link>
            </RevealItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
