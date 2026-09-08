import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { PhotoPending } from './PendingData';
import { Eyebrow, Heading } from './Type';

/**
 * La tarjeta con enlace: trucks, espacios y eventos usan ésta.
 *
 * ⚠️ El hover está definido en UN solo lugar y es deliberadamente MÍNIMO:
 *   · elevación de 2px (`-translate-y`) y el filo se oscurece
 *   · la imagen escala 1.03 — apenas, y sólo la imagen
 *   · el título pasa a `#014545`
 *
 * ⚠️ La superficie la define un FILO de 1px, no una sombra. Es la regla de la
 * referencia y es lo que mantiene la estética plana: la sombra sólo aparece en
 * lo que de verdad flota (el panel del hero, el mega-menú).
 *
 * Nada de parallax: el brief lo prohíbe sobre fotos de comida y de gente, que
 * es justo lo que hay en estas tarjetas.
 *
 * ⚠️ Todo el hover es CSS. Un hover con JS en una grilla de doce tarjetas monta
 * doce listeners y no aporta nada que el navegador no haga mejor.
 *
 * ⚠️ La transición del `transform` se apaga con reduced-motion desde la regla
 * global de globals.css, y el layout no cambia: la elevación es un transform,
 * no espacio reservado.
 */

export interface CardProps {
  readonly href: string;
  readonly title: string;
  readonly eyebrow?: string;
  readonly body?: string;
  readonly cta?: string;
  readonly photo?: string | null;
  readonly photoAlt?: string | null;
  /** Qué toma falta si no hay foto. Va dentro del placeholder gris. */
  readonly photoBrief?: string;
  readonly ratio?: string;
  readonly sizes?: string;
  /** Etiqueta arriba a la izquierda de la imagen, tipo «Ours». */
  readonly badge?: string;
  readonly className?: string;
  readonly children?: ReactNode;
}

export default function Card({
  href,
  title,
  eyebrow,
  body,
  cta = 'See more',
  photo,
  photoAlt,
  photoBrief,
  ratio = 'aspect-[4/3]',
  sizes = '(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw',
  badge,
  className = '',
  children,
}: CardProps) {
  return (
    <Link
      href={href}
      className={[
        'group flex h-full flex-col overflow-hidden rounded-card bg-paper',
        'ring-1 ring-fog',
        'transition-[transform,box-shadow] duration-200 ease-brand',
        'hover:-translate-y-[2px] hover:shadow-card',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {photo ? (
        <div className={`relative ${ratio} overflow-hidden bg-cream`}>
          <Image
            src={photo}
            alt={photoAlt ?? ''}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-500 ease-brand group-hover:scale-[1.03]"
          />
          {badge ? (
            <span className="absolute top-[12px] left-[12px] rounded-btn bg-sunset px-[10px] py-[5px] text-[11px] font-bold uppercase tracking-[0.12em] text-ink">
              {badge}
            </span>
          ) : null}
        </div>
      ) : (
        <PhotoPending brief={photoBrief ?? 'Photo needed.'} ratio={ratio} className="rounded-none border-0" />
      )}

      <div className="flex flex-1 flex-col p-[20px]">
      {eyebrow ? (
        <Eyebrow tone="deep">
          {eyebrow}
        </Eyebrow>
      ) : null}

      <Heading
        level={3}
        role="card"
        className="mt-[6px] transition-colors duration-200 group-hover:text-deep"
      >
        {title}
      </Heading>

      {body ? (
        <p className="mt-[8px] flex-1 text-[15px] leading-[1.6] text-body/75">{body}</p>
      ) : null}

      {children}

      <span
        aria-hidden="true"
        className="mt-[14px] inline-flex items-center gap-[8px] text-caption font-bold uppercase tracking-[0.14em]"
      >
        <span className="underline decoration-ink/45 decoration-1 underline-offset-4 transition-[text-decoration-color] group-hover:decoration-sunset group-hover:decoration-2">
          {cta}
        </span>
        <svg width="15" height="10" viewBox="0 0 16 10" fill="none">
          <path
            d="M0 5h14M10 1l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-200 group-hover:translate-x-[3px]"
          />
        </svg>
      </span>
      </div>
    </Link>
  );
}
