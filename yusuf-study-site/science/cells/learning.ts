import {paragraphId,questions,quizIds,scenes,skillLabels,timelineId,typedPrompts,worksheetIds} from './content.ts';
import type {CellEvidence,CellMode,CellQuestion,CellSaved,CellSkill} from './types.ts';

export const CELLS_KEY='yusuf.science.cells.concept1.v1';
export const CELL_RESPONSE_LIMIT=20000;
export type CellStartOptions={skill?:CellSkill};
const bank=new Map(questions.map(question=>[question.id,question]));
const typedIds=new Set(typedPrompts.map(prompt=>prompt.id));
const skills=Object.keys(skillLabels) as CellSkill[];
const modes:CellMode[]=['worksheet','paragraph','timeline','quiz','review'];
const same=(a:string[],b:string[])=>a.length===b.length&&a.every((value,index)=>value===b[index]);
const clone=(state:CellSaved):CellSaved=>({...state,typed:{...state.typed},modelsSeen:[...state.modelsSeen],seen:[...state.seen],evidence:[...state.evidence],session:state.session?{...state.session,ids:[...state.session.ids],selection:[...state.session.selection],undo:state.session.undo.map(selection=>[...selection])}:null});
const entryFor=(state:CellSaved,id:string,sessionId=state.session?.id)=>state.evidence.find(entry=>entry.sessionId===sessionId&&entry.questionId===id);

export function newCells():CellSaved {return {version:1,storyIndex:0,typed:{},modelsSeen:[],nextSession:1,session:null,evidence:[],seen:[]};}
export function currentCells(state:CellSaved):CellQuestion|undefined {return state.session&&!state.session.complete?bank.get(state.session.ids[state.session.index]):undefined;}
export function setStoryCells(state:CellSaved,index:number):CellSaved {
  return Number.isInteger(index)&&index>=0&&index<scenes.length?{...state,storyIndex:index}:state;
}
/** Writing is an editable notebook, not an automatically graded response. */
export function editResponseCells(state:CellSaved,id:string,text:string):CellSaved {
  if(!typedIds.has(id)||typeof text!=='string'||state.typed[id]===text)return state;
  return {...state,typed:{...state.typed,[id]:text.slice(0,CELL_RESPONSE_LIMIT)}};
}
export function showModelCells(state:CellSaved,id:string):CellSaved {
  return typedIds.has(id)&&!!state.typed[id]?.trim()&&!state.modelsSeen.includes(id)?{...state,modelsSeen:[...state.modelsSeen,id]}:state;
}

/** The same deterministic choice order works for pointer, touch, and keyboard controls. */
export function shuffleCells(ids:string[],key:string):string[] {
  let seed=2166136261;
  for(const letter of key)seed=Math.imul(seed^letter.charCodeAt(0),16777619)>>>0;
  const result=[...ids];
  for(let index=result.length-1;index>0;index--){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const other=seed%(index+1);[result[index],result[other]]=[result[other],result[index]];}
  return result;
}

/** A missed skill remains a review suggestion until two different fresh review items succeed. */
export function weakCells(state:CellSaved):CellSkill[] {
  const latestQuiz=Math.max(0,...state.evidence.filter(row=>row.mode==='quiz').map(row=>row.sessionId));
  return skills.filter(skill=>{
    const history=state.evidence.filter(row=>bank.get(row.questionId)?.skill===skill);
    const baselineSession=latestQuiz||Math.max(0,...history.filter(row=>row.mode!=='review').map(row=>row.sessionId));
    const baseline=history.filter(row=>row.sessionId===baselineSession);
    const review=history.filter(row=>row.mode==='review'&&row.sessionId>baselineSession);
    const concern=review.findLastIndex(row=>!row.correct||row.assisted);
    if(!baseline.some(row=>!row.correct||row.assisted)&&concern<0)return false;
    const earlier=new Set([...baseline,...review.slice(0,concern+1)].map(row=>row.questionId));
    const independent=new Set(review.slice(concern+1).filter(row=>row.correct&&!row.assisted&&!earlier.has(row.questionId)).map(row=>row.questionId));
    return independent.size<2;
  });
}

