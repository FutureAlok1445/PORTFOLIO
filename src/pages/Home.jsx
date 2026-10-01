import Hero, { About } from "../components/Hero";
import { Skills, Experience } from "../components/Credibility";
import Projects from "../components/Projects";
import { Credentials, Contact, Footer } from "../components/Closing";
import { lazy, Suspense } from "react";
import { useMotion } from "../components/useMotion";
import { useOutletContext } from "react-router-dom";
const Field = lazy(() => import("../components/Field"));
export default function Home() {
  const { copyEmail, notify } = useOutletContext();
  useMotion("home");
  return (
    <>
      <main id="main">
        <div className="hero-field">
          <Suspense fallback={null}>
            <Field />
          </Suspense>
          <Hero />
        </div>
        <About />
        <Projects />
        <Skills />
        <div className="journey-band">
          <Experience />
        </div>
        <Credentials />
        <Contact copyEmail={copyEmail} notify={notify} />
      </main>
      <Footer notify={notify} />
    </>
  );
}
