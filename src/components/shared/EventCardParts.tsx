import Image from 'next/image';
import type { ReactNode } from 'react';
import { PhotoPending } from '@/components/shared/PendingData';
import { shortDate, timeRange, type VenueEvent } from '@/content/events';
import { TAG } from '@/lib/tag';

/**
 * ══════════════════════════════════════════════════════════════════════════
 * LAS PIEZAS QUE COMPARTEN LAS DOS TARJETAS DE EVENTO DEL SITIO.
 *
 * Camila, 2026-09-21: «las cards de la grilla deberían ser iguales o similares
 * a las de la home, casi que hermanas o derivadas del mismo componente».
 *
 * Son dos tarjetas y siguen siendo dos, porque contestan cosas distintas:
 *
 *   · la del carrusel de la home (`sections/WhatsOn`) es de PASO. Va sobre la
 *     banda oscura, recorta la bajada a dos renglones y su trabajo es llevar al
 *     calendario;
 *   · la de la grilla de `/whats-on` (`sections/UpcomingCards`) es de DECISIÓN.
 *     Va sobre claro y publica todo: el cuerpo entero, los pasos numerados y la
 *     plancha de promos, porque es donde alguien elige a qué ir. Camila,
 *     2026-09-21: «debe mostrar toda la info».
 *
 * Lo que sí es idéntico vive acá y se usa en las dos. Antes estaba copiado, con
 * el costo clásico: la ventana de la foto se arregló dos veces y el segundo
 * arreglo no era igual al primero.
 *
 * ⚠️ LO QUE NO SE EXTRAJO, A PROPÓSITO: el plate animado de la home —el bloque
 * de texto que baja 76px en hover— y su fondo `deeper`. Es de esa tarjeta y de
 * esa banda; traerlo acá obligaría a parametrizar media docena de clases para
 * un solo consumidor, que es la forma más rápida de que un componente
 * compartido deje de ser legible.
 * ══════════════════════════════════════════════════════════════════════════
 */

/**
 * LA PÍLDORA DEL ESPACIO, sobre la foto.
 *
 * ⚠️ ES LA MISMA EN CLARO Y EN OSCURO, y no es un descuido: no se apoya en la
 * tarjeta, se apoya en la FOTO, que es material que no controlamos. El cristal
 * oscuro con desenfoque funciona sobre cualquier afiche; una píldora clara
 * desaparecería sobre los flyers de fondo blanco, que el local tiene.
 *
 * ⚠️ EL 85 % DE OPACIDAD ES EL PISO DE CONTRASTE Y ESTÁ MEDIDO. El peor caso es
 * sobre una zona blanca del afiche: 85 % da 6,16:1 y 70 % da 4,03:1, que ya no
 * pasa AA. Si alguna vez se toca, se mira ese número y no cómo queda sobre el
 * verde, que siempre da bien.
 *
 * ⚠️ LA LETRA SALE DE `TAG`, el molde común de los tags del sitio. Camila,
 * 2026-09-16: «si los tags serán con letra minúscula que lo sean todos, debemos
 * unificar». Lo que es de acá es el cristal, el filete y el desenfoque.
 */
export function SpacePill({ children, lado = 'izq' }: { readonly children: ReactNode; readonly lado?: 'izq' | 'der' }) {
  return (
    <span
      className={[
        'absolute top-4 z-20 flex items-center gap-[6px] rounded-pill bg-deep/85 ring-1 ring-cream/25 backdrop-blur-[3px]',
        TAG,
        'text-cream',
        lado === 'izq' ? 'left-4' : 'right-4',
      ].join(' ')}
    >
      {children}
    </span>
  );
}

/**
 * LA VENTANA DE LA FOTO.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ VENTANA 7:5 CON CAJA DE RECORTE 4:5 ANCLADA ARRIBA, y esa asimetría es
 * todo el punto. Los afiches llegan del dashboard en 1920×1080 con el arte
 * VERTICAL pegado en el medio: poner la foto directo en la ventana con
 * `object-cover` recorta por los costados y parte los títulos —«LIVE» quedaba
 * en «VE»—. Una caja vertical anclada arriba los devuelve enteros y la ventana
 * muestra la parte de arriba, que es donde está el nombre del artista.
 *
 * ⚠️ PASÓ POR TRES PROPORCIONES antes de ésta. Está anotado en `WhatsOn`: fue
 * `aspect-video`, después `aspect-[4/5]`, y la mezcla de las dos es lo que
 * funciona. No volver a tocarlo sin mirar un afiche real.
 *
 * ⚠️ EL HUECO VA MARCADO Y EN INGLÉS. Es texto VISIBLE, no un comentario: si
 * falta el afiche, se publica el cartel punteado para que el hueco no pase
 * callado. Hoy importa más que nunca: de los 44 eventos de la base, 42 no
 * tienen imagen.
 *
 * ⚠️ EL `pb-[42%]` DEL HUECO NO ES AIRE: es la parte de la caja que la ventana
 * no muestra. Sin eso, el brief se centra en la caja entera y la mitad de abajo
 * cae fuera de cuadro.
 * ══════════════════════════════════════════════════════════════════════════
 */
