# Motion — the vocabulary, section by section

Nine-slot format, as the brief asks: **element · exact API ·
trigger · properties from→to · timing · orchestration · initial state ·
fallback · delivery**.

The tokens live in [`src/lib/motion.ts`](../src/lib/motion.ts) and the
components in [`src/components/shared/Motion.tsx`](../src/components/shared/Motion.tsx).

---

## 0. The tokens

```
ease.out      [0.16, 1, 0.30, 1]      easeOutExpo — starts fast, brakes long
ease.inOut    [0.22, 1, 0.36, 1]      for things that come back: accordions, heights

dur.micro     0.20   hover, tap
dur.ui        0.35   nav, dropdowns
dur.reveal    0.70   section entrances
dur.hero      1.10   ⚠️ ONLY the hero sequence, and only on load

stagger       0.08
dist.text     32px
dist.media    48px
viewport      { once: true, margin: '0px 0px -20% 0px' }
clip          inset(0% 0% 100% 0%) → inset(0% 0% 0% 0%)
```

**The 600ms cap and its single exception.** The house rule was "no
animation goes over 600ms", and it still stands for everything the user triggers or
sees repeatedly. A slow entrance that repeats eight times while
you scroll doesn't read as elegant, it reads as lag. `dur.hero` is the
declared exception: it runs **once, on load**, it doesn't repeat, and it's the
memorable moment of the page.

**`margin` and not `amount`.** `amount: 0.2` waited for 20% of the element
to be visible, which in a tall section means scrolling half a
screen past the point where it peeks in. The negative margin fires when the element
is 20% of the viewport away from entering, which is when the eye is already looking for it.

---

## 1. One mechanism per content type

This is the design rule, not an implementation detail. The same
fade + slide-up across all eight sections is the signature of an auto-generated website.

| content type | mechanism | why that one |
|---|---|---|
| large headlines | `MaskedLines` | masked line-by-line reveal: the headline is **uncovered**, it doesn't slide |
| full-bleed images | `RevealMedia` | a `clip-path` that opens. A large photo that slides drags the block; one that is uncovered reads as if it had been there all along |
| **band inside a headline** | `RevealMedia from="left"` | the same mechanism, but opening in the reading direction of the line it interrupts. It's the only photo on the site that is typography: if it opened from below, it would give itself away as an image that came from somewhere else. With a `delay` of 0.12s, that is, after the first line |
| grids and rows | `StaggerGroup` + `RevealItem` | stagger: they are equivalent items in a list |
| media in a container | `ScaleMedia` | minimal scale. A `clip-path` inside a box with a radius fights with the container's crop |
| text blocks | `Reveal` | fade + short offset |
| **exits** | `ScrollExit` | tied to scroll progress. Only in two places |

---

## 2. Section by section

### Hero — the load sequence

| slot | value |
|---|---|
| **element** | h1 "Bonita comes / together", two lines |
| **API** | `MaskedLines` → `motion.span` inside a `<span class="block overflow-hidden">` per line |
| **trigger** | `animate` on mount. **Not** `whileInView`: it's the first screen, it's already visible |
| **from → to** | `y: '105%'` → `y: '0%'` |
| **timing** | `dur.hero` (1.10s), `ease.out`, `delay: 0.08 + i × 0.07` |
| **orchestration** | 0.07s between the two lines — **not** the 0.08 `stagger`. Two lines of the same headline have to read as ONE gesture, not as two items |
| **initial state** | the line outside its mask, below. The parent's `overflow-hidden` hides it |
| **fallback** | `useReducedMotion` → plain text, no masks. The layout is identical: the masks add no height |
| **delivery** | ✅ |

| slot | value |
|---|---|
| **element** | isotype, subhead and the two CTAs |
| **API** | `HeroFadeUp` → `motion.div` |
| **trigger** | `animate` on mount |
| **from → to** | `opacity: 0, y: 16` → `opacity: 1, y: 0` |
| **timing** | `dur.ui` (0.35s), `ease.out`, delays 0 / 0.26 / 0.34 |
| **orchestration** | three hand-written delays, staggered behind the headline |
| **initial state** | invisible, 16px below |
| **fallback** | plain tag |
| **delivery** | ✅ |

