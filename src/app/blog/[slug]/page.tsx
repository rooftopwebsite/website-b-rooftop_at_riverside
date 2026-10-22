import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import FindUs from '@/components/sections/FindUs';
import { ArrowLink } from '@/components/shared/Button';
import Section from '@/components/shared/Section';
import { getPost, getPostSlugs } from '@/lib/blog';
import { postMeta, type PostFull } from '@/lib/blog-format';
import { BRAND } from '@/lib/brand';
import { SITE_URL, breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';
import '../prose-post.css';

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getPostSlugs()).map((slug) => ({ slug }));
}

type Props = { readonly params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  const base = pageMeta({
    title: post.metaTitle,
    description: post.metaDescription,
    path: post.canonicalPath,
  });
  const cover = post.ogImage;
  const images = cover ? [{ url: cover, alt: post.imageAlt }] : undefined;
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: 'article',
      ...(post.publishedAt ? { publishedTime: post.publishedAt } : {}),
      ...(post.modifiedAt ? { modifiedTime: post.modifiedAt } : {}),
      ...(images ? { images } : {}),
    },
    twitter: { ...base.twitter, ...(images ? { images } : {}) },
  };
}

function postSchema(post: PostFull) {
  const url = `${SITE_URL}${post.canonicalPath}`;
  const casa = { '@type': 'Organization', name: BRAND.name, url: SITE_URL };
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#post`,
    headline: post.title,
    description: post.metaDescription,
    url,
    mainEntityOfPage: url,
    ...(post.image ? { image: [post.image] } : {}),
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    ...(post.modifiedAt || post.publishedAt ? { dateModified: post.modifiedAt || post.publishedAt } : {}),
    author: casa,
    publisher: casa,
  };
}

const MEDIDA = 'mx-auto w-full max-w-[42rem]';

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const trail = [
    { name: 'Blog', path: '/blog' },
    { name: post.title, path: `/blog/${post.slug}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript([postSchema(post), breadcrumbJsonLd(trail), ...post.faqJsonLd]),
        }}
      />

      <Section as="article" tone="paper" band="lg" labelledBy="post-title">
        <header className="mx-auto max-w-[52rem] text-center">
          <p className="eyebrow m-0 text-deep">{postMeta(post)}</p>
          <h1
            id="post-title"
            className="mt-gap-kicker font-display text-h2 font-semibold uppercase text-ink [text-wrap:balance]"
          >
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="bajada mx-auto mt-gap-bajada max-w-[44rem] text-lead">{post.excerpt}</p>
          ) : null}
        </header>

        {post.image ? (
          <div className={`${MEDIDA} relative mt-bloque aspect-3/2 overflow-hidden rounded-image bg-bone`}>
            <Image
              src={post.image}
              alt={post.imageAlt}
              fill
              preload
              sizes="(min-width: 768px) 672px, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}

        <div className="prose-post mt-bloque" dangerouslySetInnerHTML={{ __html: post.html }} />

        <div className={`${MEDIDA} mt-bloque border-t border-fog pt-6`}>
          <ArrowLink href="/blog">Back to all stories</ArrowLink>
        </div>
      </Section>

      <FindUs />
    </>
  );
}
