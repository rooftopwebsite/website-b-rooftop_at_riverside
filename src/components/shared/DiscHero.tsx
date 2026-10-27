import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Crumb } from '@/components/shared/PageHero';
import { PhotoPending } from '@/components/shared/PendingData';
import { Reveal } from '@/components/shared/Motion';
import { Eyebrow } from '@/components/shared/Type';

export default function DiscHero({
  eyebrow,
  title,
  lead,
  photo,
  photoAlt,
  photoBrief,
  crumbs,
  children,
}: {
  readonly eyebrow: string;
  readonly title: ReactNode;
  readonly lead: string;
  readonly photo: string | null;
  readonly photoAlt: string | null;
  readonly photoBrief: string;
  readonly crumbs: readonly Crumb[];
  readonly children?: ReactNode;
}) {
  return (
    <section aria-labelledby="page-title" className="relative overflow-hidden bg-paper grain pb-closing pt-8 lg:pt-11">
      <div className="page-box-wide relative">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="m-0 flex list-none flex-wrap items-center gap-x-2 gap-y-0.5 p-0 font-body text-caption text-muted">
            <li>
              <Link href="/" className="link-text">
                Home
              </Link>
            </li>
            {crumbs.map((c, i) => (
              <li key={c.path} className="flex items-center gap-2">
                <span aria-hidden="true">/</span>
                {i === crumbs.length - 1 ? (
                  <span aria-current="page" className="text-body/80">
                    {c.name}
                  </span>
                ) : (
                  <Link href={c.path} className="link-text">
                    {c.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <Reveal>
          <div className="relative flex flex-col items-center text-center">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-24 z-0 aspect-square w-[122%] max-w-[46rem] -translate-x-1/2 rounded-[50%] bg-cream grain sm:top-28 lg:top-36"
            />
            <div className="relative z-10 flex flex-col items-center">
              <Eyebrow tone="deep">{eyebrow}</Eyebrow>
              <h1
                id="page-title"
                className="m-0 mt-3.5 text-balance font-display font-extrabold uppercase text-ink"
              >
                {title}
              </h1>
              <div className="mt-7 w-full max-w-[34rem]">
                {photo ? (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-frame bg-fog card-shadow">
                    <Image
                      src={photo}
                      alt={photoAlt ?? ''}
                      fill
                      preload
                      sizes="(min-width: 1024px) 544px, 92vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <PhotoPending brief={photoBrief} ratio="aspect-[4/3]" />
                )}
              </div>
              <p className="m-0 mt-8 max-w-[34ch] font-display text-d4 font-bold uppercase leading-[1.04] text-ink lg:text-d3">
                {lead}
              </p>

              {children ? <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div> : null}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
