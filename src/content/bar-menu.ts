import type { Dish, DishGroup } from '@/lib/restoexp';
/**
 * La carta del Sunset Bar.
 *
 * Es el ÚNICO menú del sitio con precios, porque es lo único que cobra el
 * venue. Los food trucks cobran su propia venta y sus precios son del vendor.
 *
 * ⚠️ Transcrito a mano desde `docs/source-menus/Rooftop_Menu-Jan-2026_1.jpg`
 * y `_2.jpg`, las dos imágenes que `/drink` publicaba en un slider. Se
 * transcribe para que el menú sea TEXTO: seleccionable, indexable, con
 * jerarquía de headings y legible con lector de pantalla.
 * Prohibido publicarlo como imagen o como PDF.
 *
 * Los precios están en dólares, **impuesto incluido** (así lo declara el menú).
 */

export interface MenuItem {
  readonly name: string;
  /** En dólares. `9.5` se renderiza como 9⁵⁰, que es como lo escribe el menú. */
  readonly price: number;
  readonly description?: string;
  /** Nota en cursiva bajo la descripción — variantes, sabores. */
  readonly note?: string;
  /** Vino de la casa: el que entra en el Happy Hour. */
  readonly house?: boolean;
}

export interface MenuSection {
  readonly id: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly items: readonly MenuItem[];
}

export const SIGNATURE_COCKTAILS: MenuSection = {
  id: 'signature-cocktails',
  title: 'Signature Cocktails',
  items: [
    {
      name: 'Blackberry Lemon G&T',
      price: 14,
      description: 'Gin, mint-infused simple syrup, fresh lemon juice, tonic, muddled blackberries',
    },
    {
      name: 'Bomb Pop',
      price: 10,
      description:
        'Tequila, blue curaçao, triple sec, fresh lime juice, simple syrup, grenadine, Bomb Pop popsicle',
    },
    {
      name: 'Cotton Candy Cosmo',
      price: 12,
      description: 'Vodka, Grand Marnier, cranberry juice, fresh lime juice, cotton candy',
    },
    {
      name: 'Blueberry Lemondrop',
      price: 16,
      description: 'Smirnoff blueberry vodka, fresh lemon juice, blueberry purée, lemonade',
    },
    {
      name: 'Bonita Springs Brio',
      price: 12,
      description:
        'Gin, St-Germain, fresh lemon juice, fresh grapefruit juice, orange bitters, grenadine',
    },
    {
      name: 'Rooftop Margarita',
      price: 14,
      description: 'House-made daily with tequila, fresh lime juice, agave',
      note: 'Flavors: classic lime, strawberry, mango, lychee, or passion fruit',
    },
    {
      name: 'White Gummy Bear Martini',
      price: 10,
      description:
        'Smirnoff raspberry vodka, peach schnapps, fresh sour mix, lemon-lime soda, gummy bears',
    },
    {
      name: "Tito's Lemonade Shake Up",
      price: 12,
      description: "Tito's Handmade Vodka, fresh lemonade",
      note: 'Shaken with blueberry, raspberry, strawberry, or blackberry purée',
    },
    {
      name: 'Jolly Rancher Popsicle',
      price: 14,
      description: 'Smirnoff raspberry vodka, Midori, blue curaçao, fresh lime juice, lemon-lime soda',
    },
    {
      name: 'Rosemary Kentucky Mule',
      price: 16,
      description: 'Knob Creek rye, rosemary simple syrup, fresh lime juice, Goslings ginger beer',
    },
    {
      name: 'Xtini, the Espresso Martini',
      price: 14,
      description: 'It speaks for itself.',
    },
    {
      name: 'Coffee Old Fashioned',
      price: 12,
      description:
        'Bulleit Bourbon, agave, coffee bitters, orange bitters, coffee beans, chocolate shavings',
    },
  ],
};

export const SPECIALS: MenuSection = {
  id: 'specials',
  title: 'Specials',
  items: [
    {
      name: 'Frozen Drink of the Month',
      price: 12,
      description: "Each month brings a new frozen flavor. Ask us what's blending now.",
    },
    {
      name: 'Xtini Tower',
      price: 79,
      description: '8 Xtini espresso vodka, espresso, coffee beans',
    },
  ],
};

export const DRAFT_BEER: MenuSection = {
  id: 'draft-beer',
  title: 'Draft Beer',
  items: [
    { name: 'Ankrolab 239 IPA', price: 8 },
    { name: 'Ankrolab Turtle Season IPA', price: 8 },
    { name: 'Riptide Old Naples Blonde', price: 8 },
    { name: 'Stella', price: 7 },
    { name: 'Michelob Ultra', price: 6 },
    { name: 'Miller Lite', price: 6 },
    { name: 'Yuengling', price: 6 },
  ],
};

