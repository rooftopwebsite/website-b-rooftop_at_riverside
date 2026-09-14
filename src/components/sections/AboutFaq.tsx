/**
 * Las preguntas frecuentes, como sección de About.
 *
 * ⚠️ ERA LA PÁGINA `/faq`. Camila: «about y dentro las preguntas, no una pág
 * de preguntas». Una página de FAQ es un destino al que nadie va por su
 * cuenta: se llega buscando UNA respuesta concreta —si se puede llevar el
 * perro, dónde se estaciona— y esas respuestas cierran el mismo relato que
 * cuenta About.
 *
 * ⚠️ EL `FAQPage` DE JSON-LD SE MANTIENE y ahora vive en `/our-story`. Es el
 * dato estructurado que le permite a Google mostrar las preguntas como
 * resultado desplegable, y perderlo habría sido el único costo real de sacar
 * la página. Está en el `page.tsx` de About, no acá.
 *
 * ⚠️ EL `id="faq"` ES EL DESTINO DEL REDIRECT 301 de `/faq`.
 */
import { ButtonLink } from '@/components/shared/Button';
import Section from '@/components/shared/Section';
import { Heading, SectionHead } from '@/components/shared/Type';
import { FAQ_GROUPS, FAQS } from '@/content/faq';
import { BRAND } from '@/lib/brand';


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
export default function AboutFaq() {
  return (
    <div id="faq" className="scroll-mt-24">
      {/*
        El encabezado pasa de `PageHero` a `SectionHead`: ya no abre una
        página, abre una sección dentro de About.
      */}
      <Section band="lg" bandBottom="none">
        <SectionHead
          eyebrow="Questions"
          eyebrowTone="deep"
          id="faq-title"
          title="How this place works"
          lead="Mostly one question in different shapes: how does this place actually work?"
        />
      </Section>

      <Section bandTop="none" band="lg" width="prose" labelledBy="faq-title">
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
    </div>
  );
}
