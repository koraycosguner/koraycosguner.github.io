import test from 'node:test';
import assert from 'node:assert/strict';
import {completeQuestionIds,questions,skillLabels,stories} from '../spanish/unit3/content.ts';
import {U3_KEY,advanceU3,canRemediateU3,chooseU3,currentU3,hintU3,newU3,parseU3,removeU3,retryU3,scoreU3,shuffleU3,startU3,statusU3,submitU3,weakU3} from '../spanish/unit3/learning.ts';
import type {U3Question,U3Saved,U3Skill} from '../spanish/unit3/types.ts';

function isolated(question:U3Question,state=newU3()):U3Saved {
  return {...state,nextSession:state.nextSession+1,seen:[...new Set([...state.seen,question.id])],session:{id:state.nextSession,mode:'review',ids:[question.id],index:0,selection:[],feedback:false,hint:false,complete:false,remediationIds:[]}};
}
function respond(state:U3Saved,correct=true):U3Saved {
  const question=currentU3(state);assert.ok(question);
  const selection=correct?question.answer:question.format==='choice'?[question.choices.find(choice=>choice.id!==question.answer[0])!.id]:[...question.answer].reverse();
  for(const [slot,id] of selection.entries())state=chooseU3(state,id,question.format==='bank'?slot:undefined);
  return submitU3(state);
}
function finish(state:U3Saved,correct=true):U3Saved {
  let count=0;while(!state.session?.complete){state=respond(state,correct);if(state.session?.feedback)state=advanceU3(state);assert.ok(++count<50,'session is bounded');}return state;
}
function optionsFor(skill:U3Skill) {return questions.filter(question=>question.skill===skill&&question.format==='choice');}

test('Unit 3 has a separate versioned save; invalid data requests recovery',()=>{
  assert.equal(U3_KEY,'yusuf.spanish.unit3.v1');assert.deepEqual(parseU3(null),newU3());assert.deepEqual(parseU3(JSON.stringify(newU3())),newU3());
  for(const raw of ['{broken','[]','{"version":99}'])assert.throws(()=>parseU3(raw));
  assert.equal(scoreU3(newU3()).total,0);assert.deepEqual(weakU3(newU3()),[]);
});

test('each story contains six context questions then two mastery checks',()=>{
  for(const story of stories){
    const state=startU3(newU3(),'story',{storyId:story.id});
    assert.equal(story.questionIds.length,6);assert.equal(story.checkpointIds.length,2);
    assert.deepEqual(state.session!.ids,[...story.questionIds,...story.checkpointIds]);assert.equal(currentU3(state)!.id,story.questionIds[0]);
    assert.deepEqual(parseU3(JSON.stringify(state)),state);
    const done=finish(state);assert.deepEqual(done.completedStories,[story.id]);assert.equal(scoreU3(done).percent,100);assert.deepEqual(parseU3(JSON.stringify(done)),done);
  }
});

test('default story starts at the next unfinished school-day scene',()=>{
  let state=newU3();for(const story of stories){state=startU3(state,'story');assert.equal(state.session?.storyId,story.id);state=finish(state);}
  assert.deepEqual(state.completedStories,stories.map(story=>story.id));assert.equal(startU3(state,'story').session?.storyId,stories[0].id);
});

test('wrong response gets gentle feedback then a fresh same-concept example; first grade is immutable',()=>{
  const first=questions.find(question=>question.format==='choice'&&questions.some(other=>other.id!==question.id&&other.parallelGroup===question.parallelGroup&&other.format==='choice'));assert.ok(first);
  let state=respond(isolated(first),false);assert.equal(state.session?.feedback,true);assert.equal(state.evidence[0].correct,false);assert.equal(canRemediateU3(state),true);
  assert.equal(submitU3(state),state);assert.equal(chooseU3(state,first.answer[0]),state);
  state=advanceU3(state);const parallel=currentU3(state)!;assert.notEqual(parallel.id,first.id);assert.equal(parallel.parallelGroup,first.parallelGroup);
  state=respond(state);assert.equal(state.evidence[0].correct,false);assert.equal(state.evidence[1].correct,true);assert.equal(scoreU3(state).correct,1);
  assert.deepEqual(parseU3(JSON.stringify(state)),state);
});

