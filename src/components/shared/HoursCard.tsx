'use client';

import { useEffect, useState } from 'react';
import { useVenue } from './VenueProvider';
import type { Hours } from '@/types/content';
import { venueStatus } from '@/lib/hours';
import { CaretDown } from './Icon';

/**
 * La tarjeta de horarios, con el día de HOY abierto.
 *
 * ⚠️ ESTÁ SEPARADA DE `FindUs` PARA QUE `FindUs` NO SEA CLIENT. La sección
 * entera —los dos titulares, las redes, la tarjeta de contacto y el mapa— es
 * contenido estático que puede renderizarse en el servidor. Lo único que
 * necesita el navegador es esto: cuál es hoy y si está abierto ahora.
 *
 * Antes `FindUs` llevaba `'use client'` arriba de todo y arrastraba la
 * sección completa al bundle. Son ~7 KB de markup estático que no tenían por
 * qué viajar como JavaScript.
 *
 * ⚠️ ARRANCA SIN «HOY», y no es un detalle de implementación: el servidor no
 * sabe qué hora es en Bonita Springs para el visitante, y una página cacheada
 * publicaría un «today» equivocado — que en una tarjeta de horarios es el
 * peor error posible. En el primer pintado las siete filas se ven iguales, y
 * eso ya es información completa y correcta. El resaltado y el badge en vivo
 * aparecen al montar.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LAS FILAS SON CONTROLES DE VERDAD, y antes no lo eran. La versión previa
 * dibujaba un caret en las siete filas y no abría ninguna: sólo HOY mostraba
 * el desglose, y no se podía ni plegar esa ni abrir las otras. El comentario
 * de entonces defendía eso con el argumento de que «un acordeón que sólo tiene
 * un panel y no se puede cerrar es un control que miente» — cierto, pero la
 * salida no era sacar el acordeón sino hacerlo funcionar. Un caret que no
 * responde miente igual.
 *
 * Pedido de Camila: «que esto funcione; los días que no abren no tienen que
 * tener drop, los otros sí y se deben extender si los toco para mostrarme los
 * horarios de los food».
 *
 * Tres reglas, y las tres se leen abajo:
 *
 *   1. LOS DÍAS CERRADOS NO SON CONTROLES. Lunes y martes no llevan caret ni
 *      se abren, porque no hay nada abajo: si el bar está cerrado, los
 *      camiones también. Un caret ahí prometería un dato que no existe.
 *   2. LOS DÍAS ABIERTOS SÍ, y despliegan el horario de los CAMIONES.
 *   3. HOY ARRANCA ABIERTO, que es lo único que la versión anterior hacía
 *      bien.
 *
 * ⚠️ EL DESGLOSE YA NO REPITE EL HORARIO DEL BAR. Antes decía «Bar 3:00 PM –
 * 12:00 AM» justo debajo de una fila que ya decía «3:00 PM – 12:00 AM»: el
 * mismo dato dos veces a dos centímetros. Camila lo marcó. La fila ES el
 * horario del bar —es el del local, el que abre y cierra el lugar— y el panel
 * dice lo único que la fila no dice: cuándo abren las cocinas.
 *
 * ⚠️ ES `<details>`/`<summary>` NATIVO Y NO UN ACORDEÓN A MANO, que es la
 * misma decisión que ya está tomada en `/faq` y por las mismas razones: el
 * teclado, los roles, el estado abierto/cerrado y el buscador del navegador
 * salen gratis, y no cuesta un kilobyte de JS. Ver la nota de
 * `app/faq/page.tsx`.
 *
 * ⚠️ Y POR ESO SE FUE EL `<dl>`. Un `<details>` no puede ser hijo de un `<dl>`
 * —ahí adentro sólo van `dt`, `dd` y el `div` de agrupación—, así que o se
 * quedaba la lista de definición o se quedaba el acordeón nativo. El `<dl>` ya
 * había costado una corrección de axe por anidamiento, y lo que un
 * `<summary>` le anuncia al lector de pantalla —«Wednesday, 3:00 PM – 8:00 PM,
 * contraído»— dice lo mismo que el par `dt`/`dd` y además dice que se abre.
 * ══════════════════════════════════════════════════════════════════════════
 */
/**
 * El renglón, compartido por las dos ramas: el `<div>` de un día cerrado y el
 * `<summary>` de uno abierto tienen que medir exactamente lo mismo.
 *
 * ⚠️ `justify-between` y no un grid de dos columnas: el día y la hora son dos
 * bloques y el aire del medio es el que sobra, que es lo que hace que la hora
 * quede pegada al borde derecho de la tarjeta en las siete filas.
 */
const FILA = 'flex items-center justify-between gap-x-4 py-3';

/**
 * El filete que separa un día del siguiente.
 *
 * ⚠️ VA EN EL CONTENEDOR DEL DÍA Y NO EN `FILA`, y la diferencia se ve cuando
 * una fila está desplegada: con el borde en el renglón, la línea caía ENTRE el
 * día y su propio desglose, así que «Trucks 4:00 PM – 11:00 PM» se leía como
 * si perteneciera al día de abajo. En el contenedor, el corte queda después
 * del panel, que es donde termina el día.
 */
