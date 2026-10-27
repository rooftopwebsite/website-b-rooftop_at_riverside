# Before / after, section by section

Baseline: `main` at 9569ef6, captured with `design-audit/shoot.mjs`.
After: `redesign/light-tropical`, same setup, same script, same widths.

Screenshots in `baseline/` and `after/`. Assembled comparisons:
`COMPARE-home.png` (side by side, scaled) and `COMPARE-home-mobile.png`.

---

## The global number

| | before | after | target |
|---|---:|---:|---:|
| **dark** (`deep` + `deeper`) | **55.4%** | **24.5%** | 20–25% |
| **light** (`paper` + `bone`) | 40.3% | 63.6% | 70–75% |
| `cream-deep` | 0.5% | 1.2% | ≤ 5% |
| `sunset` | 0.6% | 1.9% | ≤ 5% |
| photo / map / untokenized | 2.3% | **7.9%** | — |
| **page height** (desktop) | 6,197px | 6,447px | — |

Measured per pixel with `surface-split.mjs`, not estimated.

⚠️ **Light ended up at 63.6% and not at 70-75%, and it's not that light is missing: it's that
there are now PHOTOS.** The "photo / map / untokenized" band went from 2.3% to 7.9%
because the hero has nine pieces of real material where there used to be twelve
empty boxes, and "Three doors" has the headline band. Light + photo =
71.5%. What really went down is the green: from 55.4 to 24.5.

✅ **Dark came in under the ceiling: 24.5%.** It was at 25.1% (one tenth
over) and was noted as debt. The "Three doors" photo band closed it:
the page grew 307px of light, photo-bearing material, so the same green
(Events, the footer and the `deep` square of "Night") weighs less on the total. Nothing
had to change color.

---

## Section by section

| # | Section | Before | After | Height |
|---|---|---|---|---|
| — | **Header** | fixed `deeper` bar, white reversed logo, nav in `paper/70` | **light**: `paper/85` with blur at the top, solid `paper` + `fog` rule on scroll. Full-color logo lockup, nav in `ink`/`muted`. The 30px `rgba(0,0,0,.5)` shadow is gone: on light it was a gray cloud | 64 / 76px |
| 1 | **Hero** | 100svh of solid `deep` · headline on the left at 112px · 12 gray boxes labeled "VIDEO" | **seventh shape**: centered stack on `bone`, headline at 130px with a `terra` accent, two CTAs, and a **fan of 9 cards** on an arc with 2 clips and 7 real photos. Scroll-linked exit | 900 → **851px** |
| 2 | **What's on** | 3 identical cards: same radius, same `shadow-card`, same width. Today's set apart **by painting itself green**. 3 "IMAGE MISSING" placeholders | **track of 4 cards** with native `scroll-snap`: photo on top, `bone` block with the brand book's greek key below. Today's is wider, not a different color. 3 of 4 with a real photo | 1,053 → **1,362px** |
| 3 | **Five businesses** | `Section tone="deep"`, **1,430px** of green with the diagonal staircase leaving ⅔ of the grid empty. The `01/02/03` in `river` on `deep` | **fourth shape**: sticky text on the left and **three colored squares with a greek-key texture** on the right: cream/orange/green = afternoon/sunset/night, that is, the three times of day in the order of the steps | 1,309 → **784px** |
| 4 | **Three doors** | already 1px rules (WeWork mandate met). But: eyebrow + headline accent + centered + icon in a rounded `bone` box | h2 from 46 → 86px, left-aligned, **without** the section eyebrow, **without** the accent (it was the third one and the brief allows two), loose icon with no box, rules in `fog`. And the **headline split across two lines with a photo band in the middle**: see below | 665 → **968px** |
| 5 | **transition** | plain wave border, `paper → deep` | **the horizon**: the wave with the sun-and-palm medallion from the Figma. The sun rises on entry and **spins 360° in 90s** | 50 → **132px** |
| 6 | **Events banner** | `deep/90` card with radius and `shadow-float` INSIDE a `Section tone="bone"`. 3 `paper/10` boxes with the same radius | **the home page's dark band**, full bleed. No radius or shadow. The 3 items become rows with rules. Background: the aerial of the whole yard. Scroll-linked exit | 569 → **619px** |
| 7 | **transition** | `deep → paper` border | same: it stays. It enters through the horizon and exits through the border: two pieces for two breaks | 50px |
| 8 | **Find us** | `paper` with **two `bg-deep` cards** of ~620px flanking the map. The section read dark without being dark | three columns as **lists**: 1px rule on top and content resting on the surface. **The map is the only object with a border** | 1,029 → **1,111px** |
| — | **Footer** | `bg-deep` | same. The footer is dark and that's not up for debate | — |
| — | **Page curtain** | plain `bg-deep` drop that rises | **draws a shape**: the flipped wave border as a sweeping edge. It closes the ronnsquare mandate that was pending | — |

