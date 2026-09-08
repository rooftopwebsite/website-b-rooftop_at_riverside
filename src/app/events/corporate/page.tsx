import type { Metadata } from 'next';
import EventVertical, { type VerticalConfig } from '@/components/sections/EventVertical';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

/** Generado por scripts/gen-verticals.mjs. Editá el script, no este archivo. */
export const metadata: Metadata = pageMeta({
  route: '/events/corporate',
  image: {
    url: "/images/events/event-b.jpg",
    width: 1800,
    height: 1200,
    alt: "A corporate group gathered on the rooftop at Rooftop at Riverside",
  },
});

const CONFIG: VerticalConfig = {
  eyebrow: "Corporate",
  title: "Take the team somewhere they'll actually want to go",
  lead: "Four kitchens means nobody gets handed a plate they did not choose. That alone solves the hardest part of feeding a room of colleagues.",
  image: "/images/events/event-b.jpg",
  imageAlt: "A corporate group gathered on the rooftop at Rooftop at Riverside",
  crumbName: "Corporate",
  crumbPath: '/events/corporate',
  highlights: [
    { title: "Four menus, zero dietary drama", body: "Tacos, seafood, smashburgers and Caribbean, all in one yard. Vegetarians, picky eaters and the person who only eats chicken all get sorted without a single email." },
    { title: "Indoor-outdoor, in Florida", body: "The rooftop is covered and the yard is open. December through April that is the whole pitch: your team is outside, in January, comfortably." },
    { title: "One invoice, one contact", body: "You do not chase four vendors. We coordinate the trucks and the bar, and you get a single point of contact from the first email to load-out." },
    { title: "Downtown is being built around us", body: "120 residential units plus commercial space are going up one block away, due 2027. Booking here now means your people already know where it is." },
  ],
  formats: [
    "Client appreciation nights",
    "Team outings",
    "Sales kickoffs",
    "Quarterly dinners",
    "Networking mixers",
    "Board and partner dinners",
    "Conference after-parties",
    "Brand activations",
  ],
  closingTitle: "Tell us the headcount",
  closingBody: "Send the date and the size, and the events packet comes back within one business day.",
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
