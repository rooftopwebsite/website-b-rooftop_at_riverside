# Security: validations, attachments and timeouts

**Date:** 2026-09-23
**Branch:** `security/validations-and-timeouts`
**Sub-project 1 of 6** of the enterprise audit (security → risk-free fixes → comments → CSS → performance → splits). Each one gets its own spec, plan, branch and PR.

## Goal

Close the validation and resilience gaps that Phase 0 found in the site's six Server Actions and in their external calls, **without changing what a legitimate user sees** and without adding dependencies.

The site has no `/api` routes. The surface is the six Server Actions: `submitContact`, `submitEventInquiry`, `submitJob`, `submitArtist`, `submitMarketVendor` and `subscribeToNewsletter`. All of them validate today with zod and have a honeypot.

## Success criteria

1. All six actions go through the rate limit.
2. An attachment whose content doesn't match its declared type is rejected with a field error, and what gets attached to the email comes from the validated result.
3. No free-text field accepts more than its maximum length, on both the client and the server.
4. No external call can hang a render or a submission longer than its timeout.
5. `npm run build` and `npx tsc --noEmit` finish without errors, and the new `node:test` tests pass.
6. A legitimate submission of each form still arrives the same as before.

## Design

### 1. Rate limit

- `subscribeToNewsletter` (`src/app/actions/newsletter.ts`) calls `rateLimited()` after validating, just like the other five. If exceeded, it returns the same kind of error message they do.
- `src/lib/submissions.ts`: the `HITS` map gets pruned. On each call, when it exceeds 1,000 keys, it discards the entries whose last timestamp is outside the window. If after pruning it's still above the cap, it discards the oldest ones. The decision logic (5 submissions every 10 minutes per IP) doesn't change.
- The pruning is extracted into a pure function `prune(hits, now, windowMs, cap)` in `src/lib/sanitize.ts`, so it can be tested.

### 2. Attachments

- `attachments()` in `src/app/actions/join.ts` stops reading from `formData`: it receives the `File`s from `parsed.data` (`resume`; `logo` and `photo`).
- New module `src/lib/file-signature.ts`, with no imports, with a pure function `signatureMatches(bytes: Uint8Array, mime: string): boolean` that compares the first bytes against the type's signature:

  | Type | Signature |
  |---|---|
  | `application/pdf` | `25 50 44 46` (`%PDF`) |
  | `.docx` (`…wordprocessingml.document`) | `50 4B 03 04` (ZIP) |
  | `application/msword` | `D0 CF 11 E0 A1 B1 1A E1` (OLE) |
  | `image/jpeg` | `FF D8 FF` |
  | `image/png` | `89 50 4E 47 0D 0A 1A 0A` |
  | `image/webp` | `52 49 46 46` + `57 45 42 50` at byte 8 |
  | `image/avif` | `66 74 79 70` at byte 4, with brand `avif` or `avis` |

- After the `safeParse`, each action with files checks the signature of every non-empty `File`. If it doesn't match, it returns `status: 'error'` with the field error `"<Label> doesn't look like <format>."`, using the same `fieldErrors` path zod already uses.
- `fileToAttachment` sanitizes the file name with a pure function `safeFilename(name)`: it takes only the part after the last `/` or `\`, strips control characters and `<>:"|?*`, trims to 100 characters while keeping the extension, and falls back to `attachment` if it ends up empty.

### 3. Maximum lengths

`.max()` with an English message is added to every free-text field that doesn't have it today:

| Field | Maximum |
|---|---|
| Names (`name`, `firstName`, `lastName`, helper `name()`) | 100 |
| Email (all of them, including the `mail` helper) | 254 |
| Phone (all of them, including the `phone` helper) | 30 |
| `business`, `position`, `address`, `cityState`, `dates`, `startDate`, `startTime`, `endTime` | 200 |
| Newsletter: `firstName` and `email` | 100 and 254 |

The textareas, `company` and the `table()` cells keep the cap they already have. Since the schemas are shared, the client shows the error before submitting, just as it does today with the minimum.

### 4. External calls

- New `src/lib/http.ts` (no imports) with `fetchWithTimeout(url, init, { ms = 5000, retries = 1 })`:
  - Uses `AbortSignal.timeout(ms)` on each attempt.
  - Retries only on a network error, a timeout or a 5xx, and only on `GET`.
  - Returns the `Response` as is; the caller decides what to do with a 4xx, as today.
  - Keeps the `next: { revalidate, tags }` options it receives.
