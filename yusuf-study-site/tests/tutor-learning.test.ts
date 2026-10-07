import test from 'node:test';
import assert from 'node:assert/strict';
import {tutorLessons,tutorQuestions,tutorSkills} from '../spanish/tutor-content.ts';
import {TUTOR_KEY,advanceTutor,chooseTutor,currentQuestion,currentTask,currentTutorEvidence,hintTutor,markTutorAudio,markTutorSupport,newTutor,parseTutor,removeTutorChoice,reviewSkills,sessionSummary,startTutor,submitTutor,tutorConfusions,tutorScore,tutorSkillStatus} from '../spanish/tutor-learning.ts';
import type {TutorQuestion,TutorSaved} from '../spanish/tutor-types.ts';

function nextQuestion(state:TutorSaved) {let count=0;while(currentTask(state)&&currentTask(state)?.kind!=='question'){state=advanceTutor(state);assert.ok(++count<100);}return state;}
function respond(state:TutorSaved,correct=true,play=true) {
  state=nextQuestion(state);const question=currentQuestion(state);assert.ok(question);
  if(play&&question.format.startsWith('listen-'))state=markTutorAudio(state);
  const ids=correct?question.answer:question.format==='sentence-build'?[...question.answer].reverse():[question.choices.find(choice=>!question.answer.includes(choice.id))!.id];
  for(const id of ids)state=chooseTutor(state,id);
  return submitTutor(state);
}
function finish(state:TutorSaved,correct=true) {
  let count=0;
  while(!state.session?.complete){state=nextQuestion(state);if(currentQuestion(state)){state=respond(state,correct);if(state.session?.feedback)state=advanceTutor(state);}assert.ok(++count<100);}
  return state;
}
function isolated(question:TutorQuestion,state=newTutor(),scaffold:0|1|2=0):TutorSaved {
  return {...state,nextSession:state.nextSession+1,seen:[...new Set([...state.seen,question.id])],session:{id:state.nextSession,mode:'practice',tasks:[{kind:'question',questionId:question.id,scaffold}],index:0,selection:[],feedback:false,hintLevel:0,complete:false,assisted:false,audioPlayed:false,introduced:[],remediations:0}};
}

test('new tutor saves separately, and corrupt/versioned saves request recovery',()=>{
  assert.equal(TUTOR_KEY,'yusuf.spanish.tutor.v1');assert.deepEqual(parseTutor(null),newTutor());assert.deepEqual(parseTutor(JSON.stringify(newTutor())),newTutor());
  for(const value of ['{bad','[]','{"version":2}'])assert.throws(()=>parseTutor(value));
  assert.equal(tutorScore(newTutor()).total,0);assert.deepEqual(reviewSkills(newTutor()),[]);
});

test('A: first guided session teaches in tiny frames, mixes eight activities and checkpoints after five questions',()=>{
  const state=startTutor(newTutor(),'guided'),tasks=state.session!.tasks;
  assert.equal(tasks[0].kind,'teach');assert.equal(tasks.filter(task=>task.kind==='question').length,8);
  const checkpoint=tasks.findIndex(task=>task.kind==='checkpoint');assert.equal(tasks.slice(0,checkpoint).filter(task=>task.kind==='question').length,5);
  assert.ok(tasks.filter(task=>task.kind==='teach').length<=10,'a tiny lesson, not every vocabulary card');
  const selected=tasks.flatMap(task=>task.kind==='question'?[tutorQuestions.find(question=>question.id===task.questionId)!]:[]);
  assert.ok(selected.some(question=>question.format.startsWith('listen-')));assert.ok(selected.some(question=>['picture-word','word-picture'].includes(question.format)));
  assert.equal(tasks.filter(task=>task.kind==='question'&&task.scaffold===2).length,2);
  assert.ok(selected.some(question=>question.teacher));assert.equal(new Set(selected.map(question=>question.id)).size,8);
});

test('B: wrong answer retains the first grade, explains then immediately gives a fresh same-concept variant',()=>{
  let state=nextQuestion(startTutor(newTutor(),'guided'));const original=currentQuestion(state)!;
  state=respond(state,false);const first=currentTutorEvidence(state)!;assert.equal(first.firstCorrect,false);assert.equal(state.session!.feedback,true);
  assert.equal(submitTutor(state),state);assert.equal(chooseTutor(state,original.answer[0]),state);
  assert.deepEqual(parseTutor(JSON.stringify(state)),state);
  state=advanceTutor(state);const parallel=currentQuestion(state)!;
  assert.notEqual(parallel.id,original.id);assert.equal(parallel.parallelGroup,original.parallelGroup);assert.equal(currentTask(state)?.kind,'question');
  assert.equal(state.session!.remediations,1);const task=currentTask(state);assert.ok(task?.kind==='question'&&task.parallel);
  state=respond(state);assert.equal(state.evidence.find(entry=>entry.questionId===original.id)!.firstCorrect,false);
  assert.equal(state.evidence.at(-1)!.firstCorrect,true);assert.equal(tutorScore(state).firstCorrect,1);
});

