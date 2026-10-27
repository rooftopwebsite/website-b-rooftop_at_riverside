# Layout and motion — Rooftop at Riverside

Builds on `docs/house-tokens.md`. In case of conflict, **the measured tokens win**.

---

## Header

| | |
|---|---|
| Height | 67px · 77px from `desk` |
| Position | `fixed`, opaque, shadow on scroll (40px threshold) |
| Logo | full lockup; shrinks from 58px to 42px on scroll |
| Visible nav | Sunset Bar · Food Trucks · What's On · Events · The Yard |
| Mega menu | "More", 8 links with a one-line description, in 2 columns |
| CTAs | `Plan an Event` primary (sunset, black text) · `What's On` secondary (outline) |
| Mobile | **full-screen** menu, list with an arrow per item, the 2 CTAs pinned at the bottom |

**There's no "Book Now"**: the venue is walk-in and doesn't take table reservations.

### Status bar

Stuck under the header, 34px, on cream. One line:
`● Open now | BAR 3PM–8PM | TRUCKS 4PM–8PM`

It's the most asked question about the business and the number one confusion —the two
schedules are different— for 34px of height. Client-side: the server doesn't know what
time it is in Bonita Springs and a cached page would show a stale status.

---

## Footer

Four columns on `#014545`:

1. **Identity** — logo, a positioning line, IG · FB · Google
2. **Contact** — address, phone, `info@`, directions button
3. **Hours** — the **two sets** in adjacent columns. This is where the footer does
   positioning work: showing them together says "the bar and the trucks are different
   things" without a line of copy
4. **Quick links** — Events Packet, Event Spaces, Corporate, Join Us, FAQ,
   Gift Cards, Careers

Bottom band: legal + Resto Experience badge.

⚠️ **`events@` does not go in the footer.** It lives only in the events hub and on
`/contact`: a $20,000 inquiry can't land in the same inbox as a
question about parking.

⚠️ **The logo is inverted to white** (`brightness-0 invert`). The color lockup
has the wordmark in BLACK and it can't be read on deep teal. It's a compromise
until the reversed lockup from the brand book arrives: the orange ring
and the teal wave are lost.

---

## Surface rhythm

- White by default
- At most **2 cream sections** per page
- At most **1 deep teal**
- **Never two colored sections in a row**

Verified on every build: `node scripts/surface-rhythm.mjs`.

The wave border (`<WaveBorder>`) only where the surface really changes, two
or three per page. At every cut it would stop being a brand gesture and become a
background pattern.

It's the brand book's divider, taken from the Figma —page "Elementos", node
2001:2414—, not a drawing of our own. It replaced `<Scallop>`, which was a scallop of
arcs invented while we didn't have the file.

Two things to respect when using it:

- **The color goes on the section BELOW.** The waves have their crests pointing
  up: painted in the color of the section above they would hang upside down.
- **The repeat period is 383.5px, not the 422 the drawing measures.** The
  strip doesn't close on its own; in the file the designer overlaps the copies. Measured
  by rendering 422, 400 and 383.5 side by side: only 383.5 runs without a gap.

---

## Motion vocabulary — nine slots

Lenis for scrolling, Motion for entrances and micro-states. GSAP ended up **unused**:
none of the nine slots needed it, and adding 70 KB for nothing isn't
justified.

| # | Slot | Where | How |
|---|---|---|---|
| 1 | Preloader | global | % with the isotype, curtain exit. Fade 300ms + lift 600ms |
| 2 | Hero entrance | `/` | H1 by lines with a mask, stagger 70ms |
| 3 | Section reveal | global | fade + 24px, once, threshold 20% |
| 4 | Marquee | `/` | CSS loop, pauses on hover and with focus inside |
| 5 | Card hover | trucks, spaces, events | −2px, image ×1.03, title to `#014545` |
| 6 | Event planners sticky | `/` | pure `position: sticky`, only from `lg` |
| 7 | Trucks carousel | `/food-trucks` | native scroll + `scroll-snap`, mouse drag |
| 8 | Counter | `/events` | 25,000–30,000 for the 4th of July. **The only one on the site** |
| 9 | Page transition | global | short curtain, same curve as the preloader |

**Curve:** `cubic-bezier(0.16, 1, 0.3, 1)` · **Cap: 600ms**, no exceptions.

### Verified rules

- No parallax on food or people photos
- No scroll hijacking — Lenis interpolates the wheel, it doesn't change where you land
- No animation exceeds 600ms
- **With `prefers-reduced-motion` the layout is identical**, checked by measuring
  every box with and without the preference: `node scripts/reduced-motion.mjs`

---

## ⚠️ Breakpoint bug we found here

`--breakpoint-desk` was declared in **px** (`1344px`) while Tailwind's
come in **rem**. Tailwind sorts media queries by value, it can't
compare different units, and it emitted the `desk` block **before**
the defaults.

Consequence: `sm:grid-cols-2` beat `desk:grid-cols-4` on a
1440px screen. Measured: the 1344px block fell at byte 39975 and the 40rem one at 40927.

Fixed by switching it to `84rem` (= exactly 1344px). It affected **all**
`sm:`/`md:`/`lg:` + `desk:` combinations on the site, not just the footer.
