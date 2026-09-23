import Image from 'next/image';
import WallVideo from './WallVideo';
import { WALL as SLOTS, type Slot } from './wall-slots';

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
 * ⚠️ YA HAY MATERIAL REAL. Los doce recuadros rotulados «video» se fueron
 * cuando Camila entregó `public/multimedia/`. Ahora son 2 clips y 10 fotos
 * verticales — ver la nota de `SLOTS` para por qué esa proporción.
 *
 * ⚠️ Server component. El loop es CSS puro y el fallback de reduced-motion
 * también. Ver la nota de `.rt-wall` en globals.css.
 *
 * ⚠️ CON `prefers-reduced-motion` la columna deja de correr Y los dos clips se
 * cambian por su póster. Lo segundo NO se puede hacer con CSS: el
 * `@media (prefers-reduced-motion)` de `.rt-wall` detiene la animación del
 * track, pero un `<video autoPlay>` sigue reproduciéndose abajo. Lo resuelve
 * `WallVideo`, que es el único pedazo cliente de este muro.
 */

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
/* `duracion` es una CLASE que fija `--wall-duration` (la lee `.rt-wall` en
   globals.css). Hasta el 2026-09-23 la variable se escribía en `style`. */
const COLUMNAS = [
  { duracion: '[--wall-duration:44s]', reverse: false, visible: '' },
  { duracion: '[--wall-duration:58s]', reverse: true, visible: '' },
  { duracion: '[--wall-duration:50s]', reverse: false, visible: 'hidden sm:flex' },
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

function Tile({ slot }: { readonly slot: Slot }) {
  return (
    /*
      ⚠️ Se fueron el `bg-bone` y el `ring-fog` que dibujaban el hueco vacío.
      Con material real el tile no necesita que se le marque el borde: la
      imagen ES el borde. El `bg-bone` se queda sólo como color de espera
      mientras carga.
    */
    <div className="mb-3.5 aspect-[3/4] w-full shrink-0 overflow-hidden rounded-card bg-bone">
      {slot.tipo === 'video' ? (
        /* ⚠️ Componente CLIENTE, en su propio archivo. Un `<video autoPlay>` no
           se apaga con CSS, así que `prefers-reduced-motion` necesita
           JavaScript para cambiarlo por el póster. Es lo único de este muro
           que viaja al bundle. Ver `WallVideo.tsx`. */
        <WallVideo src={slot.src} poster={slot.poster} />
      ) : (
        /* ⚠️ `alt=""` y `aria-hidden`: el muro es ATMÓSFERA. Son doce piezas
           decorativas del lugar, y describirlas una por una obligaría a un
           lector de pantalla a escuchar doce descripciones antes de llegar al
           titular. El contenido informativo del hero es el texto. */
        <Image
          src={slot.src}
          alt=""
          aria-hidden="true"
          width={540}
          height={720}
          sizes="(max-width: 1343px) 33vw, 240px"
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
  readonly slots: readonly Slot[];
  readonly duracion: string;
  readonly reverse: boolean;
  readonly visible: string;
  readonly etiqueta: string;
}) {
  const copia = slots.map((slot, i) => <Tile key={i} slot={slot} />);
  return (
    <div
      className={[
        'rt-wall min-h-0 flex-1',
        duracion,
        reverse ? 'rt-wall-reverse' : '',
        visible || 'flex',
      ]
        .filter(Boolean)
        .join(' ')}
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
    <div className="flex h-full min-h-0 gap-3.5">
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
