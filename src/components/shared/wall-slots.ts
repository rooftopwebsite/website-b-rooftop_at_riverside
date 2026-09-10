/**
 * El material del hero: los doce slots, con su tipo y su archivo.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ VIVE EN SU PROPIO ARCHIVO porque lo comparten DOS formas del hero:
 * `CardArc` (el abanico, que es la forma vigente) y `VideoWall` (el muro
 * vertical de tres columnas, que sigue en el árbol). Volver de una a la otra no
 * tiene que implicar reasignar fotos.
 *
 * ⚠️ DOS VIDEOS Y DIEZ FOTOS, y la proporción no es por peso: de los cinco
 * videos que entregó Camila sólo dos son metraje ambiente. Los otros tres son
 * piezas de redes —una placa gráfica de «RED WHITE & MIMOSAS», y dos personas
 * hablando a cámara con subtítulo quemado—. En una card de 130px, muteada y en
 * loop de 6 segundos, eso no se lee como ambiente: se lee como un anuncio
 * roto. El razonamiento completo está en `scripts/build-media.mjs`.
 *
 * ⚠️ EL ORDEN IMPORTA. `CardArc` toma los primeros nueve y `VideoWall` los
 * reparte en tres columnas con solape, así que dos entradas consecutivas nunca
 * pueden ser lo mismo. Está intercalado día/noche y comida/gente/lugar, y los
 * dos videos están separados por tres posiciones para que no caigan juntos en
 * ninguna de las dos formas.
 *
 * ⚠️ Los archivos salen de `npm run media`, que recodifica y recorta los
 * originales de `public/multimedia/` —338 MB de fuente para 1,9 MB de
 * derivados—. No editar las rutas a mano sin correr el script.
 * ══════════════════════════════════════════════════════════════════════════
 */

export type Slot =
  | { readonly tipo: 'video'; readonly src: string; readonly poster: string }
  | { readonly tipo: 'foto'; readonly src: string };

export const WALL: readonly Slot[] = [
  { tipo: 'foto', src: '/images/venue/wall-cocktails-rooftop.jpg' },
  { tipo: 'foto', src: '/images/venue/wall-truck-window-day.jpg' },
  { tipo: 'video', src: '/videos/latin-night.mp4', poster: '/videos/latin-night.jpg' },
  { tipo: 'foto', src: '/images/venue/wall-food-platter.jpg' },
  { tipo: 'foto', src: '/images/venue/wall-live-music-tent.jpg' },
  { tipo: 'foto', src: '/images/venue/wall-yard-night-table.jpg' },
  { tipo: 'video', src: '/videos/live-music.mp4', poster: '/videos/live-music.jpg' },
  { tipo: 'foto', src: '/images/venue/wall-guests-yard-day.jpg' },
  { tipo: 'foto', src: '/images/venue/wall-dancing-night.jpg' },
  { tipo: 'foto', src: '/images/venue/wall-bartender.jpg' },
  { tipo: 'foto', src: '/images/venue/wall-yard-night-crowd.jpg' },
  { tipo: 'foto', src: '/images/venue/wall-sandwich.jpg' },
];
