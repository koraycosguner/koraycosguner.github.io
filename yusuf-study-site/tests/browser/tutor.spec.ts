import {test,expect,type Page} from '@playwright/test';
import {studyPath} from './paths';
import {tutorQuestions,tutorWords} from '../../spanish/tutor-content';
import {TUTOR_KEY,newTutor,startTutor,currentQuestion,chooseTutor,submitTutor} from '../../spanish/tutor-learning';
import type {TutorQuestion,TutorSaved} from '../../spanish/tutor-types';
const ROOT='/quizzes/spanish/unit-2/';
async function open(page:Page,route='/quizzes/spanish/') {await page.goto(studyPath(route));await expect(page.locator('.tc-shell')).toHaveAttribute('data-ready','true');}
async function record(page:Page):Promise<TutorSaved>{return page.evaluate(key=>JSON.parse(localStorage.getItem(key)!),TUTOR_KEY);}
async function fakeVoice(page:Page,starts=true){await page.addInitScript(({starts})=>{
  const audit={calls:[] as {text:string;lang:string;rate:number}[],cancels:0,starts};
  Object.defineProperty(window,'__tutorAudio',{value:audit,configurable:true});
  class Utterance {text:string;lang='';rate=1;pitch=1;volume=1;voice:unknown;onstart:(()=>void)|null=null;onend:(()=>void)|null=null;onerror:((error:unknown)=>void)|null=null;constructor(text:string){this.text=text}}
  Object.defineProperty(window,'SpeechSynthesisUtterance',{value:Utterance,configurable:true});
  Object.defineProperty(window,'speechSynthesis',{value:{paused:false,getVoices:()=>[{name:'Spanish natural test voice',lang:'es-MX',localService:true}],cancel:()=>{audit.cancels++},resume:()=>{},addEventListener:()=>{},removeEventListener:()=>{},speak:(utterance:Utterance)=>{audit.calls.push({text:utterance.text,lang:utterance.lang,rate:utterance.rate});if(audit.starts)setTimeout(()=>utterance.onstart?.(),0)}},configurable:true});
},{starts});}
async function seed(page:Page,state:TutorSaved){await page.addInitScript(({key,value})=>{if(!localStorage.getItem(key))localStorage.setItem(key,value)},{key:TUTOR_KEY,value:JSON.stringify(state)});}
function withQuestions(questions:TutorQuestion[]):TutorSaved {const base=newTutor();return {...base,nextSession:2,session:{id:1,mode:'practice',tasks:questions.map(question=>({kind:'question',questionId:question.id,scaffold:0})),index:0,selection:[],feedback:false,hintLevel:0,complete:false,assisted:false,audioPlayed:false,introduced:[],remediations:0}};}
async function teachToQuestion(page:Page){
  for(let i=0;i<40;i++) {
    await expect(page.locator('.tc-lesson,.tc-question,.tc-checkpoint,.tc-result')).toBeVisible();
    if(await page.locator('.tc-question,.tc-result').count())return;
    if(await page.locator('.tc-lesson').count())await page.locator('.tc-lesson').getByRole('button',{name:'Got it. Continue →',exact:true}).click();
    else await page.locator('.tc-checkpoint').getByRole('button',{name:'Continue →',exact:true}).click();
  }
  throw Error('Teaching did not reach a question');
}
async function choose(page:Page,q:TutorQuestion,correct=true){
  const ids=correct?q.answer:q.format==='sentence-build'?[...q.answer].reverse():[q.choices.find(choice=>!q.answer.includes(choice.id))!.id];
  for(const id of ids){const choice=q.choices.find(choice=>choice.id===id)!;
    if(q.format==='sentence-build')await page.locator('.tc-word-bank').getByRole('button',{name:choice.label,exact:true}).click();
    else if(q.format==='word-bank'){await page.locator('.tc-word-bank').getByRole('button',{name:choice.label,exact:true}).click();await page.locator('.tc-fill-slot').click();}
    else await page.locator(`[data-choice="${id}"]`).click();
  }
}
async function answer(page:Page,correct=true,help=false){
  await teachToQuestion(page);const id=await page.locator('.tc-question').getAttribute('data-question');const q=tutorQuestions.find(question=>question.id===id)!;expect(q).toBeTruthy();
  if(q.format.startsWith('listen-')) {await page.getByRole('button',{name:'Play the listening clip',exact:true}).click();await expect.poll(async()=>(await record(page)).session!.audioPlayed).toBe(true);}
  if(help)await page.getByRole('button',{name:'Need a hint?',exact:true}).click();
  await choose(page,q,correct);await page.locator('.tc-actions').getByRole('button',{name:/^(Check answer|Save answer & next|Finish test)/}).click();return q;
}
async function continueFeedback(page:Page){await page.locator('.tc-feedback').getByRole('button',{name:/^(Continue|Try one like it)/}).click();}
async function complete(page:Page){
  for(let i=0;i<40;i++){await teachToQuestion(page);if(await page.locator('.tc-result').count())return;await answer(page);if(await page.locator('.tc-feedback').count())await continueFeedback(page);}
  throw Error('Session did not finish');
}
async function fits(page:Page,label:string){
  await page.locator('.tc-card img,.tc-mission img').evaluateAll(images=>images.forEach(image=>(image as HTMLImageElement).loading='eager'));
  await expect.poll(()=>page.locator('.tc-card img,.tc-mission img').evaluateAll(images=>(images as HTMLImageElement[]).filter(image=>!image.complete||image.naturalWidth===0).map(image=>image.src)),{message:`${label}: instructional images load`}).toEqual([]);
  await page.locator('.tc-card img,.tc-mission img').evaluateAll(images=>Promise.all((images as HTMLImageElement[]).map(image=>image.decode())));
  for(const width of [320,390,768,1280]){
  await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${label}: ${width}px`).toBe(true);
  const clipped=await page.locator('.tc-card button,.tc-mission button').evaluateAll(buttons=>buttons.flatMap(button=>{
    const bounds=button.getBoundingClientRect();if(!bounds.width||!bounds.height)return [];
    for(let parent=button.parentElement;parent;parent=parent.parentElement){if(!['hidden','clip','auto','scroll'].includes(getComputedStyle(parent).overflowX))continue;const clip=parent.getBoundingClientRect();if(bounds.left<clip.left-1||bounds.right>clip.right+1)return [button.textContent];}return [];
  }));expect(clipped,`${label}: controls not clipped at ${width}px`).toEqual([]);
  expect(await page.locator('.tc-options button,.tc-word-bank button,.tc-audio,.tc-primary').evaluateAll(buttons=>buttons.filter(button=>button.getBoundingClientRect().width>0).every(button=>button.getBoundingClientRect().height>=44)),`${label}: touch controls at ${width}px`).toBe(true);
}}

test('guided mission teaches, corrects a miss with a fresh example, saves exact progress and finishes',async({page})=>{
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));await fakeVoice(page);await open(page);
  await expect(page.locator('.tc-paths a')).toHaveCount(6);await expect(page.getByRole('button',{name:'Start studying',exact:true})).toBeVisible();await fits(page,'home');await page.screenshot({path:'test-results/tutor-home-desktop.png',fullPage:true});
  await page.getByRole('button',{name:'Start studying',exact:true}).click();await expect(page.locator('.tc-lesson')).toBeVisible();await expect(page.locator('.tc-options')).toHaveCount(0);await fits(page,'tiny lesson');
  await teachToQuestion(page);const first=await answer(page,false);await expect(page.locator('.tc-feedback')).toContainText('Let’s look at one thing.');await expect(page.locator('.tc-feedback')).toContainText(first.model);
  await page.reload();await page.getByRole('button',{name:'Continue my saved session →',exact:true}).click();await expect(page.locator('.tc-question')).toHaveAttribute('data-question',first.id);await expect(page.locator('.tc-feedback')).toBeVisible();
  await continueFeedback(page);await teachToQuestion(page);const secondId=await page.locator('.tc-question').getAttribute('data-question');expect(secondId).not.toBe(first.id);expect(tutorQuestions.find(q=>q.id===secondId)!.parallelGroup).toBe(first.parallelGroup);await expect(page.locator('.tc-question')).toContainText('fresh example');
  await complete(page);await expect(page.locator('.tc-result')).toBeVisible();const saved=await record(page);expect(saved.session!.complete).toBe(true);expect(saved.evidence.find(row=>row.questionId===first.id)!.firstCorrect).toBe(false);expect(saved.evidence.some(row=>row.assisted)).toBe(true);expect(saved.sessionsCompleted).toBe(1);expect(errors).toEqual([]);
});

test('18-question teacher test hides answers and aids until grading, then misses drive fresh review',async({page})=>{
  await fakeVoice(page);await open(page,ROOT+'test/');await page.getByRole('button',{name:'Start 18-question test →',exact:true}).click();const missed:string[]=[];
  for(let index=0;index<18;index++){
    await expect(page.locator('.tc-question')).toBeVisible();await expect(page.locator('.tc-feedback,.tc-worked,.tc-chain,.tc-question-visual,.tc-question .tc-audio')).toHaveCount(0);await expect(page.getByRole('button',{name:'Quick reference',exact:true})).toHaveCount(0);await expect(page.getByRole('button',{name:'Need a hint?',exact:true})).toHaveCount(0);
    if(index===3){await page.getByRole('button',{name:'Pause & save',exact:true}).click();await expect(page.getByRole('button',{name:'Quick reference',exact:true})).toHaveCount(0);await page.getByRole('button',{name:'Continue my session →',exact:true}).click();}
    const q=await answer(page,![0,4,8,11,14].includes(index));if([0,4,8,11,14].includes(index))missed.push(q.id);await expect.poll(async()=>(await record(page)).session!.index).toBe(index+1);
  }
  await expect(page.locator('.tc-score')).toContainText('13 / 18 first answers correct');await expect(page.locator('.tc-score strong')).toHaveText('72%');await expect(page.locator('.tc-result-groups')).toContainText('Listening');await expect(page.locator('.tc-result-groups')).toContainText('Not assessed');await fits(page,'test results');
  const saved=await record(page);expect(saved.evidence).toHaveLength(18);expect(saved.evidence.every(row=>!row.assisted)).toBe(true);await page.reload();await open(page);await page.getByRole('button',{name:'View my last result →',exact:true}).click();await expect(page.locator('.tc-score')).toContainText('13 / 18');
  await page.getByRole('button',{name:'Review my misses →',exact:true}).click();await expect(page.locator('.tc-miss')).toContainText('Your answer:');await page.getByRole('button',{name:'Practice this skill →',exact:true}).click();await teachToQuestion(page);const fresh=await page.locator('.tc-question').getAttribute('data-question');expect(missed).not.toContain(fresh);expect(saved.seen).not.toContain(fresh);
});

test('all ten interaction formats work with replay, tap-to-place, sentence order and large touch controls',async({page})=>{
  const formats=[...new Set(tutorQuestions.map(question=>question.format))];const questions=formats.map(format=>tutorQuestions.find(question=>question.format===format)!);
  await fakeVoice(page);await seed(page,withQuestions(questions));await open(page);await page.getByRole('button',{name:'Continue my saved session →',exact:true}).click();
  for(const q of questions){await expect(page.locator('.tc-question')).toHaveAttribute('data-question',q.id);await fits(page,q.format);
    if(q.format.startsWith('listen-')){await expect(page.getByRole('button',{name:'Check answer →',exact:true})).toBeDisabled();await page.getByRole('button',{name:'Play the listening clip',exact:true}).click();await expect.poll(async()=>(await record(page)).session!.audioPlayed).toBe(true);await page.getByRole('button',{name:'Play the listening clip',exact:true}).click();}
    if(q.format==='sentence-build'){
      const word=page.locator('.tc-word-bank').getByRole('button',{name:q.choices.find(choice=>choice.id===q.answer[0])!.label,exact:true});await word.click();await expect(page.getByRole('button',{name:'Check answer →',exact:true})).toBeDisabled();await page.locator('.tc-sentence-slots button').first().click();
      await word.dragTo(page.locator('.tc-drop-slot'));await expect.poll(async()=>(await record(page)).session!.selection).toEqual([q.answer[0]]);await page.locator('.tc-sentence-slots button').first().click();
    }
    if(q.format==='word-bank'){
      const word=page.locator('.tc-word-bank').getByRole('button',{name:q.choices.find(choice=>choice.id===q.answer[0])!.label,exact:true});await word.dragTo(page.locator('.tc-fill-slot'));await expect.poll(async()=>(await record(page)).session!.selection).toEqual(q.answer);await page.locator('.tc-fill-slot').click();
    }
    await answer(page);await expect(page.locator('.tc-feedback')).toContainText('You’ve got it');await continueFeedback(page);
  }
  await expect(page.locator('.tc-result')).toBeVisible();const saved=await record(page);expect(saved.evidence).toHaveLength(formats.length);expect(saved.evidence.every(row=>row.assisted===(row.format==='sentence-build'))).toBe(true);
  const calls=await page.evaluate(()=>(window as unknown as {__tutorAudio:{calls:{text:string;lang:string;rate:number}[];cancels:number}}).__tutorAudio);expect(calls.calls.length).toBeGreaterThanOrEqual(10);expect(calls.calls.every(call=>call.lang==='es-MX'&&call.rate===.92)).toBe(true);expect(calls.cancels).toBeGreaterThanOrEqual(calls.calls.length);
});

test('audio only counts after confirmed playback; fallback reading works and never earns listening mastery',async({page})=>{
  const question=tutorQuestions.find(q=>q.format==='listen-word')!;await fakeVoice(page,false);await seed(page,withQuestions([question]));await open(page);await page.getByRole('button',{name:'Continue my saved session →',exact:true}).click();
  await page.getByRole('button',{name:'Play the listening clip',exact:true}).click();await choose(page,question);expect((await record(page)).session!.audioPlayed).toBe(false);await expect(page.getByRole('button',{name:'Check answer →',exact:true})).toBeDisabled();
  await page.getByRole('button',{name:'Read instead',exact:true}).click();await expect(page.locator('.tc-help')).toContainText(question.audio!);await page.getByRole('button',{name:'Check answer →',exact:true}).click();await continueFeedback(page);expect((await record(page)).evidence[0]).toMatchObject({firstCorrect:true,assisted:true,audioPlayed:false});await expect(page.locator('.tc-result-groups').getByText('Listening',{exact:true}).locator('..')).toContainText('Not assessed');
});

test('vocabulary cards show every assigned word with working assets, context and pronunciation',async({page})=>{
  test.setTimeout(120000);await fakeVoice(page);await open(page,ROOT+'vocabulary/');const groups=[...new Set(tutorWords.map(word=>word.group))];let count=0;
  for(const group of groups){await page.getByLabel('Choose a collection').selectOption(group);const words=tutorWords.filter(word=>word.group===group);
    for(const word of words){const card=page.locator('.tc-word-card');await expect(card).toHaveAttribute('data-word',word.id);await expect(card.getByRole('heading')).toHaveText(word.word);await expect(card).toContainText(word.sentence);await expect(card.locator('.tc-help')).toHaveCount(0);await expect(card.locator('svg,img').first()).toBeVisible();await page.getByRole('button',{name:`Play pronunciation for ${word.word}`,exact:true}).click();await page.getByRole('button',{name:'Need the English meaning?',exact:true}).click();await expect(card.locator('.tc-help')).toHaveText(word.english);await page.getByRole('button',{name:'Next word →',exact:true}).click();count++;
    }
  }
  expect(count).toBe(tutorWords.length);await fits(page,'vocabulary cards');await page.setViewportSize({width:390,height:844});await page.screenshot({path:'test-results/tutor-vocabulary-mobile.png',fullPage:true});
});

test('keyboard dialogs, saved selection, reset isolation, empty review and blocked storage remain usable',async({page})=>{
  const keep={'yusuf.spanish.unit2.v1':'{"keep":"old quiz"}','yusuf.spanish.proficiency.v1':'{"keep":"old prep"}','yusuf-ecology-v1':'{"keep":"ecology"}'};await fakeVoice(page);await open(page);await page.evaluate(values=>{for(const [key,value] of Object.entries(values))localStorage.setItem(key,value)},keep);
  await page.getByRole('button',{name:'Practice what I missed',exact:false}).click();await expect(page.locator('.tc-empty')).toBeVisible();await page.locator('.tc-brand').focus();await page.keyboard.press('Shift+Tab');await expect(page.locator('.tc-skip')).toBeFocused();
  await page.getByRole('button',{name:'Start studying',exact:true}).click();await teachToQuestion(page);
  const id=await page.locator('.tc-question').getAttribute('data-question');const question=tutorQuestions.find(item=>item.id===id)!;await page.locator('.tc-options button').first().focus();await page.keyboard.press('Enter');await expect(page.locator('.tc-options button').first()).toHaveAttribute('aria-pressed','true');
  await page.getByRole('button',{name:'Need a hint?',exact:true}).click();await page.getByRole('button',{name:'Quick reference',exact:true}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'Quick reference',exact:true})).toBeFocused();
  const selection=(await record(page)).session!.selection;await page.reload();await page.getByRole('button',{name:'Continue my saved session →',exact:true}).click();await expect(page.locator('.tc-question')).toHaveAttribute('data-question',question.id);expect((await record(page)).session!.selection).toEqual(selection);expect((await record(page)).session!.assisted).toBe(true);
  await open(page,ROOT+'progress/');await page.getByText('Progress on this device',{exact:true}).click();await page.getByRole('button',{name:'Reset this study-center record',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'Reset this record',exact:true}).click();expect((await record(page)).evidence).toEqual([]);expect(await page.evaluate(keys=>Object.fromEntries(keys.map(key=>[key,localStorage.getItem(key)])),Object.keys(keep))).toEqual(keep);
  await page.addInitScript(()=>{Storage.prototype.getItem=function(){throw Error('blocked')};Storage.prototype.setItem=function(){throw Error('blocked')}});await open(page);await expect(page.locator('.tc-notice').first()).toContainText('unavailable');await page.getByRole('button',{name:'Start studying',exact:true}).click();await teachToQuestion(page);await expect(page.locator('.tc-question')).toBeVisible();
});


test('exhausted review stays on a usable page and explains the next learning step',async({page})=>{
  let state=startTutor(newTutor(),'test');let index=0;
  while(!state.session!.complete){const q=currentQuestion(state)!;const selected=index++===0?[q.choices.find(choice=>!q.answer.includes(choice.id))!.id]:q.answer;for(const id of selected)state=chooseTutor(state,id);state=submitTutor(state);}
  state.seen=tutorQuestions.map(question=>question.id);await seed(page,state);await open(page);
  await page.getByRole('button',{name:'Practice what I missed',exact:true}).click();await expect(page.locator('.tc-empty')).toContainText('available fresh examples');await expect(page.getByRole('button',{name:'Start studying',exact:true})).toBeVisible();expect((await record(page)).session!.mode).toBe('test');
});


test('normal Learn and Practice paths complete the school day and three connected reasoning builders',async({page})=>{
  await fakeVoice(page);
  const flows=[['school-day-story',6,'','Walk through a school day →'],['builder-ser',3,'SER','Build it: who → pronoun → SER →'],['builder-adjectives',3,'Adjectives','Build it: people → description →'],['builder-de',4,'SER + DE','Build it: objects → SER + de →']] as const;
  for(const [lessonId,count,group,button] of flows){
    await open(page,ROOT+(lessonId==='school-day-story'?'practice/':'learn-with-pictures/'));
    if(group)await page.locator('.tc-topic-groups>details').filter({has:page.getByText(group,{exact:true})}).locator('summary').click();
    await page.getByRole('button',{name:button,exact:true}).click();const expected=tutorQuestions.filter(question=>question.lessonId===lessonId);expect(expected).toHaveLength(count);
    for(let index=0;index<count;index++){
      if(index===5)await page.locator('.tc-checkpoint').getByRole('button',{name:'Continue →',exact:true}).click();
      await expect(page.locator('.tc-lesson')).toHaveAttribute('data-lesson',lessonId);await fits(page,`${lessonId} stage ${index+1}`);await page.getByRole('button',{name:'Got it. Continue →',exact:true}).click();await expect(page.locator('.tc-question')).toHaveAttribute('data-question',expected[index].id);await answer(page);await continueFeedback(page);
    }
    await expect(page.locator('.tc-result')).toBeVisible();const saved=await record(page);expect(saved.session!.complete).toBe(true);expect(saved.evidence.filter(entry=>entry.sessionId===saved.session!.id)).toHaveLength(count);expect(saved.evidence.filter(entry=>entry.sessionId===saved.session!.id).every(entry=>entry.assisted)).toBe(true);
  }
  await page.setViewportSize({width:320,height:844});await open(page,ROOT+'practice/');await page.getByRole('button',{name:'Walk through a school day →',exact:true}).click();await expect(page.locator('.tc-lesson')).toBeVisible();await expect(page.locator('.tc-lesson img')).toHaveCount(1);await page.locator('.tc-lesson img').evaluate(image=>(image as HTMLImageElement).decode());await page.screenshot({path:'test-results/tutor-school-day-mobile.png',fullPage:true});
});
