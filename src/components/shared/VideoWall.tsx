/**
 * El muro del hero: dos filas de piezas cortas del lugar, en loop opuesto.
 *
 * Es la forma del hero de Superside, que Camila fijó como referencia: titular,
 * bajada corta, un CTA, y debajo dos filas de tiles que corren.
 *
 * ⚠️ TODAVÍA NO HAY VIDEOS. En `public/` no hay ni un `.mp4`. Cada slot es un
 * recuadro gris rotulado «video» —decisión de Camila: «poné los recuadros en
 * gris que digan video»— y el componente ya está cableado para el `<video>`:
 * cuando lleguen los clips se cambia `SLOTS` por sus rutas y no se toca nada
 * más.
 *
 * ⚠️ SON DOCE, seis por fila, y es un mínimo medido y no un número redondo:
 * con menos de seis por fila el loop repite el mismo tile en pantalla al mismo
 * tiempo. Lo ideal son dieciséis.
 *
 * Especificación de los clips, para pedírselos al cliente: 3:4 vertical,
 * 4–8 s, sin audio, ~1–2 MB cada uno, .mp4 H.264.
 *
 * ⚠️ Server component. No hay estado ni medición: el loop es CSS puro y el
 * fallback de reduced-motion también. Ver la nota de `.rt-wall` en globals.css.
 */

/**
 * Los doce slots. `null` = todavía no llegó el clip.
 *
 * ⚠️ Cuando lleguen, van acá con su ruta y su descripción. La descripción NO
 * es un `alt` decorativo: si un clip muestra algo que el texto de la página no
 * dice, hay que decidir si el video informa o decora. Los decorativos van con
 * `aria-hidden`, que es lo que hacen hoy los placeholders.
 */
const SLOTS: readonly (string | null)[] = Array.from({ length: 12 }, () => null);

const POR_FILA = 6;

function Tile({ src }: { readonly src: string | null }) {
  return (
    <div className="mr-[12px] aspect-[3/4] w-[132px] shrink-0 overflow-hidden rounded-card bg-paper/12 lg:w-[176px]">
      {src === null ? (
        <div className="grid h-full place-items-center">
          {/*
            El rótulo del hueco. Se VE a propósito: el brief pide que lo que
            falta esté marcado, porque un hueco silencioso se publica sin que
            nadie lo note.

            ⚠️ Al 75% y no al 55%, que fue el primer intento. Es un color
            COMPUESTO —`paper` translúcido sobre `paper/12` sobre `deep`— y eso
            no lo puede prever la tabla de pares de `docs/contrast-audit.md`:
            sólo se ve midiendo el píxel renderizado, que es lo que hace axe.
            Y lo midió: al 55% daba **3.51:1** contra el 4.5:1 que pide un
            texto de 13px. Calculado sobre el fondo real (#1f5b5a): 0.70 da
            4.65:1 y 0.75 da 5.08:1. Va el 0.75, para tener margen.
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

function Fila({
  slots,
  reverse,
  etiqueta,
}: {
  readonly slots: readonly (string | null)[];
  readonly reverse: boolean;
  readonly etiqueta: string;
}) {
  const tiles = slots.map((src, i) => <Tile key={i} src={src} />);
  return (
    <div
      className={['rt-wall', reverse ? 'rt-wall-reverse' : ''].filter(Boolean).join(' ')}
      /*
        ⚠️ `tabIndex` y `role`: con reduced-motion la fila deja de correr y pasa
        a scrollearse a mano, y una región scrolleable sin nada enfocable
        adentro es contenido que existe y no se puede alcanzar con teclado. Es
        el fallo `scrollable-region-focusable` de axe, el mismo que tenía la
        franja de horarios.
      */
      tabIndex={0}
      role="group"
      aria-label={etiqueta}
    >
      <div className="rt-wall-track">
        <div className="flex shrink-0">{tiles}</div>
        {/* La copia que cierra el loop. Mismo contenido, así que `aria-hidden`. */}
        <div className="flex shrink-0" aria-hidden="true">
          {tiles}
        </div>
      </div>
    </div>
  );
}

export default function VideoWall() {
  const primera = SLOTS.slice(0, POR_FILA);
  const segunda = SLOTS.slice(POR_FILA);

  return (
    <div className="flex flex-col gap-[12px]">
      <Fila slots={primera} reverse={false} etiqueta="Clips of the venue" />
      {/* La segunda va al revés: dos filas en la misma dirección se leen como
          una sola banda ancha y se pierde el juego. */}
      <Fila slots={segunda} reverse etiqueta="More clips of the venue" />
    </div>
  );
}
