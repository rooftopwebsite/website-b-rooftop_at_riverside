import { withoutEmDash } from './em-dash.ts';

export interface FeedPost {
  readonly id: string;
  readonly slug: string | null;
  readonly canonicalUrl?: string | null;
  readonly title: string | null;
  readonly excerpt?: string | null;
  readonly coverImageUrl?: string | null;
  readonly coverImageAlt?: string | null;
  readonly ogImage?: string | null;
  readonly ogTitle?: string | null;
  readonly ogDescription?: string | null;
  readonly content?: string | null;
  readonly contentHtml?: string | null;
  readonly jsonLd?: unknown;
  readonly author?: { readonly name?: string | null; readonly avatarUrl?: string | null } | null;
  readonly publishedAt?: string | null;
  readonly updatedAt?: string | null;
  readonly featured?: boolean | null;
}

export interface Post {
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly image: string | null;
  readonly imageAlt: string;
  readonly publishedAt: string;
  readonly modifiedAt: string;
  readonly readMinutes: number;
  readonly featured: boolean;
}

export interface PostFull extends Post {
  readonly html: string;
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly ogImage: string | null;
  readonly canonicalPath: string;
  readonly faqJsonLd: readonly Record<string, unknown>[];
}

export const IMAGE_ORIGIN = '/images/blog/';

export function safeImage(url: string | null | undefined): string | null {
  return url && url.startsWith(IMAGE_ORIGIN) ? url : null;
}

const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&nbsp;': ' ',
  '&mdash;': '—',
  '&#8212;': '—',
  '&ndash;': '–',
  '&rsquo;': '’',
  '&lsquo;': '‘',
  '&rdquo;': '”',
  '&ldquo;': '“',
  '&hellip;': '…',
};

const decode = (t: string) => t.replace(/&[#a-z0-9]+;/gi, (e) => ENTITIES[e.toLowerCase()] ?? e);

function cleanText(t: string): string {
  const text = t.replace(/&mdash;|&#8212;/gi, '—');
  if (!text.includes('—')) return text;
  const [, before, middle, after] = text.match(/^(\s*)([\s\S]*?)(\s*)$/)!;
  return `${middle.startsWith('—') ? '' : before}${withoutEmDash(middle)}${after}`;
}

export function cleanHtml(html: string): string {
  let raw = 0;
  return html
    .split(/(<[^>]*>)/g)
    .map((part) => {
      if (part.startsWith('<')) {
        if (/^<(code|pre)\b/i.test(part)) raw++;
        else if (/^<\/(code|pre)\s*>/i.test(part)) raw = Math.max(0, raw - 1);
        return part.replace(/^<(\/?)h1\b/i, '<$1h2');
      }
      return raw > 0 ? part : cleanText(part);
    })
    .join('');
}

export function htmlToText(html: string): string {
  return decode(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
}

const escape = (t: string) =>
  t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function markdownToHtml(md: string): string {
  return md
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const title = block.match(/^#{1,6}\s+(.*)$/);
      if (title) return `<h2>${escape(title[1].trim())}</h2>`;
      return `<p>${escape(block.replace(/\s*\n\s*/g, ' '))}</p>`;
    })
    .join('');
}

export function readMinutes(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}

function ymd(value: string | null | undefined): string {
  const m = value?.match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : '';
}

export function formatDate(value: string): string {
  const d = ymd(value);
  if (!d) return '';
  return new Date(`${d}T12:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function postMeta(post: Post): string {
  return [formatDate(post.publishedAt), `${post.readMinutes} min read`].filter(Boolean).join(' · ');
}

export function faqNodes(jsonLd: unknown): Record<string, unknown>[] {
  const nodes = Array.isArray(jsonLd) ? jsonLd : jsonLd && typeof jsonLd === 'object' ? [jsonLd] : [];
  const out: Record<string, unknown>[] = [];
  for (const node of nodes) {
    if (!node || typeof node !== 'object') continue;
    const o = node as Record<string, unknown>;
    const context = o['@context'] ?? 'https://schema.org';
    const list = Array.isArray(o['@graph']) ? (o['@graph'] as unknown[]) : [o];
    for (const g of list) {
      if (!g || typeof g !== 'object') continue;
      const { '@context': _ctx, ...rest } = g as Record<string, unknown>;
      if (rest['@type'] === 'FAQPage') out.push({ '@context': context, ...rest });
    }
  }
  return out;
}

const humanize = (slug: string) =>
  slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

function truncate(text: string, max = 160): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const space = cut.lastIndexOf(' ');
  return `${(space > 0 ? cut.slice(0, space) : cut).replace(/[\s.,;:]+$/, '')}…`;
}

const clean = (t: string | null | undefined) => (t ? withoutEmDash(t.trim()) : '');

export function toPostFull(feed: FeedPost, siteUrl: string): PostFull | null {
  const slug = feed.slug?.trim();
  if (!slug) return null;

  const html = cleanHtml(
    feed.contentHtml?.trim() ? feed.contentHtml : markdownToHtml(feed.content ?? ''),
  );
  const text = htmlToText(html);
  const title = clean(feed.title) || humanize(slug);
  const excerpt = clean(feed.excerpt) || truncate(text);
  const image = safeImage(feed.coverImageUrl);

  const canonical = feed.canonicalUrl?.trim() ?? '';
  const canonicalPath =
    canonical.startsWith(`${siteUrl}/`) ? canonical.slice(siteUrl.length) : `/blog/${slug}`;

  return {
    slug,
    title,
    excerpt,
    image,
    imageAlt: clean(feed.coverImageAlt) || title,
    publishedAt: ymd(feed.publishedAt),
    modifiedAt: feed.updatedAt?.trim() ?? '',
    readMinutes: readMinutes(text),
    featured: feed.featured === true,
    html,
    metaTitle: clean(feed.ogTitle) || title,
    metaDescription: clean(feed.ogDescription) || excerpt,
    ogImage: safeImage(feed.ogImage) ?? image,
    canonicalPath,
    faqJsonLd: faqNodes(feed.jsonLd),
  };
}

export function toPosts(feed: readonly FeedPost[], siteUrl: string): PostFull[] {
  const seen = new Set<string>();
  const out: PostFull[] = [];
  for (const f of feed) {
    const p = toPostFull(f, siteUrl);
    if (!p || seen.has(p.slug)) continue;
    seen.add(p.slug);
    out.push(p);
  }
  return out;
}

export function splitFeatured<T extends Post>(posts: readonly T[]): { featured: T | null; rest: T[] } {
  if (posts.length === 0) return { featured: null, rest: [] };
  const i = Math.max(0, posts.findIndex((p) => p.featured));
  return { featured: posts[i], rest: posts.filter((_, j) => j !== i) };
}
