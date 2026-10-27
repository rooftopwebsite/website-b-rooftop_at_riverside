# Master prompt — design variant for Claude Design

> Working document. It gets pasted **in full** as a prompt into Claude Design.
> Layout reference: **https://defoodtruckclub.nl/**, audited on 2026-09-10
> (DOM, computed styles and screenshots at desktop 1440 + mobile 390).
> Copy extracted from the current code (`src/components/sections/*`, `src/lib/nav.ts`,
> `src/lib/brand.ts`). Brand and client profile from `docs/current-site-inventory.md`,
> `design-audit/VISUAL-DIRECTION.md` and the brand book.

---

## ROLE AND ASSIGNMENT

You are a senior digital art director. Design **the complete home page** of
*Rooftop at Riverside* (Bonita Springs, Florida), desktop and mobile, taking the
site **https://defoodtruckclub.nl/** as a **literal structural reference**.

**How the reference is used:**
- **What we take:** the order and type of blocks, the composition system, the
  typographic scale and its contrasts, the treatment of cards and dashed borders, the
  surface transitions with large rounded corners, the carousels with
  circular arrows and dots, the horizontal marquees, the pills, the
  circular stickers mounted on the edges, and the animation repertoire.
- **What we change:** **all** the copy (ours, verbatim), **the palette**
  (ours), **the typefaces** (ours) and **the content** of each
  block, which is different and takes precedence over form.
- **Nothing proprietary of theirs is taken:** not their mascot (the bird), not their
  logotype, not their illustrations, not their photos, not their paid fonts
  (Thunder LC, Perfectly Nineties), not their client logos. All of that is replaced
  with ours according to the mapping in section 5.

Deliver:
1. The complete home page, desktop (1440) and mobile (390).
2. The applied system: typography, color, surfaces, radii, cards, pills.
3. The motion specification, block by block.

---

## 1. CLIENT PROFILE AND BUSINESS CONTEXT

**Rooftop at Riverside** — Bonita Springs, Florida. Opened in January 2024.
Part of **Paradise Food Group**. A family business: the **Magnus** family, Bonita
locals, after four years of planning.

**What it is, literally:** a **rooftop bar** over a **yard with four
independent food trucks**, in downtown Bonita Springs, across from
Riverside Park. Five businesses at one address, one set of stairs.

**The model, which is what confuses people:**
- The four trucks are **someone else's businesses**. You order at the window, you pay that
  truck: separate tab, separate card, separate receipt.
- **The bar upstairs belongs to the venue**. It's the only tab of its own and the only menu
  with prices on the site.
- **There's no table service.**
- The whole place can be rented for private events: rooftop, yard, covered patio,
  or all of it with the gates closed and a single person coordinating.

**The three verticals, by revenue:**
1. **Private events** — the highest earner; it deserves the strongest visual emphasis.
2. **Sunset Bar** — cocktails, local drafts, happy hour.
3. **The yard and the trucks** — rotating roster, free entry.

**Audiences, in this order:**
1. A Bonita / Naples / Estero local who wants to know **what's on tonight**.
2. An event organizer —corporate, holiday party, fundraiser,
   family celebration— evaluating the place.
3. A tourist or visitor to Southwest Florida looking for sunset, cocktails and food.

**Hours (they set the tone):** closed Monday and Tuesday. Wed–Thu 3–8 PM.
Friday 3 PM–midnight. Saturday 11 AM–2 AM. Sunday 11 AM–8 PM. The trucks open an hour
later. **Happy hour Wednesday to Friday, 3–6 PM.**

### The positioning thesis

**This is not a restaurant.** The previous site sold it as a «two-story food
truck park» and that's the mistake to correct. It's an **event
space with its own bar and four independent kitchens**, outdoors, and its
natural hour is **the afternoon and sunset, not midnight**.

That's where the line that governs the aesthetic comes from: **the site has to be the hour, not the
place.** Coming in should feel like stepping off the stairs onto the roof at six
in the evening in Florida: light that washes over everything, white air, and the brand green appearing
only where there's shade. It isn't a dark bar with lights: it's an **open-air terrace
against the light**.

That's what corrects the most likely drift when copying the reference: **De Foodtruck
Club is a dark, nighttime site. Ours isn't.** See section 4.

### Banned terminology (the brief explicitly vetoes it)

