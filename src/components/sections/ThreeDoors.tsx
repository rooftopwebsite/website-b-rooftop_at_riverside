import Link from 'next/link';
import Section from '@/components/shared/Section';
import { Accent, Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import { RevealItem, StaggerGroup } from '@/components/shared/Motion';

/**
 * Las tres unidades del lugar, en la forma «Our difference» de Superside.
 *
 * ⚠️ Es una FUSIÓN de dos bloques que decían lo mismo. La home tenía las tres
 * puertas como mini cards pegadas al hero (`INTENTS`) y, cuatro secciones más
 * abajo, otra vez como tres losas oscuras (`ThreeVerticals`). Camila pidió la
 * forma de «Our difference» para las mini cards y, al mirarlo, las dos
 * enumeraban las mismas tres cosas con distinta ropa.
 *
 * Ahora aparecen UNA vez. La pila de losas oscuras se fue entera.
 *
 * ⚠️ Separadas por FILETES de 1px y no por tarjetas. Es el gesto que
 * `docs/design-references.md` tenía anotado como pendiente de wework y
 * superside: «filas de ícono chico + micro-etiqueta en versalitas + título +
 * cuerpo, separadas por filetes de 1px, no por tarjetas pesadas». Con tarjetas
 * volveríamos a las mini cards que Camila quiso cambiar.
 *
 * ⚠️ Los íconos son SVG inline. No hay íconos de bar, música ni eventos en
 * `public/`, y no vale traer un set de terceros: el brief prohíbe emojis y un
 * set genérico se pelea con el isotipo. Trazo de 1.6 y `currentColor`, para que
 * hereden el color del bloque.
 */

/** Trazo común: hereda color y grosor, y nunca se rellena. */
const TRAZO = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

/** Camioncito de dos cajas: es el gesto del isotipo, reducido a línea. */
function IconoTruck() {
  return (
    <svg viewBox="0 0 24 24" className="h-5.5 w-5.5" aria-hidden="true">
      <path d="M1 6h12v9H1z" {...TRAZO} />
      <path d="M13 9h4.5l3.5 3.5V15h-8z" {...TRAZO} />
      <circle cx="6" cy="18" r="2" {...TRAZO} />
      <circle cx="17" cy="18" r="2" {...TRAZO} />
    </svg>
  );
}

/** Copa sobre una línea de horizonte: la barra de arriba. */
function IconoCopa() {
  return (
    <svg viewBox="0 0 24 24" className="h-5.5 w-5.5" aria-hidden="true">
      <path d="M5 3h14l-7 8z" {...TRAZO} />
      <path d="M12 11v8" {...TRAZO} />
      <path d="M8 19h8" {...TRAZO} />
    </svg>
  );
}

/** Recinto con las puertas cerradas: el buyout. */
function IconoRecinto() {
  return (
    <svg viewBox="0 0 24 24" className="h-5.5 w-5.5" aria-hidden="true">
      <path d="M3 20V9l9-5 9 5v11" {...TRAZO} />
      <path d="M3 20h18" {...TRAZO} />
      <path d="M9 20v-6h6v6" {...TRAZO} />
    </svg>
  );
}

/**
 * ⚠️ El cuerpo de cada puerta dice un HECHO verificado y no una promesa. El de
 * «Eat» en particular es la corrección más importante del sitio: la comida no
 * es nuestra, la sirven los trucks. Es la confusión que más caro sale en una
 * venta, y por eso está en la primera de las tres.
 */
const DOORS = [
  {
    href: '/food-trucks',
    kicker: 'Eat',
    icono: IconoTruck,
    title: 'Four kitchens in the yard',
    body: 'Four independent kitchens under the rooftop, each one its own business. You order at the truck — the bar upstairs is ours.',
    cta: 'Meet the trucks',
  },
  {
    href: '/sunset-bar',
    kicker: 'Drink',
    icono: IconoCopa,
    title: 'The bar over the river',
    body: 'Craft cocktails made daily, local drafts, and the best west-facing seat in Bonita Springs.',
    cta: 'See the bar',
  },
  {
    href: '/events',
    kicker: 'Rent',
    icono: IconoRecinto,
    title: 'The whole place, closed',
    body: 'The rooftop, the yard, the patio — or the entire venue with the gates shut, and one person coordinating all of it.',
    cta: 'Plan an event',
  },
] as const;

export default function ThreeDoors() {
  return (
    <Section tone="paper" band="md" labelledBy="doors-title">
      {/*
        ⚠️ TRES COSAS SE FUERON DE ACÁ, y las tres por presupuesto.

        · **El eyebrow «Three places, one gate».** Anunciaba la sección en
          versalitas y el h2 ya lo dice. Los tres de las columnas —Eat, Drink,
          Rent— se quedan: son las tres unidades del negocio, o sea una
          clasificación real.
        · **El acento del titular.** «Three of them» iba en `terra`, y el brief
          permite MÁXIMO DOS titulares acentuados en la home. Ya los usan el h1
          del hero («together») y el h2 de Events banner («for you»), que son
          los dos donde la palabra carga significado. Éste era el tercero: un
          acento en cada título es ruido, no jerarquía.
        · **El centrado.** Pasa a alineado a la izquierda como el resto de la
          home. Era el único encabezado centrado del recorrido y rompía el eje
          de la grilla editorial.
      */}
      <SectionHead
        id="doors-title"
        title="Not a restaurant. Three of them"
        lead="A rooftop bar, a yard of independent kitchens, and a venue you can rent. Same address, three different nights."
      />

      {/*
        Filetes ARRIBA de cada columna y no entre ellas: apilado en mobile, un
        borde lateral no separa nada y uno inferior deja el último huérfano. El
        de arriba funciona en las dos orientaciones sin condicionales.
      */}
      <StaggerGroup as="ul" className="mt-14 grid gap-9 md:grid-cols-3 md:gap-8">
        {DOORS.map(({ href, kicker, icono: Icono, title, body, cta }) => (
          <RevealItem as="li" key={href} className="border-t border-fog pt-5.5">
            <Link href={href} className="group flex h-full flex-col">
              {/* ⚠️ SIN CAJA DETRÁS DEL ÍCONO. Era un cuadrado de 40px con
                  relleno `bone` y radio, o sea una tarjetita chica encima de un
                  bloque que justamente evita las tarjetas. El ícono suelto
                  sobre la superficie es el gesto de WeWork: ícono chico +
                  micro-etiqueta + título + cuerpo, separados por filetes.

                  El hover ya no cambia un relleno: cambia el color del trazo,
                  que es lo único que hay. */}
              <span className="text-deep transition-colors duration-200 group-hover:text-sunset">
                <Icono />
              </span>

              <Eyebrow tone="terra" as="span" className="mt-4 block">
                {kicker}
              </Eyebrow>

              <Heading level={3} className="mt-2">
                {title}
              </Heading>

              <p className="mt-2.5 flex-1 text-base text-body/75">{body}</p>

              {/* No es un `ArrowLink`: la fila entera ya es el link, y anidar
                  uno adentro sería un `<a>` dentro de otro `<a>`. */}
              <span className="mt-4.5 inline-flex items-center gap-2.5 eyebrow text-deep">
                {cta}
                <svg
                  width="16"
                  height="10"
                  viewBox="0 0 16 10"
                  fill="none"
                  aria-hidden="true"
                  className="shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                >
                  <path
                    d="M0 5h14M10 1l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          </RevealItem>
        ))}
      </StaggerGroup>
    </Section>
  );
}
