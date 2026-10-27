/**
 * Converts the originals in `public/multimedia/` into the derivatives the site
 * serves.
 *
 *   npm run media
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ WHY THIS STEP EXISTS AND THE ORIGINALS AREN'T USED DIRECTLY.
 *
 * The client's delivery weighs **681 MB**: 36 photos up to 7008×4672 (17 MB
 * each) and 5 videos from 16 to 165 MB. All of that is in `public/`, which means
 * it would travel whole to the deploy even though the site shows small versions —
 * `next/image` optimizes what it SERVES, but the source file still gets published.
 *
 * And the videos can't be used even with the weight fixed: four of the five
 * are in **HEVC**, which only Safari plays. In Chrome and Firefox the
 * `<video>` stays black. They have to be re-encoded to H.264 anyway.
 *
 * So `public/multimedia/` is the INPUT folder —it's in `.gitignore`,
 * just like the font originals in `_interno/fuentes/`— and what gets versioned are the derivatives in
 * `public/images/venue/` and `public/videos/`.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ `.rotate()` without arguments applies the EXIF orientation. Without it, six of
 * the 36 photos come out lying down: they were taken in portrait with the camera turned
 * and the file's height/width doesn't match how they need to be viewed.
 */
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, statSync } from 'node:fs';
import { dirname } from 'node:path';

const IN = 'public/multimedia';
const kb = (p) => Math.round(statSync(p).size / 1024);

/**
 * The photos, with their destination and their crop.
 *
 * `fit: 'cover'` crops at the center. Where the framing matters —a dish, a
 * face— `position` goes in to move the crop.
 */
