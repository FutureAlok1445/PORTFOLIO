import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { content } from '../src/data/content.js';
const root='public/images/after-hours';
for(const dir of ['brand','desk','patch','textures','projects','meta']) fs.mkdirSync(`${root}/${dir}`,{recursive:true});
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;');
const svg=(body,w=800,h=500)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><pattern id="paper" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="2" cy="5" r=".6" fill="#19212b" opacity=".06"/></pattern><filter id="shadow" x="-30%" y="-30%" width="170%" height="170%"><feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#111820" flood-opacity=".2"/></filter></defs>${body}</svg>`;
const text=(x,y,s,size=20,color='#19212b')=>`<text x="${x}" y="${y}" font-family="sans-serif" font-size="${size}" fill="${color}">${esc(s)}</text>`;
const rect=(x,y,w,h,fill='#f5efe5',r=3)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"/>`;
const line=(x,y,a,b,color='#87a9c4',dash='')=>`<path d="M${x} ${y}L${a} ${b}" stroke="${color}" stroke-width="2" fill="none" ${dash?'stroke-dasharray="'+dash+'"':''}/>`;
const rules=(x,y,w,n=4)=>Array.from({length:n},(_,i)=>line(x,y+i*24,x+w-(i%2)*35,y+i*24,'#b9b8b0')).join('');
const paper=(x,y,w,h)=>`<g filter="url(#shadow)">${rect(x,y,w,h)}${rect(x,y,w,h,'url(#paper)')}</g>`;
const layouts={
 history:()=>`${paper(180,70,410,345)}${rect(170,70,20,345,'#8fae9c')}${rect(545,62,24,95,'#d98e7d')}${text(220,123,'History, collected.',27)}${line(235,178,535,178,'#d7a35d')}${[240,340,440,530].map((x,i)=>`<circle cx="${x}" cy="178" r="7" fill="#d7a35d"/>${text(x-10,213,['Read','Save','Study','Quiz'][i],16)}`).join('')}${rules(220,252,285,4)}<circle cx="555" cy="350" r="42" fill="#d7a35d"/>${text(526,357,'QUIZ',18)}`,
 security:()=>`${paper(95,90,370,295)}${paper(435,158,260,230)}${text(125,137,'Request / evidence',24)}${rules(125,171,300,4)}${line(275,289,486,289,'#d98e7d','7 6')}${rect(480,268,160,48,'#19212b')}${text(497,299,'Response',21,'#f5efe5')}${text(475,354,'Correlate, then assess.',17)}${rect(300,61,110,32,'#87a9c4')}${text(317,83,'CASE FILE',14)}`,
 workflow:()=>`${paper(75,100,190,268)}${text(98,147,'Application',23)}${rules(98,180,125,4)}${line(268,230,322,230,'#d7a35d')}${paper(324,76,195,268)}${text(345,123,'Review',23)}${rules(345,158,140,3)}${line(520,207,561,207,'#d7a35d')}${paper(560,140,170,268)}${text(580,188,'Accounts',22)}${rules(580,224,125,3)}<g transform="rotate(-9 420 283)"><rect x="364" y="263" width="115" height="39" fill="none" stroke="#8fae9c" stroke-width="3"/>${text(378,289,'ROUTED',19,'#527462')}</g>`,
 agency:()=>`${paper(95,95,300,300)}${rect(115,115,260,190,'#e7e3db')}${text(124,344,'Identity / website',22)}${paper(427,65,265,115)}${text(452,113,'Domain + SSL',23)}${line(454,139,658,139)}${paper(455,211,250,194)}${rect(476,231,209,30,'#19212b')}${rect(476,277,91,94,'#87a9c4')}${rules(585,285,80,3)}`,
 commerce:()=>`${paper(155,72,270,340)}${rect(177,94,225,230,'#e7e3db')}${text(192,375,'Made to gift.',24)}<g transform="rotate(12 565 236)">${paper(478,125,190,265)}<circle cx="573" cy="145" r="6" fill="#19212b"/>${line(573,145,603,62,'#d7a35d')}${text(510,310,'A small',24)}${text(510,342,'gesture.',24)}</g>`,
 finance:()=>`${paper(100,75,330,315)}${text(124,122,'A plan, on paper.',25)}${rules(124,152,265,3)}${[90,140,65,110].map((h,i)=>rect(135+i*61,347-h,34,h,['#87a9c4','#8fae9c','#d7a35d','#87a9c4'][i])).join('')}${paper(461,130,230,255)}${text(487,180,'Ask. Reflect.',23)}${text(487,212,'Plan ahead.',23)}${rules(487,259,155,3)}`,
 hiring:()=>`${line(174,240,638,240,'#d7a35d')}${[105,315,525].map((x,i)=>`${paper(x,100+i*22,170,270)}<circle cx="${x+44}" cy="${148+i*22}" r="20" fill="#87a9c4"/>${rules(x+25,200+i*22,120,3)}${rect(x+25,300+i*22,120,28,'#8fae9c')}`).join('')}`,
 fraud:()=>`${paper(120,70,555,340)}${text(151,121,'Transaction review',25)}${line(150,145,645,145,'#19212b')}${[0,1,2,3,4].map(i=>`${i===2?rect(145,163+i*40,505,38,'#ecd1c5'):''}${text(159,188+i*40,'ENTRY '+String(i+1).padStart(2,'0'),16)}${line(280,182+i*40,492,182+i*40,'#9ea6a8')}${i===2?'<circle cx="603" cy="262" r="11" fill="none" stroke="#a05f4e" stroke-width="3"/>':line(574,182+i*40,629,182+i*40,'#8fae9c')}`).join('')}`,
 booking:()=>`<g transform="rotate(-6 400 250)">${paper(145,120,520,260)}${rect(145,120,520,52,'#87a9c4')}${text(175,155,'ADMIT ONE / INTERFACE STUDY',18)}${text(177,228,'Movie & event',31)}${text(177,268,'booking journey',31)}${line(529,175,529,355,'#b3aaa0','4 8')}${rect(561,199,68,83,'#19212b')}${rules(179,308,240,2)}${text(559,329,'DART',16)}</g>`,
 typing:()=>`${paper(95,67,610,150)}${text(125,123,'Practice the next keystroke.',26)}${line(127,161,543,161,'#8fae9c')}${rect(550,143,3,25,'#d7a35d')}<g transform="translate(105 250)">${['QWERTYUIOP','ASDFGHJKL','ZXCVBNM'].map((row,j)=>[...row].map((s,i)=>`${rect(i*54+j*17,j*49,45,42,'#111820',6)}${rect(i*54+j*17,j*49,45,35,'#e3d9c9',6)}${text(i*54+j*17+15,j*49+24,s,18)}`).join('')).join('')}</g>`,
 orbit:()=>`${paper(115,63,570,358)}${[0,1,2].map(i=>`<ellipse cx="400" cy="237" rx="210" ry="${65+i*25}" fill="none" stroke="#87a9c4" stroke-width="2" transform="rotate(${i*55} 400 237)"/>`).join('')}${[[205,192],[332,95],[578,176],[585,315],[380,365],[230,301]].map(([x,y],i)=>`${rect(x-19,y-16,38,32,i<4?'#19212b':'#d7a35d',4)}${line(x-9,y-4,x+9,y-4,'#f5efe5')}`).join('')}${rect(362,208,76,55,'#8fae9c')}${text(376,242,'4 + 2',20)}${text(143,397,'Simulated topology / shard recovery',18)}`,
 forensics:()=>`<g transform="rotate(-6 350 240)">${paper(147,79,365,313)}${text(173,126,'Forensic signals',24)}${Array.from({length:7},(_,i)=>Array.from({length:9},(_,j)=>rect(176+j*32,154+i*26,28,22,(i+j)%4===0?'#d98e7d':(i+j)%3===0?'#87a9c4':'#d4d6ce')).join('')).join('')}</g>${paper(487,167,205,228)}${text(513,211,'Explanation',22)}${rules(514,240,140,3)}${text(515,353,'Evidence ≠ certainty',14)}`,
};
for(const p of content.projects){
 const key={aura:'security',matching:'hiring'}[p.visual]||p.visual;
 const body=layouts[key]?.()||layouts.workflow();
 fs.writeFileSync(`${root}/projects/${p.slug}.svg`,svg(`${rect(0,0,800,500,'#28333e')}${line(0,447,800,447,'#3a4854')}${body}`));
}
const desk=svg(`<defs><radialGradient id="glow"><stop stop-color="#d7a35d" stop-opacity=".3"/><stop offset="1" stop-color="#d7a35d" stop-opacity="0"/></radialGradient></defs>${rect(0,0,800,560,'#19212b')}<ellipse cx="600" cy="224" rx="245" ry="205" fill="url(#glow)"/>${line(40,380,760,380,'#35414c')}${paper(110,76,100,116)}${text(126,112,'build',18)}${text(126,140,'connect',18)}${text(126,167,'repeat',18)}${rect(638,90,71,87,'#87a9c4')}${line(650,111,695,111,'#19212b')}${line(650,134,689,134,'#19212b')}<ellipse cx="426" cy="483" rx="333" ry="36" fill="#111820"/><path d="M67 360L610 310 756 426 191 503Z" fill="#775846"/><path d="M191 503L756 426V442L191 519 67 376V360Z" fill="#493e35"/><path d="M159 489V548M682 438V518" stroke="#33404b" stroke-width="20"/>${rect(263,120,270,199,'#111820',10)}${rect(276,134,244,164,'#283d49',3)}${rect(276,134,244,22,'#354c59',3)}${[0,1,2,3,4].map(i=>line(299+(i%2)*12,181+i*20,446-(i%3)*24,181+i*20,i===2?'#d7a35d':'#87a9c4')).join('')}${rect(383,317,30,41,'#53626a')}<path d="M345 362L437 350 473 366 371 384Z" fill="#53626a"/><g transform="matrix(1 -.12 .4 .6 260 386)">${rect(0,0,245,75,'#111820',5)}${Array.from({length:4},(_,j)=>Array.from({length:13},(_,i)=>rect(7+i*18,6+j*16,14,11,j===3&&i===6?'#d7a35d':'#c4c0b3',2)).join('')).join('')}</g><path d="M541 363L643 349 677 392 571 408Z" fill="#f5efe5"/><path d="M551 363L581 402" stroke="#d98e7d" stroke-width="4"/>${line(580,372,634,364,'#87a9c4')}${line(590,387,647,378,'#87a9c4')}<ellipse cx="191" cy="367" rx="29" ry="12" fill="#d7a35d"/>${rect(162,363,58,52,'#bd855c',7)}<ellipse cx="191" cy="362" rx="28" ry="11" fill="#4e3429"/><path d="M219 370Q255 367 246 395Q237 408 218 394" fill="none" stroke="#bd855c" stroke-width="8"/><path d="M626 333L648 220 597 157" fill="none" stroke="#8fae9c" stroke-width="10"/><path d="M572 144L622 171 609 205 548 173Z" fill="#8fae9c"/><path d="M548 173L609 205 604 211 545 181Z" fill="#d7a35d"/><ellipse cx="626" cy="339" rx="40" ry="12" fill="#8fae9c"/>`,800,560);
fs.writeFileSync(`${root}/desk/desk-layer.svg`,desk);
for(const name of ['monitor-screen','desk-note','notebook','lamp','keyboard']) fs.writeFileSync(`${root}/desk/${name}.svg`,svg(layouts[{ 'monitor-screen':'security','desk-note':'history',notebook:'history',lamp:'workflow',keyboard:'typing'}[name]]()));
// PNG encoder: deterministic exact RGBA pixels, no antialiasing or asset dependency.
function png(w,h,data){
 const crc=b=>{let c=0xffffffff;for(const v of b){c^=v;for(let k=0;k<8;k++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (c^0xffffffff)>>>0;};
 const chunk=(type,b)=>{const name=Buffer.from(type),n=Buffer.alloc(4),c=Buffer.alloc(4);n.writeUInt32BE(b.length);c.writeUInt32BE(crc(Buffer.concat([name,b])));return Buffer.concat([n,name,b,c]);};
 const header=Buffer.alloc(13);header.writeUInt32BE(w);header.writeUInt32BE(h,4);header[8]=8;header[9]=6;
 const rows=Buffer.alloc((w*4+1)*h);for(let y=0;y<h;y++)data.copy(rows,y*(w*4+1)+1,y*w*4,(y+1)*w*4);
 return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',zlib.deflateSync(rows)),chunk('IEND',Buffer.alloc(0))]);
}
const sets={idle:[4,2],blink:[3,7],tail:[5,6],walk:[8,9],sleep:[4,2],peek:[4,4],paw:[4,5]};
const manifest={frameWidth:48,frameHeight:48,character:'Patch',palette:{fur:'#303740',edge:'#111820',eyes:'#f5efe5',ear:'#d7a35d'},animations:{}};
for(const [kind,[frames,fps]] of Object.entries(sets)){
 const data=Buffer.alloc(48*frames*48*4);
 for(let frame=0;frame<frames;frame++){
  const colors={fur:[48,55,64,255],edge:[17,24,32,255],eyes:[245,239,229,255],ear:[215,163,93,255],shade:[74,83,91,255]};
  const r=(x,y,w,h,color='fur')=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){if(xx<0||xx>=48||yy<0||yy>=48)continue;const idx=(yy*(48*frames)+frame*48+xx)*4;data.set(colors[color],idx);}};
  const breath=kind==='idle'&&frame===2?1:0;
  if(kind==='sleep'){
   r(9,29,28,12);r(13,25,20,4);r(7,32,5,7,'edge');r(13,29,13,9,'shade');r(13,25,4,5);r(21,25,4,5);r(16,33,3,1,'eyes');r(23,33,3,1,'eyes');r(30,28+(frame%2),6,3,'shade');r(35,31,3,6,'shade');
  }else if(kind==='walk'){
   const step=[0,1,2,1,0,-1,-2,-1][frame];r(10,24,24,12);r(27,15,14,15);r(27,12,4,7);r(37,12,4,7);r(38,13,2,2,'ear');r(10,34,4,6+Math.max(step,0));r(18,34,4,6-Math.max(step,0),'shade');r(27,34,4,6+Math.max(-step,0));r(34,34,4,6-Math.max(-step,0),'shade');r(5,18+(frame%2),4,12);r(8,27,5,4);r(30,21,2,2,'eyes');r(37,21,2,2,'eyes');
  }else{
   const y=kind==='peek'?Math.max(0,3-frame)*2:breath;
   r(14,25+y,21,15);r(17,22+y,15,5);r(12,12+y,24,16);r(12,7+y,5,8);r(31,7+y,5,8);r(32,8+y,3,3,'ear');r(12,25+y,4,4,'shade');r(16,38,6,3,'edge');r(27,38,6,3,'edge');r(22,31+y,3,8,'shade');
   const closed=kind==='blink'&&frame===1;
   r(17,19+y,3,closed?1:3,'eyes');r(29,19+y,3,closed?1:3,'eyes');r(24,24+y,2,1,'ear');
   const tail=kind==='tail'?frame:kind==='idle'?frame%2:0;r(35,34,7,4);r(40,26-tail,3,11+tail);r(37-tail,24-tail,5+tail,3,'shade');
   if(kind==='paw'){r(29,30-frame*2,5,5,'shade');r(30,29-frame*2,3,1,'eyes');}
  }
 }
 fs.writeFileSync(`${root}/patch/patch-${kind}.png`,png(48*frames,48,data));
 manifest.animations[kind]={file:`patch-${kind}.png`,frames,fps,row:0,columns:frames,loop:['idle','sleep'].includes(kind)};
}
fs.writeFileSync(`${root}/patch/patch-manifest.json`,JSON.stringify(manifest,null,2));
const mark=svg(`<path d="M18 47V18H58V47M14 49H63M25 25H50M37 18V9M30 9H44" fill="none" stroke="#d7a35d" stroke-width="4"/><path d="M29 36H47" stroke="#87a9c4" stroke-width="3"/>`,76,64);
fs.writeFileSync(`${root}/brand/mark.svg`,mark);fs.writeFileSync(`${root}/brand/favicon.svg`,mark);
fs.writeFileSync(`${root}/brand/wordmark.svg`,svg(`${text(12,50,'After hours',42,'#f5efe5')}${text(14,82,'Alok Sahoo / digital workshop',17,'#87a9c4')}`,300,100));
const noise=Buffer.alloc(128*128*4);let seed=1445;for(let i=0;i<128*128;i++){seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;const n=(seed>>>0)%255;noise.set([n,n,n,7],i*4);}
fs.writeFileSync(`${root}/textures/paper-noise.png`,png(128,128,noise));
// Optional optimized previews; SVG remains the editable immediate fallback.
try{const {default:sharp}=await import('sharp');await sharp(Buffer.from(desk)).webp({quality:85}).toFile(`${root}/desk/desk-poster.webp`);for(const name of ['paper-noise','soft-grain'])await sharp(png(128,128,noise)).webp({quality:70}).toFile(`${root}/textures/${name}.webp`);const og=svg(`${rect(0,0,1200,630,'#19212b')}${text(85,145,'AFTER HOURS',26,'#d7a35d')}${text(80,290,content.profile.name,88,'#f5efe5')}${text(85,359,content.profile.title,28,'#87a9c4')}${text(85,511,content.profile.tagline,24,'#f5efe5')}`,1200,630);for(const file of ['brand/og-home.webp','meta/og-project-default.webp'])await sharp(Buffer.from(og)).webp({quality:85}).toFile(`${root}/${file}`);}catch(error){console.log('Preview generation unavailable: '+error.message);}
const files=[];function scan(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,entry.name);if(entry.isDirectory())scan(p);else files.push(p);}}scan(root);
fs.writeFileSync('ASSET_MANIFEST.md','# AFTER HOURS asset manifest\n\nGenerated by `node scripts/after-hours-assets.mjs`. SVG artwork and procedural meshes are original conceptual illustrations, not screenshots. Patch uses seven hand-authored pixel frame sets on a 48px grid (32 distinct frames). Original portfolio images remain user-supplied; fonts retain their bundled licenses. New artwork is maintained under the repository ISC license.\n\n| Asset | Bytes | Format | Purpose / provenance |\n|---|---:|---|---|\n'+files.map(p=>`| ${p.replaceAll('\\','/')} | ${fs.statSync(p).size} | ${path.extname(p).slice(1)} | Original code-authored ${p.includes('patch')?'pixel character / manifest':p.includes('projects')?'project workflow metaphor':p.includes('textures')?'deterministic texture':'workshop identity / illustration'} |`).join('\n')+'\n\nExisting user-supplied assets: profile.webp, profile-small.webp, profile.jpg, Techriciate logo and three Bloom product WebPs in public/images/projects; resume.pdf is retained. No AI likenesses, stock photos or fabricated screenshots are used. Desk layer is the static fallback; desk-poster is a compressed derivative. Individual desk SVGs are editable motif studies; the production composition uses desk-layer.svg and procedural DeskScene3D geometry. Project filenames follow canonical slugs (fincoach-ai, talent-sync, credit-card-fraud-detection, cosmeon-fs-lite, trustnet-ai), rather than shortened brief aliases.\n');
console.log('Generated '+files.length+' workshop assets.');
