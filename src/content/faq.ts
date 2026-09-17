/**
 * Preguntas frecuentes.
 *
 * ⚠️⚠️ HOY ESTO NO SE RENDERIZA EN NINGUNA PÁGINA. Decisión de Camila del
 * 2026-09-15: «mejor no pongamos preguntas frecuentes». Se conserva el archivo
 * porque los datos y, sobre todo, la AUDITORÍA de abajo costaron trabajo y
 * siguen valiendo: nueve de estas respuestas no tienen fuente y dos
 * contradicen al cliente. Si el FAQ vuelve, vuelve con esto resuelto.
 *
 * ⚠️ `/faq` redirige con 301 a `/our-story#faq`, un ancla que dejó de existir.
 * Hay que repuntarlo a `/our-story` a secas.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️⚠️ AUDITORÍA DEL 2026-09-15. DIEZ DE LAS DIECIOCHO RESPUESTAS NO TENÍAN
 * FUENTE, Y DOS CONTRADECÍAN AL PROPIO CLIENTE.
 *
 * Las preguntas salieron del brief, pero las RESPUESTAS se habían escrito sin
 * un origen verificable. Cruzadas contra las 23 rutas del sitio vigente
 * (`content/_source/`), contra los dos PDF del brief y contra el dashboard de
 * RestoExp, el resultado fue:
 *
 *   · «No hay delivery» y «no hay takeout» → el brief deja el cuadro de
 *     plataformas VACÍO y escribe al lado «confirmar contra el contrato
 *     firmado si este servicio realmente aplica». O sea que no es que no haya:
 *     es que no sabemos.
 *   · «No tenemos cocina, cocinan los trucks» → el PDF «Events Packages» del
 *     propio cliente ofrece «UPSCALE CATERING · Minimum $1,500 spend · Buffet
 *     option, specialty menus provided by IN HOUSE CATERING», y el brief suma
 *     un catering partner y un «Chef Ricardo $75-110 por cabeza».
 *   · «No se puede reservar, es walk-in» → el cliente TIENE cuenta de
 *     OpenTable. Es el faltante número uno del proyecto.
 *   · Estacionamiento, lluvia, comida de afuera, edad mínima e impuestos
 *     incluidos → no aparecen en ninguna fuente. Ni en el sitio, ni en el
 *     brief, ni en el dashboard.
 *
 * Por eso cada entrada ahora declara su `source`. **Sólo se renderizan las que
 * tienen fuente.** Las demás quedan acá, con la pregunta intacta y la
 * respuesta que había marcada como no verificada, para restituirlas en un
 * minuto cuando el cliente conteste. Ver `unverifiedFaqs()`.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ Voz: corta, directa, de barrio. Nada de disclaimers ni de lenguaje legal.
 * «No» primero y explicación después, que es como contesta una persona.
 */

export interface Faq {
  readonly q: string;
  readonly a: string;
  readonly group: string;
  /**
   * De dónde sale la respuesta. `null` significa **sin fuente**: no se
   * publica. Cualquier valor es la cita concreta del origen.
   */
  readonly source: string | null;
}

