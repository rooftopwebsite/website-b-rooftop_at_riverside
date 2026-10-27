import 'server-only';
import posts from '@/content/blog.json';
import { toPosts, type FeedPost, type PostFull } from './blog-format';
import { SITE_URL } from './seo';

const ALL_POSTS: readonly PostFull[] = toPosts(posts as readonly FeedPost[], SITE_URL);

export async function getPosts(): Promise<readonly PostFull[]> {
  return ALL_POSTS;
}

export async function getPost(slug: string): Promise<PostFull | null> {
  return ALL_POSTS.find((p) => p.slug === slug) ?? null;
}

export async function getPostSlugs(): Promise<string[]> {
  return ALL_POSTS.map((p) => p.slug);
}
