# Blog: listing and post template

Date: September 23, 2026. Decisions made with Camila in session.

Camila: «design the blog page and the page for each blog post, which will be a
template; for this take into account the style of our whole website and audit the
blog and post pages on pretty, santa maria and yava. In this case for each
post we'll put the image and the title without the crop play, we'll use it in a more
common way. Keep in mind that everything must be connected to the rest
exp database like the rest of our projects».

Rooftop today has no blog at all: no route, no function in `lib/restoexp.ts`,
no entry in the nav, sitemap or `PAGE_SEO`.

---

## 1. What was audited

The four sibling sites (Pretty Hens, Santa Maria, Yava and Juanitos as an
extra reference) read the **same public dashboard feed**:

```
GET https://app.restoexp.com/api/public/restaurants/<RESTAURANT_ID>/blogs
→ { data: FeedPost[] }   // already filtered to published, featured first, then newest to oldest
```

It doesn't require a key. Tested on 2026-09-23: **Rooftop returns 0 posts**, Yava 3,
Santa Maria 2. The real fields of each post:

`id, slug, canonicalUrl, title, excerpt, coverImageUrl, coverImageAlt,
ogImage, ogTitle, ogDescription, content (markdown), contentHtml (sanitized
by the dashboard), jsonLd, author {name, avatarUrl}, publishedAt (YYYY-MM-DD),
updatedAt (ISO), featured`

| | Pretty Hens | Santa Maria | Yava | Juanitos |
|---|---|---|---|---|
| Data layer | **the best**: `cache()`, `server-only`, tests | good, tolerant mapping | weak | like Yava |
| Cover host protected | yes (`safeImageUrl`) | **no, it crashes** | broad pattern | raw `<img>` |
| Canonical and OG per post | yes | **no** | **no** | yes, with dimensions |
| Date and back to blog | **no** | yes, top and bottom | yes (date twice) | yes |
| Editor block styles | no | no | **yes** (FAQ, callout, embed) | yes |

What is **not** copied:

- `no-store` + `force-dynamic` everywhere, and the feed fetch in Pretty Hens'
  root layout: one call to the dashboard for every page on the site.
- Yava's schema, which builds `https://sitio/https://supabase…` as the image.
- Yava's excerpt, which comes out empty when `contentHtml` arrives.
- The visible author: the feed sends «Resto Experience», which is the agency.
- Yava's justified text at 1280px.

⚠️ **The posts' HTML brings em dashes** («More Than Rice — A Spanish
Ritual», a real Santa Maria post). The site's rule doesn't allow them in visible
text.

---

## 2. Decisions

