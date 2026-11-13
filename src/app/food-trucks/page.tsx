import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ButtonLink } from '@/components/shared/Button';
import CompareSlab, { CROSS_PADDING } from '@/components/shared/CompareSlab';
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

export const revalidate = 300;

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
        accent="Flavor Takes Center Stage"
        title="in The Yard"
        lead="Let the live music, lively chatter, and smoky grill aromas lead you straight into The Yard. Stroll from truck to truck, chat with our local chefs, and dig into everything from fresh seafood and American favorites to Mexican street eats and Caribbean fusion."
        from="paper"
        to="mint"
      />
      <TruckCards tone="mint" head={false} />
      <CompareSlab
        from="mint"
        id="how-pay"
        eyebrow="How this works"
        accent="Start at the bar,"
        title="then follow your appetite"
        lead="Start with a drink, then walk the yard. Everyone at the table gets to pick their favorite."
        cta={{ label: 'See the bar menu', href: '/sunset-bar#bar-menu-button' }}
        ours={{
          label: 'How ordering works',
          steps: [
            {
              title: 'Grab a Drink',
              body: 'Pull up a seat at the bar or let our hostess find you the perfect spot in The Yard. Order your favorite drink, check out our house specialties, and see what’s on special.',
            },
            {
              title: 'Explore the Food Trucks',
              body: 'Take a stroll through The Yard, meet our chefs, and see what’s cooking. Or scan the QR code at your seat to order dinner for the whole table on one check, with our food runners bringing everything right to you.',
            },
            {
              title: 'Kick Back & Relax',
              body: 'Settle in with great food, cold drinks, and live music while enjoying the beautiful Southwest Florida weather and the energy of Downtown Bonita Springs. Stay for a little while or make an entire evening of it.',
            },
          ],
        }}
      />
      <Section band="md" bandTop="none" labelledBy="rotation-title" innerClassName={CROSS_PADDING}>
        <div className="relative rounded-frame bg-cream grain px-5 pt-14 pb-20 text-center sm:px-16 sm:pt-16 sm:pb-16 lg:px-24">
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
            <Heading level={2} id="rotation-title" className="mx-auto max-w-[18ch] text-d4 lg:text-d3">
              We’ve Got Something for Everyone!
            </Heading>
            <p className="mx-auto mt-5 max-w-[52ch] font-body text-lead font-light leading-[1.5] text-ink">
              Four independently operated food trucks, four creative menus, and plenty of reasons to
              come back for another taste. From everyday favorites to specials you won’t always find
              on the menu, our trucks are always bringing something delicious to The Yard. Follow
              your favorites on Instagram to see what they’re cooking up next.
            </p>
            <div className="mt-8 flex justify-center">
              <ButtonLink href={BRAND.social.instagram} variant="primary" external>
                Follow on Instagram
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
