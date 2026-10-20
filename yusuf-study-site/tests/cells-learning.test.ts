import test from 'node:test';
import assert from 'node:assert/strict';
import {paragraphId,questions,quizIds,scenes,skillLabels,timelineId,typedPrompts,worksheetIds} from '../science/cells/content.ts';
import {CELLS_KEY,CELL_RESPONSE_LIMIT,advanceCells,canSubmitCells,chooseCells,currentCells,editResponseCells,hintCells,newCells,parseCells,removeCells,retryCells,scoreCells,setStoryCells,showModelCells,shuffleCells,startCells,submitCells,undoCells,weakCells} from '../science/cells/learning.ts';
import type {CellMode,CellQuestion,CellSaved,CellSkill} from '../science/cells/types.ts';

function response(state:CellSaved,correct=true):CellSaved {
  const question=currentCells(state);assert.ok(question);
  const selected=correct?question.answer:question.format==='choice'?[question.choices.find(choice=>choice.id!==question.answer[0])!.id]:[...question.answer].reverse();
  assert.notEqual(correct?null:selected.join('|'),question.answer.join('|'),'wrong fixture differs from the key');
  for(const [slot,id] of selected.entries())state=chooseCells(state,id,question.format==='choice'?undefined:slot);
  assert.ok(canSubmitCells(state));return submitCells(state);
}
function finish(state:CellSaved,correct=true):CellSaved {
  let count=0;
  while(!state.session?.complete){state=response(state,correct);assert.deepEqual(parseCells(JSON.stringify(state)),state);if(state.session?.feedback)state=advanceCells(state);assert.ok(++count<=64,'a finite session never traps the learner');}
  return state;
}
function isolated(question:CellQuestion,state=newCells()):CellSaved {
  return {...state,nextSession:state.nextSession+1,seen:[...new Set([...state.seen,question.id])],session:{id:state.nextSession,mode:'review',ids:[question.id],index:0,selection:[],undo:[],feedback:false,hint:false,retry:false,complete:false}};
}

test('Cell Theory uses an isolated key and asks the caller to recover corrupt root saves',()=>{
  assert.equal(CELLS_KEY,'yusuf.science.cells.concept1.v1');assert.deepEqual(parseCells(null),newCells());assert.deepEqual(parseCells(JSON.stringify(newCells())),newCells());
  for(const raw of ['{broken','[]','null','{"version":2}'])assert.throws(()=>parseCells(raw));
  assert.equal(scoreCells(newCells()).total,0);assert.deepEqual(weakCells(newCells()),[]);
});

test('all five story positions resume without producing grades or changing other drafts',()=>{
  let state=editResponseCells(newCells(),typedPrompts[0].id,'My explanation.');
  for(let index=0;index<scenes.length;index++){state=setStoryCells(state,index);assert.equal(state.storyIndex,index);assert.deepEqual(parseCells(JSON.stringify(state)),state);}
  assert.equal(setStoryCells(state,-1),state);assert.equal(setStoryCells(state,scenes.length),state);assert.equal(setStoryCells(state,0.5),state);assert.deepEqual(state.evidence,[]);
  const raw={...state,storyIndex:Infinity};assert.equal(parseCells(JSON.stringify(raw)).storyIndex,0);
});

test('five editable typed responses are never keyword graded, and model answers require a response',()=>{
  assert.equal(typedPrompts.length,5);let state=newCells();
  for(const [index,prompt] of typedPrompts.entries()){
    assert.equal(showModelCells(state,prompt.id),state);
    state=editResponseCells(state,prompt.id,' \n\t');assert.equal(showModelCells(state,prompt.id),state);
    const text=`My explanation ${index}.\nI can revise this in my own words: cells, microscopes, and questions.\n🧫`;
    state=editResponseCells(state,prompt.id,text);state=showModelCells(state,prompt.id);assert.equal(state.typed[prompt.id],text);assert.ok(state.modelsSeen.includes(prompt.id));assert.deepEqual(parseCells(JSON.stringify(state)),state);
    state=editResponseCells(state,prompt.id,'I am still thinking.');assert.equal(state.typed[prompt.id],'I am still thinking.');
  }
  assert.deepEqual(state.evidence,[]);assert.equal(scoreCells(state).answered,0);assert.deepEqual(weakCells(state),[]);
  assert.equal(editResponseCells(state,'unknown','text'),state);assert.equal(showModelCells(state,'unknown'),state);
  const long=editResponseCells(state,typedPrompts[0].id,'a'.repeat(CELL_RESPONSE_LIMIT+20));assert.equal(long.typed[typedPrompts[0].id].length,CELL_RESPONSE_LIMIT);
});

