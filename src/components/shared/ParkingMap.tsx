/**
 * EL MAPA DE ESTACIONAMIENTO, dibujado.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ DE DÓNDE SALE EL DATO. De la página `/parking` del sitio viejo del
 * cliente (`eatdrinkparadise.com/parking`), que Camila pasó el 2026-09-22. Esa
 * página tiene UNA captura de pantalla de Google Maps del 29 de diciembre de
 * 2023 —«Screenshot 2023-12-29 at 11.51.36 AM.jpg»—, un título que dice
 * «Parking Locations» y un pie que dice «Available Parking Areas». Nada más:
 * ni una lista, ni una leyenda, ni un nombre de zona.
 *
 * O sea que TODO el dato está adentro de la imagen, en dos colores: los lotes
 * pintados en ocre y los tramos de calle resaltados en naranja.
 *
 * ⚠️ POR QUÉ SE REDIBUJA Y NO SE PUBLICA LA CAPTURA. Tres motivos, en orden de
 * peso:
 *
 *   · La captura son tiles de Google con su marca adentro. Republicarla en el
 *     sitio del cliente es servir material ajeno como propio.
 *   · A 1314 px de ancho y con el texto quemado en el JPG, en un teléfono no
 *     se lee: el nombre de las calles queda en cuatro píxeles de alto.
 *   · Una imagen no le dice NADA a un lector de pantalla. Acá cada zona es un
 *     ítem de una lista con su nombre escrito, y el dibujo queda como ayuda
 *     visual —`aria-hidden`— en vez de ser el único portador del dato.
 *
 * ⚠️ LOS NOMBRES DE LAS ZONAS SON NUESTROS, y hay que saberlo. El cliente no
 * nombró ninguna salvo «LIBRARY PARKING», que es la única etiqueta escrita en
 * la captura. Las otras cuatro están nombradas por la calle sobre la que caen,
 * que es leer el mapa y no inventarlo, pero conviene que el cliente las
 * confirme antes de tratarlas como oficiales. Ver `docs/pedido-al-cliente.md`.
 *
 * ⚠️ QUÉ QUEDÓ AFUERA, a propósito. La captura marca además dos manchas mucho
 * más al sur —sobre Front St y sobre Abernathy St, pasando la rotonda—. El
 * dibujo corta en Childers St: estirarlo hasta Abernathy agrega media milla de
 * mapa vacío y achica a la mitad las cinco zonas que alguien va a usar de
 * verdad. Las dos del sur se cuentan en una línea de texto abajo de la lista.
 * ══════════════════════════════════════════════════════════════════════════
 */

/**
 * El lienzo.
 *
 * ⚠️ LAS COORDENADAS SALEN DE LA CAPTURA, trasladadas. La imagen original mide
 * 1314 × 1396; de ahí se recorta el pedazo que va del río a Childers St y de
 * Old 41 a Shriver Ave, o sea `x` de 480 a 1150 y `y` de 60 a 960. Cada punto
 * de este archivo es `x_captura - 480` y `y_captura - 60`. Si alguna vez hay
 * que corregir una zona contra la captura, esa resta es toda la conversión.
 */
const VB = { w: 670, h: 900 } as const;

/** Las dos avenidas y las tres calles que ordenan el dibujo. */
const CALLES = {
  old41: 188,
  felts: 412,
  shriver: 630,
  wilson: 421,
  childers: 843,
  /** El borde norte de la manzana de la biblioteca. */
  library: 640,
} as const;

/**
 * Las cinco zonas, en el orden en que aparecen bajando por el mapa.
 *
 * ⚠️ LA GEOMETRÍA Y EL TEXTO VIVEN JUNTOS y no en `content/`, que es donde va
 * el resto del copy del sitio. El motivo es que acá las dos cosas son UNA: el
 * número de la píldora naranja sobre el dibujo y el número del ítem de la
 * lista tienen que ser el mismo, y partirlos en dos archivos que se ordenan
 * por índice es la forma más barata de que un día digan cosas distintas.
 *
 * `pin` es dónde cae la píldora numerada sobre el dibujo, que no siempre es el
 * centro de la mancha: en las zonas finitas —una tira de calle de 15 unidades
 * de ancho— el número se corre a un costado para no taparla.
 */
