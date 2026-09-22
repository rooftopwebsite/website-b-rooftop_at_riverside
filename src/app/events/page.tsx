import type { Metadata } from 'next';
import Image from 'next/image';
import EventSpaces from '@/components/sections/EventSpaces';
import EventTypes from '@/components/sections/EventTypes';
import InquiryForm from '@/components/sections/InquiryForm';
import { ButtonLink } from '@/components/shared/Button';
import CompareSlab from '@/components/shared/CompareSlab';
import FormSlab from '@/components/shared/FormSlab';
import { RevealItem, StaggerGroup } from '@/components/shared/Motion';
import PlateHero from '@/components/shared/PlateHero';
import Section from '@/components/shared/Section';
import SoftWave from '@/components/shared/SoftWave';
import { Eyebrow, Heading } from '@/components/shared/Type';
import {
  DRINK_OPTIONS,
  ENHANCEMENTS,
  ENHANCEMENTS_NOTE,
  EVENTS_PDF,
  FEES,
  FOOD_OPTIONS,
  RENTAL,
  RENTAL_DEPOSIT,
  RENTAL_MINIMUM_HOURS,
  SMALL_PARTY_MAX,
} from '@/content/events-pricing';
import { AREAS_OF_INTEREST } from '@/content/spaces';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';
import { getVenue } from '@/lib/venue';

export const metadata: Metadata = pageMeta({
  route: '/events',
  image: {
    url: '/images/events/events-hero-wide.jpg',
    width: 2576,
    height: 1364,
    alt: 'Guests with name badges seated along the bar at a private event at Rooftop at Riverside',
  },
});

