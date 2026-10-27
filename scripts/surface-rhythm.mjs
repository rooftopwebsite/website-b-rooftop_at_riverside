import fs from 'node:fs/promises';
import path from 'node:path';

const PAGE_GLOB = 'src/app';

const SECTION_MODULES = {
  '@/components/sections/HomeSections': 'src/components/sections/HomeSections.tsx',
  '@/components/sections/WhatsOn': 'src/components/sections/WhatsOn.tsx',
  '@/components/sections/ThreeDoors': 'src/components/sections/ThreeDoors.tsx',
  '@/components/sections/EventsBanner': 'src/components/sections/EventsBanner.tsx',
  '@/components/sections/FindUs': 'src/components/sections/FindUs.tsx',
  '@/components/sections/Hero': 'src/components/sections/Hero.tsx',
  '@/components/sections/YardSteps': 'src/components/sections/YardSteps.tsx',
  '@/components/sections/PhotoDivider': 'src/components/sections/PhotoDivider.tsx',
  '@/components/sections/EventVertical': 'src/components/sections/EventVertical.tsx',
  '@/components/sections/AboutStory': 'src/components/sections/AboutStory.tsx',
  '@/components/sections/VenueTabs': 'src/components/sections/VenueTabs.tsx',
  '@/components/sections/HowToOrder': 'src/components/sections/HowToOrder.tsx',
  '@/components/legal/LegalPage': 'src/components/legal/LegalPage.tsx',
  '@/components/shared/PageHero': null,
};

async function walk(dir) {
  const out = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name === 'page.tsx') out.push(p);
  }
  return out;
}

const BG_TO_TONE = { paper: 'paper', bone: 'paper', cream: 'cream', mint: 'cream', deep: 'deep', ink: 'deep' };

async function tonesIn(file) {
  const src = await fs.readFile(file, 'utf8');
  const tones = [];
  for (const m of src.matchAll(/<(?:Section|FormSlab)\b([^>{]*)[>{]/g)) {
    const attrs = m[1];
    const tone = attrs.match(/(?:^|\s)tone="(\w+)"/)?.[1] ?? 'paper';
    tones.push(tone);
  }
  return tones;
}

async function rawTones(file) {
  const src = await fs.readFile(file, 'utf8');
  const tones = [];
  for (const m of src.matchAll(/<section\b([^>]*)>/g)) {
    const bg = m[1].match(/\bbg-(paper|bone|cream|deep|ink)\b/)?.[1];
    if (bg) tones.push(BG_TO_TONE[bg]);
  }
  return tones;
}

async function wavesIn(file) {
  const src = await fs.readFile(file, 'utf8');
  const pairs = new Set();
  for (const m of src.matchAll(/<SoftWave\b([^>]*)\/>/g)) {
    const from = m[1].match(/from="(\w+)"/)?.[1];
    const to = m[1].match(/to="(\w+)"/)?.[1];
    if (from && to) pairs.add(`${BG_TO_TONE[from] ?? from}→${BG_TO_TONE[to] ?? to}`);
  }
  return pairs;
}

async function pageTones(file) {
  const src = await fs.readFile(file, 'utf8');
  const own = await tonesIn(file);

  const used = [...src.matchAll(/<([A-Z][A-Za-z]*)[^>]*\/>/g)].map((m) => m[1]);
  const expanded = [];

  for (const name of used) {
    for (const [mod, target] of Object.entries(SECTION_MODULES)) {
      if (!target) continue;
      const imported = new RegExp(`import[^;]*\\b${name}\\b[^;]*from '${mod.replace(/[/@]/g, '\\$&')}'`);
      if (imported.test(src)) {
        const modSrc = await fs.readFile(target, 'utf8');
        let start = modSrc.indexOf(`export function ${name}(`);
        if (start === -1) start = modSrc.indexOf('export default function');
        if (start === -1) continue;
        const next = modSrc.indexOf('\nexport function ', start + 1);
        const block = modSrc.slice(start, next === -1 ? undefined : next);
        for (const m of block.matchAll(/<Section\b([^>]*)>/g)) {
          expanded.push(m[1].match(/tone="(\w+)"/)?.[1] ?? 'paper');
        }
      }
    }
  }

  if (own.length === 0 && expanded.length === 0) {
    if (/EventVertical/.test(src)) return tonesIn(SECTION_MODULES['@/components/sections/EventVertical']);
  }

  const raw = [];
  for (const name of used) {
    for (const [mod, target] of Object.entries(SECTION_MODULES)) {
      if (!target) continue;
      const imported = new RegExp(`import[^;]*\\b${name}\\b[^;]*from '${mod.replace(/[/@]/g, '\\$&')}'`);
      if (imported.test(src)) raw.push(...(await rawTones(target)));
    }
  }

  const all = expanded.length > 0 ? [...expanded, ...own] : own;
  return [...all, ...raw];
}

const files = await walk(PAGE_GLOB);
let problems = 0;

for (const file of files.sort()) {
  const route = file.replace(/^src[\\/]app/, '').replace(/[\\/]page\.tsx$/, '') || '/';
  const tones = (await pageTones(file)).filter((t) => t !== 'none');
  if (tones.length === 0) continue;

  const norm = tones.map((t) => BG_TO_TONE[t] ?? t);

  const cream = norm.filter((t) => t === 'cream').length;
  const deep = norm.filter((t) => t === 'deep').length;

  const waves = await wavesIn(file);

  const adjacent = [];
  for (let i = 1; i < norm.length; i++) {
    const a = norm[i - 1];
    const b = norm[i];
    if (a === 'paper' || b === 'paper') continue;
    if (waves.has(`${a}→${b}`)) continue;
    adjacent.push(`${tones[i - 1]}→${tones[i]} (position ${i})`);
  }

  const deepCeiling = Math.max(1, Math.ceil(norm.length / 3));

  const issues = [];
  if (cream > 2) issues.push(`${cream} cream sections (max. 2)`);
  if (deep > deepCeiling) issues.push(`${deep} dark sections (max. ${deepCeiling} out of ${norm.length})`);
  if (adjacent.length) issues.push(`color in a row: ${adjacent.join(', ')}`);

  if (issues.length) {
    problems += 1;
    console.log(`❌ ${route}`);
    console.log(`   ${tones.join(' · ')}`);
    for (const i of issues) console.log(`   → ${i}`);
  } else {
    console.log(`✅ ${route.padEnd(26)} ${tones.join(' · ')}`);
  }
}

console.log(problems === 0 ? '\nSurface rhythm OK.' : `\n${problems} pages out of rule.`);
if (problems > 0) process.exitCode = 1;
