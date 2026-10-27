# Visual direction — `redesign/light-tropical`

Rooftop at Riverside home page. What follows assumes you have read `AUDIT.md` (what is
there today and what it measures) and `MOODBOARD.md` (what is taken from each reference).

> ## ⚠️ WHAT CHANGED AFTER THIS WAS APPROVED
>
> This document is the direction that was approved at STOP 1. **The concept, the
> surface system and the type scale still stand as they are.** What changed are
> four shapes, all at Camila's later request with new references, and one decision
> of mine in the final self-critique. It is detailed in
> [`COMPARISON.md`](COMPARISON.md), but you should not read sections §5 and §6
> here without this list:
>
> | § | what this doc says | what was built |
> |---|---|---|
> | 5.1 | two-column hero, wall with labeled gaps | **centered stack** with a fan of 9 cards over an arc, with real material |
> | 5.2 | What's on in an asymmetric 2:1:1 grid | **track of 4 cards** with `scroll-snap`, photo on top and color block below |
> | 5.3 | Five businesses keeps the diagonal staircase with a photo in the gap | **three color squares with greek-key texture** — the three hours of the day |
> | 2 | the wave border at both cuts of Events banner | **the horizon** (wave + sun medallion) at the entrance, the border at the exit |
> | 6 | the memorable moment is the headline alone | it is still the headline, but **it is no longer alone**: 36 photos and 5 videos arrived |
>
> And two things this doc says that need correcting:
>
> - **§8.4 says the wall stays as labeled gaps.** That no longer applies:
>   the `public/multimedia/` delivery replaced the twelve gaps with 2 clips and 7
>   real photos. See [`docs/media.md`](../../docs/media.md).
> - **§2 projected ~23 % dark.** Measured at the end: **25.1 %**. It is pushed up by the
>   third square of Five businesses.

---

## 1. The concept

**The site has to be the hour, not the place.**

The bar is called Sunset Bar. The trucks open at 4 and close at 8. Happy hour is
from 3 to 6 in the afternoon. On Sunday it opens at 11 in the morning. This
place lives by day and at sunset, and today's site —dark green across more than
half of its surface— is selling the midnight of a place that at midnight is
closed four days a week.

Coming in has to feel like stepping off the stairs onto the roof at six in the
evening in Florida: the light washes everything, the air is white, and green shows
up only where there is shade. That is what makes it Rooftop and not just any
venue: it is not a dark bar with lights, it is an **open-air terrace against the light**.
The brand green does not disappear — it goes from being the floor to being the ink. And orange
stops being decoration: it is the sun, so it appears once and where you need to press.

---

## 2. Surface system

The full run of the home page, in order. Each row is a real surface.

| # | Section | Background | Text | Image treatment |
|---|---|---|---|---|
| — | Header | `deeper` → **to review in PHASE 4** | `paper` | — |
| 1 | **Hero** | `paper` (text) + `cream` (wall) | `ink` · headline `deep` | **No photography.** The wall keeps its labeled gaps, moved to a light key: `paper` fill, 1px rule in `fog`, label in `muted`. It keeps drifting vertically |
| 2 | **What's on** | `paper` | `ink` · subheads `muted` | **This is where the home page's photographic weight lives.** Three photos of different sizes: today's at double width, the other two stacked beside it. No card container: the photo sits directly on the surface |
| 3 | **How this place works** | `cream` | `ink` | A photo in the gap the diagonal staircase leaves empty today |
| 4 | **Three doors** | `paper` | `ink` | **None.** It is the rules section; its job is to breathe between two blocks with images |
| 5 | wave border | `paper` → `deep` | — | The real art from the Figma. It marks the only light→dark jump |
| 6 | **Events banner** | **`deep`, full bleed** | `paper` · `sunset` accent | Full-bleed background photo with a **light panel on top** holding the text — the Casa Coco gesture, not a green veil over the photo |
| 7 | wave border | `deep` → `paper` | — | Closes the cut |
| 8 | **Find us** | `paper` | `ink` | The map is the only piece with visual weight. The two info cards that are green today become light with a rule |
| — | Footer | `deep` | `paper` | — |

### Why the dark cut goes in Events and not where it is today

The brief allows at most two dark sections and asks that they be a marked cut. Today
the dark is spread over five places and none of them is a cut: it is the background.

