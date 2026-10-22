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
} from './blog-format';

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
  author: { name: 'Resto Experience', avatarUrl: null },
  publishedAt: '2026-04-15',
  updatedAt: '2026-09-01T19:03:23.222Z',
  featured: false,
  ...over,
});

describe('cleanHtml', () => {
  it('saca el guion medio del texto visible', () => {
    assert.equal(cleanHtml('<p>More Than Rice — A Spanish Ritual</p>'), '<p>More Than Rice: A Spanish Ritual</p>');
  });
  it('convierte la entidad &mdash; igual que el caracter', () => {
    assert.equal(cleanHtml('<p>Rice &mdash; saffron</p>'), '<p>Rice: saffron</p>');
  });
  it('no toca atributos', () => {
    const html = '<a href="/x" title="a — b">link</a>';
    assert.equal(cleanHtml(html), html);
  });
  it('no toca code ni pre', () => {
    const html = '<pre><code>a — b</code></pre><p>c — d</p>';
    assert.equal(cleanHtml(html), '<pre><code>a — b</code></pre><p>c: d</p>');
  });
  it('conserva los espacios alrededor de etiquetas inline', () => {
    assert.equal(cleanHtml('<p>a <strong>b</strong> — c d</p>'), '<p>a <strong>b</strong>: c d</p>');
    assert.equal(cleanHtml('<p>one two <em>x</em> y</p>'), '<p>one two <em>x</em> y</p>');
  });
  it('baja los h1 del cuerpo a h2', () => {
    assert.equal(cleanHtml('<h1 id="a">T</h1>'), '<h2 id="a">T</h2>');
  });
});

describe('safeImage', () => {
  it('acepta las fotos de public/images/blog', () => {
    assert.equal(safeImage(COVER), COVER);
  });
  it('rechaza otras carpetas y otros hosts', () => {
    assert.equal(safeImage('/images/venue/bar.webp'), null);
    assert.equal(safeImage('https://example.com/a.webp'), null);
    assert.equal(safeImage(null), null);
  });
});

describe('texto, minutos y fecha', () => {
  it('htmlToText saca etiquetas y entidades', () => {
    assert.equal(htmlToText('<p>Fish &amp; <b>chips</b></p><p>ok</p>'), 'Fish & chips ok');
  });
  it('readMinutes redondea a 230 ppm con mínimo 1', () => {
    assert.equal(readMinutes(''), 1);
    assert.equal(readMinutes(Array(690).fill('w').join(' ')), 3);
  });
  it('formatDate no se corre de día y acepta ISO completo', () => {
    assert.equal(formatDate('2026-04-15'), 'April 15, 2026');
    assert.equal(formatDate('2026-04-15T23:59:00Z'), 'April 15, 2026');
    assert.equal(formatDate(''), '');
    assert.equal(formatDate('garbage'), '');
  });
  it('postMeta no deja el separador colgando', () => {
    const post = toPostFull(feed({ publishedAt: null }), SITE)!;
    assert.equal(postMeta(post), '1 min read');
    assert.equal(postMeta(toPostFull(feed(), SITE)!), 'April 15, 2026 · 1 min read');
  });
});

describe('markdownToHtml', () => {
  it('escapa HTML y arma párrafos y h2', () => {
    assert.equal(
      markdownToHtml('# Hi\n\nA <script>x</script> line\nsame para\n\n## Sub'),
      '<h2>Hi</h2><p>A &lt;script&gt;x&lt;/script&gt; line same para</p><h2>Sub</h2>',
    );
  });
});

describe('faqNodes', () => {
  it('saca FAQPage de @graph y le pone @context', () => {
    const out = faqNodes([
      { '@context': 'https://schema.org', '@graph': [{ '@type': 'FAQPage', mainEntity: [] }, { '@type': 'Article' }] },
      { '@type': 'FAQPage', mainEntity: [1] },
    ]);
    assert.deepEqual(out, [
      { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [] },
      { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [1] },
    ]);
  });
  it('tolera basura', () => {
    assert.deepEqual(faqNodes(null), []);
    assert.deepEqual(faqNodes('x'), []);
  });
});

