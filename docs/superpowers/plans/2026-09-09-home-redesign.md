# Home redesign + typography + footer — implementation plan

> ## ✅ EXECUTED — September 9, 2026
>
> **All 14 tasks are done and committed.** The checkboxes below were left
> unchecked: the real record of what was done is the commits, which explain each
> decision with its measurements. This document is kept as the PRIOR reasoning,
> not as a to-do list.
>
> | Phase | Commits |
> |---|---|
> | 1 · Typography | `dca3cbe` `31666db` |
> | 2 · PromoBar and sticky | `927d245` `56b173f` `c2f629e` |
> | 3 · Hero and wall | `5e69f8d` `3f58ece` |
> | 4 · Sections | `512225a` `fbfb51d` `0ddcf44` `bc97b3b` |
> | 5 · Footer | `b4aa399` |
> | 6 · Documentation | `4dd01fb` |
>
> **What came up along the way and was NOT in the plan**, because it surfaced
> while measuring:
>
> - `fd34cf7` — the preloader rewritten in CSS. It hung: the curtain is painted
>   by the server and only the JS could lift it (measured: 12.4s on cold start).
> - `1cc40f6` `9ba10bd` — **all three** brand book families replaced because of
>   licensing, not design. The plan only anticipated two.
> - `927d245` — `Button` joined classes with `join(' ')`, so a `hidden` passed via
>   props didn't override the base `inline-flex`. The header had always overflowed
>   on mobile, invisible because it was `fixed`.
> - `8eb5fb0` — the hours band wasn't reachable by keyboard (later removed at
>   Camila's request).
>
> **Two deviations from the plan, decided with Camila:**
>
> 1. §4.1 said "recalculate the header's `top`". When measured, the real fix
>    was to move the top block to `sticky` in flow — with `fixed` the banner
>    was impossible.
> 2. The status band ("Closed now…") was removed entirely. It wasn't in the
>    plan.
>
> **Pending and out of scope:** the 12 wall videos and the legal
> pages.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Rooftop at Riverside home page in Superside's shape (hero with a video wall, event cards, "Our difference", events banner), fix the display typography, and restructure the footer with the agency's structure.

**Architecture:** Next.js 16 App Router with React 19. Everything is a server component except what needs to know the time in `America/New_York` or hold UI state. The hours accordion uses native `<details name>`, with no JavaScript. The hero wall reuses the `Marquee` pattern with a variant that allows manual scrolling under `prefers-reduced-motion`.

**Tech Stack:** Next 16.3.4 (Turbopack), React 19.2.8, Tailwind CSS v4, motion 13, Playwright + axe-core for the guards.

**Spec:** [`docs/superpowers/specs/2026-09-09-home-redesign-design.md`](../specs/2026-09-09-home-redesign-design.md)

## Global Constraints

- **There is no unit test framework.** Each task's verification loop is the project's guards: `npm run build`, `npm run check:css`, `npm run check:surfaces`, `npm run contrast`, `npm run a11y`, `npm run check:motion`. Don't invent Jest or Vitest.
- **`a11y` and `check:motion` run against the production build**, on port **3114**: `npm run build && npx next start --port 3114` and the script in another terminal. Dev injects the Next overlay and pollutes the report.
- **`localStorage`, `sessionStorage` and any browser storage API are forbidden.** It's a constraint from the brief and there's already precedent: `Preloader.tsx` keeps its flag in an in-memory module.
- **No animation goes over 600ms.** Continuous loops (marquee) don't count, but they must turn off with `prefers-reduced-motion`.
- **`prefers-reduced-motion` cannot change the layout.** `check:motion` compares the box of every element with an `id` or heading in both modes and fails if they don't match.
- **Surface rhythm** (`check:surfaces`): at most **two** `cream` sections per page, at most **one** `deep`, and **never two colored sections in a row**. It counts the `tone=` of the `<Section>`s. A dark card *inside* a `Section tone="paper"` doesn't count — it's the trick `ForEventPlanners` already uses.
- **Text on `sunset` goes in BLACK** (8.26:1). White gives 2.54:1.
- **`sunset` and `river` never as text color on light.** On `paper` they give 2.48:1 and 2.43:1.
- **Headline accent**: `terra` #a62000 on light surfaces, `sunset` #f58521 on `deep`.
- **Don't invent data.** Whatever is missing is marked with `<PendingData>` or `<PhotoPending>` from `shared/PendingData.tsx`.
- **Comments and docs in Spanish**, like the rest of the repo. Comments explain WHY, not WHAT.
- **Work directly on `main`.** No new branches.
- **One commit per task**, at the end of the task.

---

## File Structure

**New**

| File | Responsibility |
|---|---|
| `src/components/shared/PromoBar.tsx` | The four facts, fixed row above the header. Server component. |
| `src/components/shared/VideoWall.tsx` | Two rows of 3:4 tiles in opposite loops, with a "video" placeholder. |
| `src/components/shared/AgencyBar.tsx` | "powered by Resto Experience" bar. Ported from the-orient. |
| `src/components/sections/WhatsOn.tsx` | Merge of `TonightAtTheYard` + `ThisWeek`, Superside cards. |
| `src/components/sections/ThreeDoors.tsx` | The three units in the "Our difference" shape. |
| `src/components/sections/EventsBanner.tsx` | Events banner in the "Our global team" shape. |
| `src/components/sections/FindUs.tsx` | Map + `<details>` accordion of the seven days. |

**Modified**

| File | Change |
|---|---|
| `src/app/globals.css` | Tracking scale, accent token, wall class, top offsets. |
| `src/components/shared/Type.tsx` | `Heading` in Regular; `h4`/card move off Steelfish; accent. |
| `src/components/shared/Header.tsx` | Header + StatusBar go from `fixed` to `sticky` in flow. |
| `src/components/shared/PageHero.tsx` | Top padding recalculated. |
| `src/components/sections/Hero.tsx` | Redesign; loses the photo, `FACTS` and `INTENTS`. |
| `src/components/shared/Footer.tsx` | Agency structure; no contact data, no newsletter, no last call. |
| `src/components/sections/HomeSections.tsx` | `FeaturesMarquee`, `ThreeVerticals`, `ForEventPlanners`, `ThisWeek`, `StoryTeaser`, `FindUs` go away. |
| `src/app/page.tsx` | New composition. |
| `src/app/layout.tsx` | Mounts `PromoBar`, unmounts `BrandTrail`. |
| `src/app/actions.ts` | `subscribeToNewsletter` goes away. |
| `src/app/events/page.tsx` | Receives the three process steps. |
| `src/lib/brand.ts` | `AGENCY` constant. |
| `scripts/contrast.mjs` | New pairs. |

