import type { MetadataRoute } from 'next';
import { getPosts } from '@/lib/blog';
import { ALL_ROUTES } from '@/lib/nav';
import { SITE_URL } from '@/lib/seo';

/**
 * Sitemap dinámico. Las rutas estáticas salen de `ALL_ROUTES`, y las dinámicas
 * de los datos: sacar un truck del roster o un evento del calendario lo saca
 * del sitemap sin que nadie se acuerde de hacerlo.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  /*
   * ══════════════════════════════════════════════════════════════════════
   * ⚠️ NO HAY RUTAS POR TRUCK NI POR EVENTO, Y LAS HABÍA. Las dos listas se
   * fueron el 2026-09-16 porque las dos apuntaban a páginas que ya no existen:
   *
   *   · `/food-trucks/[slug]` se sacó cuando los cuatro trucks pasaron a ser
   *     tarjetas de una sola página. Los cuatro slugs ahora dan 301.
   *   · `/whats-on/[slug]` se había sacado unos días antes, y estas URLs
   *     quedaron en el sitemap apuntando a 404.
   *
   * ⚠️ UN SITEMAP QUE LISTA REDIRECCIONES Y 404 ES PEOR QUE UNO CORTO. Google
   * lo trata como señal de calidad del sitio: cada URL del sitemap es una
   * afirmación de que ahí hay algo que vale la pena indexar.
   * ══════════════════════════════════════════════════════════════════════
   *
   * ⚠️ LAS NOTAS DEL BLOG SÍ VAN, y no contradicen lo de arriba: salen del
   * mismo feed que dibuja `/blog/[slug]`, así que una URL listada es una nota
   * que existe. Sólo las que viven bajo `/blog/`: una con canonical propio a
   * otra página del sitio ya está en `staticRoutes`.
   */
  const posts = (await getPosts())
    .filter((p) => p.canonicalPath.startsWith('/blog/'))
    .map((p) => ({
      url: `${SITE_URL}${p.canonicalPath}`,
      lastModified: p.modifiedAt || p.publishedAt || now,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    }));

  return [...staticRoutes, ...posts];
}
