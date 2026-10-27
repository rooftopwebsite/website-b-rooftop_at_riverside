# Home redesign + typography + footer: validated design

Date: September 9, 2026. Decisions made with Camila in session.

This document sets WHAT gets built and WHY. The implementation plan is
a separate file.

---

## 1. What Camila asked for, in her own terms

Twelve changes to the home, plus the footer. The external references are
Superside (hero, cards, «Our difference», «Our global team» banner) and two
in-house projects: **yava** for the hours accordion and **the-orient**
for the footer structure and the agency bar.

She approved everything in one pass except the typography, which was discussed separately and
was resolved in section 3.

---

## 2. New home: section order

| # | Section | Component | Status |
|---|---|---|---|
| 1 | Promo banner | `shared/PromoBar.tsx` | **new** |
| 2 | Header + StatusBar | `shared/Header`, `shared/StatusBar` | unchanged |
| 3 | Hero | `sections/Hero.tsx` + `shared/VideoWall.tsx` | **redesigned** |
| 4 | What's on | `sections/WhatsOn.tsx` | **merge** |
| 5 | How this place works | `HomeSections.HowThisPlaceWorks` | subtle redesign |
| 6 | Three doors | `sections/ThreeDoors.tsx` | **merge** |
| 7 | Events banner | `sections/EventsBanner.tsx` | **replaces** |
| 8 | Find us | `sections/FindUs.tsx` | **redesigned** |
| 9 | Footer + AgencyBar | `shared/Footer.tsx`, `shared/AgencyBar.tsx` | **restructured** |

### Removed

- `shared/BrandTrail.tsx`: the brand element that follows the scroll, and its
  mount in `app/layout.tsx`.
- `HomeSections.StoryTeaser`: «Our story» lives at `/our-story`.
- The «Last call» block in the footer.
- `shared/NewsletterForm.tsx` and the `subscribeToNewsletter` action in
  `app/actions.ts`. **`submitEventInquiry` is not touched**; it shares
  `lib/mail.ts`.
- The hero's intent mini cards (`INTENTS`) and `HomeSections.ThreeVerticals`,
  which merge into `ThreeDoors`.
- `HomeSections.FeaturesMarquee`: **pending Camila's confirmation**. It says
  the same thing as the new PromoBar, on the same screen.

---

## 3. Typography: the discussion that was resolved separately

### 3.1 What is actually installed

Read from the internal `name` table of each WOFF2, not from the file name:

| File | Declares | Actually is |
|---|---|---|
| `steelfish-*.woff2` (7 faces) | Steelfish | Steelfish ✅ |
| `bronx-regular.woff2` | Bronx | Bronx, from `Bronx_PersonalUse.otf` |
| `futura-pt-*.woff2` (6 faces) | `Futura PT` | **Futura Cyrillic** |

Two mismatches, which Camila decided to leave **pending and non-blocking** so
she could see the design: she understands the licenses are purchased, and it gets verified
before publishing. See section 8.

`futura-pt-heavy.woff2` is actually the **Demi** face, served with
`font-weight: 600`. The weight ladder doesn't tell the truth and a real Heavy doesn't
exist.

### 3.2 Why it looked cramped

Two concrete causes, neither a matter of perception:

1. **`Heading` forces `font-bold` at every level**
   (`shared/Type.tsx`): every heading on the site is Steelfish Bold. There isn't
   a single heading in Regular.
2. **`--tracking-display: -0.02em`**: negative tracking, inherited from The
   Orient, which uses Lusitana (a serif). `docs/house-tokens.md` already warned about it:
   «The Orient doesn't define negative tracking… Rooftop takes The Orient».

⚠️ Correction to what was first said in the session: the
`tracking-display` class is only applied in **two places** (the hero h1 and the mini
cards). In every other heading the tracking is 0. So the fix isn't
just flipping the token's sign: the tracking has to **reach
every heading**, which today it doesn't.

### 3.3 What changes

**An optical tracking scale, not a single value.** The smaller the size, the more the condensed
face closes up and the more air it needs; a single number leaves the h3 cramped or the h1
falling apart. It is implemented with the sub-tokens of the Tailwind v4 scale
(`--text-*--letter-spacing`), the same mechanism already used by
`--text-d1--line-height`, so each step carries its tracking at every
breakpoint without touching the components:

| Step | Size | Tracking |
|---|---|---|
| `text-hero` | 72px+ | `0.02em` |
| `d1` | 72px | `0.02em` |
| `d2` | 58px | `0.03em` |
| `d3` | 46px | `0.035em` |
| `d4` | 36px | `0.04em` |

