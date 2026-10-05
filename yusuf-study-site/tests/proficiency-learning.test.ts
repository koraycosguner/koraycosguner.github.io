import test from 'node:test';
import assert from 'node:assert/strict';
import {lessonPractice, prepSkillLabels, proficiencyQuestions, proficiencyReview} from '../spanish/proficiency-content.ts';
import {PREP_KEY, advancePrep, choosePrep, completePrepLesson, currentPrepEvidence, currentPrepQuestion, getPrepQuestion, markPrepHint, mixedPrepQuestions,
  newPrep, parsePrep, prepScore, prepSkillStatus, retryPrep, reviewPrepQuestions, startPrep, submitPrep, type SavedPrep} from '../spanish/proficiency-learning.ts';

const all=[...proficiencyQuestions,...proficiencyReview,...Object.values(lessonPractice).flat()];
function answer(state:SavedPrep,correct=true) {
  const step=currentPrepQuestion(state)!.steps[state.currentSession!.stepIndex];
  return submitPrep(choosePrep(state,correct?step.answer:step.options.find(option=>option!==step.answer)!));
}
function finish(state:SavedPrep) {
  while(!state.currentSession!.complete)state=advancePrep(answer(state));
  return state;
}

test('proficiency curriculum has unique IDs, valid answer keys, predominant three-choice steps, and disjoint fresh review',()=>{
  assert.equal(new Set(all.map(question=>question.id)).size,all.length);
  assert.ok(proficiencyQuestions.length>=50,'a substantial proficiency test');
  const steps=all.flatMap(question=>question.steps);
  assert.ok(steps.filter(step=>step.options.length===3).length/steps.length>.8);
  const observed=new Set<string>();
  for(const question of all) {
    assert.match(question.id,/^[a-z0-9-]+$/);
    assert.ok(question.steps.length>0);
    assert.equal(getPrepQuestion(question.id),question);
    for(const step of question.steps) {
      assert.ok([2,3].includes(step.options.length));
      assert.equal(new Set(step.options).size,step.options.length);
      assert.ok(step.options.includes(step.answer),`${question.id} answer missing from choices`);
      assert.ok(step.prompt.trim()&&step.explanation.trim()&&step.hint.trim());
      assert.ok(Object.hasOwn(prepSkillLabels,step.skill));
      observed.add(step.skill);
    }
  }
  for(const skill of Object.keys(prepSkillLabels))assert.ok(observed.has(skill),`no ${skill} evidence`);
  assert.ok(proficiencyReview.every(question=>!proficiencyQuestions.some(main=>main.id===question.id)));
});

test('new practice has English help and its own storage key; malformed saves signal recovery',()=>{
  assert.equal(PREP_KEY,'yusuf.spanish.proficiency.v1');
  assert.deepEqual(parsePrep(null),newPrep());
  assert.equal(newPrep().english,true);
  assert.equal(prepScore(newPrep()).total,0);
  assert.throws(()=>parsePrep('{broken'));
  assert.throws(()=>parsePrep('{"version":99}'));
  assert.throws(()=>parsePrep('[]'));
});

test('submit requires a known selected option and duplicate clicks do not add attempts',()=>{
  let state=startPrep(newPrep(),'prep',[proficiencyQuestions[0].id]);
  assert.equal(submitPrep(state),state);
  assert.equal(choosePrep(state,'private free-form text'),state);
  assert.equal(currentPrepEvidence(state),undefined);
  state=answer(state,false);
  const submitted=state;
  assert.equal(submitPrep(state),submitted);
  assert.equal(choosePrep(state,currentPrepQuestion(state)!.steps[0].answer),submitted);
  assert.equal(currentPrepEvidence(state)!.attempts,1);
});

test('supported retry does not rewrite the original grade',()=>{
  let state=startPrep(newPrep(),'prep',[proficiencyQuestions[0].id]);
  state=answer(state,false);
  const firstChoice=currentPrepEvidence(state)!.firstChoice;
  state=answer(markPrepHint(retryPrep(state)));
  assert.equal(currentPrepEvidence(state)!.firstChoice,firstChoice);
  assert.equal(currentPrepEvidence(state)!.attempts,2);
  assert.equal(currentPrepEvidence(state)!.firstCorrect,false);
  assert.equal(currentPrepEvidence(state)!.correct,true);
  assert.equal(prepScore(state).firstCorrect,0);
  assert.equal(prepScore(state).recovered,1);
  assert.equal(prepScore(state).assisted,1);
  assert.equal(retryPrep(state),state);
});

