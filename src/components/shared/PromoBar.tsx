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
/**
 * ⚠️ `soloDesk` no es un detalle de responsive, es una decisión de contenido.
 *
 * Los cuatro hechos en un teléfono de 390px envuelven a TRES LÍNEAS y la
 * franja pasa a medir 83px — casi un tercio de la primera pantalla, con lo que
 * el muro de videos del hero deja de entrar. Medido y comparado en tres
 * variantes contra el sitio real.
 *
 * Así que en mobile quedan DOS, y no son los dos primeros: son los dos que más
 * diferencian al lugar. «Four food trucks» es lo que nadie más tiene en la
 * zona, y «Walk in, no reservations» es el que saca fricción — la pregunta que
 * frena a alguien que está decidiendo si venir ahora.
 *
 * Los otros dos no se pierden: «Rooftop bar» está en el titular del hero y en
 * el nombre del lugar, y «Live music five nights» tiene su propia sección y su
 * página. Repetirlos acá, a costa de la primera pantalla del teléfono, no
 * pagaba.
 *
 * Con 37px de alto la franja cuesta lo mismo que la de horarios, que es la
 * referencia que puso Camila.
 */
const FACTS = [
  { texto: 'Four food trucks', soloDesk: false },
  { texto: 'Rooftop bar', soloDesk: true },
  { texto: 'Live music five nights', soloDesk: true },
  /*
    ⚠️ `corto` existe porque «Walk in, no reservations» con 0.24em de tracking
    no entra en un renglón junto al primer hecho: la franja volvía a dos líneas
    y 60px de alto.

    Medido con la fuente real a 390px, sobre los 358px que da la fila:

      Four food trucks           175px  (fijo, más 23 de separador)
      Walk in, no reservations   252px  → 450  no entra
      No reservations            163px  → 361  no entra POR 3px
      Walk-ins only              138px  → 336  entra, con 22 de margen

    «No reservations» fallaba por tres píxeles, y tres píxeles no son un
    margen: cualquier ajuste de tracking o de fuente lo vuelve a partir. Va
    «Walk-ins only», que dice lo mismo y deja aire.
  */
  { texto: 'Walk in, no reservations', corto: 'Walk-ins only', soloDesk: false },
] as const;

export default function PromoBar() {
  /*
    ⚠️ `deeper` y no `deep`. Camila lo anotó en el boceto —«el verde + oscuro»—
    y el motivo es que la franja y el header eran EL MISMO verde: se leían como
    una sola barra de 101px, y entonces los cuatro hechos parecían parte de la
    navegación en vez de un banner. Con `deeper` (#013434) la franja se separa
    del header sin agregar una línea divisoria.

    El contraste sube, no baja: `paper/80` sobre `deep` daba 12.3:1 y sobre
    `deeper` da 13.4:1.
  */
  return (
    <div className="bg-deeper px-gutter md:px-gutter-lg">
      <ul className="caja flex flex-wrap items-center justify-center gap-x-[10px] gap-y-[4px] py-[9px]">
        {FACTS.map((fact) => (
          <li
            key={fact.texto}
            className={[
              'flex items-center gap-[10px]',
              fact.soloDesk ? 'hidden sm:flex' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {/*
              La viñeta separadora. Se oculta en el primer ítem con un selector
              CSS y no con una condición sobre el índice del map: los ítems que
              se esconden en mobile siguen estando en el DOM, así que el índice
              deja de decir quién quedó primero en pantalla. Acá el primero del
              DOM siempre se ve, pero el selector lo resuelve el navegador y no
              se rompe si mañana cambia cuál se oculta.

              Decorativa, así que `aria-hidden`: la lista ya se anuncia como
              lista y nadie tiene que oír «punto» tres veces.
            */}
            <span
              aria-hidden="true"
              className="h-[3px] w-[3px] rounded-pill bg-sunset [li:first-child_&]:hidden"
            />
            {/*
              `paper` al 80% sobre `deep` da 12.3:1.

              ⚠️ Cuando hay versión corta se renderizan LAS DOS y se alterna con
              CSS, en vez de elegir una en JavaScript. Elegirla en el cliente
              obligaría a saber el ancho de pantalla antes de pintar, que en un
              server component no se sabe: o se manda un `useEffect` —y entonces
              el texto salta después de hidratar— o se manda mal en el HTML
              inicial. Con las dos en el DOM el HTML es correcto desde el primer
              byte y no hay salto.

              ⚠️ Y NO llevan `aria-hidden`. Un elemento en `display:none` ya sale
              del árbol de accesibilidad, así que el lector de pantalla oye
              exactamente el que se ve — que es lo que pide WCAG 2.5.3. Ponerle
              `aria-hidden` al de escritorio fue el primer intento y estaba mal
              al revés: en desktop hacía que se leyera la versión corta, la que
              NO está en pantalla.
            */}
            {'corto' in fact ? (
              <>
                <span className="eyebrow text-paper/80 sm:hidden">{fact.corto}</span>
                <span className="eyebrow hidden text-paper/80 sm:inline">{fact.texto}</span>
              </>
            ) : (
              <span className="eyebrow text-paper/80">{fact.texto}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
