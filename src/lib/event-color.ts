import { EVENT_FILTERS, matchesFilter, type VenueEvent } from '@/content/events';

/**
 * ══════════════════════════════════════════════════════════════════════════
 * UN COLOR POR TIPO DE EVENTO, PARA LA GRILLA DEL MES.
 *
 * ⚠️ EXISTE PORQUE LA GRILLA DEJÓ DE SER UNA TABLA DE TEXTO. Hasta el
 * 2026-09-17 las celdas del mes eran chips grises todos iguales y la vista
 * por defecto era una lista: había que LEER el calendario para saber si el
 * sábado había música o fútbol. Pedido de Camila: «que el calendario sea más
 * visual, no en una lista, necesito que sea más fácil de visualizar».
 *
 * ⚠️ LOS COLORES SON LOS DE LOS FILTROS QUE YA EXISTEN, no una familia nueva.
 * `EVENT_FILTERS` ya agrupa los tags de la base en cinco familias y dibuja las
 * píldoras de arriba del calendario; este archivo le pone un color a cada una
 * y nada más. Un tipo de evento nuevo entra por `EVENT_FILTERS` y hereda su
 * color acá, en un solo lugar.
 *
 * ⚠️ EL COLOR VA EN UN PUNTO, NO EN EL FONDO DEL CHIP, y esa es la decisión
 * que hace que esto sea seguro. Con el color de fondo habría que verificar
 * cinco combinaciones de contraste y `magenta` sobre `ink` ya no pasa; con el
 * punto, el título del evento queda en `ink` sobre `paper` (17:1) y el color
 * es lo que es, una marca al costado. Es además cómo lo resuelve cualquier
 * calendario que la gente ya sabe usar.
 *
 * ⚠️ EL PUNTO NUNCA VA SOLO. Un color sin texto al lado no le dice nada a
 * quien no distingue rojo de verde. En las celdas el punto acompaña al título;
 * en el mapa del celular, donde no entra el título, la celda lleva un
 * `aria-label` con los nombres de los eventos del día y debajo está la agenda
 * con el texto completo.
 * ══════════════════════════════════════════════════════════════════════════
 */

/**
 * Filtro → clase de fondo del punto.
 *
 * ⚠️ LAS CLASES VAN ESCRITAS ENTERAS. Tailwind lee el archivo con una
 * expresión regular, así que `bg-${x}` armado en tiempo de ejecución no genera
 * ninguna regla y el punto sale transparente.
 */
const PUNTOS: Record<string, string> = {
  music: 'bg-sunset',
  sports: 'bg-teal600',
  themed: 'bg-magenta',
  festival: 'bg-tomato',
  family: 'bg-river',
};

/**
 * El color de los eventos que no caen en ninguna familia.
 *
 * ⚠️ NO ES UN ERROR NI UN PENDIENTE, así que no usa `terra`: un evento sin tag
 * mapeado sigue apareciendo en «Everything» a propósito (ver la nota de
 * `EVENT_FILTERS`). Un gris del sistema dice «hay algo acá» sin prometer de
 * qué tipo es.
 */
const SIN_FAMILIA = 'bg-muted';

/** El filtro al que pertenece este evento, o `null` si no cae en ninguno. */
export function eventFilterId(e: VenueEvent): string | null {
  return EVENT_FILTERS.find((f) => matchesFilter(e, f.id))?.id ?? null;
}

/** La clase de fondo del punto de este evento. Nunca vacía. */
export function eventDot(e: VenueEvent): string {
  const id = eventFilterId(e);
  return (id && PUNTOS[id]) || SIN_FAMILIA;
}

export interface ColorKey {
  readonly id: string;
  readonly label: string;
  readonly dot: string;
}

/**
 * La referencia de colores que va debajo de la grilla.
 *
 * ⚠️ SÓLO LOS TIPOS QUE ESTE MES TIENE, por el mismo motivo que los filtros
 * sólo dibujan los que tienen eventos: una referencia que nombra cuatro
 * colores de los que en pantalla se ven dos manda a buscar algo que no está.
 */
export function colorKey(events: readonly VenueEvent[]): readonly ColorKey[] {
  const claves: ColorKey[] = EVENT_FILTERS.filter((f) =>
    events.some((e) => eventFilterId(e) === f.id),
  ).map((f) => ({ id: f.id, label: f.label, dot: PUNTOS[f.id] ?? SIN_FAMILIA }));

  /*
   * ⚠️ EL GRIS TAMBIÉN SE NOMBRA. La referencia salía de `EVENT_FILTERS` y
   * nada más, así que un evento sin familia mapeada ponía un punto gris en la
   * grilla que no estaba en ninguna referencia: un color en pantalla que no
   * quiere decir nada es peor que no tener referencia.
   *
   * Pasa hoy, no es hipotético: «Weekend Happy Hour» viene etiquetado
   * `happy-hour` y `weekly`, y ninguno de los dos cae en un filtro.
   *
   * ⚠️ ACÁ SÍ VA UN RÓTULO GENÉRICO y en `eventTypeLabel()` no, aunque las dos
   * miren el mismo hueco. Son dos trabajos distintos: la tarjeta AFIRMA de qué
   * tipo es un evento, y «Other» sobre un evento concreto es una afirmación
   * vacía; la referencia sólo EXPLICA un color que ya está en pantalla, y
   * «Everything else» lo explica bien.
   */
  if (claves.length > 0 && events.some((e) => eventFilterId(e) === null)) {
    claves.push({ id: 'resto', label: 'Everything else', dot: SIN_FAMILIA });
  }

  return claves;
}

/**
 * El nombre del tipo de evento, para poner al lado del punto.
 *
 * ⚠️ ES LA OTRA MITAD DEL PUNTO, no un adorno: ver la nota del encabezado
 * sobre por qué el color nunca va solo. Devuelve `null` cuando el evento no
 * cae en ninguna familia, y entonces no se dibuja nada: inventarle un rótulo
 * («Other») sería llenar la tarjeta con una palabra que no informa.
 */
export function eventTypeLabel(e: VenueEvent): string | null {
  const id = eventFilterId(e);
  return EVENT_FILTERS.find((f) => f.id === id)?.label ?? null;
}
