import {modes,questionById,questions,lessons} from './content.ts';
import type {ElaAnswer,ElaEvidence,ElaMode,ElaQuestion,ElaResponse,ElaSession,ElaSkill,ElaState} from './types.ts';
export const ELA_KEY='yusuf.ela.phrases-clauses.v1';
export const newEla=():ElaState=>({writing:{},version:1,lessonIndex:0,learned:[],session:null,evidence:[],completed:[],runs:0,seen:[]});
const clone=<T>(v:T):T=>structuredClone(v);
export function readyAnswer(q:ElaQuestion,a:ElaAnswer):boolean{
 if(q.format==='pair')return !!q.subjectOptions?.some(o=>o.id===a.subject)&&!!q.verbOptions?.some(o=>o.id===a.verb);
 if(q.format==='write')return typeof a.text==='string'&&a.text.trim().length>0&&a.text.length<=6000;
 if(q.format==='build')return Array.isArray(a.parts)&&a.parts.length===q.order!.length&&new Set(a.parts).size===a.parts.length&&a.parts.every(id=>q.parts!.some(o=>o.id===id));
 return !!q.options?.some(o=>o.id===a.choice);
}
export function outcomes(q:ElaQuestion,a:ElaAnswer):Partial<Record<ElaSkill,boolean>>{
 if(q.format==='write')return {};
 if(q.format==='pair')return {subject:!!a.subject&&q.subjects!.includes(a.subject),verb:!!a.verb&&q.verbs!.includes(a.verb)};
 return {[q.skill]:q.format==='build'?JSON.stringify(a.parts)===JSON.stringify(q.order):a.choice===q.answer};
}
export function correctAnswer(q:ElaQuestion,a:ElaAnswer):boolean|null{
 if(q.format==='write')return null;
 if(!readyAnswer(q,a))return false;
 return Object.values(outcomes(q,a)).every(Boolean);
}
export function cleanAnswer(q:ElaQuestion,value:unknown):ElaAnswer{
 const a=value&&typeof value==='object'?value as ElaAnswer:{};
 if(q.format==='write')return typeof a.text==='string'?{text:a.text.slice(0,6000)}:{};
 if(q.format==='pair')return {...(q.subjectOptions!.some(o=>o.id===a.subject)?{subject:a.subject}:{}),...(q.verbOptions!.some(o=>o.id===a.verb)?{verb:a.verb}:{})};
 if(q.format==='build'){if(!Array.isArray(a.parts))return {};const parts=Array.isArray(a.parts)?a.parts.filter((p):p is string=>typeof p==='string'&&q.parts!.some(o=>o.id===p)):[];return {parts:[...new Set(parts)].slice(0,q.order!.length)};}
 return q.options!.some(o=>o.id===a.choice)?{choice:a.choice}:{};
}
export function stats(s:ElaState){
 const result=Object.fromEntries(['subject','verb','phrase-clause','independent-dependent','fragments','building'].map(k=>[k,{total:0,correct:0,independent:0,helped:0,misses:0,freshCorrect:0}])) as Record<ElaSkill,{total:number;correct:number;independent:number;helped:number;misses:number;freshCorrect:number}>;
 for(const e of s.evidence){const q=questionById(e.id);if(!q)continue;for(const [skill,correct] of Object.entries(outcomes(q,e.answer)) as [ElaSkill,boolean][]){const r=result[skill];r.total++;if(correct)r.correct++;else r.misses++;if(e.helped)r.helped++;else if(correct){r.independent++;if(q.targeted)r.freshCorrect++;}}}
 return result;
}
export function weakSkills(s:ElaState):ElaSkill[]{const r=stats(s);return (Object.keys(r) as ElaSkill[]).filter(k=>r[k].misses>0&&r[k].freshCorrect<2);}
export function freshIds(s:ElaState):string[]{const weak=weakSkills(s);return questions.filter(q=>q.targeted&&weak.includes(q.skill)&&!s.seen.includes(q.id)).map(q=>q.id).slice(0,6);}
export function beginEla(s:ElaState,mode:ElaMode):ElaState{
 const ids=mode==='targeted'?freshIds(s):[...modes[mode].ids];if(!ids.length)return s;
 const next=clone(s);next.runs++;next.session={mode,ids,index:0,phase:'active',draft:{},responses:{},helped:false,number:next.runs};next.seen=[...new Set([...next.seen,ids[0]])];return next;
}
export function draftEla(s:ElaState,a:ElaAnswer):ElaState{
 if(!s.session||s.session.phase==='complete')return s;const next=clone(s),session=next.session!,q=questionById(session.ids[session.index])!;session.draft=cleanAnswer(q,a);
 if(q.format==='write')next.writing[writingKey(session.mode,q.id)]={text:session.draft.text??'',submitted:next.writing[writingKey(session.mode,q.id)]?.submitted??false,checks:[false,false,false,false]};
 if(q.format==='write'&&session.responses[q.id]){session.responses[q.id].current=clone(session.draft);session.responses[q.id].checks=[false,false,false,false];}
 return next;
}
export function helpEla(s:ElaState):ElaState{if(!s.session||s.session.mode==='test'||s.session.phase==='complete')return s;const next=clone(s);next.session!.helped=true;return next;}
export function submitEla(s:ElaState):ElaState{
 if(!s.session||s.session.phase!=='active')return s;const q=questionById(s.session.ids[s.session.index])!;if(!readyAnswer(q,s.session.draft))return s;
 const next=clone(s),session=next.session!,existing=session.responses[q.id],a=clone(session.draft);
 session.responses[q.id]=existing?{...existing,current:a,tries:Math.min(100,existing.tries+1)}:{first:a,current:a,helped:session.helped,tries:1,checks:[false,false,false,false]};
 if(q.format==='write')next.writing[writingKey(session.mode,q.id)]={text:a.text!,submitted:true,checks:[...session.responses[q.id].checks]};
 if(!existing)next.evidence.push({id:q.id,answer:a,helped:session.helped,mode:session.mode,run:session.number});
 if(session.mode==='test')return advance(next);
 session.phase='feedback';return next;
}
function advance(s:ElaState):ElaState{
 const session=s.session!;
 if(session.index===session.ids.length-1){session.phase='complete';s.completed=[...new Set([...s.completed,session.mode])];return s;}
 session.index++;session.phase='active';const q=questionById(session.ids[session.index])!;session.draft=q.format==='write'&&session.mode!=='test'&&s.writing[q.id]?{text:s.writing[q.id].text}:{};session.helped=false;s.seen=[...new Set([...s.seen,session.ids[session.index]])];return s;
}
export function nextEla(s:ElaState):ElaState{if(s.session?.phase!=='feedback'||s.session.mode==='test')return s;return advance(clone(s));}
export function retryEla(s:ElaState):ElaState{if(s.session?.phase!=='feedback'||s.session.mode==='test')return s;const next=clone(s);next.session!.phase='active';return next;}
export function checkWriting(s:ElaState,id:string,index:number):ElaState{
 const r=s.session?.responses[id],q=questionById(id);if(!r||q?.format!=='write'||!readyAnswer(q,r.current)||index<0||index>3)return s;
 if(s.session!.mode==='test'&&s.session!.phase!=='complete')return s;
 const next=clone(s);next.session!.responses[id].checks[index]=!r.checks[index];const key=writingKey(s.session!.mode,id);next.writing[key]={text:r.current.text??'',submitted:true,checks:[...next.session!.responses[id].checks]};return next;
}
export function editResultWriting(s:ElaState,id:string,text:string):ElaState{
 const q=questionById(id);if(s.session?.phase!=='complete'||q?.format!=='write'||!s.session.responses[id])return s;
 const next=clone(s);next.session!.responses[id].current={text:text.slice(0,6000)};next.session!.responses[id].checks=[false,false,false,false];next.writing[writingKey(s.session!.mode,id)]={text:text.slice(0,6000),submitted:true,checks:[false,false,false,false]};return next;
}
export const writingKey=(mode:ElaMode,id:string)=>(mode==='test'?'test:':'')+id;
export function editSavedWriting(s:ElaState,key:string,text:string):ElaState{if(!s.writing[key])return s;const next=clone(s);next.writing[key].text=text.slice(0,6000);next.writing[key].checks=[false,false,false,false];const id=key.replace(/^test:/,'');if(next.session&&writingKey(next.session.mode,id)===key){const r=next.session.responses[id];if(r){r.current={text:text.slice(0,6000)};r.checks=[false,false,false,false];}if(next.session.ids[next.session.index]===id)next.session.draft={text:text.slice(0,6000)};}return next;}
export function checkSavedWriting(s:ElaState,key:string,index:number):ElaState{if(s.session?.mode==='test'&&s.session.phase!=='complete')return s;const r=s.writing[key];if(!r?.submitted||!r.text.trim()||index<0||index>3)return s;const next=clone(s);next.writing[key].checks[index]=!r.checks[index];const id=key.replace(/^test:/,'');if(next.session&&writingKey(next.session.mode,id)===key&&next.session.responses[id])next.session.responses[id].checks=[...next.writing[key].checks];return next;}
export function scoreSession(session:ElaSession){
 let total=0,correct=0,written=0,checked=0;const missed:string[]=[];
 for(const id of session.ids){const q=questionById(id)!,r=session.responses[id];if(q.format==='write'){if(r){written++;if(readyAnswer(q,r.current)&&r.checks.every(Boolean))checked++;}continue;}total++;if(r&&correctAnswer(q,r.first))correct++;else missed.push(id);}
 return {correct,total,percent:total?Math.round(correct/total*100):0,written,checked,missed};
}
export function lessonEla(s:ElaState,index:number,mark=false):ElaState{const next=clone(s);next.lessonIndex=Math.max(0,Math.min(lessons.length-1,index));if(mark)next.learned=[...new Set([...next.learned,lessons[s.lessonIndex].id])];return next;}
export function readEla(raw:string|null):{state:ElaState;corrupt:boolean}{
 if(!raw)return {state:newEla(),corrupt:false};
 try{
 const input=JSON.parse(raw);if(!input||input.version!==1||!Array.isArray(input.evidence)||!Array.isArray(input.seen))throw Error('shape');
 const s=newEla();s.lessonIndex=Math.max(0,Math.min(lessons.length-1,Math.floor(Number(input.lessonIndex)||0)));s.learned=lessons.filter(l=>Array.isArray(input.learned)&&input.learned.includes(l.id)).map(l=>l.id);s.runs=Math.max(0,Math.min(100000,Math.floor(Number(input.runs)||0)));
 for(const [key,w] of Object.entries(input.writing??{}) as [string,{text?:unknown;submitted?:unknown;checks?:unknown[]}][]){const q=questionById(key.replace(/^test:/,''));if(q?.format==='write'&&w&&typeof w.text==='string')s.writing[key]={text:w.text.slice(0,6000),submitted:!!w.submitted,checks:Array.from({length:4},(_,i)=>!!w.checks?.[i])};}
 s.seen=[...new Set((input.seen as unknown[]).filter((id):id is string=>typeof id==='string'&&!!questionById(id)))];
 s.completed=(Object.keys(modes) as ElaMode[]).filter(m=>Array.isArray(input.completed)&&input.completed.includes(m));
 const unique=new Set<string>();
 for(const e of input.evidence.slice(-5000) as ElaEvidence[]){const q=questionById(e?.id);if(!q||!Object.hasOwn(modes,e.mode)||!Number.isInteger(e.run)||e.run<1||e.run>s.runs)continue;const a=cleanAnswer(q,e.answer),key=`${e.run}:${e.id}`;if(!readyAnswer(q,a)||unique.has(key))continue;unique.add(key);s.evidence.push({id:q.id,answer:a,helped:!!e.helped,mode:e.mode,run:e.run});}
 const saved=input.session;
 if(saved){
 if(!Object.hasOwn(modes,saved.mode)||!Array.isArray(saved.ids)||new Set(saved.ids).size!==saved.ids.length||!saved.ids.length||!saved.ids.every((id:unknown)=>typeof id==='string'&&!!questionById(id)))throw Error('session');
 const mode=saved.mode as ElaMode,ids=saved.ids as string[];
 if(mode==='targeted'?!ids.every(id=>questionById(id)!.targeted)||ids.length>6:JSON.stringify(ids)!==JSON.stringify(modes[mode].ids))throw Error('ids');
 if(!Number.isInteger(saved.number)||saved.number<1||saved.number>s.runs)throw Error('number');
 const responses:Record<string,ElaResponse>={};
 for(const id of ids){const q=questionById(id)!,r=saved.responses?.[id];if(!r)continue;const first=cleanAnswer(q,r.first),current=cleanAnswer(q,r.current);if(!readyAnswer(q,first))continue;responses[id]={first,current,helped:!!r.helped,tries:Math.max(1,Math.min(100,Math.floor(Number(r.tries)||1))),checks:Array.from({length:4},(_,i)=>!!r.checks?.[i])};}
 // Resume only the first unanswered item or an already-answered item being retried.
 const missing=ids.findIndex(id=>!responses[id]);
 if(missing>=0&&ids.slice(missing+1).some(id=>responses[id]))throw Error('nonsequential');
 let index=missing<0?ids.length-1:missing;
 let phase:ElaSession['phase']='active';
 if(missing<0){
   phase=mode==='test'||saved.phase==='complete'?'complete':saved.phase==='active'?'active':'feedback';
 }else if(mode!=='test'&&missing>0&&saved.index===missing-1&&(saved.phase==='feedback'||saved.phase==='active')){
   index=missing-1;phase=saved.phase;
 }
 const q=questionById(ids[index])!;
 s.session={mode,ids,index,phase,draft:cleanAnswer(q,saved.index===index?saved.draft:responses[q.id]?.current??{}),responses,helped:mode==='test'?false:!!saved.helped,number:saved.number};
 if(phase==='feedback')s.session.draft=clone(responses[q.id].current);
 // Rebuild current-session evidence from its immutable first responses.
 s.evidence=s.evidence.filter(e=>e.run!==saved.number);
 for(const id of ids){const r=responses[id];if(r)s.evidence.push({id,answer:clone(r.first),helped:r.helped,mode,run:saved.number});}
 s.seen=[...new Set([...s.seen,...ids.slice(0,index+1)])];
 }
 s.completed=(Object.keys(modes) as ElaMode[]).filter(mode=>mode!=='targeted'&&Array.isArray(input.completed)&&input.completed.includes(mode)&&s.evidence.some(e=>e.mode===mode&&modes[mode].ids.every(id=>s.evidence.some(row=>row.run===e.run&&row.mode===mode&&row.id===id))));
 return {state:s,corrupt:false};
 }catch{return {state:newEla(),corrupt:true};}
}
