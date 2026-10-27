# Current site inventory — eatdrinkparadise.com

Audited on **2026-09-08**. Wix. Sitemap generated on 2026-08-25.

**This is a content inventory, not a design reference.** Data, reusable copy and assets
are extracted. No structure, layout or visual hierarchy is taken.

---

## 1. URL map — 23 live routes

The 22 from the sitemap plus `/ocn`, which isn't in the sitemap. **All of them return 200.**

### With a destination already defined in the brief (14)

| Current URL | h1–h6 | → Destination | Status |
|---|---|---|---|
| `/` | 4 | `/` | rewrite |
| `/this-is-us` | 1 | `/our-story` | 301 ✅ |
| `/eat` | 0 | `/food-trucks` | 301 ✅ |
| `/drink` | 0 | `/sunset-bar` | 301 ✅ |
| `/calendar` | 0 | `/whats-on` | 301 ✅ |
| `/hostanevent` | 1 | `/events` | 301 ✅ |
| `/neighborhood-market` | 2 | `/market` | 301 ✅ |
| `/entertainment` | 2 | `/join-us` | 301 ✅ |
| `/game-lounge` | 1 | `/the-experience` | 301 ✅ |
| `/find-us` | 2 | `/visit` | 301 ✅ |
| `/parking` | 1 | `/visit#parking` | 301 ✅ |
| `/primecarvery` | 0 | `/food-trucks/prime-carvery` | ⚠️ see §3 |
| `/tropicalfusion` | 0 | `/food-trucks/tropical-fusion` | ⚠️ see §3 |
| `/seameonwheels` | 0 | `/food-trucks/sea-me-on-wheels` | ⚠️ see §3 |
| `/el-chilango` | 0 | `/food-trucks/el-chilango` | 301 ✅ |

### ⚠️ No destination in the brief — 8 routes that need a decision

| URL | h1–h6 | What it is | Proposal |
|---|---|---|---|
| `/ocn` | — | **Already a 301 → `/seameonwheels`.** It isn't orphaned. | see §2 |
| `/giveback` | 1 | **Real content.** Charity Partner Program: a $1/$3/$5 donation when closing the tab, 100% of net to a different organization each month. August partner: Wonder Gardens of Bonita Springs. | new route or section in `/our-story` — **your call** |
| `/tnt-sign-ups` | 19 | **Real content.** "Enter to win free tickets" giveaway, Thursdays during Happy Hour, QR at the venue, winner announced Fridays on social. Full official rules. | new route or `/whats-on` — **your call** |
| `/bar-games-waiver` | 1 | **Full legal document.** Bar games terms: 21+, no-gambling policy, assumption of risk, code of conduct, image rights. | keep; `/legal/...`? |
| `/game-zone-waiver` | 1 | **Legal document.** Waiver for the gaming truck. | keep; `/legal/...`? |
| `/blank` | 1 | Orphaned mix: a duplicated vendor form + the description of a cocktail (**Calusa Breeze**, see §5). | 301 → `/market`; rescue the copy |
| `/blank-1` | 6 | Untouched Wix template ("Welcome visitors to your site… Double click to edit"). | 410 or 301 → `/` |
| `/inquiry-services-page` | 5 | Untouched Wix template. Generic agency lorem ("Custom Project", "Personal Solution Planning"). Nothing to do with the business. | 410 or 301 → `/events/inquire` |

> The two waivers are drafted legal documents; they're not filler. `/game-zone-waiver`
> is also a dependency of the gaming truck, which on the new site lives at
> `/events/game-truck` and `/the-experience`.

---

## 2. ⚠️ The brief's `/ocn` rule breaks a 301 that already works

The brief asks for `/ocn → /food-trucks`. But `/ocn` **is not an orphaned page today**:

```
GET /ocn  →  HTTP/1.1 301 Moved Permanently
             location: https://www.eatdrinkparadise.com/seameonwheels
```

And there's a fact that explains it: **OCN Seafood Co. is a truck on the current roster** — it
appears on the January 2026 printed menu (§4). So `/ocn` isn't a dead URL, it's the URL
of a current truck redirected to another truck's page.

**Proposal:** `/ocn → /food-trucks/ocn-seafood-co`, not to `/food-trucks`.
Sending it to the index throws away a URL that has equity and points to an active vendor.
**I need your confirmation** — it depends on whether OCN Seafood Co. and Sea Me on Wheels are
the same business renamed or two different ones.

---

## 3. Food trucks: which pages exist and why the site is out of date

**Direct answer to what you asked:** there are **5** truck URLs. Four linked
from `/eat` and one that isn't.

