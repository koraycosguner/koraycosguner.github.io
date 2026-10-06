import {test,expect,type Page} from '@playwright/test';
import {studyPath} from './paths';
import {storyQuestions,studyGuideQuestions,studyLessons,testQuestions} from '../../spanish/study-content';
import {STUDY_KEY,emptyStudy,startStudy,type StudySaved} from '../../spanish/study-learning';
import type {StudyQuestion} from '../../spanish/study-types';

const root='/quizzes/spanish/unit-2/';
async function open(page:Page,route='/quizzes/spanish/'){
  await page.goto(studyPath(route));
  await expect(page.locator('.u2-shell')).toHaveAttribute('data-ready','true');
}
async function record(page:Page):Promise<StudySaved>{return page.evaluate(key=>JSON.parse(localStorage.getItem(key)!),STUDY_KEY)}
async function seed(page:Page,state:StudySaved){
  await page.addInitScript(({key,value})=>{if(!localStorage.getItem(key))localStorage.setItem(key,value)},{key:STUDY_KEY,value:JSON.stringify(state)});
}
async function choose(page:Page,answer:string){
  await page.locator('.u2-options').getByRole('button',{name:answer,exact:true}).click();
  await page.getByRole('button',{name:'Check answer',exact:true}).click();
  await expect(page.locator('.u2-feedback')).toBeVisible();
}
async function next(page:Page){await page.locator('.u2-feedback').getByRole('button',{name:/^(Continue|Finish) →$/}).click()}
async function answer(page:Page,q:StudyQuestion){
  await expect(page.locator('.u2-question')).toHaveAttribute('data-question',q.id);
  for(let i=0;i<q.steps.length;i++){
    await expect(page.locator('.u2-question')).toHaveAttribute('data-step',String(i));
    await choose(page,q.steps[i].answer);await next(page);
  }
}

test('calm Spanish home has exactly four major choices and keeps links inside the hosted path',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await open(page);
  await expect(page.locator('.u2-modes>a')).toHaveCount(4);
  await expect(page.locator('.u2-mode h2')).toHaveText(['Learn','Story Practice','Complete the Story','Unit 2 Practice Test']);
  for(const [i,route] of ['study/','story-practice/','complete-story/','practice-test/'].entries()){
    await expect(page.locator('.u2-modes>a').nth(i)).toHaveAttribute('href',studyPath(root+route));
  }
  await expect(page.locator('.u2-home')).not.toContainText(/XP|lives remaining|hearts remaining/i);
  await page.locator('.u2-mode').first().click();await expect(page.locator('.u2-lesson')).toBeVisible();
  expect(errors).toEqual([]);
});

test('a short lesson teaches one example at a time, follows with practice and preserves other subjects',async({page})=>{
  const keep={'yusuf.spanish.proficiency.v1':'{"keep":"old prep"}','yusuf.spanish.school-day.v1':'{"keep":"adventure"}','yusuf-ecology-v1':'{"mastered":["food-chain"]}'};
  await open(page,root+'study/');
  await page.evaluate(values=>{for(const [key,value] of Object.entries(values))localStorage.setItem(key,value)},keep);
  const lesson=studyLessons[0];
  for(let i=0;i<lesson.examples.length;i++){
    await expect(page.locator('.u2-lesson .u2-count')).toHaveText(`Example ${i+1} of ${lesson.examples.length}`);
    await expect(page.locator('.u2-example')).toContainText(lesson.examples[i].split('\n')[0]);
    await expect(page.locator('.u2-options')).toHaveCount(0);
    if(i<lesson.examples.length-1)await page.getByRole('button',{name:'Next example →',exact:true}).click();
  }
  await page.getByRole('button',{name:`Try ${lesson.questions.length} questions →`,exact:true}).click();
  for(const question of lesson.questions)await answer(page,question);
  await expect(page.locator('.u2-result')).toBeVisible();expect((await record(page)).lessons).toContain(lesson.id);
  await expect(page.locator('.u2-score')).toHaveCount(0);
  expect(await page.evaluate(keys=>Object.fromEntries(keys.map(key=>[key,localStorage.getItem(key)])),Object.keys(keep))).toEqual(keep);
  await page.getByRole('button',{name:'Next lesson →',exact:true}).click();
  await expect(page.locator('.u2-lesson h2')).toHaveText(studyLessons[1].title);
});