describe('toPostFull', () => {
  it('limpia guiones de título, extracto y alt', () => {
    const p = toPostFull(feed(), SITE)!;
    assert.equal(p.title, 'The Art of Paella. A Ritual');
    assert.equal(p.excerpt, 'Bomba rice: saffron and socarrat.');
    assert.equal(p.imageAlt, 'A paella pan: seen from above');
    assert.equal(p.html, '<h2>Title</h2><p>More Than Rice: A Spanish Ritual</p>');
  });
  it('sin portada válida queda sin imagen', () => {
    const p = toPostFull(feed({ coverImageUrl: '/images/blog/beer.webp' }), SITE)!;
    assert.equal(p.image, null);
    assert.equal(p.ogImage, null);
  });
  it('arma el extracto desde el HTML si el dashboard no lo trajo', () => {
    const p = toPostFull(feed({ excerpt: null, contentHtml: '<p>Short body.</p>' }), SITE)!;
    assert.equal(p.excerpt, 'Short body.');
    assert.equal(p.metaDescription, 'Short body.');
  });
  it('corta el extracto largo en una palabra', () => {
    const long = Array(80).fill('word').join(' ');
    const p = toPostFull(feed({ excerpt: null, contentHtml: `<p>${long}</p>` }), SITE)!;
    assert.ok(p.excerpt.length <= 161);
    assert.ok(p.excerpt.endsWith('…'));
    assert.ok(!p.excerpt.includes('wor…'));
  });
  it('usa el markdown si no hay contentHtml', () => {
    const p = toPostFull(feed({ contentHtml: null, content: 'Hello — world' }), SITE)!;
    assert.equal(p.html, '<p>Hello: world</p>');
  });
  it('saca el título del slug si falta', () => {
    assert.equal(toPostFull(feed({ title: null }), SITE)!.title, 'The Art Of Paella');
  });
  it('descarta la nota sin slug', () => {
    assert.equal(toPostFull(feed({ slug: '  ' }), SITE), null);
  });
  it('canonical: propio salvo que el del dashboard sea del dominio', () => {
    assert.equal(toPostFull(feed(), SITE)!.canonicalPath, '/blog/the-art-of-paella');
    assert.equal(toPostFull(feed({ canonicalUrl: 'https://otro.com/x' }), SITE)!.canonicalPath, '/blog/the-art-of-paella');
    assert.equal(toPostFull(feed({ canonicalUrl: `${SITE}/blog/paella` }), SITE)!.canonicalPath, '/blog/paella');
  });
  it('og: ogTitle/ogDescription/ogImage ganan si vienen', () => {
    const og = `${IMAGE_ORIGIN}og.webp`;
    const p = toPostFull(feed({ ogTitle: 'OG — t', ogDescription: 'OG d', ogImage: og }), SITE)!;
    assert.equal(p.metaTitle, 'OG: t');
    assert.equal(p.metaDescription, 'OG d');
    assert.equal(p.ogImage, og);
  });
  it('fecha: toma los 10 primeros caracteres de un ISO', () => {
    assert.equal(toPostFull(feed({ publishedAt: '2026-04-15T10:00:00Z' }), SITE)!.publishedAt, '2026-04-15');
  });
});

describe('toPosts y splitFeatured', () => {
  it('descarta vacíos y repetidos, respeta el orden', () => {
    const out = toPosts([feed({ slug: 'a' }), feed({ slug: '' }), feed({ slug: 'a', title: 'dup' }), feed({ slug: 'b' })], SITE);
    assert.deepEqual(out.map((p) => p.slug), ['a', 'b']);
    assert.notEqual(out[0].title, 'dup');
  });
  it('la destacada es la featured, si no la primera', () => {
    const posts = toPosts([feed({ slug: 'a' }), feed({ slug: 'b', featured: true }), feed({ slug: 'c' })], SITE);
    const { featured, rest } = splitFeatured(posts);
    assert.equal(featured?.slug, 'b');
    assert.deepEqual(rest.map((p) => p.slug), ['a', 'c']);
    assert.equal(splitFeatured(toPosts([feed({ slug: 'z' })], SITE)).featured?.slug, 'z');
    assert.deepEqual(splitFeatured([]), { featured: null, rest: [] });
  });
});
