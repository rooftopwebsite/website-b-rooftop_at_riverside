import 'server-only';
import posts from '@/content/blog.json';
import { toPosts, type FeedPost, type PostFull } from './blog-format';
import { SITE_URL } from './seo';

const TODOS: readonly PostFull[] = toPosts(posts as readonly FeedPost[], SITE_URL);

export async function getPosts(): Promise<readonly PostFull[]> {
  return TODOS;
}

export async function getPost(slug: string): Promise<PostFull | null> {
  return TODOS.find((p) => p.slug === slug) ?? null;
}

export async function getPostSlugs(): Promise<string[]> {
  return TODOS.map((p) => p.slug);
}
