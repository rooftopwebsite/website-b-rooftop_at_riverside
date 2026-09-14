'use client';

import { useEffect, useState } from 'react';
import { HOURS } from '@/lib/brand';
import { venueStatus } from '@/lib/hours';

/**
 * La barra de servicio: la franja verde de 40px arriba de todo.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ AHORA LLEVA LOS HORARIOS DE LA SEMANA EN UN MARQUEE, y antes llevaba las
 * tres redes más Gift Cards y FAQ. El cambio lo pidió Camila y mejora la
 * barra por un motivo concreto: los cinco destinos anteriores eran links, y
 * los links de arriba de todo compiten con la nav que tienen justo debajo.
 * Un horario no compite con nada — no se puede clickear, sólo se lee.
 *
 * Y es el dato que más se busca en el sitio de un bar. Estaba una sola vez,
 * al fondo de la home, en la tarjeta de `FindUs`. Ahora está antes que
 * cualquier otra cosa, sin que nadie tenga que scrollear ni abrir nada.
 *
 * ⚠️ LOS CINCO DESTINOS QUE SALIERON NO SE PIERDEN:
 *   · Instagram, Facebook y Google están en `FindUs`, en círculos de 62px —
 *     que es donde de verdad se usan: cuando alguien está decidiendo si va.
 *   · Gift Cards y FAQ están en el footer.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ EL MARQUEE NO SE PAUSA Y NO ES INTERACTIVO. Es la única animación en
 * bucle del sitio que muestra TEXTO, así que hay que justificarla: son cinco
 * tramos de días + horario que no entran en una franja de 40px de alto sin
 * achicar el cuerpo a 9px. El bucle es lo que permite mostrarlos enteros y
 * legibles. La alternativa —mostrar sólo hoy— ya está en la tarjeta de
 * `FindUs` y en el pill del hero.
 *
 * ⚠️ Y por eso mismo va DUPLICADO en el DOM con la copia en `aria-hidden`:
 * un lector de pantalla tiene que oír la semana una vez, no dos veces.
 * La segunda copia existe sólo para que el bucle no muestre un hueco al
 * volver al origen.
 *
 * ⚠️ ES CLIENT, y sólo por una cosa: marcar cuál es HOY. El servidor no sabe
 * qué hora es en Bonita Springs para el visitante, y una página cacheada
 * resaltaría el día equivocado. Antes de montar las siete filas se pintan
 * iguales, que ya es información correcta y completa.
 */

/** Cuántas veces se repite la tira. Dos es el mínimo para que el bucle cierre. */
const COPIAS = 2;

/**
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LOS DÍAS CON EL MISMO HORARIO SE MUESTRAN JUNTOS. Pedido de Camila:
 * «unifiquemos horarios, los dos días que está cerrado nombrémoslos juntos, y
 * los días que hay misma hora de apertura y cierre lo mismo, para que sea
 * menos a leer».
 *
 * La semana pasa de siete filas a cinco:
 *
 *     Monday – Tuesday      Closed
 *     Wednesday – Thursday  3:00 PM – 8:00 PM
 *     Friday                3:00 PM – 12:00 AM
 *     Saturday              11:00 AM – 2:00 AM
 *     Sunday                11:00 AM – 8:00 PM
 *
 * Son 34 caracteres menos por vuelta y dos paradas menos para el ojo, que en
 * una tira que se mueve sola es la diferencia entre leerla y resignarse.
 *
 * ⚠️ AGRUPA POR CONSECUTIVOS Y NO POR VALOR. Dos días con el mismo horario
 * pero separados en la semana —un martes y un viernes— NO pueden mostrarse
 * como «Tuesday – Friday»: eso diría que el miércoles y el jueves también
 * abren a esa hora. El acumulador corta el tramo en cuanto el horario cambia,
 * así que sólo une días pegados.
 *
 * ⚠️ EL RANGO SE ESCRIBE CON EL PRIMERO Y EL ÚLTIMO, y con un solo día se
 * escribe el día solo. Sin ese caso, el viernes saldría «Friday – Friday».
 *
 * ⚠️ NO SE LEE DE UNA LISTA APARTE. Sale de `HOURS`, que es la única fuente de
 * horarios del repo: si mañana el miércoles abre a otra hora, el tramo se
 * parte solo y nadie tiene que acordarse de deshacer la agrupación.
 *
 * ⚠️ `TODAY` SIGUE FUNCIONANDO Y AHORA MARCA EL TRAMO. Cada tramo guarda los
 * índices de los días que contiene, así que el lunes y el martes resaltan la
 * misma fila. Es lo correcto: lo que está resaltado es el horario de hoy, y el
 * horario de hoy es el del tramo.
 * ══════════════════════════════════════════════════════════════════════════
 */
interface Tramo {
  readonly label: string;
  readonly horario: string;
  readonly dias: readonly number[];
}

function agrupar(): readonly Tramo[] {
  const out: { label: string; horario: string; dias: number[]; primero: string }[] = [];

  HOURS.forEach((row, i) => {
    const ultimo = out[out.length - 1];
    if (ultimo && ultimo.horario === row.bar) {
      ultimo.dias.push(i);
      ultimo.label = `${ultimo.primero} – ${row.day}`;
      return;
    }
    out.push({ label: row.day, horario: row.bar, dias: [i], primero: row.day });
  });

  return out.map(({ label, horario, dias }) => ({ label, horario, dias }));
}

const TRAMOS = agrupar();

export default function UtilityBar() {
  const [todayIdx, setTodayIdx] = useState(-1);

  useEffect(() => {
    const s = venueStatus('bar');
    if (s) setTodayIdx(s.dayIndex);
  }, []);

  const fila = (copia: number) =>
    TRAMOS.map((tramo) => {
      const isToday = tramo.dias.includes(todayIdx);
      return (
        <span
          key={`${copia}-${tramo.label}`}
          className="flex shrink-0 items-center gap-2.5 font-body text-caption font-medium uppercase tracking-eyebrow"
        >
          <span className={isToday ? 'text-cream' : 'text-muted-dark'}>
            {tramo.label}
            {isToday ? ' · today' : ''}
          </span>
          <span className={isToday ? 'text-paper' : 'text-bone/80'}>
            {/* ⚠️ `tabular-nums` para que los horarios no bailen de ancho
                mientras la tira se mueve: con cifras proporcionales, un «11»
                y un «3» cambian el largo de la fila en cada vuelta. */}
            <span className="tabular-nums">{tramo.horario}</span>
          </span>
          {/* El separador es decorativo y va aparte del texto para que un
              lector de pantalla no lea «barra» entre cada día. */}
          <span aria-hidden="true" className="pl-4 text-muted-dark/40">
            /
          </span>
        </span>
      );
    });

  return (
    <div className="overflow-hidden bg-deep">
      <div className="flex h-10 items-center">
        {/*
          ⚠️ `w-max` en la tira y `overflow-hidden` en el padre: sin el ancho
          automático, el flex se comprime al ancho de la pantalla y el
          `translateX(-50%)` del keyframe deja de significar «media tira».
        */}
        <div className="rt-marquee flex w-max items-center gap-8 pl-borde [--marquee-duration:38s]">
          <span className="sr-only">Hours this week</span>
          {Array.from({ length: COPIAS }, (_, copia) => (
            <span
              key={copia}
              aria-hidden={copia > 0}
              className="flex shrink-0 items-center gap-8"
            >
              {fila(copia)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
