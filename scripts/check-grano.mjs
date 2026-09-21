/**
 * Verifica que EL GRANO ESTÉ DONDE VA Y SÓLO DONDE VA.
 *
 *   BASE=http://localhost:3000 node scripts/check-grano.mjs
 *   node scripts/check-grano.mjs --check     → sale con 1 si encuentra algo
 *
 * ⚠️ POR QUÉ EXISTE ESTE GUARDIA: el grano se escapó tres veces, de tres
 * formas distintas, y ninguna la avisó nada.
 *
 * La primera fue POR DEFECTO. El grano se aplicaba superficie por superficie
 * con una utilidad, y quedaban afuera todas las que nadie se acordó de marcar:
 * la barra del header, el mega-menú, el drawer, la franja de la agencia. Cada
 * sección nueva nacía sin grano.
 *
 * La segunda fue POR EXCESO. El arreglo de la primera fue una capa fija sobre
 * el viewport, que no se olvida de nada —pero se pinta sobre TODO: las fotos,
 * el logo, el emblema de la ola. Camila: «los elementos no deben tener noise
 * effect, sólo los fondos».
 *
 * La tercera fue LA MÁS SUTIL, y apareció al arreglar la segunda. Varias
 * piezas del sitio se pintan del MISMO color que la superficie que tienen
 * detrás, justamente para desaparecer contra ella: el recorte del hero, la
 * placa de «TOGETHER», la plancha del logo. Cuando el grano pasó a vivir en la
 * superficie, esas piezas quedaron lisas sobre un fondo granulado — y el grano
 * corre la media unos 3 niveles, así que se empezaron a ver como parches.
 *
 * Las tres formas de estar mal son reales y distintas, y este guardia mide
 * las tres.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ QUÉ CUENTA COMO SUPERFICIE: un elemento que pinta un color de la paleta y
 * ocupa el ancho completo de la ventana. Ese par de condiciones es lo que
 * separa una sección de una tarjeta: las dos pintan color, pero sólo una es el
 * campo sobre el que se apoya el resto. Una tarjeta `bg-deep` adentro de
 * `FindUs` NO es una superficie y no debe tener grano.
 *
 * ⚠️ EL ANCHO ALCANZA COMO CRITERIO Y EL ALTO NO. Una primera versión pedía
 * además 60px de alto, para no contar filetes, y se llevó puestas tres
 * superficies reales: la `UtilityBar`, que es una barra finita, y las dos
 * piezas del drawer. Ninguna tarjeta del sitio llega a pleno ancho, así que el
 * alto no estaba separando nada — sólo descartando barras legítimas.
 *
 * ⚠️ LO QUE NO SE VE NO SE JUZGA. Un elemento oculto mide 0 y por lo tanto no
 * es «pleno ancho»: sin saltearlo, el drawer de mobile se reporta como
 * elemento con grano de más en cada corrida de desktop. Por eso el guardia
 * mide en los DOS anchos: lo que está oculto en uno se evalúa en el otro.
 *
 * ⚠️ LO QUE DIBUJA SU PROPIO BORDE ES UN OBJETO, NO UN SUPLENTE. El botón
 * `secondary` es `bg-paper` con un `ring` de 1px, y en una sección `paper` da
 * el mismo color que el fondo — pero no está ahí para desaparecer: el anillo
 * lo delimita. Que su relleno quede liso no se ve. Por eso cualquier elemento
 * con `box-shadow` queda fuera de la cuenta de suplentes.
 *
 * ⚠️ LOS ENMASCARADOS TAMPOCO SE JUZGAN. Una silueta recortada con
 * `mask-image` —la palmera del footer, la plancha del logo— puede medir el
 * ancho de la pantalla por su CAJA y no pintar nada cerca de los bordes. El
 * ancho deja de significar «superficie» en cuanto hay una máscara de por
 * medio.
 *
 * ⚠️ POR QUÉ MIDE EN EL NAVEGADOR Y NO LEE EL CÓDIGO: las clases de fondo se
 * arman en veinte componentes distintos, algunas concatenadas y otras en un
 * mapa de tonos. Lo único que se puede afirmar con certeza es qué pinta el
 * navegador, y eso incluye los casos donde una clase quedó pisada por otra.
 *
 * ⚠️ `grano-capa` SE DA POR BUENA SIEMPRE. Es una declaración explícita de
 * «esto es fondo», y se usa justamente donde el color no lo pinta un
 * `background`: la tira de ola no tiene `background-color`, así que ninguna
 * de las reglas de arriba la reconocería.
 *
 * El arreglo, en los tres sentidos, es agregar o sacar `grano` —o `grano-capa`
 * si el color no lo pinta un `background`— en el elemento que el reporte
 * nombra. Ver sus notas en `globals.css`.
 */

import { chromium } from 'playwright';

const BASE = process.env.BASE ?? 'http://localhost:3000';
const CHECK = process.argv.includes('--check');

const RUTAS = [
  '/',
  '/the-yard',
  '/sunset-bar',
  '/whats-on',
  '/events',
  '/about',
  '/visit',
  '/contact',
  '/join-us',
  '/private-dining',
];

