import { chromium } from "@playwright/test";
const b = await chromium.launch({ channel: "chromium" }),
  p = await b.newPage({ viewport: { width: 320, height: 900 } });
for (const id of [
  "monitor",
  "notebook",
  "project",
  "toolkit",
  "journey",
  "credentials",
  "contact",
]) {
  await p.goto("http://127.0.0.1:4180/?object=" + id, {
    waitUntil: "networkidle",
  });
  const sizes = await p.locator(".object-surface-content").evaluate((el) => ({
    width: el.clientWidth,
    scroll: el.scrollWidth,
    overs: [...el.querySelectorAll("*")]
      .filter(
        (n) =>
          n.getBoundingClientRect().right >
          el.getBoundingClientRect().right + 2,
      )
      .slice(0, 8)
      .map((n) => ({
        class: n.className,
        tag: n.tagName,
        text: n.textContent.slice(0, 60),
        width: n.getBoundingClientRect().width,
      })),
  }));
  console.log(id, JSON.stringify(sizes));
  await p.screenshot({
    path: "test-results/world-interface/round1/small-" + id + ".png",
  });
}
await b.close();
