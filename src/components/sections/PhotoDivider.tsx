import Image from 'next/image';

/**
 * El divisor de fotos: la banda oscura con el marquee, el sello y la ola.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ QUÉ HACE ACÁ UNA BANDA SIN TEXTO, que es la pregunta que hay que
 * contestar antes de defender el recurso.
 *
 * La home tiene nueve secciones y las cinco primeras piden LEER: el hero, el
 * carrusel de eventos, el bloque de camiones, el enunciado de los cinco
 * negocios y los tres tickets. Después de eso vienen otras cuatro que también
 * piden leer. Sin un respiro, el visitante llega a «Not a restaurant» ya
 * cansado y esa sección es la que más importa.
 *
 * Esta banda es el respiro. No informa: MUESTRA. Es el lugar de la home donde
 * se ve gente, comida y el atardecer sin que nadie tenga que procesar una
 * frase.
 *
 * ⚠️ Y ADEMÁS resuelve el problema de superficie. Es el ÚNICO corte a `ink`
 * de la página —las otras dos bandas oscuras son `deep`— y separa las dos
 * mitades del argumento: arriba «cómo funciona esto», abajo «qué podés hacer
 * acá». Sin ella las nueve secciones son una sola tirada.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ SON CUATRO PIEZAS SUPERPUESTAS Y CADA UNA TIENE SU Z:
 *
 *     z-40  el sello, que se sale de la banda por arriba
 *     z-30  la ola de abajo y el emblema que la corona
 *     z-20  el marquee de fotos, centrado vertical
 *     z-10  el remate claro de arriba
 *      —    la foto de fondo
 *
 * El orden importa: el sello tiene que quedar sobre el remate claro (si no,
 * se corta a la mitad) y el emblema sobre la ola (es el que la remata).
 *
 * ⚠️ EL REMATE DE ARRIBA es un rectángulo de `bone` con las esquinas de ABAJO
 * redondeadas, y no un `rounded-t` de la sección de arriba. Parece lo mismo y
 * no lo es: acá la superficie clara BAJA sobre la oscura, al revés que en el
 * resto de la home. Es lo que hace que la banda oscura se lea como un hueco
 * abierto en la página y no como una losa apoyada encima.
 *
 * ⚠️ `top-[-1px]` en el remate y `bottom-[-1px]` en la ola, y el píxel es a
 * propósito: en pantallas con DPR fraccional (1.25 y 1.5 de Windows, que es
 * la mitad del tráfico de escritorio de este sitio) el redondeo del layout
 * deja una línea del fondo asomando entre las dos capas.
 *
 * ⚠️ Server component: no hay estado. Las tres animaciones son CSS puro y las
 * apaga el corte global de `prefers-reduced-motion`.
 */

/**
 * Las seis fotos del marquee, con su medida.
 *
 * ⚠️ LAS MEDIDAS SON DESPAREJAS A PROPÓSITO y no hay que «prolijarlas». Seis
 * fotos del mismo tamaño en una fila son una grilla que pasa; seis de alturas
 * distintas son un tendal de fotos. Es la diferencia entre leerse como un
 * catálogo y leerse como una pared del lugar.
 *
 * ⚠️ Salen de `wall-slots.ts` —el material curado del hero— pero NO se
 * importa esa lista: acá hacen falta seis fotos de temas distintos entre sí y
 * en un orden propio (día/noche alternado), y `WALL` está ordenada para otra
 * cosa. Compartir el array ataría dos criterios de orden que no tienen nada
 * que ver.
 */
