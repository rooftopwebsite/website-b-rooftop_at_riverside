import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  IMAGE_ORIGIN,
  cleanHtml,
  faqNodes,
  formatDate,
  htmlToText,
  markdownToHtml,
  postMeta,
  readMinutes,
  safeImage,
  splitFeatured,
  toPostFull,
  toPosts,
  type FeedPost,
} from './blog-format.ts';

const SITE = 'https://rooftopatriverside.com';
const COVER = `${IMAGE_ORIGIN}cover.webp`;

const feed = (over: Partial<FeedPost> = {}): FeedPost => ({
  id: '1',
  slug: 'the-art-of-paella',
  title: 'The Art of Paella — A Ritual',
  excerpt: 'Bomba rice — saffron and socarrat.',
  coverImageUrl: COVER,
  coverImageAlt: 'A paella pan — seen from above',
  ogImage: null,
  ogTitle: null,
  ogDescription: null,
  canonicalUrl: null,
  content: null,
  contentHtml: '<h1>Title</h1><p>More Than Rice — A Spanish Ritual</p>',
  jsonLd: null,
  author: { name: 'Rooftop at Riverside', avatarUrl: null },
  publishedAt: '2026-04-15',
  updatedAt: '2026-09-01T19:03:23.222Z',
  featured: false,
  ...over,
});

describe('cleanHtml', () => {
  it('removes the em dash from visible text', () => {
    assert.equal(cleanHtml('<p>More Than Rice — A Spanish Ritual</p>'), '<p>More Than Rice: A Spanish Ritual</p>');
  });
  it('converts the &mdash; entity the same as the character', () => {
    assert.equal(cleanHtml('<p>Rice &mdash; saffron</p>'), '<p>Rice: saffron</p>');
  });
  it('does not touch attributes', () => {
    const html = '<a href="/x" title="a — b">link</a>';
    assert.equal(cleanHtml(html), html);
  });
  it('does not touch code or pre', () => {
    const html = '<pre><code>a — b</code></pre><p>c — d</p>';
    assert.equal(cleanHtml(html), '<pre><code>a — b</code></pre><p>c: d</p>');
  });
  it('keeps the spaces around inline tags', () => {
    assert.equal(cleanHtml('<p>a <strong>b</strong> — c d</p>'), '<p>a <strong>b</strong>: c d</p>');
    assert.equal(cleanHtml('<p>one two <em>x</em> y</p>'), '<p>one two <em>x</em> y</p>');
  });
  it('demotes body h1s to h2', () => {
    assert.equal(cleanHtml('<h1 id="a">T</h1>'), '<h2 id="a">T</h2>');
  });
});

describe('safeImage', () => {
  it('accepts photos from public/images/blog', () => {
    assert.equal(safeImage(COVER), COVER);
  });
  it('rejects other folders and other hosts', () => {
    assert.equal(safeImage('/images/venue/bar.webp'), null);
    assert.equal(safeImage('https://example.com/a.webp'), null);
    assert.equal(safeImage(null), null);
  });
});

describe('text, minutes and date', () => {
  it('htmlToText strips tags and entities', () => {
    assert.equal(htmlToText('<p>Fish &amp; <b>chips</b></p><p>ok</p>'), 'Fish & chips ok');
  });
  it('readMinutes rounds at 230 wpm with a minimum of 1', () => {
    assert.equal(readMinutes(''), 1);
    assert.equal(readMinutes(Array(690).fill('w').join(' ')), 3);
  });
  it('formatDate does not shift the day and accepts a full ISO', () => {
    assert.equal(formatDate('2026-04-15'), 'April 15, 2026');
    assert.equal(formatDate('2026-04-15T23:59:00Z'), 'April 15, 2026');
    assert.equal(formatDate(''), '');
    assert.equal(formatDate('garbage'), '');
  });
  it('postMeta does not leave a dangling separator', () => {
    const post = toPostFull(feed({ publishedAt: null }), SITE)!;
    assert.equal(postMeta(post), '1 min read');
    assert.equal(postMeta(toPostFull(feed(), SITE)!), 'April 15, 2026 · 1 min read');
  });
});

describe('markdownToHtml', () => {
  it('escapes HTML and builds paragraphs and h2', () => {
    assert.equal(
      markdownToHtml('# Hi\n\nA <script>x</script> line\nsame paragraph\n\n## Sub'),
      '<h2>Hi</h2><p>A &lt;script&gt;x&lt;/script&gt; line same paragraph</p><h2>Sub</h2>',
    );
  });
});