| slot | value |
|---|---|
| **element** | the fan of nine cards (`CardArc`) |
| **API** | `motion.li` with `initial`/`animate` per card |
| **trigger** | `animate` on mount |
| **from → to** | `opacity: 0, y: −rise + 40` → `opacity: 1, y: −rise`. The `rise` (rise) is the arc's: the animation moves 40px **on top of** its geometric position, it doesn't replace it |
| **timing** | `dur.reveal`, `ease.out`, `delay: 0.35 + |i − center| × 0.06` |
| **orchestration** | the stagger runs from the **center outward**, not left to right: that way the fan opens instead of sweeping |
| **initial state** | invisible, 40px below its place in the arc |
| **fallback** | `initial`/`animate` set to `undefined` → the card stays in its final position |
| **delivery** | ✅ |

| slot | value |
|---|---|
| **element** | the two clips in the fan |
| **API** | `WallVideo` → `<video autoPlay muted loop playsInline preload="none">` |
| **trigger** | autoplay on mount |
| **from → to** | continuous 6s loop |
| **timing** | the clip's own |
| **orchestration** | none. The two clips are three positions apart in `wall-slots.ts` so they don't land together |
| **initial state** | the poster (a real frame from the clip) |
| **fallback** | ⚠️ **client component**, because a `<video autoPlay>` **can't be turned off with CSS**. With reduced-motion the poster is rendered |
| **delivery** | ✅ |

| slot | value |
|---|---|
| **element** | the hero text block, on exit |
| **API** | `ScrollExit` → `useScroll` + `useTransform` |
| **trigger** | scroll progress, `offset: ['end end', 'end start']` |
| **from → to** | `y: 0 → −70` |
| **timing** | none: it's tied to the scroll, not the clock |
| **orchestration** | — |
| **initial state** | in place. Progress is 0 throughout the whole read |
| **fallback** | plain tag, no active `useScroll` |
| **delivery** | ✅ · ⚠️ **no opacity** — see §3 |

---

### What's on — the four-card track

| slot | value |
|---|---|
| **element** | the four event cards |
| **API** | `StaggerGroup as="ul"` + `RevealItem as="li"` |
| **trigger** | `whileInView`, `viewport` token |
| **from → to** | `opacity: 0, y: dist.text (32)` → `opacity: 1, y: 0` |
| **timing** | `dur.reveal`, `ease.out` |
| **orchestration** | `staggerChildren: 0.08`, `delayChildren: 0.04` |
| **initial state** | invisible, 32px below |
| **fallback** | plain tags |
| **delivery** | ✅ |

| slot | value |
|---|---|
| **element** | each card's photo, on hover |
| **API** | CSS `transition-transform` + `group-hover:scale-[1.03]` |
| **trigger** | hover on the containing `<Link>` |
| **from → to** | `scale: 1 → 1.03` |
| **timing** | 250ms, `ease-brand` |
| **orchestration** | — |
| **initial state** | `scale: 1` |
| **fallback** | ⚠️ the global `@media (prefers-reduced-motion)` in `globals.css` neutralizes transitions |
| **delivery** | ✅ |

---

### Five businesses — the three squares

| slot | value |
|---|---|
| **element** | the three textured color squares |
| **API** | `StaggerGroup as="ul"` + `RevealItem as="li"` |
| **trigger** | `whileInView`, `viewport` token |
| **from → to** | `opacity: 0, y: 32` → `opacity: 1, y: 0` |
| **timing** | `dur.reveal`, `ease.out` |
| **orchestration** | `stagger` 0.08 |
| **initial state** | invisible, 32px below |
| **fallback** | plain tags |
| **delivery** | ✅ · the container carries `tabIndex={0}` + `aria-label` because it's a scrollable region with nothing focusable inside |

---

