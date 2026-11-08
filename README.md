# Rooftop at Riverside

Website for Rooftop at Riverside (Bonita Springs, FL): a rooftop bar over a
food truck park. It replaces the Wix site `eatdrinkparadise.com`.

Next.js 16 (App Router) · React 19 · Tailwind 4 · Vercel. Built by RestoExp.

## Getting started

```bash
npm install
cp .env.example .env.local   # and fill in whatever is missing (see below)
npm run dev
```

## Commands

| Command | What it does |
|---|---|
| `npm run dev` / `build` / `start` | The usual Next commands |
| `npm run events:verify` | Checks `src/content/events.json`: that every event has its poster, that the file exists, that all dates of an event use the same photo and that no two events share one |
| `npm run media` | Generates the photos and videos in `public/` from `public/multimedia/` (originals, outside git) |
| `npm run og` | Generates the social sharing images (`public/og/`). The original design lives in `_internal/og/` |
| `npm run media:import` | Downloads the old site's photos into `public/images/` |
| `npm run media:fetch-old-site` | Downloads all the material published on the current site |
| `npm run media:photo-bank` | Builds the single photo bank, without duplicates |
| `npm run greek-key` / `horizon` | Regenerate two brand graphic pieces |
| `npm run a11y` · `contrast` · `check:*` | Audits: accessibility, contrast, SEO, CSS, tokens, shadows, grain, surface rhythm and reduced motion |

The audits that open pages need the server running. By default they point to
`localhost:3157`; change it with `BASE=http://localhost:PORT`.

## Environment variables

The commented template is `.env.example`. In short:

- **`MAILJET_API_KEY`, `MAILJET_SECRET_KEY`**: Mailjet API credentials (Account settings, API
  Key Management). All form emails go out through Mailjet from
  `Rooftop at Riverside <info@eatdrinkparadise.com>`, which has to be a verified sender in
  Mailjet. Set them in the Render environment, never in the repo.
- **`MAIL_TO_CONTACT`, `MAIL_TO_EVENTS`, `MAIL_TO_CAREERS`, `MAIL_TO_MARKET`,
  `MAIL_TO_BOOKING`**: which inbox each form goes to. The routing is in
  `src/lib/inboxes.ts`.
- **`MAILJET_CONTACT_LIST_ID`**: the Mailjet contact list that confirmed newsletter subscribers
  are added to (`10656804`).
- **`NEWSLETTER_TOKEN_SECRET`**: server-only secret that signs the newsletter confirmation links.
  At least 32 characters; generate one with `openssl rand -hex 32`. Set it on Render, never in the
  repo. Changing it invalidates links that are already out.
- **`NEWSLETTER_LINK_BASE_URL`** (optional): the site address used in the confirmation email link.
  Defaults to `https://rooftopatriverside.com`. Set it on a staging site so the link points back there.

### Newsletter double opt-in

1. The footer form needs first name, email and the unchecked consent box. It sends a confirmation
   email through Mailjet. Nothing is added to the Mailjet list yet.
2. The email link opens `/newsletter/confirm?token=...`. The page shows a button, and only the
   button press adds the contact to the list, with the `addnoforce` action (a contact who
   unsubscribed earlier is never resubscribed).
3. The link is a signed token (HMAC-SHA256) that expires after 24 hours. There is no database.
   **The token is time-limited but not strictly single-use:** a second press within 24 hours
   repeats the same safe `addnoforce` call, which changes nothing. Strict single-use would
   need persistent storage.
4. Every campaign sent from Mailjet to this list must keep Mailjet's unsubscribe link in the
   template.

There is no database and no variable is needed to read content.

## Editable data

All the content that changes lives in JSON inside `src/content/`. You edit the
file, commit, and Vercel publishes. There is no database and no dashboard.

| File | What it holds |
|---|---|
| `contact.json` | Phone, emails (general, events, hiring), address, coordinates, Google Maps link, social, gift cards and Eventbrite |
| `hours.json` | Opening hours for the bar (`bar`) and the trucks (`trucks`) per day. Each day is `{ "open": "15:00", "close": "21:00" }` in 24 h, or `"closed"`. A closing time after midnight is written as is (`"02:00"`) |
| `menus.json` | The PDF menus: `name`, `description`, `pdf` (path inside `public/`, e.g. `/menus/sunset-bar.pdf`) and `active`. The one called `Sunset Bar` is the bar's; the rest are matched by name with the trucks in `trucks.ts` |
| `events.json` | The calendar. One entry per date (an event repeated on scattered dates has several). Poster in `public/images/events/posters/`, referenced in `bannerUrl`. Recurring ones have `isRecurring: true` and `recurrenceDays` with the days (`"[0,6]"`, 0 = Sunday). The venue comes from `tags` (`sunset-bar`, `the-yard`, `game-lounge`) and `featured` highlights it |
| `jobs.json` | Openings for `/join-us`. Empty = none are listed. Fields: `id`, `title`, `description`, `requirements`, `employment_type`, `department`, `salary_type`, `salary_min`, `salary_max`, `status` (`open`) |
| `blog.json` | Blog posts. Empty = the blog is hidden from the menu, the footer and the sitemap. Minimum fields: `id`, `slug`, `title`, `excerpt`, `contentHtml` (or `content` in markdown), `coverImageUrl` (in `public/images/blog/`), `coverImageAlt`, `publishedAt`, `featured` |

After touching events it's worth running `npm run events:verify`.

## Where everything is

```
src/app/            routes; each form has its server action in app/actions/
src/components/     form/ (shared fields), sections/ (page blocks), shared/
src/content/        all the site's text and data: TypeScript and the editable JSON
src/lib/            venue, SEO, mail, form schemas (lib/schemas/)
public/             only what gets published: derived photos, videos, OG, PDFs
scripts/            media generators and audits (see the table above)
docs/               project decisions and the old site's inventory
design-audit/       before/after captures from the visual audit
_internal/           client and working material. NOT versioned or published
```

## Rules you can't see in the code

- **Client material stays out of git.** PDFs, briefs, photo originals and
  licensed fonts go to `_internal/`. `.gitignore` and `.vercelignore` cover it.
- **No made-up data.** A content gap is marked with `<PhotoPending>`,
  `<PendingData>` or `<PendingBlock>` and only goes away when the data arrives.
- **The old site's 301s are not touched** without reviewing `next.config.ts`
  and `docs/current-site-inventory.md`.
- **Prettier is not run:** the repo doesn't use it and it would rewrite every
  file.
- The client's context lives in `docs/` (start with
  `docs/current-site-inventory.md` and `docs/client-requests.md`).
