import fs from 'node:fs';
import sharp from 'sharp';
import crypto from 'node:crypto';
const root='public/images/after-hours/patch/',m=JSON.parse(fs.readFileSync(root+'patch-manifest.json'));
const rows=[];
for(const [state,a] of Object.entries(m.animations)){
 const buf=await sharp(root+a.file).ensureAlpha().raw().toBuffer(),width=a.frames*m.frameWidth,hashes=[],bottoms=[];
 for(let frame=0;frame<a.frames;frame++){
  const cell=Buffer.alloc(48*48*4);let bottom=-1;
  for(let y=0;y<48;y++)for(let x=0;x<48;x++){const src=(y*width+frame*48+x)*4,dst=(y*48+x)*4;buf.copy(cell,dst,src,src+4);if(buf[src+3])bottom=Math.max(bottom,y);}
  hashes.push(crypto.createHash('sha256').update(cell).digest('hex'));bottoms.push(bottom);
 }
 rows.push({state,frames:a.frames,unique:new Set(hashes).size,bottoms});
}
for(const state of ['walk','return']){const r=rows.find(r=>r.state===state);if(r.unique!==8||r.bottoms.some(y=>y!==40))throw Error('Invalid grounded gait '+state);}
const raster=(dir)=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(d=>d.isDirectory()?raster(dir+'/'+d.name):[dir+'/'+d.name]);const images=raster('public/images/after-hours').filter(f=>/\.(png|webp|jpe?g)$/.test(f));const missing=images.filter(f=>!fs.existsSync(f+'.json'));if(missing.length)throw Error(missing.join('\n'));
fs.writeFileSync('test-results/world-interface/sprites.json',JSON.stringify({states:rows.length,frames:rows.reduce((n,r)=>n+r.frames,0),rows,rasterCount:images.length,missingSidecars:missing},null,2));console.log(JSON.stringify({states:rows.length,frames:rows.reduce((n,r)=>n+r.frames,0),groundedUniqueGaits:true,rasterCount:images.length,missingSidecars:missing}));