Events banner is the right candidate for three concrete reasons. It is the vertical
that brings in the most revenue, so it deserves the page's only strong emphasis. It measures 569px —
a band, not a slab. And its Superside mandate («OUR GLOBAL TEAM», the dark card
with an inset image) already called for dark; what changes is that it stops being a dark
card *inside* a light section —which is what makes the whole section read dark today
without being dark— and becomes the section.

`IMG_2909` from the moodboard is the same move: an entirely cream page, **one**
saturated slab, and the rest quiet.

### Projected split

| surface | today (measured) | projected | target |
|---|---:|---:|---:|
| light (`paper` + `cream`) | **40.3 %** | ~76 % | 70–75 % |
| dark (`deep`) | **55.4 %** | ~23 % | 20–25 % |
| `cream-deep` | 0.5 % | < 1 % | ≤ 5 % |
| `sunset` | 0.6 % | < 2 % | ≤ 5 % |

It gets measured again with `surface-split.mjs` on the `after/` captures in PHASE 5.
The projection comes from the baseline heights, not from an eyeball estimate: two
dark zones (Events ~620px + footer ~700px) over a run of ~5,800px.

---

## 3. Surfaces and text — the tokens, with measured contrast

Measured with `design-audit/measure.mjs` (WCAG 2.1, relative luminance). No
number from memory.

### Surfaces
| Token | Hex | Where it comes from | Use |
|---|---|---|---|
| `paper` | `#FFFFFF` | the brief | Main base |
| `cream` | **`#FAF6EA`** | `#FDF0B4` desaturated. **1.08:1 against `paper`** — the cut is visible, and it is the same step as the `paper`/`bone` pair that already exists (1.10:1) | Second light surface |
| `cream-deep` | `#FDF0B4` | the brand book | Pills and buttons on dark. Never a large background |
| `deep` | `#014545` | the brand book | The Events band + the footer |
| `sunset` | `#F58521` | the brand book | The primary CTA, with **black** text |

> A measured note worth making: `#FFFFFF` against the current `paper` `#FDFCF7` gives
> **1.03:1** — imperceptible. Switching the base to pure white **is not** what
> lightens the site. What lightens it is taking `deep` from 55 % to 23 % and raising the
> type scale. The base token is nearly irrelevant; I say this so the
> discussion does not go there.

### Text
| Situation | Token | Hex | Measured ratio |
|---|---|---|---|
| Titles and body on `paper` | `ink` | `#0A1F1E` | **17.11:1** |
| same on `cream` | `ink` | `#0A1F1E` | **15.83:1** |
| **Subheads and secondary text** | `muted` | **`#487270`** | **5.36:1** on `paper` · **4.96:1** on `cream` · **4.67:1** on `cream-deep` |
| On `deep` | `paper` / `cream-deep` | | **10.83:1** · **9.44:1** |
| On `sunset` and on `river` | black `ink` | `#000000` | **8.26:1** · **8.40:1** |
| Headline accent on light | `terra` | `#A62000` | **7.43:1** on `paper` · **6.87:1** on `cream` |
| Headline accent on `deep` | `sunset` | `#F58521` | **4.26:1** — passes for display, **not** for body |

**`#487270` is the value chosen on purpose, not the brief's `#3F6664`.** I swept
upward from there looking for the lightest one that still passes 4.5:1 on all three
light surfaces: `#4B7674` fails on `cream-deep` (4.42:1) and `#487270` is the
first that passes all three. It is the lightest possible subhead without losing AA, which is
what the hierarchy jump needs. `#3F6664` also passes but at 6.37:1 —
too close to the headline to read as a second level.

### Hard constraints, verified
- `sunset` as text on light: **2.54:1** on `paper`, **2.35:1** on
  `cream`. Fails everything, at every size. That is why the headline accent comes in two
  colors depending on the surface.
- `river` `#0EB6B8` as text on light: **2.50:1**. Fails. It stays decorative.
- White on `sunset`: **2.54:1**. Fails. The CTA carries black text.

The full table goes to `design-audit/CONTRAST.md` in PHASE 2.

---

## 4. Type scale

Two families, the ones already in place: **Big Shoulders Display** (condensed, display) and
**Jost** (geometric, everything else). No third one comes in.