Never use, either as copy or as a guiding concept:
- «two-story food truck park» (in any language)
- «upper deck», «our two-story bar»
- «Eat. / Drink. / Paradise.» as section titles
- «the ultimate dining experience», «bites and family favorites»
- Any formula that makes the place read as a **restaurant**.

---

## 2. THE REFERENCE, TAKEN APART

What follows is the real audit of https://defoodtruckclub.nl/ — not a
description from memory. It's the mold to reproduce.

### 2.1 Their visual system

| Role | Theirs | Ours (see §3 and §4) |
|---|---|---|
| Display | **Thunder LC**, ultra-condensed, 800, UPPERCASE, H1 at 140 px with line-height 0.85 | **Big Shoulders** |
| UI / labels | **DM Sans** | **Jost** |
| Long paragraphs | **Perfectly Nineties** (serif) | **Jost light at a large size** — see §3 |
| Ink | `#201E1D` (warm near-black) | `ink` `#0A1F1E` |
| Paper | `#F2EDE9` (warm ecru) | `bone` `#FAF6EA` |
| Dark slab | `#201E1D` | `deep` `#014545` |
| CTA / accent 1 | pink `#FFB3DB` | `sunset` `#F58521`, **with black text** |
| Accent 2 (large shapes) | lime `#CAF291` | `mint` `#C4F2EC` |
| Positive | green `#008A49` | `teal600` `#028382` |
| Negative | red `#BD2018` | `terra` `#A62000` |
| Radii | 21.6 / 43.2 / 86.4 px, full pills, circles | 24 / 44 / 88 px, full pills |

**The five gestures that define the style — all of them must be reproduced:**
1. **Giant ultra-condensed uppercase headlines**, with very tight
   leading, spanning the full width and **split into two misaligned lines**
   (one on the left, the next pushed to the right).
2. **Dashed borders** around cards and pills, in color, over an
   ecru background. It's their graphic signature.
3. **Circular stickers** mounted straddling the edge of a photo or a card,
   breaking the box: a circular seal with text on a curve, a round «NEW»-style badge,
   a jagged star with a number.
4. **Surface transitions with very rounded corners**: the light block
   rises over the dark one with 44–88 px radii, like a curtain. Never a straight
   cut.
5. **Horizontal marquees** of logos and photos, and **carousels** with circular
   arrows on the sides, the neighboring slides peeking in cut off, and centered pagination
   dots below.

### 2.2 Their motion

- **GSAP 3.14 + ScrollTrigger** — 158 triggers on the home page. Each section has its
  own reveal on entering the viewport.
- **barba.js** for page transitions.
- Number counters that animate from 0 on entering the screen.
- Marquees in a continuous loop.
- Hero pill with **rotating text** (they cycle greetings in five languages).
- Circular seals that **spin slowly** permanently.

### 2.3 Their block order (real heights, desktop 1440)

`utility bar` → `header` → `hero` → `intro 2-col` (498 px) →
full-bleed `image divider`, dark close (536 px) → `concepts slider`, dark
(808 px) → `line divider` → `compare`, dark (1145 px) → *light curtain* →
`client marquee` (70 px) → `photo marquee` (454 px) →
`steps slider` with a giant jagged star (1011 px) → `cases slider` (731 px) →
`stats`, dark (415 px) → `contact block` → 4-column `footer`.

---

## 3. OUR TYPOGRAPHY

| Role | Family | Use |
|---|---|---|
| **Display** | **Big Shoulders** (variable, 100–900) | Everything that is Thunder in the reference: giant UPPERCASE headlines, counter numbers, card titles, nav labels. It's condensed, tall and industrial: it holds up at 140 px. |
| **Body and UI** | **Jost** (variable, 100–900) | Subheads, paragraphs, navigation, buttons, pills, labels, data. |

**⚠️ The brand has no serif.** The reference relies for much of its character on
the contrast *brutal condensed ↔ nineties serif*. That contrast has to be
rebuilt **without a serif**: long paragraphs go in **Jost Light (300) at 20–22 px
with 1.6 leading**, with a nice wide measure. The contrast comes from the jump in weight and
scale, not from a change of family. If you think a third
family is needed, **propose it separately as an explicit decision** — don't take it as given.

**Current scale, as a floor:**
- Hero: `clamp(3.5rem, 9vw, 9rem)`, line-height **0.88** → bring it up to 0.85 if
  you follow the reference