export const BOTTLED_BEER: MenuSection = {
  id: 'bottled-beer',
  title: 'Bottled Beer',
  items: [
    { name: 'Budweiser', price: 5 },
    { name: 'Bud Light', price: 5 },
    { name: 'Coors Light', price: 5 },
    { name: 'Miller Lite', price: 5 },
    { name: 'Corona', price: 6 },
    { name: 'Corona Light', price: 6 },
    { name: 'Corona Premier', price: 6 },
    { name: 'Michelob Ultra', price: 6 },
    { name: 'Modelo', price: 6 },
    { name: 'Stella', price: 6 },
    { name: 'Stella N/A', price: 6 },
    { name: 'Yuengling', price: 6 },
  ],
};

export const SELTZERS: MenuSection = {
  id: 'seltzers-canned',
  title: 'Seltzers & Canned Beer',
  items: [
    {
      name: 'High Noon',
      price: 8,
      description: 'Pineapple, watermelon, peach, black cherry',
    },
    {
      name: 'High Noon Tea',
      price: 7,
      description: 'Original, raspberry, lemon, peach',
    },
    { name: 'Guinness', price: 8 },
    { name: 'Mango Cart', price: 5 },
    { name: 'Kona Big Wave', price: 5 },
  ],
};

export const WINE_WHITE: MenuSection = {
  id: 'wine-white',
  title: 'White',
  items: [
    { name: 'Champion Sauvignon Blanc', price: 9, house: true },
    { name: 'Maddalena Monterey Chardonnay', price: 9.5, house: true },
    { name: 'Banfi Pinot Grigio', price: 10 },
    { name: 'Kendall Jackson', price: 11 },
    { name: 'Kim Crawford', price: 13 },
  ],
};

export const WINE_BUBBLES: MenuSection = {
  id: 'wine-bubbles',
  title: 'Bubbles',
  items: [{ name: 'Frizzante Prosecco Blanco', price: 9, house: true }],
};

export const WINE_BLUSH: MenuSection = {
  id: 'wine-blush',
  title: 'Blush',
  items: [
    { name: 'Maddalena Rosé', price: 9, house: true },
    { name: 'Whispering Angel', price: 13 },
  ],
};

export const WINE_RED: MenuSection = {
  id: 'wine-red',
  title: 'Red',
  items: [
    { name: 'Maddalena Paso Robles Cabernet', price: 9.5, house: true },
    { name: 'Chateau Ste. Michelle Cabernet', price: 14 },
    { name: 'Meiomi Pinot Noir', price: 14 },
    { name: 'Unshackled Cabernet', price: 16 },
  ],
};

export const WINE_SECTIONS = [WINE_WHITE, WINE_BUBBLES, WINE_BLUSH, WINE_RED] as const;
export const BEER_SECTIONS = [DRAFT_BEER, BOTTLED_BEER, SELTZERS] as const;

/** Se muestra al pie de la carta. Está en el menú impreso, es información legal. */
export const MENU_LEGAL =
  'All listed prices include tax. A 22% gratuity is applied to unsigned bar tabs.';

/** Formatea 9.5 como «9⁵⁰» y 14 como «14», igual que el menú impreso. */
export function formatPrice(price: number): { whole: string; cents: string | null } {
  const whole = Math.floor(price);
  const cents = Math.round((price - whole) * 100);
  return { whole: String(whole), cents: cents ? String(cents).padStart(2, '0') : null };
}

/* ==========================================================================
   EL PUENTE A LA BASE

   ⚠️ TODO LO DE ARRIBA ES AHORA EL RESPALDO, no la fuente. El menú «Sunset
   Bar» está cargado entero en la base de RestoExp —las mismas nueve
   categorías, 50 ítems con precio y descripción— y se descubrió el
   2026-09-15. La transcripción a mano se había hecho porque el sitio viejo
   publica el menú como dos JPG.

   Ahora el cliente cambia un precio en el dashboard y el sitio lo sigue. Estas
   constantes quedan para cuando la base no contesta: una carta desactualizada
   es mala, una carta vacía es peor.
   ========================================================================== */

/**
 * Las cuatro cartas que muestra `/sunset-bar`, agrupadas desde la base.
 *
 * ⚠️ LA BASE TIENE NUEVE CATEGORÍAS Y LA PÁGINA MUESTRA CUATRO BLOQUES. No es
 * una pérdida de información: los cuatro vinos van juntos bajo «Wine», y las
 * tres de cerveza bajo «Beer and seltzers», que es exactamente cómo está
 * impreso el menú de papel. El agrupador respeta el nombre que puso el cliente
 * en cada categoría como subtítulo de columna.
 */
export interface MenuCarta {
  readonly id: string;
  readonly title: string;
  readonly eyebrow: string;
  readonly lead: string | null;
  readonly columnas: readonly MenuSection[];
}

const CARTA_DE = (title: string): string =>
  /wine|bubbles|blush/i.test(title) ? 'wine'
  : /beer|seltzer/i.test(title) ? 'beer'
  : /special/i.test(title) ? 'specials'
  : 'cocktails';

