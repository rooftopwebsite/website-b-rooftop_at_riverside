# Client requests — what's missing before launch

A single document with everything the site needs and we don't have. Each item says
**where it lands**, **what shows in its place today** and **why it can't be replaced
with something else**.

> It was built by walking through the real markers in the code
> —`<PhotoPending>`, `<PendingData>`, `<PendingBlock>`—, not from memory. When
> an item arrives, the marker disappears on its own: nothing needs to be redesigned.
>
> Regenerate the inventory:
> `grep -rn "PhotoPending\|PendingData\|PendingBlock" src/`

**Status as of 2026-09-11:** 33 open items, plus 12 bis, which was opened on 2026-09-22 with the `/market` redesign. Three block the home page and **one
blocks the entire reservations logic**: item 0, OpenTable.

> ### 0 · ⚠️ What do they use OpenTable for?
>
> The client **has an OpenTable account** and we don't know what they do with it.
> The three possible answers change different pages:
>
> - **Table reservations every day** → a «Book a table» goes in the header, on
>   `/visit` and at the bottom of every venue page.
> - **Only on event nights** → the reservation notice lives on `/whats-on` and on
>   each event's detail page, next to the Eventbrite one.
> - **Only large groups or private events** → it's part of the
>   `/events/inquire` flow and isn't mentioned anywhere else.
>
> We also need **the profile URL**. Until the answer arrives, no
> page can say whether you book, whether you buy a ticket, or both.

---

## Summary by who has to resolve it

| block | items | who |
|---|---:|---|
| A · Photos and video | 13 | the client / a photographer |
| B · Hard data | 8 | the client (operations) |
| C · Files and links | 9 | the client / a technical decision on our side |
| D · Copy | 3 | the truck owners |
| E · Brand | 1 | whoever has the original logo |
| F · Football season | 6 | Chris, Anthony and us |
| G · Madeline's monthlies | 9 | Madeline Powers |

---

## A · Photos and video

### A.1 · Block the home page — 3 items

| # | what | where it lands | what shows today | why there's no replacement |
|---|---|---|---|---|
| 1 | **A dog in the yard.** Someone with their dog at a table, or a dog in a truck's line. | The **Wooftop Wednesdays** card in «This week in the yard» | The marked gray gap, with the shot brief written inside | It's dog night and in the 36 photos delivered **there isn't a single dog**. Using another yard photo would mean saying «bring your dog» over an image with no dogs. It's the only marked gap left on the home page |
| 2 | **Sunset sky over the rooftop.** Horizontal, golden 6 PM clouds, shot from the terrace. | The hero background — it's in the mockup we approved | The hero sits on `bone`, the brand's light surface | There isn't a single sky photo in the delivery, let alone golden hour. A CSS gradient imitating it is exactly what the brief forbids |
| 3 | **Six to eight vertical AMBIENCE clips.** 3:4 or 9:16, 6–10 s. | The hero's arc of cards | The two usable clips, spread across the arc | Of the five videos delivered, three are social media pieces: an animated flyer and two people talking to camera with burned-in subtitles. Muted in a 130px card, that reads as a broken video, not as ambience. Details in `docs/media.md` §1 |

**Specific shots for #3:** the bar serving · the smoke from a grill ·
the line at a window · the sunset from the terrace · the band starting up ·
the yard filling up.

### A.1 bis · The event pieces — 2 new items (2026-09-11)

Context: the «This week in the yard» carousel NO LONGER uses generic venue
photos. It uses the **real graphic piece** the venue publishes for each event, downloaded from the
old site's calendar. That leaves two open items.

| # | what | why |
|---|---|---|
| 1 bis | **The «La Noche» flyer WITHOUT the old domain.** The published piece has `WWW.EATDRINKPARADISE.COM` printed at the bottom. | Published as-is on the new site, the event **promotes the website we are replacing**. It can't be fixed from the code: the text is inside the JPG. We need the piece without that line, or with the new domain |
| 1 ter | **The «Wooftop Wednesdays» and «Bingo Night» pieces**, if those events exist. | Today both cards show the marked gray gap. There's no piece to download them from because **the client's calendar doesn't publish those two events** (see `current-site-inventory.md` §9). It's tied to the question «do Wednesdays happen or not?» |

