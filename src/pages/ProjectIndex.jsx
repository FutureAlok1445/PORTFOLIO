import { ProjectCollection } from '../components/Projects';
import { Link } from 'react-router-dom';
export default function ProjectIndex(){return <main id="main" className="project-index-page"><div className="container"><Link className="text-link" to="/#work">← Return to the workshop</Link></div><ProjectCollection/></main>;}
