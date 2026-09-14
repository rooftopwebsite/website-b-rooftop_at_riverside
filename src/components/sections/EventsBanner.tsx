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
/**
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ CADA TARJETA TIENE TRES PIEZAS Y ANTES TENÍA UNA, y el texto es EL MISMO:
 * no se escribió una palabra nueva, se partió la frase que ya estaba.
 *
 *     'We coordinate the trucks, so you deal with one person and not four vendors'
 *      └──────── tag + title ────────┘ └──────────── body ─────────────────┘
 *
 * El motivo es el nuevo comportamiento de la tarjeta: el título se lee siempre
 * y el resto aparece al pasar el mouse. Para que eso funcione, lo que queda a
 * la vista tiene que ser una frase CERRADA —«We coordinate the trucks»— y no
 * el principio de una que se corta. Una frase partida al medio con puntos
 * suspensivos invisibles se lee como un error de maquetación.
 *
 * ⚠️ EL `tag` ES LA UNIDAD DE NEGOCIO, no un adjetivo de relleno. Los trucks,
 * la barra y el venue son tres cosas que se contratan por separado, y es
 * exactamente el mismo rótulo que usan los tickets de `YardSteps` para decir
 * quién cobra cada cosa. Repetir ese vocabulario entre secciones es lo que
 * hace que la home se lea como un solo argumento.
 *
 * ⚠️ EL `body` TIENE QUE PODER LEERSE SOLO, sin el título arriba. En mobile
 * los dos se ven juntos, pero en desktop el cuerpo aparece por su cuenta
 * mientras el ojo ya está en la foto.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LOS TRES TÍTULOS DICEN «YOURS», Y LA REPETICIÓN ES EL PUNTO. Camila: «la
 * segunda card debería decir que el bar es TUYO no nuestro, porque toda la
 * sección debería hablar de que esa noche todo el espacio y el servicio es del
 * cliente».
 *
 * Decía «The bar is ours», que es la frase correcta en CUALQUIER OTRO LADO del
 * sitio —en `YardSteps` dice «It's the one tab we run» y está bien, porque ahí
 * se habla de un miércoles normal— y es la frase equivocada acá: esta sección
 * vende el alquiler del lugar, y en un alquiler la barra la maneja quien
 * alquila. El mismo dato cambia de dueño según la sección, y el copy tiene que
 * cambiar con él.
 *
 * Los tres en la misma construcción no es descuido: es anáfora. «The trucks
 * are yours / The bar is yours / The whole place is yours» se lee como una
 * lista que sube, y es exactamente el argumento de la sección.
 *
 * ⚠️ LAS TARJETAS NO LLEVAN A NINGÚN LADO Y TAMPOCO TIENEN FLECHA, que es la
 * única combinación de las tres que no miente. Tuvieron un `href` cada una
 * —`/food-trucks`, `/sunset-bar`, `/events/spaces`— y se sacó junto con el
 * link: dos de esos destinos cuentan el miércoles normal y esta sección vende
 * el alquiler. El razonamiento completo está en la nota de la tarjeta, abajo.
 *
 * Si algún día vuelven a ser links, el campo vuelve acá y no a un `const` al
 * costado: el destino es parte del contenido de la tarjeta.
 * ══════════════════════════════════════════════════════════════════════════
 */
/**
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ACÁ VIVÍA EL APILADO `sticky`, Y SE FUE. Queda escrito para que no vuelva
 * a intentarse sin leer esto primero.
 *
 * Qué era: en mobile y tablet las tres tarjetas se clavaban al viewport a
 * alturas escalonadas —`top` + 14px por posición— así que al scrollear cada
 * una se quedaba fija y la siguiente le pasaba por encima, dejando ver el
 * borde de las de abajo. CSS puro, sin JavaScript. La referencia era el bloque
 * «However you show up» de showdown-social.
 *
 * Por qué se fue. El gesto necesita que TRES cosas se muevan juntas y ninguna
 * tiene el mismo dueño:
 *
 *   · el header, que es `sticky` y mide 64px pegado, tapaba la franja de
 *     arriba de la tarjeta clavada — que es justamente lo único que se ve de
 *     las que ya pasaron;
 *   · el encabezado de la sección se pegó también, para que el titular no
 *     desapareciera mientras subían las fotos, y eso obligó a atar el `top` de
 *     las tarjetas a la suma «alto del header + alto del bloque de texto», con
 *     tres valores medidos por breakpoint;
 *   · y al final del recorrido los dos `sticky` se sueltan en momentos
 *     distintos —las tarjetas cuando se acaba el `<ul>`, el encabezado cuando
 *     se acaba la caja— así que la última tarjeta quedaba tapada por el
 *     titular.
 *
 * Cada arreglo destapaba el siguiente. Camila lo cerró: «no estás logrando esta
 * animación así que quitala, poné esta sección sin movimiento, fija como están
 * las demás con una card bajo la otra».
 *
 * ⚠️ SI ALGÚN DÍA VUELVE, no alcanza con reponer el `sticky`: hay que resolver
 * primero que los dos contenedores terminen a la vez, y eso no se puede en CSS
 * sin medir el bloque de texto con JavaScript.
 *
 * Lo que queda es lo que la sección necesita: una columna de tres tarjetas en
 * mobile y tablet, una grilla de tres en desktop, y el mismo comportamiento que
 * las otras ocho secciones de la home.
 * ══════════════════════════════════════════════════════════════════════════
 */

