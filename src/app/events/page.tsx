import type { Metadata } from 'next';
import Image from 'next/image';
import EventSpaces from '@/components/sections/EventSpaces';
import EventTypes from '@/components/sections/EventTypes';
import InquiryForm from '@/components/sections/InquiryForm';
import { ButtonLink } from '@/components/shared/Button';
import CompareSlab from '@/components/shared/CompareSlab';
import { RevealItem, StaggerGroup } from '@/components/shared/Motion';
import PlateHero from '@/components/shared/PlateHero';
import { PhotoPending } from '@/components/shared/PendingData';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import { PACKAGES, GAMES_TOTAL, SCREENS } from '@/content/game-truck';
import {
  ENHANCEMENTS,
  ENHANCEMENTS_NOTE,
  FEES,
  EVENTS_PDF,
  FOOD_OPTIONS,
  GALERIA,
  RENTAL,
  RENTAL_DEPOSIT,
  RENTAL_MINIMUM_HOURS,
} from '@/content/events-pricing';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

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
 *     galería     paper
 *     cierre      bone con arco
 *
 * `mint` y `cream` cuentan las dos como crema para `npm run check:surfaces`,
 * que permite dos por página: son exactamente las dos. Y ninguna queda pegada
 * a otra de color. La página pasaba a estar fuera de regla antes de esto
 * («color seguido: bone→bone»).
 * ══════════════════════════════════════════════════════════════════════════
 */
