import { chromium } from "@playwright/test";
const b = await chromium.launch({ channel: "chromium" }),
  p = await b.newPage({ viewport: { width: 1440, height: 900 } });
p.on("pageerror", (e) => console.log("ERROR", e.stack));
p.on("console", (m) => {
  if (m.type() === "error") console.log("CONSOLE", m.text());
});
await p.goto("http://127.0.0.1:4180/", { waitUntil: "networkidle" });
await p.waitForTimeout(1500);
await p.locator("[data-world-object=monitor]").click();
await p.waitForTimeout(1500);
await p.keyboard.press("Escape");
await p.waitForTimeout(1500);
await p
  .getByRole("navigation", { name: "Room destinations" })
  .getByRole("button", { name: "Field notes" })
  .click();
await p.waitForTimeout(1600);
await p.locator("[data-world-object=notebook]").click();
await p.waitForTimeout(1800);
console.log(
  p.url(),
  await p.locator("dialog").count(),
  await p.locator("dialog").getAttribute("open"),
);
console.log((await p.locator("body").innerText()).slice(-2000));
await p.screenshot({ path: "test-results/world-interface/debug.png" });
await b.close();