const PHOTOS = [
  /* ── The hero wall: 3:4 portrait, ~230px tiles on desktop ────────────────
     ⚠️ IT'S TEN PHOTOS AND NOT SEVEN, because of the five videos only two work.
     The other three are social media pieces with burned-in text and someone talking to
     camera: in a 230px tile, muted and looping for 6s, that doesn't read as
     ambiance — it reads as a broken ad. The details are in `docs/media.md`.

     The order of the list matters: they alternate day/night, food/people/place,
     so that two neighboring tiles on the wall are never the same thing. */
  ...[
    ['_RCZ4830.jpg', 'cocktails-rooftop'],
    ['_RCZ5702.JPG', 'live-music-tent'],
    ['_RCZ4336.JPG', 'yard-night-crowd'],
    ['D5F6CEA7-2C91-4C2E-B2D0-3C3BF1E20A93.PNG', 'food-platter'],
    ['_RCZ5884.JPG', 'yard-night-table'],
    ['_RCZ8096.jpg', 'truck-window-day'],
    ['_RCZ4397 (1).JPG', 'bartender'],
    ['_RCZ4382.JPG', 'dancing-night'],
    ['_RCZ8185.jpg', 'guests-yard-day'],
    ['_RCZ4528.JPG', 'sandwich'],
  ].map(([src, name]) => ({
    src,
    out: `public/images/venue/wall-${name}.webp`,
    w: 540,
    h: 720,
    q: 72,
  })),

  /* ── THE HERO PHOTO ─────────────────────────────────────────────────────
     ⚠️ IT'S THE LARGEST IMAGE ON THE SITE AND THE HOME PAGE'S LCP. Everything
     that follows is calibrated for that single spot.

     ⚠️ `venue-aerial.jpg` USED TO BE HERE, AND IT WAS A DESTINATION ERROR. That
     derivative is generated at 1000×667 with quality 70 ON PURPOSE, because its place
     is the background of the Events banner, which paints it with `blur-[22px]`: there the
     detail doesn't exist and a large image would be pure weight. The hero showed it
     SHARP and at full width, i.e. 1000px stretched up to 2576 on a retina
     screen —2.6 times—, and no compression quality fixes an upscale.

     And it had two content problems on top of the technical one: the aerial is of a
     yoga class, with JETSET's tents and pennants, i.e. someone else's
     brand, which is exactly what `docs/media.md` lists as unusable material.

     ⚠️ THE SIZE IS 2576×1200 AND NOT 2080 LIKE THE REST. The hero frame measures
     1288 CSS at its maximum width, so 2576 is exactly 2×: the first value that
     doesn't force `next/image` to stretch on a retina screen. With 2080 the quality ceiling
     stays at 1.61×. It's the only photo on the site that justifies this,
     because it's the only one shown at full width and without a forgiving blur.

     ⚠️ THE RATIO IS 2576/1200, WHICH IS EXACTLY 1288/600, the frame's.
     If it's changed to a «round» value like 2080×970, the component's `fit:'cover'`
     crops a few pixels and the band is no longer the one that was chosen.

     ══════════════════════════════════════════════════════════════════════
     ⚠️ THE COVER WENT FROM NIGHT TO DAY ON 2026-09-16, AND THE REASON IS MEASURABLE.

     Until that date `_RCZ5847` went here, the same truck window at night. The
     client saw it as «very dark compared to the rest of the website» and asked for something
     lighter that didn't clash so much with the page, which runs on `bone`.

     They were right, and by more than meets the eye. Measuring the mean light from 0 to
     255 across the 39 files in `public/multimedia/`:

         _RCZ5847 (the old cover)      37   ← the darkest in the delivery
         the rest of the night shots   86 to 104
         the daytime candidates        90 to 130
         _RCZ8185 (this one)          116

     So it was NOT a night-versus-day problem: it was that particular
     photo, which is a case apart even among the night shots. That's why the
     replacement doesn't change what the cover tells, only when it happens.

     ⚠️ IT'S THE SAME SCENE AS THE PREVIOUS ONE, ON PURPOSE. `_RCZ8185` is people
     ordering at the truck window, just like `_RCZ5847`: it still says
     literally what step 01 says —«order at whichever window you
     want»—. What changes is the light, not the argument.
     ══════════════════════════════════════════════════════════════════════

     ⚠️ THE `focus` OF 0.38 IS NOT CENTERED AND IT WAS CHOSEN ON THE PAGE. The photo
     is a 4000×6000 portrait and the band is 1863 tall, so 4137
     px are left over: the crop decides which photo it is. With the center at 0.38 the band catches
     the woman reaching her hand to the counter, the two waiting their turn, the
     green hedge and the white tents, and it reaches just up to the cloudy sky in the
     upper right corner.

     The two neighbors were tried and dropped: higher (~0.28) the band
     drifts to the awning and the three people only get their caps in; lower
     (~0.50) the sky is lost, which is what gives the frame its air and half its
     light.

     ⚠️ THE TRUCK'S BLACK SIDE IN THE LEFT THIRD IS NOT A DEFECT, IT'S
     WHERE THE CROP GOES. The notch and the «Together» plate fall exactly
     there, and cream over a flat, smooth black is the cleanest contrast the
     plate had among the ten candidates that were mocked up. If the `focus` is ever
     moved, THAT has to be checked again before the center of the frame.

     ⚠️ AND THE ORANGE PLATE STILL DEPENDS ON THE CROP. «Together» rests
     on the notch, i.e. next to the photo and not on top, so the plate's
     contrast doesn't change; but the orange DOES compete with whatever is beside it.
     The warm sunset finalists were dropped because of that: against the ambers
     the plate's edge loses its color. Here it has black and sky, which don't compete.

     ⚠️ AND `PhotoDivider` HAD TO BE TOUCHED. `_RCZ8185` was already served as
     `wall-guests-yard-day.jpg` and that tile was on the home page wall, which means
     the same scene would have appeared twice on the same page. The slot
     switched to `wall-food-platter.jpg`. See the `PHOTOS` note in that file. */
  {
    src: '_RCZ8185.jpg',
    out: 'public/images/venue/hero-truck-window.webp',
    w: 2576,
    h: 1200,
    focus: 0.38,
    q: 76,
  },

  /* ── The /sunset-bar hero: 21:9 ─────────────────────────────────────────
     ⚠️ THIS PHOTO WAS ALREADY ON THE SITE, CROPPED THE OTHER WAY. `_RCZ4830` is
     the four drinks on the rooftop table against the light, and it was served as
     `wall-cocktails-rooftop.jpg` —540×720, portrait— on the home page wall.
     That's why nothing showed up in the list of derivatives for a wide hero, and
     the `/sunset-bar` hero had the gap marked until Camila
     asked: «I'm very sure we have a photo of drinks or of the bar».
     It was there: what was missing was this crop.

     ⚠️ THE ORIGINAL IS PORTRAIT (3799×4749) AND HERE IT'S USED AT 21:9, so the
     band keeps a third of the frame. That makes the `focus` THE
     decision of this entry and not a fine adjustment.

     ⚠️ THE `focus` MOVED FIVE TIMES AND NOT ALWAYS FOR THE SAME REASON. Measured
     on the original, the whole journey:

         0.62 · 21:9 → band 2130..3758   the glasses whole, with their bases
         0.52 · 21:9 → band 1655..3283   «cropped from higher up, so less
                                         of the glasses' base shows»
         0.44 · 21:9 → band 1276..2904   «crop it better, more from the top»
         0.40 · 17:9 → band  894..2906   the band grows taller to cover
                                         the fold, without moving the bottom
         0.56 · 17:9 → band 1653..3665   ← this one

     ⚠️ THE THREE IN THE MIDDLE ARE THE SAME REQUEST —less of the glasses' base— AND THE
     LAST ONE CORRECTS IT. When the band went up to 17:9 keeping the bottom edge,
     the glasses ended up resting against the bottom edge with a third of the frame
     of blurred background above them: technically it met the request and visually
     it read as if the photo had been cut off. Camila, on the page:
     «center the glasses in the image crop».

     ⚠️ CENTERING THEM BRINGS BACK SOME TABLE, and it's unavoidable: the group of glasses
     occupies a fixed band of the original, so putting it in the middle of the band
     forces showing what's below it. What does NOT come back is what had been
     taken out in the first step —the frame doesn't go down to 3758— so the bases
     show resting on the table and not in the foreground.

     ⚠️ 2576×1364 IS 17:9 AT DOUBLE. The `PlateHero` frame tops out at 1288
     wide, so the file goes at 2× for retina screens, just like
     the home page cover. The ratio is calculated so the bottom of the
     photo falls BELOW the fold on a screen 1000px tall: with 21:9 it
     ended at 833 out of 950 and the valance peeked out.

     ⚠️ THERE WERE THREE MORE CANDIDATES —the whole bar (`_RCZ8192`), the bartender
     (`_RCZ4397 (1)`) and the sunset table (`_RCZ4760`)—, mocked up on a
     samples route to choose on the page. This one won and the other three
     were deleted along with their route: they're the only bar photos the
     delivery has, so if another one is needed tomorrow, they're there and the crop
     is redone in one run. */
  {
    src: '_RCZ4830.jpg',
    out: 'public/images/venue/bar-cocktails-wide.webp',
    w: 2576,
    h: 1364,
    focus: 0.56,
    q: 78,
  },

  /* ── The upstairs patio, for the `/our-story` tab ────────────────────────
     ⚠️ IT CAME IN ON 2026-09-23 AND IT WAS THE ONLY SPACE WITHOUT A PHOTO. Camila: «it should be
     a photo of the terrace with tables, I know there is one». It's the table on the
     upstairs terrace, in the sun, with the rooftop's white chairs behind: of the 118 in the
     bank it's the only one showing that floor with tables. The yoga one that was tried
     before is from the downstairs patio. Same 3:4 as the other tabs. */
  /* ⚠️ AND IT WAS REPLACED THE SAME DAY BY A FRAME FROM THE HERO VIDEO. Camila didn't
     find the terrace in the bank but did in the home page video: it's
     second 44.0 of `_interno/video-sitio/home-hero-1080p.mp4` —the table with an
     umbrella against the railing, with Old 41 behind—, extracted to lossless PNG
     and chosen among 56 frames by sharpness (variance of the Laplacian). The
     original is 1920×1080, so the 3:4 derivative comes out of 810×1080 and goes at
     that size: enlarging it would only invent pixels. */
  {
    src: 'terraza-video-44s.png',
    out: 'public/images/venue/patio-rooftop-table.webp',
    w: 810,
    h: 1080,
    position: 'centre',
    q: 82,
  },

  /* ── The `/whats-on` hero photo: the same 17:9 ──────────────────────────
     ⚠️ IT'S THE SECOND DERIVATIVE FOR `PlateHero` AND IT GOES AT THE SAME SIZE as
     the bar's, for the same reason: the frame tops out at 1288 CSS and the file goes
     at 2× for retina. If the frame changes ratio, both change.

     Camila, 2026-09-21: «this hero should be like Sunset Bar's, copy it».
     Copying the hero also means copying its image contract.

     ⚠️ IT'S DAYTIME AND IT'S A DECISION, NOT WHAT HAPPENED TO BE THERE. The first version was the
     middle band of `_RCZ4336` —the night show, with people dancing under
     the lights—, and it was dropped for two things Camila flagged on the page: the
     headline plate was eating the singer's head, and she wanted it in daytime.
     «Change the image to one that doesn't cut off the main person's head
     but still shows an event, if possible a daytime photo».

     ⚠️ THIS ONE HAS NO PROTAGONIST, AND THAT'S WHY IT WORKS. It's the patio full during an
     afternoon event: there's no head in the center the plate can cut,
     and what the plate covers is the canvas and the pennant. Besides, it says «event» without
     needing explanation —the long table, the tent, people standing— which is
     what the page sells.

     ⚠️ THE ORIGINAL IS LANDSCAPE —7008×4672— so an almost whole band comes out of it,
     not a violent crop: `focus: 0.5` leaves the umbrellas above and
     the tables below, and no face gets cut by the edge. */
  {
    src: 'DSC04091.JPG',
    out: 'public/images/venue/whats-on-yard-wide.webp',
    w: 2576,
    h: 1364,
    focus: 0.5,
    q: 78,
  },

  /* ── The `/events` hero photo: the third 17:9 ───────────────────────────
     ⚠️ IT'S THE THIRD DERIVATIVE FOR `PlateHero` and goes at the same size as the
     previous two, for the same reason: the frame tops out at 1288 CSS and the
     file goes at 2× for retina. Camila, 2026-09-21: «the hero should be like the
     secondary pages', like calendar and sunset».

     ⚠️ IT HAD TO BE GENERATED BECAUSE THERE WASN'T ANY. The four photos in
     `public/images/events/` are PORTRAIT —`event-a` is 1365×2048, i.e.
     0.67— and the only two 17:9s in the repo are already the bar's hero and
     whats-on's. Putting a portrait in the landscape frame crops two thirds of its
     height: in `event-a`, which is the family posing under the flag, the middle
     band cuts their faces.

     ⚠️ IT'S DAYTIME AND WITH NO PROTAGONIST IN THE CENTER, which are the two criteria
     Camila already set when choosing the `/whats-on` hero: «change the image to one
     that doesn't cut off the main person's head but still shows an
     event, if possible a daytime photo». Here what the headline
     plate covers is the ceiling and the ducts; the faces are all in the
     bottom half of the band.

     ⚠️ AND IT SAYS «PRIVATE EVENT» WITHOUT EXPLAINING IT: the people seated at the long
     bar are wearing name BADGES. It's an organized event
     happening at the venue, which is exactly what the page sells. The
     other candidates were discarded because of that: `_RCZ5884` is at night and with the
     four faces right under the plate, `_RCZ4336` has a blurred head
     covering the left third, and `DSC04095` is the Fourth of July hot dog
     contest, which is a public party and not a private event.

     ⚠️ REPLACED ON 2026-09-28. Maddie asked for a hero showing people
     having a good time, on desktop and on mobile: with `_RCZ7372` the mobile ended up
     on a drink being handed over. Camila chose `DSC09787`: five friends at the
     rooftop patio table, in daytime, wearing the orange event wristbands.

     ⚠️ THE ORIGINAL IS LANDSCAPE AND SMALL —1616×1080—, so it goes whole at
     3:2 and without enlarging: the frame crops it to 4:3, 16:9 or 17:9 depending on the
     width, always at the center. On mobile `/events` passes `photoMobileRatio=
     "landscape"` and the frame is 3:2: with the usual 4:5 people ended up
     cut off at the sides. Camila, 2026-09-28: «let's make the image on mobile
     shorter, so the subhead and the two CTAs show on screen».

     ⚠️ REPLACED AGAIN ON 2026-09-29. Camila: «the image should be the
     same on every device», so desktop switches to the one with the
     four friends under the umbrellas, same as mobile. The original is
     PORTRAIT (4672×7008): a 4:3 is taken from the full width with the faces in
     the vertical center (`focus: 0.368`), and each frame (4:3, 16:9, 17:9 and the
     band with `max-h`) crops it at the center. The math on why the
     center leaves the heads whole and below the plate at every width
     is in `docs/INVARIANTS.md`, next to `photoKeepFaces`. */
  /* ⚠️ REPLACED ON 2026-10-02 at Chris's request (the umbrellas one
     was the same as Gayborhood's). Original `_interno/fotos/de-camila/
     DSC02165.JPG`, portrait 4672×7008: five friends with orange wigs, at
     night. The faces go from edge to edge, so the crop uses the WHOLE
     width and is never cropped from the side. The heads occupy from 20 % to 46 %
     of the height. With a 4:3 and `focus: 0.333`, in the most landscape frame (16:9, which
     `photoKeepFaces` sets as the cap at lg) the highest head sits at 14 %
     (outside the plate's width) and the lowest chin at 83 %. Camila,
     2026-10-02: «they have air above their heads and one is almost at the edge».
     The plate bites up to 16.3 % between 27.5 % and 72.5 % of the width
     (measured at 768 px); the heads that fall below it start at 21 % or more. */
  {
    src: 'events-party-night.jpg',
    out: 'public/images/events/events-hero.webp',
    w: 2400,
    h: 1800,
    q: 78,
    focus: 0.333,
  },

  /* ── The MOBILE crop of the `/events` hero, 3:2 ─────────────────────────
     Maddie, 2026-09-29: «for mobile, use one that's more centered and with people
     smiling». It comes from the portrait ORIGINAL (see Camila's rule of
     2026-09-28: the mobile is never taken from the desktop band): the four
     friends under the turquoise umbrellas, in daytime, with their faces in the center.
     It goes at 3:2 and not 4:5 because the `/events` mobile frame is still
     the short one («so the subhead and the two CTAs show on screen»); `focus` raises
     the band up to the faces.

     ⚠️ THE HEADS GO WHOLE AND BELOW THE PLATE. Camila, 2026-09-29:
     «heads should never be cut off, we need the faces to always be
     centered and whole in the crop». The headline plate bites up to
     21.5 % of the frame's height at 360 px (measured), so the highest head
     has to start below 26 %. With `focus: 0.35` it starts at 27 %
     and the lowest chin sits at 76 %. If `focus` is changed, measure again. */
  /* Mobile 3:2 of the same photo, from the original. The plate bites 21.5 %
     of the frame at 360 px, between 17 % and 83 % of the width: with `focus: 0.317`
     the highest head starts at 23 % and the lowest chin sits at 81 %. */
  {
    src: 'events-party-night.jpg',
    out: 'public/images/events/events-hero-mobile.webp',
    w: 1080,
    h: 720,
    q: 80,
    focus: 0.317,
  },

  /* ── The `/contact` hero photo: the fourth 17:9 ─────────────────────────
     ⚠️ IT'S THE FOURTH DERIVATIVE FOR `PlateHero` and goes at the same size as the
     previous three: the frame tops out at 1288 CSS and the file goes at 2× for
     retina. Camila, 2026-09-21: `/contact` drops the collage header and opens
     like the others, so it also inherits the image contract.

     ⚠️ IT HAD TO BE GENERATED BECAUSE THERE WASN'T ANY FREE ONE LEFT. The three 17:9s
     there were are already the hero of `/sunset-bar`, `/whats-on` and `/events`. (The
     `wall-yard-night-wide.jpg` that seemed like a candidate was portrait, 540×720,
     and since nobody used it it was deleted on 2026-09-23.)

     ⚠️ IT'S DAYTIME AND WITH NO PROTAGONIST IN THE CENTER, which are the two criteria
     Camila set when choosing the `/whats-on` hero and that were also respected
     in the `/events` one. Here what the headline plate covers is the big window and
     the trees behind; the three faces stay in the bottom half.

     ⚠️ WHY THIS ONE AND NOT THE OTHER TWO CANDIDATES. `_RCZ8015` is the terrace
     seen from above: there's no head at risk, but it's almost empty
     and a page that says «say hello» opening with the place empty reads
     cold. `_RCZ8192` is the whole indoor bar, and it was discarded for the
     opposite reason: full, but with the ceiling, the TVs and the signage
     taking up the whole top third, i.e. right where the plate goes.

     ⚠️ THE ORIGINAL IS PORTRAIT —4000×6000— so a band of
     35 % of the height comes out of it. `focus: 0.422` is what leaves the big window above and the glasses
     of the bar below; centered (0.5) the plate ate the head of the man
     in the foreground, which is exactly what Camila rejected in the
     `/whats-on` hero. */
  {
    src: '_RCZ7197.JPG',
    out: 'public/images/venue/contact-bar-day-wide.webp',
    w: 2576,
    h: 1364,
    focus: 0.422,
    q: 78,
  },

  /* ── The `/join-us` hero photo: the fifth 17:9 ──────────────────────────
     ⚠️ SAME SIZE AND SAME REASON as the previous four.

     ⚠️ IT'S THE PATIO STAGE IN DAYTIME, and it's the only live music shot
     in daylight in the whole delivery. The other two are at night: `_RCZ4336`
     is the singer from behind with his head right under the plate —it had already been
     discarded for that for `/whats-on`— and `DSC02157` is the drummer, almost
     all blurred.

     ⚠️ THE ARTISTS LANE WAS CHOSEN AND NOT THE JOBS LANE, having both.
     The candidate for the other lane was `_RCZ5724`, the bartender serving, and
     it works: with a low `focus` the hat passes below the plate. But it's
     indoors and at night, and the page opens with «play here» in color. It stays
     noted here in case the jobs lane gets split off someday.

     ⚠️ IT'S THE SAME SHOT AS `event-live-music.jpg`, which on `/whats-on` illustrates
     Ross Brown's card. It's a REAL repetition and it's accepted: they're
     different pages and they don't cross on screen. If it bothers, the way out is
     to change the card's, which is small, and not the hero's.

     ⚠️ THE ORIGINAL IS PORTRAIT —4000×6000— and `focus: 0.345` was chosen with the
     plate simulated on top: at 0.5 the hat was split in half. With
     0.345 the plate falls on the tent's canvas and the sky, and the head fits
     whole with air. */
  {
    src: '_RCZ5702.JPG',
    out: 'public/images/venue/join-stage-day-wide.webp',
    w: 2576,
    h: 1364,
    /* ⚠️ 0.46 AND NOT 0.345, since 2026-09-23. Camila: «careful with this image,
       don't cut the person off so much». With 0.345 the band went from the sky to the
       singer's chest; with 0.46 it goes from the hat's brim to the waist, and the
       sky that was left over above becomes body. */
    focus: 0.46,
    q: 78,
  },

  /* ── The `/our-story` hero photo: the sixth 17:9 ────────────────────────
     ⚠️ SAME SIZE AND SAME REASON as the previous five: `/our-story`
     dropped the video header copied from `/over-ons` and opens with `PlateHero`
     like the other inner pages, so it inherits the image contract. The five
     17:9s there were are already the hero of `/sunset-bar`, `/whats-on`, `/events`,
     `/contact` and `/join-us`, so one more had to be made.

     ⚠️ IT'S THE PATIO SEEN FROM ABOVE, and the view is the page's
     argument. `/our-story` tells of a place BUILT IN LAYERS —«a rooftop
     built over a food truck park»—, and this is the only shot in the delivery that
     shows the whole floor plan: the lawn, the pavers, the picnic tables,
     the umbrellas, the Adirondacks and the building's eave coming in from the
     right. It's the plan of the place, not a detail of the place.

     ⚠️ IT HAD BEEN DISCARDED FOR `/contact` AND HERE THE ARGUMENT FLIPS.
     There it was dropped for being «almost empty», because a page that says «say
     hello» opening with the place empty reads cold. This one doesn't greet
     anyone: it tells what the place is made of, and for that the clear patio
     is an advantage. Still, there are six people inside the frame, so it's not
     a photo of a closed place.

     ⚠️ AND IT'S EVERGREEN, which was what ruled out the other finalist.
     `DSC04091` is the patio full of families in daytime and it worked better with the
     headline —«A Magnus family project»— but it's the Fourth of July: there are pennants,
     clothes with the flag and a contest set up in the back. It's exactly the
     reason why the home page band was cropped to remove the Halloween
     spiderwebs: a brand page can't have a date.

     ⚠️ THE ORIGINAL IS PORTRAIT —4000×6000— so a band of
     35 % of the height comes out of it. `focus: 0.44` was chosen with the plate simulated on top: the
     plate falls on the pavers and the benches in the center, which is empty
     surface, and none of the six heads ends up under it. At 0.4 the top edge
     cut the woman in the back at the waist; lower, the lawn
     on the left is lost, which is what makes the floor plan readable. */
  {
    src: '_RCZ8015.jpg',
    out: 'public/images/venue/story-yard-day-wide.webp',
    w: 2576,
    h: 1364,
    focus: 0.44,
    q: 78,
  },

  /* ── The staircase gap photo: 4:5 ───────────────────────────────────────
     ⚠️ `_RCZ5847` is the truck window at night with people ordering. It's
     literally what step 01 says —«order at whichever window you
     want»—, so it replaces `venue-truck-line.jpg`, which was an empty line of
     trucks.

     ⚠️ IT'S STILL NOT USED ANYWHERE, BUT NO LONGER FOR THE PREVIOUS REASON.
     Until 2026-09-16 `_RCZ5847` was the hero, so hanging this derivative
     in any section repeated the scene on the same page. The cover switched
     to `_RCZ8185` in daytime, so that block went away: today it's free material, and
     in fact it's the only night photo of the truck window left on hand.

     The only thing to check before hanging it is whether the section that asks for it
     tolerates a photo with light 37, which is the darkest in the delivery. See the note
     on the cover, above. */
  { src: '_RCZ5847.JPG', out: 'public/images/venue/truck-window-night.webp', w: 900, h: 1125, q: 78 },

  /* ── What's on ──────────────────────────────────────────────────────────
     TODAY's goes at 4:3 and the two small ones at 16:10. */
  { src: '_RCZ5702.JPG', out: 'public/images/venue/event-live-music.webp', w: 1200, h: 900, q: 78 },
  { src: '_RCZ5757.JPG', out: 'public/images/venue/event-yard-night.webp', w: 800, h: 500, q: 78 },
  { src: '_RCZ4382.JPG', out: 'public/images/venue/event-dj-night.webp', w: 800, h: 500, q: 78 },

  /* ── The FLYERS of the two recurring events the client does publish ───────
     ⚠️ THESE TWO DON'T COME FROM THE PHOTO DELIVERY: they were downloaded from the old
     site's calendar on 2026-09-11. They're the pieces the venue publishes for
     each event, and that's why they outrank any generic stock photo:
     they show that date's artist, with their name.

       La Noche   static.wixstatic.com/media/526079_a984abd4e6…~mv2.jpg
       Ross Brown static.wixstatic.com/media/526079_871d24d45b…~mv2.jpg

     ⚠️ THEY'RE NOT PHOTOS, THEY'RE GRAPHICS: 1200×1500 with the text embedded —the
     artist's name, the day, the time and the logo—. That has two
     consequences that have to be respected and that are solved downstream:

       · They're cropped ONLY in scale. 900×1125 is exactly the same 4:5 as the
         original, so the `fit:'cover'` doesn't cut a pixel. If someone
         switches them to 16:10 like the ones beside them, it eats the artist's name.
       · The card that shows them uses `aspect-[4/5]`, not the landscape box
         of the photos. See `EventCard` in `sections/WhatsOn.tsx`.

     ⚠️ And a warning that CAN'T be fixed from here: the La
     Noche flyer has «WWW.EATDRINKPARADISE.COM» printed on it, i.e. the OLD domain.
     Published on the new site, the event promotes the website we're
     replacing. The client has to be asked for the piece without that line, or with
     the new domain. It's noted in `docs/client-requests.md`. */
  { src: 'calendar-la-noche.jpg', out: 'public/images/venue/event-la-noche.webp', w: 900, h: 1125, q: 80 },
  { src: 'calendar-ross-brown.jpg', out: 'public/images/venue/event-ross-brown.webp', w: 900, h: 1125, q: 80 },

  /* ══════════════════════════════════════════════════════════════════════
     THE MARKET MATERIAL: THE HERO AND THE WALL OF SIX.

     ⚠️ THESE SEVEN DON'T COME FROM THE CLIENT'S DELIVERY, just like the two
     flyers above: they were downloaded from `eatdrinkparadise.com/neighborhood-
     market` on 2026-09-22, which is the gallery the venue itself publishes of
     its market days. The 36-photo delivery has NOT A SINGLE ONE of the market: they're
     trucks, bar and music nights. So the alternative wasn't «another
     photo», it was illustrating a page of artisans with photos of something else.

     The originals stay in `public/multimedia/` with a readable name, which is
     the same treatment as `calendar-la-noche.jpg`:

       yard     526079_4e081b3fd5bc…   flowers  526079_9ae6005f4d5b…
       jewelry  526079_3c6d1ce67bba…   boba     526079_d41d2e3f1784…
       picnic   526079_c9806fd3c370…   home     526079_5280a1f9a0ff…
       art      526079_951688ef065d…

     ⚠️ THEY GO TO THEIR OWN FOLDER, `public/images/market/`, AND NOT TO
     `images/venue/`. That folder is the derivative of the CLIENT'S DELIVERY and
     until today it was so without exception; mixing in seven files of another
     origin breaks the only thing that makes the media tree readable. The day
     the client sends their own market photos, they come in here and these go.
     TODO: ask the client for the original market material.
     ══════════════════════════════════════════════════════════════════════ */

  /* ── THE /market HERO: THE SEVENTH 17:9 ──────────────────────────────────
     ⚠️ IT COMES OUT AT 2048 WIDE AND NOT THE 2576 OF THE OTHER SIX HEROES, and it's not
     an oversight: the ORIGINAL measures 2048×1365. Wix doesn't serve anything larger
     —the untransformed URL is already the uploaded file— so 2576 would be an
     upscale of 1.26×, which is exactly what this file criticizes about the
     old home page hero a few lines above. Better sharp and a bit
     smaller: at a 1288 plate it still gives 1.59× density.

     ⚠️ `focus: 0.5` AND NO LOWER. The headline plate sits over the
     top edge of the photo, and what's there is the building's wall and the
     blue tent: empty surface, no face beneath. Lowering the center brings in
     more pavers and loses the tent, which is what makes it read «fair» at a
     glance. */
  { src: 'market-yard.jpg', out: 'public/images/market/hero-yard-wide.webp', w: 2048, h: 1084, q: 78 },

  /* ── THE WALL OF SIX ────────────────────────────────────────────────────
     ⚠️ IT'S TWO SIZES AND NOT ONE, and it's the wall that calls for them: three portraits
     at 4:5 and three landscapes at 4:3, alternated in the grid so the row doesn't
     read as a catalog. It's the same reason why the clothesline in
     `PhotoDivider` has six different heights. The widest tile measures ~410px
     on desktop, so 880/900 covers a retina's 2×.

     ⚠️ THE HERO ONE ISN'T DOWN HERE, and it's the rule already applied in
     slot 2 of `PhotoDivider`: the same scene twice on the same page
     —one at 1288px at the very top and another in a 410 tile— reads as an
     error, not as a repetition. `picnic` takes that spot on the wall.

     ⚠️ `q: 76` and not 72. The tile carries ON TOP a dotted white box 14px
     from the edge —the same one as `PhotoDivider`— and the JPEG's block
     artifacts show right against that thin stroke. Two quality points cost
     ~8 KB per photo and they're what removes it. */
  { src: 'market-jewelry.jpg', out: 'public/images/market/stall-jewelry.webp', w: 880, h: 1100, q: 76 },
  { src: 'market-picnic.jpg', out: 'public/images/market/stall-picnic.webp', w: 900, h: 675, q: 76 },
  { src: 'market-art.jpg', out: 'public/images/market/stall-art.webp', w: 880, h: 1100, q: 76 },
  { src: 'market-flowers.jpg', out: 'public/images/market/stall-flowers.webp', w: 900, h: 675, q: 76 },
  /* ⚠️ HIGH `focus` ON THE PORTRAIT ONE. The crop from 2:3 to 4:5 eats
     340px of height, and centered it takes them equally from top and bottom: here that
     puts the cut right at the vendor's chin. Raising the center
     brings in the whole face and the apron with her stall's logo, which is the
     only thing that says what the stall is. */
  { src: 'market-boba.jpg', out: 'public/images/market/vendor-boba.webp', w: 880, h: 1100, focus: 0.42, q: 76 },
  { src: 'market-home.jpg', out: 'public/images/market/stall-home.webp', w: 900, h: 675, q: 76 },

  /* ── The Events banner background ───────────────────────────────────────
     ⚠️ IT GOES SMALL ON PURPOSE: the component paints it with `blur-[22px]`, so
     detail is irrelevant and a large image would be pure weight. 1000×667 is
     more than enough for a blurred full-width band. It's the aerial of the whole
     patio, which is exactly what sells «we close the whole place». */
  {
    src: 'WhatsApp Image 2026-06-11 at 22.58.56 (1).jpeg',
    out: 'public/images/venue/venue-aerial.webp',
    w: 1000,
    h: 667,
    q: 70,
  },

  /* ── The «Three doors» headline band ─────────────────────────────────────
     ⚠️ IT'S AN EXTREME CROP ON PURPOSE: 4.95:1. The photo goes INTERLEAVED
     between the two lines of the h2, so its job is to read as one more
     line and not as a photo placed next to the text. At that height
     a portrait or 3:2 photo doesn't work: it has to be cropped.

     `_RCZ8192` is the whole upstairs bar with people along it. It was chosen by
     measuring the CROP and not the photo —a contact sheet at 4.7:1 of the 24
     unused candidates—: the line of the bar runs edge to edge, which is
     the only thing that survives a band 200px tall. The other two
     finalists were dropped for that very reason: in `DSC04091` the central band is
     a «Table Reserved» sign, and in `DSC02178` it's cut-off heads.

     And it says what the section says: «it's not a restaurant». A bar full of
     people is NOT a food photo, which is exactly the confusion the block
     corrects.

     ⚠️ FULL-WIDTH CROP AND WITH `focus` AT 0.564, not centered. Above
     the centered band are the ceiling TVs and below are chair
     backs, so the vertical window is very narrow; but lowering the
     center six points brings in the bar and the glassware and takes out the two
     HALLOWEEN SPIDERWEBS hanging on the back wall. An evergreen
     home page can't have a date, and that one did.

     I also tried cropping the ~18 % on the right to remove them: you lose the
     bar running edge to edge, which is the only thing that justifies a
     4.95:1. The vertical adjustment removes them without losing the sweep. */
  {
    src: '_RCZ8192.jpg',
    out: 'public/images/venue/doors-band.webp',
    w: 2080,
    h: 420,
    focus: 0.564,
    q: 74,
  },

  /* ── The photo divider background ────────────────────────────────────────
     ⚠️ `turn: 90` AND IT'S NOT AN ERROR IN THE ORIGINAL. The photo comes in portrait
     (4024×6048) and the palm fronds fall from top to bottom; the band is landscape and
     2.3:1 or wider. Cropped without turning, three or four huge leaves fit
     and it reads as ONE plant photographed up close. Turned, the
     veins run horizontally and the same material reads as TEXTURE,
     which is what the band needs: a surface, not a motif.

     ⚠️ IT GOES WIDER THAN THE REST (1800) because there's no forgiving `blur` here
     —unlike `venue-aerial`— and the leaf is fine detail: at 1000 px
     stretched to full width the veins smear.

     It replaces `wall-yard-night-crowd.jpg`, which was a wall tile of
     540×720 served full screen. See the component's note. */
  { src: 'fondo-hojas.jpg', out: 'public/images/venue/leaf-backdrop.webp', turn: 90, w: 1800, h: 760, q: 68 },
  /* ══════════════════════════════════════════════════════════════════════
     THE SECOND BATCH FROM THE CURRENT SITE — 2026-09-22

     ⚠️ SAME ORIGIN AS THE MARKET AND THE TWO FLYERS: they don't come from the
     36-photo delivery, but from `eatdrinkparadise.com`. Camila: «download all
     the photos from the original website and put them in a folder in the repo». The 81
     ended up in `_interno/fotos/_originales-web/` —which isn't versioned— and
     these nineteen are the ones the new site needed.

     They're downloaded by `node scripts/fetch-old-site-media.mjs`. The originals go to
     `public/multimedia/` with a readable name, which is the treatment
     `calendar-la-noche.jpg` and the seven from the market already had.

     ⚠️ THREE CLOSE OUT PENDING ITEMS THAT WERE WRITTEN IN THE CODE:

       · the gaming truck — the `TODO: ask the client for the gaming truck
         photos` was in `/game-truck` TWICE and in `/events` once.
         Both pages illustrated with a stock joystick;
       · a dog in the patio — item 1 of `docs/client-requests.md`, the
         one blocking the Wooftop Wednesdays card. In the delivery's 36 photos
         there isn't a single dog;
       · the front at night — we didn't have a single photo of the building.
     ══════════════════════════════════════════════════════════════════════ */

  /* ── THE GAMING TRUCK ───────────────────────────────────────────────────
     ⚠️ THEY GO TO `public/images/game-truck/` AND NOT TO `images/venue/`, for the same reason
     the market has its own folder: `venue/` is the derivative of the client's
     delivery and mixing in files of another origin breaks the only thing that makes
     the media tree readable.

     ⚠️ ALL FOUR ARE PORTRAIT AT THE SOURCE except `gt-player`. They were taken
     with a phone and in portrait, so each landscape crop eats height:
     that's why each one carries its measured `focus` and not the default center. */

  /* The `/game-truck` hero, 17:9. It's the whole trailer, branded, open and
     with the cornhole in front: of the four it's the only one that says WHAT IT IS at a
     glance, which is what a hero has to do.

     ⚠️ `focus: 0.33` because the truck lives in the TOP third of the
     original: centered, the crop from 3:4 to 17:9 leaves half a screen of
     pavers and cuts off its roof. Measured against the file, not estimated. */
  { src: 'gt-yard.jpg', out: 'public/images/game-truck/truck-wide.webp', w: 2048, h: 1084, focus: 0.33, q: 78 },

  /* The `/events` banner, 4:3. Here the one that works is the NIGHT one with two
     people playing: the banner doesn't have to explain what a gaming truck is
     —the headline already says it— but why you want one at your party.

     ⚠️ `focus: 0.42` keeps both lit screens AND the heads inside.
     Centered it cuts right at shoulder height and the point is lost. */
  { src: 'gt-inside.jpg', out: 'public/images/game-truck/truck-night.webp', w: 1400, h: 1050, focus: 0.42, q: 78 },
  /* The `/game-truck` hero since 2026-09-23: the same scene as the
     `/events` card —someone playing inside the trailer—, in `PlateHero`'s 17:9.
     Camila: «the image chosen for the hero is really ugly, let's use
     the one we use in events». The closed trailer one (`truck-wide`) is left unused
     in the hero. */
  { src: 'gt-inside.jpg', out: 'public/images/game-truck/truck-inside-wide.webp', w: 2048, h: 1084, focus: 0.45, q: 78 },

  /* The branded side, 3:4. It's the one that lists what the truck does —«daily
     play, private parties, watch parties, tournaments»— written on the panel. */
  { src: 'gt-exterior.jpg', out: 'public/images/game-truck/truck-side.webp', w: 900, h: 1200, q: 78 },

  /* Someone playing, 3:2. The only landscape one of the four. */
  { src: 'gt-player.jpg', out: 'public/images/game-truck/truck-player.webp', w: 1400, h: 933, q: 78 },

  /* ── THE DOG ────────────────────────────────────────────────────────────
     ⚠️ IT'S ITEM 1 OF THE CLIENT REQUESTS AND IT WAS MARKED AS BLOCKING
     for the home page. The brief asked for «someone with their dog at a table, or a dog
     in a truck's line»; the market one is a golden in the patio among the
     stalls, which is the same thing in different clothes.

     ⚠️ THERE ARE TWO AND NOT ONE, because they're for two different places: the
     pomeranian one is a portrait and fits in a 4:5 card; the golden one is a
     scene and works in landscape. */
  { src: 'dog-pomeranian.jpg', out: 'public/images/venue/dog-pomeranian.webp', w: 900, h: 1125, q: 78 },
  { src: 'dog-golden-market.jpg', out: 'public/images/venue/dog-yard-day.webp', w: 1400, h: 933, q: 78 },

  /* ── THE FRONT AT NIGHT ─────────────────────────────────────────────────
     The whole building from the street, with the umbrellas lit and the
     second-floor balcony. It's the only photo that shows the PLACE as
     someone arriving sees it.

     ⚠️ IT COMES OUT IN TWO SIZES: 17:9 to use as a hero and 3:2 for a card. The
     original is 4032×3024, so both are reductions and neither is an upscale. */
  { src: 'venue-front-night.jpg', out: 'public/images/venue/front-night-wide.webp', w: 2048, h: 1084, focus: 0.52, q: 78 },
  { src: 'venue-front-night.jpg', out: 'public/images/venue/front-night.webp', w: 1400, h: 933, q: 78 },

  /* ── LIVE MUSIC ─────────────────────────────────────────────────────────
     ⚠️ FOUR DIFFERENT SCENES AND NOT FOUR TIMES THE SAME ONE. The site had
     a single music photo —the `/join-us` hero one— and the calendar
     publishes music every week. They are: the band with the audience dancing,
     a bass player, the drums against the audience, and a steel
     drums percussionist. Four photos that can't be confused with one another, which is the
     condition for them to work as a per-event image. */
  /* ⚠️ `live-band-crowd.jpg` WAS HERE AND IT WAS DELETED TEN MINUTES AFTER
     generating it: it's the SAME SCENE as `wall-yard-night-crowd.jpg`, which was already
     in the repo from the client's delivery —the singer in a hat from
     behind against the audience, same night, another framing—. Two derivatives of
     the same thing with two different names is exactly how a photo ends up
     repeated in two places on the same page.

     ⚠️ THE NUMERIC COMPARATOR DOESN'T CATCH IT: a 16×16 perceptual hash says
     «different» because the framing changed. This is seen, not measured.

     In its place comes `dj-decks.jpg`, which is a real DJ at the decks and
     was the only DJ photo in the bank. The calendar needed it: there are two
     DJ events and neither had its own image. */
  { src: 'dj-decks.jpg', out: 'public/images/venue/dj-decks.webp', w: 900, h: 1125, focus: 0.42, q: 78 },
  { src: 'live-bass.jpg', out: 'public/images/venue/live-bass.webp', w: 900, h: 1125, focus: 0.42, q: 78 },
  { src: 'live-drums.jpg', out: 'public/images/venue/live-drums.webp', w: 1400, h: 933, q: 78 },
  { src: 'live-steel-drums.jpg', out: 'public/images/venue/live-steel-drums.webp', w: 900, h: 1125, focus: 0.45, q: 78 },

  /* ── THE BAR AND ITS PEOPLE ─────────────────────────────────────────────
     `bar-game-day` is the full room watching the TVs: it's THE photo of
     football Sunday and until today that event was published without any.
     `bar-flight` is someone serving a flight to three guests at the bar. */
  { src: 'bar-game-day.jpg', out: 'public/images/venue/bar-game-day.webp', w: 1400, h: 933, q: 78 },
  { src: 'bar-flight.jpg', out: 'public/images/venue/bar-flight.webp', w: 900, h: 1125, focus: 0.45, q: 78 },

  /* ── THE PATIO AND THE PEOPLE ───────────────────────────────────────────
     ⚠️ `yard-night-friends` IS THE SMALLEST OF THE WHOLE BATCH: the original is
     a 1023×1051 PNG, which means at 900 wide we're already at the limit. It's
     used anyway because it's the only photo of a table of friends eating at
     night, which is exactly what the patio sells. Don't enlarge it. */
  { src: 'yard-night-friends.jpg', out: 'public/images/venue/yard-night-friends.webp', w: 900, h: 900, q: 80 },
  { src: 'guests-group-day.jpg', out: 'public/images/venue/guests-group-day.webp', w: 1400, h: 933, q: 78 },

  /* ── EVENTS ─────────────────────────────────────────────────────────────
     ⚠️ `event-table-set.jpg` WAS HERE FOR AN HOUR AND THEN WENT. I chose it as «the
     table set for a private event», which was exactly what `/events`
     was missing… and `scripts/build-photo-bank.mjs` flagged it as a duplicate of
     `market-home.jpg`, which is already published on `/market` as the home
     decor stall.

     Looked at again with that fact, the photo is the second thing: it's a table set
     at a STALL, on artificial turf and among tents. So publishing it
     on `/events` would have meant using an artisan's stall to illustrate a
     private event at the venue, and also the same image twice on the site
     with two different meanings.

     `/events` still has no photo of a set table. It doesn't get invented.

     Yoga and the Fourth of July are formats the venue does and that don't appear in
     any other photo. */
  { src: 'yard-yoga.jpg', out: 'public/images/events/yard-yoga.webp', w: 1400, h: 933, focus: 0.55, q: 78 },
  { src: 'street-fourth.jpg', out: 'public/images/events/street-fourth.webp', w: 900, h: 1125, focus: 0.45, q: 78 },

  /* ── OCN SEAFOOD ────────────────────────────────────────────────────────
     ⚠️ THIS ONE CAN BE ATTRIBUTED TO A TRUCK, and it's the only one in the batch I
     can: it comes from `/seameonwheels` AND from `/ocn`, which are the same page —
     `/ocn` is a 301 to the other—. So it's the seafood the client
     associates with OCN Seafood Co., which is one of the four current trucks and the
     only one of the three without a photo that has its own material.

     ⚠️ THERE'S NOTHING FOR BUTCHER’S BLVD OR FOR REGGAE KITCHEN. Neither
     had a page on the old site, so assigning them any of the
     loose food photos would be inventing whose dish it is. Both
     still have their `PhotoPending` and their brief. */
  { src: 'ocn-crab-boil.jpg', out: 'public/images/trucks/ocn-seafood-1.webp', w: 800, h: 1000, q: 80 },
];

