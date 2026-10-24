import assert from 'node:assert/strict';
import test from 'node:test';
import {questions,modes,questionById,lessons,intros} from '../ela/content.ts';
import {correctAnswer} from '../ela/learning.ts';
const q=(id:string)=>{const value=questionById(id);assert.ok(value,id);return value;};
test('all 23 teacher prompts preserve photographed wording and punctuation',()=>{
 const expected=[
 ['The puppy barked.','Across the busy playground','Running quickly toward the bus','The old train rumbled.'],
 ['Before dinner','Before dinner was served','The guests arrived','Running quickly through the park','The runners were moving quickly','After the long practice','After practice ended','Covered in fresh snow'],
 ['Although the trail was steep','The hikers rested','When the bell rang','Students packed their books','If the library is open','We will return tomorrow','The artist who painted the mural','I found the book that you recommended'],
 ['Before the movie began.','Running quickly down the sidewalk.','Although the test was difficult.'],
 ];
 for(const [index,rows] of expected.entries())assert.deepEqual(questions.filter(item=>item.teacher?.level===index+1).map(item=>item.text),rows);
 assert.equal(questions.filter(item=>item.teacher).length,23);
});
test('the subject/verb keys include running as a verb form and missing subjects in phrases',()=>{
 for(const [id,subject,verb] of [['t1-1','puppy','barked'],['t1-2','missing','missing'],['t1-3','missing','running'],['t1-4','train','rumbled']])assert.equal(correctAnswer(q(id),{subject,verb}),true,id);
 assert.match(q('t1-3').explanation,/verb form/);assert.match(q('t1-3').explanation,/no complete main verb/);
 assert.equal(correctAnswer(q('t1-3'),{subject:'bus',verb:'running'}),false);
});
test('phrase/clause keys follow the entire word group rather than a picture or a starter word',()=>{
 assert.deepEqual(Array.from({length:8},(_,i)=>q(`t2-${i+1}`).answer),['c1','c2','c2','c1','c2','c1','c2','c1']);
 assert.match(q('t2-2').explanation,/was served/);assert.match(q('t2-5').explanation,/were moving/);
});
test('relative-clause questions visibly scope the embedded words and explain the whole expression',()=>{
 assert.equal(q('t3-7').focus,'who painted the mural');assert.equal(q('t3-8').focus,'that you recommended');
 for(const id of ['t3-7','t3-8']){assert.match(q(id).text,new RegExp(q(id).focus!));assert.match(q(id).scopeNote!,/highlighted words only/);assert.doesNotMatch(q(id).scopeNote!,/dependent|key.*D|independent/i);assert.equal(q(id).answer,'c2');}
 assert.match(q('t3-7').explanation,/whole line is a noun phrase/);assert.match(q('t3-8').explanation,/whole sentence is complete/);assert.match(q('t3-8').explanation,/independent main clause/);
 assert.deepEqual(Array.from({length:6},(_,i)=>q(`t3-${i+1}`).answer),['c2','c1','c2','c1','c2','c1']);
});
test('each learning level starts with two guided items before all exact teacher items',()=>{
 for(let i=1;i<=4;i++){const mode=modes[`level-${i}` as 'level-1'];assert.ok(mode.ids.slice(0,2).every(id=>q(id).guided));assert.ok(mode.ids.slice(2).every(id=>q(id).teacher?.level===i));}
 assert.equal(intros['level-1'].example,'The small bird chirped.');assert.equal(intros['level-4'].example,'Because the power went out.');
});
test('practice test has the requested 4/6/6/3 distribution and writing is not auto-graded',()=>{
 const bank=modes.test.ids.map(q);assert.equal(bank.length,19);assert.equal(bank.filter(item=>item.format==='pair').length,4);assert.equal(bank.filter(item=>item.teacher?.level===2).length,6);assert.equal(bank.filter(item=>item.teacher?.level===3).length,6);assert.equal(bank.filter(item=>item.format==='write').length,3);
 for(const item of bank.filter(item=>item.format==='write')){assert.equal(correctAnswer(item,{text:'The movie began.'}),null);assert.ok(item.model);assert.ok(item.alternatives?.length);}
 assert.ok(q('t4-1').alternatives!.includes('The movie began.'));assert.ok(q('t4-3').alternatives!.includes('The test was difficult.'));
});
test('review mixes teacher and fresh examples; targeted bank is fresh and covers every skill twice',()=>{
 assert.equal(modes.review.ids.length,12);assert.ok(modes.review.ids.some(id=>q(id).teacher));assert.ok(modes.review.ids.some(id=>!q(id).teacher));
 const fresh=questions.filter(item=>item.targeted);assert.equal(fresh.length,12);for(const skill of ['subject','verb','phrase-clause','independent-dependent','fragments','building'])assert.equal(fresh.filter(item=>item.skill===skill).length,2,skill);
 assert.ok(fresh.every(item=>!modes.test.ids.includes(item.id)&&!modes.review.ids.includes(item.id)));
});
test('question keys and sentence parts are resolvable and unique; help stays short',()=>{
 assert.equal(new Set(questions.map(item=>item.id)).size,questions.length);
 for(const item of questions){assert.ok(item.help);assert.ok(item.explanation);if(item.options){assert.equal(new Set(item.options.map(o=>o.id)).size,item.options.length);assert.ok(item.options.some(o=>o.id===item.answer),item.id);}if(item.format==='build')assert.deepEqual([...item.order!].sort(),item.parts!.map(o=>o.id).sort());}
 for(const mode of Object.values(modes))assert.ok(mode.ids.every(id=>questionById(id)));
 assert.equal(lessons.length,8);assert.match(lessons.find(item=>item.id==='verb')!.body,/state of being/);
});
