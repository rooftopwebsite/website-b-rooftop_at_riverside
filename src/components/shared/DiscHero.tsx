import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Crumb } from '@/components/shared/PageHero';
import { PhotoPending } from '@/components/shared/PendingData';
import { Reveal } from '@/components/shared/Motion';
import { Eyebrow } from '@/components/shared/Type';

/**
 * El hero del disco: el nombre gigante, el disco de color y la foto apoyada
 * en el centro.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ES UN CALCO DE ESTRUCTURA, PEDIDO ASÍ. Camila, 2026-09-16: «quiero que
 * literalmente copies esta estructura [defoodtruckclub.nl/foodtrucks/
 * bbq-foodtruck] pero le insertes nuestros parámetros de UI (font, colores,
 * elementos) y los textos».
 *
 * De la referencia se toma la COMPOSICIÓN, que es lo que le da carácter a esa
 * página y que ninguna de nuestras internas tenía:
 *
 *   · el nombre en el cuerpo más grande del sitio, centrado y a todo el ancho
 *     de la caja;
 *   · un disco de color detrás, que el nombre PISA por arriba;
 *   · la foto apoyada en el centro del disco;
 *   · y la bajada centrada, adentro de la parte baja del disco.
 *
 * Lo que NO se copia es nada de su marca: ni el rosa, ni la tipografía, ni el
 * recorte del camión sobre fondo transparente, ni una sola palabra de su copy.
 * Acá va Big Shoulders sobre `paper`, el disco en `cream` y nuestra foto en
 * marco redondeado.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ERA `TruckHero` Y LO USABA `/food-trucks/[slug]`. Esa ruta se fue el
 * 2026-09-16 cuando los cuatro trucks pasaron a ser tarjetas de una sola
 * página, y el template quedó guardado con una razón escrita en el commit:
 * «se reutiliza en /game-truck». Esto es ese uso.
 *
 * Al mudarse dejó de saber de trucks. Antes recibía `cuisine`, `specialty` y
 * la ficha entera de un `Truck` —esta última sin usarla, para un marcador que
 * nunca se llegó a escribir— y ahora recibe un eyebrow, un titular y una
 * bajada. Es el mismo dibujo con los nombres correctos.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ ROMPE CON `PageHero` Y CON `PageHeroWave`, que son los heros de las
 * demás internas, y hay que saberlo antes de mirar el sitio entero. Es
 * consecuencia directa del pedido y está contenido —hoy lo usa una sola
 * página—, pero si algún día molesta que no haya una sola forma de abrir una
 * interna, el camino es llevar ESTE hero a las demás, no volver este atrás.
 *
 * Lo que sí se conserva de `PageHero` son las MIGAS, con el mismo marcado y el
 * mismo `aria-label`: son SEO y orientación, no decoración.
 *
 * ⚠️ EL DISCO NO ES UN FONDO, ES UNA FORMA, y por eso puede ir en `cream`. El
 * token tiene anotado «NO fondos grandes» y la regla sigue en pie: habla de
 * BANDAS de sección a todo el ancho, donde el amarillo saturado cansa. Acá el
 * disco mide una vez y media el marco de la foto, con el `paper` de la página
 * visible alrededor de los cuatro lados. Es el mismo criterio con el que el
 * sitio ya usa `cream` en píldoras, botones y la lengüeta del logo.
 *
 * ⚠️ Y POR ESO TAMPOCO CUENTA EN `npm run check:surfaces`. El guard lee los
 * `tone=` de las `<Section>` y los `bg-*` de las `<section>` crudas; el de acá
 * es `bg-paper`, que es lo que la sección realmente es. El disco es un `div`.
 *
 * ⚠️ EL DISCO VA EN `z-0` Y EL CONTENIDO EN `relative z-10`. El porqué, que es
 * la clase de bug que se arregla dos veces si no queda escrito, está en la nota
 * de adentro del componente.
 */
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
  /**
   * El h1 entero.
   *
   * ⚠️ VA COMO `ReactNode` Y NO COMO STRING, y es lo que deja componer un
   * titular de dos cuerpos dentro de un solo h1. `/game-truck` lo usa así:
   * «Southwest Florida's first» en cuerpo chico arriba y «gaming truck» en
   * 112px abajo. El texto del h1 sigue siendo uno solo, que es lo que auditan
   * `npm run check:seo` y cualquier buscador.
   */
  readonly title: ReactNode;
  /** La bajada centrada que cae en la parte baja del disco. */
  readonly lead: string;
  readonly photo: string | null;
  readonly photoAlt: string | null;
  readonly photoBrief: string;
  readonly crumbs: readonly Crumb[];
  readonly children?: ReactNode;
}) {
  return (
    <section aria-labelledby="page-title" className="relative overflow-hidden bg-paper grano pb-cierre pt-8 lg:pt-11">
      <div className="caja-ancha relative">
        {/* Las migas, con el marcado de `PageHero`. Ver la nota de arriba. */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="m-0 flex list-none flex-wrap items-center gap-x-2 gap-y-0.5 p-0 font-body text-caption text-muted">
            <li>
              <Link href="/" className="link-texto">
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
                  <Link href={c.path} className="link-texto">
                    {c.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <Reveal>
          <div className="relative flex flex-col items-center text-center">
            {/*
              EL DISCO. Centrado sobre la foto, no sobre la sección: su centro
              tiene que coincidir con el de la imagen, que es lo que hace que el
              nombre lo pise por arriba y la bajada caiga en su parte baja.

              ⚠️ `aspect-square` con el ancho en `%` del contenedor y no en
              `vw`: en `vw` el disco cambia de tamaño cuando aparece la barra de
              scroll y se ve un salto al cargar contenido largo.
            */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-24 z-0 aspect-square w-[122%] max-w-[46rem] -translate-x-1/2 rounded-[50%] bg-cream grano sm:top-28 lg:top-36"
            />

            {/*
              ⚠️ EL CONTENIDO VA EN UN `relative z-10` Y EL DISCO EN `z-0`, y no al
              revés con el disco en `-z-10`. Así estaba primero y el disco NO SE
              VEÍA: la sección tiene `bg-paper`, y un hijo con z-index negativo
              se pinta por detrás del fondo de su ancestro salvo que ese ancestro
              cree un contexto de apilado propio. `relative` solo no lo crea.

              Con los dos índices positivos en el mismo contexto, el orden se
              respeta y el fondo de la sección queda debajo de los dos.
            */}
            <div className="relative z-10 flex flex-col items-center">
              <Eyebrow tone="deep">{eyebrow}</Eyebrow>

              {/*
                EL TITULAR, en el cuerpo más grande del sitio. `text-banda` son
                112px, el mismo que usa «Not a restaurant. Three of them» en la
                home: es el techo de la escala y acá está justificado, porque el
                nombre de lo que la página vende ES el contenido de la página.

                ⚠️ LA ESCALA Y LA MEDIDA LAS PONE EL CALL SITE Y NO ESTE
                ARCHIVO, porque el titular es un `ReactNode`. Lo que el hero
                fija es la familia, la caja y el centrado.

                ⚠️ ACÁ HABÍA UN `max-w-[16ch]` Y ERA UN BUG DESDE QUE EL
                TITULAR DEJÓ DE TRAER SU PROPIO CUERPO. `ch` es relativo al
                font-size del elemento: con `text-banda` escrito en el h1, 16ch
                eran unos 900px y hacían lo que decían; sin él, el h1 hereda los
                16px del body y 16ch pasan a ser 200px. El titular salía
                estrangulado en cuatro renglones angostos.

                Si un call site necesita medida, la pone en el span que lleva el
                cuerpo, que es donde el `ch` significa algo.

                ⚠️ `text-balance` y no `text-nowrap`: a 112px un nombre de más
                de doce caracteres no entra en un renglón de 1168px, así que va
                a partir. Que parta parejo.
              */}
              <h1
                id="page-title"
                className="m-0 mt-3.5 text-balance font-display font-extrabold uppercase text-ink"
              >
                {title}
              </h1>

              {/*
                LA FOTO. `max-w` en rem y no al ancho de la caja: la referencia
                apoya un objeto en el centro del disco, y una foto a 1168px sería
                una banda, no un objeto.
              */}
              <div className="mt-7 w-full max-w-[34rem]">
                {photo ? (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-frame bg-fog sombra-card">
                    <Image
                      src={photo}
                      alt={photoAlt ?? ''}
                      fill
                      priority
                      sizes="(min-width: 1024px) 544px, 92vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <PhotoPending brief={photoBrief} ratio="aspect-[4/3]" />
                )}
              </div>

              {/*
                LA BAJADA, centrada y adentro de la parte baja del disco. Va en
                display y no en cuerpo: en la referencia esta línea es un
                titular chico, no un párrafo.
              */}
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
