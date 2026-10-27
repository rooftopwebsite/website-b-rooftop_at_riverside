# Final self-critique

The brief asks for three things I would remove from the design, and to remove one. They go in order of
how much they bother me.

---

## 1 · The sun's perpetual spin — **THIS ONE I REMOVED**

The horizon medallion did two things: it **rose** when it came on screen, once,
and it **spun** 360° every 90 seconds, forever.

The rise stays. The spin is gone, and for three reasons that aren't about taste:

- **It contradicts the motion doctrine of the whole branch.** Every mechanism on the site
  fires once and stays still. `MOTION.md` says so in its first line:
  Superside is the reference for restraint, "animate little, at the right
  moments". An infinite spin is neither little nor a moment — it's a state.
- **It was the only element that never settles.** A page that finishes
  moving reads as finished. With the sun spinning, there's always something running in
  the periphery of your vision, which is precisely the kind of motion that
  `prefers-reduced-motion` exists to switch off. Shipping something you have to defend
  with a media query is a signal.
- **It was MY addition, not the request.** Camila asked "could you animate it too?".
  The rise IS the animation: the sun emerges from behind the wave when the section
  comes in. I put the spin on top, and it didn't explain anything the rise
  didn't already explain.

What remains in the code is the `rt-sun` class without animation and the comment on
why, so it doesn't come back out of inertia. The keyframe is deleted.

---

## 2 · The greek key at 15% on the yellow square — **IT WAS MISDIAGNOSED**

What it said here: that the green at 15% on `cream` shouts louder than the other
two squares, that the opacity was to blame, and that the proof was that the
`deep`/`cream` pair measures 9.44:1.

**The reasoning was wrong.** 9.44:1 is a measure of whether a TEXT is readable, not
of how much a texture weighs, and I used one to talk about the other. I wrote
`design-audit/pattern.mjs` to measure it properly: it composites each pattern over its
own field at its opacity, converts both to CIELAB and returns the ΔE. At
15/15/20% it gave

    01 · deep on cream     ΔL* 9.9   ΔE 11.7
    02 · ink  on sunset    ΔL* 8.0   ΔE 13.4
    03 · cream on deep     ΔL* 14.0  ΔE 15.7

meaning the cream square was the **softest of the three** by both measures.
Lowering its opacity, which is what I was proposing, would have made it disappear.

What actually was wrong was the **cell size**, which I hadn't looked at: at 34px
the greek key is a figure the eye counts one by one, and that's why it competes with the
text. Compared on screen at 34 / 26 / 20 / 15px, **20px** is the point where
it becomes a field without stopping being recognizable —at 15px it's no longer a greek
key, it's just any weave and the brand art is lost—.