test('repeated errors never create an endless session: remediation is bounded to three',()=>{
  const state=finish(startTutor(newTutor(),'guided'),false);
  assert.equal(state.session!.complete,true);assert.ok(state.session!.remediations<=3);assert.ok(tutorScore(state).total<=11);
  assert.equal(tutorScore(state).percent,0);assert.equal(state.sessionsCompleted,1);
  assert.deepEqual(parseTutor(JSON.stringify(state)),state);
});

test('hint and full-model teaching support cannot count as independent mastery',()=>{
  const question=tutorQuestions.find(question=>question.skills.includes('ser:es'))!;
  let state=isolated(question);state=hintTutor(state);assert.equal(state.session!.hintLevel,1);
  state=respond(parseTutor(JSON.stringify(state)));assert.equal(currentTutorEvidence(state)!.assisted,true);assert.equal(tutorSkillStatus(state).find(row=>row.id==='ser:es')!.independent,0);
  const model=respond(isolated(question,newTutor(),2));assert.equal(currentTutorEvidence(model)!.assisted,true);
  const saved=JSON.parse(JSON.stringify(model));saved.evidence[0].assisted=false;
  assert.equal(parseTutor(JSON.stringify(saved)).evidence[0].assisted,true,'task scaffold remains authoritative');
});

test('C: listening replay is free, but silent guesses and text fallbacks are supported evidence',()=>{
  const question=tutorQuestions.find(question=>question.format==='listen-word')!;
  let heard=isolated(question);heard=markTutorAudio(heard);assert.equal(markTutorAudio(heard),heard);
  heard=respond(heard);assert.equal(currentTutorEvidence(heard)!.assisted,false);
  let silent=isolated(question);silent=respond(silent,true,false);assert.equal(currentTutorEvidence(silent)!.assisted,true);
  const fallback=respond(markTutorSupport(markTutorAudio(isolated(question))));assert.equal(currentTutorEvidence(fallback)!.assisted,true);
  const restored=parseTutor(JSON.stringify(silent));assert.equal(restored.evidence[0].assisted,true);
  assert.equal(tutorScore(fallback).groups.find(row=>row.group==='Listening')!.answered,0);
  assert.equal(tutorScore(fallback).groups.find(row=>row.group==='Vocabulary')!.answered,1);
  assert.equal(tutorSkillStatus(fallback).find(row=>row.id==='listening:word')!.status,'new');
  assert.equal(tutorScore(heard).groups.find(row=>row.group==='Listening')!.answered,1);
});

test('D: teacher tests are exactly eighteen balanced text questions, without hints or immediate feedback',()=>{
  let state=startTutor(newTutor(),'test');const original=state.session!.tasks;
  assert.equal(original.length,18);assert.ok(original.every(task=>task.kind==='question'&&task.scaffold===0));
  assert.equal(hintTutor(state),state);assert.equal(markTutorSupport(state),state);assert.equal(markTutorAudio(state),state);
  const score=tutorScore(state);for(const [group,count] of [['Pronouns',4],['SER',4],['SER + de',3],['Adjectives',3],['Vocabulary',4]] as const)assert.ok(score.groups.find(row=>row.group===group)!.total>=count);
  const assessed=original.flatMap(task=>task.kind==='question'?[tutorQuestions.find(question=>question.id===task.questionId)!]:[]);
  assert.ok(assessed.some(question=>question.skills.includes('origin')));assert.ok(assessed.some(question=>question.skills.includes('possession')));
  assert.equal(new Set(assessed.filter(question=>question.skills[0].startsWith('ser:')).map(question=>question.skills[0])).size,4);
  state=respond(state,false);assert.equal(state.session!.index,1);assert.equal(state.session!.feedback,false);assert.equal(state.session!.remediations,0);
  state=finish(state);assert.equal(tutorScore(state).answered,18);assert.equal(tutorScore(state).firstCorrect,17);assert.equal(tutorScore(state).percent,94);
  assert.equal(tutorScore(state).groups.find(row=>row.group==='Listening')!.percent,null);
  assert.deepEqual(parseTutor(JSON.stringify(state)),state);
});

