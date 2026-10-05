import test from 'node:test';
import assert from 'node:assert/strict';
import {storyScenes,storyTurns,reviewTurns} from '../spanish/story-content.ts';
import {availableScene,completedScene,conceptEvidence,matchesStoryAnswer,markStorySupport,newStory,parseStory,recordStoryAttempt,STORY_KEY,suggestedReview} from '../spanish/story-learning.ts';
import {STORAGE_KEY} from '../spanish/learning.ts';

const get=(id:string)=>storyTurns.find(t=>t.id===id)!;
test('story curriculum: contextual three-choice banks, scaffold order, complete accepted models',()=>{
  assert.equal(storyScenes.length,7);assert.equal(storyTurns.length,40);
  assert.equal(new Set([...storyTurns,...reviewTurns].map(t=>t.id)).size,54);
  const uses=new Set(storyTurns.map(t=>t.serUse).filter(Boolean));assert.equal(uses.size,9);
  for(const turn of [...storyTurns,...reviewTurns]){
    assert.ok(turn.context&&turn.prompt&&turn.hint&&turn.success);
    if(turn.kind==='choice'){assert.equal(turn.options?.length,3);assert.equal(turn.options!.filter(o=>turn.answers.includes(o)).length,1)}
    if(turn.kind==='builder'){
      for(const step of turn.stages!){assert.equal(step.options.length,3);assert.equal(step.options.filter(x=>x===step.answer).length,1)}
      assert.ok(matchesStoryAnswer(turn,turn.stages!.map(s=>s.answer).join(' ')));
    }
    if(turn.kind==='response')assert.ok(matchesStoryAnswer(turn,turn.model));
  }
  assert.ok(storyTurns.findIndex(t=>t.kind==='builder')<storyTurns.findIndex(t=>t.kind==='response'));
  assert.ok(storyTurns.filter(t=>t.concept==='tu').length>=3);
  assert.ok(storyTurns.filter(t=>t.concept==='self').length>=4);
});
test('complete sentence validation accepts accents/punctuation but rejects keyword and injected text',()=>{
  const q=get('final-self');assert.ok(matchesStoryAnswer(q,' ¡Yo soy Yusuf! '));
  assert.equal(matchesStoryAnswer(q,'Yusuf'),false);assert.equal(matchesStoryAnswer(q,'Yo eres Yusuf'),false);
  assert.equal(matchesStoryAnswer(q,'<img src=x>Yo soy Yusuf'),false);
  assert.ok(matchesStoryAnswer(get('rehearsal-class-description'),'La clase es divertida'));
  assert.equal(matchesStoryAnswer(get('rehearsal-class-description'),'divertida'),false);
});
test('hints persist before an answer without creating attempted evidence or independent success',()=>{
  let p=markStorySupport(newStory(),get('welcome-self'));
  assert.equal(p.evidence['welcome-self'].attempts,0);assert.deepEqual(conceptEvidence(p),{});
  p=parseStory(JSON.stringify(p));p=recordStoryAttempt(p,get('welcome-self'),true,false);
  assert.equal(p.evidence['welcome-self'].firstCorrect,true);assert.equal(p.evidence['welcome-self'].assisted,true);
  assert.equal(conceptEvidence(p).self!.independent,0);assert.equal(conceptEvidence(p).self!.completed,1);
});
test('retry completion is idempotent and preserves original first response',()=>{
  let p=recordStoryAttempt(newStory(),get('welcome-tu'),false,false);
  p=recordStoryAttempt(p,get('welcome-tu'),true,false);
  assert.equal(p.evidence['welcome-tu'].attempts,2);assert.equal(p.evidence['welcome-tu'].firstCorrect,false);
  assert.equal(recordStoryAttempt(p,get('welcome-tu'),true,false),p);
  assert.equal(conceptEvidence(p).tu!.independent,0);
});
test('later contextual review targets the concept tried with support and resolves it independently',()=>{
  let p=recordStoryAttempt(newStory(),get('welcome-tu'),false,false);
  p=recordStoryAttempt(p,get('welcome-self'),true,false);
  const review=suggestedReview(p);assert.equal(review.length,1);assert.equal(review[0].concept,'tu');
  assert.ok(!storyTurns.some(q=>q.id===review[0].id));
  p=recordStoryAttempt(p,review[0],true,false);assert.equal(suggestedReview(p).length,0);
});
test('progress parser protects scene order, accepts completed cursor and drops unrecognized state',()=>{
  let p=newStory();p.cursor=storyScenes[6].turns[0].id;
  assert.equal(parseStory(JSON.stringify(p)).cursor,storyTurns[0].id);assert.equal(availableScene(p,1),false);
  for(const t of storyScenes[0].turns)p=recordStoryAttempt(p,t,true,false);
  assert.ok(completedScene(p,0));assert.ok(availableScene(p,1));
  p.cursor=storyScenes[1].turns[0].id;
  const parsed=parseStory(JSON.stringify({...p,evidence:{...p.evidence,secret:{attempts:5,complete:true}},seenObjects:['lapiz','<script>']}));
  assert.equal(parsed.cursor,p.cursor);assert.equal(parsed.evidence.secret,undefined);assert.deepEqual(parsed.seenObjects,['lapiz']);
  assert.throws(()=>parseStory('broken'));assert.throws(()=>parseStory('{"version":2}'));
});
test('visible backpack and answer keys change only at the successful packing step',()=>{
  const before=get('bag-absent');const pack=get('bag-pack');const after=get('bag-plural');
  assert.equal(before.inventory!.tijeras,0);assert.equal(pack.inventory!.tijeras,0);assert.equal(pack.inventorySet!.tijeras,1);
  assert.equal(after.inventory!.tijeras,1);assert.equal(after.inventory!.lapiz,2);
  assert.equal(before.answers[0],'No, no hay.');assert.equal(after.answers[0],'Hay dos lápices.');
  assert.ok(matchesStoryAnswer(get('bag-describe'),'Hay dos lápices y un cuaderno.'));
});
test('story save is separate from historical quiz grades and includes no typed learner responses',()=>{
  assert.notEqual(STORY_KEY,STORAGE_KEY);
  const q=get('final-self');const p=recordStoryAttempt(newStory(),q,true,false);
  assert.deepEqual(Object.keys(p.evidence[q.id]).sort(),['assisted','attempts','complete','firstCorrect']);
  assert.equal(JSON.stringify(p).includes(q.model),false);
});
