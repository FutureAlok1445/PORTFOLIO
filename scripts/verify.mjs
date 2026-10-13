import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
import assert from "node:assert/strict";
import { content } from "../src/data/content.js";
fs.mkdirSync("test-results/after-hours", { recursive: true });
const browser = await chromium.launch({ channel: "chromium" });
const context = await browser.newContext({
  permissions: ["clipboard-read", "clipboard-write"],
  reducedMotion: "reduce",
});
const page = await context.newPage(),
  errors = [],
  widths = [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920],
  checks = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
for (const width of widths) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto("http://127.0.0.1:4173/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".project-card")).toHaveCount(12);
  await expect(
    page.getByRole("heading", { name: content.profile.name, exact: true }),
  ).toBeVisible();
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
    "Overflow " + width,
  );
  assert.equal(
    await page.locator("canvas").count(),
    0,
    "Reduced motion uses poster",
  );
  assert.equal(await page.locator(".certificates article").count(), 7);
  for (const theme of ["dark", "light"]) {
    if ((await page.locator("html").getAttribute("data-theme")) !== theme)
      await page
        .getByRole("button", {
          name: "Switch to " + theme + " mode",
          exact: true,
        })
        .click();
    const axe = await new AxeBuilder({ page }).analyze();
    fs.writeFileSync(
      "test-results/after-hours/axe-" + theme + "-" + width + ".json",
      JSON.stringify(axe.violations, null, 2),
    );
    assert.deepEqual(
      axe.violations,
      [],
      "Accessibility " + theme + " " + width,
    );
  }
  const tiny = await page
    .locator("main,footer")
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
  assert.deepEqual(tiny, [], "Text below 12px " + width);
  checks.push({ width, overflow: false, themes: ["dark", "light"], axe: 0 });
}
await page.getByRole("button", { name: "Mobile", exact: true }).click();
await expect(page.locator(".project-card")).toHaveCount(1);
await page.getByRole("button", { name: "All", exact: true }).click();
await page
  .getByRole("link", { name: "View HistoFacts project", exact: true })
  .focus();
await page.keyboard.press("ArrowRight");
await expect(
  page.getByRole("link", { name: "View AURA project", exact: true }),
).toBeFocused();
await page.keyboard.press("End");
await expect(
  page.getByRole("link", { name: "View TrustNet-AI project", exact: true }),
).toBeFocused();
await page.keyboard.press("Enter");
await expect(
  page.getByRole("heading", { name: "TrustNet-AI", exact: true }),
).toBeVisible();
await page.getByRole("button", { name: /Forensics/ }).click();
await expect(page.locator(".node-description")).toContainText("2D FFT");
await page
  .getByRole("link", { name: "Next project HistoFacts", exact: true })
  .click();
await expect(
  page.getByRole("heading", { name: "HistoFacts", exact: true }),
).toBeVisible();
await page.goBack();
await expect(
  page.getByRole("heading", { name: "TrustNet-AI", exact: true }),
).toBeVisible();
await page.goForward();
await expect(
  page.getByRole("heading", { name: "HistoFacts", exact: true }),
).toBeVisible();
await page.goto("http://127.0.0.1:4173/");
await page
  .getByRole("button", { name: "Open command palette", exact: true })
  .click();
await expect(page.getByLabel("Search portfolio commands")).toBeFocused();
for (let i = 0; i < 20; i++) await page.keyboard.press("Tab");
assert.equal(
  await page.evaluate(() =>
    document.querySelector("dialog").contains(document.activeElement),
  ),
  true,
  "Modal focus containment",
);
await page.keyboard.press("Escape");
await page.keyboard.press("Control+k");
await page.getByLabel("Search portfolio commands").fill("aura");
await page.keyboard.press("ArrowDown");
await page.keyboard.press("Enter");
await expect(
  page.getByRole("heading", { name: "AURA", exact: true }),
).toBeVisible();
await page
  .getByRole("button", { name: "Open command palette", exact: true })
  .click();
await page.getByLabel("Search portfolio commands").fill("resume");
const download = page.waitForEvent("download");
await page.keyboard.press("Enter");
assert.equal((await download).suggestedFilename(), "resume.pdf");
await page.goto("http://127.0.0.1:4173/");
await page
  .getByRole("button", { name: "Switch to dark mode", exact: true })
  .click();
await page.reload();
assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
await page
  .getByRole("button", { name: "Copy email address", exact: true })
  .click();
assert.equal(
  await page.evaluate(() => navigator.clipboard.readText()),
  content.profile.email,
);
await page.getByRole("button", { name: "Send a message", exact: true }).click();
await expect(page.getByLabel("Your name", { exact: true })).toBeFocused();
await page.getByLabel("Your name", { exact: true }).fill("Test Visitor");
await page.getByLabel("Your email", { exact: true }).fill("test@example.com");
await page
  .getByLabel("What are you thinking?")
  .fill("Testing the local contact form.");