test('story retry is gentle, preserves the first mistake and help record, and resumes exact work',async({page})=>{
  await open(page,root+'story-practice/');await page.getByRole('button',{name:'Start the school day →',exact:true}).click();
  const first=storyQuestions[0],step=first.steps[0],wrong=step.options.find(x=>x!==step.answer)!;
  await page.getByRole('button',{name:'Need help?',exact:true}).click();await expect(page.locator('.u2-help')).toBeVisible();
  await page.getByRole('button',{name:'Close help',exact:true}).click();await expect(page.locator('.u2-help')).toHaveCount(0);
  await choose(page,wrong);await expect(page.locator('.u2-feedback')).toContainText('Try again.');
  await expect(page.locator('.u2-feedback').getByRole('button',{name:/Continue/})).toHaveCount(0);
  await page.getByRole('button',{name:'Try again',exact:true}).click();
  await page.locator('.u2-options').getByRole('button',{name:step.answer,exact:true}).click();
  await page.reload();await page.getByRole('button',{name:'Continue where I left off',exact:true}).click();
  await expect(page.locator('.u2-question')).toHaveAttribute('data-question',first.id);
  await expect(page.locator('.u2-options').getByRole('button',{name:step.answer,exact:true})).toHaveAttribute('aria-pressed','true');
  await page.getByRole('button',{name:'Check answer',exact:true}).click();
  const saved=await record(page);expect(saved.session!.answers[`${first.id}:0`]).toMatchObject({first:wrong,last:step.answer,correct:true,attempts:2,assisted:true});
  await next(page);await expect(page.locator('.u2-question')).toHaveAttribute('data-question',storyQuestions[1].id);
  await expect(page.locator('.u2-help')).toHaveCount(0);
});

test('three-stage adjective practice presents pronoun, SER and ending separately, including reload',async({page})=>{
  const q=storyQuestions.find(q=>q.steps.length===3)!;expect(q).toBeTruthy();
  await seed(page,startStudy(emptyStudy(),'story',[q]));await open(page,root+'story-practice/');
  await page.getByRole('button',{name:'Continue where I left off',exact:true}).click();
  for(let i=0;i<q.steps.length;i++){
    await expect(page.locator('.u2-question')).toHaveAttribute('data-step',String(i));
    await expect(page.locator('.u2-question h2')).toHaveText(q.steps[i].prompt);
    await expect(page.locator('.u2-question .u2-count')).toHaveText(`Step ${i+1} of 3`);
    if(i===1){await page.reload();await page.getByRole('button',{name:'Continue where I left off',exact:true}).click();await expect(page.locator('.u2-question')).toHaveAttribute('data-step','1')}
    await choose(page,q.steps[i].answer);await next(page);
  }
  expect(Object.keys((await record(page)).session!.answers)).toHaveLength(3);await expect(page.locator('.u2-result')).toBeVisible();
});

test('the ten-part study guide connects pronouns, SER, agreement and paragraph blanks',async({page})=>{
  expect(studyGuideQuestions).toHaveLength(10);await open(page,root+'study-guide/');
  await page.getByRole('button',{name:'Start study guide review →',exact:true}).click();
  for(let i=0;i<studyGuideQuestions.length;i++){
    const q=studyGuideQuestions[i];await expect(page.locator('.u2-progress-label')).toContainText(`${i+1} of 10`);
    if(q.reading)await expect(page.locator('.u2-reading')).toHaveText(q.reading);
    await answer(page,q);
  }
  await expect(page.locator('.u2-result')).toBeVisible();expect((await record(page)).session!.complete).toBe(true);
});

