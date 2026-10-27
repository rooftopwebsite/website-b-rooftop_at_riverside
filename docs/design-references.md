# Design references — what gets measured, what gets taken, what gets discarded

Camila sent seven references over time. This document exists so they don't get
averaged: **a reference isn't copied whole, a mechanism is pulled from it**. Each
row below says what was measured with the browser (not from memory) and what was
adopted.

Measurement date: September 8, 2026.
Updated on September 9 after the home page redesign, which added
superside.com as the form reference and retired two gestures.

---

## 1. What the browser measured

### visitors.now — the skin

It came with its own `design.md`. Pills, soft shadows, centered stack, color
field below the hero.

⚠️ **Nothing of it is left on the site.** It was the reference for the first language
of `Button`, `Header` and `Hero`, and it fell away entirely when Camila set Showdown
Social first and superside afterward: neither of the two uses pills or soft
shadows. It stays documented because it explains why the site went through a stage
that can't be seen today.

Forced adaptation, already documented in `Button.tsx`: visitors.now puts **white**
text on its lavender. Sunset Orange is a mid tone and white on top of it
gives 2.54:1. **Text on orange goes in black** (8.26:1).

### ronnsquare.fr — the motion

| Element | Measured |
|---|---|
| `.brand-clone` | `position: fixed`, `z-index: 220`, 518×356, contains an SVG |
| `.transition` | `position: fixed`, `z-index: 400`, full viewport, draws a brand shape |
| `.site-bg` | `position: fixed`, full viewport |

Two gestures were taken from it: a brand element that follows the scroll and a
page transition that draws a brand shape instead of a plain curtain.

⚠️ **Nothing is left of the first one.** `BrandTrail` was retired in the home page
redesign at Camila's request. From ronnsquare **only the transition** survives.

> ⚠️ In layout, ronnsquare is almost the OPPOSITE of visitors.now: warm cream
> background, large black type aligned left, dark sharp-cornered
> buttons. The motion was taken, not the mockup. See "The conflict".

### agencefoudre.com — how the services are told one after another

| Element | Measured |
|---|---|
| Section | `position: relative`, **3600px** with a 900px window → 4 screens for 3 items |
| Both columns | `position: sticky; top: 0` |
| Active item | opens its block with `min-height`, `cubic-bezier(.23, 1, .32, 1)`, 0.8s |
| Active title | 46px, weight 900, in the brand pink; the inactive ones dimmed |

**RETIRED.** It was adopted in `PinnedList` for "how this place works" and Camila
swapped it for the for-living.it staircase (below). The module was deleted.

What it left as a lesson, which holds for the next time the temptation shows up:
a multi-screen journey for three short paragraphs is expensive. At
42vh per item —already cut down from the reference's 133— the section took
2,226px, almost a third of the home page's scroll.

### for-living.it — the staircase steps

The "We handle all the complexity" block. Four steps descending diagonally:
each one a step lower and further right, with a rule that runs down the
left of the block and turns horizontal to the start of the next one.

| Element | Measured |
|---|---|
| Steps | 4, all open and visible at once |
| Offset | each step starts where the previous one's horizontal rule ends |
| Block | faint number + title + gray description, no box or fill |
| Rule | 1px, L-shaped: vertical along the left of the block, horizontal at the foot |

Adopted in `StepStair` → `HowThisPlaceWorks`. The geometry comes from an N×N
grid with step *i* in cell *(row i, column i)*: the diagonal falls into place on its own and
the cell width IS the distance to the next one, so the horizontal rule
ends exactly at its start without a hand-calculated number.

Two deviations: there are three steps and not four —those are the ones there are—, and each one carries its
data tags below the description, which the reference doesn't have.

### designproject.io

| Measured | Value |
|---|---|
| Dominant container | **1280px** (15 occurrences) |
| Backgrounds | alternating `#f8f8f8` · `#e9f6fd` · `#162825` (dark, 3 times) |
| Section headings | 48px, mostly **centered** |
| Closing CTA | 72px |
| `sticky` elements | 0 |

### stripe.com/es-us

