# Audit: Rooftop at Riverside home page

Branch `redesign/light-tropical`. Baseline in `design-audit/baseline/`, captured with
`design-audit/shoot.mjs` on the `main` tree at 9569ef6.

Every number here is **measured**, not estimated. The tools stay in the branch:
`shoot.mjs` (screenshots), `surface-split.mjs` (surface share per pixel),
`measure.mjs` / `measure2.mjs` (WCAG contrast).

---

## 0. The number that sums up the problem

Surface share **measured per pixel** on `baseline/home-desktop.png`
(1440×6197, 991,680 pixels sampled):

| surface | today | target |
|---|---:|---:|
| **deep + deeper** (dark green) | **55.4%** | 20–25% |
| paper (white/off-white) | 30.7% | \_\_\_ |
| cream / bone (warm light) | 9.7% | 70–75% combined |
| river / mint | 0.9% | decorative |
| sunset | 0.6% | ≤ 5% |
| cream-deep | 0.5% | ≤ 5% |
| photo / map / untokenized gray | 2.3% | — |

**Light: 40.3%. Dark: 55.4%.** The target is almost exactly the inverse.
It is not an impression: more than half of the home page is dark green.

And there is an aggravating factor the percentage doesn't show: the dark sits in the **first
two screens**. The hero is 100svh of solid `deep`, and the section that follows it
one screen later is another `deep` slab of 1,309px. Whoever lands sees green,
scrolls, and sees green again.

---

## 1. Table by section

Heights measured on desktop 1440. `main` measures 5,625px; the footer adds on top of that.

