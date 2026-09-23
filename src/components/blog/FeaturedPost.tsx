import Image from 'next/image';
import Link from 'next/link';
import { postMeta, type Post } from '@/lib/blog-format';

export default function FeaturedPost({ post }: { readonly post: Post }) {
  return (
    <article className="group relative grid overflow-hidden rounded-shell bg-paper sombra-card transition-[transform,box-shadow] duration-200 ease-brand hover:-translate-y-0.5 hover:shadow-float md:grid-cols-2">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-3.5 z-10 rounded-shell border border-dashed border-deep/35"
      />

      <div className="p-7 max-md:pb-0 md:pr-0 lg:p-12 lg:pr-0">
        <div className="relative aspect-3/2 w-full overflow-hidden rounded-ticket bg-fog md:aspect-auto md:h-full md:min-h-72">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.imageAlt}
              fill
              sizes="(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 ease-brand group-hover:scale-104"
            />
          ) : (
            <div
              aria-hidden="true"
              className="grano flex h-full items-center justify-center bg-bone font-display text-d3 font-semibold uppercase text-deep/35"
            >
              Rooftop
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col justify-center gap-4 p-7 lg:p-12">
        <p className="eyebrow m-0 text-terra">
          <span className="max-md:hidden">Latest story · </span>
          {postMeta(post)}
        </p>
        <h2 className="m-0 font-display text-d4 font-semibold uppercase leading-[0.98] text-ink transition-colors duration-200 group-hover:text-deep lg:text-d3">
          <Link
            href={`/blog/${post.slug}`}
            className="after:absolute after:inset-0 after:z-20 after:rounded-shell after:content-['']"
          >
            {post.title}
          </Link>
        </h2>
        {post.excerpt ? (
          <p className="m-0 max-w-[46ch] font-body text-lead font-light text-body">{post.excerpt}</p>
        ) : null}
        <span
          aria-hidden="true"
          className="mt-2 inline-flex items-center gap-2 text-caption font-bold uppercase tracking-eyebrow"
        >
          <span className="underline decoration-ink/45 decoration-1 underline-offset-4 transition-[text-decoration-color] group-hover:decoration-sunset group-hover:decoration-2">
            Read the story
          </span>
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none" className="transition-transform duration-200 group-hover:translate-x-1">
            <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </article>
  );
}
