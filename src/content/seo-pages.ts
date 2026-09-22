/**
 * H1, `<title>` y descripción de cada página, en un solo lugar.
 *
 * Vive junto porque así la tabla del brief es AUDITABLE: `npm run check:seo`
 * compara lo que se renderiza contra esto. Repartido en veinte archivos, un
 * título cambiado a mano no lo nota nadie hasta que baja el tráfico.
 *
 * ⚠️ Los `title` son **absolutos**: ya traen el nombre de la marca donde
 * corresponde, así que evitan el `template` del layout raíz. Vinieron así en la
 * tabla del brief y el orden de las palabras importa para el SEO local — el
 * término de búsqueda va primero en la mayoría.
 *
 * ⚠️ `keywords` NO se emite como meta tag: Google lo ignora desde 2009 y es una
 * pista gratis para la competencia. Está acá como documentación de la intención
 * de búsqueda de cada página, para que el copy no se aleje de ella.
 */

export interface PageSeo {
  /** El H1. Uno solo por página. */
  readonly h1: string;
  /** `<title>` absoluto: no pasa por el template del layout. */
  readonly title: string;
  readonly description: string;
  /** Intención de búsqueda. Documental, no se emite. */
  readonly keywords: readonly string[];
}

export const PAGE_SEO = {
  '/': {
    h1: 'Bonita comes together',
    title: 'Rooftop at Riverside | Rooftop Bar & Food Truck Park in Bonita Springs, FL',
    /*
     * ⚠️ SIN LOS DÍAS DEL HAPPY HOUR, Y LOS TENÍA. Decía «happy hour
     * Wednesday to Friday», que el 2026-09-17 resultó ser un dato equivocado
     * heredado del footer del sitio viejo: es sábado y domingo.
     *
     * No se corrige el día, se saca: una description es texto ESTÁTICO que se
     * hornea en el build, así que cualquier horario escrito acá vuelve a
     * quedar viejo el día que el cliente lo cambie en el dashboard y nadie se
     * entera. El horario vive en el evento y se publica en la página, que es
     * donde alguien lo va a buscar.
     */
    description:
      'A rooftop bar over four food trucks in downtown Bonita Springs. Live music on the calendar, happy hour on the weekend, dogs welcome in the yard. No reservations, just come up.',
    keywords: ['rooftop bar bonita springs', 'food truck park'],
  },

  '/sunset-bar': {
    h1: "Bonita's only rooftop",
    title: 'Sunset Bar | The Only Rooftop Bar in Bonita Springs',
    // ⚠️ Ídem la home: los días, las horas y los tres precios que decía acá
    // eran los del sitio viejo y estaban mal. El dato vive en el evento.
    description:
      'Craft cocktails, local drafts and the best west-facing seat in town. Weekend happy hour, and the whole rooftop looking at the sunset.',
    keywords: ['rooftop bar', 'happy hour bonita springs'],
  },

  '/food-trucks': {
    h1: 'Four kitchens. One yard.',
    title: 'Food Trucks | Bonita Springs Food Truck Park',
    description:
      'Four independent food trucks park in the yard at Rooftop at Riverside. Seafood, smashburgers, street tacos and Caribbean. Order at whichever window you want.',
    keywords: ['food trucks bonita springs', 'where to eat downtown'],
  },

  '/whats-on': {
    h1: "What's on this week",
    title: 'Events & Live Music | Rooftop at Riverside',
    description:
      'Live music, Bingo Night and Wooftop Fest in downtown Bonita Springs. See the calendar by month or by list, filter it, and add it to your own.',
    keywords: ['live music bonita springs tonight', 'things to do'],
  },

  '/events': {
    h1: 'Your event, two stories up',
    title: 'Private Event Venue in Bonita Springs | Rooftop at Riverside',
    description:
      'Rent the rooftop, the yard, or the whole place. Four food trucks, our own bar, and one person coordinating all of it. Downtown Bonita Springs.',
    keywords: ['private event venue bonita springs'],
  },









  '/market': {
    /**
     * ⚠️ ERA «The Neighborhood Market» Y CAMBIÓ CON EL REDISEÑO DE LA PÁGINA,
     * por una medida y no por gusto: el hero pasó a `PlateHero`, que tiene el
     * contrato de los DOS renglones, y «NEIGHBORHOOD» sola mide 248px a 320 de
     * viewport contra una placa que ahí puede medir 232. En un teléfono el
     * titular se partía en tres y la foto le tapaba el último renglón.
     *
     * El nombre del market no se pierde: sigue en el `title` de acá, en la
     * miga, en el rótulo de la banda oscura y en el cierre de la página. Y el
     * H1 queda como el de las otras cinco páginas terminadas, que son frases y
     * no nombres de sección: «Bonita's only rooftop», «Say hello».
     */
    h1: 'Meet the makers',
    title: 'Neighborhood Market | Rooftop at Riverside',
    /**
     * ⚠️ LA DESCRIPCIÓN SIGUE NOMBRANDO EL FEE aunque la página haya dejado de
     * abrir con él (rediseño del 2026-09-22). No es una contradicción: en un
     * resultado de búsqueda el precio CALIFICA el clic, y un vendor que ve «$30»
     * en el snippet entra sabiendo a qué. Lo que se corrigió es el orden: la
     * frase ahora termina en la acción y no en el número.
     */
    description:
      'Local makers set up in the yard with handmade goods, while the trucks cook and the bar stays open. Booths are $30, and you can apply online.',
    keywords: ['market bonita springs'],
  },

  '/our-story': {
    h1: 'A Magnus family project',
    title: 'Our Story | Rooftop at Riverside, Downtown Bonita Springs',
    description:
      'Four years of planning by a Bonita family. How a corner of Old 41 became a rooftop bar over four independent kitchens, with the town’s own history on the walls.',
    keywords: [],
  },

  '/join-us': {
    // ⚠️ Cambió el 2026-09-15: el carril de food trucks se eliminó de
    // `/join-us` porque lo habíamos inventado. Quedan dos, y el H1 lo dice.
    //
    // ⚠️ Y VOLVIÓ A CAMBIAR EL 2026-09-21, de «Two ways in» a esto, por el
    // hero. La página pasó a `PlateHero`, cuyo titular TIENE que partir en dos
    // renglones —el solapamiento de `-0.94em` es media placa de dos líneas— y
    // «Two ways in» no parte: deja «Two» solo arriba o un «in» huérfano abajo.
    //
    // El reemplazo no es una frase nueva: son los dos títulos de sección de la
    // página, que ya decían «Work here» y «Play here». Parte parejo, dice qué
    // hace la página sin pedir que se interprete «dos maneras de entrar», y
    // deja «play here» como la palabra en color del hero.
    h1: 'Work here, play here',
    title: 'Jobs & Live Music Bookings | Rooftop at Riverside',
    description:
      'Two ways in: we hire through here, and we book live music for the stage in the yard. Both start with a form that a person reads.',
    keywords: ['bonita springs bar jobs', 'live music booking bonita springs'],
  },



  '/contact': {
    h1: 'Say hello',
    title: 'Contact | Rooftop at Riverside',
    description:
      'The address, the hours and a form that reaches the person who can answer it. Downtown Bonita Springs, across from Riverside Park.',
    keywords: [],
  },
  /**
   * ⚠️ RUTA NUEVA del 2026-09-15. Reemplaza al `/game-lounge` del sitio viejo,
   * que redirigía a un ancla dentro de `/our-story`. Es la segunda página con
   * precios del sitio y se llama `game-truck` porque el copy del cliente dice
   * «our specially designed truck», no una sala.
   */
  '/game-truck': {
    h1: "Southwest Florida's first gaming truck",
    title: 'Gaming Truck | Rooftop at Riverside, Bonita Springs',
    description:
      'Xbox Series X, PlayStation 5 and Nintendo Switch 2 on six screens with a Game Coach on site. $10 per person for 30 minutes, or a two hour party from $400.',
    keywords: [],
  },

  /*
   * ══════════════════════════════════════════════════════════════════════
   * LOS TRES DOCUMENTOS LEGALES DEL CAMIÓN, rutas nuevas del 2026-09-22.
   *
   * ⚠️ ANTES NO ERAN PÁGINAS NUESTRAS. Los dos waivers eran páginas del sitio
   * viejo con una 301 puesta acá, y las políticas eran un PDF colgado del CDN
   * de Wix. O sea que los papeles que firma un cliente seguían viviendo en el
   * dominio que estamos reemplazando, y uno de los tres no tenía URL.
   *
   * ⚠️ LOS TRES SE INDEXAN. La tentación es ponerles `noIndex` «porque son
   * legales», pero estas son las únicas páginas del sitio que contestan
   * «¿puedo llevar comida al camión?» o «¿hasta cuándo puedo cancelar?», que
   * es exactamente lo que alguien busca antes de reservar. Además Google
   * mira la existencia de términos publicados cuando evalúa un sitio que
   * cobra por adelantado.
   *
   * ⚠️ LOS `title` NO REPITEN LA MARCA DOS VECES. Son absolutos como todos
   * los de esta tabla: ya traen «Rooftop at Riverside» al final y no pasan
   * por el `template` del layout.
   * ══════════════════════════════════════════════════════════════════════
   */
  '/gaming-truck-policies': {
    h1: 'Gaming truck policies',
    title: 'Gaming Truck Policies & Procedures | Rooftop at Riverside',
    description:
      'Booking, deposits, cancellations, inclement weather, food and drink, alcohol, behavior and game ratings for the gaming truck at Rooftop at Riverside.',
    keywords: ['gaming truck cancellation policy', 'game truck party rules bonita springs'],
  },
  '/game-zone-waiver': {
    h1: 'Game zone waiver',
    title: 'Game Zone Waiver | Rooftop at Riverside',
    description:
      'The full terms and conditions for the gaming truck: assumption of risk, property damage, release of liability and the photography release. Read it before you sign it.',
    keywords: ['game truck waiver'],
  },
  '/bar-games-waiver': {
    h1: 'Bar games waiver',
    title: 'Bar Games Waiver | Rooftop at Riverside',
    description:
      'Terms and conditions for the bar games at Rooftop at Riverside. Twenty one and over, no gambling, and the rules every player agrees to.',
    keywords: ['bar games terms and conditions'],
  },
} as const satisfies Record<string, PageSeo>;

export type SeoRoute = keyof typeof PAGE_SEO;

export const seo = (route: SeoRoute): PageSeo => PAGE_SEO[route];
