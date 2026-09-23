import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        /* ⚠️ ACÁ HABÍA UN `disallow` A `/events/inquire/thank-you`, una ruta
           que dejó de existir cuando el formulario pasó a `/events#inquire`.
           La confirmación ahora es un estado del mismo formulario, sin URL. */
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