| URL | Linked from `/eat` | Copy | Photos | Menu as image |
|---|---|---|---|---|
| `/primecarvery` | ✅ | 2 paragraphs | 5 | — |
| `/tropicalfusion` | ✅ | **none** | 4 | — |
| `/seameonwheels` | ✅ | 2 paragraphs | 3 | `MENU_SEA_ME_ON_WHEELS_1.0.jpg` |
| `/el-chilango` | ✅ | 1 paragraph | 5 | `El Chilango menu V02A-Frame Menu_0.25x-80.jpg` |
| `/ocn` | ❌ **not linked** | (redirects) | — | — |

### The underlying problem: the roster rotated and the site didn't

The **January 2026** bar menu (the most recent one the site itself publishes) lists
the four current trucks with their logos:

> **OCN Seafood Co.** · **Butcher's Blvd** (American Kitchen, EST 2023) · **El Chilango** · **Reggae Kitchen** (Caribbean & International Flavors)

Cross-checked with the site's pages:

| Truck on the Jan-2026 menu | Has a page? |
|---|---|
| OCN Seafood Co. | only a 301 to another truck's page |
| Butcher's Blvd | ❌ **doesn't exist** |
| El Chilango | ✅ `/el-chilango` |
| Reggae Kitchen | ❌ **doesn't exist** |

| Page on the site | Is it on the Jan-2026 menu? |
|---|---|
| Prime Carvery | ❌ obsolete |
| Tropical Fusion | ❌ obsolete |
| Sea Me on Wheels | ❌ obsolete |

**Only 1 of 4 current trucks has a page, and 3 of 4 published pages are for trucks that are no longer there.**
It's exactly the scenario that justifies the brief's requirement: a single template from a CMS,
adding and removing by data, automatic 301 when a truck is removed. Without that, this repeats in a year.

⚠️ **What I need from you:** the roster confirmed as of today (2026-09-08) with name, slug, cuisine,
specialty, hours and Instagram for each truck. The January menu may be as old
as the pages. **I'm not going to infer it.**

### The trucks' Instagram

No page links to the truck's IG. The only IG on the whole site is the venue's
(`instagram.com/rooftopatriverside/`). The template asks for a "link to their Instagram": that data
**doesn't exist today** and has to be requested truck by truck.

---

## 4. Bar menu — downloaded and transcribable

`/drink` publishes the menu as **two images** inside a slider, with no real alt text.

| Alt | Source URL (Wix, untransformed) | Downloaded |
|---|---|---|
| `Rooftop_Menu-Jan-2026_1` | `static.wixstatic.com/media/526079_60ecb618582948d9bdf59ad35a7f26e9~mv2.jpg` | 1294×2000, 2.0 MB |
| `Rooftop_Menu-Jan-2026_2` | `static.wixstatic.com/media/526079_df856c2cd1cd436bbd35b50b33834a13~mv2.jpg` | 1294×2000, 1.8 MB |

Both legible and transcribable to HTML. **Verified content:**

- **Page 1** — Signature Cocktails (14 items with price and recipe) + Specials
  (Frozen Drink of the Month $12, Xtini-Tower $79).
  Footer: *"All listed prices include tax. A 22% gratuity fee will be applied to unsigned bar tabs."*
- **Page 2** — Bottled Beer (12) · Draft Beer (7) · Seltzers & Canned Beer (5) ·
  Wine & Bubbles (White 5, Bubbles 1, Blush 2, Red 4, with a "HOUSE" mark) ·
  Happy Hour box · logos of the 4 food trucks + "VIEW MENUS" QR.

Total transcribable: **~50 items with price.** Enough to build `/sunset-bar` in HTML
without asking for anything else. Prices carry the tax-included note.

---

## 5. Reusable copy

The ones that survive the brief's prohibitions. **None generated by AI: they're the client's.**

