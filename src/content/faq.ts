/**
 * Preguntas frecuentes.
 *
 * ⚠️ La mitad de estas existen para desarmar la lectura de «restaurante». Son
 * las preguntas que la gente hace en la puerta, no las que quedan lindas en
 * una página.
 *
 * Alimenta `/faq` y su `FAQPage` en JSON-LD. Cada respuesta tiene que
 * sostenerse sola en un rich result de Google, sin el contexto de la página.
 */

export interface Faq {
  readonly q: string;
  readonly a: string;
  readonly group: string;
}

export const FAQS: readonly Faq[] = [
  {
    group: 'How it works',
    q: 'Is Rooftop at Riverside a restaurant?',
    a: 'No. It is a rooftop bar over a food truck park. We run the bar; the food comes from four independent food trucks parked in the yard, each with its own menu, its own staff and its own register. There is no venue kitchen.',
  },
  {
    group: 'How it works',
    q: 'Do I order everything in one place?',
    a: 'No. You order food at whichever truck you want and pay that truck directly. Drinks come from the Sunset Bar upstairs, which is ours. It is the only tab we run.',
  },
  {
    group: 'How it works',
    q: 'Do I need a reservation?',
    a: 'No. Rooftop at Riverside is walk-in only for everyday visits. We do not take table reservations. Private events are booked separately through the events team.',
  },
  {
    group: 'How it works',
    q: 'Which food trucks are here tonight?',
    a: 'The roster rotates. Which trucks are in on a given night is listed on the calendar and on the home page.',
  },
  {
    group: 'Food and drink',
    q: 'Do you deliver or do takeout?',
    a: 'No. There is no delivery and no takeout. Everything is served on site, and each food truck handles its own orders at the window.',
  },
  {
    group: 'Food and drink',
    q: 'Where can I see the food truck menus?',
    a: 'At the trucks. Menus and prices belong to each truck owner and change often, so we do not publish them. The bar menu is on this site because the bar is ours.',
  },
  {
    group: 'Food and drink',
    q: 'When is happy hour?',
    a: 'Wednesday through Friday, 3 to 6 PM: $4 drafts, $5 house wines and $6 house drinks.',
  },
  {
    group: 'Food and drink',
    q: 'Are prices tax included?',
    a: 'Yes. All listed bar prices include tax. A 22% gratuity is applied to unsigned bar tabs.',
  },
  {
    group: 'Visiting',
    q: 'Where do I park?',
    a: 'Street parking on Old 41 Road and the public lots around Riverside Park, directly across from us in downtown Bonita Springs.',
  },
  {
    group: 'Visiting',
    q: 'Can I bring my dog?',
    a: 'Yes. The yard is dog friendly. Wednesdays are Wooftop Wednesdays, when every truck runs a $5 item your dog can order.',
  },
  {
    group: 'Visiting',
    q: 'Is it kid friendly?',
    a: 'Yes. The yard is open and families are welcome. The rooftop bar follows Florida law for alcohol service.',
  },
  {
    group: 'Visiting',
    q: 'What are your hours?',
    a: 'The bar is open Wednesday and Thursday 3 to 8 PM, Friday 3 PM to midnight, Saturday 11 AM to 2 AM and Sunday 11 AM to 8 PM. The food trucks start an hour later and finish earlier. We are closed Monday and Tuesday.',
  },
  {
    group: 'Events',
    q: 'Can I rent the venue?',
    a: 'Yes. You can book the rooftop, the gated yard, the patio or a full buyout of the whole place. Send a request through the events page and we come back within one business day.',
  },
  {
    group: 'Events',
    q: 'Do you cater?',
    a: 'Not ourselves. We coordinate the food trucks for your event and you choose a food tier, but the cooking is done by the truck owners. We do not have a kitchen.',
  },
  {
    group: 'Events',
    q: 'How do I buy tickets for a show?',
    a: 'Ticketed events happen in The Yard and are sold through Eventbrite. Every ticketed event on our calendar links out to its Eventbrite page.',
  },
];

export const FAQ_GROUPS = [...new Set(FAQS.map((f) => f.group))];
