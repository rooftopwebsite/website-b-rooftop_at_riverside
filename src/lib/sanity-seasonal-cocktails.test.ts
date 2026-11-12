import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import {
  fetchSeasonalCocktails,
  getSeasonalCocktails,
  resetSeasonalCocktailsCache,
} from './sanity-seasonal-cocktails.ts';

const CFG = { projectId: 'p', dataset: 'd' };
const IMG = (n: string, ext = 'jpg') => `https://cdn.sanity.io/images/p/d/${n}-1200x1500.${ext}`;

const doc = (id: string, extra: Record<string, unknown> = {}) => ({
  _id: id,
  name: `Cocktail ${id}`,
  description: null,
  alt: null,
  order: null,
  photoUrl: IMG(id),
  photoMime: 'image/jpeg',
  ...extra,
});

const reply = (result: unknown, status = 200) => async () =>
  new Response(JSON.stringify({ result }), { status });

const run = async (docs: unknown[]) =>
  fetchSeasonalCocktails({ ...CFG, fetchImpl: reply(docs) });

describe('fetchSeasonalCocktails', () => {
  it('returns an empty list when nothing is visible', async () => {
    assert.deepEqual(await run([]), []);
  });

  it('returns one cocktail with the name, optional description and photo', async () => {
    const out = await run([doc('a', { description: ' Bright and cold. ', alt: 'A pink drink' })]);
    assert.equal(out?.length, 1);
    assert.deepEqual(out?.[0], {
      id: 'a',
      name: 'Cocktail a',
      description: 'Bright and cold.',
      photoUrl: `${IMG('a')}?w=1200&fit=max&auto=format`,
      photoAlt: 'A pink drink',
    });
  });

  it('falls back to the name for alt text and null for an empty description', async () => {
    const out = await run([doc('a', { description: '   ', alt: '' })]);
    assert.equal(out?.[0]?.photoAlt, 'Cocktail a');
    assert.equal(out?.[0]?.description, null);
  });

  it('returns many cocktails sorted by display order, empty order last, then by name', async () => {
    const out = await run([
      doc('c', { name: 'Zed', order: null }),
      doc('b', { name: 'Beta', order: 2 }),
      doc('a', { name: 'Alpha', order: 1 }),
      doc('d', { name: 'Able', order: null }),
    ]);
    assert.deepEqual(out?.map((c) => c.name), ['Alpha', 'Beta', 'Able', 'Zed']);
  });

  it('skips cocktails without a name', async () => {
    const out = await run([doc('a', { name: '  ' }), doc('b', { name: null }), doc('c')]);
    assert.deepEqual(out?.map((c) => c.id), ['c']);
  });

  it('skips missing or invalid images', async () => {
    const bad = [
      { photoUrl: null, photoMime: null },
      { photoMime: 'application/pdf' },
      { photoMime: null },
      { photoUrl: 'https://example.com/x.jpg' },
      { photoUrl: 'https://cdn.sanity.io/images/other/d/x.jpg' },
      { photoUrl: 'https://cdn.sanity.io/files/p/d/x.pdf' },
      { photoUrl: 'http://cdn.sanity.io/images/p/d/x.jpg' },
      { photoUrl: '/images/venue/x.webp' },
    ];
    for (const b of bad) {
      assert.deepEqual(await run([doc('a', b)]), [], JSON.stringify(b));
    }
    const mixed = await run([doc('a', { photoUrl: null }), doc('b')]);
    assert.deepEqual(mixed?.map((c) => c.id), ['b']);
  });

  it('skips malformed documents without failing the rest', async () => {
    const out = await run([{ nope: true }, 'junk', doc('a')]);
    assert.deepEqual(out?.map((c) => c.id), ['a']);
  });

  it('removes em dashes from text', async () => {
    const out = await run([doc('a', { name: 'Sun — Set', description: 'Sweet — and tart' })]);
    assert.ok(!out?.[0]?.name.includes('—'));
    assert.ok(!out?.[0]?.description?.includes('—'));
  });

  it('asks only for shown cocktails from the published, cached endpoint, with no credentials', async () => {
    let seen = '';
    let init: RequestInit | undefined;
    await fetchSeasonalCocktails({
      ...CFG,
      fetchImpl: async (u, i) => {
        seen = u;
        init = i;
        return new Response(JSON.stringify({ result: [] }));
      },
    });
    assert.match(seen, /^https:\/\/p\.apicdn\.sanity\.io\//);
    assert.match(seen, /perspective=published/);
    assert.match(decodeURIComponent(seen), /show == true/);
    assert.equal(init?.headers, undefined);
  });

  it('returns null on a network error, API error or bad shape', async () => {
    const boom = async () => {
      throw new Error('offline');
    };
    assert.equal(await fetchSeasonalCocktails({ ...CFG, fetchImpl: boom }), null);
    assert.equal(await fetchSeasonalCocktails({ ...CFG, fetchImpl: reply([], 500) }), null);
    assert.equal(await fetchSeasonalCocktails({ ...CFG, fetchImpl: reply('nope') }), null);
  });
});

describe('getSeasonalCocktails', () => {
  beforeEach(() => {
    resetSeasonalCocktailsCache();
    delete process.env.SANITY_PROJECT_ID;
    delete process.env.SANITY_DATASET;
  });

  it('is empty and makes no request when Sanity is not configured', async () => {
    const real = globalThis.fetch;
    globalThis.fetch = (async () => {
      throw new Error('should not be called');
    }) as typeof fetch;
    try {
      assert.deepEqual(await getSeasonalCocktails(), []);
    } finally {
      globalThis.fetch = real;
    }
  });

  it('is empty when Sanity fails and nothing is cached', async () => {
    process.env.SANITY_PROJECT_ID = 'p';
    process.env.SANITY_DATASET = 'd';
    const real = globalThis.fetch;
    globalThis.fetch = (async () => {
      throw new Error('offline');
    }) as typeof fetch;
    try {
      assert.deepEqual(await getSeasonalCocktails(), []);
    } finally {
      globalThis.fetch = real;
    }
  });

  it('caches, and keeps the last good list if Sanity then fails', async () => {
    process.env.SANITY_PROJECT_ID = 'p';
    process.env.SANITY_DATASET = 'd';
    const real = globalThis.fetch;
    let calls = 0;
    globalThis.fetch = (async () => {
      calls += 1;
      return new Response(JSON.stringify({ result: [doc('a')] }));
    }) as typeof fetch;
    try {
      await getSeasonalCocktails();
      const again = await getSeasonalCocktails();
      assert.equal(calls, 1);
      assert.equal(again.length, 1);
    } finally {
      globalThis.fetch = real;
    }
  });
});