const CARDS = [
  {
    tag: 'The trucks',
    title: 'The trucks are yours',
    body: 'We coordinate all four, so you deal with one person and not four vendors.',
    src: '/images/venue/truck-window-night.jpg',
    alt: 'A food truck window in the yard at night',
  },
  {
    tag: 'The bar',
    title: 'The bar is yours',
    body: 'Open bar, drink tickets or consumption, however you want to run it.',
    src: '/images/venue/wall-bartender.jpg',
    alt: 'A bartender making cocktails at the Sunset Bar',
  },
  {
    tag: 'The venue',
    title: 'The whole place is yours',
    body: 'The rooftop, the yard, the patio, or the entire venue with the gates shut.',
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
        ⚠️ NO LLEVA `overflow-hidden`, Y CONVIENE QUE SIGA ASÍ. Lo tuvo, para
        recortar una foto de 100vw que la banda usaba de fondo; esa foto se fue
        cuando la banda pasó a ser lisa y el recorte quedó como código muerto.

        Reponerlo tiene un costo que no se ve: un `overflow` distinto de
        `visible` convierte al elemento en la caja que recorta a todos sus
        descendientes, y acá adentro hay tres tarjetas con `sombra-card`. Es
        exactamente el defecto que vigila `npm run check:sombras`.
      */
      className="grano banda-arco relative z-[3] bg-deep pt-14 pb-cierre-arco text-bone on-dark lg:pt-28"
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
          ⚠️ UNA COLUMNA HASTA `lg` Y UNA GRILLA DE TRES DE AHÍ PARA ARRIBA, sin
          nada que se mueva. Acá vivió un apilado `sticky` y se fue: el porqué
          está escrito entero arriba de `CARDS`, y conviene leerlo antes de
          volver a intentarlo.
        */}
        <StaggerGroup as="ul" className="mt-bloque flex list-none flex-col gap-6 p-0 lg:grid lg:grid-cols-3">
          {CARDS.map(({ tag, title, body, src, alt }, i) => (
            <RevealItem
              as="li"
              key={src}
              /*
                ⚠️ EL `<li>` SIGUE SIENDO UN ENVOLTORIO VACÍO Y NO SE PUEDE
                FUSIONAR CON LA TARJETA DE ADENTRO. La tarjeta necesita
                `overflow-hidden` para recortar la foto contra su radio, y el
                `<li>` es un `RevealItem` —un elemento de `motion` que escribe
                `transform` inline para su entrada—. Juntarlos haría que el
                recorte se aplicara sobre un elemento transformado, que es
                justo cuando el navegador crea una capa nueva y el radio se ve
                aserrado en el borde.
              */
              /*
                ⚠️ EN TABLET LA TARJETA SE CENTRA Y NO OCUPA TODO EL ANCHO.
                Pedido de Camila: «en tablet hagamos las cards horizontales, un
                rectángulo horizontal no ocupando toda la pantalla».

                A 834px de ancho la tarjeta medía 767 —o sea el ancho completo
                de la caja— y con la proporción 4/5 eso daba 959px de ALTO sobre
                un viewport de 1112. Una sola tarjeta se comía la pantalla entera
                y el encabezado de la sección desaparecía.

                Los 620px son el ancho que, con la proporción horizontal de
                abajo, deja la tarjeta en 348px de alto: encabezado (307) + aire
                (48) + tarjeta (348) + el escalón de las que quedan debajo (28)
                = 731 de 1112. Entra con holgura, que es lo que el pedido pide
                ver.

                ⚠️ SE PROBÓ CENTRADA Y A 620px DE ANCHO, Y VOLVIÓ AL ANCHO
                COMPLETO. La primera lectura del pedido fue que «no ocupando
                toda la pantalla» hablaba del ancho; sobre la página, Camila
                aclaró lo contrario: «las cards del ancho de pantalla». Lo que
                sobraba era el ALTO —959px de tarjeta sobre 1112 de viewport—
                y eso lo arregla la proporción horizontal de abajo, no el
                ancho. A 767px con 16/9 la tarjeta mide 431 de alto.
              */
            >
              {/*
                ══════════════════════════════════════════════════════════
                ⚠️ LA TARJETA NO ES UN LINK Y NO LLEVA FLECHA. Es un `<div>`,
                y esto fue y volvió una vez, así que conviene dejar las dos
                mitades escritas.

                Fue: las tres tenían una flecha decorativa que no llevaba a
                ningún lado. Camila lo marcó —«¿a dónde llevarían estas
                cards? ¿por qué tienen cada una una flecha como si llevasen a
                un lugar?»— y se resolvió haciéndolas links a tres destinos
                distintos: `/food-trucks`, `/sunset-bar` y `/events/spaces`.

                Volvió: dos de esos tres destinos cuentan el MIÉRCOLES NORMAL
                —quiénes son los trucks, qué se toma en la barra— y esta
                sección vende otra cosa, que es alquilar el lugar cerrado.
                Mandar a alguien que está evaluando un presupuesto a la página
                del roster de food trucks lo saca del embudo en el peor
                momento. Camila: «si todas llevan a la página de evento para
                mandar formulario y solicitar cerrar el lugar, no debemos
                ponerle la flecha a cada card».

                ⚠️ LA SECCIÓN TIENE UN SOLO OBJETIVO Y POR ESO TIENE UN SOLO
                CTA: el «Plan your event» de arriba. Las tres tarjetas son el
                argumento de ese botón, no tres caminos alternativos.

                ⚠️ EL HOVER SIGUE FUNCIONANDO. Es `group` sobre un `<div>`: el
                cuerpo se despliega, la foto hace zoom. Lo único que se pierde
                es el `group-focus-visible` del reveal, porque un `<div>` no
                recibe foco — y por eso el cuerpo se muestra SIEMPRE hasta
                `lg`, que es donde vive la mayoría del tráfico táctil. Ver la
                nota del bloque que se despliega.
                ══════════════════════════════════════════════════════════

                ⚠️ LA FOTO ES LA TARJETA ENTERA. Antes era una banda de 180px
                arriba de un bloque de texto en `deeper`; ahora ocupa todo y el
                texto vive encima. El `aspect-[4/5]` es el mismo formato que
                las tarjetas de `WhatsOn`, que es la otra fila de fotos de la
                home — dos proporciones distintas para el mismo objeto se leen
                como dos sistemas.

                ⚠️ El `bg-deeper` se queda de piso: mientras la foto carga, la
                tarjeta ya tiene su color y no parpadea en blanco.

                ⚠️ EL `relative` NO ES DECORATIVO Y NO SE PUEDE SACAR. Todo lo
                que va encima de la foto —el degradé— es `absolute`, y la foto
                misma es un `<Image fill>`, que también lo es. Sin `relative`
                acá, las dos cosas se resuelven contra el `<li>` de afuera, que
                no tiene `overflow-hidden`: la foto se sale del radio y las
                esquinas de la tarjeta se ven RECTAS aunque el `rounded-shell`
                esté puesto. `isolate` no alcanza — es `isolation`, no
                `position`.
              */}
              {/*
                ══════════════════════════════════════════════════════════
                ⚠️ TRES PROPORCIONES, UNA POR MEDIDA, y las tres salen de
                medir qué entra en pantalla junto al encabezado. Pedido de
                Camila: «que en pantalla quede visible el título con su bajada
                y cta, y entren las cards».

                    mobile   1/1     345 × 345   (era 4/5 → 431 de alto)
                    tablet   16/9    620 × 348   (era 4/5 → 959 de alto)
                    desktop  4/5     373 × 466   sin cambios

                El problema estaba en las dos primeras. En mobile el
                encabezado mide 349px y la tarjeta 431: 349 + 48 de aire + 431
                = 828 sobre un viewport de 844, o sea que el CTA quedaba
                cortado por un pelo en cuanto la tarjeta se clavaba. En tablet
                era mucho peor — 959px de tarjeta sobre 1112 de pantalla.

                ⚠️ EL CUADRADO DE MOBILE NO ES ARBITRARIO: es el mínimo que
                deja ver foto. El bloque de texto ocupa ~190px fijos —rótulo,
                dos renglones de titular y dos de cuerpo, que en mobile va
                SIEMPRE abierto— así que con `4/3` (259px) sobraban 70px de
                foto y la tarjeta dejaba de leerse como una imagen. Con 345
                quedan 155.

                ⚠️ EL 16/9 DE TABLET ES «HORIZONTAL» EN EL SENTIDO DEL PEDIDO:
                el rectángulo es más ancho que alto, que es justo lo contrario
                del retrato 4/5 que hay arriba y abajo. Es la misma proporción
                que usan las tarjetas de espacios de `PrivateEvents` en
                tre-vele, que es la referencia que trajo Camila.

                ⚠️ LA PROPORCIÓN DE DESKTOP NO SE TOCA. En `lg` la tarjeta vive
                en una grilla de tres columnas de 373px: ahí el retrato es lo
                que hace que las tres se lean como una fila de fotos, y es el
                mismo formato que las tarjetas de `WhatsOn`.
                ══════════════════════════════════════════════════════════
              */}
              <div className="group relative isolate flex aspect-square flex-col justify-end overflow-hidden rounded-shell bg-deeper sombra-card md:aspect-[16/9] lg:aspect-[4/5]">
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="(min-width: 1024px) 420px, 100vw"
                  className="-z-20 object-cover transition-transform duration-500 ease-brand group-hover:scale-104"
                />

                {/*
                  ⚠️ EL DEGRADÉ ES LO QUE HACE LEGIBLE EL TEXTO, NO ES
                  DECORACIÓN. Sobre la foto pelada el blanco del titular cae
                  donde caiga: en la toma del bartender hay una pared clara
                  justo abajo a la izquierda y ahí el texto desaparecía. Con el
                  degradé, lo que queda bajo el texto es `ink` casi opaco
                  —17.11:1 contra `paper`— sin importar qué haya en la foto.

                  ⚠️ MIDE EL 72 % DE LA TARJETA Y NO LA MITAD, y el número sale
                  del estado ABIERTO: en mobile y tablet el cuerpo se ve
                  siempre, así que el bloque de texto es más alto que en
                  desktop en reposo. Calibrado contra el estado corto, en el
                  teléfono la primera línea del cuerpo caía sobre la parte
                  transparente.
                */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 -z-10 h-[72%] bg-linear-to-t from-ink/95 via-ink/70 to-transparent"
                />

                <div className="flex flex-col gap-2.5 p-6.5">
                  <span className="eyebrow text-cream">{tag}</span>

                  <h3 className="m-0 font-display text-d5 font-bold uppercase leading-[1.02] text-paper">
                    {title}
                  </h3>

                  {/*
                    ══════════════════════════════════════════════════════════
                    ⚠️ EL CUERPO SE ABRE CON `grid-template-rows` Y NO CON
                    `max-height`, y no es un capricho.

                    El truco de `max-height: 0` → `max-height: 500px` obliga a
                    inventar un número más grande que el texto más largo, y ese
                    número es el que termina decidiendo la VELOCIDAD real: con
                    500px para un párrafo de 60, la transición se pasa el 88 %
                    del tiempo animando aire y el texto aparece de golpe sobre
                    el final. Con `0fr → 1fr` el navegador interpola contra la
                    altura REAL del contenido: sin número mágico, y sin corte
                    si mañana el texto crece.

                    El hijo necesita `overflow-hidden` sí o sí: la fila de la
                    grilla mide cero, pero el párrafo adentro sigue midiendo lo
                    que mide y sin el recorte se ve entero desde el principio.

                    ⚠️ ABIERTO POR DEFECTO Y CERRADO RECIÉN EN `lg`. Pedido de
                    Camila: «en mobile y tablet deberán cada una sobre la misma
                    imagen tener el texto». El motivo de fondo es que en touch
                    NO HAY HOVER: si el cuerpo arrancara cerrado, en un teléfono
                    no habría forma de abrirlo y el texto no existiría. El orden
                    de las clases dice eso — `1fr` de base, `lg:0fr`, y recién
                    ahí `lg:group-hover:1fr`.

                    ⚠️ Y DESDE QUE LA TARJETA DEJÓ DE SER UN LINK, `lg` ES EL
                    ÚNICO LUGAR DONDE EL CUERPO PUEDE QUEDAR OCULTO. Un `<div>`
                    no recibe foco, así que no hay `group-focus-visible` que
                    valga: en desktop, quien navega sólo con teclado no ve estos
                    párrafos. Se acepta porque son AMPLIACIÓN del título —«The
                    bar is yours» ya dice el argumento— y porque el texto sigue
                    en el DOM para un lector de pantalla. Si algún día el cuerpo
                    lleva un dato que no esté en otro lado, esto deja de ser
                    aceptable.

                    ⚠️ CON `motion-reduce` QUEDA ABIERTO. Con movimiento
                    reducido no se anima nada, así que un bloque que sólo
                    aparece a través de una transición sería contenido
                    inalcanzable. Abierto se lee igual que en mobile.
                    ══════════════════════════════════════════════════════════
                  */}
                  <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-brand motion-reduce:transition-none lg:grid-rows-[0fr] lg:group-hover:grid-rows-[1fr] motion-reduce:lg:grid-rows-[1fr]">
                    <div className="overflow-hidden">
                      <p className="m-0 max-w-[34ch] font-body text-dato font-light text-bone">
                        {body}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </RevealItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
