import type { NextConfig } from 'next';
import { retiredTruckRedirects, truckBySlug } from './src/content/trucks';

/**
 * 301s from the Wix site.
 *
 * The ones for retired trucks are NOT written by hand: they come from
 * `content/trucks.ts`. Setting a truck to `active: false` generates its
 * redirect on its own, which is the brief's hard requirement.
 *
 * ⚠️ `statusCode: 301` and not `permanent: true`. Next emits **308** for
 * `permanent`, and although Google treats 308 the same as 301, the brief asks
 * for 301 explicitly and there are old crawlers that don't handle 308.
 *
 * ⚠️ NO CHAINS. An old Wix URL never goes through two hops: if the truck is
 * retired, the redirect points straight to `/food-trucks`. See `truckUrl()`.
 */

/**
 * Where an old-site truck URL goes.
 * If the truck is still active, to its page. If it is retired, STRAIGHT to the
 * index (not to the truck page, which would in turn redirect).
 */
function truckUrl(slug: string): string {
  const truck = truckBySlug(slug);
  return truck?.active ? `/food-trucks/${slug}` : '/food-trucks';
}

const nextConfig: NextConfig = {
  /*
   * ⚠️ THE SERVER ACTIONS CEILING GOES UP FROM 1 MB TO 4.5 MB, which is the
   * ceiling for a request on Vercel: going past it is useless, because the
   * platform cuts it off first. With 1 MB, any PDF resume longer than one page
   * took down the whole action. What the browser lets you send is a bit below
   * that (`MAX_REQUEST_MB` in `lib/schemas/join.ts`) to leave room for the rest
   * of the multipart body.
   */
  experimental: {
    serverActions: {
      bodySizeLimit: '4.5mb',
    },
  },

  images: {
    formats: ['image/avif', 'image/webp'],

    /*
     * The Figma brand assets come as SVG (reversed lockup, truck isotype, the
     * waves), and `next/image` rejects them unless this is enabled.
     *
     * ⚠️ The name sounds scarier than it is here. The real risk of
     * `dangerouslyAllowSVG` is serving THIRD-PARTY SVGs: an SVG can carry
     * `<script>`. All of ours are our own files in `public/brand`, reviewed,
     * with a single `fill`. Even so they go with the safety net Next
     * recommends: a CSP with `script-src 'none'` and `sandbox`, which disables
     * scripts even if one ever gets in.
     */
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  async redirects() {
    return [
      // ── Wix → new routes ──────────────────────────────────────────────
      { source: '/this-is-us', destination: '/our-story', statusCode: 301 },
      { source: '/eat', destination: '/food-trucks', statusCode: 301 },
      { source: '/drink', destination: '/sunset-bar', statusCode: 301 },
      { source: '/calendar', destination: '/whats-on', statusCode: 301 },
      { source: '/hostanevent', destination: '/events', statusCode: 301 },
      { source: '/neighborhood-market', destination: '/market', statusCode: 301 },
      // /entertainment is NOT programming: it is musician recruiting.
      { source: '/entertainment', destination: '/join-us', statusCode: 301 },
      { source: '/game-lounge', destination: '/game-truck', statusCode: 301 },
      { source: '/find-us', destination: '/contact#visit', statusCode: 301 },
      { source: '/parking', destination: '/contact#parking', statusCode: 301 },

      // ── Truck pages from the old site ─────────────────────────────────
      { source: '/primecarvery', destination: truckUrl('prime-carvery'), statusCode: 301 },
      { source: '/tropicalfusion', destination: truckUrl('tropical-fusion'), statusCode: 301 },
      { source: '/seameonwheels', destination: truckUrl('sea-me-on-wheels'), statusCode: 301 },
      { source: '/el-chilango', destination: truckUrl('el-chilango'), statusCode: 301 },

      /*
       * ⚠️ `/ocn`: DEVIATION FROM THE BRIEF, pending confirmation.
       *
       * The brief asks for `/ocn → /food-trucks`. But on the current site
       * `/ocn` is NOT an orphan page: it already returns a 301 to
       * `/seameonwheels`. And OCN Seafood Co. is a truck on the January 2026
       * roster, so the URL points to an active vendor, not a dead one.
       *
       * Sending it to the index throws away the equity of a live URL. Here it
       * goes to OCN's page. If it turns out OCN and Sea Me on Wheels are not
       * the same business, this single line is the one to change.
       */
      { source: '/ocn', destination: truckUrl('ocn-seafood-co'), statusCode: 301 },

      /*
       * ⚠️ Old-site routes the brief doesn't cover. See
       * docs/current-site-inventory.md §1. These destinations are PROVISIONAL
       * and waiting on your decision:
       *
       *   /giveback       Charity Partner Program: real content, no destination
       *   /tnt-sign-ups   ticket giveaway: real content, no destination
       *   /blank, /blank-1, /inquiry-services-page: untouched Wix templates
       *
       * ⚠️ `/bar-games-waiver` AND `/game-zone-waiver` ARE NO LONGER HERE, and
       * each used to have a 301 to `/game-truck#policies`. On 2026-09-22 they
       * became our own pages with the full text of each document, so both
       * routes now resolve on their own and keep their slug: the old links,
       * and the confirmation email the client sends to every party, still
       * land where they said they would.
       *
       * Sending them to an anchor was the worst possible destination of the
       * two: whoever was looking for the paper they had signed landed on a
       * seven-point summary, and on top of that the bar games one isn't even
       * the truck's.
       */
      { source: '/giveback', destination: '/our-story', statusCode: 301 },
      { source: '/tnt-sign-ups', destination: '/whats-on', statusCode: 301 },
      { source: '/blank', destination: '/market', statusCode: 301 },
      { source: '/blank-1', destination: '/', statusCode: 301 },
      { source: '/inquiry-services-page', destination: '/events#inquire', statusCode: 301 },

      /*
       * ══════════════════════════════════════════════════════════════════
       * ⚠️ THE ROUTES THAT WERE MERGED. They are 301s to an ANCHOR, not to a
       * page.
       *
       * The site went from 23 routes to 10. Camila, reviewing which secondary
       * pages the site really needs: «private events with their services
       * right there, not a page for each service», «about with the questions
       * inside, not a questions page», «contact with visit inside».
       *
       * ⚠️ THESE REDIRECTS ARE NOT OPTIONAL even though the site isn't in
       * production with traffic yet. Two concrete reasons:
       *
       *   · the site's ~60 CTAs point to `/events/inquire`, and not one of
       *     them had to be touched: the redirect takes them to the anchor;
       *   · the old URLs already circulated (there is an
       *     `/inquiry-services-page` on the Wix site that points there) and
       *     the client may have shared them.
       *
       * ⚠️ THE ANCHOR HAS TO EXIST. Every destination below is an `id` set by
       * hand in its component. Renaming one breaks the redirect silently: the
       * browser loads the page and stays at the very top. They are noted in
       * each file.
       * ══════════════════════════════════════════════════════════════════
       */
      { source: '/the-experience', destination: '/our-story', statusCode: 301 },
      { source: '/faq', destination: '/our-story', statusCode: 301 },
      { source: '/visit', destination: '/contact#visit', statusCode: 301 },
      /*
       * ⚠️ FOOTBALL DOESN'T GO TO AN ANCHOR, IT GOES TO THE CALENDAR.
       * `/nfc-north-hq` wasn't merged into another page: it stopped being a
       * page. It is now a recurring event loaded in the dashboard with the
       * `featured` tag, and `/whats-on` opens it with a large card. Camila:
       * «football Sundays should be a recurring calendar event» + «they'll go
       * in the calendar but with a space or a big card, much more prominent».
       */
      { source: '/nfc-north-hq', destination: '/whats-on', statusCode: 301 },
      { source: '/events/inquire', destination: '/events#inquire', statusCode: 301 },
      { source: '/events/spaces', destination: '/events#spaces', statusCode: 301 },
      { source: '/events/game-truck', destination: '/game-truck', statusCode: 301 },
      { source: '/events/corporate', destination: '/events#corporate', statusCode: 301 },
      { source: '/events/celebrations', destination: '/events#celebrations', statusCode: 301 },
      { source: '/events/fundraisers', destination: '/events#fundraisers', statusCode: 301 },
      {
        source: '/events/holiday-parties',
        destination: '/events#holiday-parties',
        statusCode: 301,
      },

      // ── Generated from the data ───────────────────────────────────────
      ...retiredTruckRedirects(),
    ];
  },
};

export default nextConfig;
