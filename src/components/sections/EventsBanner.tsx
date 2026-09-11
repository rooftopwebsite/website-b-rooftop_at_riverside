import Image from 'next/image';
import { ButtonLink } from '@/components/shared/Button';
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
    title: 'The rooftop, the yard, the patio, or the entire venue with the gates shut',
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
      /*
        ⚠️ SE FUE `overflow-hidden`, Y NO ES COSMÉTICO: era lo que impedía el
        apilado de las tarjetas.

        `position: sticky` se ancla al ancestro que scrollea más cercano, y un
        `overflow: hidden` convierte a su elemento en uno de esos. Con el
        recorte acá, las tarjetas se anclaban a ESTA sección —que no scrollea—
        y el sticky no hacía absolutamente nada.

        Sacarlo no rompe nada porque ya no recortaba nada: estaba para la foto
        de 100vw que la banda tenía de fondo, y esa foto se fue cuando la banda
        pasó a ser lisa. Está dicho en el bloque de arriba, textual: «la banda
        deja de bajar una foto de 100vw que no se llegaba a ver, y
        `overflow-hidden` en la sección deja de tener que recortarla». Era
        código muerto esperando a estorbar.
      */
      className="relative rounded-t-band bg-deep pt-14 pb-cierre-arco text-bone on-dark lg:pt-28"
    >
      <div className="caja-ancha relative">
        {/* ⚠️ El titular, la bajada y el sello entran JUNTOS. La bajada está
            anclada al pie del titular, así que si entraran por separado se
            moverían una respecto de la otra durante la animación y el ancla
            se vería trabajando. */}
        <Reveal className="relative">
          {/*
            ⚠️ EL CUERPO SE TOPEA EN 105,6px Y NO EN LOS 112 DE `text-banda`,
            y el culpable es el sello. `--text-banda` es
            `clamp(2.8rem, 7vw, 7rem)`, así que abajo de 1508px esto da
            exactamente lo mismo que el token; arriba deja de crecer.

            La cuenta: «We close the whole place» mide 10,75em y el rombo se
            lleva otros 0,96em —`0.814em` de caja más `0.15em` de separación—,
            o sea 11,71em de renglón contra una `caja-ancha` que topea en
            1280px. A 112px eso da 1311 y el renglón se parte: medido, a 1568
            el titular pasaba a TRES renglones y «For you» quedaba colgado
            lejos del resto de la frase. A 105,6px da 1236, con 44px de
            holgura.

            ⚠️ El tope tiene que moverse si cambia el TEXTO del titular o el
            tamaño del sello. Las dos cosas están en este mismo archivo.
          */}
          <h2
            id="events-banner-title"
            className="m-0 font-display text-[clamp(2.8rem,7vw,6.6rem)] font-extrabold uppercase leading-[0.86]"
          >
            {/*
              ⚠️ Las dos mitades son UN SOLO h2. Visualmente están separadas y
              alineadas a lados opuestos, pero es una frase: partirla en dos
              encabezados metería «For you» en el índice de la página como si
              fuera una sección.
            */}
            <span className="block text-paper">
              We close the whole place
              {/*
                El sello, PEGADO AL FINAL DEL PRIMER RENGLÓN.

                ⚠️ VA EN EL FLUJO DEL TEXTO Y NO POSICIONADO, y ésa es toda la
                diferencia. Una versión anterior lo colgaba del margen derecho
                con `absolute right-6`: a cada ancho de pantalla el titular
                mide otra cosa —es fluido, 7.5vw— así que el hueco entre
                «place» y el sello cambiaba solo, y a 1920 quedaban 300px de
                aire en el medio. Como una palabra más del renglón, la
                distancia es siempre la misma.

                ⚠️ LAS TRES MEDIDAS SALEN DE LA TIPOGRAFÍA:

                  · `h-[0.814em]` es la altura de mayúscula de la Anton a este
                    cuerpo —82px medidos sobre 100.8 de `font-size`—, así que
                    el rombo mide exactamente lo que mide una letra del
                    renglón.
                  · `align-baseline` lo apoya en la línea de base. Con esa
                    altura, la caja del rombo ocupa EXACTAMENTE la banda de la
                    mayúscula: no hay que centrarlo a mano ni corregir nada
                    cuando cambia el cuerpo.
                  · `ml-[0.15em]` es el espacio entre palabras del titular. El
                    rombo se separa de la «e» lo mismo que se separan dos
                    palabras, que es lo que lo hace leer como parte del
                    renglón y no como un adorno apoyado al lado.

                Las tres en `em`, así que el conjunto sigue al titular fluido
                sin repetir el `clamp` de `--text-banda`.

                ⚠️ `inline-block` y no `block`: en flujo, `block` lo bajaría a
                un renglón propio y partiría el titular en tres.

                ⚠️ APARECE RECIÉN EN `desk` (1344) Y NO EN `lg` (1024). Entre
                esos dos anchos el titular ya ocupa casi todo el renglón, así
                que el rombo caía justo encima de «For you» —verificado en
                captura a 1024—. De 1344 para arriba sobra renglón y el sello
                queda donde fue compuesto.
              */}
              <Image
                src="/brand/badge-sun-teal.svg"
                alt=""
                width={113}
                height={113}
                className="ml-[0.15em] hidden size-[0.814em] align-baseline desk:inline-block"
              />
            </span>
            {/*
              ⚠️ SIN `pr`: «For you» va AL RAS del ancho máximo de contenido.
              Antes llevaba `pr-27 lg:pr-39` —108/156px— para dejarle lugar al
              sello, que estaba apoyado sobre este renglón. Con el sello subido
              al primero ese hueco ya no protege nada: sólo despegaba la
              palabra del borde y le sacaba a la composición su lado derecho.

              Alineado al ras, «For you» y el margen de la caja son la misma
              línea vertical, y el desalineado de las dos mitades del titular
              pasa a medirse contra algo.
            */}
            {/*
              ⚠️ A LA IZQUIERDA HASTA `desk` Y A LA DERECHA DE AHÍ PARA ARRIBA.
              El desalineado de las dos mitades es la composición, pero sólo se
              lee como tal cuando el primer renglón llega lejos: apilado en
              mobile, «We close the whole place» ocupa tres renglones cortos y
              un «For you» pegado al margen derecho deja de ser un remate y
              pasa a leerse como una palabra suelta que se cayó de la frase.
            */}
            <span className="block text-sunset desk:text-right">For you</span>

          </h2>

          {/*
            La bajada. En flujo hasta `desk`; de ahí para arriba se ancla al pie
            del titular y ocupa la mitad izquierda que «For you» deja libre.
            Ver el bloque del encabezado.

            ⚠️ EL ANCLA ARRANCA EN `desk` (1344) Y NO EN `lg` (1024), y el
            cambio arregla un choque real. Entre 1024 y 1343 el titular entra
            en dos renglones apretados y el párrafo absoluto se metía en la
            misma banda que «For you»: a 1024 el texto quedaba literalmente
            debajo de la palabra naranja, con el rombo encima. Verificado en
            captura. De 1344 para arriba el titular deja libre la mitad
            izquierda del segundo renglón, que es el hueco que este párrafo
            viene a ocupar.

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
          <p className="mt-7 max-w-[62ch] font-body text-lead font-light text-paper desk:absolute desk:bottom-0 desk:left-0 desk:mt-0">
            Holiday parties, client nights, fundraisers and reunions. You get the rooftop, the yard
            and four kitchens, and one person coordinating all of it.
          </p>

        </Reveal>

        {/* ⚠️ Era un `<Link>` con las clases del botón copiadas a mano. Ahora
            es el componente, como los otros 60 CTA del sitio: la letra, el
            tamaño, el alto y el radio salen de un solo lugar. Ver el
            encabezado de `Button.tsx`. */}
        <ButtonLink href="/events/inquire" variant="primary" size="lg" className="mt-7 lg:mt-11">
          Plan your event
          <ArrowRight className="size-4" />
        </ButtonLink>

        {/*
          ⚠️ EL SALTO A TRES COLUMNAS ES EN `lg` Y NO EN `md`. Es la misma
          regla que ya está escrita en `YardSteps`: 1 columna y después 3, sin
          pasar por 2, y el salto tarde cuando la tarjeta viene cargada. Estos
          titulares son largos —«The bar is ours: open bar, drink tickets or
          consumption, however you want to run it»— y a 768px en tres columnas
          de 227px caían en SEIS renglones cada uno. Apiladas a ancho completo
          entran en tres.
        */}
        {/*
          ══════════════════════════════════════════════════════════════════
          ⚠️ EN MOBILE Y TABLET LAS TARJETAS SE APILAN UNA SOBRE OTRA AL
          SCROLLEAR. Pedido de Camila, con la referencia a mano: el bloque
          «However you show up» de showdown-social.

          El mecanismo es CSS puro y son dos líneas: la lista deja de ser
          grilla y pasa a ser una columna, y cada tarjeta es `sticky` con un
          `top` un escalón más abajo que la anterior. Al scrollear, cada una se
          clava y la siguiente le pasa por encima —el orden de pintado lo da el
          DOM, así que la de abajo tapa a la de arriba sin necesidad de
          `z-index`— y de las que quedaron abajo se sigue viendo el borde.

          ⚠️ NO LLEVA JAVASCRIPT. No hay que medir nada ni escuchar el scroll:
          esto es `position: sticky` haciendo exactamente lo que hace.

          ⚠️ LAS TARJETAS TIENEN QUE SER OPACAS o el apilado se ve como un
          amontonamiento translúcido. Lo son: `bg-deeper`.

          ⚠️ En `lg` vuelve a ser la grilla de tres columnas y el `sticky` se
          apaga con `lg:static`. Con las tres a la vista no hay nada que
          apilar, y el `top` de cada una deja de aplicar solo.
          ══════════════════════════════════════════════════════════════════
        */}
        <StaggerGroup as="ul" className="mt-bloque flex list-none flex-col gap-6 p-0 lg:grid lg:grid-cols-3">
          {CARDS.map(({ title, src, alt }, i) => (
            <RevealItem
              as="li"
              key={src}
              /*
                ⚠️ El `top` va inline porque DEPENDE DEL ÍNDICE, que es
                justamente el caso para el que `RevealItem` acepta `style` —
                ver la nota de esa prop en `Motion.tsx`—. Una clase por
                posición no existiría en el CSS emitido: Tailwind no ve las
                plantillas armadas en runtime.

                2rem de base para que la tarjeta clavada no quede al ras del
                borde de la pantalla, y 0.875rem (14px) de escalón, que es lo
                que queda a la vista de cada tarjeta tapada.
              */
              style={{ top: `calc(2rem + ${i} * 0.875rem)` }}
              className="group sticky flex flex-col overflow-hidden rounded-shell bg-deeper sombra-card lg:static"
            >
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
