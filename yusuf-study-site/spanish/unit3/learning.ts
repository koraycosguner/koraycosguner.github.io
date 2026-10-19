import {completeQuestionIds,questions,skillLabels,stories} from './content.ts';
import type {U3Evidence,U3Mode,U3Question,U3Saved,U3Session,U3Skill} from './types.ts';

export const U3_KEY='yusuf.spanish.unit3.v1';
export type U3Status='new'|'ready'|'practice'|'review';
export type U3StartOptions={storyId?:string;skill?:U3Skill};
type Session=U3Session&{remediationIds?:string[];retry?:boolean};
const bank=new Map(questions.map(question=>[question.id,question]));
const storyBank=new Map(stories.map(story=>[story.id,story]));
const skills=Object.keys(skillLabels) as U3Skill[];
const modes:U3Mode[]=['story','review','test','complete','targeted'];
const testQuotas:[U3Skill,number][]=[['estar',4],['ser-estar',1],['prepositions',4],['places',3],['days',3],['months',2],['numbers',2],['ordinals',2],['dates',2],['time',4],['schedule',3],['start-end',2]];
const same=(left:string[],right:string[])=>left.length===right.length&&left.every((id,index)=>id===right[index]);
const clone=(state:U3Saved):U3Saved=>({...state,evidence:[...state.evidence],completedStories:[...state.completedStories],seen:[...state.seen],session:state.session?{...state.session,ids:[...state.session.ids],selection:[...state.session.selection],remediationIds:[...((state.session as Session).remediationIds??[])]}:null});
const answered=(state:U3Saved,id:string,sessionId=state.session?.id)=>state.evidence.find(row=>row.questionId===id&&row.sessionId===sessionId);

export function newU3():U3Saved {return {version:1,nextSession:1,session:null,evidence:[],completedStories:[],seen:[]};}
export function currentU3(state:U3Saved):U3Question|undefined {return state.session&&!state.session.complete?bank.get(state.session.ids[state.session.index]):undefined;}

/** Stable per-question ordering, shared by keyboard, tap, and pointer input. */
export function shuffleU3(ids:string[],key:string):string[] {
  let seed=2166136261;
  for(const letter of key)seed=Math.imul(seed^letter.charCodeAt(0),16777619)>>>0;
  const result=[...ids];
  for(let index=result.length-1;index>0;index--){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const other=seed%(index+1);[result[index],result[other]]=[result[other],result[index]];}
  return result;
}

/** A readiness estimate requires two different independent examples after a concern. */
export function statusU3(state:U3Saved) {
  return skills.map(skill=>{
    const history=state.evidence.filter(row=>bank.get(row.questionId)?.skill===skill);
    // Building a supplied sentence or filling a supplied bank is useful supported practice.
    // It cannot prove independent recall or undo evidence from an independent assessment.
    const assessment=history.filter(row=>bank.get(row.questionId)?.format==='choice');
    const concern=assessment.findLastIndex(row=>!row.correct||row.assisted);
    const earlier=new Set(assessment.slice(0,concern+1).map(row=>row.questionId));
    const independent=new Set(assessment.slice(concern+1).filter(row=>row.correct&&!row.assisted&&!earlier.has(row.questionId)).map(row=>row.questionId)).size;
    const status:U3Status=!history.length?'new':independent>=2?'ready':independent===1||!assessment.length||assessment.every(row=>row.correct)?'practice':'review';
    return {skill,label:skillLabels[skill],status,independent,attempts:history.length,correct:history.filter(row=>row.correct).length,needsPractice:concern>=0&&independent<2,lastSession:history.at(-1)?.sessionId??0};
  });
}
export function weakU3(state:U3Saved):U3Skill[] {return statusU3(state).filter(row=>row.needsPractice).sort((a,b)=>b.lastSession-a.lastSession||a.independent-b.independent).map(row=>row.skill);}
export function scoreU3(state:U3Saved,sessionId=state.session?.id) {
  const rows=state.evidence.filter(row=>row.sessionId===sessionId),session=state.session?.id===sessionId?state.session:null;
  const correct=rows.filter(row=>row.correct).length;
  const statuses=statusU3(state);
  return {answered:rows.length,total:session?.ids.length??rows.length,correct,percent:rows.length?Math.round(correct/rows.length*100):0,assisted:rows.filter(row=>row.assisted).length,groups:skills.map(skill=>{
    const group=rows.filter(row=>bank.get(row.questionId)?.skill===skill),count=group.filter(row=>row.correct).length;
    return {skill,label:skillLabels[skill],answered:group.length,correct:count,percent:group.length>=2?Math.round(count/group.length*100):null,status:statuses.find(row=>row.skill===skill)!.status};
  })};
}

