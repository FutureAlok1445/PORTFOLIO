import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
import { content } from "../src/data/content.js";
import assert from "node:assert/strict";
const browser = await chromium.launch({ channel: "chromium" });
const context = await browser.newContext({ reducedMotion: "reduce" });
const page = await context.newPage();
const errors = [];
function monitor(target) {
  target.on("pageerror", (error) => errors.push(error.message));
  target.on("console", (message) => {
    if (["error", "warning"].includes(message.type()))
      errors.push(message.text());
  });
}
monitor(page);
const cases = [];
for (const slug of content.projects.map((p) => p.slug)) {
  for (const width of [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 850 });
    await page.goto("http://127.0.0.1:4173/projects/" + slug);
    await page.locator(".detail-heading h1").waitFor();
    await page.evaluate(() => document.fonts.ready);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
      "Case overflow " + slug + " " + width,
    );
    const clipped = await page.evaluate(() => {
      const art = document
        .querySelector(".project-cover-art")
        .getBoundingClientRect();
      return [
        ...document.querySelectorAll(
          ".cover-notation,.cover-evidence,.cover-footnote",
        ),
      ]
        .filter((element) => {
          const rect = element.getBoundingClientRect();
          return (
            rect.left < art.left - 1 ||
            rect.right > art.right + 1 ||
            rect.top < art.top - 1 ||
            rect.bottom > art.bottom + 1
          );
        })
        .map((element) => element.className);
    });
    assert.deepEqual(clipped, [], "Clipped artwork text " + slug + " " + width);
    if (width === 320) {
      const axe = await new AxeBuilder({ page }).analyze();
      fs.writeFileSync(
        "test-results/axe-case-" + slug + ".json",
        JSON.stringify(axe.violations, null, 2),
      );
      assert.equal(
        axe.violations.length,
        0,
        "Case accessibility " +
          slug +
          ": " +
          axe.violations.map((value) => value.id),
      );
      await page.screenshot({
        path: "test-results/case-" + slug + "-320.png",
        fullPage: true,
      });
    }
    cases.push({ slug, width, overflow: false });
  }
}
await context.close();
const touchContext = await browser.newContext({
  viewport: { width: 375, height: 812 },
  hasTouch: true,
  isMobile: true,
});
const touch = await touchContext.newPage();
monitor(touch);
await touch.goto("http://127.0.0.1:4173/");
await touch.locator(".intro").waitFor({ state: "detached" });
await expect(touch.locator(".command-icon")).toBeVisible();
await touch
  .getByRole("button", { name: "Open command palette", exact: true })
  .tap();
await expect(touch.getByLabel("Search portfolio commands")).toBeFocused();
await touch
  .getByRole("button", { name: "Close command palette", exact: true })
  .tap();
await touch.waitForFunction(
  () => document.querySelector("canvas")?.dataset.animationActive === "false",
);
assert.equal(
  await touch
    .locator(".view-cursor")
    .evaluate((element) => getComputedStyle(element).display),
  "none",
);
await touch.screenshot({ path: "test-results/touch-mobile.png" });
await touchContext.close();
const transitionContext = await browser.newContext({
  viewport: { width: 1440, height: 900 },
});
const transition = await transitionContext.newPage();
monitor(transition);
await transition.addInitScript(() => {
  window.__transitions = [];
  const start = document.startViewTransition.bind(document);
  document.startViewTransition = (...args) => {
    const record = { ready: false, finished: false };
    window.__transitions.push(record);
    const result = start(...args);
    result.ready
      .then(() => (record.ready = true))
      .catch((error) => (record.error = error.message));
    result.finished.then(() => (record.finished = true));
    return result;
  };
});
await transition.goto("http://127.0.0.1:4173/");
await transition.waitForFunction(
  () => document.documentElement.dataset.motionReady === "true",
);
await transition
  .getByRole("link", { name: "View TrustNet-AI project", exact: true })
  .click();
await transition.waitForFunction(
  () => window.__transitions.length === 1 && window.__transitions[0].finished,
);
const native = await transition.evaluate(() => window.__transitions);
assert.equal(native[0].ready, true);
assert.equal(native[0].error, undefined);
await transition.emulateMedia({ reducedMotion: "reduce" });
await transition
  .getByRole("link", { name: "Next project HistoFacts", exact: true })
  .click();
await transition
  .getByRole("heading", { name: "HistoFacts", exact: true })
  .waitFor();
assert.equal(await transition.evaluate(() => window.__transitions.length), 1);
await transitionContext.close();
const fallbackContext = await browser.newContext();
const fallback = await fallbackContext.newPage();
monitor(fallback);
await fallback.addInitScript(() => (document.startViewTransition = undefined));
await fallback.goto("http://127.0.0.1:4173/");
await fallback
  .getByRole("link", { name: "View AURA project", exact: true })
  .click();
await expect(
  fallback.getByRole("heading", { name: "AURA", exact: true }),
).toBeVisible();
await fallbackContext.close();
assert.deepEqual(errors, []);
fs.writeFileSync(
  "test-results/extended-qa.json",
  JSON.stringify(
    {
      cases,
      touch: "Passed",
      nativeTransition: native,
      reducedTransition: "No transition",
      unsupportedTransition: "Normal route navigation",
    },
    null,
    2,
  ),
);
await browser.close();
console.log(
  "PASS: twelve case studies at nine widths, artwork text bounds, case axe scans, touch palette and cursor, native artwork transition and reduced/unsupported fallbacks.",
);