---

## The band inserted into the "Three doors" headline

It's the last thing that went in, and it comes from a reference that showed up halfway through:
`design-audit/referencia-dftc/`, that is, **defoodtruckclub.nl**, a food
truck business. Its home page opens with `LET'S CHANGE` / the photo / `CATERING!`. The same gesture
had been noted in `MOODBOARD.md` for `IMG_2905` since phase 1 and had never
been built.

| | |
|---|---|
| **where** | the "Three doors" h2, split into `Not a restaurant.` + band + `Three of them` |
| **why there** | the copy was already split by a period, so the photo lands on a pause that already existed. And it was the only section on the home page with no material at all |
| **the photo** | `_RCZ8192` cropped to **4.95:1**: the top bar with people along it. It was chosen by measuring the CROP on a contact sheet at 4.7:1 of the 24 unused candidates, not by looking at the photos |
| **the crop** | `focus: 0.564`, six points below center. It removes the two Halloween cobwebs from the back wall, which put a date on an evergreen home page. The cost is that the faces on the top edge get cut off: in a 4.95:1 that's the format, the date isn't |
| **the height** | `--band-headline: clamp(5.5rem, 13vw, 12.5rem)` → 88px on mobile, 187px at 1440. It comes from the h2: `6vw` with LH 0.92 is a 5.5vw line, so 13vw is **2.4 lines** |
| **the measure** | `SectionHead` gained `measure="full"`. With the heading cut at `max-w-head` the band ended up 240px narrower than the three columns below, and two stacked edges with different measures read as a mistake. Now they share a grid |
| **the markup** | the two lines and the `<img>` go **inside the same `<h2>`**: same copy, same words, same order. An `<h2>` only accepts phrasing content, so the `RevealMedia` goes as a `<span>` and not as a `div` |
| **the motion** | a `clip-path` that opens **from the left**, in the direction in which the line it interrupts is read |
| **the weight** | 127 KB at source at 2080×420, 55 KB served as AVIF at 1920 |

---

## The greek-key pattern, recalibrated

Two changes, both measured, and one of them **corrects a diagnosis of mine that
was wrong**.

| | before | after |
|---|---|---|
| greek-key cell | 34px in the squares, 26px in What's on | **20px across the whole site** |
| `deep` opacity on `cream` | 15% | **19%** |
| `ink` opacity on `sunset` | 15% | **16%** |
| `cream` opacity on `deep` | 20% | **18%** |

`SELF-CRITIQUE.md` §2 said the pattern on the cream square was shouting and that its
opacity had to be LOWERED, based on the `deep`/`cream` pair measuring 9.44:1.
`design-audit/pattern.mjs` composites each pattern over its own field, converts them to
CIELAB and measures the ΔE: the cream square was the **softest** of the three (11.7
versus 13.4 and 15.7). 9.44:1 measures whether text reads, not how much a texture weighs.
The new opacities leave all three at ΔE 14.4-14.7, so the series
reads as a series.

