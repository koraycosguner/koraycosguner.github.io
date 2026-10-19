import {test,expect,type Page} from '@playwright/test';
import {studyPath} from './paths';
import {questions,stories} from '../../spanish/unit3/content';
import {U3_KEY} from '../../spanish/unit3/learning';
import type {U3Question,U3Saved} from '../../spanish/unit3/types';
const ROOT='/quizzes/spanish/unit-3/';
const byId=new Map(questions.map(q=>[q.id,q]));
async function open(page:Page,path=ROOT){await page.goto(studyPath(path));await expect(page.locator('#unit3-main')).toHaveAttribute('aria-busy','false');}
async function saved(page:Page):Promise<U3Saved>{return page.evaluate(key=>JSON.parse(localStorage.getItem(key)!),U3_KEY);}
async function current(page:Page){await expect(page.locator('.u3-task')).toBeVisible();return byId.get((await page.locator('.u3-task').getAttribute('data-question'))!)!;}
async function select(page:Page,q:U3Question,correct=true){const ids=correct?q.answer:[q.choices.find(c=>!q.answer.includes(c.id))!.id];for(const id of ids)await page.locator(q.format==='choice'?'.u3-choices':'.u3-word-bank').getByRole('button',{name:q.choices.find(c=>c.id===id)!.label,exact:true}).click();}
async function answer(page:Page,correct=true){const q=await current(page);await select(page,q,correct);await page.getByRole('button',{name:/^(Check answer|Save answer & continue)$/}).click();return q;}
async function next(page:Page){await page.locator('.u3-feedback').getByRole('button',{name:/^(Continue|Try a fresh example)/}).click();}
async function fits(page:Page,label:string){for(const width of [320,390,768,1280]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${label} fits ${width}`).toBe(true);const controls=await page.locator('.u3-choices button,.u3-slot,.u3-primary').evaluateAll(nodes=>nodes.filter(n=>n.getBoundingClientRect().width>0).map(n=>({h:n.getBoundingClientRect().height,w:n.getBoundingClientRect().width})));expect(controls.every(n=>n.h>=44&&n.w>=44),`${label} touch controls`).toBe(true);}}

test('all five stories teach, finish and preserve the other units; calendar builds by drag and tap',async({page})=>{
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));await page.addInitScript(()=>localStorage.setItem('other-subject-test','saved-untouched'));await open(page);await fits(page,'home');await page.screenshot({path:'test-results/unit3-home-desktop.png',fullPage:true});
  for(const story of stories){
    if(!(await page.locator('.u3-story-list').getAttribute('open')))await page.locator('.u3-story-list summary').click();
    await page.locator('.u3-story-list').getByRole('button',{name:new RegExp(story.title.replace(/[?¿]/g,'.'))}).click();await expect(page.locator('.u3-story-text')).toHaveText(story.paragraph);await fits(page,`${story.id} intro`);
    if(story.id==='arrival'){await page.getByRole('button',{name:'English help',exact:true}).click();await expect(page.locator('.u3-reading')).toContainText(story.english);}
    await page.getByRole('button',{name:'Ready · Try the questions →',exact:true}).click();
    for(let step=0;step<8;step++){
      const q=await current(page);if(q.format==='order'){
        const token=page.locator('.u3-word-bank').getByRole('button',{name:q.choices.find(c=>c.id===q.answer[0])!.label,exact:true});await token.dragTo(page.locator('.u3-slot').first());await expect.poll(async()=>(await saved(page)).session!.selection).toEqual([q.answer[0]]);await page.locator('.u3-slot').first().click();
      }
      if(step===0)await fits(page,`${story.id} question`);await answer(page);await expect(page.locator('.u3-feedback')).toContainText('That’s it.');await next(page);
    }
    await expect(page.locator('.u3-result')).toContainText('8 of 8');await page.getByRole('button',{name:'Back to Unit 3',exact:true}).click();
  }
  const state=await saved(page);expect(state.completedStories).toHaveLength(5);expect(state.evidence).toHaveLength(40);expect(await page.evaluate(()=>localStorage.getItem('other-subject-test'))).toBe('saved-untouched');expect(errors).toEqual([]);
});

test('hints, wrong-first retry and fresh remediation survive refresh without inflating a grade',async({page})=>{
  await open(page);await page.getByRole('button',{name:'Start my school day',exact:true}).click();await page.getByRole('button',{name:'Ready · Try the questions →',exact:true}).click();const q=await current(page);
  await page.getByRole('button',{name:'Need help?',exact:true}).click();await expect(page.locator('.u3-help')).toContainText(q.hint);await answer(page,false);await expect(page.locator('.u3-feedback')).toContainText('Let’s look together.');await page.getByRole('button',{name:'Try this question again',exact:true}).click();await answer(page);await expect(page.locator('.u3-feedback')).toContainText('That’s it.');
  await page.reload();await page.getByRole('button',{name:'Continue where I left off →',exact:true}).click();await expect(page.locator('.u3-feedback')).toContainText('That’s it.');const state=await saved(page);expect(state.evidence).toHaveLength(1);expect(state.evidence[0].correct).toBe(false);expect(state.evidence[0].assisted).toBe(true);
  await next(page);const fresh=await current(page);expect(fresh.id).not.toBe(q.id);expect(fresh.parallelGroup).toBe(q.parallelGroup);await expect(page.locator('.u3-progress')).toContainText('One fresh try');
});

test('32-question test has no hints or immediate feedback, resumes, grades and reviews fresh skills',async({page})=>{
  await open(page,ROOT+'practice-test/');await page.getByRole('button',{name:'Start practice test →',exact:true}).click();
  for(let i=0;i<32;i++){
    await expect(page.getByRole('button',{name:'Need help?',exact:true})).toHaveCount(0);await expect(page.locator('.u3-feedback,.u3-help')).toHaveCount(0);
    if(i===5){const id=(await current(page)).id;await page.getByRole('button',{name:'← Save & take a break',exact:true}).click();await page.reload();await page.getByRole('button',{name:'Continue my saved practice test instead →',exact:true}).click();expect((await current(page)).id).toBe(id);}
    await answer(page,i>=4);
  }
  await expect(page.locator('.u3-score')).toContainText('88%');await expect(page.locator('.u3-score')).toContainText('28 of 32');const state=await saved(page);expect(state.evidence.every(row=>!row.assisted)).toBe(true);
  await page.getByText('Review my answers',{exact:true}).click();await expect(page.locator('.u3-answer-review>li')).toHaveCount(32);await page.getByRole('button',{name:'Practice my tricky skills',exact:true}).click();const fresh=await current(page);expect(state.seen).not.toContain(fresh.id);await fits(page,'targeted review');
});

test('both word-bank stories support pointer drag, tap placement, clearing and moving before checking',async({page})=>{
  await open(page,ROOT+'complete-story/');await page.getByRole('button',{name:'Let’s begin →',exact:true}).click();
  for(let i=0;i<2;i++){
    const q=await current(page);await fits(page,'word bank');await page.setViewportSize({width:1280,height:1400});const word=page.locator('.u3-word-bank').getByRole('button',{name:q.choices.find(c=>c.id===q.answer[0])!.label,exact:true});
    await word.hover();const target=await page.locator('.u3-slot').nth(2).boundingBox();expect(target).toBeTruthy();await page.mouse.down();await page.mouse.move(target!.x+target!.width/2,target!.y+target!.height/2,{steps:15});await page.mouse.move(target!.x+target!.width/2+2,target!.y+target!.height/2+2);await page.mouse.up();await expect.poll(async()=>(await saved(page)).session!.selection[2]).toBe(q.answer[0]);await page.locator('.u3-slot').nth(2).click();await page.locator('.u3-slot').nth(0).click();await word.click();await expect.poll(async()=>(await saved(page)).session!.selection[0]).toBe(q.answer[0]);await page.locator('.u3-slot').nth(0).click();
    await answer(page);await expect(page.locator('.u3-feedback')).toContainText('That’s it.');await next(page);
  }
  expect((await saved(page)).evidence.every(row=>row.assisted)).toBe(true);await expect(page.locator('.u3-result')).toContainText('2 of 2');
});

test('review categories, resume confirmation, scoped reset and keyboard operation',async({page})=>{
  await open(page,ROOT+'study-guide/');await page.getByLabel('Practice focus').selectOption('estar');await page.getByRole('button',{name:'Let’s begin →',exact:true}).click();expect((await current(page)).skill).toBe('estar');
  const button=page.locator('.u3-choices button').first();await button.focus();await page.keyboard.press('Space');await expect(button).toHaveAttribute('aria-pressed','true');await page.getByRole('button',{name:'← Save & take a break',exact:true}).click();await page.getByRole('button',{name:'Start my school day',exact:true}).click();await page.getByRole('button',{name:'Ready · Try the questions →',exact:true}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.getByRole('button',{name:'Keep my place',exact:true}).click();expect((await saved(page)).session!.mode).toBe('review');
  await page.getByRole('button',{name:'← Unit 3 home',exact:true}).click();await page.getByRole('button',{name:'My Unit 3 progress →',exact:true}).click();await page.getByRole('button',{name:'Reset Unit 3 progress',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'Reset Unit 3',exact:true}).click();expect((await saved(page)).session).toBeNull();
});

test('all new direct routes, integration link and visual assets load at phone tablet desktop',async({page})=>{
  await page.goto(studyPath('/quizzes/spanish/'));await expect(page.locator('.tc-unit3-entry')).toHaveAttribute('href',studyPath(ROOT));await page.locator('.tc-unit3-entry').click();await expect(page.locator('#unit3-main')).toHaveAttribute('aria-busy','false');
  for(const route of ['', 'complete-story/','study-guide/','practice-test/']){await open(page,ROOT+route);await page.reload();await expect(page.locator('#unit3-main')).toHaveAttribute('aria-busy','false');await fits(page,route||'home');}
  await open(page);await expect.poll(()=>page.locator('.u3-visual img').evaluateAll(nodes=>(nodes as HTMLImageElement[]).every(image=>image.complete&&image.naturalWidth>0))).toBe(true);
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:'test-results/unit3-home-mobile.png',fullPage:true});
});

test('damaged Unit 3 save is protected, storage denial is visible, and study remains available',async({page,browser})=>{
  await page.addInitScript(({key})=>{localStorage.setItem(key,'{broken');localStorage.setItem('unit2-preservation-check','keep-me')},{key:U3_KEY});await open(page);await expect(page.locator('.u3-notice')).toContainText('could not open');expect(await page.evaluate(key=>localStorage.getItem(key),U3_KEY)).toBe('{broken');
  await page.getByRole('button',{name:'Start my school day',exact:true}).click();await page.getByRole('button',{name:'Ready · Try the questions →',exact:true}).click();await answer(page);await expect(page.locator('.u3-feedback')).toContainText('That’s it.');expect(await page.evaluate(()=>localStorage.getItem('unit2-preservation-check'))).toBe('keep-me');
  const context=await browser.newContext();const denied=await context.newPage();await denied.addInitScript(({key})=>{const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k===key)throw new DOMException('blocked','QuotaExceededError');return set.call(this,k,v)}},{key:U3_KEY});await open(denied);await expect(denied.locator('.u3-notice')).toContainText('Saving is unavailable');await denied.getByRole('button',{name:'Start my school day',exact:true}).click();await denied.getByRole('button',{name:'Ready · Try the questions →',exact:true}).click();await answer(denied);await expect(denied.locator('.u3-feedback')).toBeVisible();await context.close();
});

test('optional story audio stops on navigation',async({page})=>{
  await page.addInitScript(()=>{
    const audit={calls:[] as string[],cancels:0};Object.defineProperty(window,'__u3audio',{value:audit});
    class Clip{text:string;lang='';rate=1;voice:unknown;onstart:(()=>void)|null=null;onend:(()=>void)|null=null;onerror:unknown;constructor(text:string){this.text=text}}
    Object.defineProperty(window,'SpeechSynthesisUtterance',{value:Clip,configurable:true});Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[{name:'Test Spanish',lang:'es-MX'}],cancel:()=>{audit.cancels++},addEventListener:()=>{},removeEventListener:()=>{},speak:(clip:Clip)=>{audit.calls.push(clip.text);setTimeout(()=>clip.onstart?.(),0)}},configurable:true});
  });await open(page);await page.getByRole('button',{name:'Start my school day',exact:true}).click();await page.getByRole('button',{name:'Listen slowly',exact:true}).click();await expect(page.getByRole('button',{name:'Stop audio',exact:true})).toBeVisible();await page.getByRole('button',{name:'Ready · Try the questions →',exact:true}).click();await expect(page.locator('.u3-task')).toBeVisible();const audit=await page.evaluate(()=>(window as unknown as {__u3audio:{calls:string[];cancels:number}}).__u3audio);expect(audit.calls).toHaveLength(1);expect(audit.cancels).toBeGreaterThanOrEqual(2);
});
