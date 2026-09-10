import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
const url = pathToFileURL(process.argv[2]).href;
const b = await chromium.launch();
for (const [w,h,name] of [[1440,900,'desktop'],[390,844,'mobile']]) {
  const c = await b.newContext({ viewport:{width:w,height:h}, deviceScaleFactor:1 });
  const p = await c.newPage();
  await p.goto(url, { waitUntil:'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(600);
  await p.screenshot({ path:`design-audit/specimen-${name}.png`, fullPage:true });
  console.log(name, 'ok');
  await c.close();
}
await b.close();
