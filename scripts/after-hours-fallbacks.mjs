import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs";
const browser = await chromium.launch({
  channel: "chromium",
  args: ["--disable-webgl"],
});
const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  }),
  page = await context.newPage();
await page.goto("http://127.0.0.1:4173/");
await expect(page.locator(".desk-poster")).toBeVisible();
await expect(page.locator("canvas")).toHaveCount(0);
await page.getByRole("link", { name: "The work", exact: true }).click();
await expect(page.locator("#work")).toBeInViewport();
await context.setOffline(true);
await page
  .getByRole("link", { name: "View AURA project", exact: true })
  .click();
await expect(
  page.getByRole("heading", { name: "AURA", exact: true }),
).toBeVisible();
await context.setOffline(false);
await page.route("**/after-hours/projects/aura.svg", (r) => r.abort());
await page.reload();
await expect(page.locator(".art-fallback")).toContainText("AURA");
await page.unroute("**/after-hours/projects/aura.svg");
await page.goto("http://127.0.0.1:4173/");
const cdp = await context.newCDPSession(page);
await cdp.send("Network.enable");
await cdp.send("Network.emulateNetworkConditions", {
  offline: false,
  latency: 200,
  downloadThroughput: 300000,
  uploadThroughput: 150000,
});
await page.reload();
await expect(page.locator(".desk-poster")).toBeVisible();
await expect(
  page.getByRole("link", { name: "Explore my work", exact: true }),
).toBeVisible();
await cdp.send("Network.emulateNetworkConditions", {
  offline: false,
  latency: 0,
  downloadThroughput: -1,
  uploadThroughput: -1,
});
fs.writeFileSync(
  "test-results/after-hours/fallbacks.json",
  JSON.stringify(
    {
      noWebGL: "poster and navigation",
      offline: "mounted SPA remains navigable, no offline cold-start cache",
      failedArtwork: "semantic fallback",
      slowNetwork: "poster, name and CTA remain available",
    },
    null,
    2,
  ),
);
await browser.close();
console.log(
  "PASS: no WebGL, mounted-page offline/reconnect, failed artwork and throttled network.",
);
