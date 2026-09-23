import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import FeaturedPost from '@/components/blog/FeaturedPost';
import PostCard from '@/components/blog/PostCard';
import FindUs from '@/components/sections/FindUs';
import { Reveal, RevealItem, StaggerGroup } from '@/components/shared/Motion';
import PlateHero from '@/components/shared/PlateHero';
import Section from '@/components/shared/Section';
import SoftWave from '@/components/shared/SoftWave';
import { SectionHead } from '@/components/shared/Type';
import { getPosts } from '@/lib/blog';
import { splitFeatured } from '@/lib/blog-format';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

/** El feed se relee cada 10 minutos, igual que su fetch en `lib/blog.ts`. */
export const revalidate = 600;

export const metadata: Metadata = pageMeta({
  route: '/blog',
  image: {
    url: '/images/venue/front-night-wide.webp',
    width: 2048,
    height: 1084,
    alt: 'The corner of Rooftop at Riverside on Old US 41 at night, with orange umbrellas along the rooftop terrace and people at the patio tables below',
  },
});

/**
 * `/blog` — el listado de notas, del feed del dashboard.
 *
 * Abre con `PlateHero` como toda interna (placa, esquinas inversas, palabra en
 * color). La NOTA no: ver `blog/[slug]/page.tsx`.
 *
 * Ritmo de superficies: hero en `bone` · ola · notas en `mint` · `FindUs` en
 * `bone` con su arco.
 *
 * ⚠️ SIN NOTAS, 404. Camila, 2026-09-23: «ocultemos todo lo de blog hasta que
 * haya al menos una nota». Antes había un estado vacío («Stories are on their
 * way»); se fue con esa decisión, junto con los links del Header y el Footer y
 * la línea del sitemap. Ver `sinBlog` en `nav.ts`. Si el feed no contesta
 * también da 404, igual que se esconden los links: el blog entero aparece y
 * desaparece junto.
 *
 * ⚠️ SIN MIGAS VISIBLES. Camila, 2026-09-23, sobre «Home / Blog» encima de la
 * pregunta: «no quiero que esté nunca». Por eso el titular dice BLOG: es el
 * hero el que avisa dónde estás. El `BreadcrumbList` del schema se queda.
 */
export default async function BlogPage() {
  const posts = await getPosts();
  const { featured, rest } = splitFeatured(posts);
  if (!featured) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd([{ name: 'Blog', path: '/blog' }])) }}
      />

      <PlateHero
        question="What is going on at the rooftop in Bonita Springs?"
        title={'The Rooftop '}
        titleAccent="Blog"
        photo="/images/venue/front-night-wide.webp"
        photoAlt="The corner of Rooftop at Riverside on Old US 41 at night, with orange umbrellas along the rooftop terrace and people at the patio tables below"
      />

      {/*
        ⚠️ EL CAMBIO DE FONDO VA CON LA OLA, como en `/sunset-bar` y `/market`.
        Camila, 2026-09-23: «agregá olas para el cambio de fondos, así no queda
        tan básico». La banda es MENTA porque es la que va detrás de las cards,
        igual que en `/food-trucks` («el C4F2EC lo quiero detrás de las cards»).
        Después entra `FindUs` con su arco de hueso.
      */}
      <SoftWave from="bone" to="mint" className="relative -mb-px" />

      <Section tone="mint" bandTop="sm" bandBottom="lg" label="Stories">
        <Reveal>
          <FeaturedPost post={featured} />
        </Reveal>

        {rest.length > 0 ? (
          <div className="mt-cierre">
            <SectionHead title="More stories" id="more-stories" level={2} />
            <StaggerGroup className="mt-bloque grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <RevealItem key={post.slug}>
                  <PostCard post={post} />
                </RevealItem>
              ))}
            </StaggerGroup>
          </div>
        ) : null}
      </Section>

      <FindUs />
    </>
  );
}
