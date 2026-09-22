import type { Metadata } from 'next';
import ContactForm from '@/components/sections/ContactForm';
import { ButtonLink } from '@/components/shared/Button';
import FormSlab from '@/components/shared/FormSlab';
import HoursCard from '@/components/shared/HoursCard';
import { ArrowSquareOut, Instagram } from '@/components/shared/Icon';
import MapEmbed from '@/components/shared/MapEmbed';
import ParkingMap, { ParkingList } from '@/components/shared/ParkingMap';
import PlateHero from '@/components/shared/PlateHero';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import { BRAND, instagramHandle } from '@/lib/brand';
import { getVenue, venueAddressLine } from '@/lib/venue';
import { breadcrumbJsonLd, jsonLdScript, pageMeta, venueJsonLd } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  route: '/contact',
  image: {
    url: '/images/venue/contact-bar-day-wide.jpg',
    width: 2576,
    height: 1364,
    alt: 'Guests at the bar at Rooftop at Riverside on a weekday afternoon',
  },
});

/**
 * `/contact` — los tres buzones, el formulario, los horarios y el mapa.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ REDISEÑADA EL 2026-09-21. La página estaba en un idioma propio y era la
 * única que quedaba así: abría con `ContactHero`, el encabezado COLLAGE
 * calcado de `defoodtruckclub.nl/contact`, con el titular monocromo, sin foto,
 * y el teléfono como una píldora gigante entrelazada con las letras.
 *
 * Camila, 2026-09-21: «contemplando cómo hiciste el formulario en plan an
 * event y cómo son los heros, diseñá las páginas de join us y contact».
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️ EL HERO PASA A `PlateHero`, el de `/sunset-bar`, `/whats-on` y `/events`:
 * pregunta arriba, placa con la palabra en color, esquinas inversas y la foto
 * ancha que la placa muerde. Dos de las tres reglas fijas de hero del repo las
 * incumplía este archivo — el titular iba monocromo y no había placa mordiendo
 * ninguna foto— y ésta es la forma de cumplirlas sin inventar una cuarta.
 *
 * ⚠️ `ContactHero.tsx` SE BORRÓ, pero el collage no se tiró entero. Su
 * argumento bueno era que en una página de contacto la mitad de la gente viene
 * a LLAMAR, así que el teléfono no puede ser un renglón de 16px abajo a la
 * derecha. Ese mecanismo sobrevive: la píldora de teléfono en `mint` y el
 * círculo de Instagram son ahora lo primero de la columna de datos de la losa,
 * más chicos —60px de alto contra 104— porque ahí no compiten con un titular
 * de 144px sino que encabezan una columna.
 *
 * ⚠️ EL FORMULARIO EN FRASE SE QUEDA. La consigna decía «como el formulario de
 * plan an event», y lo que se toma de ahí es LA LOSA, no el formulario: son
 * cinco campos, y la oración con huecos funciona justamente porque son cinco.
 * El propio `/events` documenta por qué él no la copió con quince.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️ LO QUE NO SE TOCÓ, y no por inercia: los horarios y el mapa. La spec de
 * internas (`docs/prompt-claude-design-internas.md` §7.9) los pone como el
 * contenido principal de esta página, porque los dos sets de horario son la
 * confusión número uno del negocio. Siguen DEBAJO del formulario, en su propia
 * banda y sobre otra superficie.
 *
 * ⚠️ EL MAPA ES LA ÚNICA COSA PESADA DE LA PÁGINA Y NO SE CARGA SOLO. Ver
 * `components/shared/MapEmbed.tsx`: la dirección, el teléfono y el link a
 * indicaciones están en HTML plano y no dependen de que baje nada.
 *
 * ⚠️ GIFT CARDS APARECE EXACTAMENTE DOS VECES. Pedido de Camila: bien visible,
 * pero «no en loop». Una en la columna de datos y otra en la banda de cierre.
 * Las dos salen a Toast, que es el único enlace de comercio real del negocio,
 * así que van con `target="_blank"` y `rel="noopener noreferrer"` más el aviso
 * en texto de que abren otra pestaña.
 *
 * ⚠️ JSON-LD: `venueJsonLd()` ya emite el `BarOrPub` con dirección, horarios
 * (`openingHours` desde `content/hours.ts`) y teléfono. No se escribe uno a
 * mano acá: sería una segunda fuente del mismo dato.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️ EL RITMO DE SUPERFICIES:
 *
 *     hero        bone   (la placa y la foto)
 *     formulario  paper  ← el panel va en bone, que es lo que sostiene los campos
 *     horarios    bone
 *     cierre      DEEP   ← única oscura
 *
 * Ninguna queda pegada a otra del mismo color y hay una sola `deep`, que es lo
 * que pide `npm run check:surfaces`.
 * ══════════════════════════════════════════════════════════════════════════
 */

