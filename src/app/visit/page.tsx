import type { Metadata } from 'next';
import { ButtonLink } from '@/components/shared/Button';
import OpenStatus from '@/components/shared/OpenStatus';
import PageHero from '@/components/shared/PageHero';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import { BRAND, HAPPY_HOUR, HOURS, addressLine, mapsUrl } from '@/lib/brand';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  route: "/visit",
});

export default function VisitPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbJsonLd([{ name: 'Visit', path: '/visit' }])),
        }}
      />

      <PageHero
        eyebrow="Getting here"
        title="Find us across from Riverside Park"
        lead="On Old 41, across from Riverside Park. Twenty minutes from Naples, fifteen from Estero, and no cover to walk in."
        crumbs={[{ name: 'Visit', path: '/visit' }]}
      >
        <div className="flex flex-wrap gap-[12px]">
          <ButtonLink href={mapsUrl()} variant="primary" size="lg" external>
            Open in Google Maps
          </ButtonLink>
          <ButtonLink href={BRAND.contact.phoneHref} variant="secondary" size="lg">
            {BRAND.contact.phone}
          </ButtonLink>
        </div>
      </PageHero>

      {/* ── Horarios: los DOS sets ─────────────────────────────────────── */}
      <Section band="lg" labelledBy="hours-title">
        <div className="flex flex-col gap-[10px] sm:flex-row sm:items-end sm:justify-between">
          <SectionHead
            eyebrow="Hours"
            eyebrowTone="deep"
            id="hours-title"
            title="The bar and the trucks keep different hours"
            lead="The bar opens first and closes last. That gap trips people up more than anything else here."
          />
        </div>

        <div className="mt-[24px] flex flex-col gap-[6px]">
          <OpenStatus which="bar" />
          <OpenStatus which="trucks" />
        </div>

        <div className="mt-[32px] overflow-x-auto" tabIndex={0} role="region" aria-label="Opening hours, scrollable">
          <table className="w-full min-w-[520px] border-collapse text-[16px]">
            <caption className="sr-only">Opening hours for the bar and the food trucks</caption>
            <thead>
              <tr className="border-b-2 border-ink">
                <th scope="col" className="py-[12px] pr-[16px] text-left eyebrow text-body/75">
                  Day
                </th>
                <th scope="col" className="py-[12px] pr-[16px] text-left eyebrow text-body/75">
                  Sunset Bar
                </th>
                <th scope="col" className="py-[12px] text-left eyebrow text-body/75">
                  Food Trucks
                </th>
              </tr>
            </thead>
            <tbody>
              {HOURS.map((h) => (
                <tr key={h.day} className="border-b border-ink/12">
                  <th scope="row" className="py-[14px] pr-[16px] text-left font-bold">
                    {h.day}
                  </th>
                  <td className="py-[14px] pr-[16px] text-body/80">{h.bar}</td>
                  <td className="py-[14px] text-body/80">{h.trucks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-[20px] text-[16px] text-body/75">
          <span className="eyebrow text-deep">Happy hour</span>{' '}
          <span className="ml-[6px]">
            {HAPPY_HOUR.days}, {HAPPY_HOUR.time}: {HAPPY_HOUR.deals.join(' · ')}
          </span>
        </p>

        <p className="mt-[16px] max-w-[62ch] text-[16px] leading-[1.65] text-body/75">
          High season runs December through April, when the calendar is fullest and the yard is
          busiest.
        </p>
      </Section>

      {/* ── Estacionamiento ────────────────────────────────────────────── */}
      <Section tone="cream" band="lg" labelledBy="parking-title" id="parking">
        <SectionHead
          eyebrow="Parking"
          eyebrowTone="terra"
          id="parking-title"
          title="Where to leave the car"
        />

        <div className="mt-[32px] grid gap-[28px] lg:grid-cols-2 lg:gap-[56px]">
          <ul className="flex flex-col gap-[14px] text-[16px] leading-[1.7] text-body/80">
            <li className="border-b border-ink/15 pb-[14px]">
              <strong className="font-bold">Street parking on Old 41.</strong> Directly out front
              and along the block, free.
            </li>
            <li className="border-b border-ink/15 pb-[14px]">
              <strong className="font-bold">Riverside Park lots.</strong> Public parking across the
              street, a ninety-second walk.
            </li>
            <li className="border-b border-ink/15 pb-[14px]">
              <strong className="font-bold">Busy nights.</strong> Friday and Saturday in season fill
              the closest spots early. The park lots almost always have room.
            </li>
            <li>
              <strong className="font-bold">Rideshare.</strong> Drop-off on Old 41 at the main gate.
            </li>
          </ul>

          {/*
            Mapa de estacionamiento REAL de Google, centrado en el venue y con el
            zoom puesto para que entren Riverside Park y los lotes públicos.

            ⚠️ Reemplaza al «mapa» del sitio actual, que es un screenshot de un
            screenshot e ilegible a cualquier tamaño. Un mapa real además se
            puede mover y hacer zoom, y sirve de noche en un teléfono.

            ⚠️ Es un mapa de zona, no un plano de plazas: no marca lotes
            individuales. Si el cliente quiere señalizar plazas concretas hay
            que dibujar un plano encima; la lista de al lado cubre eso en texto
            mientras tanto.
          */}
          <div className="overflow-hidden rounded-card border border-ink/12">
            <iframe
              title="Map of parking around Rooftop at Riverside and Riverside Park"
              src={`https://www.google.com/maps?q=${BRAND.address.mapsQuery}&z=17&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[320px] w-full border-0 lg:h-[380px]"
            />
          </div>
        </div>
      </Section>

      {/* ── Mapa y dirección ───────────────────────────────────────────── */}
      <Section band="lg" labelledBy="where-title">
        <SectionHead eyebrow="Address" eyebrowTone="plum" id="where-title" title="Find us" />

        <div className="mt-[32px] grid gap-[32px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-[48px]">
          <div className="flex flex-col gap-[24px]">
            <address className="text-lead not-italic leading-[1.6]">
              {BRAND.address.street}
              <br />
              {BRAND.address.locality}, {BRAND.address.region} {BRAND.address.postalCode}
            </address>

            <div>
              <Eyebrow tone="deep">Neighborhood</Eyebrow>
              <p className="mt-[6px] text-[16px] leading-[1.65] text-body/75">
                {BRAND.address.neighborhood}.
              </p>
            </div>

            <div>
              <Eyebrow tone="deep">Contact</Eyebrow>
              <p className="mt-[6px] flex flex-col gap-[4px] text-[16px]">
                <a href={BRAND.contact.phoneHref} className="link-texto">
                  {BRAND.contact.phone}
                </a>
                <a href={`mailto:${BRAND.contact.email}`} className="link-texto">
                  {BRAND.contact.email}
                </a>
              </p>
            </div>

            <div className="flex flex-wrap gap-[12px]">
              <ButtonLink href={mapsUrl()} variant="secondary" external>
                Directions
              </ButtonLink>
              <ButtonLink href="/faq" variant="secondary">
                Dogs, kids, ordering
              </ButtonLink>
            </div>
          </div>

          <div className="overflow-hidden rounded-card border border-ink/12">
            <iframe
              title={`Map showing ${BRAND.name} at ${addressLine()}`}
              src={`https://www.google.com/maps?q=${BRAND.address.mapsQuery}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[360px] w-full border-0 lg:h-[460px]"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
