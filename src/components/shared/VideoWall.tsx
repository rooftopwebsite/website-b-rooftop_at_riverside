/**
 * El muro del hero: columnas de piezas cortas del lugar, corriendo en VERTICAL.
 *
 * Camila: «los videos deben correr en vertical como en superside» y «ojo que en
 * desk el hero se ve de una manera y en mobile de otra».
 *
 * ⚠️ ERA HORIZONTAL —dos filas cruzando la pantalla— y el cambio no es
 * cosmético. En un hero de alto completo con el texto a la izquierda, una cinta
 * horizontal cruza la composición y compite con la lectura del titular. Las
 * columnas acompañan el alto y se leen como un panel al costado.
 *
 * ⚠️ TODAVÍA NO HAY VIDEOS. En `public/` no hay ni un `.mp4`. Cada slot es un
 * recuadro gris rotulado «video» —pedido de Camila— y ya está cableado para el
 * `<video>`: cuando lleguen los clips se cambia `SLOTS` y no se toca nada más.
 *
 * Especificación para pedírselos al cliente: 3:4 vertical, 4–8 s, sin audio,
 * ~1–2 MB cada uno, .mp4 H.264.
 *
 * ⚠️ Server component. El loop es CSS puro y el fallback de reduced-motion
 * también. Ver la nota de `.rt-wall` en globals.css.
 */

/** Los slots. `null` = todavía no llegó el clip. */
const SLOTS: readonly (string | null)[] = Array.from({ length: 12 }, () => null);

/**
 * Cuántas columnas y con qué velocidad.
 *
 * ⚠️ Las velocidades son DISTINTAS y los sentidos ALTERNAN a propósito. Con
 * todas iguales el muro se lee como una sola imagen que se desliza; desfasadas
 * se lee como piezas independientes, que es lo que son.
 *
 * ⚠️ El conteo cambia por breakpoint y por eso las columnas de más se ocultan
 * con CSS en vez de no renderizarse: el server no sabe el ancho de pantalla, y
 * decidirlo en el cliente significaría un salto después de hidratar.
 *
 * ⚠️ TRES, no cuatro. Lo pidió Camila señalando Superside, y midiendo el hero
 * de ellos se entiende por qué: con cuatro columnas cada tile queda en ~150px
 * de ancho y un plano medio filmado en vertical deja de leerse — se ve el
 * movimiento pero no QUÉ es. A tres, cada tile pasa de 200px y la pieza se
 * reconoce. En mobile son dos: la tercera aparece recién en `sm`.
 */
const COLUMNAS = [
  { duracion: '44s', reverse: false, visible: '' },
  { duracion: '58s', reverse: true, visible: '' },
  { duracion: '50s', reverse: false, visible: 'hidden sm:flex' },
] as const;

/**
 * Cuántos slots lleva cada columna antes de duplicarse.
 *
 * ⚠️ Es lo que hace que el loop sea infinito de verdad: la animación lleva el
 * track a `-50%`, o sea al punto donde la segunda copia queda donde arrancó la
 * primera. Para que no se vea el corte, UNA copia tiene que ser más ALTA que el
 * hero. Con tiles de 3:4 y columnas de ~200px, seis tiles dan ~1.600px, más que
 * cualquier pantalla de escritorio.
 */
const POR_COLUMNA = 6;

function Tile({ src }: { readonly src: string | null }) {
  return (
    <div className="mb-[14px] aspect-[3/4] w-full shrink-0 overflow-hidden rounded-card bg-paper/12">
      {src === null ? (
        <div className="grid h-full place-items-center">
          {/*
            El rótulo del hueco. Se VE a propósito: el brief pide que lo que
            falta esté marcado, porque un hueco silencioso se publica sin que
            nadie lo note.

            ⚠️ Al 75%. Es un color COMPUESTO —`paper` translúcido sobre
            `paper/12` sobre `deep`— y eso no lo puede prever la tabla de pares
            de contraste: sólo se ve midiendo el píxel renderizado. axe lo midió
            al 55% en 3.51:1 contra el 4.5:1 que pide un texto de 13px.
          */}
          <span className="eyebrow text-paper/75">video</span>
        </div>
      ) : (
        <video
          src={src}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}

function Columna({
  slots,
  duracion,
  reverse,
  visible,
  etiqueta,
}: {
  readonly slots: readonly (string | null)[];
  readonly duracion: string;
  readonly reverse: boolean;
  readonly visible: string;
  readonly etiqueta: string;
}) {
  const copia = slots.map((src, i) => <Tile key={i} src={src} />);
  return (
    <div
      className={[
        'rt-wall min-h-0 flex-1',
        reverse ? 'rt-wall-reverse' : '',
        visible || 'flex',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ '--wall-duration': duracion } as React.CSSProperties}
      /*
        ⚠️ `tabIndex` y `role`: con reduced-motion la columna deja de correr y
        pasa a scrollearse a mano, y una región scrolleable sin nada enfocable
        adentro es contenido que existe y no se puede alcanzar con teclado.
      */
      tabIndex={0}
      role="group"
      aria-label={etiqueta}
    >
      <div className="rt-wall-track">
        <div className="flex w-full flex-col">{copia}</div>
        {/* La copia que cierra el loop. Mismo contenido, así que `aria-hidden`. */}
        <div className="flex w-full flex-col" aria-hidden="true">
          {copia}
        </div>
      </div>
    </div>
  );
}

export default function VideoWall() {
  return (
    <div className="flex h-full min-h-0 gap-[14px]">
      {COLUMNAS.map((col, i) => (
        <Columna
          key={i}
          slots={SLOTS.slice(i * 2, i * 2 + POR_COLUMNA)}
          duracion={col.duracion}
          reverse={col.reverse}
          visible={col.visible}
          etiqueta={`Clips of the venue, column ${i + 1}`}
        />
      ))}
    </div>
  );
}