function select(state:U3Saved,pool:U3Question[],used:Set<string>,salt:string,freshOnly=false):U3Question|undefined {
  const available=pool.filter(question=>!used.has(question.id)&&(!freshOnly||!state.seen.includes(question.id)));
  const fresh=available.filter(question=>!state.seen.includes(question.id));
  const candidates=fresh.length?fresh:available;
  const ids=shuffleU3(candidates.map(question=>question.id),`${state.nextSession}:${salt}`);
  return ids.length?bank.get(ids[0]):undefined;
}
function testIds(state:U3Saved):string[] {
  const pool=questions.filter(question=>question.test&&question.format==='choice'),chosen:U3Question[]=[],used=new Set<string>();
  const add=(question:U3Question|undefined)=>{if(question&&!used.has(question.id)){chosen.push(question);used.add(question.id);}};
  add(bank.get('test-reading-school-day'));
  const visualPool=pool.filter(question=>question.visual);
  add(select(state,visualPool,used,'visual-one'));
  add(select(state,visualPool,used,'visual-two'));
  for(const [skill,quota] of testQuotas)while(chosen.filter(question=>question.skill===skill).length<quota){
    const question=select(state,pool.filter(question=>question.skill===skill&&!question.visual),used,`${skill}:${chosen.length}`);
    if(!question)break;add(question);
  }
  // A bank edit cannot introduce a broken or duplicate activity; tests assert all quotas.
  while(chosen.length<32){const question=select(state,pool.filter(question=>!question.visual),used,`extra:${chosen.length}`);if(!question)break;add(question);}
  return shuffleU3(chosen.slice(0,32).map(question=>question.id),`test:${state.nextSession}`);
}
function practiceIds(state:U3Saved,mode:'review'|'targeted',skill?:U3Skill):string[] {
  const used=new Set<string>(),selected:string[]=[],status=statusU3(state);
  const add=(category:U3Skill)=>{
    const item=select(state,questions.filter(question=>question.skill===category&&question.format==='choice'),used,`${category}:${selected.length}`,mode==='targeted');
    if(item){used.add(item.id);selected.push(item.id);return true;}return false;
  };
  if(skill){while(selected.length<(mode==='targeted'?5:10)&&add(skill)){/* one category at a time */}return selected;}
  const weak=weakU3(state);
  if(mode==='targeted'){
    for(let round=0;round<3&&selected.length<8;round++)for(const category of weak){if(selected.length>=8)break;add(category);}
    return selected;
  }
  const rotation=skills.map((_,index)=>skills[(index+state.nextSession-1)%skills.length]);
  const priority=[...new Set([...weak,...rotation.filter(category=>status.find(row=>row.skill===category)?.status==='new'),...rotation])];
  for(const category of priority){if(selected.length>=10)break;add(category);}
  return selected;
}
function enter(state:U3Saved):U3Saved {
  const session=state.session;if(!session)return state;
  session.complete=session.index>=session.ids.length;
  if(session.complete){
    if(session.mode==='story'&&session.storyId&&session.ids.length&&!state.completedStories.includes(session.storyId))state.completedStories.push(session.storyId);
    state.completedStories=stories.filter(story=>state.completedStories.includes(story.id)).map(story=>story.id);
  }else if(!state.seen.includes(session.ids[session.index]))state.seen.push(session.ids[session.index]);
  return state;
}
export function startU3(state:U3Saved,mode:U3Mode,options:U3StartOptions={}):U3Saved {
  if(!modes.includes(mode)||options.storyId&&!storyBank.has(options.storyId)||options.skill&&!skills.includes(options.skill))return state;
  let ids:string[]=[],storyId:string|undefined;
  if(mode==='story'){
    const story=storyBank.get(options.storyId??stories.find(item=>!state.completedStories.includes(item.id))?.id??stories[0].id)!;
    storyId=story.id;ids=[...story.questionIds,...story.checkpointIds];
  }else if(mode==='complete')ids=[...completeQuestionIds];
  else if(mode==='test')ids=testIds(state);
  else ids=practiceIds(state,mode,options.skill);
  const next=clone(state);
  next.session={id:state.nextSession,mode,...(storyId?{storyId}:{}),ids,index:0,selection:[],feedback:false,hint:false,complete:!ids.length,remediationIds:[]} as Session;
  next.nextSession=state.nextSession+1;
  return enter(next);
}

