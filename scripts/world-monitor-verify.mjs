import { chromium, expect } from "@playwright/test";
import fs from "node:fs";
const out = "test-results/world-interface/monitor";
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: "chromium" }),
  page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://127.0.0.1:4180/?qa=1", { waitUntil: "networkidle" });
await expect(page.locator("canvas[data-scene-ready=true]")).toHaveCount(1, {
  timeout: 15000,
});
await page.locator("[data-world-object=monitor]").click();
await expect(page.locator("[data-object=monitor]")).toHaveAttribute(
  "data-aligned",
  "true",
  { timeout: 15000 },
);
await expect(
  page.getByRole("heading", { name: "HistoFacts", exact: true }),
).toBeVisible();
await page.screenshot({ path: out + "/desktop-open.png" });
await page.getByRole("button", { name: "Architecture", exact: true }).click();
await expect(
  page.getByRole("heading", { name: "Trace this build." }),
).toBeVisible();
await page
  .getByRole("navigation", { name: "Monitor applications" })
  .getByRole("button", { name: "About", exact: true })
  .click();
await expect(
  page.getByText("I’m Alok, a final-year IT student in Thane.", {
    exact: false,
  }),
).toBeVisible();
await page.keyboard.press("Escape");
await expect(page.locator("dialog[open]")).toHaveCount(0);
await expect(page.locator("[data-world-object=monitor]")).toBeFocused();
await expect(page.locator("canvas")).toHaveCount(1);
await page.screenshot({ path: out + "/desktop-restored.png" });
await page.setViewportSize({ width: 390, height: 844 });
await page.goto("http://127.0.0.1:4180/", { waitUntil: "networkidle" });
await page.locator("[data-world-object=monitor]").click();
await expect(page.locator(".surface-handoff")).toBeVisible();
await page.screenshot({ path: out + "/phone-open.png" });
expect(errors).toEqual([]);
fs.writeFileSync(
  out + "/result.json",
  JSON.stringify(
    {
      monitor:
        "project, architecture, about, close/focus return, one canvas, phone handoff",
      errors,
    },
    null,
    2,
  ),
);
await browser.close();
console.log("PASS monitor reference interaction.");