const ZONAS = [
  {
    n: 1,
    nombre: 'Wilson St lot',
    detalle: 'The big one, between the river and Wilson St. Half a block north of the door.',
    forma: { x: 210, y: 150, w: 195, h: 255, rx: 6 },
    pin: { x: 307, y: 275 },
  },
  {
    n: 2,
    nombre: 'Old 41 Rd',
    detalle: 'Two short rows off the road, on our side. The closest ones marked.',
    forma: [
      { x: 210, y: 600, w: 122, h: 18, rx: 4 },
      { x: 210, y: 648, w: 145, h: 20, rx: 4 },
    ],
    pin: { x: 378, y: 630 },
  },
  {
    n: 3,
    nombre: 'Felts Ave',
    detalle: 'Street parking the length of the avenue, one block east.',
    forma: { x: 404, y: 430, w: 16, h: 405, rx: 8 },
    pin: { x: 412, y: 505 },
  },
  {
    n: 4,
    nombre: 'Library lot',
    detalle: 'The Bonita Springs Public Library lot, off Felts Ave.',
    forma: { x: 432, y: 658, w: 180, h: 168, rx: 6 },
    pin: { x: 522, y: 742 },
  },
  {
    n: 5,
    nombre: 'Childers St',
    detalle: 'Along the park, two blocks south. Runs both sides of Old 41.',
    forma: { x: 20, y: 836, w: 380, h: 15, rx: 7 },
    pin: { x: 105, y: 843 },
  },
] as const;

/** Una zona puede ser una mancha o varias; esto las deja siempre en lista. */
const formas = (f: (typeof ZONAS)[number]['forma']) => (Array.isArray(f) ? f : [f]);

/**
 * Una calle: una banda `paper` sobre la tierra `bone`, con su filete `fog`.
 *
 * ⚠️ SON DOS TRAZOS Y NO UN RECTÁNGULO CON BORDE. Con rectángulo, los cruces
 * de calle dibujan el borde de una arriba de la otra y la esquina queda
 * cosida. Con dos trazos —el ancho en `fog` abajo, el de adentro en `paper`
 * arriba— todas las calles se pintan primero por fuera y después por dentro, y
 * los cruces se limpian solos.
 */
function Calle({
  d,
  ancho,
}: {
  readonly d: string;
  readonly ancho: number;
}) {
  return (
    <>
      <path d={d} stroke="var(--color-fog)" strokeWidth={ancho + 2} fill="none" />
      <path d={d} stroke="var(--color-paper)" strokeWidth={ancho} fill="none" />
    </>
  );
}