export function scoreCells(state:CellSaved,sessionId=state.session?.id) {
  const rows=state.evidence.filter(row=>row.sessionId===sessionId);
  const session=state.session?.id===sessionId?state.session:null;
  const total=session?.ids.length??(rows[0]?.mode==='quiz'?quizIds.length:rows.length);
  const correct=rows.filter(row=>row.correct).length;
  const percent=total?Math.round(correct/total*100):0;
  return {answered:rows.length,total,correct,percent,grade:percent>=90?'A':percent>=80?'B':percent>=70?'C':percent>=60?'D':'F',assisted:rows.filter(row=>row.assisted).length,complete:!!total&&rows.length===total,grading:'one-point-per-question' as const,groups:skills.map(skill=>{
    const group=rows.filter(row=>bank.get(row.questionId)?.skill===skill);
    return {skill,label:skillLabels[skill],answered:group.length,correct:group.filter(row=>row.correct).length};
  })};
}

function enter(state:CellSaved):CellSaved {
  const session=state.session;if(!session)return state;
  session.complete=session.index===session.ids.length;
  if(!session.complete&&!state.seen.includes(session.ids[session.index]))state.seen.push(session.ids[session.index]);
  return state;
}
function reviewIds(state:CellSaved,skill?:CellSkill):string[] {
  const selected:string[]=[];
  const requested=skill?[skill]:weakCells(state);
  const pools=requested.map(category=>shuffleCells(questions.filter(question=>question.review&&question.skill===category&&!state.seen.includes(question.id)).map(question=>question.id),`review:${state.nextSession}:${category}`));
  // Round-robin avoids letting one skill consume the entire short review.
  for(let round=0;selected.length<6;round++){
    let added=false;
    for(const pool of pools){if(pool[round]&&selected.length<6){selected.push(pool[round]);added=true;}}
    if(!added)break;
  }
  return selected;
}
export function startCells(state:CellSaved,mode:CellMode,options:CellStartOptions={}):CellSaved {
  if(!modes.includes(mode)||options.skill&&!skills.includes(options.skill))return state;
  const ids=mode==='worksheet'?[...worksheetIds]:mode==='paragraph'?[paragraphId]:mode==='timeline'?[timelineId]:mode==='quiz'?shuffleCells(quizIds,`quiz:${state.nextSession}`):reviewIds(state,options.skill);
  const next=clone(state);
  next.session={id:state.nextSession,mode,ids,index:0,selection:[],undo:[],feedback:false,hint:false,retry:false,complete:!ids.length};
  next.nextSession=state.nextSession+1;
  return enter(next);
}

