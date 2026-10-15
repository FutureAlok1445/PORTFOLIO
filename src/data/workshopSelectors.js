import { content } from "./content.js";

// Presentation adapters only: source facts remain in content.js.
export function credentialRecords(source = content) {
  return [
    ...(source.achievements || []).map((record) => ({
      ...record,
      kind: "milestone",
      date: record.year || record.date,
      text: record.result || record.description || "",
      spotlight: Boolean(record.spotlight),
    })),
    ...(source.certificates || []).map((record) => ({
      ...record,
      kind: "certificate",
      text: record.description || "",
      spotlight: Boolean(record.spotlight),
    })),
  ]
    .filter((record) => record.title && !record.title.startsWith("TODO"))
    .map((record, index) => ({
      ...record,
      id: record.id || `${record.kind}:${record.title}:${record.date || ""}`,
      order: index,
    }))
    .sort(
      (a, b) =>
        Number(String(b.date).match(/\d{4}/)?.[0] || 0) -
          Number(String(a.date).match(/\d{4}/)?.[0] || 0) || a.order - b.order,
    );
}

export function featuredProjects(source = content) {
  const valid = (source.projects || []).filter(
    (p) => p.title && p.slug && !p.title.startsWith("TODO"),
  );
  const flagged = valid.filter((p) => p.featured);
  return flagged.length > 0 ? flagged : valid.slice(0, 5);
}

export function archiveProjects(source = content) {
  const valid = (source.projects || []).filter(
    (p) => p.title && p.slug && !p.title.startsWith("TODO"),
  );
  const featuredSlugs = new Set(featuredProjects(source).map((p) => p.slug));
  return valid.filter((p) => !featuredSlugs.has(p.slug));
}

export function experienceRecords(source = content) {
  return (source.experience || []).filter(
    (item) => item.company && item.role && !item.company.startsWith("TODO"),
  );
}