test('repeated errors cannot create an endless lesson or require a correct answer to continue',()=>{
  for(const story of stories){const state=finish(startU3(newU3(),'story',{storyId:story.id}),false);assert.equal(state.session?.complete,true);assert.ok(state.session!.ids.length<=10);assert.ok(state.session!.remediationIds!.length<=2);assert.equal(scoreU3(state).percent,0);assert.deepEqual(parseU3(JSON.stringify(state)),state);}
});

test('voluntary retry never overwrites the first result or creates mastery credit',()=>{
  const question=optionsFor('estar')[0];let state=respond(isolated(question),false);const evidence=structuredClone(state.evidence);
  state=retryU3(state);assert.equal(state.session?.retry,true);assert.equal(state.session?.feedback,false);assert.deepEqual(state.session?.selection,[]);
  assert.deepEqual(parseU3(JSON.stringify(state)),state);
  state=respond(hintU3(state));assert.equal(state.session?.feedback,true);assert.deepEqual(state.evidence,evidence);assert.deepEqual(state.session?.selection,question.answer);
  assert.equal(scoreU3(state).percent,0);assert.equal(statusU3(state).find(row=>row.skill==='estar')?.independent,0);assert.deepEqual(parseU3(JSON.stringify(state)),state);
  const next=advanceU3(state);assert.equal(next.session?.retry,undefined);
});

test('hints count as support; two different independent first answers are required after a concern',()=>{
  const pool=optionsFor('estar');assert.ok(pool.length>=4);
  let state=respond(hintU3(isolated(pool[0])));assert.equal(state.evidence[0].assisted,true);assert.ok(weakU3(state).includes('estar'));
  state=respond(isolated(pool[1],state));assert.equal(statusU3(state).find(row=>row.skill==='estar')?.status,'practice');
  state=respond(isolated(pool[1],state));assert.equal(statusU3(state).find(row=>row.skill==='estar')?.independent,1,'repeat is not a second example');
  state=respond(isolated(pool[2],state));assert.equal(statusU3(state).find(row=>row.skill==='estar')?.status,'ready');
  state=respond(isolated(pool[3],state),false);assert.equal(statusU3(state).find(row=>row.skill==='estar')?.status,'review');
  state=respond(isolated(pool[1],state));assert.equal(statusU3(state).find(row=>row.skill==='estar')?.independent,0,'a familiar old item cannot establish transfer after a new error');
});

test('test is 32 balanced questions, with one reading passage and exactly two required visual tasks',()=>{
  const quotas:Record<U3Skill,number>={estar:4,'ser-estar':1,prepositions:4,places:3,days:3,months:2,numbers:2,ordinals:2,dates:2,time:4,schedule:3,'start-end':2};
  let state=newU3();const signatures=new Set<string>();
  for(let index=0;index<100;index++){
    state=startU3(state,'test');const ids=state.session!.ids,chosen=ids.map(id=>questions.find(question=>question.id===id)!);signatures.add(ids.join('|'));
    assert.equal(ids.length,32);assert.equal(new Set(ids).size,32);assert.equal(ids.filter(id=>id==='test-reading-school-day').length,1);assert.equal(chosen.filter(question=>question.visual).length,2);
    assert.ok(chosen.every(question=>question.test&&question.format==='choice'&&question.choices.length>=3&&question.choices.length<=4));
    for(const [skill,count] of Object.entries(quotas))assert.equal(chosen.filter(question=>question.skill===skill).length,count,skill);
    assert.deepEqual(parseU3(JSON.stringify(state)),state);
  }
  assert.ok(signatures.size>1,'later tests vary their items/order');
});

test('test has no help or immediate feedback, automatically advances, and reports first-attempt score',()=>{
  let state=startU3(newU3(),'test');let count=0;
  while(!state.session?.complete){assert.equal(hintU3(state),state);assert.equal(retryU3(state),state);state=respond(state,count%2===0);assert.equal(state.session?.feedback,false);assert.equal(state.session?.index,++count);assert.deepEqual(parseU3(JSON.stringify(state)),state);}
  assert.equal(count,32);assert.equal(scoreU3(state).correct,16);assert.equal(scoreU3(state).percent,50);assert.equal(scoreU3(state).assisted,0);assert.equal(scoreU3(state).total,32);
});

