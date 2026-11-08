import type { Metadata } from 'next';
import NewsletterConfirm from '@/components/shared/NewsletterConfirm';
import { ButtonLink } from '@/components/shared/Button';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading } from '@/components/shared/Type';
import { checkNewsletterToken } from '@/lib/newsletter';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = {
  ...pageMeta({
    title: 'Confirm your subscription',
    description: 'Confirm your subscription to news and events from Rooftop at Riverside.',
    path: '/newsletter/confirm',
    noIndex: true,
  }),
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

export default async function NewsletterConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const raw = (await searchParams).token;
  const token = typeof raw === 'string' ? raw : '';
  const check = token ? checkNewsletterToken(token) : null;
  const valid = check?.ok === true;
  const expired = check?.ok === false && check.reason === 'expired';

  return (
    <Section tone="bone" band="lg" labelledBy="page-title" className="min-h-[28rem]">
      <Eyebrow tone="deep">Newsletter</Eyebrow>
      <Heading level={1} id="page-title" className="mt-gap-kicker max-w-[20ch]">
        {valid ? 'One last' : 'That link'}{' '}
        <span className="text-sunset-deep">{valid ? 'step' : expired ? 'expired' : "didn't work"}</span>
      </Heading>

      {valid ? (
        <>
          <p className="mt-gap-subhead max-w-[62ch] text-lead subhead">
            Hi {check.claims.firstName}. Press the button to confirm and start getting news and events
            from Rooftop at Riverside. You can unsubscribe at any time.
          </p>
          <NewsletterConfirm token={token} />
        </>
      ) : (
        <>
          <p className="mt-gap-subhead max-w-[62ch] text-lead subhead">
            {expired
              ? 'Confirmation links work for 24 hours. Sign up again from the bottom of any page and we will send you a fresh one.'
              : 'This confirmation link is not valid. Sign up again from the bottom of any page and we will send you a fresh one.'}
          </p>
          <div className="mt-gap-cta">
            <ButtonLink href="/" variant="primary" size="lg">
              Back to the home page
            </ButtonLink>
          </div>
        </>
      )}
    </Section>
  );
}