/**
 * ══════════════════════════════════════════════════════════════════════════
 * /events — la puerta de la vertical prioritaria, rediseñada el 2026-09-21.
 *
 * ⚠️ LA PÁGINA ESTABA FUERA DEL REDISEÑO `food-truck-club`. Era la única de
 * las cuatro grandes que seguía armada con el lenguaje viejo: `PageHero` de
 * dos columnas sin ola ni palabra en color, todo `Section` + `SectionHead`
 * alineado a la izquierda, listas con `border-t-2`, y píxeles escritos a mano
 * —`gap-[28px]`, `text-[16px]`, `mt-[32px]`— en vez de tokens. Ni un arco, ni
 * una ola, ni un sticker, ni una superficie de color. Al lado de la home, de
 * `/sunset-bar` y de `/food-trucks` se leía como otro sitio.
 *
 * ⚠️ Y ERA LARGA POR REPETICIÓN, no por tener mucho que decir. Camila, el
 * 2026-09-21: «hay muchísimas cosas que pueden acortarse o eliminarse dado que
 * ya se nombró antes de otra forma, necesito que todo sea MUCHO más simple de
 * comprender».
 *
 * ──────────────────────────────────────────────────────────────────────────
 * QUÉ SE FUE, Y POR QUÉ. De doce bloques a siete.
 *
 * 1. «THREE STEPS, AND THE FIRST ONE TAKES TWO MINUTES». Tres tarjetas
 *    numeradas con tres botones: «Start the request» → `#inquire`, «See what
 *    it costs» → `#inquire`, «View spaces» → `#spaces`. O sea, un índice de
 *    tres anclas de ESTA MISMA página, dos de ellas al mismo destino. En una
 *    página que se recorre scrolleando, «paso 3: ver los espacios» es un botón
 *    que baja dos pantallas a algo que igual se iba a cruzar.
 *
 *    ⚠️ Estos tres pasos habían venido de la home, y esto NO los devuelve
 *    allá. La home es un banner y así se queda.
 *
 * 2. «THREE KINDS OF NIGHT», la lista de `EVENT_FAMILIES`. Era la TERCERA
 *    taxonomía de la misma página: los cuatro `TIPOS_EVENTO` de `EventTypes`,
 *    estas tres familias, y los ocho `EVENT_TYPES` planos del formulario. La
 *    página preguntaba «qué clase de evento es el tuyo» tres veces seguidas
 *    con tres listas distintas. El dato no se borró: `EVENT_FAMILIES` sigue
 *    generando `EVENT_SUBTYPES`, que es lo que valida el desplegable de
 *    `InquiryForm` en el servidor.
 *
 * 3. «WHAT WE ACTUALLY DO», las tres columnas del arranque. No se perdió: es
 *    la columna izquierda del `CompareSlab`. «We coordinate the trucks», «the
 *    bar is ours» y «the space is yours» son exactamente tres renglones de una
 *    comparación, y puestos enfrente de la otra columna se entienden sin
 *    leerlos enteros.
 *
 * 4. `EventGameTruck` ENTERO, y el archivo se borró. Renderizaba una tabla de
 *    precios con `$400`, `$500`, `$200` y `$250` ESCRITOS A MANO en el JSX,
 *    más los incluidos y los juegos. Todo eso es `/game-truck`, que existe,
 *    tiene su propio hero y lee los mismos números de `content/game-truck.ts`.
 *    Eran los mismos precios en dos lugares del sitio, y uno de los dos no
 *    leía el contenido. Queda una tarjeta con el link.
 *
 *    ⚠️ EL `id="game-truck"` SOBREVIVE en esa tarjeta: `AboutExperience` linkea
 *    a `/events#game-truck`. Lo que NO hace falta sostener es un redirect:
 *    `/events/game-truck` apunta a `/game-truck`, no a este ancla.
 *
 * 5. LA LOSA NARANJA DUPLICADA. `EventSpaces` cerraba con una losa `bg-sunset`
 *    («December fills first») y la página cerraba con otra idéntica en forma
 *    («One screen, two minutes»). Queda la del cierre.
 *
 * 6. LOS DOCE MARCADORES TBD DE LOS AFOROS y los cuatro huecos de foto de los
 *    espacios. Ver la nota de `EventSpaces`: el aviso queda una vez.
 *
 * 7. LA TIRA DEL 4 DE JULIO: el contador de 25.000–30.000 personas con la foto
 *    de la calle. Camila, 2026-09-21: «creo que la información del 4 de julio
 *    no suma en absoluto, no me invita a reservar una fecha para mí».
 *
 *    Tiene razón y el dato lo confirma: esa cifra es la de una FIESTA PÚBLICA
 *    de calle, no la de un evento privado. A quien está decidiendo dónde hacer
 *    el cumpleaños de cuarenta o el mixer de la empresa no le dice nada que
 *    hayan pasado treinta mil personas por la vereda un 4 de julio. Servía para
 *    UNO de los ocho casos de uso —una activación de marca— y se llevaba una
 *    sección entera justo después del hero.
 *
 *    ⚠️ CON ESTO SE VA EL ÚNICO `CountUp` DEL SITIO, y el comentario que tenía
 *    defendía su lugar diciendo que era «la prueba dura de que el venue mueve
 *    gente». El argumento se cae solo: prueba que el venue mueve gente EN LA
 *    CALLE, que no es lo que esta página vende.
 *
 * 8. LA GALERÍA «NIGHTS THAT ALREADY HAPPENED», el 2026-09-21 y por el mismo
 *    motivo que el resto: repetía. Camila: «eliminemos esta parte, sólo nos
 *    quedaremos con las dos cards de paquete de eventos y camión de juegos».
 *    Eran seis casillas —cuatro fotos del cliente que ya se ven en el hero y
 *    en los espacios de esta misma página, y dos huecos grises esperando
 *    material que nunca llegó— para mostrar el patio y la azotea por tercera
 *    vez. Con ella se fue `GALERIA` de `content/events-pricing.ts`.
 *
 *    ⚠️ LAS DOS TARJETAS QUE COLGABAN DE ESA SECCIÓN NO SE PERDIERON: el
 *    packet bajó a la columna del formulario —«paquetes de eventos puede ir
 *    acá»— y el camión de juegos se quedó con la franja entera, con foto y con
 *    sus tres números, que es lo que Camila pidió mirar: «hay que ver cómo
 *    venderlas mejor».
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️ EL HERO ES `PlateHero`, EL DE LAS SECUNDARIAS. Camila, 2026-09-21: «el
 * hero debe ser como el de las secundarias, como calendar y sunset, los CTA van
 * visibles pero como el hero de la home, debajo de la imagen». `PlateHero` ya
 * pone los `children` debajo de la foto y de la bajada, así que los dos CTA
 * caen donde se pidieron sin tocar el componente.
 *
 * ⚠️ HUBO QUE FABRICAR LA FOTO. El marco de `PlateHero` es 17:9 y en el repo
 * había exactamente DOS archivos de esa proporción —`bar-cocktails-wide` y
 * `whats-on-yard-wide`—, los dos ya usados como hero. Las cuatro de
 * `/images/events/` son VERTICALES (`event-a` es 1365×2048). La derivada nueva
 * es `events-hero-wide.jpg` y sale de `_RCZ7372`; el porqué de esa toma y de su
 * recorte está en su entrada de `scripts/build-media.mjs`.
 *
 * ⚠️ SE FUERON LAS MIGAS. `PlateHero` las acepta y no se le pasan, igual que en
 * `/sunset-bar` y `/whats-on`. El `BreadcrumbList` de JSON-LD sigue emitiéndose
 * para Google.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️ EL RITMO DE SUPERFICIES, que es lo que hay que mirar antes de mover una
 * sección de lugar:
 *
 *     hero        bone (la placa y la foto)
 *     tipos       MINT    ← las cuatro losas, como /food-trucks
 *     comparativa DEEP    ← ola de entrada desde menta; única oscura
 *     espacios    paper + CREAM
 *     números     paper   ← recibe las tarjetas que cruzan la losa
 *     camión      paper   ← era la galería
 *     cierre      bone con arco
 *
 * `mint` y `cream` cuentan las dos como crema para `npm run check:surfaces`,
 * que permite dos por página: son exactamente las dos. Y ninguna queda pegada
 * a otra de color. La página pasaba a estar fuera de regla antes de esto
 * («color seguido: bone→bone»).
 * ══════════════════════════════════════════════════════════════════════════
 */
/**
 * ⚠️ `?area=` ENTRA POR LA URL Y TILDA UNA CASILLA DEL FORMULARIO. Lo agregó
 * `/game-truck` el 2026-09-22: sus dos CTA de conversión llevaban acá, a un
 * formulario de quince campos que no nombra el camión por ningún lado. Ahora
 * llegan a `/events?area=game-truck#inquire` y la casilla ya viene puesta.
 *
 * ⚠️ EL VALOR SE VALIDA CONTRA `AREAS_OF_INTEREST` y lo que no esté en la
 * lista se descarta. Sin eso, cualquiera puede escribir lo que quiera en la
 * barra de direcciones y la página lo renderizaría: un parámetro de URL es
 * entrada de un desconocido, no un dato nuestro.
 *
 * ⚠️ ADMITE VARIOS —`?area=yard&area=stage`— porque el campo es de casillas y
 * `searchParams` devuelve un array cuando la clave se repite.
 */
