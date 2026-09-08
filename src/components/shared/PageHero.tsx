import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { GUTTER } from './Section';
import { Eyebrow, Heading } from './Type';
import { TileMark } from './TilePattern';

/**
 * Encabezado de página interna.
 *
 * ⚠️ Mismo criterio que el hero del home: la tipografía va sobre BLANCO, nunca
 * encima de la foto. Cuando hay imagen va como panel al costado. El sitio es
 * blanco y el h1 tiene que dar 21:1 sin depender de un velo.
 */

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
  crumbs,
  children,
}: {
  readonly eyebrow: string;
  readonly title: ReactNode;
  readonly lead?: ReactNode;
  readonly image?: string | null;
  readonly imageAlt?: string | null;
  readonly crumbs?: readonly Crumb[];
  readonly children?: ReactNode;
}) {
  const hasImage = Boolean(image);

  return (
    <section aria-labelledby="page-title" className="relative">
      <div
        className={
          hasImage
            ? 'desk:grid desk:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] desk:items-stretch'
            : ''
        }
      >
        <div
          className={`${GUTTER} flex flex-col justify-center pt-[132px] pb-[48px] lg:pt-[156px] lg:pb-[64px]`}
        >
          <div className={hasImage ? 'mx-auto w-full max-w-[640px] desk:mr-[56px] desk:ml-auto' : 'caja'}>
            {crumbs && crumbs.length > 0 ? (
              <nav aria-label="Breadcrumb" className="mb-[20px]">
                <ol className="flex flex-wrap items-center gap-x-[8px] gap-y-[2px] text-[13px] text-body/65">
                  <li>
                    <Link href="/" className="link-texto">
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
                        <Link href={c.path} className="link-texto">
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
              <p className="mt-gap-bajada max-w-[54ch] text-lead text-body/80">{lead}</p>
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
              priority
              sizes="(max-width: 1343px) 100vw, 46vw"
              className="object-cover"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
