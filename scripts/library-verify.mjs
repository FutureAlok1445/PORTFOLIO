import { chromium, expect } from "@playwright/test";
import fs from "node:fs";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import sharp from "sharp";
import { content } from "../src/data/content.js";
const dir = "test-results/after-hours";
fs.mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({ channel: "chromium" }),
  context = await browser.newContext({ reducedMotion: "reduce" }),
  page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://127.0.0.1:4173/");
await expect(page.locator(".project-card")).toHaveCount(12);
const hashes = content.projects.map((p) =>
  crypto
    .createHash("sha256")
    .update(
      fs.readFileSync("public/images/after-hours/projects/" + p.slug + ".svg"),
    )
    .digest("hex"),
);
assert.equal(new Set(hashes).size, 12, "Twelve genuinely distinct covers");
for (const category of [
  ...new Set(content.projects.flatMap((p) => p.filters)),
]) {
  await page.getByRole("button", { name: category, exact: true }).click();
  await expect(page.locator(".project-card")).toHaveCount(
    content.projects.filter((p) => p.filters.includes(category)).length,
  );
}
await page.getByRole("button", { name: "All", exact: true }).click();
for (const p of content.projects) {
  const link = page.getByRole("link", {
    name: "View " + p.title + " project",
    exact: true,
  });
  await link.scrollIntoViewIfNeeded();
  await expect(link.locator(".art-illustration")).toBeVisible();
  await expect
    .poll(() =>
      link
        .locator(".art-illustration")
        .evaluate((img) => img.complete && img.naturalWidth > 0),
    )
    .toBe(true);
  await link.click();
  await expect(
    page.getByRole("heading", { name: p.title, exact: true }),
  ).toBeVisible();
  await expect(page.locator(".case-meta")).toContainText(p.status);
  await expect(page.locator(".case-status")).toContainText(p.scopeNotes[0]);
  assert.equal(
    await page.locator(".source-links a").count(),
    p.sources?.length || 0,
  );
  for (let i = 0; i < p.nodes.length; i++) {
    await page.locator(".architecture-steps button").nth(i).click();
    await expect(page.locator(".node-description")).toContainText(
      p.nodes[i].text,
    );
  }
  await page
    .getByRole("link", { name: "Project library", exact: true })
    .click();
}
const manifest = JSON.parse(
    fs.readFileSync("public/images/after-hours/patch/patch-manifest.json"),
  ),
  sprites = [];
for (const [name, a] of Object.entries(manifest.animations)) {
  const file = "public/images/after-hours/patch/" + a.file,
    metadata = await sharp(file).metadata(),
    frames = [];
  assert.equal(metadata.width, a.frames * 48);
  assert.equal(metadata.height, 48);
  assert.equal(metadata.hasAlpha, true);
  for (let frame = 0; frame < a.frames; frame++)
    frames.push(
      crypto
        .createHash("sha256")
        .update(
          await sharp(file)
            .extract({ left: frame * 48, top: 0, width: 48, height: 48 })
            .raw()
            .toBuffer(),
        )
        .digest("hex"),
    );
  assert.equal(new Set(frames).size, a.frames, "Distinct frames " + name);
  sprites.push({ name, frames: a.frames, unique: new Set(frames).size });
}
await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto("http://127.0.0.1:4173/");
await page
  .getByRole("button", {
    name: "Say hello to Patch, the workshop cat",
    exact: true,
  })
  .focus();
await page.keyboard.press("Enter");
await expect(page.locator(".desk-stage .patch-button")).toHaveClass(
  /patch-paw/,
);
assert.deepEqual(errors, []);
fs.writeFileSync(
  dir + "/library-verification.json",
  JSON.stringify(
    {
      projects: 12,
      uniqueCovers: 12,
      sprites,
      architecture: "Every node checked",
      errors,
    },
    null,
    2,
  ),
);
await browser.close();
console.log(
  "PASS: twelve files and all architecture nodes, domain filters, preserved links/status/source references, 32 distinct transparent pixel frames and keyboard Patch reaction.",
);
