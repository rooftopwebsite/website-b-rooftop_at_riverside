import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { COMING_SOON_TEXT, COMING_SOON_TITLE, fetchBarMenu } from './sanity-bar-menu.ts';

const CFG = { projectId: 'p', dataset: 'd' };
const PDF = 'https://cdn.sanity.io/files/p/d/abc123-menu.pdf';

const GOOD = {
  menuAvailable: true,
  comingSoonTitle: null,
  comingSoonText: null,
  pdfUrl: PDF,
  pdfMime: 'application/pdf',
};

const reply = (result: unknown, status = 200) => async () =>
  new Response(JSON.stringify({ result }), { status });

const soon = (title = COMING_SOON_TITLE, text = COMING_SOON_TEXT) => ({ state: 'soon', title, text });

describe('fetchBarMenu', () => {
  it('shows the uploaded PDF only when enabled and valid', async () => {
    assert.deepEqual(await fetchBarMenu({ ...CFG, fetchImpl: reply(GOOD) }), {
      state: 'pdf',
      pdfUrl: PDF,
    });
  });

  it('shows Coming Soon when the toggle is off, even with a PDF uploaded', async () => {
    const out = await fetchBarMenu({ ...CFG, fetchImpl: reply({ ...GOOD, menuAvailable: false }) });
    assert.deepEqual(out, soon());
  });

  it('shows Coming Soon when the settings document does not exist yet', async () => {
    assert.deepEqual(await fetchBarMenu({ ...CFG, fetchImpl: reply(null) }), soon());
  });

  it('shows Coming Soon when enabled but the PDF is missing, not a PDF, or from elsewhere', async () => {
    const bad = [
      { pdfUrl: null, pdfMime: null },
      { pdfMime: 'image/png' },
      { pdfUrl: 'https://example.com/menu.pdf' },
      { pdfUrl: 'https://cdn.sanity.io/files/other/d/abc-menu.pdf' },
      { pdfUrl: 'https://cdn.sanity.io/files/p/d/abc-menu.png' },
      { pdfUrl: 'http://cdn.sanity.io/files/p/d/abc-menu.pdf' },
      { pdfUrl: '/menus/sunset-bar.pdf' },
    ];
    for (const b of bad) {
      const out = await fetchBarMenu({ ...CFG, fetchImpl: reply({ ...GOOD, ...b }) });
      assert.deepEqual(out, soon(), JSON.stringify(b));
    }
  });

  it('uses the custom coming-soon copy when it is set', async () => {
    const out = await fetchBarMenu({
      ...CFG,
      fetchImpl: reply({ ...GOOD, menuAvailable: false, comingSoonTitle: ' New menu soon ', comingSoonText: 'Back in May.' }),
    });
    assert.deepEqual(out, soon('New menu soon', 'Back in May.'));
  });

  it('returns null (caller keeps Coming Soon) on a network error, API error or bad shape', async () => {
    const boom = async () => {
      throw new Error('offline');
    };
    assert.equal(await fetchBarMenu({ ...CFG, fetchImpl: boom }), null);
    assert.equal(await fetchBarMenu({ ...CFG, fetchImpl: reply({}, 500) }), null);
    assert.equal(await fetchBarMenu({ ...CFG, fetchImpl: reply('nope') }), null);
  });

  it('asks only the published, cached endpoint and sends no credentials', async () => {
    let seen = '';
    let init: RequestInit | undefined;
    await fetchBarMenu({
      ...CFG,
      fetchImpl: async (u, i) => {
        seen = u;
        init = i;
        return new Response(JSON.stringify({ result: null }));
      },
    });
    assert.match(seen, /^https:\/\/p\.apicdn\.sanity\.io\/v[\d-]+\/data\/query\/d\?perspective=published&/);
    assert.equal(init?.headers, undefined);
  });
});
