import Link from 'next/link';
import type { Metadata } from 'next';
import ContactForm from '@/components/sections/ContactForm';
import FindUs from '@/components/sections/FindUs';
import { ButtonLink } from '@/components/shared/Button';
import FormSlab from '@/components/shared/FormSlab';
import { Instagram } from '@/components/shared/Icon';
import PlateHero from '@/components/shared/PlateHero';
import { Heading } from '@/components/shared/Type';
import { BRAND, instagramHandle } from '@/lib/brand';
import { getVenue } from '@/lib/venue';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  route: '/contact',
  image: {
    url: '/og/contact.jpg',
    width: 1200,
    height: 630,
    alt: 'Guests at the bar at Rooftop at Riverside on a weekday afternoon',
  },
});

export default async function ContactPage() {
  const venue = await getVenue();

  const inboxes = [
    { label: 'General', address: venue.email },
    { label: 'Private events', address: venue.emailEvents },
    { label: 'Working here', address: venue.emailHiring },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbJsonLd([{ name: 'Contact', path: '/contact' }])),
        }}
      />
      <PlateHero
        question="Trying to reach the rooftop in Bonita Springs?"
        title={'Say hello to '}
        titleAccent="the rooftop"
        lead="Planning an event or have a question about Rooftop? Send us a message and our team will get back to you within 24–48 hours. We’re happy to help!"
        photo="/images/venue/contact-rooftop-seating.jpg"
        photoMobileRatio="landscape"
        photoAlt="The covered rooftop seating area at Rooftop at Riverside, with white-cushioned sofas and orange wooden chairs under a white pergola, surrounded by palms and folding glass doors"
      >
        <ButtonLink href="#write" variant="primary" size="lg">
          Write to us
        </ButtonLink>
        <ButtonLink href="#find" variant="secondary" size="lg">
          Hours and map
        </ButtonLink>
      </PlateHero>
      <FormSlab
        id="write"
        eyebrow="Write to us"
        eyebrowTone="deep"
        title="Write to the right person"
        titleId="write-title"
        lead="Write to us and a person here reads it. We come back within 24–48 hours."
        aside={
          <div className="flex flex-col gap-9 md:grid md:grid-cols-2 md:gap-x-8 lg:flex">
            <div className="grid gap-3 md:col-span-2 md:grid-cols-2 lg:grid-cols-1">
              <a
                href={venue.phoneHref}
                className="flex h-[60px] items-center justify-center rounded-pill border-2 border-dashed border-ink/30 bg-mint px-4 font-display text-d6 font-semibold uppercase leading-none text-ink transition-colors hover:bg-river/30 sm:text-d5"
              >
                {venue.phone}
              </a>
              <a
                href={BRAND.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-[60px] items-center justify-center gap-2.5 rounded-pill border-2 border-dashed border-ink/30 bg-cream px-4 font-body text-base font-bold text-ink transition-colors hover:bg-sunset"
              >
                <Instagram className="size-6 shrink-0" aria-hidden="true" />
                <span className="truncate">@{instagramHandle()}</span>
                <span className="sr-only"> on Instagram (opens in a new tab)</span>
              </a>
            </div>
            <ul className="flex list-none flex-col gap-4.5 p-0">
              {inboxes.map((b) => (
                <li key={b.address}>
                  <span className="block font-body text-caption font-medium uppercase tracking-eyebrow text-body/60">
                    {b.label}
                  </span>
                  <a
                    href={'mailto:' + b.address}
                    className="link-text mt-1 block break-words font-body text-[16px] leading-[1.5] text-ink"
                  >
                    {b.address}
                  </a>
                </li>
              ))}
            </ul>

            <hr className="w-full border-0 border-t border-ink/15 md:hidden lg:block" />
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
              <p className="mt-[14px] text-[16px] leading-[1.6] text-body/75">
                Cancellations and weather calls go up on{' '}
                <a
                  href={BRAND.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-text font-bold"
                >
                  @{instagramHandle()}
                  <span className="sr-only">(opens in a new tab)</span>
                </a>{' '}
                first.
              </p>
            </div>
          </div>
        }
      >
        <ContactForm />
      </FormSlab>
      <FindUs id="find" />
    </>
  );
}