const PHOTOS = [
  { src: '/images/venue/wall-cocktails-rooftop.jpg', alt: 'The rooftop bar at sunset', w: 'w-85', h: 'h-65' },
  { src: '/images/venue/wall-guests-yard-day.jpg', alt: 'Guests in the yard', w: 'w-70', h: 'h-90' },
  { src: '/images/venue/wall-bartender.jpg', alt: 'Cocktails at the Sunset Bar', w: 'w-105', h: 'h-60' },
  { src: '/images/venue/wall-truck-window-day.jpg', alt: 'A truck window in the yard', w: 'w-75', h: 'h-82.5' },
  { src: '/images/venue/wall-live-music-tent.jpg', alt: 'Live music in the yard', w: 'w-95', h: 'h-67.5' },
  { src: '/images/venue/wall-yard-night-table.jpg', alt: 'A table in the yard at night', w: 'w-65', h: 'h-85' },
] as const;

export default function PhotoDivider() {
  return (
    <section aria-hidden="true" className="relative bg-ink">
      {/*
        ⚠️ TODA LA SECCIÓN ES `aria-hidden`, y es correcto: no hay ni un dato
        acá que no esté escrito en otro lado de la página. Doce fotos con su
        `alt` en un lector de pantalla son doce interrupciones para describir
        el mismo lugar que las secciones de arriba y abajo ya describen con
        texto. Por eso también las `alt` de abajo están vacías en la práctica
        —quedan escritas para el día que la banda deje de ser decorativa.
      */}
      <Image
        src="/brand/seal.svg"
        alt=""
        width={196}
        height={196}
        className="rt-sway absolute -top-14.5 left-4 z-40 w-32.5 lg:left-30 lg:w-49"
      />

      <div className="relative h-140 w-full lg:h-[56vw] lg:max-h-205">
        {/*
          ⚠️ El slot del diseño pide «the yard, or the rooftop at dusk», y esa
          indicación es la que manda acá. La primera versión usaba
          `wall-yard-night-wide.jpg` por el nombre del archivo y resultó ser un
          interior de barra a plena luz: detrás de un tendal de fotos, un fondo
          claro y de día deja de leerse como fondo y compite con el marquee.
          Esta es el patio de noche con gente, que es lo que la banda tiene
          que dejar entrever.
        */}
        <Image
          src="/images/venue/wall-yard-night-crowd.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-x-0 top-1/2 z-20 -translate-y-1/2">
          <div className="w-full overflow-hidden">
            {/* El set va DOS VECES: el marquee se desplaza el 50 % y vuelve al
                origen, así que la segunda copia es la que tapa el hueco en el
                punto de reinicio. Sin ella se ve el corte. */}
            <div className="rt-marquee-rev flex w-max items-center gap-6">
              {[...PHOTOS, ...PHOTOS].map((photo, i) => (
                <div
                  key={`${photo.src}-${i}`}
                  className={`${photo.w} ${photo.h} shrink-0 overflow-hidden rounded-shell bg-fog`}
                >
                  <Image
                    src={photo.src}
                    alt=""
                    width={420}
                    height={360}
                    sizes="420px"
                    className="size-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* El remate claro de arriba. Ver la nota del encabezado. */}
      <div className="pointer-events-none absolute inset-x-0 top-[-1px] z-10 h-22.5 rounded-b-band bg-bone" />

      {/*
        La cenefa de olas.

        ⚠️ El 114 % de ancho con −7 % de margen es lo que hace posible la
        animación: la ola se corre un 3.5 % y el sobrante es lo que sigue
        tapando los dos bordes. Los dos números están atados — ver `.rt-wave`
        en globals.css.
      */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[-1px] z-30 overflow-hidden">
        <Image
          src="/brand/wave-only.svg"
          alt=""
          width={1600}
          height={120}
          className="rt-wave block w-[114%] max-w-none -ml-[7%]"
        />
      </div>

      {/* El emblema que corona la ola. El 10.83 % es su proporción respecto
          del ancho de la cenefa: sale del diseño y crece con ella. */}
      <div className="pointer-events-none absolute bottom-[-1px] left-1/2 z-30 w-[10.83%] -translate-x-1/2">
        <Image src="/brand/emblem-crop.svg" alt="" width={160} height={120} className="block w-full" />
      </div>
    </section>
  );
}