/**
 * The wall videos. Crop 9:16 → 3:4, no audio, H.264.
 *
 * ⚠️ `start`/`dur` trim the fragment. The originals run 17 to 56
 * seconds and the wall needs short loops: a long clip inside a
 * 230px tile doesn't read as a piece, it reads as a movie seen from far away.
 *
 * ⚠️ NO AUDIO (`-an`), and it's not just weight: an `<video autoplay>` with an audio
 * track doesn't start on its own in any modern browser.
 */
const VIDEOS = [
  /*
   * ══════════════════════════════════════════════════════════════════════
   * ⚠️ ONLY TWO OF THE FIVE DELIVERED ARE USED, and the reason is content,
   * not weight.
   *
   * These two are AMBIENT footage: people dancing at Latin night, and a
   * guitarist playing. Without audio and looping for 6 seconds they still say the
   * same thing they say with sound, which is the proof that they work for a
   * decorative wall.
   *
   * The three discarded ones are SOCIAL MEDIA pieces:
   *   · `Rooftop_4th schedule.mov` opens with a graphic card —«RED WHITE &
   *     MIMOSAS · JULY 4TH · $30 BOTTOMLESS»—. It's an animated flyer: in a
   *     230px tile the text can't be read and nothing is left.
   *   · `Rooftop_Red White Mimosas.mov` and `Gaming Truck.mp4` are someone
   *     talking to camera with burned-in subtitles. Muted, it's a person
   *     moving their mouth in silence — the effect is of a broken video, not of
   *     ambiance.
   *
   * They're not deleted: they stay in `public/multimedia/` and work for social media or for
   * an events page with sound and controls. They're simply not material
   * for this wall. See `docs/media.md`.
   * ══════════════════════════════════════════════════════════════════════
   */
  { src: 'LATIN NIGHT 1.mp4', out: 'public/videos/latin-night.mp4', start: 3, dur: 6 },
  { src: 'GABRIEL KEY 2.mp4', out: 'public/videos/live-music.mp4', start: 6, dur: 6 },
];

