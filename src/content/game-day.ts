/**
 * LAS PROMOS DE BARRA DE LOS DOMINGOS DE FÚTBOL.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ ES LO ÚNICO DE LA TEMPORADA QUE LLEVA PRECIO EN EL SITIO, y es a
 * propósito. Lo que cobra el venue se publica con su número; lo que cobran los
 * food trucks es venta del vendor y va en la carta de cada truck, sin precios
 * en las páginas del venue. La regla ya estaba escrita en `content/trucks.ts`
 * y esto no la cambia.
 *
 * ⚠️ FUENTE: «NFC North Bar Happy Hour», el documento que mandó Chris y que
 * Camila pasó el 2026-09-17. Los tres nombres, los tres precios y los cuatro
 * shots son textuales. No se agregó ni un dato.
 *
 * ⚠️ EL HAPPY HOUR REGULAR SIGUE CORRIENDO DEBAJO. El documento lo dice
 * expreso: esta lista es «curada, específica para el bar de arriba en días de
 * fútbol, incluye el happy hour regular como base». Por eso vive pegada al
 * happy hour en `/sunset-bar` y no como una carta aparte: son la misma barra,
 * el mismo día, y una se suma a la otra.
 *
 * ⚠️ ESTO SE APAGA CUANDO TERMINE LA TEMPORADA. Camila, 2026-09-17: «chris nos
 * dirá cuándo cerrar todos estos eventos y los borraremos cuando nos indique».
 * Borrar este archivo y su sección es un solo commit, y por eso el contenido
 * está acá y no repartido en el JSX de la página.
 * ══════════════════════════════════════════════════════════════════════════
 */

export interface GameDayDeal {
  /** El nombre que le puso el cliente. Va tal cual, entre comillas no. */
  readonly name: string;
  /** Cuándo o cómo se consigue. Una línea. */
  readonly how: string;
  /** El precio, ya formateado. */
  readonly price: string;
}

export const GAME_DAY_DEALS: readonly GameDayDeal[] = [
  {
    name: '2 Minute Drill',
    how: 'Domestic drafts, from the two minute warning until halftime',
    price: '$3',
  },
  {
    /*
     * ⚠️ «OUR TEAM» ESTÁ A CONFIRMAR, y es la única línea de las tres que no
     * es literal. El documento dice «cada vez que el equipo del cliente anota
     * un touchdown», y «el cliente» se puede leer de dos maneras: el equipo de
     * la casa, o el equipo del que es hincha quien está en la mesa.
     *
     * Se publica la lectura ESTRECHA a propósito: si la promo fuera la ancha,
     * quien la pida de más se lleva una sorpresa buena; al revés, un hincha
     * pidiendo su shot en la barra y un bartender diciéndole que no es un
     * problema en el local. Ver `docs/pedido-al-cliente.md`.
     */
    name: 'Touchdown Shots',
    how: 'Fireball, Rumple Minze, Jägermeister or Four Roses, every time our team scores',
    price: '$4',
  },
  {
    name: 'The Tailgate',
    how: 'Five domestic beers and two shots, same list as Touchdown Shots',
    price: '$25',
  },
];

/**
 * El rótulo del bloque cuando las tres promos salen SOLAS, sin el título
 * «On football Sundays» que las presenta en `/sunset-bar`.
 *
 * ⚠️ ES LA FRASE DEL CLIENTE, no una inventada: el campo descripción del
 * evento arranca ese párrafo con «Game day at the bar:». Vive acá y no en el
 * componente que la usa porque muere con este archivo al cerrar la temporada.
 */
export const GAME_DAY_LABEL = 'Game day at the bar';

/**
 * La bajada del bloque. Dice que el happy hour de siempre no se suspende.
 *
 * ⚠️ TIENE QUE ENTRAR EN UN RENGLÓN. Camila, 2026-09-22, sobre la captura:
 * «pon esta aclaración a una sola línea, a menos que lo necesite por el ancho
 * de pantalla». Decía «The regular happy hour runs underneath. These three
 * come out on top of it, only on football Sundays» — dos oraciones, 103
 * caracteres, dos renglones centrados arriba de la card en cualquier desktop.
 *
 * Ahora son 61. Medido contra el `max-w` del párrafo que lo publica en
 * `/sunset-bar`: entra en una línea de 922px para arriba, que es donde ese
 * bloque tiene el ancho completo, y sigue partiendo solo en pantallas más
 * angostas — que es la excepción que Camila dejó abierta.
 *
 * ⚠️ SI SE REESCRIBE, CONTAR LOS CARACTERES. El techo es ~64 a este cuerpo;
 * pasado eso vuelve a ser un párrafo de dos renglones y el pedido se pierde
 * sin que nadie lo note.
 */
export const GAME_DAY_NOTE = 'On football Sundays these three come on top of the regular happy hour.';
