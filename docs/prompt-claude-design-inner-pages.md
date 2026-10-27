# Master prompt — the inner pages, for Claude Design

> Working document. It gets pasted **in full** as a prompt into Claude Design.
> It's the sibling of [`prompt-claude-design.md`](prompt-claude-design.md), which was the one
> for the **home page** and is already built. This one covers the **nine inner pages**.
> Layout reference: **https://defoodtruckclub.nl/inspiratie/italiaanse-catering**,
> audited on 2026-09-14, block by block and not from memory.
> Copy extracted from the current code (`src/app/*/page.tsx`, `src/content/*`,
> `src/lib/nav.ts`, `src/lib/brand.ts`). System from `src/app/globals.css`,
> `docs/INVARIANTS.md` and `design-audit/VISUAL-DIRECTION.md`.

---

## ROLE AND ASSIGNMENT

You are a senior digital art director. The **home page** of *Rooftop at Riverside*
(Bonita Springs, Florida) is already designed and built with its own system. What's
missing are the **inner pages**, which today are solved with a generic
header and stacked sections, all identical to each other and without a single gesture of the
system the home page does have.

Design **the nine inner pages**, desktop (1440) and mobile (390), taking as a
**structural reference** a real inner page from another site in the industry:
**https://defoodtruckclub.nl/inspiratie/italiaanse-catering**.

That reference matters because it solves the exact problem we have: it's a
**vertical landing page**, long, with a lot of argumentative text, that doesn't read as
a wall of paragraphs because it alternates blocks of a different nature every 400 px.

**How the reference is used:**
- **What we take:** the rhythm of blocks (no block repeats twice in a row), the
  text that lives alongside an image instead of standing alone, the two-column comparison
  table, the testimonial strip, the logo marquee, the card carousel
  at the end, the CTA block and the contact block as the fixed close of every
  inner page.
- **What we change:** all the copy (ours, verbatim), the palette (ours),
  the typefaces (ours) and the content of each block.
- **Nothing proprietary of theirs is taken:** not their mascot, not their logotype, not their
  photos, not their paid fonts, not their client logos.

**Deliver:**
1. The nine complete inner pages, desktop (1440) and mobile (390).
2. **Before the pages: the block kit from section 5.** It's the real
   deliverable. The pages are the kit applied.
3. The motion specification per block.

---

## 1. THE BUSINESS, IN FIVE LINES

A **rooftop bar** over a **yard with four independent food trucks**,
in downtown Bonita Springs, across from Riverside Park. It opened in January
2024, it belongs to the Magnus family, it's local.

- The four trucks are **someone else's businesses**: you order at the window and pay that
  truck. Separate tab, card and receipt. **There's no table service.**
- **The bar upstairs belongs to the venue.** It's the only tab of its own and the only menu with
  prices on the site.
- The place **can be rented in full** for private events.
- Hours: closed Monday and Tuesday. Wed–Thu 3–8 PM. Friday 3 PM–midnight. Saturday 11 AM–2 AM.
  Sunday 11 AM–8 PM. The trucks open an hour later. Happy hour Wed–Fri 3–6 PM.

**The thesis that governs the aesthetic: the site has to be the hour, not the place.**
It's an afternoon and sunset place, not a midnight one. Coming in has to feel
like stepping off the stairs onto the roof at six in the evening in Florida.

**Terminology vetoed by the brief**, neither as copy nor as a concept: «two-story food
truck park», «upper deck», «the ultimate dining experience», and any formula that
makes the place read as a **restaurant**.

---

## 2. WHAT ALREADY EXISTS AND DOESN'T GET REDESIGNED

These pieces are built and the nine inner pages share them. **Don't
redesign them: use them.** They're what makes an inner page read as part of the same
site as the home page.

