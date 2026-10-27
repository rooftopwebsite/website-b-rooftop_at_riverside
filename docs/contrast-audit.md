# Contrast audit — Rooftop at Riverside

> ## ⚠️ SUPERSEDED — the ratios in this file are NOT the site's
>
> **The current table is [`design-audit/CONTRAST.md`](../design-audit/CONTRAST.md)**,
> which `npm run contrast` generates by reading the palette from `src/app/globals.css`.
>
> The numbers below are calculated against a palette the site stopped
> painting. `scripts/contrast.mjs` had the hexes **copied by hand** and went
> stale when the `@theme` block changed: it kept measuring `paper` as `#FFFFFF`
> and `ink` as `#000000` while the site was painting `#FDFCF7` and `#0A1F1E`. The build
> passed, so nobody noticed. Found in the audit of
> `redesign/light-tropical` — see [`design-audit/AUDIT.md`](../design-audit/AUDIT.md) §3.
>
> It's already fixed on two fronts: the script now **reads** the palette instead of
> having it written in, and `npm run check:tokens` fails if `globals.css` and
> `src/lib/brand.ts` diverge.
>
> **This file is kept for the reasoning, not for the numbers.** The two
> resolved cases in §"The two cases that had to be resolved" and the orange hover
> conflict are still the explanation for decisions that are in force;
> just read the ratios in the new table.

Calculated on relative luminance per **WCAG 2.1** (formula from 1.4.3 / 1.4.11).

**Minimums applied:** 4.5:1 body text · 3:1 large text (≥24px, or ≥18.66px bold)
and non-text interface elements.

---

## The starting problem

`sunset` #F58521 and `river` #0EB6B8 are two mid tones with almost identical luminance:
**2.54:1** and **2.50:1** on white. Neither reaches AA as a text color
on a light background, at any size. That's where the hard rules below come from.

---

## Table of pairs in use

| Pair | Use | Ratio | Minimum | Status |
|---|---|---:|---:|---|
| `body` on `paper` | Body text — 92% of the site | **19.80:1** | 4.5:1 | ✅ AAA |
| `ink` on `paper` | Titles, nav, every heading | **21.00:1** | 4.5:1 | ✅ AAA |
| `ink` on `sunset` | Primary CTA text | **8.26:1** | 4.5:1 | ✅ AAA |
| `ink` on `river` | Text on teal fill | **8.40:1** | 4.5:1 | ✅ AAA |
| `ink` on `cream` | Text on the cream surface | **18.30:1** | 4.5:1 | ✅ AAA |
| `ink` on `mint` | Text on mint | **17.26:1** | 4.5:1 | ✅ AAA |
| `deep` on `paper` | Eyebrow and colored text on white | **10.83:1** | 4.5:1 | ✅ AAA |
| `plum` on `paper` | Alternate colored text | **13.51:1** | 4.5:1 | ✅ AAA |
| `terra` on `paper` | Alerts and highlighted prices | **7.43:1** | 4.5:1 | ✅ AAA |
| `magenta` on `paper` | Editorial accent | **5.64:1** | 4.5:1 | ✅ AA |
| `teal600` on `paper` | Colored text on WHITE | **4.59:1** | 4.5:1 | ✅ AA |
| `deep` on `cream` | Eyebrow on cream | **9.44:1** | 4.5:1 | ✅ AAA |
| `plum` on `cream` | Colored text on cream | **11.77:1** | 4.5:1 | ✅ AAA |
| `terra` on `cream` | Accent on cream | **6.47:1** | 4.5:1 | ✅ AA |
| `magenta` on `cream` | Accent on cream | **4.92:1** | 4.5:1 | ✅ AA |
| `teal600` on `cream` | ⚠️ FORBIDDEN — doesn't reach AA | **4.00:1** | 4.5:1 | ❌ FAILS |
| `paper` on `deep` | Text on the dark surface | **10.83:1** | 4.5:1 | ✅ AAA |
| `cream` on `deep` | Text and eyebrow on dark | **9.44:1** | 4.5:1 | ✅ AAA |
| `mint` on `deep` | Detail on dark | **8.90:1** | 4.5:1 | ✅ AAA |
| `sunset` on `deep` | LARGE accent on dark | **4.26:1** | 3:1 | ✅ AA |
| `river` on `deep` | LARGE accent on dark | **4.33:1** | 3:1 | ✅ AA |
| `ink` on `paper` | Focus ring on white | **21.00:1** | 3:1 | ✅ AA |
| `ink` on `sunset` | Focus ring on the CTA | **8.26:1** | 3:1 | ✅ AA |
| `cream` on `deep` | Focus ring on dark | **9.44:1** | 3:1 | ✅ AA |
| `ink45` on `paper` | Link underline at REST (identifies the link) | **3.36:1** | 3:1 | ✅ AA |
| `sunset` on `paper` | Underline on HOVER — redundant with the thickness | **2.54:1** | n/a | ✅ exempt — decorative |

---

## Hard rules that come out of the table

1. **`sunset` and `river` never as a text color** on white or on cream.
   They're used as a SURFACE (with black text on top) or as a shape (logomark, pattern).
2. **On orange or on teal the text goes in BLACK** — 8.26:1 and 8.40:1. Never in white:
   white on `sunset` gives 2.54:1 and on `river` 2.50:1.
3. **On `deep` #014545** the text goes in white (10.83:1) or in cream (9.44:1).
4. **`magenta` is not used on `deep`** — 1.92:1. It's the only accent that goes dull on
   the dark surface.
