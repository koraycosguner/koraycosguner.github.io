import {test,expect,type Page} from '@playwright/test';
import {studyPath} from './paths';
import {lessonPractice,proficiencyQuestions,proficiencyReview,type PrepQuestion} from '../../spanish/proficiency-content';
import {PREP_KEY,newPrep,startPrep,choosePrep,submitPrep,advancePrep,type SavedPrep} from '../../spanish/proficiency-learning';

const root='/quizzes/spanish/unit-2/';
const lessons=[
  ['pronouns','Who are we talking about?'],['perspective','IN · TO · ABOUT'],['ser','Connect the person to SER'],
  ['articles','Small words that match'],['hay','What is in the backpack?'],['backpack','Mi mochila'],
  ['classroom','Mi clase'],['subjects','Mis clases'],['descriptions','Mis compañeros'],['doctor','Why use SER?'],
] as const;
async function open(page:Page,route=root+'learn/'){
  await page.goto(studyPath(route));await expect(page.locator('.prep-shell')).toHaveAttribute('data-ready','true');
}
async function chooseLesson(page:Page,label:string){
  const picker=page.locator('.prep-lesson-picker');
  if(await picker.getAttribute('open')===null)await picker.locator('summary').click();
  await picker.getByRole('button').filter({hasText:label}).click();
  await picker.locator('summary').click();
  await expect(page.locator('.pl-topline')).toContainText('Step 1 of');
}
async function finishLesson(page:Page){
  while(await page.getByRole('button',{name:'Next small step →',exact:true}).count())await page.getByRole('button',{name:'Next small step →',exact:true}).click();
  await page.getByRole('button',{name:'Try guided practice →',exact:true}).click();
}
async function chooseAnswer(page:Page,answer:string){
  await page.locator('.prep-options').getByRole('button',{name:answer,exact:true}).click();
  await page.getByRole('button',{name:'Check answer →',exact:true}).click();
  await expect(page.locator('.prep-feedback')).toBeVisible();
}
async function moveOn(page:Page){
  await page.locator('.prep-feedback').getByRole('button',{name:/^(Now choose SER|Next part|Next small step|See my results)/}).click();
}
async function answerQuestion(page:Page,question:PrepQuestion){
  await expect(page.locator('.prep-question')).toHaveAttribute('data-question',question.id);
  for(let index=0;index<question.steps.length;index++){
    await expect(page.locator('.prep-question')).toHaveAttribute('data-step',String(index));
    await chooseAnswer(page,question.steps[index].answer);await moveOn(page);
  }
}
async function seed(page:Page,state:SavedPrep){
  await page.addInitScript(({key,value})=>{if(!localStorage.getItem(key))localStorage.setItem(key,value)},{key:PREP_KEY,value:JSON.stringify(state)});
}
async function saved(page:Page):Promise<SavedPrep>{return page.evaluate(key=>JSON.parse(localStorage.getItem(key)!),PREP_KEY)}