| Piece | What it is |
|---|---|
| **Header** | Nav on the left, isotype centered in a medallion, `What's On` plus the `Plan an Event` pill on the right. «More» mega-menu in labeled blocks. |
| **Footer** | `deep` slab, four columns with a rule under each title, newsletter inside, agency bar at the bottom. |
| **The horizon** | The brand book wave with the sun medallion emerging. It's the transition from light to dark. Used **once per page**, at the only cut that matters. |
| **The wave border** | The brand book's general divider. It's the transition from dark to light. |
| **The greek-key pattern** | Brand book texture, over flat color blocks. |
| **Spinning circular seal** | Isotype with text on a curve around it, mounted straddling the edge of a photo. |
| **Marquee** | Horizontal strip in a continuous loop that reacts to scroll speed. |
| **Snap carousel** | Circular arrows, neighboring slides peeking in cut off, pagination dots. |
| **Pending card** | The dashed card that marks a data point the client hasn't delivered yet. See section 9. |

---

## 3. THE DIAGNOSIS: WHAT'S WRONG TODAY

This is literal, measured across the nine pages. It's the assignment, stated in reverse.

1. **All nine start identically.** The same header: eyebrow, h1, subhead,
   breadcrumb, and a photo on the side when there is one. No hierarchy among them: the
   highest-earning page comes in the same way as the vendors one.
2. **After the header, everything is the same box.** One section after another,
   alternating white and cream backgrounds, with the same header block and a grid
   of cards below. Eight of the nine have that shape from end to end.
3. **No gesture of the system appears.** Not the horizon, not the wave border, not the
   greek keys, not the seal, not a marquee, not a carousel. All of that lives only on the
   home page, and that's why going from the home page to an inner page the site switches off.
4. **The photography isn't composed, it's inserted.** It comes in as a panel beside
   the h1 and then never appears again on the whole page.
5. **No inner page has a close.** They end on the last section and the footer drops in.
   There's no CTA block or contact block, which is precisely what the
   reference does have and repeats on all its inner pages.

---

## 4. THE REFERENCE, TAKEN APART

Real audit of `defoodtruckclub.nl/inspiratie/italiaanse-catering`, in order.

| # | Block | What it does |
|---|---|---|
| 1 | **Hero** | Large headline over a full-bleed photo, with the vertical's promise in one line. |
| 2 | **Intro with a hugged image** | A long paragraph (about 120 words) with the image placed **inside** the text block, not beside it. The text wraps around it. |
| 3 | **Two argument columns** | Two subheadings of 80 to 110 words each, with three small square images interspersed. |
| 4 | **Four short advantages** | Four subheadings of about 60 words. No cards: subheading and paragraph, one below the other, in two columns. |
| 5 | **Testimonials** | Three real quotes with name and company, in blocks. |
| 6 | **Logo marquee** | The clients, in a continuous horizontal strip. |
| 7 | **Comparison table, dark slab** | «Us» versus «the others», two columns of five rows, each row with an icon and a 15 to 20 word sentence. It's the block with the most visual weight on the page. |
| 8 | **Card carousel** | Nine cards with photo, logo and a «more info» button. The cross-sell toward the other verticals. |
| 9 | **CTA block** | Short headline, about 50 words and the promise of a reply within 4 hours. |
| 10 | **Contact block** | Large, clickable email and phone, plus social media. |
| 11 | **Footer** | Four columns. |

**What we need to steal from it, and it's just one thing: a block never repeats twice
in a row.** Text, text with image, columns, quotes, marquee, dark table,
carousel, CTA, contact. Nine different natures on a single page. Our
inner pages today have just one, repeated eight times.

**What we do NOT copy from it:** its scattered dark key, its serif typography, and the
volume of text. The reference is an SEO landing page with 900 words; we
write short and the copy is already written.

---

## 5. THE BLOCK KIT FOR INNER PAGES

**This is the central deliverable.** I don't want nine standalone pages: I want twelve
blocks that combine, and the nine pages to be different combinations of the
same twelve. Design each one as a piece, with its variants and states, and then assemble
the pages.

