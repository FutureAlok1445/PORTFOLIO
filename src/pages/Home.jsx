import Hero, { About } from '../components/Hero';
import { Skills, Experience } from '../components/Credibility';
import Projects from '../components/Projects';
import { Credentials, Contact, Footer } from '../components/Closing';
export default function Home({ copyEmail, notify }) { return <><main id="main"><Hero/><About/><Projects/><Skills/><Experience/><Credentials/><Contact copyEmail={copyEmail} notify={notify}/></main><Footer notify={notify}/></>; }
