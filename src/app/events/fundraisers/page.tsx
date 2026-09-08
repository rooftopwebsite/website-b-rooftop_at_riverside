import type { Metadata } from 'next';
import EventVertical, { type VerticalConfig } from '@/components/sections/EventVertical';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

/** Generado por scripts/gen-verticals.mjs. Editá el script, no este archivo. */
export const metadata: Metadata = pageMeta({
  route: '/events/fundraisers',
  image: {
    url: "/images/venue-guests.jpg",
    width: 1800,
    height: 1200,
    alt: "A crowd gathered in the yard at Rooftop at Riverside",
  },
});

const CONFIG: VerticalConfig = {
  eyebrow: "Fundraisers",
  title: "Raise more, spend less on the room",
  lead: "The yard sits on Old 41 in the middle of downtown, across from Riverside Park. For a community fundraiser that visibility is half the job done.",
  image: "/images/venue-guests.jpg",
  imageAlt: "A crowd gathered in the yard at Rooftop at Riverside",
  crumbName: "Fundraisers",
  crumbPath: '/events/fundraisers',
  highlights: [
    { title: "Downtown foot traffic", body: "Riverside Park is across the street and Old 41 runs right past the gate. People find your event without a single ad." },
    { title: "Gated for ticketed entry", body: "The yard closes off, so you can run a ticketed door and count who comes through it." },
    { title: "A stage that already exists", body: "Sound and a stage are part of the yard. Live music, an auction or a speaker all work without renting anything in." },
  ],
  formats: [
    "Spirit nights",
    "Nonprofit galas",
    "School fundraisers",
    "Charity auctions",
    "Awareness events",
    "Community benefit concerts",
  ],
  closingTitle: "Let us hear the cause",
  closingBody: "Send the date and what you are raising for, and we will come back with what we can do.",
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            breadcrumbJsonLd([
              { name: 'Events', path: '/events' },
              { name: CONFIG.crumbName, path: CONFIG.crumbPath },
            ]),
          ),
        }}
      />
      <EventVertical config={CONFIG} />
    </>
  );
}