test('ten short lessons teach perspective, all articles, live HAY and complete vocabulary decks',async({page})=>{
  test.setTimeout(150000);
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));await open(page);
  for(const [id,label] of lessons){
    await chooseLesson(page,label);
    const count=Number(await page.locator('.pl-progress').getAttribute('max'));expect(count).toBeGreaterThanOrEqual(3);expect(count).toBeLessThanOrEqual(5);
    let lessonText='';
    for(let step=0;step<count;step++){
      await expect(page.locator('.pl-topline')).toContainText(`Step ${step+1} of ${count}`);
      lessonText+=await page.locator('.pl-card').innerText();
      if(id==='perspective'){
        await expect(page.locator('.pl-perspective')).toBeVisible();
        await expect(page.locator('.pl-chain')).toBeVisible();
        await expect(page.locator('.pl-perspective figcaption strong')).toHaveText(['IN → nosotros','TO → ustedes','ABOUT → ellos','ABOUT → ellas'][step]);
        if(step>0)await expect(page.locator('.pl-talk')).toContainText('Listener(s)');
        if(step>=2)await expect(page.locator('.pl-about')).toContainText('People being discussed');
      }
      if(id==='hay'&&step===1){
        await page.getByRole('button',{name:'Remove one lápiz',exact:true}).click();
        await expect(page.locator('.pl-bag-answer')).toContainText('No, no hay lápices.');
        await page.getByRole('button',{name:'Add one lápiz',exact:true}).click();
        await page.getByRole('button',{name:'Add one lápiz',exact:true}).click();
        await expect(page.locator('.pl-bag-answer')).toContainText('Sí, hay 2 lápices.');
        await page.getByRole('button',{name:'Add one libro',exact:true}).click();
        await expect(page.locator('.pl-bag-answer')).toContainText('Sí, hay un libro.');
      }
      const deckSizes:Record<string,number>={backpack:15,classroom:16,subjects:10,descriptions:16};
      if(deckSizes[id]&&await page.locator('.pl-word-deck').count()){
        const seen=new Set<string>();
        for(let index=0;index<deckSizes[id];index++){
          await expect(page.locator('.pl-deck-top')).toContainText(`${index+1} / ${deckSizes[id]}`);
          seen.add(await page.locator('.pl-word-scene h3').innerText());
          await page.getByRole('button',{name:'Show English meaning',exact:true}).click();await expect(page.locator('.pl-gloss')).toBeVisible();
          await page.getByRole('button',{name:/^Next item in /}).click();
        }
        expect(seen.size).toBe(deckSizes[id]);await expect(page.locator('.pl-deck-top')).toContainText(`1 / ${deckSizes[id]}`);
      }
      for(const width of [320,768,1280]){
        await page.setViewportSize({width,height:900});
        expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),`${id} lesson, step ${step+1}: no overflow at ${width}px`).toBe(true);
        const clipped=await page.locator('.pl-card button').evaluateAll(buttons=>buttons.flatMap(button=>{
          const bounds=button.getBoundingClientRect();if(!bounds.width||!bounds.height)return [];
          for(let parent=button.parentElement;parent;parent=parent.parentElement){
            if(!['hidden','clip','auto','scroll'].includes(getComputedStyle(parent).overflowX))continue;
            const clip=parent.getBoundingClientRect();
            if(bounds.left<clip.left-1||bounds.right>clip.right+1)return [button.getAttribute('aria-label')??button.textContent];
          }
          return [];
        }));
        expect(clipped,`${id} step ${step+1}: controls are not clipped at ${width}px`).toEqual([]);
      }
      if(step<count-1)await page.getByRole('button',{name:'Next small step →',exact:true}).click();
    }
    if(id==='pronouns')expect(lessonText).toContain('A subject pronoun replaces');
    if(id==='articles')for(const text of ['el escritorio','un escritorio','la computadora','una computadora','los libros','unos libros','las mesas','unas mesas','los lápices'])expect(lessonText).toContain(text);
    if(id==='ser'){await page.getByText('Chart extra: vosotros / vosotras',{exact:true}).click();await expect(page.locator('.pl-details')).toContainText('sois')}
    await expect(page.getByRole('button',{name:'Try guided practice →',exact:true})).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test('guided practice retries gently, finishes the lesson and saves supported first-answer evidence',async({page})=>{
  await open(page);await finishLesson(page);
  await page.reload();await page.getByRole('button',{name:'Resume my session →',exact:true}).click();
  const questions=lessonPractice.pronouns;const first=questions[0];
  await expect(page.locator('.prep-question')).toHaveAttribute('data-question',first.id);
  await chooseAnswer(page,first.steps[0].options.find(answer=>answer!==first.steps[0].answer)!);
  await expect(page.locator('.prep-feedback')).toContainText('A useful thing to practice.');
  await expect(page.locator('.prep-feedback').getByRole('button',{name:/Next small step/})).toHaveCount(0);
  await page.getByRole('button',{name:'Try it again',exact:true}).click();
  await answerQuestion(page,first);for(const question of questions.slice(1))await answerQuestion(page,question);
  await expect(page.getByRole('heading',{name:'One more piece makes sense.',exact:true})).toBeVisible();
  await expect(page.locator('.prep-score')).toHaveCount(0);
  const record=await saved(page);expect(record.completedLessons).toContain('pronouns');
  const firstEvidence=Object.values(record.evidence).find(row=>row.questionId===first.id)!;
  expect(firstEvidence).toMatchObject({attempts:2,firstCorrect:false,correct:true,assisted:true});
  await page.reload();await expect(page.locator('.prep-lesson-top h2')).toHaveText('IN · TO · ABOUT');
  await expect(page.getByRole('button',{name:'View last results →',exact:true})).toBeVisible();
  await page.locator('.prep-lesson-picker summary').click();await expect(page.locator('.prep-lesson-picker button').first()).toContainText('✓');
});