| # | Block | What for | Where it's used |
|---|---|---|---|
| **A** | **Inner page header, in three weights** | Today there's only one for all nine. I want **three**: `large` (full-bleed photo with the headline inset, for Events and Sunset Bar), `medium` (headline with an arc of pieces or with the greek-key pattern, no large photo), `small` (typography and a rule only, for Contact and Join Us). | all 9 |
| **B** | **Text with a hugged image** | Block 2 of the reference. A long paragraph with the photo placed inside, not beside it. | Our Story, Market, Game Room |
| **C** | **Two argument columns with small images** | Block 3 of the reference. | Events, Food Trucks |
| **D** | **Numbered step list** | Giant display numeral, title, short paragraph. No card. | Events, Join Us, Market |
| **E** | **Comparison table on a dark slab** | Block 7 of the reference and **the only dark block on the page**. It comes in through the horizon, goes out through the wave border. | Events (us versus a banquet hall), Food Trucks (how you pay here versus how you pay at a restaurant) |
| **F** | **Testimonial strip** | Real quotes with names. **Only where there are real reviews**; if there aren't any, the block isn't used. | Events, Sunset Bar |
| **G** | **Marquee** | Of truck names, photos or logos. | Food Trucks, Market, Game Room, What's On |
| **H** | **Card carousel** | The cross-sell toward the other inner pages: photo, title, one line, arrow. | all 9, at the end |
| **I** | **Menu item with prices** | Row with the name in display, description in body and price on the right, with a dotted rule between name and price. | Sunset Bar, Game Room (the party packages) |
| **J** | **Hard data card** | Capacity, hours, area, starting price. Large number, small label. | Events, Sunset Bar, Game Room |
| **K** | **Closing CTA block** | Short headline, one line, `sunset` pill with black text. **Mandatory on all nine.** | all 9 |
| **L** | **Closing contact block** | Large, clickable email and phone, address, map. **Mandatory on all nine**, above the footer. | all 9 |

**Composition rule, non-negotiable:** no page can use the same block
twice in a row, and none can have fewer than five different natures.

---

## 6. THE SYSTEM — IT ISN'T REDESIGNED, IT'S APPLIED

Everything that follows is measured and in production. Don't change it.

### 6.1 Typography

| Role | Family | Use |
|---|---|---|
| **Display** | **Big Shoulders** (variable 100–900) | UPPERCASE headlines, numbers, prices, menu item names, card titles. |
| **Body and UI** | **Jost** (variable 100–900) | Subheads, paragraphs, nav, buttons, pills, data. |

**The brand has no serif.** Long paragraphs go in **Jost Light (300) at 20–22 px
with 1.6 leading**. The contrast comes from the jump in weight and scale, not from a change
of family.

Scale: Hero `clamp(3.5rem, 9vw, 9rem)` LH 0.88 · H1 `clamp(3rem, 7vw, 6.5rem)`
LH 0.90 · H2 88 px LH 0.92 · H3 40 px LH 1 · Intro 25/1.4 · Lead 22/1.55 ·
Base 16/1.6 · Data 15 · Micro 13 · Caption 12. Eyebrow in UPPERCASE, Jost medium,
tracking 0.12 em. Display titles go **without negative tracking**: Big Shoulders
is already condensed and negative tracking clogs it up.

### 6.2 Color, with the exact hex values

| Token | Hex | Role |
|---|---|---|
| `ink` / `body` | `#0A1F1E` | all ink on light |
| `paper` | `#FFFFFF` | the base surface |
| `bone` | `#FAF6EA` | the second light surface |
| `cream` | `#FDF0B4` | pills and small badges. **Never large backgrounds** |
| `deep` | `#014545` | the page's only dark slab, plus the footer |
| `deeper` | `#013434` | layers inside a dark slab |
| `sunset` | `#F58521` | primary CTA, **with black text** |
| `sunset-deep` | `#D66A0A` | **the accented word inside a headline on light** |
| `mint` | `#C4F2EC` | the large accent shapes |
| `river` | `#0EB6B8` | iconography and pattern. **Never as text** |
| `teal600` | `#028382` | the ✓ marks and the «positive» dashed line |
| `terra` | `#A62000` | the ✗ marks, the «negative» dashed line and errors |
| `muted` | `#487270` | secondary text on light |
| `muted-dark` | `#A8C6C4` | secondary text on dark |
| `fog` | `#DED8C7` | 1 px rules and borders |

