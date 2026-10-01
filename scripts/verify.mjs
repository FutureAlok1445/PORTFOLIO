import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
import assert from "node:assert/strict";
fs.mkdirSync("test-results", { recursive: true });
const browser = await chromium.launch({ channel: "chromium" });
const context = await browser.newContext({
  permissions: ["clipboard-read", "clipboard-write"],
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type())) errors.push(m.text());
});
for (const width of [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920]) {
  await page.setViewportSize({ width, height: width < 600 ? 800 : 1000 });
  await page.goto("http://127.0.0.1:4173/");
  await page.getByRole("heading", { name: /Alok Sahoo/i }).waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(
    () => document.documentElement.dataset.motionReady === "true",
  );
  await page.locator(".intro").waitFor({ state: "detached" });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
    true,
    "Horizontal overflow at " + width,
  );
  await page.screenshot({
    path: "test-results/home-" + width + ".png",
    fullPage: true,
  });
  assert.equal(await page.locator(".hero-line").count(), 2);
  assert.equal(await page.locator(".certificates a:not([href])").count(), 0);
  assert.equal(await page.locator(".certificates article").count(), 7);
  const tiny = await page
    .locator("main, footer")
    .evaluateAll((roots) =>
      roots.flatMap((root) =>
        [...root.querySelectorAll("*")]
          .filter(
            (el) =>
              [...el.childNodes].some(
                (n) => n.nodeType === 3 && n.textContent.trim(),
              ) &&
              getComputedStyle(el).display !== "none" &&
              parseFloat(getComputedStyle(el).fontSize) < 12,
          )
          .map((el) => el.className),
      ),
    );
  assert.deepEqual(tiny, [], "Text below 12px at " + width);
  if (width <= 768)
    assert.equal(
      await page.locator("canvas").getAttribute("data-animation-active"),
      "false",
    );
  const result = await new AxeBuilder({ page }).analyze();
  fs.writeFileSync(
    "test-results/axe-" + width + ".json",
    JSON.stringify(result.violations, null, 2),
  );
  assert.equal(
    result.violations.length,
    0,
    "Accessibility violations at " +
      width +
      ": " +
      result.violations.map((v) => v.id).join(","),
  );
  await page
    .getByRole("button", { name: "Switch to dark mode", exact: true })
    .click();
  // Audit the settled theme, rather than an intermediate crossfade color.
  await page.waitForTimeout(600);
  const dark = await new AxeBuilder({ page }).analyze();
  fs.writeFileSync(
    "test-results/axe-dark-" + width + ".json",
    JSON.stringify(dark.violations, null, 2),
  );
  assert.equal(
    dark.violations.length,
    0,
    "Dark accessibility at " + width + ": " + dark.violations.map((v) => v.id),
  );
  await page
    .getByRole("button", { name: "Switch to light mode", exact: true })
    .click();
  await page.waitForTimeout(600);
}
await page.getByRole("button", { name: "Mobile", exact: true }).click();
assert.equal(await page.locator(".project-card").count(), 1);
await page.getByRole("button", { name: "All", exact: true }).click();
assert.equal(await page.locator(".project-card").count(), 12);
await page.getByRole("link", { name: "View TrustNet-AI project" }).click();
await page.getByRole("heading", { name: "TrustNet-AI", exact: true }).waitFor();
await page.getByRole("button", { name: "Forensics", exact: false }).click();
assert.match(await page.locator(".node-description").innerText(), /2D FFT/);
await page.getByRole("link", { name: "Next project HistoFacts" }).click();
await page.getByRole("heading", { name: "HistoFacts", exact: true }).waitFor();
await page.screenshot({ path: "test-results/project.png", fullPage: true });
await page.goto("http://127.0.0.1:4173/");
await page.locator(".intro").waitFor({ state: "detached" });
await page.getByRole("button", { name: "Open command palette" }).click();
await page.getByRole("dialog").waitFor({ state: "visible" });
await page.keyboard.press("Tab");
assert.equal(
  await page.evaluate(() =>
    document.querySelector("dialog").contains(document.activeElement),
  ),
  true,
);
for (let i = 0; i < 14; i++) await page.keyboard.press("Tab");
assert.equal(
  await page.evaluate(() =>
    document.querySelector("dialog").contains(document.activeElement),
  ),
  true,
);
await page.keyboard.press("Escape");
assert.equal((await page.getByRole("dialog").count()) > 0, false);
await page.keyboard.press("Control+k");
await page.getByRole("dialog").waitFor({ state: "visible" });
await page.keyboard.press("Escape");
await page.getByRole("button", { name: "Switch to dark mode" }).click();
await page.reload();
assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
await page.screenshot({ path: "test-results/dark.png", fullPage: true });
const darkAxe = await new AxeBuilder({ page }).analyze();
assert.equal(
  darkAxe.violations.length,
  0,
  "Dark mode accessibility: " + darkAxe.violations.map((v) => v.id),
);
await page.getByRole("button", { name: "Switch to light mode" }).click();
await page.getByRole("button", { name: "Copy email address" }).click();
assert.equal(
  await page.evaluate(() => navigator.clipboard.readText()),
  "aloknsahoo@gmail.com",
);
await page.getByLabel("Your name", { exact: true }).fill("Test Visitor");
await page.getByLabel("Your email", { exact: true }).fill("test@example.com");
await page
  .getByLabel("What are you thinking?")
  .fill("Testing the contact form state.");
