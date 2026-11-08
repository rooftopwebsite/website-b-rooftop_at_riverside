# Invariants — what survives any redesign

**Written on 2026-09-10, when starting the new design from scratch.**

The visual language gets thrown out entirely. This document is the only thing that crosses over:
how the website has to **work**, its measurements, its SEO and what we know about the client.
If the new design contradicts anything here, **it gets discussed before breaking it** — it doesn't
get broken silently.

---

## 0. What is kept and what is discarded

| Kept | Discarded |
|---|---|
| `src/content/*` — trucks, spaces, events, faq, bar-menu, seo-pages | `src/components/sections/*` — all the sections |
| `src/lib/seo.ts`, `nav.ts`, `calendar.ts`, `mail.ts` | `src/lib/brand-art.ts`, `motion.ts` — art and motion from the previous phase |
| `src/app/sitemap.ts`, `robots.ts`, `actions.ts`, `next.config.ts` | The color block in `globals.css` and `lib/brand.ts` |
| The 23 routes and the 301 map (§2) | `design-audit/` — audit of the old design |
| `public/` — media already optimized (681 MB → 1.9 MB) | The diagonal staircase, the horizon, the curtain, the arc of cards |
| The measurement system in §3 | The specific color, radius and shadow tokens |
| The pending-item markers (§5) | `docs/design-references.md`, `MOODBOARD.md`, `VISUAL-DIRECTION.md` |

**Rule:** content is never re-derived. It is verified against the client and against
the old site; inferring it again is how false data sneaks in.

---

## 1. What this business is — and why it shapes the code

Rooftop at Riverside, Bonita Springs (FL). Current site: `eatdrinkparadise.com` (Wix).

**The venue has no kitchen.** The food is served by four independent food trucks that
ring up their own sales. Two non-negotiable consequences follow from that:

- The schema is **`BarOrPub` + `EventVenue`**, never `Restaurant`. It is documented in
  `src/lib/seo.ts` and it is the most important SEO decision in the project.
- **The roster rotates.** Trucks are added and removed through data in
  `src/content/trucks.ts`, with a single template and an automatic 301 when one is removed. The old
  site went out of date precisely for lacking this: 3 of the 4 published profiles are for
  trucks that are no longer there, and only 1 of the 4 current ones has a profile.

Current roster (Jan-2026 menu, **pending client confirmation**):
OCN Seafood Co. · Butcher's Blvd · El Chilango · Reggae Kitchen.
Obsolete: Prime Carvery · Tropical Fusion · Sea Me on Wheels.

---

## 2. Routes and redirects

23 live routes on the old site, all 200. The full map is in
`docs/current-site-inventory.md`. What the new design cannot change:

- The 301s already defined (`/this-is-us` → `/our-story`, `/eat` → `/food-trucks`,
  `/drink` → `/sunset-bar`, `/calendar` → `/whats-on`, `/hostanevent` → `/events`,
  `/find-us` → `/visit`, `/parking` → `/visit#parking`, …).
- `/ocn` is not an orphan: it is a current truck redirected to another truck's profile.
  Open proposal: `/ocn` → `/food-trucks/ocn-seafood-co`.
- The two waivers (`/bar-games-waiver`, `/game-zone-waiver`) are drafted legal documents,
  not filler. They are kept.

---

## 3. Measurement system — margins, responsive, rhythm

Values **measured** across the house repos, not chosen. Detail and method in
`docs/house-tokens.md`. Stack: **Tailwind v4**, theme in `@theme` inside
`globals.css`. There is no `tailwind.config.ts`.

### Container and gutter

```
--container-mobile:  780px    /* up to 768 */
--container-tablet:  880px    /* 768 - 1344 */
--container-site:   1280px    /* from 1344 - unanimous across the 6 repos */
--container-wide:   1420px    /* exception: full-bleed galleries */

--spacing-gutter:     16px    /* mobile */
--spacing-gutter-lg:  32px    /* desktop */
```

The jump to 1280 happens at **1344px** (= 1280 + 32×2 of gutter), not at the layout breakpoint.

> ⚠️ **`--breakpoint-desk` goes in `rem`, not px.** Declared as `1344px` while Tailwind's
> come in rem, Tailwind can't sort the media queries and emits `desk`
> **before** the defaults: `sm:grid-cols-2` beats `desk:grid-cols-4` at 1440px.
> Correct: `84rem`. Affects every `sm:`/`md:`/`lg:` + `desk:` combination.