| Source | Text | Destination |
|---|---|---|
| `/this-is-us` | "After 4 years of planning, the Bonitian locals, the Magnus family get to fulfill their dreams of bringing life, community fun, and legacy to Bonita Springs." | `/our-story` |
| `/this-is-us` | "We hope this park will be a staple for families in the community, a symbol for up and coming entrepreneurs & business owners, and a landmark our kids would be proud of" — *Chris Magnus, Founder & Operator* | `/our-story` (quote) |
| `/eat` | "Discover the unique flavors of Southwest Florida's finest food trucks" | `/food-trucks` |
| `/drink` | "The best craft cocktails and local beers this side of the Imperial River" | `/sunset-bar` |
| `/` | "Our bartenders are skilled in the art of mixology… We also offer a rotating selection of national brands and local craft beers." | `/sunset-bar` |
| `/game-lounge` | "SWFL's First Gaming Truck Has Arrived" + full description | `/events/game-truck` |
| `/neighborhood-market` | Full vendors block + conditions | `/market` |
| `/giveback` | Charity Partner Program, complete | to be defined |
| `/blank` | **Calusa Breeze** — "a mesmerizing ocean blue, swirled piña colada… house-spiced pineapple rum, velvety coconut, and the vibrant kick of zesty lime." | `/sunset-bar` (if it's still on the menu) |
| `/el-chilango` | Truck description | truck page, if it's still on the roster |
| `/primecarvery`, `/seameonwheels` | Descriptions | only if they're still on the roster |

### ⛔ Copy that is NOT reused — forbidden terminology

The current home page is built entirely on what the brief forbids:

- **"A two-story food truck park nestled in the heart of Bonita Springs"** (current H1)
- **"our upper deck"**, **"Our two-story bar"**
- The home page's three sections are literally called **"Eat." / "Drink." / "Paradise."**
- "Bites and Family Favorites", "the ultimate dining experience" — reinforce a restaurant reading

And the whole positioning is the wrong one according to the brief's thesis: the current home page sells
"two-story food truck park", not "event space with its own bar and four
independent kitchens". It gets rewritten completely.

---

## 6. Contact details and hours

### ⚠️ Correction of 2026-09-11 — the newsletter pre-footer was missing from this inventory

This document **omitted the subscription form**, and that omission cost
work: on 2026-09-09 the newsletter was deleted from the new site on the argument that
"the current website has nothing like it", with this inventory as the source. It was
verified live on 2026-09-11 and **it does exist**, in the pre-footer, above the
hours:

| | |
|---|---|
| Title | "Sign Up" |
| Subhead | "Stay up to date with all the latest from Rooftop at Riverside" |
| Fields | First name · Last name · Email |
| Button | "Join" |
| Confirmation | "Thanks for subscribing!" |

Restored in `shared/NewsletterSignup.tsx`, with two fields instead of three —the last
name was dropped, since a mailing list doesn't use it—. **It goes to a spreadsheet,
not to an email**, and the spreadsheet doesn't exist yet: item 24 of
`docs/client-requests.md`.

> **The lesson, for the rest of this document:** whatever isn't here is treated
> as not existing on the current site, so a gap is read as a fact.
> Before deleting something from the new site because it's absent from this inventory,
> **verify live**.

### Matches the brief ✅

Hours (footer, identical on all 23 pages):

| Day | Bar | Food Trucks |
|---|---|---|
| Monday | CLOSED | CLOSED |
| Tuesday | CLOSED | CLOSED |
| Wed–Thu | 3pm – 8pm | 4pm – 8pm |
| Friday | 3pm – 12am | 4pm – 11pm |
| Saturday | 11am – 2am | 12pm – 11pm |
| Sunday | 11am – 8pm | 12pm – 8pm |

Address `27333 Old 41 Rd, Bonita Springs, FL 34135` · Phone `(239) 268-0080` ·
`info@eatdrinkparadise.com` · `hiring@eatdrinkparadise.com` ·
IG `instagram.com/rooftopatriverside/` · FB `facebook.com/people/Rooftop-at-Riverside/100075964505890/`

### ⚠️ Three contradictions to resolve before publishing

**a) Happy Hour — three different versions on the same site**

| Source | Days | Hours |
|---|---|---|
| Footer on all 23 pages | **Wed – Fri** | 3–6 PM |
| Jan-2026 printed menu, p. 2 | **Tue – Fri** | 3–6 PM |
| `/tnt-sign-ups` | **Thursdays** | **3–7 PM** |
| Brief | **Wed – Fri** | 3–6 PM |

The menu says Tuesday, and **on Tuesdays the venue is closed**: that data is impossible.
I'm going with **Wed–Fri 3–6 PM** (footer + brief agree), but it needs confirmation from the client,
and if it's correct **the menu has to be reprinted**.

**b) A second email domain**

`/find-us` publishes **`info@rooftopatriverside.com`** — a different domain from the
footer's `info@eatdrinkparadise.com`. I don't know which one is right or whether both receive mail.
The brief only lists `@eatdrinkparadise.com`. **To be confirmed.**

**c) Exposed personal emails**

`/this-is-us` publishes `cmagnus@eatdrinkparadise.com` and `ahayes@eatdrinkparadise.com`.
They're not in the brief. I recommend **not** republishing them and leaving only the generic mailboxes.

