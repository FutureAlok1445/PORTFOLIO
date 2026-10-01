import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
import assert from "node:assert/strict";
import { content } from "../src/data/content.js";
fs.mkdirSync("test-results/library", { recursive: true });
const browser = await chromium.launch({ channel: "chromium" });
const context = await browser.newContext({ reducedMotion: "reduce" });
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
const base = "http://127.0.0.1:4173";
const round = process.env.LIBRARY_ROUND || "initial";
const layouts = [];
for (const width of process.env.LIBRARY_FUNCTIONAL_ONLY
  ? []
  : [320, 375, 390, 430, 768, 1024, 1280, 1440]) {
  await page.setViewportSize({ width, height: 1000 });
  await page.goto(base);
  await page.evaluate(() => document.fonts.ready);
  await page
    .getByRole("button", { name: "Switch to dark mode", exact: true })
    .click();
  await page
    .locator("#work")
    .evaluate((el) => window.scrollTo(0, el.offsetTop - 90));
  await expect(page.locator(".project-card")).toHaveCount(12);
  const layout = await page.locator(".library-track").evaluate((el) => ({
    width: innerWidth,
    scrolls: el.scrollWidth > el.clientWidth,
    pageOverflow: document.documentElement.scrollWidth > innerWidth,
    display: getComputedStyle(el).display,
  }));
  assert.equal(layout.pageOverflow, false);
  assert.equal(layout.scrolls, width > 768);
  layouts.push(layout);
  const axe = await new AxeBuilder({ page }).include("#work").analyze();
  assert.deepEqual(axe.violations, [], "Library axe " + width);
  await page.mouse.move(0, 0);
  await page.screenshot({ path: `test-results/library/${round}-${width}.png` });
  if (width === 1440)
    await page
      .locator("#work")
      .screenshot({
        path: `test-results/library/${round}-desktop-section.png`,
      });
  if (width === 375)
    for (const p of content.projects)
      await page
        .getByRole("link", { name: `View ${p.title} project`, exact: true })
        .screenshot({
          path: `test-results/library/${round}-book-${p.slug}-375.png`,
        });
  await page
    .getByRole("button", { name: "Switch to light mode", exact: true })
    .click();
}
if (process.env.LIBRARY_FUNCTIONAL_ONLY) {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base);
}
await page.getByRole("button", { name: "Next chapter", exact: true }).click();
await expect(page.locator(".library-position")).toHaveText("02 / 12");
await page
  .getByRole("button", { name: "Previous chapter", exact: true })
  .click();
await expect(page.locator(".library-position")).toHaveText("01 / 12");
await page
  .getByRole("link", { name: "View HistoFacts project", exact: true })
  .focus();
await page.keyboard.press("End");
await expect(
  page.getByRole("link", { name: "View TrustNet-AI project", exact: true }),
).toBeFocused();
await expect(
  page.getByRole("button", { name: "Next chapter", exact: true }),
).toBeDisabled();
await page
  .getByRole("button", { name: "Previous chapter", exact: true })
  .click();
await expect(
  page.getByRole("button", { name: "Next chapter", exact: true }),
).toBeEnabled();
await page
  .getByRole("link", { name: "View TrustNet-AI project", exact: true })
  .focus();
await page.keyboard.press("Home");
await expect(
  page.getByRole("link", { name: "View HistoFacts project", exact: true }),
).toBeFocused();
await page.keyboard.press("ArrowRight");
await expect(
  page.getByRole("link", { name: "View AURA project", exact: true }),
).toBeFocused();
await page.keyboard.press("Enter");
await expect(
  page.getByRole("heading", { name: "AURA", exact: true }),
).toBeVisible();
await page.getByRole("button", { name: /Response correlation/ }).click();
await expect(page.locator(".node-description")).toContainText(
  "detection alone does not mean success",
);
await page.getByRole("link", { name: "Project library", exact: true }).click();
await expect(page.locator("#work")).toBeInViewport();
for (const category of [
  ...new Set(content.projects.flatMap((p) => p.filters)),
]) {
  await page.getByRole("button", { name: category, exact: true }).click();
  assert.equal(
    await page.locator(".project-card").count(),
    content.projects.filter((p) => p.filters.includes(category)).length,
  );
}
await page.getByRole("button", { name: "All", exact: true }).click();
for (const query of ["Flutter", "distributed systems", "FastAPI"]) {
  await page
    .getByRole("button", { name: "Open command palette", exact: true })
    .click();
  await page.getByLabel("Search portfolio commands").fill(query);
  assert.ok(
    (await page.locator(".command-item").count()) > 0,
    "Palette stack query " + query,
  );
  await page.keyboard.press("Escape");
}
for (const slug of ["aura", "bloom-blossom", "cosmeon-fs-lite", "trustnet-ai", "fincoach-ai"]) {
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(base + "/projects/" + slug);
    await page
      .getByRole("button", { name: "Switch to dark mode", exact: true })
      .click();
    await page.evaluate(() => document.fonts.ready);
    if(slug==="trustnet-ai") {
      await expect(page.locator(".cover-evidence")).toHaveText("Conceptual pipeline · supplied resume");
      await expect(page.locator(".cover-pipeline")).toContainText("Forensics");
    }
    if(slug==="fincoach-ai") {
      await expect(page.locator(".cover-pipeline")).toContainText("Puter advisor");
      assert.equal(await page.locator(".finance-field").count(),0);
    }
    await page.mouse.move(0, 0);
    await page.screenshot({
      path: `test-results/library/${round}-${slug}-${width}.png`,
      fullPage: true,
    });
    await page
      .getByRole("button", { name: "Switch to light mode", exact: true })
      .click();
  }
}
await page.goto(base);
await page.setViewportSize({ width: 1440, height: 1000 });
await page.emulateMedia({ reducedMotion: "no-preference" });
await page.locator(".intro").waitFor({ state: "detached" });
await page
  .locator("#work")
  .evaluate((el) => window.scrollTo(0, el.offsetTop - 90));
await page
  .getByRole("link", { name: "View HistoFacts project", exact: true })
  .hover({ position: { x: 200, y: 100 } });
const transform = await page
  .getByRole("link", { name: "View HistoFacts project", exact: true })
  .evaluate((el) => el.style.getPropertyValue("--book-ry"));
assert.ok(Math.abs(parseFloat(transform)) <= 5, "Bounded book perspective");
const y = await page.evaluate(() => scrollY);
await page.mouse.wheel(0, 400);
await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(y + 100);
assert.deepEqual(errors, []);
fs.writeFileSync(
  "test-results/library/verification.json",
  JSON.stringify(
    {
      layouts,
      filters: "all domains checked",
      keyboard: "Home, End, arrows, Enter",
      architecture: "response correlation",
      palette: "stack and domain search",
      wheel: "vertical page scrolling",
      errors,
    },
    null,
    2,
  ),
);
await browser.close();
console.log(
  "PASS: library layouts, domain filters, keyboard chapters, architecture, palette discovery, bounded pointer depth and native wheel scrolling.",
);