- H1 `clamp(3rem, 7vw, 6.5rem)` LH 0.90 · H2 88 px LH 0.92 · H3 40 px LH 1
- Intro 25 px / 1.4 · Lead 22 px / 1.55 · Base 16 px / 1.6
- Data 15 px · Micro 13 px · Caption 12 px
- Eyebrow: UPPERCASE, tracking **0.12 em**, Jost medium

Display titles go **without negative tracking**: Big Shoulders is already condensed and
negative tracking clogs it up.

---

## 4. OUR COLOR

Brand book palette, with exact hex values.

| Token | Hex | Proposed role in this layout |
|---|---|---|
| `ink` / `body` | `#0A1F1E` | all ink on light |
| `bone` | `#FAF6EA` | **the site's base surface** (the reference's «paper») |
| `paper` | `#FFFFFF` | cards and panels that lift off the paper |
| `deep` | `#014545` | the dark slabs |
| `deeper` | `#013434` | layers inside a dark slab |
| `sunset` | `#F58521` | **primary CTA and headline accent on dark** |
| `sunset-hover` | `#E0741A` | CTA hover |
| `mint` | `#C4F2EC` | the large accent shapes (the jagged star, the hero pill) |
| `cream` | `#FDF0B4` | pills and small badges. **Not** large backgrounds |
| `teal600` | `#028382` | the ✓ marks and the «positive» dashed border |
| `terra` | `#A62000` | the ✗ marks and the «negative» dashed border; headline accent on light |
| `river` | `#0EB6B8` | iconography and pattern. **Never as text** |
| `muted` | `#487270` | secondary text on light |
| `muted-dark` | `#A8C6C4` | secondary text on dark |
| `fog` | `#DED8C7` | 1 px rules and borders |
| `tomato` / `plum` / `magenta` | `#EB452C` / `#402639` / `#A24584` | reserve |

### Contrast rules — measured with WCAG 2.1, non-negotiable

- **`sunset` and `river` NEVER as text on a light background** (2.54:1 and 2.50:1). Yes
  as a **fill**.
- On an orange or teal fill, **text goes in BLACK** (8.26:1 and 8.40:1), never
  in white. This applies to the main CTA, which in the reference is the pink pill.
- Colored text allowed on `paper`: `ink`, `body`, `muted`, `deep`, `plum`,
  `terra`, `magenta`, `teal600`. On `bone`: the same **minus `teal600`**.
- On `deep`: text in `paper` or `cream`. `sunset` on `deep` gives 4.26:1 →
  **only one word of a large headline, never body copy**.

### ⚠️ The surface split — here we do NOT follow the reference

De Foodtruck Club has **~41 % of its home page in dark**. We're going
**70–75 % light and 20–25 % dark**, with `sunset` ≤ 5 % and `cream` ≤ 5 %.

**Only two dark zones on the whole page, plus the footer, and never two in a row:**

1. **What's on** — the week's carousel.
2. **Events + Stats**, adjacent, read as a single slab: it's the highest-earning
   vertical and deserves the page's only strong emphasis.
3. The footer.

Everything else goes on `bone`, with cards in `paper`. Every entry into and exit from
the dark is done with the reference's **rounded-corner curtain**.

---

## 5. THE HOME PAGE, BLOCK BY BLOCK

Direct mapping: **reference block → our content**. The copy is in
**US English and is used verbatim**: don't translate, don't rewrite, don't invent new
copy. The hard data is real and is shown as is.

---

### 0 · UTILITY BAR — *their dark top bar*

Thin band in `deep`. Left: Instagram, Facebook and Google icons.
Right: `Gift Cards` · `FAQ`.

---

### 1 · HEADER — *identical in structure to theirs*

On `bone`, with a 1 px rule below. **Nav on the left, isotype centered,
actions on the right.**

- Nav: `Sunset Bar` · `Food Trucks` · `What's On` · `Events` · `The Yard` · `More ▾`
- Right: `Contact` (text) + **`Plan an Event`** (`sunset` pill, black text)
- **Mobile:** hamburger + `MENU` on the left, isotype centered, pill on the
  right. Exactly the reference's pattern.

