import 'server-only';
import { cache } from 'react';
import { toPosts, type FeedPost, type PostFull } from './blog-format';
import { fetchConTimeout } from './http';
import { SITE_URL } from './seo';

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

export async function getPosts(): Promise<readonly PostFull[]> {
  try {
    return await readFeed();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    return [];
  }
}

export async function getPost(slug: string): Promise<PostFull | null> {
  return (await readFeed()).find((p) => p.slug === slug) ?? null;
}

export async function getPostSlugs(): Promise<string[]> {
  return (await getPosts()).map((p) => p.slug);
}
