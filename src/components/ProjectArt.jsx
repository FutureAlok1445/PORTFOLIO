import { useState } from 'react';
export default function ProjectArt({project,priority=false}){
  const [failed,setFailed]=useState(false);
  const [photoFailed,setPhotoFailed]=useState(false);
  const kind=project.visual;
  const photo=kind==='agency'?project.cover.image:kind==='commerce'?project.cover.images[0]:null;
  return <div className={'project-cover-art cover-'+kind}>
    {!failed?<img className="art-illustration" src={'/images/after-hours/projects/'+project.slug+'.svg'} alt={project.title+' — conceptual '+project.category.toLowerCase()+' illustration'} width="800" height="500" loading={priority?'eager':'lazy'} onError={()=>setFailed(true)}/>:<div className="art-fallback">{project.title}<p>{project.description}</p></div>}
    {photo&&!photoFailed&&<img className="genuine-project-image" src={photo.src} alt={photo.alt} width="300" height="300" loading={priority?'eager':'lazy'} onError={()=>setPhotoFailed(true)}/>}
    {kind==='commerce'&&project.cover.images.slice(1).map((p,i)=><img key={p.src} className={'secondary-photo secondary-photo-'+i} src={p.src} alt={p.alt} width="150" height="150" loading="lazy" onError={e=>{e.currentTarget.style.display='none';}}/>)}
    <span className="cover-evidence">{photo?'Original '+(kind==='agency'?'logo':'product photos')+' / authored composition':'System illustration'}</span>
  </div>;
}
