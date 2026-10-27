export type Slot =
  | { readonly type: 'video'; readonly src: string; readonly poster: string }
  | { readonly type: 'photo'; readonly src: string };

export const WALL: readonly Slot[] = [
  { type: 'photo', src: '/images/venue/wall-cocktails-rooftop.webp' },
  { type: 'photo', src: '/images/venue/wall-truck-window-day.webp' },
  { type: 'video', src: '/videos/latin-night.mp4', poster: '/videos/latin-night.webp' },
  { type: 'photo', src: '/images/venue/wall-food-platter.webp' },
  { type: 'photo', src: '/images/venue/wall-live-music-tent.webp' },
  { type: 'photo', src: '/images/venue/wall-yard-night-table.webp' },
  { type: 'video', src: '/videos/live-music.mp4', poster: '/videos/live-music.webp' },
  { type: 'photo', src: '/images/venue/wall-guests-yard-day.webp' },
  { type: 'photo', src: '/images/venue/wall-dancing-night.webp' },
  { type: 'photo', src: '/images/venue/wall-bartender.webp' },
  { type: 'photo', src: '/images/venue/wall-yard-night-crowd.webp' },
  { type: 'photo', src: '/images/venue/wall-sandwich.webp' },
];
