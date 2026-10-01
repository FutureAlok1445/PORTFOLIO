import { Link } from 'react-router-dom';
export default function NotFound() { return <main id="main" className="error-page"><span className="error-number">404</span><h1>This route doesn’t connect.</h1><p>Let’s get you back to something that does.</p><Link className="button" to="/">Back to Alok’s portfolio</Link></main>; }