What was actually shouting was the **size**: at 34px the greek key is a figure you count
one by one. Compared on screen at 34 / 26 / 20 / 15px, 20px is where it turns into
a field without ceasing to be recognizable; at 15px it stops being a greek key.

---

## Typography

| | before | after |
|---|---|---|
| h1 hero | clamp 56 → **112px**, weight 400, tracking +0.02em | clamp 56 → **144px**, weight **600**, tracking **0** |
| h2 section | `text-d5 md:text-d4 lg:text-d3` = 28 → 36 → **46px** | clamp 40 → **88px**, a single class |
| h3 | 22 → 28px (**the 22px violated the 24 floor**) | clamp **28** → 40px |
| subhead | 16 → 18px, color via `body/75` opacity | 17 → **22px**, opaque measured `muted` color |
| **h2 / subhead** | **2.6×**: below the 3.5× where the hierarchy reads | **4.0×** |
| eyebrow | 13px / 0.24em | 12px / 0.12em |
| `role="label"` | condensed at **18px**: violated the floor | geometric 15/16px |
| families | 2 (Big Shoulders + Jost), hand-written `@font-face` | the same, with `next/font/local`: **preload** + adjusted fallback metrics |
| small text scale | **9 sizes** with brackets: 11, 12, 13, 14, 15, 16, 17, 20, 24px | 4 tokens: `caption` 12 · `micro` 13 · `data` 15 · `base` 16 |
| tracking scale | **7 values** with brackets, from 0.01 to 0.14em | 3 role tokens: `eyebrow` 0.12 · `label` 0.08 · `cta` 0.06 |

---

## Weight and assets

| | before | after |
|---|---:|---:|
| photos on the home page | 1 (`event-a.jpg`, blurred) | **13** derivatives + 2 clips |
| client delivery | — | 681 MB of originals → **1.9 MB** of derivatives (−99.4%) |
| brand art from the Figma | the border + the tile | + **greek keys** (148 KB → 6 KB) and **horizon** (75 KB → 1.8 KB inline + 56 KB cached) |
| emitted CSS | 66.8 KB | 72.8 KB |

---

## Arbitrary values, within the agreed scope

| category | before | after |
|---|---:|---:|
| **spacing in px** | ~200 | **0** |
| pattern opacities | — | 3 · measured with `pattern.mjs`, documented at the call site |
| typography (`text`/`leading`) | 65 | 11 · they remain only in `Type.tsx`, which is where the system is DEFINED |
| `tracking` | 14 | **0** |
| relative units (`vw`, `svh`, `%`, `ch`, `fr`, `minmax`) | — | 27 · there's no scale that covers them |
| other scales (`z`, `aspect`, `rounded`, `blur`, `scale`, `transition`) | — | 19 |
| state selectors (`data-[…]`) | — | 5 · **they aren't values**, they're variants |
| **total** | **290** | **82** |

The spacing conversion was verified **pixel by pixel**: same page height and
zero differences outside the three zones with their own motion (the clips, the
spinning sun, Next's dev badge and the fixed header, which in a full-page screenshot
shows up where the viewport was).

---

## Verification

| check | status |
|---|---|
| `npx tsc --noEmit` | ✅ |
| `npx next build` | ✅ |
| `npm run a11y`: 20 pages × 2 widths | ✅ **0 AA violations** |
| `npm run check:motion`: identical layout without motion, 6 routes | ✅ |
| `npm run check:surfaces`: never two colored sections in a row | ✅ |
| `npm run check:tokens`: `globals.css` ≡ `brand.ts` | ✅ |
| `npm run check:contrast`: 35 pairs measured | ✅ |
| `npm run check:css`: theme utilities emitted | ✅ |
| horizontal overflow at 1440 / 1344 / 390 | ✅ none |
