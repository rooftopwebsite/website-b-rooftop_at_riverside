/**
 * Busca SOMBRAS RECORTADAS por un ancestro con `overflow` distinto de `visible`.
 *
 *   BASE=http://localhost:3000 node scripts/check-sombras.mjs
 *   node scripts/check-sombras.mjs --check     → sale con 1 si encuentra alguna
 *
 * ⚠️ QUÉ PROBLEMA CUIDA, porque es de los que se ven pero no se explican.
 * Una tarjeta con `sombra-card` adentro de un carrusel (`overflow-x-auto`) o de
 * un marquee (`overflow-hidden`) se ve con la sombra CORTADA A PICO en el borde
 * del contenedor: en vez de un halo que se desvanece, queda un rectángulo gris
 * con filo. Camila lo marcó sobre los tickets del yard —«que las sombras no
 * estén atrapadas en el div»— y estaba en cuatro lugares del sitio.
 *
 * ⚠️ LA TRAMPA QUE HACE QUE ESTO SE ESCAPE SIEMPRE: declarar `overflow-x: auto`
 * computa el `overflow-y` a `auto` también. O sea que un carrusel horizontal
 * recorta ARRIBA Y ABAJO aunque nadie haya pedido scroll vertical, y la sombra
 * de abajo —que es la más grande, porque la sombra baja— es la primera que se
 * come. No alcanza con mirar el eje que uno tocó.
 *
 * El arreglo siempre es el mismo y está escrito en cada call site: padding en
 * el contenedor que recorta, y —si hace falta— margen negativo o `scroll-px-*`
 * para que el layout y el snap no se muevan.
 *
 * Cómo mide: para cada elemento con `box-shadow` (no `inset`) o
 * `filter: drop-shadow`, calcula cuánto se extiende la sombra más allá de su
 * caja y lo compara con el hueco que le deja el clip box del ancestro
 * recortante más cercano.
 *
 * ⚠️ SÓLO CUENTA EL LADO CUYO BORDE ESTÁ DENTRO DEL CLIP BOX. Sin eso, la
 * cuarta tarjeta de un carrusel —que está fuera de la vista porque todavía no
 * se scrolleó hasta ella— se reporta con «le faltan 1400px a la derecha», que
 * es ruido y no un defecto.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ Y NO CUENTA EL EJE EN EL QUE EL CONTENEDOR REALMENTE SCROLLEA. Es la
 * regla que decide qué es un defecto y qué es diseño, y hubo que aprenderla
 * rompiendo algo.
 *
 * El costado de un carrusel es la VENTANA por la que se ve que hay más
 * contenido: el recorte ahí no es un accidente, es la pieza que comunica que
 * la fila sigue. Corriéndolo hacia afuera para que entre la sombra de la
 * primera tarjeta, lo que entra por el hueco es media tarjeta SIGUIENTE, y eso
 * sí se lee como un error. Camila, sobre el carrusel de `WhatsOn` después de
 * ese cambio: «se ve un poco de la 4 card y queda recortada y se ve mal, antes
 * estaba bien».
 *
 * Lo que sí es siempre un defecto es el recorte en el eje TRANSVERSAL —abajo
 * en un carrusel horizontal— porque ahí no hay nada que mostrar: es sombra
 * cortada a pico y nada más. Y aparece solo, sin que nadie lo pida, porque
 * declarar `overflow-x: auto` computa el `overflow-y` a `auto`.
 *
 * La condición es `scrollWidth > clientWidth` y no «tiene overflow-x»: un
 * contenedor con `overflow-x: auto` cuyo contenido entra NO scrollea, así que
 * ahí el recorte lateral vuelve a ser un accidente y se reporta. Es
 * exactamente el caso de los tres tickets de `YardSteps` en desktop.
 * ══════════════════════════════════════════════════════════════════════════
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE ?? 'http://localhost:3000';
const CHECK = process.argv.includes('--check');

/** Las rutas con tarjetas, carruseles o fotos. Las 17 que tienen sombra. */
const RUTAS = [
  '/',
  '/the-yard',
  '/sunset-bar',
  '/the-experience',
  '/whats-on',
  '/events',
  '/events/spaces',
  '/events/game-truck',
  '/events/inquire',
  '/food-trucks',
  '/our-story',
  '/visit',
  '/contact',
  '/faq',
  '/join-us',
  '/market',
  '/nfc-north-hq',
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 834, height: 1112 },
  { name: 'mobile', width: 390, height: 844 },
];

