import fs from "node:fs";
import { loadEnv } from "vite";
import { content } from "../src/data/content.js";
const env = loadEnv("production", process.cwd(), "");
const escape = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll('"', "&quot;");
let html = fs.readFileSync("dist/index.html", "utf8");
html = html.replace(
  /<noscript[\s\S]*?<\/noscript\s*>/,
  "<noscript><main><h1>" +
    escape(content.profile.name) +
    " — " +
    escape(content.profile.title) +
    "</h1><p>" +
    escape(content.profile.about) +
    '</p><a href="mailto:' +
    escape(content.profile.email) +
    '">Email Alok</a> <a href="' +
    escape(content.profile.resume) +
    '" download>Download resume</a><h2>Project files</h2>' +
    content.projects
      .map(
        (project) =>
          "<section><h3>" +
          escape(project.title) +
          "</h3><p>" +
          escape(project.status) +
          "</p><p>" +
          escape(project.summary) +
          "</p>" +
          (project.repo
            ? '<a href="' + escape(project.repo) + '">Source repository</a>'
            : "") +
          (project.live
            ? ' <a href="' + escape(project.live) + '">Live project</a>'
            : "") +
          "</section>",
      )
      .join("") +
    "</main></noscript>",
);
fs.writeFileSync("dist/index.html", html);
const origin =
  env.VITE_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? "https://" + process.env.VERCEL_PROJECT_PRODUCTION_URL
    : process.env.URL);
const shareBase = origin ? origin.replace(/\/$/, "") : "";
for (const project of content.projects) {
  let page = html.replace(
    /<title>[\s\S]*?<\/title>/,
    "<title>" + escape(project.title) + " — Alok Sahoo</title>",
  );
  for (const [attribute, key, value] of [
    ["name", "description", project.summary],
    ["property", "og:title", project.title + " — Alok Sahoo"],
    ["property", "og:description", project.summary],
    [
      "property",
      "og:image",
      shareBase + "/images/after-hours/meta/og-" + project.slug + ".png",
    ],
  ]) {
    page = page.replace(
      new RegExp("<meta\\s+" + attribute + '="' + key + '"[\\s\\S]*?/>'),
      "<meta " + attribute + '="' + key + '" content="' + escape(value) + '"/>',
    );
  }
  if (shareBase)
    page = page.replace(
      "</head>",
      '<link rel="canonical" href="' +
        shareBase +
        "/projects/" +
        project.slug +
        '"/><meta property="og:url" content="' +
        shareBase +
        "/projects/" +
        project.slug +
        '"/></head>',
    );
  fs.mkdirSync("dist/projects/" + project.slug, { recursive: true });
  fs.writeFileSync("dist/projects/" + project.slug + "/index.html", page);
  fs.writeFileSync("dist/projects/" + project.slug + ".html", page);
}
const hosting = JSON.parse(fs.readFileSync("vercel.json", "utf8"));
const caseRewrites = content.projects.map((project) => ({
  source: "/projects/" + project.slug,
  destination: "/projects/" + project.slug + ".html",
}));
const generatedSources = new Set(caseRewrites.map((rule) => rule.source));
hosting.rewrites = [
  ...caseRewrites,
  ...(hosting.rewrites || []).filter(
    (rule) => !generatedSources.has(rule.source),
  ),
];
fs.writeFileSync("vercel.json", JSON.stringify(hosting, null, 2) + "\n");
fs.writeFileSync(
  "dist/_redirects",
  caseRewrites
    .map((rule) => rule.source + " " + rule.destination + " 200")
    .join("\n") +
    "\n" +
    fs.readFileSync("public/_redirects", "utf8"),
);
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
const paths = [
  "/",
  "/projects",
  ...content.projects.map((p) => "/projects/" + p.slug),
];
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
html = html.replace(
  'content="/images/after-hours/meta/og-home.png"',
  'content="' + base + '/images/after-hours/meta/og-home.png"',
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
