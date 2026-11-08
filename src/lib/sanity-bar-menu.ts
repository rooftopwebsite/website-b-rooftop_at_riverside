import { z } from 'zod';
import { COMING_SOON_TEXT, COMING_SOON_TITLE, type BarMenu } from './bar-menu-types.ts';
import { withoutEmDash } from './em-dash.ts';

const API_VERSION = 'v2025-02-19';
const TIMEOUT_MS = 8000;
const FRESH_MS = 5 * 60 * 1000;

const QUERY = `*[_id == "barMenuSettings"][0]{
  menuAvailable, comingSoonTitle, comingSoonText,
  "pdfUrl": menuPdf.asset->url,
  "pdfMime": menuPdf.asset->mimeType
}`;

const text = (max: number) =>
  z
    .string()
    .nullish()
    .transform((v) => withoutEmDash(v?.trim().slice(0, max) || null));

const docSchema = z.object({
  menuAvailable: z.boolean().nullish(),
  comingSoonTitle: text(120),
  comingSoonText: text(400),
  pdfUrl: z.string().nullish(),
  pdfMime: z.string().nullish(),
});

const responseSchema = z.object({ result: docSchema.nullable() });

type FetchLike = (url: string, init?: RequestInit) => Promise<Response>;

export interface BarMenuConfig {
  readonly projectId: string;
  readonly dataset: string;
  readonly fetchImpl?: FetchLike;
}

export { COMING_SOON_TEXT, COMING_SOON_TITLE, type BarMenu };

export const comingSoon = (title?: string | null, body?: string | null): BarMenu => ({
  state: 'soon',
  title: title || COMING_SOON_TITLE,
  text: body || COMING_SOON_TEXT,
});

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

export async function fetchBarMenu({
  projectId,
  dataset,
  fetchImpl = fetch,
}: BarMenuConfig): Promise<BarMenu | null> {
  const url =
    `https://${projectId}.apicdn.sanity.io/${API_VERSION}/data/query/${dataset}` +
    `?perspective=published&query=${encodeURIComponent(QUERY)}`;

  try {
    const res = await fetchImpl(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!res.ok) {
      console.error('[sanity] bar menu query failed:', res.status);
      return null;
    }
    const parsed = responseSchema.safeParse(await res.json());
    if (!parsed.success) {
      console.error('[sanity] bar menu query returned an unexpected shape.');
      return null;
    }
    const doc = parsed.data.result;
    if (!doc) return comingSoon();

    const { pdfUrl, pdfMime } = doc;
    const valid =
      doc.menuAvailable === true &&
      pdfMime === 'application/pdf' &&
      !!pdfUrl &&
      isSanityPdf(pdfUrl, projectId, dataset);

    return valid && pdfUrl
      ? { state: 'pdf', pdfUrl }
      : comingSoon(doc.comingSoonTitle, doc.comingSoonText);
  } catch (err) {
    console.error('[sanity] could not reach Sanity:', err);
    return null;
  }
}

let cache: { at: number; menu: BarMenu } | null = null;
let inFlight: Promise<BarMenu> | null = null;

export async function getBarMenu(): Promise<BarMenu> {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;
  if (!projectId || !dataset) return comingSoon();

  if (cache && Date.now() - cache.at < FRESH_MS) return cache.menu;

  inFlight ??= fetchBarMenu({ projectId, dataset })
    .then((menu) => {
      if (menu) cache = { at: Date.now(), menu };
      return menu ?? cache?.menu ?? comingSoon();
    })
    .finally(() => {
      inFlight = null;
    });
  return inFlight;
}

export function resetBarMenuCache(): void {
  cache = null;
  inFlight = null;
}
