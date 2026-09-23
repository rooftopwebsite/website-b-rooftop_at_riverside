import type { MetadataRoute } from 'next';
import { BRAND } from '@/lib/brand';

/**
 * El manifest: el nombre y el ícono que usa Android al agregar el sitio a la
 * pantalla de inicio. Los PNG salen de `npm run icons` (ver
 * `scripts/build-icons.mjs`).
 *
 * ⚠️ `theme_color` ES EL MISMO `deep` DEL `themeColor` DEL LAYOUT y de la
 * placa del ícono: es el color de lo que está pegado arriba de todo.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND.name,
    short_name: BRAND.shortName,
    description: BRAND.concept,
    start_url: '/',
    display: 'browser',
    background_color: '#faf6ea',
    theme_color: '#014545',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
