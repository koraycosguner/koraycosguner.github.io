import assert from 'node:assert/strict';
import {access,readFile} from 'node:fs/promises';
import test from 'node:test';
test('production build includes real subject hub, Spanish and original Ecology assets',async()=>{
 await access(new URL('../dist/server/index.js',import.meta.url));
 const home=await readFile(new URL('../app/page.tsx',import.meta.url),'utf8');assert.match(home,/quizzes\/spanish/);assert.match(home,/Ecology Expedition/);assert.doesNotMatch(home,/SkeletonPreview/);
 await access(new URL('../dist/client/quizzes/ecology/content.js',import.meta.url));
 const bank=await readFile(new URL('../dist/client/quizzes/ecology/content.js',import.meta.url),'utf8');assert.match(bank,/questions/);
});