> **Useful fact:** `ahayes@` is **Anthony Hayes, General Manager**. That resolves the
> "'Tony' (A. Hayes, name to be confirmed)" in the brief's list of approvers.

---

## 7. Other hard data the brief didn't include

All from the current site, verified. **Confirm they're still current before publishing.**

**Gaming truck** (`/game-lounge`):
- $10 per person + tax for 30 min; $5 for each additional 15 min
- 2-hour parties: **$400** Mon–Thu (extra hour $200) · **$500** Fri–Sun (extra hour $250)
- Includes Game Coach, 6 TVs, physical inventory + subscriptions
- 30+ games, listed one by one (from E to M)

> ⚠️ **Doesn't match the brief.** The brief says "4 PS5, 4 Xbox Series X, 2 Switch 2, with A/C".
> The page says **6 TVs** with "Xbox Series X, PlayStation 5, Nintendo Switch 2" (and in the
> parties block it writes "PS6", almost certainly a typo for PS5). Neither the quantities
> nor the screen count match. **To be confirmed** before publishing any number.

**Neighborhood Market** (`/neighborhood-market`): vendor fee **$30** · 10×10 space
unless approved · first come, first served, approval at check-in · pop-up tents allowed ·
electricity on request.

**`/hostanevent` form** — current fields, a good baseline for `/events/inquire`:
name · email · phone · date (required) · start time · end time · group size ·
group type · company name · occasion type · drink package? · food package? ·
how did you hear about us (Social Media / Radio / Referral / E-Blast / Walk By) · comments.

> The brief asks for two fields that don't exist today (**food tier** Food Truck Spread /
> Catered / Chef's Table, and guest count **ranges**) and removes the
> drink/food package ones. The values of the "how did you hear about us" dropdown can be reused as is.

**`/entertainment` form** — confirms the 301 to `/join-us`: name · email · phone ·
band name · social media link · genre · video link · logo (upload, max 15 MB) · photo.
It's not a programming page. The brief is right.

---

## 8. Assets to download

| Group | Where | Quantity |
|---|---|---|
| **Bar menu** | `/drink` | 2 — **already downloaded** ✅ |
| Main logo | header, every page | `Rooftop at Riverside_Logo.png` |
| Food truck logomark | home | `Rooftop at Riverside_truck.png` |
| Truck photos | 4 truck pages | 17 |
| Event photos | `/hostanevent` | `DSC03511.jpg`, `DSC02523.jpg`, `IMG_1063.jpg`, `_RCZ4209.JPG` |
| Venue photos | `/this-is-us`, `/calendar` | `IMG_6030 (1).jpg`, `DSC05537-2.jpg`, `DSC02521 (1).JPG` |
| Gaming truck | `/game-lounge` | `Rooftop_Gaming Lounge_4x5 2.jpg` |
| Parking map | `/parking` | `Screenshot 2023-12-29 at 11.51.36 AM.jpg` ⚠️ it's a screenshot; **redo it** |
| Truck menus | 2 truck pages | 2 — **reference only**, not published |

All on `static.wixstatic.com`. They're downloaded at original size by removing the `/v1/fill/...` segment.

⚠️ The file names are camera names (`IMG_6071.jpg`, `PHOTO-2024-08-29-22-49-04.jpg`)
and the current `alt`s repeat the file name. The brief requires real descriptive `alt`:
**the 30+ alts have to be written by hand.**

---

## 9. Why the calendar is the central mistake — verified

`/calendar` mounts a **third-party iframe**: `calendar.boomte.ch` (Boomtech, a Wix app).

Measured on the served HTML (736 KB):

```
"Sunset Saturday"  → 0 occurrences
"Jazz"             → 0
"Wooftop"          → 0
"Live Music"       → 0
"Trivia"           → 0
"Bingo"            → 0
```

**Zero event content in the HTML.** Google doesn't index a single event. There's no URL per
event, no `Event` in JSON-LD, no iCal. And the iframe is cross-origin: not even
the page itself can read its content.

It's exactly the brief's diagnosis, confirmed.

### The real recurring events