test('E: test errors feed fresh targeted review with reteaching, and untouched skills are not called missed',()=>{
  let state=startTutor(newTutor(),'test');const missed=currentQuestion(state)!;state=respond(state,false);state=finish(state);
  assert.ok(missed.skills.some(skill=>reviewSkills(state).includes(skill)));const previous=state.seen;
  state=startTutor(state,'review');assert.equal(currentTask(state)?.kind,'teach');
  const reviewQuestions=state.session!.tasks.flatMap(task=>task.kind==='question'?[tutorQuestions.find(question=>question.id===task.questionId)!]:[]);
  assert.ok(reviewQuestions.length>0&&reviewQuestions.length<=6);
  assert.ok(reviewQuestions.every(question=>!previous.includes(question.id)));assert.ok(reviewQuestions.every(question=>question.skills.some(skill=>reviewSkills(state).includes(skill))));
  const empty=startTutor(newTutor(),'review');assert.equal(empty.session!.complete,true);assert.equal(empty.session!.tasks.length,0);assert.equal(empty.sessionsCompleted,0);
});

test('two distinct independent examples are required; repeating a supported or missed answer is not recovery',()=>{
  const pool=tutorQuestions.filter(question=>question.skills.includes('ser:es')&&question.format==='choice');assert.ok(pool.length>=4);
  let state=respond(isolated(pool[0]),false);assert.ok(reviewSkills(state).includes('ser:es'));
  state=respond(isolated(pool[0],state));assert.equal(tutorSkillStatus(state).find(row=>row.id==='ser:es')!.independent,0);
  state=respond(isolated(pool[1],state));assert.equal(tutorSkillStatus(state).find(row=>row.id==='ser:es')!.status,'almost');
  state=respond(isolated(pool[1],state));assert.equal(tutorSkillStatus(state).find(row=>row.id==='ser:es')!.independent,1);
  state=respond(isolated(pool[2],state));assert.equal(tutorSkillStatus(state).find(row=>row.id==='ser:es')!.status,'ready');
  assert.ok(!reviewSkills(state).includes('ser:es'));assert.equal(state.evidence[0].firstCorrect,false);
});

test('vocabulary readiness requires more than one representation, then practice reduces optional visual support',()=>{
  const pool=tutorQuestions.filter(question=>question.skills.includes('word:computadora'));
  const image=pool.find(question=>question.format==='picture-word')!,audio=pool.find(question=>question.format==='listen-word')!;
  let state=respond(isolated(image));assert.notEqual(tutorSkillStatus(state).find(row=>row.id==='word:computadora')!.status,'ready');
  state=respond(isolated(audio,state));assert.equal(tutorSkillStatus(state).find(row=>row.id==='word:computadora')!.representations,2);assert.equal(tutorSkillStatus(state).find(row=>row.id==='word:computadora')!.status,'ready');
  state=startTutor(state,'vocabulary',{wordGroup:'My school day'});
  const selected=state.session!.tasks.flatMap(task=>task.kind==='question'?[tutorQuestions.find(question=>question.id===task.questionId)!]:[]);
  assert.ok(selected.filter(question=>question.skills.includes('word:computadora')).every(question=>!['picture-word','word-picture'].includes(question.format)));
});

test('word choices, hints, teach cursor and complete results survive refresh exactly',()=>{
  let state=startTutor(newTutor(),'guided');assert.deepEqual(parseTutor(JSON.stringify(state)),state);
  state=advanceTutor(state);assert.deepEqual(parseTutor(JSON.stringify(state)),state);
  state=nextQuestion(state);state=chooseTutor(state,currentQuestion(state)!.choices[1].id);state=hintTutor(state);
  assert.deepEqual(parseTutor(JSON.stringify(state)),state);state=submitTutor(state);assert.deepEqual(parseTutor(JSON.stringify(state)),state);
  state=finish(advanceTutor(state));assert.deepEqual(parseTutor(JSON.stringify(state)),state);assert.equal(advanceTutor(state),state);
});

test('sentence-building supports tap order, remove and complete-only submission',()=>{
  const question=tutorQuestions.find(question=>question.format==='sentence-build')!;assert.ok(question);
  let state=isolated(question);state=chooseTutor(state,question.answer[0]);assert.equal(submitTutor(state),state);assert.equal(chooseTutor(state,question.answer[0]),state);
  assert.deepEqual(parseTutor(JSON.stringify(state)),state);state=removeTutorChoice(state,0);assert.deepEqual(state.session!.selection,[]);
  state=respond(state);assert.equal(currentTutorEvidence(state)!.correct,true);assert.equal(removeTutorChoice(state,0),state);
});