| # | Section | Component | Current surface | Problem | New direction |
|---|---|---|---|---|---|
| 1 | Hero | `Hero` + `VideoWall` | solid `deep`, 900px, 100svh | The first screen is the darkest on the site. And the right half is **12 gray boxes labeled "VIDEO"**: the spot where the brief asks for hero imagery is literally empty | Invert the luminosity: text column on `paper` with the headline at the top of the scale. The wall column stays where it is (it's the geometry Camila approved) but loaded with **real photography**, which is what makes it the protagonist |
| 2 | What's on | `WhatsOn` | `paper`, 1,053px | Three identical rounded cards: same radius, same `shadow-card`, same width. It's the SaaS-kit anti-pattern. The first one stands out by painting itself `bg-deep`, that is, with color instead of hierarchy. And all three photos are "IMAGE MISSING" placeholders | The card container goes away. Photo on top, text directly on the surface, a 1px rule as separator. Today's item stands out by **size** (it spans two columns), not by color |
| 3 | border | `WaveBorder` | `paper`→`deep` transition | Correct, and it's real art from the Figma. But today it separates light from dark; with a light home page there are fewer breaks to mark | Preserved. It now marks the only remaining break into `deep`, and changes color according to the surfaces it joins |
| 4 | How this place works | `HomeSections` + `StepStair` | **`deep`, 1,309px** | The biggest dark slab on the site, and the diagonal staircase leaves ~2/3 of the grid empty: 1,309px of green for three short paragraphs. The `01/02/03` are in `river` on `deep` (2.43:1 against white; on deep it's even less) | Moves to `cream`. The staircase is kept (it's the third shape and came from for-living.it) but the empty triangle stops being dead green and gets compacted |
| 5 | border | `WaveBorder` | `deep`→`paper` | see #3 | Preserved |
| 6 | Three doors | `ThreeDoors` | `paper`, 665px | **The section closest to the target.** It's already 1px rules, small icon, micro-label, title, body: the WeWork mandate is met. What's extra: the icon in a rounded `bg-bone` box, the eyebrow above the h2 *in addition to* the three column eyebrows, and the h2 at 46px on a 1440 page | Barely touched: the h2 scale goes up, the icon box goes away, and of the four eyebrows one remains |
| 7 | Events banner | `EventsBanner` | `bone` 569px with a `bg-deep/90` card over a photo inside | The dark card makes the section read dark without being a dark section. The three items on the right are three `bg-paper/10` boxes with the same radius: cards again | **This is the one that keeps the dark break.** It moves to a full-bleed `Section tone="deep"`: a single marked break, in the vertical that bills the most. The three items become rows with rules |
| 8 | Find us | `FindUs` | `paper` 1,029px with **two `bg-deep` cards** flanking the map | Two dark blocks of ~620px inside a light section: in the screenshot the section reads dark. It's the second big contributor to the 55% | Both cards become light with a 1px rule. The map remains the only piece with visual weight |
| — | Header | `Header` | fixed `bg-deeper`, translucent | Fixed dark bar over the whole page. With a light home page it's the element that will weigh the most, and `deeper`/`deep` are only 1.26:1 apart; over the green hero the header is barely distinguishable | To be reviewed in the global components phase (PHASE 4, step 3) |
| — | Footer | `Footer` | `bg-deep` | Correct and not up for debate: the footer is dark | Stays |

---

## 2. Inventory: where `deep` is applied today as a **surface**

Kept separate from `deep` as a text color, which is a different thing and is fine.

### Dark surfaces on the home page
| File | Line | What |
|---|---|---|
| `src/components/sections/Hero.tsx` | 59 | `bg-deep` on the whole section, 100svh |
| `src/components/sections/HomeSections.tsx` | 80 | `Section tone="deep"`: the 1,309px slab |
| `src/components/sections/EventsBanner.tsx` | 79 | `bg-deep/90` over the photo, inside a `bone` section |
| `src/components/sections/FindUs.tsx` | 222, 298 | two `bg-deep` cards |
| `src/components/sections/WhatsOn.tsx` | 82 | the first card in the list, `bg-deep` |
| `src/components/shared/Footer.tsx` | 88 | the footer. Stays |
| `src/components/shared/Header.tsx` | 135–136 | `bg-deeper` / `bg-deeper/90` |
| `src/components/shared/Section.tsx` | 39 | the definition of the `deep` tone |

### Dark surfaces outside the home page (not part of this branch, noted here)
`src/app/nfc-north-hq/page.tsx:134`, `src/app/our-story/page.tsx:202`,
`src/app/sunset-bar/page.tsx:63`: one `Section tone="deep"` each.

### Brand overlays, which are preserved
`src/components/shared/PageTransition.tsx:48` and `Preloader.tsx:40` use `bg-deep`.
They are the curtain and the preloader; the brief asks to preserve `.transition` and only check
that the color goes along with the light palette.

### False positives
`Eyebrow tone="deep"` (12 call sites) is **text color**, not a surface, and gives
10.83:1 on white. Not touched.

---

## 3. State of the tokens: three sources of truth, and they don't match

This is the most serious finding of the audit, because it invalidates the existing contrast
documentation.

| Token | `src/lib/brand.ts` | `src/app/globals.css` `@theme` | `scripts/contrast.mjs` |
|---|---|---|---|
| `paper` | `#FFFFFF` | **`#FDFCF7`** | `#FFFFFF` |
| `ink` | `#000000` | **`#0A1F1E`** | `#000000` |
| `body` | `#0A0A0A` | **`#0A1F1E`** | `#0A0A0A` |
| `bone` | — does not exist | `#F7F1E3` | — |
| `deeper` | — does not exist | `#013434` | — |
| `chalk` | — does not exist | `#FFFFFF` | — |
| `fog` | — does not exist | `#E6E1D4` | — |

**What renders is `globals.css`.** `brand.ts` was left describing a palette
the site hasn't used since the theme was revised against Showdown Social, and
`scripts/contrast.mjs` carries the same old palette, so **every ratio in
`docs/contrast-audit.md` is calculated against colors that aren't painted**. The
broad verdicts still hold (the problematic pairs are the same) but
the numbers aren't the site's.

Consequence for the brief: "No hex outside `lib/brand.ts`" can't be
met literally. Tailwind v4 has no `tailwind.config.ts` (the theme is
CSS-first, in `@theme`) and a `.ts` can't be imported there. **Proposal in
`VISUAL-DIRECTION.md` §7.**

### Components with a hex or arbitrary color class
| File | What | Verdict |
|---|---|---|
| `shared/AgencyBar.tsx` | `bg-[#f5f5f5]`, `text-[#5c5c5c]` ×5, `via-[#7c7c7c]` ×2 | **real violation**: 8 system-gray hexes, off-palette |
| `shared/Button.tsx:35` | `hover:bg-[#e0741a]` | **real violation**: the hover of the primary CTA |
| `app/layout.tsx:25` | `themeColor: '#FFFFFF'` | legitimate: it's browser metadata, not a style. It must be updated if `paper` changes |
| `app/nfc-north-hq/page.tsx:39-42` | NFL team colors | legitimate: they're third-party brands, not our palette. Outside this branch |
| `app/globals.css` | 21 hexes | they're the token **definitions** and the comments. It's where they belong |

### Arbitrary spacing and size values: the scale problem
Count in `src/app` + `src/components`:

| pattern | occurrences |
|---|---:|
| `p-[` | 230 |
| `gap-[` | 198 |
| `mt-[` | 174 |
| `text-[` | 152 |
| `py-[` | 90 |
| `w-[` | 81 |
| `leading-[` | 79 |
| `h-[` | 55 |
| `max-w-[` | 39 |
| `px-[` | 36 |
| `pb-[` | 29 |
| `pt-[` | 24 |
| `tracking-[` | 20 |
| `mb-[` | 8 |
| `bg-[` | 2 |
| **total** | **1,217** |

The brief asks for "zero arbitrary values". There are 1,217 call sites spread across 23
routes. Moving all of them to tokens in this branch is a massive mechanical replacement with
a high risk of breaking something through a misplaced sed, and most of them live in inner
pages this branch doesn't redesign. **I need a scope decision: §8 of
`VISUAL-DIRECTION.md`.**

---

## 4. Typographic state

### The old families: none in code
`Steelfish`, `Bronx` and `Futura` appear **28 times in `src/`, all in
comments**: the header of `globals.css` that documents why they left, and
the JSDoc of `Type.tsx`. Not a single executable reference. The PHASE 5 control grep
will come up positive as long as those comments exist, so they need to be rewritten
to name the real fonts. They also appear in 4 files in `docs/`.

### What's there, and works
Big Shoulders Display + Jost, both variable, both OFL, **self-hosted**
in `public/fonts/*.woff2` via `@font-face` in `globals.css` (35 KB and 27 KB). There's no
`<link>` to `fonts.googleapis`. The brief asks for `next/font/google`; what's there is
equivalent or better (zero external requests) but it isn't what the brief asks for. **§8.**

### The scale, and why the hierarchy doesn't read
Measured in `Type.tsx`:

| role | today | brief's target | jump |
|---|---|---|---|
| h1 hero | `--text-hero`, clamp(56→112px) | clamp(3.5rem, 9vw, 9rem) = 56→**144px** | +29% at the top |
| h2 section | `text-d5 md:text-d4 lg:text-d3` = 28→36→**46px** | clamp(2.5rem, 6vw, 5.5rem) = 40→**88px** | **+91%** |
| h3 | `text-d6 lg:text-d5` = 22→28px | — | |
| subhead | `--text-lead` clamp(16→18px) | clamp(1.0625rem, 1.6vw, 1.375rem) = 17→22px | +22% |

The h2 at 46px on a 1440 canvas is the concrete reason it "doesn't read as modern
SaaS". The h2/subhead ratio today is **46/18 = 2.6×**; the brief asks for ≥3.5×. With
88/22 = **4.0×**. The hierarchy gets fixed by raising the title, which is exactly
what the brief says.

### Three brief decisions that contradict already-approved decisions
They're in the code with Camila's request quoted verbatim. I won't change them without
asking.

| Axis | Approved before | The brief asks for |
|---|---|---|
| **Display weight** | `font-normal` (400). `Type.tsx:76`: "Camila: *regular, never a heavy weight*" | 600–800 |
| **Display tracking** | positive, 0.02→0.05em on an optical scale. `globals.css:265`: negative tracking "was the reason Camila rejected Steelfish: *it looks too cramped*" | −0.01em |
| **Case** | `uppercase` always on display, `Type.tsx:80` | the brief doesn't mention it |

At 144px, caps + weight 700 + negative tracking is a very different object from the one
that's approved. **§8.**

### Eyebrows: too many
Counted on the home page: `What's on`, `In the yard`, `Happy hour`, `How this place
works`, `Three places one gate`, `Eat`, `Drink`, `Rent`, `Planning a work event?`,
`Find us`, `Contact`, `Location`, `Parking`, `Follow`: **14**. The brief allows
3 at most.

---

## 5. State of the motion

What's in `shared/Motion.tsx`, and it's in better shape than the brief assumes:

| piece | state |
|---|---|
| `Reveal`, `StaggerGroup` + `RevealItem` | ✅ exist and are reusable |
| `MaskedLines` | ✅ **is already the masked line-by-line reveal** the brief asks for on headlines |
| `HeroFadeUp`, `Marquee`, `DragCarousel`, `CountUp` | ✅ |
| `useReducedMotion` | ✅ respected in all of them; the wall and marquee loops have a CSS fallback |
| `once: false` | ✅ **zero occurrences** |
| `italic` | 1 real violation (`app/sunset-bar/page.tsx:203`). The other 2 are `not-italic` on `<address>`, which is correct |
| Lenis | ✅ runs in `SmoothScroll.tsx`, shuts off entirely with reduced-motion |
| `.transition` | ✅ `PageTransition.tsx`: `bg-deep` curtain. Preserved; only the color is reviewed |

### What's missing
- **There is no `lib/motion.ts`.** The tokens live in `Motion.tsx` as `EASE_BRAND`,
  `DURATION`, `REVEAL_OFFSET`, `STAGGER`, `REVEAL_AMOUNT`.
- The values are **below** what the brief asks for:
  `DURATION.base 0.45` vs `dur.reveal 0.70` · `STAGGER 0.06` vs `0.08` ·
  `REVEAL_OFFSET 24` vs `dist.text 32` / `dist.media 48`.
  `EASE_BRAND [0.16, 1, 0.3, 1]` **already is** the brief's `ease.out`.
- `viewport` uses `{ once: true, amount: 0.2 }`, not the brief's
  `margin: "0px 0px -20% 0px"`.
- **Zero exits.** There isn't a single `useScroll` / `useTransform` in the repo.
- **A single mechanism for everything.** `Reveal` is fade + y for any content.
  There's no `clip-path` for images and no `ParallaxMedia`. It's exactly the anti-pattern
  the brief calls "the signature of an auto-generated website".
- The item that opens in the services section (agencefoudre mandate) doesn't exist
  on the home page yet.

---

## 6. What is NOT touched in this branch

Copy, routes, metadata, SEO, `content/`, `lib/seo.ts`, `lib/calendar.ts`,
`lib/nav.ts`, the 22 inner pages and the scripts in `scripts/`. No
component is deleted: if something is replaced it stays in the tree and noted here.