export default function EventsPage() {
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
        <ButtonLink href="#inquire" variant="primary" size="lg">
          Request a proposal
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
      <Section band="lg" labelledBy="cost-title">
        {/*
          ⚠️ EL PANEL NO LLEVA `grano` Y EL BANNER DE `/food-trucks`, QUE ES LA
          MISMA PIEZA, SÍ. El de acá es el que está bien: el grano va en los
          fondos y no en los objetos —«los elementos no deben tener noise
          effect, sólo los fondos»— y un panel dentro de una sección clara es un
          objeto, no una superficie. `npm run check:grano` mide exactamente eso
          y lo marcó acá.

          TODO: el banner de rotación de `/food-trucks` arrastra el mismo
          `grano` de más. No se ve porque esa ruta no está en las `RUTAS` del
          guardia, que todavía apunta a `/the-yard`, `/about` y
          `/private-dining`, tres páginas que ya no existen.
        */}
        <div className="relative rounded-frame bg-cream px-5 py-12 sm:px-10 lg:px-16 lg:py-16">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-3.5 rounded-shell border border-dashed border-deep/35"
          />

          <div className="relative">
            <SectionHead
              align="center"
              eyebrow="What it costs"
              eyebrowTone="deep"
              id="cost-title"
              title="The numbers, up front"
              lead="Renting the second floor, the three ways to feed everyone, and the fees that ride along. No quote needed to read this."
            />

            {/* Las dos tarifas de alquiler. */}
            <div className="mt-bloque grid gap-6 sm:grid-cols-2">
              {RENTAL.map((r) => (
                /* ⚠️ LA SOMBRA NO ES DECORACIÓN. `bg-paper` es un color de
                   superficie, así que sin nada que lo delimite `check:grano` lo
                   lee como un «suplente de fondo» —una pieza pintada del color
                   del fondo para desaparecer en él— y pide grano. Estas placas
                   son lo contrario: están sobre el crema para despegarse. La
                   sombra lo dice, y es lo que el guardia acepta como «esto es
                   un objeto». */
                <div
                  key={r.days}
                  className="rounded-shell bg-paper sombra-card px-6 py-7 text-center"
                >
                  <p className="font-display text-d2 font-extrabold uppercase leading-none tabular-nums text-sunset-deep lg:text-d1">
                    ${r.perHour.toLocaleString('en-US')}
                  </p>
                  <p className="mt-2.5 font-body text-base text-body/80">per hour, {r.days}</p>
                </div>
              ))}
            </div>

            <p className="mx-auto mt-6 max-w-[54ch] text-center font-body text-base leading-[1.7] text-body/80">
              {RENTAL_MINIMUM_HOURS} hour minimum
              {RENTAL_DEPOSIT ? ', and a deposit holds the date' : ''}. That is the second floor:
              the rooftop bar, the patio, or both.
            </p>

            {/* Cómo come la gente: tres filas de precio. */}
            <div className="mt-14">
              <Heading level={3} role="label" className="text-center">
                Three ways to feed everyone
              </Heading>
              <ul className="mt-5 flex list-none flex-col p-0">
                {FOOD_OPTIONS.map((f) => (
                  <li
                    key={f.slug}
                    className="flex flex-col gap-1.5 border-b border-dashed border-ink/20 py-5 sm:flex-row sm:items-baseline sm:gap-6"
                  >
                    <div className="sm:flex-1">
                      <p className="font-display text-d6 font-bold uppercase leading-none lg:text-d5">
                        {f.name}
                      </p>
                      <p className="mt-2 max-w-[58ch] font-body text-base font-light leading-[1.7] text-body/80">
                        {f.body}
                      </p>
                    </div>
                    <p className="shrink-0 font-display text-d6 font-bold uppercase leading-none tabular-nums text-sunset-deep lg:text-d5">
                      {f.price ?? 'Ask'}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fees y add-ons, uno al lado del otro. */}
            <div className="mt-11 grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
              <div>
                <Heading level={3} role="label">
                  On top of that
                </Heading>
                <ul className="mt-4 flex list-none flex-col gap-2 p-0">
                  {FEES.map((f) => (
                    <li key={f.label} className="flex justify-between gap-4 font-body text-base">
                      <span className="text-body/80">{f.label}</span>
                      <span className="font-bold tabular-nums">{f.amount}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Heading level={3} role="label">
                  Add-ons
                </Heading>
                <ul className="mt-4 flex list-none flex-wrap gap-x-2 gap-y-2.5 p-0">
                  {ENHANCEMENTS.map((e) => (
                    <li
                      key={e.name}
                      className="rounded-pill bg-paper px-4 py-1.5 font-body text-caption font-medium"
                    >
                      {e.name}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 max-w-[52ch] font-body text-caption leading-[1.6] text-body/75">
                  {ENHANCEMENTS_NOTE}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/*
        ══════════════════════════════════════════════════════════════════
        LA GALERÍA, EL PDF Y EL CAMIÓN DE JUEGOS.

        ⚠️ LAS FOTOS SON LAS REALES del cliente, y cuando no hay una del caso
        va el hueco gris con el pedido escrito. Lo que NO se hace es rellenar
        una galería de «eventos anteriores» con stock: sería mostrarle a quien
        va a alquilar el lugar una fiesta que no pasó acá.

        ⚠️ EL PDF SIGUE FUERA DE `public/`. 13 MB versionados viajan en cada
        deploy para siempre; mientras el cliente no pase una versión liviana,
        el link apunta al que él ya sirve.
        TODO: pedirle una versión comprimida para hospedarla.

        ⚠️ EL FORMATO Y EL PESO VAN AL LADO DEL BOTÓN Y NO ADENTRO. «Events
        Packages PDF, 13 MB» más la flecha no entra en un renglón en ningún
        celular: partía en dos. Los tres datos siguen a la vista antes de
        tocar, que es para lo que estaban.
        ══════════════════════════════════════════════════════════════════
      */}
      <Section band="lg" labelledBy="proof-gallery">
        <SectionHead
          eyebrow="What it looks like"
          eyebrowTone="plum"
          id="proof-gallery"
          title="Nights that already happened"
          lead="The same yard, the same rooftop, with other people's parties in them."
        />

        <StaggerGroup
          as="ul"
          className="mt-bloque grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3"
        >
          {GALERIA.map((g) =>
            g.src ? (
              <RevealItem
                as="li"
                key={g.alt}
                className="relative aspect-[4/3] overflow-hidden rounded-shell sombra-card"
              >
                <Image
                  src={g.src}
                  alt={g.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </RevealItem>
            ) : (
              <RevealItem as="li" key={g.brief}>
                <PhotoPending brief={g.brief} ratio="aspect-[4/3]" />
              </RevealItem>
            ),
          )}
        </StaggerGroup>

        {/*
          Las dos tarjetas de cierre de la sección: el packet y el add-on.
          ⚠️ EL CAMIÓN DE JUEGOS ES UNA TARJETA Y ERA UNA SECCIÓN ENTERA con
          tabla de precios propia. Ver el punto 4 del encabezado. Los dos
          datos que lleva —las pantallas y los juegos— se leen del contenido,
          que es lo que la tabla borrada no hacía.
        */}
        <div className="mt-bloque grid gap-6 lg:grid-cols-2">
          {/* ⚠️ LAS DOS TARJETAS LLEVAN EYEBROW para que los dos títulos
              arranquen a la misma altura. Sin el de acá, «The events packet»
              quedaba un renglón más arriba que «The gaming truck» y el par se
              leía desalineado. */}
          <div className="flex flex-col rounded-shell bg-bone p-6 lg:p-8">
            <Eyebrow tone="deep">Download</Eyebrow>
            <Heading level={3} role="card" className="mt-2.5">
              The events packet
            </Heading>
            <p className="mt-2.5 max-w-[52ch] font-body text-base font-light leading-[1.7] text-body/80">
              Spaces, food options, enhancements and the small print, in one file you can forward to
              whoever signs off on it.
            </p>
            <div className="mt-auto pt-6">
              {/* ⚠️ `md` Y NO `lg`, POR ANCHO MEDIDO. En `lg` esta etiqueta más
                  el ícono de enlace externo dan 261px, y la tarjeta sólo deja
                  240 a 320px de viewport. La etiqueta no se puede acortar: sale
                  de `EVENTS_PDF.label`, que es el nombre del archivo del
                  cliente. Lo que se acorta es el botón, que además es una
                  acción secundaria dentro de una tarjeta y no el CTA de la
                  página. */}
              <ButtonLink href={EVENTS_PDF.href} variant="dark" size="md" external>
                {EVENTS_PDF.label}
              </ButtonLink>
              <p className="mt-2 font-body text-micro font-medium text-body/70">
                {EVENTS_PDF.format}, {EVENTS_PDF.size}
              </p>
            </div>
          </div>

          <div id="game-truck" className="flex scroll-mt-24 flex-col rounded-shell bg-bone p-6 lg:p-8">
            <Eyebrow tone="deep">Add-on</Eyebrow>
            <Heading level={3} role="card" className="mt-2.5">
              The gaming truck
            </Heading>
            <p className="mt-2.5 max-w-[52ch] font-body text-base font-light leading-[1.7] text-body/80">
              {SCREENS} screens and {GAMES_TOTAL} games in a trailer that parks in the yard, with a
              Game Coach running it. Party packages start at $
              {PACKAGES[0].price.toLocaleString('en-US')} for {PACKAGES[0].hours} hours.
            </p>
            {/*
              ══════════════════════════════════════════════════════════════
              ⚠️ DICE «See the truck» Y NO «See the gaming truck», Y EL NÚMERO
              ESTÁ MEDIDO EN EL NAVEGADOR, NO ESTIMADO.

              «See the gaming truck» son 20 caracteres, que es justo el
              presupuesto que declara `BASE` en `Button.tsx`. Pero el
              presupuesto es una guía y el ancho real depende de la letra:
              medido a 320px de viewport, esa etiqueta en `size="lg"` da
              **293px**. La tarjeta deja 248 —288 de columna menos los 40 del
              `p-5`—, así que se pasaba por 45. Y como la etiqueta va con
              `nowrap`, no se partía en dos renglones: estiraba la tarjeta a
              341px y le metía 37px de scroll horizontal a TODO el documento.

              Las tres referencias medidas en el mismo ancho y tamaño:
                  «See the spaces»        14 car. → 214px
                  «Events Packages»       15 car. → 261px (lleva ícono)
                  «See the gaming truck»  20 car. → 293px
                  «See the truck»         13 car. → 201px  ← ésta

              ⚠️ NO QUEDA AMBIGUO CON LOS FOOD TRUCKS. El botón está adentro de
              una tarjeta cuyo rótulo dice «Add-on», cuyo título dice «The
              gaming truck» y cuyo cuerpo habla de pantallas y consolas.
              ══════════════════════════════════════════════════════════════
            */}
            <div className="mt-auto pt-6">
              <ButtonLink href="/game-truck" variant="secondary" size="md">
                See the truck
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      {/*
        ══════════════════════════════════════════════════════════════════
        EL CIERRE Y EL FORMULARIO, EN LA MISMA BANDA.

        ⚠️ ERAN DOS SECCIONES: una losa naranja con «One screen, two minutes»
        y, abajo, el formulario en `bone`. El CTA de esa losa apuntaba a
        `#inquire`, o sea al formulario que empieza 80px más abajo: un botón
        para bajar una pantalla hasta lo que ya se está viendo. Ahora el
        titular encabeza el formulario y no hay botón intermedio.

        ⚠️ TODOS LOS CTA DEL SITIO SIGUEN APUNTANDO A `/events/inquire`, que
        redirige con 301 a `/events#inquire`. No hay que tocar ningún call
        site, y un link viejo del cliente sigue cayendo donde tiene que caer.

        ⚠️ `width="prose"` ES EL MISMO ANCHO QUE TENÍA. Un formulario de ocho
        campos a 1168px deja los campos tan largos que dejan de leerse como
        campos.
        ══════════════════════════════════════════════════════════════════
      */}
      {/*
        ⚠️ EL CIERRE ENTRA CON ARCO, que es lo único del vocabulario del
        rediseño que a esta página le faltaba. `banda-arco` redondea las dos
        esquinas de arriba con `--radius-band` y se monta sobre la sección
        anterior con un margen negativo del mismo valor; el hueco que necesita
        la galería para no quedar tapada lo pone la regla
        `:has(+ .banda-arco)` de globals.css, sin tocar nada acá. Es el mismo
        remate con el que `MenuSheets` cierra `/sunset-bar`, también en `bone`.

        ⚠️ EL `z-[2]` NO SOBRA: sin él la sección anterior, que viene antes en
        el DOM pero pinta su fondo `paper`, se dibuja encima de la parte del
        arco que se monta.
      */}
      <Section
        id="inquire"
        tone="bone"
        band="lg"
        width="prose"
        className="banda-arco z-[2] scroll-mt-24"
      >
        <div className="text-center">
          <Eyebrow tone="terra">Next step</Eyebrow>
          <Heading level={2} className="mt-gap-kicker text-d4 lg:text-d3">
            One screen, two minutes
          </Heading>
          <p className="mx-auto mt-gap-bajada max-w-[52ch] font-body text-lead font-light text-body/80">
            Tell us the date and the headcount. We answer within one business day, with numbers.
          </p>
        </div>

        <div className="mt-bloque">
          <InquiryForm />
        </div>
      </Section>
    </>
  );
}