test('new sessions retain old first grades while assigning new session IDs',()=>{
  let state=finish(startTutor(newTutor(),'test'));const oldId=state.session!.id;
  state=startTutor(state,'test');assert.notEqual(state.session!.id,oldId);assert.equal(tutorScore(state).answered,0);assert.equal(tutorScore(state,oldId).firstCorrect,18);
  assert.notDeepEqual(state.session!.tasks,finish(startTutor(newTutor(),'test')).session!.tasks,'question variants rotate');
});

test('optional lesson and group selectors are validated; complete lessons mark only learned concepts',()=>{
  const fresh=newTutor();assert.equal(startTutor(fresh,'lesson',{lessonId:'private family text'}),fresh);assert.equal(startTutor(fresh,'practice',{skill:'not-a-skill'}),fresh);assert.equal(startTutor(fresh,'vocabulary',{wordGroup:'unknown'}),fresh);
  let state=finish(startTutor(fresh,'lesson',{lessonId:'ser'}));assert.ok(state.taught.includes('ser'));assert.ok(state.taught.includes('ser:somos'));assert.ok(!state.taught.includes('origin'));
  state=nextQuestion(startTutor(state,'practice',{skill:'ser:somos'}));assert.equal(currentQuestion(state)!.skills.includes('ser:somos'),true);
});

test('parser rejects unknown text, impossible evidence and forged correctness, and rewinds unanswered cursor jumps',()=>{
  const state=respond(startTutor(newTutor(),'test'),false),saved=JSON.parse(JSON.stringify(state));
  saved.evidence[0].correct=true;saved.evidence[0].firstCorrect=true;saved.evidence[0].skills=['private grade'];saved.seen.push('private grade');saved.taught.push('private grade');saved.session.selection=['private grade'];saved.session.index=18;saved.session.complete=true;
  let restored=parseTutor(JSON.stringify(saved));assert.equal(restored.evidence[0].correct,false);assert.equal(restored.evidence[0].firstCorrect,false);assert.equal(restored.session!.index,1);assert.equal(restored.session!.complete,false);assert.equal(JSON.stringify(restored).includes('private grade'),false);
  saved.evidence[0].attempts=-1;restored=parseTutor(JSON.stringify(saved));assert.equal(restored.evidence.length,0);assert.equal(restored.session!.index,0);
  saved.session.tasks[0].questionId='private grade';assert.equal(parseTutor(JSON.stringify(saved)).session,null);
});

test('confusion sets come only from bank-backed first wrong choices and keep sound replay independent',()=>{
  const question=tutorQuestions.find(question=>question.skills.includes('ser:somos'))!;let state=respond(isolated(question),false);
  const confusion=tutorConfusions(state)[0];assert.ok(confusion.from);assert.equal(confusion.to,question.choices.find(choice=>choice.id===question.answer[0])!.label);assert.equal(confusion.count,1);assert.ok(confusion.skills.includes('ser:somos'));
  state=respond(isolated(question,state),false);assert.equal(tutorConfusions(state)[0].count,2);assert.equal(sessionSummary(state).answered,1);
});

test('listening sessions include all five formats; navigation never skips an unanswered question',()=>{
  let state=startTutor(newTutor(),'listening');const formats=state.session!.tasks.flatMap(task=>task.kind==='question'?[tutorQuestions.find(question=>question.id===task.questionId)!.format]:[]);
  for(const format of ['listen-picture','listen-word','listen-sentence','listen-fill','listen-contrast'] as const)assert.ok(formats.includes(format),format);
  state=nextQuestion(state);assert.equal(advanceTutor(state),state);assert.equal(chooseTutor(state,'arbitrary private text'),state);assert.equal(submitTutor(state),state);
});

test('every skill has a teachable lesson, and generated guided sessions stay bounded over rotations',()=>{
  for(const skill of tutorSkills)assert.ok(tutorLessons.some(lesson=>lesson.id===skill.lessonId));
  for(let session=1;session<=20;session++) {
    const state=startTutor({...newTutor(),nextSession:session},'guided');
    assert.equal(state.session!.tasks.filter(task=>task.kind==='question').length,8);assert.ok(state.session!.tasks.length<=22);
    assert.equal(tutorScore(state).groups.find(row=>row.group==='Listening')!.percent,null);
  }
});

