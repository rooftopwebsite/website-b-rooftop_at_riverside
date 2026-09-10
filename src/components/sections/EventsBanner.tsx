import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from '@/components/shared/Icon';

/**
 * «We close the whole place / For you» — la banda de eventos privados.
 *
 * Es la vertical que más factura y la segunda (y última) superficie oscura de
 * la home. Va después de las tres puertas: primero se explica qué es el
 * lugar, después se ofrece alquilarlo entero.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ EL TITULAR ES UNA SOLA FRASE PARTIDA EN DOS BLOQUES DESALINEADOS, y esa
 * es toda la idea de la sección.
 *
 *     «We close the whole place»   a la izquierda, en blanco
 *     «For you»                    a la derecha, en naranja
 *
 * La frase se completa cruzando la pantalla. No es un efecto: es que el
 * argumento tiene dos mitades —lo que hacemos, para quién— y el desalineado
 * las separa sin partir la oración. Con las dos alineadas a la izquierda es
 * un titular de dos renglones más y se pierde.
 *
 * ⚠️ EL PÁRRAFO VA EN FLUJO Y NO EN ABSOLUTO. En el prototipo estaba
 * posicionado con `position:absolute; top:100px; height:70px` — un artefacto
 * del editor visual, no una decisión: a cualquier ancho distinto del que
 * estaba abierto en Claude Design, ese párrafo se monta sobre «For you». Va
 * después de las dos mitades del titular, que es donde se lee.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ LA FOTO DE FONDO AL 28 % Y SIN BLUR — antes era `blur-[22px]` con una
 * capa de `deep/90` encima. Con las tarjetas nuevas apoyadas sobre la banda,
 * el desenfoque dejaba de leerse como foto y pasaba a leerse como una mancha
 * verde: la sección perdía el único lugar donde se ve el venue lleno. Al
 * 28 % de opacidad sobre `deep` la foto se distingue y el texto encima sigue
 * midiendo lo mismo, porque la superficie de referencia del contraste sigue
 * siendo `deep` opaco debajo.
 *
 * ⚠️ Y TIENE QUE SER UNA FOTO DE NOCHE. La primera versión usó la aérea del
 * patio entero, razonando que «para un bloque que dice cerramos el lugar
 * completo, la toma correcta es la que muestra el lugar completo». Se ve en
 * pantalla que no: la aérea es de día y a pleno sol, y al 28 % sobre `deep`
 * lo que hace es LAVAR la banda — el verde profundo se vuelve un verde claro
 * lechoso y la única superficie oscura de la mitad de abajo de la home deja
 * de serlo.
 *
 * El slot del diseño pide «private event on the rooftop», que es una mesa
 * larga de gente a la noche. Ésta es esa toma, y además es oscura, así que
 * suma atmósfera sin tocar el contraste del texto.
 *
 * ⚠️ El `pb` grande de abajo NO es aire decorativo: la sección siguiente
 * (`FindUs`) se le monta encima con `-mt-22`, y encima de eso las tarjetas
 * tienen que terminar bastante antes del borde o quedan cortadas por el arco.
 */

/**
 * ⚠️ CADA FOTO MUESTRA LO QUE DICE SU TÍTULO, y esto hubo que corregirlo
 * mirando la página. La primera versión repartió las fotos por «esto parece
 * un evento» y quedó una clase de yoga al aire libre ilustrando «coordinamos
 * los camiones» y una barra ilustrando «el lugar entero con los portones
 * cerrados». Tres fotos de eventos genéricos debajo de tres frases muy
 * concretas no acompañan al texto: lo contradicen.
 *
 * Ahora es literal: camiones / barra / el lugar completo. Y la aérea —que
 * salió del fondo de esta misma sección por ser de día— encuentra acá su
 * lugar, que es donde el texto habla justamente del lugar completo.
 */