- `query()` in `src/lib/restoexp.ts` and the fetches in `src/lib/blog.ts` switch to using it. The current fallbacks don't change: local content if Supabase fails, and empty `getPosts` if the feed fails.
- `sendMail` in `src/lib/mail.ts` wraps `resend.emails.send` with a 10-second timeout (`Promise.race`) and **does not retry**, because retrying a send can duplicate an email. A timeout is treated as the error it already handles: log and `ok: false`.

### 5. Email subject

`sendSubmission` applies a pure function `safeSubject(s)` that replaces any `\r` or `\n` with a space and collapses repeated spaces before passing the subject to Resend.

### 6. Environment variables

- New `src/instrumentation.ts` with `register()`. Only in the Node runtime, it warns with `console.warn` which variables from this list are missing:
  - `RESEND_API_KEY`, `RESEND_FROM`
  - the five `MAIL_TO_*`
  - `NEWSLETTER_SHEETS_WEBHOOK_URL`
  - the three `NEXT_PUBLIC_SUPABASE_*`
  - `BLOG_FEED_ORIGIN`, `BLOG_RESTAURANT_ID`
- **It doesn't block startup.** The site degrades gracefully on purpose: without Supabase it serves local content and without Resend it tells the user.
- `.env.example`: `NEXT_PUBLIC_SITE_URL` goes out, since nobody reads it because `SITE_URL` is hardcoded in `seo.ts`, and `BLOG_FEED_ORIGIN` and `BLOG_RESTAURANT_ID` come in.

## Out of scope (reported in the PR)

- **The broken `blog-format` test.** See «How the tests run».

- **Sanitizing the blog HTML** (`src/app/blog/[slug]/page.tsx`). It requires a sanitization dependency, and the sub-project adds no dependencies. Writing a sanitizer by hand is riskier than the current state: the content comes from RestoExp's own dashboard.
- **Supabase security rules for anonymous writes.** `scripts/propagar-banner-evento.mjs` writes with the anon key; it has to be confirmed in Supabase, outside the repo, that the database blocks them for the public.
- **Distributed rate limit.** The in-memory limiter is per instance; the real cross-instance limit is Vercel's firewall, which is configured in the dashboard.

## Testing

### How the tests run

Node 24 runs TypeScript directly, but it only resolves imports with the `.ts` extension written out and doesn't understand `server-only` or the `@/` aliases. That's why the existing test, `src/lib/blog-format.test.ts`, **fails today** with `ERR_MODULE_NOT_FOUND`: it imports `./blog-format` without an extension, and that module imports `./restoexp`, and so on down the chain. Fixing it requires touching the imports of that whole chain, so it stays out of scope and is reported.

So that the new tests do run:

- The pure functions live in modules **with no imports** and without `server-only`:
  - `src/lib/file-signature.ts`: `signatureMatches`.
  - `src/lib/sanitize.ts`: `safeFilename`, `safeSubject` and `prune`.
  - `src/lib/http.ts`: `fetchWithTimeout`, which only uses `fetch` and `AbortSignal`, Node globals. Only server modules import it.
- `submissions.ts`, `mail.ts`, `join.ts`, `restoexp.ts` and `blog.ts` import them with the usual alias.
- The tests live in `src/lib/security.test.ts` and import with the extension (`./sanitize.ts`). For `tsc` to accept it, `"allowImportingTsExtensions": true` is added to `tsconfig.json`, which is valid because the project already has `noEmit`.
- New script `"test:security": "node --test src/lib/security.test.ts"`. There's no general `test`, because it would include the broken test.

### What gets tested

- **`node:test` tests** for the pure functions:
  - `signatureMatches`: the seven types, one positive and one negative per type, and a PDF renamed as `.docx`.
  - `safeFilename`: paths, control characters, long names and an empty name.
  - `safeSubject`: line breaks and repeated spaces.
  - `prune`: expired entries, cap and order.
  - `fetchWithTimeout`: timeout, retry on a 5xx, no retry on a 4xx or on `POST`. It's tested against a local `http` server spun up in the test itself.
- **Real submissions in `npm run dev`** with Playwright:
  - a valid submission of contact, event inquiry, job (with PDF) and market vendor;
  - a fake `.pdf` (renamed text) in job, which must show the field error;
  - a 101-character name, which must show the error before submitting;
  - six newsletter sign-ups in a row, where the sixth must give the rate limit error.
- `npm run build` and `npx tsc --noEmit` clean before each commit.

## Commits

One commit per item, in this order: 5, 1, 3, 2, 4, 6. The first two are the smallest and the ones that close the most risk. The PR goes against `main` and reports the three out-of-scope items.