test('full proficiency test scores all responses, two-step and reading items, then offers a fresh targeted example',async({page})=>{
  test.setTimeout(180000);await open(page,root+'proficiency/');
  await page.getByRole('button',{name:/^Start full test/}).click();
  expect(proficiencyQuestions.length).toBeGreaterThanOrEqual(60);
  const total=proficiencyQuestions.reduce((count,question)=>count+question.steps.length,0);
  let twoStep=0,reading=0,trueFalse=0,answered=0;
  const missed=proficiencyQuestions.at(-1)!;const missedStep=missed.steps.at(-1)!;
  for(const question of proficiencyQuestions){
    const card=page.locator('.prep-question');await expect(card).toHaveAttribute('data-question',question.id);
    if(['prep-glue','prep-language'].includes(question.id))await expect(page.locator('.prep-english')).not.toContainText(question.steps[0].answer.slice(3));
    if(question.reading){reading++;await expect(page.locator('.prep-reading')).toHaveText(question.reading)}
    if(question.steps.length>1)twoStep++;
    for(let index=0;index<question.steps.length;index++){
      const step=question.steps[index];await expect(card).toHaveAttribute('data-step',String(index));
      await expect(card.locator('.prep-feedback')).toHaveCount(0);await expect(card.locator('.prep-hint')).toHaveCount(0);
      await expect(page.getByRole('button',{name:'A small hint',exact:true})).toHaveCount(0);
      await expect(page.getByRole('button',{name:'Field guide',exact:true})).toBeDisabled();
      await expect(page.getByRole('link',{name:'Sources & full reference guide',exact:true})).toHaveCount(0);
      await expect(card.locator('.prep-options button')).toHaveCount(step.options.length);
      if(step.options.length===2){trueFalse++;expect([...step.options].sort()).toEqual(['Cierto','Falso'])}else expect(step.options).toHaveLength(3);
      await expect(page.getByRole('button',{name:'Check answer →',exact:true})).toBeDisabled();
      const isMiss=question.id===missed.id&&index===question.steps.length-1;
      await chooseAnswer(page,isMiss?step.options.find(option=>option!==step.answer)!:step.answer);
      await expect(card.locator('.prep-feedback')).toContainText(step.explanation);
      await expect(page.getByRole('button',{name:'Try it again',exact:true})).toHaveCount(0);
      answered++;await moveOn(page);
    }
  }
  expect(twoStep).toBeGreaterThan(0);expect(reading).toBeGreaterThan(0);expect(trueFalse).toBeGreaterThan(0);expect(answered).toBe(total);
  await expect(page.locator('.prep-score')).toContainText(`${total-1} / ${total} first answers correct`);
  await expect(page.locator('.prep-score strong')).toHaveText(`${Math.round((total-1)/total*100)}%`);
  await expect(page.getByRole('region',{name:'Skill results'})).toContainText('Ready');await expect(page.getByRole('region',{name:'Skill results'})).toContainText('Review this');
  const record=await saved(page);const rows=Object.values(record.evidence);expect(rows).toHaveLength(total);expect(rows.filter(row=>row.firstCorrect)).toHaveLength(total-1);expect(rows.every(row=>!row.assisted)).toBe(true);
  await page.reload();await page.getByRole('button',{name:/^View last results/}).click();
  await expect(page.locator('.prep-score')).toContainText(`${total-1} / ${total} first answers correct`);
  await page.getByRole('button',{name:'Review with new examples →',exact:true}).click();
  const reviewIds=(await saved(page)).currentSession!.questionIds;expect(reviewIds.length).toBeGreaterThanOrEqual(2);
  for(const freshId of reviewIds){
    const fresh=proficiencyReview.find(question=>question.id===freshId)!;
    expect(fresh).toBeTruthy();expect(proficiencyQuestions.some(question=>question.id===freshId)).toBe(false);expect(fresh.steps.some(step=>step.skill===missedStep.skill)).toBe(true);
    expect(fresh.steps[0].prompt).not.toBe(missedStep.prompt);await expect(page.getByRole('button',{name:'A small hint',exact:true})).toBeVisible();await answerQuestion(page,fresh);
  }
  await expect(page.locator('.prep-result')).toBeVisible();
});

