import {chromium,expect as base} from '@playwright/test';
import fs from 'node:fs';
const expect=base.configure({timeout:15000}),b=await chromium.launch({channel:'chromium'}),p=await b.newPage({viewport:{width:1440,height:900}}),checks=[];
await p.goto('http://127.0.0.1:4180/?object=notebook',{waitUntil:'networkidle'});await expect(p.locator('.object-owned-surface')).toHaveAttribute('data-aligned','true');
for(let n=1;n<=4;n++){
 await expect(p.locator('.page-turn-controls span')).toHaveText(n+' / 4');
 const bounds=await p.evaluate(()=>{const a=document.querySelector('.object-surface-content').getBoundingClientRect(),b=document.querySelector('.page-turn-controls').getBoundingClientRect();return {top:b.top-a.top,bottom:a.bottom-b.bottom};});expect(bounds.top).toBeGreaterThanOrEqual(0);expect(bounds.bottom).toBeGreaterThanOrEqual(-1);
 if(n<4){await p.getByRole('button',{name:'Next page'}).focus();await p.keyboard.press('Enter');}
}
await p.locator('.notebook-print').focus();await expect(p.locator('.notebook-print')).toBeFocused();await p.keyboard.press('ArrowLeft');await expect(p.locator('.page-turn-controls span')).toHaveText('3 / 4');await p.keyboard.press('Escape');await expect(p.locator('dialog[open]')).toHaveCount(0);checks.push('All four notebook resting pages contain full navigator; named inner page keyboard focus and ArrowLeft/Enter/Escape work');
await p.emulateMedia({reducedMotion:'reduce'});await expect(p.locator('.living-quick')).toBeVisible();await expect(p.locator('canvas')).toHaveCount(0);checks.push('Changing reduced-motion at runtime releases renderer and opens complete Quick View');
await p.setViewportSize({width:390,height:844});await p.emulateMedia({reducedMotion:'no-preference'});await p.goto('http://127.0.0.1:4180/',{waitUntil:'networkidle'});const dims=await p.locator('.touch-room > img').evaluate(el=>({width:el.getAttribute('width'),height:el.getAttribute('height'),loaded:el.complete&&el.naturalWidth>0}));expect(dims).toEqual({width:'780',height:'700',loaded:true});checks.push('Mobile renderer poster has reserved intrinsic dimensions and loads');
fs.writeFileSync('test-results/world-interface/final-focused.json',JSON.stringify({checks},null,2));console.log(JSON.stringify(checks,null,2));await b.close();
