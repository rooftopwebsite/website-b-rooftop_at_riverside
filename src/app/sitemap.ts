import type { MetadataRoute } from 'next';
import { EVENTS } from '@/content/events';
import { activeTrucks } from '@/content/trucks';
import { ALL_ROUTES } from '@/lib/nav';
import { SITE_URL } from '@/lib/seo';

/**
 * Sitemap dinámico. Las rutas estáticas salen de `ALL_ROUTES`, y las dinámicas
 * de los datos: sacar un truck del roster o un evento del calendario lo saca
 * del sitemap sin que nadie se acuerde de hacerlo.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const priority = (path: string) => {
    if (path === '/') return 1;
    // Las páginas de la vertical que más factura, y el calendario, arriba.
    if (path.startsWith('/events') || path === '/whats-on') return 0.9;
    if (path === '/food-trucks' || path === '/sunset-bar' || path === '/visit') return 0.8;
    return 0.6;
  };

  const staticRoutes = ALL_ROUTES.map((path) => ({
    url: `${SITE_URL}${path === '/' ? '' : path}`,
    lastModified: now,
    // El calendario cambia todos los meses; el resto, rara vez.
    changeFrequency: (path === '/whats-on' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
    priority: priority(path),
  }));

  const truckRoutes = activeTrucks().map((t) => ({
    url: `${SITE_URL}/food-trucks/${t.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const eventRoutes = EVENTS.map((e) => ({
    url: `${SITE_URL}/whats-on/${e.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...truckRoutes, ...eventRoutes];
}