/**
 * THE WEBP QUALITY OF EACH PHOTO, MEASURED ONE BY ONE.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ THESE NUMBERS ARE NOT A MATTER OF TASTE: THEY COME FROM A MEASUREMENT. Camila, 2026-09-22:
 * «an optimization of all the images so they're in WebP, without losing
 * quality». The second half of that sentence is the one that rules, so the
 * quality of each file was chosen by checking that it does NOT drop.
 *
 * For each photo the UNCOMPRESSED crop was generated and the SSIM against
 * it was measured for two things: the JPEG the site was publishing, and the WebP at each quality.
 * The number that remained is the MINIMUM WebP quality whose SSIM matches or exceeds
 * the JPEG's. The comment beside it is how much that file slimmed down.
 *
 * ⚠️ THE REFERENCE IS THE ORIGINAL, NOT THE JPEG, AND IT CHANGES THE WHOLE RESULT.
 * Measured against the published JPEG, the WebP seemed to need q95 and WEIGH
 * DOUBLE — but that measures something else: it forces it to faithfully reproduce the JPEG's
 * compression noise, which isn't the photo. Against the uncompressed original,
 * which is the only honest reference, the WebP gains 16 % in weight at equal
 * fidelity. The first measurement would have made us discard the whole change.
 *
 * ⚠️ THAT'S WHY THERE'S NO SINGLE QUALITY FOR ALL. It ranges from 60 to 86 and doesn't follow
 * the JPEG's `q`: `join-stage-day-wide` went down from 78 to 68 without losing anything, and
 * `contact-bar-day-wide` needed 86 so as not to lose. It depends on the grain and
 * the fine detail of each photo, not on the size.
 *
 * If a new photo is added without its measurement, it falls back to the `f.q + 4` at the end:
 * it's conservative —it pays some weight— but it never publishes worse than what there was.
 * ══════════════════════════════════════════════════════════════════════════
 */