test('full practice test scores every response once, resumes mid-test and records assistance separately',async({page})=>{
  test.setTimeout(240000);expect(testQuestions.length).toBeGreaterThanOrEqual(60);
  await open(page,root+'practice-test/');await page.getByRole('button',{name:'Start practice test →',exact:true}).click();
  const total=testQuestions.reduce((n,q)=>n+q.steps.length,0);let count=0;
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  for(let index=0;index<testQuestions.length;index++){
    const q=testQuestions[index];await expect(page.locator('.u2-question')).toHaveAttribute('data-question',q.id);
    if(q.reading)await expect(page.locator('.u2-reading')).toHaveText(q.reading);
    for(let j=0;j<q.steps.length;j++){
      const st=q.steps[j];await expect(page.locator('.u2-question')).toHaveAttribute('data-step',String(j));
      await expect(page.locator('.u2-options button')).toHaveCount(st.options.length);
      await expect(page.getByRole('button',{name:'Check answer',exact:true})).toBeDisabled();
      if(count===1){await page.getByRole('button',{name:'Need help?',exact:true}).click();await page.getByRole('button',{name:'Close help',exact:true}).click()}
      await choose(page,count===0?st.options.find(option=>option!==st.answer)!:st.answer);
      await expect(page.getByRole('button',{name:'Try again',exact:true})).toHaveCount(0);
      if(count===3){await page.reload();await page.getByRole('button',{name:'Continue where I left off',exact:true}).click();await expect(page.locator('.u2-feedback')).toBeVisible();await expect(page.locator('.u2-question')).toHaveAttribute('data-question',q.id)}
      await next(page);count++;
    }
  }
  expect(count).toBe(total);await expect(page.locator('.u2-score')).toHaveText(`${total-1} / ${total}`);
  await expect(page.locator('.u2-result')).toContainText('Help used on 1 response.');
  const saved=await record(page);expect(Object.keys(saved.session!.answers)).toHaveLength(total);expect(Object.values(saved.session!.answers).every(row=>row.attempts===1)).toBe(true);
  await page.reload();await page.getByRole('button',{name:'View last result',exact:true}).click();await expect(page.locator('.u2-score')).toHaveText(`${total-1} / ${total}`);
  await page.locator('.u2-review summary').click();await expect(page.locator('.u2-review>div')).toHaveCount(2);
  expect(errors).toEqual([]);
});

test('new activities support keyboard use and narrow screens with large answers and no overflow',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await open(page);
  for(const width of [320,390,768,1280]){
    await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`home ${width}`).toBe(true);
  }
  await page.locator('.u2-brand').focus();await page.keyboard.press('Shift+Tab');await expect(page.locator('.u2-skip')).toBeFocused();
  await open(page,root+'study/');await page.locator('.u2-lesson h2').focus();await page.keyboard.press('Tab');
  await expect(page.getByRole('button',{name:'Next example →',exact:true})).toBeFocused();await page.keyboard.press('Enter');await expect(page.locator('.u2-lesson h2')).toBeFocused();
  const q=storyQuestions.find(q=>q.steps.length===3)!;
  await page.evaluate(({key,state})=>localStorage.setItem(key,JSON.stringify(state)),{key:STUDY_KEY,state:startStudy(emptyStudy(),'story',[q])});
  await open(page,root+'story-practice/');await page.getByRole('button',{name:'Continue where I left off',exact:true}).click();
  await page.locator('.u2-question h2').focus();await page.keyboard.press('Tab');await expect(page.locator('.u2-options button').first()).toBeFocused();await page.keyboard.press('Enter');await expect(page.locator('.u2-options button').first()).toHaveAttribute('aria-pressed','true');
  await page.getByRole('button',{name:'Need help?',exact:true}).click();
  for(const width of [320,390,768,1280]){
    await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`question/help ${width}`).toBe(true);
    expect(await page.locator('.u2-options button').evaluateAll(buttons=>buttons.every(button=>button.getBoundingClientRect().height>=44))).toBe(true);
  }
  await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Close help',exact:true}).click();await page.screenshot({path:'test-results/study-question-mobile.png',fullPage:true});
  await page.setViewportSize({width:1280,height:900});await page.screenshot({path:'test-results/study-question-desktop.png',fullPage:true});
});

