import { About } from "../components/Hero";
import WorkshopHero from "../components/after-hours/WorkshopHero";
import { Skills, Experience } from "../components/Credibility";
import Projects from "../components/Projects";
import { Credentials, Contact, Footer } from "../components/Closing";
import { useMotion } from "../components/useMotion";
import { useOutletContext } from "react-router-dom";
import WorkshopExperience from "../components/after-hours/WorkshopExperience";
import WorkshopStage from "../components/after-hours/WorkshopStage";
import ExperienceControls from "../components/after-hours/ExperienceControls";
import WorldInterface from "../components/after-hours/WorldInterface";
import { useExperience } from "../components/after-hours/ExperienceContext";
export default function Home() {
  const { copyEmail, notify } = useOutletContext();
  useMotion("home");
  return (
    <WorkshopExperience>
      <HomeView copyEmail={copyEmail} notify={notify}/>
    </WorkshopExperience>
  );
}
function HomeView({copyEmail,notify}) {
  const e=useExperience();
  return <>
      <WorkshopStage />
      <ExperienceControls />
      {e.worldMode?<WorldInterface copyEmail={copyEmail} notify={notify}/>:<>
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
      </>}
    </>;
}
