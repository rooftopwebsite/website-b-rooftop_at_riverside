import type { Metadata } from 'next';
import { ButtonLink } from '@/components/shared/Button';
import SeasonalCocktailCard from '@/components/sections/SeasonalCocktailCard';
import PlateHero from '@/components/shared/PlateHero';
import Section from '@/components/shared/Section';
import { Heading } from '@/components/shared/Type';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';
import { getSeasonalCocktails } from '@/lib/sanity-seasonal-cocktails';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const items = await getSeasonalCocktails();
  return pageMeta({
    title: 'Seasonal Cocktails',
    description:
      'See the seasonal cocktails featured at Rooftop at Riverside in downtown Bonita Springs.',
    path: '/seasonal-cocktails',
    noIndex: items.length === 0,
  });
}

const CARD_WIDTH =
  'w-full max-w-[26rem] sm:w-[calc((100%-1.5rem)/2)] sm:max-w-none lg:w-[calc((100%-3rem)/3)]';

export default async function SeasonalCocktailsPage() {
  const items = await getSeasonalCocktails();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            breadcrumbJsonLd([{ name: 'Seasonal Cocktails', path: '/seasonal-cocktails' }]),
          ),
        }}
      />
      <PlateHero
        question="What’s Pouring This Season?"
        title="Seasonal "
        titleAccent="Cocktails"
        lead="There’s always something new behind the bar. Take a look at the cocktails we’re featuring at Rooftop at Riverside, and find something worth trying on your next visit."
        photo="/images/venue/bar-cocktails-wide.webp"
        photoAlt="Four cocktails on a table on the rooftop at golden hour, with the bar and the umbrellas behind"
      />
      <Section tone="mint" band="md" labelledBy="cocktails-title">
        <Heading level={2} id="cocktails-title" className="sr-only">
          Seasonal cocktails
        </Heading>
        {items.length > 0 ? (
          <ul className="m-0 flex list-none flex-wrap justify-center gap-6 p-0">
            {items.map((c) => (
              <li key={c.id} className={`flex ${CARD_WIDTH}`}>
                <SeasonalCocktailCard cocktail={c} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="relative mx-auto max-w-[34rem] overflow-hidden rounded-frame bg-deep grain px-7 py-12 text-center text-paper card-shadow sm:px-12">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-3.5 rounded-shell border border-dashed border-paper/25"
            />
            <p className="relative m-0 font-body text-caption font-bold uppercase tracking-eyebrow text-cream">
              Seasonal cocktails
            </p>
            <p className="relative m-0 mt-3 font-display text-d3 font-extrabold uppercase leading-[0.98] text-paper sm:text-d2">
              Coming soon
            </p>
          </div>
        )}
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/sunset-bar#bar-menu-title" variant="primary" size="lg">
            See the Bar Menu
          </ButtonLink>
          <ButtonLink href="/whats-on" variant="secondary" size="lg">
            What&rsquo;s On
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