function remember(state:CellSaved):void {
  const session=state.session!;
  session.undo=[...session.undo.slice(-29),[...session.selection]];
}
export function chooseCells(state:CellSaved,choiceId:string,slot?:number):CellSaved {
  const question=currentCells(state),session=state.session;
  if(!question||!session||session.feedback||!question.choices.some(choice=>choice.id===choiceId))return state;
  const selection=[...session.selection];
  if(question.format==='choice'){
    if(selection[0]===choiceId)return state;
    selection.splice(0,selection.length,choiceId);
  }else{
    if(slot===undefined&&selection.includes(choiceId))return state;
    const target=slot??Array.from({length:question.answer.length},(_,index)=>index).find(index=>!selection[index]);
    if(target===undefined||!Number.isInteger(target)||target<0||target>=question.answer.length||selection[target]===choiceId)return state;
    while(selection.length<question.answer.length)selection.push('');
    const old=selection.indexOf(choiceId);if(old>=0)selection[old]='';
    selection[target]=choiceId;
  }
  const next=clone(state);remember(next);next.session!.selection=selection;return next;
}
export function removeCells(state:CellSaved,index:number):CellSaved {
  const question=currentCells(state),session=state.session;
  if(!question||!session||session.feedback||!Number.isInteger(index)||index<0||index>=session.selection.length||!session.selection[index])return state;
  const next=clone(state);remember(next);
  if(question.format==='choice')next.session!.selection=[];else next.session!.selection[index]='';
  return next;
}
export function undoCells(state:CellSaved):CellSaved {
  const session=state.session;if(!currentCells(state)||!session||session.feedback||!session.undo.length)return state;
  const next=clone(state);next.session!.selection=next.session!.undo.pop()!;return next;
}
export function hintCells(state:CellSaved):CellSaved {
  if(!currentCells(state)||!state.session||state.session.mode==='quiz'||state.session.feedback||state.session.hint)return state;
  const next=clone(state);next.session!.hint=true;return next;
}
export function canSubmitCells(state:CellSaved):boolean {
  const question=currentCells(state);
  return !!(question&&state.session&&!state.session.feedback&&validSelection(state.session.selection,question,true));
}
function nextQuestion(state:CellSaved):CellSaved {
  const session=state.session!;session.index++;session.selection=[];session.undo=[];session.feedback=false;session.hint=false;session.retry=false;return enter(state);
}
export function submitCells(state:CellSaved):CellSaved {
  const question=currentCells(state),session=state.session;
  if(!question||!session||!canSubmitCells(state)||entryFor(state,question.id)&&!session.retry)return state;
  const next=clone(state);
  if(!session.retry)next.evidence.push({sessionId:session.id,questionId:question.id,first:[...session.selection],correct:same(session.selection,question.answer),assisted:session.hint,mode:session.mode});
  if(session.mode==='quiz')return nextQuestion(next);
  next.session!.feedback=true;next.session!.undo=[];return next;
}
/** Retry is unlimited practice; it never replaces the original submitted response. */
export function retryCells(state:CellSaved):CellSaved {
  const session=state.session,question=currentCells(state);
  if(!session||!question||session.mode==='quiz'||!session.feedback||!entryFor(state,question.id))return state;
  const next=clone(state);next.session!.selection=[];next.session!.undo=[];next.session!.feedback=false;next.session!.hint=false;next.session!.retry=true;return next;
}
export function advanceCells(state:CellSaved):CellSaved {
  if(!currentCells(state)||!state.session?.feedback)return state;
  return nextQuestion(clone(state));
}

function record(value:unknown):value is Record<string,unknown> {return !!value&&typeof value==='object'&&!Array.isArray(value);}
function positive(value:unknown):value is number {return typeof value==='number'&&Number.isSafeInteger(value)&&value>0&&value<Number.MAX_SAFE_INTEGER-1;}
function validSelection(value:unknown,question:CellQuestion,complete=false):value is string[] {
  if(!Array.isArray(value)||value.length>question.answer.length||complete&&value.length!==question.answer.length)return false;
  const selected=value.filter(id=>id!=='');
  return new Set(selected).size===selected.length&&value.every(id=>typeof id==='string'&&(id===''&&!complete&&question.format!=='choice'||question.choices.some(choice=>choice.id===id)));
}
function allowedQuestion(id:string,mode:CellMode):boolean {
  return mode==='worksheet'?worksheetIds.includes(id):mode==='paragraph'?id===paragraphId:mode==='timeline'?id===timelineId:mode==='quiz'?quizIds.includes(id):bank.get(id)?.review===true;
}
function validSessionIds(value:unknown,mode:CellMode):value is string[] {
  if(!Array.isArray(value)||value.length>64||new Set(value).size!==value.length||!value.every(id=>typeof id==='string'&&bank.has(id)&&allowedQuestion(id,mode)))return false;
  return mode==='worksheet'?same(value,worksheetIds):mode==='paragraph'?same(value,[paragraphId]):mode==='timeline'?same(value,[timelineId]):mode==='quiz'?value.length===quizIds.length: value.length<=6;
}