test('hint use is saved before submission and stays separate from first-answer accuracy',()=>{
  let state=startPrep(newPrep(),'prep',[proficiencyQuestions[0].id]);
  state=markPrepHint(state);
  assert.equal(currentPrepEvidence(state)!.attempts,0);
  state=parsePrep(JSON.stringify(state));
  assert.equal(currentPrepEvidence(state)!.assisted,true);
  state=answer(state);
  assert.equal(prepScore(state).firstCorrect,1);
  assert.equal(prepScore(state).assisted,1);
  assert.equal(prepSkillStatus(state).find(row=>row.skill===currentPrepEvidence(state)!.skill)!.status,'review');
});

test('full test disallows hints, advances after a miss, and persists its first score',()=>{
  let state=startPrep(newPrep(),'test',[proficiencyQuestions[0].id]);
  assert.equal(markPrepHint(state),state);
  state=answer(state,false);
  assert.notEqual(advancePrep(state),state);
  const restored=parsePrep(JSON.stringify(state));
  assert.deepEqual(prepScore(restored),prepScore(state));
  assert.equal(currentPrepEvidence(restored)!.firstCorrect,false);
});

test('selection, wrong feedback, retry state and two-step cursor each survive a reload',()=>{
  const question=proficiencyQuestions.find(question=>question.steps.length>1)!;
  assert.ok(question,'connected two-step WHO / pronoun / SER example');
  let state=startPrep(newPrep(),'prep',[question.id]);
  state=choosePrep(state,question.steps[0].answer);
  assert.deepEqual(parsePrep(JSON.stringify(state)),state);
  state=answer(state,false);
  assert.deepEqual(parsePrep(JSON.stringify(state)),state);
  state=retryPrep(state);
  assert.deepEqual(parsePrep(JSON.stringify(state)),state);
  state=advancePrep(answer(state));
  assert.equal(state.currentSession!.stepIndex,1);
  assert.deepEqual(parsePrep(JSON.stringify(state)),state);
});

test('finished sessions resume at their summary and include every scored step',()=>{
  const question=proficiencyQuestions.find(question=>question.steps.length>1)!;
  const state=finish(startPrep(newPrep(),'test',[question.id,proficiencyQuestions.find(item=>item.id!==question.id)!.id]));
  assert.equal(state.currentSession!.complete,true);
  assert.equal(currentPrepQuestion(state),undefined);
  assert.equal(prepScore(state).answered,prepScore(state).total);
  assert.equal(prepScore(state).percent,100);
  assert.deepEqual(parsePrep(JSON.stringify(state)),state);
  assert.equal(advancePrep(state),state);
});

test('distinct run IDs retain past grades without duplicating current-run points',()=>{
  let state=startPrep(newPrep(),'test',[proficiencyQuestions[0].id]);
  state=answer(state,false);
  const firstSession=state.currentSession!.id;
  state=startPrep(state,'test',[proficiencyQuestions[0].id]);
  state=answer(state);
  assert.notEqual(state.currentSession!.id,firstSession);
  assert.equal(prepScore(state).firstCorrect,1);
  assert.equal(prepScore(state,firstSession).firstCorrect,0);
  assert.equal(Object.values(state.evidence).length,2);
});

test('readiness needs two fresh independent examples; repeating one is insufficient',()=>{
  const pair=all.find(first=>all.some(second=>second.id!==first.id&&second.steps[0].skill===first.steps[0].skill))!;
  const second=all.find(question=>question.id!==pair.id&&question.steps[0].skill===pair.steps[0].skill)!;
  const skill=pair.steps[0].skill;
  let state=answer(startPrep(newPrep(),'prep',[pair.id]));
  assert.equal(prepSkillStatus(state).find(row=>row.skill===skill)!.status,'little-more');
  state=answer(startPrep(state,'prep',[pair.id]));
  assert.equal(prepSkillStatus(state).find(row=>row.skill===skill)!.independent,1);
  state=answer(startPrep(state,'prep',[second.id]));
  assert.equal(prepSkillStatus(state).find(row=>row.skill===skill)!.status,'ready');
  state=answer(startPrep(state,'prep',[pair.id]),false);
  assert.equal(prepSkillStatus(state).find(row=>row.skill===skill)!.status,'review');
  state=answer(startPrep(state,'prep',[pair.id]));
  assert.equal(prepSkillStatus(state).find(row=>row.skill===skill)!.status,'review','a memorized repeat cannot erase a recent concern');
  assert.ok(prepSkillStatus(newPrep()).every(row=>row.status==='unseen'));
});

