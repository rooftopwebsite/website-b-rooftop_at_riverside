import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { safeSubject, safeFilename, prune } from './sanitize.ts';
import { signatureMatches, detectedType } from './file-signature.ts';
import { withTimeout, fetchWithTimeout } from './http.ts';

describe('safeSubject', () => {
  it('replaces line breaks with a space', () => {
    assert.equal(safeSubject('Hello\r\nBcc: x@y.com'), 'Hello Bcc: x@y.com');
  });
  it('collapses repeated spaces and trims', () => {
    assert.equal(safeSubject('  Job   application:\n\nAna  '), 'Job application: Ana');
  });
  it('leaves a normal subject untouched', () => {
    assert.equal(safeSubject('Booking request: The Band'), 'Booking request: The Band');
  });
});

describe('safeFilename', () => {
  it('strips Windows and Unix paths', () => {
    assert.equal(safeFilename('C:\\Users\\ana\\cv.pdf'), 'cv.pdf');
    assert.equal(safeFilename('../../etc/passwd'), 'passwd');
  });
  it('removes control and forbidden characters', () => {
    assert.equal(safeFilename('mi<cv>:"|?*\u0000\u001f.pdf'), 'micv.pdf');
  });
  it('truncates to 100 characters keeping the extension', () => {
    const length = `${'a'.repeat(150)}.pdf`;
    const r = safeFilename(length);
    assert.equal(r.length, 100);
    assert.ok(r.endsWith('.pdf'));
  });
  it('truncates a long name without extension to 100', () => {
    assert.equal(safeFilename('b'.repeat(130)).length, 100);
  });
  it('does not treat a leading dot as an extension', () => {
    assert.equal(safeFilename('.bashrc'), '.bashrc');
  });
  it('falls back to attachment if left empty', () => {
    assert.equal(safeFilename(''), 'attachment');
    assert.equal(safeFilename('///'), 'attachment');
    assert.equal(safeFilename('<>?'), 'attachment');
  });
});

describe('prune', () => {
  const WINDOW = 1000;
  it('touches nothing when under the cap', () => {
    const hits = new Map([['a', [0]]]);
    prune(hits, 5000, WINDOW, 10);
    assert.equal(hits.size, 1);
  });
  it('drops expired keys when over the cap', () => {
    const hits = new Map([
      ['old', [0]],
      ['new', [4800]],
      ['other', [4900]],
    ]);
    prune(hits, 5000, WINDOW, 2);
    assert.deepEqual([...hits.keys()].sort(), ['new', 'other']);
  });
  it('if still over, drops the ones with the oldest activity', () => {
    const hits = new Map([
      ['a', [4100]],
      ['b', [4900]],
      ['c', [4500]],
    ]);
    prune(hits, 5000, WINDOW, 2);
    assert.deepEqual([...hits.keys()].sort(), ['b', 'c']);
  });
});

const b = (...xs: number[]) => new Uint8Array([...xs, ...new Array(16).fill(0)]);
const ascii = (s: string) => [...s].map((c) => c.charCodeAt(0));
const DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

describe('signatureMatches', () => {
  it('PDF', () => {
    assert.ok(signatureMatches(b(...ascii('%PDF-1.7')), 'application/pdf'));
    assert.ok(!signatureMatches(b(...ascii('hello world')), 'application/pdf'));
  });
  it('DOCX (ZIP)', () => {
    assert.ok(signatureMatches(b(0x50, 0x4b, 0x03, 0x04), DOCX));
    assert.ok(!signatureMatches(b(...ascii('%PDF-1.7')), DOCX));
  });
  it('DOC (OLE)', () => {
    assert.ok(signatureMatches(b(0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1), 'application/msword'));
    assert.ok(!signatureMatches(b(0x50, 0x4b, 0x03, 0x04), 'application/msword'));
  });
  it('JPEG', () => {
    assert.ok(signatureMatches(b(0xff, 0xd8, 0xff, 0xe0), 'image/jpeg'));
    assert.ok(!signatureMatches(b(0x89, 0x50, 0x4e, 0x47), 'image/jpeg'));
  });
  it('PNG', () => {
    assert.ok(signatureMatches(b(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a), 'image/png'));
    assert.ok(!signatureMatches(b(0xff, 0xd8, 0xff), 'image/png'));
  });
  it('WebP', () => {
    assert.ok(signatureMatches(b(...ascii('RIFF'), 0, 0, 0, 0, ...ascii('WEBP')), 'image/webp'));
    assert.ok(!signatureMatches(b(...ascii('RIFF'), 0, 0, 0, 0, ...ascii('WAVE')), 'image/webp'));
  });
  it('AVIF', () => {
    assert.ok(signatureMatches(b(0, 0, 0, 0x20, ...ascii('ftypavif')), 'image/avif'));
    assert.ok(signatureMatches(b(0, 0, 0, 0x20, ...ascii('ftypavis')), 'image/avif'));
    assert.ok(!signatureMatches(b(0, 0, 0, 0x20, ...ascii('ftypheic')), 'image/avif'));
  });
  it('an unknown type never matches', () => {
    assert.ok(!signatureMatches(b(...ascii('%PDF-1.7')), 'text/plain'));
  });
  it('a file shorter than the signature does not match', () => {
    assert.ok(!signatureMatches(new Uint8Array([0x25, 0x50]), 'application/pdf'));
  });
});

