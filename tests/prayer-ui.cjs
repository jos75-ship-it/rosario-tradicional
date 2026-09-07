// Run with: node tests/prayer-ui.cjs (serve the repository on localhost:8765).
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch({headless:true, ...(process.env.CHROMIUM_PATH ? {executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox','--disable-gpu']} : {})});
 const page = await browser.newPage({viewport:{width:390,height:844}});
 // Isolate prayer UI from live Firebase accounts and external font services.
 await page.route('**/*', route => new URL(route.request().url()).hostname === 'localhost' ? route.continue() : route.abort());
 const errors=[];
 page.on('pageerror', e=>errors.push(e.message));
 await page.goto('http://localhost:8765');
 await page.waitForFunction(()=>window.app);
 await page.evaluate(()=>{document.getElementById('app-splash')?.remove();document.getElementById('auth-screen').classList.add('hidden');document.getElementById('main-app').classList.remove('hidden');app.start('gozosos');});
 await page.waitForTimeout(700);
 assert.equal(await page.locator('.rosary-point').count(),61);
 assert.equal(await page.locator('.rosary-point.active').getAttribute('data-position'),'0');
 assert.equal(await page.locator('#prev-btn').isDisabled(),true);
 for (const size of [{width:390,height:844},{width:320,height:568},{width:844,height:390},{width:1440,height:900}]) {
   await page.setViewportSize(size);
   await page.evaluate(()=>{app.goTo(1); if(!app.state.showText)app.toggleText();});
   await page.waitForTimeout(700);
   const bounds = await page.evaluate(()=>{
     const svg=document.querySelector('#bead-track svg').getBoundingClientRect();
     const footer=document.querySelector('.prayer-footer').getBoundingClientRect();
     return {svg:{x:svg.x,y:svg.y,right:svg.right,bottom:svg.bottom},footer:{right:footer.right,bottom:footer.bottom},width:innerWidth,height:innerHeight};
   });
   assert(bounds.svg.x>=0 && bounds.svg.y>=0 && bounds.svg.right<=bounds.width && bounds.svg.bottom<=bounds.height,JSON.stringify(bounds));
   assert(bounds.footer.bottom<=bounds.height && bounds.footer.right<=bounds.width,JSON.stringify(bounds));
 }
 await page.setViewportSize({width:390,height:844});
 await page.evaluate(()=>app.goTo(7));
 await page.waitForTimeout(700);
 await page.screenshot({path:'/tmp/rosario-mobile.png'});
 await page.locator('#prayer-body').hover();
 const before=await page.evaluate(()=>app.state.index);
 await page.mouse.wheel(0,400);
 assert.equal(await page.evaluate(()=>app.state.index),before);
 await page.evaluate(()=>app.goTo(app.state.beads.length-1));
 assert.equal(await page.locator('.rosary-point.active').getAttribute('data-position'),'5');
 assert.equal(await page.locator('#next-label').textContent(),'Concluir');
 const saves=await page.evaluate(()=>{
   let count=0;app.saveCompletion=()=>{count++};window.currentUser={uid:'test'};window.userProfile={};
   app.next();app.next();return count;
 });
 assert.equal(saves,1);
 await page.keyboard.press('ArrowRight');
 assert.equal(await page.evaluate(()=>app.state.type),null);
 await page.evaluate(()=>{app.home();app.start('completo');app.goTo(72);});
 assert.equal(await page.locator('.rosary-point.active').getAttribute('data-position'),'6');
 await page.evaluate(()=>{const select=document.getElementById('select-prayer');select.value='';select.dispatchEvent(new Event('change'));});
 assert.match(await page.locator('#prayers-list').textContent(),/Selecione uma oração/);
 assert.deepEqual(errors,[]);
 console.log('PASS: full rosary, 4 viewport sizes, reading scroll, placeholder, completion guard, full rosary cycle; no page errors.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
