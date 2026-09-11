import type { Metadata } from 'next';
import TruckCarousel from '@/components/sections/TruckCarousel';
import PageHero from '@/components/shared/PageHero';
import Section from '@/components/shared/Section';
import { Heading, SectionHead } from '@/components/shared/Type';
import { activeTrucks } from '@/content/trucks';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  route: "/food-trucks",
});

/**
 * /food-trucks
 *
 * ⚠️ La grilla lleva los trucks MÁS UNA QUINTA TARJETA que es el Sunset Bar, al
 * mismo nivel visual. Eso comunica el modelo de negocio sin explicarlo: acá hay
 * cinco lugares donde gastar plata y sólo uno es del venue.
 *
 * ⚠️ Sin precios de los trucks. Los precios son del vendor, no del venue.
 *
 * ⚠️ La rotación NO se muestra acá. Qué truck está hoy vive en el home y en
 * /whats-on.
 */
export default function FoodTrucksPage() {
  const trucks = activeTrucks();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbJsonLd([{ name: 'Food Trucks', path: '/food-trucks' }])),
        }}
      />

      <PageHero
        eyebrow="The yard"
        title="Four kitchens. One yard."
        lead="The trucks rotate. Each one is independently owned, sets its own menu and takes its own payment. We just give them the yard and the crowd."
        crumbs={[{ name: 'Food Trucks', path: '/food-trucks' }]}
      />

      <Section band="lg" labelledBy="roster-title">
        <SectionHead
          eyebrow="In the yard now"
          eyebrowTone="terra"
          id="roster-title"
          title="Tonight's roster"
          lead="Which trucks are in on a given night is on the calendar."
        />

        <TruckCarousel trucks={trucks} />
      </Section>

      {/* ── Cómo funciona el pago ──────────────────────────────────────── */}
      <Section tone="cream" band="md" labelledBy="how-pay">
        <div className="grid gap-[32px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-[64px]">
          <Heading level={2} id="how-pay" className="text-d5 lg:text-d4">
            One yard, five registers
          </Heading>
          <div className="flex flex-col gap-[14px] text-[16px] leading-[1.7] text-body/80">
            <p>
              Every truck runs its own business. You order at the window you want and you pay that
              truck: separate line, separate card, separate receipt.
            </p>
            <p>
              Drinks are the exception: those come from the Sunset Bar upstairs, and that one is
              ours. It&rsquo;s also the only menu on this site with prices, because it&rsquo;s the
              only one we set.
            </p>
            <p>
              No delivery, no takeout, no online ordering. Walk in, find a table, order at the
              window.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
