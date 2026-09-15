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
 * Tres campos de color planos y distintos hacen el trabajo contrario.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ EL CAMPO ERA UN PASTEL CON UN ICONO DE 104px EN EL MEDIO, Y ESO SE FUE.
 * Pedido de Camila, 2026-09-15: «si vemos esta sección así aislada, en serio
 * parece que le faltaría algo, y se ve como estilo bebé, quizá por los colores
 * no sé; me gusta el botón circular superpuesto, pero quizá si incluís el
 * título dentro del cuadrado... hagamos algo diferente acá».
 *
 * El diagnóstico es correcto y tiene dos causas, no una:
 *
 *   1. LOS TRES PASTELES TIENEN EL MISMO VALOR. `mint`, `cream` y `river`
 *      miden 91 %, 93 % y 68 % de luminosidad: tres campos claros, saturados y
 *      planos, uno al lado del otro. Esa combinación —color saturado, valor
 *      alto, sin sombra ni textura— es literalmente la paleta de una ficha de
 *      jardín de infantes, y no es un juicio de gusto: es lo que hace que el
 *      bloque no se parezca a NINGUNA otra sección de la home, que se apoya
 *      toda en `bone`, `deep` e `ink`.
 *
 *   2. EL CAMPO NO DICE NADA. Ocupaba la mitad de la tarjeta y llevaba un solo
 *      dibujo de línea centrado. Todo el contenido real —título, párrafo,
 *      link— vivía DEBAJO, en una pila plana. De ahí el «parece que le
 *      faltaría algo»: la mitad de la tarjeta era decoración.
 *
 * Lo que se hace, en tres movimientos:
 *
 *   · LA PALETA PASA A SER LA DEL LOGO. `deep`, `sunset` y `cream` son los
 *     tres colores del sticker que está arriba de todo en esta misma página.
 *     Además de ser de marca, resuelven el problema técnico: tienen valores
 *     SEPARADOS (12 %, 62 %, 93 %), así que las tres puertas se distinguen por
 *     claro/oscuro y no sólo por matiz. El pastel distinguía por matiz nomás, y
 *     por eso las tres se leían como el mismo material.
 *
 *   · EL TÍTULO SE MUDA ADENTRO DEL CAMPO. Es la sugerencia textual de Camila
 *     y es lo que convierte el campo en la tarjeta: deja de ser una ilustración
 *     con texto abajo y pasa a ser una placa con nombre. Abajo queda lo que de
 *     verdad va abajo: la explicación y el link.
 *
 *   · EL ICONO SE VA ARRIBA A LA IZQUIERDA Y BAJA A 44px. Deja de ser el
 *     sujeto del campo y pasa a ser lo que siempre fue: una marca de qué unidad
 *     es. Arriba el icono, abajo el nombre, es la composición de cualquier
 *     placa — y el hueco del medio lo ocupa el color, que ahora sí tiene
 *     suficiente valor para sostenerse solo.
 *
 * ⚠️ EL BOTÓN CIRCULAR SUPERPUESTO SE QUEDA TAL CUAL. Camila lo nombró como lo
 * que le gusta, y además es el recurso que ata esta sección con el troquel del
 * logo y con el mordisco del resto del sitio. Lo único que cambia es el color
 * del hover: ver la nota del `<span>`.
 *
 * ⚠️ NO SE INVENTÓ UNA SOLA PALABRA. Los tres títulos, los tres párrafos y los
 * tres links son los mismos de antes, letra por letra. El cambio es de
 * composición y de paleta.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ LA TARJETA ENTERA ES UN SOLO LINK. En el prototipo el `<article>` tenía
 * el campo de color, el título, el párrafo y ABAJO un link de texto: cuatro
 * elementos donde sólo uno era clickeable, con una flecha dibujada arriba a
 * la derecha que parecía otro botón y no lo era. Acá el `<Link>` envuelve
 * todo, la flecha del campo es parte del mismo destino, y el texto de abajo
 * sigue existiendo como AFFORDANCE —dice adónde va— pero ya no es un segundo
 * target. Un solo destino, un solo tab stop.
 */