export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string | string[] }>;
}) {
  const sp = await searchParams;
  const pedidas = sp.area === undefined ? [] : Array.isArray(sp.area) ? sp.area : [sp.area];
  const areas = pedidas.filter((a) => AREAS_OF_INTEREST.some((x) => x.value === a));

  const venue = await getVenue();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbJsonLd([{ name: 'Events', path: '/events' }])),
        }}
      />

      <PlateHero
        question="Looking for a private event venue in Bonita Springs?"
        title={
          <>
            {'Your event, '}
            <span className="block text-sunset-deep">two stories up</span>
          </>
        }
        lead="A rooftop bar, a gated yard and four independent kitchens in downtown Bonita Springs, across from Riverside Park."
        photo="/images/events/events-hero-wide.jpg"
        photoAlt="Guests with name badges seated along the bar at a private event at Rooftop at Riverside"
      >
        {/*
          ══════════════════════════════════════════════════════════════════
          ⚠️ DECÍA «REQUEST A PROPOSAL» Y AHORA DICE ADÓNDE VA. Camila,
          2026-09-22, sobre la captura: «que el CTA naranja se comprenda mejor;
          debe scrollear directo al formulario, hoy no hace nada y además no se
          comprende que debería hacer».

          Las dos mitades del problema eran distintas y se arreglaron en dos
          lugares:

            · «no hace nada» era el salto instantáneo de 7.800px hasta el
              formulario, que no se lee como un scroll. Eso se arregló en
              `shared/SmoothScroll.tsx`, para todas las anclas del sitio.
            · «no se comprende» es esta etiqueta. «Request a proposal» nombra
              el RESULTADO —recibir una propuesta— y quien la lee espera un
              mail, una llamada o una pantalla nueva. Lo que pasa es que la
              página baja a un formulario, y eso es lo que ahora dice.

          ⚠️ SIGUE ENTRANDO EN UN RENGLÓN, que es regla fija del repo: «Take me
          to the form» son 17 caracteres contra el presupuesto de 20 que declara
          `BASE` en `Button.tsx`, dos menos que los 19 de «Call (239) 268-0080»
          que ya está medido como el límite real en `size="lg"`.
          ══════════════════════════════════════════════════════════════════
        */}
        <ButtonLink href="#inquire" variant="primary" size="lg">
          Take me to the form
        </ButtonLink>
        <ButtonLink href="#spaces" variant="secondary" size="lg">
          See the spaces
        </ButtonLink>
      </PlateHero>


      {/* Los cuatro tipos, en tarjetas sobre menta. Anclas `#corporate`,
          `#celebrations`, `#fundraisers` y `#holiday-parties`. */}
      <EventTypes />

      {/*
        ══════════════════════════════════════════════════════════════════
        LA COMPARATIVA. La única superficie oscura de la página, y la pieza
        que más texto absorbe.

        ⚠️ REEMPLAZA A «WHAT WE ACTUALLY DO» Y A LOS TRECE DESTACADOS DE
        `EventTypes`. Los cuatro renglones de la izquierda son, en orden: las
        cuatro cocinas (estaba en corporate y repetida en holiday-parties), el
        bar propio y el contacto único (estaba en «what we actually do» y
        repetido en la lista de «what comes with every space»), el escenario
        más el portón (estaba en fundraisers), y diciembre al aire libre
        (estaba en holiday-parties y en celebrations).

        ⚠️ ES LA REFERENCIA QUE PASÓ CAMILA. defoodtruckclub.nl compara «De
        Foodtruck Club» contra «reguliere cateraars» en dos columnas, y esta
        losa es el componente que ya tradujo esa forma para `/food-trucks`.
        Acá se reusa tal cual, con el sticker parametrizado.

        ⚠️ LA COLUMNA DERECHA NO DICE QUE UN SALÓN SEA PEOR, dice en qué se
        diferencia. Es la misma regla con la que está escrita la de
        `/food-trucks` contra un restaurante.

        ⚠️ «A BALLROOM» NO ES UNA PALABRA NUEVA: el propio contenido del
        cliente ya titula el tipo holiday-parties «Trade the ballroom for the
        rooftop». Se compara contra lo que la página ya nombraba.

        ⚠️ `from="mint"` PORQUE ARRIBA ESTÁ LA BANDA DE LAS TARJETAS. La ola
        de entrada se dibuja del color de la sección de arriba; con el default
        `bone` saldría del color equivocado y se vería un escalón.

        ⚠️ LAS DOS TARJETAS SE SALEN DE LA LOSA con un `-mb-32` y aterrizan en
        la sección de abajo, que es `EventSpaces`. El hueco lo reserva
        `PADDING_CRUCE`, que esa sección importa de este mismo componente.
        ══════════════════════════════════════════════════════════════════
      */}
      <CompareSlab
        from="mint"
        id="how-events-work"
        eyebrow="How it works"
        accent="Not a ballroom."
        title="A venue with four kitchens"
        lead="We're a venue with a bar, not a caterer. Here's the honest split."
        ours={{
          label: 'Here',
          rows: [
            'Four independent kitchens in the yard, so nobody is handed a plate they did not choose',
            'The bar is ours and our team runs it: open bar, drink tickets or consumption',
            'A stage with sound already on it, and gates that close for a ticketed door',
            'One point of contact from the first email to load-out',
          ],
        }}
        theirs={{
          label: 'A ballroom',
          rows: [
            'One kitchen and one set menu: everyone eats from the same list',
            'The bar, the catering and the room are quoted as one package',
            'A stage, a PA and a DJ booth get rented in for the night',
            'The room, the caterer and the AV each come with their own contact',
          ],
        }}
      />

      {/* Los cuatro espacios y lo que viene con cada uno. `id="spaces"`, que
          es destino de redirect 301 y del menú. Su primera sección reserva el
          aire que necesitan las tarjetas de la losa de arriba. */}
      <EventSpaces />

      {/*
        ══════════════════════════════════════════════════════════════════
        LO QUE CUESTA, AHORA EN UN PANEL TROQUELADO.

        ⚠️ ERA UNA SECCIÓN `bone` PLANA con tres bloques apilados y ahora es el
        panel de la casa: `rounded-frame` en crema, con el filete punteado por
        dentro separado del borde. Es la misma pieza que la losa de happy hour
        de `/sunset-bar` y que el banner de rotación de `/food-trucks`, y el
        recurso ya estaba en el repo: el filete es el de los huecos de foto de
        `WhatsOn`.

        ⚠️ LOS NÚMEROS NO SE TOCARON. Salen del PDF «Events Packages» que el
        cliente publica hoy, vía `content/events-pricing.ts`. El PDF no tiene
        fecha; ver el aviso de ese archivo.

        ⚠️ LOS FEES NO SE ESCONDEN. Van en cuerpo chico pero a la vista: 22 %
        de gratuity sobre un alquiler de $1.250 la hora son $275 por hora, y
        enterarse después es la peor manera.

        ⚠️ EL PANEL VA SOBRE `paper` Y NO ES UNA SECCIÓN CREMA. La página ya
        gastó sus dos superficies de color —la menta de las tarjetas y el crema
        de «what comes with every space»—, así que el crema acá es un panel
        dentro de una sección clara y no una banda. `check:surfaces` cuenta
        `<Section tone>` y `<section class="bg-…">`, no los `div`.
        ══════════════════════════════════════════════════════════════════
      */}
      {/*
        ⚠️ LA OLA DE ENTRADA SE DIBUJA DEL COLOR DE ARRIBA, que es el crema de
        «what comes with every space». Es el mismo corte que `/food-trucks` hace
        entre su banda menta y su losa oscura.
      */}
      <SoftWave from="cream" to="deep" className="relative -mb-px" />

      <Section tone="deep" band="lg" labelledBy="cost-title">
        <div className="mx-auto max-w-[46rem] text-center">
          <Eyebrow tone="cream" className="justify-center">
            What it costs
          </Eyebrow>
          <h2
            id="cost-title"
            className="m-0 mx-auto mt-gap-kicker max-w-[16ch] font-display text-banda font-extrabold uppercase"
          >
            <span className="text-paper">The numbers,</span>{' '}
            <span className="text-sunset">up front</span>
          </h2>
          <p className="mx-auto mt-gap-bajada max-w-[56ch] font-body text-lead font-light text-paper/85">
            Renting the second floor, the three ways to feed everyone, the three ways to run the
            bar, and the fees that ride along. No quote needed to read this.
          </p>
        </div>

        {/*
          ══════════════════════════════════════════════════════════════════
          LA GRILLA SE EMPAREJA POR FILAS, y eso es lo que resolvió entrar la
          barra.

          El pedido original de Camila —«que tres maneras de alimentar a todos
          vaya en vertical, y las otras una sobre la otra, así no tienen tanto
          espacio vacío»— nació de un problema de alturas: una grilla de 2×2
          pareaba el alquiler, que son dos tarifas y un renglón, con la comida,
          que lleva tres opciones con su descripción. La corta se estiraba al
          alto de la larga y quedaba media tarjeta vacía. La solución de
          entonces fue estirar la comida a la columna derecha entera.

          Al entrar la barra el problema se deshace solo, porque las cuatro
          tarjetas ahora vienen en dos pares del mismo porte:

            · ALQUILER y FEES, las dos cortas, comparten la fila de arriba;
            · COMIDA y BARRA, las dos de tres opciones, la de abajo;
            · los ADD-ONS cierran A LO ANCHO DE LAS DOS COLUMNAS, porque son
              cinco cápsulas y un renglón y en una columna dejaban los dos
              lados descompensados otra vez. Abajo y anchas, las cápsulas
              entran en una sola fila y la nota se pone al lado.

          Por eso se fueron las filas escritas a mano —`lg:grid-rows` y los
          `col-start`/`row-start` de cada tarjeta—: el orden del DOM ya deja
          cada par en su fila, y `h-full` en cada una las empareja.

          ⚠️ Y EL ORDEN TAMBIÉN ES EL DEL PRESUPUESTO: primero lo que cuesta el
          lugar y lo que se le suma encima, después lo que se consume adentro.
          ══════════════════════════════════════════════════════════════════
        */}
        <StaggerGroup as="ul" className="mt-bloque grid list-none gap-5 p-0 lg:grid-cols-2">
          {/* 1 · EL ALQUILER. Las dos tarifas son el dato más buscado de la
              página, así que van en `d2` y en el naranja de marca. */}
          <RevealItem as="li" className="h-full">
            <article className="flex h-full flex-col rounded-shell bg-deeper p-7 lg:p-9">
              <Heading level={3} role="label" className="text-cream">
                Renting the second floor
              </Heading>
              <dl className="m-0 mt-6 grid gap-5 sm:grid-cols-2">
                {RENTAL.map((r) => (
                  <div key={r.days} className="border-t border-dashed border-bone/25 pt-4">
                    <dt className="font-body text-caption font-medium uppercase tracking-eyebrow text-muted-dark">
                      {r.days}
                    </dt>
                    <dd className="m-0 mt-2 font-display text-d2 font-extrabold leading-none tabular-nums text-sunset">
                      ${r.perHour.toLocaleString('en-US')}
                      <span className="ml-1.5 font-body text-caption font-medium tracking-normal text-paper/80">
                        / hour
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="m-0 mt-auto pt-6 font-body text-base font-light leading-[1.6] text-bone/85">
                {RENTAL_MINIMUM_HOURS} hour minimum
                {RENTAL_DEPOSIT ? ', and a deposit holds the date' : ''}. That is the second floor:
                the rooftop bar, the patio, or both.
              </p>
            </article>
          </RevealItem>


          {/*
            ══════════════════════════════════════════════════════════════
            3 y 4 · LO QUE SE CONSUME. Las dos listas se renderizan desde la
            misma plantilla porque son la misma tabla: nombre, precio y una
            línea de qué es.

            ⚠️ LA BARRA NO EXISTÍA EN ESTA PÁGINA HASTA EL 2026-09-22, y era el
            hueco más caro del sitio. El PDF del cliente publica tres paquetes
            de bebida CON PRECIO, su propio formulario pregunta «do you need
            drink package?», y acá había tres maneras de comer y ninguna de
            tomar. En un evento privado la barra suele costar más que la
            comida: $35 por persona por hora, cincuenta invitados y dos horas
            son $3.500, arriba del alquiler.

            ⚠️ SON DOS TARJETAS HERMANAS Y NO UNA SOLA CON SEIS FILAS. Comer y
            tomar se contratan por separado —se puede tener tickets de comida y
            barra abierta, o al revés—, así que se elige una por columna y no
            una entre seis.

            ⚠️ `flex-1` EN LA LISTA Y EN CADA FILA, y sólo en `lg`. El sobrante
            de alto entre las dos tarjetas se reparte entre las tres opciones en
            vez de caer todo junto al final: los filetes punteados quedan a
            distancias iguales y la tarjeta se lee como una carta y no como una
            caja a medio llenar.
            ══════════════════════════════════════════════════════════════
          */}
          {[
            { key: 'food', title: 'Three ways to feed everyone', rows: FOOD_OPTIONS },
            { key: 'drink', title: 'Three ways to run the bar', rows: DRINK_OPTIONS },
          ].map(({ key, title, rows }) => (
            <RevealItem as="li" key={key} className="h-full">
              <article className="flex h-full flex-col rounded-shell bg-deeper p-7 lg:p-9">
                <Heading level={3} role="label" className="text-cream">
                  {title}
                </Heading>
                <ul className="m-0 mt-2 flex list-none flex-col p-0 lg:flex-1">
                  {rows.map((r) => (
                    <li
                      key={r.slug}
                      className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-dashed border-bone/25 py-4 last:border-b-0 last:pb-0 lg:flex-1 lg:content-center"
                    >
                      <p className="m-0 flex-1 font-display text-d6 font-bold uppercase leading-none text-paper">
                        {r.name}
                      </p>
                      <p className="m-0 shrink-0 font-display text-d6 font-bold leading-none tabular-nums text-sunset">
                        {r.price ?? 'Ask'}
                      </p>
                      <p className="m-0 basis-full font-body text-base font-light leading-[1.55] text-bone/85">
                        {r.body}
                      </p>
                    </li>
                  ))}
                </ul>
              </article>
            </RevealItem>
          ))}

          {/*
            2 · LOS ADD-ONS. Sin precio: el PDF del cliente no los publica.

            ⚠️ SUBIÓ AL SEGUNDO LUGAR Y ANTES CERRABA LA GRILLA, y a la vez los
            fees bajaron a cerrarla. Camila, 2026-09-22, sobre la captura:
            «daría vuelta estas dos cards: la que habla de costos extras, en la
            card de más abajo para que tenga menos visibilidad; y la otra, que
            habla de complementos, arriba, para que destaque más los servicios».

            Es un orden de venta y no de maquetación: lo que se contrata —un DJ,
            música en vivo, una cabina de fotos— vale más arriba que la propina
            automática. Los fees no se esconden, que era el otro criterio de
            este bloque: siguen escritos, con su número, en la última tarjeta.

            ⚠️ SIGUE A DOS COLUMNAS (`lg:col-span-2`). Son cinco cápsulas y un
            párrafo: en media fila las cápsulas caen en tres renglones y la nota
            queda debajo, que es justo el aire desparejo que esta grilla viene
            corrigiendo.
          */}
          <RevealItem as="li" className="h-full lg:col-span-2">
            <article className="flex h-full flex-col rounded-shell bg-deeper p-7 lg:p-9">
              <div className="flex h-full flex-col gap-5 lg:flex-row lg:items-center lg:gap-12">
                <div className="lg:flex-1">
                  <Heading level={3} role="label" className="text-cream">
                    Add-ons
                  </Heading>
                  <ul className="m-0 mt-5 flex list-none flex-wrap gap-2 p-0">
                    {ENHANCEMENTS.map((e) => (
                      <li
                        key={e.name}
                        className="rounded-pill bg-paper/10 px-4 py-1.5 font-body text-caption font-medium text-paper ring-1 ring-paper/20 ring-inset"
                      >
                        {e.name}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="m-0 font-body text-base font-light leading-[1.6] text-bone/85 lg:max-w-[34ch]">
                  {ENHANCEMENTS_NOTE}
                </p>
              </div>
            </article>
          </RevealItem>

          {/*
            5 · LOS FEES, QUE AHORA CIERRAN LA GRILLA. En cuerpo chico pero a la
            vista: 22 % sobre una hora de $1.250 son $275, y enterarse después
            es la peor manera. Por qué bajó, en la nota de los add-ons.

            ⚠️ VA A LO ANCHO COMO LOS ADD-ONS, y no es simetría: son tres filas
            de etiqueta y número, y en media columna dejaban media tarjeta de
            aire debajo. En tres columnas las tres entran en una fila y la
            tarjeta mide lo que mide su contenido.
          */}
          <RevealItem as="li" className="h-full lg:col-span-2">
            <article className="flex h-full flex-col rounded-shell bg-deeper p-7 lg:p-9">
              <Heading level={3} role="label" className="text-cream">
                On top of that
              </Heading>
              <dl className="m-0 mt-5 grid gap-x-12 sm:grid-cols-3">
                {FEES.map((f) => (
                  <div
                    key={f.label}
                    className="flex items-baseline justify-between gap-4 border-b border-dashed border-bone/25 py-3.5 sm:border-b-0 sm:border-t sm:pt-4"
                  >
                    <dt className="font-body text-base font-light text-bone/85">{f.label}</dt>
                    <dd className="m-0 font-display text-d6 font-bold leading-none tabular-nums text-sunset">
                      {f.amount}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          </RevealItem>
        </StaggerGroup>
      </Section>

      {/*
        ══════════════════════════════════════════════════════════════════
        EL CAMIÓN DE JUEGOS, AHORA UN BANNER Y NO UNA FRANJA.

        ⚠️ ACÁ HABÍA MEDIA PÁGINA DE CAMIÓN y se fue el 2026-09-22. Camila: «la
        parte del camión de juegos me gusta pero no pondría tanta info en él.
        Haría algo mucho más chico con imagen del camión y un título y bajada
        que lo venda, pero que para conocer más lo vayas a ver a su landing.
        Podemos entonces meter esta info en un banner como los que venimos
        haciendo en las otras landings».

        Lo que se fue son LOS TRES DATOS Y EL PÁRRAFO DE PAQUETES: pantallas,
        juegos, «party packages desde $400», las dos horas con Game Coach y el
        precio del paquete de fin de semana. Nada de eso se perdió: los cinco
        números viven en `content/game-truck.ts` y `/game-truck` los publica
        enteros, con su ficha técnica, la lista de juegos y las dos tarjetas de
        paquete. Repetirlos acá era contar dos veces la misma página y dejarle
        a la landing nada que agregar.

        ⚠️ LA BAJADA NO LLEVA NINGÚN NÚMERO, y es la misma decisión escrita al
        revés: si dice cuántas pantallas hay, ya no hace falta ir a verlo.

        ⚠️ ES LA FORMA DEL BANNER DE `/food-trucks`: panel de esquinas muy
        redondeadas, filete punteado por dentro separado del borde, y UNA SOLA
        salida. Lo único que suma acá es la foto, que es lo que Camila pidió.

        ⚠️ EL PANEL VA EN `bone` Y NO EN `cream`, al revés que el de
        `/food-trucks`. El acento del titular es `sunset-deep`, que es el único
        naranja aprobado para una palabra de display sobre claro: da 3.28:1
        sobre hueso y pasa el 3:1 de texto grande, pero sobre crema cae a
        3.09:1 y ese par no está en la lista de `lib/brand.ts`. Entre cambiar
        el fondo del panel y cambiar el color con el que acentúa todo el sitio,
        cambia el fondo. Hueso sobre `paper` da 1.08:1, que es el mismo corte
        con el que el market apoya sus dos tarjetas.

        ⚠️ EL `id="game-truck"` SOBREVIVE: `AboutExperience` linkea a
        `/events#game-truck`.

        ⚠️ LA FOTO ES DEL CAMIÓN DE VERDAD DESDE EL 2026-09-22, y hasta ese día
        fue un joystick de stock. Las cuatro fotos del gaming truck estaban en
        la web del propio cliente; el detalle está en `scripts/build-media.mjs`.

        ⚠️ ACÁ VA LA DE NOCHE CON DOS PERSONAS JUGANDO, y en `/game-truck` la
        del trailer entero. No es indistinto: allá el hero tiene que decir QUÉ
        ES —un camión que se estaciona en tu fiesta— y acá el banner tiene que
        decir POR QUÉ LO QUERÉS, que es la gente usándolo. El titular de este
        bloque ya dice «park a gaming truck in the yard»; la foto no tiene que
        repetirlo.
        ══════════════════════════════════════════════════════════════════
      */}
      <Section band="lg" labelledBy="game-truck-title">
        <div
          id="game-truck"
          className="relative scroll-mt-24 rounded-frame bg-bone grano p-6 sm:p-9 lg:p-12"
        >
          {/* El filete punteado, separado del borde. `inset-3.5` son los 14px
              que lo despegan, el mismo número del banner de `/food-trucks` y
              de las tarjetas troqueladas del resto del sitio. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-3.5 rounded-shell border border-dashed border-deep/35"
          />

          <div className="relative grid items-center gap-7 sm:grid-cols-2 sm:gap-9 lg:gap-14">
            {/* ⚠️ LA FOTO VA PRIMERA EN LOS DOS ANCHOS, apilada y en dos
                columnas. Es un banner y no una sección: se lee de un saque, y
                la imagen es lo que dice de qué habla antes de leer nada. */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-shell sombra-card">
              <Image
                src="/images/game-truck/truck-night.jpg"
                alt="Two guests in Rooftop shirts playing on the gaming truck screens at night"
                fill
                sizes="(min-width: 1024px) 40vw, (min-width: 640px) 45vw, 100vw"
                className="object-cover"
              />
            </div>

            <div>
              <Eyebrow tone="magenta">Add-on</Eyebrow>
              <Heading
                level={2}
                id="game-truck-title"
                className="mt-gap-kicker max-w-[16ch] text-d4 lg:text-d3"
              >
                Park a <span className="text-sunset-deep">gaming truck</span> in the yard
              </Heading>
              <p className="mt-5 max-w-[46ch] font-body text-lead font-light leading-[1.5] text-ink">
                A trailer of screens and consoles pulls into the yard, plugs in and runs on its own
                staff. The guests who would rather play than mingle have somewhere to go, and
                nobody from your party has to run it.
              </p>
              {/*
                ⚠️ DICE «See the truck» Y NO «See the gaming truck». El número
                está medido en el navegador: a 320px de viewport y en `size="lg"`,
                «See the gaming truck» da 293px y la etiqueta va con `nowrap`,
                así que no se partía en dos renglones: estiraba la caja y le
                metía scroll horizontal a todo el documento. «See the truck» da
                201px. Acá además el botón bajó a `md`, que es el tamaño con el
                que cierran los banners del sitio.

                ⚠️ NO QUEDA AMBIGUO CON LOS FOOD TRUCKS: el botón cierra un
                banner rotulado «Add-on», titulado «gaming truck» y con una foto
                de un joystick al lado.
              */}
              <div className="mt-8">
                <ButtonLink href="/game-truck" variant="dark">
                  See the truck
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/*
        ══════════════════════════════════════════════════════════════════════
        EL CIERRE Y EL FORMULARIO, EN DOS COLUMNAS.

        ⚠️ LA ESTRUCTURA ES LA DEL FORMULARIO DE CONTACTO DE defoodtruckclub.nl,
        que Camila pasó: «quiero que tenga esta estructura y estilo». De ahí
        salen las tres cosas que la definen:

          · dos columnas, con el titular, la bajada, un filete y los datos de
            contacto en la angosta de la izquierda;
          · un PANEL grande a la derecha, con el formulario adentro;
          · y un FILETE PUNTEADO por dentro del panel, separado del borde, que
            es lo que lo vuelve una etiqueta troquelada y no una caja.

        El troquel no hubo que inventarlo: es el mismo `inset-3.5` +
        `rounded-shell` de `CompareSlab`, de la losa de happy hour y de las
        tarjetas de tipo de esta misma página.

        ⚠️ LO QUE NO SE COPIA ES EL FORMULARIO-ORACIÓN. En la referencia los
        campos van embebidos en una frase —«Mijn naam is [nombre] van
        [empresa]»— y funciona porque son CUATRO campos. Éste tiene quince, con
        fechas, horas, un desplegable de tipo, casillas de áreas y tres radios
        de comida: la misma frase escrita con quince huecos no se lee, y perder
        los `<label>` de cada campo rompe la accesibilidad que este formulario
        sí tiene hoy. Se copia la estructura, no el truco.

        ⚠️ LOS DATOS DE CONTACTO SUBEN A LA COLUMNA IZQUIERDA y se van del pie
        del formulario, donde estaban como «Prefer email?». Es el lugar que les
        da la referencia y además resuelve algo real: quien no quiere llenar
        quince campos tiene la salida A LA VISTA antes de empezar, no después
        de scrollear el formulario entero.

        ⚠️ `banda-arco` ENTRA CON EL ARCO sobre la franja del camión. El hueco
        que ésta necesita para no quedar tapada lo pone la regla `:has(+ .banda-arco)` de
        globals.css. El `z-[2]` no sobra: sin él la sección anterior, que viene
        antes en el DOM, pinta su fondo encima de la parte del arco que se monta.
        ══════════════════════════════════════════════════════════════════════
      */}
      {/*
        ⚠️ ESTA LOSA YA NO ESTÁ ESCRITA ACÁ. El 2026-09-21 la misma
        construcción tuvo que repetirse tres veces más —una en `/contact` y dos
        en `/join-us`, una por carril— y se sacó a `shared/FormSlab.tsx`. La
        grilla, el filete, el panel y el troquel son los mismos; lo único que
        sigue viviendo en esta página es QUÉ va en cada hueco.

        ⚠️ `panelTone="paper"` ES LA EXCEPCIÓN DEL SITIO y está explicada en el
        componente: esta sección tiene que ser `bone` porque es la que lleva el
        arco, así que el panel no puede ser bone también.
      */}
      <FormSlab
        id="inquire"
        tone="bone"
        panelTone="paper"
        band="lg"
        className="banda-arco z-[2]"
        eyebrow="Next step"
        eyebrowTone="terra"
        title="One screen, two minutes"
        titleId="inquire-title"
        /*
          ⚠️ LA BAJADA INVITA, YA NO INSTRUYE. Camila, 2026-09-22, sobre la
          captura: «cambia el texto de la bajada, que invite a completar, no
          que describa qué completar».

          Decía «Tell us the date and the headcount. We answer within one
          business day, with numbers»: la primera mitad era el instructivo de
          los campos que se ven al lado —fecha y cantidad de invitados están
          los dos en el formulario, rotulados— y la segunda, lo único que
          alguien no puede saber mirando la pantalla. Queda la segunda, escrita
          como invitación.
        */
        lead="Send it over and you get real numbers back, within one business day."
        aside={
          <div className="flex flex-col gap-9">
            {/*
              ⚠️ ACÁ ARRIBA IBA UN RÓTULO «OR SKIP THE FORM» Y SE FUE. Camila,
              misma captura: «quita ese titulito que invita a hacer otra cosa;
              solo pon la pregunta en bold con la info debajo para comunicarse
              por esos medios si son menos de 12 invitados».

              Tenía razón en el diagnóstico: el rótulo estaba al lado de un
              formulario y lo primero que hacía era ofrecer no usarlo. El mail
              y el teléfono no se van —son la salida de quien no quiere llenar
              quince campos— pero dejan de anunciarse como una alternativa al
              formulario y pasan a ser lo que siempre fueron: los datos de
              contacto de eventos.

              ⚠️ AHORA LOS ENCABEZA LA PREGUNTA, que es la que Camila pidió
              poner en bold. Y el orden se dio vuelta con ella: primero para
              quién es esto, después los dos datos. Antes era al revés y la
              regla de los 12 quedaba de nota al pie del teléfono.
            */}
            <div className="flex flex-col gap-1.5">
              {/*
                ⚠️ ESTA REGLA LA PUBLICA EL CLIENTE Y NOSOTROS NO LA TENÍAMOS.
                El sitio vigente cierra `/hostanevent` con «*For parties less
                than 12 people contact: 239-268-0080», y en el sitio nuevo no
                estaba en ninguna parte. Una mesa de ocho aterrizaba en un
                formulario de quince campos, con fecha alternativa y rango de
                presupuesto, para algo que se resuelve con una llamada.

                ⚠️ VA EN ESTA COLUMNA Y NO ADENTRO DEL PANEL porque quien entra
                con ocho personas tiene que leerla ANTES de empezar a llenar, no
                después de scrollear quince campos.
              */}
              <p className="font-body text-base font-bold leading-[1.5] text-ink">
                Fewer than {SMALL_PARTY_MAX} guests?
              </p>
              <p className="max-w-[34ch] font-body text-base font-light leading-[1.6] text-body/75">
                That is a reservation, not a buyout. Call or write and we sort it out without the
                form.
              </p>
              <a
                href={`mailto:${venue.emailEvents}`}
                className="link-texto mt-1.5 font-body text-base"
              >
                {venue.emailEvents}
              </a>
              <a href={venue.phoneHref} className="link-texto font-body text-base">
                {venue.phone}
              </a>
            </div>

            {/*
              ⚠️ EL PACKET VIVE ACÁ, debajo de los contactos y no en la sección
              de arriba. Camila, 2026-09-21: «paquetes de eventos puede ir acá».
              Es la tercera salida de la misma columna, ordenadas por cuánto
              piden: el formulario, un mail o un teléfono, y un archivo que se
              reenvía a quien firma sin hablar con nadie.

              ⚠️ ES `bg-paper` SOBRE `bone`, igual que el panel del formulario
              de al lado: las dos cosas que se pueden tocar en esta banda se
              leen como la misma superficie.

              ⚠️ EL BOTÓN SIGUE EN `md` Y CON EL PESO AL LADO. La etiqueta sale
              de `EVENTS_PDF.label`, que es el nombre del archivo del cliente y
              no se acorta; en `lg` más el ícono de enlace externo no entra en
              esta columna. Y el formato y los 13 MB van afuera del botón porque
              adentro parten la etiqueta en dos renglones: en un celular con
              datos, 13 MB es una descarga que conviene decidir antes.
            */}
            {/*
              ⚠️ LA TARJETA PASÓ A MENTA Y EL BOTÓN AL ANCHO. Camila,
              2026-09-22: «haz que la card del PDF tenga más color y el CTA
              ancho como el contenido de la card, que la card tenga más vida».

              Era `bg-paper` sobre `bone`, o sea el mismo escalón de 1.08:1 que
              el panel del formulario de al lado: dos rectángulos casi del mismo
              blanco, uno enorme y uno chico, y el chico desaparecía. `mint` es
              el color de superficie de acento del repo —el de la banda de tipos
              de evento de esta misma página— y con `ink` encima da 15:1.

              ⚠️ EL BOTÓN VA `w-full` Y CENTRADO. Con el ancho de la tarjeta
              deja de ser un link al pie de un párrafo y pasa a ser el piso de
              la tarjeta, que es lo que hace que se lea como una pieza y no como
              texto con algo abajo.

              ⚠️ Y PASA A `variant="primary"`, el naranja. Era `dark`, que sobre
              menta se leía como un rectángulo negro; sobre el mismo fondo el
              naranja es el CTA de la casa y la tarjeta queda en los dos colores
              de marca.
            */}
            <div className="rounded-shell bg-mint p-6">
              <Eyebrow tone="deep">Download</Eyebrow>
              <Heading level={3} role="card" className="mt-2.5">
                The events packet
              </Heading>
              <p className="mt-2.5 font-body text-base font-light leading-[1.7] text-ink/80">
                Spaces, food options, enhancements and the small print, in one file you can forward
                to whoever signs off on it.
              </p>
              <div className="mt-5">
                <ButtonLink
                  href={EVENTS_PDF.href}
                  variant="primary"
                  size="md"
                  external
                  className="w-full justify-center"
                >
                  {EVENTS_PDF.label}
                </ButtonLink>
                <p className="mt-2 text-center font-body text-micro font-medium text-ink/70">
                  {EVENTS_PDF.format}, {EVENTS_PDF.size}
                </p>
              </div>
            </div>
          </div>
        }
      >
        <InquiryForm defaultAreas={areas} />
      </FormSlab>
    </>
  );
}
