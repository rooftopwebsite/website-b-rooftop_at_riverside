import type { VenueArea } from '@/types/content';

export const VENUE_AREAS: readonly VenueArea[] = [
  {
    slug: 'sunset-bar',
    name: 'Sunset Bar',
    floor: 'Second floor',
    body: 'The bar on the roof, facing west over Riverside Park. The only thing here we make ourselves, and the one tab in the building that is ours.',
    photo: '/images/venue/wall-bartender.webp',
    photoAlt: 'A bartender making a drink behind the bar at Rooftop at Riverside',
    photoBrief:
      "La barra de arriba entera al atardecer, con la vista al oeste detrás.",
    href: '/sunset-bar',
  },
  {
    slug: 'the-patio',
    name: 'The rooftop patio',
    floor: 'Second floor',
    body: 'Open air, with the rooftop bar at your back and the yard two stories below. Where a group ends up when the bar inside is full.',
    photo: '/images/venue/patio-rooftop-table.webp',
    photoAlt: 'Tables with umbrellas along the railing of the rooftop patio',
    photoBrief:
      "El patio de arriba al aire libre, con mesas y gente, mirando hacia el patio de abajo.",
  },
  {
    slug: 'the-stage',
    name: 'The stage',
    floor: 'Ground floor',
    body: 'Live music down in the yard where the trucks are. Sound and stage are already there, so a band, an auction or a speaker rents nothing in.',
    photo: '/images/venue/wall-live-music-tent.webp',
    photoAlt: 'A musician playing under the tent in the yard',
    photoBrief:
      "El escenario armado con una banda tocando y gente mirando.",
    href: '/whats-on',
  },
  {
    slug: 'the-yard',
    name: 'The Yard',
    floor: 'Ground floor',
    body: 'The open yard that holds the trucks, the stage and the tables. It is being gated, turning an open lot into a room you can sell a ticket to.',
    photo: '/images/venue/wall-yard-night-table.webp',
    photoAlt: 'A group at a table in the yard at night, with the food trucks lit up behind them',
    photoBrief:
      "El patio cerrado con la reja puesta, de noche, durante un show con entrada.",
  },
  {
    slug: 'food-truck-park',
    name: 'The food truck park',
    floor: 'Ground floor',
    body: 'Four kitchens, four independent businesses. Each sets its own menu and keeps its own register. We give them the yard and the crowd.',
    photo: '/images/venue/wall-truck-window-day.webp',
    photoAlt: 'People ordering at a food truck window in the yard during the day',
    photoBrief:
      "Los cuatro trucks estacionados en fila, con los carteles legibles.",
    href: '/food-trucks',
  },
];
