import test from 'node:test';
import assert from 'node:assert/strict';
import {emptyStudy,startStudy,chooseStudy,helpStudy,checkStudy,retryStudy,advanceStudy,parseStudy,studyScore,studyOptions} from '../spanish/study-learning.ts';
import type {StudyQuestion} from '../spanish/study-types.ts';
const q:StudyQuestion={id:'chain',chapter:'Friends',context:'Two girls',steps:[
 {prompt:'Who?',options:['ellas','ellos','ustedes'],answer:'ellas',hint:'ABOUT two girls.',explanation:'ellas',help:'pronouns'},
 {prompt:'SER?',options:['son','es','somos'],answer:'son',hint:'Two people.',explanation:'son',help:'ser'},
 {prompt:'Description?',options:['organizadas','organizados','organizada'],answer:'organizadas',hint:'Feminine plural.',explanation:'organizadas',help:'adjectives'},
]};
const qs=[q];
type MutableRecord={session:{index:number;step:number;complete:boolean;ids:string[];choice:string|null;feedback:boolean;answers:unknown}};
test('three-step scaffold requires a correct retry, but does not rewrite first-answer score',()=>{
 let s=startStudy(emptyStudy(),'lesson',qs,'agreement');
 s=chooseStudy(s,'ellos',q);s=checkStudy(s,q);
 assert.equal(advanceStudy(s,q),s);assert.equal(checkStudy(s,q),s);
 s=retryStudy(s);s=chooseStudy(s,'ellas',q);s=checkStudy(s,q);s=advanceStudy(s,q);
 assert.equal(s.session!.step,1);
 s=helpStudy(s);s=chooseStudy(s,'son',q);s=checkStudy(s,q);s=advanceStudy(s,q);
 assert.equal(s.session!.step,2);
 s=chooseStudy(s,'organizadas',q);s=checkStudy(s,q);s=advanceStudy(s,q);
 assert.equal(s.session!.complete,true);assert.deepEqual(s.lessons,['agreement']);
 assert.deepEqual(studyScore(s.session!,qs),{total:3,answered:3,correct:2,assisted:1});
 assert.deepEqual(parseStudy(JSON.stringify(s),qs,['agreement']),s);
});
test('test answers submit once and can continue after a miss',()=>{
 let s=startStudy(emptyStudy(),'test',qs);s=chooseStudy(s,'ellos',q);s=checkStudy(s,q);
 assert.equal(retryStudy(s),s);assert.equal(checkStudy(s,q),s);assert.equal(chooseStudy(s,'ellas',q),s);
 s=advanceStudy(s,q);assert.equal(s.session!.step,1);
 assert.equal(studyScore(s.session!,qs).correct,0);
});
test('restore retains unsubmitted selection, help and step cursor',()=>{
 let s=startStudy(emptyStudy(),'story',qs);s=helpStudy(s);s=chooseStudy(s,'ellas',q);
 assert.deepEqual(parseStudy(JSON.stringify(s),qs,[]),s);
 s=checkStudy(s,q);s=advanceStudy(s,q);s=chooseStudy(s,'son',q);
 assert.deepEqual(parseStudy(JSON.stringify(s),qs,[]),s);
});
test('malformed/stale storage cannot skip steps or fabricate a finished test',()=>{
 for(const value of ['{','null','[]','{"version":2}','{"version":1,"lessons":null}'])assert.deepEqual(parseStudy(value,qs,[]),emptyStudy());
 const started=startStudy(emptyStudy(),'test',qs);
 for(const mutate of [
 (s:MutableRecord)=>{s.session.index=1;s.session.complete=true},
 (s:MutableRecord)=>{s.session.step=2},
 (s:MutableRecord)=>{s.session.ids=['removed-question']},
 (s:MutableRecord)=>{s.session.choice='injected'},
 (s:MutableRecord)=>{s.session.feedback=true},
 (s:MutableRecord)=>{s.session.answers=[]},
 ]){const s=structuredClone(started);mutate(s as MutableRecord);assert.equal(parseStudy(JSON.stringify(s),qs,[]).session,null)}
});
test('stale session drops without erasing valid finished lessons',()=>{
 const s=startStudy({...emptyStudy(),lessons:['agreement']},'test',qs);s.session!.ids=['old-version'];
 assert.deepEqual(parseStudy(JSON.stringify(s),qs,['agreement']),{version:1,session:null,lessons:['agreement']});
});
test('answer options have a stable varied order without changing their values',()=>{
 const options=q.steps[0].options;
 assert.deepEqual(studyOptions(options,'a'),studyOptions(options,'a'));
 for(const seed of ['a','b','c','d'])assert.deepEqual([...studyOptions(options,seed)].sort(),[...options].sort());
 assert.ok(new Set(Array.from({length:30},(_,i)=>studyOptions(options,String(i)).join(','))).size>1);
 assert.deepEqual(options,['ellas','ellos','ustedes']);
});