**Deleted**

`src/components/shared/BrandTrail.tsx`, `src/components/shared/NewsletterForm.tsx`, `src/components/sections/TonightAtTheYard.tsx`.

---

# Phase 1 — Typography

It goes first because it touches all 23 routes and changes how everything else looks. Doing it last would force reviewing each new section twice.

### Task 1: Optical tracking scale and Regular weight

**Files:**
- Modify: `src/app/globals.css:284-295` (display scale), `src/app/globals.css:365` (old token)
- Modify: `src/components/shared/Type.tsx:20-30`, `src/components/shared/Type.tsx:57`
- Modify: `src/components/sections/Hero.tsx:94`, `src/components/sections/Hero.tsx:149`

**Interfaces:**
- Consumes: nothing.
- Produces: `Heading` keeps exporting the same signature (`level`, `role`, `className`, `id`, `children`). The `text-hero`, `text-d1`…`text-d4` steps get their own `letter-spacing`. `ROLES.card` and `SIZES[4]` stop being Steelfish.

- [ ] **Step 1: Add letter-spacing to the display scale**

In `src/app/globals.css`, inside the same `@theme` where `--text-d1` and `--text-d1--line-height` already live, add a tracking sub-token per step. It's the same mechanism line-height already uses, so each utility carries its tracking to every breakpoint without touching components:

```css
  /* ── Display tracking — an OPTICAL scale, not a single value ──────────────
     Steelfish is an all-caps condensed face: the smaller the size, the tighter
     it gets and the MORE air it needs. A single number leaves d3 cramped or d1
     falling apart.

     ⚠️ Replaces `--tracking-display: -0.02em`, which was NEGATIVE and was
     inherited from The Orient — which uses Lusitana, a serif. Negative
     tracking on an all-caps condensed face is exactly what makes it look
     clumped. See docs/house-tokens.md.

     ⚠️ d5, d6 and d7 get NO tracking here: from that size down they use
     Futura, not Steelfish. Their tracking is explicit in the class. */
  --text-hero--letter-spacing: 0.02em;
  --text-d1--letter-spacing: 0.02em;
  --text-d2--letter-spacing: 0.03em;
  --text-d3--letter-spacing: 0.035em;
  --text-d4--letter-spacing: 0.04em;
```

- [ ] **Step 2: Remove the old token and its two uses**

Delete `--tracking-display: -0.02em;` from `globals.css:365`. Remove the `tracking-display` class from `Hero.tsx:94` and from `Hero.tsx:149` — the tracking is now set by the size step.

Verify that no use remains:

```bash
grep -rn "tracking-display" src/
```

Expected: no results.

- [ ] **Step 3: Heading in Regular, and Steelfish only on h1–h3**

In `src/components/shared/Type.tsx`, change line 57 and the size maps:

```tsx
const SIZES: Record<HeadingLevel, string> = {
  1: 'text-d4 md:text-d3 lg:text-d2',
  2: 'text-d5 md:text-d4 lg:text-d3',
  3: 'text-d6 lg:text-d5',
  /* ⚠️ h4 moves off Steelfish. Camila: "only for big titles, meaning h1, h2
     and h3". It goes in Futura PT Medium in MIXED case: at this size the
     all-caps condensed face reads like a label, not a title. */
  4: 'font-body font-medium text-[20px] leading-[1.3] tracking-[0.01em] normal-case lg:text-[24px]',
};

const ROLES = {
  section: null,
  hero: 'text-hero',
  /* Same criterion as h4: card titles go in Futura Medium. Not in Bronx,
     which is all caps with open tracking by definition —it's the eyebrow
     face— and in a two-line title it becomes illegible. */
  card: 'font-body font-medium text-[20px] leading-[1.3] tracking-[0.01em] normal-case lg:text-[24px]',
  label: 'text-d7',
} as const;
```

And in the `Tag`'s `className`, change the weight:

```tsx
        // ⚠️ Regular, NEVER a heavy weight. Camila: "in regular, never in a
        // heavy weight". It was `font-bold` on ALL levels, which together with
        // the negative tracking was why it looked clumped.
        //
        // `uppercase` and `font-display` are set by the steps that are still
        // Steelfish; h4 and card turn them off with `normal-case` and
        // `font-body`.
        'font-display font-normal uppercase',
```

- [ ] **Step 4: Build and CSS guard**

```bash
npm run build && npm run check:css
```

Expected: build OK and `check:css` with no failures. This guard exists because of a real failure where Tailwind stopped emitting all theme utilities without a single warning — if the `@theme` was written wrong, it trips here.

- [ ] **Step 5: Eyeball that the tracking landed**

```bash
npx next start --port 3114
```

In another terminal:

```bash
node -e "const{chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('http://localhost:3114/');await p.evaluate(()=>document.fonts.ready);for(const s of ['h1','h2']){const el=await p.$(s);if(!el)continue;const r=await el.evaluate(n=>{const c=getComputedStyle(n);return{tag:n.tagName,ls:c.letterSpacing,fw:c.fontWeight,ff:c.fontFamily.split(',')[0]}});console.log(r)}await b.close()})()"
```

Expected: positive `letterSpacing` (not `-1.xx px`), `fontWeight` `400`, `fontFamily` `Steelfish`.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css src/components/shared/Type.tsx src/components/sections/Hero.tsx
git commit -m "Display typography: optical tracking scale and Regular weight"
```

---

### Task 2: Headline accent in color

**Files:**
- Modify: `src/components/shared/Type.tsx` (new `Accent` export)
- Modify: `src/components/shared/Motion.tsx` (`MaskedLines`, accent color prop)
- Modify: `scripts/contrast.mjs` (new pairs)

**Interfaces:**
- Consumes: `Heading` from Task 1.
- Produces:
  - `Accent({ on, children }: { on: 'light' | 'dark'; children: ReactNode }): JSX.Element` — exported from `shared/Type.tsx`. `on="light"` paints `terra`, `on="dark"` paints `sunset`.
  - `MaskedLines` accepts `accentOn?: 'light' | 'dark'` (default `'dark'`) in addition to the `accentLast` it already has.

- [ ] **Step 1: Add the new pairs to the contrast guard**

In `scripts/contrast.mjs`, inside `PAIRS`, add:

```js
 ['terra','paper','Headline accent on light','large'],
 ['terra','cream','Headline accent on cream','large'],
 ['sunset','deep','Headline accent on dark','large'],
