import assert from 'node:assert/strict';
import {access,readFile} from 'node:fs/promises';
import test from 'node:test';
test('production build includes real subject hub, Spanish and original Ecology assets',async()=>{
 await access(new URL('../dist/server/index.js',import.meta.url));
 const home=await readFile(new URL('../app/page.tsx',import.meta.url),'utf8');assert.match(home,/quizzes\/spanish/);assert.match(home,/Ecology Expedition/);assert.doesNotMatch(home,/SkeletonPreview/);
 await access(new URL('../dist/client/quizzes/ecology/content.js',import.meta.url));
 await access(new URL('../dist/client/quizzes/rikki-tikki-tavi/garden-adventure.webp',import.meta.url));
 assert.match(home,/subjects\/language-arts/);
 for(const name of ['friends','backpack','classes','teamwork','conversation','band','classroom-panorama','supplies-atlas'])await access(new URL('../dist/client/quizzes/spanish/school-day/'+name+'.webp',import.meta.url));
 const bank=await readFile(new URL('../dist/client/quizzes/ecology/content.js',import.meta.url),'utf8');assert.match(bank,/questions/);
});

test('production build preserves the new Unit 3 instructional artwork and source routes',async()=>{
 for(const name of ['arrival','departure'])await access(new URL('../dist/client/quizzes/spanish/unit-3/'+name+'.webp',import.meta.url));
 for(const route of ['', 'complete-story/', 'study-guide/', 'practice-test/'])await access(new URL('../app/quizzes/spanish/unit-3/'+route+'page.tsx',import.meta.url));
 const home=await readFile(new URL('../spanish/TutorCenter.tsx',import.meta.url),'utf8');assert.match(home,/quizzes\/spanish\/unit-3/);
});

test('production build includes the Cells lesson, its five images and separate practice routes',async()=>{
 for(const name of ['cell-theory-worksheet','cell-theory-answer-key']){const file=await readFile(new URL('../dist/client/quizzes/cells/concept-1/'+name+'.docx',import.meta.url));assert.equal(file.subarray(0,2).toString(),'PK');}
 for(const name of ['hooke','leeuwenhoek','schleiden','schwann','virchow'])await access(new URL('../dist/client/quizzes/cells/concept-1/'+name+'.webp',import.meta.url));
 for(const route of ['', 'worksheet/', 'paragraph/', 'quiz/'])await access(new URL('../app/subjects/science/cells/concept-1/'+route+'page.tsx',import.meta.url));
 const science=await readFile(new URL('../app/subjects/science/page.tsx',import.meta.url),'utf8');assert.match(science,/subjects\/science\/cells/);assert.match(science,/Ecology Expedition/);
});

test('production build includes Sentence Studio, all thirteen teaching scenes and separate ELA routes',async()=>{
 for(const name of ['puppy','bus','train','dinner','trail','mural','book','playground','park','snow','bell','bird','movie'])await access(new URL('../dist/client/quizzes/phrases-clauses/'+name+'.webp',import.meta.url));
 for(const route of ['', 'learn/', 'level-1/', 'level-2/', 'level-3/', 'level-4/', 'review/', 'test/', 'builder/'])await access(new URL('../app/quizzes/phrases-clauses/'+route+'page.tsx',import.meta.url));
 const shelf=await readFile(new URL('../app/subjects/language-arts/page.tsx',import.meta.url),'utf8');assert.match(shelf,/quizzes\/phrases-clauses/);assert.match(shelf,/quizzes\/rikki-tikki-tavi/);
 const app=await readFile(new URL('../ela/ElaApp.tsx',import.meta.url),'utf8');assert.doesNotMatch(app,/private-references|codex-clipboard|fetch\(/);
});

test('production build includes the Concept 2 Cell Lab and all fifteen entry routes without private source assets',async()=>{
 for(const route of ['', 'explore/','school/','systems/','label/','functions/','analogies/','compare/','types/','test/','quick/','quest/','match/','paragraphs/','write/'])await access(new URL('../app/subjects/science/cells/concept-2/'+route+'page.tsx',import.meta.url));
 const diagram=await readFile(new URL('../science/cells/concept2/CellDiagram.tsx',import.meta.url),'utf8');assert.match(diagram,/onDrop/);assert.match(diagram,/onKeyDown/);assert.match(diagram,/Plant|plant/);
 const app=await readFile(new URL('../science/cells/concept2/Concept2App.tsx',import.meta.url),'utf8');assert.doesNotMatch(app,/private-references|shared-pasteboard|fetch\(|sendBeacon/);
 const {readdir}=await import('node:fs/promises');const files=await readdir(new URL('../dist/client',import.meta.url),{recursive:true});assert.ok(!files.some(file=>/Kaiser|017 -|private-reference|\.pptx$/i.test(String(file))));
});
