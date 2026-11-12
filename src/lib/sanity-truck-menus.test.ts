import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { beforeEach, describe, it } from 'node:test';
import { truckByName } from '../content/trucks.ts';
import {
  DEFAULT_MENU_LABEL,
  fetchTruckMenus,
  getTruckMenuOverrides,
  resetTruckMenuCache,
} from './sanity-truck-menus.ts';

const CFG = { projectId: 'p', dataset: 'd' };
const PDF = (n: string) => `https://cdn.sanity.io/files/p/d/${n}.pdf`;

const doc = (slug: string, extra: Record<string, unknown> = {}) => ({
  _id: `truckMenu-${slug}`,
  truckSlug: slug,
  menuAvailable: true,
  buttonLabel: null,
  pdfUrl: PDF(slug),
  pdfMime: 'application/pdf',
  ...extra,
});

const reply = (result: unknown, status = 200) => async () =>
  new Response(JSON.stringify({ result }), { status });

const SLUGS = ['el-chilango', 'prime-carvery', 'sea-me-on-wheels', 'tropical-fusion'];

describe('fetchTruckMenus', () => {
  it('returns nothing when no truck document exists (local PDFs stay)', async () => {
    const out = await fetchTruckMenus({ ...CFG, fetchImpl: reply([]) });
    assert.equal(out?.size, 0);
  });

  it('ignores a truck whose Menu Available is off, even with a PDF', async () => {
    const out = await fetchTruckMenus({
      ...CFG,
      fetchImpl: reply([doc('prime-carvery', { menuAvailable: false })]),
    });
    assert.equal(out?.size, 0);
  });

  it('uses the Sanity PDF and default label when enabled and valid', async () => {
    const out = await fetchTruckMenus({ ...CFG, fetchImpl: reply([doc('prime-carvery')]) });
    assert.deepEqual(out?.get('prime-carvery'), {
      pdfUrl: PDF('prime-carvery'),
      label: DEFAULT_MENU_LABEL,
    });
    assert.equal(out?.size, 1);
  });

  it('uses the custom button label, trimmed and capped', async () => {
    const out = await fetchTruckMenus({
      ...CFG,
      fetchImpl: reply([doc('el-chilango', { buttonLabel: '  See tacos  ' })]),
    });
    assert.equal(out?.get('el-chilango')?.label, 'See tacos');
  });

  it('ignores missing, non-PDF or foreign PDFs', async () => {
    const bad = [
      { pdfUrl: null, pdfMime: null },
      { pdfMime: 'image/png' },
      { pdfUrl: 'https://example.com/menu.pdf' },
      { pdfUrl: 'https://cdn.sanity.io/files/other/d/abc.pdf' },
      { pdfUrl: 'https://cdn.sanity.io/files/p/d/abc.png' },
      { pdfUrl: 'http://cdn.sanity.io/files/p/d/abc.pdf' },
      { pdfUrl: '/menus/prime-carvery.pdf' },
    ];
    for (const b of bad) {
      const out = await fetchTruckMenus({ ...CFG, fetchImpl: reply([doc('prime-carvery', b)]) });
      assert.equal(out?.size, 0, JSON.stringify(b));
    }
  });

  it('keeps each truck matched to its own document', async () => {
    const out = await fetchTruckMenus({ ...CFG, fetchImpl: reply(SLUGS.map((s) => doc(s))) });
    for (const s of SLUGS) assert.equal(out?.get(s)?.pdfUrl, PDF(s));
    assert.equal(out?.size, 4);
  });

  it('ignores a document whose id does not match its truck (duplicates)', async () => {
    const out = await fetchTruckMenus({
      ...CFG,
      fetchImpl: reply([{ ...doc('prime-carvery'), _id: 'someOtherId', pdfUrl: PDF('dupe') }]),
    });
    assert.equal(out?.size, 0);
  });

  it('returns null on a network error, API error or bad shape', async () => {
    const boom = async () => {
      throw new Error('offline');
    };
    assert.equal(await fetchTruckMenus({ ...CFG, fetchImpl: boom }), null);
    assert.equal(await fetchTruckMenus({ ...CFG, fetchImpl: reply([], 500) }), null);
    assert.equal(await fetchTruckMenus({ ...CFG, fetchImpl: reply('nope') }), null);
  });

  it('asks only the published, cached endpoint and sends no credentials', async () => {
    let seen = '';
    let init: RequestInit | undefined;
    await fetchTruckMenus({
      ...CFG,
      fetchImpl: async (u, i) => {
        seen = u;
        init = i;
        return new Response(JSON.stringify({ result: [] }));
      },
    });
    assert.match(seen, /^https:\/\/p\.apicdn\.sanity\.io\//);
    assert.match(seen, /perspective=published/);
    assert.equal(init?.headers, undefined);
  });
});

describe('getTruckMenuOverrides', () => {
  beforeEach(() => {
    resetTruckMenuCache();
    delete process.env.SANITY_PROJECT_ID;
    delete process.env.SANITY_DATASET;
  });

  it('makes no request and returns nothing when Sanity is not configured', async () => {
    const real = globalThis.fetch;
    globalThis.fetch = (async () => {
      throw new Error('should not be called');
    }) as typeof fetch;
    try {
      assert.equal((await getTruckMenuOverrides()).size, 0);
    } finally {
      globalThis.fetch = real;
    }
  });

  it('caches for a few minutes, and keeps the last good result if Sanity then fails', async () => {
    process.env.SANITY_PROJECT_ID = 'p';
    process.env.SANITY_DATASET = 'd';
    const real = globalThis.fetch;
    let calls = 0;
    globalThis.fetch = (async () => {
      calls += 1;
      return new Response(JSON.stringify({ result: [doc('prime-carvery')] }));
    }) as typeof fetch;
    try {
      await getTruckMenuOverrides();
      const again = await getTruckMenuOverrides();
      assert.equal(calls, 1);
      assert.equal(again.get('prime-carvery')?.pdfUrl, PDF('prime-carvery'));
    } finally {
      globalThis.fetch = real;
    }
  });
});

describe('truck matching', () => {
  const menus = JSON.parse(readFileSync(new URL('../content/menus.json', import.meta.url), 'utf8')) as {
    name: string;
    pdf: string;
  }[];

  it('maps every local menu to the truck slug the Studio uses, with its local PDF still present', () => {
    assert.deepEqual(
      menus.map((m) => truckByName(m.name)?.slug),
      SLUGS,
    );
    for (const m of menus) {
      assert.ok(readFileSync(new URL(`../../public${m.pdf}`, import.meta.url)).length > 0, m.pdf);
    }
  });
});