test('malformed and unavailable browser storage never blocks lessons or answering',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(key=>{try{localStorage.setItem(key,'not valid JSON')}catch{}},STUDY_KEY);await open(page,root+'study/');await expect(page.locator('.u2-lesson')).toBeVisible();
  await page.addInitScript(()=>{Storage.prototype.getItem=function(){throw new Error('blocked')};Storage.prototype.setItem=function(){throw new Error('blocked')}});
  await open(page,root+'story-practice/');await expect(page.locator('.u2-notice')).toContainText('Saving is unavailable');
  await page.getByRole('button',{name:'Start the school day →',exact:true}).click();await answer(page,storyQuestions[0]);
  await expect(page.locator('.u2-question')).toHaveAttribute('data-question',storyQuestions[1].id);expect(errors).toEqual([]);
});

test('every mini-lesson finishes its own practice and the full story reaches music class',async({page})=>{
  test.setTimeout(150000);await open(page,root+'study/');
  for(const lesson of studyLessons){
    const picker=page.locator('.u2-topic-picker');await picker.locator('summary').click();
    await picker.getByRole('button',{name:lesson.title,exact:true}).click();
    for(let i=1;i<lesson.examples.length;i++)await page.getByRole('button',{name:'Next example →',exact:true}).click();
    await page.getByRole('button',{name:`Try ${lesson.questions.length} questions →`,exact:true}).click();
    for(const q of lesson.questions)await answer(page,q);
    await expect(page.locator('.u2-result')).toBeVisible();
    await page.getByRole('button',{name:'Next lesson →',exact:true}).click();
  }
  expect((await record(page)).lessons.length).toBe(studyLessons.length);
  await open(page,root+'story-practice/');await page.getByRole('button',{name:'Start the school day →',exact:true}).click();
  for(const q of storyQuestions)await answer(page,q);
  await expect(page.locator('.u2-result h2')).toHaveText('You made it through the school day.');
});

test('starting a different activity keeps the saved run unless replacement is confirmed',async({page})=>{
  await open(page,root+'story-practice/');await page.getByRole('button',{name:'Start the school day →',exact:true}).click();
  await answer(page,storyQuestions[0]);
  await open(page,root+'practice-test/');await page.getByRole('button',{name:'Start practice test →',exact:true}).click();
  await expect(page.getByRole('dialog')).toBeVisible();await page.getByRole('button',{name:'Keep my place',exact:true}).click();
  expect((await record(page)).session!.mode).toBe('story');
  await expect(page.getByRole('button',{name:'Start practice test →',exact:true})).toBeFocused();
  await page.getByRole('button',{name:'Start practice test →',exact:true}).click();await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();expect((await record(page)).session!.mode).toBe('story');
  await page.getByRole('button',{name:'Start practice test →',exact:true}).click();await page.getByRole('button',{name:'Start new activity',exact:true}).click();
  expect((await record(page)).session!.mode).toBe('test');
  await expect(page.locator('.u2-question')).toHaveAttribute('data-question',testQuestions[0].id);
});

test('home screenshots at phone and desktop retain four uncluttered choices',async({page},info)=>{
  for(const width of [390,1280]){
    await page.setViewportSize({width,height:900});await open(page);
    await expect(page.locator('.u2-modes>a')).toHaveCount(4);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await page.screenshot({path:info.outputPath(`study-home-${width}.png`),fullPage:true});
  }
});
