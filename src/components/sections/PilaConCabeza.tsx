'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

/**
 * ══════════════════════════════════════════════════════════════════════════
 * UNA PILA DE TARJETAS CON SU ENCABEZADO PEGADO ARRIBA.
 *
 * ⚠️ LA USA `EventTypes` DESDE EL 2026-09-23. Camila pidió dos cosas juntas:
 * «en tablet y mobile falta que estas cards se superpongan como en desk», y
 * «mientras se superponen se vea el título y la bajada». Lo segundo obliga a
 * que el encabezado también sea `sticky`, y entonces cada tarjeta tiene que
 * pegarse DEBAJO de él y no debajo del header del sitio.
 *
 * ⚠️ POR ESO SE MIDE. El alto del encabezado cambia con el ancho —el titular
 * es `text-banda`, fluido, y cae en dos o tres renglones— y un número fijo
 * acertaría en un ancho y taparía media tarjeta en otro. Se publica como
 * `--cabeza` en el envoltorio, y las tarjetas lo usan en su `top`.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ EL ENCABEZADO SE SUELTA JUNTO CON LA ÚLTIMA TARJETA, y es el segundo
 * arreglo del mismo día. Camila: «al llegar la cuarta card sucede esto…
 * debería llegar y superponerse como todas las demás y empujar la sección
 * completa sin cortarse de esta forma».
 *
 * Qué pasaba: un `sticky` se suelta cuando termina SU contenedor. El del
 * encabezado era el envoltorio entero, y el de las tarjetas la `<ul>`. La
 * última tarjeta empieza a subir cuando el pie de la `<ul>` llega a su propio
 * pie pegado; el encabezado recién cuando ese mismo pie llega a SU pie pegado,
 * o sea `alto de la última + 24×(n−1)` píxeles más tarde. En ese tramo la
 * cuarta subía por debajo del titular, que seguía clavado, y se veía cortada.
 *
 * La salida: el encabezado vive en una capa `absolute` que termina justo esa
 * cantidad antes del pie (`cola`), así que su contenedor se acaba en el mismo
 * instante que el de las tarjetas y los dos suben juntos. En el flujo queda un
 * espaciador del alto del encabezado, para que las tarjetas arranquen debajo.
 *
 * ⚠️ HASTA QUE SE MIDE, EL ENCABEZADO VA EN FLUJO, como estaba. Es el HTML del
 * servidor: sin la medida, la capa absoluta taparía la primera tarjeta en el
 * primer pintado.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ EL ENCABEZADO LLEVA EL FONDO DE LA SECCIÓN (`fondo`), y es obligatorio:
 * las tarjetas pasan POR DEBAJO de él al subir, y sin fondo propio se verían a
 * través del titular.
 */
/** El escalón entre tarjetas pegadas. Tiene que ser el mismo del `top` de cada `<li>`. */
const ESCALON = 24;

export default function PilaConCabeza({
  cabeza,
  fondo,
  children,
}: {
  readonly cabeza: ReactNode;
  /** Las clases de fondo de la sección: `bg-mint grano`, por ejemplo. */
  readonly fondo: string;
  readonly children: ReactNode;
}) {
  const raiz = useRef<HTMLDivElement | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const [alto, setAlto] = useState(0);
  const [cola, setCola] = useState(0);

  useEffect(() => {
    const el = ref.current;
    const r = raiz.current;
    if (!el || !r) return;
    const medir = () => {
      setAlto(el.offsetHeight);
      const items = r.querySelectorAll(':scope > ul > li');
      const ultima = items[items.length - 1] as HTMLElement | undefined;
      setCola(ultima ? ultima.offsetHeight + ESCALON * (items.length - 1) : 0);
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    ro.observe(r);
    window.addEventListener('resize', medir);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', medir);
    };
  }, []);

  const medido = alto > 0;
  /*
    ⚠️ `top-[78px]` ES EL ALTO DEL HEADER, que es `sticky top-0` y mide 78
    en todos los anchos. Es el mismo número que ya usaba la pila.
    ⚠️ `-mx-gutter px-gutter`: el fondo llega al borde de la sección para
    tapar también la sombra de las tarjetas, que se pasa de la caja.
  */
  const encabezado = (
    <div ref={ref} className={`sticky top-[78px] z-20 -mx-gutter px-gutter pt-4 pb-8 ${fondo}`}>
      {cabeza}
    </div>
  );

  return (
    <div ref={raiz} className="relative" style={{ '--cabeza': `${alto}px` } as CSSProperties}>
      {/*
        La MISMA capa en los dos estados, sólo cambia su posición: si el
        encabezado cambiara de padre al medirse, React lo remontaría y el
        `ResizeObserver` quedaría mirando un nodo que ya no está.
      */}
      <div
        className={medido ? 'pointer-events-none absolute inset-x-0 top-0 z-20 [&>*]:pointer-events-auto' : 'relative'}
        style={medido ? { bottom: cola } : undefined}
      >
        {encabezado}
      </div>
      {medido ? <div aria-hidden="true" style={{ height: alto }} /> : null}
      {children}
    </div>
  );
}
