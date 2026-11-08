import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { fetchSanityEvents, toRawEvent } from './sanity-events.ts';

const CFG = { projectId: 'p', dataset: 'd' };

const DOC = {
  _id: 'event-abc',
  title: 'Bingo Night',
  description: 'Every Wednesday.\n$1 off drafts',
  startDate: '2026-11-04',
  endDate: null,
  startTime: '19:00',
  endTime: '21:30',
  isRecurring: true,
  recurrenceDays: [3],
  location: 'The Yard',
  featured: true,
  price: null,
  tags: ['bingo', 'weekly'],
  ticketUrl: null,
  legacyFlyerPath: '/images/events/posters/bingo.webp',
  flyerAlt: null,
  flyerUrl: null,
};

const reply = (result: unknown, status = 200) => async () =>
  new Response(JSON.stringify({ result }), { status });

describe('fetchSanityEvents', () => {
  it('maps a published event to the shape the site already uses', async () => {
    const out = await fetchSanityEvents({ ...CFG, fetchImpl: reply({ ready: true, events: [DOC] }) });
    assert.equal(out?.length, 1);
    const e = out![0]!;
    assert.equal(e.id, 'abc');
    assert.equal(e.recurrenceDays, '[3]');
    assert.equal(e.recurrenceType, 'weekly');
    assert.equal(e.bannerUrl, '/images/events/posters/bingo.webp');
    assert.deepEqual([...e.tags].sort(), ['bingo', 'featured', 'the-yard', 'weekly']);
  });

  it('keeps an intentionally empty published list empty', async () => {
    const out = await fetchSanityEvents({ ...CFG, fetchImpl: reply({ ready: true, events: [] }) });
    assert.deepEqual(out, []);
  });

  it('falls back (null) when the calendar was never imported', async () => {
    const out = await fetchSanityEvents({ ...CFG, fetchImpl: reply({ ready: false, events: [] }) });
    assert.equal(out, null);
  });

  it('falls back (null) on a network error and on an API error', async () => {
    const boom = async () => {
      throw new Error('offline');
    };
    assert.equal(await fetchSanityEvents({ ...CFG, fetchImpl: boom }), null);
    assert.equal(await fetchSanityEvents({ ...CFG, fetchImpl: reply({}, 500) }), null);
    assert.equal(await fetchSanityEvents({ ...CFG, fetchImpl: reply('nope') }), null);
  });

  it('skips one invalid event and keeps the rest', async () => {
    const bad = { ...DOC, _id: 'event-bad', startTime: '7pm' };
    const out = await fetchSanityEvents({ ...CFG, fetchImpl: reply({ ready: true, events: [bad, DOC] }) });
    assert.deepEqual(out?.map((e) => e.id), ['abc']);
  });

  it('uses an uploaded flyer over the old website flyer', () => {
    const e = toRawEvent({
      ...DOC,
      isRecurring: false,
      recurrenceDays: [],
      flyerUrl: 'https://cdn.sanity.io/images/p/d/x-100x100.png',
      flyerAlt: 'A flyer',
    } as never);
    assert.match(e.bannerUrl ?? '', /^https:\/\/cdn\.sanity\.io\/images\/p\/d\/x-100x100\.png\?w=1600/);
    assert.equal(e.imageAlt, 'A flyer');
    assert.equal(e.recurrenceDays, null);
  });

  it('asks only the published, cached endpoint and sends no credentials', async () => {
    let seen = '';
    let init: RequestInit | undefined;
    await fetchSanityEvents({
      ...CFG,
      fetchImpl: async (u, i) => {
        seen = u;
        init = i;
        return new Response(JSON.stringify({ result: { ready: true, events: [] } }));
      },
    });
    assert.match(seen, /^https:\/\/p\.apicdn\.sanity\.io\/v[\d-]+\/data\/query\/d\?perspective=published&/);
    assert.equal(init?.headers, undefined);
  });
});
