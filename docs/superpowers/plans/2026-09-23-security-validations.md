# Security: validations, attachments, and timeouts — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the validation and resilience gaps in the six Server Actions and in the external calls, without changing what a legitimate user sees.

**Architecture:** The pure functions (sanitizing names and subjects, pruning the limiter, file signatures, fetch with timeout) live in new modules **with no imports** so they can be tested with `node:test`. The existing server modules (`submissions.ts`, `mail.ts`, `join.ts`, `restoexp.ts`, `blog.ts`, `newsletter.ts`) consume them. The zod schemas, shared between client and server, gain `.max()`.

**Tech Stack:** Next.js 16.3 (App Router, Server Actions), React 19, TypeScript strict, zod 4, Resend 6, Node 24 (`node:test` with native type stripping).

**Spec:** `docs/superpowers/specs/2026-09-23-security-validations-design.md`

## Global Constraints

- Branch: `security/validations-and-timeouts`. Never commit to `main`.
- No new dependencies.
- Do not run Prettier or any formatter: the repo is formatted by hand, with single quotes.
- `npm run build` and `npx tsc --noEmit` clean before every commit.
- All visible text (form error messages) is in English and **without em dashes (—)**.
- The new pure modules (`src/lib/sanitize.ts`, `src/lib/file-signature.ts`, `src/lib/http.ts`) carry **no** imports at all, nor `import 'server-only'`.
- Tests import with the `.ts` extension and run with `npm run test:security`.
- Commit messages in English, ending with `Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>`.
- **Do not send real emails to the client's inboxes.** Every submission test uses `MAIL_TO_*=delivered@resend.dev`, Resend's official test address.

## Review Focus

- **The rate limit is global per IP, not per form:** five submissions of any form use up the quota for all of them. The E2E tests have to restart the dev server between the newsletter batch and the forms batch (Task 7).
- **An empty attachment (`size === 0`) means "attached nothing"**, not an invalid file: the signature check skips it (Task 4).
- **A 5xx on the last attempt** has to be returned as a `Response`, not thrown, so the caller logs it as it does today (Task 5).
- **A `POST` is never retried**, even if it returns 5xx (Task 5).
- **A file name without an extension** or with a leading dot (`.bashrc`) must not lose characters when truncated (Task 1).

---

### Task 1: `sanitize.ts` module, tests, and safe subject in emails

**Files:**
- Create: `src/lib/sanitize.ts`
- Create: `src/lib/security.test.ts`
- Modify: `tsconfig.json` (add `allowImportingTsExtensions`)
- Modify: `package.json` (script `test:security`)
- Modify: `src/lib/submissions.ts` (use `safeSubject` in `sendSubmission`)

**Interfaces:**
- Produces:
  - `safeSubject(s: string): string`
  - `safeFilename(name: string): string`
  - `prune(hits: Map<string, number[]>, now: number, windowMs: number, cap: number): void`

- [ ] **Step 1: Enable imports with extension and the test script**

In `tsconfig.json`, inside `compilerOptions`, after `"noEmit": true,` add:

```json
    "allowImportingTsExtensions": true,
```

In `package.json`, inside `scripts`, after the line `"check:seo": ...,` add:

```json
    "test:security": "node --test src/lib/security.test.ts",
```

- [ ] **Step 2: Write the failing tests**

Create `src/lib/security.test.ts`:

