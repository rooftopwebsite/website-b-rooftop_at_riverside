import 'server-only';
import { cache } from 'react';
import { toPosts, type FeedPost, type PostFull } from './blog-format';
import { fetchConTimeout } from './http';
import { SITE_URL } from './seo';

/**
 * El blog sale del FEED PÚBLICO del dashboard, el mismo que leen Pretty Hens,
 * Santa Maria, Yava y Juanitos. No pide clave y ya viene filtrado a lo
 * publicado, con la destacada primero y después de la más nueva a la más vieja.
 *
 * ⚠️ NO ES `no-store` COMO EN LOS HERMANOS. Rooftop cachea toda lectura de la
 * base con el caché de Next (ver `restoexp.ts`), y el blog también: 10 minutos
 * y los tags `restoexp` y `blog`. Una nota nueva aparece sola en ese plazo.
 * En dev el caché vive en `.next/cache/fetch-cache`: para ver una nota recién
 * cargada hay que borrar esa carpeta y reiniciar.
 *
 * ⚠️ `BLOG_RESTAURANT_ID` ES SÓLO PARA VERIFICAR. Rooftop tiene 0 notas al
 * 2026-09-23; con ese override se levanta el dev con las de otro restaurante.
 * No va al `.env` de producción.
 */
const FEED_ORIGIN = process.env.BLOG_FEED_ORIGIN || 'https://app.restoexp.com';
const RESTAURANT_ID =
  process.env.BLOG_RESTAURANT_ID || process.env.NEXT_PUBLIC_SUPABASE_RESTAURANT_ID;

const readFeed = cache(async (): Promise<readonly PostFull[]> => {
  if (!RESTAURANT_ID) {
    throw new Error('[blog] falta NEXT_PUBLIC_SUPABASE_RESTAURANT_ID, el feed no se puede pedir');
  }
  const url = `${FEED_ORIGIN}/api/public/restaurants/${RESTAURANT_ID}/blogs`;
  const res = await fetchConTimeout(url, {
    headers: { accept: 'application/json' },
    next: { revalidate: 600, tags: ['restoexp', 'blog'] },
  });
  if (!res.ok) throw new Error(`[blog] el feed respondió ${res.status} (${url})`);
  const body = (await res.json()) as { data?: unknown };
  if (!Array.isArray(body?.data)) throw new Error(`[blog] el feed no devolvió { data: [...] } (${url})`);
  return toPosts(body.data as FeedPost[], SITE_URL);
});

/**
 * Para el listado y el sitemap. NUNCA TIRA: si el feed no contesta, el listado
 * muestra su estado vacío, como toda lectura de la base en este sitio.
 */
export async function getPosts(): Promise<readonly PostFull[]> {
  try {
    return await readFeed();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    return [];
  }
}

/**
 * Para la nota. ⚠️ SÍ TIRA si el feed falla: la página da 500 y no 404. Un 404
 * le diría a Google que borre una URL indexada por una caída de diez minutos.
 * `null` significa que el feed contestó y la nota no está.
 */
export async function getPost(slug: string): Promise<PostFull | null> {
  return (await readFeed()).find((p) => p.slug === slug) ?? null;
}

export async function getPostSlugs(): Promise<string[]> {
  return (await getPosts()).map((p) => p.slug);
}
