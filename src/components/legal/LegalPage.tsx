import Link from 'next/link';
import type { ReactNode } from 'react';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading } from '@/components/shared/Type';
import { LEGAL_DOCS, type LegalBlock, type LegalDoc } from '@/content/legal-docs';

function Body({ blocks }: { readonly blocks: readonly LegalBlock[] }) {
  return (
    <div className="prose-legal">
      {blocks.map((b, i) => {
        switch (b.kind) {
          case 'heading':
            return <h2 key={i}>{b.text}</h2>;

          case 'notice':
            return (
              <p key={i} className="notice">
                {b.text}
              </p>
            );

          case 'paragraph':
            return <p key={i}>{b.text}</p>;

          case 'clause':
            return (
              <div key={i}>
                <h3>{b.label}</h3>
                {b.body.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            );

          case 'list':
            return b.order === 'letters' ? (
              <ol key={i} className="letters">
                {b.items.map((it, j) => (
                  <li key={j}>{it.text}</li>
                ))}
              </ol>
            ) : (
              <ul key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>
                    {it.label ? <strong>{it.label}:</strong> : null} {it.text}
                  </li>
                ))}
              </ul>
            );
        }
      })}
    </div>
  );
}

export default function LegalPage({
  title,
  accent,
  eyebrow,
  lastUpdated,
  currentHref,
  intro,
  blocks,
  docs = LEGAL_DOCS,
}: {
  readonly title: string;
  readonly accent: string;
  readonly eyebrow: string;
  readonly lastUpdated?: string;
  readonly currentHref: string;
  readonly intro?: ReactNode;
  readonly blocks: readonly LegalBlock[];
  readonly docs?: readonly LegalDoc[];
}) {
  const formattedDate = lastUpdated
    ? new Date(`${lastUpdated}T00:00:00`).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const others = docs.filter((d) => d.href !== currentHref);

  return (
    <>
      <Section tone="bone" band="md" labelledBy="page-title">
        <Eyebrow tone="deep">{eyebrow}</Eyebrow>
        <Heading level={1} id="page-title" className="mt-gap-kicker max-w-[20ch]">
          {title} <span className="text-sunset-deep">{accent}</span>
        </Heading>
        {intro ? (
          <p className="mt-gap-subhead max-w-[62ch] text-lead subhead">{intro}</p>
        ) : null}
      </Section>

      <Section band="lg">
        <article className="mx-auto max-w-[900px] rounded-frame bg-bone grain px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <p className="eyebrow text-muted">
            {lastUpdated && formattedDate ? (
              <>
                Last updated &middot; <time dateTime={lastUpdated}>{formattedDate}</time>
              </>
            ) : (
              <>Draft &middot; awaiting the final text</>
            )}
          </p>

          <hr className="mt-6 mb-9 h-px w-full border-0 bg-ink/15" />

          <Body blocks={blocks} />
          <nav
            aria-label="The other documents"
            className="mt-12 flex flex-col items-start gap-y-2 border-t border-ink/15 pt-7 md:flex-row md:flex-wrap md:items-center md:gap-x-3"
          >
            <span className="eyebrow text-muted">Also read</span>
            {others.map((d, i) => (
              <span key={d.href} className="flex items-center gap-3">
                {i > 0 ? (
                  <span aria-hidden="true" className="hidden h-3 w-px bg-ink/20 md:block" />
                ) : null}
                <Link href={d.href} className="link-text font-body text-base font-semibold">
                  {d.label}
                </Link>
              </span>
            ))}
          </nav>
        </article>
      </Section>
    </>
  );
}
