import Image from 'next/image';
import type { Dish } from '@/types/content';
import { formatPrice } from '@/content/bar-menu';
import { TAG } from '@/lib/tag';

const DIETARIO: readonly (readonly [keyof Dish, string])[] = [
  ['is_vegan', 'Vegan'],
  ['is_vegetarian', 'Vegetarian'],
  ['is_gluten_free', 'Gluten free'],
  ['is_dairy_free', 'Dairy free'],
  ['is_nut_free', 'Nut free'],
  ['is_halal', 'Halal'],
  ['is_keto', 'Keto'],
  ['is_organic', 'Organic'],
];

const PICANTE = ['', 'Mild', 'Medium', 'Hot', 'Very hot'] as const;

function Precio({ dish }: { readonly dish: Dish }) {
  const signo = dish.show_currency ? '$' : '';

  const numero = (n: number) => {
    const { whole, cents } = formatPrice(n);
    return (
      <>
        {signo}
        {whole}
        {cents ? <sup className="text-[0.62em] font-bold">{cents}</sup> : null}
      </>
    );
  };

  if (dish.base_price === null) return null;

  const rango =
    dish.base_is_price_range && dish.base_price_max !== null && dish.base_price_max > dish.base_price;

  return (
    <span className="flex flex-none items-baseline gap-2">
      {dish.discount_percent && dish.discount_percent > 0 ? (
        <span className="font-body text-caption font-medium text-muted line-through">
          {numero(dish.base_price / (1 - dish.discount_percent / 100))}
        </span>
      ) : null}
      <span className="font-display text-d6 font-bold tabular-nums text-deep">
        {numero(dish.base_price)}
        {rango ? <span className="font-body text-dato font-medium"> to {numero(dish.base_price_max!)}</span> : null}
      </span>
    </span>
  );
}

export default function DishCard({ dish }: { readonly dish: Dish }) {
  const variantes = (dish.price_variants ?? []).filter(
    (v) => v && (v.price ?? null) !== null,
  );
  const chips = DIETARIO.filter(([campo]) => dish[campo] === true).map(([, etiqueta]) => etiqueta);
  const tags = (dish.tags ?? []).filter(Boolean);
  const alergenos = (dish.allergens ?? []).filter(Boolean);
  const picante = dish.spice_level ?? 0;

  const duros = [
    dish.calories !== null ? `${dish.calories} cal` : null,
    dish.cooking_time_minutes !== null ? `${dish.cooking_time_minutes} min` : null,
  ].filter((x): x is string => x !== null);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-shell bg-paper sombra-card">
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
          {variantes.length === 0 ? <Precio dish={dish} /> : null}
        </div>
        {variantes.length > 0 ? (
          <p className="m-0 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            {variantes.map((v, i) => (
              <span key={`${v.name ?? 'v'}-${i}`} className="flex items-baseline gap-1.5">
                {v.name ? (
                  <span className="font-body text-dato font-medium text-muted">{v.name}</span>
                ) : null}
                <span className="font-display text-d7 font-bold tabular-nums text-deep">
                  {dish.show_currency ? '$' : ''}
                  {Number(v.price)}
                </span>
                {i < variantes.length - 1 ? (
                  <span aria-hidden="true" className="ml-0.5 font-body text-dato text-fog">
                    /
                  </span>
                ) : null}
              </span>
            ))}
          </p>
        ) : null}

        {chips.length + tags.length > 0 || picante > 0 || dish.is_new || dish.is_suggested ? (
          <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
            {dish.is_new ? (
              <li className={`rounded-pill bg-sunset ${TAG} text-ink`}>New</li>
            ) : null}
            {dish.is_suggested ? (
              <li className={`rounded-pill bg-deep ${TAG} text-cream`}>Chef&rsquo;s pick</li>
            ) : null}
            {[...chips, ...tags].map((etiqueta) => (
              <li key={etiqueta} className={`rounded-pill bg-cream ${TAG} text-deep`}>
                {etiqueta}
              </li>
            ))}
            {picante > 0 ? (
              <li className={`rounded-pill bg-sunset ${TAG} text-ink`}>
                {PICANTE[picante] ?? 'Spicy'}
              </li>
            ) : null}
          </ul>
        ) : null}

        {dish.description ? (
          <p className="m-0 whitespace-pre-line font-body text-base font-light leading-[1.5] text-body">
            {dish.description}
          </p>
        ) : null}

        {duros.length > 0 ? (
          <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
            {duros.map((d) => (
              <li key={d} className={`rounded-pill bg-bone ${TAG} tabular-nums text-muted`}>
                {d}
              </li>
            ))}
          </ul>
        ) : null}

        {alergenos.length > 0 ? (
          <ul className="m-0 flex list-none flex-wrap items-center gap-1.5 p-0">
            <li className="font-body text-micro font-bold uppercase tracking-cta text-terra">
              Contains
            </li>
            {alergenos.map((a) => (
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