| Role | Family | Size | line-height | Notes |
|---|---|---|---|---|
| `display` — hero h1 | Big Shoulders **600** | `clamp(3.5rem, 9vw, 9rem)` → **56→144px** | 0.88 | `letter-spacing: 0`. Today: weight 400, cap 112px, tracking +0.02em |
| section `h2` | Big Shoulders **600** | `clamp(2.5rem, 6vw, 5.5rem)` → **40→88px** | 0.92 | `letter-spacing: 0`. Today 28→46px. **+91 %** |
| `h3` | Big Shoulders **600** | `clamp(1.75rem, 2.6vw, 2.5rem)` → **28→40px** | 1.0 | Today 22→28px. The 22px on mobile **violates** the 24px floor |
| subhead | Jost 300 | `clamp(1.0625rem, 1.6vw, 1.375rem)` → **17→22px** | 1.55 | `max-width: 60ch`, color `muted` |
| body | Jost 400 | `1rem`–`1.125rem` | 1.6 | 75 characters max |
| eyebrow | Jost 500, uppercase | `0.75rem` = 12px | — | `letter-spacing: 0.12em` |

**The jump is the point of the whole redesign.** Today h2/subhead = 46/18 = **2.6×**,
below the 3.5× the brief asks for, which is why the block does not read as hierarchical. With
88/22 = **4.0×**.

### Pairing rules, applied
- **Big Shoulders never below 24px.** There are two violations today: the h3 on
  mobile (22px) and `role="label"` in `Type.tsx`, which is `--text-d7` = **18px in
  font-display** and is used for the footer's column labels. The labels move
  to Jost 500 uppercase.
- The subhead never in Big Shoulders. `--text-lead` is already Jost; that is respected.
- The headline accent goes in **color, never in italics**, and **in at most 2
  headlines** on the home page: the hero h1 (`sunset` if it sits on dark, `terra`
  if it sits on light) and the Events banner h2 (`sunset` on `deep`). The other
  five headlines go in a single color.
- **Eyebrows: from 14 to 3.** The ones that stay are those that truly classify content:
  `Tonight` / the day on the What's on cards, `Eat` / `Drink` / `Rent` in Three
  doors (they are the three business units, a real classification), and the
  data labels in Find us. The 11 that only announce the section below are dropped
  — `What's on`, `How this place works`, `Three places one gate`, `Find us`,
  `Planning a work event?` and the rest. An eyebrow above every h2 is the template
  chrome the brief explicitly calls out.

---

## 5. Wireframes — the three sections that change the most

### 5.1 Hero

```
BEFORE                                 AFTER
┌──────────────────────────────┐       ┌──────────────────────────────┐
│▓▓▓▓▓▓▓▓ header deeper ▓▓▓▓▓▓▓│       │      header (to review)      │
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░┌──┐┌──┐┌──│       │ paper           ░┌──┐┌──┐┌───│
│▓▓▓▓ deep ▓▓▓▓▓▓▓▓░│▒▒││▒▒││▒▒│       │                 ░│  ││vi││de │
│▓▓ 🚚               ░│vi││de││o│       │  BONITA         ░│vi││  ││   │
│▓▓ BONITA COMES   ░│▒▒││▒▒││▒▒│       │  COMES          ░└──┘└──┘└───│
│▓▓ TOGETHER       ░└──┘└──┘└──│       │  TOGETHER       ░┌──┐┌──┐┌───│
│▓▓ Rooftop bar.…  ░┌──┐┌──┐┌──│       │  ▔▔▔▔▔▔▔▔▔ 144px░│  ││  ││vi │
│▓▓ [ CTA ]        ░│▒▒││▒▒││▒▒│       │                 ░└──┘└──┘└───│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░│▒▒││▒▒││▒▒│       │  Rooftop bar.   ░┌──┐┌──┐┌───│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░└──┘└──┘└──│       │  Four kitchens. ░│vi││  ││   │
│▓▓▓▓ 100svh ▓▓▓▓▓░┌──┐┌──┐┌──│       │  Walk in.       ░└──┘└──┘└───│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░│▒▒││▒▒││▒▒│       │                 ░┌──┐┌──┐┌───│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░└──┘└──┘└──│       │  [ What's on → ]░│  ││vi││   │
└──────────────────────────────┘       └──────────────────────────────┘
 100 % deep · gaps on green             paper │ cream · gaps in light key
                                        the headline carries the WHOLE hero
```

