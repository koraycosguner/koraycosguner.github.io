import test from 'node:test';
import assert from 'node:assert/strict';
import {readdir,readFile} from 'node:fs/promises';
import {analogySets,cellParts,compareIds,core,functionIds,labelSets,legacyTestIds,functionSets,systemIds,matchIds,paragraphIds,parts,questIds,reviewIds,taskById,tasks,testIds,typeIds,writeIds} from '../science/cells/concept2/content.ts';

test('fourteen main cell parts have distinct functions, functional analogies, clues and careful details',()=>{
 assert.deepEqual(core.map(p=>p.id),['wall','membrane','nucleus','cytoplasm','mitochondria','ribosomes','lysosomes','vacuole','chloroplasts','golgi','rough-er','smooth-er','vesicles','cytoskeleton']);
 for(const p of parts)for(const field of ['name','job','detail','analogy','reason','limit','clue','scenario'] as const)assert.ok(p[field],`${p.id} ${field}`);
 const by=(id:string)=>parts.find(p=>p.id===id)!;
 assert.match(by('mitochondria').job,/ATP/);assert.match(by('ribosomes').job,/proteins/);assert.match(by('membrane').job,/enters and leaves/);assert.match(by('nucleus').job,/DNA/);assert.match(by('wall').job,/shape, support, and protection/);assert.match(by('cytoplasm').job,/Jelly-like/);assert.match(by('lysosomes').job,/Break down/);assert.match(by('vacuole').job,/Stores/);assert.match(by('chloroplasts').job,/photosynthesis/);
 assert.match(by('vacuole').detail,/pressure/);assert.match(by('chloroplasts').detail,/root cells lack/);assert.match(by('lysosomes').detail,/plant vacuoles/);assert.match(by('mitochondria').detail,/plant cells/);
});
test('every question key resolves to unique actual choices and diagram targets align with the key',()=>{
 assert.equal(new Set(tasks.map(t=>t.id)).size,tasks.length);
 for(const t of tasks){
  assert.equal(new Set(t.choices.map(c=>c.id)).size,t.choices.length,t.id);
  assert.ok(t.answer.every(id=>t.choices.some(c=>c.id===id)),t.id);
  if(t.kind==='written'){assert.equal(t.answer.length,0);assert.ok(t.part)}else assert.ok(t.answer.length>0,t.id);
  if(t.segments)assert.equal(t.segments.length,t.answer.length+1,t.id);
  if(t.slots)assert.equal(t.slots.length,t.answer.length,t.id);
  if(t.highlight)assert.ok(cellParts(t.cell!,true).some(p=>p.id===t.highlight),t.id);
  if(t.targets)assert.deepEqual(t.answer,t.targets,t.id);
  if(['choice','diagram-choice'].includes(t.kind))assert.equal(t.choices.length,3,t.id);
 }
});
test('both cells cover beginner, intermediate, full, identification and advanced structures',()=>{
 for(const cell of ['animal','plant'] as const){
  assert.equal(taskById.get(labelSets[`${cell}-1`][0])!.answer.length,4);
  assert.equal(labelSets[`${cell}-2`].flatMap(id=>taskById.get(id)!.answer).length,6);
  assert.deepEqual(labelSets[`${cell}-3`].flatMap(id=>taskById.get(id)!.answer),cellParts(cell).map(p=>p.id));
  assert.ok(labelSets[`${cell}-3`].every(id=>taskById.get(id)!.answer.length<=4));
  assert.ok(labelSets[`${cell}-4`].every(id=>taskById.get(id)!.kind==='diagram-choice'));
  const extended=labelSets[`${cell}-5`].flatMap(id=>taskById.get(id)!.answer);assert.ok(extended.includes('nucleolus')&&extended.includes('nuclear-envelope')&&extended.includes('chromosomes')&&extended.includes('peroxisomes'));assert.ok(labelSets[`${cell}-5`].every(id=>taskById.get(id)!.answer.length===1));
 }
 assert.ok(!cellParts('animal').some(p=>p.id==='wall'||p.id==='chloroplasts'));
 assert.ok(!cellParts('plant').some(p=>p.id==='lysosomes'));
});
test('all fourteen functions and all three analogy directions are practiced, with flexible writing',()=>{
 assert.equal(functionIds.length,56);assert.equal(writeIds.length,14);
 for(const p of core){assert.equal(functionIds.filter(id=>taskById.get(id)!.part===p.id).length,4);for(const set of Object.values(analogySets))assert.ok(set.some(id=>taskById.get(id)!.part===p.id));}
 assert.equal(questIds.length,42);assert.equal(matchIds.flatMap(id=>taskById.get(id)!.answer).length,42);for(const ids of Object.values(functionSets))assert.equal(ids.length,14);
});
test('minor has twenty questions: five functions, five labels, five analogies, three comparisons and two writing',()=>{
 const bank=testIds.map(id=>taskById.get(id)!);assert.equal(bank.length,20);assert.equal(bank.filter(t=>t.kind==='written').length,2);assert.equal(bank.filter(t=>t.kind==='diagram-choice').length,5);
 assert.deepEqual(Object.fromEntries(['labels','functions','analogies','comparison','cell-types'].map(skill=>[skill,bank.filter(t=>t.skill===skill&&t.kind!=='written').length])),{labels:5,functions:5,analogies:5,comparison:3,'cell-types':0});
 assert.equal(legacyTestIds.length,27);assert.ok(legacyTestIds.every(id=>taskById.has(id)));
 assert.equal(new Set(testIds).size,testIds.length);
});
test('classification keys honor classroom emphasis and biological exceptions',()=>{
 const answer=(id:string)=>taskById.get(id)!.answer;
 for(const p of core)assert.deepEqual(answer(`compare-${p.id}`),[p.id==='wall'||p.id==='chloroplasts'?'plant':p.id==='lysosomes'?'animal':'both']);
 assert.equal(compareIds.length,14);assert.equal(typeIds.length,9);
 for(const id of ['dna','membrane','cytoplasm','ribosomes'])assert.deepEqual(answer(`type-${id}`),['both']);
 assert.deepEqual(answer('type-nucleoid'),['pro']);assert.deepEqual(answer('type-nucleus'),['euk']);
 assert.match(taskById.get('type-groups')!.explanation,/single-celled or multicellular/);
});
test('paragraphs reconstruct coherent original sentences and the analogy bank has one unambiguous blank',()=>{
 for(const id of paragraphIds){const t=taskById.get(id)!;const text=t.segments!.map((s,i)=>s+(t.choices.find(c=>c.id===t.answer[i])?.label??'')).join('');assert.equal(text,t.explanation);assert.ok(text.endsWith('.'));}
 const t=taskById.get('test-bank-analogy')!;assert.equal(t.answer.length,1);assert.equal(t.choices.find(c=>c.id===t.answer[0])!.label,'support and protection');
});
test('targeted review uses fresh non-test prompts across every skill',()=>{
 const quiz=new Set(testIds.map(id=>taskById.get(id)!.prompt));
 for(const id of reviewIds){assert.ok(!testIds.includes(id));assert.ok(!quiz.has(taskById.get(id)!.prompt),id)}
 for(const skill of ['labels','functions','analogies','comparison','cell-types'])assert.ok(reviewIds.filter(id=>taskById.get(id)!.skill===skill).length>=2);
});
test('new source contains no private paths, student diagnosis, learner records or source-file links',async()=>{
 const all=JSON.stringify({parts,tasks});assert.doesNotMatch(all,/\.codex|private-references|ADHD|diagnos|password|fultonschools\.org|Laney|Kaiser/);
 const source=await readFile(new URL('../science/cells/concept2/Concept2App.tsx',import.meta.url),'utf8');assert.doesNotMatch(source,/fetch\(|sendBeacon|https?:.*\.pdf/);
 const files=await readdir(new URL('../public',import.meta.url),{recursive:true});assert.ok(!files.some(p=>/Kaiser|017 -|prokaryotic.*\.pdf/i.test(String(p))));
});

test('review changes analogy situations and uses the other cell model for shared structures where possible',()=>{
 for(const id of ['membrane','nucleus','mitochondria','ribosomes'])assert.equal(taskById.get(`review-label-${id}`)!.cell,'plant');
 assert.equal(taskById.get('review-label-vacuole')!.cell,'animal');
 const original=taskById.get('test-analogy-membrane')!,fresh=taskById.get('review-analogy-membrane')!;assert.match(fresh.prompt,/park entrance/);assert.doesNotMatch(fresh.prompt,/security gate/);assert.deepEqual(fresh.answer,original.answer);
});


test('the six advanced Unit Map structures and the protein pathway are accurate and separately scaffolded',()=>{
 for(const id of ['nucleolus','nuclear-envelope','chromosomes','amyloplasts','centrosome','peroxisomes']){const p=parts.find(p=>p.id===id)!;assert.ok(p.location);assert.ok(!core.includes(p));}
 assert.match(parts.find(p=>p.id==='rough-er')!.job,/proteins/);assert.match(parts.find(p=>p.id==='smooth-er')!.job,/lipids/);assert.match(parts.find(p=>p.id==='chromosomes')!.detail,/not its everyday form/);
 const t=taskById.get(systemIds[0])!;assert.deepEqual(t.answer,['ribosomes','rough-er','golgi','vesicles']);assert.match(t.explanation,/transport vesicles carry it to the Golgi/);assert.equal(systemIds.length,7);
});