export function EventPhoto({
  event,
  sizes,
  brief,
  tone = 'light',
  imgClassName = 'object-cover',
  fondo = '',
  children,
}: {
  readonly event: VenueEvent;
  readonly sizes: string;
  /** El texto del cartel punteado cuando no hay afiche. Va en inglés. */
  readonly brief: string;
  /** El tono del hueco punteado, no el de la tarjeta. */
  readonly tone?: 'light' | 'dark';
  readonly imgClassName?: string;
  /** El color de la ventana mientras la foto carga, o si no hay. */
  readonly fondo?: string;
  /** Las píldoras que van encima de la foto. */
  readonly children?: ReactNode;
}) {
  return (
    <div className={`relative aspect-[7/5] w-full shrink-0 overflow-hidden ${fondo}`}>
      <div className="absolute inset-x-0 top-0 aspect-[4/5] overflow-hidden">
        {event.image === null ? (
          <PhotoPending
            brief={brief}
            ratio=""
            tone={tone}
            className="absolute inset-0 h-full rounded-none border-0 border-dashed pb-[42%]"
          />
        ) : (
          <Image
            src={event.image}
            alt={event.imageAlt ?? ''}
            fill
            sizes={sizes}
            className={imgClassName}
          />
        )}
      </div>
      {children}
    </div>
  );
}

/**
 * EL RENGLÓN DEL CUÁNDO: la fecha, y la hora en una píldora maciza.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LA JERARQUÍA LA PIDIÓ CAMILA Y NO SE TOCA: «resaltar horario en cards
 * events, pasa muy desapercibido el día y hora y es de lo más importante». La
 * píldora es el único bloque de color macizo de la tarjeta, así que es lo
 * primero que agarra el ojo.
 *
 * ⚠️ `cream` CON TINTA `deep` ENCIMA, EN LAS DOS TARJETAS. Sobre la banda
 * oscura da 9,44:1 y sobre la tarjeta clara también, porque el par no depende
 * del fondo: es una píldora opaca. Por eso no hay variante de tono acá.
 *
 * ⚠️ LA FECHA ES LA FECHA REAL Y NO EL NOMBRE DEL DÍA. La tarjeta representa
 * UN miércoles, no «los miércoles»: con el nombre del día suelto, dos
 * ocurrencias del mismo evento en la misma lista salían idénticas. Es el mismo
 * motivo por el que la grilla de `/whats-on` repite el evento por fecha.
 *
 * ⚠️ «TODAY» REEMPLAZA AL DÍA, no se le suma. Ocupa el renglón del día porque
 * ES un día, así que no entra ni un elemento nuevo ni una segunda píldora de
 * color. Y dice «Today» y no «Tonight» porque hay eventos de mediodía:
 * «Tonight · 12 PM – 8 PM» es directamente falso.
 * ══════════════════════════════════════════════════════════════════════════
 */
export function EventWhen({
  event,
  date,
  isToday = false,
  fecha = 'text-ink',
}: {
  readonly event: VenueEvent;
  /** La fecha de ESTA ocurrencia, `YYYY-MM-DD`. */
  readonly date: string;
  readonly isToday?: boolean;
  /** El color de la fecha, que sí cambia con el fondo de la tarjeta. */
  readonly fecha?: string;
}) {
  return (
    <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
      <span className={`font-body text-dato font-bold uppercase tracking-eyebrow ${fecha}`}>
        {isToday ? 'Today' : shortDate(date)}
      </span>
      <span className="rounded-pill bg-cream px-2.5 py-0.75 font-body text-caption font-bold whitespace-nowrap text-deep">
        {timeRange(event)}
      </span>
    </span>
  );
}
