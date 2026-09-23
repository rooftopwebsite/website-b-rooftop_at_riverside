export interface TipoEvento {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly lead: string;
  readonly image: string;
  readonly imageAlt: string;
  readonly highlights: readonly { readonly title: string; readonly body: string }[];
  readonly formats: readonly string[];
}

export const TIPOS_EVENTO: readonly TipoEvento[] = [
  {
    id: 'corporate',
  eyebrow: "Corporate",
  title: "Take the team somewhere they'll actually want to go",
  lead: "The second floor closes to the public and the four kitchens serve at once, so nobody gets handed a plate they did not choose.",
  image: "/images/events/event-b.webp",
  imageAlt: "A corporate group gathered on the rooftop at Rooftop at Riverside",
  highlights: [
    { title: "Four menus, zero dietary drama", body: "Tacos, seafood, smashburgers and Caribbean, all in one yard. Vegetarians, picky eaters and the person who only eats chicken all get sorted without a single email." },
    { title: "Two floors, two climates", body: "The bar is upstairs and the yard is open air below it. December through April that is the whole pitch: your team is outside, in January, comfortably." },
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
  },
  {
    id: 'celebrations',
  eyebrow: "Celebrations",
  title: "Every milestone deserves a view",
  lead: "Birthdays, engagements, showers and reunions, upstairs and private. The bar faces west, so the toast lands with the sky behind it.",
  image: "/images/events/event-d.webp",
  imageAlt: "Guests raising glasses at a celebration at Rooftop at Riverside",
  highlights: [
    { title: "Sunset over the yard", body: "It is called the Sunset Bar for a reason: it faces west. Time the toast for seven and the sky does the work." },
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
  },
  {
    id: 'fundraisers',
  eyebrow: "Fundraisers",
  title: "Charity nights, right on Old 41",
  lead: "The yard gates close, so a ticketed door works and you can count who comes through it. The stage and the sound are already there.",
  image: "/images/venue/wall-guests-yard-day.webp",
  imageAlt: "Guests in the yard at Rooftop at Riverside during the day",
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
  },
  {
    id: 'holiday-parties',
  eyebrow: "Holiday parties",
  title: "Trade the ballroom for the rooftop",
  lead: "December through April is high season here and the holiday dates go first. Outdoors, under lights, with four kitchens running at once.",
  image: "/images/events/event-c.webp",
  imageAlt: "A large group celebrating at Rooftop at Riverside",
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
  },
];
