# Visual refinement: from «crude» to Superside quality

Date: September 9, 2026. Decisions made with Camila in session.

Camila: «I want you to make everything prettier, more sophisticated, like
superside.com. I want you to analyze the use of color… today ours comes across
as crude, low quality. I want a modern, clean design, mostly white but with
dark sections from the use of the dark green, and the orange only at very key
points».

This document exists so the redesign isn't personal taste. Everything that
follows comes from **measuring both pages with the same tool**, not from looking at them.

---

## 1. What the browser measured

`superside.com` against our home, at 1440px, scrolling the whole page to
trigger everything deferred.

| | Superside | Rooftop today |
|---|---|---|
| Page height | 16,498px | 8,660px |
| **Distinct text colors** | **4** | **8** |
| Dominant text | `#0a211f` ×234 | `#2a2b28` ×31 + `#101418` ×19 |
| Most used text size | **18px** ×74 | **13px** ×159 |
| Display scale | 100px ×52 · 64 · 60 | 112px ×2 · then 46 |
| Radii | 10px ×88 + pills ×13 | 14 ×78 · pill ×21 · 8 ×20 |
| Real shadows | 0 | 0 ✓ |
| Saturated color surface | **none** | **cream, 1,040px tall** |

### The detail that corrects a hasty reading

The first reading was «we use orange 3× denser than the reference»,
counting nodes: 9 against 6. **It's false when measured by area.** The nine are not
equivalent:

| Element | Size | Area |
|---|---|---|
| 3 PromoBar dots | 3×3 | 27 px² |
| 3 footer rules | 28×2 | 168 px² |
| Header CTA | 155×46 | 7,130 px² |
| Hero CTA | 214×54 | 11,556 px² |
| **Event card** | **413×200** | **82,600 px²** |

**A single card is 81% of all the orange on the page.** The problem isn't
the number of uses, it's one big block. Counting nodes would have led to the
wrong solution — removing the little dots and the rules, which are 195 px² across
all six.

### Where the 13px live

Of the 159 nodes, **123 are the `eyebrow` utility**. One small-caps label per section,
per card and per field. The other 26 are explicit `text-[13px]`.

---

## 2. The five causes of the «crude», in order of impact

1. **The page is set in 13px.** The site's most used size is that of
   a label, not of body text. Superside holds 18px.
2. **Two blacks doing the same job** — `#2a2b28` and `#101418` — and neither
   belongs to the palette. Superside's text IS its brand green.
3. **A 1,040px band of saturated yellow.** The reference has no
   mid-tone color surface at all.
4. **An 82,600 px² orange card.** The accent stopped being punctuation.
5. **Five radii competing** (8, 10, 14, 20, pill) against one dominant.

---

## 3. The decisions

### 3.1 A single text color: `#0A1F1E`

Replaces `#2a2b28` (body) and `#101418` (headings). It's a very dark green
derived from `deep`, not a gray: the text comes to belong to the brand, which is
exactly what the reference does with its 234 nodes in `#0a211f`.

Contrast: **16.65:1 on `paper`**, 15.19:1 on `bone`. Plenty of headroom.

⚠️ `--color-body` and `--color-ink` **are not merged into a single token**: dozens
of call sites use them and renaming them would be a huge mechanical change with the risk
of breaking something through a misplaced `sed`. Both point to the same value. The token
`--color-body` stays documented as a historical alias.

### 3.2 The cream band is removed

`WhatsOn` goes from `tone="cream"` to `paper`. The page's rhythm is set by **dark
green and bone**, and nothing else:

```
hero            GREEN
what's on       bone
how it works    bone
three doors     bone
events banner   GREEN  (card inside a bone section)
find us         bone
footer          GREEN
```

It's literally «mostly white with dark sections».

⚠️ With this, `Scallop` —the scallop edge that marked the entry into cream— **is left without
a job**. It's dropped from the home: a scallop between bone and bone doesn't separate
anything.

### 3.3 Orange, by area

It stays **only on the two CTAs**: the header's and the hero's. The orange event
card becomes `deep`.

| | Before | After |
|---|---|---|
| Orange area | 101,481 px² | ~18,700 px² |
| Reduction | | **−82%** |

The micro-accents —the three PromoBar dots and the three footer rules—
stay: 195 px² across all six, and they're what keeps the bone from going mute.

⚠️ The three `WhatsOn` card colors go from `sunset · deep · chalk` to
**`deep · bone · chalk`**. There are still three distinct surfaces, so the
row doesn't flatten; what changes is that the first one stops shouting.

### 3.4 The small caps: from 123 nodes to ~24

**One per section. None per card, none per field.**

Where it disappears, the label becomes **15px in the text color, weight 500**, in
normal case. Specifically they come out of:

- the tags on the `WhatsOn` cards (they stay as text, not as small caps)
- the field labels in `FindUs` — Hours, Address, Phone, Parking
- the kickers of each `ThreeDoors` column
- the footer column labels
- the step labels in `PinnedList`

### 3.5 The body floor goes up

| Role | Today | Proposal |
|---|---|---|
| Main body | 15px | **16px** |
| Secondary | 14px | **15px** |
| Caption / small caps | 13px | 13px (no change, but ~24 nodes) |

### 3.6 From five radii to two

| Token | Today | Proposal |
|---|---|---|
| `--radius-btn` | 8px | **10px** |
| `--radius-input` | 8px | **10px** |
| `--radius-image` | 10px | 10px |
| `--radius-card` | 14px | **10px** |
| `--radius-panel` | 20px | **10px** |
| `--radius-pill` | 9999px | 9999px |

The tokens **are kept as names** —they say what each thing is for— but
they all point to 10px except the pill. If tomorrow something needs to diverge, the
name is already there.

---

## 4. What is NOT touched

- **The typography.** Big Shoulders and Jost stay as they are; the tracking
  scale and the Regular weight too. It was closed two hours ago and it works.
- **The motion.** No change to `Motion.tsx` or to the reveals.
- **The home's structure.** The six sections and their order stay.
- **The content.** Not a single new word.

---

## 5. Verification

Besides the usual battery, this change needs to be **measured the same way it was
diagnosed**: when finished, the analysis has to be run again and the
numbers confirmed.

| Metric | Today | Target |
|---|---|---|
| Text colors | 8 | ≤ 5 |
| 13px nodes | 159 | ≤ 40 |
| Orange area | 101,481 px² | ≤ 25,000 px² |
| Mid-tone color surfaces | 1 (1,040px) | 0 |
| Distinct radii | 5 | 2 |

And the usual guards: `build`, `check:css`, `contrast`, `check:surfaces`,
`a11y`, `check:motion`, `check:seo`.

⚠️ `check:surfaces` counts `cream` sections. When the only one on the home is removed the
guard will stay green, but it's worth looking at the line: if it says `paper ×6`, the
change landed.

---

## 6. Known risk

The site ends up with **less color**. It's what was asked for, and it's the direction of the
reference — but if on seeing it it turns out too sober, the lever to
recover warmth without going back is the **dark green**, not the orange:
add one more section in `deep` rather than reintroduce orange surfaces.
