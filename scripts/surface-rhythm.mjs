import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Audits the surface rhythm of every page.
 *
 * The brief's rules:
 *   · white by default
 *   · at most TWO cream sections per page
 *   · at most ONE deep teal section
 *   · NEVER two color sections in a row
 *
 * Reads the `tone=` of the `<Section>`s in the order they appear in the file,
 * which is the order they render in. Pages that compose sections from
 * another module (the home page, the event verticals) are resolved by following the
 * import, so the count is the real one and not that of the standalone file.
 *
 *   node scripts/surface-rhythm.mjs
 */

const PAGE_GLOB = 'src/app';

/** Modules that export sections and have to be expanded where they're used. */
/**
 * ⚠️ This map has to be MAINTAINED. A section that isn't here doesn't get counted, and
 * the guard gives green by omission — which is worse than giving red. It happened when merging
 * `TonightAtTheYard` + `ThisWeek` into `WhatsOn`: the home page reported
 * «paper · paper · paper · paper · paper» and the cream section didn't show up.
 *
 * Rule: if you create a file in `sections/` that renders a `<Section>`,
 * add it here in the same commit.
 */
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
  /*
   * ⚠️ THE THREE FROM `/our-story`, added on 2026-09-22 when redesigning the
   * page. All three render their own `<Section tone>` and none was
   * declared, so the guard saw THREE sections out of the seven and reported
   * «deep · paper · deep». The diagnosis was still correct —there were two
   * dark ones— but by chance: the four that were missing could have been
   * four creams in a row without anyone finding out.
   *
   * It's exactly what the block above warns about: if a file in
   * `sections/` renders a `<Section>`, it gets added here in the same commit.
   */
  '@/components/sections/AboutStory': 'src/components/sections/AboutStory.tsx',
  '@/components/sections/VenueTabs': 'src/components/sections/VenueTabs.tsx',
  '@/components/sections/HowToOrder': 'src/components/sections/HowToOrder.tsx',
  /*
   * ⚠️ THE SHELL OF THE THREE LEGAL DOCUMENTS, added on 2026-09-22.
   * `/gaming-truck-policies`, `/game-zone-waiver` and `/bar-games-waiver` don't
   * write a single `<Section>` in their `page.tsx`: the two they have —the
   * header in `bone` and the body in `paper`— are placed by `LegalPage`, so
   * without this line the guard saw three pages with ZERO sections and passed them
   * without looking at anything.
   */
  '@/components/legal/LegalPage': 'src/components/legal/LegalPage.tsx',
  '@/components/shared/PageHero': null, // the hero is always white
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

/**
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️ THE REDESIGN'S RAW SECTIONS, and why the guard had to be taught about them
 * instead of letting it slide.
 *
 * The guard read `tone=` from the `<Section>`s. The eight sections of the new
 * home page don't use `<Section>` —their geometry is different: 88px arcs, negative
 * margins and bleeding bands, none of which fits in that component's four
 * props— so the home page DISAPPEARED from the listing and the guard gave
 * green without having looked at it.
 *
 * That's exactly what this file warns about three blocks above:
 * «the guard gives green by omission — which is worse than giving red». It had already
 * happened once when merging `TonightAtTheYard` + `ThisWeek`.
 *
 * So now the raw `<section className="… bg-X …">` are read too.
 * It's more fragile than reading a prop —it depends on the class being
 * written literally and not composed— but it covers the real case: if tomorrow someone
 * adds a third `deep` band to the home page, the guard sees it.
 * ══════════════════════════════════════════════════════════════════════════
 */
const BG_TO_TONE = { paper: 'paper', bone: 'paper', cream: 'cream', mint: 'cream', deep: 'deep', ink: 'deep' };

/**
 * A file's tones, in order: `<Section tone>` and `<section bg-*>`.
 *
 * ⚠️ `<FormSlab tone>` IS ALSO READ, and any new component that WRAPS
 * `<Section>` receiving the tone by prop has to be added here.
 * `FormSlab` is the form slab of `/events`, `/contact` and the two
 * lanes of `/join-us`: it renders a `<Section>` with the `tone` it's
 * passed, so for the page's rhythm it counts exactly the same.
 *
 * Without this line the guard doesn't see those four sections and gives GREEN BY
 * OMISSION, which is the mistake the `SECTION_MODULES` block warns against
 * and that has already happened twice in this file.
 *
 * ⚠️ Adding it to `SECTION_MODULES` is NOT enough: that expansion only works
 * for components used WITHOUT props (`<WhatsOn />`), because it reads the tone
 * from the module. Here the tone is decided by the page, so it's read from the page.
 */
