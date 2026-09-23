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
 * acertaría en un ancho y taparía media tarjeta en otro. Un `ResizeObserver`
 * publica el alto como `--cabeza` en el envoltorio, y las tarjetas lo usan en
 * su `top`. Mientras no se midió vale 0, que es lo que había antes: la pila
 * pegada bajo el header.
 *
 * ⚠️ EL ENCABEZADO LLEVA EL FONDO DE LA SECCIÓN (`fondo`), y es obligatorio:
 * las tarjetas pasan POR DEBAJO de él al subir, y sin fondo propio se verían a
 * través del titular.
 * ══════════════════════════════════════════════════════════════════════════
 */
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
  const ref = useRef<HTMLDivElement | null>(null);
  const [alto, setAlto] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    /* Una medida apenas monta y después cada cambio: el observador no siempre
       entrega la primera lectura si la caja ya tenía su alto al observarla. */
    const medir = () => setAlto(el.offsetHeight);
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    window.addEventListener('resize', medir);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', medir);
    };
  }, []);

  return (
    <div style={{ '--cabeza': `${alto}px` } as CSSProperties}>
      {/*
        ⚠️ `top-[78px]` ES EL ALTO DEL HEADER, que es `sticky top-0` y mide 78
        en todos los anchos. Es el mismo número que ya usaba la pila.
        ⚠️ `-mx-gutter px-gutter`: el fondo llega al borde de la sección para
        tapar también la sombra de las tarjetas, que se pasa de la caja.
      */}
      <div ref={ref} className={`sticky top-[78px] z-20 -mx-gutter px-gutter pt-4 pb-8 ${fondo}`}>
        {cabeza}
      </div>
      {children}
    </div>
  );
}