```

- [ ] **Step 2: Run the guard and see them pass**

```bash
npm run contrast
```

Expected: the three new pairs in green. `terra`/`paper` gives 7.23:1, `terra`/`cream` 6.47:1 and `sunset`/`deep` 4.26:1, all above the 3:1 minimum for large text.

- [ ] **Step 3: Write the `Accent` component**

In `src/components/shared/Type.tsx`:

```tsx
/**
 * The typographic accent inside the headline.
 *
 * ⚠️ It goes in COLOR, not italics. Camila: "use a color change, not italics,
 * because the brand doesn't use italics". The reference (wework, superside) does
 * it with an italic serif from another family; here there's no serif and the
 * identity is closed, so the contrast comes from color.
 *
 * ⚠️ TWO colors, depending on the surface, not one. `sunset` on light gives
 * 2.48:1 — it doesn't even reach the 3:1 that large text requires. On `deep` it
 * does (4.26:1). On light it's `terra`, which is also the color the eyebrows
 * already use, so no new color enters the palette.
 */
export function Accent({
  on,
  children,
}: {
  readonly on: 'light' | 'dark';
  readonly children: ReactNode;
}) {
  return <span className={on === 'dark' ? 'text-sunset' : 'text-terra'}>{children}</span>;
}
```

- [ ] **Step 4: Make `MaskedLines` accept the accent per surface**

In `src/components/shared/Motion.tsx`, in `MaskedLines`, add the prop and use it where the accent color is hardcoded today:

```tsx
  readonly accentOn?: 'light' | 'dark';
```

With default `'dark'` (the hero, which is the only current call) and applying `text-sunset` or `text-terra` depending on the value. Find the current accent class:

```bash
grep -n "accentLast" -A 12 src/components/shared/Motion.tsx
```

- [ ] **Step 5: Build**

```bash
npm run build && npm run check:css
```

Expected: OK.

- [ ] **Step 6: Commit**

```bash
git add src/components/shared/Type.tsx src/components/shared/Motion.tsx scripts/contrast.mjs
git commit -m "Headline accent in color: terra on light, sunset on dark"
```

---

# Phase 2 — PromoBar and the top of the site

### Task 3: PromoBar and the move to sticky

⚠️ **This task refines §4.1 of the spec.** The spec said "recalculate the header's `top`". When the code was measured the fix turned out to be a different one, and it has to be said: the header is `fixed top-0` (`Header.tsx:98`) and the `StatusBar` is `fixed top-[64px]` (`Header.tsx:268`), with the heroes compensating with `padding-top`. A **non-sticky** banner above a **fixed** header is impossible without JS: the header would cover it from the start, and on scroll a gap would be left.

The no-JS solution is for the top block to live **in the flow**: the PromoBar static and the header + status in a `sticky top-0`. The promo scrolls away because it's in flow, the header stays stuck, and the heroes' magic `padding-top`s disappear. As a bonus, the `bg-deep` header and the `bg-deep` hero become continuous, which is exactly what Superside does.

**Files:**
- Create: `src/components/shared/PromoBar.tsx`
- Modify: `src/components/shared/Header.tsx:98`, `src/components/shared/Header.tsx:268`
- Modify: `src/app/layout.tsx`
- Modify: `src/components/shared/PageHero.tsx:50`
- Modify: `src/components/sections/Hero.tsx:78`
- Modify: `src/app/globals.css:662`, `src/app/globals.css:667`

**Interfaces:**
- Consumes: nothing.
- Produces: `PromoBar(): JSX.Element` (default export). The top block stops being `fixed`, so **no hero needs to compensate for the header's height**.

- [ ] **Step 1: Write the PromoBar**

`src/components/shared/PromoBar.tsx`:

```tsx
import { BRAND } from '@/lib/brand';

/**
 * Promo banner: the venue's four facts, above the header.
 *
 * They came from the hero's `FACTS` row. Camila wanted them on top, "like the
 * Closed now is today but on top, like a promo banner" — and like the
 * `StatusBar`, it goes in the layout, so it shows up on all 23 routes.
 *
 * ⚠️ It is NOT sticky: it's in the flow and scrolls away. That's what Camila
 * decided and it's also the reason the header moved to `sticky` — see the
 * note in Header.tsx.
 *
 * ⚠️ It's a <ul> and not a row of <span>s: they are four independent facts and
 * a screen reader has to be able to count them. The bullets are
 * `aria-hidden`: the list is already announced as a list.
 */
const FACTS = [
  'Four food trucks',
  'Rooftop bar',
  'Live music five nights',
  'Walk in, no reservations',
] as const;