### Type scale

A single display axis `d1`–`d7` plus three text steps:

| Token | px | line-height | Use |
|---|---|---|---|
| `d1` | 72 | 0.94 | hero |
| `d2` | 58 | 0.96 | h1 desktop |
| `d3` | 46 | 1.00 | h1 tablet · h2 desktop |
| `d4` | 36 | 1.08 | h1 mobile · h2 tablet |
| `d5` | 28 | 1.18 | h2 mobile · h3 desktop |
| `d6` | 22 | 1.25 | h3 mobile · card title |
| `d7` | 18 | 1.30 | footer column label |
| `intro` | 25 | 1.40 | desktop section subhead |
| `lead` | fluid | 1.60 | section copy |
| `base` | 16 | 1.65 | **92% of the site's text** |
| `cta` | 16 | 1.20 | buttons |
| `caption` | 13 | 1.45 | kickers, labels, captions |

Responsive map: `h1 = d4 → d3 → d2` · `h2 = d5 → d4 → d3` · `h3 = d6 → d5` · card `d6 → d5`.

> ⚠️ **`lead` goes in `:root`, not in `@theme`.** Tailwind v4 evaluates `@theme` at compile time
> and a `clamp()` with `100vw` there silently compiles to 18px.
> `clamp(16px, 16px + (100vw - 390px) * 0.005128, 18px)`

### Vertical rhythm

Section bands, **always as a mobile/desktop pair and always symmetric** (same `pt`
as `pb` — air on only one side was a bug that got fixed, not a pattern):

| Step | Mobile | Desktop |
|---|---|---|
| `sm` | 48px | 64px |
| `md` | 64px | 96px |
| `lg` | 80px | 128px |
| `xl` | 96px | 160px |

Internal rhythm of the section header (mobile → desktop ≥922px):
`kicker 8→12` · `subhead 16→20` · `paragraph 8→8` · `cta 24→32`.

### Header

`--spacing-header: 77px` · `--spacing-header-sm: 67px`.

### What the new design can redefine

Color, radii, shadows, motion and the brand art. None of that is fixed here: the
0–4px radii and the tinted shadows were Phase 1 decisions marked "to be validated",
and the shadows were tinted in another project's navy.

---

## 4. SEO — from the first commit, not at the end

- `SITE_URL = 'https://rooftopatriverside.com'`.
- `pageMeta()` in `src/lib/seo.ts`, with the table of titles and descriptions in
  `src/content/seo-pages.ts`. The titles in the table are **absolute** (they already include the
  brand); those of dynamic routes go through the layout's `template`.
- Canonical per page, OG image per page with a fallback.
- Schema `BarOrPub` + `EventVenue` (see §1).
- `sitemap.ts` and `robots.ts` generated, not hand-written.

---

## 5. The pending-items rule

Content gaps are marked in the code with `<PhotoPending>`, `<PendingData>` and
`<PendingBlock>`. The marker shows the brief for what is missing, and **disappears on its own**
when the data arrives: nothing needs to be redesigned.

```
grep -rn "PhotoPending\|PendingData\|PendingBlock" src/
```

**Nothing is estimated.** A capacity on a venue's page is a promise, and a made-up
number becomes a business problem the day someone uses it to make a decision.

27 open items as of 2026-09-10 in `docs/client-requests.md`. Three block the home page:
a photo of a dog (Wooftop Wednesdays), a sunset sky for the hero, and 6–8 vertical
ambience clips. **These three still block in the new design** unless the
design removes those elements.

---

## 5b. Client material: never goes into git

Camila's rule, 2026-09-11. **No PDF, brief, brand book, moodboard or
file with client data is versioned.** All of that lives in `_internal/`,
which is in `.gitignore` and is never pushed.

The reason is concrete: those files carry the owners' personal emails and phone numbers,
the agency fee and budgets. Once they are in the git history, removing them
requires rewriting it.

What does get versioned is the **derivative**: the optimized image, the transcribed
data, the quote in a `docs/` document. Never the original.

## 6. Media

- Photos: long side 3000px, JPEG, no filters or watermarks.
- Videos: vertical 3:4 or 9:16, 6–10 s, muted, **no burned-in text and no people talking
  to the camera**. A social media clip in a 130px card reads as a broken video.
- The pipeline re-encodes and downsizes; `public/` already has the optimized delivery.
- Faking with CSS what should be a photo is forbidden (e.g. a gradient imitating
  the sunset).

---