test('review rotates a broad mix and a chosen category stays focused',()=>{
  const all=new Set<string>();let state=newU3();
  for(let i=0;i<4;i++){state=startU3(state,'review');assert.equal(state.session?.ids.length,10);const seen=new Set(state.session!.ids.map(id=>questions.find(q=>q.id===id)!.skill));assert.equal(seen.size,10);seen.forEach(skill=>all.add(skill));}
  assert.equal(all.size,Object.keys(skillLabels).length);
  const focused=startU3(state,'review',{skill:'time'});assert.ok(focused.session!.ids.every(id=>questions.find(q=>q.id===id)!.skill==='time'));
});

test('targeted review gives unseen variants and an honest empty result when exhausted',()=>{
  const question=optionsFor('prepositions')[0];const state=respond(isolated(question),false);
  const next=startU3(state,'targeted',{skill:'prepositions'});assert.ok(next.session!.ids.length>0&&next.session!.ids.length<=5);assert.ok(next.session!.ids.every(id=>!state.seen.includes(id)));
  const exhausted=startU3({...state,seen:questions.map(q=>q.id)},'targeted',{skill:'prepositions'});assert.equal(exhausted.session?.complete,true);assert.deepEqual(exhausted.session?.ids,[]);assert.equal(scoreU3(exhausted).total,0);
  assert.deepEqual(startU3(newU3(),'targeted').session?.ids,[],'do not invent a weakness for a new learner');
});

test('bank supports tap placement, replacement, moving, removing, and reload with an empty middle slot',()=>{
  let state=startU3(newU3(),'complete');const question=currentU3(state)!;assert.equal(question.format,'bank');assert.equal(question.answer.length,5);assert.deepEqual(state.session!.ids,completeQuestionIds);
  const [a,b,c]=question.answer;
  state=chooseU3(state,a,0);state=chooseU3(state,b,1);state=chooseU3(state,c,2);state=chooseU3(state,a,3);
  assert.deepEqual(state.session?.selection,['',b,c,a,'']);
  state=chooseU3(state,b,3);assert.deepEqual(state.session?.selection,['','',c,b,''],'replacement returns old token to bank');
  state=removeU3(state,2);assert.deepEqual(state.session?.selection,['','','',b,'']);assert.deepEqual(parseU3(JSON.stringify(state)),state);
  assert.equal(submitU3(state),state,'incomplete blanks cannot be submitted');
  for(let index=0;index<question.answer.length;index++)state=chooseU3(state,question.answer[index],index);
  state=submitU3(state);assert.equal(state.evidence[0].correct,true);assert.equal(state.evidence[0].assisted,true);
  state=advanceU3(state);assert.notEqual(currentU3(state)?.id,question.id);
});

test('date ordering supports undo and never asserts independent recall from supplied tokens',()=>{
  const question=questions.find(q=>q.format==='order');assert.ok(question);let state=isolated(question);
  state=chooseU3(state,question.answer[0]);assert.equal(chooseU3(state,question.answer[0]),state);state=removeU3(state,0);assert.deepEqual(state.session?.selection,[]);
  state=respond(state);assert.equal(state.evidence[0].assisted,true);assert.equal(statusU3(state).find(row=>row.skill===question.skill)?.status,'practice');
});

test('a missed date builder offers a fresh ordered date, reloads correctly and preserves first evidence',()=>{
  const story=stories.find(item=>item.id==='calendar')!;
  let state=startU3(newU3(),'story',{storyId:story.id});
  while(currentU3(state)?.format!=='order')state=advanceU3(respond(state));
  const original=currentU3(state)!;state=respond(state,false);const evidence=structuredClone(state.evidence);
  assert.equal(canRemediateU3(state),true);state=advanceU3(state);const fresh=currentU3(state)!;
  assert.equal(fresh.format,'order');assert.equal(fresh.parallelGroup,original.parallelGroup);assert.notEqual(fresh.id,original.id);assert.notEqual(fresh.prompt,original.prompt);
  state=chooseU3(state,fresh.answer[0]);assert.deepEqual(parseU3(JSON.stringify(state)),state);state=removeU3(state,0);state=respond(state);
  assert.deepEqual(state.evidence.slice(0,-1),evidence);assert.equal(state.evidence.at(-1)?.assisted,true);assert.equal(state.evidence.at(-1)?.correct,true);
  assert.deepEqual(parseU3(JSON.stringify(state)),state);assert.equal(state.session?.remediationIds?.length,1);
});