5. **The focus ring goes in ink** (21:1 on white, 8.26:1 on the CTA orange)
   and inverts to cream inside `.on-dark` (9.44:1).
   It doesn't go in `sunset`: 2.54:1 doesn't reach the 3:1 of 1.4.11.

---

## The two cases that had to be resolved

### 1. `teal600` on cream — **forbidden**

The brief lists `#028382` among the allowed text colors "on a light background",
with 4.6:1. That number is correct **on white** (4.59:1). **On cream it gives 4.00:1**
and doesn't reach AA for body text.

It's the only figure in the brief that doesn't hold up, and not because it's miscalculated:
the rule says "light background" without distinguishing white from cream, and cream is darker.

**Resolved by removing it, not by justifying it.** `COLOR_RULES.colorTextOnCream` in
`src/lib/brand.ts` excludes `teal600`. On cream that leaves `deep` (9.44), `plum` (11.77),
`terra` (6.47) and `magenta` (4.92).

### 2. The orange link hover — **clash between two rules of the brief**

The brief asks for both things at once:

- "Sunset Orange — … on the **link hover**"
- "All text meets WCAG AA" / "if a pair doesn't pass, **change it, don't justify it**"

But orange on white gives 2.54:1 and doesn't reach the 3:1 that 1.4.11 requires for an
interface indicator. Painting the underline orange and moving on would break the
second rule.

**Resolved by separating which indicator carries the accessibility:**

| State | Underline | Ratio | Role |
|---|---|---:|---|
| Rest | 1px, ink at 45% (#8C8C8C) | **3.36:1** ✅ | **This is where the link is identified as a link.** Meets 1.4.11. |
| Hover | 2px, `sunset` | 2.54:1 | Gesture. The state change is communicated **also through thickness**, so it doesn't depend on color (1.4.1). |

The link text stays in ink at 21:1 in both states. If someone can't distinguish
the orange, they lose no information: the link was underlined before and the underline
got thicker.

Implemented in the `link-text` utility in `globals.css`.

---

## The headline accent — added on September 9, 2026

The redesign added a typographic accent inside the headline, in **color and not in
italics**. It needs **two** colors and not one, and this is the measured reason:

| Pair | Use | Ratio | Verdict |
|---|---|---|---|
| `sunset` on `paper` | accent on light | **2.48:1** | ❌ doesn't even reach the 3:1 for large text |
| `terra` on `paper` | accent on light | **7.43:1** | ✅ AAA |
| `terra` on `cream` | accent on cream | **6.47:1** | ✅ AA |
| `sunset` on `deep` | accent on dark | **4.26:1** | ✅ AA |

Measured and discarded for light: `river` 2.43:1 (fails), `tomato` 3.77:1 (barely
passes, large text only), `plum` 13.15:1 and `deep` 10.55:1 (they pass, but
being dark like the headline, the accent doesn't read as an accent).

**Rule:** on a light surface the accent is `terra`; on `deep` it's
`sunset`. The `Accent` component encapsulates it, and its prop is the **surface** and
not the color, precisely so nobody has to remember this.

---

## COMPOSITE colors — what this table can't foresee

⚠️ Three real failures in this session, and all three were found by `npm run a11y`
measuring the rendered pixel, not by this table:

| Where | Declared | Measured | Fix |
|---|---|---|---|
| "video" label on the wall | `paper/55` on `paper/12` on `deep` | **3.51:1** | `paper/75` → 5.08:1 |
| FindUs Bar/Trucks labels | `body/60` on `paper` | **3.92:1** | `body/70` → 5.30:1 |
| Inactive number in the steps list | `body/45` on `paper` | **2.61:1** | corrected to `/65` (4.57:1); today the module is `StepStair` on `deep` and uses `paper/70` → 8.05:1 |

All three are **one opacity on top of another**, or an opacity on a background that is
already an opacity. A palette pair doesn't describe them: the real color isn't
declared anywhere, it comes out of the composition.

⚠️ And the third one teaches something more: axe flags the contrast **even if the element
is `aria-hidden`**. It's right — it's still visible text for anyone who can see,
even if a screen reader doesn't read it. Hiding something from the accessibility
tree is not a way out for a contrast that doesn't pass.

---

## What still isn't covered

This table covers the **system** pairs. Still to verify, once they exist:

- **Text on photography.** It no longer applies to the hero —it was left without a
  background photo and today it's solid `deep`, where `paper` gives 15.4:1 without
  depending on anything—, but it still holds for any text placed on an image on another
  page. The real pair is measured on the composite color and not on the declared one,
  which is the classic mistake no automatic checker detects.
- **The tile pattern.** The real asset has arrived (`public/brand/tile-pattern.svg`,
  from Figma) and it goes in as an `aria-hidden` decorative band, so today there's no
  text on top of it. If text is ever placed on it, it has to be measured on the rendered
  pixel: there are four colors and the pair changes depending on where the letter lands.
- **Text on a blurred photo** (the events banner on the home page). Resolved with
  a `deep/90` veil, which is a calculated floor: with a pure white photo the worst
  case gives 5.3:1. Measured on the rendered pixel with the real photo —axe reports
  "incomplete" when the background is an image— it gives between 6.4:1 and 8.2:1. If the
  photo changes there's no need to measure again, but if the veil is lowered, there is.
- **Form error states.** They use text in addition to color (Phase 4 requirement),
  but the color pair isn't defined yet.
