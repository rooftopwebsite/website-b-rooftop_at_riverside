import fs from 'node:fs/promises';

/**
 * Aborts if the server you're about to measure is NOT serving the current build.
 *
 * ⚠️ It exists because the same mistake happened THREE times in the project, and
 * all three times the guard ended up green or red for the wrong reason:
 *
 *   · `a11y` came out clean while measuring a page with no styles (stale chunks)
 *   · `check:motion` reported «identical layout» against the wrong port
 *   · `check:seo` flagged a broken H1 that was fine in the on-disk build,
 *     because `next start` had died with EADDRINUSE and a stale process from
 *     another session was answering
 *
 * Printing the port helps, but it isn't enough: the port can be the right one
 * and the process still stale.
 *
 * ⚠️ The BUILD_ID is NOT compared. That was the first attempt and it's wrong for
 * this project: with Turbopack the chunks come out as `/_next/static/chunks/<hash>.js`
 * and the build id does NOT appear in the HTML, so the check failed even
 * against a freshly started server. What does change on every build and is
 * in the HTML is the name of the emitted CSS, which carries a content hash.
 */

/** Is it `next dev`? There's nothing stale to detect there: it recompiles on every request. */
function looksLikeDev(html, headers) {
  return (
    html.includes('hmr-client') ||
    html.includes('__turbopack') ||
    (!headers.has('x-nextjs-prerender') && (headers.get('cache-control') ?? '').includes('no-cache'))
  );
}

export async function assertFresh(base) {
  console.log(`Target: ${base}`);

  let res;
  try {
    res = await fetch(base, { redirect: 'follow' });
  } catch (err) {
    console.error(`\n❌ Nobody is answering at ${base}`);
    console.error(`   ${err.message}`);
    console.error('   Start the server and run again, or pass BASE=http://localhost:PORT\n');
    process.exit(1);
  }

  const html = await res.text();

  if (looksLikeDev(html, res.headers)) {
    console.log('Mode: next dev (recompiles on its own, no stale build possible)\n');
    return;
  }

  let cssFiles;
  try {
    cssFiles = (await fs.readdir('.next/static/chunks')).filter((f) => f.endsWith('.css'));
  } catch {
    console.log('Mode: no local `.next` — cannot compare\n');
    return;
  }

  if (cssFiles.length === 0) {
    console.log('Mode: the build emitted no CSS — cannot compare\n');
    return;
  }

  const match = cssFiles.find((f) => html.includes(f));
  if (!match) {
    const served = [...html.matchAll(/\/_next\/static\/[^"']*\.css/g)].map((m) => m[0]);
    console.error(`\n❌ ${base} is serving a STALE build.`);
    console.error(`   CSS on disk:   ${cssFiles.join(', ')}`);
    console.error(`   CSS served:    ${served.join(', ') || '(none)'}`);
    console.error('');
    console.error('   It is almost always a `next start` from another session still holding the');
    console.error('   port: yours died with EADDRINUSE and the stale one answers. Close it, or');
    console.error('   serve on a free port and pass BASE=http://localhost:PORT\n');
    process.exit(1);
  }

  console.log(`Build served: ${match} ✓\n`);
}
