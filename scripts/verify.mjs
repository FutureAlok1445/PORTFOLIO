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
  if (m.type() === "error") errors.push(m.text());
});
for (const width of [360, 768, 1024, 1440, 1920]) {
  await page.setViewportSize({ width, height: width < 600 ? 800 : 1000 });
  await page.goto("http://127.0.0.1:4173/");
  await page.getByRole("heading", { name: /ALOK\s*SAHOO/ }).waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(
    () =>
      getComputedStyle(document.querySelector(".route-page")).opacity === "1" &&
      [...document.querySelectorAll(".hero-title [aria-hidden] div")].every(
        (el) => getComputedStyle(el).opacity === "1",
      ),
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
}
await page.getByRole("button", { name: "MongoDB", exact: true }).click();
assert.equal(await page.locator(".project-card").count(), 1);
await page.getByRole("button", { name: "All", exact: true }).click();
assert.equal(await page.locator(".project-card").count(), 3);
await page.getByRole("link", { name: "View TrustNet-AI project" }).click();
await page.getByRole("heading", { name: "TrustNet-AI", exact: true }).waitFor();
await page.getByRole("button", { name: "Forensics", exact: false }).click();
assert.match(await page.locator(".node-description").innerText(), /2D FFT/);
await page.getByRole("link", { name: "Next project AURA" }).click();
await page.getByRole("heading", { name: "AURA", exact: true }).waitFor();
await page.screenshot({ path: "test-results/project.png", fullPage: true });
await page.goto("http://127.0.0.1:4173/");
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
assert.equal(await page.getByRole("dialog").isVisible(), false);
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
assert.equal(
  await page.evaluate(
    () => !!document.querySelector(".hero-title [aria-hidden]"),
  ),
  false,
);
await page.screenshot({
  path: "test-results/reduced-motion.png",
  fullPage: true,
});
await page.setViewportSize({ width: 360, height: 800 });
await page.getByRole("button", { name: "Open navigation" }).click();
await page
  .getByRole("navigation", { name: "Main navigation" })
  .getByRole("button", { name: "Work", exact: true })
  .click();
assert.equal(await page.locator(".links").getAttribute("class"), "links");
await context.close();
const noJs = await browser.newContext({ javaScriptEnabled: false });
const noJsPage = await noJs.newPage();
await noJsPage.goto("http://127.0.0.1:4173/");
assert.match(await noJsPage.locator("body").innerText(), /Alok Sahoo/);
await noJs.close();
assert.deepEqual(errors, [], "Console errors");
await browser.close();
console.log(
  "PASS: five breakpoints, zero overflow/axe/console errors, project routes, filters, modal focus, theme memory, clipboard, form fallback, 404, reduced motion, mobile navigation, no-JS content.",
);
