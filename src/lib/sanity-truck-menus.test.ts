import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { beforeEach, describe, it } from 'node:test';
import { truckByName } from '../content/trucks.ts';
import {
  DEFAULT_FOOTBALL_LABEL,
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

const football = (slug: string, extra: Record<string, unknown> = {}) =>
  doc(slug, {
    footballSpecialsAvailable: true,
    secondButtonLabel: null,
    secondPdfUrl: PDF(`${slug}-fb`),
    secondPdfMime: 'application/pdf',
    ...extra,
  });

const reply = (result: unknown, status = 200) => async () =>
  new Response(JSON.stringify({ result }), { status });

const SLUGS = ['el-chilango', 'prime-carvery', 'sea-me-on-wheels', 'tropical-fusion'];
const TWO = ['el-chilango', 'sea-me-on-wheels'];

const run = async (d: unknown) => (await fetchTruckMenus({ ...CFG, fetchImpl: reply([d]) })) ?? null;

describe('main menu', () => {
  it('returns nothing when no truck document exists (local PDFs stay)', async () => {
    assert.equal((await fetchTruckMenus({ ...CFG, fetchImpl: reply([]) }))?.size, 0);
  });

  it('ignores a truck whose Menu Available is off, even with a PDF', async () => {
    assert.equal((await run(doc('prime-carvery', { menuAvailable: false })))?.size, 0);
  });

  it('uses the Sanity PDF and default label when enabled and valid', async () => {
    const out = await run(doc('prime-carvery'));
    assert.deepEqual(out?.get('prime-carvery'), {
      main: { pdfUrl: PDF('prime-carvery'), label: DEFAULT_MENU_LABEL },
      football: undefined,
    });
  });

  it('uses the custom button label, trimmed', async () => {
    const out = await run(doc('el-chilango', { buttonLabel: '  See tacos  ' }));
    assert.equal(out?.get('el-chilango')?.main?.label, 'See tacos');
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
      assert.equal((await run(doc('prime-carvery', b)))?.size, 0, JSON.stringify(b));
    }
  });

  it('keeps each truck matched to its own document', async () => {
    const out = await fetchTruckMenus({ ...CFG, fetchImpl: reply(SLUGS.map((s) => doc(s))) });
    for (const s of SLUGS) assert.equal(out?.get(s)?.main?.pdfUrl, PDF(s));
    assert.equal(out?.size, 4);
  });

  it('ignores a document whose id does not match its truck (duplicates)', async () => {
    const out = await run({ ...doc('prime-carvery'), _id: 'someOtherId', pdfUrl: PDF('dupe') });
    assert.equal(out?.size, 0);
  });
});

describe('Football Specials', () => {
  it('every toggle combination, with both PDFs valid', async () => {
    const cases: [boolean, boolean, boolean, boolean][] = [
      // main toggle, football toggle, expect main, expect football
      [false, false, false, false],
      [true, false, true, false],
      [false, true, false, true],
      [true, true, true, true],
    ];
    for (const [m, f, em, ef] of cases) {
      const out = await run(football('el-chilango', { menuAvailable: m, footballSpecialsAvailable: f }));
      const o = out?.get('el-chilango');
      assert.equal(!!o?.main, em, `main ${m}/${f}`);
      assert.equal(!!o?.football, ef, `football ${m}/${f}`);
    }
  });

  it('shows Football Specials alone while the main menu is OFF (main keeps the local PDF)', async () => {
    const out = await run(football('sea-me-on-wheels', { menuAvailable: false }));
    assert.deepEqual(out?.get('sea-me-on-wheels'), {
      main: undefined,
      football: { pdfUrl: PDF('sea-me-on-wheels-fb'), label: DEFAULT_FOOTBALL_LABEL },
    });
  });

  it('uses the custom label, or Football Specials when empty', async () => {
    const custom = await run(football('el-chilango', { secondButtonLabel: ' Game Day ' }));
    assert.equal(custom?.get('el-chilango')?.football?.label, 'Game Day');
    const blank = await run(football('el-chilango', { secondButtonLabel: '  ' }));
    assert.equal(blank?.get('el-chilango')?.football?.label, 'Football Specials');
  });

  it('hides only the Football button when its PDF is missing or invalid', async () => {
    const bad = [
      { secondPdfUrl: null, secondPdfMime: null },
      { secondPdfMime: 'image/png' },
      { secondPdfUrl: 'https://example.com/x.pdf' },
      { secondPdfUrl: 'https://cdn.sanity.io/files/other/d/x.pdf' },
      { secondPdfUrl: 'http://cdn.sanity.io/files/p/d/x.pdf' },
      { secondPdfUrl: '/menus/x.pdf' },
    ];
    for (const b of bad) {
      const o = (await run(football('el-chilango', b)))?.get('el-chilango');
      assert.equal(o?.football, undefined, JSON.stringify(b));
      assert.equal(o?.main?.pdfUrl, PDF('el-chilango'), JSON.stringify(b));
    }
  });

  it('never falls back to the main PDF, in either direction', async () => {
    const noFootballPdf = (await run(football('el-chilango', { secondPdfUrl: null, secondPdfMime: null, menuAvailable: false })));
    assert.equal(noFootballPdf?.size, 0);
    const noMainPdf = (await run(football('el-chilango', { pdfUrl: null, pdfMime: null })))?.get('el-chilango');
    assert.equal(noMainPdf?.main, undefined);
    assert.equal(noMainPdf?.football?.pdfUrl, PDF('el-chilango-fb'));
  });

  it('an old document with a second PDF but no Football toggle shows nothing extra', async () => {
    const out = await run(football('el-chilango', { footballSpecialsAvailable: undefined }));
    assert.equal(out?.get('el-chilango')?.football, undefined);
  });

  it('is ignored on Prime Carvery and Tropical Fusion', async () => {
    const out = await fetchTruckMenus({
      ...CFG,
      fetchImpl: reply([football('prime-carvery'), football('tropical-fusion')]),
    });
    for (const s of ['prime-carvery', 'tropical-fusion']) {
      assert.equal(out?.get(s)?.football, undefined);
      assert.equal(out?.get(s)?.main?.pdfUrl, PDF(s));
    }
  });

  it('keeps each truck matched to its own PDFs', async () => {
    const out = await fetchTruckMenus({ ...CFG, fetchImpl: reply(SLUGS.map((s) => football(s))) });
    for (const s of SLUGS) assert.equal(out?.get(s)?.main?.pdfUrl, PDF(s));
    for (const s of TWO) assert.equal(out?.get(s)?.football?.pdfUrl, PDF(`${s}-fb`));
  });
});

describe('Sanity failures and requests', () => {
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

  it('returns nothing (local PDFs stay) when Sanity fails and nothing is cached', async () => {
    process.env.SANITY_PROJECT_ID = 'p';
    process.env.SANITY_DATASET = 'd';
    const real = globalThis.fetch;
    globalThis.fetch = (async () => {
      throw new Error('offline');
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
      assert.equal(again.get('prime-carvery')?.main?.pdfUrl, PDF('prime-carvery'));
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