/**
 * ⚠️ LOS DATOS DUROS SALEN DE LA BASE DE RESTOEXP, no de `brand.ts`.
 *
 * `getLocation()` lee la tabla `locations` con la anon key que ya estaba en
 * `.env.local`. Verificado el 2026-09-15: teléfono, mail, dirección, ciudad,
 * coordenadas, link de Maps y zona horaria coinciden exacto con lo que tenía
 * el repo, así que a partir de ahora los edita el cliente desde el dashboard y
 * el sitio los sigue solo.
 *
 * ⚠️ `BRAND` QUEDA COMO RESPALDO, no como fuente. Si la base no contesta, la
 * página se sirve igual con el último valor conocido: un teléfono viejo es
 * mejor que un 500 en la página de contacto.
 *
 * ⚠️ CUATRO DATOS NO ESTÁN EN LA BASE y siguen saliendo de `brand.ts` porque
 * no hay columna donde guardarlos: el estado (FL), el código postal (34135),
 * los mails de eventos y de trabajo —la tabla tiene UNA sola columna `email`—
 * y el texto del barrio. Y `social_links` viene en `null`.
 * TODO: confirmar con cliente si esos campos se pueden cargar en el dashboard.
 */
export default async function ContactPage() {
  const venue = await getVenue();

  /*
   * ⚠️ CADA BUZÓN LLEVA PARA QUÉ ES, y esa línea es medio bloque.
   *
   * Tres direcciones sin explicación obligan a adivinar, y quien adivina mal
   * escribe a la general: el buzón de eventos existe justamente para que una
   * consulta de $20.000 no caiga en el mismo lugar que una pregunta sobre el
   * horario. Por el mismo motivo `events@` NO va en el footer (ver
   * `docs/layout-motion.md`): vive sólo acá y en el hub de eventos.
   */
  const buzones = [
    {
      label: 'General',
      address: venue.email,
      what: 'Hours, the yard, a jacket someone left on a bench, anything that does not fit below.',
    },
    {
      label: 'Private events',
      address: venue.emailEvents,
      what: 'Buyouts and private parties. It lands with the person who prices them.',
    },
    {
      label: 'Working here',
      address: venue.emailHiring,
      what: 'Bar and venue jobs. The trucks are separate businesses and hire their own crews.',
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(venueJsonLd(venue)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbJsonLd([{ name: 'Contact', path: '/contact' }])),
        }}
      />

      {/* ══ 1. El hero ════════════════════════════════════════════════════ */}

      {/*
        ⚠️ EL TITULAR PARTE EN DOS RENGLONES Y ESO ES UN CONTRATO, no un
        detalle de escritura: el solapamiento de `PlateHero` es `-0.94em`, que
        es exactamente media placa de DOS renglones. Con uno solo, la foto le
        pasa por encima al titular entero.

        ⚠️ Y EL TEXTO PLANO TIENE QUE DAR «Say hello», que es el H1 que fija
        `PAGE_SEO` y lo que compara `npm run check:seo`. El `<span>` parte el
        renglón y pinta el color; no agrega ni saca una palabra.
      */}
      <PlateHero
        question="Trying to reach the rooftop in Bonita Springs?"
        title={
          <>
            {'Say '}
            <span className="block text-sunset-deep">hello</span>
          </>
        }
        lead="Three inboxes, so your message lands with the person who can answer it instead of a shared one. If it is urgent, the phone is faster than all of it."
        photo="/images/venue/contact-bar-day-wide.jpg"
        photoAlt="Guests at the bar at Rooftop at Riverside on a weekday afternoon"
      >
        {/*
          ⚠️ EL SEGUNDO CTA NO ES EL TELÉFONO, Y SE MIDIÓ. «Call (239)
          268-0080» son 19 caracteres, uno menos que el presupuesto de 20 que
          declara `BASE` en `Button.tsx`, pero el presupuesto es una guía y el
          ancho real depende de la letra: en `size="lg"` esa etiqueta da 293px
          y a 320px de viewport quedan 288 útiles. Como la etiqueta va con
          `nowrap`, no se parte: mete scroll horizontal a todo el documento.
          Es exactamente el error que ya está documentado en `/events`.

          El teléfono no se pierde: es la píldora grande de la columna de
          datos, dos pantallas más abajo pero a tamaño de titular.
        */}
        <ButtonLink href="#write" variant="primary" size="lg">
          Write to us
        </ButtonLink>
        <ButtonLink href="#find" variant="secondary" size="lg">
          Hours and map
        </ButtonLink>
      </PlateHero>

      {/* ══ 2. La losa del formulario, con los datos al costado ═══════════ */}

      <FormSlab
        id="write"
        eyebrow="Write to us"
        eyebrowTone="deep"
        title="Three inboxes"
        titleId="write-title"
        lead="Pick the one that fits. The form does the same thing if you would rather type than open your mail app."
        aside={
          <div className="flex flex-col gap-9">
            {/*
              ── Lo que sobrevive del collage ───────────────────────────────
              ⚠️ ESTO ERA EL ENCABEZADO DE LA PÁGINA y ahora encabeza la
              columna. La píldora y el círculo son las mismas dos piezas, con
              el mismo filete punteado y los mismos colores; lo único que
              cambió es la escala, de 104px de alto a 60.

              ⚠️ LA PÍLDORA SIGUE EN `mint` Y NO EN `sunset`. El naranja es del
              CTA primario y en esta pantalla el CTA es el formulario. `mint`
              es el token de las formas grandes de acento y la tinta encima
              queda en `ink`, o sea el mismo 15:1 de siempre.

              ⚠️ ES UN `<a href="tel:">` DE VERDAD, no un número pintado
              grande: los 60px de alto son todos área de toque, bastante más
              que los 44 del mínimo.
            */}
            <div className="flex items-center gap-3">
              <a
                href={venue.phoneHref}
                className="flex h-[60px] flex-1 items-center justify-center rounded-pill border-2 border-dashed border-ink/30 bg-mint px-4 font-display text-d6 font-semibold uppercase leading-none text-ink transition-colors hover:bg-river/30 sm:text-d5"
              >
                {venue.phone}
              </a>
              <a
                href={BRAND.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-[60px] shrink-0 items-center justify-center rounded-full border-2 border-dashed border-ink/30 bg-cream text-ink transition-colors hover:bg-sunset"
              >
                <Instagram className="size-6" aria-hidden="true" />
                <span className="sr-only">
                  @{instagramHandle()} on Instagram (opens in a new tab)
                </span>
              </a>
            </div>

            {/* ── Los tres buzones ──────────────────────────────────────── */}
            <ul className="flex list-none flex-col gap-7 p-0">
              {buzones.map((b) => (
                <li key={b.address}>
                  <Heading level={3} role="label">
                    {b.label}
                  </Heading>
                  <p className="mt-[10px]">
                    <a
                      href={'mailto:' + b.address}
                      className="link-texto break-all font-display text-d5 font-semibold uppercase leading-none text-ink"
                    >
                      {b.address}
                    </a>
                  </p>
                  <p className="mt-[10px] max-w-[46ch] text-[16px] leading-[1.65] text-body/80">
                    {b.what}
                  </p>
                </li>
              ))}
            </ul>

            <hr className="w-full border-0 border-t border-ink/15" />

            {/* ── La dirección ─────────────────────────────────────────── */}
            <div>
              <Heading level={3} role="label">
                Come by
              </Heading>
              <address className="mt-[12px] not-italic">
                <p className="text-lead leading-[1.5]">
                  {venue.street}
                  <br />
                  {venue.locality}, {venue.region} {venue.postalCode}
                </p>
                <p className="mt-[10px] text-[16px] text-body/80">{venue.neighborhood}</p>
              </address>
              <p className="mt-[14px] text-[15px] leading-[1.6] text-body/75">
                Cancellations and weather calls go up on{' '}
                <a
                  href={BRAND.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-texto font-bold"
                >
                  @{instagramHandle()}
                  <span className="sr-only">(opens in a new tab)</span>
                </a>{' '}
                first.
              </p>
            </div>

            {/* ── Gift cards, 1 de 2 ───────────────────────────────────── */}
            <div className="rounded-card border border-ink/15 bg-paper p-[24px]">
              <Heading level={3} role="card">
                Gift cards
              </Heading>
              <p className="mt-[10px] max-w-[42ch] text-[16px] leading-[1.7] text-body/80">
                Good at the bar upstairs. The food trucks are independent businesses and take their
                own payment, so a card covers what is ours.
              </p>
              <div className="mt-[18px]">
                <ButtonLink href={BRAND.giftCards} variant="primary" external>
                  Buy a gift card
                </ButtonLink>
              </div>
            </div>
          </div>
        }
      >
        <ContactForm />
      </FormSlab>

      {/* ══ 3. Horarios y mapa ════════════════════════════════════════════ */}

      <Section id="find" tone="bone" band="lg" labelledBy="find-title" className="scroll-mt-24">
        <SectionHead
          eyebrow="Hours and map"
          eyebrowTone="plum"
          id="find-title"
          title="When we are open, and where"
          lead="The bar and the trucks keep different hours every single day. On Saturday the bar runs three hours past the last window."
        />

        <div className="mt-[40px] grid gap-[32px] lg:grid-cols-[1fr_1.15fr] lg:gap-[48px]">
          <div>
            <HoursCard hours={venue.hours} />
            {/*
              ⚠️ ACÁ IBA UN PÁRRAFO DE ESTACIONAMIENTO SIN FUENTE, y por eso se
              había sacado. El dato apareció el 2026-09-22 —la página `/parking`
              del sitio viejo— y ya no es un párrafo suelto: es la sección
              entera de acá abajo, con el mapa dibujado.
            */}
          </div>

          <MapEmbed label="Show the map" />
        </div>
      </Section>

      {/* ══ 4. Dónde estacionar ═══════════════════════════════════════════ */}

      {/*
        ⚠️ ES UNA SECCIÓN Y NO UN PÁRRAFO DENTRO DE LA DE ARRIBA, aunque las dos
        hablen de cómo llegar. Dos mapas apilados en la misma sección compiten:
        el de Google contesta «dónde queda esto» y el dibujado contesta «dónde
        dejo el auto», que son dos preguntas distintas y se hacen en ese orden.
        Separadas, además, esta gana su propia ancla —`#parking`, que es a donde
        apunta el bloque Parking de la home desde que existe.
      */}
      <Section id="parking" tone="paper" band="lg" labelledBy="parking-title" className="scroll-mt-24">
        <SectionHead
          eyebrow="Parking"
          eyebrowTone="terra"
          id="parking-title"
          title="Where to park"
          lead="Old 41 Rd runs right past the door, and the parking is spread over the blocks around it. Five areas, north to south."
        />

        {/*
          El dibujo primero y la lista después en mobile; al lado en desktop. Es
          el mismo reparto que usa la sección de horarios de acá arriba, con las
          columnas al revés: allá el dato manda y el mapa acompaña, acá el mapa
          es lo que contesta la pregunta de un vistazo.
        */}
        {/*
          ⚠️ EL MAPA TIENE TOPE DE ANCHO Y LA LISTA NO. El dibujo es más alto
          que ancho —670 × 900—, así que dejarlo estirarse a media página lo
          manda a 900 px de alto y abre un pozo de aire al lado de una lista de
          cinco renglones. Con el tope, el mapa mide lo que tiene que medir y la
          lista se queda con el resto.
        */}
        <div className="mt-[40px] grid gap-[36px] lg:grid-cols-[minmax(0,470px)_minmax(0,1fr)] lg:gap-[56px]">
          <ParkingMap />
          <ParkingList className="lg:pt-1" />
        </div>
      </Section>

      {/* ══ 5. Cierre: gift cards, 2 de 2 ═════════════════════════════════ */}

      <Section tone="deep" band="md" labelledBy="gift-title">
        <div className="flex flex-col items-start gap-[24px] lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Eyebrow tone="cream">Gift cards</Eyebrow>
            <Heading
              level={2}
              id="gift-title"
              className="mt-gap-kicker max-w-[18ch] text-d4 lg:text-d3"
            >
              Someone else&rsquo;s round, on you
            </Heading>
            <p className="mt-[12px] max-w-[46ch] text-[16px] leading-[1.7] text-paper/80">
              {venueAddressLine(venue)}
            </p>
          </div>
          <a
            href={BRAND.giftCards}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10.5 shrink-0 items-center gap-[8px] whitespace-nowrap rounded-pill bg-sunset px-[28px] font-body text-cta font-bold tracking-cta text-ink transition-colors hover:bg-sunset-hover"
          >
            Buy a gift card
            <ArrowSquareOut className="size-4" aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </Section>
    </>
  );
}
