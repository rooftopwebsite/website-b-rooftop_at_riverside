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

export const revalidate = 600;
/** Una nota publicada después del build se genera en su primer pedido. */
export const dynamicParams = true;

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
  /*
   * ⚠️ EL OG DE ARTÍCULO SE ARMA ACÁ Y NO EN `pageMeta`. `pageMeta` sólo sabe de
   * imágenes del propio sitio (les antepone `SITE_URL`) y de `type: 'website'`.
   * La portada de una nota es una URL absoluta del bucket, sin medidas.
   */
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
    // ⚠️ EL AUTOR ES LA CASA. El feed trae «Resto Experience», que es la
    // agencia, y en el sitio del cliente no va ni visible ni en el schema.
    author: casa,
    publisher: casa,
  };
}

/**
 * El ancho de lectura de la nota, y ⚠️ ES UNO SOLO para la portada, el cuerpo y
 * el cierre. Camila, 2026-09-23, marcando la foto con un recuadro del ancho del
 * texto: «la imagen más chica, con máximo el ancho del texto». 42rem son unos
 * 70 caracteres de Jost a 18px. `.prose-post` usa el mismo número.
 */
const MEDIDA = 'mx-auto w-full max-w-[42rem]';

/**
 * `/blog/[slug]` — el template de una nota.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ SIN PLACA Y SIN ESQUINAS INVERSAS, A PROPÓSITO. Camila, 2026-09-23: «para
 * cada nota pondremos la imagen y el título sin el juego de recorte, la usaremos
 * más común». Cabecera centrada sobre blanco, portada rectangular del ancho del
 * texto, cuerpo a medida de lectura.
 *
 * ⚠️ EL `h1` VA MONOCROMO, excepción explícita a la regla de la palabra en
 * color: el título viene del dashboard y no se puede elegir la palabra a mano.
 * Camila: «en blog pongamos monocromo».
 *
 * ⚠️ SIN MIGAS VISIBLES Y SIN «MORE STORIES» AL PIE, las dos sacadas por Camila
 * sobre la primera captura, el mismo día: «quitá lo que te marco» (las migas)
 * y «no pongamos al final el bloque que muestra otras notas». El
 * `BreadcrumbList` del schema se queda: no se ve y Google lo sigue leyendo.
 * La vuelta al listado es el «Back to all stories» del cierre.
 * ══════════════════════════════════════════════════════════════════════════
 */
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
              priority
              sizes="(min-width: 768px) 672px, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}

        {/* El HTML lo manda el dashboard ya sanitizado; el respaldo de
            markdown sale escapado de `markdownToHtml`. */}
        <div className="prose-post mt-bloque" dangerouslySetInnerHTML={{ __html: post.html }} />

        <div className={`${MEDIDA} mt-bloque border-t border-fog pt-6`}>
          <ArrowLink href="/blog">Back to all stories</ArrowLink>
        </div>
      </Section>

      <FindUs />
    </>
  );
}
