import { useState } from 'react';
import { content } from '../data/content';
import ProjectArtifact from './after-hours/ProjectArtifact';
export default function Projects(){
  const [filter,setFilter]=useState('All');
  const filters=['All',...new Set(content.projects.flatMap(p=>p.filters||[]))];
  const projects=content.projects.filter(p=>filter==='All'||p.filters?.includes(filter));
  function keys(e){
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key)||e.target.closest('.artifact-quick'))return;
    const links=[...e.currentTarget.querySelectorAll('.artifact-link')];
    const current=links.indexOf(document.activeElement);if(current<0)return;
    e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?links.length-1:Math.max(0,Math.min(links.length-1,current+(e.key==='ArrowRight'?1:-1)));links[next].focus();
  }
  return <section id="work" className="work container project-library">
    <div className="section-heading library-heading"><h2 className="serif">{content.workshop.workTitle}</h2><p>{content.workshop.workIntro}</p></div>
    <div className="library-tools"><div className="filters" aria-label="Filter projects by domain">{filters.map(f=><button key={f} aria-pressed={filter===f} className={filter===f?'selected':''} onClick={()=>setFilter(f)}>{f}</button>)}</div><span role="status" className="library-count">{projects.length} {projects.length===1?'project':'projects'}</span></div>
    <div className="artifact-shelf" onKeyDown={keys} aria-label="Project case-study collection">{projects.map(p=><ProjectArtifact key={p.slug} project={p}/>)}</div>
  </section>;
}