> ⚠️ Item 1 in the block above —the dog photo— **depends on
> this**: if Wooftop has its own graphic piece, a photo with a dog is no longer
> needed; the flyer is enough.

---

### A.1 ter · The hero video — 1 decision, not a material request (2026-09-16)

The home page cover is, as of today, **the same video the client already has in
the hero of their Wix site**, downloaded to `public/videos/hero-home.mp4` and served
from our repo. Camila's request: «no cropping or anything, let's use that one as
is», so it goes in complete: same framing, same 68.8 seconds, same
speed. The only things done to it were re-encoding and stripping the audio.

| what it weighs | |
|---|---|
| what Wix serves today, 1080p | 52 MB |
| what we serve | **30.5 MB** |

**The decision left open: the length.** 30 MB is a lot for a cover
that autoplays, and there's no compression headroom: it's drone footage over
dense vegetation, about the most expensive thing there is to compress. Measured with VMAF
over the aerial stretch, going below CRF 30 takes quality from 92 to 78 points, meaning
it starts to look dirty on a large screen. The only real lever is cutting it:

| length | approximate weight |
|---|---|
| 68.8 s — what's there today | 30.5 MB |
| ~30 s | ~13 MB |
| ~20 s | ~9 MB |

Cutting it contradicts the «as is» of the request, so **it wasn't cut**. If the
client or Camila decide the home page can't weigh that much, the stretch is chosen and
trimmed in one `ffmpeg` run; the 1080p source file is stored
outside git, in `_interno/video-sitio/`.

---

### A.2 · Block inner pages — 4 items

| # | what | where it lands |
|---|---|---|
| 4 | The **OCN Seafood Co.** truck open and serving, at sunset, window lit up, people ordering | `/food-trucks/ocn-seafood-co` |
| 5 | The **Butcher's Blvd** truck in the yard, plus a close-up of a smashburger at the pass | `/food-trucks/butchers-blvd` |
| 6 | The **Reggae Kitchen** truck with the sign legible, and a served dish that shows the color | `/food-trucks/reggae-kitchen` |
| 7 | **The covered patio** once the renovation is finished — a wide shot showing how the yard connects to the bar | `/events/spaces`, The Patio's detail card |

Of the four active trucks, **three have no photo at all**. Today each detail page
shows the marked gap full width, with the brief for its shot inside.

### A.3 · Improve what already works — 6 items

| # | what | what for |
|---|---|---|
| 8 | **Bingo in action** — the cards on the table, people playing | Replaces the generic night yard photo on the Bingo Night card |
| 9 | **The Sunset Bar by day, empty and tidy** | All the bar shots are with people and at night; the one showing the place as a space is missing |
| 10 | **A private event set up** — tables set, the place closed, before people arrive | The Events banner uses the aerial of the yard, which works, but a set-up event sells better |
| 11 | **The yard with the four trucks from the rooftop**, with the stage set up | The Yard's detail card uses a row of empty trucks |
| 12 | **A private event in progress**, rooftop and yard full, from the street side | The Full Buyout detail card |
| 12 bis | **Our own Neighborhood Market photos** — the stalls set up, people browsing, some product detail. Six or eight are enough, horizontal and vertical mixed | The hero and the wall on `/market`. **It doesn't block, but what's there is borrowed:** the seven the page uses today were downloaded from the gallery of the client's own Wix site, so they're theirs but they didn't give them to us. They're 2048px on the long side, which is why the `/market` hero comes out one size below the other six. Of the 36 photos in the delivery there isn't **a single one** of the market |

### Technical specification, to hand to the photographer

- **Photos:** 3000px on the long side is more than enough — the pipeline scales them down to what's
  displayed. JPEG. **No filters and no watermarks.**
- **Videos:** vertical, 6–10 s. **Audio isn't needed** (they play muted),
  **no burned-in text**, **nobody talking to camera**. H.264 or HEVC, the
  pipeline re-encodes. No size limit on the original.
- **What doesn't work:** Instagram screenshots, pieces with a graphic label, photos
  with another brand's logo on top.

---

## B · Hard data

