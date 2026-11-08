import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { signToken, verifyToken, TOKEN_TTL_MS } from './newsletter-token.ts';

const SECRET = 'a'.repeat(40);
const CLAIMS = { email: 'ana@example.com', firstName: 'Ana' };
const T0 = 1_700_000_000_000;

describe('newsletter confirmation token', () => {
  it('round-trips the email and first name', () => {
    const r = verifyToken(signToken(CLAIMS, SECRET, T0), SECRET, T0 + 1000);
    assert.equal(r.ok, true);
    if (r.ok) assert.deepEqual(r.claims, CLAIMS);
  });

  it('is valid right up to 24 hours and expired after', () => {
    const token = signToken(CLAIMS, SECRET, T0);
    assert.equal(verifyToken(token, SECRET, T0 + TOKEN_TTL_MS).ok, true);
    const late = verifyToken(token, SECRET, T0 + TOKEN_TTL_MS + 1);
    assert.deepEqual(late, { ok: false, reason: 'expired' });
  });

  it('rejects a token signed with another secret', () => {
    const token = signToken(CLAIMS, 'b'.repeat(40), T0);
    assert.deepEqual(verifyToken(token, SECRET, T0), { ok: false, reason: 'invalid' });
  });

  it('rejects a payload that was edited after signing', () => {
    const [payload, sig] = signToken(CLAIMS, SECRET, T0).split('.') as [string, string];
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    data.e = 'evil@example.com';
    const forged = `${Buffer.from(JSON.stringify(data)).toString('base64url')}.${sig}`;
    assert.deepEqual(verifyToken(forged, SECRET, T0), { ok: false, reason: 'invalid' });
  });

  it('rejects garbage and empty tokens', () => {
    for (const t of ['', 'abc', 'a.b.c', '.', 'x.y']) {
      assert.deepEqual(verifyToken(t, SECRET, T0), { ok: false, reason: 'invalid' });
    }
  });

  it('refuses to sign or verify with a short secret', () => {
    assert.throws(() => signToken(CLAIMS, 'short', T0));
    const token = signToken(CLAIMS, SECRET, T0);
    assert.deepEqual(verifyToken(token, 'short', T0), { ok: false, reason: 'invalid' });
  });
});
