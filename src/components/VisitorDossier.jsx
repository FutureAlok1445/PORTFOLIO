import { Briefcase, GraduationCap, ArrowUpRight, Download, Terminal, Sparkles, BookOpen } from "lucide-react";
import { content } from "../data/content";
import { playKeyClick } from "../utils/sound";

export default function VisitorDossier() {
  const p = content.profile;

  function scrollToWritingDesk(targetAudience) {
    playKeyClick(1.08);
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        const tab = document.getElementById("audience-tab-" + targetAudience);
        if (tab) tab.click();
        const textarea = document.getElementById("message");
        if (textarea) textarea.focus();
      }, 400);
    }
  }

  function scrollToSection(id) {
    playKeyClick(1.05);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="visitor-dossier container" aria-label="Visitor perspective guide">
      <div className="section-heading">
        <div>
          <span className="mono-telemetry">02 // VISITOR DISPATCH &amp; ROADMAP</span>
          <h2 className="serif reveal-title">
            Built for recruiters evaluating systems. Open for students learning them.
          </h2>
          <p className="dossier-lead">
            Whether you are reviewing technical qualifications for an engineering role,
            or exploring blueprints to see how modern architectures hold together, here is your direct roadmap.
          </p>
        </div>
      </div>

      <div className="dossier-grid">
        {/* Recruiter & Tech Lead Track */}
        <article className="dossier-card card-recruiter">
          <div className="dossier-header">
            <div className="dossier-badge-row">
              <span className="dossier-icon-box">
                <Briefcase size={20} />
              </span>
              <span className="dossier-chip">For Recruiters &amp; Tech Leads</span>
            </div>
            <h3>Looking for an engineer who builds transparent, production-minded systems?</h3>
          </div>

          <p className="dossier-summary">
            A verified ledger of engineering capabilities: robust backend services, scalable data schemas,
            and complete architectural ownership.
          </p>

          <ul className="dossier-list">
            <li>
              <Terminal size={16} />
              <div>
                <strong>Backend &amp; Distributed Architecture</strong>
                <span>Node.js, Express, Python, Java, SQL, MongoDB, and shared-process consensus (Raft).</span>
              </div>
            </li>
            <li>
              <Sparkles size={16} />
              <div>
                <strong>SIH 2025 National Grand Finale Finalist</strong>
                <span>Proven ability to deliver under strict engineering pressure in national arenas.</span>
              </div>
            </li>
            <li>
              <BookOpen size={16} />
              <div>
                <strong>Zero Placeholders · Full Transparency</strong>
                <span>Every project includes documented boundaries, decisions, and verifiable code evidence.</span>
              </div>
            </li>
          </ul>

          <div className="dossier-actions">
            <a
              href={p.resume}
              download
              className="button dossier-primary"
              onClick={() => playKeyClick(1.1)}
            >
              Take resume (PDF) <Download size={16} />
            </a>
            <button
              type="button"
              className="dossier-secondary"
              onClick={() => scrollToWritingDesk("recruiter")}
            >
              Leave recruiter note <ArrowUpRight size={16} />
            </button>
            <button
              type="button"
              className="dossier-tertiary"
              onClick={() => scrollToSection("work")}
            >
              Inspect 12 builds
            </button>
          </div>
        </article>

        {/* Student & Peer Track */}
        <article className="dossier-card card-student">
          <div className="dossier-header">
            <div className="dossier-badge-row">
              <span className="dossier-icon-box student-icon">
                <GraduationCap size={20} />
              </span>
              <span className="dossier-chip student-chip">For Students &amp; Developers</span>
            </div>
            <h3>Curious how complex systems and hackathon winners are designed?</h3>
          </div>

          <p className="dossier-summary">
            No gatekeeping. Full source walkthroughs, system trade-offs, and lessons from
            building 12 distinct projects throughout engineering college.
          </p>

          <ul className="dossier-list">
            <li>
              <Terminal size={16} />
              <div>
                <strong>System Blueprints &amp; Architecture</strong>
                <span>Explore real solutions for forensics (Aura), consensus (Cosmeon FS), and web apps.</span>
              </div>
            </li>
            <li>
              <Sparkles size={16} />
              <div>
                <strong>Smart India Hackathon Playbook</strong>
                <span>Practical advice on project scoping, high-speed execution, and presentation polish.</span>
              </div>
            </li>
            <li>
              <BookOpen size={16} />
              <div>
                <strong>Ask Questions Directly</strong>
                <span>Don’t hesitate to reach out. The Writing Desk below connects straight to Alok.</span>
              </div>
            </li>
          </ul>

          <div className="dossier-actions">
            <button
              type="button"
              className="button dossier-primary student-btn"
              onClick={() => scrollToWritingDesk("student")}
            >
              Ask Alok a question <ArrowUpRight size={16} />
            </button>
            <button
              type="button"
              className="dossier-secondary"
              onClick={() => scrollToSection("experience")}
            >
              View journey &amp; SIH log
            </button>
            <button
              type="button"
              className="dossier-tertiary"
              onClick={() => scrollToSection("skills")}
            >
              Workbench toolkit
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
