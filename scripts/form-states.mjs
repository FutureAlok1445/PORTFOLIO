import { chromium, expect } from "@playwright/test";
const browser = await chromium.launch({ channel: "chromium" });
const page = await browser.newPage({ reducedMotion: "reduce" });
await page.goto("http://127.0.0.1:4175/");
async function fill(name = "Test Visitor") {
  await page.getByLabel("Your name", { exact: true }).fill(name);
  await page.getByLabel("Your email", { exact: true }).fill("test@example.com");
  await page
    .getByLabel("What are you thinking?")
    .fill("A simulated contact form test.");
}
await fill("   ");
await page.getByRole("button", { name: "Send a message" }).click();
await expect(page.locator(".form-feedback")).toContainText("Add your name");
let finish;
await page.route("**/form-test", async (route) => {
  await new Promise((resolve) => {
    finish = resolve;
  });
  await route.fulfill({
    status: 200,
    contentType: "application/json",
    body: '{"ok":true}',
  });
});
await fill();
await page.getByRole("button", { name: "Send a message" }).click();
await expect(page.getByRole("button", { name: "Sending…" })).toBeDisabled();
finish();
await expect(page.locator(".form-feedback")).toContainText("Message sent.");
await expect(page.getByLabel("Your name", { exact: true })).toHaveValue("");
await page.unroute("**/form-test");
await page.route("**/form-test", (route) =>
  route.fulfill({
    status: 500,
    contentType: "application/json",
    body: '{"error":"simulated"}',
  }),
);
await fill();
await page.getByRole("button", { name: "Send a message" }).click();
await expect(page.locator(".form-feedback")).toContainText(
  "Your message didn’t send.",
);
await expect(
  page.getByRole("button", { name: "Send a message" }),
).toBeEnabled();
await browser.close();
console.log(
  "PASS: client validation, pending request, successful response, form reset, failed response and retry. All network requests mocked; no messages sent.",
);
