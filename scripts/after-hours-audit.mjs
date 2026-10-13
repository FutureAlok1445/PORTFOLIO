import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
import assert from "node:assert/strict";
const browser = await chromium.launch({ channel: "chromium" });
const context = await browser.newContext({
  reducedMotion: "reduce",
  permissions: ["clipboard-read", "clipboard-write"],
});
const page = await context.newPage(),
  errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const results = [];
for (const width of [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920]) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto("http://127.0.0.1:4173");
  for (const theme of ["dark", "light"]) {
    await page.evaluate((t) => {
      document.documentElement.dataset.theme = t;
    }, theme);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
      "Overflow " + width,
    );
    const axe = await new AxeBuilder({ page }).analyze();
    results.push({
      width,
      theme,
      violations: axe.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      })),
    });
  }
}
fs.mkdirSync("test-results/after-hours", { recursive: true });
fs.writeFileSync(
  "test-results/after-hours/initial-audit.json",
  JSON.stringify({ results, errors }, null, 2),
);
console.log(
  JSON.stringify(
    results.filter((r) => r.violations.length),
    null,
    2,
  ),
);
await browser.close();