**Contrast rules, measured with WCAG 2.1, non-negotiable:**
- `sunset` and `river` **never as text on light** (2.54:1 and 2.50:1). Yes as a fill.
- On an orange or teal fill, text goes in **black**, never in white.
- The headline accent on light is `sunset-deep` (3.54:1), and **only inside a
  display headline**, never in body copy. On dark the accent is `sunset`.
- On `deep`: text in `paper` or `cream`, secondary in `muted-dark`.
- Secondary text **is a token, not an opacity**: an opacity gives a different
  color on each surface and can't be audited.

### 6.3 Surface

**70–75 % light, 20–25 % dark. `sunset` ≤ 5 %, `cream` ≤ 5 %.**

**A single dark zone per page, plus the footer.** On each inner page that zone is
block **E** or the heaviest argument, and there can never be two dark ones in a row.
You enter through **the horizon** and exit through **the wave border**: two different
pieces for the two cuts, not the same one twice.

### 6.4 Measurements

- **1280 px** container, the same as the home page. The inner pages can't have a different
  text width from the home page or the jump shows when navigating.
- **Fluid** gutter: `clamp(24px, 4vw, 56px)`. A floor of 24 on mobile, by explicit request.
- Radii: **24 / 44 / 88 px**, full pills, circles.
- Large breakpoint: **1344 px**.
- The section header block (eyebrow + h2 + subhead) goes at **1040 px**.

---

## 7. THE NINE PAGES

The copy in quotes **is the current copy and is used verbatim**: don't translate, don't
rewrite, don't invent. It's in US English. The order is by business
priority: design Events first.

### 7.1 `/events` — the highest earner, and the one most like the reference

Eyebrow `Private events`. H1 **"Your event, two stories up"**. Subhead: "A rooftop
bar, a gated yard and four independent kitchens in downtown Bonita Springs, ten
minutes from Naples and Estero."

It's the inner page most like the reference and the one that uses the most blocks. Content
that already exists and needs to be composed: what we do ("What we actually do"), the three steps
("Three steps, and the first one takes two minutes"), the event types
(corporate, holiday parties, fundraisers, celebrations), the spaces that
can be rented (rooftop, yard, covered patio, or the whole place with the gates
closed), the game truck, the proof, and the inquiry form.

Blocks: **A-large → C → D → J → E (the dark slab: us versus a banquet hall) →
F → H (the spaces, in a card carousel) → form → K → L**.

The form deserves its own design: today it's the only one on the whole site and it comes in as one
more box. It has to read as the end of an argument, not as an appendix.

### 7.2 `/sunset-bar` — the only page with prices

Eyebrow `The rooftop`. H1 **"Bonita's only rooftop"**. Subhead: "Our bar, and the
only thing here we actually cook up ourselves. Cocktails made daily, drafts from
down the road, and the best west-facing seat in Bonita Springs."

Content: happy hour (Wed–Fri, 3–6 PM: $4 drafts, $5 house wines, $6 house
drinks), signature cocktails, specials, beer and seltzers, wines and bubbles.

Blocks: **A-large (full-bleed rooftop photo) → J (the happy hour as hard data, not
as a paragraph) → I ×4 (the four menus) → B → K → L**.

Block **I** is the fine work on this page: four price lists in a row
are the easiest thing to ruin. Each menu should have its own entrance and the price
should be display, not body.

### 7.3 `/food-trucks` — and each truck's detail page

Eyebrow `The yard`. H1 **"Four kitchens. One yard."** Subhead: "The trucks rotate.
Each one is independently owned, sets its own menu and takes its own payment. We just
give them the yard and the crowd."

Blocks: **A-medium → G (marquee with the names of the four trucks) → roster
carousel → E (how you pay here versus how you pay at a restaurant: it's THE
confusion of the business and deserves the dark slab) → C → K → L**.

**`/food-trucks/[slug]`** is a separate, shorter template: photo, name, what
they cook, when they're here, a link to their menu, and the carousel with the other three.

### 7.4 `/whats-on` — the calendar

Eyebrow `The calendar`. H1 **"What's on this week"**. Subhead: "Live music five nights
a week, Bingo on Wednesdays, and the dogs get their own day. Most of it is free."