test('reload retains an unsubmitted choice, help evidence and the exact second step',async({page})=>{
  const paired=proficiencyQuestions.find(question=>question.steps.length===2)!;
  await seed(page,startPrep(newPrep(),'prep',[paired.id]));await open(page,root+'test-prep/');await page.getByRole('button',{name:'Resume my session →',exact:true}).click();
  await page.getByRole('button',{name:'A small hint',exact:true}).click();await expect(page.locator('.prep-hint')).toBeVisible();
  await page.locator('.prep-options').getByRole('button',{name:paired.steps[0].answer,exact:true}).click();
  await page.reload();await page.getByRole('button',{name:'Resume my session →',exact:true}).click();
  await expect(page.locator('.prep-question')).toHaveAttribute('data-step','0');
  await expect(page.locator('.prep-options').getByRole('button',{name:paired.steps[0].answer,exact:true})).toHaveAttribute('aria-pressed','true');
  let record=await saved(page);expect(Object.values(record.evidence)[0]).toMatchObject({attempts:0,assisted:true});
  await page.getByRole('button',{name:'Check answer →',exact:true}).click();await moveOn(page);await expect(page.locator('.prep-question')).toHaveAttribute('data-step','1');
  await page.reload();await page.getByRole('button',{name:'Resume my session →',exact:true}).click();
  await expect(page.locator('.prep-question')).toHaveAttribute('data-step','1');await expect(page.locator('.prep-question h2')).toHaveText(paired.steps[1].prompt);
  await chooseAnswer(page,paired.steps[1].answer);await moveOn(page);await expect(page.locator('.prep-score')).toContainText('2 / 2 first answers correct');
  record=await saved(page);expect(Object.values(record.evidence).filter(row=>row.assisted)).toHaveLength(1);
});

test('320px, 390px and 768px layouts, keyboard lessons, skip link and guide focus stay usable',async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await open(page);
  const skip=page.getByRole('link',{name:'Skip to activity',exact:true});
  await expect(skip).toHaveCSS('clip-path','inset(50%)');
  await page.locator('.prep-brand').focus();await page.keyboard.press('Shift+Tab');await expect(skip).toBeFocused();
  await expect(skip).toHaveCSS('clip-path','none');
  expect(await skip.evaluate(element=>element.getBoundingClientRect().top)).toBeGreaterThanOrEqual(0);
  await page.keyboard.press('Tab');await expect(skip).not.toBeFocused();await expect(skip).toHaveCSS('clip-path','inset(50%)');
  await page.locator('.pl-step-heading h2').focus();await page.keyboard.press('Tab');await expect(page.getByRole('button',{name:'Next small step →',exact:true})).toBeFocused();
  await page.keyboard.press('Enter');await expect(page.locator('.pl-topline')).toContainText('Step 2 of 5');await expect(page.locator('.pl-step-heading h2')).toBeFocused();
  await chooseLesson(page,'IN · TO · ABOUT');await page.getByRole('button',{name:'Next small step →',exact:true}).click();
  for(const width of [320,390,768]){
    await page.setViewportSize({width,height:844});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),`Perspective lesson has no overflow at ${width}px`).toBe(true);
  }
  await page.setViewportSize({width:390,height:844});
  const nextButton=page.getByRole('button',{name:'Next small step →',exact:true});
  await nextButton.hover();
  const contrast=await nextButton.evaluate(button=>{
    const style=getComputedStyle(button);
    const luminance=(color:string)=>{
      const [r,g,b]=color.match(/[\d.]+/g)!.slice(0,3).map(Number).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});
      return .2126*r+.7152*g+.0722*b;
    };
    const text=luminance(style.color),background=luminance(style.backgroundColor);
    return (Math.max(text,background)+.05)/(Math.min(text,background)+.05);
  });
  expect(contrast,'Next action remains legible while hovered').toBeGreaterThanOrEqual(4.5);
  await page.screenshot({path:'test-results/proficiency-perspective-mobile.png',fullPage:true});
  await page.getByRole('button',{name:'Field guide',exact:true}).click();await page.getByLabel('¿Qué buscas?').selectOption('perspective');
  await expect(page.getByRole('dialog')).toContainText('ABOUT → ellos / ellas');await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'Field guide',exact:true})).toBeFocused();
  await finishLesson(page);await expect(page.locator('.prep-options button')).toHaveCount(3);
  for(const width of [320,390,768]){
    await page.setViewportSize({width,height:844});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),`Guided question has no overflow at ${width}px`).toBe(true);
  }
  await page.setViewportSize({width:390,height:844});
  await page.locator('.prep-question h2').focus();await page.keyboard.press('Tab');await expect(page.locator('.prep-options button').first()).toBeFocused();await page.keyboard.press('Enter');
  await expect(page.locator('.prep-options button').first()).toHaveAttribute('aria-pressed','true');
  await page.screenshot({path:'test-results/proficiency-question-mobile.png',fullPage:true});
  await page.setViewportSize({width:1280,height:900});await page.screenshot({path:'test-results/proficiency-question-desktop.png',fullPage:true});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});

