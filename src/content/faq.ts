/**
 * Preguntas frecuentes.
 *
 * ⚠️ Las diez primeras son las que pidió el brief, y no son decorativas: son
 * las que la gente hace en la puerta. La mitad existe para desarmar la lectura
 * de «restaurante», que es el problema central del sitio.
 *
 * ⚠️ Voz: corta, directa, de barrio. Nada de disclaimers ni de lenguaje legal.
 * «No» primero y explicación después, que es como contesta una persona.
 *
 * ⚠️ La de catering es la que más plata mueve. La respuesta honesta también es
 * la que vende: no tenemos cocina, cocinan los trucks, y coordinás con una
 * sola persona en vez de con cinco.
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
  /* ── Las diez del brief ─────────────────────────────────────────────── */
  {
    group: 'Eating and drinking',
    q: 'Do you deliver?',
    a: 'No. There is no delivery from Rooftop at Riverside. The trucks cook to order in the yard and everything is eaten here.',
  },
  {
    group: 'Eating and drinking',
    q: 'Do you do takeout?',
    a: 'No takeout either. Each truck serves at its window and you eat in the yard or upstairs on the rooftop.',
  },
  {
    group: 'Eating and drinking',
    q: 'Can I bring my own food?',
    a: 'Please don’t. Four independent small businesses cook here and they are the reason the yard works. Outside drinks are not allowed at all. We are a licensed bar.',
  },
  {
    group: 'Events',
    q: 'Do you cater my event?',
    a: 'Not from a kitchen of ours, because we don’t have one. The food at your event comes from the food trucks on site, and our team coordinates them for you. So you get four or five different kitchens and still deal with one person. Pick a food tier and we handle the vendors, the timing and the invoice.',
  },
  {
    group: 'Visiting',
    q: 'Can I reserve a table?',
    a: 'No. Rooftop at Riverside is walk-in. Come up, find a seat, order at whichever window you want. If you are bringing eight or more on a weekend in season, send us a note and we will do what we can.',
  },
  {
    group: 'Eating and drinking',
    q: 'How do I pay the food trucks?',
    a: 'At the truck. Each one is its own business with its own register, so you order and pay at that window and get that truck’s receipt. Drinks are separate: those come from our bar upstairs, and that tab is ours.',
  },
  {
    group: 'Visiting',
    q: 'Are dogs allowed?',
    a: 'Yes. The yard is dog friendly. Wednesday is Wooftop Wednesday, when every truck runs a $5 item your dog can order and drinks are two for one all day.',
  },
  {
    group: 'Visiting',
    q: 'Is there an age limit at night?',
    a: 'Families are welcome all day and there is no cover. Anyone drinking needs ID. Florida law, 21 and up. Late on Friday and Saturday the crowd skews older on its own, but we don’t close the yard to kids.',
  },
  {
    group: 'Visiting',
    q: 'Where do I park?',
    a: 'Street parking on Old 41 out front, and the public lots around Riverside Park directly across the road. Both are free. On a busy Friday the park lots almost always have room.',
  },
  {
    group: 'Visiting',
    q: 'What happens if it rains?',
    a: 'The rooftop is covered, so the bar keeps going. The yard is open air, and in a Florida downpour the trucks may pause for a bit. Most storms here pass in twenty minutes. If a show is cancelled we post it on Instagram first.',
  },

  /* ── Las que además hacen falta ─────────────────────────────────────── */
  {
    group: 'How this place works',
    q: 'Is Rooftop at Riverside a restaurant?',
    a: 'No. It is a rooftop bar over a food truck park. We run the bar; the food comes from four independent trucks in the yard, each with its own menu, staff and register. There is no venue kitchen.',
  },
  {
    group: 'How this place works',
    q: 'Which food trucks are here tonight?',
    a: 'The roster rotates. Which trucks are in on a given night is listed on the calendar and on the home page.',
  },
  {
    group: 'How this place works',
    q: 'Where can I see the truck menus?',
    a: 'At the trucks. Menus and prices belong to each owner and change often, so we don’t publish them. The bar menu is on this site because the bar is ours.',
  },
  {
    group: 'Eating and drinking',
    q: 'When is happy hour?',
    a: 'Wednesday through Friday, 3 to 6 PM: $4 drafts, $5 house wines and $6 house drinks.',
  },
  {
    group: 'Eating and drinking',
    q: 'Are bar prices tax included?',
    a: 'Yes. Listed bar prices include tax. A 22% gratuity is applied to unsigned bar tabs.',
  },
  {
    group: 'Visiting',
    q: 'What are your hours?',
    a: 'The bar is open Wednesday and Thursday 3 to 8 PM, Friday 3 PM to midnight, Saturday 11 AM to 2 AM and Sunday 11 AM to 8 PM. The trucks start an hour later and finish earlier. Closed Monday and Tuesday.',
  },
  {
    group: 'Events',
    q: 'Can I rent the place?',
    a: 'Yes. Book the rooftop, the gated yard, the patio, or the whole venue with the doors closed. Send a request through the events page and we come back within one business day.',
  },
  {
    group: 'Events',
    q: 'How do I buy tickets for a show?',
    a: 'Ticketed events happen in The Yard and are sold through Eventbrite. Every ticketed event on our calendar links out to its page.',
  },
];

export const FAQ_GROUPS = [...new Set(FAQS.map((f) => f.group))];
