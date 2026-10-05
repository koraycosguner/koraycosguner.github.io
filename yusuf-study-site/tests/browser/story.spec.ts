import {test,expect,type Page} from '@playwright/test';
import {storyScenes,storyTurns,type StoryTurn} from '../../spanish/story-content';
import {responseBuilders} from '../../spanish/intuitive';
import {newStory,recordStoryAttempt,markStorySupport,STORY_KEY,type StoryProgress} from '../../spanish/story-learning';
const root='/quizzes/spanish/unit-2/';
async function open(page:Page,path=root){await page.goto(path);await expect(page.locator('.school-day,.spanish-app')).toHaveAttribute('data-ready','true')}
async function tryNow(page:Page){if(await page.locator('.learn-example').count())await page.getByRole('button',{name:/^(Now I try|Ahora yo)/}).click()}
async function answer(page:Page,q:StoryTurn){
  await tryNow(page);
  const card=page.locator('.day-turn');await expect(card).toHaveAttribute('data-turn',q.id);
  if(q.kind==='choice')await card.locator('.day-choices').getByRole('button',{name:q.answers[0],exact:true}).click();
  else if(q.kind==='builder')for(const step of q.stages!)await card.locator('.day-choices').getByRole('button',{name:step.answer,exact:true}).click();
  else if(await card.locator('.day-builder').count()){for(const step of responseBuilders[q.id])await card.locator('.day-choices').getByRole('button',{name:step.answer,exact:true}).click()}
  else {await page.getByLabel('Tu respuesta en español').fill(q.answers[0]);await card.getByRole('button',{name:'Comprobar',exact:true}).click()}
  await expect(card.locator('.day-success')).toBeVisible();
}
async function next(page:Page){await page.locator('.day-success').getByRole('button').click();if(await page.locator('.day-mini-break').count())await page.getByRole('button',{name:/^(Keep going|Seguir)/}).click()}
async function seed(page:Page,p:StoryProgress){await page.addInitScript(({key,value})=>localStorage.setItem(key,value),{key:STORY_KEY,value:JSON.stringify(p)})}

test('complete connected school day, three choices, retry, inventory, final conversation and band reward',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await open(page);
  await expect(page.locator('.learn-path')).not.toHaveAttribute('open','');await page.getByText('Show my school-day map',{exact:true}).click();await expect(page.getByRole('button',{name:/7\. La sala de música/})).toBeDisabled();
  await page.screenshot({path:'test-results/spanish-story-desktop.png',fullPage:true});
  await page.getByRole('button',{name:'Entrar en la clase',exact:false}).click();
  for(let scene=0;scene<storyScenes.length;scene++){
    for(const q of storyScenes[scene].turns){
      const card=page.locator('.day-turn');await expect(card).toHaveAttribute('data-turn',q.id);
      await tryNow(page);
      if(q.kind==='choice')await expect(card.locator('.day-choices button')).toHaveCount(3);
      if(q.id==='welcome-self'){
        const wrong=q.options!.find(o=>!q.answers.includes(o))!;
        await card.locator('.day-choices').getByRole('button',{name:wrong,exact:false}).click();
        await expect(card.locator('.day-hint')).toContainText('Prueba otra vez');await expect(card.locator('.day-model')).toHaveCount(0);await expect(card.locator('.day-success')).toHaveCount(0);
      }
      if(q.id==='bag-absent'||q.id==='bag-pack')await expect(card.locator('.day-inventory').getByText('0 · todavía no')).toBeVisible();
      await answer(page,q);
      if(q.id==='bag-pack'){await expect(card.locator('.day-inventory')).toContainText('1 par dentro');await expect(card.locator('.day-inventory .day-missing')).toHaveCount(0)}
      if(q.id==='schedule-math-like')await page.screenshot({path:'test-results/spanish-story-builder.png',fullPage:true});
      await next(page);
    }
    if(scene+1<storyScenes.length){await expect(page.locator('.day-stop')).toBeVisible();await page.locator('.day-stop').getByRole('button',{name:/^Ir a /}).click()}
  }
  await expect(page.getByRole('heading',{name:'¡Somos una banda!'})).toBeVisible();await expect(page.getByRole('button',{name:/^Do/})).toBeDisabled();
  await page.getByRole('button',{name:'Sonido desactivado'}).click();await page.getByRole('button',{name:/^Do/}).click();
  const saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)!),STORY_KEY);
  expect(Object.values(saved.evidence).filter((e:unknown)=>(e as {complete:boolean}).complete)).toHaveLength(40);
  expect(saved.evidence['welcome-self'].firstCorrect).toBe(false);expect(errors).toEqual([]);
  await page.reload();await page.getByRole('button',{name:'Volver a la banda'}).click();await expect(page.locator('.day-reward')).toBeVisible();
  await page.getByRole('button',{name:'Otra charla con mis compañeros',exact:true}).first().click();await expect(page.locator('.day-turn')).toHaveAttribute('data-turn','review-story-self');
});