test('reset requires confirmation and preserves the adventure, earlier grades and Ecology',async({page})=>{
  const keep={'yusuf.spanish.school-day.v1':JSON.stringify({cursor:'hall-origin',evidence:{kept:true}}),'yusuf.spanish.unit2.v1':JSON.stringify({grades:[{percent:97}]}),'yusuf-ecology-v1':JSON.stringify({mastered:['food-chain'],missed:[],labs:['pond']})};
  await seed(page,{...newPrep(),completedLessons:['pronouns']});await open(page,root+'test-prep/');
  await page.evaluate(values=>{for(const [key,value] of Object.entries(values))localStorage.setItem(key,value)},keep);
  await page.getByRole('button',{name:/^Start mixed practice/}).click();const questionId=await page.locator('.prep-question').getAttribute('data-question');
  await page.getByRole('button',{name:'Reset this prep record',exact:true}).click();await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button',{name:'Keep my progress',exact:true}).click();await expect(page.locator('.prep-question')).toHaveAttribute('data-question',questionId!);
  expect((await saved(page)).completedLessons).toEqual(['pronouns']);
  await page.getByRole('button',{name:'Reset this prep record',exact:true}).click();await page.getByRole('button',{name:'Reset prep record',exact:true}).click();
  await expect(page.locator('.prep-welcome')).toBeVisible();
  await expect.poll(async()=>Object.keys((await saved(page)).evidence).length).toBe(0);expect((await saved(page)).completedLessons).toEqual([]);expect((await saved(page)).currentSession).toBeUndefined();
  expect(await page.evaluate(keys=>Object.fromEntries(keys.map(key=>[key,localStorage.getItem(key)])),Object.keys(keep))).toEqual(keep);
});

test('corrupt and blocked browser storage recover without blocking a lesson or guided answers',async({page})=>{
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(key=>{try{localStorage.setItem(key,'broken save')}catch{}},PREP_KEY);await open(page);
  await expect(page.locator('.prep-notice')).toContainText('could not be opened');await finishLesson(page);await answerQuestion(page,lessonPractice.pronouns[0]);
  await page.addInitScript(()=>{Storage.prototype.getItem=function(){throw new Error('storage blocked')};Storage.prototype.setItem=function(){throw new Error('storage blocked')}});
  await open(page);await expect(page.locator('.prep-notice')).toContainText('Saving is unavailable');
  await finishLesson(page);await answerQuestion(page,lessonPractice.pronouns[0]);await expect(page.locator('.prep-question')).toHaveAttribute('data-question',lessonPractice.pronouns[1].id);
  expect(errors).toEqual([]);
});

test('empty targeted review distinguishes a clean first try from exhausted examples',async({page})=>{
  const question=proficiencyQuestions.find(q=>q.steps.length===1)!;
  const state=advancePrep(submitPrep(choosePrep(startPrep(newPrep(),'prep',[question.id]),question.steps[0].answer)));
  await seed(page,state);await open(page,root+'test-prep/');
  await page.getByRole('button',{name:'Review my skills →',exact:true}).click();
  await expect(page.locator('.prep-review-entry')).toContainText('No missed skills to review right now.');
  await page.getByRole('button',{name:'View last results →',exact:true}).click();
  await page.getByRole('button',{name:'Review with new examples →',exact:true}).click();
  await expect(page.locator('.prep-result')).toContainText('No missed skills to review right now.');
});