| # | Decision | Why |
|---|---|---|
| 1 | The public feed is read, with Next's cache: `revalidate: 600`, tags `['restoexp', 'blog']` | Same source as the siblings, but without hitting the dashboard on every visit. A new post shows up on its own within 10 minutes |
| 2 | The id comes from `NEXT_PUBLIC_SUPABASE_RESTAURANT_ID`, the one Rooftop already uses | Don't add a second name for the same piece of data |
| 3 | Optional override `BLOG_RESTAURANT_ID` | Only for verifying in dev with another restaurant's posts while Rooftop has 0. It doesn't go into the production `.env` |
| 4 | **Empty feed → the page shows, with an empty state** (Camila's option B) | The link is in the nav from day one |
| 5 | The listing carries `PlateHero` like the other inner pages | It's just another inner page of the site |
| 6 | **The post goes classic: rectangular cover and title, no plate or inverted corners** | Camila's request |
| 7 | **The post's `h1` goes monochrome** | Camila's explicit exception to the colored-word rule: the title comes from the dashboard and the word can't be picked by hand |
| 8 | The author isn't shown; in the schema the author is Rooftop (Organization) | The feed brings the agency's name |
| 9 | No pagination, categories, sharing or search | The feed doesn't bring categories and today there are 0 posts. Pagination comes in when they pass 12 |

---

## 3. Data layer

### `src/lib/blog-format.ts`: pure, no fetch, with tests

- `toPost(feed): Post | null`. Discards posts without a slug; if the title is missing, it
  takes it from the slug.
- **Em dashes:** `withoutEmDash` (the one from `lib/restoexp.ts`) on title,
  excerpt, alt, and on **every text between tags** in the HTML. Never inside
  attributes or `<code>`/`<pre>`.
- Body `h1` → `h2`, so the page has a single `h1`.
- `safeImage(url)`: only lets through
  `https://kqibgbvdgxrjhdyfoxvm.supabase.co/storage/v1/object/public/restaurant-assets/…`,
  which is the `remotePattern` in `next.config.ts`. Any other host or relative
  path (Yava's point to its own `public/`) → `null`: the post ends up
  without a photo, it doesn't crash.
- **Reading minutes and fallback excerpt:** they come from the HTML text and,
  if there is none, from the markdown. 230 words per minute, minimum 1.
- `faqNodes(jsonLd)`: only the `FAQPage` ones, walking `@graph`, each one with
  its `@context`.
- **Body without `contentHtml`:** as long as the dashboard doesn't always send it, the
  markdown is printed as paragraphs of escaped text. No new library: the
  two real feeds today already bring `contentHtml`.

Output type:

```ts
export interface Post {
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly image: string | null;
  readonly imageAlt: string;
  readonly publishedAt: string;  // YYYY-MM-DD or ''
  readonly modifiedAt: string;   // ISO or ''
  readonly readMinutes: number;
  readonly featured: boolean;
}
export interface PostFull extends Post {
  readonly html: string;
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly ogImage: string | null;
  readonly canonicalPath: string; // `/blog/<slug>`, or the dashboard's if it's on our own domain
  readonly faqJsonLd: readonly unknown[];
}
```

### `src/lib/blog.ts`: the fetch

- `import 'server-only'`, a single read wrapped in React's `cache()`
  so metadata, page and sitemap share the same request.
- `getPosts(): Promise<readonly Post[]>`, `getPost(slug): Promise<PostFull | null>`,
  `getPostSlugs()`.
- **If the feed fails:**
  - `getPosts()` for the listing returns `[]` and logs the error → empty
    state. It's Rooftop's convention: the database never takes down a page.
  - `getPost(slug)` **throws** → 500. A 404 would tell Google to delete an
    indexed URL because of a ten-minute outage.
- `generateStaticParams` with the slugs and `dynamicParams` set to `true`: a post
  loaded after the build is generated on the first request.

⚠️ Like the rest of `restoexp.ts`, the cache lives in `.next/cache/fetch-cache`:
to see a freshly loaded post in dev you have to delete that folder. See the
database memory.

---

## 4. Listing `/blog`

> ⚠️ Surfaces and cards changed in the first review: see §10.

| # | Section | Component | Surface |
|---|---|---|---|
| 1 | Hero | `PlateHero` with question, `title` + `titleAccent`, terrace photo, breadcrumbs | photo + `bone` plate |
| 2 | Featured post | `FeaturedPost` (new) | white |
| 3 | Rest of the posts | `PostGrid` + `PostCard` (new) | white |
| 2′ | Empty state, in place of 2 and 3 | `BlogEmpty` (new) | `bone` |
| 4 | Closing | `FindUs`, the inner pages' closing since 2026-09-22 | `bone` with its arch |

- **Hero:** h1 «Stories from the» + accent «Rooftop» (goes into `PAGE_SEO['/blog']`
  and is checked by `check:seo`). The plate carries its inverted corners as on the
  other inner pages.
- **Featured post:** the one with `featured`, or otherwise the first in the feed.
  Desktop: 3:2 photo on the left (7 of 12 columns), text on the right with
  eyebrow «date · N min read», title in display `h2`, excerpt and link
  «Read the story». Tablet and mobile: it stacks, photo on top.
- **Grid:** 1 column on mobile, 2 from 640px, 3 from 1024px.
  - `PostCard`: 3:2 photo with `rounded-card`, eyebrow with the date, title with
    `role="card"` (Jost, mixed case: the condensed face doesn't go below 24px), excerpt
    clamped to 3 lines.
  - The whole card is clickable with **a single** link (the title's, stretched
    with `::after`). Hover same as `Card`'s: −2px, photo ×1.03, title to `deep`.
  - No cover: a `bone` block with the monogram, never `PhotoPending` (it's not
    a missing photo, it's a post without a photo).
- **Empty state:** headline «Stories are on their way», a subhead and a
  single-line CTA to What's On.

## 5. Post `/blog/[slug]`

> ⚠️ Breadcrumbs, cover, closing and "More stories" changed in the first review: see §10.

From top to bottom, all inside `page-box`:

1. **Header on white**, reading width:
   - breadcrumbs Home / Blog / title;
   - eyebrow «September 8, 2026 · 6 min read» (date in UTC, no shift);
   - monochrome `h1`, fluid `text-h2`, display uppercase;
   - the excerpt as subhead, separated with `gap-subhead`.
2. **Cover**: wider than the text (up to 1280), **rectangular**, 16:9 on
   desktop and tablet, 4:3 on mobile, `rounded-image`, `priority`, `sizes`
   declared, alt from the dashboard. No plate, no inverted corners, no
   crop. If the post has no cover, nothing is drawn.
3. **Body** in `.prose-post` (new, in `globals.css`, based on
   `.prose-legal`):
   - `max-width` ~68ch, Jost 18px/1.75 from tablet, 17px on mobile;
   - **paragraph gap 12px** (site rule: smaller than headline→subhead);
   - `h2` display `d4` uppercase, `h3` Jost 600;
   - `link-text` links in `deep`; list markers in `sunset-deep`;
   - blockquotes with a `sunset` rule on the left;
   - images and `figure` at 100%, `rounded-image`, `figcaption` in `caption`;
   - editor blocks (FAQ, callout, embed), ported from Yava's `.post`;
   - `text-align: left`, never justified.
4. **Post closing:** «Back to all stories» link and, if there are other posts,
   «More stories» with up to 3 `PostCard` (the newest, excluding the current one).
5. **`FindUs`**, the same closing as the listing.
6. **Slug that doesn't exist** → `notFound()`, which uses the site's `not-found.tsx`.

---

## 6. SEO, nav and sitemap

- `generateMetadata` per post, extending `pageMeta` with `type: 'article'`,
  `publishedTime` and `modifiedTime`. Title `ogTitle || title`, description
  `ogDescription || excerpt`, image `ogImage || cover || the site's`,
  own canonical unless the dashboard's is on our domain.
- JSON-LD: `BlogPosting` (with absolute image, `datePublished`,
  `dateModified`, author and publisher Rooftop) + `BreadcrumbList` + FAQ.
  Escaped with the `jsonLdScript()` from `lib/seo.ts`.
- `/blog` in `PAGE_SEO`, in `ALL_ROUTES` and in the sitemap; each post adds its
  URL with `lastModified`.
- Nav: «Blog» in the mega-menu's «Get to know us» group, with a hint; and in the
  footer's quick links.

## 7. Motion and accessibility

- `Reveal` and `Motion` stagger on the grid; nothing on the post header
  (the `h1` and the cover are the LCP). With reduced motion the layout is identical.
- A single `h1` per page, `h2` hierarchy in the body.
- Contrast: eyebrows in `muted` on white and on `bone`, to be verified with
  `npm run contrast`.
- Single-line CTAs at every width.

## 8. Verification

1. Tests for `blog-format.ts` with `node --test --experimental-strip-types`:
   em dashes in text and not in attributes, `h1`→`h2`, cover host,
   excerpt and minutes from HTML, FAQ with `@context`.
2. Dev with Santa Maria's `BLOG_RESTAURANT_ID` (2 real posts) to see the
   listing, featured, grid and post; and without override to see Rooftop's
   empty state.
3. Screenshots at 1440, 1024, 768 and 390.
4. `npm run check:seo`, `check:surfaces`, `contrast`, `build`.

## 9. Non-blocking pending items

- Rooftop has no posts: the content is loaded in the dashboard.
- Listing hero photo: one of the terrace that's already on the site is used.

---

## 10. First review on screenshots (same day)

Camila looked at both pages running, in both states, and asked:

- «add waves for the background changes, so it doesn't look so basic»
- «put the featured post in a card; make the cards like the ones in
  our project, with a dotted line»
- about the post, crossing out the breadcrumbs and marking a box the width of the
  text over the photo: «the title, content and everything before the image
  centered, and the image smaller, at most the width of the text. Also let's not
  put at the end the block that shows other posts»

How it ended up built. This overrides §4 and §5:

| | Before | Now |
|---|---|---|
| Listing, surfaces | hero `bone` · posts `paper` · `FindUs` | hero `bone` · **`SoftWave` bone→mint** · posts on **`mint`** · `FindUs` with its arch |
| Empty state | loose `paper` band | the same die-cut slab, on the mint band |
| Featured post | loose photo and text | **`EventTypes` die-cut slab**: paper, `card-shadow`, dotted rule `inset-3.5` `border-deep/35`, photo tucked in with the text's padding (`p-7 lg:p-12`) |
| `PostCard` | `shared/Card` card with `ring-fog` | the same slab, small: `rounded-door`, rule at 10px, `rounded-ticket` photo with margin |
| Post, header | left-aligned, with breadcrumbs | **centered, no visible breadcrumbs** (the schema's `BreadcrumbList` stays) |
| Post, cover | 16:9 up to 1280px | **3:2, at the text's width** (`MEASURE`, 42rem, the same `max-width` as `.prose-post`) |
| Post, footer | «More stories» with 3 cards | **no other posts**: «Back to all stories» and `FindUs` |

Other things that changed while building:

- **`.prose-post` lives in `src/app/blog/prose-post.css`**, imported by the
  post, and not in `globals.css`: another session was editing `globals.css` at the
  same time.
- **The article OG is assembled in the page**, on top of what `pageMeta` returns,
  without touching `seo.ts`, for the same reason.
- **«Blog» goes in `LINKS_ABOUT` in `Footer.tsx`**. Nobody uses
  `FOOTER_QUICK_LINKS` from `nav.ts`.
- **Tests:** `node --import ./scripts/test-hooks.mjs --test "src/**/*.test.ts"`
  (27). There's no script in `package.json` because the other
  session was editing it.