Result: cell at 20px across the whole site (What's on had its own override of
26px, meaning the home page showed two scales of the same pattern ten
centimeters apart; it's gone) and the three opacities evened out to ΔE ~14.5 →
19% / 16% / 18%. **The cream square went UP.**

The lesson, which is the one that matters: the fix was found by the script, not the
eye. And the original mistake was also one of method —I took a contrast ratio as
if it measured visual weight— and not of taste.

---

## 3 · The wave appears three times

When I wrote the first self-critique I noted the risk that two wave borders
around the Events banner would read as mannerism. I solved it by putting the
horizon at the entrance and the wave border at the exit — two different pieces for
two different cuts.

And then I used the wave a third time, as the edge of the page-transition
curtain.

Each use is justified on its own, and the reuse is what makes the
brand art feel like a system and not decoration. But three appearances of the same
drawing is the limit: the fourth turns the wave into a background pattern, which is
exactly what the color law forbids. **It's noted as a ceiling, not as
debt.**

---

## What is still wrong and isn't mine

So it doesn't read as if the design is closed:

- ~~**The dark ended up at 25.1%**, a tenth over the ceiling.~~ **Closed: 24.5%.**
  It was closed by the photo band in "Three doors", which added 307px of light page
  with a photo. No square's color had to change.
- **`docs/prompt-claude-design.md` — PATH NOT TAKEN, decided.** It's a
  document of yours that showed up mid-session and that I swept into a commit without
  reading: a complete master prompt that takes defoodtruckclub.nl as a literal
  STRUCTURAL reference —a different block order, dotted borders, circular
  stamps, rounded-corner curtains, marquees, carousels with
  arrows, counters, `bone` as the base surface and "What's on" on a dark
  slab—. I showed it to you with the three options and **you chose to keep it as a reference
  and not touch it** (2026-09-10).

  What stays noted, so the decision isn't lost:

  - Of its five gestures, **one** is built: the split headline with the photo
    inset, in "Three doors".
  - Its hero —split headline with inset photo and a rotating `mint` pill—
    **contradicts** the one you approved later, the card arc. The arc wins:
    it's later and it's yours.
  - Its surface plan puts "What's on" on a dark slab. Ours keeps it
    light and uses the only dark cut in Events. Both meet the 70-75%
    light; they're two different ways of spending it.
  - The document is still in `docs/`. I didn't delete it: if it's ever picked up again, it's
    whole and audited.
- **`Wooftop Wednesdays` still has no photo** because among the 36 delivered there isn't a single
  dog. It's the only marked gap left on the home page.
- **The hero doesn't have the mockup's sky** because the photo doesn't exist.
- **The header logo is a PNG.** There's no vector version of the full-color lockup;
  it's the only thing on the site that doesn't scale.

  All three, plus the other 24 items missing across the whole site, are now in
  **`docs/client-requests.md`**: a single document built by walking through the
  real markers in the code, with where each thing goes, what shows today in its
  place and why there's no replacement. It's the document that gets sent to the client.
- **Five `text-d6` on inner pages** leave the condensed at 22px, below the
  floor of 24. They're outside the scope we agreed on, but it's a rule of the
  type system and not of the home page.
- **Ten uses of the eyebrow style on the home page** against the 3 the brief allows.
  I removed all the ones that announced a section; the ones left are data labels.
  That distinction is my interpretation.
- ~~**`ParallaxMedia` doesn't exist** and the **agencefoudre-style services
  section has no destination**.~~ **Resolved, both are dropped**, with
  the full reasoning in `MOTION.md` §3. In short: I looked for a destination for the parallax
  in the three candidates on the home page and all three fall through —the
  hero fan fights with its own geometry, the What's on photos are faces and plates,
  and the Events banner already has a scroll-tied mechanism—; and the services
  section doesn't get invented content so that a motion pattern has somewhere to
  live. The services one does have a natural destination in `/events/spaces`, which is
  outside the scope of this branch.
- **I didn't open the house's sibling repos** (Zakia, The Orient, Santa María,
  Tre Vele, YAVA) or showdown-social, which the brief lists as reference
  priority #1 and #2. I worked from the moodboard, the external references in §2.1
  and what `docs/house-tokens.md` had already measured from them.

  What I did do, and it closes half the gap: **audit the drift**. The
  resolutions in `house-tokens.md` §11 were made in Phase 1, before
  this branch existed, and nobody had checked whether the branch respects them.
  `house-tokens.md` §12 is that comparison, read from the CSS and the components:
  **seven tokens match and two drift on purpose** —the eyebrow tracking
  (0.24em → 0.12em, the branch's brief asks for it) and the button radius (0–4px →
  pill, which in §11 was marked "to be validated" and was validated the other way)—. Both
  drifts live in a token, so they're reverted by changing a number.

  What's still missing is the FIRST-hand read of the six repos. The
  difference matters: `house-tokens.md` is a measurement of tokens, and what a
  sibling repo can teach that a token table doesn't say is **composition**
  —how they solve a hero, how many different shapes a section has, where
  they put a photo—.
