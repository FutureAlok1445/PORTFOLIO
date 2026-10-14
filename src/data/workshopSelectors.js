import { content } from "./content.js";
// Presentation adapters only: source facts remain in content.js.
export function credentialRecords(source = content) {
  return [
    ...(source.achievements || []).map((record) => ({
      ...record,
      kind: "milestone",
      date: record.year || record.date,
      text: record.result || record.description || "",
    })),
    ...(source.certificates || []).map((record) => ({
      ...record,
      kind: "certificate",
      text: record.description || "",
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
