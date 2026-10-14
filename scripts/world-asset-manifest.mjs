import fs from 'node:fs';
import crypto from 'node:crypto';
import sharp from 'sharp';
import {content} from '../src/data/content.js';
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(dir+'/'+entry.name):[dir+'/'+entry.name]);
const verified=new Set(JSON.parse(fs.readFileSync('test-results/living-workshop/assets-http.json','utf8')).map(row=>row.file));
const paths=walk('public/images/after-hours');
const genuine=[content.profile.portrait,content.profile.portraitSmall,content.profile.resume,...content.projects.flatMap(p=>[p.cover?.image?.src,...(p.cover?.images||[]).map(i=>i.src)])].filter(Boolean).map(path=>'public'+path);
for(const path of [...new Set(genuine),...walk('public/fonts')])if(fs.existsSync(path)&&!paths.includes(path))paths.push(path);
const assets=[];
for(const path of paths){const ext=path.split('.').pop();let dimensions;try{if(['png','webp','svg'].includes(ext)){const metadata=await sharp(path).metadata();dimensions=[metadata.width,metadata.height];}}catch{/* non-raster metadata still inventoried */}
 const isOriginal=path.includes('/after-hours/'),kind=path.includes('/patch/')?'Patch frame artwork':path.includes('/projects/')?'project-specific conceptual diagram':path.includes('/desk/workshop-')?'actual authored Three.js room render':path.includes('/meta/')?'social identity artwork':path.includes('/textures/')?'original surface texture':'brand or retained supporting artwork';
 assets.push({path,format:ext,bytes:fs.statSync(path).size,dimensions,sha256:crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex'),purpose:isOriginal?kind:'genuine supplied photograph, logo, product image, resume or self-hosted font',origin:isOriginal?'Original local code-authored artwork; recipe in scripts/living-*.mjs or scripts/after-hours-assets.mjs':'Existing repository asset; retained without inventing its origin',license:isOriginal?'Original portfolio source under repository license; genuine embedded photographs remain supplied media':'Supplied repository media; font licenses retained in public/fonts',fallback:'Readable semantic content / Quick View; static Patch frame and real renderer posters where applicable',usedBy:isOriginal?'Workshop, case studies, metadata or retained prior artwork; see source and per-file provenance sidecar':'Existing profile, case media, resume download or self-hosted typography',verifiedLoad:verified.has(path)?'HTTP200 with exact source bytes':'Preserved repository file; runtime and resume checks recorded separately',semanticDescription:isOriginal?kind+'; never presented as an external product screenshot':'Authentic repository content'});
}
const procedural=['src/scene/createWorkshopWorld.js','src/scene/ObjectWorld.js','src/scene/ArtifactModels.js','src/scene/worldLayout.js','src/scene/RoomShell.js','src/scene/PatchModel.js'].map(path=>({path,format:'editable JavaScript geometry / canvas texture source',origin:'Original source-coded geometry',purpose:'Connected room, physical reading surfaces, curved paper, scaled archive and distinct project artifacts',fallback:'Quick View and rendered room posters'}));
fs.writeFileSync('docs/after-hours/WORLD_ASSET_MANIFEST.json',JSON.stringify({generatedAt:new Date().toISOString(),assets,procedural},null,2));console.log('Inventoried '+assets.length+' files plus '+procedural.length+' procedural sources.');