test('saved answers are bank-validated and re-scored instead of trusting supplied grades',()=>{
  let state=respond(startU3(newU3(),'story'),false);const raw=JSON.parse(JSON.stringify(state));raw.evidence[0].correct=true;raw.evidence[0].skill='fake';raw.evidence.push({...raw.evidence[0]});raw.evidence.push({...raw.evidence[0],questionId:'missing'});raw.completedStories=stories.map(story=>story.id);raw.seen.push('missing');
  state=parseU3(JSON.stringify(raw));assert.equal(state.evidence.length,1);assert.equal(state.evidence[0].correct,false);assert.deepEqual(state.completedStories,[]);assert.ok(!state.seen.includes('missing'));
});

test('restored answer evidence keeps familiar items out of fresh review even if seen list is missing',()=>{
  const question=optionsFor('estar')[0],state=respond(isolated(question),false),raw=JSON.parse(JSON.stringify(state));delete raw.seen;
  const restored=parseU3(JSON.stringify(raw));assert.ok(restored.seen.includes(question.id));
  assert.ok(!startU3(restored,'targeted',{skill:'estar'}).session!.ids.includes(question.id));
});

test('resuming cannot skip unanswered items or trust a forged completion marker',()=>{
  const state=startU3(newU3(),'story'),raw=JSON.parse(JSON.stringify(state));raw.session.index=raw.session.ids.length;raw.session.complete=true;raw.session.feedback=true;
  const restored=parseU3(JSON.stringify(raw));assert.equal(restored.session?.index,0);assert.equal(restored.session?.complete,false);assert.equal(restored.session?.feedback,false);assert.deepEqual(restored.completedStories,[]);
  raw.session.ids[0]='fake';assert.equal(parseU3(JSON.stringify(raw)).session,null);
});

test('test session rejects wrong length, unsupported formats, and duplicated questions',()=>{
  const state=startU3(newU3(),'test');
  for(const mutation of [(raw:U3Saved)=>raw.session!.ids.pop(),(raw:U3Saved)=>{raw.session!.ids[0]=raw.session!.ids[1];},(raw:U3Saved)=>{raw.session!.ids[0]=completeQuestionIds[0];}]){const raw=structuredClone(state);mutation(raw);assert.equal(parseU3(JSON.stringify(raw)).session,null);}
});

test('completed stories require every question and checkpoint in one story session',()=>{
  let state=startU3(newU3(),'story');while(state.session!.index<7){state=advanceU3(respond(state));}
  state=respond(state);assert.deepEqual(state.completedStories,[]);assert.deepEqual(parseU3(JSON.stringify(state)).completedStories,[],'feedback is not yet completed');
  state=advanceU3(state);assert.deepEqual(state.completedStories,[stories[0].id]);assert.deepEqual(parseU3(JSON.stringify(state)),state);
});

test('all transitions preserve the caller state and invalid moves have no effect',()=>{
  const state=startU3(newU3(),'story'),original=structuredClone(state),question=currentU3(state)!;
  chooseU3(state,question.answer[0]);hintU3(state);startU3(state,'review');assert.deepEqual(state,original);
  assert.equal(chooseU3(state,'unknown'),state);assert.equal(removeU3(state,-1),state);assert.equal(advanceU3(state),state);assert.equal(submitU3(state),state);assert.equal(startU3(state,'story',{storyId:'missing'}),state);
});

test('shuffling is stable, preserves all choices, and does not mutate the original',()=>{
  const ids=['a','b','c','d'],copy=[...ids];assert.deepEqual(shuffleU3(ids,'session:question'),shuffleU3(ids,'session:question'));assert.deepEqual([...shuffleU3(ids,'key')].sort(),ids);assert.deepEqual(ids,copy);assert.ok(new Set(Array.from({length:10},(_,index)=>shuffleU3(ids,String(index)).join(''))).size>1);
});