It's the recurring-traffic page and the one most viewed standing on the sidewalk:
**mobile rules here**. It has a featured event with a large card, a list view and
a month view. The three forms have to coexist without the page turning into a
control panel.

Blocks: **A-small → featured card → list / month → G (photo marquee) → K → L**.

**There's no per-event detail page.** Decision of 2026-09-15: the calendar shows everything on the
page itself and a ticketed event links **straight out**, to Eventbrite, with an
external link icon and a notice that it opens in a new tab. There's no
`/whats-on/[slug]`. So the featured card and the list row have to say
everything a detail page would say today: what it is, when, where and whether it needs a ticket.

### 7.5 `/game-room` — the second page with prices

⚠️ **Two unconfirmed data points before drawing anything.** First the **name**: the old
site calls it "SWFL's First Gaming Truck" on `/game-lounge`, and if it's a truck and not
a room, the route and the headline change. Second the **quantities**: the brief says 4
PS5, 4 Xbox Series X and 2 Switch 2; the old page says 6 TVs. They don't match. Until
the client confirms, they go with `<PendingData>`: no number of consoles or screens
gets published by eyeballing it.

What's verified, which is the page's skeleton: **$10 per person for the first 30
min** and $5 for each additional 15 min; **2 h party packages at $400 Mon–Thu** (extra
hour $200) and **$500 Fri–Sun** (extra hour $250); Game Coach included; more than 30
games.

It's the **second page with prices** after Sunset Bar, and the only one with policies:
there's its own legal waiver (`/game-zone-waiver`) and another for bar games
(`/bar-games-waiver`) that today redirect to `/our-story#experience` and **need to be
re-pointed here**.

Blocks: **A-medium → B → J (the per-person rate) → I (the party packages) →
policies and waiver → G → K → L**.

Block **I** is reused here on purpose: a party package reads the same as a
drink on the menu, name in display and price on the right. It shouldn't turn into a
rate table.

### 7.6 `/our-story` — the brand, and the questions

Eyebrow `Our story`. H1 **"A Magnus family project"**. Subhead: "The Magnuses are
Bonitians. This corner of Old 41 was an idea in their kitchen for four years before
it was a rooftop."

It absorbed two pages that no longer exist: «The Experience» and the FAQ. Today they're two
more sections and they read as appendices. **The FAQ needs its own form**: it's the most
consulted part of this page (parking, dogs, kids, how ordering works).

Blocks: **A-medium → B → timeline → what was built → giving back to the
community → FAQ in an accordion → K → L**.

### 7.7 `/market` — the vendor market

Eyebrow `Neighborhood Market`. H1 **"The Neighborhood Market"**. Subhead: "A curated
set of local makers showing handmade goods, with the trucks cooking and the bar open
the whole time."

**The vendor form lives here.** Today it's duplicated and orphaned at `/blank`, which
already redirects to `/market`. The conditions go with it, verified: **$30 fee**,
**10×10** space unless approved, first come first served with approval at check-in,
pop-up tents allowed and electricity on request.

Blocks: **A-medium → B → G (marquee of market photos) → D (how to request a
booth) → vendor form → K → L**.

The form isn't an appendix, it's the page's conversion: same treatment as the
Events one, not a gray box at the end.

### 7.8 `/join-us` — musicians and jobs

Eyebrow `Join us`. H1 **to be rewritten**: the current one, "Bring your truck to the yard", no
longer applies (see the notice below). Subhead: "Two ways in, depending on what you
do. Both of them start with an email."

⚠️ **Two lanes, not three. Corrected on 2026-09-15.** The page had a third
lane, "Food truck owners · Pitch your truck", which **we made up ourselves**: the
current site doesn't have, in any of its 23 routes, a truck sign-up form, and
the client never asked for one. It's removed. The two that remain do exist today:

1. **Musicians.** It's the live form from `/entertainment`, which migrates as is: name,
   email, phone, band name, social link, genre, video link, logo (upload, max
   15 MB) and photo.
2. **Jobs.** Employment at the venue.

It's the shortest page and the only one where the cards are fine: what's missing is for
the two lanes to differ from each other and for email not to be the only way out. With two
and not three, the three-column grid falls apart: redo the composition, don't leave a
gap.

