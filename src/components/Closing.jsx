import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Copy,
  Code2,
  UserRound,
  Send,
  Check,
  Flag,
  Trophy,
  Medal,
  Search,
  Briefcase,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { content } from "../data/content";
import { Magnetic } from "./Motion";
import PatchCat from "./after-hours/PatchCat";
import { useExperience } from "./after-hours/ExperienceContext";
import { playKeyClick } from "../utils/sound";

export function Credentials() {
  const icons = { flag: Flag, trophy: Trophy, medal: Medal };
  const [certQuery, setCertQuery] = useState("");
  const validAchievements = (content.achievements || []).filter(
    (a) => a.title && !a.title.startsWith("TODO"),
  );
  const validCertificates = (content.certificates || []).filter(
    (c) =>
      c.title &&
      !c.title.startsWith("TODO") &&
      (c.title + " " + c.issuer + " " + (c.date || ""))
        .toLowerCase()
        .includes(certQuery.trim().toLowerCase()),
  );
  return (
    <section className="credentials container" id="credentials">
      <div className="section-heading">
        <div>
          <span className="mono-telemetry">
            05 // VERIFIED HONORS ({validAchievements.length} WINS · {content.certificates.length} CERTIFICATES)
          </span>
          <h2 className="serif reveal-title">
            {content.workshop.credentialsTitle}
          </h2>
        </div>
      </div>
      <div className="honors bento-honors">
        {validAchievements.map((a, idx) => {
          const Icon = icons[a.icon] || Medal;
          const isSpotlight = a.spotlight || idx === 0;
          return (
            <article
              key={a.title + "-" + idx}
              className={isSpotlight ? "bento-spotlight" : ""}
            >
              <div className="honor-top-row">
                <span className="honor-year">{a.year || a.date}</span>
                {isSpotlight && (
                  <span className="spotlight-badge">★ National / Podium Spotlight</span>
                )}
              </div>
              <h3>{a.title}</h3>
              <p className="honor-result">{a.result}</p>
              <small>{a.issuer}</small>
              <Icon size={22} />
            </article>
          );
        })}
      </div>
      <div className="certificate-heading">
        <div>
          <h3>Courses, Virtual Internships &amp; Certificates</h3>
          <p>A growing ledger of foundations—search by issuer, domain, or year.</p>
        </div>
        <label className="cert-inline-search">
          <Search size={15} />
          <span className="sr-only">Search certificates</span>
          <input
            type="search"
            value={certQuery}
            onChange={(e) => setCertQuery(e.target.value)}
            placeholder="Filter certificates (e.g. Oracle, AWS, NPTEL)..."
          />
        </label>
      </div>
      <div className="certificates">
        {validCertificates.map((c, idx) => {
          const Body = (
            <>
              <span className="certificate-date">{c.date}</span>
              <h4>{c.title}</h4>
              <p>{c.issuer}</p>
              {c.url && (
                <span className="certificate-link">
                  View credential <ArrowUpRight size={16} />
                </span>
              )}
            </>
          );
          return c.url ? (
            <a
              className="certificate"
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              key={c.title + "-" + idx}
              onClick={() => playKeyClick(1.05)}
            >
              {Body}
            </a>
          ) : (
            <article className="certificate" key={c.title + "-" + idx}>
              {Body}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function Contact({ copyEmail, notify, inObject = false }) {
  const experience = useExperience();
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");
  const [fields, setFields] = useState({});
  const [copied, setCopied] = useState(false);
  const [audience, setAudience] = useState("recruiter");
  const copyTimer = useRef();
  const abort = useRef();
  const textareaRef = useRef(null);

  const audienceConfig = content.workshop.audienceOptions || {};
  const currentAudience = audienceConfig[audience] || {
    id: audience,
    label: "Visitor",
    tagline: "Leave a note on the desk.",
    namePlaceholder: "How should I call you?",
    emailPlaceholder: "you@example.com",
    messagePlaceholder: "What are you working on or what sparked an idea?",
    prompts: [],
  };

  useEffect(
    () => () => {
      abort.current?.abort();
      clearTimeout(copyTimer.current);
    },
    [],
  );

  async function copy() {
    playKeyClick(1.15);
    if (await copyEmail()) {
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1800);
    }
  }

  function handleAudienceChange(nextAudience) {
    playKeyClick(1.05);
    setAudience(nextAudience);
  }

  function insertPrompt(promptText) {
    playKeyClick(1.08);
    const textarea = textareaRef.current || document.getElementById("message");
    if (textarea) {
      textarea.value = promptText + " — ";
      textarea.focus();
      if (fields.message) {
        setFields((prev) => ({ ...prev, message: undefined }));
      }
    }
  }

  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const invalid = {};
    if (!name) invalid.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      invalid.email = "Enter a valid email address.";
    if (message.length < 10) invalid.message = "Write at least 10 characters.";
    setFields(invalid);
    if (Object.keys(invalid).length) {
      setError(
        "Add your name, a valid email, and a message of at least 10 characters.",
      );
      setState("invalid");
      form.elements[Object.keys(invalid)[0]].focus();
      return;
    }
    const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;
    if (!endpoint) {
      setState("unconfigured");
      setError(
        "The form isn’t connected yet. Email me directly using the link above.",
      );
      return;
    }
    setState("loading");
    setError("");
    abort.current = new AbortController();
    let timedOut = false;
    const timeout = setTimeout(() => {
      timedOut = true;
      abort.current?.abort();
    }, 15000);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
        signal: abort.current.signal,
      });
      if (!response.ok) throw new Error("service");
      setState("success");
      form.reset();
      notify("Message sent. Thanks for reaching out.");
    } catch (err) {
      if (err.name !== "AbortError" || timedOut) {
        setState("error");
        setError("Your message didn’t send. Try again, or email me directly.");
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  return (
    <section id="contact" className="contact-band">
      <div className="container">
        <div className="contact-grid">
          <div>
            <span className="mono-telemetry">06 // DIRECT DISPATCH</span>
            <h2 className="contact-title reveal-title">
              {content.workshop.contactTitle}
            </h2>
            <p className="contact-intro">{content.workshop.contactIntro}</p>
            <div className="email-row">
              <button
                type="button"
                className="email-pill-button"
                onClick={copy}
                title="Click to copy email address directly"
                aria-label="Copy Alok's email address"
              >
                <span className="email-text">{content.profile.email}</span>
                <span className="email-copy-tag">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? "Copied" : "Copy email"}</span>
                </span>
              </button>
            </div>
            <p className="email-hint-note">
              Direct copy to clipboard · No email client / Outlook pop-up
            </p>
            <div className="social-links">
              {content.socials.map((s) => (
                <Magnetic
                  as="a"
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {s.label === "GitHub" ? (
                    <Code2 size={19} />
                  ) : (
                    <UserRound size={19} />
                  )}{" "}
                  {s.label}
                  <ArrowUpRight size={15} />
                </Magnetic>
              ))}
            </div>
            {!experience?.live && !inObject && (
              <PatchCat
                variant="sleep"
                interactive
                label="Wake Patch"
                chapter="contact"
                ambient={experience?.ambient}
              />
            )}
          </div>
          <form
            noValidate
            onSubmit={submit}
            className="contact-form"
            onInput={(e) => {
              const field = e.target.name;
              if (fields[field])
                setFields((previous) => ({ ...previous, [field]: undefined }));
              if (state === "success") setState("idle");
            }}
          >
            <p>{content.workshop.contactFormTitle}</p>
            
            <div className="desk-audience-selector" role="tablist" aria-label="Select message perspective">
              <button
                type="button"
                role="tab"
                id="audience-tab-recruiter"
                aria-selected={audience === "recruiter"}
                aria-controls="audience-panel"
                className={"audience-tab " + (audience === "recruiter" ? "active" : "")}
                onClick={() => handleAudienceChange("recruiter")}
              >
                <Briefcase size={15} />
                <span>Recruiter / Hiring</span>
              </button>
              <button
                type="button"
                role="tab"
                id="audience-tab-student"
                aria-selected={audience === "student"}
                aria-controls="audience-panel"
                className={"audience-tab " + (audience === "student" ? "active" : "")}
                onClick={() => handleAudienceChange("student")}
              >
                <GraduationCap size={15} />
                <span>Student / Peer</span>
              </button>
              <button
                type="button"
                role="tab"
                id="audience-tab-collab"
                aria-selected={audience === "collaborator"}
                aria-controls="audience-panel"
                className={"audience-tab " + (audience === "collaborator" ? "active" : "")}
                onClick={() => handleAudienceChange("collaborator")}
              >
                <Sparkles size={15} />
                <span>Collaborator</span>
              </button>
            </div>

            <div id="audience-panel" className="audience-context" role="tabpanel" aria-labelledby={"audience-tab-" + audience}>
              <p className="audience-tagline">{currentAudience.tagline}</p>
              {currentAudience.prompts && currentAudience.prompts.length > 0 && (
                <div className="prompt-chips" role="group" aria-label="Suggested discussion starters">
                  <span className="prompt-chips-label">Quick topics:</span>
                  <div className="prompt-chips-list">
                    {currentAudience.prompts.map((p) => (
                      <button
                        key={p}
                        type="button"
                        className="prompt-chip"
                        onClick={() => insertPrompt(p)}
                        title={"Click to start message with: " + p}
                      >
                        + {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <input type="hidden" name="audience_track" value={currentAudience.label} />

            <label htmlFor="name">Your name</label>
            <input
              id="name"
              aria-invalid={fields.name ? true : undefined}
              aria-describedby={fields.name ? "name-error" : undefined}
              name="name"
              autoComplete="name"
              placeholder={currentAudience.namePlaceholder}
              required
              maxLength={100}
            />
            {fields.name && (
              <p className="field-error" id="name-error">
                {fields.name}
              </p>
            )}
            <label htmlFor="email">Your email</label>
            <input
              id="email"
              aria-invalid={fields.email ? true : undefined}
              aria-describedby={fields.email ? "email-error" : undefined}
              name="email"
              type="email"
              autoComplete="email"
              placeholder={currentAudience.emailPlaceholder}
              required
              maxLength={254}
            />
            {fields.email && (
              <p className="field-error" id="email-error">
                {fields.email}
              </p>
            )}
            <label htmlFor="message">
              {audience === "recruiter"
                ? "Role details & team context"
                : audience === "student"
                  ? "Your question or learning topic"
                  : "What are you thinking?"}
            </label>
            <textarea
              ref={textareaRef}
              id="message"
              aria-invalid={fields.message ? true : undefined}
              aria-describedby={fields.message ? "message-error" : undefined}
              name="message"
              placeholder={currentAudience.messagePlaceholder}
              required
              minLength={10}
              maxLength={5000}
              rows={4}
            />
            {fields.message && (
              <p className="field-error" id="message-error">
                {fields.message}
              </p>
            )}
            <input
              name="_gotcha"
              className="honeypot"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <Magnetic
              className="button send-button"
              disabled={state === "loading"}
              type="submit"
            >
              {state === "loading"
                ? "Sending…"
                : state === "success"
                  ? "Message sent"
                  : "Send a message"}
              {state === "success" ? <Check size={17} /> : <Send size={17} />}
            </Magnetic>
            <div className="form-feedback" aria-live="polite">
              {state === "success" ? (
                <p>Message sent. Thanks for reaching out.</p>
              ) : (
                error && <p className="form-error">{error}</p>
              )}
            </div>
            <small>
              Direct dispatch straight to Alok's desk. No client app redirect needed.
            </small>
          </form>
        </div>
      </div>
    </section>
  );
}
export { default as Footer } from "./Footer";