test('practice modes use the authored activities and survive partial and complete reloads',()=>{
  for(const [mode,ids] of [['worksheet',worksheetIds],['paragraph',[paragraphId]],['timeline',[timelineId]]] as [CellMode,string[]][]){
    let state=startCells(newCells(),mode);assert.deepEqual(state.session!.ids,ids);assert.deepEqual(parseCells(JSON.stringify(state)),state);
    const question=currentCells(state)!;state=chooseCells(state,question.answer[0],question.format==='choice'?undefined:0);assert.deepEqual(parseCells(JSON.stringify(state)),state);
    state=finish(state);assert.equal(scoreCells(state).percent,100);assert.equal(state.session?.complete,true);assert.deepEqual(parseCells(JSON.stringify(state)),state);
  }
});

test('quiz has exactly 18 different questions including matching and timeline, with variable order',()=>{
  const orderings=new Set<string>();let state=newCells();
  for(let attempt=0;attempt<20;attempt++){
    state=startCells(state,'quiz');const ids=state.session!.ids;assert.equal(ids.length,18);assert.equal(new Set(ids).size,18);assert.deepEqual([...ids].sort(),[...quizIds].sort());
    const chosen=ids.map(id=>questions.find(q=>q.id===id)!);assert.ok(chosen.some(q=>q.format==='match'));assert.ok(chosen.some(q=>q.format==='order'));assert.ok(chosen.every(q=>q.quiz));
    assert.deepEqual(parseCells(JSON.stringify(state)),state);orderings.add(ids.join('|'));
  }
  assert.ok(orderings.size>1);
});

test('quiz advances without hints or feedback and gives an immutable first-attempt grade',()=>{
  let state=startCells(newCells(),'quiz');let count=0;
  while(!state.session?.complete){
    assert.equal(hintCells(state),state);assert.equal(retryCells(state),state);assert.equal(advanceCells(state),state);
    state=response(state,count%2===0);assert.equal(state.session?.feedback,false);assert.equal(state.session?.hint,false);assert.equal(state.session?.index,++count);assert.deepEqual(parseCells(JSON.stringify(state)),state);
  }
  assert.equal(count,18);const score=scoreCells(state);assert.equal(score.correct,9);assert.equal(score.total,18);assert.equal(score.percent,50);assert.equal(score.grade,'F');assert.equal(score.complete,true);assert.equal(score.grading,'one-point-per-question');assert.equal(score.assisted,0);
  const original=structuredClone(state);assert.equal(submitCells(state),state);assert.equal(undoCells(state),state);assert.deepEqual(state,original);
  const oldSession=state.session!.id;state=finish(startCells(state,'quiz'));assert.equal(scoreCells(state).grade,'A');assert.equal(scoreCells(state,oldSession).correct,9);assert.equal(scoreCells(state,oldSession).total,18);assert.equal(scoreCells(state,oldSession).percent,50);
});

test('one misplaced matching or ordering token makes that single question incorrect',()=>{
  for(const format of ['match','order'] as const){
    let state=startCells(newCells(),'quiz');while(currentCells(state)?.format!==format)state=response(state);
    const question=currentCells(state)!;const answer=[...question.answer];[answer[0],answer[1]]=[answer[1],answer[0]];
    for(const [slot,id] of answer.entries())state=chooseCells(state,id,slot);
    state=submitCells(state);assert.equal(state.evidence.at(-1)?.questionId,question.id);assert.equal(state.evidence.at(-1)?.correct,false);assert.equal(state.evidence.filter(row=>row.questionId===question.id).length,1);
  }
});

test('unlimited practice retries preserve the first response and allow continuing after a mistake',()=>{
  let state=response(startCells(newCells(),'timeline'),false);const first=structuredClone(state.evidence);
  assert.equal(state.session?.feedback,true);assert.equal(submitCells(state),state);assert.equal(chooseCells(state,currentCells(state)!.answer[0],0),state);
  for(let attempt=0;attempt<5;attempt++){
    state=retryCells(state);assert.equal(state.session?.retry,true);assert.equal(state.session?.feedback,false);assert.deepEqual(parseCells(JSON.stringify(state)),state);
    state=response(state,attempt%2===0);assert.deepEqual(state.evidence,first);assert.deepEqual(parseCells(JSON.stringify(state)),state);
  }
  state=advanceCells(state);assert.equal(state.session?.complete,true);assert.equal(scoreCells(state).correct,0);assert.deepEqual(parseCells(JSON.stringify(state)),state);
});

