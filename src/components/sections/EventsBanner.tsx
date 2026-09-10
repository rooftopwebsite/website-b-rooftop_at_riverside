import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from '@/components/shared/Icon';
import { Reveal, RevealItem, StaggerGroup } from '@/components/shared/Motion';

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
 * ⚠️ Y EL PÁRRAFO VA AL LADO DE «FOR YOU», NO DEBAJO DEL TITULAR. Eso es lo
 * que cierra la composición: «For you» está alineado a la derecha, así que
 * deja libre toda la mitad izquierda de su renglón, y ahí entra la bajada. El
 * bloque se lee como una L y no como cuatro cosas apiladas.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ CÓMO SE POSICIONA, porque el prototipo lo hace de una forma que no se
 * puede copiar.
 *
 * El prototipo lo resuelve con `position:absolute; top:100px; width:693px;
 * height:70px` — tres medidas fijas en píxeles, del editor visual. A
 * cualquier ancho distinto del que estaba abierto en Claude Design ese
 * párrafo se monta sobre «For you», porque el titular es fluido (7.5vw) y los
 * 100px no.
 *
 * Acá se ancla al PIE del titular en vez de a una distancia desde arriba:
 * `bottom-0` sobre el bloque del h2. Medido sobre el original a 1440px, el
 * párrafo termina 15px por debajo del titular; con `bottom-0` termina justo
 * al ras, que a esa escala es la misma composición y encima no se despega
 * nunca por más que cambie el cuerpo del titular.
 *
 * ⚠️ SÓLO DESDE `lg`. Por debajo el párrafo vuelve al flujo normal, y no es
 * una concesión: el titular achica con el viewport pero el párrafo no —a
 * 640px el h2 mide 45px de renglón y la bajada necesita cuatro renglones de
 * 17px, o sea que no entra al costado de nada—. Superpuesto ahí, taparía la
 * primera línea del titular.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ EL FONDO ES LISO. NO LLEVA FOTO, Y EL FUENTE DEL DISEÑO SÍ LA DECLARA
 * —un `image-slot` a `opacity:0.28` con el brief «private event on the
 * rooftop»—. Es decisión de Camila, tomada sobre la página renderizada, y
 * conviene que quede escrita para que nadie la «restaure» leyendo el
 * prototipo.
 *
 * El motivo se ve apenas se prueba: en el canvas de Claude Design ese slot
 * está VACÍO, así que la banda que se diseñó y se aprobó es un campo de
 * verde plano. Con una foto real al 28 % encima, la banda deja de ser una
 * superficie y se vuelve un fondo con textura — y esta sección es la que
 * más texto grande tiene de toda la home: un titular a dos alturas, una
 * bajada, un CTA y tres tarjetas. Todo eso sobre una foto compite.
 *
 * Se probaron dos tomas antes de sacarla del todo: la aérea del patio, que
 * al ser de día LAVA el verde y le saca a la home su segunda superficie
 * oscura; y una de noche, que no lavaba pero seguía ensuciando el campo
 * detrás de las tarjetas. El liso gana en las dos comparaciones.
 *
 * ⚠️ Y de yapa: la banda deja de bajar una foto de 100vw que no se llegaba a
 * ver, y `overflow-hidden` en la sección deja de tener que recortarla.
 * ══════════════════════════════════════════════════════════════════════════
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
      <div className="caja-ancha relative">
        {/* ⚠️ El titular, la bajada y el sello entran JUNTOS. La bajada está
            anclada al pie del titular, así que si entraran por separado se
            moverían una respecto de la otra durante la animación y el ancla
            se vería trabajando. */}
        <Reveal className="relative">
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

          {/*
            La bajada. En flujo hasta `lg`; de ahí para arriba se ancla al pie
            del titular y ocupa la mitad izquierda que «For you» deja libre.
            Ver el bloque del encabezado.

            ⚠️ EL ANCHO ES `62ch` Y NADA MÁS, y hubo que llegar hasta acá
            midiendo. La primera versión lo topeaba además con un `46%` «por
            las dudas», y ese tope era el que rompía la composición: a 592px
            en vez de 693 el texto cae en TRES renglones en vez de dos, el
            párrafo pasa a medir 102px contra los 93 que mide un renglón del
            titular, y se sube a tapar la primera línea. Medido a 1024, 1280,
            1440 y 1920.

            `62ch` funciona en los cuatro anchos porque `ch` escala con el
            cuerpo del texto: son siempre ~72 caracteres por renglón, o sea
            siempre dos renglones, mida lo que mida la pantalla. Un tope en
            porcentaje no escala con la tipografía y por eso pelea con él.
          */}
          <p className="mt-7 max-w-[62ch] font-body text-lead font-light text-paper lg:absolute lg:bottom-0 lg:left-0 lg:mt-0">
            Holiday parties, client nights, fundraisers and reunions. You get the rooftop, the yard
            and four kitchens, and one person coordinating all of it.
          </p>

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
        </Reveal>

        <Link
          href="/events/inquire"
          className="mt-7 flex min-h-11 w-fit items-center gap-2.5 rounded-pill bg-sunset px-8 py-4 font-body text-dato font-medium text-ink transition-colors duration-200 hover:bg-sunset-hover lg:mt-11"
        >
          Plan your event
          <ArrowRight className="size-4" />
        </Link>

        <StaggerGroup as="ul" className="mt-9 grid list-none grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 p-0 lg:mt-15">
          {CARDS.map(({ title, src, alt }) => (
            <RevealItem as="li" key={src} className="group flex flex-col overflow-hidden rounded-shell bg-deeper">
              <div className="relative h-45 bg-ink lg:h-60">
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="(min-width: 1024px) 420px, 100vw"
                  className="object-cover transition-transform duration-500 ease-brand group-hover:scale-104"
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
            </RevealItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