test('hint-before-answer survives reload, external guide is counted, resume and reset preserve quiz grades',async({page})=>{
  await open(page);await page.getByRole('button',{name:'Entrar en la clase',exact:false}).click();await tryNow(page);await page.getByText('Help me',{exact:true}).click();await page.getByRole('button',{name:'Una pista',exact:true}).click();await page.reload();
  await page.getByRole('button',{name:'Continuar mi día',exact:false}).click();await answer(page,storyTurns[0]);await next(page);
  await page.getByRole('button',{name:'Mi guía',exact:true}).click();await page.getByLabel('¿Qué buscas?').selectOption('doctor');await expect(page.getByRole('dialog')).toContainText('1 / 9 descubrimientos');await page.keyboard.press('Escape');
  await answer(page,storyTurns[1]);await next(page);await page.reload();await page.getByRole('button',{name:'Continuar mi día',exact:false}).click();await expect(page.locator('.day-turn')).toHaveAttribute('data-turn','welcome-tu');
  const saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)!),STORY_KEY);expect(saved.evidence['welcome-self'].assisted).toBe(true);expect(saved.evidence['welcome-yo'].assisted).toBe(true);
  await page.evaluate(()=>{localStorage.setItem('yusuf.spanish.unit2.v1',JSON.stringify({grades:[{percent:97}]}));localStorage.setItem('ecology-keep','yes')});
  await page.getByRole('button',{name:'Reiniciar esta historia'}).click();await page.getByRole('button',{name:'Reiniciar historia',exact:true}).click();await expect(page.getByRole('button',{name:'Entrar en la clase',exact:false})).toBeVisible();
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('yusuf.spanish.unit2.v1')!).grades[0].percent)).toBe(97);expect(await page.evaluate(()=>localStorage.getItem('ecology-keep'))).toBe('yes');
});

test('checkpoint covers choices, builders and supported sentences without altering story cursor',async({page})=>{
  let earlier=newStory();const earlierTurn=storyTurns.find(t=>t.id==='welcome-tu')!;earlier=recordStoryAttempt(markStorySupport(earlier,earlierTurn),earlierTurn,true,true);await seed(page,earlier);
  await open(page,root+'checkpoint/');await page.getByRole('button',{name:'Comenzar checkpoint',exact:false}).click();let first=true;
  for(let i=0;i<8;i++){
    const id=await page.locator('.day-turn').getAttribute('data-turn');const q=storyTurns.find(t=>t.id===id)!;
    if(first){const wrong=q.options!.find(o=>!q.answers.includes(o))!;await page.locator('.day-choices').getByRole('button',{name:wrong,exact:false}).click();first=false}
    await answer(page,q);await next(page);
  }
  await expect(page.locator('.day-practice-result')).toContainText('7 / 8');
  const p=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)!),STORY_KEY);expect(p.cursor).toBe('welcome-self');expect(Object.keys(p.evidence)).toHaveLength(1);expect(p.evidence['welcome-tu'].assisted).toBe(true);
});

test('mobile and tablet, keyboard builder focus, double click guard, guide and three-object discovery',async({page})=>{
  let p=newStory();for(const scene of storyScenes.slice(0,3))for(const q of scene.turns)p=recordStoryAttempt(p,q,true,false);p.started=true;p.cursor='schedule-math-like';await seed(page,p);
  await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await open(page);await page.getByRole('button',{name:'Continuar mi día',exact:false}).click();
  await tryNow(page);await page.locator('.day-choices').getByRole('button',{name:/A mí/}).dblclick();await expect(page.locator('.day-builder>p')).toContainText('2 / 3');await expect(page.locator('.day-builder>p')).toBeFocused();await expect(page.locator('.day-hint')).toHaveCount(0);
  await page.keyboard.press('Tab');await expect(page.locator('.day-choices button').first()).toBeFocused();
  const q=storyTurns.find(t=>t.id==='schedule-math-like')!;for(const step of q.stages!.slice(1))await page.locator('.day-choices').getByRole('button',{name:step.answer,exact:true}).click();
  await page.screenshot({path:'test-results/spanish-story-mobile.png',fullPage:true});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
  await page.getByRole('button',{name:'Guía de campo',exact:true}).click();await page.getByLabel('¿Qué buscas?').selectOption('ser');await expect(page.getByRole('dialog')).toContainText('vosotros');await expect(page.getByRole('dialog')).toContainText('sois');await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'Guía de campo',exact:true})).toBeFocused();
  await page.getByRole('button',{name:'← Mi día'}).click();await page.getByText('Más descubrimientos · los objetos de la clase').click();await expect(page.locator('.day-object-bank button')).toHaveCount(3);await page.locator('.day-object-bank button').first().click();await expect(page.locator('.day-object-detail')).toBeVisible();await page.getByRole('button',{name:'Más objetos →'}).click();await expect(page.locator('.day-object-bank button')).toHaveCount(3);
  for(const width of [320,768]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy()}
});

