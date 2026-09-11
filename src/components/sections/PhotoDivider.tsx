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
      {/*
        ⚠️ EL SELLO NO APARECE ABAJO DE `lg`. Pedido de Camila: «movelo o
        borralo, está muy pegado a las flechas y en mobile molesta».

        El choque es real y es nuevo: cuelga `-top-14.5` por encima de esta
        sección, o sea que cae sobre el final de `YardSteps` — y `YardSteps`
        acaba de estrenar una fila de controles de carrusel, centrada, que
        abajo de `lg` sí existe. A 390px el sello mide 130 de ancho y se sienta
        justo al lado de la flecha izquierda.

        Se ESCONDE en vez de moverse porque no hay dónde ponerlo: la banda de
        fotos ocupa el ancho completo y cualquier otra esquina lo deja encima
        de una foto o del emblema de la ola. Y se puede esconder sin perder
        nada — es decoración pura, `alt=""`, y no dice nada que el texto no
        diga.

        ⚠️ `hidden lg:block` y NO `lg:hidden` invertido: en desktop la fila de
        controles no existe —las tres tarjetas entran— así que ahí el sello no
        choca con nada y se queda donde el diseño lo puso.
      */}
      <Image
        src="/brand/seal.svg"
        alt=""
        width={196}
        height={196}
        className="rt-sway absolute -top-14.5 left-4 z-40 hidden w-32.5 lg:left-30 lg:block lg:w-49"
      />

      {/*
        ⚠️ LA BANDA ES MÁS ALTA EN MOBILE Y TABLET. Pedido de Camila: más aire
        arriba y abajo del tendal de fotos.

        El tendal mide 360px fijos y va centrado, así que el aire de arriba y
        el de abajo es `(alto − 360) / 2`: con los 560 de antes daban 100 y 100.
        Pero ese aire NO es el que se ve — arriba se lo come la tapa de hueso y
        abajo la cenefa de la ola. Medido a 390: de los 100 de arriba, 90 eran
        tapa, así que de verde quedaban DIEZ píxeles. De ahí que las fotos se
        vieran pegadas al borde.

        Con 608 en mobile y 704 en tablet el aire pasa a 124 y 172, y descontando
        tapa y ola quedan ~80 de verde arriba y ~91 abajo en un teléfono.

        Desktop no cambia: sigue en `56vw` con su tope de 205.
      */}
      <div className="relative h-[38rem] w-full md:h-[44rem] lg:h-[56vw] lg:max-h-205">
        {/*
          ⚠️ ES UNA TEXTURA Y NO UNA ESCENA, y ése es el cambio respecto de la
          versión anterior. Antes iba `wall-yard-night-crowd.jpg` —el patio de
          noche con gente— siguiendo el slot del diseño. El problema es que
          detrás de un tendal de seis fotos, una escena con gente NO se lee
          como fondo: se lee como una séptima foto tapada, y el ojo pelea por
          reconstruirla.

          La palmera resuelve las dos cosas de una: es verde de marca, no
          tiene sujeto que reconstruir, y por densidad de hoja queda oscura sin
          necesidad de que la oscurezcamos nosotros.

          ⚠️ EL ORIGINAL ES VERTICAL Y SE GIRA EN `build-media.mjs`. Esto no
          es un `rotate-90` de CSS: girar acá obligaría a agrandar la imagen
          para que el rectángulo girado siga tapando la banda, y el `fill` con
          `object-cover` dejaría de funcionar. El archivo llega ya apaisado.
        */}
        <Image
          src="/images/venue/leaf-backdrop.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />

        {/*
          El velo.

          ⚠️ HACE FALTA aunque la foto ya sea oscura: las fotos del marquee
          tienen sus propios verdes y sin el velo los bordes de los tiles se
          pierden contra la hoja. Es `ink` y no negro para que el fondo caiga
          al mismo verde casi negro que usa el resto de la página.

          ⚠️ 60 % Y NO 45 %, que fue el primer valor. La hoja tiene mucho
          contraste propio —las nervaduras claras contra el fondo de la
          planta— y a 45 % esas líneas todavía competían con el tendal. A 60 %
          la textura se sigue reconociendo pero pasa a ser superficie: es el
          punto donde deja de pedir atención.
        */}
        <div className="absolute inset-0 bg-ink/60" />

        <div className="absolute inset-x-0 top-1/2 z-20 -translate-y-1/2">
          <div className="w-full overflow-hidden">
            {/* El set va DOS VECES: el marquee se desplaza el 50 % y vuelve al
                origen, así que la segunda copia es la que tapa el hueco en el
                punto de reinicio. Sin ella se ve el corte. */}
            <div className="rt-marquee-rev flex w-max items-center gap-6">
              {[...PHOTOS, ...PHOTOS].map((photo, i) => (
                <div
                  key={`${photo.src}-${i}`}
                  className={`${photo.w} ${photo.h} relative shrink-0 overflow-hidden rounded-shell bg-fog sombra-card`}
                >
                  <Image
                    src={photo.src}
                    alt=""
                    width={420}
                    height={360}
                    sizes="420px"
                    className="size-full object-cover"
                  />

                  {/*
                    El recuadro punteado, POR DENTRO de la foto.

                    ⚠️ ES EL MISMO RECURSO QUE LAS ETIQUETAS DE «Five
                    businesses» —`border-dashed`, ver `YardSteps`— y ésa es
                    justamente la razón para usarlo: la home ya tiene un
                    lenguaje de línea punteada y esto lo repite en vez de
                    inventar un segundo marco decorativo.

                    ⚠️ PERO EL COLOR NO PUEDE SER `teal600` como allá. Aquellas
                    etiquetas van sobre `paper`, con un fondo constante; éstas
                    van sobre SEIS FOTOS distintas, de la barra de noche casi
                    negra al cielo del mediodía. El teal desaparece sobre las
                    oscuras. Blanco al 85 % es lo único que sobrevive a las dos
                    puntas del rango.

                    ⚠️ LA SOMBRA NO ES DECORACIÓN: sobre `truck-window-day` y
                    `butcher-truck` el recuadro cae contra cielo blanco y sin
                    ella el trazo se corta a la mitad. Es un pixel de negro al
                    35 %, invisible salvo donde hace falta.

                    ⚠️ `inset-3.5` (14px) y `rounded-ticket` (18px) están
                    ATADOS: el tile es `rounded-shell` (32px) y el radio
                    interno de un marco metido 14px es 32 − 14 = 18. Si se
                    cambia uno hay que recalcular el otro, o las esquinas
                    dejan de ser concéntricas y se nota.
                  */}
                  <div
                    className="pointer-events-none absolute inset-3.5 rounded-ticket border border-dashed border-paper/85 [filter:drop-shadow(0_1px_1px_rgb(0_0_0/0.35))]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* El remate claro de arriba. Ver la nota del encabezado. */}
      {/*
        La tapa de hueso: es lo que hace que la sección de arriba parezca
        terminar con un arco hacia abajo.

        ⚠️ SU ALTO SE ATÓ AL RADIO Y DEJÓ DE SER 90px FIJOS. Camila pidió sacar
        espacio justo acá —es la franja clara de arriba de la banda— y 90px era
        un número puesto cuando el arco medía 88 en todos lados. Desde que
        `--radius-band` es fluido, en un teléfono el arco mide 36 y la tapa
        seguía ocupando 90: 54px de hueso liso que no dibujaban nada.

        `radio + 8px` es el mínimo que muestra la curva entera con un hilo de
        margen. A 390 da 44 en vez de 90, y a 834 da 83 — menos donde más
        sobraba, que es el orden correcto.

        ⚠️ En `lg` se queda en los 90 de siempre: ahí el arco mide 88 y el
        cálculo daría 96, o sea que el desktop se movería sin motivo.
      */}
      <div className="pointer-events-none absolute inset-x-0 top-[-1px] z-10 h-[calc(var(--radius-band)+8px)] rounded-b-band bg-bone lg:h-22.5" />

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

      {/*
        El emblema que corona la ola.

        ⚠️ EL 10.83 % ES LA PROPORCIÓN DEL DISEÑO Y SÓLO VALE EN DESKTOP. Sale
        de la maqueta, donde es su ancho respecto de la cenefa, y como
        porcentaje crece con ella — que es correcto para una pieza pensada a
        1440. El problema es que también DECRECE: a 390px de pantalla el
        emblema queda en 42px de ancho, que a esa escala es una mancha. Camila:
        «en mobile más grande desde el centro, está muy chico y no se ve».

        Por eso el porcentaje sube en las pantallas chicas: 24 % a 390 son 94px
        de ancho, que es cuando la figura se vuelve a leer. El centrado no
        cambia —sigue siendo `left-1/2` con `-translate-x-1/2`— así que crece
        desde el centro, que es lo que se pidió.
      */}
      <div className="pointer-events-none absolute bottom-[-1px] left-1/2 z-30 w-[24%] -translate-x-1/2 md:w-[16%] lg:w-[10.83%]">
        <Image src="/brand/emblem-crop.svg" alt="" width={160} height={120} className="block w-full" />
      </div>
    </section>
  );
}