export default function PromoBar() {
  return (
    <div className="bg-deep px-gutter md:px-gutter-lg">
      <ul className="page-box flex flex-wrap items-center justify-center gap-x-[10px] gap-y-[4px] py-[9px]">
        {FACTS.map((fact, i) => (
          <li key={fact} className="flex items-center gap-[10px]">
            {i > 0 ? (
              <span aria-hidden="true" className="h-[3px] w-[3px] rounded-pill bg-sunset" />
            ) : null}
            {/* `paper` on `deep` gives 15.4:1. */}
            <span className="eyebrow text-paper/80">{fact}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 2: Move the header and the status bar to sticky**

In `src/components/shared/Header.tsx`, line 98, change `fixed inset-x-0 top-0 z-[99]` to `sticky top-0 z-[99]` and add the comment explaining why:

```tsx
      {/* ⚠️ `sticky` and not `fixed`. It was `fixed top-0`, and with the new
          PromoBar on top that doesn't work: a banner that scrolls away under
          a fixed header is covered from the start and leaves a gap afterwards.
          In flow + sticky the promo goes away on its own and the header sticks, no JS.

          Consequence: the header NOW TAKES UP space, so the heroes no longer
          compensate for its height with padding-top. */}
      <div className="sticky top-0 z-[99] bg-deep">
```

⚠️ The `GUTTER` that was on that div goes to the child, not to the sticky, so the background stays full width.

On line 268, the `StatusBar` stops being `fixed top-[64px]` and becomes a sibling in the same sticky block: `z-[98] bg-deeper` with no positioning.

⚠️ Both —header and status— have to end up **inside the same sticky container**, not be two separate stickies: otherwise they overlap on scroll.

- [ ] **Step 3: Mount the PromoBar in the layout**

In `src/app/layout.tsx`, import and mount `PromoBar` **above** `<Header />`, and **unmount `BrandTrail`** (it's deleted in Task 11; here it's only taken out of the tree):

```tsx
        <SmoothScroll />
        <Preloader />
        <PageTransition />
        <PromoBar />
        <Header />
```

- [ ] **Step 4: Recalculate the heroes' paddings**

The top block measures `64 + 34 = 98px` on mobile and `76 + 34 = 110px` from `desk` up. Since it now takes up flow, it has to be **subtracted** from the paddings:

- `Hero.tsx:78`: `pt-[150px]` → `pt-[52px]`, `lg:pt-[176px]` → `lg:pt-[66px]`
- `PageHero.tsx:50`: `pt-[132px]` → `pt-[34px]`, `lg:pt-[156px]` → `lg:pt-[46px]`

And the `scroll-margin-top` at `globals.css:662` and `:667` becomes the height of the stuck block plus 16px of air:

```css
  scroll-margin-top: 114px;      /* 64 header + 34 status + 16 air */
```
```css
    scroll-margin-top: 126px;    /* 76 header + 34 status + 16 air */
```

- [ ] **Step 5: Build and eyeball the 23 routes**

```bash
npm run build && npx next start --port 3114
```

In another terminal, check that on no route does the header cover the first heading:

```bash
node -e "const{chromium}=require('playwright');const R=['/','/visit','/events','/events/inquire','/events/spaces','/food-trucks','/whats-on','/market','/our-story','/faq','/contact','/join-us','/the-experience','/sunset-bar','/the-yard','/nfc-north-hq','/events/corporate','/events/celebrations','/events/fundraisers','/events/game-truck','/events/holiday-parties'];(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});for(const r of R){await p.goto('http://localhost:3114'+r);const bad=await p.evaluate(()=>{const h=document.querySelector('h1');if(!h)return 'no h1';const t=h.getBoundingClientRect().top;return t<110?('h1 covered, top='+Math.round(t)):null});if(bad)console.log(r,'->',bad)}console.log('done');await b.close()})()"
```

Expected: only `done`. Any route that prints something has its h1 under the stuck block.

- [ ] **Step 6: Motion guard**

```bash
npm run check:motion
```

Expected: OK. The move from `fixed` to `sticky` changes the layout of the whole site, so this guard is the one that detects whether any box moved in only one of the two modes.

- [ ] **Step 7: Commit**

```bash
git add src/components/shared/PromoBar.tsx src/components/shared/Header.tsx src/app/layout.tsx src/components/shared/PageHero.tsx src/components/sections/Hero.tsx src/app/globals.css
git commit -m "PromoBar above the header and top block in sticky flow"
```

---

# Phase 3 — Hero and video wall

### Task 4: VideoWall

**Files:**
- Create: `src/components/shared/VideoWall.tsx`
- Modify: `src/app/globals.css` (`rt-wall` class)

**Interfaces:**
- Consumes: nothing.
- Produces: `VideoWall(): JSX.Element` (default export). No props: the slots are internal until the clips arrive.

- [ ] **Step 1: The wall's CSS class**

In `src/app/globals.css`, next to `.rt-marquee`:

```css
/**
 * The hero wall. Same loop as `.rt-marquee` but with one difference that
 * matters: under `prefers-reduced-motion` the row isn't left frozen and
 * cropped —with the tiles on the right unreachable— but becomes
 * scrollable by hand.
 *
 * ⚠️ The change is to `overflow`, not to size or position: the tiles' boxes
 * measure the same in both modes, which is what check:motion requires.
 */
.rt-wall {
  overflow: hidden;
}

.rt-wall > .rt-wall-track {
  display: flex;
  width: max-content;
  animation: rt-marquee var(--wall-duration, 60s) linear infinite;
  will-change: transform;
}

.rt-wall-reverse > .rt-wall-track {
  animation-direction: reverse;
}

@media (prefers-reduced-motion: reduce) {
  .rt-wall {
    overflow-x: auto;
  }
  .rt-wall > .rt-wall-track {
    animation: none;
  }
}
```

- [ ] **Step 2: Write the component**

`src/components/shared/VideoWall.tsx`:

```tsx
/**
 * The hero wall: two rows of short pieces from the venue, in opposite loops.
 *
 * It's the shape of Superside's hero, which Camila set as the reference: headline,
 * short subhead, one CTA, and below it two rows of tiles that run.
 *
 * ⚠️ THERE ARE NO VIDEOS YET. There isn't a single `.mp4` in `public/`. Each slot is a
 * gray box labeled "video" —Camila's decision: "put the gray boxes in that
 * say video"— and the component is already wired for the `<video>`:
 * when the clips arrive, `SLOTS` is swapped for their paths and nothing else
 * is touched.
 *
 * ⚠️ THERE ARE 12, six per row, and it's a measured minimum, not a round number:
 * with fewer than six per row the loop repeats the same tile on screen at the
 * same time. The ideal is 16.
 *
 * Clip spec: 3:4 vertical, 4–8 s, no audio, ~1–2 MB,
 * .mp4 H.264.
 */
const PER_ROW = 6;

/** A tile. `src === null` while the clip doesn't exist. */
function Tile({ src }: { readonly src: string | null }) {
  return (
    <div className="mr-[12px] aspect-[3/4] w-[150px] shrink-0 overflow-hidden rounded-card bg-body/25 lg:w-[190px]">
      {src === null ? (
        <div className="grid h-full place-items-center">
          {/* `paper/70` on `body/25` composited over `deep` — verified with
              axe in the a11y guard, which measures the rendered pixel and not
              the palette pair. */}
          <span className="eyebrow text-paper/70">video</span>
        </div>
      ) : (
        <video
          src={src}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}

function Row({ reverse }: { readonly reverse: boolean }) {
  const tiles = Array.from({ length: PER_ROW }, (_, i) => <Tile key={i} src={null} />);
  return (
    <div
      className={['rt-wall', reverse ? 'rt-wall-reverse' : ''].filter(Boolean).join(' ')}
      // The row is scrollable with reduced-motion, so it needs to be
      // reachable by keyboard and announce itself. Without this it's a reverse
      // focus trap: content that exists and can't be reached.
      tabIndex={0}
      role="group"
      aria-label={reverse ? 'Second row of clips from the venue' : 'Clips from the venue'}
    >
      <div className="rt-wall-track">
        {tiles}
        {/* The second copy is what makes the loop continuous. `aria-hidden`
            because it's exactly the same content. */}
        <div className="flex shrink-0" aria-hidden="true">
          {tiles}
        </div>
      </div>
    </div>
  );
}

export default function VideoWall() {
  return (
    <div className="flex flex-col gap-[12px]">
      <Row reverse={false} />
      <Row reverse />
    </div>
  );
}
```

- [ ] **Step 3: Build**

```bash
npm run build && npm run check:css
```

Expected: OK.

- [ ] **Step 4: Commit**

```bash
git add src/components/shared/VideoWall.tsx src/app/globals.css
git commit -m "VideoWall: two rows of tiles with a video placeholder"
```

---

### Task 5: Redesigned hero

**Files:**
- Modify: `src/components/sections/Hero.tsx` (rewrite)

**Interfaces:**
- Consumes: `VideoWall` (Task 4), `Accent`/`MaskedLines` (Task 2).
- Produces: `Hero(): JSX.Element` (default export). **It no longer exports or mounts `INTENTS`** — the three doors move to `ThreeDoors` (Task 7).

- [ ] **Step 1: Rewrite the hero**

Replace all of `src/components/sections/Hero.tsx`. The points that can't be lost:

- **The background photo and the veil go away.** Plain `bg-deep` remains. With the wall below, photo and videos compete; Superside sets the tiles on a flat background precisely for that reason. And the `bg-deep` header is now continuous with the hero.
- **The `FACTS` row goes away** (it's in the PromoBar) and **so does the `INTENTS` section** (it goes to `ThreeDoors`).
- **Headline** with `MaskedLines lines={['Bonita comes', 'together']} accentLast accentOn="dark"`.
- **One-line subhead**: `Rooftop bar. Four kitchens. Walk in.`
- **One CTA**: `What's on tonight` to `/whats-on`. "Plan an event" is already in the header.
- The isotype `/brand/isotype-truck.svg` stays above the headline.
- `VideoWall` goes after the CTA, full bleed — that is, **outside** the `page-box`/`max-w`, but inside the section.

```tsx
export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="bg-deep pb-[56px] lg:pb-[68px]">
      <div className={`${GUTTER} pt-[52px] lg:pt-[66px]`}>
        <div className="mx-auto flex max-w-[900px] flex-col items-center text-center">
          {/* isotype, Heading role="hero", subhead, one ButtonLink */}
        </div>
      </div>

      {/* The wall goes full bleed: no gutter or container. */}
      <div className="mt-[44px] lg:mt-[56px]">
        <VideoWall />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Build**

```bash
npm run build
```

Expected: OK. If it fails because of an unused `INTENTS`, delete the constant.

- [ ] **Step 3: Surfaces guard**

```bash
npm run check:surfaces
```

Expected: OK. The hero isn't a `<Section>` with a `tone`, so it doesn't count against the maximum of one `deep` per page — but it's worth confirming before adding more dark sections.

- [ ] **Step 4: Look at the hero**

```bash
npx next start --port 3114
```

```bash
node -e "const{chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:1000}});await p.goto('http://localhost:3114/');await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:'hero-check.png'});await b.close()})()"
```

Look at `hero-check.png`: dark background continuous from the header, two-line headline with `together` in orange, a single button, and the two rows of gray boxes labeled "video". **Delete the PNG before committing.**

- [ ] **Step 5: Commit**

```bash
rm -f hero-check.png
git add src/components/sections/Hero.tsx
git commit -m "Hero: short line, one CTA and video wall"
```

---

# Phase 4 — The home sections

### Task 6: WhatsOn — merge of Tonight and This week

**Files:**
- Create: `src/components/sections/WhatsOn.tsx`
- Delete: `src/components/sections/TonightAtTheYard.tsx`

**Interfaces:**
- Consumes: `EVENTS`, `type VenueEvent`, `type Weekday`, `timeRange` from `@/content/events`; `activeTrucks` from `@/content/trucks`; `recurringEvents`, `whenLabel` from `@/content/events`.
- Produces: `WhatsOn(): JSX.Element` (default export).

- [ ] **Step 1: Write the section**

A single section with Superside's cards. What has to be kept from the component it replaces:

- **Client component.** It needs the day in `America/New_York`. Reuse as-is the `venueWeekday()` function and the `const [today, setToday] = useState<Weekday | null>(null)` + `useEffect` pattern from `TonightAtTheYard.tsx`: the server paints a useful state and the real day appears on mount. Without this there's a hydration mismatch and, worse, a piece of data that may be wrong gets published.
- **`CLOSED_DAYS = [1, 2]`** (Monday and Tuesday) stays.
- **The trucks fallback stays verbatim**: the daily rotation **doesn't exist** as data. Today's card can't say "today these four are here". It shows the roster and tells the truth.
- **Superside card**: photo on top, color block below with the tag and the title.
  - Card 1: `bg-sunset` with `ink` text (8.26:1). **Never `paper` on `sunset`.**
  - Card 2: `bg-deep` with `paper` text.
  - Card 3: `bg-chalk` with `ink` text.
- **The first card is today's**, with the `Tonight` tag. The rest carry their day tag (`whenLabel(e)`).
- Hover: `scale(1.03)` on the image and nothing else, 250ms. It's what she liked about Superside's cards.
- With no real photo for an event, `<PhotoPending>`.
- `Section tone="cream"` and an `ArrowLink` to `/whats-on`.

The card, which is the pattern Camila explicitly pointed out:

```tsx
/* The three block colors, in order. The text of each one is NOT
   interchangeable: on `sunset` it's `ink` (8.26:1) and white would give 2.54:1. */
const BLOCKS = [
  { surface: 'bg-sunset', text: 'text-ink', sub: 'text-ink/80' },
  { surface: 'bg-deep', text: 'text-paper', sub: 'text-paper/80' },
  { surface: 'bg-chalk', text: 'text-ink', sub: 'text-body/75' },
] as const;

function EventCard({
  href, photo, alt, tag, title, meta, block,
}: {
  readonly href: string;
  readonly photo: string | null;
  readonly alt: string;
  readonly tag: string;
  readonly title: string;
  readonly meta: string;
  readonly block: (typeof BLOCKS)[number];
}) {
  return (
    <Link href={href} className="group flex h-full flex-col overflow-hidden rounded-card">
      {/* The photo on top. `overflow-hidden` here and the zoom on the image: if
          the zoom goes on the whole card, the color block scales too. */}
      <div className="relative aspect-[4/3] overflow-hidden bg-body/10">
        {photo === null ? (
          <PhotoPending />
        ) : (
          <Image
            src={photo}
            alt={alt}
            fill
            sizes="(max-width: 639px) 100vw, 33vw"
            className="object-cover transition-transform duration-250 group-hover:scale-[1.03]"
          />
        )}
      </div>

      {/* The color block below, with the tag and the title. */}
      <div className={`flex flex-1 flex-col ${block.surface} p-[22px]`}>
        <span
          className={`w-fit rounded-pill border border-current/30 px-[10px] py-[3px] eyebrow ${block.sub}`}
        >
          {tag}
        </span>
        <Heading level={3} role="card" className={`mt-[12px] ${block.text}`}>
          {title}
        </Heading>
        <span className={`mt-auto pt-[14px] eyebrow ${block.sub}`}>{meta}</span>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Take `ThisWeek` out of `HomeSections.tsx`**

Delete the `ThisWeek` function and, if they end up unused, its imports (`recurringEvents`, `whenLabel`, `HAPPY_HOUR`). The happy hour line that was at the bottom of `ThisWeek` moves to `WhatsOn`.

- [ ] **Step 3: Delete the old component**

```bash
git rm src/components/sections/TonightAtTheYard.tsx
```

- [ ] **Step 4: Build**

```bash
npm run build && npm run check:surfaces
```

Expected: OK, and the home's surface count must stay within two `cream` and one `deep`.

- [ ] **Step 5: Commit**

```bash
git add -A src/components/sections src/app/page.tsx
git commit -m "WhatsOn: a single events section with today featured"
```

---

### Task 7: ThreeDoors — "Our difference" shape

**Files:**
- Create: `src/components/sections/ThreeDoors.tsx`
- Modify: `src/components/sections/HomeSections.tsx` (delete `ThreeVerticals`)

**Interfaces:**
- Consumes: `Accent` (Task 2), `Section`, `Eyebrow`, `Heading`, `ArrowLink`.
- Produces: `ThreeDoors(): JSX.Element` (default export).

- [ ] **Step 1: Write the section**

Shape measured on Superside's "Our difference" reference: centered eyebrow, big headline with accent, and a row of columns with a small icon + small-caps micro-label + title + body, **separated by 1px rules and not by heavy cards**. It's the gesture `docs/design-references.md` had pending to apply from wework/superside.

The three doors, with the content that already existed in `INTENTS` and `ThreeVerticals`:

```tsx
/* ⚠️ The body of each door states a verified fact, not a promise. The
   one for "Eat" in particular is the most important correction on the site: the food
   isn't ours, the trucks serve it. It's the most costly confusion. */
const DOORS = [
  {
    href: '/food-trucks',
    kicker: 'Eat',
    title: 'Four kitchens in the yard',
    body: 'Four independent kitchens under the rooftop. You order at the truck — the bar upstairs is ours.',
  },
  {
    href: '/whats-on',
    kicker: 'See',
    title: 'Music, bingo, DJ sets',
    body: 'Live music five nights a week, and a standing lineup you can plan around. Walk in, no reservations.',
  },
  {
    href: '/events',
    kicker: 'Rent',
    title: 'Buyouts and private nights',
    body: 'The rooftop, the yard, the patio — or the whole place with the gates closed, and one person coordinating it.',
  },
] as const;
```

- Headline with `<Accent on="light">` — the section sits on light, so the accent is `terra`.
- The three icons are drawn as **inline SVG**, in the brand's language: there are no bar, music or event icons in `public/`. 1.6 stroke, `currentColor`, `aria-hidden`.
- `Section tone="paper"`.

- [ ] **Step 2: Delete `ThreeVerticals`**

Delete the whole function from `HomeSections.tsx` and any imports left unused.

- [ ] **Step 3: Build**

```bash
npm run build && npm run check:surfaces
```

- [ ] **Step 4: Commit**

```bash
git add -A src/components/sections
git commit -m "ThreeDoors: the three units in a single section"
```

---

### Task 8: EventsBanner and moving the process to /events

**Files:**
- Create: `src/components/sections/EventsBanner.tsx`
- Modify: `src/components/sections/HomeSections.tsx` (delete `ForEventPlanners`)
- Modify: `src/app/events/page.tsx` (receives the three steps)

**Interfaces:**
- Consumes: `Accent` (Task 2).
- Produces: `EventsBanner(): JSX.Element` (default export).

- [ ] **Step 1: Write the banner**

Shape measured on `superside.com/our-creative-talent` ("OUR GLOBAL TEAM"): dark card with the image on top —inset, with radius—, and below it eyebrow, headline with accent, subhead and three one-line bars with the most important points.

⚠️ **The card goes `deep` INSIDE a `Section tone="paper"`**, not as a `Section tone="deep"`. `check:surfaces` allows only one `deep` section per page and it has to be left free; it's the same trick `ForEventPlanners` used with its `sunset` card.

- Image: `/images/events/event-a.webp`.
- Headline with `<Accent on="dark">` (`sunset`, 4.26:1 on `deep`).
- The three items are the ones already confirmed: we coordinate the trucks, the bar is ours, the space is yours. Each one in a one-line `bg-deeper` bar.
- One CTA to `/events`.

- [ ] **Step 2: Move the three process steps to /events**

`PLANNER_STEPS` (request a proposal → get the packet → see the spaces) is content that today **only exists on the home page**. Move it to `src/app/events/page.tsx` as a process block, with the same numbered-list shape the page already has for `WHAT_WE_DO`. Don't duplicate: `WHAT_WE_DO` is "what we do", this is "how it starts".

- [ ] **Step 3: Delete `ForEventPlanners`**

Delete the function and `PLANNER_STEPS` from `HomeSections.tsx`.

- [ ] **Step 4: Build and guards**

```bash
npm run build && npm run check:surfaces && npm run contrast
```

- [ ] **Step 5: Commit**

```bash
git add -A src/components/sections src/app/events/page.tsx
git commit -m "EventsBanner on the home and the events process to /events"
```

---

### Task 9: FindUs with a native accordion

**Files:**
- Create: `src/components/sections/FindUs.tsx`
- Modify: `src/components/sections/HomeSections.tsx` (delete the old `FindUs`)

**Interfaces:**
- Consumes: `HOURS`, `BRAND`, `addressLine`, `mapsUrl` from `@/lib/brand`.
- Produces: `FindUs(): JSX.Element` (default export).

- [ ] **Step 1: Write the section**

Structure from `yava/app/components/LocationSection.tsx`: map on one side, data panel on the other, today's day highlighted. What gets **added** on top of yava is the accordion — yava lists the seven days flat.

```tsx
{HOURS.map((row) => (
  <details key={row.day} name="hours" className="...">
    <summary className="...">
      <span>{row.day}</span>
      {/* the one-line summary, so opening isn't required */}
    </summary>
    <dl>
      <dt>Bar</dt><dd>{row.bar}</dd>
      <dt>Trucks</dt><dd>{row.trucks}</dd>
    </dl>
  </details>
))}
```

⚠️ **The shared `name` is what makes the accordion exclusive —opening one closes the other— without a line of JavaScript**, and it brings focus, keyboard and state announcement for free. Where the browser doesn't support `name` on `<details>` it degrades to seven independent disclosures: several can be open at once and that's all. It's an acceptable degradation, not a breakage.

⚠️ The seven days are rendered on the **server**. The only thing the JS adds is which one starts open: a small client component marks `open` on today's day on mount, because the day depends on `America/New_York` and the server can't know it without risking a cached page with the wrong day.

Kept from the old version: address as a link to Maps, phone, parking with its `ArrowLink` to `/visit#parking`, and the map `<iframe>` with `loading="lazy"` and its `title` (an iframe without a title is a WCAG 4.1.2 failure).

- [ ] **Step 2: Delete the old `FindUs` from `HomeSections.tsx`**

- [ ] **Step 3: Build and a11y**

```bash
npm run build && npx next start --port 3114
```

In another terminal:

```bash
npm run a11y
```

Expected: zero violations. The accordion is the new element most exposed to accessibility failures.

- [ ] **Step 4: Verify it reads without JS**

```bash
node -e "const{chromium}=require('playwright');(async()=>{const b=await chromium.launch();const c=await b.newContext({javaScriptEnabled:false});const p=await c.newPage();await p.goto('http://localhost:3114/');const n=await p.locator('details[name=hours]').count();const txt=await p.locator('details[name=hours]').first().innerText();console.log('details:',n,'| first block includes hours:',/AM|PM|Closed/.test(txt));await b.close()})()"
```

Expected: `details: 7` and `true`. With JS off the seven days exist and their content is reachable.

- [ ] **Step 5: Commit**

```bash
git add -A src/components/sections
git commit -m "FindUs: map and native accordion for the seven days"
```

---

### Task 10: A subtler HowThisPlaceWorks

**Files:**
- Modify: `src/components/sections/HomeSections.tsx` (`HowThisPlaceWorks`)
- Modify: `src/components/shared/PinnedList.tsx`

**Interfaces:**
- Consumes: `PinnedList`, `type PinnedItem`.
- Produces: no signature changes.

- [ ] **Step 1: Refine the finish**

Camila: "I like it, but let's redesign it a bit to make it subtler, more current and sophisticated in identity". **The `PinnedList` mechanism stays**; only the finish changes:

- 1px rules instead of 2px.
- Smaller step labels, in Bronx small caps, **with no color fill**.
- Active title in Steelfish **Regular** with the new tracking (it already comes from Task 1), no heavy weight.
- 1px progress rail.
- More air between one step and the next.

Don't touch the scroll distance (55vh per item) or the `cubic-bezier`: those are decisions already validated and documented.

- [ ] **Step 2: Build and motion guard**

```bash
npm run build && npm run check:motion
```

Expected: OK. `PinnedList` does layout work on scroll, so this guard is the one that matters here.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/HomeSections.tsx src/components/shared/PinnedList.tsx
git commit -m "How this place works: subtler finish"
```

---

### Task 11: Deletions and the home composition

**Files:**
- Delete: `src/components/shared/BrandTrail.tsx`
- Modify: `src/components/sections/HomeSections.tsx` (delete `StoryTeaser` and `FeaturesMarquee`)
- Modify: `src/app/page.tsx` (rewrite of the composition)

**Interfaces:**
- Consumes: all the components from Tasks 5–10.
- Produces: `HomePage(): JSX.Element`.

- [ ] **Step 1: Delete `BrandTrail`**

```bash
git rm src/components/shared/BrandTrail.tsx
grep -rn "BrandTrail" src/
```

Expected: no results (unmounting it from the layout was done in Task 3).

- [ ] **Step 2: Delete `StoryTeaser` and `FeaturesMarquee`**

`StoryTeaser` goes because "Our story" lives at `/our-story`. `FeaturesMarquee` goes because it says the same thing as the new PromoBar on the same screen — approved by Camila.

Also delete `FEATURES` and any imports left unused (`Marquee` may still be used by `ReviewsMarquee`; **don't delete `ReviewsMarquee`**, which is written and unused on purpose).

- [ ] **Step 3: Rewrite the composition**

`src/app/page.tsx`, with the order comment updated:

```tsx
export default function HomePage() {
  return (
    <>
      <Hero />
      <WhatsOn />
      <HowThisPlaceWorks />
      <ThreeDoors />
      <EventsBanner />
      <FindUs />
    </>
  );
}
```

⚠️ Review the `<Scallop>`s: the scallop goes **only where the surface really changes**, and with the new order the breaks are different. Placed at every break it stops being a brand gesture and becomes a background pattern.

- [ ] **Step 4: Build and the three page guards**

```bash
npm run build && npm run check:surfaces && npm run check:seo
```

Expected: OK. `check:surfaces` resolves the home by following the imports, so this is where the real surface count shows up.

- [ ] **Step 5: Commit**

```bash
git add -A src
git commit -m "Home: new composition and removal of BrandTrail, StoryTeaser and FeaturesMarquee"
```

---

# Phase 5 — Footer

### Task 12: AgencyBar

**Files:**
- Create: `src/components/shared/AgencyBar.tsx`
- Create: `public/images/agency/resto-experience.svg`
- Modify: `src/lib/brand.ts`

**Interfaces:**
- Consumes: `AGENCY` from `@/lib/brand`.
- Produces:
  - `AgencyBar(): JSX.Element` (default export).
  - `AGENCY: { url: string; label: string; tagline: string; year: string }` exported from `lib/brand.ts`.

- [ ] **Step 1: Bring in the asset**

```bash
mkdir -p public/images/agency
cp "/c/Users/Cami/Desktop/RestoExp/the-orient/public/images/agency/resto-experience.svg" public/images/agency/
ls -la public/images/agency/
```

- [ ] **Step 2: The `AGENCY` constant**

In `src/lib/brand.ts`, next to `BRAND.credit`, which today is only `{ label, url }`:

```ts
/**
 * The agency. `credit` already had label and url; the footer bar also needs
 * the tagline and the year, which on the house's other sites live here.
 */
export const AGENCY = {
  url: 'https://restoexp.com',
  label: 'Resto Experience',
  tagline: 'Content, marketing & web design',
  year: String(new Date().getFullYear()),
} as const;
```

- [ ] **Step 3: Port the component**

Copy the structure of `the-orient/src/components/shared/agency-bar.tsx`, adapting:

- The auxiliary font: in the-orient it's DM Sans; here it's `font-body` (Futura).
- The `GUTTER` goes **on the wrapper** and the `page-box` inside without its own padding, so the row aligns at the edges with the rest of the footer.
- The link's `aria-label` **contains the visible text**, which is what WCAG 2.5.3 (Label in Name) requires, and announces the new tab there and not in a hidden `<span>`: some checkers don't read text with `clip`.
- Contrasts already verified in the-orient: `#5c5c5c` on `#f5f5f5` gives 6.13:1.

- [ ] **Step 4: Build**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add public/images/agency src/components/shared/AgencyBar.tsx src/lib/brand.ts
git commit -m "AgencyBar: powered by Resto Experience bar"
```

---

### Task 13: Restructured footer

**Files:**
- Modify: `src/components/shared/Footer.tsx` (rewrite)
- Delete: `src/components/shared/NewsletterForm.tsx`
- Modify: `src/app/actions.ts`

**Interfaces:**
- Consumes: `AgencyBar` (Task 12), `AGENCY` and `BRAND`.
- Produces: `Footer(): JSX.Element`.

- [ ] **Step 1: Restructure**

The house's shared structure (the-orient, santa-maria, casa-pirul, pretty-hens): identity column on the left, link columns on the right.

- **Identity column**: logo, a short subhead and the CTA.
- ⚠️ **NO address, NO hours, NO phone.** Camila: "the hours and address, phones, etc. don't go there". It's an accepted consequence: on the other 20 routes that data isn't anywhere. It lives on the home page, `/visit` and `/contact`.
- **Three link columns** adapted to the 23 routes, plus the socials. The house's split is "what happens at the venue" / "the rest of the site" / "getting to know us".
- **Bottom band**: copyright and legal links.
- **`<AgencyBar />` at the end.**
- **The "Last call" block goes away.**
- Keep the `SocialLink` helper that's already at the bottom of the file.

- [ ] **Step 2: Delete the newsletter**

It's not on the current site —it doesn't appear in `docs/current-site-inventory.md`— and the client didn't ask for it. Camila: "if the client didn't ask for it and the current site has nothing similar, let's not add it".

```bash
git rm src/components/shared/NewsletterForm.tsx
```

In `src/app/actions.ts`, delete `subscribeToNewsletter` and the `ActionState` type **only if `submitEventInquiry` doesn't use it**.

⚠️ **DO NOT TOUCH `submitEventInquiry` or `lib/mail.ts`.** They share the submission with the events form, which is a real capability of the site.

```bash
grep -rn "subscribeToNewsletter\|NewsletterForm" src/
```

Expected: no results.

- [ ] **Step 3: Build**

```bash
npm run build && npm run check:css
```

- [ ] **Step 4: a11y on the new footer**

```bash
npx next start --port 3114
```

```bash
npm run a11y
```

Expected: zero violations. The footer shows up on all 23 routes, so a failure here is multiplied by 23.

- [ ] **Step 5: Commit**

```bash
git add -A src
git commit -m "Footer with the agency structure, no contact data or newsletter"
```

---

# Phase 6 — Documentation and final verification

### Task 14: Documentation and full guards

**Files:**
- Modify: `docs/design-references.md`
- Modify: `docs/house-tokens.md`
- Modify: `docs/contrast-audit.md`

**Interfaces:**
- Consumes: everything above.
- Produces: no code.

- [ ] **Step 1: `docs/design-references.md`**

Two corrections:

- The table in section 5 documents `BrandTrail` as the gesture adopted from ronnsquare.fr. **It was removed** at Camila's request, so from ronnsquare only `PageTransition` remains. Note it with the reason.
- "Pending to apply: the typographic accent inside the headline (wework / superside) and the icon + small caps + title rows". **Both were applied** — the accent in color (not in italics) and the rows in `ThreeDoors`. Mark it as done and note that the accent is in color because the brand doesn't use italics and there's no serif in the system.

- [ ] **Step 2: `docs/house-tokens.md`**

The Tracking section pins the token inherited from The Orient. Record that `--tracking-display: -0.02em` was replaced by a positive optical scale, and why: The Orient uses Lusitana (serif) and Rooftop uses Steelfish (all-caps condensed), where negative tracking makes it look clumped.

- [ ] **Step 3: `docs/contrast-audit.md`**

Add the new pairs with their measured values: `terra`/`paper` 7.23:1, `terra`/`cream` 6.47:1, `sunset`/`deep` 4.26:1. And note explicitly that **`sunset` cannot be a headline accent on light** (2.48:1), which is the reason the accent has two colors.

- [ ] **Step 4: The full battery**

```bash
npm run build
npm run check:css
npm run check:surfaces
npm run check:seo
npm run contrast
```

And with the production server up:

```bash
npx next start --port 3114
```

```bash
npm run a11y
npm run check:motion
```

Expected: all green.

- [ ] **Step 5: Visual review of the 23 routes**

```bash
node -e "const{chromium}=require('playwright');const R=['/','/visit','/events','/events/inquire','/events/spaces','/events/corporate','/events/celebrations','/events/fundraisers','/events/game-truck','/events/holiday-parties','/food-trucks','/whats-on','/market','/our-story','/faq','/contact','/join-us','/the-experience','/sunset-bar','/the-yard','/nfc-north-hq'];(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});for(const r of R){await p.goto('http://localhost:3114'+r);await p.evaluate(()=>document.fonts.ready);const o=await p.evaluate(()=>{const h=document.querySelector('h1');return{h1Top:h?Math.round(h.getBoundingClientRect().top):null,overflow:document.documentElement.scrollWidth>window.innerWidth}});console.log(r.padEnd(26),o.h1Top,o.overflow?'OVERFLOW-X':'ok')}await b.close()})()"
```

Expected: no `OVERFLOW-X` and no `h1Top` below 110.

- [ ] **Step 6: Commit**

```bash
git add docs
git commit -m "Docs: references, tokens and contrasts up to date with the redesign"
```

---

## What remains pending and this plan does NOT close

Noted in §8 of the spec:

1. **Bronx license** — the font file is `Bronx_PersonalUse.otf`. Verify before publishing, and confirm against page 13 of the brand book which of the three typefaces named Bronx is the correct one.
2. **`Futura PT` is Futura Cyrillic** — the `@font-face` declares a family that doesn't work. Fix the name before publishing.
3. **CSS safety net for the `Preloader`** — an opaque curtain whose only way out is a JS timer.
4. **The 12 videos** — until they arrive, the wall shows gray boxes labeled "video". Spec: 3:4 vertical, 4–8 s, no audio, ~1–2 MB, `.mp4` H.264.
