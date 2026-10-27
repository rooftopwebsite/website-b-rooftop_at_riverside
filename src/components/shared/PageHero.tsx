import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { PhotoPending } from './PendingData';
import { GUTTER } from './Section';
import { Eyebrow, Heading } from './Type';
import { TileMark } from './TilePattern';

export interface Crumb {
  readonly name: string;
  readonly path: string;
}

export default function PageHero({
  eyebrow,
  title,
  lead,
  image,
  imageAlt,
  imageBrief,
  crumbs,
  children,
}: {
  readonly eyebrow: string;
  readonly title: ReactNode;
  readonly lead?: ReactNode;
  readonly image?: string | null;
  readonly imageAlt?: string | null;
  readonly imageBrief?: string | null;
  readonly crumbs?: readonly Crumb[];
  readonly children?: ReactNode;
}) {
  const hasImage = Boolean(image);
  const hasGap = !hasImage && Boolean(imageBrief);
  const twoColumns = hasImage || hasGap;

  return (
    <section aria-labelledby="page-title" className="relative">
      <div
        className={
          twoColumns
            ? 'desk:grid desk:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] desk:items-stretch'
            : ''
        }
      >
        <div
          className={`${GUTTER} flex flex-col justify-center pt-[34px] pb-[48px] lg:pt-[46px] lg:pb-[64px]`}
        >
          <div
            className={
              twoColumns ? 'mx-auto w-full max-w-[640px] desk:mr-[56px] desk:ml-auto' : 'page-box'
            }
          >
            {crumbs && crumbs.length > 0 ? (
              <nav aria-label="Breadcrumb" className="mb-[20px]">
                <ol className="flex flex-wrap items-center gap-x-[8px] gap-y-[2px] text-[14px] text-body/75">
                  <li>
                    <Link href="/" className="link-text">
                      Home
                    </Link>
                  </li>
                  {crumbs.map((c, i) => (
                    <li key={c.path} className="flex items-center gap-[8px]">
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
            ) : null}

            <Eyebrow tone="deep" className="flex items-center gap-[12px]">
              <TileMark />
              {eyebrow}
            </Eyebrow>

            <Heading level={1} id="page-title" className="mt-gap-kicker text-ink">
              {title}
            </Heading>

            {lead ? (
              <p className="mt-gap-subhead max-w-[54ch] text-lead text-body/80">{lead}</p>
            ) : null}

            {children ? <div className="mt-gap-cta">{children}</div> : null}
          </div>
        </div>

        {hasImage ? (
          <div className="relative min-h-[280px] desk:min-h-[440px]">
            <Image
              src={image as string}
              alt={imageAlt ?? ''}
              fill
              preload
              sizes="(max-width: 1343px) 100vw, 46vw"
              className="object-cover"
            />
          </div>
        ) : null}

        {hasGap ? (
          <div className="flex items-stretch px-gutter pb-[32px] md:px-gutter-lg desk:min-h-[440px] desk:px-0 desk:pb-0">
            <PhotoPending
              brief={imageBrief as string}
              ratio="min-h-[260px] w-full desk:min-h-full"
              className="rounded-none"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
