import { z } from 'zod';
import { withoutEmDash } from './em-dash.ts';

const API_VERSION = 'v2025-02-19';
const TIMEOUT_MS = 8000;
const FRESH_MS = 5 * 60 * 1000;
const IMAGE_TYPES = /^image\/(jpeg|png|webp|avif)$/;

const QUERY = `*[_type == "seasonalCocktail" && show == true]{
  _id, name, description, alt, order,
  "photoUrl": photo.asset->url,
  "photoMime": photo.asset->mimeType
}`;

const docSchema = z.object({
  _id: z.string().min(1),
  name: z.string().nullish(),
  description: z.string().nullish(),
  alt: z.string().nullish(),
  order: z.number().nullish(),
  photoUrl: z.string().nullish(),
  photoMime: z.string().nullish(),
});

const responseSchema = z.object({ result: z.array(z.unknown()) });

type FetchLike = (url: string, init?: RequestInit) => Promise<Response>;

export interface SeasonalCocktail {
  readonly id: string;
  readonly name: string;
  readonly description: string | null;
  readonly photoUrl: string;
  readonly photoAlt: string;
}

export interface SeasonalCocktailsConfig {
  readonly projectId: string;
  readonly dataset: string;
  readonly fetchImpl?: FetchLike;
}

function isSanityImage(value: string, projectId: string, dataset: string): boolean {
  try {
    const u = new URL(value);
    return (
      u.protocol === 'https:' &&
      u.hostname === 'cdn.sanity.io' &&
      u.pathname.startsWith(`/images/${projectId}/${dataset}/`)
    );
  } catch {
    return false;
  }
}

const clean = (v: string | null | undefined, max: number): string | null =>
  withoutEmDash(v?.trim().slice(0, max) || null);

// Only published, shown cocktails with a name and a genuine Sanity CDN image. Null means Sanity
// could not be read.
export async function fetchSeasonalCocktails({
  projectId,
  dataset,
  fetchImpl = fetch,
}: SeasonalCocktailsConfig): Promise<readonly SeasonalCocktail[] | null> {
  const url =
    `https://${projectId}.apicdn.sanity.io/${API_VERSION}/data/query/${dataset}` +
    `?perspective=published&query=${encodeURIComponent(QUERY)}`;

  try {
    const res = await fetchImpl(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!res.ok) {
      console.error('[sanity] seasonal cocktails query failed:', res.status);
      return null;
    }
    const parsed = responseSchema.safeParse(await res.json());
    if (!parsed.success) {
      console.error('[sanity] seasonal cocktails query returned an unexpected shape.');
      return null;
    }

    const rows: { order: number; cocktail: SeasonalCocktail }[] = [];
    for (const item of parsed.data.result) {
      const doc = docSchema.safeParse(item);
      if (!doc.success) continue;
      const d = doc.data;
      const name = clean(d.name, 80);
      if (
        !name ||
        !d.photoUrl ||
        !d.photoMime ||
        !IMAGE_TYPES.test(d.photoMime) ||
        !isSanityImage(d.photoUrl, projectId, dataset)
      ) {
        continue;
      }
      rows.push({
        order: d.order ?? Number.POSITIVE_INFINITY,
        cocktail: {
          id: d._id,
          name,
          description: clean(d.description, 280),
          photoUrl: `${d.photoUrl}?w=1200&fit=max&auto=format`,
          photoAlt: clean(d.alt, 160) ?? name,
        },
      });
    }
    rows.sort((a, b) => a.order - b.order || a.cocktail.name.localeCompare(b.cocktail.name));
    return rows.map((r) => r.cocktail);
  } catch (err) {
    console.error('[sanity] could not reach Sanity for seasonal cocktails:', err);
    return null;
  }
}

let cache: { at: number; items: readonly SeasonalCocktail[] } | null = null;
let inFlight: Promise<readonly SeasonalCocktail[]> | null = null;

export async function getSeasonalCocktails(): Promise<readonly SeasonalCocktail[]> {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;
  if (!projectId || !dataset) return [];

  if (cache && Date.now() - cache.at < FRESH_MS) return cache.items;

  inFlight ??= fetchSeasonalCocktails({ projectId, dataset })
    .then((items) => {
      if (items) cache = { at: Date.now(), items };
      return items ?? cache?.items ?? [];
    })
    .finally(() => {
      inFlight = null;
    });
  return inFlight;
}

export function resetSeasonalCocktailsCache(): void {
  cache = null;
  inFlight = null;
}