test('corrupted and blocked saves, safe supported typing and all eight illustrations load',async({page})=>{
  await page.addInitScript(key=>localStorage.setItem(key,'broken'),STORY_KEY);await open(page);await expect(page.locator('.day-save-warning')).toContainText('No se pudo leer');
  for(const name of ['friends','backpack','classes','teamwork','conversation','band','classroom-panorama','supplies-atlas']){const response=await page.request.get('/quizzes/spanish/school-day/'+name+'.webp');expect(response.status()).toBe(200);expect(response.headers()['content-type']).toContain('image/webp')}
  await page.addInitScript(()=>{Storage.prototype.getItem=function(){throw Error('blocked')};Storage.prototype.setItem=function(){throw Error('blocked')}});await page.reload();await expect(page.locator('.day-save-warning')).toContainText('Guardado no disponible');await page.getByRole('button',{name:'Entrar en la clase',exact:false}).click();await answer(page,storyTurns[0]);await next(page);await expect(page.locator('.day-turn')).toHaveAttribute('data-turn','welcome-yo');
});

test('short written responses reject unsafe or incomplete input, retry gently and keep help available',async({page})=>{
  let p=newStory();for(const scene of storyScenes.slice(0,5))for(const q of scene.turns)p=recordStoryAttempt(p,q,true,false);p.started=true;p.cursor='rehearsal-class-description';await seed(page,p);await open(page);await page.getByRole('button',{name:'Continuar mi día',exact:false}).click();
  await tryNow(page);await page.getByRole('button',{name:'I want to type instead',exact:true}).click();await page.getByLabel('Tu respuesta en español').fill('<img src=x onerror=alert(1)>');await page.getByRole('button',{name:'Comprobar',exact:true}).click();await expect(page.locator('.day-turn img')).toHaveCount(0);await expect(page.locator('.day-model')).toHaveCount(0);await expect(page.locator('.day-hint')).toBeVisible();
  await page.getByText('Help me',{exact:true}).click();await page.getByRole('button',{name:'Ayúdame a empezar'}).click();await expect(page.locator('.day-writing-support')).toContainText('La clase es');await page.getByLabel('Tu respuesta en español').fill('La clase es divertida');await page.getByRole('button',{name:'Comprobar',exact:true}).click();await expect(page.locator('.day-success')).toBeVisible();
});

test('worked example is saved as support, three-step rest resumes, typing remains optional',async({page})=>{
 await open(page);await page.getByRole('button',{name:'Entrar en la clase',exact:false}).click();
 await expect(page.locator('.learn-example')).toContainText('Yo soy Mateo.');await expect(page.locator('.day-choices')).toHaveCount(0);
 await page.screenshot({path:'test-results/intuitive-example-desktop.png',fullPage:true});
 await expect.poll(async()=>JSON.parse((await page.evaluate(key=>localStorage.getItem(key),STORY_KEY))!).evidence['welcome-self']?.assisted).toBe(true);
 let saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)!),STORY_KEY);expect(saved.evidence['welcome-self'].attempts).toBe(0);
 await answer(page,storyTurns[0]);await next(page);await page.locator('.room-hotspot.hotspot-teacher').click();await expect.poll(async()=>JSON.parse((await page.evaluate(key=>localStorage.getItem(key),STORY_KEY))!).evidence['welcome-yo']?.assisted).toBe(true);await answer(page,storyTurns[1]);await next(page);await answer(page,storyTurns[2]);await page.locator('.day-success').getByRole('button').click();
 await expect(page.locator('.day-mini-break')).toBeVisible();await page.getByRole('button',{name:'Take a break',exact:true}).click();await page.reload();await page.getByRole('button',{name:'Continuar mi día',exact:false}).click();await expect(page.locator('.day-turn')).toHaveAttribute('data-turn','welcome-reply');
 saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)!),STORY_KEY);expect(saved.evidence['welcome-self'].assisted).toBe(true);
});

test('polished room hotspots, visual supplies, default 2D and optional 3D',async({page})=>{
 await open(page,root+'explore/');await expect(page.getByRole('button',{name:'2D / lista',exact:true})).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('.illustrated-room-view img')).toBeVisible();await page.locator('.room-hotspot.hotspot-supplies').click();await expect(page.locator('.room-inspection')).toContainText('Uso un lápiz');await page.getByRole('button',{name:'Go here →',exact:true}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'Go here →',exact:true})).toBeFocused();
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'test-results/intuitive-classroom-mobile.png',fullPage:true});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
 await open(page);await page.getByRole('button',{name:'Entrar en la clase',exact:false}).click();await tryNow(page);await answer(page,storyTurns[0]);await next(page);await answer(page,storyTurns[1]);await next(page);await answer(page,storyTurns[2]);await next(page);await answer(page,storyTurns[3]);await next(page);await answer(page,storyTurns[4]);await next(page);await answer(page,storyTurns[5]);await next(page);await page.locator('.day-stop').getByRole('button',{name:/^Ir a /}).click();await tryNow(page);
 await expect(page.locator('.day-choices .learn-supply')).toHaveCount(3);await page.screenshot({path:'test-results/intuitive-supplies-mobile.png',fullPage:true});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
});
