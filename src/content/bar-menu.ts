import type { Dish, DishGroup } from '@/types/content';

export interface MenuItem {
  readonly name: string;
  readonly price: number;
  readonly description?: string;
  readonly note?: string;
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

export const MENU_LEGAL =
  'All listed prices include tax. A 22% gratuity is applied to unsigned bar tabs.';

export function formatPrice(price: number): { whole: string; cents: string | null } {
  const whole = Math.floor(price);
  const cents = Math.round((price - whole) * 100);
  return { whole: String(whole), cents: cents ? String(cents).padStart(2, '0') : null };
}

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

export const CARTAS_FALLBACK: readonly MenuCarta[] = [
  { id: 'cocktails', title: 'Signature cocktails', eyebrow: 'The list', lead: 'Made daily with fresh juice and house syrups, upstairs, by us.', columnas: [SIGNATURE_COCKTAILS] },
  { id: 'specials', title: 'Specials', eyebrow: 'Right now', lead: null, columnas: [SPECIALS] },
  { id: 'beer', title: 'Beer and seltzers', eyebrow: 'On tap and in the can', lead: 'Drafts from breweries down the road, and the cans everybody actually orders.', columnas: [...BEER_SECTIONS] },
  { id: 'wine', title: 'Wine', eyebrow: 'By the glass', lead: 'House pours are the ones in the happy hour.', columnas: [...WINE_SECTIONS] },
];

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