/** Recover valid drafts and recompute every score from answer IDs, never saved grade flags. */
export function parseCells(raw:string|null|undefined):CellSaved {
  if(!raw)return newCells();
  const value:unknown=JSON.parse(raw);
  if(!record(value)||value.version!==1)throw new Error('Unrecognized Cell Theory save');
  const state=newCells();
  if(Number.isInteger(value.storyIndex)&&Number(value.storyIndex)>=0&&Number(value.storyIndex)<scenes.length)state.storyIndex=Number(value.storyIndex);
  if(record(value.typed))for(const id of typedIds)if(typeof value.typed[id]==='string')state.typed[id]=value.typed[id].slice(0,CELL_RESPONSE_LIMIT);
  if(Array.isArray(value.modelsSeen))state.modelsSeen=[...new Set(value.modelsSeen.filter((id):id is string=>typeof id==='string'&&typedIds.has(id)))];
  const keys=new Set<string>(),sessionModes=new Map<number,CellMode>();
  if(Array.isArray(value.evidence))for(const candidate of value.evidence.slice(-10000)){
    if(!record(candidate)||!positive(candidate.sessionId)||typeof candidate.questionId!=='string'||!modes.includes(candidate.mode as CellMode))continue;
    const question=bank.get(candidate.questionId),mode=candidate.mode as CellMode,key=`${candidate.sessionId}:${candidate.questionId}`;
    if(!question||keys.has(key)||!allowedQuestion(question.id,mode)||!validSelection(candidate.first,question,true)||sessionModes.has(candidate.sessionId)&&sessionModes.get(candidate.sessionId)!==mode)continue;
    const entry:CellEvidence={sessionId:candidate.sessionId,questionId:question.id,first:[...candidate.first],correct:same(candidate.first,question.answer),assisted:mode!=='quiz'&&candidate.assisted===true,mode};
    state.evidence.push(entry);keys.add(key);sessionModes.set(entry.sessionId,mode);
  }
  const savedSeen=Array.isArray(value.seen)?value.seen.filter((id):id is string=>typeof id==='string'&&bank.has(id)):[];
  state.seen=[...new Set([...savedSeen,...state.evidence.map(row=>row.questionId)])];
  const saved=value.session;
  if(record(saved)&&positive(saved.id)&&modes.includes(saved.mode as CellMode)&&validSessionIds(saved.ids,saved.mode as CellMode)&&Number.isSafeInteger(saved.index)&&Number(saved.index)>=0&&Number(saved.index)<=saved.ids.length){
    const mode=saved.mode as CellMode,ids=[...saved.ids];
    let index=Number(saved.index);
    const rows=new Map(state.evidence.filter(row=>row.sessionId===saved.id&&row.mode===mode&&ids.includes(row.questionId)).map(row=>[row.questionId,row]));
    const missing=ids.findIndex((id,at)=>at<index&&!rows.has(id));if(missing>=0)index=missing;
    const allowed=new Set(ids.slice(0,index+1));
    state.evidence=state.evidence.filter(row=>row.sessionId!==saved.id||row.mode===mode&&allowed.has(row.questionId));
    let question=bank.get(ids[index]),entry=question?rows.get(question.id):undefined;
    const advanced=mode==='quiz'&&!!entry;
    if(advanced){index++;question=bank.get(ids[index]);entry=undefined;}
    const retry=mode!=='quiz'&&!!entry&&saved.retry===true;
    const selection=advanced?[]:entry&&!retry?[...entry.first]:question&&validSelection(saved.selection,question)?[...saved.selection]:[];
    const undo=!advanced&&question&&Array.isArray(saved.undo)?saved.undo.slice(-30).filter((draft):draft is string[]=>validSelection(draft,question!)).map(draft=>[...draft]):[];
    const feedback=mode!=='quiz'&&!!entry&&(!retry||saved.feedback===true&&!!question&&validSelection(selection,question,true));
    state.session={id:saved.id,mode,ids,index,selection:index===ids.length?[]:selection,undo:feedback||index===ids.length?[]:undo,feedback,hint:mode!=='quiz'&&(saved.hint===true||!retry&&entry?.assisted===true),retry,complete:index===ids.length};
  }
  state.nextSession=Math.max(positive(value.nextSession)?value.nextSession:1,...state.evidence.map(row=>row.sessionId+1),(state.session?.id??0)+1);
  return enter(state);
}