test('recent mistakes lead guided sessions, while older strong skills return for spaced retrieval',()=>{
  const forms=tutorQuestions.filter(question=>question.skills.includes('ser:es')&&question.format==='choice');
  let weak=respond(isolated(forms[0]),false);weak=startTutor(weak,'guided');
  const first=weak.session!.tasks.find(task=>task.kind==='question');assert.ok(first?.kind==='question');assert.ok(tutorQuestions.find(question=>question.id===first.questionId)!.skills.includes('ser:es'));
  let strong=respond(isolated(forms[0]));strong=respond(isolated(forms[1],strong));strong={...strong,nextSession:strong.nextSession+3};
  const spaced=startTutor(strong,'guided');assert.ok(spaced.session!.tasks.some(task=>task.kind==='question'&&tutorQuestions.find(question=>question.id===task.questionId)!.skills.includes('ser:es')));
});

test('origin and plural-adjective practice introduces prerequisite reasoning before asking a new form',()=>{
  const state=startTutor(newTutor(),'practice',{skill:'origin'});let passed:string[]=[];
  for(const task of state.session!.tasks) {
    if(task.kind==='teach')passed.push(`${task.lessonId}:${task.frame}`);
    if(task.kind==='question') {
      const question=tutorQuestions.find(question=>question.id===task.questionId)!;
      const form=[...(question.chain??[]),...question.model.split(/\s+/)].find(token=>['es','somos','son'].includes(token));
      assert.ok(passed.includes(`ser:${['soy','eres','es','somos','sois','son'].indexOf(form!)}`),`${question.id} needs its SER pattern`);
    }
  }
  const adjectives=startTutor(newTutor(),'practice',{skill:'adjective:number'});passed=[];
  for(const task of adjectives.session!.tasks){if(task.kind==='teach')passed.push(`${task.lessonId}:${task.frame}`);if(task.kind==='question'&&/fácil|difícil/.test(tutorQuestions.find(question=>question.id===task.questionId)!.prompt))assert.ok(passed.includes('adjectives:4'));}
  for(let nextSession=1;nextSession<=20;nextSession++) {
    const testState=startTutor({...newTutor(),nextSession},'test');const selected=testState.session!.tasks.flatMap(task=>task.kind==='question'?[tutorQuestions.find(question=>question.id===task.questionId)!]:[]);
    assert.equal(selected.length,18);for(const skill of ['origin','possession','adjective:gender','adjective:number'])assert.ok(selected.some(question=>question.skills.includes(skill)),`rotation ${nextSession}: ${skill}`);
  }
});


test('connected school scenes and grammar builders keep authored frame/question pairs in order',()=>{
  for(const [lessonId,count] of [['school-day-story',6],['builder-ser',3],['builder-adjectives',3],['builder-de',4]] as const){
    const state=startTutor(newTutor(),'lesson',{lessonId}),questions=tutorQuestions.filter(question=>question.lessonId===lessonId);assert.equal(questions.length,count);
    const tasks=state.session!.tasks.filter(task=>task.kind!=='checkpoint');assert.equal(tasks.length,count*2);
    for(let index=0;index<count;index++){assert.deepEqual(tasks[index*2],{kind:'teach',lessonId,frame:index});assert.deepEqual(tasks[index*2+1],{kind:'question',questionId:questions[index].id,scaffold:0});}
    const done=finish(state);assert.equal(done.evidence.length,count);assert.ok(done.evidence.every(entry=>entry.assisted));assert.ok(done.taught.includes(lessonId));assert.deepEqual(parseTutor(JSON.stringify(done)),done);
  }
});

test('provided sentence tiles are formulation support and never independent grammar evidence',()=>{
  const question=tutorQuestions.find(question=>question.id==='builder-ser-3')!;const state=respond(isolated(question));
  assert.equal(state.evidence[0].assisted,true);for(const skill of question.skills)assert.equal(tutorSkillStatus(state).find(row=>row.id===skill)!.independent,0);
  const saved=JSON.parse(JSON.stringify(state));saved.evidence[0].assisted=false;assert.equal(parseTutor(JSON.stringify(saved)).evidence[0].assisted,true);
  const pure=tutorQuestions.filter(question=>question.skills.includes('ser:somos')&&question.format==='choice');let strong=respond(isolated(pure[0]));strong=respond(isolated(pure[1],strong));assert.equal(tutorSkillStatus(strong).find(row=>row.id==='ser:somos')!.status,'ready');
  strong=respond(isolated(question,strong));assert.equal(tutorSkillStatus(strong).find(row=>row.id==='ser:somos')!.status,'ready','supported learning does not punish earlier independent evidence');
});