`--tracking-display: -0.02em` is removed, along with its two uses.

**Regular weight, never heavy.** `Heading` goes from `font-bold` to `font-normal`
(Steelfish Regular, 400). This is Camila's instruction: «in regular, never in
a heavy weight».

**Steelfish only on h1/h2/h3.** `h4` and card titles leave the display
scale and switch to **Futura PT Medium** (500) in mixed case, with tracking
`0.01em`. They don't go in Bronx: Bronx is all caps with open tracking by
definition (it's the eyebrow face), and in a two-line card title it
becomes illegible. Specifically, `Heading`'s `role="card"` and `level={4}`
stop using `font-display`.

Steps `d5`, `d6` and `d7` **don't get tracking in the scale**, because from
there on they are used by Futura, not Steelfish. The tracking for those cases goes
explicitly in the class.

### 3.4 The headline accent: color, not italics

Camila: «use a color change, not italics, because the brand doesn't use italics». The
mechanism already exists: `MaskedLines accentLast` in the hero paints the second line
in `sunset`.

⚠️ But **`sunset` doesn't work as an accent on light: 2.48:1**. It doesn't even reach the
3:1 required for large text (WCAG 1.4.3). So the accent needs two
colors depending on the surface:

| Surface | Accent color | Contrast |
|---|---|---|
| Light (`paper`, `bone`, `cream`) | **`terra` #a62000** | 7.23:1 · 6.59:1 · 6.47:1 |
| Dark (`deep`) | **`sunset` #f58521** | 4.26:1 |

`terra` is also the color the eyebrows already use (`Eyebrow tone="terra"`), so
no new color enters the palette.

Measured and discarded as an accent on light: `river` 2.43:1 (fails),
`tomato` 3.77:1 (barely passes, large text only), `plum` 13.15:1 and `deep`
10.55:1 (they pass, but the accent gets lost because they're dark like the headline).

---

## 4. Section by section

### 4.1 PromoBar: new

The hero's four facts (`Four food trucks · Rooftop bar · Live music five
nights · Walk in, no reservations`) move up to a banner **above the header**.

- Server component. Single row, bullet separators, on `deep`, ~34px.
- **It's not sticky**: it scrolls away and the header stays on its own.
- The facts come out of the hero, where today they are the `FACTS` row.
- **It goes in `app/layout.tsx`, so it appears on all 23 routes**, just like the
  header and the `StatusBar`. That's what Camila asked for when comparing it to the «Closed
  now», which is also on all of them.

⚠️ **Mandatory consequence**: the header is currently a **floating** pill with a
fixed `top`. The PromoBar pushes it down, so that `top` and the
`padding-top` of the heroes on all 23 routes (`Hero` and `PageHero`) have to be recalculated, or the header
sits on top of the content. It's the least visible work in the whole redesign
and the one that breaks most easily.

### 4.2 Hero: redesigned

Superside shape: big headline, short subhead, **one** CTA, and below it the wall of
pieces.

- **No background photo.** Today it's a full-bleed photo with a `deep` veil at 72%. With the
  wall below, photo and videos compete: Superside sets its tiles on a
  flat background precisely for that reason. It becomes flat `deep` with the isotype on top.
- **Headline**: `Bonita comes together`, with `together` in `sunset` (4.26:1
  on `deep`). Steelfish Regular, `text-hero`, tracking `0.02em`.
- **One-line subhead**, punchy. Camila: «make it get more to the
  point, one punchy sentence with impact». It replaces the current two-line paragraph.

  Proposed copy, **for Camila to approve**: `Rooftop bar. Four kitchens. Walk
  in.` Three verified facts, in three beats, and it answers the «restaurant»
  confusion without explaining it. The current paragraph says the same in 24 words.

  Alternative if one sentence is preferred over three: `A rooftop bar over four food
  trucks. No reservations.`
- **A single CTA**: «What's on tonight». «Plan an event» is already in the header
  as an orange pill; in the hero it was the second door to the same place.

### 4.3 VideoWall: new

Two rows of tiles moving in opposite directions, below the hero headline.

- **3:4 vertical** tiles, ~200px wide, `rounded-card` corners.
- **6 per row, 12 in total.** That's the minimum: with fewer than 6 per row the loop
  visibly repeats on screen at the same time. Ideal is 16 (8 per row).
- Each slot is currently a **gray box with the label «video»**, already wired for
  `<video muted loop playsInline preload="metadata">`. When the clips arrive,
  the `src` is swapped and nothing else.
- **`prefers-reduced-motion`**: no auto-scroll. Manual horizontal scroll
  remains, with the row as a scrollable region accessible by keyboard.

**What's needed from the client**: 12 clips minimum, 3:4 vertical, 4–8 s, no
audio, ~1–2 MB each, `.mp4` H.264.

### 4.4 WhatsOn: merge of «Tonight at the Yard» + «This week»

Camila: «I don't understand the difference, shouldn't it all be one». They merge into one
section with the Superside cards.

- **Superside card**: photo on top, color block below with the title. One color
  per card: `sunset` (black text, 8.26:1), `deep` (cream text), `chalk`
  (ink text). **Never white on orange**: 2.54:1.
- Hover behavior: image zoom to 1.03 and nothing else, 250ms. It's
  what she liked about the Superside cards.
- **The first card is today's**, with a `Tonight` tag. The rest of the week
  keeps its day tag. That way the immediacy isn't lost, which is the reason
  someone comes back to the website.
- Client component: it needs to know what day it is in `America/New_York`, with the
  same fallback pattern `TonightAtTheYard` uses today (the server paints a
  useful state, the real day appears on mount).
- The trucks fallback stays as is: the daily rotation **doesn't exist**
  as data, so it shows the roster and tells the truth.

### 4.5 HowThisPlaceWorks: subtle redesign

Camila: «I like it, but let's redesign it a bit to make it subtler, more current
and with a sophisticated identity». The `PinnedList` mechanism stays; the
finish changes:

- 1px rules instead of 2px.
- Smaller step labels, in Bronx small caps, with no color fill.
- Active title in Steelfish **Regular** with the new tracking, no heavy weight.
- 1px progress rail.
- More air between steps.

### 4.6 ThreeDoors: «Our difference» shape

It merges the hero mini cards and the three dark slabs. The three units
appear **only once** on the home.

- Eyebrow + h2 with the accent in `terra` + a three-column row.
- Each column: small icon in a rounded square, micro-label in
  small caps, title, body, and the link.
- Separated by 1px rules, **not** by heavy cards. It's the gesture
  `docs/design-references.md` already had pending to apply from wework/superside.
- The three icons are drawn as inline SVG in the brand's language. There are no
  bar/music/events icons in `public/`.

### 4.7 EventsBanner: «Our global team» shape

Replaces `ForEventPlanners`. Camila: «make it just a banner, put all that info
on the page where it belongs, not on the home».

Structure measured on `superside.com/our-creative-talent`: dark card with the
image on top (inset, with a radius), then eyebrow, headline with accent, subhead,
and three bars of one line each with the most important points.

- Card in `deep`. Headline with the accent in `sunset`.
- The three items are the already confirmed ones that lived in the section: we coordinate
  the trucks, the bar is ours, the space is yours.
- One CTA to `/events`.

**The three process steps** (`PLANNER_STEPS`: request a proposal → get the
packet → see the spaces) **aren't deleted: they move to `/events`** as a
process block. It's content that today only exists on the home.

### 4.8 FindUs: yava-style accordion

Camila: «like the yava one, each day will be clickable and on click it expands and
shows the opening hours and the food truck hours».

Structure from `yava/app/components/LocationSection.tsx`: map on one side, data
panel on the other, with today highlighted. What gets **added** on top of yava
is the accordion: yava lists the seven days flat.

- Each day is a **native `<details name="hours">`** with its `<summary>`. The
  shared `name` attribute makes the accordion exclusive (opening one closes the
  other) **without a single line of JavaScript**, and it brings focus, keyboard and
  state announcement for free. Inside, `bar` and `trucks` for that day, which already exist in
  `HOURS` (`lib/brand.ts`).

  Where the browser doesn't support `name` on `<details>`, it degrades to seven
  independent disclosures: several can be open at once and nothing more. It's
  an acceptable degradation, not a breakage.
- **Today starts open and highlighted.** Hover doesn't expand: on touch there is no hover
  and the two mechanisms fight each other. Today's `open` is set by a small client
  component on mount, because the day depends on `America/New_York` and the
  server can't know it without risking a cached page with the wrong
  day.
- Address (link to Maps), phone and parking are kept.
- The seven days are rendered on the **server**, so without JS the information
  can still be read: the only thing JS adds is which one starts open.

It stays **only on the home**. The data also lives on `/visit` and `/contact`.

### 4.9 Footer + AgencyBar: restructured

Camila: «it doesn't have the structure we work with at the agency and the agency
footer is missing; the hours, address and phone numbers don't go there».

Shared in-house structure (the-orient, santa-maria, casa-pirul,
pretty-hens): identity column on the left and link columns on the
right.

- **Identity column**: logo, a short subhead and the CTA. **No address,
  no hours, no phone.**
- **Three link columns** adapted to the site's 23 routes, plus socials.
- **Bottom band**: copyright and legal links.
- **New `AgencyBar`**, ported from the-orient: «powered by» pill + Resto
  Experience logo + tagline + year. It requires:
  - copying `resto-experience.svg` to `public/images/agency/`;
  - adding the `AGENCY` constant (url, tagline, year) to `lib/brand.ts`, where
    today there is only `BRAND.credit`.

⚠️ **Accepted consequence**: with the data taken out of the footer, on the other 20
routes the hours and address aren't anywhere. Camila chose this
knowingly: they live on the home, `/visit` and `/contact`.

---

## 5. Motion and accessibility

The vocabulary already set in `docs/layout-motion.md` is respected:

- 600ms cap per animation. The video wall is a continuous loop, not an
  entrance animation: the cap doesn't apply to it, but `prefers-reduced-motion` does.
- `prefers-reduced-motion` turns off: the wall's auto-scroll, the cards' zoom
  and the stagger of the new sections.
- Everything that expands (the FindUs accordion) is a real control, reachable by
  keyboard and with its state announced.

---

## 6. Contrasts to verify

The ones this redesign introduces and that must be measured before closing:

| Combination | Use | Minimum |
|---|---|---|
| `terra` on `paper` / `bone` / `cream` | headline accent | 3:1 (large text) |
| `sunset` on `deep` | headline accent | 3:1 |
| `ink` on `sunset` | orange event card | 4.5:1 |
| `paper` on `deep` | dark event card | 4.5:1 |
| PromoBar text on `deep` | banner | 4.5:1 |
| «video» label on the placeholder gray | wall | 4.5:1 |

---

## 7. Documentation that becomes outdated

- **`docs/design-references.md`** documents `BrandTrail` as the gesture adopted
  from ronnsquare.fr. With it removed, only `PageTransition` remains from ronnsquare.
  This has to be noted with the reason, and the typographic accent from
  wework/superside, which was pending, has to be marked as applied.
- **`docs/house-tokens.md`** sets `--tracking-display: -0.02em` inherited from The
  Orient. Why it's replaced by a positive scale has to be recorded.
- **`src/app/page.tsx`** has the section order commented in the
  header. It gets rewritten.

---

## 8. Pending items that DO NOT block this work

1. **Bronx license.** The source is `Bronx_PersonalUse.otf`. Camila understands
   it's purchased; **verify before publishing**. Also, it was never confirmed
   against page 13 of the brand book which of the three typefaces named
   Bronx is the right one.
2. **`Futura PT` is Futura Cyrillic.** The `@font-face` declares a family that
   isn't what's served. It's left as is by Camila's decision; fix the name before
   publishing.
3. **CSS safety net for the `Preloader`.** It's an opaque full-screen
   curtain whose only exit is a JS timer: if hydration fails, the
   site stays covered. It wasn't the cause of the 9/9 incident (that was the server
   being down) but it's still a real fragility.
4. **`FeaturesMarquee`**: remove it or not. Recommendation: remove it, it says
   the same thing as the PromoBar.

---

## 9. How best to phase it

It's a lot for a single batch, and there's an order that reduces risk. The
typography goes first because it touches all 23 routes and changes how everything
else looks: doing it last would force reviewing each new section twice.

1. **Typography**: tracking scale, Regular weight, Steelfish only on h1–h3,
   the two accent colors. The whole site is reviewed once.
2. **PromoBar + header offset**: the 23-route work, and the one that breaks most
   easily. Better on its own, with visual review.
3. **Hero + VideoWall**.
4. **The home sections**: WhatsOn, ThreeDoors, EventsBanner, FindUs,
   HowThisPlaceWorks, and the removals.
5. **Footer + AgencyBar**, and moving `PLANNER_STEPS` to `/events`.
6. **Documentation**: the three files in section 7.

---

## 10. Verification when done

The scripts the project already has, all of which must pass:

```bash
npm run contrast        # the contrasts from section 6
npm run a11y            # axe on the 23 routes
npm run check:css       # tokens and classes
npm run check:surfaces  # surface rhythm
npm run check:motion    # reduced-motion
npm run build           # types and production build
```

And by eye, in the browser: that the header doesn't sit on top of any hero on the 23
routes, that the wall loops without repeating on screen, and that the FindUs accordion
reads with JS turned off.
