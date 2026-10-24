import assert from 'node:assert/strict';
import test from 'node:test';
import {questions,questionById,modes} from '../ela/content.ts';
import {ELA_KEY,newEla,beginEla,draftEla,submitEla,nextEla,retryEla,readEla,correctAnswer,readyAnswer,helpEla,scoreSession,checkWriting,checkSavedWriting,editResultWriting,stats,freshIds,weakSkills,lessonEla} from '../ela/learning.ts';
import type {ElaQuestion,ElaAnswer,ElaMode,ElaState} from '../ela/types.ts';
const solution=(q:ElaQuestion):ElaAnswer=>q.format==='pair'?{subject:q.subjects![0],verb:q.verbs![0]}:q.format==='write'?{text:'My own complete sentence.'}:q.format==='build'?{parts:[...q.order!]}:{choice:q.answer};
function answer(s:ElaState,a?:ElaAnswer){const q=questionById(s.session!.ids[s.session!.index])!;return submitEla(draftEla(s,a??solution(q)));}
function finish(mode:ElaMode){let s=beginEla(newEla(),mode);for(let i=0;i<100&&s.session!.phase!=='complete';i++){s=answer(s);if(s.session!.phase==='feedback')s=nextEla(s);}return s;}
const restore=(s:ElaState)=>{const loaded=readEla(JSON.stringify(s));assert.equal(loaded.corrupt,false);return loaded.state;};
test('ELA state uses a separate key; invalid root saves are preserved for explicit recovery',()=>{assert.equal(ELA_KEY,'yusuf.ela.phrases-clauses.v1');assert.deepEqual(readEla(null).state,newEla());for(const raw of ['broken','null','{}','{"version":55}'])assert.equal(readEla(raw).corrupt,true);});
test('all modes complete without mutation and every intermediate phase survives reload',()=>{
 for(const mode of Object.keys(modes).filter(m=>m!=='targeted') as ElaMode[]){let s=beginEla(newEla(),mode);const original=JSON.stringify(s);draftEla(s,solution(questionById(s.session!.ids[0])!));assert.equal(JSON.stringify(s),original);
 for(let i=0;i<100&&s.session!.phase!=='complete';i++){assert.deepEqual(restore(s),s);s=answer(s);assert.deepEqual(restore(s),s);if(s.session!.phase==='feedback')s=nextEla(s);}
 assert.equal(s.session!.phase,'complete',mode);assert.ok(s.completed.includes(mode));assert.deepEqual(restore(s),s);}
});
test('partial paired answers and long writing drafts resume; empty or invalid answers cannot submit',()=>{
 let s=beginEla(newEla(),'level-1');s=draftEla(s,{subject:'bird'});assert.deepEqual(restore(s),s);assert.equal(submitEla(s),s);
 s=draftEla(s,{subject:'bogus',verb:'chirped'});assert.equal(readyAnswer(questionById('g1-bird')!,s.session!.draft),false);
 let w=beginEla(newEla(),'level-4');w=nextEla(answer(w));w=nextEla(answer(w));w=draftEla(w,{text:' '.repeat(10)});assert.equal(submitEla(w),w);w=draftEla(w,{text:'A '.repeat(1000)});assert.deepEqual(restore(w),w);
});
test('retry is gentle, first evidence stays immutable, and an active retry resumes the same question',()=>{
 let s=beginEla(newEla(),'level-2');s=answer(s,{choice:'c2'});assert.equal(correctAnswer(questionById('g2-window')!,s.session!.responses['g2-window'].first),false);
 s=retryEla(s);assert.equal(s.session!.index,0);assert.deepEqual(restore(s),s);s=answer(s,{choice:'c1'});assert.equal(s.evidence.length,1);assert.equal(s.session!.responses['g2-window'].tries,2);assert.equal(s.session!.responses['g2-window'].first.choice,'c2');assert.equal(s.session!.responses['g2-window'].current.choice,'c1');assert.equal(scoreSession(s.session!).correct,0);
});
test('help is recorded separately, and no help or feedback can interrupt the practice test',()=>{
 let s=beginEla(newEla(),'level-1');s=helpEla(s);s=answer(s);assert.equal(s.evidence[0].helped,true);assert.equal(stats(s).subject.helped,1);assert.equal(stats(s).subject.independent,0);
 s=beginEla(newEla(),'test');assert.equal(helpEla(s),s);s=answer(s);assert.equal(s.session!.phase,'active');assert.equal(s.session!.index,1);assert.equal(nextEla(s),s);assert.equal(retryEla(s),s);
});
test('nineteen-question test scores sixteen tasks and keeps three written responses separate',()=>{
 const s=finish('test'),r=scoreSession(s.session!);assert.deepEqual(r,{correct:16,total:16,percent:100,written:3,checked:0,missed:[]});assert.equal(s.evidence.length,19);
 let wrong=beginEla(newEla(),'test');wrong=answer(wrong,{subject:'puppy',verb:'puppy'});assert.equal(scoreSession(wrong.session!).correct,0);assert.equal(stats(wrong).subject.correct,1);assert.equal(stats(wrong).verb.correct,0);
});
test('typed writing has no exact-string grade, stays editable, and checks reset after editing',()=>{
 let s=finish('level-4');const id='t4-1';assert.equal(correctAnswer(questionById(id)!,{text:'The movie began.'}),null);
 s=editResultWriting(s,id,'The movie began.');for(let i=0;i<4;i++)s=checkWriting(s,id,i);assert.equal(scoreSession(s.session!).checked,1);
 const first=s.session!.responses[id].first.text;s=editResultWriting(s,id,'The movie began, and we smiled.');assert.equal(s.session!.responses[id].first.text,first);assert.equal(scoreSession(s.session!).checked,0);assert.deepEqual(restore(s),s);
 s=editResultWriting(s,id,'');assert.equal(checkWriting(s,id,0),s);
});
test('writing self-check cannot reveal models during an active test and never affects the score',()=>{
 let s=finish('test');const before=scoreSession(s.session!).correct;s=checkWriting(s,'t4-1',0);assert.equal(scoreSession(s.session!).correct,before);
 const active=structuredClone(s);active.session!.phase='active';assert.equal(checkWriting(active,'t4-1',1),active);
});
test('targeted practice uses unseen skill examples and honestly exhausts its bank',()=>{
 let s=beginEla(newEla(),'level-2');s=answer(s,{choice:'c2'});assert.deepEqual(weakSkills(s),['phrase-clause']);assert.equal(freshIds(s).length,2);
 s=beginEla(s,'targeted');assert.ok(s.session!.ids.every(id=>questionById(id)!.targeted));const shown=[...s.session!.ids];while(s.session!.phase!=='complete'){s=answer(s);if(s.session!.phase==='feedback')s=nextEla(s);}
 assert.deepEqual(freshIds(s),[]);assert.deepEqual(weakSkills(s),[]);assert.equal(beginEla(s,'targeted'),s);assert.ok(shown.every(id=>s.seen.includes(id)));
});
test('corrupt completion, altered question lists, duplicates and nonsequential responses cannot forge test grades',()=>{
 let s=beginEla(newEla(),'test');s=answer(s);const forged=structuredClone(s);forged.session!.phase='complete';forged.session!.index=18;const restored=restore(forged);assert.equal(restored.session!.phase,'active');assert.equal(restored.session!.index,1);
 const list=structuredClone(s);list.session!.ids.reverse();assert.equal(readEla(JSON.stringify(list)).corrupt,true);
 const duplicate=structuredClone(s);duplicate.evidence.push(duplicate.evidence[0]);assert.equal(restore(duplicate).evidence.length,1);
 const hole=structuredClone(s);hole.session!.responses['t1-3']={first:{subject:'missing',verb:'running'},current:{subject:'missing',verb:'running'},helped:false,tries:1,checks:[]};assert.equal(readEla(JSON.stringify(hole)).corrupt,true);
 const completed=newEla();completed.completed=['test'];assert.deepEqual(restore(completed).completed,[]);
});
test('sentence builder rejects duplicate parts, supports correction, and restores partial order',()=>{
 let s=beginEla(newEla(),'builder');s=draftEla(s,{parts:['played','played','children']});assert.deepEqual(s.session!.draft.parts,['played','children']);assert.deepEqual(restore(s),s);assert.equal(submitEla(s),s);
 s=draftEla(s,{parts:['after','played','children']});s=submitEla(s);assert.equal(correctAnswer(questionById('build-1')!,s.session!.draft),false);s=retryEla(s);s=draftEla(s,solution(questionById('build-1')!));s=submitEla(s);assert.equal(correctAnswer(questionById('build-1')!,s.session!.draft),true);assert.equal(s.evidence.length,1);
});
test('basics position and visited frames resume without producing scored evidence',()=>{let s=newEla();for(let i=0;i<8;i++)s=lessonEla(s,i+1,true);assert.equal(s.lessonIndex,7);assert.equal(s.learned.length,8);assert.equal(s.evidence.length,0);assert.deepEqual(restore(s),s);});
test('all authored objective answers resolve correctly and malformed shapes stay unready',()=>{for(const q of questions){assert.equal(readyAnswer(q,{}),false,q.id);const a=solution(q);assert.equal(readyAnswer(q,a),true,q.id);assert.equal(correctAnswer(q,a),q.format==='write'?null:true,q.id);}});

test('saved writing remains editable across activities while each new test starts with a blank answer',()=>{
 let s=finish('level-4');s=editResultWriting(s,'t4-1','The movie began.');s=beginEla(s,'test');assert.equal(s.writing['t4-1'].text,'The movie began.');for(let i=0;i<16;i++)s=answer(s);assert.equal(s.session!.ids[s.session!.index],'t4-1');assert.deepEqual(s.session!.draft,{});s=answer(s,{text:'We cheered before the movie began.'});assert.equal(s.writing['t4-1'].text,'The movie began.');assert.equal(s.writing['test:t4-1'].text,'We cheered before the movie began.');assert.equal(checkSavedWriting(s,'test:t4-1',0),s);assert.deepEqual(restore(s),s);
});
