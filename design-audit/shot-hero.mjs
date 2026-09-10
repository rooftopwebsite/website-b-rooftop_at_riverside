import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [w,h,n] of [[1440,900,'desktop'],[390,844,'mobile']]) {
  const c = await b.newContext({ viewport:{width:w,height:h}, deviceScaleFactor:1 });
  const p = await c.newPage();
  await p.goto('http://localhost:3000/', { waitUntil:'networkidle' });
  await p.waitForTimeout(3500);
  await p.screenshot({ path:`design-audit/pilot-hero-${n}.png` });
  await c.close();
  console.log(n,'ok');
}
await b.close();
