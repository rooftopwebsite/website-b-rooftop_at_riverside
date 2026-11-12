import { z } from 'zod';
import { withoutEmDash } from './em-dash.ts';

const API_VERSION = 'v2025-02-19';
const TIMEOUT_MS = 8000;
const FRESH_MS = 5 * 60 * 1000;

export const DEFAULT_MENU_LABEL = 'See the menu';
export const DEFAULT_SECOND_MENU_LABEL = 'See the second menu';

// Must match TWO_MENU_SLUGS in the Studio schema.
const TWO_MENU_SLUGS: readonly string[] = ['el-chilango', 'sea-me-on-wheels'];

const QUERY = `*[_type == "truckMenu"] | order(_id){
  _id, truckSlug, menuAvailable, buttonLabel, secondButtonLabel,
  "pdfUrl": menuPdf.asset->url,
  "pdfMime": menuPdf.asset->mimeType,
  "secondPdfUrl": secondMenuPdf.asset->url,
  "secondPdfMime": secondMenuPdf.asset->mimeType
}`;

const docSchema = z.object({
  _id: z.string(),
  truckSlug: z.string().nullish(),
  menuAvailable: z.boolean().nullish(),
  buttonLabel: z.string().nullish(),
  pdfUrl: z.string().nullish(),
  pdfMime: z.string().nullish(),
  secondButtonLabel: z.string().nullish(),
  secondPdfUrl: z.string().nullish(),
  secondPdfMime: z.string().nullish(),
});

const responseSchema = z.object({ result: z.array(docSchema) });

type FetchLike = (url: string, init?: RequestInit) => Promise<Response>;

export interface TruckMenuButton {
  readonly pdfUrl: string;
  readonly label: string;
}

// The valid menu buttons for a truck, in order (one or two).
export type TruckMenuOverrides = ReadonlyMap<string, readonly TruckMenuButton[]>;

export interface TruckMenusConfig {
  readonly projectId: string;
  readonly dataset: string;
  readonly fetchImpl?: FetchLike;
}

function isSanityPdf(value: string, projectId: string, dataset: string): boolean {
  try {
    const u = new URL(value);
    return (
      u.protocol === 'https:' &&
      u.hostname === 'cdn.sanity.io' &&
      u.pathname.startsWith(`/files/${projectId}/${dataset}/`) &&
      u.pathname.toLowerCase().endsWith('.pdf')
    );
  } catch {
    return false;
  }
}

const cleanLabel = (v: string | null | undefined, fallback: string): string =>
  withoutEmDash(v?.trim().slice(0, 40) || null) ?? fallback;

// Resolves to the trucks that have a valid, enabled Sanity menu, keyed by truck slug.
// Any truck missing from the map keeps its local PDF. Null means Sanity could not be read.
export async function fetchTruckMenus({
  projectId,
  dataset,
  fetchImpl = fetch,
}: TruckMenusConfig): Promise<TruckMenuOverrides | null> {
  const url =
    `https://${projectId}.apicdn.sanity.io/${API_VERSION}/data/query/${dataset}` +
    `?perspective=published&query=${encodeURIComponent(QUERY)}`;

  try {
    const res = await fetchImpl(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!res.ok) {
      console.error('[sanity] truck menus query failed:', res.status);
      return null;
    }
    const parsed = responseSchema.safeParse(await res.json());
    if (!parsed.success) {
      console.error('[sanity] truck menus query returned an unexpected shape.');
      return null;
    }

    const out = new Map<string, readonly TruckMenuButton[]>();
    const seen = new Set<string>();
    for (const doc of parsed.data.result) {
      const slug = doc.truckSlug;
      // One document per truck. The canonical id wins, anything else for that truck is ignored.
      if (!slug || seen.has(slug) || doc._id !== `truckMenu-${slug}`) continue;
      seen.add(slug);
      if (doc.menuAvailable !== true) continue;

      const valid = (url: string | null | undefined, mime: string | null | undefined) =>
        mime === 'application/pdf' && !!url && isSanityPdf(url, projectId, dataset);

      const buttons: TruckMenuButton[] = [];
      if (doc.pdfUrl && valid(doc.pdfUrl, doc.pdfMime)) {
        buttons.push({ pdfUrl: doc.pdfUrl, label: cleanLabel(doc.buttonLabel, DEFAULT_MENU_LABEL) });
      }
      if (TWO_MENU_SLUGS.includes(slug) && doc.secondPdfUrl && valid(doc.secondPdfUrl, doc.secondPdfMime)) {
        buttons.push({
          pdfUrl: doc.secondPdfUrl,
          label: cleanLabel(doc.secondButtonLabel, DEFAULT_SECOND_MENU_LABEL),
        });
      }
      if (buttons.length > 0) out.set(slug, buttons);
    }
    return out;
  } catch (err) {
    console.error('[sanity] could not reach Sanity for truck menus:', err);
    return null;
  }
}

let cache: { at: number; menus: TruckMenuOverrides } | null = null;
let inFlight: Promise<TruckMenuOverrides> | null = null;

const NONE: TruckMenuOverrides = new Map();

export async function getTruckMenuOverrides(): Promise<TruckMenuOverrides> {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;
  if (!projectId || !dataset) return NONE;

  if (cache && Date.now() - cache.at < FRESH_MS) return cache.menus;

  inFlight ??= fetchTruckMenus({ projectId, dataset })
    .then((menus) => {
      if (menus) cache = { at: Date.now(), menus };
      return menus ?? cache?.menus ?? NONE;
    })
    .finally(() => {
      inFlight = null;
    });
  return inFlight;
}

export function resetTruckMenuCache(): void {
  cache = null;
  inFlight = null;
}
