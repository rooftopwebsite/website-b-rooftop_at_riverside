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

export async function generateMetadata(): Promise<Metadata> {
  const hayNotas = (await getPosts()).length > 0;
  return pageMeta({
    route: '/blog',
    noIndex: !hayNotas,
    image: {
      url: '/images/venue/front-night-wide.webp',
      width: 2048,
      height: 1084,
      alt: 'The corner of Rooftop at Riverside on Old US 41 at night, with orange umbrellas along the rooftop terrace and people at the patio tables below',
    },
  });
}

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
