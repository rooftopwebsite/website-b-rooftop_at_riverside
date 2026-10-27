# Services audit — brief vs. client's site vs. new site

Done on **2026-09-11**. Question it answers: **what might a person want to do with this
business that the website doesn't let them do?**

## Sources, all read end to end

| Source | What it is |
|---|---|
| `docs/brief-rooftop/Rooftop at Riverside ….pdf` | The brief, 14 pages, sections 1 to 7 |
| `docs/brief-rooftop/Onboarding Questionnaire ….pdf` | The questionnaire, 25 pages, sections A to I |
| `eatdrinkparadise.com` | The client's Wix site, verified live today |
| `docs/current-site-inventory.md` | Inventory of the old site's 23 routes |
| `src/` | The new site, 23 routes |

**What the brief adds that the inventory didn't have:** the business's three external
systems are named in the questionnaire, not on the site. G1 says **Toast** (POS, and the
four trucks also bill through Toast). G2 says **OpenTable**. H5 says, verbatim:
*"EventBrite stays on the client's side for ticketing; we do creative and promotion"*.
None of the three is linked on the old site, except Toast for gift cards.

---

## 1. The three external systems, one by one

### OpenTable, the biggest hole

| Source | What it says |
|---|---|
| Questionnaire G2 | Reservations platform: **OpenTable**. And the footnote: *"OpenTable reservations are part of attribution. The website doesn't show online reservations for the food court/bar, it probably applies more to private events"* |
| Brief §4, 90-day goals | Instrument attribution with **Toast, OpenTable, Meta and Google APIs**, weeks 1 and 2 |
| Brief §6, Reputation Management | OpenTable is listed as one of the four review platforms to manage, along with Google, Yelp and TripAdvisor |
| Questionnaire B1 | One of the two goals checked is **"Increase reservations / bookings"** |
| Old site | Zero. No link, no widget, no button. Verified live today |
| New site | Zero |

In other words: **the client pays for OpenTable, the 90-day plan promises to measure it, and
neither website sends a single reservation there.** The questionnaire itself says "it
probably applies more to private events", and that "probably" is exactly what can't be
published.

The three possible readings change different pages:

1. **Table reservations any day** → permanent button in the header, on `/visit` and at the
   foot of each venue. This is the case that changes the site the most.
2. **Event nights only** → the notice lives on `/whats-on` and on each event page.
3. **Large groups and private events only** → it's a step in the `/events/inquire` flow
   and isn't mentioned anywhere else.

**What to ask for:** which of the three, and the profile URL.

### Eventbrite, yes, that one

It's spelled **Eventbrite** (eventbrite.com). The questionnaire confirms it as a decision
already made: ticketing stays on the client's side, we promote. It fits the rebrand that
the brief and questionnaire G5 describe: **the Yard is being fenced in precisely so it can
host paid-entry events**.

Status on the new site: the plumbing is in place and disconnected.

