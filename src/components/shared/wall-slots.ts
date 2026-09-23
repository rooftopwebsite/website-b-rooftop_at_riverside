export type Slot =
  | { readonly tipo: 'video'; readonly src: string; readonly poster: string }
  | { readonly tipo: 'foto'; readonly src: string };

export const WALL: readonly Slot[] = [
  { tipo: 'foto', src: '/images/venue/wall-cocktails-rooftop.webp' },
  { tipo: 'foto', src: '/images/venue/wall-truck-window-day.webp' },
  { tipo: 'video', src: '/videos/latin-night.mp4', poster: '/videos/latin-night.webp' },
  { tipo: 'foto', src: '/images/venue/wall-food-platter.webp' },
  { tipo: 'foto', src: '/images/venue/wall-live-music-tent.webp' },
  { tipo: 'foto', src: '/images/venue/wall-yard-night-table.webp' },
  { tipo: 'video', src: '/videos/live-music.mp4', poster: '/videos/live-music.webp' },
  { tipo: 'foto', src: '/images/venue/wall-guests-yard-day.webp' },
  { tipo: 'foto', src: '/images/venue/wall-dancing-night.webp' },
  { tipo: 'foto', src: '/images/venue/wall-bartender.webp' },
  { tipo: 'foto', src: '/images/venue/wall-yard-night-crowd.webp' },
  { tipo: 'foto', src: '/images/venue/wall-sandwich.webp' },
];