| Measured | Value |
|---|---|
| Dominant container | **1232px** (71 occurrences) |
| Backgrounds | white almost everywhere; **a single** dark band `#0d1738` |
| Section headings | 32px, **left-aligned** |
| Hero | 44px · a single centered moment at 56px |

### wework.com and superside.com

From the screenshots Camila sent:

- White / off-white background, black type, hierarchy by size and weight.
- Rows of 3–4 with **small icon + small-caps micro-label + title +
  body**, separated by 1px rules, not by heavy cards.
- **A stretch of the headline in italics from a different family**
  ("brands that *refuse to compromise*", "a *coworking space*").
- Two-column editorial splits: framing text on one side, a list of
  links or media on the other.

---

## 2. The common thread

Five of the seven are the same thing: **white background, black text, structure through
thin rules, color as punctuation and a single dark band per page.** That
is already the project's color law; the references confirm it instead of
contradicting it.

Measured coincidences that count as a decision:

- **1280px container.** Unanimous across the house's five repos, Showdown
  Social and designproject.io; Stripe uses 1232. Our token stays.
- **A single dark surface per page.** Stripe uses one; designproject
  three on a very long page. Our `deep` in the footer and in a handful of
  sections is well calibrated.
- **Section headings aligned left and modest** (Stripe 32px),
  with **one** large centered moment per page. It's what the home page already does:
  centered hero, the rest aligned left.

## 3. The conflict, without averaging

visitors.now (pills, shadows, centered, soft) and ronnsquare.fr (warm
cream, large black on the left, sharp corners) pull in opposite directions.
The second one looks quite a lot like the design Camila **rejected**.

Reading: what she liked about ronnsquare was the **motion**, not the mockup —
she said it in those words.

**RESOLVED.** The conflict closed on its own: the visitors.now skin fell away
entirely and only the page transition remained from ronnsquare. The form is
now set by superside.com, which Camila explicitly chose for the hero, the
cards and the two new blocks.

---

## 4. What was implemented from all this

Updated on September 9, 2026, after the home page redesign.

| Gesture | Where | Reference |
|---|---|---|
| Page transition | `PageTransition` | ronnsquare.fr |
| Diagonal staircase steps with an L-shaped rule | `StepStair` → `HowThisPlaceWorks` | for-living.it |
| Typographic accent inside the headline | `Accent`, `MaskedLines` | wework / superside |
| Rows of icon + small caps + title, with rules | `ThreeDoors` | wework / superside |
| Hero with headline + one sentence + one CTA + wall | `Hero`, `VideoWall` | superside |
| Cards with photo on top and color block below | `WhatsOn` | superside |
| Dark card banner with inset image | `EventsBanner` | superside · "Our global team" |

### What was retired, and why

**`BrandTrail` — the brand element that followed the scroll.** It was what was
adopted from ronnsquare.fr along with the page transition. Camila had it
removed in the redesign: "let's remove the brand element that follows the scroll".
From ronnsquare **only `PageTransition`** remains.

**The pills and soft shadows from visitors.now.** They had gone earlier,
when Camila set Showdown Social as the top reference: none of the
four references she chose uses pills. See the note in `Button.tsx`.

### New references that came in with the redesign

Camila added **superside.com** as the form reference for the home page, and from it
came four of the seven rows in the table above. Two specific pages
that were measured with the browser:

- `superside.com/our-creative-talent`, "OUR GLOBAL TEAM" block → `EventsBanner`
- the `superside.com` hero → `Hero` + `VideoWall`

### About the headline accent

⚠️ It was applied in **color and not in italics**, which is where it departs from the
reference. Camila: "use a color change, not italics, because the brand doesn't use
italics". Superside does it with an italic serif from another family; here there's no
serif and a fourth family wasn't added for one accent.

And it's **two colors depending on the surface**, not one: `sunset` on light gives
2.48:1 and doesn't even pass the 3:1 for large text. On light it's `terra` (7.43:1),
on `deep` it's `sunset` (4.26:1).

### What still hasn't arrived

Camila wrote "this is another sample page of the style" and neither a URL
nor an image ever arrived. Still missing.
