import assert from 'node:assert/strict';
import test from 'node:test';
import {lessons,completeTechniqueIds,finalQuestions,challengeQuestions} from '../rikki/content.ts';
import {emptyProgress,parseProgress,correctAnswer,award,finishLesson,addResult,masteredConcepts,reviewConcepts,questionBank,type RoundResult} from '../rikki/learning.ts';
test('five complete concepts, introduction only, valid distinct keys and paired final coverage',()=>{
 assert.equal(lessons.filter(l=>l.status==='complete').length,5);const pending=lessons.find(l=>l.id==='characterization')!;assert.equal(pending.example,null);assert.equal(pending.quickCheck,null);assert.equal(pending.memoryCheck,null);
 assert.equal(new Set(questionBank.map(q=>q.id)).size,questionBank.length);for(const q of questionBank){assert.ok(q.correctOptionIds.every(id=>q.options.some(o=>o.id===id)));assert.ok(correctAnswer(q,q.correctOptionIds));assert.ok(!correctAnswer(q,[...q.correctOptionIds,q.correctOptionIds[0]]));}
 for(const id of completeTechniqueIds)assert.equal(finalQuestions.filter(q=>q.conceptId===id).length,2);
 assert.ok(challengeQuestions.every(q=>q.mode==='multiple'&&q.correctOptionIds.length===2));
});
test('partial multi-select, extra choices, and fabricated choices cannot pass',()=>{const q=challengeQuestions[0];assert.ok(!correctAnswer(q,q.correctOptionIds.slice(0,1)));assert.ok(!correctAnswer(q,['made-up']));assert.ok(!correctAnswer(q,q.options.map(o=>o.id)));assert.ok(correctAnswer(q,[...q.correctOptionIds].reverse()));});
test('completed lessons and stars are awarded once; pending section stays outside completion',()=>{let p=emptyProgress();p=award(p,finalQuestions[0].id);p=award(p,finalQuestions[0].id);assert.equal(p.awards.length,1);p=award(p,'fabricated');assert.equal(p.awards.length,1);p=finishLesson(finishLesson(p,'imagery'),'imagery');assert.deepEqual(p.completed,['imagery']);assert.deepEqual(finishLesson(p,'characterization').completed,['imagery']);});
test('first answers determine mastery; targeted fresh success clears review without rewriting final evidence',()=>{
 const result:RoundResult={id:'final-1',mode:'final',evidence:finalQuestions.map(q=>({questionId:q.id,conceptId:q.conceptId,firstCorrect:q.id!=='final-foreshadow-1',attempts:q.id==='final-foreshadow-1'?2:1}))};
 assert.equal(masteredConcepts(result).length,4);assert.deepEqual(reviewConcepts(result),['foreshadowing']);let p=addResult(emptyProgress(),result);assert.deepEqual(p.needsReview,['foreshadowing']);assert.equal(addResult(p,result).results.length,1);
 p=addResult(p,{id:'target-1',mode:'targeted',evidence:finalQuestions.filter(q=>q.conceptId==='foreshadowing').map(q=>({questionId:q.id,conceptId:q.conceptId,firstCorrect:true,attempts:1}))});assert.deepEqual(p.needsReview,[]);assert.equal(masteredConcepts(p.results[0]).length,4);
});
test('saves reject malformed/unknown data and retain valid independent evidence',()=>{
 assert.deepEqual(parseProgress('broken'),emptyProgress());assert.deepEqual(parseProgress('{"version":4}'),emptyProgress());const p=emptyProgress();p.current={lessonId:'imagery',step:2};p.completed=['imagery'];p.awards=[finalQuestions[0].id];assert.deepEqual(parseProgress(JSON.stringify(p)),p);
 const bad={version:1,completed:['imagery','characterization','<script>'],awards:['fake','final-pov-1','final-pov-1'],current:{lessonId:'imagery',step:-1},needsReview:['imagery','bad'],results:[{id:'x',mode:'final',evidence:[null,{questionId:'final-pov-1',conceptId:'point-of-view',firstCorrect:true,attempts:1},{questionId:'final-pov-1',conceptId:'point-of-view',firstCorrect:true,attempts:1}]}]};
 const parsed=parseProgress(JSON.stringify(bad));assert.deepEqual(parsed.completed,['imagery']);assert.deepEqual(parsed.awards,['final-pov-1']);assert.equal(parsed.current,null);assert.equal(parsed.results[0].evidence.length,1);
});
test('combined-technique challenge results do not blame a single technique',()=>{const q=challengeQuestions[0];const p=addResult(emptyProgress(),{id:'combined-1',mode:'challenge',evidence:[{questionId:q.id,conceptId:q.conceptId,firstCorrect:false,attempts:2}]});assert.deepEqual(p.needsReview,[]);assert.equal(p.results.length,1);});
