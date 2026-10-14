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
} from "lucide-react";
import { content } from "../data/content";
import { Magnetic } from "./Motion";
import PatchCat from "./after-hours/PatchCat";
import { useExperience } from "./after-hours/ExperienceContext";
export function Credentials() {
  const icons = { flag: Flag, trophy: Trophy, medal: Medal };
  return (
    <section className="credentials container" id="credentials">
      <h2 className="serif reveal-title">
        {content.workshop.credentialsTitle}
      </h2>
      <div className="honors">
        {content.achievements.map((a) => {
          const Icon = icons[a.icon] || Medal;
          return (
            <article key={a.title}>
              <span>{a.year}</span>
              <h3>{a.title}</h3>
              <p>{a.result}</p>
              <small>{a.issuer}</small>
              <Icon size={22} />
            </article>
          );
        })}
      </div>
      <div className="certificate-heading">
        <h3>Courses & certificates</h3>
        <p>A growing set of foundations.</p>
      </div>
      <div className="certificates">
        {content.certificates.map((c) => {
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
              key={c.title}
            >
              {Body}
            </a>
          ) : (
            <article className="certificate" key={c.title}>
              {Body}
            </article>
          );
        })}
      </div>
    </section>
  );
}
export function Contact({ copyEmail, notify, inObject=false }) {
  const experience = useExperience();
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");
  const [fields, setFields] = useState({});
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef();
  const abort = useRef();
  useEffect(
    () => () => {
      abort.current?.abort();
      clearTimeout(copyTimer.current);
    },
    [],
  );
  async function copy() {
    if (await copyEmail()) {
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1800);
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
            <h2 className="contact-title reveal-title">
              {content.workshop.contactTitle}
            </h2>
            <p className="contact-intro">{content.workshop.contactIntro}</p>
            <div className="email-row">
              <a href={"mailto:" + content.profile.email}>
                {content.profile.email}
              </a>
              <Magnetic
                aria-label="Copy email address"
                data-tooltip={copied ? "Copied" : "Copy email address"}
                onClick={copy}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </Magnetic>
            </div>
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
            <label htmlFor="name">Your name</label>
            <input
              id="name"
              aria-invalid={fields.name ? true : undefined}
              aria-describedby={fields.name ? "name-error" : undefined}
              name="name"
              autoComplete="name"
              placeholder="How should I call you?"
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
              placeholder="you@company.com"
              required
              maxLength={254}
            />
            {fields.email && (
              <p className="field-error" id="email-error">
                {fields.email}
              </p>
            )}
            <label htmlFor="message">What are you thinking?</label>
            <textarea
              id="message"
              aria-invalid={fields.message ? true : undefined}
              aria-describedby={fields.message ? "message-error" : undefined}
              name="message"
              placeholder="A project, a role, or an interesting idea…"
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
              Prefer your own inbox? The email link opens it directly.
            </small>
          </form>
        </div>
      </div>
    </section>
  );
}
export { default as Footer } from "./Footer";
