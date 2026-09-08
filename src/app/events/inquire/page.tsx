import type { Metadata } from 'next';
import InquiryForm from '@/components/sections/InquiryForm';
import PageHero from '@/components/shared/PageHero';
import { PendingBlock } from '@/components/shared/PendingData';
import Section from '@/components/shared/Section';
import { Eyebrow } from '@/components/shared/Type';
import { BRAND } from '@/lib/brand';
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Request a Proposal',
  description:
    'Tell us the date and the headcount and we will come back within one business day with the events packet for Rooftop at Riverside in Bonita Springs.',
  path: '/events/inquire',
});

/** /events/inquire — formulario de UNA PANTALLA, sin pasos. */
export default function InquirePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            breadcrumbJsonLd([
              { name: 'Events', path: '/events' },
              { name: 'Request a proposal', path: '/events/inquire' },
            ]),
          ),
        }}
      />

      <PageHero
        eyebrow="Request a proposal"
        title="Tell us about your night"
        lead="One screen. We come back within one business day with the events packet and a hold on your date."
        crumbs={[
          { name: 'Events', path: '/events' },
          { name: 'Request a proposal', path: '/events/inquire' },
        ]}
      />

      <Section band="lg" width="prose">
        <InquiryForm />

        <div className="mt-[40px]">
          <PendingBlock title="Events packet PDF">
            The brief calls for the events packet to be delivered the moment the form is sent. The
            PDF doesn&rsquo;t exist yet, so right now the confirmation says it comes attached to the
            reply. Send the file and it becomes an instant download.
          </PendingBlock>
        </div>

        <div className="mt-[32px] border-t border-ink/15 pt-[24px]">
          <Eyebrow tone="deep">Rather just email?</Eyebrow>
          <p className="mt-[8px] text-[15px] leading-[1.65] text-body/75">
            <a href={`mailto:${BRAND.contact.events}`} className="link-texto">
              {BRAND.contact.events}
            </a>{' '}
            or{' '}
            <a href={BRAND.contact.phoneHref} className="link-texto">
              {BRAND.contact.phone}
            </a>
            .
          </p>
        </div>
      </Section>
    </>
  );
}
