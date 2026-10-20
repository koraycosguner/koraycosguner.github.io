import {test,expect,type Page,type Locator} from '@playwright/test';
import {studyPath} from './paths';
import {questions,scenes,typedPrompts,worksheetIds} from '../../science/cells/content';
import {CELLS_KEY} from '../../science/cells/learning';
import type {CellQuestion,CellSaved} from '../../science/cells/types';
const ROOT='/subjects/science/cells/concept-1/';
const byId=new Map(questions.map(q=>[q.id,q]));
async function open(page:Page,path=ROOT){await page.goto(studyPath(path));await expect(page.locator('#cells-main')).toHaveAttribute('aria-busy','false');}
async function saved(page:Page):Promise<CellSaved>{return page.evaluate(key=>JSON.parse(localStorage.getItem(key)!),CELLS_KEY);}
async function current(page:Page){await expect(page.locator('.cells-task[data-question]')).toBeVisible();return byId.get((await page.locator('.cells-task').getAttribute('data-question'))!)!;}
async function select(page:Page,q:CellQuestion,correct=true){
 const ids=correct?q.answer:q.format==='choice'?[q.choices.find(c=>!q.answer.includes(c.id))!.id]:[...q.answer.slice(1),q.answer[0]];
 for(let i=0;i<ids.length;i++){
  await page.locator(q.format==='choice'?'.cells-choices':'.cells-word-bank').getByRole('button',{name:q.choices.find(c=>c.id===ids[i])!.label,exact:true}).click();
  if(q.format!=='choice')await page.locator('.cells-slot').nth(i).click();
 }
}
async function answer(page:Page,correct=true){const q=await current(page);await select(page,q,correct);await page.getByRole('button',{name:/^(Check my answer|Save answer & continue)$/}).click();return q;}
async function next(page:Page){await page.locator('.cells-feedback').getByRole('button',{name:'Continue →',exact:true}).click();}
async function fits(page:Page,label:string){for(const width of [320,390,768,1280]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${label} fits ${width}`).toBe(true);const controls=await page.locator('.cells-choices button,.cells-slot,.cells-primary,.cells-clear').evaluateAll(nodes=>nodes.filter(n=>n.getBoundingClientRect().width>0).map(n=>({h:n.getBoundingClientRect().height,w:n.getBoundingClientRect().width})));expect(controls.every(n=>n.h>=44&&n.w>=44),`${label} touch controls`).toBe(true);}}
async function drag(page:Page,source:Locator,target:Locator){await source.hover();const box=await target.boundingBox();expect(box).toBeTruthy();await page.mouse.down();await page.mouse.move(box!.x+box!.width/2,box!.y+box!.height/2,{steps:15});await page.mouse.move(box!.x+box!.width/2+2,box!.y+box!.height/2+2);await page.mouse.up();}

test('Science integration, five connected scenes, timeline and concepts work at four widths',async({page})=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));await page.goto(studyPath('/subjects/science/'));await page.getByRole('link',{name:'Explore Cells →',exact:true}).click();await page.getByRole('link',{name:/CONCEPT 1 Cell Theory/}).click();await expect(page.locator('#cells-main')).toHaveAttribute('aria-busy','false');await fits(page,'lesson home');await page.screenshot({path:'test-results/cells-home-desktop.png',fullPage:true});await page.getByRole('button',{name:'Read the story',exact:true}).click();
 for(let index=0;index<scenes.length;index++){
  const scene=scenes[index];await expect(page.getByRole('heading',{level:1})).toHaveText(scene.title);await expect(page.locator('.cells-narrative')).toContainText(scene.sentences[0]);await expect(page.locator('.cells-discovery')).toContainText(scene.discovery);await expect(page.locator('.cells-bridge')).toHaveText(scene.bridge);await expect(page.locator('[data-cell-visual]')).toHaveAttribute('data-cell-visual',scene.id);await expect.poll(()=>page.locator('.ctv-picture img').evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true);
  await page.getByText('Look closer at the discovery',{exact:false}).click();await expect(page.locator('.ctv-diagram')).toBeVisible();await fits(page,scene.id);await page.screenshot({path:`test-results/cells-story-${scene.id}-desktop.png`,fullPage:true});await page.setViewportSize({width:390,height:844});await page.screenshot({path:`test-results/cells-story-${scene.id}-mobile.png`,fullPage:true});await page.getByRole('button',{name:index===4?'Connect the discoveries →':'Next discovery →',exact:true}).click();
 }
 await expect(page.locator('.cells-principles article')).toHaveCount(3);await expect(page.locator('.cells-timeline li')).toHaveCount(5);await fits(page,'concept map');await page.getByRole('button',{name:'Try building the timeline →',exact:true}).click();await page.getByRole('button',{name:'Let’s begin →',exact:true}).click();await answer(page);await expect(page.locator('.cells-feedback')).toContainText('That’s it.');expect(errors).toEqual([]);
});

test('timeline drag, tap move, replace, clear, undo and keyboard placement survive refresh',async({page})=>{
 await open(page);await page.getByRole('button',{name:'Practice what you learned',exact:true}).click();await page.getByRole('button',{name:'Build the timeline',exact:true}).click();await page.getByRole('button',{name:'Let’s begin →',exact:true}).click();await page.setViewportSize({width:1280,height:1400});const q=await current(page),bank=page.locator('.cells-word-bank');
 await drag(page,bank.getByRole('button',{name:'Robert Hooke',exact:true}),page.locator('.cells-slot').nth(2));await expect.poll(async()=>(await saved(page)).session!.selection[2]).toBe('hooke');
 await drag(page,page.locator('.cells-slot').nth(2),page.locator('.cells-slot').first());await expect.poll(async()=>(await saved(page)).session!.selection).toEqual(['hooke','','','','']);await page.getByRole('button',{name:'Undo last move',exact:true}).click();await expect.poll(async()=>(await saved(page)).session!.selection).toEqual(['','','hooke','','']);
 await bank.getByRole('button',{name:/Robert Hooke/}).click();await page.locator('.cells-slot').first().click();await bank.getByRole('button',{name:'Anton van Leeuwenhoek',exact:true}).focus();await page.keyboard.press('Enter');await page.locator('.cells-slot').nth(1).focus();await page.keyboard.press('Enter');await expect.poll(async()=>(await saved(page)).session!.selection.slice(0,2)).toEqual(['hooke','leeuwenhoek']);
 await page.reload();await page.getByRole('button',{name:'Continue my saved activity →',exact:true}).click();await expect(page.locator('.cells-slot').first()).toContainText('Robert Hooke');await page.getByRole('button',{name:'Clear space 1',exact:true}).click();await bank.getByRole('button',{name:'Robert Hooke',exact:true}).click();await page.locator('.cells-slot').nth(1).click();expect((await saved(page)).session!.selection[1]).toBe('hooke');await page.getByRole('button',{name:'Undo last move',exact:true}).click();await page.getByRole('button',{name:'Clear space 2',exact:true}).click();await select(page,q);await page.getByRole('button',{name:'Check my answer',exact:true}).click();await expect(page.locator('.cells-feedback h2')).toBeFocused();await next(page);await expect(page.getByRole('heading',{level:1})).toHaveText('You followed the evidence.');
});

test('worksheet A–E completes, wrong-first retry stays immutable, and all five written responses persist',async({page})=>{
 await open(page,ROOT+'worksheet/');await page.getByRole('button',{name:'Let’s begin →',exact:true}).click();
 for(let i=0;i<worksheetIds.length;i++){
  const q=await current(page);expect(q.id).toBe(worksheetIds[i]);await fits(page,q.id);
  if(i===0){await page.getByRole('button',{name:'A small clue',exact:true}).click();await expect(page.locator('.cells-help')).toContainText(q.hint);await answer(page,false);await expect(page.locator('.cells-feedback h2')).toBeFocused();await page.getByRole('button',{name:'Try this again',exact:true}).click();await expect(page.getByRole('heading',{level:1})).toBeFocused();}
  await answer(page);await expect(page.locator('.cells-feedback')).toContainText('That’s it.');await next(page);
 }
 expect((await saved(page)).evidence[0].correct).toBe(false);expect((await saved(page)).evidence[0].assisted).toBe(true);await expect(page.locator('.cells-result')).toHaveCount(0);await page.getByRole('button',{name:'Section F · Write my explanations →',exact:true}).click();
 for(let i=0;i<typedPrompts.length;i++){
  await expect(page.getByRole('heading',{level:1})).toHaveText(typedPrompts[i].prompt);await expect(page.locator('.cells-model')).toHaveCount(0);await expect(page.getByRole('button',{name:'Compare with a sample answer',exact:true})).toBeDisabled();await page.getByLabel('My explanation').fill(`My own explanation ${i+1}: cells help us understand living things.`);await page.getByRole('button',{name:'Compare with a sample answer',exact:true}).click();await expect(page.locator('.cells-model')).toContainText(typedPrompts[i].model);await page.getByLabel('My explanation').fill(`Edited explanation ${i+1}.`);await fits(page,'writing');await page.getByRole('button',{name:i===4?'Save & finish →':'Next response →',exact:true}).click();
 }
 await page.reload();await page.getByRole('button',{name:'Open my written responses',exact:true}).click();await expect(page.getByLabel('My explanation')).toHaveValue('Edited explanation 1.');expect((await saved(page)).evidence).toHaveLength(worksheetIds.length);expect(Object.values((await saved(page)).typed)).toHaveLength(5);
});

test('paragraph supports pointer drag and mobile tap placement with immediate retry feedback',async({page})=>{
 await open(page,ROOT+'paragraph/');await page.getByRole('button',{name:'Let’s begin →',exact:true}).click();await page.setViewportSize({width:1280,height:1400});const q=await current(page);await drag(page,page.locator('.cells-word-bank').getByRole('button',{name:'cork',exact:true}),page.locator('.cells-slot').first());await expect.poll(async()=>(await saved(page)).session!.selection[0]).toBe('cork');await page.getByRole('button',{name:'Clear space 1',exact:true}).click();await page.setViewportSize({width:390,height:844});await select(page,q);await page.screenshot({path:'test-results/cells-paragraph-mobile.png',fullPage:true});await page.getByRole('button',{name:'Check my answer',exact:true}).click();await expect(page.locator('.cells-feedback')).toContainText('That’s it.');await next(page);await expect(page.locator('.cells-result')).toHaveCount(0);
});

test('18-question quiz with all formats hides answers, resumes, grades and offers fresh review',async({page})=>{
 await open(page,ROOT+'quiz/');await page.getByRole('button',{name:'Start 18-question quiz →',exact:true}).click();const wrongIds:string[]=[];
 for(let i=0;i<18;i++){
  await expect(page.locator('.cells-feedback,.cells-help,.cells-model,.cells-result')).toHaveCount(0);await expect(page.getByRole('button',{name:'A small clue',exact:true})).toHaveCount(0);await expect(page.getByText('Review my answers',{exact:true})).toHaveCount(0);const q=await current(page);
  if(i===5){await page.getByRole('button',{name:'← Save & take a break',exact:true}).click();await page.reload();await page.getByRole('button',{name:'Continue my saved cell theory quiz instead →',exact:true}).click();expect((await current(page)).id).toBe(q.id);}
  if(q.format!=='choice')await fits(page,`quiz ${q.format}`);await answer(page,i>=3);if(i<3)wrongIds.push(q.id);
 }
 await expect(page.locator('.cells-result')).toContainText('83%');await expect(page.locator('.cells-result')).toContainText('Practice grade B');await expect(page.locator('.cells-result')).toContainText('15 of 18');await page.getByText('Review my answers',{exact:true}).click();await expect(page.locator('.cells-answer-review>li')).toHaveCount(18);const before=await saved(page);expect(before.evidence.filter(row=>!row.correct).map(row=>row.questionId)).toEqual(wrongIds);await page.getByRole('button',{name:'Practice my tricky skills',exact:true}).click();const fresh=await current(page);expect(fresh.review).toBe(true);expect(before.seen).not.toContain(fresh.id);await answer(page);await expect(page.locator('.cells-feedback')).toBeVisible();
});

test('new activity confirmation and scoped reset preserve other subjects',async({page})=>{
 await open(page,ROOT+'worksheet/');await page.evaluate(()=>localStorage.setItem('other-subject-preservation-check','keep'));await page.getByRole('button',{name:'Let’s begin →',exact:true}).click();await answer(page);await page.getByRole('button',{name:'← Save & take a break',exact:true}).click();await page.getByRole('button',{name:'Practice what you learned',exact:true}).click();await page.getByRole('link',{name:/Cell Theory quiz/}).click();await page.getByRole('button',{name:'Start 18-question quiz →',exact:true}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);expect((await saved(page)).session!.mode).toBe('worksheet');await expect(page.getByRole('button',{name:'Start 18-question quiz →',exact:true})).toBeFocused();
 await page.getByRole('button',{name:'Reset this lesson',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'Reset Cell Theory',exact:true}).click();expect((await saved(page)).session).toBeNull();expect(await page.evaluate(()=>localStorage.getItem('other-subject-preservation-check'))).toBe('keep');
});

test('damaged save and blocked storage stay usable; images have instructional fallback',async({page,browser})=>{
 await page.addInitScript(key=>localStorage.setItem(key,'{damaged'),CELLS_KEY);await page.route('**/quizzes/cells/concept-1/hooke.webp',route=>route.abort());await open(page);await expect(page.locator('.cells-notice')).toContainText('could not open');expect(await page.evaluate(key=>localStorage.getItem(key),CELLS_KEY)).toBe('{damaged');await expect(page.locator('.ctv-fallback')).toBeVisible();await page.getByRole('button',{name:'Read the story',exact:true}).click();await expect(page.getByRole('heading',{level:1})).toHaveText('The first clue');await fits(page,'image fallback');
 const context=await browser.newContext();const denied=await context.newPage();await denied.addInitScript(key=>{const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k===key)throw new DOMException('blocked','QuotaExceededError');return set.call(this,k,v)}},CELLS_KEY);await open(denied,ROOT+'paragraph/');await expect(denied.locator('.cells-notice')).toContainText('Saving is unavailable');await denied.getByRole('button',{name:'Let’s begin →',exact:true}).click();await answer(denied);await expect(denied.locator('.cells-feedback')).toBeVisible();await context.close();
});

test('every Cells route supports direct loading and refresh; internal links retain the base path',async({page})=>{
 for(const tail of ['', 'worksheet/','paragraph/','quiz/']){await open(page,ROOT+tail);await page.reload();await expect(page.locator('#cells-main')).toHaveAttribute('aria-busy','false');await fits(page,tail||'home');const links=await page.locator('.cells-app a[href^="/"]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));expect(links.every(link=>link!.startsWith(process.env.TEST_PATH_PREFIX??'/'))).toBe(true);}
 await page.goto(studyPath('/subjects/science/cells/'));await expect(page.getByRole('heading',{level:1})).toContainText('Small cells.');await fits(page,'Cells shelf');await page.setViewportSize({width:390,height:844});await page.screenshot({path:'test-results/cells-shelf-mobile.png',fullPage:true});
});

test('tablet touch placement works and the two editable Word downloads load separately',async({browser})=>{
 const context=await browser.newContext({viewport:{width:768,height:1024},hasTouch:true,isMobile:true});const page=await context.newPage();
 await open(page,ROOT+'paragraph/');await page.getByRole('button',{name:'Let’s begin →',exact:true}).tap();const q=await current(page);
 for(let index=0;index<q.answer.length;index++){await page.locator('.cells-word-bank').getByRole('button',{name:q.choices.find(choice=>choice.id===q.answer[index])!.label,exact:true}).tap();await page.locator('.cells-slot').nth(index).tap();}
 await page.getByRole('button',{name:'Check my answer',exact:true}).tap();await expect(page.locator('.cells-feedback')).toContainText('That’s it.');await open(page,ROOT+'worksheet/');await page.getByText('Use the editable Word worksheet offline',{exact:true}).tap();
 for(const name of ['worksheet','answer-key']){const link=page.locator(`a[href$="cell-theory-${name}.docx"]`);await expect(link).toBeVisible();const response=await page.request.get((await link.getAttribute('href'))!);expect(response.status()).toBe(200);expect((await response.body()).subarray(0,2).toString()).toBe('PK');}
 await context.close();
});