**More** menu, each item with its subhead:
- **Our Story** — "The Magnus family and four years of planning."
- **The Experience**
- **Market** — "Local vendors and handmade goods in the yard."
- **Events Packet**
- **Join Us** — "Play here, park a truck here, work here."
- **FAQ** — "Parking, dogs, kids and how ordering works."
- **Visit** — "Hours, parking and directions."
- **Contact** — "Three inboxes, so you reach the right one."

---

### 2 · HERO — *their hero: split headline with the photo inset*

The exact composition of the reference:

- **Line 1 of the headline, aligned left:** `BONITA COMES`
- To its right, at the same height, a **`mint` pill** with a **`sunset` circle**
  attached to the right end. They rotate greetings in five languages; **we rotate
  the venue's live status**: `Open until 8 PM` / `Happy hour until 6` /
  `Live music tonight` / `Closed — back Wednesday`. It's the same gesture, with
  useful information.
- **Line 2, pushed to the right and overlapping the top edge of the photo:**
  `TOGETHER` — in `terra`, which is the accent on light.
- **The large photo**, with 44 px radii, **comes in below line 1, and line 2
  sits on top of it**. Rooftop at sunset, or the yard full. It can be video.
- **Subhead:** `Rooftop bar. Four kitchens. Walk in.`
- **Primary CTA:** `What's on tonight` → `/whats-on` (`sunset` pill, black text)
- **Secondary CTA:** `See the yard` → `/the-yard` (outline pill)
- **Mobile:** the two lines stacked, a small photo inset on the left between
  them, and the large photo below. Like theirs.

---

### 3 · WHAT'S ON — *their concepts slider* · **DARK SLAB 1**

`deep` background, entering through a rounded-corner curtain.

- **Centered two-color title** (the «ONZE **FOODTRUCK** CONCEPTEN» gesture):
  `THIS WEEK` in `paper` + `IN THE YARD` in `sunset`.
  Alternate state when closed: `CLOSED TODAY, BACK WEDNESDAY`.
- **Carousel** with circular arrows on the sides, **the neighboring slides peeking in
  cut off** at the edge, and centered pagination dots below.
- Each slide is a card with a **cropped photo and a sticker**: a `TONIGHT` badge if it's
  today, the event title, a short summary and the space where it happens. **Today's goes
  first and larger.** Real events: live music five nights, Bingo on
  Wednesdays, DJ sets on Saturdays.
- **Centered CTA pill below:** `Full calendar` → `/whats-on`
- **Slab footer, over a rule:**
  - Eyebrow `IN THE YARD` · link `All four trucks` → `/food-trucks`
  - `[Names of the four trucks, separated by · ]. The roster rotates, and each truck takes its own orders and its own payment.`
  - `**Happy hour** Wednesday – Friday, 3–6 PM — $4 drafts · $5 house wines · $6 house drinks`

---

### 4 · HOW THIS PLACE WORKS — *their two-column intro*

Light returns through a rounded curtain. `bone`.

- **Left column:** giant display H2 on two lines —
  `FIVE BUSINESSES,` / `ONE SET OF STAIRS.`
- **Right column:** the long paragraph, in Jost Light 20–22 px —
  "It catches people out the first time, so here it is plainly."
- Below, a link with an arrow: `See how the yard is laid out` → `/the-yard`

---

### 5 · THE THREE STEPS — *their «STAP» inside the jagged star*

The reference's most distinctive block. **Giant jagged star in `mint`**,
centered, taking up almost the width of the box, with circular arrows on the sides and
pagination dots. They have six steps; **we have three**.

Inside the star, per slide: the word `STEP` in giant display + a
**small star in `teal600`** with the number, the step title, the paragraph and the
tags.

**01 — `Order at whichever window you want`**
"Four trucks park in the yard and each one is somebody's own business. You order at
the window, you pay that truck. Separate line, separate card, separate receipt."
Tags: `Four independent kitchens` · `Order at the window` · `A tab per truck` · `No table service`

**02 — `Get your drinks upstairs`**
"The Sunset Bar on the roof is ours. Cocktails made that morning, drafts from
breweries twenty minutes away. It's the one tab we run, and the only menu on this
site with prices."
Tags: `Cocktails made daily` · `Local drafts` · `Happy hour Wednesday – Friday, 3–6 PM` · `The one tab we run`

**03 — `Stay for whoever's playing`**
"Live music five nights a week, Bingo on Wednesdays, DJ sets late on Saturdays.
Almost all of it is free and none of it needs a ticket."
Tags: `Live music five nights` · `Bingo Wednesdays` · `DJ sets Saturdays` · `No ticket, no cover`