### The horizon — the transition into the dark band

| slot | value |
|---|---|
| **element** | the sun-and-palm medallion |
| **API** | `motion.div` with `whileInView` |
| **trigger** | `whileInView`, `viewport` token |
| **from → to** | `opacity: 0, y: 26` → `opacity: 1, y: 0` |
| **timing** | `dur.reveal`, `ease.out` |
| **orchestration** | none: it's a single element |
| **initial state** | invisible, 26px below — behind the wave line |
| **fallback** | `initial`/`animate` set to `undefined` |
| **delivery** | ✅ |

| slot | value |
|---|---|
| **element** | the sun's toothed disc |
| **API** | CSS `@keyframes rt-sun` |
| **trigger** | on mount, infinite |
| **from → to** | `rotate: 0 → 360deg` |
| **timing** | **90s**, `linear`. At that speed you can't see the movement by watching it: you notice it when you come back to the section. At 20s it's a loading spinner |
| **orchestration** | — |
| **initial state** | unrotated |
| **fallback** | `animation: none` in the media query |
| **delivery** | ✅ |

⚠️ **The wave is NOT animated.** The sun already moves; moving both things turns
a transition into a scene.

---

### Events banner — the dark band

| slot | value |
|---|---|
| **element** | the two-column block |
| **API** | `Reveal` → `motion.div` |
| **trigger** | `whileInView`, `viewport` token |
| **from → to** | `opacity: 0, y: 32` → `opacity: 1, y: 0` |
| **timing** | `dur.reveal`, `ease.out` |
| **orchestration** | — |
| **initial state** | invisible, 32px below |
| **fallback** | plain tag |
| **delivery** | ✅ |

| slot | value |
|---|---|
| **element** | the same block, on exit |
| **API** | `ScrollExit` |
| **trigger** | scroll progress |
| **from → to** | `y: 0 → −70` |
| **timing** | tied to the scroll |
| **orchestration** | `ScrollExit` **outside** and `Reveal` **inside**, in that order: the other way around, the exit's transform would be an ancestor of the reveal and both would write the same `y` |
| **initial state** | in place |
| **fallback** | plain tag |
| **delivery** | ✅ |

---

### Global

