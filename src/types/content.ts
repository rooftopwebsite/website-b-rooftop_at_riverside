export interface HappyHour {
  readonly days: string;
  readonly daysShort: string;
  readonly time: string;
  readonly deals: readonly { readonly price: string; readonly what: string }[];
  readonly note: string | null;
}

export interface Hours {
  readonly day: string;
  readonly bar: string;
  readonly trucks: string;
}

export interface Dish {
  readonly name: string;
  readonly description: string | null;
  readonly base_price: number | null;
  readonly base_price_max: number | null;
  readonly base_is_price_range: boolean;
  readonly price_variants: readonly { name?: string | null; price?: number | string | null }[] | null;
  readonly discount_percent: number | null;
  readonly show_currency: boolean;
  readonly image_url: string | null;
  readonly image_alt: string | null;
  readonly spice_level: number | null;
  readonly calories: number | null;
  readonly cooking_time_minutes: number | null;
  readonly allergens: readonly string[] | null;
  readonly tags: readonly string[] | null;
  readonly notes: string | null;
  readonly is_new: boolean;
  readonly is_suggested: boolean;
  readonly is_vegan: boolean;
  readonly is_vegetarian: boolean;
  readonly is_gluten_free: boolean;
  readonly is_dairy_free: boolean;
  readonly is_nut_free: boolean;
  readonly is_halal: boolean;
  readonly is_keto: boolean;
  readonly is_organic: boolean;
  readonly contains_alcohol: boolean;
  readonly is_active: boolean;
  readonly sort_order: number | null;
}

export interface DishGroup {
  readonly title: string;
  readonly note: string | null;
  readonly items: readonly Dish[];
}

export interface Person {
  readonly name: string;
  readonly role: string;
  readonly email: string | null;
  readonly bio: string | null;
  readonly photo: string | null;
  readonly photoAlt: string | null;
  readonly quote: string | null;
}

export interface VenueArea {
  readonly slug: string;
  readonly name: string;
  readonly floor: 'Ground floor' | 'Second floor';
  readonly body: string;
  readonly photo: string | null;
  readonly photoAlt: string | null;
  readonly photoBrief: string;
  readonly href?: string;
}

export interface GiveBack {
  readonly title: string;
  readonly tiers: readonly number[];
  readonly body: string;
  readonly partner: string | null;
}
