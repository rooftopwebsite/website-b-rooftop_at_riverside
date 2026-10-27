# House tokens — Rooftop at Riverside

**Measured** values, not approximations. They are the law of the project: Rooftop's type
and spacing scale comes from here, not from Tailwind's defaults or from a new scale.

**Source priority** (per the brief, when two references differ):

1. **Local repos** — it's real house code
2. **Showdown Social** — https://showdown-social.vercel.app/
3. The rest

**Method**

| Source | How it was measured | Date |
|---|---|---|
| The Orient | Reading `src/app/globals.css` (2113 lines, documented tokens) | 2026-09-08 |
| Tre Vele | Reading `src/app/globals.css` + `components/shared/motion/config.ts` | 2026-09-08 |
| Zakia · Santa María · YAVA | Frequency count of Tailwind classes over `components/` and `app/` | 2026-09-08 |
| Showdown Social | `getComputedStyle` via Playwright, 1440×900 and 390×844 | 2026-09-08 |

> **Stack note.** None of the five repos has a `tailwind.config.*`. All five are
> **Tailwind v4**, with the theme in CSS (`@theme` in `globals.css`). Rooftop does the same.
> The brief says "extend `tailwind.config.ts`": in v4 that file doesn't exist and the equivalent
> is the `@theme` block in `globals.css`. See §9.

---

## 1. Who has a token system and who doesn't

This conditions everything that follows, so it goes first.

| Repo | Token system | What it contributes |
|---|---|---|
| **The Orient** | ✅ Complete and documented in `@theme static` | **The scale. It is the primary source.** |
| **Tre Vele** | ✅ Partial (`@theme`: color, motion, radii) | **Motion, radii, page structure.** |
| Santa María | ❌ Only Next's `--background`/`--foreground` | Usage frequencies |
| YAVA | ❌ Same | Usage frequencies |
| Zakia | ❌ Same | Usage frequencies |

Santa María, YAVA and Zakia write arbitrary values inline (`text-[38px]`, `py-20`).
They serve to **confirm convergence**, not to define the scale.

---

## 2. Container and gutter

### Max content width — **1280px, unanimous**

| Source | Value | Evidence |
|---|---|---|
| The Orient | `--container-site: 1280px` | token |
| Zakia | 1280px | `max-w-[1280px]` ×26 (the most used) |
| Santa María | 1280px | `max-w-[1280px]` ×28 (the most used) |
| YAVA | 1280px | `max-w-[1280px]` ×30 (the most used) |
| Tre Vele | 1280px | `max-w-7xl` ×25 (= 80rem) |
| Showdown Social | 1280px | measured, `max-width: 1280px` |

**→ Rooftop: `--container-site: 1280px`.** No divergences.

### Intermediate steps (only The Orient formalizes them)

```
--container-mobile:  780px   /* up to 768 */
--container-tablet:  880px   /* 768 – 1344 */
--container-site:   1280px   /* from 1344 */
--container-wide:   1420px   /* exception: full-bleed galleries */
```

The jump to 1280 happens at **1344px** (= 1280 + 32×2 of gutter), not at the layout breakpoint.
The Orient documents why: at 1024px the box declared 1280 but the screen didn't reach it,
so the cap never kicked in and the content stretched.

### Side gutter

| Source | Mobile | Desktop |
|---|---|---|
| The Orient | **16px** (`--spacing-gutter`) | **32px** (`--spacing-gutter-lg`) |
| Zakia | 16px (`px-4` ×46) | 40px (`px-10` ×38) |
| Santa María | 24px (`px-6` ×42) | 32px (`px-8` ×32) |
| YAVA | 24px (`px-6` ×45) | 40px (`px-10` ×37) |
| Tre Vele | 20px (`px-5` ×47) | 32px (`px-8` ×34) |
| Showdown Social | **20px** (measured) | **56px** (measured) |

⚠️ **Divergence.** Mobile ranges from 16 to 24; desktop from 32 to 56.
**→ Rooftop takes The Orient: 16px mobile / 32px desktop.** It's the only tokenized value
and it's consistent with the container's 1344 (1280 + 32×2). Showdown at 56px is the outlier.

