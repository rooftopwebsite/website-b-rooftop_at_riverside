import Link from 'next/link';
import type { ReactNode } from 'react';
import Section from '@/components/shared/Section';
import { Eyebrow, Heading } from '@/components/shared/Type';
import { LEGAL_DOCS, type LegalBlock, type LegalDoc } from '@/content/legal-docs';

function Cuerpo({ blocks }: { readonly blocks: readonly LegalBlock[] }) {
  return (
    <div className="prose-legal">
      {blocks.map((b, i) => {
        switch (b.kind) {
          case 'titulo':
            return <h2 key={i}>{b.text}</h2>;

          case 'aviso':
            return (
              <p key={i} className="aviso">
                {b.text}
              </p>
            );

          case 'parrafo':
            return <p key={i}>{b.text}</p>;

          case 'clausula':
            return (
              <div key={i}>
                <h3>{b.rotulo}</h3>
                {b.cuerpo.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            );

          case 'lista':
            return b.orden === 'letras' ? (
              <ol key={i} className="letras">
                {b.items.map((it, j) => (
                  <li key={j}>{it.texto}</li>
                ))}
              </ol>
            ) : (
              <ul key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>
                    {it.rotulo ? <strong>{it.rotulo}:</strong> : null} {it.texto}
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
  const fecha = lastUpdated
    ? new Date(`${lastUpdated}T00:00:00`).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const otros = docs.filter((d) => d.href !== currentHref);

  return (
    <>
      <Section tone="bone" band="md" labelledBy="page-title">
        <Eyebrow tone="deep">{eyebrow}</Eyebrow>
        <Heading level={1} id="page-title" className="mt-gap-kicker max-w-[20ch]">
          {title} <span className="text-sunset-deep">{accent}</span>
        </Heading>
        {intro ? (
          <p className="mt-gap-bajada max-w-[62ch] text-lead bajada">{intro}</p>
        ) : null}
      </Section>

      <Section band="lg">
        <article className="mx-auto max-w-[900px] rounded-frame bg-bone grano px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <p className="eyebrow text-muted">
            {lastUpdated && fecha ? (
              <>
                Last updated &middot; <time dateTime={lastUpdated}>{fecha}</time>
              </>
            ) : (
              <>Draft &middot; awaiting the final text</>
            )}
          </p>

          <hr className="mt-6 mb-9 h-px w-full border-0 bg-ink/15" />

          <Cuerpo blocks={blocks} />
          <nav
            aria-label="The other documents"
            className="mt-12 flex flex-col items-start gap-y-2 border-t border-ink/15 pt-7 md:flex-row md:flex-wrap md:items-center md:gap-x-3"
          >
            <span className="eyebrow text-muted">Also read</span>
            {otros.map((d, i) => (
              <span key={d.href} className="flex items-center gap-3">
                {i > 0 ? (
                  <span aria-hidden="true" className="hidden h-3 w-px bg-ink/20 md:block" />
                ) : null}
                <Link href={d.href} className="link-texto font-body text-base font-semibold">
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