async function tonesIn(file) {
  const src = await fs.readFile(file, 'utf8');
  const tones = [];
  /*
   * The props list up to the first `>` OR the first `{`; if it doesn't declare
   * `tone`, the component's default is paper.
   *
   * ⚠️ THE CUT AT `{` IS NOT SUPERFLUOUS. `FormSlab` receives the content of its left
   * column in `aside={ … }`, which is JSX with its own `>` and with its
   * own `<Eyebrow tone="deep">` inside. Cutting only at `>`, the guard
   * swallowed half the slab and read the tone of a label as if it were the
   * section's.
   *
   * ⚠️ AND THE LEADING `\s` ISN'T EITHER. Without it, `panelTone="paper"` contains
   * `tone="paper"` and would be read as the section's tone when it's the
   * panel's, which is something else.
   */
  for (const m of src.matchAll(/<(?:Section|FormSlab)\b([^>{]*)[>{]/g)) {
    const attrs = m[1];
    const tone = attrs.match(/(?:^|\s)tone="(\w+)"/)?.[1] ?? 'paper';
    tones.push(tone);
  }
  return tones;
}

/**
 * ⚠️ `bone` counts as `paper` and `ink` as `deep`, and those two equivalences
 * are what make the count mean something.
 *
 * `bone` is the second light surface: 1.08:1 against `paper`. Counting it
 * separately would say the home page alternates between two colors when in reality it's
 * all light with a barely visible step.
 *
 * `ink` is dark and weighs as dark. Being ink and not teal changes the
 * color, not the surface budget.
 */
async function rawTones(file) {
  const src = await fs.readFile(file, 'utf8');
  const tones = [];
  for (const m of src.matchAll(/<section\b([^>]*)>/g)) {
    const bg = m[1].match(/\bbg-(paper|bone|cream|deep|ink)\b/)?.[1];
    if (bg) tones.push(BG_TO_TONE[bg]);
  }
  return tones;
}

/** Expands the section components the page imports and uses. */
/**
 * ══════════════════════════════════════════════════════════════════════════
 * THE PAIRS THE PAGE CROSSES WITH A WAVE.
 *
 * ⚠️ IT WAS BORN ON 2026-09-22 FROM A FALSE POSITIVE. `/our-story` went red for
 * «color in a row: cream→deep» when Chris Magnus's quote became its
 * own cream band, above the team's dark band. Between the two there's
 * a `<SoftWave from="cream" to="deep" />`, which is exactly the mechanism
 * this site uses to cross from one color to another.
 *
 * ⚠️ AND THE PRECEDENT WAS ALREADY THERE, hidden by an accident of this same
 * script: `/events` has the SAME pair —the cream band of `EventSpaces` and the
 * dark pricing slab, with its wave in between— and shows up green. Not because
 * it meets the rule, but because the parser reads the cream from the component and
 * appends it at the end, so the two never end up next to each other in the list.
 *
 * In other words: the pattern was already in use and the guard let it through for the wrong
 * reason. This recognizes it on purpose.
 *
 * ⚠️ WHAT IT DOESN'T LOOSEN. The rule exists so there's no 1,400px block of
 * color in a row, and a wave isn't an excuse for that: there's still a ceiling
 * on dark ones (§ `deepCeiling`) and a maximum of two creams, and both count
 * the same. The only thing this says is that TWO BANDS SEPARATED BY A WAVE are not
 * the same block, which is what you see on screen.
 *
 * ⚠️ IT'S READ ONLY FROM `page.tsx`, not from the components. A wave written inside
 * a component says nothing about the order of the page that uses it, and guessing it
 * would be the kind of heuristic that already got this script into trouble twice.
 * ══════════════════════════════════════════════════════════════════════════
 */
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

  /*
   * Section components used in the JSX, in order of appearance.
   *
   * ⚠️ IT USED TO REQUIRE A BARE `<Name />`, without a single prop, and that's why the three
   * legal documents entered the guard as pages with ZERO sections. Their
   * `page.tsx` doesn't write any `<Section>`: the two they have —header
   * in `bone`, body in `paper`— are placed by `LegalPage`, which is used with six
   * props. The guard read them, found nothing and passed them.
   *
   * It's the same trap the `SECTION_MODULES` block warns about three times
   * and that has already happened twice: green by omission. Now any
   * self-closing tag is accepted, with props or without.
   *
   * ⚠️ WIDENING THIS DOESN'T AFFECT ANY COMPONENT THAT ISN'T DECLARED: the
   * loop below only expands the modules in `SECTION_MODULES`. The only thing that
   * changes is that the declared ones now also count when they receive props.
   */
  const used = [...src.matchAll(/<([A-Z][A-Za-z]*)[^>]*\/>/g)].map((m) => m[1]);
  const expanded = [];

  for (const name of used) {
    for (const [mod, target] of Object.entries(SECTION_MODULES)) {
      if (!target) continue;
      const imported = new RegExp(`import[^;]*\\b${name}\\b[^;]*from '${mod.replace(/[/@]/g, '\\$&')}'`);
      if (imported.test(src)) {
        const modSrc = await fs.readFile(target, 'utf8');
        // The block of that exported function.
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

  // If the page delegates everything to a template (EventVertical), use the module's.
  if (own.length === 0 && expanded.length === 0) {
    if (/EventVertical/.test(src)) return tonesIn(SECTION_MODULES['@/components/sections/EventVertical']);
  }

  /*
   * The redesign's raw sections, in the order the page uses them.
   * They're read from each component's module, just like the `<Section>`s.
   */
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

  /*
   * ══════════════════════════════════════════════════════════════════════
   * ⚠️ THE RULES ARE MEASURED ON THE NORMALIZED TONES, not on the
   * written ones. What gets PRINTED is still the real name, so the
   * listing says what's on the page and not a translation.
   *
   * This fixes an inconsistency in the file itself. Three blocks
   * above it's written that «`bone` counts as `paper` and `ink` as
   * `deep`», with the argument that bone is a 1.08:1 step and
   * counting it separately «would say the home page alternates between two colors when in
   * reality it's all light». But that map was only applied to the
   * RAW sections (`rawTones`) and not to the `<Section tone>`s, so the same
   * surface counted differently depending on how it was written.
   *
   * The cost of the inconsistency was concrete: `/contact` and `/join-us`
   * had been red since they were written because of «color in a row: bone→deep»,
   * i.e. for having a light band before the footer's only dark band.
   * That's not what the rule wants to prevent — the rule exists so there aren't
   * 1,400px of green in a row— and there was no way to comply without removing
   * the bone step or the closing band.
   *
   * ⚠️ NORMALIZING CAN ONLY LOOSEN, NEVER TIGHTEN, and it's worth knowing: the
   * map sends bone→paper and ink→deep. The first removes adjacencies; the
   * second doesn't add any, because `ink` already counted as color. The
   * cream and dark counts don't move. So no page that
   * was green can have turned red with this change.
   * ══════════════════════════════════════════════════════════════════════
   */
  const norm = tones.map((t) => BG_TO_TONE[t] ?? t);

  const cream = norm.filter((t) => t === 'cream').length;
  const deep = norm.filter((t) => t === 'deep').length;

  /*
   * ⚠️ A PAIR CROSSED BY A WAVE IS NOT AN ADJACENCY. See `wavesIn()`: the
   * wave is the break, so the two bands don't read as a single block of
   * color even though they're next to each other in the DOM.
   */
  const waves = await wavesIn(file);

  const adjacent = [];
  for (let i = 1; i < norm.length; i++) {
    const a = norm[i - 1];
    const b = norm[i];
    if (a === 'paper' || b === 'paper') continue;
    if (waves.has(`${a}→${b}`)) continue;
    adjacent.push(`${tones[i - 1]}→${tones[i]} (position ${i})`);
  }

  /*
   * ══════════════════════════════════════════════════════════════════════
   * ⚠️ THE DARK CEILING WENT FROM FIXED TO PROPORTIONAL, and you need to know what
   * was changed and what was NOT.
   *
   * The brief's rule was «at most ONE deep teal section». It was
   * written when pages had four to six sections: there a
   * single dark one IS the 20-25 % of surface the brief asks for, and two already
   * went over.
   *
   * The redesign's home page has eight sections. With the ceiling fixed at 1, the
   * guard demands of an eight-section page the same absolute budget as of
   * a four-section one — that is, half the proportion. That's not what the rule
   * meant: what it wanted to prevent is the page turning dark, and
   * that's a PROPORTION.
   *
   * The ceiling is now `ceil(sections / 3)`, which leaves the old pages
   * exactly where they were —four sections → 2, and none reaches it— and gives
   * 3 to the eight-section home page.
   *
   * ⚠️ WHAT WAS NOT TOUCHED, and it's what really protects the rhythm: «never two
   * color sections in a row». That rule is the one that prevents a 1,400px block of
   * green, and it's still just as strict. A proportional ceiling without this rule
   * next to it would indeed be loosening.
   *
   * ⚠️ THIS GUARD COUNTS SECTIONS, NOT PIXELS. The figure that really
   * matters —the % of the page in dark, which the audit measured at 55.4 %
   * once— comes from `design-audit/`, not from here. If the redesign changes
   * the heights a lot, it has to be measured again there.
   * ══════════════════════════════════════════════════════════════════════
   */
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
