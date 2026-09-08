import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { RevealItem, StaggerGroup } from '@/components/shared/Motion';
import PageHero from '@/components/shared/PageHero';
import { PhotoPending } from '@/components/shared/PendingData';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import { activeTrucks } from '@/content/trucks';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Food Trucks in Bonita Springs',
  description:
    'Four independent food trucks park in the yard at Rooftop at Riverside: tacos, seafood, smashburgers and Caribbean. Each one takes its own orders. Upstairs, the Sunset Bar is ours.',
  path: '/food-trucks',
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
        title="Four kitchens, four businesses"
        lead="The trucks rotate. Each one is independently owned, sets its own menu and takes its own payment — we just give them the yard and the crowd."
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

        <StaggerGroup as="ul" className="mt-[48px] grid gap-[28px] sm:grid-cols-2 lg:grid-cols-3">
          {trucks.map((t) => (
            <RevealItem as="li" key={t.slug}>
              <Link href={`/food-trucks/${t.slug}`} className="group flex h-full flex-col">
                {t.photo ? (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-mint">
                    <Image
                      src={t.photo}
                      alt={t.photoAlt ?? ''}
                      fill
                      sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 ease-brand group-hover:scale-[1.03]"
                    />
                  </div>
                ) : (
                  <PhotoPending brief={t.photoBrief} />
                )}
                <Eyebrow tone="deep" className="mt-[18px]">
                  {t.cuisine}
                </Eyebrow>
                <Heading level={2} role="card" className="mt-[6px]">
                  {t.name}
                </Heading>
                <p className="mt-[8px] flex-1 text-[15px] leading-[1.6] text-body/75">
                  {t.specialty}
                </p>
                <span
                  aria-hidden="true"
                  className="mt-[14px] text-caption font-bold uppercase tracking-[0.14em] underline decoration-ink/45 decoration-1 underline-offset-4 transition-[text-decoration-color] group-hover:decoration-sunset group-hover:decoration-2"
                >
                  Meet the truck
                </span>
              </Link>
            </RevealItem>
          ))}

          {/* ── La quinta tarjeta: el Sunset Bar ────────────────────────
              Al mismo nivel visual que los trucks, y a propósito. Es la
              diferencia entre «los trucks + una barra» y «cinco negocios,
              uno de los cuales es nuestro». */}
          <RevealItem as="li">
            <Link href="/sunset-bar" className="group flex h-full flex-col">
              <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-mint">
                <Image
                  src="/images/venue-rooftop.jpg"
                  alt="The Sunset Bar rooftop at Rooftop at Riverside"
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-brand group-hover:scale-[1.03]"
                />
                <span className="absolute top-[12px] left-[12px] rounded-btn bg-sunset px-[10px] py-[5px] text-[11px] font-bold uppercase tracking-[0.12em] text-ink">
                  Ours
                </span>
              </div>
              <Eyebrow tone="deep" className="mt-[18px]">
                Drinks
              </Eyebrow>
              <Heading level={2} role="card" className="mt-[6px]">
                Sunset Bar
              </Heading>
              <p className="mt-[8px] flex-1 text-[15px] leading-[1.6] text-body/75">
                Cocktails, local drafts and wine — the one tab that&rsquo;s ours, upstairs on the
                roof.
              </p>
              <span
                aria-hidden="true"
                className="mt-[14px] text-caption font-bold uppercase tracking-[0.14em] underline decoration-ink/45 decoration-1 underline-offset-4 transition-[text-decoration-color] group-hover:decoration-sunset group-hover:decoration-2"
              >
                See the menu
              </span>
            </Link>
          </RevealItem>
        </StaggerGroup>
      </Section>

      {/* ── Cómo funciona el pago ──────────────────────────────────────── */}
      <Section tone="cream" band="md" labelledBy="how-pay">
        <div className="grid gap-[32px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-[64px]">
          <Heading level={2} id="how-pay" className="text-d5 lg:text-d4">
            One yard, five registers
          </Heading>
          <div className="flex flex-col gap-[14px] text-[15px] leading-[1.7] text-body/80">
            <p>
              Every truck runs its own business. You order at the window you want and you pay that
              truck — separate line, separate card, separate receipt.
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
