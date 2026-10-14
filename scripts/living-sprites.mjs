import fs from 'node:fs';
import sharp from 'sharp';
const dir='public/images/after-hours/patch',N=48;
const palette={edge:'#111821',fur:'#303740',shade:'#59636c',cream:'#f5f0e6',amber:'#f2c477',moss:'#92af9a',coral:'#d98470'};
const colors=Object.fromEntries(Object.entries(palette).map(([k,v])=>[k,[...v.slice(1).match(/../g).map(n=>parseInt(n,16)),255]]));
const states={idle:[4,2,true],blink:[4,8,false],look:[4,5,false],tail:[6,7,false],sleep:[4,2,true],wake:[6,7,false],stretch:[6,7,false],walk:[8,10,true],paw:[5,7,false],pet:[6,7,false],peek:[5,6,false],return:[8,15,true],ear:[4,6,false],stand:[4,3,true],jump:[6,9,false],settle:[5,6,false]};
const manifest={character:'Patch',frameWidth:N,frameHeight:N,palette,animations:{},anchor:[24,41],safePath:'front desk edge, 0.6 world units'};
const rows=[];
for(const [state,[frames,fps,loop]] of Object.entries(states)){
 const buf=Buffer.alloc(N*N*frames*4);
 for(let f=0;f<frames;f++){
  const r=(x,y,w,h,c='fur')=>{for(let yy=Math.max(0,y);yy<Math.min(N,y+h);yy++)for(let xx=Math.max(0,x);xx<Math.min(N,x+w);xx++)buf.set(colors[c],(yy*N*frames+f*N+xx)*4);};
  const line=(x,y,points,c='fur')=>points.forEach(([dx,dy])=>r(x+dx,y+dy,2,2,c));
  const bob=f%2;
  if(state==='walk'||state==='return'){
    const step=[0,1,2,1,0,-1,-2,-1][f];r(9,24+bob,25,11,'edge');r(12,21+bob,18,4,'edge');r(10,24+bob,23,10);r(13,22+bob,16,4);r(27,14+bob,14,14,'edge');r(28,15+bob,12,12);r(28,9+bob,2,7);r(30,11+bob,2,5);r(38,9+bob,2,7);r(36,11+bob,2,5);r(38,11+bob,1,3,'coral');r(34,22+bob,8,3,'cream');r(31,19+bob,3,2,'amber');r(32,19+bob,1,2,'edge');r(41,22+bob,1,1,'coral');r(27,28+bob,11,2,'moss');
    const nearLift=[0,0,1,2,0,0,0,0][f],farLift=[0,0,0,0,0,0,1,2][f];r(11+step,34,4,7-nearLift);r(18-step,34,4,6-farLift,'shade');r(28-step,33,4,8-farLift);r(35+step,33,4,6-nearLift,'shade');r(4,18+bob,3,13);r(6,28+bob,5,4);r(3+Math.floor(f/4),15+bob,4,4,'shade');
  }else if(state==='sleep'||(state==='wake'&&f<2)){
    r(8,30-bob,30,11,'edge');r(9,29-bob,28,10);r(13,26-bob,20,4);r(11,28-bob,14,11,'shade');r(11,24-bob,4,6);r(21,24-bob,4,6);r(14,33-bob,3,1,'cream');r(21,33-bob,3,1,'cream');r(14,36-bob,10,2,'cream');r(23,30-bob,3,7,'moss');r(30,30+f%3,8,4);r(35,33+f%2,3,6,'shade');r(12,39,22,2,'edge');
  }else{
    const y=state==='peek'?Math.max(0,3-f):state==='stretch'?-Math.min(f,3):state==='wake'?3-Math.min(f,3):bob;
    r(17,26+y,17,13-Math.max(y,0),'edge');r(14,32+y,22,7-Math.max(y,0),'edge');r(18,27+y,15,12-Math.max(y,0));r(15,33+y,20,6-Math.max(y,0));r(22,29+y,6,9-Math.max(y,0),'cream');r(18,31+y,3,8-Math.max(y,0),'shade');r(30,31+y,3,8-Math.max(y,0),'shade');r(14,13+y,22,11,'edge');r(16,10+y,18,4,'edge');r(12,16+y,26,6,'edge');r(15,14+y,20,10);r(17,11+y,16,5);r(13,17+y,24,5);r(14,5+y,2,9);r(16,7+y,2,7);r(18,10+y,2,4);r(34,5+y,2,9);r(32,7+y,2,7);r(30,10+y,2,4);r(15,8+y,1,4,'coral');r(34,8+y,1,4,'coral');r(20,12+y,3,2,'shade');r(28,12+y,3,2,'shade');
    const closed=(state==='blink'&&f===2)||(state==='pet'&&f%3!==0),look=state==='look'?(f<2?-1:1):0;
    r(17+look,18+y,3,closed?1:2,'amber');r(30+look,18+y,3,closed?1:2,'amber');if(!closed){r(18+look,18+y,1,2,'edge');r(31+look,18+y,1,2,'edge');}r(20,22+y,5,4,'cream');r(27,22+y,5,4,'cream');r(24,25+y,5,2,'cream');r(25,22+y,2,1,'coral');r(25,24+y,1,2,'edge');r(12,22+y,6,1,'shade');r(34,22+y,6,1,'shade');r(18,27+y,15,2,'moss');r(25,29+y,2,2,'amber');r(16,38,6,3,'shade');r(29,38,6,3,'shade');
    const t=state==='tail'?[-1,0,2,3,2,0][f]:f%2;r(35,35,6,3);r(39-t,30,3,7);r(40-t,25,3,6);r(37-t,23-f%2,5,3,'shade');
    if(state==='paw'||state==='stretch'){r(30,32-f%4*2,5,6,'shade');r(30,31-f%4*2,5,2,'cream');}
    if(state==='pet'){line(9,7+f%3,[[0,0],[2,-2],[4,0]],'amber');r(39,9+f%2,2,2,'amber');}
    if(state==='ear'){r(32,5+f%3,5,4,'fur');r(33,6+f%3,3,2,'coral');}
    if(state==='stand'){r(17,31,4,8,'fur');r(30,31,4,8,'fur');r(36,26+f,3,10,'shade');}
    if(state==='jump'){r(12,28-f%3,5,6,'shade');r(33,28-f%3,5,6,'shade');}
    if(state==='settle'){r(17,19+y,3,1,'amber');r(30,19+y,3,1,'amber');r(20,33+f%2,10,4,'shade');}
  }
 }
 const file='patch-'+state+'.png';await sharp(buf,{raw:{width:N*frames,height:N,channels:4}}).png().toFile(dir+'/'+file);
 manifest.animations[state]={file,frames,fps,loop,row:rows.length,columns:frames};rows.push({input:await sharp(buf,{raw:{width:N*frames,height:N,channels:4}}).png().toBuffer(),top:(rows.length)*N,left:0});
}
await sharp({create:{width:N*8,height:N*rows.length,channels:4,background:'#202d39'}}).composite(rows).png().toFile(dir+'/patch-contact-sheet.png');
await sharp({create:{width:N*8,height:N*rows.length,channels:4,background:'#00000000'}}).composite(rows).png().toFile(dir+'/patch-atlas.png');
fs.writeFileSync(dir+'/patch-manifest.json',JSON.stringify(manifest,null,2));
fs.writeFileSync('src/data/patch-manifest.json',JSON.stringify(manifest,null,2));
console.log('Patch: '+Object.keys(states).length+' states, '+Object.values(states).reduce((n,s)=>n+s[0],0)+' authored pixel frames.');

await sharp(dir+'/patch-idle.png').extract({left:0,top:0,width:48,height:48}).png().toFile(dir+'/patch-poster.png');

