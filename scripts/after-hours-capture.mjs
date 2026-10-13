import { chromium, expect } from "@playwright/test";
import fs from "node:fs";
const dir = "test-results/after-hours/final";
fs.mkdirSync(dir, { recursive: true });
fs.mkdirSync(".impeccable/review", { recursive: true });
const browser = await chromium.launch({ channel: "chromium" }),
  context = await browser.newContext(),
  page = await context.newPage();
const files = [];
for (const width of [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920]) {
  await page.setViewportSize({ width, height: width < 768 ? 900 : 1000 });
  await page.goto("http://127.0.0.1:4173/");
  await page.evaluate(() => document.fonts.ready);
  await page.locator(".intro").waitFor({ state: "detached" });
  if (width > 1024)
    await page.waitForFunction(
      () => document.querySelector("canvas")?.dataset.sceneReady === "true",
    );
  await page.screenshot({
    path: dir + "/hero-" + width + ".png",
    animations: "disabled",
  });
  fs.copyFileSync(
    dir + "/hero-" + width + ".png",
    ".impeccable/review/" +
      (width === 1440
        ? "desktop"
        : width === 390
          ? "mobile"
          : "user-" + width) +
      ".png",
  );
  files.push("hero-" + width + ".png");
}
await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto("http://127.0.0.1:4173/");
for (const card of await page.locator(".project-card").all()) {
  await card.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      card
        .locator(".art-illustration")
        .evaluate((img) => img.complete && img.naturalWidth > 0),
    )
    .toBe(true);
}
for (const section of [
  "about",
  "work",
  "skills",
  "experience",
  "credentials",
  "contact",
]) {
  await page
    .locator("#" + section)
    .screenshot({
      path: dir + "/" + section + ".png",
      animations: "disabled",
      style: ".nav,.skip-link,.back-to-top{visibility:hidden!important}",
    });
  files.push(section + ".png");
}
await page.getByRole("button", { name: "Back to top", exact: true }).click();
await page.waitForFunction(() => scrollY < 5);
await page.screenshot({
  path: dir + "/home-desktop.png",
  fullPage: true,
  animations: "disabled",
});
files.push("home-desktop.png");
await page
  .getByRole("button", { name: "Switch to light mode", exact: true })
  .click();
await page.screenshot({
  path: dir + "/hero-light.png",
  animations: "disabled",
});
files.push("hero-light.png");
await page
  .getByRole("button", { name: "Switch to dark mode", exact: true })
  .click();
for (const slug of ["aura", "bloom-blossom", "cosmeon-fs-lite"]) {
  await page.goto("http://127.0.0.1:4173/projects/" + slug);
  await expect(page.locator(".art-illustration")).toBeVisible();
  await expect
    .poll(() =>
      page
        .locator(".art-illustration")
        .evaluate((img) => img.complete && img.naturalWidth > 0),
    )
    .toBe(true);
  await page.screenshot({
    path: dir + "/case-" + slug + ".png",
    fullPage: true,
    animations: "disabled",
  });
  files.push("case-" + slug + ".png");
}
await page.setViewportSize({ width: 390, height: 900 });
await page.goto("http://127.0.0.1:4173/");
for (const card of await page.locator(".project-card").all()) {
  await card.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      card
        .locator(".art-illustration")
        .evaluate((img) => img.complete && img.naturalWidth > 0),
    )
    .toBe(true);
}
await page.getByRole("button", { name: "Back to top", exact: true }).click();
await page.waitForFunction(() => scrollY < 5);
await page.screenshot({
  path: dir + "/home-phone.png",
  fullPage: true,
  animations: "disabled",
});
files.push("home-phone.png");
await page
  .locator("#work")
  .screenshot({
    path: dir + "/shelf-phone.png",
    style: ".nav,.skip-link,.back-to-top{visibility:hidden!important}",
    animations: "disabled",
  });
files.push("shelf-phone.png");
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto("http://127.0.0.1:4173/");
await page.screenshot({
  path: dir + "/reduced-phone.png",
  animations: "disabled",
});
files.push("reduced-phone.png");
fs.writeFileSync(dir + "/captures.json", JSON.stringify(files, null, 2));
await browser.close();
console.log("Captured " + files.length + " settled production screenshots.");
