import {test,expect} from '@playwright/test';
import {pageRoutes} from '../../static-pages/routes';
import {studyPath} from './paths';

test('every subject loads directly, refreshes, and keeps links and local assets inside the study folder',async({page})=>{
 const failed:string[]=[];const errors:string[]=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.url().startsWith(new URL(page.url()).origin)&&r.status()>=400)failed.push(r.url())});
 for(const route of [...pageRoutes,'/quizzes/ecology/','/quizzes/southwest-asia/']){
  const response=await page.goto(studyPath(route),{waitUntil:'domcontentloaded'});expect(response?.status(),route).toBe(200);
  if(route==='/quizzes/southwest-asia/')await expect(page.locator('iframe')).toBeVisible();else await expect(page.locator('h1').first()).toBeVisible();
  await page.reload({waitUntil:'domcontentloaded'});
  if(route==='/quizzes/southwest-asia/')await expect(page.locator('iframe')).toBeVisible();else await expect(page.locator('h1').first()).toBeVisible();
  const links=await page.locator('a[href]').evaluateAll(elements=>elements.map(el=>(el as HTMLAnchorElement).getAttribute('href')!));
  for(const href of links.filter(h=>h.startsWith('/')&&!h.startsWith('//')))expect(href,route+' '+href).toMatch(new RegExp('^'+(process.env.TEST_PATH_PREFIX??'')+'/'));
  await page.locator('img').evaluateAll(elements=>elements.forEach(el=>{(el as HTMLImageElement).loading='eager'}));
  await expect.poll(()=>page.locator('img').evaluateAll(elements=>(elements as HTMLImageElement[]).filter(el=>!el.complete||el.naturalWidth===0).map(el=>el.src)),{message:route+' images load'}).toEqual([]);
 }
 expect(failed).toEqual([]);expect(errors).toEqual([]);
});

test('published hub links to current Spanish, Ecology, Rikki and the working Social Sciences quiz',async({page})=>{
 await page.goto(studyPath('/'),{waitUntil:'domcontentloaded'});await expect(page.locator('h1')).toBeVisible();await page.screenshot({path:'test-results/pages-hub-desktop.png',fullPage:true});
 await page.getByRole('link',{name:/Spanish Unit 2/}).first().click();await expect(page.getByRole('heading',{name:'Your Unit 2 study guide'})).toBeVisible();await expect(page.locator('.u2-modes a')).toHaveCount(4);await page.goto(studyPath('/quizzes/spanish/unit-2/'));await expect(page.getByRole('heading',{name:'Ready to meet your class?'})).toBeVisible();
 await page.getByRole('button',{name:'Entrar en la clase',exact:false}).click();await expect(page.locator('.learn-example')).toBeVisible();await page.screenshot({path:'test-results/pages-spanish-desktop.png',fullPage:true});
 await page.goto(studyPath('/quizzes/ecology/'),{waitUntil:'domcontentloaded'});await page.getByRole('button',{name:/Play all 72 questions/}).click();await expect(page.locator('#view-quiz')).toBeVisible();await expect(page.locator('#view-quiz button').first()).toBeVisible();
 await page.goto(studyPath('/quizzes/southwest-asia/'),{waitUntil:'domcontentloaded'});const quiz=page.frameLocator('iframe');await expect(quiz.getByRole('button').first()).toBeVisible();
 await page.setViewportSize({width:390,height:844});await page.goto(studyPath('/'),{waitUntil:'domcontentloaded'});await expect(page.getByRole('heading',{name:/Quiz. Learn./})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:'test-results/pages-hub-mobile.png',fullPage:true});
});