describe('detectedType', () => {
  const IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
  const RESUME_MIMES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  it('a WebP with another extension is still detected by its bytes', () => {
    const webp = b(...ascii('RIFF'), 0, 0, 0, 0, ...ascii('WEBP'));
    assert.equal(detectedType(webp, IMAGE_MIMES), 'image/webp');
  });
  it('a PDF is detected against the resume list', () => {
    assert.equal(detectedType(b(...ascii('%PDF-1.7')), RESUME_MIMES), 'application/pdf');
  });
  it('plain text matches nothing', () => {
    assert.equal(detectedType(b(...ascii('hello world')), IMAGE_MIMES), null);
    assert.equal(detectedType(b(...ascii('hello world')), RESUME_MIMES), null);
  });
  it('a type that matches by bytes but is not in the candidate list does not count', () => {
    const pdf = b(...ascii('%PDF-1.7'));
    assert.equal(detectedType(pdf, IMAGE_MIMES), null);
  });
});

function startServer(reply: (n: number, method: string) => { status: number; delayMs?: number }) {
  let n = 0;
  const server: Server = createServer((req, res) => {
    n += 1;
    const { status, delayMs = 0 } = reply(n, req.method ?? 'GET');
    setTimeout(() => {
      res.statusCode = status;
      res.end('ok');
    }, delayMs);
  });
  return new Promise<{ url: string; calls: () => number; close: () => void }>((resolve) => {
    server.listen(0, () => {
      const { port } = server.address() as AddressInfo;
      resolve({
        url: `http://127.0.0.1:${port}/`,
        calls: () => n,
        close: () => server.close(),
      });
    });
  });
}

describe('fetchWithTimeout', () => {
  it('returns the response without retrying when it succeeds', async () => {
    const s = await startServer(() => ({ status: 200 }));
    const res = await fetchWithTimeout(s.url);
    assert.equal(res.status, 200);
    assert.equal(s.calls(), 1);
    s.close();
  });
  it('retries once on a 5xx for GET', async () => {
    const s = await startServer((n) => ({ status: n === 1 ? 503 : 200 }));
    const res = await fetchWithTimeout(s.url);
    assert.equal(res.status, 200);
    assert.equal(s.calls(), 2);
    s.close();
  });
  it('returns the 5xx if the last attempt also fails', async () => {
    const s = await startServer(() => ({ status: 500 }));
    const res = await fetchWithTimeout(s.url);
    assert.equal(res.status, 500);
    assert.equal(s.calls(), 2);
    s.close();
  });
  it('does not retry a 4xx', async () => {
    const s = await startServer(() => ({ status: 404 }));
    const res = await fetchWithTimeout(s.url);
    assert.equal(res.status, 404);
    assert.equal(s.calls(), 1);
    s.close();
  });
  it('does not retry a POST even on 5xx', async () => {
    const s = await startServer(() => ({ status: 503 }));
    const res = await fetchWithTimeout(s.url, { method: 'POST' });
    assert.equal(res.status, 503);
    assert.equal(s.calls(), 1);
    s.close();
  });
  it('times out and throws if every attempt hangs', async () => {
    const s = await startServer(() => ({ status: 200, delayMs: 500 }));
    await assert.rejects(fetchWithTimeout(s.url, {}, { ms: 100 }));
    assert.equal(s.calls(), 2);
    s.close();
  });
});

describe('withTimeout', () => {
  it('resolves if the promise arrives in time', async () => {
    assert.equal(await withTimeout(Promise.resolve(7), 100), 7);
  });
  it('rejects if the promise takes longer than the limit', async () => {
    const slow = new Promise((r) => setTimeout(() => r('late'), 300));
    await assert.rejects(withTimeout(slow, 50), /timeout/);
  });
});
