export interface Faq {
  readonly q: string;
  readonly a: string;
  readonly group: string;
  readonly source: string | null;
}

export const FAQS: readonly Faq[] = [
  {
    group: 'How this place works',
    q: 'Is Rooftop at Riverside a restaurant?',
    a: 'No. It is a rooftop bar over a food truck park. We run the bar; the food comes from four independent trucks in the yard, each with its own menu, staff and register.',
    source:
      'Brief, A5: «Rooftop bar construido sobre un food truck park curado (4 trucks, revenue-share) en el downtown de Bonita Springs, frente a Riverside Park».',
  },
  {
    group: 'How this place works',
    q: 'How do I pay the food trucks?',
    a: 'At the truck. Each one is its own business with its own register, so you order and pay at that window and get that truck’s receipt. Drinks are separate: those come from our bar upstairs, and that tab is ours.',
    source:
      'Brief: «4 trucks rotativos, revenue-share» y «los food trucks son dueños de su propia venta de comida».',
  },
  {
    group: 'How this place works',
    q: 'Which food trucks are here tonight?',
    a: 'The roster rotates. Which trucks are in on a given night is listed on the calendar and on the home page.',
    source: 'Brief: «4 trucks rotativos». El roster vigente sale de `content/trucks.ts`.',
  },
  {
    group: 'Eating and drinking',
    q: 'Where can I see the truck menus?',
    a: 'At the trucks. Menus and prices belong to each owner and change often, so we don’t publish them. The bar menu is on this site because the bar is ours.',
    source:
      'Brief: «los food trucks son dueños de su propia venta de comida». El sitio vigente tampoco publica ningún menú de truck: sólo el de barra, en `/drink`.',
  },
  {
    group: 'Eating and drinking',
    q: 'When is happy hour?',
    a: 'Wednesday through Friday, 3 to 6 PM: $4 drafts, $5 house wines and $6 house drinks.',
    source:
      'Pie de página del sitio vigente: «Happy Hour · $4 Drafts | $5 House Wines | $6 House Drinks · Wednesday - Friday | 3pm - 6pm». Ver `content/happy-hour.ts`.',
  },
  {
    group: 'Visiting',
    q: 'What are your hours?',
    a: 'The bar is open Wednesday and Thursday 3 to 8 PM, Friday 3 PM to midnight, Saturday 11 AM to 2 AM and Sunday 11 AM to 8 PM. The trucks start an hour later and finish earlier. Closed Monday and Tuesday.',
    source:
      'Pie de página del sitio vigente y cuestionario de onboarding, que traen la misma grilla. Ver `content/hours.ts`.',
  },
  {
    group: 'Visiting',
    q: 'Are dogs allowed?',
    a: 'Yes. The third Wednesday of every month is Wooftop Fest: bring the dog, there is an off-leash area we run with Barkyard and Tap, and pet vendors set up alongside the trucks.',
    source:
      'Mail de Madeline Powers del 2026-09-17 y su confirmación del 18: Wooftop Fest es el tercer miércoles de cada mes, pet-friendly, en partnership con Barkyard and Tap (área sin correa) y con vendors de mascotas. ⚠️ EL 2X1 EN TRAGOS NO SE NOMBRA A PROPÓSITO: Madeline lo da como histórico, sin confirmar, y avisó que los extras de temporada (2x1, banda) NO rigen en octubre. Tampoco se nombra el ítem de $5 para perros, que venía de la fila vieja del dashboard y ella no menciona. Los tres van al pedido al cliente.',
  },
  {
    group: 'Events',
    q: 'Can I rent the place?',
    a: 'Yes. The second floor buys out at $750 an hour Sunday through Thursday and $1,250 an hour Friday and Saturday, two hours minimum, with a deposit. Send a request through the events page.',
    source:
      'PDF «Events Packages», linkeado desde `/hostanevent` del sitio vigente: «SECOND FLOOR BUYOUT · $750 per hour | Sun. - Thu. · $1,250 per hour | Fri. - Sat. · 2 hours minimum · Deposit required».',
  },
  {
    group: 'Events',
    q: 'How do I buy tickets for a show?',
    a: 'Ticketed events happen in The Yard and are sold through Eventbrite. Every ticketed event on our calendar links out to its page.',
    source:
      'Cuestionario de onboarding, G5: el ticketing queda del lado del cliente vía Eventbrite. El brief confirma que the Yard «se está cerrando con reja para habilitar eventos con entrada paga».',
  },

  {
    group: 'Eating and drinking',
    q: 'Do you deliver?',
    a: 'No. There is no delivery from Rooftop at Riverside. The trucks cook to order in the yard and everything is eaten here.',
    source: null,
  },
  {
    group: 'Eating and drinking',
    q: 'Do you do takeout?',
    a: 'No takeout either. Each truck serves at its window and you eat in the yard or upstairs on the rooftop.',
    source: null,
  },
  {
    group: 'Eating and drinking',
    q: 'Can I bring my own food?',
    a: 'Please don’t. Four independent small businesses cook here and they are the reason the yard works. Outside drinks are not allowed at all. We are a licensed bar.',
    source: null,
  },
  {
    group: 'Events',
    q: 'Do you cater my event?',
    a: 'Not from a kitchen of ours, because we don’t have one. The food at your event comes from the food trucks on site, and our team coordinates them for you.',
    source: null,
  },
  {
    group: 'Visiting',
    q: 'Can I reserve a table?',
    a: 'No. Rooftop at Riverside is walk-in. Come up, find a seat, order at whichever window you want.',
    source: null,
  },
  {
    group: 'Visiting',
    q: 'Is there an age limit at night?',
    a: 'Families are welcome all day. Anyone drinking needs ID. Florida law, 21 and up.',
    source: null,
  },
  {
    group: 'Visiting',
    q: 'Where do I park?',
    a: 'Street parking on Old 41 out front, and the public lots around Riverside Park directly across the road. Both are free.',
    source: null,
  },
  {
    group: 'Visiting',
    q: 'What happens if it rains?',
    a: 'The rooftop is covered, so the bar keeps going. The yard is open air, and in a Florida downpour the trucks may pause for a bit.',
    source: null,
  },
  {
    group: 'Eating and drinking',
    q: 'Are bar prices tax included?',
    a: 'Yes. Listed bar prices include tax. A 22% gratuity is applied to unsigned bar tabs.',
    source: null,
  },
];

export const verifiedFaqs = (): readonly Faq[] => FAQS.filter((f) => f.source !== null);

export const unverifiedFaqs = (): readonly Faq[] => FAQS.filter((f) => f.source === null);

export const FAQ_GROUPS = [...new Set(verifiedFaqs().map((f) => f.group))];