test('matching, timeline, and paragraph share fixed slots, move/replace, removal, and undo',()=>{
  const states=[startCells(newCells(),'paragraph'),startCells(newCells(),'timeline')];
  let worksheet=startCells(newCells(),'worksheet');while(currentCells(worksheet)?.format!=='match')worksheet=advanceCells(response(worksheet));states.push(worksheet);
  for(let state of states){
    const question=currentCells(state)!;const [a,b,c]=question.answer;assert.ok(c);
    state=chooseCells(state,a,0);state=chooseCells(state,b,1);state=chooseCells(state,c,2);
    const before=structuredClone(state.session!.selection);state=chooseCells(state,a,2);assert.equal(state.session?.selection[0],'');assert.equal(state.session?.selection[2],a);assert.ok(!state.session!.selection.includes(c),'replaced token returns to the bank');
    assert.deepEqual(undoCells(state).session?.selection,before);
    state=chooseCells(state,b,3);assert.equal(state.session?.selection[1],'');assert.equal(state.session?.selection[3],b);
    state=removeCells(state,2);assert.equal(state.session?.selection[2],'');assert.deepEqual(parseCells(JSON.stringify(state)),state);assert.equal(canSubmitCells(state),false);assert.equal(submitCells(state),state);
    assert.equal(chooseCells(state,b),state,'tapping an already placed token without a destination is inert');
    for(const [slot,id] of question.answer.entries())state=chooseCells(state,id,slot);
    assert.ok(canSubmitCells(state));state=submitCells(state);assert.equal(state.evidence.at(-1)?.correct,true);
  }
});

test('undo history is bounded and invalid actions cannot alter a valid draft',()=>{
  let state=startCells(newCells(),'timeline');const question=currentCells(state)!;
  for(let index=0;index<50;index++){state=chooseCells(state,question.answer[0],0);state=removeCells(state,0);}
  assert.equal(state.session?.undo.length,30);assert.deepEqual(parseCells(JSON.stringify(state)),state);
  for(const index of [-1,0.5,99]){assert.equal(removeCells(state,index),state);assert.equal(chooseCells(state,question.answer[0],index),state);}
  assert.equal(chooseCells(state,'missing',0),state);assert.equal(advanceCells(state),state);assert.equal(submitCells(state),state);
});

test('review targets incorrect skills using unseen examples and reports exhaustion honestly',()=>{
  const failed=finish(startCells(newCells(),'quiz'),false);assert.deepEqual([...weakCells(failed)].sort(),Object.keys(skillLabels).sort());
  const review=startCells(failed,'review');assert.ok(review.session!.ids.length>0&&review.session!.ids.length<=6);
  for(const id of review.session!.ids){const question=questions.find(q=>q.id===id)!;assert.ok(question.review);assert.ok(!failed.seen.includes(id));assert.ok(!quizIds.includes(id));assert.ok(weakCells(failed).includes(question.skill));}
  assert.deepEqual(parseCells(JSON.stringify(review)),review);const done=finish(review);assert.deepEqual(parseCells(JSON.stringify(done)),done);
  const exhausted=startCells({...failed,seen:questions.map(q=>q.id)},'review');assert.equal(exhausted.session?.complete,true);assert.deepEqual(exhausted.session?.ids,[]);assert.equal(scoreCells(exhausted).total,0);assert.deepEqual(parseCells(JSON.stringify(exhausted)),exhausted);
  assert.deepEqual(startCells(newCells(),'review').session?.ids,[],'a new learner does not receive invented weaknesses');
});

test('two distinct fresh unaided review answers resolve a review suggestion; repeats and hints do not',()=>{
  let state=finish(startCells(newCells(),'quiz'),false);const skill:CellSkill='principles';
  const pool=questions.filter(question=>question.review&&question.skill===skill);assert.ok(pool.length>=2);
  state=response(isolated(pool[0],state));assert.ok(weakCells(state).includes(skill));
  state=response(isolated(pool[0],state));assert.ok(weakCells(state).includes(skill),'repeating one item is not fresh evidence');
  state=response(isolated(pool[1],state));assert.ok(!weakCells(state).includes(skill));
  const focused=startCells(newCells(),'review',{skill});assert.ok(focused.session!.ids.length>0);assert.ok(focused.session!.ids.every(id=>questions.find(q=>q.id===id)!.skill===skill));
  const supported=response(hintCells(isolated(pool[0],finish(startCells(newCells(),'quiz'),false))));assert.ok(supported.evidence.at(-1)?.assisted);assert.ok(weakCells(supported).includes(skill));
});