const WEBP = {
  'public/images/venue/wall-cocktails-rooftop.webp': 78,  // −15 %
  'public/images/venue/wall-live-music-tent.webp': 68,    // −20 %
  'public/images/venue/wall-yard-night-crowd.webp': 78,   // −7 %
  'public/images/venue/wall-food-platter.webp': 70,       // −20 %
  'public/images/venue/wall-yard-night-table.webp': 64,   // −20 %
  'public/images/venue/wall-truck-window-day.webp': 60,   // −19 %
  'public/images/venue/wall-bartender.webp': 80,          // −10 %
  'public/images/venue/wall-dancing-night.webp': 80,      // −9 %
  'public/images/venue/wall-guests-yard-day.webp': 64,    // −21 %
  'public/images/venue/wall-sandwich.webp': 82,           // −5 %
  'public/images/venue/hero-truck-window.webp': 78,       // −18 %
  'public/images/venue/bar-cocktails-wide.webp': 74,      // −13 %
  'public/images/venue/whats-on-yard-wide.webp': 78,      // −18 %
  'public/images/venue/contact-bar-day-wide.webp': 86,    // −8 %
  'public/images/venue/join-stage-day-wide.webp': 68,     // −17 %
  'public/images/venue/story-yard-day-wide.webp': 78,     // −16 %
  'public/images/venue/truck-window-night.webp': 78,      // −15 %
  'public/images/venue/event-live-music.webp': 80,        // −8 %
  'public/images/venue/event-yard-night.webp': 80,        // −12 %
  'public/images/venue/event-dj-night.webp': 84,          // −4 %
  'public/images/venue/event-la-noche.webp': 74,          // −27 %
  'public/images/venue/event-ross-brown.webp': 84,        // −18 %
  'public/images/market/hero-yard-wide.webp': 80,         // −19 %
  'public/images/market/stall-jewelry.webp': 76,          // −23 %
  'public/images/market/stall-picnic.webp': 64,           // −18 %
  'public/images/market/stall-art.webp': 72,              // −22 %
  'public/images/market/stall-flowers.webp': 70,          // −22 %
  'public/images/market/vendor-boba.webp': 84,            // −12 %
  'public/images/market/stall-home.webp': 74,             // −22 %
  'public/images/venue/venue-aerial.webp': 60,            // −20 %
  'public/images/venue/doors-band.webp': 70,              // −21 %
  'public/images/venue/leaf-backdrop.webp': 72,           // −14 %
  'public/images/game-truck/truck-wide.webp': 80,         // −16 %
  'public/images/game-truck/truck-night.webp': 82,        // −9 %
  'public/images/game-truck/truck-side.webp': 68,         // −24 %
  'public/images/game-truck/truck-player.webp': 82,       // +1 %
  'public/images/venue/dog-pomeranian.webp': 82,          // −10 %
  'public/images/venue/dog-yard-day.webp': 80,            // −15 %
  'public/images/venue/front-night-wide.webp': 78,        // −11 %
  'public/images/venue/front-night.webp': 68,             // −21 %
  'public/images/venue/dj-decks.webp': 82,                // −8 %
  'public/images/venue/live-bass.webp': 82,               // −8 %
  'public/images/venue/live-drums.webp': 86,              // −9 %
  'public/images/venue/live-steel-drums.webp': 84,        // −10 %
  'public/images/venue/bar-game-day.webp': 82,            // −18 %
  'public/images/venue/bar-flight.webp': 68,              // −25 %
  'public/images/venue/yard-night-friends.webp': 82,      // −15 %
  'public/images/venue/guests-group-day.webp': 82,        // −15 %
  'public/images/events/yard-yoga.webp': 68,              // −19 %
  'public/images/events/street-fourth.webp': 68,          // −20 %
  'public/images/trucks/ocn-seafood-1.webp': 68,          // −16 %
};
const ensureDir = (p) => mkdirSync(dirname(p), { recursive: true });

