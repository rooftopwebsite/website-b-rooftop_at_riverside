import { z } from 'zod';
import type { RawEvent } from '@/content/events';

const API_VERSION = 'v2025-02-19';
const TIMEOUT_MS = 8000;
const FRESH_MS = 5 * 60 * 1000;
const REVALIDATE_S = 300;

const QUERY = `{
  "ready": count(*[_id == "calendarSettings"]) > 0,
  "events": *[_type == "event"] | order(startDate asc, startTime asc, _id asc) {
    _id, title, description, startDate, endDate, startTime, endTime, isRecurring,
    recurrenceDays, location, featured, price, tags, ticketUrl, legacyFlyerPath, flyerAlt,
    "flyerUrl": flyer.asset->url
  }
}`;

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

const LOCATION_TAG: Readonly<Record<string, string>> = {
  'Sunset Bar': 'sunset-bar',
  'The Yard': 'the-yard',
  'Game Lounge': 'game-lounge',
};

const nullable = <T extends z.ZodType>(t: T) => t.nullish().transform((v) => v ?? null);

const docSchema = z.object({
  _id: z.string().min(1),
  title: z.string().trim().min(1),
  description: nullable(z.string()),
  startDate: z.string().regex(DATE),
  endDate: nullable(z.string().regex(DATE)),
  startTime: z.string().regex(TIME),
  endTime: nullable(z.string().regex(TIME)),
  isRecurring: z.boolean().nullish().transform((v) => v === true),
  recurrenceDays: z.array(z.number().int().min(0).max(6)).nullish().transform((v) => v ?? []),
  location: nullable(z.string()),
  featured: z.boolean().nullish().transform((v) => v === true),
  price: nullable(z.number().nonnegative()),
  tags: z.array(z.string()).nullish().transform((v) => v ?? []),
  ticketUrl: nullable(z.string().url()),
  legacyFlyerPath: nullable(z.string()),
  flyerAlt: nullable(z.string()),
  flyerUrl: nullable(z.string().url()),
});

const responseSchema = z.object({
  result: z.object({
    ready: z.boolean(),
    events: z.array(z.unknown()),
  }),
});

type FetchLike = (url: string, init?: RequestInit) => Promise<Response>;

export interface SanityEventsConfig {
  readonly projectId: string;
  readonly dataset: string;
  readonly fetchImpl?: FetchLike;
}

export function toRawEvent(doc: z.infer<typeof docSchema>): RawEvent {
  const tags = [
    ...doc.tags.filter((t) => t !== 'featured' && !Object.values(LOCATION_TAG).includes(t)),
    ...(doc.location && LOCATION_TAG[doc.location] ? [LOCATION_TAG[doc.location]!] : []),
    ...(doc.featured ? ['featured'] : []),
  ];
  const days = doc.isRecurring ? [...doc.recurrenceDays].sort((a, b) => a - b) : [];

  return {
    id: doc._id.replace(/^event-/, ''),
    title: doc.title,
    description: doc.description ?? '',
    bannerUrl: doc.flyerUrl ? `${doc.flyerUrl}?w=1600&fit=max&auto=format` : doc.legacyFlyerPath,
    startDate: doc.startDate,
    endDate: doc.endDate,
    startTime: doc.startTime,
    endTime: doc.endTime,
    isRecurring: doc.isRecurring,
    recurrenceType: doc.isRecurring ? 'weekly' : null,
    recurrenceDays: doc.isRecurring ? JSON.stringify(days) : null,
    price: doc.price,
    tags,
    ticketUrl: doc.ticketUrl,
    imageAlt: doc.flyerAlt,
  };
}

export async function fetchSanityEvents({
  projectId,
  dataset,
  fetchImpl = fetch,
}: SanityEventsConfig): Promise<readonly RawEvent[] | null> {
  const url =
    `https://${projectId}.apicdn.sanity.io/${API_VERSION}/data/query/${dataset}` +
    `?perspective=published&query=${encodeURIComponent(QUERY)}`;

  try {
    // Next's data cache keeps the response for 5 minutes, instead of for as long as the build lasts.
    const init = { signal: AbortSignal.timeout(TIMEOUT_MS), next: { revalidate: REVALIDATE_S } };
    const res = await fetchImpl(url, init as RequestInit);
    if (!res.ok) {
      console.error('[sanity] events query failed:', res.status);
      return null;
    }
    const parsed = responseSchema.safeParse(await res.json());
    if (!parsed.success) {
      console.error('[sanity] events query returned an unexpected shape.');
      return null;
    }
    const { ready, events } = parsed.data.result;
    if (!ready) return null;

    const out: RawEvent[] = [];
    for (const item of events) {
      const doc = docSchema.safeParse(item);
      if (doc.success) out.push(toRawEvent(doc.data));
      else console.error('[sanity] skipped an invalid event:', JSON.stringify(doc.error.issues[0]));
    }
    return out;
  } catch (err) {
    console.error('[sanity] could not reach Sanity:', err);
    return null;
  }
}

let cache: { at: number; events: readonly RawEvent[] } | null = null;
let inFlight: Promise<readonly RawEvent[] | null> | null = null;

export async function sanityEvents(): Promise<readonly RawEvent[] | null> {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;
  if (!projectId || !dataset) return null;

  if (cache && Date.now() - cache.at < FRESH_MS) return cache.events;

  inFlight ??= fetchSanityEvents({ projectId, dataset })
    .then((events) => {
      if (events) cache = { at: Date.now(), events };
      return events ?? cache?.events ?? null;
    })
    .finally(() => {
      inFlight = null;
    });
  return inFlight;
}

export function resetSanityEventsCache(): void {
  cache = null;
  inFlight = null;
}