Blocks: **A-small → two lanes → D → K → L**.

### 7.9 `/contact` — three inboxes

Eyebrow `Contact`. H1 **"Say hello"**. Subhead: "Three inboxes, so your message lands
with the person who can answer it instead of a shared one."

It has the address (27333 Old 41 Rd, Bonita Springs, FL 34135), the phone number
(239) 268-0080, parking, the map and the hours with **two separate sets**
(bar and trucks) and today's day highlighted.

Blocks: **A-small → the three inboxes → two-set hours → large map → L**.
It's the only page where **L** is the content and not the close: give it the weight that
the main block has on the other eight.

---

## 8. MOTION

Same repertoire as the home page: its own reveal per section, tied to scroll.

- **Header:** typographic mask reveal, line by line, with stagger. The
  photo comes in with a `clip-path` that opens.
- **Surface curtains:** the horizon and the wave border are drawn with `scrub` tied
  to scroll, not with a fade.
- **Marquees:** continuous loop that **reacts to scroll speed**, speeds up
  and changes direction. It's what separates a good marquee from a flat scroll.
- **Circular seal:** slow, continuous, infinite rotation.
- **Hard data (block J):** the numbers animate from 0 on entering the viewport.
- **Comparison table:** the rows come in alternating from both sides.
- **Carousels:** drag, snap, circular arrows, neighboring slides peeking in
  cut off. On mobile, horizontal scroll with snap.
- **Page transitions:** the inner pages are navigated between each other more than from the home page,
  so the transition matters more here than anywhere else on the site.

---

## 9. CONSTRAINTS — these must be met, no exceptions

- **Not a single em dash (—) in the visible copy.** Not in headlines, not in subheads, not in
  alt text, not in SEO titles. It's replaced with a period, comma, colon or
  parentheses, whichever fits the meaning of the sentence. **The en dash
  (–) is kept in ranges**: `3–6 PM`, `Wednesday – Friday`. It's a permanent project rule.
- **Verbatim copy.** Don't translate, don't rewrite, don't invent new copy. If a block
  you propose needs text that doesn't exist, mark it as a gap and say so: don't
  write it yourself.
- **Don't invent data.** No capacities, no prices, no metrics, no reviews. Whatever
  the client hasn't delivered yet goes in a **dashed pending card**, which is
  a piece of the system and also needs to be designed.
- **AA accessibility.** The ratios in section 6.2 are measured, not estimated. Visible
  focus, correct heading hierarchy, 44 px touch targets. A carousel
  can never be the only way to reach the content and it has to be keyboard navigable.
- **`prefers-reduced-motion`:** everything has a motion-free path. The marquees
  stop and the content stays visible and readable without the animation JS.
- **Real mobile-first.** Most of the traffic is people standing on the sidewalk on Old 41
  checking whether there's music tonight. The blocks degrade to: stacked headlines,
  carousels to horizontal scroll with snap, cards to a single column.
- **Photography:** there are 36 real photos of the place and 2 usable clips. There's **no**
  sunset sky, there are **no** dogs, there's **no** set-up private event. Don't
  design a block that depends on a photo that doesn't exist without marking it as a gap.

### What I do NOT want

- The nine pages with the same header. It's the problem we came to solve.
- A page in a dark key. **A single dark slab per page.**
- Cards by default. The reference solves half of its blocks **without**
  cards, and that's where a good part of its breathing room comes from.
- The dashed borders and the stickers turned into a mannerism. They're a strong
  accent: they go where the mapping calls for them and not on every box.
- New, translated or invented copy, or metrics nobody verified.
- Blocks that exist only to fill space. If a page is short, it's short.

---

## 10. HOW I WANT TO SEE THE DELIVERY

1. **The block kit first** (section 5), each block shown as a piece with its
   variants and states, desktop and mobile.
2. **The nine complete pages**, in the order of section 7, each one in desktop
   (1440) and mobile (390), **from end to end**, with the real header and footer.
3. **A composition chart** showing, for all nine, which blocks each one uses
   and in what order, to verify at a glance that none repeats a block twice
   in a row and that none drops below five different natures.
4. **The motion spec** per block, not per page.
