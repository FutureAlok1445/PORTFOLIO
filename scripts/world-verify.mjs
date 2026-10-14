import { chromium, expect as baseExpect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
import { content } from "../src/data/content.js";
const expect = baseExpect.configure({ timeout: 15000 });
const root = "http://127.0.0.1:4180",
  out = "test-results/world-interface/round1";
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: "chromium" }),
  context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  }),
  page = await context.newPage();
const errors = [],
  checks = [],
  axe = [];
page.on("pageerror", (err) => errors.push(err.message));
const settle = async () => {
  await page.waitForTimeout(120);
  if (await page.locator("canvas").count())
    await expect(page.locator("canvas")).toHaveAttribute(
      "data-scene-settled",
      "true",
    );
};
const open = async (id) => {
  await page.locator("[data-world-object=" + id + "]").click();
  await expect(page.locator("dialog[open]")).toHaveCount(1);
  if (await page.locator("canvas").count())
    await expect(page.locator("[data-object=" + id + "]")).toHaveAttribute(
      "data-aligned",
      "true",
    );
  await settle();
  await expect(page.locator(".object-owned-surface")).toHaveCSS("opacity", "1");
  await page.locator('.object-owned-surface').evaluate(async el=>{
    await document.fonts.ready;
    await Promise.all(el.getAnimations({subtree:true}).filter(a=>a.effect.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})));
  });
};
const close = async () => {
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog[open]")).toHaveCount(0);
  await settle();
};
await page.goto(root + "/?qa=1", { waitUntil: "networkidle" });
await settle();
await page.screenshot({ path: out + "/desktop.png" });
await open("monitor");
await expect(
  page.getByRole("heading", { name: content.projects[0].title, exact: true }),
).toBeVisible();
await page.locator(".file-list button").nth(1).click();
await expect(page.locator(".explorer-document h3")).toHaveText(
  content.projects[1].title,
);
await page.locator("#file-search").fill("not a real file");
await expect(page.getByRole("status")).toContainText("No matching");
await page.locator("#file-search").fill("");
await page.screenshot({ path: out + "/monitor.png" });
axe.push({
  surface: "monitor",
  violations: (await new AxeBuilder({ page }).analyze()).violations,
});
for (const app of ["Architecture", "About", "Build notes", "Contact"])
  await page
    .getByRole("navigation", { name: "Monitor applications" })
    .getByRole("button", { name: app, exact: true })
    .click();
await close();
await expect(page.locator("[data-world-object=monitor]")).toBeFocused();
checks.push("Monitor apps, search, source data, Escape/focus");
await page
  .getByRole("navigation", { name: "Room destinations" })
  .getByRole("button", { name: "Field notes" })
  .click();
await settle();
await open("notebook");
for (let i = 0; i < 3; i++) {
  await page.getByRole("button", { name: "Next page" }).click();
  await expect(page.locator(".page-turn-controls span")).toHaveText(
    i + 2 + " / 4",
  );
}
await page.getByRole("button", { name: "Previous page" }).click();
await expect(page.locator('.page-turn-controls span')).toHaveText('3 / 4');
await page.screenshot({ path: out + "/notebook.png" });
await close();
checks.push("Notebook four real pages and reversible turns");
await page
  .getByRole("navigation", { name: "Room destinations" })
    .getByRole("button", { name: content.workshop.interface.chapterLabels.work })
  .click();
await settle();
const ring = await page.evaluate(() => window.__workshopMetrics.ring);
expect(ring.length).toBe(12);
expect(new Set(ring.map((r) => r.id)).size).toBe(12);
for (const slot of ring)
  expect(Math.hypot(slot.position[0], slot.position[2])).toBeCloseTo(Math.max(5.4,3.1/(2*Math.sin(Math.PI/content.projects.length))),5);