const BORDE = 'border-b border-muted-dark/30';

export default function HoursCard({ hours }: { readonly hours?: readonly Hours[] } = {}) {
  const venue = useVenue();
  const filas = hours ?? venue.hours;
  const [status, setStatus] = useState<ReturnType<typeof venueStatus>>(null);

  useEffect(() => setStatus(venueStatus(filas, 'bar')), [filas]);

  const todayIdx = status?.dayIndex ?? -1;

  return (
    <div className="flex flex-col rounded-shell bg-deep p-6.5 text-bone on-dark sombra-card lg:p-9">
      <h3 className="m-0 mb-5.5 font-display text-d5 font-bold uppercase leading-none tracking-[0.02em] text-paper">
        Hours
      </h3>

      {/*
        ⚠️ `FILA` ES UNA CONSTANTE PORQUE LAS DOS RAMAS TIENEN QUE MEDIR IGUAL.
        Un día cerrado es un `<div>` y uno abierto un `<summary>`: si el alto y
        el filete se escribieran dos veces, cualquier retoque futuro dejaría la
        tabla despareja. Acá el renglón es uno solo.
      */}
      <div className="m-0">
        {filas.map((row, i) => {
          const isToday = i === todayIdx;
          /*
            ⚠️ «Cerrado» se decide por el BAR y no por los camiones. El bar es
            el que abre el local: no hay día con las cocinas abiertas y la
            barra cerrada, y el dato viene de `HOURS` como el string 'Closed'.
          */
          const cerrado = /closed/i.test(row.bar);

          const dia = (
            <span
              className={[
                'font-body text-base',
                isToday ? 'font-medium text-cream' : 'text-paper',
              ].join(' ')}
            >
              {row.day}
              {isToday ? ' · today' : ''}
            </span>
          );

          const hora = (
            <span
              className={[
                'font-body text-dato whitespace-nowrap tabular-nums',
                isToday ? 'text-cream' : 'text-paper',
              ].join(' ')}
            >
              {row.bar}
            </span>
          );

          if (cerrado) {
            /*
              ⚠️ EL HUECO DEL CARET SE RESERVA IGUAL. Sin él, «Closed» se corre
              a la derecha los 13px del icono más los 12 del `gap`, y las dos
              filas cerradas quedan desalineadas de las cinco abiertas en una
              tabla donde la columna derecha es justamente lo que se compara de
              un vistazo. El hueco va `aria-hidden`: no hay nada que anunciar,
              sólo hay que ocupar el lugar.
            */
            return (
              <div key={row.day} className={`${FILA} ${BORDE}`}>
                {dia}
                <span className="flex items-center gap-3">
                  {hora}
                  <span aria-hidden="true" className="size-3.25" />
                </span>
              </div>
            );
          }

          return (
            /*
              ⚠️ `open={isToday}` y no un estado propio. `status` se setea UNA
              vez al montar, así que después de ese render React no vuelve a
              tocar el atributo y los toques de la persona mandan. Con un estado
              controlado habría que interceptar el `onToggle` para no pisar lo
              que acaba de hacer.
            */
            <details key={row.day} open={isToday} className={`group ${BORDE}`}>
              <summary
                className={`${FILA} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}
              >
                {dia}
                <span className="flex items-center gap-3">
                  {hora}
                  {/* Un solo icono que gira, y no dos que se intercambian: así
                      el estado se lee como un movimiento y no como un cambio de
                      dibujo. `group-open` lo resuelve en CSS, sin JS. */}
                  <CaretDown
                    aria-hidden="true"
                    className="size-3.25 text-muted-dark transition-transform duration-200 group-open:rotate-180"
                  />
                </span>
              </summary>

              {/*
                El desglose: SÓLO los camiones. La fila de arriba ya dijo el
                horario del bar. Ver la nota del encabezado.
              */}
              <div className="grid grid-cols-[auto_1fr] gap-x-5 pb-3">
                <span className="font-body text-caption text-muted-dark">Trucks</span>
                <span className="font-body text-dato tabular-nums text-paper">{row.trucks}</span>
              </div>
            </details>
          );
        })}
      </div>

      {/*
        ⚠️ ACÁ ABAJO IBA LA PÍLDORA «Open · closes 8 PM», y se saca por pedido
        de Camila. Queda anotado para que no vuelva por inercia: el dato NO se
        pierde, está dos veces más arriba en la misma pantalla —el pill del
        hero lo dice con el mismo cálculo, y la fila de hoy de esta misma
        tarjeta ya está resaltada en crema y desplegada—. Una tercera copia
        del mismo estado, al pie de la tabla que acaba de decirlo, era
        redundancia dentro de un mismo componente.

        La lógica que la alimentaba (`venueStatus`) se queda: es la que sabe
        cuál es HOY y lo que resalta la fila.
      */}
    </div>
  );
}
