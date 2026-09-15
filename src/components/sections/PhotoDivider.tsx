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
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LAS SEIS CRECEN UN 45 % DE `md` PARA ARRIBA, y es un pedido con motivo
 * puesto: «la galería necesita fotos más grandes porque como que no me muestra
 * el sitio bien».
 *
 * Tenía razón medida, y el problema no eran las fotos sino la PROPORCIÓN. La
 * banda mide 820px de alto en escritorio y la foto más alta medía 360: el
 * marquee ocupaba el 44 % de su propia sección y el 56 % restante era fondo
 * verde. Una pared de fotos que se ve más fondo que foto no muestra el lugar,
 * lo insinúa.
 *
 * Ahora la más alta mide 520 y con el `py-13` del riel el bloque llega a 624,
 * o sea el 76 % de la banda. Las seis suben el mismo factor, así que el
 * desparejo de arriba se conserva entero: siguen siendo un tendal y no una
 * grilla.
 *
 * ⚠️ EL SALTO ES EN `md` Y NO EN LA MEDIDA BASE. Por debajo la banda mide
 * 608px y la foto más alta ya llegaría a 520 + 104 de riel = 624: se saldría
 * de su propia sección. En teléfono las medidas quedan como estaban, que ahí
 * ya daban 464 de 608 y la proporción nunca fue el problema.
 *
 * ⚠️ LA BANDA CRECIÓ CON ELLAS, Y ESA ES LA SEGUNDA MITAD DEL ARREGLO.
 * Camila, apenas vio las fotos nuevas: «bien el nuevo tamaño, pero agrandá con
 * ellas el espacio que las contiene de alto, para que no queden pegadas al
 * contenido de abajo ni con poco espacio arriba y abajo».
 *
 * Y tenía que ser el ALTO DE LA BANDA y no el `py` del riel, que era el primer
 * reflejo: el riel está centrado vertical, así que agrandarle el padding agranda
 * el bloque y le come el mismo espacio al hueco de arriba y de abajo. El aire
 * que se ve no cambia un píxel. El `py-13` existe para que la sombra de las
 * tarjetas no se recorte y se queda donde está.
 *
 * La cuenta, medida a 1440: el bloque son 520 de la foto más alta + 104 de riel
 * = 624. La banda pasa de 820 a 950, así que sobran 163 arriba y abajo. De esos
 * 163 se descuentan los 90 del remate claro arriba y los ~60 de la ola abajo:
 * quedan 73 y 103 de verde limpio, que es lo que faltaba.
 *
 * ⚠️ EL `min-h` DE `lg` NO SOBRA. El alto es `66vw`, y en una pantalla de 1024
 * eso da 676: menos que el bloque de 624 más su aire. El mínimo de 56rem es lo
 * que evita que la banda se apriete justo donde el salto de `md` ya no rige.
 * ══════════════════════════════════════════════════════════════════════════
 */
const PHOTOS = [
  { src: '/images/venue/wall-cocktails-rooftop.jpg', alt: 'The rooftop bar at sunset', w: 'w-85 md:w-122.5', h: 'h-65 md:h-95' },
  { src: '/images/venue/wall-guests-yard-day.jpg', alt: 'Guests in the yard', w: 'w-70 md:w-100', h: 'h-90 md:h-130' },
  { src: '/images/venue/wall-bartender.jpg', alt: 'Cocktails at the Sunset Bar', w: 'w-105 md:w-150', h: 'h-60 md:h-87.5' },
  { src: '/images/venue/wall-truck-window-day.jpg', alt: 'A truck window in the yard', w: 'w-75 md:w-107.5', h: 'h-82.5 md:h-120' },
  { src: '/images/venue/wall-live-music-tent.jpg', alt: 'Live music in the yard', w: 'w-95 md:w-137.5', h: 'h-67.5 md:h-97.5' },
  { src: '/images/venue/wall-yard-night-table.jpg', alt: 'A table in the yard at night', w: 'w-65 md:w-92.5', h: 'h-85 md:h-122.5' },
] as const;

