import lighthouse from 'lighthouse';
import {launch} from 'chrome-launcher';
import {chromium} from '@playwright/test';
import fs from 'node:fs';
import desktop from 'lighthouse/core/config/desktop-config.js';
const chrome=await launch({chromePath:chromium.executablePath(),chromeFlags:['--headless','--no-sandbox']});
const results=[];
try{
 for(const mode of ['mobile','desktop']){
  const result=await lighthouse('http://127.0.0.1:4180/',{port:chrome.port,output:'json',onlyCategories:['performance','accessibility','best-practices','seo']},mode==='desktop'?desktop:undefined);
  fs.writeFileSync('test-results/world-interface/lighthouse-'+mode+'.json',result.report);
  const r=result.lhr,row={mode,scores:Object.fromEntries(Object.entries(r.categories).map(([key,val])=>[key,Math.round(val.score*100)])),lcp:r.audits['largest-contentful-paint'].displayValue,tbt:r.audits['total-blocking-time'].displayValue,cls:r.audits['cumulative-layout-shift'].displayValue,bytes:r.audits['total-byte-weight'].numericValue};results.push(row);console.log(JSON.stringify(row));
 }
 fs.writeFileSync('test-results/world-interface/performance.json',JSON.stringify({context:'Local Chromium Lighthouse lab, desktop Explore and mobile 2.5D; not physical-device guarantees',results},null,2));
}finally{await chrome.kill();}
