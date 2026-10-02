import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Crumb } from '@/components/shared/PageHero';
import { PhotoPending } from '@/components/shared/PendingData';

const RATIO_MOVIL = {
  portrait: 'aspect-[4/5]',
  landscape: 'aspect-[3/2]',
} as const;

export default function PlateHero({
  question,
  title,
  titleAccent,
  titleId = 'page-title',
  lead,
  photo = null,
  photoMobileRatio = 'portrait',
  photoMobile = null,
  photoMobileAlt,
  photoKeepFaces = false,
  photoAlt,
  photoBrief,
  crumbs,
  children,
}: {
  readonly question: string;
  readonly title: ReactNode;
  readonly titleAccent: ReactNode;
  readonly titleId?: string;
  readonly lead?: ReactNode;
  readonly photo?: string | null;
  readonly photoMobileRatio?: keyof typeof RATIO_MOVIL;
  readonly photoMobile?: string | null;
  readonly photoMobileAlt?: string | null;
  readonly photoKeepFaces?: boolean;
  readonly photoAlt?: string | null;
  readonly photoBrief?: string | null;
  readonly crumbs?: readonly Crumb[];
  readonly children?: ReactNode;
}) {
  return (
    <section
      aria-labelledby={titleId}
      className="bg-bone grano pt-[34px] pb-[48px] lg:pt-[46px] lg:pb-[64px]"
    >
      <div className={photoKeepFaces ? 'caja-ancha @container' : 'caja-ancha'}>
        {crumbs && crumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="mb-[20px]">
            <ol className="flex flex-wrap items-center gap-x-[8px] gap-y-[2px] text-[13px] text-body/75">
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

        <p className="mx-auto max-w-[40ch] text-center font-body text-intro font-light text-body/85">
          {question}
        </p>
        <h1
          id={titleId}
          className="relative z-10 mx-auto mt-5 mb-[-0.94em] text-center font-display text-banda font-extrabold uppercase text-ink lg:mt-7"
        >
          <span className="block">{title}</span>
          <span className="relative mx-auto block w-fit max-w-[calc(100%-4*var(--radius-frame))] text-balance rounded-b-frame bg-bone grano px-[0.3em] pb-[0.12em] text-sunset-deep">
            {titleAccent}

              <span
              aria-hidden="true"
              className="esquina-inversa top-[calc(100%-0.94em)] left-full"
            />
            <span
              aria-hidden="true"
              className="esquina-inversa top-[calc(100%-0.94em)] right-full scale-x-[-1]"
            />
          </span>
        </h1>
        <div
          className={[
            'relative w-full overflow-hidden rounded-frame',
            RATIO_MOVIL[photoMobileRatio],
            photo ? 'bg-fog' : '',
            'sm:aspect-[4/3] md:aspect-[16/9] lg:aspect-[17/9] lg:max-h-[calc(100svh-378px)]',
            photoKeepFaces ? 'lg:min-h-[56.25cqw]' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {photo && photoMobile ? (
            <>
              <Image
                src={photoMobile}
                alt={photoMobileAlt ?? photoAlt ?? ''}
                fill
                preload
                sizes="(min-width: 640px) 1px, 100vw"
                className="object-cover sm:hidden"
              />
              <Image
                src={photo}
                alt={photoAlt ?? ''}
                fill
                preload
                sizes="(min-width: 1400px) 1288px, (min-width: 640px) 100vw, 1px"
                className="object-cover max-sm:hidden"
              />
            </>
          ) : photo ? (
            <Image
              src={photo}
              alt={photoAlt ?? ''}
              fill
              preload
              sizes="(min-width: 1400px) 1288px, 100vw"
              className="object-cover"
            />
          ) : (
            <PhotoPending
              brief={photoBrief ?? 'Falta definir qué foto va acá.'}
              ratio=""
              className="absolute inset-0 h-full rounded-none border-0"
            />
          )}
        </div>

        {lead ? (
          <p className="mx-auto mt-8 max-w-[62ch] text-center text-lead text-body/80 lg:mt-10">
            {lead}
          </p>
        ) : null}

        {children ? (
          <div className="mt-gap-cta flex flex-wrap items-center justify-center gap-3.5">
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}
