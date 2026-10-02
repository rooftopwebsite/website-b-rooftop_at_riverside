import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ButtonLink } from '@/components/shared/Button';
import CompareSlab, { PADDING_CRUCE } from '@/components/shared/CompareSlab';
import TruckCards from '@/components/sections/TruckCards';
import PageHeroWave from '@/components/shared/PageHeroWave';
import Section from '@/components/shared/Section';
import { Heading, SectionHead } from '@/components/shared/Type';
import { activeTrucks } from '@/content/trucks';
import { BRAND } from '@/lib/brand';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  route: "/food-trucks",
});

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

      <PageHeroWave
        eyebrow="The yard"
        accent="Big flavors,"
        title="out in the yard"
        lead="Every truck is run by its own chef, with its own specialties and its own menu. Walk the yard, talk to the chefs, and try a little of everything."
        from="paper"
        to="mint"
      >
        <ButtonLink href="#roster-title" variant="primary" size="lg">
          See the menus
        </ButtonLink>
      </PageHeroWave>
      <TruckCards tone="mint" head={false} />
      <CompareSlab
        from="mint"
        id="how-pay"
        eyebrow="How this works"
        accent="Start at the bar,"
        title="then follow your appetite"
        lead="Eat at the trucks or right from your seat. Either way, everyone at the table gets to pick their favorite."
        cta={{ label: 'See the bar menu', href: '/sunset-bar#carta-title' }}
        ours={{
          label: 'How ordering works',
          steps: [
            {
              title: 'Grab a drink',
              body: 'Start at the Sunset Bar, or take a seat and a server will come to you.',
            },
            {
              title: 'Meet the chefs',
              body: 'Walk the yard, talk to the chefs and see what each truck is cooking today.',
            },
            {
              title: 'Order your way',
              body: 'Order in line at any truck and take a pager. Or scan the QR code at your seat, follow the steps on your phone, and we bring the food to your table.',
            },
            {
              title: 'One check for everything',
              body: 'With the QR code you can order for yourself or the whole table, from every truck, on one check with one payment. We bring it anywhere on site.',
            },
          ],
        }}
      />
      <Section band="md" bandTop="none" labelledBy="rota-title" innerClassName={PADDING_CRUCE}>
        <div className="relative rounded-frame bg-cream grano px-5 pt-14 pb-20 text-center sm:px-16 sm:pt-16 sm:pb-16 lg:px-24">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-3.5 rounded-shell border border-dashed border-deep/35"
          />
          <Image
            src="/brand/isotype-truck.svg"
            alt=""
            aria-hidden="true"
            width={552}
            height={390}
            className="pointer-events-none absolute right-6 bottom-6 hidden w-24 opacity-30 sm:block lg:right-9 lg:bottom-8 lg:w-32"
          />

          <div className="relative">
            <Heading level={2} id="rota-title" className="mx-auto max-w-[18ch] text-d4 lg:text-d3">
              Something different for every craving
            </Heading>
            <p className="mx-auto mt-5 max-w-[52ch] font-body text-lead font-light leading-[1.5] text-ink">
              Our chefs are independent operators, and if you think these menus are creative, wait
              until you see their specials. Follow us for what they cook up next.
            </p>
            <div className="mt-8 flex justify-center">
              <ButtonLink href={BRAND.social.instagram} variant="dark" external>
                Follow on Instagram
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
