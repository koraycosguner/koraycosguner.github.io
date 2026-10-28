import {test,expect,type Page} from '@playwright/test';
import {ROOT,cellParts,core,functionSets,labelSets,matchIds,paragraphIds,questIds,systemIds,partById,taskById,testIds} from '../../science/cells/concept2/content';
import {KEY} from '../../science/cells/concept2/learning';
import {points} from '../../science/cells/concept2/CellDiagram';
import type {Saved} from '../../science/cells/concept2/types';
import {studyPath} from './paths';
async function open(page:Page,tail=''){await page.goto(studyPath(ROOT+tail));await expect(page.locator('#c2-main')).toHaveAttribute('aria-busy','false')}
async function saved(page:Page){return page.evaluate(key=>JSON.parse(localStorage.getItem(key)!) as Saved,KEY)}
async function current(page:Page){const s=await saved(page);return taskById.get(s.session!.ids[s.session!.index])!}
async function begin(page:Page,tail:string){await open(page,tail);await page.getByRole('button',{name:/^(Let’s begin|Start practice test) →$/}).click();if(await page.getByRole('dialog').count())await page.getByRole('button',{name:'Start new activity',exact:true}).click()}
async function answer(page:Page,wrong=false){
 const t=await current(page),ids=wrong?[t.choices.find(c=>c.id!==t.answer[0])!.id]:t.answer;
 if(t.kind==='written'){await page.getByLabel('My analogy and explanation',{exact:true}).fill('The cell part is like a helpful workshop because both do the same useful job.');}
 else if(t.kind==='diagram-pick')await page.locator(`g[role="button"][data-part="${ids[0]}"]`).press('Enter');
 else if(t.kind==='sort')await page.locator('.c2-venn').getByRole('button',{name:new RegExp('^'+t.choices.find(c=>c.id===ids[0])!.label)}).click();
 else if(t.kind==='bank'||t.kind==='label')for(let i=0;i<ids.length;i++){
  await page.locator('.c2-bank').getByRole('button',{name:t.choices.find(c=>c.id===ids[i])!.label,exact:true}).click();
  if(t.kind==='label')await page.locator('.c2-cell-svg').getByRole('button',{name:`Structure ${i+1}`,exact:true}).press('Enter');
  else await page.locator('.c2-slot').nth(i).click();
 }
 else await page.locator('.c2-choices').getByRole('button',{name:t.choices.find(c=>c.id===ids[0])!.label,exact:true}).click();
 await page.getByRole('button',{name:/^(Check my answer|Save my analogy|Save answer & continue) →$/}).click();
 return t;
}
async function next(page:Page){await page.locator('.c2-feedback').getByRole('button',{name:'Continue →',exact:true}).click()}
async function finish(page:Page,count:number){for(let i=0;i<count;i++){await answer(page);if((await saved(page)).session!.mode!=='test')await next(page)}}
async function fits(page:Page,label:string){for(const width of [320,390,768,1280]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${label} at ${width}`).toBe(true);const boxes=await page.locator('.c2-primary,.c2-choices button,.c2-bank button,.c2-slot,.c2-clear,.c2-venn button,.c2-diagram-alternative button').evaluateAll(elements=>elements.map(el=>el.getBoundingClientRect()).filter(r=>r.width>0).map(r=>[r.width,r.height]));expect(boxes.every(([w,h])=>w>=44&&h>=44),`${label} touch controls ${width}`).toBe(true)}}

test('Science and Cells navigation reaches every new direct route and preserves Concept 1',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(studyPath('/subjects/science/'));await page.getByRole('link',{name:'Explore Cells →',exact:true}).click();await page.getByRole('link',{name:'Open the Cell Lab →',exact:true}).click();await expect(page.getByRole('heading',{level:1})).toHaveText('Tiny parts.Extraordinary jobs.');await fits(page,'Cell Lab home');
 const links=await page.locator('nav[aria-label="Concept 2 activities"] a').evaluateAll(nodes=>nodes.map(n=>(n as HTMLAnchorElement).pathname));expect(links).toHaveLength(5);for(const link of links){const response=await page.request.get(link);expect(response.status()).toBe(200);expect(link).not.toMatch(/concept-2\/\w+\/yusufs-quizzes/)}
 for(const tail of ['','explore/','school/','systems/','label/','functions/','analogies/','compare/','types/','test/','quick/','quest/','match/','paragraphs/','write/']){await open(page,tail);await page.reload();await expect(page.locator('#c2-main')).toHaveAttribute('aria-busy','false');expect(await page.title()).toContain('Cell Structure');}
 await page.getByRole('link',{name:'Cell Theory & Scientists',exact:true}).click();await expect(page.getByRole('button',{name:'Read the story',exact:true})).toBeVisible();expect(errors).toEqual([]);
});

test('actual animal and plant structures select by pointer, keyboard and accessible alternative',async({page})=>{
 await open(page,'explore/');for(const cell of ['animal','plant'] as const){await page.getByRole('button',{name:cell==='animal'?'Animal cell':'Plant cell',exact:true}).click();for(const p of cellParts(cell)){
  await page.locator('.c2-cell-svg').scrollIntoViewIfNeeded();const box=await page.locator('.c2-cell-svg').boundingBox(),[x,y]=points[cell][p.id];expect(box).toBeTruthy();await page.mouse.click(box!.x+x/680*box!.width,box!.y+y/460*box!.height);await expect(page.locator('.c2-part-card h2')).toHaveText(p.name);await expect(page.locator('.c2-part-job')).toHaveText(p.job);
  await page.locator(`g[data-part="${p.id}"]`).press('Enter');await expect(page.locator(`g[data-part="${p.id}"]`)).toHaveAttribute('aria-pressed','true');
 }await fits(page,cell+' explorer')}
 await page.getByLabel('Show advanced reference structures',{exact:true}).check();await page.locator('g[data-part="peroxisomes"]').press('Enter');await expect(page.locator('.c2-part-card h2')).toHaveText('Peroxisomes');await page.locator('.c2-part-card .c2-primary').click();await expect(page.locator('.c2-bank')).toBeVisible();
});

test('all five labeling levels complete for both cells with correct numbered hotspots and three-choice identification',async({page})=>{
 for(const cell of ['animal','plant'] as const)for(let level=1;level<=5;level++){
  await open(page,'label/');await page.getByRole('button',{name:cell==='animal'?'Animal cell':'Plant cell',exact:true}).click();await page.locator('.c2-levels button').nth(level-1).click();await page.getByRole('button',{name:'Let’s begin →',exact:true}).click();
  for(const id of labelSets[`${cell}-${level}`]){const t=await current(page);expect(t.id).toBe(id);if(t.targets)for(let a=0;a<t.targets.length;a++)for(let b=a+1;b<t.targets.length;b++){const p1=points[cell][t.targets[a]],p2=points[cell][t.targets[b]];expect(Math.hypot(p1[0]-p2[0],p1[1]-p2[1]),t.id+' target markers overlap').toBeGreaterThanOrEqual(48)}if(level===4){await expect(page.locator('.c2-bank')).toHaveCount(0);await expect(page.locator('.c2-choices button')).toHaveCount(3);await expect(page.locator('g[role="button"]')).toHaveCount(0)}else{await expect(page.locator('g[role="button"]')).toHaveCount(t.targets!.length);for(let i=0;i<t.targets!.length;i++)await expect(page.locator(`g[data-part="${t.targets![i]}"]`)).toHaveAttribute('aria-label',`Structure ${i+1}`)}await answer(page);await expect(page.locator('.c2-feedback h2')).toHaveText('You made the connection.');await next(page)}
  expect((await saved(page)).session!.complete).toBe(true);
 }
});

test('desktop drag onto the visible nucleus works, and paragraph tiles move, replace, clear and reset',async({page})=>{
 await begin(page,'label/');await page.setViewportSize({width:1280,height:1100});const t=await current(page),i=t.targets!.indexOf('nucleus');const svg=page.locator('.c2-cell-svg'),box=await svg.boundingBox(),point=points[t.cell as 'animal'|'plant'].nucleus;
 await page.locator('.c2-bank').getByRole('button',{name:'Nucleus',exact:true}).dragTo(svg,{targetPosition:{x:point[0]/680*box!.width,y:point[1]/460*box!.height}});await expect.poll(async()=>(await saved(page)).session!.selection[i]).toBe('nucleus');
 await open(page,'paragraphs/');await page.getByRole('button',{name:'Let’s begin →',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'Start new activity',exact:true}).click();const q=await current(page);await page.locator('.c2-bank').getByRole('button',{name:q.choices[0].label,exact:true}).dragTo(page.locator('.c2-slot').first());await expect.poll(async()=>(await saved(page)).session!.selection[0]).toBe(q.choices[0].id);
 await page.locator('.c2-bank').getByRole('button',{name:q.choices[0].label,exact:true}).click();await page.locator('.c2-slot').nth(1).click();expect((await saved(page)).session!.selection[0]).toBe('');await page.getByRole('button',{name:'Clear blank 2',exact:true}).click();await page.getByRole('button',{name:'Reset this paragraph / match',exact:true}).click();await fits(page,'word-bank paragraph');await finish(page,paragraphIds.length);
});

test('all fourteen jobs, matching rounds and analogy directions have feedback and fair retries',async({page})=>{
 await begin(page,'functions/');await page.getByRole('button',{name:'Need Help?',exact:true}).click();await expect(page.locator('.c2-help')).toBeVisible();await answer(page,true);const first=(await saved(page)).evidence[0];await expect(page.locator('.c2-feedback h2')).toBeFocused();await page.getByRole('button',{name:'Try again',exact:true}).click();await answer(page);expect((await saved(page)).evidence[0]).toEqual(first);await next(page);await finish(page,core.length-1);await page.getByRole('button',{name:'Try another round →',exact:true}).click();expect((await saved(page)).session!.ids).toEqual(functionSets.forward);
 await begin(page,'match/');await finish(page,matchIds.length);
 for(let set=0;set<3;set++){await open(page,'analogies/');if(set===0){await expect(page.locator('.c2-analogy-model')).toContainText('because both');for(let i=0;i<core.length-1;i++)await page.getByRole('button',{name:'Next model →',exact:true}).click();await expect(page.locator('.c2-analogy-model')).toContainText('Cytoskeleton')};await page.getByRole('group',{name:'Analogy practice',exact:true}).getByRole('button').nth(set).click();await page.getByRole('button',{name:'Let’s begin →',exact:true}).click();await finish(page,core.length)}
});

test('plant/animal and cell-type Venn sorting support real drag and every classification key',async({page})=>{
 await begin(page,'compare/');await page.locator('.c2-sort-tile button').dragTo(page.getByRole('button',{name:'Plant emphasis',exact:true}));await page.getByRole('button',{name:'Check my answer →',exact:true}).click();await expect(page.locator('.c2-feedback')).toContainText('You made the connection.');await next(page);await finish(page,core.length-1);
 await open(page,'types/');await expect(page.locator('.c2-types-lesson')).toContainText('nucleoid region');await expect(page.locator('.c2-note')).toContainText('ribosomes');await fits(page,'cell types comparison');await page.getByRole('button',{name:'Let’s begin →',exact:true}).click();await finish(page,9);
});

test('all fourteen analogy quests link a visible structure, its job, and the functional reason',async({page})=>{
 await begin(page,'quest/');for(let i=0;i<questIds.length;i++){const t=await current(page);if(i%3===0){expect(t.kind).toBe('diagram-pick');await expect(page.locator('.c2-number')).toHaveCount(cellParts(t.cell!).length)}await answer(page);await expect(page.locator('.c2-feedback h2')).toHaveText('You made the connection.');await next(page)}expect((await saved(page)).session!.complete).toBe(true);
});

test('20-question test hides hints, resumes, grades objective answers separately and offers fresh targeted review',async({page})=>{
 await begin(page,'test/');for(let i=0;i<testIds.length;i++){
  const t=await current(page);expect(t.id).toBe(testIds[i]);await expect(page.getByRole('button',{name:'Need Help?',exact:true})).toHaveCount(0);await expect(page.locator('.c2-help,.c2-feedback,.c2-results,.c2-checklist')).toHaveCount(0);
  if(i===8){await page.getByRole('button',{name:'← Save & take a break',exact:true}).click();await page.reload();await page.getByRole('button',{name:'Continue my saved activity',exact:true}).click();expect((await current(page)).id).toBe(t.id)}
  if(t.kind==='written'||t.kind==='bank')await fits(page,'test '+t.kind);await answer(page,i<3);
 }
 await expect(page.locator('.c2-results')).toContainText('83%');await expect(page.locator('.c2-results')).toContainText('15 of 18');await expect(page.locator('.c2-results')).toContainText('2 written analogies');await page.getByText('Review answers & written analogies',{exact:true}).click();await expect(page.locator('.c2-answer-review article')).toHaveCount(20);const old=(await saved(page)).evidence;await page.locator('.c2-review-links').getByRole('button',{name:'Cell jobs →',exact:true}).click();expect((await current(page)).id).toMatch(/^review-job-/);await answer(page);expect((await saved(page)).evidence.slice(0,20)).toEqual(old);
});

test('quick review changes examples and writing saves editable alternatives with a human checklist',async({page})=>{
 await begin(page,'quick/');const ids=(await saved(page)).session!.ids;await finish(page,12);await expect(page.locator('.c2-results')).toHaveCount(0);await page.getByRole('button',{name:'Try another round →',exact:true}).click();expect((await saved(page)).session!.ids).not.toEqual(ids);
 await open(page,'write/');await page.getByRole('button',{name:'Let’s begin →',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'Start new activity',exact:true}).click();await page.getByLabel('My analogy and explanation',{exact:true}).fill('A cell wall is like scaffolding because both support a structure.');await page.getByRole('button',{name:'Save my analogy →',exact:true}).click();await page.getByLabel('I explained its real job.',{exact:true}).check();await page.getByRole('button',{name:'Edit my analogy',exact:true}).click();await page.getByLabel('My analogy and explanation',{exact:true}).fill('A cell wall is like a building frame because both provide support.');await page.reload();await page.getByRole('button',{name:'Continue my saved activity',exact:true}).click();await expect(page.getByLabel('My analogy and explanation',{exact:true})).toHaveValue('A cell wall is like a building frame because both provide support.');
});

test('touch placement works on a phone and every main interaction stays inside four viewport widths',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const page=await context.newPage();await open(page,'label/');await page.getByRole('button',{name:'Plant cell',exact:true}).tap();await page.getByRole('button',{name:'Let’s begin →',exact:true}).tap();const t=await current(page);for(let i=0;i<t.answer.length;i++){await page.locator('.c2-bank').getByRole('button',{name:partById[t.answer[i] as keyof typeof partById].name,exact:true}).tap();await page.locator('.c2-slot').nth(i).tap()};await page.getByRole('button',{name:'Check my answer →',exact:true}).tap();await expect(page.locator('.c2-feedback')).toContainText('You made the connection.');await fits(page,'plant labels');await page.setViewportSize({width:390,height:844});await expect(page.locator('.c2-skip')).toHaveCSS('clip-path','inset(50%)');await page.locator('.c2-skip').focus();await expect(page.locator('.c2-skip')).toHaveCSS('clip-path','none');await page.locator('.c2-feedback h2').focus();await expect(page.locator('.c2-slot').first()).toHaveCSS('opacity','1');await page.screenshot({path:'test-results/concept2-label-mobile.png',fullPage:true});await context.close();
});

test('damaged and denied storage remain usable, activity switching confirms, and reset touches only Concept 2',async({page,browser})=>{
 await page.addInitScript(key=>{localStorage.setItem(key,'{damaged');localStorage.setItem('other-subject-check','keep')},KEY);await open(page);await expect(page.locator('.c2-notice')).toContainText('preserved');expect(await page.evaluate(key=>localStorage.getItem(key),KEY)).toBe('{damaged');await page.getByRole('button',{name:'Reset Concept 2',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'Reset Concept 2',exact:true}).click();expect(await page.evaluate(()=>localStorage.getItem('other-subject-check'))).toBe('keep');await expect(page.locator('.c2-notice')).toHaveCount(0);
 const context=await browser.newContext();const denied=await context.newPage();await denied.addInitScript(key=>{const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k===key)throw Error('blocked');return set.call(this,k,v)}},KEY);await begin(denied,'functions/');await expect(denied.locator('.c2-notice')).toContainText('Saving is unavailable');await denied.locator('.c2-choices button').first().click();await denied.getByRole('button',{name:'Check my answer →',exact:true}).click();await expect(denied.locator('.c2-feedback')).toBeVisible();await context.close();
});


test('school analogy areas, all function modes, supported writing and the protein pathway work',async({page})=>{
 await open(page,'school/');for(const [part,name] of [['nucleus','Principal’s office'],['golgi','Mailroom'],['mitochondria','Power supply'],['cytoskeleton','Building framework']]){await page.locator(`[data-school="${part}"]`).press('Enter');await expect(page.locator('.c2-part-card h2')).toContainText(name);await expect(page.locator('.c2-part-card')).toContainText(partById[part as keyof typeof partById].job);}
 await fits(page,'school analogy');await page.setViewportSize({width:1280,height:1000});await page.screenshot({path:'test-results/concept2-school-desktop.png',fullPage:true});await page.setViewportSize({width:390,height:844});await page.locator('[data-school="mitochondria"]').press('Enter');await expect(page.locator('.c2-school-layout article')).toBeFocused();await expect(page.locator('.c2-school-layout article .c2-cell-svg')).toHaveCSS('overflow','hidden');await page.screenshot({path:'test-results/concept2-school-phone.png',fullPage:true});
 for(const [i,key] of (['forward','reverse','complete','scenarios'] as const).entries()){await open(page,'functions/');await page.getByRole('group',{name:'Function practice mode',exact:true}).getByRole('button').nth(i).click();await page.getByRole('button',{name:'Let’s begin →',exact:true}).click();if(await page.getByRole('dialog').count())await page.getByRole('button',{name:'Start new activity',exact:true}).click();expect((await saved(page)).session!.ids).toEqual(functionSets[key]);await answer(page);await expect(page.locator('.c2-feedback')).toContainText('You made the connection.');}
 await open(page,'systems/');await page.getByRole('button',{name:'Let’s begin →',exact:true}).click();await page.getByRole('button',{name:'Start new activity',exact:true}).click();await fits(page,'protein journey');await page.locator('.c2-bank').getByRole('button',{name:'Rough ER',exact:true}).dragTo(page.locator('.c2-slot').nth(1));expect((await saved(page)).session!.selection[1]).toBe('rough-er');await finish(page,systemIds.length);
 await begin(page,'write/');await page.getByLabel('A familiar thing with a similar job (optional)',{exact:true}).fill('garden fence');await page.locator('.c2-writing-reasons button').first().click();await expect(page.getByLabel('My analogy and explanation',{exact:true})).toHaveValue('The cell wall is like a garden fence because both provide support and protection.');await fits(page,'writing support');await page.getByRole('button',{name:'Save my analogy →',exact:true}).click();await expect(page.locator('.c2-feedback')).toContainText('These boxes help you review');expect((await saved(page)).evidence.at(-1)!.assisted).toBe(true);
});
