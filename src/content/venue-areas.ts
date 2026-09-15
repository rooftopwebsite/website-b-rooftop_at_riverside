import type { VenueArea } from '@/types/content';

/**
 * De qué está hecho el lugar, recorrido de arriba hacia abajo.
 *
 * ⚠️ NO es `content/spaces.ts`. Ese archivo lista lo ALQUILABLE, con capacidad
 * y precio, y lo consume `/events`. Éste lista lo que alguien recorre cuando
 * viene un miércoles cualquiera. Por eso acá está el escenario, que no se
 * alquila suelto, y no está el Full Buyout, que se alquila y no es un lugar.
 *
 * ⚠️ Los dos nombres nuevos salen del rebrand que el cliente confirmó en el
 * check-in del 9 de septiembre de 2026: la cancha exterior pasa a llamarse
 * **the Yard** y se está cerrando con reja para habilitar eventos con entrada
 * paga, y el bar de arriba pasa a llamarse **Sunset Bar**, que queda como el
 * nombre oficial para todo uso externo.
 *
 * ⚠️ EL ESCENARIO ESTÁ ABAJO, en el patio, no en el rooftop. Lo dicen
 * `spaces.ts` («the open yard where the trucks park and the stage goes up») y
 * `event-types.ts`. Es el dato más fácil de equivocar al escribir esta página.
 */
export const VENUE_AREAS: readonly VenueArea[] = [
  {
    slug: 'sunset-bar',
    name: 'Sunset Bar',
    floor: 'Second floor',
    body: 'The bar on the roof, and the only thing here we cook up ourselves. It faces west over Riverside Park, which is the whole reason it is up there. Cocktails get made in the morning, the drafts come from breweries twenty minutes away, and it is the one tab in the building that is ours.',
    photo: '/images/venue/wall-bartender.jpg',
    photoAlt: 'A bartender making a drink behind the bar at Rooftop at Riverside',
    photoBrief:
      "La barra de arriba entera al atardecer, con la vista al oeste detrás.",
    href: '/sunset-bar',
  },
  {
    slug: 'the-patio',
    name: 'The rooftop patio',
    floor: 'Second floor',
    body: 'Open air, under the sky, with the rooftop bar at your back and the yard two stories below. It is where a group ends up when the inside of the bar is full and nobody wants to leave.',
    // TODO: confirmar con cliente. No hay ninguna foto del patio de arriba en
    // la entrega del 2026-09-10: las 36 son de la barra o del patio de abajo.
    photo: null,
    photoAlt: null,
    photoBrief:
      "El patio de arriba al aire libre, con mesas y gente, mirando hacia el patio de abajo.",
  },
  {
    slug: 'the-stage',
    name: 'The stage',
    floor: 'Ground floor',
    // ⚠️ El número de noches se saca del texto: no está confirmado. Ver
    // `content/entertainment.ts`.
    body: 'Live music down in the yard where the trucks are. Sound and a stage are already there, which is why a band, an auction or a speaker all work here without renting a single thing in.',
    photo: '/images/venue/wall-live-music-tent.jpg',
    photoAlt: 'A musician playing under the tent in the yard',
    photoBrief:
      "El escenario armado con una banda tocando y gente mirando.",
    href: '/whats-on',
  },
  {
    slug: 'the-yard',
    name: 'The Yard',
    floor: 'Ground floor',
    body: 'The open yard that holds the trucks, the stage and the tables. It is being gated, which is what turns an open lot into a room you can sell a ticket to: a festival, a benefit, a show with seats.',
    photo: '/images/venue/wall-yard-night-table.jpg',
    photoAlt: 'A group at a table in the yard at night, with the food trucks lit up behind them',
    photoBrief:
      "El patio cerrado con la reja puesta, de noche, durante un show con entrada.",
  },
  {
    slug: 'food-truck-park',
    name: 'The food truck park',
    floor: 'Ground floor',
    body: 'Four kitchens, four independent businesses, parked in the yard underneath all of it. Each one sets its own menu, takes its own orders and keeps its own register. We give them the yard and the crowd.',
    photo: '/images/venue/wall-truck-window-day.jpg',
    photoAlt: 'People ordering at a food truck window in the yard during the day',
    photoBrief:
      "Los cuatro trucks estacionados en fila, con los carteles legibles.",
    href: '/food-trucks',
  },
];