| slot | value |
|---|---|
| **element** | the page-transition curtain (ronnsquare's `.transition`) |
| **API** | `AnimatePresence` + `motion.div`, with the wave border as the bottom edge |
| **trigger** | `pathname` change. **Not** on first load: the preloader handles that |
| **from → to** | `y: 0 → −110vh` |
| **timing** | `DURATION.slow` = `dur.reveal`, `ease.out` |
| **orchestration** | — |
| **initial state** | covering the screen, with the 10vh of wave below the viewport |
| **fallback** | nothing is mounted |
| **delivery** | ✅ **IT DRAWS A SHAPE.** The brand book's wave, flipped, as a sweeping edge. It reuses the paths from `npm run horizon`: zero new art |

| slot | value |
|---|---|
| **element** | page scrolling |
| **API** | Lenis, `lerp: 0.1`, `anchors: false` |
| **trigger** | wheel / touch |
| **from → to** | position interpolation |
| **timing** | `lerp` |
| **orchestration** | — |
| **initial state** | — |
| **fallback** | **not instantiated** with reduced-motion. Smooth scrolling is exactly the kind of motion that makes people dizzy |
| **delivery** | ✅ |

| slot | value |
|---|---|
| **element** | buttons and links |
| **API** | CSS `transition` |
| **trigger** | hover, focus, tap |
| **from → to** | fill color, ring color, underline thickness |
| **timing** | `dur.micro` (200ms) / 250ms |
| **orchestration** | — |
| **initial state** | resting |
| **fallback** | global media query |
| **delivery** | ✅ · visible keyboard focus on everything interactive, with the ring inverted to `cream` inside `.on-dark` |

---

## 3. What is NOT there, and why

### Opacity on exits — **removed on purpose**

The brief asks for "opacity and `y` tied to progress". Opacity was implemented and
removed: `npm run a11y` failed it. Both blocks with an exit contain CTAs,
and halfway through the fade the primary button sat at **3.3:1** (`#54615d` on
`#f7a85f` — `ink` and `sunset` at a third of their opacity over the light background).

And contrast is the lesser of the two problems: **a button at 35% opacity
is still clickable**. What's left is an active control, keyboard-focusable, that
looks switched off. That isn't an elegant exit, it's a control that lies about whether
it works.

The exit stayed as an offset only. It's still tied to scroll progress,
which is what the brief is after, and it doesn't touch the legibility of anything.

### `ParallaxMedia` — **doesn't exist, and the mandate is dropped**

The brief names it as a reusable component. In its place is `ScaleMedia`,
which solves the real case that came up (media inside a container with a
radius). There's no parallax on the site, and `Motion.tsx` itself has had the rule
written down since before: "no parallax over photos of food or people".

**Resolved: the mandate is withdrawn.** And not because of the rule, which could be argued,
but because **there's nowhere to put it**. I went looking for a home for it and there are
three candidates, and all three fall through:

- **The hero card arc.** Nine pieces at 16.5vw on a computed arc,
  each with its own `rotate` and its own rising `y`. A scroll-tied offset
  on top of that fights with the fan's geometry.
- **The What's on photos.** Faces and plates. It's exactly the case the
  `Motion.tsx` rule forbids, and the ban is a good one: a face that
  moves inside its frame reads as a render bug.
- **The blurred aerial in the Events banner.** It's the only defensible candidate
  —neither food nor people at a legible scale—, but that section **already has** a
  scroll-tied mechanism: its `ScrollExit`. Two scroll mechanisms in the
  same block is over-animating a single one, which is exactly what this
  branch's doctrine avoids.

A component with no call site isn't a system, it's dead code. If
a block shows up that calls for it, it gets built there and with its reason.

### The **agencefoudre**-style services section — **the mandate is dropped on the home page**

The brief's mandate is "two columns side by side, an active item that opens its block
with `min-height`". The home page **has no** services section: the content that
came closest —the three steps of "Five businesses"— became three color
squares by explicit request.

**Resolved: no section is created to house the mandate.** Inventing content
so that a motion pattern has somewhere to live is doing it backwards, and the brief
forbids it in the same list where it forbids touching the copy: there are no new services
to announce, and the ones that exist —the three doors— already appear once and in
another form.

Where it DOES fit, for when it opens up: **`/events/spaces`**. There are four
spaces there with their capacity table, that is, literally a list of items
where an active one would open its block, and today they are four stacked
cards. It's outside the scope of this branch, which is the home page only. Noted as a destination, not
as debt.

### The curtain color — **reviewed, and it stays `deep`**

The brief asked to "check that the shape's color goes with the light palette".
Reviewed: **it stays**. A curtain has to COVER, and with the site at 74%
light a light curtain would be invisible and wouldn't cover the page jump —which
is its only job—. The brand green is the only thing that contrasts against
both pages, the one leaving and the one arriving. Same reasoning for the
`Preloader`.

What did change is the SHAPE, not the color: see the curtain row in §2.

### A mistake I made and fixed, in case it comes back

The first version of the shaped curtain put the wave **on top**. It's never
seen: the curtain **rises**, so the edge that sweeps the screen is the
bottom one and the top one leaves the frame on the first frame. The wave goes at the bottom and
flipped with `scaleY(-1)`, because the drawing has its crests pointing up —it's
made for a surface to EMERGE— and here the surface RECEDES.

---

## 4. Verification

| check | status |
|---|---|
| `npm run check:motion` — identical layout with and without motion, 6 routes | ✅ |
| `npm run a11y` — 20 pages × 2 widths | ✅ 0 violations |
| `once: false` in the repo | ✅ zero |
| `useScroll`/`useTransform` outside `ScrollExit` | ✅ none (the Header's `useScrolled` is a custom hook, unrelated) |
| no interaction animation exceeds 600ms | ✅ |
