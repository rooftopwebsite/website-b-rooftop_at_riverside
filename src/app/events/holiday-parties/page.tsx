import type { Metadata } from 'next';
import EventVertical, { type VerticalConfig } from '@/components/sections/EventVertical';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

/** Generado por scripts/gen-verticals.mjs. Editá el script, no este archivo. */
export const metadata: Metadata = pageMeta({
  title: "Holiday Parties",
  description: "Company holiday parties in Bonita Springs. Take the rooftop, the yard, or the entire venue with the gates closed. December books first.",
  path: '/events/holiday-parties',
  image: {
    url: "/images/events/event-c.jpg",
    width: 1800,
    height: 1200,
    alt: "A large group celebrating at Rooftop at Riverside",
  },
});

const CONFIG: VerticalConfig = {
  eyebrow: "Holiday parties",
  title: "December fills first",
  lead: "High season here runs December through April, and the holiday calendar goes before anything else. If you are reading this in the fall, you are on time. Barely.",
  image: "/images/events/event-c.jpg",
  imageAlt: "A large group celebrating at Rooftop at Riverside",
  crumbName: "Holiday parties",
  crumbPath: '/events/holiday-parties',
  highlights: [
    { title: "The whole place, gates closed", body: "A full buyout gives you the rooftop, the yard, the patio and the trucks, with the public locked out for the night." },
    { title: "Outdoors, in December", body: "This is Southwest Florida. Your holiday party can be outside, under lights, with nobody wearing a coat." },
    { title: "Food nobody complains about", body: "Four trucks running at once beats a chafing dish of the same three entrees. Everyone eats what they actually want." },
  ],
  formats: [
    "Company holiday parties",
    "Team dinners",
    "Client holiday receptions",
    "End-of-year awards nights",
    "Family holiday gatherings",
    "New Year celebrations",
  ],
  closingTitle: "Hold a December date",
  closingBody: "Weekend dates in December go early. Send the request and we will hold it while we talk.",
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