## 9. Decisions that hold up code (rescued from the comments, 2026-09-23)

On 2026-09-23 all comments were deleted from the source code. The full text is still in the git history
before that date: `git log -S "<symbol or phrase>" -- <file>` finds the commit, and `git show <hash>:<file>` shows it.

### 9.1 Code kept unused, on purpose

None of these have importers (or only their types are imported). **They are not deleted** in an orphan cleanup.

- `src/components/shared/DiscHero.tsx` → disc hero template (formerly `TruckHero`), kept when the trucks were unified. If it bothers
  anyone that the inner pages open differently, `PlateHero` gets taken to all of them; there's no going back to this one.
- `src/components/shared/HorizonBorder.tsx` → wave + sun medallion from the brand book (Figma node 2012:4491, split by `npm run horizon`).
  Redrawing it costs more than keeping it. The `rt-sun` class in `globals.css` is its empty hook: it is kept without a keyframe.
- `src/components/shared/WaveBorder.tsx` → the scroll-curl border. The component isn't mounted, but `Surface`, `SURFACE_BG` and
  `SURFACE_TEXT` are imported by `SoftWave`, `PageHeroWave` and `CompareSlab`: the file is not touched.
- `src/components/shared/BandVideo.tsx` + `public/videos/hero-rooftop.mp4` (and its poster) → clip from `/hostanevent` (15 s, 1.5 MB).
  If it comes back to `/our-story`, it goes in as a band inside the page, never as a header.
- `src/components/shared/VideoWall.tsx` (+ `WallVideo.tsx`) → 3-column wall, the right form for a two-column hero.
- `src/components/shared/CardArc.tsx` → arc of cards for a centered hero. It shares `wall-slots.ts` with `VideoWall`: going back to
  either one doesn't require reassigning photos.
- `src/components/shared/StepStair.tsx` → the steps as a staircase. Today only its `Step` type is imported (from `YardSteps`).
- `src/components/sections/FeaturedEvent.tsx` → the band for the large featured event, removed from `/whats-on`, kept for another page that
  wants to open with a featured event. `shared/FeaturedEventCard` **is** in use (`/sunset-bar`, `UpcomingCards`, `EventTypes`).
- `src/components/sections/BarMenu.tsx` + `fallbackAsGroups()` (`content/bar-menu.ts`) → the bar's digital menu. Going back means
  swapping `<MenuSheets />` for `<BarMenu groups={fallbackAsGroups()} />` in `/sunset-bar`. `bar-menu.ts` has the same menu that
  the database had on 2026-10-22.
- `src/components/sections/TruckMenu.tsx` → a truck's dish menu, received through the `menus` prop. It waits for the per-truck
  profiles to come back.
- `ReviewsMarquee` in `src/components/sections/HomeSections.tsx` → written and left unmounted until the client confirms real ratings.
- `src/content/story.ts` → Charity Partner Program, real data from `/giveback`. `/giveback` 301s to `/our-story`, which no longer
  mentions it: open decision (re-mount it, its own route, or re-point the 301). The partner of the month is out of date.
- `public/images/venue/hero-truck-window.webp` → fallback cover if the hero video fails. `scripts/build-media.mjs` still
  generates it; it is only deleted after first removing that entry from the script.
- Reggae Kitchen entry in `src/content/trucks.ts` (`active: false`) → if the truck shows up, it comes back with `active: true`, and its 301
  never stopped existing. `retiredTruckRedirects()` keeps the name so `next.config.ts` doesn't have to be touched (today it redirects every slug).
- `tomato-soft` token (`globals.css`) → it is not an orphan: the dark variant of `PendingData` uses it.
- `EVENT_FAMILIES` → no longer listed on `/events`, but it generates `EVENT_SUBTYPES`, which validates the `InquiryForm` dropdown on the server.
- `src/app/actions/newsletter.ts` → it was deleted once by mistake: the current site **does** have the form. It sends a double opt-in
  confirmation email through Mailjet and only adds the contact to the list (`MAILJET_CONTACT_LIST_ID`, action `addnoforce`, never
  `addforce`) after the button on `/newsletter/confirm` is pressed. The consent checkbox is unchecked by default and must stay so.
  Confirmation links are signed and expire after 24 hours, but are not strictly single-use (no database).
