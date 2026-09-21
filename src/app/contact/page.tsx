import type { Metadata } from 'next';
import ContactForm from '@/components/sections/ContactForm';
import ContactHero from '@/components/sections/ContactHero';
import { ButtonLink } from '@/components/shared/Button';
import HoursCard from '@/components/shared/HoursCard';
import { ArrowSquareOut } from '@/components/shared/Icon';
import MapEmbed from '@/components/shared/MapEmbed';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import { BRAND, instagramHandle } from '@/lib/brand';
import { getVenue, venueAddressLine } from '@/lib/venue';
import { breadcrumbJsonLd, jsonLdScript, pageMeta, venueJsonLd } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  route: '/contact',
  image: {
    url: '/images/venue/wall-guests-yard-day.jpg',
    width: 1000,
    height: 1250,
    alt: 'Guests in the yard at Rooftop at Riverside during the day',
  },
});

/**
 * `/contact` — los tres buzones, el formulario, los horarios y el mapa.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LA PÁGINA ESTÁ ARMADA SOBRE `defoodtruckclub.nl/contact`. Pedido de
 * Camila, 2026-09-16: copiar su estructura y traer de nuestras otras secciones
 * los layouts que hagan falta para todo lo que va acá.
 *
 * La referencia tiene TRES bloques y nada más:
 *
 *   1. un encabezado COLLAGE, donde el mail y el teléfono son piezas del
 *      tamaño de las letras del titular;
 *   2. una losa de formulario a dos columnas: a la izquierda un texto corto y
 *      los datos de la empresa, a la derecha una caja de radio grande con
 *      filete punteado por dentro y el formulario escrito como una FRASE;
 *   3. el footer.
 *
 * No tiene horarios, no tiene mapa y no tiene foto.
 *
 * ⚠️ NOSOTROS SÍ LOS TENEMOS, y no por inercia: la spec de internas
 * (`docs/prompt-claude-design-internas.md` §7.9) los pone como el contenido
 * principal de esta página, porque los dos sets de horario son la confusión
 * número uno del negocio. Van DEBAJO del formulario, en su propia banda y
 * sobre otra superficie, para que la estructura de arriba siga siendo la de la
 * referencia y no se lean como continuación de la losa.
 *
 * Los bloques nuestros salen de piezas que ya existen: la onda del encabezado
 * es la de `/food-trucks`, la tarjeta de horarios y el mapa diferido son los
 * mismos de siempre, y la banda oscura de cierre es la que cierra las nueve
 * internas.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ EL MAPA ES LA ÚNICA COSA PESADA DE LA PÁGINA Y NO SE CARGA SOLO. Ver
 * `components/shared/MapEmbed.tsx`: la dirección, el teléfono y el link a
 * indicaciones están en HTML plano y no dependen de que baje nada.
 *
 * ⚠️ GIFT CARDS APARECE EXACTAMENTE DOS VECES. Pedido de Camila: bien visible,
 * pero «no en loop». Una en la columna de datos, arriba del pliegue, y otra en
 * la banda de cierre. Las dos salen a Toast, que es el único enlace de
 * comercio real que tiene el negocio, así que van con `target="_blank"` y
 * `rel="noopener noreferrer"` más el aviso en texto de que abren otra pestaña.
 *
 * ⚠️ JSON-LD: `venueJsonLd()` ya emite el `BarOrPub` con dirección, horarios
 * (`openingHours` desde `content/hours.ts`) y teléfono. No se escribe uno a
 * mano acá: sería una segunda fuente del mismo dato.
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

      {/* ══ 1. El encabezado collage ══════════════════════════════════════ */}

      <ContactHero
        eyebrow="Contact"
        title={['Say', 'hello']}
        lead="Three inboxes, so your message lands with the person who can answer it instead of a shared one. If it is urgent, the phone is faster than all of it."
        phone={venue.phone}
        phoneHref={venue.phoneHref}
        instagram={BRAND.social.instagram}
        handle={'@' + instagramHandle()}
        from="bone"
        to="paper"
      />

      {/* ══ 2. La losa del formulario, con los buzones al costado ═════════ */}

      <Section band="lg" labelledBy="write-title">
        {/*
          ⚠️ `items-start` NO ES COSMÉTICO. Sin él las dos columnas son igual
          de altas, y como la izquierda es más larga, la losa del formulario se
          estiraba hasta su altura: quedaban 250px de fondo `bone` vacíos
          debajo del botón de enviar, con el filete punteado corriendo por el
          costado de la nada. La caja tiene que terminar donde termina el
          formulario, como en la referencia.
        */}
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          {/*
            ── La columna de datos ────────────────────────────────────────
            Es la que en la referencia lleva la razón social, el KVK y el
            número de IVA: texto corto, un filete y los datos duros. Lo nuestro
            en ese lugar son los tres buzones y la dirección.
          */}
          <div>
            <SectionHead
              eyebrow="Write to us"
              eyebrowTone="deep"
              id="write-title"
              title="Three inboxes"
              lead="Pick the one that fits. The form does the same thing if you would rather type than open your mail app."
            />

            <div className="filete mt-9" />

            <ul className="mt-9 flex list-none flex-col gap-7">
              {buzones.map((b) => (
                <li key={b.address}>
                  <Heading level={2} role="label">
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

            <div className="filete mt-9" />

            <div className="mt-9">
              <Heading level={2} role="label">
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

            {/* ── Gift cards, 1 de 2 ─────────────────────────────────────── */}
            <div className="mt-9 rounded-card border border-ink/15 bg-bone p-[24px]">
              <Heading level={2} role="card">
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

          {/*
            ── La losa ────────────────────────────────────────────────────
            ⚠️ SON DOS CAJAS, UNA ADENTRO DE LA OTRA, y así está hecha la de la
            referencia: la de afuera pone el color y el radio grande, la de
            adentro pone el filete punteado y el aire. Con una sola caja, un
            borde punteado sobre el radio de 44px queda pegado al contenido en
            las esquinas, que es donde la curva se come el padding.

            ⚠️ LA LOSA VA EN `bone` SOBRE SECCIÓN `paper`, y no al revés. Los
            campos son blancos: si la caja también fuera blanca, la píldora de
            cada campo quedaría sostenida sólo por su borde de 1px. Con la caja
            un escalón más oscura, los cinco campos se leen a distancia.
          */}
          <div className="rounded-frame bg-bone p-3 sm:p-4">
            <div className="rounded-shell border-2 border-dashed border-ink/20 px-6 py-10 sm:px-10 lg:px-12 lg:py-12">
              <ContactForm />
            </div>
          </div>
        </div>
      </Section>

      {/* ══ 3. Horarios y mapa ════════════════════════════════════════════ */}

      <Section tone="bone" band="lg" labelledBy="find-title">
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
              ⚠️ ACÁ IBA EL MISMO PÁRRAFO DE ESTACIONAMIENTO QUE EN
              `/our-story`, y se sacó por el mismo motivo: no tiene fuente.
              TODO: confirmar con cliente el contenido del mapa de parking.
            */}
          </div>

          <MapEmbed label="Show the map" />
        </div>
      </Section>

      {/* ══ 4. Cierre: gift cards, 2 de 2 ═════════════════════════════════ */}

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