export function chooseU3(state:U3Saved,choiceId:string,slot?:number):U3Saved {
  const question=currentU3(state),session=state.session;
  if(!question||!session||session.feedback||!question.choices.some(choice=>choice.id===choiceId))return state;
  const next=clone(state),selection=next.session!.selection;
  if(question.format==='choice')next.session!.selection=[choiceId];
  else if(question.format==='order'){
    if(selection.includes(choiceId)||selection.length>=question.answer.length)return state;
    selection.push(choiceId);
  }else{
    const target=slot??Array.from({length:question.answer.length},(_,index)=>index).find(index=>!selection[index]);
    if(target===undefined||!Number.isInteger(target)||target<0||target>=question.answer.length)return state;
    while(selection.length<question.answer.length)selection.push('');
    const old=selection.indexOf(choiceId);if(old>=0)selection[old]='';
    selection[target]=choiceId;
  }
  return next;
}
export function removeU3(state:U3Saved,index:number):U3Saved {
  const question=currentU3(state),session=state.session;
  if(!question||!session||session.feedback||!Number.isInteger(index)||index<0||index>=session.selection.length)return state;
  const next=clone(state);
  if(question.format==='bank')next.session!.selection[index]='';else next.session!.selection.splice(index,1);
  return next;
}
export function hintU3(state:U3Saved):U3Saved {
  if(!currentU3(state)||!state.session||state.session.feedback||state.session.mode==='test'||state.session.hint)return state;
  const next=clone(state);next.session!.hint=true;return next;
}
function nextQuestion(state:U3Saved):U3Saved {
  const session=state.session as Session;session.index++;session.selection=[];session.feedback=false;session.hint=false;delete session.retry;return enter(state);
}
export function submitU3(state:U3Saved):U3Saved {
  const question=currentU3(state),session=state.session;
  if(!question||!session||session.feedback||answered(state,question.id)&&!(session as Session).retry||!validSelection(session.selection,question,true))return state;
  const next=clone(state);
  if((session as Session).retry){next.session!.feedback=true;return next;}
  next.evidence.push({sessionId:session.id,questionId:question.id,first:[...session.selection],correct:same(session.selection,question.answer),assisted:session.hint||question.format!=='choice',order:state.evidence.length+1,mode:session.mode});
  if(session.mode==='test')return nextQuestion(next);
  next.session!.feedback=true;return next;
}
/** A practice retry changes only the current response, never the first-attempt evidence. */
export function retryU3(state:U3Saved):U3Saved {
  const question=currentU3(state),session=state.session;
  if(!question||!session||session.mode==='test'||!session.feedback||!answered(state,question.id))return state;
  const next=clone(state);next.session!.selection=[];next.session!.feedback=false;next.session!.hint=false;(next.session as Session).retry=true;return next;
}
function freshParallel(state:U3Saved):U3Question|undefined {
  const question=currentU3(state);if(!question||question.format==='bank')return undefined;
  return select(state,questions.filter(candidate=>candidate.id!==question.id&&candidate.parallelGroup===question.parallelGroup&&candidate.format===question.format),new Set(),'parallel',true);
}
export function canRemediateU3(state:U3Saved):boolean {
  const question=currentU3(state),session=state.session;
  return !!(question&&session&&session.mode!=='test'&&session.feedback&&!answered(state,question.id)?.correct&&((session as Session).remediationIds?.length??0)<2&&freshParallel(state));
}
export function advanceU3(state:U3Saved):U3Saved {
  if(!state.session?.feedback||!currentU3(state))return state;
  const next=clone(state),session=next.session as Session;
  if(canRemediateU3(state)){
    const parallel=freshParallel(state)!;
    const later=session.ids.findIndex((id,index)=>index>session.index&&id===parallel.id);
    if(later>=0)session.ids.splice(later,1);
    session.ids.splice(session.index+1,0,parallel.id);
    session.remediationIds=[...(session.remediationIds??[]),parallel.id];
  }
  return nextQuestion(next);
}

function record(value:unknown):value is Record<string,unknown> {return !!value&&typeof value==='object'&&!Array.isArray(value);}
function positive(value:unknown):value is number {return typeof value==='number'&&Number.isSafeInteger(value)&&value>0;}
function validSelection(value:unknown,question:U3Question,complete=false):value is string[] {
  if(!Array.isArray(value)||value.length>(question.format==='choice'?1:question.answer.length)||complete&&value.length!==question.answer.length)return false;
  const selected=value.filter(id=>id!=='');
  if(new Set(selected).size!==selected.length)return false;
  return value.every(id=>typeof id==='string'&&(question.format==='bank'&&!complete&&id===''||question.choices.some(choice=>choice.id===id)));
}
function validIds(ids:unknown):ids is string[] {return Array.isArray(ids)&&ids.length<=40&&new Set(ids).size===ids.length&&ids.every(id=>typeof id==='string'&&bank.has(id));}

