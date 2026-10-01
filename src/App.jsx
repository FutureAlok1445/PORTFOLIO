import { Component, Suspense, lazy, useEffect, useRef, useState } from "react";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ArrowUpRight, Command, Menu, Moon, Sun, X } from "lucide-react";
import { content } from "./data/content";
import Home from "./pages/Home";
import { useMotion } from "./components/useMotion";
import Seo from "./components/Seo";
const Project = lazy(() => import("./pages/Project"));
const NotFound = lazy(() => import("./pages/NotFound"));
class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <main className="error-page">
        <h1>Something interrupted the page.</h1>
        <p>Reload to try again, or reach me directly.</p>
        <a href="mailto:aloknsahoo@gmail.com">Email Alok</a>
        <button onClick={() => window.location.reload()}>Reload</button>
      </main>
    ) : (
      this.props.children
    );
  }
}
const sections = ["About", "Work", "Experience", "Contact"];
function NavButton({ label, active, onClick }) {
  const [display, setDisplay] = useState(label);
  const timer = useRef();
  useEffect(() => () => clearInterval(timer.current), []);
  function reset() {
    clearInterval(timer.current);
    setDisplay(label);
  }
  function scramble() {
    if (
      !matchMedia("(pointer:fine)").matches ||
      matchMedia("(prefers-reduced-motion:reduce)").matches
    )
      return;
    clearInterval(timer.current);
    let frame = 0;
    timer.current = setInterval(() => {
      frame++;
      if (frame > label.length) {
        reset();
        return;
      }
      setDisplay(
        label
          .split("")
          .map((letter, index) =>
            index < frame
              ? letter
              : "abcdefghijklmnopqrstuvwxyz"[(frame * 7 + index * 3) % 26],
          )
          .join(""),
      );
    }, 35);
  }
  return (
    <button
      className={active ? "active" : ""}
      onClick={onClick}
      onPointerEnter={scramble}
      onPointerLeave={reset}
    >
      <span aria-hidden="true">{display}</span>
      <span className="sr-only">{label}</span>
    </button>
  );
}
export default function App() {
  const [theme, setTheme] = useState(() => {
    try {
      return (
        localStorage.getItem("theme") ||
        (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      );
    } catch {
      return "light";
    }
  });
  const [menu, setMenu] = useState(false);
  const [palette, setPalette] = useState(false);
  const [toast, setToast] = useState("");
  const [active, setActive] = useState("");
  const [intro, setIntro] = useState(() => {
    try {
      return !sessionStorage.getItem("visited");
    } catch {
      return true;
    }
  });
  const location = useLocation();
  const navigate = useNavigate();
  const toastTimer = useRef();
  const dialog = useRef();
  useMotion(location.pathname);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* Optional persistence. */
    }
  }, [theme]);
  useEffect(() => {
    const t = setTimeout(() => {
      setIntro(false);
      try {
        sessionStorage.setItem("visited", "1");
      } catch {
        /* Optional persistence. */
      }
    }, 1100);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    const key = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((v) => !v);
      }
      if (e.key === "Escape") {
        setPalette(false);
        setMenu(false);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  useEffect(() => {
    if (!palette) return;
    const previous = document.activeElement;
    dialog.current.showModal();
    const d = dialog.current;
    return () => {
      d.close();
      previous?.focus();
    };
  }, [palette]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-20% 0px -55% 0px" },
    );
    document
      .querySelectorAll("main section[id]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [location.pathname]);
  useEffect(() => () => clearTimeout(toastTimer.current), []);
  function notify(message) {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3500);
  }
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(content.profile.email);
      notify("Email copied. Your move.");
    } catch {
      notify("Copy unavailable. Email: " + content.profile.email);
    }
  }
  function jump(id) {
    setPalette(false);
    setMenu(false);
    if (location.pathname !== "/") navigate("/#" + id);
    else
      document.getElementById(id)?.scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  }
  useEffect(() => {
    if (!location.hash) return;
    const t = setTimeout(
      () => document.querySelector(location.hash)?.scrollIntoView(),
      100,
    );
    return () => clearTimeout(t);
  }, [location]);
  return (
    <ErrorBoundary>
      <Seo />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {intro && (
        <div className="intro" aria-label="Welcome">
          <span>
            Alok<span className="orange">.</span>
          </span>
          <button onClick={() => setIntro(false)}>
            Skip intro <X size={16} />
          </button>
        </div>
      )}
      <header className="nav">
        <Link className="wordmark" to="/" aria-label="as. — Alok Sahoo home">
          as<span>.</span>
        </Link>
        <nav
          className={menu ? "links open" : "links"}
          aria-label="Main navigation"
        >
          {sections.map((s) => (
            <NavButton
              key={s}
              label={s}
              active={active === s.toLowerCase()}
              onClick={() => jump(s.toLowerCase())}
            />
          ))}
        </nav>
        <div className="nav-tools">
          <button
            aria-label="Open command palette"
            onClick={() => setPalette(true)}
          >
            <Command size={17} />
            <span className="key-label">K</span>
          </button>
          <button
            aria-label={
              "Switch to " + (theme === "light" ? "dark" : "light") + " mode"
            }
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
          </button>
          <a className="nav-contact" href="mailto:aloknsahoo@gmail.com">
            Let’s talk <ArrowUpRight size={17} />
          </a>
          <button
            className="mobile-menu"
            aria-label={menu ? "Close navigation" : "Open navigation"}
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
        <div className="scroll-progress" />
      </header>
      <Suspense
        fallback={
          <main id="main" className="loading-page">
            Opening the next page…
          </main>
        }
      >
        <div className="route-page" key={location.pathname}>
          <Routes>
            <Route
              path="/"
              element={<Home copyEmail={copyEmail} notify={notify} />}
            />
            <Route path="/projects/:slug" element={<Project />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Suspense>
      <dialog
        ref={dialog}
        onCancel={() => setPalette(false)}
        onClick={(e) => {
          if (e.target === dialog.current) setPalette(false);
        }}
        aria-labelledby="command-title"
      >
        <div className="palette-head">
          <h2 id="command-title">Where to?</h2>
          <button
            aria-label="Close command palette"
            onClick={() => setPalette(false)}
          >
            <X />
          </button>
        </div>
        <p>Jump, connect, or change the view.</p>
        {sections.map((s) => (
          <button
            className="command-item"
            key={s}
            onClick={() => jump(s.toLowerCase())}
          >
            Jump to {s.toLowerCase()} <ArrowUpRight size={18} />
          </button>
        ))}
        <button
          className="command-item"
          onClick={() => {
            copyEmail();
            setPalette(false);
          }}
        >
          Copy email
        </button>
        {content.socials.map((s) => (
          <a
            className="command-item"
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open {s.label}
            <ArrowUpRight size={18} />
          </a>
        ))}
        <button
          className="command-item"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          Toggle color theme
        </button>
        <small>Escape to close · Tab to navigate</small>
      </dialog>
      <div className={"toast " + (toast ? "visible" : "")} role="status">
        {toast}
      </div>
      <div className="view-cursor" aria-hidden="true">
        View <ArrowUpRight size={16} />
      </div>
    </ErrorBoundary>
  );
}