---

### 6 · DIVIDER PHOTO WITH SEAL — *their image divider*

Full-bleed photo of the yard or the rooftop, with the **very rounded top
corners** of the block above riding over it. On the top left
edge, straddling it, a **slowly spinning circular seal**, with text on a curve:
`ROOFTOP AT RIVERSIDE · BONITA SPRINGS, FL ·` around the truck isotype.

---

### 7 · THREE DOORS — *their «compare» block, from two cards to three*

`bone`. They compare two columns with a **green vs. red dashed border**; we
use the same dashed card language, but they're **three doors, not a
comparison**.

- **Centered two-color title:** `NOT A RESTAURANT.` in `ink` + `THREE OF THEM`
  in `terra`.
- **Subhead:** `A rooftop bar, a yard of independent kitchens, and a venue you can rent. Same address, three different nights.`
- **Three cards in `paper` with a dashed border**, each in a different color —
  `teal600`, `sunset`, `terra`— with a line icon on top:

| Title | Paragraph | Link |
|---|---|---|
| `Four kitchens in the yard` | "Four independent kitchens under the rooftop, each one its own business. You order at the truck — the bar upstairs is ours." | `Meet the trucks` |
| `The bar over the river` | "Craft cocktails made daily, local drafts, and the best west-facing seat in Bonita Springs." | `See the bar` |
| `The whole place, closed` | "The rooftop, the yard, the patio — or the entire venue with the gates shut, and one person coordinating all of it." | `Plan an event` |

On the top edge of the center card, **mounted straddling it, the isotype as a
sticker** — just like their logo over the first column.

---

### 8 · TRUCK MARQUEE — *their client logo marquee*

Horizontal strip in a continuous loop. They put TUI, Siemens, Red Bull. **We
put the four food trucks**: name in display or logo, separated by a dot.
Below, on one line: "The roster rotates, and each truck takes its own orders and
its own payment."

---

### 9 · PHOTO MARQUEE — *their impression marquee*

Horizontal strip of photos with large radii and **uneven heights**, in a slow loop.
Rooftop at sunset, people in the yard, cocktails, the trucks, live music.

---

### 10 · EVENTS — *their cases slider* · **DARK SLAB 2 (first half)**

The dark comes in through a curtain. `deep` background with a **full-bleed photo** behind.

- **Split headline, with a mounted circular badge** (their pink «NEW» badge → our
  `sunset` badge with `PRIVATE EVENTS`):
  `WE CLOSE THE WHOLE PLACE` / `FOR YOU` — the second line in `sunset`.
- **Subhead:** "Holiday parties, client nights, fundraisers and reunions. You get the
  rooftop, the yard and four kitchens — and one person coordinating all of it."
- **Three cards** with a photo on top, a display title and an `→` arrow, with the three
  arguments:
  - "We coordinate the trucks, so you deal with one person and not four vendors"
  - "The bar is ours: open bar, drink tickets or consumption, however you want to run it"
  - "The rooftop, the yard, the patio — or the entire venue with the gates shut"
- **Centered CTA pill:** `Plan your event` → `/events/inquire`

---

### 11 · STATS — *their counters* · **DARK SLAB 2 (second half)**

Still on `deep`, with no cut: it reads as a single slab with Events. Four giant
display numbers that **animate from 0**, with the label below in Jost Light:

| Number | Label |
|---|---|
| `4` | Independent kitchens |
| `5` | Nights of live music |
| `2024` | Open since |
| `$0` | Cover charge |

⚠️ Only these four data points, which are verifiable. **Don't invent metrics.**

---

### 12 · FIND US — *their giant contact block*

Light curtain. `bone`.

- **Headline split across the full width, with the pills inset between the lines** —
  the exact gesture of «VRAGEN? / TREK AAN DE BEL»:
  `DOWNTOWN,` / `ACROSS FROM RIVERSIDE PARK`
  - `mint` pill with the email: `info@eatdrinkparadise.com`
  - **Dashed border** pill with the phone number: `(239) 268-0080`
  - Circular `sunset` button with the Instagram icon