await page.getByRole("button", { name: "Send a message", exact: true }).click();
await expect(page.locator(".form-feedback")).toContainText("isn’t connected");
await page.getByRole("button", { name: "Languages", exact: true }).click();
await expect(page.locator(".skill-card")).toHaveCount(1);
await page.getByRole("button", { name: "Python", exact: true }).click();
await expect(page.locator(".tool-selection")).toContainText("TrustNet-AI");
await page.getByRole("button", { name: "All tools", exact: true }).click();
await expect(page.locator(".skill-card")).toHaveCount(5);
await page.setViewportSize({ width: 375, height: 812 });
await page
  .getByRole("button", { name: "Open navigation", exact: true })
  .click();
await page
  .getByRole("navigation", { name: "Main navigation" })
  .getByRole("button", { name: "Work", exact: true })
  .click();
await expect(page.locator(".links")).not.toHaveClass(/open/);
await page.goto("http://127.0.0.1:4173/missing");
await expect(
  page.getByRole("heading", {
    name: "This route doesn’t connect.",
    exact: true,
  }),
).toBeVisible();
await page
  .getByRole("link", { name: "Back to Alok’s portfolio", exact: true })
  .click();
await page.setViewportSize({ width: 1440, height: 1000 });
await page.emulateMedia({ reducedMotion: "no-preference" });
await page.goto("http://127.0.0.1:4173/");
await page.waitForFunction(
  () => document.querySelector("canvas")?.dataset.sceneReady === "true",
);
await page.waitForFunction(
  () => document.querySelector("canvas")?.dataset.animationActive === "true",
);
await page
  .getByRole("button", {
    name: "Say hello to Patch, the workshop cat",
    exact: true,
  })
  .click();
await expect(page.locator(".desk-stage .patch-button")).toHaveClass(
  /patch-paw/,
);
const profile = () =>
  page.evaluate(() => ({
    dom: document.querySelectorAll("*").length,
    canvases: document.querySelectorAll("canvas").length,
    triggers: Number(document.documentElement.dataset.motionTriggers || 0),
  }));
const baseline = await profile(),
  cycles = [];
for (let i = 0; i < 3; i++) {
  await page
    .getByRole("link", { name: "View TrustNet-AI project", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "TrustNet-AI", exact: true }),
  ).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
  await page
    .getByRole("link", { name: "Project library", exact: true })
    .click();
  await page.getByRole("button", { name: "Back to top", exact: true }).click();
  await page.waitForFunction(() => scrollY < 5);
  await page.waitForFunction(
    () => document.querySelector("canvas")?.dataset.animationActive === "true",
  );
  const sample = await profile();
  assert.equal(sample.canvases, 1);
  assert.ok(Math.abs(sample.dom - baseline.dom) < 5, "DOM accumulation");
  assert.ok(sample.triggers <= baseline.triggers, "Motion accumulation");
  cycles.push(sample);
}
await page.locator("#contact").scrollIntoViewIfNeeded();
await page.waitForFunction(
  () => document.querySelector("canvas")?.dataset.animationActive === "false",
);
await page.getByRole("button", { name: "Back to top", exact: true }).click();
await page.waitForFunction(() => scrollY < 5);
await page.evaluate(() => {
  Object.defineProperty(document, "hidden", {
    value: true,
    configurable: true,
  });
  document.dispatchEvent(new Event("visibilitychange"));
});
assert.equal(
  await page.locator("canvas").getAttribute("data-animation-active"),
  "false",
);
await page.evaluate(() => {
  delete document.hidden;
  document.dispatchEvent(new Event("visibilitychange"));
});
await page.waitForFunction(
  () => document.querySelector("canvas")?.dataset.animationActive === "true",
);
await page.evaluate(() => {
  window.__gl = document
    .querySelector("canvas")
    .getContext("webgl2")
    .getExtension("WEBGL_lose_context");
  window.__gl.loseContext();
});
await page.waitForFunction(
  () => document.querySelector("canvas")?.style.opacity === "0",
);
await page.evaluate(() => window.__gl.restoreContext());
await page.waitForFunction(
  () => document.querySelector("canvas")?.style.opacity === "1",
);
await page.emulateMedia({ reducedMotion: "reduce" });
await expect(page.locator("canvas")).toHaveCount(0);
await expect(page.locator(".desk-stage .patch-button")).toHaveClass(
  /patch-static/,
);
assert.deepEqual(
  errors.filter((e) => !e.includes("CONTEXT_LOST_WEBGL")),
  [],
  "Browser console/page errors",
);
fs.writeFileSync(
  "test-results/after-hours/verification.json",
  JSON.stringify(
    {
      checks,
      baseline,
      cycles,
      errors,
      form: "validation and unconfigured fallback; service states tested separately",
      heap: "Not measured",
    },
    null,
    2,
  ),
);
await context.close();
const noJs = await browser.newContext({ javaScriptEnabled: false });
const noPage = await noJs.newPage();
await noPage.goto("http://127.0.0.1:4173/");
assert.match(await noPage.locator("body").innerText(), /Alok Sahoo/);
await noJs.close();
await browser.close();
console.log(
  "PASS: nine widths, both themes, axe, keyboard, navigation, filters, toolkit, form fallback, downloads, clipboard, 3D lifecycle/context recovery, Patch and reduced motion.",
);