describe('faqNodes', () => {
  it('pulls FAQPage out of @graph and adds @context', () => {
    const out = faqNodes([
      { '@context': 'https://schema.org', '@graph': [{ '@type': 'FAQPage', mainEntity: [] }, { '@type': 'Article' }] },
      { '@type': 'FAQPage', mainEntity: [1] },
    ]);
    assert.deepEqual(out, [
      { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [] },
      { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [1] },
    ]);
  });
  it('tolerates garbage', () => {
    assert.deepEqual(faqNodes(null), []);
    assert.deepEqual(faqNodes('x'), []);
  });
});

describe('toPostFull', () => {
  it('cleans dashes from title, excerpt and alt', () => {
    const p = toPostFull(feed(), SITE)!;
    assert.equal(p.title, 'The Art of Paella. A Ritual');
    assert.equal(p.excerpt, 'Bomba rice: saffron and socarrat.');
    assert.equal(p.imageAlt, 'A paella pan: seen from above');
    assert.equal(p.html, '<h2>Title</h2><p>More Than Rice: A Spanish Ritual</p>');
  });
  it('without a valid cover it has no image', () => {
    const p = toPostFull(feed({ coverImageUrl: 'https://example.com/beer.webp' }), SITE)!;
    assert.equal(p.image, null);
    assert.equal(p.ogImage, null);
  });
  it('builds the excerpt from the HTML if the JSON did not include one', () => {
    const p = toPostFull(feed({ excerpt: null, contentHtml: '<p>Short body.</p>' }), SITE)!;
    assert.equal(p.excerpt, 'Short body.');
    assert.equal(p.metaDescription, 'Short body.');
  });
  it('cuts a long excerpt at a word', () => {
    const long = Array(80).fill('word').join(' ');
    const p = toPostFull(feed({ excerpt: null, contentHtml: `<p>${long}</p>` }), SITE)!;
    assert.ok(p.excerpt.length <= 161);
    assert.ok(p.excerpt.endsWith('…'));
    assert.ok(!p.excerpt.includes('wor…'));
  });
  it('uses the markdown if there is no contentHtml', () => {
    const p = toPostFull(feed({ contentHtml: null, content: 'Hello — world' }), SITE)!;
    assert.equal(p.html, '<p>Hello: world</p>');
  });
  it('derives the title from the slug if missing', () => {
    assert.equal(toPostFull(feed({ title: null }), SITE)!.title, 'The Art Of Paella');
  });
  it('drops the post without a slug', () => {
    assert.equal(toPostFull(feed({ slug: '  ' }), SITE), null);
  });
  it('canonical: our own unless the JSON one is on the domain', () => {
    assert.equal(toPostFull(feed(), SITE)!.canonicalPath, '/blog/the-art-of-paella');
    assert.equal(toPostFull(feed({ canonicalUrl: 'https://other.com/x' }), SITE)!.canonicalPath, '/blog/the-art-of-paella');
    assert.equal(toPostFull(feed({ canonicalUrl: `${SITE}/blog/paella` }), SITE)!.canonicalPath, '/blog/paella');
  });
  it('og: ogTitle/ogDescription/ogImage win when present', () => {
    const og = `${IMAGE_ORIGIN}og.webp`;
    const p = toPostFull(feed({ ogTitle: 'OG — t', ogDescription: 'OG d', ogImage: og }), SITE)!;
    assert.equal(p.metaTitle, 'OG: t');
    assert.equal(p.metaDescription, 'OG d');
    assert.equal(p.ogImage, og);
  });
  it('date: takes the first 10 characters of an ISO', () => {
    assert.equal(toPostFull(feed({ publishedAt: '2026-04-15T10:00:00Z' }), SITE)!.publishedAt, '2026-04-15');
  });
});

describe('toPosts and splitFeatured', () => {
  it('drops empty and duplicate entries, keeps the order', () => {
    const out = toPosts([feed({ slug: 'a' }), feed({ slug: '' }), feed({ slug: 'a', title: 'dup' }), feed({ slug: 'b' })], SITE);
    assert.deepEqual(out.map((p) => p.slug), ['a', 'b']);
    assert.notEqual(out[0].title, 'dup');
  });
  it('the highlighted one is the featured one, otherwise the first', () => {
    const posts = toPosts([feed({ slug: 'a' }), feed({ slug: 'b', featured: true }), feed({ slug: 'c' })], SITE);
    const { featured, rest } = splitFeatured(posts);
    assert.equal(featured?.slug, 'b');
    assert.deepEqual(rest.map((p) => p.slug), ['a', 'c']);
    assert.equal(splitFeatured(toPosts([feed({ slug: 'z' })], SITE)).featured?.slug, 'z');
    assert.deepEqual(splitFeatured([]), { featured: null, rest: [] });
  });
});