- `BRAND.eventbrite` is `null` and `/the-yard` shows a pending block instead of a dead
  button ([the-yard/page.tsx:26-33](src/app/the-yard/page.tsx#L26-L33)).
- Each event has a `ticketUrl`, but it's **hard-coded to `null` by hand** in
  [events.ts:156-158](src/content/events.ts#L156-L158).
- And here's the finding that wasn't in any document: **the RestoExp dashboard has no field
  for the ticket URL.** The fields the sync pulls down are `id`, `title`, `description`,
  `bannerUrl`, `startDate`, `endDate`, `startTime`, `endTime`, `isRecurring`,
  `recurrenceType`, `recurrenceDays`, `price` and `tags`. There's nowhere to paste the
  link.

So, as things stand today, **the client can't publish a ticketed event even if they send us
the Eventbrite URL tomorrow**. We need to add the field, or agree that the link travels in
a tag, which is a patch.

### Toast, the only one that is connected

Gift cards, `toasttab.com/rooftop-and-riverside-new-27333-old-41-road/giftcards`. It's the
only commerce link on the old site and the new site keeps it. Nothing new.

One detail to resolve: questionnaire F5 says email marketing goes out through **Toast**,
which is already the POS. Our newsletter form posts to a spreadsheet webhook that doesn't
exist yet. If the list is going to live in Toast, the form's destination changes.

---

## 2. Events, which is what triggered this audit

How it has to work: **we show the event with day, time and what's happening, and each one
links out to its platform to get the ticket.** No checkout of our own and no made-up
prices.

What's missing to make that possible:

| Piece | Status |
|---|---|
| Day, time, description, space | ✅ Already comes from the dashboard |
| Event image | ✅ Since 2026-09-11 `bannerUrl` is pulled |
| **Link to the ticketing platform** | ❌ **The field doesn't exist in the dashboard** |
| Notice that a ticket or reservation is needed | ⚠️ Today it says the opposite, see below |
| Eventbrite organizer URL | ❌ Pending from the client, item 22 |

⚠️ **What the new site claims today and can't back up:** since `ticketUrl` is fixed to
`null`, every event page literally prints **"Free, no ticket needed"**
([whats-on/[slug]/page.tsx:200](src/app/whats-on/[slug]/page.tsx#L200)). It doesn't say it
because we know it's free: it says it because the field is empty. Today's four events are
free, confirmed, so today it isn't lying. But the day a ticketed show comes in, the site will
keep saying entry is free until someone touches the code.

**Calendar discrepancy that is still unresolved**, and that the brief makes worse: the
client's public calendar publishes **only two** recurring events, Ross Brown on Thursdays and
La Noche on Saturdays. The dashboard has four, adding Wooftop Wednesdays and Bingo Night.
And the brief names formats that aren't in either source: **Sunset Saturdays**, **Jazz
Wednesdays**, and big festivals with working names (*Swamp Fest*, *Glades Fest*, *Bonita
Fest*). The questionnaire itself flags it as "Discrepancy to resolve".

---

## 3. Services matrix: what a person might want to do, and where it lands

| Client service | Brief | Old site | New site | Verdict |
|---|---|---|---|---|
| **Book a table** | OpenTable (G2, §4, §6) | ✗ | ✗ | 🔴 **Can't respond**, see §1 |
| **Get a ticket to an event** | Eventbrite (H5) | ✗ | Plumbing with no URL or field | 🔴 **Can't respond** |
| **See what's on this week** | Monthly calendar, delivered on the 10th | Boomtech iframe, invisible to Google | Page per event and JSON-LD | ✅ Better than the old one |
| **Buy a gift card** | Toast Tab (A8) | ✅ | ✅ | ✅ |
| **Request a private event** | Greenfield vertical, tickets from $10K to $30K | 14-field form at `/hostanevent` | Form with guest ranges and food tier | ✅ The packet PDF is missing, item 21 |
| **Rent the game truck** | 4 PS5, 4 Xbox Series X, 2 Switch 2, with A/C | $10 per person, parties $400 and $500, 6 TVs | Prices copied from the old one | ⚠️ **Brief and site don't match on consoles or screens** |
| **Read the games waiver** | — | `/bar-games-waiver` and `/game-zone-waiver`, **live, 200** | 301 to `/the-experience`, which only says "a waiver is required" | 🔴 **Two legal documents are lost** |
| **Sign up for the ticket giveaway** | — | `/tnt-sign-ups`, **live, 200**, with official rules | 301 to `/whats-on`, **without a single line about the giveaway** | 🔴 **Real content that disappears** |
| **See a food truck's menu** | The trucks own their sales | 2 menus as images and a "VIEW MENUS" QR | ✗ No page has a menu | 🟠 **Gap**: you see who cooks, not what you eat |
| **See the bar menu** | — | 2 images with no text | ~50 items transcribed | ✅ |
| **Be a market vendor** | — | $30 fee, 10x10 space | Same data | ✅ |
| **Play live or apply** | — | Form with 15 MB upload | Goes to email until the backend is defined | ⚠️ Item 23 |
| **Donate to the charity partner** | — | `/giveback`, **live** | Section in `/our-story` | ⚠️ Current partner missing |
| **Leave a review** | Reputation Management contracted. The brief includes the link: `g.page/r/CeuPjh8GL32REAE/review` | ✗ | ✗ | 🟠 **Cheap gap to close** |
| **Watch the games** | NFC North HQ, $18,000 on Sunday Ticket | ✗ | `/nfc-north-hq` | ✅ No NFL names or logos, as the brief requires |
| **Order delivery** | Forbidden to pitch it | ✗ | ✗ | ✅ Correct that it isn't there |

---

## 4. What leaves us unable to respond, in order of severity

1. **We don't know what they use OpenTable for.** It blocks every reservations decision.
   It's item 0 of `docs/client-requests.md`.
2. **No event can lead to its ticket.** The Eventbrite URL is missing, and so is the field
   in the dashboard to enter it. We solve the second part ourselves.
3. **Event pages claim "Free, no ticket needed" by default**, not based on data.
4. **The two legal waivers are lost in a 301.** Whoever looks up the game truck waiver
   before going today finds it on the old site and won't find it on the new one.
5. **The Thursday ticket giveaway disappears.** It's real content with written official
   rules.
6. **The food trucks don't show what they sell.**
7. **Conflicting game truck numbers** between brief and site: consoles and screens.
8. **Happy hour has three versions** across footer, printed menu and `/tnt-sign-ups`.
9. **The calendar doesn't add up any way you look at it**: two public events, four in the
   dashboard, two more names in the brief.

---

## 5. Questions for the client, ready to send

1. **OpenTable**: can you book a table any day, only on event nights, or only for groups
   and private events? We also need the profile URL.
2. **Eventbrite**: organizer URL, and confirm that every ticketed event is sold there and
   not through another platform.
3. **Waivers**: are both texts still current? Should they be published as their own pages?
4. **Thursday giveaway**: is it still running?
5. **Truck menus**: do we publish them, or is it just the QR at the venue?
6. **Game truck**: how many consoles and how many screens, and whether the $10, $400 and
   $500 prices are still current.
7. **Happy hour**: Wednesday to Friday from 3 to 6, correct? The printed menu says Tuesday
   and they're closed on Tuesdays.
8. **Calendar**: do Wooftop and Bingo both happen on Wednesdays? Do Sunset Saturdays and Jazz
   Wednesdays exist, or are they working names?
9. **Email list**: does it live in Toast, as the questionnaire says, or in a spreadsheet?
