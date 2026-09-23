import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { PhotoPending } from './PendingData';
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
  imageBrief,
  crumbs,
  children,
}: {
  readonly eyebrow: string;
  readonly title: ReactNode;
  readonly lead?: ReactNode;
  readonly image?: string | null;
  readonly imageAlt?: string | null;
  /**
   * El brief EN ESPAÑOL de la foto que falta. Con `image` en `null` y esto con
   * texto, el hero reserva la MISMA caja y pinta el marcador gris en vez de
   * colapsar a un encabezado sin foto.
   *
   * ⚠️ Existe porque cuatro heroes traían fotos de STOCK. Entraron el
   * 2026-09-08, dos días antes de que el cliente entregara las suyas, y
   * dejarlas puestas era peor que mostrar el hueco: una foto de un camión que
   * no es el del cliente le miente al visitante y encima disimula que falta.
   */
  readonly imageBrief?: string | null;
  readonly crumbs?: readonly Crumb[];
  readonly children?: ReactNode;
}) {
  const hasImage = Boolean(image);
  const hasHueco = !hasImage && Boolean(imageBrief);
  /** Si hay foto o hay hueco, el hero va a dos columnas igual. */
  const dosColumnas = hasImage || hasHueco;

  return (
    <section aria-labelledby="page-title" className="relative">
      <div
        className={
          dosColumnas
            ? 'desk:grid desk:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] desk:items-stretch'
            : ''
        }
      >
        <div
          /* ⚠️ EL `pt` YA NO COMPENSA AL HEADER, y por eso bajó de 98/110/122
             a 34/46. Los tres escalones anteriores llevaban sumada la altura
             de un header `fixed` (64px hasta `desk`, 76 a partir de ahí)
             encima del aire propio del hero (34 base, 46 desde `lg`).

             Con el rediseño el header volvió al flujo normal y ocupa su
             lugar, así que sumarle la altura otra vez abría el doble de aire
             en las 22 internas. Quedan sólo los dos tramos del aire propio,
             y por eso desaparece el escalón de `desk`: era del header, no del
             hero. Ver la nota grande de `Header.tsx`. */
          className={`${GUTTER} flex flex-col justify-center pt-[34px] pb-[48px] lg:pt-[46px] lg:pb-[64px]`}
        >
          <div
            className={
              dosColumnas ? 'mx-auto w-full max-w-[640px] desk:mr-[56px] desk:ml-auto' : 'caja'
            }
          >
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
              preload
              sizes="(max-width: 1343px) 100vw, 46vw"
              className="object-cover"
            />
          </div>
        ) : null}

        {hasHueco ? (
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
