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
 * ⚠️ EL ACENTO ES `terra` Y NO `sunset`, Y ES LA ÚNICA DESVIACIÓN DELIBERADA
 * RESPECTO DEL DISEÑO DE ORIGEN. Vale para los cuatro lugares donde el
 * prototipo pone naranja como color de TEXTO sobre superficie clara: este
 * titular, la placa «TOGETHER» del hero, «Across from Riverside Park» en
 * `FindUs` y los hovers de la nav.
 *
 * El motivo está medido, no es una preferencia:
 *
 *     #F58521 sobre #FAF6EA  →  2.35:1
 *     #E0741A sobre #FAF6EA  →  2.90:1
 *     mínimo WCAG AA para texto grande  →  3:1
 *
 * O sea que ni siquiera pasa el umbral de titular de 100px, que es el más
 * permisivo que existe. `npm run a11y` lo marcó en 12 nodos de 8 páginas.
 *
 * `sunset` es un tono medio: funciona como RELLENO con texto negro encima
 * (8.26:1) y por eso el diseño lo usa bien en los botones, los campos y los
 * subrayados — todo eso se conserva tal cual. Lo que no puede es ser tinta
 * sobre claro, y esa regla ya estaba escrita y medida en este repo antes del
 * rediseño: `COLOR_RULES.neverAsTextOnLight` y
 * `COLOR_RULES.headlineAccent = { onLight: 'terra', onDark: 'sunset' }`.
 *
 * `terra` (#A62000) da 7.43:1, es el mismo naranja quemado de la familia y es
 * literalmente el token que el repo tiene para este caso. Sobre las bandas
 * OSCURAS el acento sigue siendo `sunset`, que ahí da 4.26:1 y pasa — ver
 * `WhatsOn` y `EventsBanner`, que no se tocaron.
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
    body: 'Four independent kitchens under the rooftop, each one its own business. You order at the truck — the bar upstairs is ours.',
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
    body: 'The rooftop, the yard, the patio — or the entire venue with the gates shut, and one person coordinating all of it.',
    link: 'Plan an event',
    href: '/events',
    field: 'bg-river',
    Icon: Balloons,
  },
];

export default function ThreeDoors() {
  return (
    <section aria-labelledby="doors-title" className="bg-bone pt-16 pb-10 lg:pt-30 lg:pb-18">
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
            <span className="text-terra">Three of them</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[60ch] text-center font-body text-lead font-light text-ink">
            A rooftop bar, a yard of independent kitchens, and a venue you can rent. Same address,
            three different nights.
          </p>
        </Reveal>

        <StaggerGroup as="ul" className="mt-10 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-3 lg:mt-18">
          {DOORS.map(({ title, body, link, href, field, Icon }) => (
            <RevealItem as="li" key={href}>
              <Link href={href} className="group flex flex-col gap-3">
                <div
                  className={`relative mb-2.5 grid h-50 place-items-center overflow-hidden rounded-door lg:h-65 ${field}`}
                >
                  {/* ⚠️ El icono crece un 6 % en el hover y NADA MÁS se mueve.
                      El campo de color es la mitad de la tarjeta: escalarlo
                      entero movería el título y el párrafo de abajo, y una
                      tarjeta que se reacomoda al pasar el mouse se lee como
                      inestable. Sólo respira el dibujo. */}
                  <Icon className="size-18 text-ink transition-transform duration-300 ease-brand group-hover:scale-106 lg:size-26" />
                  {/*
                    La flecha es DECORATIVA: el destino ya lo dice el título y
                    el texto de abajo. Con `aria-hidden` en el `<span>` no se
                    anuncia dos veces.
                  */}
                  <span
                    aria-hidden="true"
                    className="absolute right-3.5 bottom-3.5 grid size-13.25 place-items-center rounded-pill bg-bone text-ink transition-transform duration-200 group-hover:-translate-y-1"
                  >
                    <ArrowUpRight />
                  </span>
                </div>

                <h3 className="m-0 font-display text-d4 font-bold uppercase leading-[0.95] text-ink lg:text-d3">
                  {title}
                </h3>
                <p className="m-0 font-body text-dato font-light text-ink">{body}</p>

                <span className="mt-2 inline-flex w-fit items-center gap-2.25 border-b-2 border-sunset pb-0.75 font-body text-base font-medium text-ink transition-colors duration-200 group-hover:text-terra">
                  {link}
                  <ArrowRight className="size-3.5 text-terra transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Link>
            </RevealItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