The two-column geometry is kept: it is the fifth version and it came from Camila's
hand sketch. What gets inverted is the **luminosity**.

**The 12 gaps stay labeled, by a decision already made** — the rule that a
silent gap gets published without anyone noticing still stands. What changes is the
key: today they are `bg-paper/12` on green and read as tonal panels; on
light they need drawing, so they become a `paper` fill with a 1px rule in `fog`
on a `cream` column, and the label in `muted` (5.36:1 measured). The vertical loop
is not touched. Read this way, the wall is a **wireframe field** drifting slowly:
quiet, honest about what is missing, and not pretending there is content.

**A consequence that has to be said out loud:** without photography, the hero is carried
**entirely by the typography**. That raises the stakes for the headline — it is the only large
thing on the first screen— and makes the weight 600 and 144px decision
the redesign, not a tweak. If in the pilot the headline does not hold the
screen on its own, the problem will not be the size: it will be that the photo is missing.

On **mobile** it stays stacked —text on top, wall below at full bleed— because two columns
at 390px would give 170px each.

### 5.2 What's on

```
BEFORE                                 AFTER
┌──────────────────────────────┐       ┌──────────────────────────────┐
│ THIS WEEK IN THE YARD   46px │       │ THIS WEEK                    │
│                              │       │ IN THE YARD            88px  │
│ ┌────────┐┌────────┐┌───────┐│       │ ┌───────────────┐┌──────────┐│
│ │ IMAGE  ││ IMAGE  ││ IMAGE ││       │ │███████████████││██████████││
│ │MISSING ││MISSING ││MISSING││       │ │███ photo of ██││█ photo ██││
│ ├────────┤├────────┤├───────┤│       │ │███  TODAY  ███│└──────────┘│
│ │▓TONIGHT││WEDNESDAY│WEDNESD││       │ │███████████████│ WEDNESDAY  │
│ │▓ROSS   ││WOOFTOP ││BINGO  ││       │ │███████████████│ Wooftop W. │
│ │▓BROWN  ││WEDNESD.││NIGHT  ││       │ └───────────────┘ 3–8 PM     │
│ │▓6–8 PM ││3–8 PM  ││7–9 PM ││       │  TONIGHT         ────────────│
│ └────────┘└────────┘└───────┘│       │  ROSS BROWN     ┌──────────┐ │
│  ↑ same box, same radius,    │       │  Live music…    │██████████│ │
│    same shadow, ×3           │       │  6–8 PM         └──────────┘ │
│  today's stands out          │       │  ───────────────  BINGO NIGHT│
│    by being painted green    │       │                   7–9 PM     │
└──────────────────────────────┘       └──────────────────────────────┘
```

The card container is dropped: no radius, no `shadow-card`. The photo
sits on the surface and a 1px rule separates the text. **Today's item
stands out by size, not by color** — it takes double the width and the other two
stack beside it. It is the asymmetry of `IMG_2906`, and it is what the brief asks for when
it says hierarchy is made by size, weight and width.

### 5.3 How this place works

```
BEFORE — deep, 1,309px                 AFTER — cream, ~850px
┌──────────────────────────────┐       ┌──────────────────────────────┐
│▓▓▓▓▓▓▓▓▓▓▓▓ deep ▓▓▓▓▓▓▓▓▓▓▓▓│       │ FIVE BUSINESSES,             │
│▓ HOW THIS PLACE WORKS ▓▓▓▓▓▓▓│       │ ONE SET OF STAIRS.     88px  │
│▓ FIVE BUSINESSES,  46px ▓▓▓▓▓│       │ It catches people out…       │
│▓ ONE SET OF STAIRS. ▓▓▓▓▓▓▓▓▓│       │                              │
│▓ It catches people out…▓▓▓▓▓▓│       │ ┌01┐ ORDER AT WHICHEVER…     │
│▓                      ▓▓▓▓▓▓▓│       │ │  │ Four trucks park…       │
│▓ 01 ORDER AT WHICHEVER…▓▓▓▓▓▓│       │ │  └───┐                     │
│▓ │ Four trucks park…  ▓▓▓▓▓▓▓│       │ │┌───────────┐ ┌02┐ GET YOUR │
│▓ │ ▓▓▓▓ empty ▓▓▓▓▓▓▓▓▓▓▓▓▓▓│       │ ││███████████│ │  │ DRINKS…  │
│▓ └──────┐ 02 GET YOUR…▓▓▓▓▓▓▓│       │ ││█ photo ███│ │  │ The Sunset│
│▓ ▓▓▓▓▓▓ │ │ The Sunset…▓▓▓▓▓▓│       │ ││███ real ██│ └──┴───┐      │
│▓ ▓▓ empty │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│       │ │└───────────┘   ┌03┐ STAY   │
│▓ ▓▓▓▓▓▓▓▓ └──────┐ 03 STAY…▓▓│       │ │                │  │ FOR…   │
│▓ ▓▓▓ empty ▓▓▓▓▓▓ │ │ Live…▓▓│       │ └────────────────┴──┘        │
│▓ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│       │ See how the yard is laid out→│
│▓ See how the yard…  ▓▓▓▓▓▓▓▓▓│       └──────────────────────────────┘
└──────────────────────────────┘        cream · the gap is filled by a photo
 ~2/3 of the grid is empty green
```

