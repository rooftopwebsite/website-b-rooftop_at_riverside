import type { Metadata } from 'next';
import ContactForm from '@/components/sections/ContactForm';
import { ButtonLink } from '@/components/shared/Button';
import HoursCard from '@/components/shared/HoursCard';
import { ArrowSquareOut, Instagram } from '@/components/shared/Icon';
import MapEmbed from '@/components/shared/MapEmbed';
import PageHero from '@/components/shared/PageHero';
import Section from '@/components/shared/Section';
import { Heading, SectionHead } from '@/components/shared/Type';
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
 * `/contact` — dirección, horarios, formulario y gift cards.
 *
 * ⚠️ EL ENCABEZADO ES EL PESO CHICO: sólo tipografía y un filete, sin foto
 * grande. Es la página a la que se llega buscando un dato, no una que haya que
 * vender, y una foto a sangre arriba empuja el teléfono abajo del pliegue.
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

  // El mail general sale de la base; los otros dos no tienen columna propia.
  const emails = [
    { label: 'General', address: venue.email },
    { label: 'Private events', address: venue.emailEvents },
    { label: 'Working here', address: venue.emailHiring },
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

      <PageHero
        eyebrow="Contact"
        title="Say hello"
        lead="The address, the hours and a form that goes to a person. If it is urgent, the phone is faster than all of it."
        crumbs={[{ name: 'Contact', path: '/contact' }]}
      />

      {/* ══ Formulario + datos ════════════════════════════════════════════ */}

      <Section bandTop="md" band="lg" labelledBy="write-title">
        <div className="grid gap-[48px] lg:grid-cols-[1.15fr_1fr] lg:gap-[72px]">
          <div>
            <SectionHead
              eyebrow="Write to us"
              eyebrowTone="deep"
              id="write-title"
              title="Send a note"
              lead="Tell us what it is about and it goes to whoever can answer it."
            />
            <div className="mt-[36px]">
              <ContactForm />
            </div>
          </div>

          {/* ── La columna de datos duros ──────────────────────────────── */}
          <div className="flex flex-col gap-[36px]">
            <div>
              <Heading level={2} role="label">
                Come by
              </Heading>
              <address className="mt-[14px] not-italic">
                <p className="text-lead leading-[1.5]">
                  {venue.street}
                  <br />
                  {venue.locality}, {venue.region} {venue.postalCode}
                </p>
                <p className="mt-[10px] text-[16px] text-body/80">{venue.neighborhood}</p>
              </address>
            </div>

            <div>
              <Heading level={2} role="label">
                Call
              </Heading>
              <p className="mt-[14px]">
                <a
                  href={venue.phoneHref}
                  className="link-texto font-display text-d5 uppercase leading-none lg:text-d4"
                >
                  {venue.phone}
                </a>
              </p>
            </div>

            <div>
              <Heading level={2} role="label">
                Email
              </Heading>
              <ul className="mt-[14px] flex list-none flex-col gap-[10px]">
                {emails.map((e) => (
                  <li key={e.address} className="text-[16px]">
                    <span className="text-body/70">{e.label}: </span>
                    <a href={`mailto:${e.address}`} className="link-texto break-all font-bold">
                      {e.address}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Heading level={2} role="label">
                Follow
              </Heading>
              <p className="mt-[14px]">
                <a
                  href={BRAND.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-texto inline-flex items-center gap-[8px] font-bold"
                >
                  <Instagram className="size-5" aria-hidden="true" />
                  @{instagramHandle()}
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </p>
              <p className="mt-[8px] text-[15px] text-body/70">
                Cancellations and weather calls go up there first.
              </p>
            </div>

            {/* ── Gift cards, 1 de 2 ─────────────────────────────────────── */}
            <div className="rounded-card border border-ink/15 bg-bone p-[24px]">
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
        </div>
      </Section>

      {/* ══ Horarios + mapa ═══════════════════════════════════════════════ */}

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

      {/* ══ Cierre: gift cards, 2 de 2 ════════════════════════════════════ */}

      <Section tone="deep" band="md" labelledBy="gift-title">
        <div className="flex flex-col items-start gap-[24px] lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Heading level={2} id="gift-title" className="max-w-[18ch] text-d4 lg:text-d3">
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
            className="inline-flex h-10.5 shrink-0 items-center gap-[8px] rounded-pill bg-sunset px-[28px] font-body text-cta font-bold tracking-cta text-ink transition-colors hover:bg-sunset-hover"
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