/** Stored answers are re-scored against the content bank; saved grades are never trusted. */
export function parseU3(raw:string|null|undefined):U3Saved {
  if(!raw)return newU3();
  const value:unknown=JSON.parse(raw);
  if(!record(value)||value.version!==1)throw new Error('Unrecognized Unit 3 save');
  const state=newU3(),keys=new Set<string>();
  if(Array.isArray(value.evidence))for(const candidate of value.evidence.slice(-10000)){
    if(!record(candidate)||!positive(candidate.sessionId)||!positive(candidate.order)||typeof candidate.questionId!=='string'||!modes.includes(candidate.mode as U3Mode))continue;
    const question=bank.get(candidate.questionId),key=`${candidate.sessionId}:${candidate.questionId}`;
    if(!question||keys.has(key)||!validSelection(candidate.first,question,true)||candidate.mode==='test'&&(!question.test||question.format!=='choice'))continue;
    const entry:U3Evidence={sessionId:candidate.sessionId,questionId:question.id,first:[...candidate.first],correct:same(candidate.first,question.answer),assisted:candidate.assisted===true||question.format!=='choice',order:candidate.order,mode:candidate.mode as U3Mode};
    state.evidence.push(entry);keys.add(key);
  }
  state.evidence.sort((a,b)=>a.order-b.order);state.evidence=state.evidence.map((row,index)=>({...row,order:index+1}));
  const savedSeen=Array.isArray(value.seen)?value.seen.filter((id):id is string=>typeof id==='string'&&bank.has(id)):[];
  state.seen=[...new Set([...savedSeen,...state.evidence.map(row=>row.questionId)])];
  const saved=value.session;
  if(record(saved)&&positive(saved.id)&&modes.includes(saved.mode as U3Mode)&&validIds(saved.ids)&&Number.isSafeInteger(saved.index)&&Number(saved.index)>=0&&Number(saved.index)<=saved.ids.length){
    const mode=saved.mode as U3Mode,ids=[...saved.ids];
    const story=typeof saved.storyId==='string'?storyBank.get(saved.storyId):undefined;
    const base=story?[...story.questionIds,...story.checkpointIds]:[];
    const remediationIds=Array.isArray(saved.remediationIds)?saved.remediationIds.filter((id):id is string=>typeof id==='string'&&ids.includes(id)):[];
    let valid=remediationIds.length<=2&&new Set(remediationIds).size===remediationIds.length;
    if(mode==='test')valid=valid&&ids.length===32&&ids.every(id=>bank.get(id)!.test&&bank.get(id)!.format==='choice')&&remediationIds.length===0&&ids.includes('test-reading-school-day')&&ids.filter(id=>bank.get(id)!.visual).length===2&&testQuotas.every(([skill,count])=>ids.filter(id=>bank.get(id)!.skill===skill).length===count);
    else if(mode==='complete')valid=valid&&same(ids,completeQuestionIds)&&remediationIds.length===0;
    else if(mode==='story')valid=valid&&!!story&&base.every(id=>ids.includes(id))&&ids.every(id=>base.includes(id)||remediationIds.includes(id))&&ids.length<=base.length+2;
    else valid=valid&&ids.length<=(mode==='review'?12:10)&&ids.every(id=>bank.get(id)!.format==='choice');
    if(valid){
      let index=Number(saved.index);
      const rows=new Map(state.evidence.filter(row=>row.sessionId===saved.id).map(row=>[row.questionId,row]));
      const missing=ids.findIndex((id,at)=>at<index&&!rows.has(id));if(missing>=0)index=missing;
      const question=bank.get(ids[index]),entry=question?rows.get(question.id):undefined;
      const retry=mode!=='test'&&!!entry&&saved.retry===true;
      const allowed=new Set(ids.slice(0,index+1));
      state.evidence=state.evidence.filter(row=>row.sessionId!==saved.id||allowed.has(row.questionId)).map(row=>row.sessionId===saved.id?{...row,mode,assisted:row.assisted||!retry&&mode!=='test'&&row.questionId===question?.id&&saved.hint===true}:row);
      const selection=entry&&!retry?[...entry.first]:question&&validSelection(saved.selection,question)?[...saved.selection]:[];
      state.session={id:saved.id,mode,...(story?{storyId:story.id}:{}),ids,index,selection,feedback:mode!=='test'&&!!entry&&(!retry||saved.feedback===true&&!!question&&validSelection(selection,question,true)),hint:mode!=='test'&&saved.hint===true,complete:index===ids.length,remediationIds,...(retry?{retry:true}:{})} as Session;
      if(mode==='test'&&entry)nextQuestion(state);
    }
  }
  for(const story of stories){
    const required=[...story.questionIds,...story.checkpointIds];
    const sessions=new Set(state.evidence.filter(row=>row.mode==='story'&&required.includes(row.questionId)).map(row=>row.sessionId));
    if([...sessions].some(id=>(state.session?.id!==id||state.session.complete)&&required.every(questionId=>state.evidence.some(row=>row.sessionId===id&&row.mode==='story'&&row.questionId===questionId))))state.completedStories.push(story.id);
  }
  state.nextSession=Math.max(positive(value.nextSession)?value.nextSession:1,...state.evidence.map(row=>row.sessionId+1),(state.session?.id??0)+1);
  return enter(state);
}