export function cartasFromGroups(
  grupos: readonly { title: string; note: string | null; items: readonly { name: string; description: string | null; base_price: number | null }[] }[],
): readonly MenuCarta[] {
  const META: Record<string, { title: string; eyebrow: string; lead: string | null }> = {
    cocktails: {
      title: 'Signature cocktails',
      eyebrow: 'The list',
      lead: 'Made daily with fresh juice and house syrups, upstairs, by us.',
    },
    specials: { title: 'Specials', eyebrow: 'Right now', lead: null },
    beer: {
      title: 'Beer and seltzers',
      eyebrow: 'On tap and in the can',
      lead: 'Drafts from breweries down the road, and the cans everybody actually orders.',
    },
    wine: { title: 'Wine', eyebrow: 'By the glass', lead: 'House pours are the ones in the happy hour.' },
  };

  const orden = ['cocktails', 'specials', 'beer', 'wine'];
  return orden
    .map((id) => {
      const columnas = grupos
        .filter((g) => CARTA_DE(g.title) === id)
        .map((g) => ({
          id: g.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: g.title,
          ...(g.note ? { subtitle: g.note } : {}),
          items: g.items
            .filter((i) => i.base_price !== null)
            .map((i) => ({
              name: i.name,
              price: i.base_price as number,
              ...(i.description ? { description: i.description } : {}),
            })),
        }))
        .filter((c) => c.items.length > 0);
      return { id, ...META[id], columnas };
    })
    .filter((c) => c.columnas.length > 0);
}

/** El respaldo, con la misma forma que devuelve el agrupador. */
export const CARTAS_FALLBACK: readonly MenuCarta[] = [
  { id: 'cocktails', title: 'Signature cocktails', eyebrow: 'The list', lead: 'Made daily with fresh juice and house syrups, upstairs, by us.', columnas: [SIGNATURE_COCKTAILS] },
  { id: 'specials', title: 'Specials', eyebrow: 'Right now', lead: null, columnas: [SPECIALS] },
  { id: 'beer', title: 'Beer and seltzers', eyebrow: 'On tap and in the can', lead: 'Drafts from breweries down the road, and the cans everybody actually orders.', columnas: [...BEER_SECTIONS] },
  { id: 'wine', title: 'Wine', eyebrow: 'By the glass', lead: 'House pours are the ones in the happy hour.', columnas: [...WINE_SECTIONS] },
];

/**
 * EL RESPALDO, TRADUCIDO A LA FORMA DE LA BASE.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ EXISTE PARA QUE LA PÁGINA TENGA UN SOLO CAMINO DE DIBUJO. La carta se
 * renderiza con `DishCard`, que habla el tipo `Dish` de la base; el respaldo
 * de acá está en el tipo `MenuItem`, que es la transcripción a mano y tiene
 * cuatro campos. Sin este puente habría que escribir la carta dos veces —una
 * por cada forma— y el día que se toque una, la otra queda vieja.
 *
 * ⚠️ LO QUE NO SE INVENTA. Un ítem transcrito no tiene foto, ni dietarios, ni
 * alérgenos, ni variantes: esos campos salen en `null` o en `false` y la
 * tarjeta simplemente no los dibuja. El respaldo se ve más pobre que la carta
 * de la base A PROPÓSITO, porque eso es exactamente lo que es.
 *
 * ⚠️ CADA SECCIÓN DEL RESPALDO ES UN GRUPO, no cada carta. En la base los
 * grupos son las CATEGORÍAS del dashboard —«Signature cocktails», «Draft»,
 * «By the glass»— y las secciones del respaldo son la misma división, así que
 * los tabs salen iguales con datos o sin ellos.
 *
 * ⚠️ `note` DEL ÍTEM VA A `notes` Y NO A LA DESCRIPCIÓN: en la transcripción
 * es la línea de variantes o sabores, que es justo lo que la tarjeta pone en
 * el pie con el filete punteado.
 * ══════════════════════════════════════════════════════════════════════════
 */
export function respaldoComoGrupos(
  cartas: readonly MenuCarta[] = CARTAS_FALLBACK,
): readonly DishGroup[] {
  return cartas.flatMap((carta) =>
    carta.columnas.map((seccion) => ({
      title: seccion.title,
      note: seccion.subtitle ?? null,
      items: seccion.items.map(
        (item): Dish => ({
          name: item.name,
          description: item.description ?? null,
          base_price: item.price,
          base_price_max: null,
          base_is_price_range: false,
          price_variants: null,
          discount_percent: null,
          show_currency: true,
          image_url: null,
          image_alt: null,
          spice_level: null,
          calories: null,
          cooking_time_minutes: null,
          allergens: null,
          tags: null,
          notes: item.note ?? null,
          is_new: false,
          is_suggested: false,
          is_vegan: false,
          is_vegetarian: false,
          is_gluten_free: false,
          is_dairy_free: false,
          is_nut_free: false,
          is_halal: false,
          is_keto: false,
          is_organic: false,
          contains_alcohol: true,
          is_active: true,
          sort_order: null,
        }),
      ),
    })),
  );
}
