import type { MetadataRoute } from 'next';
import { getPosts } from '@/lib/blog';
import { ALL_ROUTES, BLOG_HREF } from '@/lib/nav';
import { SITE_URL } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const priority = (path: string) => {
    if (path === '/') return 1;
    if (path.startsWith('/events') || path === '/whats-on') return 0.9;
    if (path === '/food-trucks' || path === '/sunset-bar' || path === '/contact') return 0.8;
    return 0.6;
  };

  const posts = await getPosts();

  const routes = posts.length > 0 ? ALL_ROUTES : ALL_ROUTES.filter((path) => path !== BLOG_HREF);

  const staticRoutes = routes.map((path) => ({
    url: `${SITE_URL}${path === '/' ? '' : path}`,
    lastModified: now,
    changeFrequency: (path === '/whats-on' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
    priority: priority(path),
  }));

  const postRoutes = posts
    .filter((p) => p.canonicalPath.startsWith('/blog/'))
    .map((p) => ({
      url: `${SITE_URL}${p.canonicalPath}`,
      lastModified: p.modifiedAt || p.publishedAt || now,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    }));

  return [...staticRoutes, ...postRoutes];
}
