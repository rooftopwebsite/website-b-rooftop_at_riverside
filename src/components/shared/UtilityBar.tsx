'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Hours } from '@/types/content';
import { useVenue } from './VenueProvider';
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
  /** El nombre del primer día del tramo. Es la clave para marcar el próximo. */
  readonly primero: string;
}

/**
 * Agrupa días seguidos con el mismo horario: «Wednesday – Thursday 3–8 PM».
 *
 * ⚠️ AGRUPA POR NOMBRE DE DÍA Y NO POR ÍNDICE. Antes usaba la posición en el
 * array, y eso dejó de servir cuando la tira pasó a ROTAR: después de rotar,
 * la posición 0 puede ser el sábado.
 */
function agrupar(hours: readonly Hours[]): readonly Tramo[] {
  const out: { label: string; horario: string; primero: string }[] = [];

  hours.forEach((row) => {
    const ultimo = out[out.length - 1];
    if (ultimo && ultimo.horario === row.bar) {
      ultimo.label = `${ultimo.primero} – ${row.day}`;
      return;
    }
    out.push({ label: row.day, horario: row.bar, primero: row.day });
  });

  return out;
}

/*
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ LOS DÍAS CERRADOS YA NO SE LISTAN, Y ESO ES EL CAMBIO.
 *
 * Pedido del cliente, 2026-09-15: en vez de mostrar «Closed» los días que no
 * abre, prefiere que se comunique por cuándo ABRE. Y pidió que buscáramos una
 * mejor forma de transmitirlo, no sólo cambiar la palabra.
 *
 * La forma, en dos partes y SIN una pastilla aparte:
 *
 *   1. LA TIRA PIERDE LAS FILAS CERRADAS. Lunes y martes no necesitan un
 *      renglón: son la AUSENCIA de un renglón. Antes la línea más visible del
 *      sitio arrancaba con «MONDAY – TUESDAY / CLOSED», o sea que gastaba su
 *      primer tercio en los dos días en los que no pasa nada.
 *
 *   2. LA TIRA ARRANCA EN EL PRÓXIMO DÍA QUE ABRE, y ese primero va rotulado
 *      «Open» y en `cream`. Un martes la tira empieza en «OPEN WEDNESDAY
 *      3:00 PM – 8:00 PM» y sigue con el resto de la semana. El foco queda en
 *      cuándo abre sin sacar un solo dato de la barra.
 *
 * ⚠️ HUBO UNA PASTILLA FIJA ANTES DE ESTO y se sacó: Camila no la quiso, y
 * además en teléfono se comía media barra y obligó a esconder los horarios.
 * Rotando la tira se consigue lo mismo sin gastar ancho.
 *
 * ⚠️ LA ROTACIÓN NO PUEDE PASAR EN EL SERVIDOR. Depende de la hora del
 * visitante, así que el primer render es el orden natural de la semana y la
 * rotación entra al montar. Renderizarla en SSR haría que alguien en otra
 * zona horaria leyera un día equivocado.
 *
 * ⚠️ EN TELÉFONO LA TIRA NO SE MUEVE Y SE DESPLAZA A DEDO. Ver
 * `.tira-horarios` en globals.css: una tira animada a 390px es ilegible, pero
 * escondiéndola se pierden los horarios, que es justo lo que hay que mostrar.
 * ══════════════════════════════════════════════════════════════════════════
 */
export default function UtilityBar() {
  const venue = useVenue();
  /* Sólo los días que abren. Ver la nota de arriba. */
  const abiertos = useMemo(
    () => venue.hours.filter((h) => !/closed/i.test(h.bar)),
    [venue.hours],
  );

  /** El día por el que arranca la tira. Vacío hasta montar: ver la nota. */
  const [desde, setDesde] = useState<string | null>(null);

  useEffect(() => {
    const s = venueStatus(venue.hours, 'bar');
    if (!s) return;
    const hoy = venue.hours[s.dayIndex]?.day ?? null;
    // Si está abierto, o si abre más tarde hoy, la tira arranca en hoy.
    if (s.isOpen || s.reopensOn === 'today') setDesde(hoy);
    else if (s.reopensOn) setDesde(s.reopensOn);
  }, [venue.hours]);

  const TRAMOS = useMemo(() => {
    const i = desde ? abiertos.findIndex((h) => h.day === desde) : -1;
    const ordenados = i > 0 ? [...abiertos.slice(i), ...abiertos.slice(0, i)] : abiertos;
    return agrupar(ordenados);
  }, [abiertos, desde]);

  const fila = (copia: number) =>
    TRAMOS.map((tramo, i) => {
      /* El primero es el próximo que abre, y sólo una vez que se supo cuál. */
      const esProximo = desde !== null && i === 0;
      return (
        <span
          key={`${copia}-${tramo.label}`}
          className="flex shrink-0 items-center gap-2.5 font-body text-caption font-medium uppercase tracking-eyebrow"
        >
          <span className={esProximo ? 'text-cream' : 'text-muted-dark'}>
            {esProximo ? 'Open ' : ''}
            {tramo.label}
          </span>
          <span className={esProximo ? 'text-paper' : 'text-bone/80'}>
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
    <div className="bg-deep grano">
      {/*
        ⚠️ EN TELÉFONO SE DESPLAZA A DEDO Y EN ESCRITORIO SE MUEVE SOLA.
        `overflow-x-auto` abajo de `sm` y `overflow-hidden` de ahí para arriba.
        El scroll horizontal vive ACÁ ADENTRO, así que la página nunca lo gana.

        ⚠️ `w-max` en la tira: sin el ancho automático el flex se comprime al
        ancho de la pantalla y el `translateX(-50%)` del keyframe deja de
        significar «media tira».
      */}
      {/*
        ⚠️ `tabIndex={0}` NO ES DECORATIVO: un contenedor con `overflow-x: auto`
        se desplaza con el dedo y con el mouse, pero sin foco NO se desplaza con
        el teclado, y entonces quien navega así se queda sin los horarios de
        jueves en adelante. Lo marca axe como `scrollable-region-focusable`.
        Con `role="region"` y su etiqueta, además, un lector de pantalla
        anuncia qué es esto antes de entrar.
      */}
      <div
        className="flex h-10 items-center overflow-x-auto px-borde sm:overflow-hidden sm:px-0"
        tabIndex={0}
        role="region"
        aria-label="Opening hours this week"
      >
        <div className="tira-horarios flex w-max items-center gap-8 sm:pl-borde [--marquee-duration:38s]">
          <span className="sr-only">Opening hours this week</span>
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
