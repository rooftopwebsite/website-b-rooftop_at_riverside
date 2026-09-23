import Image from 'next/image';
import WallVideo from './WallVideo';
import { WALL as SLOTS, type Slot } from './wall-slots';

const COLUMNAS = [
  { duracion: '[--wall-duration:44s]', reverse: false, visible: '' },
  { duracion: '[--wall-duration:58s]', reverse: true, visible: '' },
  { duracion: '[--wall-duration:50s]', reverse: false, visible: 'hidden sm:flex' },
] as const;

const POR_COLUMNA = 6;

function Tile({ slot }: { readonly slot: Slot }) {
  return (
    <div className="mb-3.5 aspect-[3/4] w-full shrink-0 overflow-hidden rounded-card bg-bone">
      {slot.tipo === 'video' ? (
        <WallVideo src={slot.src} poster={slot.poster} />
      ) : (
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
      tabIndex={0}
      role="group"
      aria-label={etiqueta}
    >
      <div className="rt-wall-track">
        <div className="flex w-full flex-col">{copia}</div>
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
