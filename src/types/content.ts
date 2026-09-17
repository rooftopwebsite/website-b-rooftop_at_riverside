/**
 * Tipos del contenido de las páginas internas.
 *
 * ⚠️ Los tipos que ya viven adentro de su propio archivo de `content/`
 * —`Truck`, `MenuSection`, `VenueEvent`, `Space`, `Faq`, `TipoEvento`,
 * `PageSeo`— NO se mudan acá. Este archivo es para los tipos que comparten
 * varias páginas o que nacen con el rediseño de las internas.
 */

/**
 * Happy hour. **Fuente única**, decidido con Camila el 2026-09-15.
 *
 * ⚠️ Se renderiza en DOS lugares y sólo en esos dos:
 *   · `/sunset-bar`, como bloque destacado propio
 *   · `/whats-on`, como entrada recurrente fija, diferenciada de los eventos
 *     con ticket
 *
 * ⚠️ NO va en el footer. En el sitio Wix actual vive justamente ahí, repetido
 * al pie de las 23 rutas, y esa es la razón de la regla: una oferta comercial
 * que aparece en todas las páginas deja de leerse.
 */
export interface HappyHour {
  /** Rango de días. En dash (–), que es la forma correcta de un rango. */
  readonly days: string;
  /**
   * Los mismos días abreviados: «Sat – Sun».
   *
   * ⚠️ NO ES UN LUJO: la píldora del hero de la home tiene un presupuesto
   * medido de ~22 caracteres y el nombre completo de dos días no entra. Ver
   * la tabla de anchos en `Hero.tsx`.
   */
  readonly daysShort: string;
  /** Rango horario. En dash. */
  readonly time: string;
  /**
   * Cada oferta, con el PRECIO y el QUÉ separados.
   *
   * ⚠️ ERAN UN SOLO STRING —«$4 drafts»— y se partieron en dos el 2026-09-16.
   * El motivo es de diseño y está en `/sunset-bar`: el precio va en display
   * grande y en color, y el nombre en cuerpo chico al lado. Con la frase
   * entera en un string eso sólo se puede hacer parseando, que es adivinar
   * dónde termina el número.
   *
   * ⚠️ El dato del cliente NO cambia: sigue siendo «$4 Drafts | $5 House Wines
   * | $6 House Drinks», sólo que ahora el sitio sabe cuál es cada mitad.
   */
  readonly deals: readonly { readonly price: string; readonly what: string }[];
  /** Aclaración opcional. `null` cuando no hay. */
  readonly note: string | null;
}

/**
 * Una fila de horario. **Dos sets**: la barra y los food trucks tienen
 * horarios distintos todos los días.
 */
export interface Hours {
  readonly day: string;
  /** Rango en formato legible, o el string `Closed`. */
  readonly bar: string;
  readonly trucks: string;
}

/**
 * Una persona del equipo que se muestra con nombre y cara.
 *
 * ⚠️ `bio` y `photo` pueden ser `null` y se renderizan como pendiente visible,
 * no como hueco. El sitio actual publica nombre, rol y mail de los dos, pero
 * ninguna bio ni ninguna foto.
 */
export interface Person {
  readonly name: string;
  readonly role: string;
  readonly email: string | null;
  readonly bio: string | null;
  readonly photo: string | null;
  readonly photoAlt: string | null;
  /** Cita textual de esta persona, si existe publicada. */
  readonly quote: string | null;
}

/**
 * Una zona física del lugar, para contar de qué está hecho.
 *
 * ⚠️ NO es lo mismo que `Space` de `content/spaces.ts`. Un `Space` es una
 * unidad ALQUILABLE, con capacidad y precio. Un `VenueArea` es una parte del
 * lugar que alguien recorre cuando viene un miércoles. El escenario y el food
 * truck park son áreas y no se alquilan sueltos; el Full Buyout se alquila y
 * no es un área.
 */
export interface VenueArea {
  readonly slug: string;
  readonly name: string;
  readonly floor: 'Ground floor' | 'Second floor';
  readonly body: string;
  readonly photo: string | null;
  readonly photoAlt: string | null;
  /** Qué toma hace falta, EN ESPAÑOL, cuando `photo` es null. */
  readonly photoBrief: string;
  /** Adónde lleva, si esta área tiene página propia. */
  readonly href?: string;
}

/**
 * El Charity Partner Program. Ver `content/story.ts`: hoy el dato existe y no
 * se renderiza, a la espera de una decisión.
 */
export interface GiveBack {
  readonly title: string;
  /** Los montos que se pueden sumar al cerrar la cuenta. */
  readonly tiers: readonly number[];
  readonly body: string;
  /** Rota todos los meses. `null` → pendiente visible, nunca uno vencido. */
  readonly partner: string | null;
}
