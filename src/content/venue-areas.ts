import type { VenueArea } from '@/types/content';

export const VENUE_AREAS: readonly VenueArea[] = [
  {
    slug: 'sunset-bar',
    name: 'Sunset Bar',
    floor: 'Second floor',
    body: 'The bar on the roof, facing west over Riverside Park. Cocktails made fresh every day and the best sunset seat in Bonita Springs.',
    photo: '/images/venue/wall-bartender.webp',
    photoAlt: 'A bartender making a drink behind the bar at Rooftop at Riverside',
    photoBrief:
      "The whole upstairs bar at sunset, with the view west behind it.",
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
      "The open-air upstairs patio, with tables and people, looking down toward the yard below.",
  },
  {
    slug: 'the-stage',
    name: 'The stage',
    floor: 'Ground floor',
    body: 'Live music down in the yard where the trucks are. Sound and stage are already there, so a band, an auction or a speaker rents nothing in.',
    photo: '/images/venue/wall-live-music-tent.webp',
    photoAlt: 'A musician playing under the tent in the yard',
    photoBrief:
      "The stage set up with a band playing and people watching.",
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
      "The yard closed off with the gate up, at night, during a ticketed show.",
  },
  {
    slug: 'food-truck-park',
    name: 'The food truck park',
    floor: 'Ground floor',
    body: 'Gourmet food trucks, each with its own chef and its own specialties. Something new to try every visit.',
    photo: '/images/venue/wall-truck-window-day.webp',
    photoAlt: 'People ordering at a food truck window in the yard during the day',
    photoBrief:
      "The four trucks parked in a row, with their signs readable.",
    href: '/food-trucks',
  },
];