- `src/components/shared/Motion/` re-exports `EASE_BRAND`, `DURATION`, `REVEAL_OFFSET`, `STAGGER` and `REVEAL_AMOUNT` from
  `lib/motion.ts` under the old names, so as not to break call sites. `ScrollExit` was deleted on 2026-09-23 (it's in git).

### 9.2 Contracts between files

**H1 and SEO**
- Text of each page's `<h1>` ↔ `PAGE_SEO[route].h1` in `src/content/seo-pages.ts`: `npm run check:seo` compares the `textContent`
  character by character. Straight apostrophe (`'`, not `&rsquo;`); uppercase via CSS, never in the source.
- `PlateHero` · `title` + `titleAccent` ↔ `PAGE_SEO`: `title` ends with a space. The space goes inside the string: a loose text node
  between two `block`s builds an anonymous box. To break the line, a `span` with `block`, never `<br>`.
- `src/components/sections/Hero.tsx` · "PARADISE" plate (`aria-hidden`) ↔ `sr-only` inside the `<h1>`: without the `sr-only` the h1 ends up
  as "Eat, Drink" and `check:seo` fails.

**Plate hero (`src/components/shared/PlateHero.tsx`)**
- `mb-[-0.94em]` of the `<h1>` ↔ `top-[calc(100%-0.94em)]` of the two `inverted-corner` ↔ 0.88 line-height + the plate's `pb-[0.12em]`:
  0.94em is half of a two-line plate. If one changes, all three change. They go in `em`, never in px.
- Plate `max-w-[calc(100%-4*var(--radius-frame))]` ↔ radius of the photo's frame: if the plate reaches further, the corner falls on the
  photo's curve or goes off the page (1px of horizontal scroll at 360px).
- Plate `bg-bone grain` ↔ the section's `bg-bone grain`: if one changes surface without the other, the rectangle shows up.
- A hero headline that doesn't fit in two lines of `text-band` → the copy gets shortened (and `PAGE_SEO` with it). The font size isn't reduced.
- `photoMobileRatio` picks the mobile frame (`portrait` 4:5 by default, `landscape` 3:2). `landscape` is for a horizontal
  photo where 4:5 would cut people off at the sides (`/events`, 2026-09-28): the frame gets shorter and the subhead with the two CTAs fits in
  the first screen. If another photo were needed for mobile, it is cropped from the original and not from the desktop one.
- `photoMobile` mounts its own photo below `sm` (`/events` since 2026-09-29, 3:2 from the original). Both `Image`s carry
  `preload`, and the `1px` `sizes` at the width where each one is hidden is what avoids downloading both at full size.
- `photoKeepFaces` (`/events`, 2026-09-29; cap changed on 2026-10-02) puts `@container` on the box and `lg:min-h-[56.25cqw]` on the
  frame: the band never goes wider than 16:9 even if `max-h` flattens it. With the photo of the five friends in orange wigs (4:3 from the original at
  full width, `focus` 0.333 in `build-media.mjs`), anything wider than that can't fit both the heads below the plate and the lowest chin
  at once: the faces run edge to edge, so the frame can only crop at the top and bottom. Cost: on short screens the hero's CTAs
  drop below the first screen. Camila's rule: the photo is the same on every device and no head gets cut off.

**Header height**
- Actual 78px header ↔ `top-[78px]` (`StackWithHead`), `top-[calc(78px+var(--head))]` (`EventTypes`), `pt-24` (`GameShelf`,
  78 + air), `top-[79px]` (`MonthBar`, 78 + rule). If the header changes height, all of them move.
- `:target { scroll-margin-top }` in `globals.css` (reads `--spacing-header` / `--spacing-header-sm`) is the only place for the anchor
  offset. Lenis respects it: `SmoothScroll` goes **without** `anchors.offset` (with it the destination landed at twice the distance).

**Surfaces, arcs and waves**
- `<Section tone>` and `<section class="bg-…">` of each page ↔ `scripts/surface-rhythm.mjs` (`npm run check:surfaces`): max. 1 `deep`
  per page, `mint` and `cream` count as cream (max. 2), never two colored ones next to each other. It reads the file with regex (comments and
  ternaries included) and only expands `<Section>`, `<FormSlab>` and components used **without props**. The home page exceeds it on purpose.
- That's why `VenueTabs` writes its `tone` inside (not via prop), `SpecSlab` doesn't bring its own `<Section>` (the call site provides it) and
  `JoinSwitch` stays outside the guard: if it becomes a `Section`, the rhythm of `/join-us` has to be reviewed.
- A dark or cream `div` inside a light section is a card, not a band: it doesn't count for the guard (`HowToOrder`, prices on `/game-truck`).
- The `stone` texture (Figma node 2057:27897, `public/textures/stone.webp`) goes only on the `/our-story` quote (`Section tone="teal"`) and
  on the footer's newsletter card (Camila, 2026-09-28). It is remapped to grays below 50%: in `hard-light` it only
  darkens, and white on `teal600` never drops below 4.59:1. The Figma version lightened and left the text at 2.6:1.
  `SoftWave` repeats it on its `teal600` side so there isn't a flat strip stuck to the quote: below the wave when `to` is teal, and
  cropped with `public/textures/soft-wave-mask.svg` when `from` is teal. The mask is `SOFT_WAVE.d` already flipped: if the
  wave changes, it gets regenerated.
- Starting color of each wave (`SoftWave` `from`, `CompareSlab` `from`) ↔ surface of the section **above**. It moves every time
  the page is reordered; `check:surfaces` also looks at the waves.
- `--radius-band` ↔ negative margin of the overlapping section ↔ `closing-arc` (= `closing` + `--radius-band`). The `.band-arc` class
  + `:has(+ .band-arc)` stretches the previous one with a **transparent border**. Each overlapping section needs an increasing `z-index`.
- `FormSlab` on `/events` passes `panelTone="paper"` because its section has to be `bone` (it carries `band-arc` and the arc takes the color
  of the section). Default for the rest: `paper` section + `bone` panel.
- `CROSS_PADDING` (exported from `CompareSlab.tsx`) ↔ negative margin of its cards: consumed by `/events`, `/food-trucks` and
  `EventSpaces`. The cards' `z-10` is not removed.

**Tied measurements**
- `TruckCards.tsx` · `-top-[26px]` = `AWNING.peek`, `-inset-x-2` (8px) = `AWNING.overhang`, the `18` in the `clip-path` = `AWNING.entry`.
  Tailwind needs the literal: if the constant changes, the class changes. The awning stripes, always an even number.
- `.die-cut` (`globals.css`): tooth radius 13px ↔ pitch 26px ↔ 26px deducted from the fill. The `13.5px` is antialiasing, not an error.
- Die-cut rule `inset-3.5` (14px) + `rounded-shell`, shared by `CompareSlab`, `EventTypes`, `FormSlab`, the `/sunset-bar` happy hour,
  the `/food-trucks` banner and the `/market` card; that's why those cards have 8/10 padding.
- `ThreeDoors.tsx` · `right-1 bottom-1` of the circle ↔ `--bite-bleed` (4px).
- `/our-story` · `translate-y-19` (76px) of the team plate = 56 of the drawer + 20 of the `p-5`.
- Logo sticker backing plate (`globals.css`): 109.262% × 108.696% (14px over 302.3 × 322), one percentage per axis; the `fog` edge
  adds 3px over the desktop measurements.
- Headline font-size caps ↔ headline text + piece beside it: `EventsBanner` (105.6px, stamp) and `FindUs` (socials). If the
  text or the piece changes, the cap is recalculated.
- `HomeSections.tsx` · the two columns end at the same height: grid **without** `items-start` + right column `flex-col justify-between`
  + paragraph of ≤ ~165 characters.
- `src/content/venue-areas.ts` · each `body` ≤ ~140 characters ↔ `VenueTabs` at 62ch (two lines on desktop).
- Phrases in the hero's status pill ≤ ~22 characters ↔ `text-pill` (measured table in `Hero.tsx`). Button labels ≤ ~20
  characters ↔ `whitespace-nowrap` in `Button.tsx`: if it doesn't fit, the copy gets shortened.

**Horizontal scroll and shadows**
- `GameShelf.tsx` · `pad` in the track's math ↔ the row's `px-gutter md:px-gutter-lg` (not `--spacing-edge`).
- `shelf:` variant in `globals.css` ↔ the same media query in `GameShelf`'s JS.
- `MonthBar.tsx` · negative indent of the filter strip ↔ container padding (`GUTTER`). If they diverge, horizontal scroll across
  the whole document.
- `WhatsOn/` · the track's `px-6` = `gap-6` (24px); `scroll-px-6` goes along with `px-6`; `WIDTH` decides how many cards are visible;
  `trackEdge` reads the computed `px-edge` from the DOM. Cards capped at 8.
- Paddings that exist for the shadow ↔ shadow token (reach = `blur + spread`, measured by `npm run check:shadows`):
  `WhatsOn` `pt-3.5 pb-13` (`shadow-card-dark`), the `Motion/` carousel `pt-6 pb-21` (`shadow-float`), `YardSteps` `pt-2 pb-7`,
  `PhotoDivider` `py-13` (52px). If the shadow changes, they get recalculated.
- `BackToTop.tsx`: 37px to the edge ≥ reach of `shadow-card` (32); that's why it doesn't use `shadow-float`.

**Colors, tokens and typography**
- `@theme` block in `src/app/globals.css` ↔ `src/lib/brand.ts`: `npm run check:tokens` fails if they diverge. What paints is the CSS.
- `src/lib/cn.ts` · `twMerge` config ↔ **all** the `--text-*` in `@theme`. A missing size token gets taken for a color and
  wipes out the variant's color (caught by `npm run a11y`, not the build).
- `--font-display` / `--font-subhead` / `--font-body` (163 call sites) ↔ `next/font/local` variables in `src/app/layout.tsx`, which
  go in the `<html>`'s `className`. Without it, the text falls back to the default without warning (`npm run check:css`).
- Headline accent: `sunset-deep` on light (`BRAND.headlineAccent.onLight`), `sunset` on `deep`. Text on `sunset`: black.
  The only live exception: the "TOGETHER" plate in the home hero (`sunset` on `bone`, 2.35:1, Camila's decision).
- Colors of the `GameShelf` spines ↔ console squares in `SpecSlab` (the same first three, same order). `river` only
  as a fill, never text.

**Forms, routes and data**
- `INPUT_BASE` in `NewsletterSignup.tsx` ↔ `INPUT_BASE` in `InquiryForm.tsx`: deliberate copies that change together (pill, 22px
  padding, 42px tall = button, `text-[16px]`).
- Honeypot `name="website"` drawn by `FormShell` ↔ schemas: `lib/schemas/join.ts` reads `website`; no real field can be named
  `website` (that's why the one in `market-vendor.ts` is `link`).
- `lib/schemas/contact.ts` is used by both the client and the server action: a single object, the same messages.
- Query params and anchors: `?apply=team|artist` (`JoinSwitch`), `/events?area=game-truck#inquire` (checks the box in `InquiryForm`),
  `#inquire` and `#spaces` on `/events`. The `id`s `game-truck` (`/events`), `packages` and `policies` (`/game-truck`) are kept as
  destinations; some of the senders no longer exist: `grep` before renaming.
- `data-footer-end` in `Footer.tsx` ↔ `footerLift()` in `BackToTop.tsx`: if it gets renamed, the button silently drops to its floor.
- `--footer-notice` (`globals.css`): it is **written** by the element fixed to the bottom (the future cookie banner, height in px and `0px` when closed) and
  **read** by `BackToTop`, added to its 72px floor. `BackToTop` goes at `z-[60]`, below the house banner's `z-[70]`.
- `SITE_LEGAL_DOCS` builds the site footer and the footer of each legal document. The Toast gift card URL lives only in `brand.ts`.
- `lib/motion.ts` is the single source of curves and durations; both ends of `RevealMedia`'s `inset` come from the `clip` token.
- Drink dropdown labels in `content/spaces.ts` = `DRINK_OPTIONS` labels in `content/events-pricing.ts`; the fees
  (gratuity, tax, reservation fee) were removed from `/events` on 2026-09-29 at Maddie's request; they aren't published again unless she asks. Prices on `/game-truck` and `/events` always come from `content/`.
- `EVENTS_PDF = null` (2026-09-29, Camila): the client's Events Packet went out of date and contradicts the prices on `/events`, so
  the download card isn't shown. When the new one arrives, `{ label, href, format, size }` gets put back and it reappears on its own.
- Rule "a line that starts with a price = promo": duplicated on purpose in `content/happy-hour.ts` (loading) and `UpcomingCards` (reading).
- `/sunset-bar` promos: `space === 'Sunset Bar'` + the event publishing prices. Happy hour identified by title. Never by tag.
- Truck menus ↔ `content/menus.json`: matched by normalized name (`truckByName`); with no match it falls back to `menuImage`.
- Truck name on screen: always `displayName(t)`, never `truck.name` directly (it hides unconfirmed names).
- Calendar dates: `from` = `todayInVenue()`, never `toISOString()` (Vercel runs in UTC and wipes out the night's event).
- No database since 2026-10-22: the site is handed over to the client, like Tre Vele. Contact, hours, menus, events,
  job openings and blog are JSON in `src/content/` (table in the README), dumped from Supabase that day. The PDFs and the posters were downloaded to
  `public/menus/` and `public/images/events/posters/`, with no `remotePatterns`. A data change is a commit and a deploy; there's no cache to expire.
- `contact.json` is read by `lib/brand.ts` (`BRAND.contact`, `address`, `social`, `giftCards`, `eventbrite`), and `getVenue()` builds everything
  from `BRAND` + `content/hours.ts`. There is no other copy of the phone number or the address.
- Posters in `events.json`: one file per content (sha1), named after the event. The dates of the same event point to the same
  file. `npm run events:verify` checks the three photo rules.
- `withoutEmDash` (`lib/em-dash.ts`) is applied when reading titles and texts of events, menus and blog: even if the JSON brings an em dash,
  it doesn't reach the screen.

### 9.3 Measured technical traps

**CSS and Tailwind**
- All theme utilities disappear without a warning → a CSS comment inside `@theme` closes the block early (they don't nest) →
  no comments inside `@theme`. Covered by `npm run check:css`.
- `position: sticky` stops sticking → an ancestor with `overflow: hidden` creates a scroll container → use `overflow-x: clip` (the
  `body` already has it; it's also what allows `mx-[calc(50%-50vw)] w-screen` without overflow).
- The page ends up shifted in x after navigating → a momentary overflow survives links with `scroll={false}` → the body's `clip`.
- Shadows cut flush in carousels → `overflow-x: auto` computes `overflow-y: auto` → `py` on the track + a negative margin that
  gives it back. The same crop eats the `::after` of `.hit-area` (that's why `py-2 -mb-2` in `MonthBar`).
- Shadow cut off with "enough" padding → the reach was calculated as `blur/2 + spread` → the real tail is `blur + spread`.
- Rectangular shadow on a piece with `mask` → `box-shadow` doesn't follow the mask and the order is filter → clip → mask →
  `filter: drop-shadow` on the **wrapper** (`die-cut`, sticker, `YardSteps`).
- `mix-blend-mode` that doesn't blend (grayed-out footer) → `z-0` on a positioned element creates a stacking context and blends against nothing →
  layer at `z-index: auto` and the content at `relative z-[1]`.
- Closing air at zero → `padding-bottom` **overrides** `pb-closing` instead of adding to it → stretch with a transparent `border-bottom`.
- Classes that don't exist in the CSS → Tailwind only emits literals → no `bg-${x}`; maps with the full classes (`SURFACE_BG`).
- `-mx-6` in the DOM with no emitted rule (measured in this repo) → use `[margin-inline:-1.5rem]`.
- "preloaded but not used" warning in Chrome → a CSS module for a single-route section ships in a chunk that the header's prefetch
  preloads on every page → arbitrary utility instead of a module.
- `hidden` that doesn't hide → concatenating classes lets whichever appears later in the emitted CSS win → everything through `cn()` (`clsx` + `twMerge`).
- `max-w-[16ch]` that strangles an h1 → `ch` is relative to the element's own font-size → the measure goes on the span that carries the font size.
- Disc that jumps when the scrollbar appears → width in `vw` → width in `%` of the container with `aspect-square`.
- Surface with its own `bg-*` ends up flat → `grain` goes per surface, it isn't inherited → `grain` on each section/plate that paints a background.
  Never on objects (cards, buttons) or on elements that already have a `background-image`; watched by `check:grain`.
- `grain-layer` broke an `absolute` → the utility declared `position: relative` → it doesn't declare `position`; whoever uses it is already
  positioned. Its tile pins alpha to 1 with `feFuncA` (`feTurbulence` also puts noise into the alpha).
- Raising the grain's opacity lowers contrast without `check:contrast` seeing it (it reads tokens, not the layer) → alphas 0.03/0.05 capped by
  `muted` on `bone` (4.67:1). Redo the math by hand before touching them.
- Filter strip that drags in horizontal scroll → negative indent different from the container's real padding (see §9.2).

**React, hydration and Next**
- Invisible content with "reduce motion" → the server emits `style="opacity:0;…"` and React doesn't remove during hydration an attribute
  that the vnode doesn't have → final state with `!important` (`Motion.module.css`) + safety net in the `globals.css` media query.
- Hydration error #418 on the home page → motion's `useReducedMotion` is already `true` on the client's first render and swaps `<video>`
  for `<img>` → `useSyncExternalStore` with a server snapshot of `false` (`Hero.tsx`). Latent in `BandVideo`, `WallVideo`, `CardArc`.
- Image with `clip-path` that never appears inside a `StaggerGroup` → motion propagates variant labels through context and overrides the
  literal `whileInView` → declare it with `variants` using the same labels (`hidden` / `visible`).
- SVG through `next/image` comes out 0×0 with no error → the optimizer breaks vectors → `<Image unoptimized>` for every `.svg`.
- SVG in an `<img>` that doesn't stretch → it respects its own `preserveAspectRatio` → inline with `preserveAspectRatio="none"` (or `slice`
  so it doesn't scale on wide monitors).
- `Link` to a hash leaves focus at the origin → Next's router resolves the hash without moving focus → anchors, `mailto:`, `tel:` and
  external links go as `<a>`; `Link` only for internal navigation.
- Time-dependent state (today, open now) wrong or with a mismatch → the server doesn't know the visitor's time and the page gets
  cached → paint without state and resolve on mount (`lib/hours.ts`, `WhatsOn`, `Hero`).
- "The result of getSnapshot should be cached" / infinite render → `getSnapshot` returned a new object → return primitives (and
  round to an integer so it doesn't re-render over half a pixel), as in `BackToTop`.
- Carousel that shows all cards or none → an `IntersectionObserver` with the children array captured on mount goes out of sync on
  reorder and on Fast Refresh → measure geometry on every pass; 1px tolerance for Windows' fractional DPR.
- Carousel that opens on the second card → reordering children of a `snap-mandatory` forces re-anchoring, or `scroll-px` is missing alongside the
  `px` → an effect that sets `scrollLeft` back to 0 when `today` resolves (don't remount with `key`: it drops focus).
- Focus that returns to nowhere when closing a dialog → StrictMode mounts twice and the second setup saves the close button → save
  the return focus only if `activeElement` is outside the dialog (`EventDialog`).
- The page behind scrolls with a `<dialog>` open → `showModal()` makes it inert but doesn't stop the scroll → `overflow: hidden` on the
  body, restored in the effect's `return` (same mechanism as the drawer). The one that scrolls is the `<dialog>` itself with `h-dvh`.
- Preloader stuck for 4 s on cold start → the curtain depended on JS to lift → server component with a 100% CSS animation.
- `<video autoPlay>` keeps playing with reduced-motion → the media query doesn't stop playback → client component that shows
  the poster (same box).
- Jump after hydration in the video wall → deciding columns by width on the client → render all of them and hide with CSS.
- Home hero crop sized wrong → it was measured with the fallback font → measure with `getBoundingClientRect` on mount,
  on resize and on `document.fonts.ready`; document offset (`rect.top + scrollY`); start at `38%` / `76px` without JS.
- Animation that doesn't restart when the text changes → React reuses the node → a `key` shared between the pill's text and medal.
- `link ? Link : 'div'` wrapper doesn't compile → the union leaves `href` optional → a separate function per branch (`FeaturedEventCard`).
- Two `<meta name="robots">` on the 404 → Next already injects `noindex` → `not-found.tsx` declares `metadata` without `robots`.
- Honeypot that never catches anything or that rejects everything → the schema read another key, or a real field had the same name and `Object.fromEntries`
  kept the empty one → see the `website` contract in §9.2.
- Automatic zoom when focusing a field on iOS → font-size below 16px → `text-[16px]` on inputs.
- Select that looks like a text field → `appearance-none` without its own arrow → arrow 18px from the edge with `pointer-events-none`.
- Fully clickable card with a button inside → `<a>` inside `<a>` is invalid HTML → the link is the button (`UpcomingCards`).
- axe reports false contrasts → it measures halfway through the fade-in; `networkidle` doesn't mean the page is still → wait for
  the entrances to finish before measuring (`scripts/a11y.mjs`). And axe skips anything `aria-hidden`: it never audits the "TOGETHER" plate.
- On Windows, killing the `next start` terminal doesn't kill the node process: it keeps listening or keeps `.next` locked, and the next build fails or serves stale CSS → before building, `netstat -ano` and `Stop-Process -Id <pid> -Force`; if it already happened, delete `.next`.
- Component CSS without a layer in `globals.css` beats every Tailwind class (Tailwind 4 puts utilities in `@layer utilities`) → the class gets ignored without warning → every new component rule goes inside `@layer components { }`. Outside a layer only the `:root` tokens and the reduced-motion `!important`s on `*` and `[data-reveal]` (inside a layer, an `!important` changes strength).
