import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
const browser = await chromium.launch({ channel: 'chromium' });
const checks = [], errors = [], out = 'test-results/after-hours/repair';
for (const width of [320, 390, 768]) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://127.0.0.1:4180/', { waitUntil: 'networkidle' });
  for (const view of ['home', 'top-day']) {
    if (view === 'top-day') {
      await page.getByLabel('Explore camera modes').tap();
      await page.getByRole('button', { name: 'Top view', exact: true }).tap();
      await page.locator('.room-settings summary').tap();
      await page.getByRole('button', { name: 'Change time of day' }).tap();
      await page.locator('.room-settings summary').tap();
    }
    const bounds = await page.evaluate(() => {
      const rect = s => { const r = document.querySelector(s).getBoundingClientRect(); return { x:r.x,y:r.y,right:r.right,bottom:r.bottom }; };
      return { companion:rect('.touch-companion'), hint:rect('.touch-room > p'), actions:rect('.world-object-actions'), patch:rect('.touch-companion .patch-button'), patrol:rect('.touch-companion .patch-walk-control') };
    });
    expect(bounds.companion.bottom).toBeLessThanOrEqual(bounds.hint.y);
    expect(bounds.hint.bottom).toBeLessThanOrEqual(bounds.actions.y);
    expect(bounds.patch.right).toBeLessThanOrEqual(bounds.patrol.x);
    expect(await page.evaluate(() => document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
    await page.locator('.touch-companion .patch-button').focus();
    await expect(page.locator('.touch-companion .patch-button')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.locator('.touch-companion .patch-walk-control')).toBeFocused();
    await page.evaluate(() => { document.activeElement.blur(); scrollTo(0,0); });
    await page.screenshot({ path: `${out}/mobile-clear-${width}-${view}.png`, fullPage: true });
    await page.screenshot({ path: view === 'home' ? `test-results/world-interface/refined/home-${width}.png` : `${out}/mobile-top-day-${width}.png` });
    if (width === 390 && view === 'top-day') await page.screenshot({ path: `${out}/mobile-top-day.png` });
    checks.push({ width, view, bounds, violations:(await new AxeBuilder({page}).analyze()).violations });
  }
  await context.close();
}
const desktop = await browser.newContext({ viewport: {width:1440,height:900} });
const page = await desktop.newPage();
await page.goto('http://127.0.0.1:4180/?qa=1&object=window', {waitUntil:'networkidle'});
await expect(page.locator('.object-owned-surface')).toHaveAttribute('data-aligned','true');
const windowAxe = (await new AxeBuilder({page}).analyze()).violations;
await page.keyboard.press('Escape');
const downloadEvent = page.waitForEvent('download');
await page.getByRole('link', { name: /Resume/i }).first().click();
const download = await downloadEvent;
expect(await download.failure()).toBeNull();
const resume = { filename: download.suggestedFilename(), success:true };
await browser.close();
fs.writeFileSync(`${out}/mobile-clearance.json`, JSON.stringify({checks, errors, windowAxe, resume},null,2));
expect(errors).toEqual([]);
expect(checks.flatMap(c=>c.violations)).toEqual([]);
expect(windowAxe).toEqual([]);
console.log(JSON.stringify({views:checks.length,errors,windowAxe,resume}));