---

## 3. Type scale

### Sizes — The Orient (primary source)

A single display axis, `d1`–`d7`, plus three text steps.

| Token | Size | Line-height | Use |
|---|---|---|---|
| `d1` | 72px | 0.94 | hero |
| `d2` | 58px | 0.96 | h1 desktop |
| `d3` | 46px | 1.00 | h1 tablet · h2 desktop |
| `d4` | 36px | 1.08 | h1 mobile · h2 tablet |
| `d5` | 28px | 1.18 | h2 mobile · h3 desktop |
| `d6` | 22px | 1.25 | h3 mobile · card title |
| `d7` | 18px | 1.30 | footer column label |
| `intro` | 25px | 1.40 | section subhead desktop |
| `lead` | `clamp(16px, 16px + (100vw − 390px) × 0.005128, 18px)` | 1.60 | section copy |
| `base` | 16px | 1.65 | **92% of the site's text** |
| `cta` | 16px | 1.20 | buttons |
| `caption` | 13px | 1.45 | kickers, labels, captions |

⚠️ `lead` goes in `:root`, **not** in `@theme`: Tailwind v4 evaluates `@theme` at
compile time, and a `clamp()` with `100vw` there silently compiles to 18px. It's measured and documented
in The Orient. It's the most expensive stumble to repeat.

### Responsive heading map (The Orient, `heading.tsx`)

```
h1   text-d4 md:text-d3 lg:text-d2      36 → 46 → 58
h2   text-d5 md:text-d4 lg:text-d3      28 → 36 → 46
h3   text-d6            lg:text-d5      22 →      28
h4   text-[20px]        lg:text-d6      20 →      22
card                    text-d6/d5      22 →      28
```

### Showdown Social — measured

| Element | Desktop 1440 | Mobile 390 |
|---|---|---|
| h1 | 84px / 82.32 / −1.68 / 700 / UPPER | 38px / 37.24 / −0.76 |
| h2 | 72px / 72 / −1.44 / 700 / UPPER | 34px / 34 / −0.68 |
| h2 (secondary) | 54px / 52.92 / −0.54 | 31px / 32.55 / −0.31 |
| h3 | 51.84px / 50.80 / −0.52 | 30px / 29.4 / −0.30 |
| body | 15px / 24 / normal / 400 | 16px / 24.8 |
| small | 16px / 25.6 | — |
| button | 13px / −  / **+1.82px** / 600 / UPPER | 13px / +1.82 |

Desktop→mobile ratio ≈ **0.45** on h1 (84→38). The Orient is more conservative: 58→36 ≈ **0.62**.

⚠️ **Big divergence.** Showdown scales much more aggressively and uses **negative** tracking
on headings (−0.02em). The Orient doesn't define negative tracking.

**→ Rooftop takes The Orient** (local repo wins). But Rooftop's brand uses **Steelfish**,
an all-caps condensed face: it's a typeface that holds up at larger sizes than
The Orient's Lusitana. Suggestion to validate in Phase 1: keep The Orient's steps
and consider bumping only the hero's `d1`.

### Tracking

| Source | Eyebrow / kicker |
|---|---|
| The Orient | **0.24em** (`--tracking-kicker`) |
| Tre Vele | 0.22em (×19), 0.24em (×9), 0.18em (×8) |
| Zakia | 0.20em (×13), 0.30em (×10) |
| Santa María | 0.25em (×8) |
| YAVA | 0.45em (×23), 0.15em (×10) |
| Showdown | +1.82px over 13px = **0.14em** |

**→ Rooftop: `--tracking-eyebrow: 0.24em`.** The Orient, Tre Vele and Santa María converge
in the 0.22–0.25 band. It's also what the brief asked for with Bronx ("all caps with open
tracking"), and it still holds with Jost, which replaced it.

### Display tracking — REVISED on September 9, 2026

⚠️ The section above says "Rooftop takes The Orient", and that's where
`--tracking-display: -0.02em` came from. **That token was removed.** Camila rejected the
result: "it looks too tight".