let totalIn = 0;
let totalOut = 0;

console.log('── PHOTOS ─────────────────────────────────────────────────────');
/* `node scripts/build-media.mjs <text>` regenerates only the photos whose destination
   contains that text, and skips the videos. */
const ONLY = process.argv[2];

for (const f of PHOTOS) {
  if (ONLY && !f.out.includes(ONLY)) continue;
  const src = `${IN}/${f.src}`;
  if (!existsSync(src)) {
    console.error(`  ✗ original missing: ${f.src}`);
    continue;
  }
  ensureDir(f.out);
  let pipe = sharp(src).rotate();

  /*
   * ⚠️ `turn` is an EXPLICIT quarter turn, and it goes AFTER the EXIF `.rotate()`
   * on purpose: first the photo is put the way it was taken, and only
   * then is it laid down. The other way around, a photo with EXIF orientation would end up
   * turned 180° too far.
   *
   * And it goes BEFORE the `focus`/`resize`, because both measure on the height of the
   * already-oriented image.
   */
  if (f.turn) pipe = pipe.rotate(f.turn);

  /*
   * ⚠️ `focus` is a FINE vertical crop, and it exists because sharp's `position`
   * only accepts the nine gravities —`top`, `centre`, `bottom`…— and in a
   * 4.95:1 crop the jump from `centre` to `bottom` is a thousand pixels: one
   * leaves you the ceiling and the other the chair backs.
   *
   * It's the fraction of the height where the band's CENTER goes. 0.5 is `centre`.
   */
  if (f.focus !== undefined) {
    const meta = await pipe.metadata();
    const { width, height } = meta.autoOrient ?? meta;
    const bandHeight = Math.min(height, Math.round((width * f.h) / f.w));
    const top = Math.max(0, Math.min(height - bandHeight, Math.round(height * f.focus - bandHeight / 2)));
    pipe = pipe.extract({ left: 0, top, width, height: bandHeight });
  }

  await pipe
    .resize(f.w, f.h, { fit: 'cover', position: f.position ?? 'centre' })
    .webp({ quality: WEBP[f.out] ?? f.q + 4, effort: 6 })
    .toFile(f.out);
  totalIn += kb(src);
  totalOut += kb(f.out);
  console.log(`  ${f.out.replace('public/', '')}  ${f.w}×${f.h}  ${kb(src)} KB → ${kb(f.out)} KB`);
}

