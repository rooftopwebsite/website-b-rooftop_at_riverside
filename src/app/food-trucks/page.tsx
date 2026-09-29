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
        accent="Four kitchens."
        title="One yard."
        lead="Each truck is independently owned, sets its own menu and takes its own payment. We just give them the yard and the crowd."
        from="paper"
        to="mint"
      />
      <TruckCards tone="mint" head={false} />
      <CompareSlab
        from="mint"
        id="how-pay"
        eyebrow="How this works"
        accent="One yard,"
        title="five registers"
        lead="Four Food Concepts: Give your guests the freedom to explore four independent kitchens, each with something different to offer."
        ours={{
          label: 'Here',
          rows: [
            'You order at whichever window you want, and you pay that truck: its own register, its own receipt',
            'Four parties at one table can each eat something different',
            'Drinks come from the Sunset Bar upstairs, and that tab is ours',
            'No waiting for a table: find a seat and go up to the window',
          ],
        }}
        theirs={{
          label: 'A regular restaurant',
          rows: [
            'One kitchen and one menu: everyone eats from the same list, on one check',
            'A server takes the order and brings it over',
            'Food and drinks land on the same bill',
            'A host seats you when a table opens',
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
              Each truck keeps its own menu, and now and then one of them runs a special. We post
              those on Instagram.
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
