import type { Metadata } from 'next';
import EventVertical, { type VerticalConfig } from '@/components/sections/EventVertical';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

/** Generado por scripts/gen-verticals.mjs. Editá el script, no este archivo. */
export const metadata: Metadata = pageMeta({
  title: "Birthdays, Milestones & Celebrations",
  description: "Milestone birthdays, engagements, showers and reunions at a rooftop bar over a food truck park in downtown Bonita Springs.",
  path: '/events/celebrations',
  image: {
    url: "/images/events/event-d.jpg",
    width: 1800,
    height: 1200,
    alt: "Guests raising glasses at a celebration at Rooftop at Riverside",
  },
});

const CONFIG: VerticalConfig = {
  eyebrow: "Celebrations",
  title: "The good ones run late",
  lead: "Fortieths, engagements, showers, reunions. The rooftop holds a party that starts at sunset and does not really have a plan for when it ends.",
  image: "/images/events/event-d.jpg",
  imageAlt: "Guests raising glasses at a celebration at Rooftop at Riverside",
  crumbName: "Celebrations",
  crumbPath: '/events/celebrations',
  highlights: [
    { title: "Sunset over the river", body: "The rooftop faces west over the Imperial River. Time the toast for seven and the sky does the work." },
    { title: "Kids and dogs welcome", body: "The yard is open, dog friendly and has room to run. Nobody has to find a sitter to come to your party." },
    { title: "Late on weekends", body: "The bar runs to midnight on Friday and 2am on Saturday. The party does not get cut short at ten." },
  ],
  formats: [
    "Milestone birthdays",
    "Engagement parties",
    "Bridal and baby showers",
    "Rehearsal dinners",
    "Graduations",
    "Class reunions",
    "Retirement parties",
    "Anniversaries",
  ],
  closingTitle: "Pick a Saturday",
  closingBody: "Tell us the date and roughly how many people, and the packet goes out the same day.",
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