/** Corre en el navegador. Devuelve un hallazgo por sombra recortada. */
const SONDA = () => {
  const out = [];

  /** Parte por comas de PRIMER NIVEL: `rgba(...)` tiene comas adentro. */
  const capas = (valor) => {
    const res = [];
    let nivel = 0;
    let act = '';
    for (const ch of valor) {
      if (ch === '(') nivel++;
      if (ch === ')') nivel--;
      if (ch === ',' && nivel === 0) {
        res.push(act);
        act = '';
      } else act += ch;
    }
    res.push(act);
    return res;
  };

  /** Extensión de una `box-shadow`, en px: [arriba, derecha, abajo, izquierda]. */
  const extBox = (valor) => {
    if (!valor || valor === 'none') return null;
    let t = 0;
    let r = 0;
    let b = 0;
    let l = 0;
    for (const capa of capas(valor)) {
      if (/\binset\b/.test(capa)) continue;
      const nums = (capa.replace(/\w+\([^)]*\)/g, ' ').match(/-?[\d.]+px/g) ?? []).map(parseFloat);
      const [dx = 0, dy = 0, blur = 0, spread = 0] = nums;
      /*
       * ⚠️ EL ALCANCE ES `blur + spread` Y NO `blur / 2 + spread`, y la
       * primera versión de este guard usaba lo segundo. Era la lectura
       * literal del spec —la transición ocurre en ±blur/2 alrededor del borde
       * de la sombra— y da verde sobre sombras que a ojo se ven cortadas.
       *
       * El motivo es que el spec describe dónde está el MEDIO del degradé, no
       * dónde deja de verse. El desenfoque es una gaussiana de sigma = blur/2,
       * y una gaussiana tiene cola: a blur/2 del borde todavía queda cerca de
       * un tercio del valor. Con una sombra al 55 % de opacidad sobre una losa
       * oscura, ese tercio se ve perfectamente.
       *
       * Medido con perfil de píxeles sobre el carrusel de `WhatsOn`
       * (`0 18px 44px -12px`, alcance viejo 28px, padding 32px, o sea «sobra»):
       * al borde del contenedor la luminancia todavía estaba 4 niveles por
       * debajo del fondo, y ese escalón recto es exactamente lo que Camila
       * marcó — «sigo viendo la sombra contenida en un frame».
       *
       * Con `blur + spread` el alcance de esa misma sombra da 50px y el guard
       * pide el padding que hace falta de verdad.
       */
      const alcance = blur + spread;
      t = Math.max(t, alcance - dy);
      b = Math.max(b, alcance + dy);
      l = Math.max(l, alcance - dx);
      r = Math.max(r, alcance + dx);
    }
    return t <= 0 && r <= 0 && b <= 0 && l <= 0 ? null : [t, r, b, l];
  };

  /** Ídem para `filter: drop-shadow(...)`, que no tiene spread. */
  const extFiltro = (valor) => {
    if (!valor || valor === 'none') return null;
    let t = 0;
    let r = 0;
    let b = 0;
    let l = 0;
    let hubo = false;
    for (const m of valor.matchAll(/drop-shadow\(([^)]*\)[^)]*|[^)]*)\)/g)) {
      const nums = (m[1].replace(/\w+\([^)]*\)/g, ' ').match(/-?[\d.]+px/g) ?? []).map(parseFloat);
      if (!nums.length) continue;
      hubo = true;
      /* Mismo criterio que en `extBox`: el blur ENTERO, no la mitad.
         `drop-shadow` no tiene spread, así que el blur es todo el alcance. */
      const [dx = 0, dy = 0, blur = 0] = nums;
      t = Math.max(t, blur - dy);
      b = Math.max(b, blur + dy);
      l = Math.max(l, blur - dx);
      r = Math.max(r, blur + dx);
    }
    return hubo ? [t, r, b, l] : null;
  };

  const ruta = (el) => {
    const p = [];
    for (let n = el; n && n.nodeType === 1 && p.length < 4; n = n.parentElement) {
      let s = n.tagName.toLowerCase();
      const cls = (n.getAttribute('class') ?? '').split(/\s+/).filter(Boolean).slice(0, 3).join('.');
      if (n.id) s += '#' + n.id;
      else if (cls) s += '.' + cls;
      p.unshift(s);
    }
    return p.join(' > ');
  };

  for (const el of document.querySelectorAll('*')) {
    const cs = getComputedStyle(el);
    const ext = extBox(cs.boxShadow) ?? extFiltro(cs.filter);
    if (!ext) continue;
    const caja = el.getBoundingClientRect();
    if (caja.width < 2 || caja.height < 2) continue;

    /* El ancestro recortante más cercano. Un `filter` o un `transform` en el
       ancestro no recortan; `overflow` distinto de `visible`, sí. */
    let clipper = null;
    for (let p = el.parentElement; p && p !== document.documentElement; p = p.parentElement) {
      const ps = getComputedStyle(p);
      if (ps.overflowX !== 'visible' || ps.overflowY !== 'visible') {
        clipper = {
          nodo: p,
          ox: ps.overflowX,
          oy: ps.overflowY,
          /* Si el contenido DESBORDA de verdad, el recorte de ese eje es la
             ventana del carrusel y no un defecto. Ver la nota del encabezado. */
          scrolleaX: p.scrollWidth - p.clientWidth > 1,
          scrolleaY: p.scrollHeight - p.clientHeight > 1,
        };
        break;
      }
    }
    if (!clipper) continue;

    /* El clip box es el PADDING box del ancestro: el padding da aire, y es
       justamente con padding como se arregla esto. */
    const pc = clipper.nodo.getBoundingClientRect();
    const holgura = {
      top: caja.top - pc.top,
      right: pc.right - caja.right,
      bottom: pc.bottom - caja.bottom,
      left: caja.left - pc.left,
    };
    const [et, er, eb, elf] = ext;
    const cortaX = clipper.ox !== 'visible' && !clipper.scrolleaX;
    const cortaY = clipper.oy !== 'visible' && !clipper.scrolleaY;
    const dentro = (v) => v >= -0.5;
    const faltan = {};
    if (cortaY && dentro(holgura.top) && et > holgura.top + 0.5)
      faltan.top = +(et - holgura.top).toFixed(1);
    if (cortaX && dentro(holgura.right) && er > holgura.right + 0.5)
      faltan.right = +(er - holgura.right).toFixed(1);
    if (cortaY && dentro(holgura.bottom) && eb > holgura.bottom + 0.5)
      faltan.bottom = +(eb - holgura.bottom).toFixed(1);
    if (cortaX && dentro(holgura.left) && elf > holgura.left + 0.5)
      faltan.left = +(elf - holgura.left).toFixed(1);
    if (!Object.keys(faltan).length) continue;

    out.push({
      el: ruta(el),
      clipper: ruta(clipper.nodo),
      overflow: `${clipper.ox}/${clipper.oy}`,
      faltan,
    });
  }
  return out;
};