/** Los colores que son SUPERFICIE. El naranja y el teal no pintan fondos. */
const SUPERFICIES = {
  'rgb(255, 255, 255)': 'paper',
  'rgb(250, 246, 234)': 'bone',
  'rgb(253, 240, 180)': 'cream',
  /* ⚠️ `mint` FALTABA. Se agregó como tono de `Section` el 2026-09-21 para la
     banda de tarjetas de `/food-trucks` y esta lista no se actualizó, así que
     el guardia veía una sección a pleno ancho pintada de un color que no
     conocía y la reportaba como «objeto con grano que no es fondo». No se había
     notado porque `/food-trucks` no está en `RUTAS`; saltó cuando `/events`
     —que sí está— estrenó su propia banda menta. */
  'rgb(196, 242, 236)': 'mint',
  'rgb(245, 242, 232)': 'chalk',
  'rgb(1, 69, 69)': 'deep',
  'rgb(1, 52, 52)': 'deeper',
};

/** El drawer y el mega-menú sólo existen en uno de los dos anchos. */
const ANCHOS = [
  { nombre: 'desk', width: 1440, height: 1000 },
  { nombre: 'mobile', width: 390, height: 844 },
];

const browser = await chromium.launch();
const cubos = { faltan: new Map(), sobran: new Map(), parches: new Map() };

for (const vp of ANCHOS) {
  const page = await (
    await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
  ).newPage();

  for (const ruta of RUTAS) {
    const res = await page
      .goto(BASE + ruta, { waitUntil: 'networkidle', timeout: 60000 })
      .catch(() => null);
    if (!res || res.status() >= 400) continue;
    await page.waitForTimeout(900);

    const hallazgos = await page.evaluate((SUP) => {
      const opaco = (c) => c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent';
      const conGrano = (e, s) =>
        s.backgroundImage.includes('feTurbulence') || e.classList.contains('grano-capa');
      const nombre = (e) =>
        `${e.tagName.toLowerCase()}.${(e.className?.toString?.() || '')
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 4)
          .join('.')}`;

      const out = { faltan: [], sobran: [], parches: [] };

      for (const e of document.querySelectorAll('body *')) {
        const s = getComputedStyle(e);
        const r = e.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue; // oculto: no se juzga
        if (s.maskImage !== 'none' || s.webkitMaskImage !== 'none') continue; // recortado
        if (s.opacity !== '1') continue; // decoración translúcida

        const tiene = conGrano(e, s);
        const tono = SUP[s.backgroundColor];
        const plena = r.width >= innerWidth * 0.98;
        const superficie = Boolean(tono) && plena;

        /*
          El color de la SUPERFICIE que este elemento tiene detrás, que no es
          lo mismo que el color de su padre: el recorte del hero cuelga dentro
          del marco de la foto, que pinta `fog`, y sin embargo su trabajo es
          hacerse pasar por el hueso de la sección. Por eso la búsqueda sube
          hasta el primer ancestro CON GRANO y compara contra ése.
        */
        let n = e.parentElement;
        let fondo = null;
        while (n && n !== document.documentElement) {
          const t = getComputedStyle(n);
          if (conGrano(n, t) && opaco(t.backgroundColor)) {
            fondo = t.backgroundColor;
            break;
          }
          n = n.parentElement;
        }
        /** Se pinta del mismo color que su superficie: está haciendo de fondo. */
        const suplente =
          opaco(s.backgroundColor) && s.backgroundColor === fondo && s.boxShadow === 'none';

        if (superficie && !tiene) out.faltan.push({ tono, el: nombre(e) });
        else if (tiene && !superficie && !suplente && !e.classList.contains('grano-capa'))
          out.sobran.push({ el: nombre(e) });
        else if (!tiene && suplente && r.width >= 40 && r.height >= 40)
          out.parches.push({ tono: SUP[s.backgroundColor] ?? s.backgroundColor, el: nombre(e) });
      }
      return out;
    }, SUPERFICIES);

    for (const [cubo, filas] of Object.entries(hallazgos))
      for (const f of filas) {
        if (!cubos[cubo].has(f.el)) cubos[cubo].set(f.el, { ...f, rutas: new Set() });
        cubos[cubo].get(f.el).rutas.add(`${vp.nombre}${ruta}`);
      }
  }
  await page.close();
}

await browser.close();

const total = cubos.faltan.size + cubos.sobran.size + cubos.parches.size;
if (!total) {
  console.log(
    `✅ el grano está en todas las superficies, en ningún objeto y en cada suplente — ${RUTAS.length} rutas x ${ANCHOS.length} anchos`,
  );
  process.exit(0);
}

const informe = (mapa, titulo, arreglo) => {
  if (!mapa.size) return;
  console.log(`\n❌ ${mapa.size} ${titulo}\n`);
  for (const f of mapa.values()) {
    console.log(`   ${(f.tono ?? '').padEnd(8)} ${f.el}`);
    console.log(`            ${[...f.rutas].slice(0, 5).join(' ')}`);
  }
  console.log(`\n   ${arreglo}`);
};

informe(cubos.faltan, 'superficies SIN grano', 'Agregales `grano`.');
informe(
  cubos.sobran,
  'objetos CON grano que no son fondo',
  'Sacales el grano: va en los fondos, no en los objetos.',
);
informe(
  cubos.parches,
  'suplentes de fondo SIN grano',
  'Se pintan del color de su superficie para desaparecer en ella, y sin el grano se ven como un parche liso. Agregales `grano`.',
);

process.exit(CHECK ? 1 : 0);
