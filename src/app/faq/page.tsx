import type { Metadata } from 'next';
import { ButtonLink } from '@/components/shared/Button';
import PageHero from '@/components/shared/PageHero';
import Section from '@/components/shared/Section';
import { Heading } from '@/components/shared/Type';
import { FAQ_GROUPS, FAQS } from '@/content/faq';
import { BRAND } from '@/lib/brand';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  route: "/faq",
});

/** `FAQPage` en JSON-LD, requisito de la Fase 3. */
function faqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

/**
 * /faq
 *
 * ⚠️ Se usa `<details>`/`<summary>` nativo y NO un acordeón hecho a mano con
 * JavaScript. Sale gratis en accesibilidad —teclado, roles, estado abierto y
 * cerrado, y el buscador del navegador encuentra el texto adentro— y no cuesta
 * un solo kilobyte de JS. Un acordeón custom sólo tendría sentido si hiciera
 * falta animar la altura, y no hace falta.
 */
export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(faqJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbJsonLd([{ name: 'FAQ', path: '/faq' }])),
        }}
      />

      <PageHero
        eyebrow="Questions"
        title="How this place works"
        lead="Mostly one question in different shapes: how does this place actually work?"
        crumbs={[{ name: 'FAQ', path: '/faq' }]}
      />

      <Section band="lg" width="prose">
        {FAQ_GROUPS.map((group) => (
          <section key={group} className="mb-[48px] last:mb-0" aria-labelledby={`faq-${group}`}>
            <Heading level={2} id={`faq-${group}`} role="label" className="text-d5">
              {group}
            </Heading>
            <span aria-hidden="true" className="mt-[10px] block h-[2px] w-[36px] bg-river" />

            <div className="mt-[16px]">
              {FAQS.filter((f) => f.group === group).map((f) => (
                <details
                  key={f.q}
                  className="group border-b border-ink/12 py-[4px] [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-[20px] py-[16px] font-body text-[17px] font-bold">
                    {f.q}
                    <span
                      aria-hidden="true"
                      className="mt-[4px] grid h-[22px] w-[22px] shrink-0 place-items-center rounded-pill border border-ink/25 transition-transform duration-250 group-open:rotate-45"
                    >
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </span>
                  </summary>
                  <p className="pb-[18px] pr-[42px] text-[16px] leading-[1.7] text-body/80">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </Section>

      <Section tone="cream" band="md">
        <div className="flex flex-col items-start gap-[20px] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Heading level={2} className="text-d5 lg:text-d4">
              Still stuck?
            </Heading>
            <p className="mt-[8px] text-[16px] text-body/75">
              Call{' '}
              <a href={BRAND.contact.phoneHref} className="link-texto">
                {BRAND.contact.phone}
              </a>{' '}
              or send a note.
            </p>
          </div>
          <ButtonLink href="/contact" variant="primary">
            Contact us
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
