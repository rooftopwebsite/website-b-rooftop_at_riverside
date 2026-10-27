import fs from 'node:fs/promises';

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
