import fs from "node:fs";
import { loadEnv } from "vite";
import { content } from "../src/data/content.js";
const env = loadEnv("production", process.cwd(), "");
const origin =
  env.VITE_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? "https://" + process.env.VERCEL_PROJECT_PRODUCTION_URL
    : process.env.URL);
if (!origin) {
  console.log(
    "SEO: set VITE_SITE_URL to generate absolute sitemap and social metadata.",
  );
  process.exit(0);
}
const url = new URL(origin);
if (!["http:", "https:"].includes(url.protocol))
  throw new Error("VITE_SITE_URL must be an HTTP(S) origin");
const base = url.origin;
const paths = ["/", ...content.projects.map((p) => "/projects/" + p.slug)];
fs.writeFileSync(
  "dist/sitemap.xml",
  '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    paths.map((p) => "<url><loc>" + base + p + "</loc></url>").join("") +
    "</urlset>",
);
fs.writeFileSync(
  "dist/robots.txt",
  "User-agent: *\nAllow: /\nSitemap: " + base + "/sitemap.xml\n",
);
let html = fs.readFileSync("dist/index.html", "utf8");
html = html.replace(
  'content="/images/after-hours/brand/og-home.webp"',
  'content="' + base + '/images/after-hours/brand/og-home.webp"',
);
html = html.replace(
  "</head>",
  '<link rel="canonical" href="' +
    base +
    '/"/><meta property="og:url" content="' +
    base +
    '/"/></head>',
);
fs.writeFileSync("dist/index.html", html);
console.log("SEO generated for " + base);