export default function PhotoDivider() {
  /*
    ⚠️ `z-[1]` EN LA SECCIÓN ES LO QUE DEJA AL EMBLEMA COLGAR SOBRE LA DE
    ABAJO. Sin él esta sección tiene z-index `auto` igual que `ThreeDoors`, y
    entre iguales gana la que viene después en el DOM: la mitad de abajo del
    emblema quedaba tapada por el hueso de la siguiente sección. Era además el
    motivo por el que el emblema venía recortado.

    1 alcanza, porque `ThreeDoors` no declara z-index. Y queda lejos del
    header, que vive en 50.
  */
  return (
    <section aria-hidden="true" className="relative z-[1] bg-ink">
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
      <div className="relative h-[42rem] w-full md:h-[56rem] lg:h-[66vw] lg:max-h-[60rem] lg:min-h-[56rem]">
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
          {/*
            ⚠️ EL `py-13` ES LA SOMBRA DE LAS FOTOS, NO ES AIRE. El
            `overflow-hidden` de acá existe para el marquee —recorta la tira
            que se desplaza, que es más ancha que la pantalla— pero recorta
            también ARRIBA Y ABAJO, y ahí no hay nada que esconder: las fotos
            llevan `sombra-card` y quedaba cortada al ras.

            ⚠️ SON 52px Y NO 32, QUE ES LO QUE DECÍA ANTES. Los 32 salían de
            calcular el alcance como `blur / 2 + spread`, que da el punto
            medio del degradé y no el final de la cola. Con la cuenta buena
            —`blur + spread`— `sombra-card` baja 50px. El porqué completo está
            en el encabezado de `scripts/check-sombras.mjs`.

            Los 52px van sin margen negativo que los compense a propósito. El
            envoltorio está centrado con `top-1/2` + `-translate-y-1/2`, así
            que un padding SIMÉTRICO crece para los dos lados y el centro no se
            mueve: la tira queda donde estaba. Un `-my` acá sí la correría.
          */}
          <div className="w-full overflow-hidden py-13">
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
      <div className="pointer-events-none absolute inset-x-0 top-[-1px] z-10 h-[calc(var(--radius-band)+8px)] rounded-b-band bg-bone grano lg:h-22.5" />

      {/*
        La cenefa de olas.

        ⚠️ El 114 % de ancho con −7 % de margen es lo que hace posible la
        animación: la ola se corre un 3.5 % y el sobrante es lo que sigue
        tapando los dos bordes. Los dos números están atados — ver `.rt-wave`
        en globals.css.
      */}
      {/* `grano-capa`: la ola es un `<img>`, así que el grano no puede ir de
          fondo. La tira no lleva contenido, el emblema va en su propio div. */}
      <div className="grano-capa pointer-events-none absolute inset-x-0 bottom-[-1px] z-30 overflow-hidden">
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

        ⚠️ Y AHORA BAJA EN LAS CHICAS, QUE ES LO CONTRARIO DE LO QUE HACÍA.
        Mientras el emblema estaba recortado y apoyado en el borde, agrandarlo
        en mobile era lo correcto: no tapaba nada. Desde que está entero y
        montado sobre la ola, la mitad de abajo cae sobre la sección siguiente
        y se come el titular. Camila: «en tablet y mobile achicá el elemento
        para que no pise el texto».

        Medido contra el `h2` de «Not a restaurant», que es lo que empezaba a
        pisar: a 390 el 18 % deja 11px de aire y a 834 el 11 % deja 8. Los
        porcentajes de arriba —24, 16, 10.83— daban 52 y 85px de solape.

        El centrado no cambia: sigue siendo `left-1/2` con `-translate-x-1/2`.

        ══════════════════════════════════════════════════════════════════
        ⚠️ LOS PORCENTAJES SUBIERON UN 48.8 % AL CAMBIAR DE ARCHIVO, Y NO ES
        QUE EL EMBLEMA HAYA CRECIDO. Antes acá iba `emblem-crop.svg`, que es
        una VENTANA de 170×148 sobre un dibujo de 253×253: le faltaban tres
        lados. Con la sombra de sticker eso se volvió evidente —Camila: «se ve
        cortado, acá tenés el elemento completo»— porque un troquel cortado a
        pico deja de leerse como troquel.

        `emblem.svg` es el dibujo entero. Como es 253 de ancho donde el otro
        era 170, el mismo porcentaje daría un disco más chico: los tres suben
        por 253/170 para que el emblema se vea del mismo tamaño que antes.

        ⚠️ Y AHORA SÍ QUEDA CENTRADO DE VERDAD. En el recorte el disco caía al
        74 % de la caja, así que centrar la caja dejaba el dibujo 38px corrido
        a la derecha. El archivo completo tiene el disco en su centro.
        ══════════════════════════════════════════════════════════════════
      */}
      {/*
        ⚠️ EL `translate-y` BAJA EL EMBLEMA HASTA QUE SU CENTRO CAE EN LA LÍNEA
        DE LA OLA. Pedido de Camila: «el elemento más abajo, más o menos la
        mitad del elemento a la altura de las olas».

        Anclado en `bottom`, el emblema queda entero ARRIBA del borde de la
        sección, y el borde no es donde está la ola: la cenefa ondula, y su
        línea pasa —medido en tres anchos— a un 25 % del alto de la tira por
        encima del borde.

        ⚠️ SON TRES PORCENTAJES DISTINTOS Y NO UNO, Y SALEN DE UNA CUENTA. El
        corrimiento que hace falta es `alto/2 − 0.25 × tira`, y los dos
        términos escalan con el ancho de la ventana pero con proporciones
        distintas: la tira mide siempre el 12.3 % del ancho, y el emblema el
        16.11 %, 23.8 % o 35.6 % según el breakpoint. Como el `translate` es
        porcentaje del PROPIO elemento, el número cambia con él:

            desk    0.5 − 0.25 × 12.3/16.11 = 30.9 %
            md      0.5 − 0.25 × 12.2/11    = 22.3 %
            mobile  0.5 − 0.25 × 12.3/18    = 32.9 %

        Si cambia el ancho del emblema, estos tres se recalculan con esa
        fórmula. No son valores a ojo.
      */}
      <div className="pointer-events-none absolute bottom-[-1px] left-1/2 z-30 w-[18%] -translate-x-1/2 translate-y-[32.9%] md:w-[11%] md:translate-y-[22.3%] lg:w-[16.11%] lg:translate-y-[30.9%]">
        {/*
          ⚠️ VA CON `sticker`, LA MISMA CLASE DEL LOGO DEL HEADER. Pedido de
          Camila: «hacé acá también lo mismo, sombra a este elemento para que
          se vea como sticker».

          Es la misma pieza conceptual: un troquel apoyado encima de otra cosa.
          Acá el troquel ya viene dibujado en el SVG —el borde festoneado es
          parte del archivo— así que lo único que faltaba era la sombra que lo
          despega. Comparten la clase a propósito: si la sombra del sticker se
          retoca, los dos se mueven juntos.

          ⚠️ LA SOMBRA CAE SOBRE DOS SUPERFICIES DISTINTAS Y ESO ESTÁ BIEN: la
          mitad de arriba del emblema está sobre la foto oscura y la de abajo
          sobre la ola de hueso. Un `drop-shadow` sigue el alfa del dibujo, así
          que la sombra cruza el borde de la ola con la figura en vez de
          cortarse en él.
        */}
        <Image
          src="/brand/emblem.svg"
          alt=""
          width={253}
          height={253}
          className="sticker block w-full"
        />
      </div>
    </section>
  );
}
