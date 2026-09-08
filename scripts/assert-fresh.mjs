import fs from 'node:fs/promises';

/**
 * Aborta si el servidor que vas a medir NO está sirviendo el build actual.
 *
 * ⚠️ Existe porque el mismo error pasó TRES veces en el proyecto, y las tres
 * veces el guard terminó en verde o en rojo por el motivo equivocado:
 *
 *   · `a11y` dio limpio midiendo una página sin estilos (chunks viejos)
 *   · `check:motion` dio «layout idéntico» contra un puerto que no era
 *   · `check:seo` marcó un H1 roto que en el build de disco estaba bien,
 *     porque `next start` había muerto con EADDRINUSE y contestaba un
 *     proceso viejo de otra sesión
 *
 * Imprimir el puerto ayuda, pero no alcanza: el puerto puede ser el correcto y
 * el proceso viejo igual.
 *
 * ⚠️ NO se compara el BUILD_ID. Fue el primer intento y está mal para este
 * proyecto: con Turbopack los chunks salen como `/_next/static/chunks/<hash>.js`
 * y el build id NO aparece en el HTML, así que el chequeo fallaba incluso
 * contra un server recién levantado. Lo que sí cambia en cada build y sí está
 * en el HTML es el nombre del CSS emitido, que va con hash de contenido.
 */

/** ¿Es `next dev`? Ahí no hay nada viejo que detectar: recompila en cada request. */
function looksLikeDev(html, headers) {
  return (
    html.includes('hmr-client') ||
    html.includes('__turbopack') ||
    (!headers.has('x-nextjs-prerender') && (headers.get('cache-control') ?? '').includes('no-cache'))
  );
}

export async function assertFresh(base) {
  console.log(`Objetivo: ${base}`);

  let res;
  try {
    res = await fetch(base, { redirect: 'follow' });
  } catch (err) {
    console.error(`\n❌ No contesta nadie en ${base}`);
    console.error(`   ${err.message}`);
    console.error('   Levantá el server y volvé a correr, o pasá BASE=http://localhost:PUERTO\n');
    process.exit(1);
  }

  const html = await res.text();

  if (looksLikeDev(html, res.headers)) {
    console.log('Modo: next dev (recompila solo, no hay build viejo posible)\n');
    return;
  }

  let cssFiles;
  try {
    cssFiles = (await fs.readdir('.next/static/chunks')).filter((f) => f.endsWith('.css'));
  } catch {
    console.log('Modo: sin `.next` local — no se puede comparar\n');
    return;
  }

  if (cssFiles.length === 0) {
    console.log('Modo: el build no emitió CSS — no se puede comparar\n');
    return;
  }

  const match = cssFiles.find((f) => html.includes(f));
  if (!match) {
    const served = [...html.matchAll(/\/_next\/static\/[^"']*\.css/g)].map((m) => m[0]);
    console.error(`\n❌ ${base} está sirviendo un build VIEJO.`);
    console.error(`   CSS en disco:  ${cssFiles.join(', ')}`);
    console.error(`   CSS servido:   ${served.join(', ') || '(ninguno)'}`);
    console.error('');
    console.error('   Casi siempre es un `next start` de otra sesión que quedó ocupando el');
    console.error('   puerto: el tuyo murió con EADDRINUSE y contesta el viejo. Cerralo, o');
    console.error('   serví en un puerto libre y pasá BASE=http://localhost:PUERTO\n');
    process.exit(1);
  }

  console.log(`Build servido: ${match} ✓\n`);
}
