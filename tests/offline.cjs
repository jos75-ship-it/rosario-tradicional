const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const handlers={},items=new Map();let fetched=0;
const cache={addAll:async urls=>{for(const url of urls){assert(fs.existsSync('.'+(url==='/'?'/index.html':url)),url);items.set(url,new Response('cached'))}},match:async request=>items.get(typeof request==='string'?request:new URL(request.url).pathname),put:async()=>{}};
const self={location:{origin:'https://rosario.test'},addEventListener:(name,handler)=>handlers[name]=handler,clients:{claim:async()=>{}}};
vm.runInNewContext(fs.readFileSync('sw.js','utf8'),{self,caches:{open:async()=>cache,keys:async()=>[],delete:async()=>{}},URL,Response,fetch:async()=>{fetched++;throw Error('offline')},console});
(async()=>{
 await new Promise((resolve,reject)=>handlers.install({waitUntil:p=>p.then(resolve,reject)}));
 for(const path of ['/style.css','/prayers.js','/prayers.json','/config.js'])assert(items.has(path));
 async function request(path,mode='cors') {let response;handlers.fetch({request:{method:'GET',url:'https://rosario.test'+path,mode},respondWith:p=>response=p});return response;}
 assert.equal((await request('/prayers.json')).status,200);
 assert.equal((await request('/missing.json')).type,'error');
 assert.equal((await request('/route','navigate')).status,200);
 let intercepted=false;handlers.fetch({request:{method:'GET',url:'https://example.com/api'},respondWith:()=>intercepted=true});assert(!intercepted);
 console.log('PASS: offline shell files exist, prayer cache, navigation fallback, missing JSON is not HTML, external requests bypass cache.');
})().catch(e=>{console.error(e);process.exitCode=1});
