import { chromium } from "@playwright/test";
import fs from "node:fs";
const out = "test-results/world-interface/baseline";
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: "chromium" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://127.0.0.1:4180/?qa=1", { waitUntil: "networkidle" });
await page.waitForTimeout(2200);
for (const id of [
  "desk",
  "about",
  "work",
  "skills",
  "experience",
  "credentials",
  "contact",
]) {
  await page
    .locator("#" + id)
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  await page.waitForTimeout(1600);
  await page.screenshot({ path: out + "/" + id + ".png" });
}
await page.goto("http://127.0.0.1:4180/projects/aura", {
  waitUntil: "networkidle",
});
await page.screenshot({ path: out + "/aura.png" });
await page.setViewportSize({ width: 390, height: 844 });
await page.goto("http://127.0.0.1:4180/", { waitUntil: "networkidle" });
await page.screenshot({ path: out + "/phone.png" });
await browser.close();
console.log("Captured actual incumbent seven chapters, AURA and phone.");
