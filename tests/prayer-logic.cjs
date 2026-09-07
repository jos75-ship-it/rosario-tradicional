// Dependency-free regression checks: node tests/prayer-logic.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync('index.html','utf8');
const data = fs.readFileSync('prayers.js','utf8').replace(/export\s+/g,'');
const source = html.slice(html.indexOf('const app = {'),html.indexOf('app.init();',html.indexOf('const app = {')));
const element = ()=>({classList:{add(){},remove(){}},textContent:''});
const context={document:{getElementById:element,body:element()},AudioSystem:{playComplete(){},playBead(){}},window:{currentUser:{uid:'test'},userProfile:{}},console};
vm.createContext(context);
vm.runInContext(data+'\n'+source+'\nthis.app=app;',context);
const app=context.app;
for (const [type,total,aves,paters] of [['gozosos',73,53,6],['dolorosos',73,53,6],['gloriosos',73,53,6],['completo',203,153,16]]) {
 app.state.beads=app.generateBeads(type);
 assert.equal(app.state.beads.length,total);
 assert.equal(app.state.beads.filter(b=>b.beadType==='ave').length,aves);
 assert.equal(app.state.beads.filter(b=>b.beadType==='pater').length,paters);
 assert.equal(app.rosaryPosition(0),0);
 assert.equal(app.rosaryPosition(total-1),5);
 for(let i=0;i<total;i++) assert(app.rosaryPosition(i)>=0 && app.rosaryPosition(i)<=60);
 for(let i=7;i<total-1;i+=65)assert.equal(app.rosaryPosition(i),6);
}
let saves=0;
app.saveCompletion=()=>{saves++};app.els={prayer:element(),completion:element()};
app.state.type='completo';app.state.index=202;
app.next();app.next();app.complete();
assert.equal(saves,1);assert.equal(app.state.type,null);
assert(!html.includes("document.querySelector('.nav-item[data-tab=\"rosary\"]').click()"));
console.log('PASS: prayer counts in 4 modes, complete rosary mapping, crucifix/medal endpoints, single completion.');
