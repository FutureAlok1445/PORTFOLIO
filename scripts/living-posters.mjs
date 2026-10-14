import {chromium} from '@playwright/test';import sharp from 'sharp';
const browser=await chromium.launch({channel:'chromium'});const page=await browser.newPage({viewport:{width:1440,height:900}});
await page.goto('http://127.0.0.1:4180/?capture=1',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.__captureWorkshop);await page.waitForTimeout(1500);
for(const [name,width,height] of [['workshop-desktop',1600,900],['workshop-mobile',780,700],['workshop-top',780,700],['workshop-mobile-day',780,700],['workshop-top-day',780,700]]){const data=await page.evaluate(({width,height,name})=>window.__captureWorkshop({width,height,view:name.startsWith('workshop-top')?'top':'guided',mood:name.endsWith('-day')?'day':'night'}),{width,height,name});await sharp(Buffer.from(data.split(',')[1],'base64')).webp({quality:88}).toFile('public/images/after-hours/desk/'+name+'.webp');}
await browser.close();console.log('Five exact renderer posters saved.');