The staircase is kept —it is the third shape, it came from for-living.it, and the
sequence really is a real sequence, so the `01/02/03` are justified. What
changes: it moves to `cream`, the numbers become pills (`IMG_2909`) instead of the
illegible teal on green, and **the empty triangle stops being dead green and
gets filled with a photo of the yard**. The section gives ~450px back to the page.

---

## 6. The memorable moment

**The hero headline, and nothing else.**

With the wall staying as labeled gaps, the hero has no second large
piece. So the bet is a single one and it is purely typographic: **«BONITA COMES
TOGETHER» at 144px, weight 600, in the brand green on clean paper**, taking up the
left half of the first screen. It is the only large thing there, and that is why
it is what gets remembered.

Being the only gesture is not a limitation: it is the discipline the brief asks for.
One thing at full strength and everything else quiet reads better than five things at 70 %.

The entrance sequence, once only and on load: the two lines rise with a mask
—`MaskedLines`, which already exists— at `dur.hero`, and the wall comes in afterwards with a short
fade, no displacement, so it does not compete. `dur.hero`, a single `stagger`.
After that, the rest of the page **follows along quietly**: one mechanism per type of
content and silence in between. Superside is the reference for restraint: it animates
little, at just the right moments.

What the hero does NOT do, on purpose: no text over image anywhere on the home page,
no veil, no parallax, and the logo does not grow — the truck isotype stays
at 58px where it is.

---

## 7. Token architecture — the problem that has to be solved before coding

The brief says «Everything in `lib/brand.ts` + `tailwind.config.ts`» and «no hex outside
`lib/brand.ts`». **`tailwind.config.ts` does not exist**: the project is Tailwind v4,
where the theme is CSS-first and lives in the `@theme` block of `globals.css`. And you cannot
import a `.ts` inside `@theme`.

Today there are **three color sources that do not match** (see `AUDIT.md` §3), and the
consequence is that the ratios in `docs/contrast-audit.md` are calculated against
a palette the site does not paint.

**Proposal:** `globals.css @theme` is the source that renders and therefore the
only definition of the hexes. `lib/brand.ts` stops declaring `COLORS` with its own
values and instead re-exports the names with their hex plus the usage **rules**
(`COLOR_RULES`), which is what the components consult. And a
`scripts/check-tokens.mjs` is added that reads both files and **fails if they diverge**, plus the
fix to `scripts/contrast.mjs` so it reads the real palette instead of having it
written by hand. That way «a single place» becomes verifiable instead of aspirational.

If you prefer the opposite —`brand.ts` as the source and `globals.css` generated— that
can be done too, with a script that emits the `@theme`. It is more machinery; I mention it in case the
requirement that «the hex lives in `brand.ts`» is literal.

---

## 8. Decisions made — resolved with Camila before coding

Four points where the brief clashed with an already approved decision or where the
scope was not bounded. They are closed as follows:

**1. Display: weight 600 and `letter-spacing: 0`.** A midpoint between the brief's 600–800
and the approved `font-normal`. It gains the stem body that a condensed face at 400 lacks
at 144px, without the tightness between letters that got Steelfish rejected. The
tracking does **not** go negative: it stays at 0 for display, which is the step that
respects the «it looks very cramped» note without leaving the headline as open as it is today
(+0.02→0.05em). Uppercase is kept: the brief does not dispute it.