test('new targeted review uses disjoint examples and never repeats an already displayed item',()=>{
  const question=proficiencyQuestions.find(question=>proficiencyReview.some(review=>review.steps.some(step=>step.skill===question.steps[0].skill)))!;
  let state=answer(startPrep(newPrep(),'prep',[question.id]),false);
  const review=reviewPrepQuestions(state);
  assert.ok(review.length>0);
  assert.ok(review.every(item=>item.id!==question.id&&item.steps.some(step=>step.skill===question.steps[0].skill)));
  state=startPrep(state,'review',review.map(item=>item.id));
  assert.ok(!reviewPrepQuestions(state).some(item=>item.id===review[0].id));
  // An abandoned run does not consume examples that were never displayed.
  if(review.length>1)assert.ok(reviewPrepQuestions(state).some(item=>item.id===review[1].id));
  const exhausted={...state,seenQuestions:proficiencyReview.map(item=>item.id)};
  assert.deepEqual(reviewPrepQuestions(exhausted),[]);
});

test('mixed practice balances twelve distinct questions in a connected school-day order on every rotation',()=>{
  const worldOrder=['arrival','backpack','classroom','schedule','friends','band'];
  const pools=new Set(proficiencyQuestions.map(question=>question.id));
  let previous:string[]=[];
  const coveredSkills=new Set<string>();
  for(let nextSession=1;nextSession<=40;nextSession++) {
    const state={...newPrep(),nextSession};
    const before=JSON.stringify(state);
    const questions=mixedPrepQuestions(state),ids=questions.map(question=>question.id);
    assert.equal(questions.length,12);
    assert.equal(new Set(ids).size,12);
    assert.ok(ids.every(id=>pools.has(id)),'use the proficiency bank, preserving fresh review examples');
    assert.deepEqual(mixedPrepQuestions(state).map(question=>question.id),ids,'deterministic before a run starts');
    assert.equal(JSON.stringify(state),before,'selection is pure');
    assert.notDeepEqual(ids,previous,'rotate fresh examples instead of repeating the identical mini-test');
    previous=ids;
    assert.deepEqual(questions.map(question=>worldOrder.indexOf(question.world)),[0,0,0,1,1,2,2,3,3,4,4,5]);
    const skills=new Set(questions.flatMap(question=>question.steps.map(step=>step.skill)));
    skills.forEach(skill=>coveredSkills.add(skill));
    for(const skill of ['hay','backpack','classroom','subjects','likes','reading'] as const)assert.ok(skills.has(skill),`run ${nextSession}: ${skill}`);
    assert.ok(skills.has('articles')||skills.has('plural'));
    assert.ok(skills.has('adjectives')||skills.has('origin'));
    const pairs=questions.filter(question=>question.world==='arrival'&&question.steps.length>1);
    assert.equal(pairs.length,2);
    assert.equal(new Set(pairs.map(question=>question.people?.perspective)).size,2,'contrast two group perspectives');
    assert.ok(pairs.every(question=>question.steps.some(step=>['soy','eres','es','somos','son'].includes(step.skill))));
    assert.ok(questions.some(question=>question.world==='backpack'&&question.inventory&&question.steps.some(step=>step.skill==='hay')));
    assert.ok(questions.some(question=>question.reading&&question.steps.some(step=>step.skill==='reading')));
  }
  for(const skill of Object.keys(prepSkillLabels))assert.ok(coveredSkills.has(skill),`rotating practice eventually includes ${skill}`);
});

test('every tracked skill can recover from a miss through two fresh independent review examples',()=>{
  for(const skill of Object.keys(prepSkillLabels)) {
    const initial=proficiencyQuestions.find(question=>question.steps.some(step=>step.skill===skill));
    const reviews=proficiencyReview.filter(question=>question.steps.some(step=>step.skill===skill));
    assert.ok(initial,`${skill}: a main-test question exists`);
    assert.ok(reviews.length>=2,`${skill}: two distinct review examples exist`);
    function respond(state:SavedPrep,questionId:string,correct:boolean) {
      let next=startPrep(state,'prep',[questionId]);
      while(currentPrepQuestion(next)!.steps[next.currentSession!.stepIndex].skill!==skill)next=advancePrep(answer(next));
      return answer(next,correct);
    }
    let state=respond(newPrep(),initial.id,false);
    assert.equal(prepSkillStatus(state).find(row=>row.skill===skill)!.status,'review',`${skill}: first miss is tracked`);
    assert.ok(reviews.slice(0,2).every(question=>reviewPrepQuestions(state).some(next=>next.id===question.id)));
    state=respond(state,reviews[0].id,true);
    assert.equal(prepSkillStatus(state).find(row=>row.skill===skill)!.independent,1,`${skill}: one fresh independent example`);
    state=respond(state,reviews[1].id,true);
    assert.equal(prepSkillStatus(state).find(row=>row.skill===skill)!.status,'ready',`${skill}: two fresh successes show readiness`);
    assert.ok(Object.values(state.evidence).some(entry=>entry.questionId===initial.id&&entry.skill===skill&&!entry.firstCorrect),`${skill}: original miss stays recorded`);
  }
});