interface Door {
  readonly title: string;
  readonly body: string;
  readonly link: string;
  readonly href: string;
  /** El campo de color. Es una clase y no un hex: la paleta vive en el tema. */
  readonly field: string;
  /**
   * La tinta de ADENTRO del campo: título e icono.
   *
   * ⚠️ VA POR PUERTA Y NO ES UNA SOLA CLASE PARA LAS TRES, porque los tres
   * campos tienen valores distintos a propósito. Los ratios, medidos:
   *
   *     paper sobre deep     12.42:1
   *     ink   sobre sunset    8.26:1
   *     ink   sobre cream    15.83:1
   *
   * Los tres pasan AAA. Es la ventaja de haber elegido colores con valores
   * separados: no hay ninguno que obligue a un tamaño mínimo.
   */
  readonly tinta: string;
  /** El icono, un escalón más suave que el título. Nunca una opacidad: ver la nota. */
  readonly tintaIcono: string;
  readonly Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const DOORS: readonly Door[] = [
  {
    title: 'Four kitchens in the yard',
    body: 'Four independent kitchens under the rooftop, each one its own business. You order at the truck. The bar upstairs is ours.',
    link: 'Meet the trucks',
    href: '/food-trucks',
    field: 'bg-deep',
    tinta: 'text-paper',
    tintaIcono: 'text-cream',
    Icon: Truck,
  },
  {
    title: 'The bar over the river',
    body: 'Craft cocktails made daily, local drafts, and the best west-facing seat in Bonita Springs.',
    link: 'See the bar',
    href: '/sunset-bar',
    field: 'bg-sunset',
    tinta: 'text-ink',
    tintaIcono: 'text-ink',
    Icon: Martini,
  },
  {
    title: 'The whole place, closed',
    body: 'The rooftop, the yard, the patio, or the entire venue with the gates shut, and one person coordinating all of it.',
    link: 'Plan an event',
    href: '/events',
    field: 'bg-cream',
    tinta: 'text-ink',
    tintaIcono: 'text-deep',
    Icon: Balloons,
  },
];

export default function ThreeDoors() {
  return (
    <section
      aria-labelledby="doors-title"
      className="relative bg-bone grano pt-16 pb-cierre lg:pt-30"
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
          {DOORS.map(({ title, body, link, href, field, tinta, tintaIcono, Icon }) => (
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
                <div className="relative mb-2.5 h-64 lg:h-80">
                  {/*
                    ⚠️ EL CAMPO ES AHORA UNA PLACA CON NOMBRE: icono arriba,
                    título abajo, `justify-between` entre los dos. Ver la nota
                    larga del encabezado del archivo.

                    ⚠️ EL `pr` DEL TÍTULO NO ES ARBITRARIO: el mordisco saca un
                    círculo de 62px de radio efectivo en la esquina inferior
                    derecha, así que el último renglón del título tiene que
                    frenar antes. Son 56px + el padding, que deja el filo del
                    hueco libre en las tres puertas.
                  */}
                  <div
                    className={`mordisco flex size-full flex-col justify-between overflow-hidden rounded-door p-6 lg:p-7 ${field}`}
                  >
                    {/* ⚠️ El icono crece un 6 % en el hover y NADA MÁS se mueve.
                        El campo de color es la mitad de la tarjeta: escalarlo
                        entero movería el título y el párrafo de abajo, y una
                        tarjeta que se reacomoda al pasar el mouse se lee como
                        inestable. Sólo respira el dibujo. */}
                    <Icon
                      className={`size-11 shrink-0 origin-top-left transition-transform duration-300 ease-brand group-hover:scale-106 lg:size-13 ${tintaIcono}`}
                    />

                    {/*
                      ⚠️ `text-balance` — pedido de Camila junto con la
                      alineación de los CTA. Reparte las palabras entre los
                      renglones en vez de llenar el primero y dejar la última
                      palabra sola abajo.

                      ⚠️ EL `max-w-[13ch]` ES LO QUE FUERZA LOS DOS O TRES
                      RENGLONES EN LAS TRES PUERTAS, y hereda el motivo del
                      `max-w-[15ch]` que el título tenía cuando vivía afuera:
                      «The bar over the river» entra en un renglón y los otros
                      dos no, así que sin tope la fila quedaba con un título de
                      una línea entre dos de dos. Acá adentro importa más
                      todavía, porque el título apoya en el piso del campo: un
                      título de una línea deja el campo medio vacío al lado de
                      dos que llegan hasta el medio.
                    */}
                    <h3
                      className={`m-0 mt-5 max-w-[13ch] text-balance pr-14 font-display text-d4 font-bold uppercase leading-[0.92] lg:text-d3 ${tinta}`}
                    >
                      {title}
                    </h3>
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

                    ══════════════════════════════════════════════════════════
                    ⚠️ EL `ring-1 ring-ink/12` ES POR LA PUERTA DE CREMA Y POR
                    NINGUNA OTRA. `cream` contra `bone` da 1.08:1 —el mismo par que
                    separa `bone` de `paper` en el resto del sitio— así que el círculo
                    troquelado de la tercera puerta se apoyaba sobre una página
                    prácticamente del mismo valor y el recurso desaparecía. El filete
                    le dibuja el canto. Sobre `deep` y sobre `sunset` un 12 % de negro
                    no se ve, y por eso puede ir en las tres sin una excepción.

                    ⚠️ EL HOVER PASÓ DE `sunset` A `ink`, Y ES CONSECUENCIA DE
                    LA PALETA NUEVA. Con los pasteles, pintar el círculo de
                    naranja era el único acento fuerte de la sección. Ahora la
                    puerta del medio YA es naranja: su círculo pasaba de
                    naranja a naranja, o sea que el hover no hacía nada en una
                    de las tres.

                    `ink` funciona en las tres porque es el valor más oscuro de
                    la paleta y ninguno de los tres campos lo es: sobre `deep`
                    da 2.35:1 de campo contra círculo —que alcanza y sobra para
                    un cambio de estado, que no es texto— y la flecha va en
                    `paper`, 17.11:1 contra el círculo. El acento naranja de la
                    sección se conserva donde siempre estuvo: el filete del CTA
                    de abajo.
                    ══════════════════════════════════════════════════════════
                  */}
                  <span
                    aria-hidden="true"
                    className={`absolute right-1 bottom-1 grid size-13.25 place-items-center rounded-pill ring-1 ring-ink/12 transition-colors duration-300 ease-brand group-hover:bg-ink group-hover:text-paper ${field} ${tintaIcono}`}
                  >
                    <ArrowUpRight />
                  </span>
                </div>

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
