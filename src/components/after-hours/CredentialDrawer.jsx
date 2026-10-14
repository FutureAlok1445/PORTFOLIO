import { useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { content } from "../../data/content";
import { credentialRecords } from "../../data/workshopSelectors";
export default function CredentialDrawer() {
  const records = credentialRecords(),
    [kind, setKind] = useState("all"),
    [query, setQuery] = useState(""),
    [selectedId, setSelectedId] = useState(records[0]?.id || "");
  const matches = (r, nextKind = kind, nextQuery = query) =>
    (nextKind === "all" || r.kind === nextKind) &&
    `${r.title} ${r.issuer} ${r.date}`
      .toLowerCase()
      .includes(nextQuery.toLowerCase());
  const filtered = records.filter((r) => matches(r)),
    record = filtered.find((r) => r.id === selectedId) || filtered[0];
  function changeKind(next) {
    setKind(next);
    setSelectedId(records.find((r) => matches(r, next))?.id || "");
  }
  function changeQuery(next) {
    setQuery(next);
    setSelectedId(records.find((r) => matches(r, kind, next))?.id || "");
  }
  return (
    <div className="paper-trail-drawer">
      <div className="drawer-index-tools">
        <label htmlFor="record-search">
          <Search size={16} />
          {content.workshop.interface.recordSearch}
        </label>
        <input
          id="record-search"
          type="search"
          value={query}
          onChange={(ev) => changeQuery(ev.target.value)}
          placeholder="Title, issuer or year"
        />
        <div className="drawer-dividers" aria-label="Record categories">
          {[
            ["all", "All records"],
            ["milestone", "Milestones"],
            ["certificate", "Certificates"],
          ].map(([id, label]) => (
            <button
              key={id}
              aria-pressed={kind === id}
              onClick={() => changeKind(id)}
            >
              {label}
              <span>
                {id === "all"
                  ? records.length
                  : records.filter((r) => r.kind === id).length}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="open-record-drawer">
        <nav aria-label="Credential records">
          {filtered.map((r) => (
            <button
              key={r.id}
              aria-pressed={record?.id === r.id}
              onClick={() => setSelectedId(r.id)}
            >
              <small>
                {r.date} ·{" "}
                {r.kind === "milestone" ? "Milestone" : "Certificate"}
              </small>
              {r.title}
            </button>
          ))}
        </nav>
        {record ? (
          <article className="credential-record" key={record.id}>
            <span className="file-clip" aria-hidden="true" />
            <small>{record.date}</small>
            <h3>{record.title}</h3>
            <h4>{record.issuer}</h4>
            {record.thumbnail && (
              <img
                src={record.thumbnail}
                alt={record.title + " supplied credential"}
              />
            )}{" "}
            {record.text && <p>{record.text}</p>}
            {record.url ? (
              <a href={record.url} target="_blank" rel="noopener noreferrer">
                View credential <ArrowUpRight size={16} />
              </a>
            ) : (
              <p className="record-link-note">
                A record from my resume. No public document link is supplied.
              </p>
            )}
          </article>
        ) : (
          <div className="drawer-empty" role="status">
            <p>{content.workshop.interface.recordEmpty}</p>
            <button
              onClick={() => {
                setKind("all");
                setQuery("");
              }}
            >
              Show all records
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