```ts
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { safeSubject, safeFilename, prune } from './sanitize.ts';

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
    assert.equal(safeFilename('my<cv>:"|?*\u0000\u001f.pdf'), 'mycv.pdf');
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
  it('falls back to attachment if nothing is left', () => {
    assert.equal(safeFilename(''), 'attachment');
    assert.equal(safeFilename('///'), 'attachment');
    assert.equal(safeFilename('<>?'), 'attachment');
  });
});

describe('prune', () => {
  const WINDOW = 1000;
  it('touches nothing if it is below the cap', () => {
    const hits = new Map([['a', [0]]]);
    prune(hits, 5000, WINDOW, 10);
    assert.equal(hits.size, 1);
  });
  it('drops the expired keys when it exceeds the cap', () => {
    const hits = new Map([
      ['old', [0]],
      ['new', [4800]],
      ['other', [4900]],
    ]);
    prune(hits, 5000, WINDOW, 2);
    assert.deepEqual([...hits.keys()].sort(), ['new', 'other']);
  });
  it('if there are still too many, drops the ones with the oldest activity', () => {
    const hits = new Map([
      ['a', [4100]],
      ['b', [4900]],
      ['c', [4500]],
    ]);
    prune(hits, 5000, WINDOW, 2);
    assert.deepEqual([...hits.keys()].sort(), ['b', 'c']);
  });
});
```

- [ ] **Step 3: Run the tests and watch them fail**

