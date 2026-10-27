# Reading the moodboard

The ten files are in `_interno/moodboard/`, out of git since 2026-09-11:
it's client material and is not versioned. They're Pinterest
screenshots, so what gets read is the layout inside, not the screenshot.

**Rule that was applied:** the moodboard is a source of **composition and surface
rhythm**. Not of palette or typography. Where an image only contributes color or
illustration, it's noted as confirmation and not as a source.

**Three are discarded.** I preferred throwing them out to forcing them.

---

## The ones that contribute composition

### `IMG_2905`: "Late Checkout Edit"
- **Composition:** cream base across the whole page. Full-bleed photo hero with the
  headline centered on top. Below, a block of two asymmetric columns (large
  photo + list of three small items). And the strong gesture: the "SERVICES" section
  puts the headline **giant behind** a row of three photos that partially
  cover it. Image/text ratio heavily in favor of the image; generous breathing room.
- **Background change:** a single step, from cream to a slightly warmer cream. The
  rhythm comes from the photos, not from color fields. It's exactly the logic
  a light home page needs.
- **Applies to:** the section title as a **layer**, behind the media, in
  `WhatsOn`. And the row of three with the subhead below each photo, on the
  surface, with no card container.
- **Not taken:** its typography (editorial serif), the centered headline, or the
  blog module.
- **Status:** the row of three without cards is in `ThreeDoors`. The headline
  crossed with the media was built, but in the variant from
  `referencia-dftc/` (the image INSERTED between the two lines, not behind
  them) and in `ThreeDoors` and not in `WhatsOn`: the "Three doors" h2 was already
  split by a period, so the break didn't have to be invented. The
  "headline covered by the photos" version from this image is still unbuilt, and it's a different
  thing: there the text gets lost behind the media on purpose.

### `IMG_2906`: "Bitterroot Bunkhouse"
- **Composition:** full-bleed dark photo hero with the name centered; below, a
  cream section with a **cluster of photos of different sizes, vertically
  offset**, with the text inserted between them. Nothing is aligned to a row.
- **Background change:** between the hero and the light section there's a **narrow brand
  strip** (a ribbon with the name repeated) acting as a joint. There's no hard
  cut.
- **Applies to:** the cluster of uneven photos, versus the row of three identical
  cards `WhatsOn` has today. And the narrow strip as a joint: we already
  have the real piece for that, the wave border in `WaveBorder`.
- **Not taken:** the dark hero (it's what we're reversing), the serif, or the
  handwritten script.

### `IMG_2908`: "The Pineapple Doors", Florida Panhandle rentals
The closest in tone of the ten, and the only one from the same geographic territory.
- **Composition:** cream base. Color fields in **terracotta and peach**, never
  dark. Uppercase, condensed headline in a warm color **on the light color
  field**. Row of three photos at the bottom. A circular seal as an anchor.
- **Background change:** the edges between surfaces are **wavy**, not straight:
  the color field enters the section above with a curve. It's the same
  device as our wave border, used more often and with more confidence.
- **Applies to:** the validation of the whole approach. It confirms that (a) cream
  holds up as the base for the whole page, (b) the wavy edge between surfaces is
  the right separator and not an ornament, (c) a large headline in a warm color
  on a light surface is enough weight: no dark slab is needed.
- **Not taken:** its peach/terracotta palette, the script, or the seal.

### `IMG_2909`: "BAKE Today"
- **Composition:** cream page with **a single saturated slab** (deep red) that
  carries a centered uppercase headline. Below, a marquee strip, and then
  a row of three photos with the label in a **pill** ("STEP 1 · Add water") and the
  body below, on the clean surface.
- **Background change:** cream → color slab → marquee strip → cream. **A single
  marked break across the whole page**, with the marquee cushioning the exit.
- **Applies to:** the dark surface policy, which is the central decision of
  this branch. One break, not five. And the pill labels for the
  `HowThisPlaceWorks` sequence, instead of the teal `01/02/03` that don't read today.
- **Not taken:** the red, the rotated sticker-style pills, or the marquee (it was already
  dropped in this project: `FeaturesMarquee` went away for repeating the `PromoBar`).

### `IMG_2912`: "Casa Coco"
- **Composition:** a **cream panel floating over a warm full-bleed photo**. The
  panel carries the logotype in the center and **four micro-labels anchored to the
  corners**, not stacked above the title. Behind the panel, a hand-drawn pattern
  that **peeks out** past its edges.
- **Background change:** there are no bands. The photo is the background and the light panel is the
  support for the text. It's the clean solution to the problem of putting text over a photo:
  contrast is measured against the panel, not against the photo.
- **Applies to:** the `EventsBanner`, which today solves the same thing with a
  `bg-deep/90` veil over the photo. And the pattern peeking out behind the panel: we have
  the real piece, `public/brand/tile-pattern.svg`, which is barely used today.
- **Not taken:** the peach palette, the logotype script, or the hand-drawn greek-key
  border.

### `IMG_2913`: "Wick" label
- **Composition:** a light card on a colored background with a **palm shadow**
  as the only texture. **Data pairs anchored in the corners** ("NET W. 8 OZ" /
  "EST. 1909"), a circular seal in the center, and a **yellow pill** as the only
  saturated accent. The bottom edge of the card is **scalloped**.
- **Background change:** light card on a color field; the scallop makes the joint.
- **Applies to:** the scalloped edge as the closure of a light panel (we have it
  in the wave border), and above all **the yellow pill**: it justifies
  `cream-deep` (#FDF0B4) existing as a small accent piece and not as a large background,
  which is exactly what the brief asks for. The corner data pairs
  apply to the hours and the address in `FindUs`.
- **Not taken:** the serif with the script, the textured background, or the seal.

---

## The ones that only confirm palette: not a layout source

### `IMG_2910` and `IMG_2911`: tropical cut-paper illustration
`2910`: silhouettes of palm, hibiscus, sun and coral in **a single color** on pale
pink. `2911`: papaya still life with palm fronds in **dark green**, suns
in **orange**, on **cream**.

`IMG_2911` is the proof that the brief's approach holds up: **dark green as the
drawing and typography color, orange as the accent, cream as the base**, and the
result reads warm, light and unmistakably tropical. It's the exact distribution
the table in §1 of the brief asks for, drawn.

Contribution to composition: **none**. There's no layout to read. And since the brief
explicitly forbids taking palette from the moodboard, they remain as confirmation of a
decision already made, not as a source. The cut-paper style is not translated into
new graphics: we already have real brand art (the wave border and the tile,
taken from the Figma) and bringing in a third graphic family would be the same mistake as
bringing in a third typeface.

---

## The ones that are discarded

### `IMG_2904`: dark red branding agency
Full-bleed photo hero in dark red, large grotesque headline, rows of three photos,
card carousel. It's discarded for two reasons: the **luminosity is the opposite**
of what this branch is after, and its central typographic device (one word of the
headline in another color and the rest in gray) is literally the anti-pattern the
brief caps at "a maximum of 2 headlines on the home page". Taking it would reinforce what
we're removing.

### `IMG_2907`: "Voyage", travel template
It carries the "Modified by AI" watermark. It's the full default kit: photo hero
with a search box on top, a row of four icons with micro-labels, three identical photo
cards with the price below, a three-phone mockup. It's exactly the
template look to avoid, and its row of identical cards is the
anti-pattern we're removing from `WhatsOn`. Discarded entirely.

### The phone screenshot itself
All ten are screenshots with a status bar, Pinterest buttons and a blurred
background. None of that chrome goes into any decision.