await page.getByRole("button", { name: "Send a message" }).click();
assert.match(
  await page.locator(".form-feedback").innerText(),
  /isn’t connected/,
);
await page.goto("http://127.0.0.1:4173/unknown-route");
await page
  .getByRole("heading", { name: "This route doesn’t connect." })
  .waitFor();
await page.getByRole("link", { name: "Back to Alok’s portfolio" }).click();
await page.emulateMedia({ reducedMotion: "reduce" });
await page.reload();
assert.equal(
  await page
    .locator(".view-cursor")
    .evaluate((el) => getComputedStyle(el).display),
  "none",
);
assert.equal(await page.locator(".hero-line").count(), 2);
assert.equal(
  await page.locator("canvas").getAttribute("data-animation-active"),
  "false",
);
assert.equal(
  await page.locator(".marquee-track").getAttribute("data-animation-active"),
  "false",
);
const reducedAxe = await new AxeBuilder({ page }).analyze();
assert.equal(reducedAxe.violations.length, 0, "Reduced motion accessibility");
await page.screenshot({
  path: "test-results/reduced-motion.png",
  fullPage: true,
});
await page.setViewportSize({ width: 375, height: 800 });
await page.getByRole("button", { name: "Open navigation" }).click();
await page
  .getByRole("navigation", { name: "Main navigation" })
  .getByRole("button", { name: "Work", exact: true })
  .click();
assert.equal(await page.locator(".links").getAttribute("class"), "links");

// Search, arrow selection, Enter navigation and resume command.
await page
  .getByRole("button", { name: "Open command palette", exact: true })
  .click();
await page.getByLabel("Search portfolio commands").fill("aura");
assert.equal(await page.locator(".command-item").count(), 1);
await page.keyboard.press("ArrowDown");
await page.keyboard.press("Enter");
await page.getByRole("heading", { name: "AURA", exact: true }).waitFor();
await page
  .getByRole("heading", { name: "Engineering decisions.", exact: true })
  .waitFor();
await page
  .getByRole("button", { name: "Open command palette", exact: true })
  .click();
await page.getByLabel("Search portfolio commands").fill("resume");
assert.equal(await page.locator(".command-item[download]").count(), 1);
const downloaded = page.waitForEvent("download");
await page.keyboard.press("Enter");
assert.equal((await downloaded).suggestedFilename(), "resume.pdf");
await page.goto("http://127.0.0.1:4173/");
await page.getByRole("button", { name: /Sound off/ }).click();
await page
  .getByRole("link", { name: "View TrustNet-AI project", exact: true })
  .click();
await page.getByRole("link", { name: "Project library", exact: true }).click();
assert.equal(
  await page
    .getByRole("button", { name: /Sound on/ })
    .getAttribute("aria-pressed"),
  "true",
);
await page.emulateMedia({ reducedMotion: "no-preference" });
await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto("http://127.0.0.1:4173/");
await page.waitForFunction(
  () => document.documentElement.dataset.motionReady === "true",
);
await page.waitForFunction(
  () => document.querySelector("canvas")?.dataset.animationActive === "true",
);
assert.equal(
  await page.locator("canvas").getAttribute("data-node-count"),
  "28",
);
assert.equal(
  await page.locator(".marquee-track").getAttribute("data-animation-active"),
  "false",
);
const profile = () =>
  page.evaluate(() => ({
    dom: document.querySelectorAll("*").length,
    canvases: document.querySelectorAll("canvas").length,
    pins: document.querySelectorAll(".pin-spacer").length,
    triggers: document.documentElement.dataset.motionTriggers,
  }));
