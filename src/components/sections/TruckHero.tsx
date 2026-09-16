import Image from 'next/image';
import Link from 'next/link';
import type { Crumb } from '@/components/shared/PageHero';
import { PhotoPending } from '@/components/shared/PendingData';
import { Reveal } from '@/components/shared/Motion';
import { Eyebrow } from '@/components/shared/Type';

/**
 * El hero de la ficha de un truck: el nombre gigante, el disco y la foto.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ES UN CALCO DE ESTRUCTURA, PEDIDO ASÍ. Camila, 2026-09-16: «quiero que
 * literalmente copies esta estructura [defoodtruckclub.nl/foodtrucks/
 * bbq-foodtruck] pero le insertes nuestros parámetros de UI —font, colores,
 * elementos— y los textos».
 *
 * De la referencia se toma la COMPOSICIÓN, que es lo que le da carácter a esa
 * página y que ninguna de nuestras internas tenía:
 *
 *   · el nombre del truck en el cuerpo más grande del sitio, centrado y a todo
 *     el ancho de la caja;
 *   · un disco de color detrás, que el nombre PISA por arriba;
 *   · la foto del truck apoyada en el centro del disco;
 *   · flechas a los costados cuando hay más de una foto;
 *   · y la bajada centrada, adentro de la parte baja del disco.
 *
 * Lo que NO se copia es nada de su marca: ni el rosa, ni la tipografía, ni el
 * recorte del camión sobre fondo transparente, ni una sola palabra de su copy.
 * Acá va Big Shoulders sobre `paper`, el disco en `cream` y la foto del truck
 * del cliente en marco redondeado.
 *
 * ⚠️ ROMPE CON `PageHero`, QUE ES EL HERO DE LAS OTRAS SIETE INTERNAS, y hay
 * que saberlo antes de mirar el sitio entero: las páginas de truck ahora abren
 * distinto del resto. Es consecuencia directa del pedido y está contenido —son
 * las páginas de ficha, que son las únicas cuatro que comparten template—, pero si
 * algún día molesta que no haya una sola forma de abrir una interna, el camino
 * es llevar ESTE hero a las demás, no volver este atrás.
 *
 * Lo que sí se conserva de `PageHero` son las MIGAS, con el mismo marcado y el
 * mismo `aria-label`: son SEO y orientación, no decoración, y las cuatro fichas
 * están a dos niveles de profundidad.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ EL DISCO NO ES UN FONDO, ES UNA FORMA, y por eso puede ir en `cream`. El
 * token tiene anotado «NO fondos grandes» y la regla sigue en pie: habla de
 * BANDAS de sección a todo el ancho, donde el amarillo saturado cansa. Acá el
 * disco mide una vez y media el marco de la foto, con el `paper` de la página
 * visible alrededor de los cuatro lados. Es el mismo criterio con el que el
 * sitio ya usa `cream` en píldoras, botones y la lengüeta del logo.
 *
 * ⚠️ EL DISCO VA EN `z-0` Y EL CONTENIDO EN `relative z-10`. El porqué, que es
 * la clase de bug que se arregla dos veces si no queda escrito, está en la nota
 * de adentro del componente.
 */
export default function TruckHero({
  name,
  cuisine,
  specialty,
  photo,
  photoAlt,
  photoBrief,
  crumbs,
  truck,
  children,
}: {
  readonly name: string;
  readonly cuisine: string;
  readonly specialty: string;
  readonly photo: string | null;
  readonly photoAlt: string | null;
  readonly photoBrief: string;
  readonly crumbs: readonly Crumb[];
  /** La ficha entera, sólo para el marcador de nombre sin confirmar. */
  readonly truck: import('@/content/trucks').Truck;
  readonly children?: React.ReactNode;
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
            <Eyebrow tone="deep">{cuisine}</Eyebrow>

            {/*
              EL NOMBRE, en el cuerpo más grande del sitio. `text-banda` son
              112px, el mismo que usa «Not a restaurant. Three of them» en la
              home: es el techo de la escala y acá está justificado, porque el
              nombre del truck ES el contenido de la página.

              ⚠️ `text-balance` y no `text-nowrap`. «Sea Me on Wheels» y «OCN
              Seafood Co.» miden 16 y 15 caracteres: a 112px no entran en un
              renglón de 1168px, así que van a partir. Que partan parejo.
            */}
            <h1
              id="page-title"
              className="m-0 mt-3.5 max-w-[16ch] text-balance font-display text-banda font-extrabold uppercase text-ink"
            >
              {name}
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
                    /*
                      ⚠️ EL ALT DE RESPALDO ES SÓLO EL NOMBRE, y antes decía «el
                      truck de X en el yard». Era mentira en al menos un caso:
                      la imagen de El Chilango no es una foto del truck, es su
                      arte de marca. Un alt que describe algo que no está en la
                      imagen es peor que un alt genérico.
                    */
                    alt={photoAlt ?? name}
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
              LA BAJADA, centrada y adentro de la parte baja del disco. Es la
              `specialty` del truck, que es el único texto corto y verificado que
              tenemos de los siete: sale de la grilla de `/food-trucks`.
            */}
            <p className="m-0 mt-8 max-w-[34ch] font-display text-d4 font-bold uppercase leading-[1.04] text-ink lg:text-d3">
              {specialty}
            </p>

            {children ? <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div> : null}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