None of these are estimated. A capacity on a venue page is a
promise, and a made-up number becomes a commercial problem the day
someone uses it to make a decision.

| # | what | where it lands | what shows today |
|---|---|---|---|
| 12 bis | ~~**Which days is happy hour: Tuesday or Wednesday?**~~ **RESOLVED on 2026-09-17, and neither option was the right one.** The client sent the real data: **Weekend Happy Hour, Saturday and Sunday from 12 to 6, venue-wide**, with `$1 off` on drafts, bottles and cans, `$8` Tito's, Captain and Crown's, `$10` margaritas and Superior Light Beer as the featured brand. What we were publishing («Wednesday – Friday, 3–6 PM, $4 drafts, $5 house wines, $6 house drinks») came from the Wix site footer and was wrong from end to end. **Only one question remains open: is there also a weekday happy hour, or is the weekend one the only one?** | `/sunset-bar`, `/whats-on` and the home hero pill | The new data, read from the event in the database |
| 13 | **Standing capacity** of the Sunset Bar, The Yard, The Patio and Full Buyout | It no longer lands on any screen: see the notice below | **Nothing.** The site doesn't mention capacities |
| 14 | **Seated capacity** of the same four | same | same |
| 15 | **Guest minimum** of the same four | same. The only published minimum is the 12 on `/hostanevent`, which is on the site | same |
| 16 | **Floor plans**, if they exist | same | same |
| 17 | **How many consoles** there are in the game truck | `/events/game-truck` | `TBD` |
| 18 | **How many consoles and how many screens** in the game lounge | `/the-experience` | `TBD` ×2 — **and there's a conflict here**: the brief and the current site give different numbers, so picking one isn't enough |
| 19 | **Upcoming market dates** | `/market` | `TBD` |
| 20 | **Each truck's own hours**, if they differ from the venue's | the four `/food-trucks` detail pages, the «When they're here» row | «The roster rotates» with a link to the calendar. It's true and it works, but if any truck has fixed days it's worth saying so |
| 51 | **The five parking zones: name, validity and whether any of them is paid.** On 2026-09-22 the missing source turned up —the old site's `/parking` page— and with it the map on `/contact#parking` was drawn. But the source is **a Google Maps screenshot from December 29, 2023, without a single written word except «LIBRARY PARKING»**, so three things remain unconfirmed: **(a)** that the layout is still valid almost three years later; **(b)** the NAMES of four of the five zones, which we assigned ourselves by reading which street each patch falls on; **(c)** whether any of them is paid, has hours or is reserved for another business — the screenshot doesn't distinguish. **And one specific question:** the two rows right next to Old 41, which are the closest to the door, do they belong to the venue or to the neighbor? | The «Where to park» section on `/contact` and the Parking block on the home page | The five zones drawn and named, without saying whose each one is or whether it's paid |

The four spaces are in `src/content/spaces.ts` and the trucks in
`src/content/trucks.ts`: the numbers go in there and the `TBD`s go away on their own.

> ### ⚠️ Items 13 to 16 are no longer visible on the site — 2026-09-22
>
> The section that showed them, «Pick your footprint» on `/events`, **was
> removed**. Camila: «this part can be told much better; in fact it's already
> being told in "What comes with each space", why don't we take it out?».
>
> That changes just one thing and it's worth having it in writing: **these four items
> no longer have an on-screen marker.** Until now the site asked for them on its own
> —the orange block was in plain sight for anyone who opened `/events`— and
> from today the only place they're recorded is this document. If the
> numbers arrive and we want to publish capacities again, we have to **redesign where
> they go**: the table that was waiting for them no longer exists.
>
> What's still published is the 12-guest minimum, which is the only capacity
> data point the client publishes today (`/hostanevent`: «*For parties less
> than 12 people contact: 239-268-0080»). It lives in `SMALL_PARTY_MAX` and is read
> next to the form.