export default function ParkingMap({ className = '' }: { readonly className?: string }) {
  return (
    <div className={className}>
      {/*
        ⚠️ EL MARCO ES EL MISMO QUE EL DEL MAPA DE GOOGLE de dos secciones más
        arriba —`rounded-card`, borde `ink/12`—, y es a propósito: en la misma
        página hay dos mapas y tienen que leerse como dos piezas de la misma
        familia, no como una pieza del sitio y una incrustación ajena.
      */}
      <div className="overflow-hidden rounded-card border border-ink/12">
        <svg
          viewBox={`0 0 ${VB.w} ${VB.h}`}
          className="block h-auto w-full"
          aria-hidden="true"
          focusable="false"
        >
          {/* La tierra. */}
          <rect width={VB.w} height={VB.h} fill="var(--color-bone)" />

          {/*
            El río Imperial, que es el punto de referencia que cualquiera
            reconoce al llegar por Old 41. Va en `river`, el teal del isotipo,
            que en el sitio significa agua en todas partes.
          */}
          <path
            d="M-20 172 C 90 165, 170 150, 300 122 C 400 100, 470 48, 690 36"
            stroke="var(--color-river)"
            strokeWidth={34}
            strokeLinecap="round"
            fill="none"
            opacity={0.55}
          />

          {/* Las calles, de la más ancha a la más angosta. */}
          <Calle d={`M${CALLES.old41} -20 L${CALLES.old41} ${VB.h + 20}`} ancho={26} />
          <Calle d={`M${CALLES.felts} 120 L${CALLES.felts} ${VB.h + 20}`} ancho={15} />
          <Calle d={`M${CALLES.shriver} 120 L${CALLES.shriver} ${VB.h + 20}`} ancho={15} />
          <Calle d={`M${CALLES.old41} ${CALLES.wilson} L${VB.w + 20} ${CALLES.wilson}`} ancho={15} />
          <Calle d={`M-20 ${CALLES.childers} L${VB.w + 20} ${CALLES.childers}`} ancho={15} />
          <Calle
            d={`M${CALLES.felts} ${CALLES.library} L${VB.w + 20} ${CALLES.library}`}
            ancho={12}
          />

          {/* Las zonas. */}
          {ZONAS.flatMap((z) =>
            formas(z.forma).map((f, i) => (
              <rect
                key={`${z.n}-${i}`}
                x={f.x}
                y={f.y}
                width={f.w}
                height={f.h}
                rx={f.rx}
                fill="var(--color-sunset)"
                opacity={0.9}
              />
            )),
          )}

          {/*
            El nombre de cada calle, sobre su propia banda blanca y en caja
            baja. La captura del cliente las escribe en mayúscula porque es el
            estilo de Google; acá mandan las reglas del sitio, donde la caja
            alta está reservada a los rótulos y a lo que se toca.
          */}
          <g fill="var(--color-muted)" fontSize={19} className="font-body">
            <text
              x={CALLES.old41}
              y={760}
              textAnchor="middle"
              transform={`rotate(-90 ${CALLES.old41} 760)`}
            >
              Old 41 Rd
            </text>
            <text
              x={CALLES.felts}
              y={340}
              textAnchor="middle"
              transform={`rotate(-90 ${CALLES.felts} 340)`}
            >
              Felts Ave
            </text>
            <text
              x={CALLES.shriver}
              y={330}
              textAnchor="middle"
              transform={`rotate(-90 ${CALLES.shriver} 330)`}
            >
              Shriver Ave
            </text>
            <text x={455} y={426}>
              Wilson St
            </text>
            <text x={455} y={848}>
              Childers St
            </text>
          </g>

          {/*
            ⚠️ EL VENUE VA EN `deep` Y NO EN NARANJA. El naranja en este dibujo
            quiere decir «acá se estaciona» y nada más; si el marcador de la
            casa fuera naranja, sería la sexta mancha del mismo color y habría
            que explicar por qué esa no es un lote. El verde oscuro es el otro
            color fuerte del sistema y acá significa «nosotros».
          */}
          <g>
            <circle cx={250} cy={585} r={14} fill="var(--color-deep)" />
            <circle cx={250} cy={585} r={5} fill="var(--color-paper)" />
            <text
              x={272}
              y={591}
              fill="var(--color-ink)"
              fontSize={23}
              fontWeight={700}
              className="font-body"
            >
              We’re here
            </text>
          </g>

          {/*
            Las píldoras numeradas, que son la llave de la lista de al lado.

            ⚠️ EL NÚMERO VA EN NEGRO SOBRE EL NARANJA. Es la regla del token:
            `--color-sunset` con texto blanco da 2.54:1. Está escrita en
            `globals.css` al lado de la definición del color.
          */}
          {ZONAS.map((z) => (
            <g key={z.n}>
              <circle cx={z.pin.x} cy={z.pin.y} r={15} fill="var(--color-sunset)" />
              <circle
                cx={z.pin.x}
                cy={z.pin.y}
                r={15}
                fill="none"
                stroke="var(--color-paper)"
                strokeWidth={2}
              />
              <text
                x={z.pin.x}
                y={z.pin.y + 6}
                textAnchor="middle"
                fill="var(--color-ink)"
                fontSize={19}
                fontWeight={700}
                className="font-body"
              >
                {z.n}
              </text>
            </g>
          ))}

          {/* El norte. Chico y callado, pero es lo que deja casar el dibujo
              con lo que se ve por el parabrisas. */}
          <g stroke="var(--color-muted)" strokeWidth={1.5} fill="none">
            <path d="M32 54 L32 34" strokeLinecap="round" />
            <path d="M27 40 L32 33 L37 40" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <text
            x={32}
            y={72}
            textAnchor="middle"
            fill="var(--color-muted)"
            fontSize={16}
            className="font-body"
          >
            N
          </text>
        </svg>
      </div>
    </div>
  );
}

/**
 * La lista, que es donde vive el dato de verdad.
 *
 * ⚠️ NO ES LA LEYENDA DEL DIBUJO: ES AL REVÉS. El dibujo está `aria-hidden` y
 * esta lista se lee sola, con el nombre y la ubicación de cada zona escritos.
 * Quien ve el mapa usa los números para saltar de una a la otra; quien no lo
 * ve —o lo ve en un teléfono al sol— tiene el mismo dato en texto.
 */
export function ParkingList({ className = '' }: { readonly className?: string }) {
  return (
    <div className={className}>
      <ol className="m-0 flex list-none flex-col gap-[26px] p-0">
        {ZONAS.map((z) => (
          <li key={z.n} className="flex gap-[14px]">
            <span
              aria-hidden="true"
              className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-pill bg-sunset font-body text-[15px] font-bold text-ink"
            >
              {z.n}
            </span>
            <span className="block">
              <span className="block font-body text-[19px] font-bold leading-[1.3] text-ink">
                {z.nombre}
              </span>
              <span className="mt-1 block font-body text-[16px] font-light leading-[1.55] text-body">
                {z.detalle}
              </span>
            </span>
          </li>
        ))}
      </ol>

      {/*
        ⚠️ ESTA LÍNEA NO ES UN RELLENO. La captura del cliente marca dos zonas
        más al sur que el dibujo no llega a mostrar, y callarlas sería publicar
        un mapa que dice menos que la fuente. Decirlas en una línea cuesta un
        renglón y deja el dibujo legible.
      */}
      <p className="mt-[22px] border-t border-fog pt-[18px] font-body text-[16px] font-light leading-[1.55] text-muted">
        Past the roundabout there is more marked parking on Front St and Abernathy St, a few blocks
        south.
      </p>
    </div>
  );
}
