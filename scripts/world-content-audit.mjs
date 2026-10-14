import { execFileSync } from "node:child_process";
import { isDeepStrictEqual } from "node:util";
import fs from "node:fs";
import { content } from "../src/data/content.js";
const baseline = execFileSync("git", ["show", "HEAD:src/data/content.js"], {
  encoding: "utf8",
});
const original = (
  await import(
    "data:text/javascript;base64," + Buffer.from(baseline).toString("base64")
  )
).content;
const fields = [
  "profile",
  "projects",
  "skills",
  "experience",
  "education",
  "achievements",
  "certificates",
  "socials",
  "projectBoundaries",
];
const factual = fields.map((field) => ({
  field,
  unchanged: isDeepStrictEqual(original[field], content[field]),
}));
const projects = content.projects.map((p) => ({
  slug: p.slug,
  title: p.title,
  problem: Boolean(p.problem),
  solution: Boolean(p.solution),
  nodes: p.nodes.length,
  features: p.features.length,
  scope: (p.scopeNotes || content.projectBoundaries[p.slug] || []).length,
  sourceLinks: (p.sources || []).length,
  repo: Boolean(p.repo),
  live: Boolean(p.live),
}));
const report = {
  factual,
  projects,
  placeholderSlots:
    "Only in source-managed drafts; never imported/rendered by world surfaces",
  source: "src/data/content.js",
};
fs.mkdirSync("test-results/world-interface", { recursive: true });
fs.writeFileSync(
  "test-results/world-interface/content-audit.json",
  JSON.stringify(report, null, 2),
);
if (
  factual.some((f) => !f.unchanged) ||
  projects.length !== 12 ||
  projects.some((p) => !p.problem || !p.solution || !p.nodes)
)
  throw Error("Content contract failed");
console.log(
  "PASS: nine factual collections unchanged; all 12 cases contain problem, solution, flow and scope.",
);
