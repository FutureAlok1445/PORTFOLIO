import sharp from 'sharp';
const width=256,height=256,data=Buffer.alloc(width*height*3);
for(let y=0;y<height;y++)for(let x=0;x<width;x++){const grain=Math.sin(y*.12+Math.sin(x*.018)*2)*5+Math.sin(y*.65+x*.008)*2,i=(y*width+x)*3;data[i]=149+grain;data[i+1]=117+grain;data[i+2]=91+grain;}
await sharp(data,{raw:{width,height,channels:3}}).webp({quality:90}).toFile('public/images/after-hours/textures/wood-grain.webp');