> ⚠️ **CORRECTED ON 2026-09-11.** This section claimed that all FOUR events had been
> "read from the iframe". **That's false for two of them.** Camila caught it by looking at the
> calendar, and it was verified by opening the iframe in a real browser — the served HTML
> isn't enough, because the `<iframe title="Calendar">` has no `src` and Wix injects it via
> JS at runtime. The widget's real URL is
> `calendar.boomte.ch/widget/index.html?lang=en&…`.
>
> The public calendar publishes **ONLY TWO** recurring events, alternating week by week:
>
> ```
> La Noche | Dj David Cast   Sat Sep 12 · 10:00 pm – 2:00 am
> Ross Brown                 Thu Sep 17 · 6:00 pm – 8:00 pm
> La Noche | Dj David Cast   Sat Sep 19
> Ross Brown                 Thu Sep 24
> La Noche | Dj David Cast   Sat Sep 26
> Ross Brown                 Thu Oct 01
> ```
>
> Wednesdays —September 16, 23 and 30— **don't have a single event**.

| Event | When | Is it on the public calendar? | Detail |
|---|---|---|---|
| **Ross Brown** | Thursdays 6–8 PM | ✅ yes, verified live | live music, recurring |
| **La Noche · DJ David Cast** | Saturdays 10 PM – 2 AM | ✅ yes, verified live | recurring |
| **Wooftop Wednesdays** | Wednesdays | ❌ **does NOT appear** | 2-for-1 drinks all day (excludes flights) · $5 dog items at every truck |
| **Bingo Night** | Wednesdays 7–9 PM | ❌ **does NOT appear** | gift card prizes · weekly progressive jackpot |

⚠️ **ALL FOUR EXIST IN THE RESTOEXP DASHBOARD**, each with its UUID, its
description, its schedule and its tags — they're not made up and nobody wrote them by hand in
the code. So **the dashboard and the public site don't match**: there are two events
loaded that the client's calendar isn't showing.

That changes the meaning of open question #8. It's not just "what's the canonical list":
it's **"do the Wednesdays happen or not"**. If they happen, the public calendar has gone months without
publishing them —and that's precisely the hole the new site comes to fill—. If they don't happen,
there are two extra events in the dashboard and the new site is publishing them.

The brief, for its part, lists "Sunset Saturdays, Jazz Wednesdays, Wooftop Wednesdays,
Happy Hour". None of those four names fully matches the data: "Sunset
Saturdays" and "Jazz Wednesdays" don't exist in either source.

---

## 10. External platforms — what's there and what isn't

Sweep over the 9 main pages. **Only three external links on the whole site:**

```
toasttab.com/rooftop-and-riverside-new-27333-old-41-road/giftcards
instagram.com/rooftopatriverside/
facebook.com/people/Rooftop-at-Riverside/100075964505890/
```

**No** OpenTable · **no** Eventbrite · **no** Yelp · **no** Google Business ·
**no** TikTok · **no** delivery.

This confirms several of the brief's notes:
- Toast is indeed the gift card provider ✅
- No TikTok ✅ (don't invent a handle)
- No delivery or takeout on any page ✅
- **OpenTable and Eventbrite aren't linked anywhere today.** It reinforces OpenTable's
  "probably only for events, to be confirmed", and it means the Eventbrite URL
  for `/the-yard` **still has to be requested**.

Other technical findings: `Copyright © 2023 … powered by MCH` (previous agency) ·
served behind Cloudflare · **no content page has a real `<h1>`**
(`/eat`, `/drink`, `/calendar` and the 4 truck pages have **0** headings in the HTML).

---

## 11. What I need from you to close the inventory

1. **Truck roster confirmed as of today** — name, slug, cuisine, specialty, hours and IG. Without this I can't generate `/food-trucks/[slug]`.
2. **`/ocn`** — are OCN Seafood Co. and Sea Me on Wheels the same business? It determines the 301.
3. **Happy Hour** — Wed–Fri 3–6 PM versus the other two published versions.
4. **`info@rooftopatriverside.com`** — is it valid, or only `@eatdrinkparadise.com`?
5. **Gaming truck** — real number of consoles and screens; and whether the 2026 prices are still current.
6. **Destination of** `/giveback`, `/tnt-sign-ups` and the two waivers.
7. **Eventbrite URL** for `/the-yard`.
8. **Canonical recurring events** for `/whats-on` — and now with a more concrete and
   more urgent question: **do the Wednesdays happen or not?** The dashboard has
   *Wooftop Wednesdays* and *Bingo Night* loaded, and the client's public calendar **shows
   neither of them** (verified live on 2026-09-11, see §9). The new
   site is publishing them because it reads the dashboard. If they don't happen, they have to be taken down from the
   dashboard; if they do, the old calendar has gone months without publishing them.
9. **The brief's assets** I still haven't received: Steelfish / Bronx / Futura PT WOFF2s, the brand SVGs and the tile pattern, and the real venue photos.