export const FAQS: readonly Faq[] = [
  /* ── Con fuente ──────────────────────────────────────────────────────── */
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
    a: 'Yes. Wednesday is Wooftop Wednesdays: bring the dog, drinks are two for one, and every truck runs a $5 item your dog can order.',
    source:
      'Evento del dashboard de RestoExp, textual: «Bring the dog. Two-for-one drinks, and every truck runs a $5 item your dog can order. Excludes flights.» Ver `content/events.json`.',
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

  /* ── SIN FUENTE. No se renderizan. ───────────────────────────────────────
     La pregunta y el texto que había quedan intactos para restituirlos
     apenas el cliente conteste. `source: null` es lo que los deja afuera. */
  {
    group: 'Eating and drinking',
    q: 'Do you deliver?',
    a: 'No. There is no delivery from Rooftop at Riverside. The trucks cook to order in the yard and everything is eaten here.',
    // TODO: confirmar con cliente. El brief lista «Delivery» como opción de
    // modelo de servicio pero deja el cuadro de plataformas VACÍO y anota
    // «confirmar contra el contrato firmado si este servicio realmente aplica».
    source: null,
  },
  {
    group: 'Eating and drinking',
    q: 'Do you do takeout?',
    a: 'No takeout either. Each truck serves at its window and you eat in the yard or upstairs on the rooftop.',
    // TODO: confirmar con cliente. «Takeout» figura como opción marcable en el
    // cuestionario (A4) y no sabemos si está tildada.
    source: null,
  },
  {
    group: 'Eating and drinking',
    q: 'Can I bring my own food?',
    a: 'Please don’t. Four independent small businesses cook here and they are the reason the yard works. Outside drinks are not allowed at all. We are a licensed bar.',
    // TODO: confirmar con cliente. La política de comida y bebida de afuera no
    // aparece en ninguna de las 23 rutas del sitio ni en el brief.
    source: null,
  },
  {
    group: 'Events',
    q: 'Do you cater my event?',
    a: 'Not from a kitchen of ours, because we don’t have one. The food at your event comes from the food trucks on site, and our team coordinates them for you.',
    // ⚠️ CONTRADICE AL CLIENTE. Su PDF «Events Packages» ofrece «UPSCALE
    // CATERING · Minimum $1,500 spend · specialty menus provided by in house
    // catering», y el brief suma un catering partner y «Chef Ricardo $75-110».
    // TODO: confirmar con cliente qué es exactamente el catering in house.
    source: null,
  },
  {
    group: 'Visiting',
    q: 'Can I reserve a table?',
    a: 'No. Rooftop at Riverside is walk-in. Come up, find a seat, order at whichever window you want.',
    // ⚠️ CONTRADICE AL CLIENTE. Tienen cuenta de OpenTable y no sabemos para
    // qué la usan. Es el faltante número uno del proyecto.
    // TODO: confirmar con cliente para qué usan OpenTable.
    source: null,
  },
  {
    group: 'Visiting',
    q: 'Is there an age limit at night?',
    /*
     * ⚠️ DECÍA «AND THERE IS NO COVER» Y SE FUE EL 2026-09-17. No era un dato
     * confirmado —la nota de abajo ya lo advertía— y encima dejó de ser
     * cierto: dos de las noches fijas llevan ticket. La pregunta es sobre
     * EDAD, así que la respuesta se queda con lo que sí sabemos.
     */
    a: 'Families are welcome all day. Anyone drinking needs ID. Florida law, 21 and up.',
    // TODO: confirmar con cliente. Que no haya cover y que los chicos entren a
    // toda hora no está escrito en ningún lado. El único «21 and up» del
    // material es el waiver de bar games, que es otra cosa.
    source: null,
  },
  {
    group: 'Visiting',
    q: 'Where do I park?',
    a: 'Street parking on Old 41 out front, and the public lots around Riverside Park directly across the road. Both are free.',
    // TODO: confirmar con cliente. El sitio vigente tiene una página
    // `/parking` titulada «Parking Locations» y un PDF de mapa, pero el PDF es
    // una IMAGEN sin texto extraíble. Sabemos que hay un mapa; no sabemos qué
    // dice. Hace falta que lo transcriban o que nos pasen el original.
    source: null,
  },
  {
    group: 'Visiting',
    q: 'What happens if it rains?',
    a: 'The rooftop is covered, so the bar keeps going. The yard is open air, and in a Florida downpour the trucks may pause for a bit.',
    // TODO: confirmar con cliente. Que el rooftop esté cubierto no figura en
    // ninguna fuente.
    source: null,
  },
  {
    group: 'Eating and drinking',
    q: 'Are bar prices tax included?',
    a: 'Yes. Listed bar prices include tax. A 22% gratuity is applied to unsigned bar tabs.',
    // TODO: confirmar con cliente. El 22 % de gratuity sale del PDF de EVENTOS
    // y aplica a eventos privados, no a una cuenta de barra. Que el precio de
    // barra lleve impuesto incluido no lo dice nadie.
    source: null,
  },
];

/** Las que se publican: sólo las que tienen fuente verificable. */
export const verifiedFaqs = (): readonly Faq[] => FAQS.filter((f) => f.source !== null);

/** Las que esperan respuesta del cliente. Para el informe de pendientes. */
export const unverifiedFaqs = (): readonly Faq[] => FAQS.filter((f) => f.source === null);

/** Los grupos que quedan con al menos una pregunta publicable. */
export const FAQ_GROUPS = [...new Set(verifiedFaqs().map((f) => f.group))];