Mechanical consequence: the seven `--text-d*--letter-spacing` of the optical scale
go away, because their purpose was to compensate for a global negative tracking that no longer exists.

**2. Fonts: `next/font/local`.** Neither what is there nor exactly what the
brief asks for, but what solves the real problem —what happens when someone opens the site
without having the fonts, which is the case for every visitor—. Verified on the
served HTML: today there is **no `<link rel="preload" as="font">`** and **no fallback
metrics**, so the font only starts downloading after HTML → CSS
(three hops) and when it arrives the text jumps.

`next/font/local` pointing at the same `woff2` files gives the two things that are missing:
`preload: true` by default and `adjustFontFallback: 'Arial'`, which generates adjusted
metrics so the text box barely changes on swap — decisive with two
headline lines at 144px. And it keeps the hand-made subset, smaller than what
the Google API returns, with no external request at runtime **or at build**.

Verified in `node_modules/next/dist/docs/01-app/03-api-reference/02-components/font.md`:
`src`, `display`, `preload`, `fallback`, `adjustFontFallback`, `variable` and
`declarations` are all available in `next/font/local`. The `.woff2` files move
from `public/fonts/` to `src/app/fonts/` so they are bundled only once with a
hashed name instead of also being served from `public/`.

**3. Scope of the arbitrary values: home page + global components.** It is the
surface this branch redesigns. The 22 inner pages stay inventoried in
`AUDIT.md` §3 for a branch of their own, and the PHASE 5 control grep is run limited
to that surface, saying so.

**4. The hero wall: the gaps stay labeled.** The photos are not loaded. The
original rule still stands —a silent gap gets published without anyone noticing—
so the wall moves to a light key and keeps marking what is missing. **The photographic
weight moves to What's on** (three photos of different sizes) **and to How this
place works** (one photo in the staircase gap), which are the two sections
where there are real assets to use.

---

## 9. Self-critique

**What looked like any other client, and what I replaced it with.**

**One.** My first hero was the automatic reflex: full-bleed photo, dark veil
on top, big headline centered over the photo. It is the default hero, everybody
does it, and on top of that the site already tried it and rejected it («it was Showdown, not
Superside»). I replaced it with the opposite: **zero text over image anywhere on the
home page**. The headline lives on clean paper, so the contrast is measurable
—17.11:1— instead of depending on the opacity of a veil over a photo I have not
seen yet. With the decision to leave the wall as gaps, this became more radical than
I had planned: the hero has no image at all and is held up only by the
typography. It is riskier and it is more disciplined.

**Two.** The setup «cream base + condensed uppercase display + one slab of
color + a row of three photos» is one step away from the generic cluster of cream with a
high-contrast serif and a terracotta accent. What sets it apart is an unusual and
deliberate decision: **the text color is not a gray or a near-black, it is the brand
green** (`#0A1F1E`, which is `deep` taken to near-black). The whole body of the site
is written in the brand color. That is already in the repo and it is the best thing it
has; I do not touch it, I make use of it. And I broke the row of three equals in What's on: 2:1:1
asymmetric, no boxes.

**Three.** I had put an eyebrow above every h2 «to classify». There are 14 on the
home page and the brief allows 3. I counted them and they did not classify: they announced. The ones that stay are
those that are real data —the day of each event, the three business units, the contact
labels— and the 11 that only repeated in small caps the title that came
below are dropped.

**What still worries me, in order of risk.**

**The hero.** Twelve empty boxes labeled «video» worked on green
because the translucent fill turned them into tonal panels. On light they have to be
drawn with a rule, and a rule draws **more** attention to the gap, not
less. It is the real risk of this branch and I cannot solve it with design: without the
clips, the first screen is a grand headline next to a grid of empty
boxes. I am taking it to the PHASE 4 pilot precisely so it can be seen before
implementing the other five sections, and if it does not work there, the way out is to ask the
client for the clips or revisit the wall decision — not to dress it up.

**The border.** It appears twice in the new run, both times around Events
banner. With the light home page there is only one strong surface jump, so both
borders serve the same section — and two appearances of the same brand piece at
50px tall each can read as mannerism. If it looks that way in the pilot, the
exit one goes and the cut closes clean.