The original reasoning was wrong for a concrete reason: The Orient uses
**Lusitana**, a normal-width serif, and Rooftop uses an **all-caps
condensed**. Negative tracking on a condensed face is exactly what clumps it
together. And that wasn't the only layer: `Heading` also forced `font-bold` on all
levels, so there wasn't a single headline on the site in Regular.

On top of that, the token was only applied in **two** places —the hero h1 and a few mini
cards—, so on all the other headlines the tracking was 0. The fix wasn't
flipping its sign: it was making it reach all of them.

It's replaced by an **optical scale** in the sub-tokens of the size scale,
which is the same mechanism the line-height already used:

| Step | Size | Tracking |
|---|---|---|
| `hero` | 72px+ | `0.02em` |
| `d1` | 72px | `0.02em` |
| `d2` | 58px | `0.03em` |
| `d3` | 46px | `0.035em` |
| `d4` | 36px | `0.04em` |
| `d5` | 28px | `0.045em` |
| `d6` | 22px | `0.05em` |
| `d7` | 18px | `0.05em` |

The smaller the size, the more the condensed face closes up and the **more** air it needs: that's why it's
a scale and not a single value.

⚠️ All seven steps carry tracking, `d5`/`d6`/`d7` included. The first
attempt left them out on the assumption that from that size down it was already the sans,
and that's false: the h3, the prices with `tabular-nums` and the menu item names
use them, and they're all `font-display`. Measured in the browser, the h3 ended up at
`letter-spacing: normal`.

### Weights

The Orient: 400 regular / 700 strong (100 thin, exceptional).

**Rooftop uses 400 on ALL headlines.** `Heading` was `font-bold` on all
levels; it moved to `font-normal` at Camila's request —"in regular, never in a
heavy weight"— and that was, together with the negative tracking, the reason the display
looked clumped.

⚠️ The families changed entirely on September 9, and all three for **licensing**
reasons, not design. Today there are two, both Google OFL and both variable:
**Big Shoulders Display** for display and **Jost** for body (400) and eyebrows (500).
The details are in the header of `globals.css` and in `public/fonts/_drop/README.md`.

---

## 4. Vertical rhythm

### Section bands — The Orient

```
--spacing-band-sm:   64px
--spacing-band:      96px
--spacing-band-lg:  128px
--spacing-band-xl:  160px
```

Always applied as a **mobile/desktop pair** (`section.tsx`), never a single value:

| Step | Mobile | Desktop |
|---|---|---|
| `sm` | 48px | 64px |
| `md` | 64px | 96px |
| `lg` | 80px | 128px |
| `xl` | 96px | 160px |

And **always symmetric** (same `pt` as `pb`). The Orient documents that the original had
half of its sections with space on only one side (144/0, 0/144, 194/64) and that this was
a bug to fix, not a pattern.

### The two spaces you can see — `block` and `closing`

The bands above govern the whole section. Inside it and at its foot there are two more
spaces, and they're the only two a visitor notices when scrolling a long page:

| Token | What it separates | Mobile | Desktop |
|---|---|---|---|
| `--spacing-block` | section header → its content | 40px | 48px |
| `--spacing-closing` | section foot → the background change | 56px | 112px |
| `--spacing-closing-arc` | same, but under a section mounted with `-mt-22` | 144px | 200px |

All three are `clamp` with `vw` —`block` at `3.4vw`, `closing` at `7vw`— and
`closing-arc` is literally `closing + --radius-band`: the 88px that the next
section covers when it's mounted on top with its arch. If the radius changes, both change.

**The proportion is the rule, not the numbers.** `block` always below half
of `closing` (1:2.3 on desktop): a headline and its grid are one single thing, so what
joins them has to be visibly smaller than what separates that thing from the next one.
When both were 72px —that was the case with `ThreeDoors`— the grid floated between two
sections instead of belonging to its own.

**Two `<section>` elements can be a single block.** If the lower one shares the background with the
upper one and has no headline of its own, on screen it's the content of that header, not a
new section: the pair is joined with `block` and not with the two bands added together. That's the case of
`HowThisPlaceWorks` → `YardSteps` on the home page, which measured 72 + 48 = 120px. The upper one
closes with zero `pb` and the lower one opens with `pt-block`; if both add padding, the
space doubles. When the lower one DOES have a headline —`/nfc-north-hq` and `/our-story`
have two `paper` sections in a row— they're two real sections and the bands rule.