await page.screenshot({ path: out + "/archive.png" });
for (let i = 0; i < 12; i++) {
  await page.getByRole("button", { name: "Next archive artifact" }).click();
  await expect(page.locator(".ring-console strong")).toHaveText(
    content.projects[(i + 2) % 12].title,
  );
}
await settle();
await open("project");
await expect(page.locator(".artifact-document-header h3")).toHaveText(
  content.projects[1].title,
);
await page.screenshot({ path: out + "/project.png" });
await page.getByRole("button", { name: "System flow", exact: true }).click();
await page.getByRole("button", { name: "Next", exact: true }).click();
await page.getByRole("button", { name: "Scope & evidence" }).click();
await expect(page.locator(".source-file").first()).toBeVisible();
await close();
for (let i = 0; i < 20; i++) {
  await open("project");
  await page.goBack();
  await expect(page.locator("dialog[open]")).toHaveCount(0);
  await page.getByRole("button", { name: "Next archive artifact" }).click();
}
expect(await page.locator("canvas").count()).toBe(1);
checks.push(
  "12 unique ring slots on exact radius, wrap cycle, 20 open/back/rotate cycles, correct inspection",
);
for (const [chapter, id] of [
  [content.workshop.interface.chapterLabels.skills,"toolkit"],
  [content.workshop.interface.chapterLabels.experience,"journey"],
  [content.workshop.interface.chapterLabels.experience,"credentials"],
  [content.workshop.interface.chapterLabels.contact,"contact"],
]) {
  await page
    .getByRole("navigation", { name: "Room destinations" })
    .getByRole("button", { name: chapter, exact: true })
    .click();
  await settle();
  await open(id);
  if (id === "toolkit") {
    await page.locator(".terminal-key-row button").nth(2).click();
    await expect(page.locator(".terminal-output h3")).toHaveText(
      content.skills[1].title,
    );
  }
  if (id === "journey") {
    await page.locator(".reading-pinboard nav button").nth(1).click();
    await expect(page.locator(".pinned-reading-note h3")).toHaveText(
      content.experience[1].role,
    );
  }
  if (id === "credentials") {
    await page.locator(".open-record-drawer nav button").last().click();
    await expect(page.locator(".credential-record h3")).toHaveText(
      content.certificates.at(-1).title,
    );
  }
  if (id === "contact") {
    await page.getByRole("button", { name: "Send a message" }).click();
    await expect(
      page.getByText("Enter your name.", { exact: true }),
    ).toBeVisible();
    await page.locator("#name").fill("QA only");
    await page.locator("#email").fill("qa@example.com");
    await page
      .locator("#message")
      .fill("Local configuration verification only.");
    await page.getByRole("button", { name: "Send a message" }).click();
    await expect(
      page.getByText("The form isn’t connected yet.", { exact: false }),
    ).toBeVisible();
  }
  await page.screenshot({ path: out + "/" + id + ".png" });
  axe.push({
    surface: id,
    violations: (await new AxeBuilder({ page }).analyze()).violations,
  });
  await close();
}
checks.push(
  "Toolkit categories, second journey record, last credential, honest contact validation",
);
await page.goto(root + "/?qa=1#skills", { waitUntil: "networkidle" });
await settle();
const key = await page.evaluate(() =>
  window.__workshopHotspots.find(
    (h) => h.action === "tool" && h.category === "Languages",
  ),
);
await page.mouse.click(key.x, key.y);
await expect(page.locator("[data-object=toolkit]")).toHaveAttribute(
  "data-aligned",
  "true",
);
await expect(page.locator(".terminal-output h3")).toHaveText("Languages");
await close();
checks.push("Actual 3D keycap raycast opens its attached display");
await page.goto(root + "/", { waitUntil: "networkidle" });
await settle();
await page.getByRole("button", { name: "Pet Patch", exact: true }).click();
await expect(page.locator(".world-patch-anchor .patch-button")).toHaveAttribute(
  "data-patch-state",
  "pet",
);
await page.waitForTimeout(1100);
await page
  .getByRole("button", { name: "Let Patch stretch its legs" })
  .click({ force: true });
await expect(page.locator(".world-patch-anchor .patch-button")).toHaveAttribute(
  "data-patch-state",
  "walk",
);
await page
  .getByRole("navigation", { name: "Room destinations" })
  .getByRole("button", { name: content.workshop.interface.chapterLabels.work })
  .click();
await settle();
expect(await page.evaluate(() => window.__workshopMetrics.patch.state)).toBe(
  "idle",
);
checks.push("Patch pet, walk and chapter cancellation");
await page.goto(root + "/", { waitUntil: "networkidle" });
await open("monitor");
await page
  .locator(".surface-exit-actions")
  .getByRole("button", { name: "Quick View" })
  .click();
await expect(page.locator("canvas")).toHaveCount(0);
await expect(page.locator("#contact form")).toHaveCount(1);
await page.locator(".room-settings summary").click();
await page
  .getByRole("button", { name: "Explore workshop", exact: true })
  .click();
await settle();
checks.push(
  "Quick View from active inspection disposes canvas and releases scroll",
);
fs.writeFileSync(out+'/interaction-report.json',JSON.stringify({checks,errors,axe},null,2));
for (const width of [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920]) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(root + "/", { waitUntil: "networkidle" });
  await settle();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  if (width === 390) await page.screenshot({ path: out + "/mobile.png" });
  for (const id of [
    "monitor",
    "notebook",
    "project",
    "toolkit",
    "journey",
    "credentials",
    "contact",
  ]) {
    if (width > 1024) {
      await page.goto(root + "/?object=" + id, { waitUntil: "networkidle" });
      await expect(page.locator("[data-object=" + id + "]")).toHaveAttribute(
        "data-aligned",
        "true",
      );
    } else await open(id);
    const overflow = await page
      .locator(".object-surface-content")
      .evaluate((el) => ({ client: el.clientWidth, scroll: el.scrollWidth }));
    expect(overflow.scroll, width + "px " + id).toBeLessThanOrEqual(
      overflow.client + 1,
    );
    if (width === 390)
      await page.screenshot({ path: out + "/mobile-" + id + ".png" });
    await close();
  }
}
checks.push(
  "Nine widths × seven reading surfaces: no horizontal content overflow",
);
for (const p of content.projects) {
  await page.goto(root + "/projects/" + p.slug, {
    waitUntil: "domcontentloaded",
  });
  await expect(page.locator("h1")).toHaveText(p.title);
}
checks.push("12 complete project routes retained");
fs.writeFileSync(
  out + "/report.json",
  JSON.stringify({ checks, errors, axe }, null, 2),
);
await browser.close();
expect(errors).toEqual([]);
expect(axe.flatMap(result=>result.violations)).toEqual([]);
console.log(
  JSON.stringify(
    {
      checks,
      axe: axe.map((a) => ({
        surface: a.surface,
        violations: a.violations.map((v) => v.id),
      })),
      errors,
    },
    null,
    2,
  ),
);