const browser = await chromium.launch();
const hallazgos = [];

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  for (const r of RUTAS) {
    try {
      await page.goto(BASE + r, { waitUntil: 'networkidle', timeout: 60000 });
    } catch {
      console.error(`  (no carga) ${r}`);
      continue;
    }
    /* Hay que bajar hasta el pie: las tarjetas entran con reveal y antes de
       aparecer no tienen sombra que medir. */
    await page.evaluate(async () => {
      const paso = Math.round(window.innerHeight * 0.7);
      const dormir = (ms) => new Promise((res) => setTimeout(res, ms));
      for (let y = 0; y < document.body.scrollHeight; y += paso) {
        window.scrollTo(0, y);
        await dormir(120);
      }
      window.scrollTo(0, 0);
      await dormir(300);
    });
    for (const h of await page.evaluate(SONDA)) hallazgos.push({ vp: vp.name, ruta: r, ...h });
  }
  await ctx.close();
}
await browser.close();

/* Agrupa por (elemento, ancestro que recorta) y se queda con el peor caso. */
const mapa = new Map();
for (const h of hallazgos) {
  const k = `${h.el} ||| ${h.clipper}`;
  const peor = Math.max(...Object.values(h.faltan));
  if (!mapa.has(k) || peor > mapa.get(k).peor) {
    mapa.set(k, { ...h, peor, vps: new Set(), rutas: new Set() });
  }
  mapa.get(k).vps.add(h.vp);
  mapa.get(k).rutas.add(h.ruta);
}
const lista = [...mapa.values()].sort((a, b) => b.peor - a.peor);

if (!lista.length) {
  console.log(`✅ ninguna sombra recortada en ${RUTAS.length} rutas x ${VIEWPORTS.length} anchos`);
  process.exit(0);
}

console.log(`\n❌ ${lista.length} sombras recortadas\n`);
for (const h of lista) {
  console.log(`[falta ${h.peor}px]  ${JSON.stringify(h.faltan)}   (${[...h.vps].join(', ')})`);
  console.log(`   elemento : ${h.el}`);
  console.log(`   recorta  : ${h.clipper}   overflow ${h.overflow}`);
  console.log(`   rutas    : ${[...h.rutas].slice(0, 6).join(' ')}`);
  console.log('');
}
console.log('El arreglo es padding en el contenedor que recorta. Ver `YardSteps.tsx`.');
process.exit(CHECK ? 1 : 0);