This applies to the whole site: the inner pages had this space hand-written as
`mt-[40px]` in 25 places and today it's `mt-block`; the home page had it between 32 and 80 depending on the
section.

### Convergence in the other repos

| Repo | Most used values |
|---|---|
| Zakia | `py-24` (96px) ×14, `py-28` (112) ×4, `py-20` (80) ×4 |
| Santa María | `py-16` (64) ×15, `py-20` (80) ×12, `py-[96px]` ×11 |
| YAVA | `py-20` (80) ×18, `py-28` (112) ×17, `py-24` (96) ×7 |
| Tre Vele | `py-14` (56) ×20, `py-28` (112) ×16, `py-24` (96) ×7 |
| **Showdown** | **120–128px desktop**, 70–120px mobile (measured) |

**→ Rooftop takes The Orient's scale (64/96/128/160 with a mobile pair).** It's the only
tokenized one and it falls within everyone's band. Showdown at 120/128 fits in `lg`.

### Internal rhythm of the section header (The Orient)

| Token | Mobile | Desktop (≥922px) |
|---|---|---|
| `gap-kicker` | 8px | 12px |
| `gap-subhead` | 16px | 20px |
| `gap-paragraph` | 8px | 8px |
| `gap-cta` | 24px | 32px |

---

## 5. Header

| Source | Height | Behavior |
|---|---|---|
| The Orient | **67px** compact / **77px** from 1344px | `fixed`, always opaque, shadow on scroll (40px threshold) |
| Showdown | **72px** desktop / **63px** mobile | `fixed`, `z-index: 200`, transparent background → solid when leaving the hero |
| Tre Vele | — | `fixed top-0 z-40` |
| Santa María / Zakia | — | `fixed top-0 z-50` |

**→ Rooftop: 67/77px (The Orient), `fixed`, `z-[99]`.**

### Nav architecture — **the house pattern, unanimous**

A few destinations in view + a **"More"** dropdown.

| | The Orient | Showdown |
|---|---|---|
| Visible items | 5 (`HOME · MENU · ORDER ONLINE · PRIVATE EVENTS` + More) | 5 (`Home · Experience · Menu · Event Spaces · Happenings` + More) |
| Items in "More" | 5 (label only) | 8 (**label + subtitle**) |
| CTAs | 1 + Instagram icon | **2**: `Plan Event` (secondary) + `Book Now` (primary) |
| Mobile | drawer (hamburger) | drawer (hamburger) |
| Nav collapse | `desk:` 1344px | — |