test('saved grades are recomputed, malformed or duplicate evidence cannot inflate the score',()=>{
  const failed=finish(startCells(newCells(),'quiz'),false);const raw=JSON.parse(JSON.stringify(failed));
  raw.evidence[0].correct=true;raw.evidence[0].assisted=true;raw.evidence.push({...raw.evidence[0]});raw.evidence.push({...raw.evidence[0],questionId:'missing'});raw.evidence.push({...raw.evidence[0],sessionId:999,first:['missing']});raw.seen.push('missing');raw.typed={unknown:'private junk',...raw.typed};raw.modelsSeen=['missing'];
  const restored=parseCells(JSON.stringify(raw));assert.equal(restored.evidence.length,18);assert.equal(restored.evidence[0].correct,false);assert.equal(restored.evidence[0].assisted,false);assert.equal(scoreCells(restored).percent,0);assert.ok(!restored.seen.includes('missing'));assert.equal(restored.typed.unknown,undefined);assert.deepEqual(restored.modelsSeen,[]);
});

test('a forged completed session cannot skip unanswered activities',()=>{
  for(const mode of ['worksheet','paragraph','timeline','quiz'] as const){
    const state=startCells(newCells(),mode),raw=JSON.parse(JSON.stringify(state));raw.session.index=raw.session.ids.length;raw.session.complete=true;raw.session.feedback=true;
    const restored=parseCells(JSON.stringify(raw));assert.equal(restored.session?.index,0);assert.equal(restored.session?.complete,false);assert.equal(restored.session?.feedback,false);
  }
});

test('session restoration rejects unknown, duplicated, incomplete quiz, and mismatched mode IDs',()=>{
  const state=startCells(newCells(),'quiz');
  for(const mutate of [(raw:CellSaved)=>{raw.session!.ids[0]='unknown';},(raw:CellSaved)=>{raw.session!.ids[0]=raw.session!.ids[1];},(raw:CellSaved)=>{raw.session!.ids.pop();},(raw:CellSaved)=>{raw.session!.ids[0]=paragraphId;},(raw:CellSaved)=>{raw.session!.index=-1;}]){const raw=structuredClone(state);mutate(raw);assert.equal(parseCells(JSON.stringify(raw)).session,null);}
});

test('partially persisted quiz submission advances once and clears the old selection and undo',()=>{
  const state=startCells(newCells(),'quiz'),question=currentCells(state)!;const submitted=response(state);
  const raw=structuredClone(submitted);raw.session!.index=0;raw.session!.complete=false;raw.session!.selection=[...question.answer];raw.session!.undo=[[...question.answer]];
  const restored=parseCells(JSON.stringify(raw));assert.equal(restored.session?.index,1);assert.deepEqual(restored.session?.selection,[]);assert.deepEqual(restored.session?.undo,[]);assert.equal(restored.evidence.length,1);assert.equal(restored.session?.feedback,false);
});

test('invalid partial selections and undo snapshots are dropped without erasing typed writing',()=>{
  const state=editResponseCells(startCells(newCells(),'paragraph'),typedPrompts[0].id,'A full thought.');const raw=JSON.parse(JSON.stringify(state));
  const answer=currentCells(state)!.answer;raw.session.selection=[answer[0],answer[0]];raw.session.undo=[['unknown'],[answer[0]],null];
  const restored=parseCells(JSON.stringify(raw));assert.deepEqual(restored.session?.selection,[]);assert.deepEqual(restored.session?.undo,[[answer[0]]]);assert.equal(restored.typed[typedPrompts[0].id],'A full thought.');
});

test('seen questions are reconstructed from valid evidence so review does not repeat a lost seen list',()=>{
  const state=finish(startCells(newCells(),'review',{skill:'scientists'}));const raw=JSON.parse(JSON.stringify(state));delete raw.seen;
  const restored=parseCells(JSON.stringify(raw));for(const row of state.evidence)assert.ok(restored.seen.includes(row.questionId));
  const fresh=startCells(restored,'review',{skill:'scientists'});assert.ok(fresh.session!.ids.every(id=>!state.evidence.some(row=>row.questionId===id)));
});

test('all engine transitions preserve the caller state and shuffle preserves its input',()=>{
  const state=startCells(newCells(),'timeline'),original=structuredClone(state),question=currentCells(state)!;
  chooseCells(state,question.answer[0],0);hintCells(state);startCells(state,'quiz');setStoryCells(state,3);editResponseCells(state,typedPrompts[0].id,'Text');assert.deepEqual(state,original);
  const ids=['a','b','c','d'],copy=[...ids];assert.deepEqual(shuffleCells(ids,'same'),shuffleCells(ids,'same'));assert.deepEqual([...shuffleCells(ids,'other')].sort(),ids);assert.deepEqual(ids,copy);assert.ok(new Set(Array.from({length:10},(_,i)=>shuffleCells(ids,String(i)).join(''))).size>1);
});
