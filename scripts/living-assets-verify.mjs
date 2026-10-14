import fs from "node:fs";
import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
const files = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = dir + "/" + e.name;
    e.isDirectory() ? walk(p) : files.push(p);
  }
}
walk("public/images/after-hours");
const browser = await chromium.launch({ channel: "chromium" }),
  context = await browser.newContext(),
  result = [];
for (const file of files) {
  const response = await context.request.get(
      "http://127.0.0.1:4180/" + file.slice(7),
    ),
    body = await response.body();
  assert.equal(response.status(), 200, file);
  assert.equal(
    body.equals(fs.readFileSync(file)),
    true,
    "Production asset bytes " + file,
  );
  result.push({ file, status: response.status(), bytes: body.length });
}
fs.writeFileSync(
  "test-results/living-workshop/assets-http.json",
  JSON.stringify(result, null, 2),
);
await browser.close();
console.log(
  "PASS: " +
    result.length +
    " assets and metadata served with exact source bytes.",
);