Run: `npm run test:security`
Expected: FAIL with `ERR_MODULE_NOT_FOUND` (`sanitize.ts` doesn't exist yet).

- [ ] **Step 4: Implement `sanitize.ts`**

Create `src/lib/sanitize.ts`:

```ts
export function safeSubject(s: string): string {
  return s.replace(/[\r\n]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

const MAX_NAME = 100;

export function safeFilename(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? '';
  const clean = base.replace(/[\u0000-\u001f\u007f<>:"|?*]/g, '').trim();
  if (!clean) return 'attachment';
  if (clean.length <= MAX_NAME) return clean;
  const dot = clean.lastIndexOf('.');
  const ext = dot > 0 && clean.length - dot <= 10 ? clean.slice(dot) : '';
  return clean.slice(0, MAX_NAME - ext.length) + ext;
}

export function prune(hits: Map<string, number[]>, now: number, windowMs: number, cap: number): void {
  if (hits.size <= cap) return;
  for (const [key, stamps] of hits) {
    if (!stamps.some((t) => now - t < windowMs)) hits.delete(key);
  }
  if (hits.size <= cap) return;
  const order = [...hits].sort((a, b) => Math.max(...a[1]) - Math.max(...b[1]));
  for (const [key] of order.slice(0, hits.size - cap)) hits.delete(key);
}
```

- [ ] **Step 5: Run the tests and watch them pass**

Run: `npm run test:security`
Expected: PASS, 12 tests, 0 failures.

- [ ] **Step 6: Use `safeSubject` when sending**

In `src/lib/submissions.ts`, add to the imports block:

```ts
import { safeSubject } from './sanitize';
```

and inside `sendSubmission` replace:

```ts
    subject: s.subject,
```

with:

```ts
    subject: safeSubject(s.subject),
```

- [ ] **Step 7: Verify and commit**

Run: `npx tsc --noEmit && npm run build`
Expected: no errors.

```bash
git add src/lib/sanitize.ts src/lib/security.test.ts tsconfig.json package.json src/lib/submissions.ts
git commit -m "Email subjects no longer accept line breaks from the user, with tests for the sanitizing functions"
```

---

### Task 2: Rate limit on the newsletter and pruning the limiter

**Files:**
- Modify: `src/app/actions/newsletter.ts`
- Modify: `src/lib/submissions.ts` (function `rateLimited`)

**Interfaces:**
- Consumes: `prune` from `src/lib/sanitize.ts` (Task 1); `rateLimited(): Promise<boolean>` from `src/lib/submissions.ts` (already exists).

- [ ] **Step 1: Prune the map on every call**

In `src/lib/submissions.ts`, change the import from Task 1 to:

```ts
import { safeSubject, prune } from './sanitize';
```

below `const MAX_PER_WINDOW = 5;` add:

```ts
const MAX_KEYS = 1000;
```

and in `rateLimited()`, replace:

```ts
  const key = await clientKey();
  const now = Date.now();
```

with:

```ts
  const key = await clientKey();
  const now = Date.now();
  prune(HITS, now, WINDOW_MS, MAX_KEYS);
```

- [ ] **Step 2: Rate limit on the newsletter and drop the unused imports**

In `src/app/actions/newsletter.ts`, replace:

```ts
import { BRAND } from '@/lib/brand';
import { sendMail } from '@/lib/mail';
```

with:

```ts
import { rateLimited } from '@/lib/submissions';
```

and replace:

```ts
  const { firstName, email } = parsed.data;
  const webhook = process.env.NEWSLETTER_SHEETS_WEBHOOK_URL;
```

with:

```ts
  if (await rateLimited()) {
    return {
      status: 'error',
      message: 'That is a few sign-ups in a short while. Give it ten minutes and try again.',
    };
  }

  const { firstName, email } = parsed.data;
  const webhook = process.env.NEWSLETTER_SHEETS_WEBHOOK_URL;
```

- [ ] **Step 3: Verify**

Run: `npm run test:security && npx tsc --noEmit && npm run build`
Expected: tests PASS, no type or build errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/actions/newsletter.ts src/lib/submissions.ts
git commit -m "The newsletter goes through the rate limit like the other forms, and the limiter stops growing without a cap"
```

---

### Task 3: Maximum lengths in the schemas

**Files:**
- Modify: `src/lib/schemas/contact.ts`
- Modify: `src/lib/schemas/event-inquiry.ts`
- Modify: `src/lib/schemas/join.ts`
- Modify: `src/lib/schemas/market-vendor.ts`
- Modify: `src/app/actions/newsletter.ts` (its internal schema)

**Interfaces:** no new ones; the inferred types don't change.

Messages to use (in English, without em dash):
- Names: `'Keep this under 100 characters.'`
- Email: `'That email is too long.'`
- Phone: `'That phone number is too long.'`
- 200-character fields: `'Keep this under 200 characters.'`

- [ ] **Step 1: `contact.ts`**

- `name: z.string().trim().min(2, 'Enter your name so we know who is writing.'),` → add `.max(100, 'Keep this under 100 characters.')` before the trailing comma.
- `email: z.string().trim().email('Enter a valid email.'),` → add `.max(254, 'That email is too long.')` before the trailing comma.
- In the `phone: z .string() .trim()` block, after the `.trim()` line insert the line `    .max(30, 'That phone number is too long.')`, with the same indentation as `.trim()`.

- [ ] **Step 2: `event-inquiry.ts`**

- `name` → `.max(100, 'Keep this under 100 characters.')`
- `email` → `.max(254, 'That email is too long.')`
- In `phone`, after `.trim()` insert `.max(30, 'That phone number is too long.')`.
- `startTime: z.string().trim().optional().default(''),` → `startTime: z.string().trim().max(200, 'Keep this under 200 characters.').optional().default(''),`
- `endTime`: the same change.

- [ ] **Step 3: `join.ts`**

- `const name = (field: string) => z.string().trim().min(2, \`Enter your ${field}.\`);` → add `.max(100, 'Keep this under 100 characters.')` before the `;`.
- `const mail = z.string().trim().email('Enter a valid email.');` → add `.max(254, 'That email is too long.')` before the `;`.
- In `const phone = z .string() .trim()`, after `.trim()` insert `.max(30, 'That phone number is too long.')`.
- `position`, `address`, `cityState`, and `startDate`: add `.max(200, 'Keep this under 200 characters.')` after the `.min(...)`.

- [ ] **Step 4: `market-vendor.ts`**

- `business`, `dates` → `.max(200, 'Keep this under 200 characters.')` after the `.min(...)`.
- `name` → `.max(100, 'Keep this under 100 characters.')`.
- `email` → `.max(254, 'That email is too long.')`.
- In `phone`, after `.trim()` insert `.max(30, 'That phone number is too long.')`.

- [ ] **Step 5: `newsletter.ts`**

```ts
  firstName: z.string().trim().min(2, 'Enter your first name.').max(100, 'Keep this under 100 characters.'),
  email: z.string().trim().email('Enter a valid email.').max(254, 'That email is too long.'),
```

- [ ] **Step 6: Verify that no free-text field was left without a cap**

Run:

```bash
for f in src/lib/schemas/*.ts src/app/actions/newsletter.ts; do grep -nE "z\.string\(\)\.trim\(\)\.(min|email)" "$f" | grep -v "\.max("; done
```

Expected: no output.

Run: `npx tsc --noEmit && npm run build`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/lib/schemas src/app/actions/newsletter.ts
git commit -m "Every free-text field in the forms has a maximum length, on the client and on the server"
```

---

### Task 4: Real signature of attachments and attaching what was validated

**Files:**
- Create: `src/lib/file-signature.ts`
- Modify: `src/lib/security.test.ts` (signature tests)
- Modify: `src/app/actions/join.ts` (`attachments`, `submitJob`, `submitArtist`)
- Modify: `src/lib/submissions.ts` (`fileToAttachment` with `safeFilename`)

**Interfaces:**
- Consumes: `safeFilename` (Task 1).
- Produces: `signatureMatches(bytes: Uint8Array, mime: string): boolean`

- [ ] **Step 1: Write the failing tests**

In `src/lib/security.test.ts`, add to the imports block:

```ts
import { signatureMatches } from './file-signature.ts';
```

and at the end of the file:

```ts
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
```

- [ ] **Step 2: Run the tests and watch them fail**

Run: `npm run test:security`
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `file-signature.ts`.

- [ ] **Step 3: Implement `file-signature.ts`**

Create `src/lib/file-signature.ts`:

```ts
const bytesStartWith = (b: Uint8Array, signature: readonly number[], from = 0): boolean =>
  b.length >= from + signature.length && signature.every((x, i) => b[from + i] === x);

const ascii = (s: string): number[] => [...s].map((c) => c.charCodeAt(0));

const SIGNATURES: Readonly<Record<string, (b: Uint8Array) => boolean>> = {
  'application/pdf': (b) => bytesStartWith(b, ascii('%PDF')),
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': (b) =>
    bytesStartWith(b, [0x50, 0x4b, 0x03, 0x04]),
  'application/msword': (b) => bytesStartWith(b, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]),
  'image/jpeg': (b) => bytesStartWith(b, [0xff, 0xd8, 0xff]),
  'image/png': (b) => bytesStartWith(b, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  'image/webp': (b) => bytesStartWith(b, ascii('RIFF')) && bytesStartWith(b, ascii('WEBP'), 8),
  'image/avif': (b) =>
    bytesStartWith(b, ascii('ftyp'), 4) && (bytesStartWith(b, ascii('avif'), 8) || bytesStartWith(b, ascii('avis'), 8)),
};

export function signatureMatches(bytes: Uint8Array, mime: string): boolean {
  const rule = SIGNATURES[mime];
  return rule ? rule(bytes) : false;
}
```

- [ ] **Step 4: Run the tests and watch them pass**

Run: `npm run test:security`
Expected: PASS, 21 tests, 0 failures.

- [ ] **Step 5: `fileToAttachment` with a safe name**

In `src/lib/submissions.ts`, change the import to:

```ts
import { safeSubject, safeFilename, prune } from './sanitize';
```

and in `fileToAttachment` replace:

```ts
    filename: f.name || 'attachment',
```

with:

```ts
    filename: safeFilename(f.name),
```

- [ ] **Step 6: Attach from what was validated and verify the signature in `join.ts`**

In `src/app/actions/join.ts`, add to the imports block:

```ts
import { signatureMatches } from '@/lib/file-signature';
```

Replace the whole `attachments` function with these two:

```ts
async function attachments(
  fields: readonly { readonly file: File | undefined; readonly prefix: string }[],
): Promise<MailAttachment[]> {
  const out: MailAttachment[] = [];
  for (const c of fields) {
    const a = await fileToAttachment(c.file);
    if (a) out.push({ ...a, filename: `${c.prefix} ${a.filename}` });
  }
  return out;
}

async function checkSignatures(
  fields: readonly {
    readonly name: string;
    readonly file: File | undefined;
    readonly tag: string;
    readonly format: string;
  }[],
): Promise<Record<string, string>> {
  const errors: Record<string, string> = {};
  for (const c of fields) {
    if (!c.file || c.file.size === 0) continue;
    const head = new Uint8Array(await c.file.slice(0, 16).arrayBuffer());
    if (!signatureMatches(head, c.file.type)) {
      errors[c.name] = `${c.tag} doesn't look like ${c.format}.`;
    }
  }
  return errors;
}
```

In `submitJob`, right after the `if (!parsed.success) { ... }` block (before `const venue = await getVenue();`), insert:

```ts
  const signatures = await checkSignatures([
    {
      name: 'resume',
      file: parsed.data.resume,
      tag: 'Your resume',
      format: 'a PDF or a Word document',
    },
  ]);
  if (Object.keys(signatures).length > 0) {
    return {
      status: 'error',
      message: 'Some fields need another look before this can go out.',
      fieldErrors: signatures,
    };
  }
```

and replace:

```ts
  const files = await attachments(formData, [{ name: 'resume', prefix: 'Resume' }]);
```

with:

```ts
  const files = await attachments([{ file: d.resume, prefix: 'Resume' }]);
```

In `submitArtist`, right after its `if (!parsed.success) { ... }` block, insert:

```ts
  const signatures = await checkSignatures([
    { name: 'logo', file: parsed.data.logo, tag: 'Your logo', format: 'an image' },
    { name: 'photo', file: parsed.data.photo, tag: 'Your photo', format: 'an image' },
  ]);
  if (Object.keys(signatures).length > 0) {
    return {
      status: 'error',
      message: 'Some fields need another look before this can go out.',
      fieldErrors: signatures,
    };
  }
```

and replace:

```ts
  const files = await attachments(formData, [
    { name: 'logo', prefix: 'Logo' },
    { name: 'photo', prefix: 'Photo' },
  ]);
```

with:

```ts
  const files = await attachments([
    { file: d.logo, prefix: 'Logo' },
    { file: d.photo, prefix: 'Photo' },
  ]);
```

If after these changes `formData` ends up unused in either of the two actions, leave it as is: it is part of the signature that `useActionState` requires.

- [ ] **Step 7: Verify and commit**

Run: `npm run test:security && npx tsc --noEmit && npm run build`
Expected: tests PASS, no errors.

```bash
git add src/lib/file-signature.ts src/lib/security.test.ts src/app/actions/join.ts src/lib/submissions.ts
git commit -m "Attachments are verified by their real content, come from what was validated, and carry the sanitized name"
```

---

### Task 5: Timeouts on external calls

**Files:**
- Create: `src/lib/http.ts`
- Modify: `src/lib/security.test.ts` (tests for `fetchWithTimeout` and `withTimeout`)
- Modify: `src/lib/restoexp.ts` (`query`)
- Modify: `src/lib/blog.ts` (`readFeed`)
- Modify: `src/lib/mail.ts` (`sendMail`)

**Interfaces:**
- Produces:
  - `fetchWithTimeout(url: string, init?: RequestInit, opciones?: { ms?: number; retries?: number }): Promise<Response>`
  - `withTimeout<T>(promise: Promise<T>, ms: number): Promise<T>`

- [ ] **Step 1: Write the failing tests**

In `src/lib/security.test.ts`, add to the imports:

```ts
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { withTimeout, fetchWithTimeout } from './http.ts';
```

and at the end of the file:

```ts
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
  it('returns the response without retrying if it succeeds', async () => {
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
  it('does not retry a POST even if it returns 5xx', async () => {
    const s = await startServer(() => ({ status: 503 }));
    const res = await fetchWithTimeout(s.url, { method: 'POST' });
    assert.equal(res.status, 503);
    assert.equal(s.calls(), 1);
    s.close();
  });
  it('cuts off on timeout and throws if every attempt hangs', async () => {
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
```

- [ ] **Step 2: Run the tests and watch them fail**

Run: `npm run test:security`
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `http.ts`.

- [ ] **Step 3: Implement `http.ts`**

Create `src/lib/http.ts`:

```ts
export async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  { ms = 5000, retries = 1 }: { ms?: number; retries?: number } = {},
): Promise<Response> {
  const method = (init.method ?? 'GET').toUpperCase();
  const attempts = method === 'GET' ? retries + 1 : 1;
  let lastError: unknown = new Error(`fetch with no attempts: ${url}`);
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(url, { ...init, signal: AbortSignal.timeout(ms) });
      if (res.status >= 500 && i < attempts - 1) continue;
      return res;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let clock: ReturnType<typeof setTimeout> | undefined;
  const limit = new Promise<never>((_, reject) => {
    clock = setTimeout(() => reject(new Error(`timeout of ${ms} ms`)), ms);
  });
  return Promise.race([promise, limit]).finally(() => clearTimeout(clock));
}
```

- [ ] **Step 4: Run the tests and watch them pass**

Run: `npm run test:security`
Expected: PASS, 29 tests, 0 failures.

- [ ] **Step 5: Supabase with timeout**

In `src/lib/restoexp.ts`, add to the imports block:

```ts
import { fetchWithTimeout } from './http';
```

and in `query()` replace:

```ts
    const res = await fetch(`${URL_BASE}/rest/v1/${path}`, {
```

with:

```ts
    const res = await fetchWithTimeout(`${URL_BASE}/rest/v1/${path}`, {
```

- [ ] **Step 6: Blog feed with timeout**

In `src/lib/blog.ts`, add to the imports block:

```ts
import { fetchWithTimeout } from './http';
```

and in `readFeed` replace:

```ts
  const res = await fetch(url, {
```

with:

```ts
  const res = await fetchWithTimeout(url, {
```

- [ ] **Step 7: Resend with timeout and no retry**

In `src/lib/mail.ts`, add to the imports block:

```ts
import { withTimeout } from './http';
```

below the imports add:

```ts
const TIMEOUT_MAIL_MS = 10_000;
```

and replace:

```ts
    const { error } = await resend.emails.send({
```

with:

```ts
    const { error } = await withTimeout(resend.emails.send({
```

Then close the call: on the `    });` line that closes the `resend.emails.send` object, right before `if (error) {`, replace it with:

```ts
    }), TIMEOUT_MAIL_MS);
```

A timeout falls into the existing `catch`, which logs and returns `ok: false`.

- [ ] **Step 8: Verify and commit**

Run: `npm run test:security && npx tsc --noEmit && npm run build`
Expected: tests PASS, no errors. The build makes real fetches to Supabase and to the feed: they have to keep working (the pages are generated the same as before).

```bash
git add src/lib/http.ts src/lib/security.test.ts src/lib/restoexp.ts src/lib/blog.ts src/lib/mail.ts
git commit -m "Supabase, the blog feed, and Resend have timeouts; reads retry once and email never does"
```

---

### Task 6: Environment variable warning on startup

**Files:**
- Create: `src/instrumentation.ts`
- Modify: `.env.example`

- [ ] **Step 1: Create `src/instrumentation.ts`**

```ts
const REQUIRED = [
  'RESEND_API_KEY',
  'RESEND_FROM',
  'MAIL_TO_CONTACT',
  'MAIL_TO_EVENTS',
  'MAIL_TO_CAREERS',
  'MAIL_TO_MARKET',
  'MAIL_TO_BOOKING',
  'NEWSLETTER_SHEETS_WEBHOOK_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SUPABASE_RESTAURANT_ID',
  'BLOG_FEED_ORIGIN',
  'BLOG_RESTAURANT_ID',
] as const;

export function register(): void {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const missing = REQUIRED.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    console.warn(`[env] Missing variables: ${missing.join(', ')}. The site starts anyway with its fallbacks.`);
  }
}
```

- [ ] **Step 2: Fix `.env.example`**

Replace the block:

```
# ── Site ──────────────────────────────────────────────────────────────────
NEXT_PUBLIC_SITE_URL=
```

with:

```
# ── Blog ──────────────────────────────────────────────────────────────────
# The dashboard's public feed. If they are missing, `lib/blog.ts` uses
# https://app.restoexp.com and NEXT_PUBLIC_SUPABASE_RESTAURANT_ID.
BLOG_FEED_ORIGIN=
BLOG_RESTAURANT_ID=
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npm run build`
Expected: no errors. Then, `npx next start -p 3457` and watch the output: if any variable is missing from `.env.local` (for example `NEWSLETTER_SHEETS_WEBHOOK_URL`, which doesn't exist today), the line `[env] Missing variables: ...` appears and the server answers 200 on `/`. Kill the server when done (on Windows: `netstat -ano | grep :3457` and `Stop-Process -Id <pid> -Force`).

- [ ] **Step 4: Commit**

```bash
git add src/instrumentation.ts .env.example
git commit -m "The server warns on startup which environment variables are missing, and .env.example lists the ones the code uses"
```

---

### Task 7: End-to-end verification in the browser

**Files:**
- Create (temporary, deleted when done): `_e2e-security.mjs` at the repo root (Playwright only resolves from there).

- [ ] **Step 1: Start the dev server without real emails**

```bash
MAIL_TO_CONTACT=delivered@resend.dev MAIL_TO_EVENTS=delivered@resend.dev MAIL_TO_CAREERS=delivered@resend.dev MAIL_TO_MARKET=delivered@resend.dev MAIL_TO_BOOKING=delivered@resend.dev npx next dev -p 3458
```

Read the log and confirm the port it announces: on this machine port 3000 is used by another project.

- [ ] **Step 2: Batch A, newsletter (with the freshly started server)**

With Playwright, at `http://localhost:3458/`, fill in the footer newsletter form (name `Test`, email `test@example.com`) and submit it 6 times in a row.
Expected: the first 5 submissions show `Sign-up isn’t live yet...` (the webhook doesn't exist yet) and the sixth shows `That is a few sign-ups in a short while...`.

- [ ] **Step 3: Restart the dev server**

The rate limit is global per IP and in memory: kill the server and start it again with the same command from Step 1.

- [ ] **Step 4: Batch B, rejections**

- On `/join-us`, job lane: attach as the resume a text file renamed `fake.pdf` with type `application/pdf` and fill in the rest of the required fields with valid data. Expected: the field error `Your resume doesn't look like a PDF or a Word document.`, and no email sent.
- On `/contact`: type a 101-character name and submit. Expected: the error `Keep this under 100 characters.` on the field, visible before any submission.

- [ ] **Step 5: Batch B, valid submissions**

Submit with valid data, each one once: `/contact`, the `/events` inquiry, the `/join-us` job lane with a real PDF (generate it with the bytes `%PDF-1.4` and a minimal body), and the `/market` application. That's 4 submissions, below the quota of 5.
Expected: all four show their usual success message, and the dev server log shows one `mail.sent` line for each, addressed to `delivered@resend.dev`.

- [ ] **Step 6: Clean console and wrap-up**

Throughout the whole batch, no new console errors and no hydration errors. Kill the dev server, delete `_e2e-security.mjs`, and confirm `git status` has no stray files.

- [ ] **Step 7: Final build**

Run: `npm run test:security && npx tsc --noEmit && npm run build`
Expected: all green. This task produces no commit of its own.