Details of the "More" behavior (The Orient, already solved and worth copying):
opens on hover **and** on click (works with mouse and with keyboard) · `aria-expanded` +
`aria-haspopup` · closes with `Escape` and with an outside click · the panel always lives in the DOM
and is hidden with `invisible` + `pointer-events-none` (without `invisible` you could tab to
links you can't see) · the "current page" rule **only** marks the active route, hover
only changes the text color.

**→ Rooftop: 5 visible + "More" with label+subtitle (Showdown), 2 CTAs.**
With one forced difference: **there are no reservations here**. The pattern's primary CTA is
`Book Now`; in Rooftop that slot is taken by `Plan an Event`, and the secondary by `What's On`.

---

## 6. Footer

| | The Orient | Showdown |
|---|---|---|
| Structure | identity (max. 320px) + 3 nav columns | "Last Call" block + newsletter + contact + links |
| Background | `ink` #1C1C1C | cream #FCFBF2 |
| Order | rule → identity+columns → divider → legal → agency bar | closing CTA → email capture → contact → columns → agency |
| Repeated | phone, address, hours, socials | phone, email, socials |
| Agency bar | "Resto Experience" | "Resto Experience" |

Order of Showdown's footer links, measured:

```
Book Now · Plan an Event
Instagram · Google · Facebook
+1 (770) 676-7604 · contact@showdown.com
Blog · Corporate Events · Fundraisers · Event Kit · Event Spaces · Contact · Careers · Press · FAQ
Resto Experience
```

**→ Rooftop: Showdown** (its footer already integrates Last Call + newsletter, which is exactly
what the brief asks for the home page), with the house agency bar.
The two sets of hours (bar / trucks) go in the footer: it's the most looked-up piece of information.

---

## 7. Radii, shadows, borders

| Source | Radii |
|---|---|
| The Orient | `pill: 30px` · `pill-lg: 150px` · `card: 10px` |
| Tre Vele | `pill: 999px` · `card: 22px` · `brand: 14px` |
| Santa María | `full` ×25 · `8px` ×19 · `16px` ×14 · `20px` ×11 |
| YAVA | `full` ×27 · **`none` ×18** |
| Zakia | `full` ×9 · `none` ×4 |
| Showdown | buttons **0–2px** (almost square) · cards 11px · 24px |

⚠️ **Real divergence.** There's no consensus: it ranges from 0px (Showdown, YAVA) to 22px (Tre Vele).

**→ Decision for Rooftop: small radii, 0–4px on buttons and ~10px on cards** (The Orient +
Showdown). Rationale: the brand is a rooftop with a circular isotype and a tile pattern;
a large radius competes with the isotype's circle. **Marked as a Phase 1 decision, to be validated.**

Shadows — only The Orient tokenizes them:

```
--shadow-card:  0 2px 10px rgba(7,25,35,.16), 0 18px 44px -12px rgba(7,25,35,.34)
--shadow-photo: 0 3px 10px rgba(7,25,35,.09), 0 22px 48px -20px rgba(7,25,35,.24)
```

⚠️ They're tinted in The Orient's navy. For Rooftop they have to be retinted over
`deep` #014545. **Don't copy the rgba as is.**

---

## 8. Motion

### Libraries per repo

| Repo | Stack |
|---|---|
| The Orient | `gsap` 3.15 · `lenis` 1.3.26 |
| Tre Vele | `motion` 12.23 · `gsap` 3.15 · `lenis` 1.3.25 · `embla-carousel` 8.6 |
| YAVA | `motion` 12.41 · `gsap` 3.15 · `locomotive-scroll` 5.0-beta |
| Zakia | `gsap` 3.15 · `lenis` 1.3.25 |
| Santa María | — (pure CSS) |

**→ Rooftop: `motion` + `gsap` + `lenis`** (Tre Vele's stack, the most complete and the newest).

### Parameters — Tre Vele (`motion/config.ts`), the most precise source

```ts
EASE_BRAND    = [0.16, 1, 0.3, 1]      // ease-out-expo
EASE_GSAP     = "expo.out"
EASE_HOVER    = "power2.out"
DURATION      = { fast: 0.18, base: 0.6, slow: 0.9, kenBurns: 1.8 }
REVEAL_OFFSET = 24        // px of translateY
STAGGER       = 0.08
viewport      = { once: true, amount: 0.3 }   // trigger threshold
```

Second curve in the house: `cubic-bezier(0.22, 1, 0.36, 1)` — The Orient (its exit easing token),
Zakia (`zk-enter`, 0.85s) and Tre Vele (`--ease-brand`). Both are ease-out-expo, almost identical.

Marquee: 30s (Zakia) · 28s (YAVA) · 40s by default (Tre Vele) · 30–45s (Showdown reference).
**→ Rooftop: 35s**, and turned off with `prefers-reduced-motion` — all three repos do that.

Preloader (Tre Vele): 0.5s fade + 1.1s doors with `cubic-bezier(0.37, 0, 0.63, 1)`,
5s safety cutoff, % counter with asymptotic increments every 85ms.

> ⚠️ **Tre Vele's preloader uses `sessionStorage`** so it doesn't repeat within a session.
> Rooftop's brief **forbids any browser storage API**. It has to be reimplemented:
> the preloader runs on every load, or the "already shown" lives in an in-memory module
> (lost on reload, which is acceptable). **Don't copy that file as is.**

All of the house's motion components short-circuit with `useReducedMotion()`,
returning the plain tag, not a 0-duration animation. It's the correct pattern and it gets copied.

---

## 9. `@theme` block for Rooftop

Direct translation of everything above. Tailwind v4: this goes in `app/globals.css`.

```css
@theme static {
  /* Container */
  --container-mobile:  780px;
  --container-tablet:  880px;
  --container-site:   1280px;
  --container-wide:   1420px;
  --breakpoint-desk:  1344px;

  /* Gutter */
  --spacing-gutter:     16px;
  --spacing-gutter-lg:  32px;

  /* Bands */
  --spacing-band-sm:    64px;
  --spacing-band:       96px;
  --spacing-band-lg:   128px;
  --spacing-band-xl:   160px;

  /* Internal rhythm (desktop; mobile is overridden in :root) */
  --spacing-gap-kicker:  12px;
  --spacing-gap-subhead:  20px;
  --spacing-gap-paragraph:  8px;
  --spacing-gap-cta:     32px;

  /* Header */
  --spacing-header:     77px;
  --spacing-header-sm:  67px;

  /* Display */
  --text-d1: 72px;  --text-d1--line-height: 0.94;
  --text-d2: 58px;  --text-d2--line-height: 0.96;
  --text-d3: 46px;  --text-d3--line-height: 1;
  --text-d4: 36px;  --text-d4--line-height: 1.08;
  --text-d5: 28px;  --text-d5--line-height: 1.18;
  --text-d6: 22px;  --text-d6--line-height: 1.25;
  --text-d7: 18px;  --text-d7--line-height: 1.3;

  /* Text */
  --text-intro:   25px;  --text-intro--line-height: 1.4;
  --text-lead:    18px;  --text-lead--line-height: 1.6;   /* :root makes it fluid */
  --text-base:    16px;  --text-base--line-height: 1.65;
  --text-cta:     16px;  --text-cta--line-height: 1.2;
  --text-caption: 13px;  --text-caption--line-height: 1.45;

  --tracking-eyebrow: 0.24em;

  /* Motion */
  --ease-brand: cubic-bezier(0.16, 1, 0.3, 1);

  /* Radii — Phase 1 decision, to be validated */
  --radius-card: 10px;
  --radius-pill: 999px;
}

:root {
  --text-lead: clamp(16px, 16px + (100vw - 390px) * 0.005128, 18px);
  --spacing-gap-kicker:  8px;
  --spacing-gap-subhead: 16px;
  --spacing-gap-cta:    24px;
}
@media (min-width: 922px) {
  :root {
    --spacing-gap-kicker: 12px;
    --spacing-gap-subhead: 20px;
    --spacing-gap-cta:    32px;
  }
}
```

Colors are **not** here: they're defined by the Phase 1 color law and go in `lib/brand.ts`.

---

## 10. Structure of the Showdown Social home page — measured, in order

With each section's function and the mapping to Rooftop that the brief asks for.

| # | Showdown | Desktop padding | Function | → Rooftop |
|---|---|---|---|---|
| 1 | Hero "Good times are always social" + booking widget | 120/104 | captures intent | Hero + **3-way intent selector** (no reservations) |
| 2 | **This week** | 120/120 | what's happening now | **Tonight at the Yard** — the differentiating module |
| 3 | How it works — 3 steps | — | clears up the confusion | **How this place works** — who charges you for what |
| 4 | The Showdown experience | — | spaces | The 3 verticals in 3 cards |
| 5 | The Showdown Kitchen | 64/86 | food | Food trucks (≠: here the venue doesn't cook) |
| 6 | "20% off" promo band | — | offer | Features marquee |
| 7 | **Featured happenings** | 120/120 | weekly grid | **This week** → `/whats-on` |
| 8 | Reviews in a marquee | 126/126 | social proof | ⛔ **Don't build.** Unconfirmed ratings |
| 9 | **Find Us** — map + info | 128/128 | physical conversion | Find us + the **two** sets of hours |
| 10 | Footer: Last Call + newsletter | — | close | Double last call + seasonal newsletter |

The **"Planning a work event?" block with 3 actions** (Request a Proposal / View Deck /
View Spaces) is the one the brief calls "the house pattern" for *For event planners*.
In Showdown it's a sub-block; in Rooftop it goes as its own home page section, because
it's the priority vertical ($10k–$30k per ticket).

---

## 11. Divergence summary

| Token | Divergence | Resolution | Why |
|---|---|---|---|
| Container | none — 1280px in all 6 | 1280px | unanimous |
| Mobile gutter | 16 (Orient/Zakia) ↔ 24 (SM/YAVA) | **16px** | tokenized local repo |
| Desktop gutter | 32 (Orient/SM/TV) ↔ 40 (Zakia/YAVA) ↔ 56 (Showdown) | **32px** | consistent with the 1344 |
| h1 scale | 58px (Orient) ↔ 84px (Showdown) | **58px** | local repo; review `d1` because of Steelfish |
| Eyebrow tracking | 0.14em (Showdown) ↔ 0.45em (YAVA) | **0.24em** | Orient + TV + SM converge |
| Bands | 64/96/128/160 ↔ 120/128 (Showdown) | **Orient** | only tokenized scale |
| Header | 67/77 (Orient) ↔ 72/63 (Showdown) | **67/77** | local repo |
| Radii | 0px (Showdown/YAVA) ↔ 22px (Tre Vele) | **0–4 / 10px** | no consensus → brand decision |
| Footer | Orient (3 col.) ↔ Showdown (Last Call + newsletter) | **Showdown** | it's what the brief asks for |
| Motion | two almost identical ease-out-expo | `[0.16,1,0.3,1]` | Tre Vele, the newest |
| Preloader | Tre Vele uses `sessionStorage` | **reimplement** | the brief forbids storage |
| Shadows | tinted in navy (Orient) | **retint in `deep`** | different brand |

---

## 12. Drift from the house — audited on `redesign/light-tropical`

The resolutions in §11 were made in Phase 1, before the redesign branch
existed. This is the comparison between what that table decided and **what the
branch actually paints**, read from `globals.css` and from the components, not from
memory.

| Token | §11 resolved | The branch paints | Drift? |
|---|---|---|---|
| Container | 1280px | 1280px | — |
| Mobile / desktop gutter | 16 / 32px | `--spacing-gutter: 16px` · `-lg: 32px` | — |
| Section bands | The Orient's scale | the same, tokenized in `--spacing-band-*` | — |
| Shadows | retint in `deep` | `rgba(1, 69, 69, …)` in `--shadow-card` and `--shadow-photo` | — |
| Motion ease | `[0.16, 1, 0.3, 1]` | `ease.out` in `lib/motion.ts`, that value | — |
| Preloader | reimplement without `sessionStorage` | reimplemented, no storage | — |
| Card radius | ~10px | `--radius-card: 10px` | — |
| **Eyebrow tracking** | **0.24em** | **0.12em** | ✅ **yes, and on purpose** |
| **Button radius** | **0–4px** | **`rounded-pill`** | ✅ **yes, and on purpose** |

### The two drifts, with their reasons

**Eyebrow tracking: 0.24em → 0.12em.** §11 resolved it at 0.24em because The
Orient, Tre Vele and Santa María converge there. This branch's brief asks for 0.12em
explicitly, and `docs/prompt-claude-design.md` repeats the same number. The
brand brief wins over the house convergence: 0.24em is a small-caps tracking
for a dark, editorial site, and on a light site with the condensed face
at 88px, very open small caps read like a stamp from another era. Measured on
the specimen: at 12px, 0.24em is almost 3px of air per letter and the label stops
reading as a word.

**Button radius: 0–4px → pill.** §11 justified it with "a large
radius competes with the isotype's circle", and it was marked as a "Phase 1
decision, **to be validated**". It was validated the other way around: with the site in light mode, an
almost square button on white paper reads as a form field, not as a
control. The pill is also what the brand already uses in its own material and
what the branch's brief specifies for CTAs. The circular isotype doesn't compete:
it's in the header, at 40px, and doesn't share space with any button.

`--radius-btn: 10px` **is still declared and not deleted**, with its comment: the
radius names say what each thing is for even if today they share a value.

> ⚠️ Both drifts are in the CSS, not in a standalone component, so they
> are reverted by changing a token. If the site ever goes back to the dark
> key, both have to be discussed again.
