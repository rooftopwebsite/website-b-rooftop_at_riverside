import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLink, ButtonLink, ExternalIcon } from '@/components/shared/Button';
import PageHero from '@/components/shared/PageHero';
import { PendingBlock, PhotoPending } from '@/components/shared/PendingData';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading } from '@/components/shared/Type';
import { activeTrucks, truckBySlug } from '@/content/trucks';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

/**
 * /food-trucks/[slug] — UN SOLO TEMPLATE para todos los trucks.
 *
 * Nada hecho a mano por truck. Se agrega o se saca uno editando
 * `content/trucks.ts`, y al sacarlo el 301 a /food-trucks se genera solo
 * (ver `next.config.ts`).
 *
 * ⚠️ Sin precios. Los precios son del vendor, no del venue.
 * ⚠️ Sin rotación. Qué truck está hoy vive en el home y en /whats-on.
 */

export function generateStaticParams() {
  return activeTrucks().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const truck = truckBySlug(slug);
  if (!truck) return {};

  return pageMeta({
    title: `${truck.name} — ${truck.cuisine} Food Truck`,
    description:
      truck.story ??
      `${truck.name} serves ${truck.specialty.toLowerCase()} in the yard at Rooftop at Riverside in Bonita Springs.`,
    path: `/food-trucks/${truck.slug}`,
    ...(truck.photo
      ? {
          image: {
            url: truck.photo,
            width: 1600,
            height: 1200,
            alt: truck.photoAlt ?? truck.name,
          },
        }
      : {}),
  });
}

export default async function TruckPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const truck = truckBySlug(slug);

  // Un truck inactivo nunca llega acá: lo agarra el 301 de next.config.ts.
  if (!truck || !truck.active) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            breadcrumbJsonLd([
              { name: 'Food Trucks', path: '/food-trucks' },
              { name: truck.name, path: `/food-trucks/${truck.slug}` },
            ]),
          ),
        }}
      />

      <PageHero
        eyebrow={truck.cuisine}
        title={truck.name}
        lead={truck.specialty}
        image={truck.photo}
        imageAlt={truck.photoAlt}
        crumbs={[
          { name: 'Food Trucks', path: '/food-trucks' },
          { name: truck.name, path: `/food-trucks/${truck.slug}` },
        ]}
      >
        <div className="flex flex-wrap items-center gap-[12px]">
          {truck.instagram ? (
            <ButtonLink href={truck.instagram} variant="secondary" external>
              Follow on Instagram
            </ButtonLink>
          ) : null}
          <ButtonLink href="/whats-on" variant="primary">
            See when they&rsquo;re in
          </ButtonLink>
        </div>
      </PageHero>

      {/* Sin foto: el placeholder ocupa el lugar del panel del hero. */}
      {!truck.photo ? (
        <Section band="none" className="pb-[40px]">
          <PhotoPending brief={truck.photoBrief} ratio="aspect-[21/9]" />
        </Section>
      ) : null}

      <Section band="lg">
        <div className="grid gap-[40px] lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-[64px]">
          {/* ── Historia ─────────────────────────────────────────────── */}
          <div>
            <Eyebrow tone="plum">The truck</Eyebrow>
            <Heading level={2} className="mt-gap-kicker text-d5 lg:text-d4">
              Who they are
            </Heading>

            {truck.story ? (
              <p className="mt-gap-bajada max-w-[62ch] text-lead leading-[1.7] text-body/85">
                {truck.story}
              </p>
            ) : (
              <div className="mt-gap-bajada">
                <PendingBlock title="Truck bio">
                  We don&rsquo;t have {truck.name}&rsquo;s story yet. Two or three sentences from
                  the owner — who they are, where they came from, what they&rsquo;re known for.
                  It has to come from them: nothing on this site is written by AI.
                </PendingBlock>
              </div>
            )}

            {truck.gallery.length > 0 ? (
              <ul className="mt-[32px] grid gap-[16px] sm:grid-cols-2">
                {truck.gallery.map((g) => (
                  <li key={g.src} className="relative aspect-[4/3] overflow-hidden rounded-card">
                    <Image
                      src={g.src}
                      alt={g.alt}
                      fill
                      sizes="(max-width: 639px) 100vw, 40vw"
                      className="object-cover"
                    />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* ── Ficha ────────────────────────────────────────────────── */}
          <aside className="lg:sticky lg:top-[110px] lg:self-start">
            <dl className="flex flex-col divide-y divide-ink/12 rounded-card border border-ink/12 px-[24px]">
              <div className="py-[18px]">
                <dt className="eyebrow text-body/60">Cuisine</dt>
                <dd className="mt-[6px] font-display text-d6 uppercase">{truck.cuisine}</dd>
              </div>
              <div className="py-[18px]">
                <dt className="eyebrow text-body/60">Known for</dt>
                <dd className="mt-[6px] text-[15px] leading-[1.6]">{truck.specialty}</dd>
              </div>
              <div className="py-[18px]">
                <dt className="eyebrow text-body/60">When they&rsquo;re here</dt>
                <dd className="mt-[6px] text-[15px] leading-[1.6]">
                  {truck.schedule ?? (
                    <>
                      The roster rotates.{' '}
                      <ArrowLink href="/whats-on" className="text-[13px]">
                        Check the calendar
                      </ArrowLink>
                    </>
                  )}
                </dd>
              </div>
              <div className="py-[18px]">
                <dt className="eyebrow text-body/60">Instagram</dt>
                <dd className="mt-[6px] text-[15px]">
                  {truck.instagram ? (
                    <a
                      href={truck.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-texto inline-flex items-center gap-[6px]"
                    >
                      Follow them
                      <ExternalIcon />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  ) : (
                    <span className="text-body/60">Not on file yet.</span>
                  )}
                </dd>
              </div>
            </dl>

            <p className="mt-[18px] text-[14px] leading-[1.6] text-body/65">
              {truck.name} takes its own orders and its own payment. Drinks come from the Sunset Bar
              upstairs.
            </p>
          </aside>
        </div>
      </Section>

      <Section tone="cream" band="md">
        <div className="flex flex-col items-start gap-[20px] sm:flex-row sm:items-center sm:justify-between">
          <Heading level={2} className="text-d5 lg:text-d4">
            See the rest of the yard
          </Heading>
          <div className="flex flex-wrap gap-[12px]">
            <ButtonLink href="/food-trucks" variant="secondary">
              All food trucks
            </ButtonLink>
            <ButtonLink href="/sunset-bar" variant="primary">
              Sunset Bar menu
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
