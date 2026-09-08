import type { Metadata } from 'next';
import { ButtonLink } from '@/components/shared/Button';
import OpenStatus from '@/components/shared/OpenStatus';
import PageHero from '@/components/shared/PageHero';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading, SectionHead } from '@/components/shared/Type';
import { BRAND, addressLine, mapsUrl } from '@/lib/brand';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  route: "/contact",
});

/**
 * /contact
 *
 * ⚠️ Sin formulario genérico. Cada consulta va al buzón que la resuelve: un
 * formulario de contacto sin destinatario claro es un agujero donde caen
 * consultas de eventos —que valen entre $10.000 y $30.000— mezcladas con
 * preguntas sobre estacionamiento.
 *
 * El único formulario del sitio es el de `/events/inquire`, que sí tiene un
 * flujo detrás.
 */

const ROUTES = [
  {
    eyebrow: 'Private and corporate events',
    title: 'Booking the place',
    body: 'Buyouts, holiday parties, fundraisers and anything with a headcount. The request form gets you the events packet.',
    ctaLabel: 'Request a proposal',
    href: '/events/inquire',
    email: BRAND.contact.events,
    primary: true,
  },
  {
    eyebrow: 'Everything else',
    title: 'General questions',
    body: 'Hours, dogs, big groups on a Sunday, lost property, or anything the FAQ does not cover.',
    ctaLabel: 'Read the FAQ first',
    href: '/faq',
    email: BRAND.contact.email,
    primary: false,
  },
  {
    eyebrow: 'Working here',
    title: 'Jobs and bookings',
    body: 'Bar and floor staff, musicians looking for a slot, and food truck owners who want the yard.',
    ctaLabel: 'See how to join',
    href: '/join-us',
    email: BRAND.contact.hiring,
    primary: false,
  },
] as const;

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbJsonLd([{ name: 'Contact', path: '/contact' }])),
        }}
      />

      <PageHero
        eyebrow="Contact"
        title="Say hello"
        lead="Three inboxes, so your message lands with the person who can answer it instead of a shared one."
        crumbs={[{ name: 'Contact', path: '/contact' }]}
      >
        <div className="flex flex-col gap-[6px]">
          <OpenStatus which="bar" />
          <OpenStatus which="trucks" />
        </div>
      </PageHero>

      <Section band="lg" labelledBy="routes-title">
        <SectionHead
          eyebrow="Get in touch"
          eyebrowTone="deep"
          id="routes-title"
          title="Pick the right door"
        />

        <div className="mt-[48px] grid gap-[24px] lg:grid-cols-3">
          {ROUTES.map((r) => (
            <article
              key={r.title}
              className={[
                'flex flex-col rounded-card border p-[28px]',
                r.primary ? 'border-ink border-2 bg-cream' : 'border-ink/15',
              ].join(' ')}
            >
              <Eyebrow tone={r.primary ? 'terra' : 'deep'}>{r.eyebrow}</Eyebrow>
              <Heading level={2} role="card" className="mt-[8px]">
                {r.title}
              </Heading>
              <p className="mt-[10px] flex-1 text-[15px] leading-[1.65] text-body/75">{r.body}</p>

              <p className="mt-[18px] text-[15px]">
                <a href={`mailto:${r.email}`} className="link-texto break-all">
                  {r.email}
                </a>
              </p>

              <div className="mt-[18px]">
                <ButtonLink href={r.href} variant={r.primary ? 'primary' : 'secondary'}>
                  {r.ctaLabel}
                </ButtonLink>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* ── Datos duros ────────────────────────────────────────────────── */}
      <Section tone="cream" band="md" labelledBy="details-title">
        <Heading level={2} id="details-title" className="text-d5 lg:text-d4">
          The details
        </Heading>

        <dl className="mt-[28px] grid gap-[24px] sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="eyebrow text-body/60">Phone</dt>
            <dd className="mt-[8px] text-[15px]">
              <a href={BRAND.contact.phoneHref} className="link-texto">
                {BRAND.contact.phone}
              </a>
            </dd>
          </div>
          <div>
            <dt className="eyebrow text-body/60">Address</dt>
            <dd className="mt-[8px] text-[15px] leading-[1.55]">
              <a href={mapsUrl()} target="_blank" rel="noopener noreferrer" className="link-texto">
                {addressLine()}
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </dd>
          </div>
          <div>
            <dt className="eyebrow text-body/60">Instagram</dt>
            <dd className="mt-[8px] text-[15px]">
              <a
                href={BRAND.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="link-texto"
              >
                @rooftopatriverside
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </dd>
          </div>
          <div>
            <dt className="eyebrow text-body/60">Gift cards</dt>
            <dd className="mt-[8px] text-[15px]">
              <a
                href={BRAND.giftCards}
                target="_blank"
                rel="noopener noreferrer"
                className="link-texto"
              >
                Buy on Toast
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </dd>
          </div>
        </dl>

        <p className="mt-[28px] max-w-[62ch] text-[15px] leading-[1.65] text-body/70">
          We don&rsquo;t take table reservations and we don&rsquo;t deliver. For a group of eight or
          more on a weekend in season, message ahead and we&rsquo;ll do what we can.
        </p>
      </Section>
    </>
  );
}
