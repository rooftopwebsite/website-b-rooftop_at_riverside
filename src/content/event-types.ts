/**
 * ══════════════════════════════════════════════════════════════════════════
 * LOS CUATRO TIPOS DE EVENTO PRIVADO.
 *
 * ⚠️ ESTE ARCHIVO REEMPLAZA A CUATRO PÁGINAS. Eran `/events/corporate`,
 * `/events/celebrations`, `/events/fundraisers` y `/events/holiday-parties`,
 * cada una con su propio `page.tsx` generado por `scripts/gen-verticals.mjs` y
 * su propio `CONFIG` adentro. Ahora las cuatro viven acá y se renderizan como
 * secciones de `/events`.
 *
 * El motivo es de arquitectura de información, no de código. Camila, revisando
 * qué páginas secundarias tiene que tener el sitio: «eventos privados con sus
 * servicios ahí, no cada pág de servicios». Las cuatro decían lo mismo con
 * distinto vocabulario —se alquila el lugar, se cierra, hay cuatro cocinas— y
 * repartían en cuatro URLs un único argumento de venta. Quien está evaluando
 * cerrar el lugar necesita verlo entero de una vez.
 *
 * ⚠️ EL TEXTO NO SE TOCÓ. Es exactamente el mismo de las cuatro páginas, campo
 * por campo. Lo único que cambia es dónde se renderiza.
 *
 * ⚠️ EL `id` ES EL ANCLA Y ES LO QUE SOSTIENE LOS REDIRECTS. Las cuatro rutas
 * viejas redirigen con 301 a `/events#<id>`, así que renombrar un `id` rompe
 * un link que puede estar en un mail que el cliente mandó el mes pasado.
 * Los redirects están en `next.config.ts`.
 *
 * ⚠️ `scripts/gen-verticals.mjs` YA NO GENERA NADA y se borró con las páginas.
 * Si mañana entra un quinto tipo de evento, se agrega un objeto a esta lista.
 * ══════════════════════════════════════════════════════════════════════════
 */
export interface TipoEvento {
  /** El ancla. Es el destino del redirect 301 de la ruta vieja. */
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly lead: string;
  readonly image: string;
  readonly imageAlt: string;
  /** Tres o cuatro cosas concretas que este tipo de evento necesita. */
  readonly highlights: readonly { readonly title: string; readonly body: string }[];
  /** Los formatos típicos. Chips. */
  readonly formats: readonly string[];
}

export const TIPOS_EVENTO: readonly TipoEvento[] = [
  {
    id: 'corporate',
  eyebrow: "Corporate",
  title: "Take the team somewhere they'll actually want to go",
  lead: "Four kitchens means nobody gets handed a plate they did not choose. That alone solves the hardest part of feeding a room of colleagues.",
  image: "/images/events/event-b.jpg",
  imageAlt: "A corporate group gathered on the rooftop at Rooftop at Riverside",
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
  },
  {
    id: 'celebrations',
  eyebrow: "Celebrations",
  title: "Every milestone deserves a view",
  lead: "Fortieths, engagements, showers, reunions. The rooftop holds a party that starts at sunset and does not really have a plan for when it ends.",
  image: "/images/events/event-d.jpg",
  imageAlt: "Guests raising glasses at a celebration at Rooftop at Riverside",
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
  },
  {
    id: 'fundraisers',
  eyebrow: "Fundraisers",
  title: "Raise more, spend less on the room",
  lead: "The yard sits on Old 41 in the middle of downtown, across from Riverside Park. For a community fundraiser that visibility is half the job done.",
  image: "/images/venue-guests.jpg",
  imageAlt: "A crowd gathered in the yard at Rooftop at Riverside",
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
  lead: "High season here runs December through April, and the holiday calendar goes before anything else. If you are reading this in the fall, you are on time. Barely.",
  image: "/images/events/event-c.jpg",
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
