import { chromium, expect } from '@playwright/test';
import fs from 'node:fs';

const out = 'test-results/living-workshop';
const browser = await chromium.launch({ channel: 'chromium' });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://127.0.0.1:4180/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('canvas')).toHaveAttribute('data-scene-settled', 'true', { timeout: 15000 });
  await page.getByRole('button', { name: 'Pause ambient motion' }).click();
  const patch = page.locator('.world-patch-anchor .patch-button');
  await expect(patch).toHaveClass(/patch-static/);
  await page.getByRole('button', { name: 'Let Patch stretch its legs' }).click({ force: true });
  await expect(patch).toHaveClass(/patch-walk.*patch-visible/);
  const sprite = patch.locator('.patch-sprite');
  const first = await sprite.evaluate(el => getComputedStyle(el).backgroundPositionX);
  await page.waitForTimeout(350);
  const second = await sprite.evaluate(el => getComputedStyle(el).backgroundPositionX);
  expect(second).not.toBe(first);
  await expect(patch).toHaveClass(/patch-idle.*patch-static/, { timeout: 5000 });
  await page.screenshot({ path: out + '/hero-final-grounding.png' });
  fs.writeFileSync(out + '/paused-visitor.json', JSON.stringify({ ambientPaused: true, visitorFrames: [first, second], returnsToPausedIdle: true }, null, 2));
  console.log('PASS: paused idle, eight-frame visitor gait advances, return restores paused idle.');
} finally {
  await browser.close();
}