> ⚠️ **The detail on 12 bis, because it now shows on the same screen.** The
> client publishes happy hour in two places and they don't say the same thing:
>
> | where | what it says |
> |---|---|
> | the `eatdrinkparadise.com` footer | `Wednesday - Friday | 3pm - 6pm` |
> | menu sheet 2, in the «HAPPY HOUR» box | `TUE - FRI | 3-6 PM` |
>
> And the venue's own hours say that **it's closed on Mondays and
> Tuesdays** (`content/hours.ts`, the FAQ and the calendar's closed days), so
> a happy hour starting on Tuesday can't be right. That's why the site
> publishes «Wednesday – Friday»: it's the version that doesn't contradict anything.
>
> Since `/sunset-bar` started showing the menu sheet, **both versions
> live on the same page**: the green band says Wednesday and the image
> below says Tuesday. It can't be fixed from the code —the text is
> inside the JPG— so either the client confirms which one is right and sends the corrected
> sheet, or someone is going to ask.

### B bis · What comparing `/events` against `/hostanevent` opened up (2026-09-22)

Camila sent the screenshot of the events page the client publishes today and it was
checked field by field against ours. **Two gaps closed on their own** —the
three bar packages and the rule for parties of fewer than 12, which were in
the sources and not on the site— and these four questions remained, which can't
be answered from here because all four are commercial promises.

| # | what | why it isn't decided on our side |
|---|---|---|
| 52 | **Is anything rented besides the second floor, and at what price?** The «Events Packages» PDF prices **only** the second floor buyout ($750 / $1,250 per hour) and lists three variants, all three upstairs: full upstairs, rooftop patio and rooftop inside. Our `/events` also offers **The Yard closed off with a gate** and **the full buyout**, and for fundraisers and year-end parties they're the main selling point. | No client source puts a price or conditions on the downstairs yard. Either there's a rate they didn't send us, or we're offering a product that isn't for sale |
| 53 | **What's the events phone number?** The `/hostanevent` page sends small parties to **(239) 268-0080**, which is the main house line. The last sheet of the PDF, «Let's collaborate», gives **941-889-8827** and two emails: `events@` and `mpowers@`. | The site currently publishes the house number in both places. If the 941 is the events line, it's the one that has to be next to the form |
| 54 | ~~**Up to how many guests fit?**~~ **Resolved on 2026-09-29**: Camila asked to copy the client's original form. The dropdown stays at 24 or fewer, 25 – 49, 50 – 74, 75 – 99 and 100 or more, same as `/hostanevent`. | — |
| 55 | **Are the PDF prices still valid?** It was already noted as a TODO in `content/events-pricing.ts` and now it matters more: with the bar packages published, the page states **eleven numbers** from the client and the PDF has no date anywhere. | It could be from 2024. It's the last thing to confirm before `/events` goes to production |
| 56 | ~~**The new second floor rental price.**~~ **Resolved on 2026-09-29**: Maddie sent $1,250 for 2 hours + $250 per extra hour (Sunday to Thursday), $2,000 + $500 (Friday and Saturday), the patio at $1,000 flat and the full venue on request. It's already in `RENTAL`. | — |
| 57 | **The Events Packet PDF is out of date.** It still has the old prices (hourly rental, fees, open bar at $25) and «Upscale catering». Since 2026-09-29 the download card on `/events` is hidden until the new one arrives. | The client has to redo it; when it arrives, it's loaded into `EVENTS_PDF` in `content/events-pricing.ts` and the card comes back |
| 58 | **The food on `/food-trucks` once BBOT launches.** There will be table service with food runners and servers, in addition to ordering at the window. Chris decides when; Maddie sends the info. | Until then, no more effort goes into that part of the page |

> **A data point that is NOT a request:** the first sheet of the PDF says «food trucks
> serving 5 unique cuisines» and the new site says four. There's no conflict: the
> current roster has four and the three retired ones are in `content/trucks.ts`
> with `active: false`. The PDF is the one that's out of date.

---

## C · Files and links

| # | what | where it lands | what shows today |
|---|---|---|---|
| 21 | **The events packet PDF** | `/events/inquire` | The brief asks for it to be delivered at the moment the form is submitted. Since the PDF doesn't exist, the confirmation says it arrives attached to the reply. With the file it becomes an instant download |
| 0 | **⚠️ What they use OpenTable for, and the profile URL** | The header, `/visit`, `/whats-on` and `/events/inquire` — depends on the answer | Nothing: the site today doesn't mention reservations anywhere. It's the most important item on the list, see the block at the beginning |
| 22 | **Confirm the Eventbrite profile** (we found it ourselves: `eventbrite.com/o/rooftop-at-riverside-104153700851`) | `/whats-on` and `/the-yard`, the tickets CTA | It's already set in `BRAND.eventbrite` and the «Pending» block is gone. The client still needs to confirm it's theirs and that every ticketed event is sold through it. Today the profile says «No upcoming events» |
| 28 | **Are the truck's three legal documents still valid?** The two waivers (`/bar-games-waiver`, `/game-zone-waiver`) and the policies and procedures PDF | The three new pages, and the links block on `/game-truck` | **All three are already published on the new site**, verbatim, as of 2026-09-22: `/gaming-truck-policies`, `/game-zone-waiver` and `/bar-games-waiver`. The two 301s to the anchor are gone. What's missing is for the client to confirm that none of them changed since 2026-09-15, which is the date all three pages declare as «last updated» because that's when we took the text |
| 28a | **The minimum age to play in the truck** | The links block on `/game-truck`, and the answer for whoever calls | Nothing: it isn't published. Neither of the two waivers nor the PDF sets an age. The closest thing is «we recommend that the youngest age group we accept party bookings for is age 6», which is a recommendation for booking a party, not a minimum for playing. The «21 and over» is for the bar games, which are something else |
| 28b | **An email address is missing from the policies document.** The VIDEO GAME RATINGS section says «please send an e-mail to indicating the game(s)…» and after «to» there's nothing | `/gaming-truck-policies` | It's published as is, because it's the client's text and we don't fill it in. Once the address is confirmed, it's corrected in the original and here |
| 29 | **Is the Thursday giveaway still running?** (`/tnt-sign-ups`, «Enter to win free tickets», QR at the venue, winner on Fridays) | `/whats-on` | Same case: 301 to `/whats-on` without a single line about the giveaway. The official rules are already written and get reused as is |
| 30 | **The menus of the four current trucks** | the four `/food-trucks` detail pages | The current site only publishes two menus as images, and one is from a truck that's no longer there. Of the four on the roster, today only El Chilango has a published menu |
| 31 | **The complete monthly calendar, event by event** | `/whats-on`, and the RestoExp database | The database today only has the four weekly recurring events. The one-off events (festivals, ticketed shows) aren't loaded, and they're precisely the ones sold through Eventbrite. The client already delivers the following month's calendar on the 10th |
| 32 | **Does the email list live in Toast or in a spreadsheet?** | the pre-footer across the whole site | Questionnaire F5 says email marketing goes out through Toast, which is already the POS. The site's form currently points to a spreadsheet webhook that doesn't exist yet. Depending on the answer, the form's destination changes, not the form |
| 23 | **Form backend + file storage** — a technical decision, not the client's | `/join-us` | The current site runs three forms with uploads of up to 15 MB (musicians' material, vendor details, résumés). Until we choose where they live, the page sends to email, which is honest and works today |
| 24 | **⚠️ The newsletter spreadsheet and its webhook** — a technical decision, not the client's | The pre-footer on **all 23 pages** | The form is finished and validates, but **the sign-up isn't saved**: without `NEWSLETTER_SHEETS_WEBHOOK_URL` the action returns a visible error that sends people to write to `info@eatdrinkparadise.com`. See the step by step below |

