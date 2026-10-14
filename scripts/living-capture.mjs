import {chromium} from '@playwright/test';
import fs from 'node:fs';
fs.mkdirSync('test-results/living-workshop/pass-one',{recursive:true});
const b=await chromium.launch();
for(const width of [1440,768,390]){
 const p=await b.newPage({viewport:{width,height:900}});p.on('pageerror',e=>console.log('ERROR',e.message));p.on('response',r=>{if(r.status()>=400)console.log('HTTP',r.status(),r.url());});await p.goto('http://127.0.0.1:4180/',{waitUntil:'domcontentloaded'});await p.waitForTimeout(2200);
 for(const id of ['desk','about','work','skills','experience','contact']){await p.locator('#'+id).evaluate(el=>el.scrollIntoView({behavior:'instant',block:'start'}));await p.waitForTimeout(1600);await p.screenshot({path:`test-results/living-workshop/pass-one/${id}-${width}.png`});}
 console.log(width,await p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,metrics:window.__workshopMetrics})));await p.close();
}
await b.close();
