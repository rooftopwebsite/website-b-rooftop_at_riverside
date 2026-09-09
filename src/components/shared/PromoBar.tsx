/**
 * Banner promocional: los cuatro hechos del lugar, arriba del header.
 *
 * Los hechos venían de la fila `FACTS` del hero. Camila los quiso arriba,
 * «como hoy está el Closed now pero arriba, como un banner promocional» — y
 * como la `StatusBar`, esto vive en el layout, así que aparece en las 23 rutas.
 *
 * ⚠️ NO es sticky: está en el flujo del documento y se va con el scroll. Es lo
 * que pidió Camila, y es también la razón por la que el header pasó de `fixed`
 * a `sticky`: un banner que se va debajo de un header fijo queda tapado de
 * entrada y deja un hueco después. Ver la nota de Header.tsx.
 *
 * ⚠️ Es una `<ul>` y no una fila de `<span>`: son cuatro hechos independientes
 * y un lector de pantalla tiene que poder contarlos. Las viñetas van
 * `aria-hidden` porque la lista ya se anuncia como lista — si no, se oiría
 * «punto» cuatro veces.
 *
 * ⚠️ Son HECHOS VERIFICADOS, no promesas de marketing: los cuatro trucks, el
 * rooftop, las cinco noches de música y el «sin reservas» están confirmados en
 * el resto del sitio. Acá no se anuncia nada nuevo.
 */
const FACTS = [
  'Four food trucks',
  'Rooftop bar',
  'Live music five nights',
  'Walk in, no reservations',
] as const;

export default function PromoBar() {
  return (
    <div className="bg-deep px-gutter md:px-gutter-lg">
      <ul className="caja flex flex-wrap items-center justify-center gap-x-[10px] gap-y-[4px] py-[9px]">
        {FACTS.map((fact, i) => (
          <li key={fact} className="flex items-center gap-[10px]">
            {i > 0 ? (
              <span aria-hidden="true" className="h-[3px] w-[3px] rounded-pill bg-sunset" />
            ) : null}
            {/* `paper` al 80% sobre `deep` da 12.3:1. */}
            <span className="eyebrow text-paper/80">{fact}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