### 24 · How the newsletter gets connected — 15 minutes

The pre-footer form sends `{ firstName, email, source }` via POST to
an Apps Script URL. That endpoint still needs to be created.

1. **New spreadsheet** in the agency's Drive. First row:
   `date · firstName · email · source`.
2. **Extensions → Apps Script**, paste this and save:

```js
function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    if (!d.email) throw new Error('empty email');
    SpreadsheetApp.getActiveSpreadsheet()
      .getSheets()[0]
      .appendRow([new Date(), d.firstName || '', d.email, d.source || '']);
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    // ⚠️ Apps Script answers 200 anyway. That's why the `result` goes in the body
    // and `actions.ts` reads it: without this a write failure would be reported
    // to the user as a success.
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. **Deploy → New deployment → Web app**, with
   *Execute as* **me** and *Who has access* **anyone**. Without that
   second value the site gets a 401 and the sign-up is lost.
4. Copy the `/exec` URL and load it as `NEWSLETTER_SHEETS_WEBHOOK_URL` in
   Vercel (all three environments) and in each person's `.env.local`.

**After connecting it, a real sign-up has to be tested** and the row checked in the
spreadsheet. The «not connected» error and the «write failed» error look
different in the browser, but both are recorded in the logs with the prefix
`[newsletter]`.

> **What this is NOT:** a sending platform. The spreadsheet collects the list;
> sending the campaign stays manual until the client chooses a
> provider (Mailchimp, Klaviyo). Decision postponed by Camila on 2026-09-11.

---

## D · Copy

**None of this is written by us.** It's the project rule: no text
on the site comes from an AI.

| # | what | where it lands |
|---|---|---|
| 24 | **The story of OCN Seafood Co., Butcher's Blvd and Reggae Kitchen** — two or three sentences from the owner: who they are, where they come from, why people know them | the three `/food-trucks` detail pages. El Chilango already has its own, taken from the old site |
| 25 | **Each truck's Instagram**, if they have one | the four detail pages |
| 26 | **Who the charity partner is today**, and where that section goes | `/our-story`. It lived on `/giveback`, a page the brief didn't account for; the partner the old site shows is out of date. We need to decide whether it gets its own route or goes inside Our Story |

---

## E · Brand

| # | what | why |
|---|---|---|
| 27 | **The full color logo lockup in vector** (`.ai`, `.svg` or `.pdf`) | It's the only thing on the site that doesn't scale: the header uses a PNG. We already have the vector for the isotype, the wave border, the tile and the sun and palm medallion, taken from Figma. For the full lockup, we don't |

---

## F · Football season

Opened on 2026-09-17, when the trucks' specials, the bar's football happy hour
and the giveaway rules arrived. **This whole block gets deleted when
Chris says the season is over**, along with `content/game-day.ts`, the three
dashboard events and each truck's promo sheets.

| # | what | where it lands | what shows today |
|---|---|---|---|
| 33 | **Until which Sunday does everything run?** Without an end date, the three events keep publishing themselves. The database already has the column (`end_date`) and the site now respects it: the day Chris gives the date, it gets loaded and the calendar switches itself off | The three football events on `/whats-on` and on the home page | No end date, meaning «until someone deletes them by hand» |
| 34 | **«Touchdown Shots»: whose touchdown?** The document says «every time the customer's team scores a touchdown», and that reads two ways: the house team, or the team the person at the table roots for. It changes who gets the $4 shot | The «On football Sundays» block on `/sunset-bar` | Published as «our team», which is the narrow reading: if the promo were the broad one, nobody complains; the other way around, they would |
| 35 | **The name and specials of the fourth truck** (the Jamaican cuisine one, whose name is also still unconfirmed) | That truck's detail page on `/food-trucks` | The truck appears with its name marked as unconfirmed and without a menu |
| 36 | **Do they have official giveaway rules?** They're not a requirement of ours and they don't block publishing: the event describes the mechanics, doesn't name prizes and points to social media, which is where the client publishes what's being given away each week. It's still worth asking, because Chris himself raised his hand about the liability issue and because the old site's Thursday giveaway (`/tnt-sign-ups`, item 29) **did have written rules**: if this one's rules exist, they get linked from the event in one line | The giveaway event's detail page | The event is published with the mechanics and the link to social media. No rules published |
| 37 | **Can the four teams be named?** The giveaway mechanic is one bin per team, and the four names are registered trademarks. The new site doesn't use a single NFL name or logo because the brief requires it (see `services-audit.md`) | The giveaway event's text | Written as «one for each team in the division», which explains the mechanic without printing the trademarks |
| 38 | **HALF RESOLVED on 2026-09-21: the Wooftop half.** Madeline's email answered the question for that event (it's monthly, third Wednesday, and was renamed Wooftop Fest; see block G). **Bingo Night is still open.** Original text: the real dates of Wooftop Wednesdays and Bingo Night. It's the most urgent item in the block: today both are loaded in the dashboard as single-day events, dated September 9, meaning **already past**, so they don't appear on the home page or in the week. Ross Brown and La Noche are weekly and verified against the client's public calendar (`current-site-inventory.md` §9); these two don't appear there on any date | The home page and `/whats-on` | Nothing: both disappeared from the site the day someone edited them in the dashboard |

| 39 | **The two Eventbrite URLs**, Ross Brown's and La Noche's. Today both buttons point to the organizer's PROFILE, which as of 2026-09-15 says «No upcoming events» | Each one's row in the weekly grid on `/whats-on` | «Tickets on Eventbrite» linking to the full profile |
| 40 | ~~The descriptions of those two events say the opposite~~ **RESOLVED on 2026-09-17.** Camila confirmed both are ticketed, so the descriptions were rewritten in the dashboard («Free, and no ticket needed» and «No cover, no ticket» are gone) and **the site stopped claiming anything is free anywhere**: gone are the «Free entry» pill, the `isAccessibleForFree` in the events' and the venue's JSON-LD, «Almost all of it is free and none of it needs a ticket» from the home page, and «there is no cover» from the FAQ. The new rule: a ticketed event announces it, everything else says nothing | The whole site | Only what DOES need a ticket is announced |
| 41 | **The event descriptions repeat the day, the time and the space**, which are data points the card already publishes above on its own line. «Weekend Happy Hour» opens with «Every Saturday and Sunday, from noon to 6 PM, all over the venue» and the card already says «12 PM – 6 PM · Venue-wide» two lines up; «Game Day at the Trucks» and «NFC North HQ» do the same with the opening and closing time. Camila's request, 2026-09-21: «careful with the event descriptions, they shouldn't repeat information that's already simplified in the card, like days and times or place». **It's dashboard text, not site text**: the card publishes what the client writes, and the day the description starts with what the event IS instead of when it happens, the card stops repeating itself on its own | The cards on `/whats-on` and the card on `/sunset-bar` | The description is published as is, with the repetition in plain sight |

> **About 38, which is our job and not the client's:** the dashboard only
> knows how to store ONE day of the week as a recurrence, so something that happens «one
> Wednesday a month» can't be loaded as recurring without lying. The
> correct way is **one row per date**, with recurrence unchecked. The site already
> shows them: since 2026-09-17 the home page and the calendar expand both
> types over the same dates.

---

## G · Madeline's monthlies

Opened on 2026-09-21, with the email from **Madeline Powers** (`mpowers@eatdrinkparadise.com`,
cc'ing Chris Magnus and Jimbo Mann) of September 17 and her reply of the 18th.
The email brought two monthly events and gave advance notice of a third.

> ### What the email already resolved, and why it matters
>
> **Wooftop Fest is Wooftop Wednesdays.** It's the same event described by two
> different people, and the proof isn't the name: they match on the day
> (Wednesday), the audience (dogs), the promo (2-for-1 drinks) and a
> made-up word that doesn't repeat by chance. What does NOT match is the
> cadence, and there the email wins: **third Wednesday of each month**, not every
> week.
>
> We didn't write the dashboard row: it has existed since **September 8
> at 17:20 UTC**, ten days before our first load, and the
> name is also in the client's brief. In other words, Madeline is
> describing an event that was already loaded in her own database, under another
> name and with the wrong frequency.
>
> **It was loaded on 2026-09-21** as a single row for October 21, with
> recurrence unchecked, which is the only honest way to express «one
> Wednesday a month» in this dashboard (see the note on item 38).

| # | what | where it lands | what shows today |
|---|---|---|---|
| 42 | **When does «the season officially» start?** It's the parent question of this whole block: Madeline said on the 18th that the 2-for-1, the band, the DJ, the bloody mary bar and the brunch **don't apply in October** and kick in «when the season starts». Without that date we can't schedule content for any of the five, and we don't know when to edit the events again | The descriptions of Wooftop Fest and the Neighborhood Market, in the dashboard | Both events are published without a single extra, which is correct as long as there's no date |
| 43 | **Wooftop Fest's 2-for-1 drinks: is it still on?** Madeline describes it as historical («they used to offer») and said she has to confirm it. **Until 2026-09-21 the site promised it as a firm fact**, every Wednesday, in the FAQ and in the event description. It's already been removed from both places | The dogs FAQ and the event card | Neither the FAQ nor the event mentions the 2-for-1 |
| 44 | **Wooftop Fest's live band**: who plays and since when. Madeline named it as part of the season and said she'd send the info | The event card and the count of music nights in `content/entertainment.ts` | The event doesn't mention music, and the count of nights doesn't include it |
| 45 | **Wooftop Fest's hours.** Nobody confirmed them. The 3 to 8 PM the site publishes are **inherited from the old weekly row**, not from the email. If the fest is longer than a regular Wednesday, today we're publishing it short | The time line on the event card | «3 PM – 8 PM», unconfirmed |
| 46 | **The $5 dog item at each truck: does it still exist?** It was in the original dashboard row and Madeline **doesn't mention it** in either email. It was removed from the description along with the 2-for-1, because both are unconfirmed promos from the same old text | The event card and the dogs FAQ | It isn't mentioned anywhere |
| 47 | **Can dogs come on other days?** Before, the FAQ could say «yes, on Wednesdays». Now that the event is monthly, the only thing we can state is that on the third Wednesday the place is pet-friendly, and what happens the rest of the month went unanswered. **Watch out for where it's already stated:** the home page meta description says «dogs welcome in the yard», with no day condition. It wasn't touched because nobody said otherwise and it's plausible in an open-air yard, but it's an unsupported claim | The «Are dogs allowed?» FAQ (currently not rendered) and the `/` meta description in `content/seo-pages.ts` | The FAQ only talks about the third Wednesday; the home page still says «dogs welcome in the yard» |
| 48 | **Wooftop Fest dates from November on.** Madeline confirmed October 21 and said she'll load the following months into the calendar. By the pattern, November falls on the **18th**, but **it isn't loaded by pattern**: each date goes in when she confirms it | `/whats-on` and the home page | A single published date, October 21 |
| 49 | **The Neighborhood Market isn't loaded in the dashboard, and its hours contradict each other.** The email of the 17th says that in season it runs from 12 PM to 4 PM and that October could be the last month in the 4 PM to 8 PM format; the one of the 18th confirms that September 20 ran from 4 PM to 8 PM, without explaining the mismatch. Also missing are the October and November dates (the pattern is the third Sunday, meaning **October 18** and **November 15**) and the three seasonal extras: DJ, bloody mary bar and brunch. **September 20 has already passed and isn't loaded** | `/whats-on`, the home page and `/market`, which today describes the market without a single date | `/market` still has the frequency TODO open in `content/market.ts` |
| 50 | **Sunset Saturday: the new activation.** Madeline announces it with rotating themes by type of social group (professionals, singles, friends) and no details settled. **It connects with the September 3 branding session**, where «Sunset Saturdays» with rotating genres for the upstairs Sunset Bar was discussed, so it looks like confirmation that idea is moving forward. Watch out for the clash: Saturday night is already taken by La Noche · DJ David Cast, from 10 PM to 2 AM | Nowhere yet | Nothing. `current-site-inventory.md` §9 recorded that «Sunset Saturdays» appeared in the brief and **didn't exist in either of the two data sources**. Now it exists as an intention, not as a date |

> **What was NOT loaded, on purpose:** the Neighborhood Market of September
> 20. It already happened. An expired event in the dashboard is exactly what
> left Wooftop and Bingo off the site in September (item 38).

---

## What NOT to ask for

So nobody asks for it again out of inertia:

- **The three discarded videos aren't deleted and don't need replacing.** They're still
  in `public/multimedia/` and work for social media, or for an events page with
  sound and controls. They just aren't material for a decorative wall.
- **Food photos aren't missing.** Of the 36 delivered, a good share are dishes and
  drinks, and they're fine. What's missing is the PLACE and the PEOPLE in
  specific situations: the dog, the bingo, the set-up event, the sky.
- **The three retired trucks** —Prime Carvery, Sea Me on Wheels, Tropical
  Fusion— have their photo and don't need anything else. Their old URLs redirect
  on their own from `content/trucks.ts`.