const CARDS = [
  {
    title: 'We coordinate the trucks, so you deal with one person and not four vendors',
    src: '/images/venue/truck-window-night.jpg',
    alt: 'A food truck window in the yard at night',
  },
  {
    title: 'The bar is ours: open bar, drink tickets or consumption, however you want to run it',
    src: '/images/venue/wall-bartender.jpg',
    alt: 'A bartender making cocktails at the Sunset Bar',
  },
  {
    title: 'The rooftop, the yard, the patio — or the entire venue with the gates shut',
    src: '/images/venue/wall-dancing-night.jpg',
    alt: 'Guests dancing at a private party at Rooftop at Riverside',
  },
] as const;

/*
 * ⚠️ Y NO la aérea del patio, aunque «el lugar entero» la pida literalmente.
 * La aérea ya es la foto del hero, tres pantallas más arriba, y repetirla en
 * la misma página la gasta: la segunda vez deja de ser el establecimiento del
 * lugar y pasa a leerse como que no hay más material. Ésta es una fiesta de
 * noche con gente vestida, que además es lo que alguien que está evaluando
 * alquilar el venue quiere ver.
 */

export default function EventsBanner() {
  return (
    <section
      id="events"
      aria-labelledby="events-banner-title"
      className="relative overflow-hidden rounded-t-band bg-deep pt-14 pb-30 text-bone on-dark lg:pt-28 lg:pb-46"
    >
      <div aria-hidden="true" className="absolute inset-0 opacity-28">
        <Image
          src="/images/venue/event-yard-night.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="caja-ancha relative">
        <div className="relative">
          <h2 id="events-banner-title" className="m-0 font-display text-banda font-extrabold uppercase leading-[0.86]">
            {/*
              ⚠️ Las dos mitades son UN SOLO h2. Visualmente están separadas y
              alineadas a lados opuestos, pero es una frase: partirla en dos
              encabezados metería «For you» en el índice de la página como si
              fuera una sección.
            */}
            <span className="block text-paper">We close the whole place</span>
            <span className="block pr-27 text-right text-sunset lg:pr-39">For you</span>
          </h2>

          {/* El sello. Se corre hacia arriba sobre el titular, que es donde el
              diseño lo apoya: en el aire que deja «For you» al alinearse a la
              derecha. */}
          <Image
            src="/brand/badge-sun-teal.svg"
            alt=""
            width={113}
            height={113}
            className="absolute top-40 right-6 z-40 hidden size-28 -translate-y-[45%] lg:block"
          />
        </div>

        <p className="mt-7 max-w-[62ch] font-body text-lead font-light text-paper lg:mt-11">
          Holiday parties, client nights, fundraisers and reunions. You get the rooftop, the yard
          and four kitchens, and one person coordinating all of it.
        </p>

        <Link
          href="/events/inquire"
          className="mt-7 flex min-h-11 w-fit items-center gap-2.5 rounded-pill bg-sunset px-8 py-4 font-body text-dato font-medium text-ink transition-colors duration-200 hover:bg-sunset-hover lg:mt-11"
        >
          Plan your event
          <ArrowRight className="size-4" />
        </Link>

        <ul className="mt-9 grid list-none grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 p-0 lg:mt-15">
          {CARDS.map(({ title, src, alt }) => (
            <li key={src} className="flex flex-col overflow-hidden rounded-shell bg-deeper">
              <div className="relative h-45 bg-ink lg:h-60">
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="(min-width: 1024px) 420px, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-4 px-6.5 pt-6 pb-7">
                <h3 className="m-0 font-display text-d5 font-bold uppercase leading-[1.02] text-paper">
                  {title}
                </h3>
                {/*
                  ⚠️ La flecha NO es un link. Las tres tarjetas describen el
                  MISMO servicio desde tres ángulos y las tres irían al mismo
                  destino que el CTA de arriba: tres links idénticos apilados
                  bajo un botón que dice lo mismo es ruido para quien tabula.
                  Queda como remate visual, y `aria-hidden`.
                */}
                <span
                  aria-hidden="true"
                  className="mt-auto grid size-11 place-items-center rounded-pill text-cream ring-1 ring-muted-dark"
                >
                  <ArrowRight className="size-4.5" />
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
