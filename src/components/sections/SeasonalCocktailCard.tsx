import Image from 'next/image';
import type { SeasonalCocktail } from '@/lib/sanity-seasonal-cocktails';

export default function SeasonalCocktailCard({ cocktail }: { readonly cocktail: SeasonalCocktail }) {
  return (
    <article className="flex h-full w-full flex-col overflow-hidden rounded-shell bg-paper card-shadow">
      <div className="relative aspect-[4/5] bg-fog">
        <Image
          src={cocktail.photoUrl}
          alt={cocktail.photoAlt}
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 46vw, 92vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-5 lg:p-6">
        <h3 className="m-0 font-display text-d5 font-bold uppercase leading-none text-ink lg:text-d4">
          {cocktail.name}
        </h3>
        {cocktail.description ? (
          <p className="m-0 mt-3 font-body text-data font-light leading-[1.5] text-body">
            {cocktail.description}
          </p>
        ) : null}
      </div>
    </article>
  );
}