const baseline = await profile();
const cycles = [];
for (let i = 0; i < 3; i++) {
  await page
    .getByRole("link", { name: "View TrustNet-AI project", exact: true })
    .click();
  await page
    .getByRole("heading", { name: "TrustNet-AI", exact: true })
    .waitFor();
  assert.equal(await page.locator("canvas").count(), 0);
  await page
    .getByRole("link", { name: "Project library", exact: true })
    .click();
  await page.waitForFunction(
    () => document.querySelector("canvas")?.dataset.nodeCount === "28",
  );
  await page.waitForFunction(
    () => document.documentElement.dataset.motionReady === "true",
  );
  await page.getByRole("button", { name: "Back to top", exact: true }).click();
  await page.waitForFunction(() => window.scrollY < 5);
  const current = await profile();
  cycles.push(current);
  assert.equal(current.canvases, 1);
  assert.equal(current.pins, baseline.pins);
  assert.ok(Math.abs(current.dom - baseline.dom) <= 3, "DOM accumulation");
  assert.ok(
    Number(current.triggers) <= Number(baseline.triggers),
    "ScrollTrigger accumulation",
  );
}
await page.locator("#work").scrollIntoViewIfNeeded();
await page.waitForFunction(
  () => document.querySelector("canvas").dataset.animationActive === "false",
);
const media = page.getByRole("link", {
  name: "View TrustNet-AI project",
  exact: true,
});
await media.hover();
await page.waitForFunction(() =>
  document.querySelector(".view-cursor").classList.contains("on"),
);
await page.screenshot({ path: "test-results/work-desktop.png" });
await page.getByRole("button", { name: "Back to top", exact: true }).click();
await page.waitForFunction(() => window.scrollY < 5);
await page.screenshot({ path: "test-results/hero-desktop.png" });
await page.locator("footer").scrollIntoViewIfNeeded();
await page.waitForFunction(
  () =>
    document.querySelector(".marquee-track").dataset.animationActive === "true",
);
assert.equal(
  await page.locator("canvas").getAttribute("data-animation-active"),
  "false",
);
const footer = await profile();
await page.setViewportSize({ width: 430, height: 850 });
await page.getByRole("button", { name: "Back to top", exact: true }).click();
await page.waitForFunction(() => window.scrollY < 5);
assert.equal(await page.locator(".pin-spacer").count(), 0);
await page.screenshot({ path: "test-results/hero-mobile.png" });
await page.setViewportSize({ width: 1440, height: 1000 });
await page.reload();
// Fast scroll before the entrance finishes, then resize across desktop/mobile.
await page.evaluate(() => window.scrollTo(0, 1600));
await page.evaluate(() => window.scrollTo(0, 0));
await page.setViewportSize({ width: 375, height: 800 });
await page.setViewportSize({ width: 1440, height: 1000 });
await page.waitForFunction(
  () => document.documentElement.dataset.motionReady === "true",
);
assert.equal(await page.locator(".hero-line-inner").count(), 2);
assert.match(
  (await page.locator(".hero-title").textContent()).replace(/\s/g, ""),
  /^ALOKSAHOO\.$/,
);
fs.writeFileSync(
  "test-results/runtime-profile.json",
  JSON.stringify(
    {
      baseline,
      cycles,
      footer,
      heap: "Not measured; bounded DOM/canvas/ScrollTrigger cycles only.",
    },
    null,
    2,
  ),
);
await context.close();
const noJs = await browser.newContext({ javaScriptEnabled: false });
const noJsPage = await noJs.newPage();
await noJsPage.goto("http://127.0.0.1:4173/");
assert.match(await noJsPage.locator("body").innerText(), /Alok Sahoo/);
await noJs.close();
assert.deepEqual(errors, [], "Console errors");
await browser.close();
console.log(
  "PASS: nine breakpoints, both themes, zero overflow/axe/console errors, project routes, filters, search and keyboard selection, modal focus, theme memory, clipboard, form fallback, 404, reduced motion, mobile navigation, cursor, 28-node canvas, offscreen loops, bounded route cycles and no-JS content.",
);