- Below, the three-column grid:
  - **Info card** — eyebrow `Location`: `27333 Old 41 Rd, Bonita Springs, FL 34135` ·
    eyebrow `Parking`: "Street parking on Old 41 and public lots around Riverside
    Park." + link `Details` · button `Get directions`
  - Embedded **map**, with large radii
  - **Hours**, with **two separate sets** (`Bar` and `Trucks`), today's day
    highlighted and a live status like `Open · closes 8 PM` /
    `Closed · opens Wednesday 3 PM`:

| | Bar | Food Trucks |
|---|---|---|
| Monday | Closed | Closed |
| Tuesday | Closed | Closed |
| Wednesday | 3:00 PM – 8:00 PM | 4:00 PM – 8:00 PM |
| Thursday | 3:00 PM – 8:00 PM | 4:00 PM – 8:00 PM |
| Friday | 3:00 PM – 12:00 AM | 4:00 PM – 11:00 PM |
| Saturday | 11:00 AM – 2:00 AM | 12:00 PM – 11:00 PM |
| Sunday | 11:00 AM – 8:00 PM | 12:00 PM – 8:00 PM |

---

### 13 · FOOTER — *their four columns with a rule under each title*

`deep` background. Descriptor on top: "A rooftop bar over a curated food truck park, in
downtown Bonita Springs." · `Bonita Springs, Florida` · CTA `Plan an event`.

Four columns, each title in display with a rule below:

| THE PLACE | EVENTS | GET TO KNOW US | VISIT |
|---|---|---|---|
| Sunset Bar | Private Events | Our Story | Visit Us |
| Food Trucks | Event Spaces | The Experience | Contact |
| The Yard | Corporate | Join Us | FAQ |
| The Market | Holiday Parties | | Gift Cards |
| | Request a Proposal | | |

Agency bottom bar: **Resto Experience — Content, marketing & web design**.

---

## 6. MOTION

Same repertoire as the reference —**GSAP + ScrollTrigger**, its own reveal per
section— with these specific pieces:

- **Hero:** typographic mask reveal, line by line, with stagger; the photo
  comes in with a `clip-path` that opens; the status pill appears last.
- **Hero pill:** the text **rotates** between the venue's states, with a vertical
  roller-style transition.
- **Circular seal:** slow, continuous, infinite rotation.
- **Surface curtains:** on entering and leaving the dark, the next block
  **rises** with its rounded corners riding over the previous one, with `scrub`
  tied to scroll.
- **Marquees:** continuous loop, and they should **react to scroll speed**
  (speed up and change direction) — it's the detail that separates a good marquee
  from a flat `animation: scroll`.
- **Stats:** the four numbers animate from 0 on entering the viewport.
- **Carousels:** drag, snap, circular arrows, and the neighboring slides peeking in
  cut off. On mobile, horizontal scroll with snap.
- **Cards:** hover with a short lift and the dashed border shifting.
- **Page transitions** in the barba.js style.

**If you want to go further than the reference**, the place is the hero: a WebGL /
Three.js plane with a **sunset gradient that advances with scroll** —from midday to
night, which is literally the page's journey— or a shader transition between
photos. A single moment, with purpose, and with a static fallback.

---

## 7. CONSTRAINTS — these must be met, no exceptions

- **`prefers-reduced-motion`**: every animation has its motion-free path; the
  content stays visible and readable without the animation JS. The marquees
  stop.
- **AA accessibility**: the ratios in section 4 are measured, not estimated. Visible
  focus, correct heading hierarchy, 44 px touch targets. The carousels
  need keyboard navigation and can't be the only way to reach the content.
- **Real mobile-first.** Most of the traffic is people standing on the sidewalk on
  Old 41 checking whether there's music tonight. The reference's blocks have to
  degrade to: stacked headlines, carousels to horizontal scroll with snap, cards
  to a single column, and the jagged star shrunk without losing the gesture.
- **Performance:** the marquees and the WebGL can't cost the LCP. Deferred
  loading, and `will-change` only where needed.
- **Nothing proprietary from the reference**: not their mascot, not their logo, not their fonts,
  not their photos, not their client logos.

### What I do NOT want

- The site in a dark key. The reference is; **we are not**: 70–75 % light.
- Their pink, lime or warm black. Our palette, all of it.
- New, invented or translated copy.
- Invented metrics in the stats block.
- The dashed borders and the stickers turned into a mannerism: they're a strong
  accent, used where the mapping calls for them and not on every box.
