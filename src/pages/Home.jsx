import { About } from "../components/Hero";
import WorkshopHero from "../components/after-hours/WorkshopHero";
import { Skills, Experience } from "../components/Credibility";
import Projects from "../components/Projects";
import { Credentials, Contact, Footer } from "../components/Closing";
import { useMotion } from "../components/useMotion";
import { useOutletContext } from "react-router-dom";
export default function Home() {
  const { copyEmail, notify } = useOutletContext();
  useMotion("home");
  return (
    <>
      <main id="main">
        <WorkshopHero />
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
