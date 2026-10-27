import Image from 'next/image';
import type { Dish } from '@/types/content';
import { formatPrice } from '@/content/bar-menu';
import { TAG } from '@/lib/tag';

const DIETARY: readonly (readonly [keyof Dish, string])[] = [
  ['is_vegan', 'Vegan'],
  ['is_vegetarian', 'Vegetarian'],
  ['is_gluten_free', 'Gluten free'],
  ['is_dairy_free', 'Dairy free'],
  ['is_nut_free', 'Nut free'],
  ['is_halal', 'Halal'],
  ['is_keto', 'Keto'],
  ['is_organic', 'Organic'],
];

const SPICY = ['', 'Mild', 'Medium', 'Hot', 'Very hot'] as const;

function Price({ dish }: { readonly dish: Dish }) {
  const sign = dish.show_currency ? '$' : '';

  const number = (n: number) => {
    const { whole, cents } = formatPrice(n);
    return (
      <>
        {sign}
        {whole}
        {cents ? <sup className="text-[0.62em] font-bold">{cents}</sup> : null}
      </>
    );
  };

  if (dish.base_price === null) return null;

  const range =
    dish.base_is_price_range && dish.base_price_max !== null && dish.base_price_max > dish.base_price;

  return (
    <span className="flex flex-none items-baseline gap-2">
      {dish.discount_percent && dish.discount_percent > 0 ? (
        <span className="font-body text-caption font-medium text-muted line-through">
          {number(dish.base_price / (1 - dish.discount_percent / 100))}
        </span>
      ) : null}
      <span className="font-display text-d6 font-bold tabular-nums text-deep">
        {number(dish.base_price)}
        {range ? <span className="font-body text-data font-medium"> to {number(dish.base_price_max!)}</span> : null}
      </span>
    </span>
  );
}

export default function DishCard({ dish }: { readonly dish: Dish }) {
  const variants = (dish.price_variants ?? []).filter(
    (v) => v && (v.price ?? null) !== null,
  );
  const chips = DIETARY.filter(([field]) => dish[field] === true).map(([, tag]) => tag);
  const tags = (dish.tags ?? []).filter(Boolean);
  const allergenList = (dish.allergens ?? []).filter(Boolean);
  const spicy = dish.spice_level ?? 0;

  const hardFlags = [
    dish.calories !== null ? `${dish.calories} cal` : null,
    dish.cooking_time_minutes !== null ? `${dish.cooking_time_minutes} min` : null,
  ].filter((x): x is string => x !== null);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-shell bg-paper card-shadow">
      {dish.image_url ? (
        <div className="relative aspect-[3/2] overflow-hidden bg-fog">
          <Image
            src={dish.image_url}
            alt={dish.image_alt ?? ''}
            aria-hidden={dish.image_alt ? undefined : true}
            fill
            unoptimized
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 46vw, 90vw"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col gap-3 p-5.5 lg:p-6">
        <div className="flex items-start justify-between gap-4">
          <h4 className="m-0 font-display text-d6 font-bold uppercase leading-[1.02] text-ink">
            {dish.name}
          </h4>
          {variants.length === 0 ? <Price dish={dish} /> : null}
        </div>
        {variants.length > 0 ? (
          <p className="m-0 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            {variants.map((v, i) => (
              <span key={`${v.name ?? 'v'}-${i}`} className="flex items-baseline gap-1.5">
                {v.name ? (
                  <span className="font-body text-data font-medium text-muted">{v.name}</span>
                ) : null}
                <span className="font-display text-d7 font-bold tabular-nums text-deep">
                  {dish.show_currency ? '$' : ''}
                  {Number(v.price)}
                </span>
                {i < variants.length - 1 ? (
                  <span aria-hidden="true" className="ml-0.5 font-body text-data text-fog">
                    /
                  </span>
                ) : null}
              </span>
            ))}
          </p>
        ) : null}

        {chips.length + tags.length > 0 || spicy > 0 || dish.is_new || dish.is_suggested ? (
          <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
            {dish.is_new ? (
              <li className={`rounded-pill bg-sunset ${TAG} text-ink`}>New</li>
            ) : null}
            {dish.is_suggested ? (
              <li className={`rounded-pill bg-deep ${TAG} text-cream`}>Chef&rsquo;s pick</li>
            ) : null}
            {[...chips, ...tags].map((tag) => (
              <li key={tag} className={`rounded-pill bg-cream ${TAG} text-deep`}>
                {tag}
              </li>
            ))}
            {spicy > 0 ? (
              <li className={`rounded-pill bg-sunset ${TAG} text-ink`}>
                {SPICY[spicy] ?? 'Spicy'}
              </li>
            ) : null}
          </ul>
        ) : null}

        {dish.description ? (
          <p className="m-0 whitespace-pre-line font-body text-base font-light leading-[1.5] text-body">
            {dish.description}
          </p>
        ) : null}

        {hardFlags.length > 0 ? (
          <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
            {hardFlags.map((d) => (
              <li key={d} className={`rounded-pill bg-bone ${TAG} tabular-nums text-muted`}>
                {d}
              </li>
            ))}
          </ul>
        ) : null}

        {allergenList.length > 0 ? (
          <ul className="m-0 flex list-none flex-wrap items-center gap-1.5 p-0">
            <li className="font-body text-micro font-bold uppercase tracking-cta text-terra">
              Contains
            </li>
            {allergenList.map((a) => (
              <li key={a} className={`rounded-pill ${TAG} text-terra ring-1 ring-terra/45`}>
                {a}
              </li>
            ))}
          </ul>
        ) : null}

        {dish.notes ? (
          <p className="m-0 mt-auto whitespace-pre-line border-t border-dashed border-fog pt-3 font-body text-caption font-medium leading-[1.4] text-muted">
            {dish.notes}
          </p>
        ) : null}
      </div>
    </article>
  );
}