console.log('\n── VIDEOS ─────────────────────────────────────────────────────');
for (const v of ONLY ? [] : VIDEOS) {
  const src = `${IN}/${v.src}`;
  if (!existsSync(src)) {
    console.error(`  ✗ original missing: ${v.src}`);
    continue;
  }
  ensureDir(v.out);
  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-loglevel', 'error',
      '-ss', String(v.start),
      '-t', String(v.dur),
      '-i', src,
      /* 9:16 → 3:4 cropping at the center, and then to 480×640. `-2` lets
         ffmpeg pick the corresponding even dimension. */
      '-vf', 'crop=iw:iw*4/3,scale=480:640,fps=24',
      '-an',
      '-c:v', 'libx264',
      '-profile:v', 'main',
      '-pix_fmt', 'yuv420p',
      '-crf', '30',
      '-preset', 'slow',
      /* `faststart` moves the index to the beginning of the file: without it the
         browser has to download the whole file before the first frame. */
      '-movflags', '+faststart',
      v.out,
    ],
    { stdio: ['ignore', 'ignore', 'inherit'] },
  );

  /* The poster: the first frame, so the tile shows something before the
     video loads and with `prefers-reduced-motion`. */
  /*
     ⚠️ THE POSTER IS EXTRACTED BY FFMPEG BUT WRITTEN BY SHARP, and the detour has a
     reason: it goes in WebP like the rest of the images, and ffmpeg's `-q:v`
     isn't the same quality scale as `WEBP`'s. Going through a lossless
     PNG, the only lossy step is sharp's and the quality is
     chosen on the same scale as all the photos'. */
  const poster = v.out.replace(/\.mp4$/, '.webp');
  const rawFrame = v.out.replace(/\.mp4$/, '.frame.png');
  execFileSync(
    'ffmpeg',
    ['-y', '-loglevel', 'error', '-ss', String(v.start + 1), '-i', src,
     '-vf', 'crop=iw:iw*4/3,scale=480:640', '-frames:v', '1', rawFrame],
    { stdio: ['ignore', 'ignore', 'inherit'] },
  );

  await sharp(rawFrame).webp({ quality: 80, effort: 6 }).toFile(poster);
  rmSync(rawFrame);

  totalIn += kb(src);
  totalOut += kb(v.out) + kb(poster);
  console.log(
    `  ${v.out.replace('public/', '')}  480×640 ${v.dur}s  ${kb(src)} KB → ${kb(v.out)} KB (+ poster ${kb(poster)} KB)`,
  );
}

console.log('\n── TOTAL ──────────────────────────────────────────────────────');
console.log(`  originals used:    ${(totalIn / 1024).toFixed(1)} MB`);
console.log(`  derivatives:       ${(totalOut / 1024).toFixed(1)} MB`);
console.log(`  reduction:         ${(100 - (totalOut / totalIn) * 100).toFixed(1)} %`);