test('guided lesson completion requires correct practice, including supported retries',()=>{
  const [lessonId,questions]=Object.entries(lessonPractice)[0];
  assert.ok(questions.length);
  let state=startPrep(newPrep(),'guided',questions.map(question=>question.id),lessonId);
  state=answer(markPrepHint(retryPrep(answer(state,false))));
  state=advancePrep(state);
  state=finish(state);
  assert.ok(state.completedLessons.includes(lessonId));
  assert.equal(completePrepLesson(state,lessonId),state);
  assert.equal(completePrepLesson(state,'unknown lesson'),state);
  assert.equal(prepScore(state).recovered,1);
  let incomplete=startPrep(newPrep(),'guided',questions.map(question=>question.id),lessonId);
  incomplete=advancePrep(answer(incomplete,false));
  incomplete=finish(incomplete);
  assert.ok(!incomplete.completedLessons.includes(lessonId));
});

test('guided examples count as supported learning, never independent readiness',()=>{
  const [lessonId,questions]=Object.entries(lessonPractice)[0];
  const state=finish(startPrep(newPrep(),'guided',questions.map(question=>question.id),lessonId));
  assert.equal(prepScore(state).assisted,prepScore(state).answered);
  assert.ok(Object.values(state.evidence).every(entry=>entry.assisted));
  assert.ok(prepSkillStatus(state).every(row=>row.independent===0&&row.status!=='ready'));
  const saved=JSON.parse(JSON.stringify(state));
  for(const entry of Object.values(saved.evidence) as {assisted:boolean}[])entry.assisted=false;
  assert.ok(Object.values(parsePrep(JSON.stringify(saved)).evidence).every(entry=>entry.assisted));
});

test('parser strips unknown IDs, text, impossible attempts and forged correctness booleans',()=>{
  const state=answer(startPrep(newPrep(),'prep',[proficiencyQuestions[0].id]),false);
  const key=Object.keys(state.evidence)[0];
  const saved=JSON.parse(JSON.stringify(state));
  saved.completedLessons=['private family note','__proto__'];
  saved.seenQuestions=['private family note',proficiencyQuestions[0].id];
  saved.evidence[key].firstCorrect=true;
  saved.evidence[key].correct=true;
  saved.evidence.untrusted={...saved.evidence[key],firstChoice:'private family note'};
  saved.currentSession.choice='private family note';
  let restored=parsePrep(JSON.stringify(saved));
  assert.equal(prepScore(restored).firstCorrect,0);
  assert.equal(currentPrepEvidence(restored)!.correct,false);
  assert.deepEqual(restored.completedLessons,[]);
  assert.equal(JSON.stringify(restored).includes('private family note'),false);
  saved.evidence[key].attempts=-5;
  restored=parsePrep(JSON.stringify(saved));
  assert.deepEqual(restored.evidence,{});
  assert.equal(restored.currentSession!.feedback,false);
  saved.evidence[key]={...state.evidence[key],firstChoice:'private family note'};
  assert.deepEqual(parsePrep(JSON.stringify(saved)).evidence,{});
});

test('parser rejects changed run IDs, invalid cursors and unsupported completion claims',()=>{
  const state=startPrep(newPrep(),'test',[proficiencyQuestions[0].id]);
  assert.equal(parsePrep(JSON.stringify({...state,currentSession:{...state.currentSession,questionIds:['unknown']}})).currentSession,undefined);
  assert.equal(parsePrep(JSON.stringify({...state,currentSession:{...state.currentSession,questionIndex:-1}})).currentSession,undefined);
  assert.equal(parsePrep(JSON.stringify({...state,currentSession:{...state.currentSession,stepIndex:999}})).currentSession,undefined);
  assert.equal(parsePrep(JSON.stringify({...state,currentSession:{...state.currentSession,complete:true,questionIndex:1}})).currentSession,undefined);
  assert.equal(startPrep(state,'prep',['unknown']),state);
});
