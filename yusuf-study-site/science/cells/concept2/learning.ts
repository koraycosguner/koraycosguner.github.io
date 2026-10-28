import {analogySets,cellParts,compareIds,core,functionIds,labelSets,matchIds,paragraphIds,partById,questIds,reviewIds,skills,taskById,testIds,typeIds,writeIds} from './content.ts';
import type {CellKind,Mode,PartId,Saved,Skill,Task} from './types.ts';
export const KEY='yusuf.science.cells.concept2.v1';
export const LIMIT=12000;
const modes:Mode[]=['label','functions','analogies','compare','types','paragraphs','match','quest','test','quick','review','write'];
export const fresh=():Saved=>({version:1,next:1,cell:'animal',discovered:[],drafts:{},session:null,evidence:[],seen:[]});
export const current=(s:Saved)=>s.session&&!s.session.complete?taskById.get(s.session.ids[s.session.index]):undefined;
export function shuffle<T>(input:T[],seed:number):T[]{let n=seed>>>0;const a=[...input];for(let i=a.length-1;i>0;i--){n=(Math.imul(n,1664525)+1013904223)>>>0;const j=n%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
const equal=(a:string[],b:string[])=>a.length===b.length&&a.every((x,i)=>x===b[i]);
export const correct=(t:Task,selection:string[])=>equal(t.answer,selection);
export const discover=(s:Saved,id:PartId):Saved=>s.discovered.includes(id)?s:{...s,discovered:[...s.discovered,id]};
export function start(s:Saved,mode:Mode,options:{cell?:CellKind;level?:number;set?:keyof typeof analogySets;part?:PartId;skill?:Skill}={}):Saved{
 let ids:string[]=[];
 if(mode==='label')ids=labelSets[`${options.cell==='plant'?'plant':'animal'}-${options.level??1}`]??[];
 if(mode==='functions')ids=options.part?functionIds.filter(id=>taskById.get(id)?.part===options.part):functionIds;
 if(mode==='analogies')ids=analogySets[options.set??'guided'];
 if(mode==='write')ids=writeIds;
 if(mode==='compare')ids=compareIds;
 if(mode==='types')ids=typeIds;
 if(mode==='paragraphs')ids=paragraphIds;
 if(mode==='match')ids=matchIds;
 if(mode==='quest')ids=options.part?questIds.filter(id=>taskById.get(id)?.part===options.part):questIds;
 if(mode==='test')ids=testIds;
 if(mode==='quick'){
  const selected=shuffle(core.map(p=>p.id),s.next);
  ids=[...selected.slice(0,4).map(id=>`review-label-${id}`),...selected.slice(4,8).map(id=>`${s.next%2?'review-job':'scenario'}-${id}`),...selected.slice(1,4).map(id=>`reason-${id}`),`write-${selected[8]}`];
 }
 if(mode==='review'){
  const wanted=options.skill?[options.skill]:weakSkills(s);
  const pool=reviewIds.filter(id=>wanted.includes(taskById.get(id)!.skill)&&!s.seen.includes(id));
  const groups=wanted.map(skill=>shuffle(pool.filter(id=>taskById.get(id)!.skill===skill),s.next));
  for(let i=0;ids.length<8;i++){let found=false;for(const group of groups)if(group[i]&&ids.length<8){ids.push(group[i]);found=true}if(!found)break}
 }
 // Learning sequences stay scaffolded; options shuffle on every new session.
 ids=[...ids];
 return {...s,next:s.next+1,cell:options.cell??s.cell,session:{id:s.next,mode,ids,index:0,selection:[],text:s.drafts[ids[0]]??'',hint:false,feedback:false,retry:false,complete:ids.length===0},seen:[...new Set([...s.seen,...ids.slice(0,1)])]};
}
export function choose(s:Saved,id:string,index=0):Saved{
 const t=current(s),ss=s.session;if(!t||!ss||ss.feedback||!t.choices.some(c=>c.id===id)||!Number.isInteger(index)||index<0||index>=t.answer.length)return s;
 const selection=Array.from({length:t.answer.length},(_,i)=>ss.selection[i]??'');
 if(t.kind==='bank'||t.kind==='label'){const old=selection.indexOf(id);if(old>=0)selection[old]=''}
 selection[index]=id;return {...s,session:{...ss,selection}};
}
export function clear(s:Saved,index?:number):Saved{
 if(!s.session||s.session.feedback)return s;
 const selection=index===undefined?[]:s.session.selection.map((x,i)=>i===index?'':x);
 return {...s,session:{...s.session,selection}};
}
export function write(s:Saved,text:string):Saved{
 const t=current(s);if(!t||t.kind!=='written'||!s.session||s.session.feedback)return s;
 const value=text.slice(0,LIMIT);return {...s,drafts:{...s.drafts,[t.id]:value},session:{...s.session,text:value}};
}
export function hint(s:Saved):Saved{return s.session&&s.session.mode!=='test'&&!s.session.feedback?{...s,session:{...s.session,hint:true}}:s}
export function canSubmit(s:Saved):boolean{
 const t=current(s),ss=s.session;return !!(t&&ss&&!ss.feedback&&(t.kind==='written'?ss.text.trim().length>0:validSelection(t,ss.selection,true)));
}
function advance(s:Saved):Saved{
 const ss=s.session!;const index=ss.index+1,id=ss.ids[index];return {...s,session:{...ss,index,selection:[],text:s.drafts[id]??'',feedback:false,hint:false,retry:false,complete:index>=ss.ids.length},seen:[...new Set([...s.seen,...(id?[id]:[])])]};
}
export function submit(s:Saved):Saved{
 const ss=s.session,t=current(s);if(!ss||!t||!canSubmit(s))return s;
 const exists=s.evidence.some(e=>e.session===ss.id&&e.task===t.id);
 const next={...s,evidence:exists?s.evidence:[...s.evidence,{session:ss.id,task:t.id,mode:ss.mode,first:[...ss.selection],text:ss.text,assisted:ss.hint}]};
 return ss.mode==='test'?advance(next):{...next,session:{...ss,feedback:true}};
}
export const nextTask=(s:Saved)=>s.session?.feedback?advance(s):s;
export function retry(s:Saved):Saved{const ss=s.session;return ss&&ss.mode!=='test'&&ss.feedback?{...s,session:{...ss,selection:[],hint:false,feedback:false,retry:true}}:s}
export function score(s:Saved){
 const ss=s.session,rows=s.evidence.filter(e=>e.session===ss?.id),objective=ss?.ids.filter(id=>taskById.get(id)?.kind!=='written')??[];
 const right=rows.filter(e=>objective.includes(e.task)&&correct(taskById.get(e.task)!,e.first)).length;
 return {correct:right,total:objective.length,percent:objective.length?Math.round(right/objective.length*100):0,written:rows.filter(e=>ss?.ids.includes(e.task)&&taskById.get(e.task)?.kind==='written').length,groups:(Object.keys(skills) as Skill[]).map(skill=>{const ids=objective.filter(id=>taskById.get(id)?.skill===skill);return {skill,total:ids.length,correct:rows.filter(e=>ids.includes(e.task)&&correct(taskById.get(e.task)!,e.first)).length}})};
}
export function weakSkills(s:Saved):Skill[]{
 const lastTest=Math.max(0,...s.evidence.filter(e=>e.mode==='test').map(e=>e.session));
 const rows=s.evidence.filter(e=>!lastTest||e.session===lastTest);
 return (Object.keys(skills) as Skill[]).filter(skill=>rows.some(e=>{const t=taskById.get(e.task)!;return t.kind!=='written'&&t.skill===skill&&(!correct(t,e.first)||e.assisted)}));
}
function allowed(id:string,mode:Mode):boolean{
 const pools:Record<Mode,string[]>={label:Object.values(labelSets).flat(),functions:functionIds,analogies:Object.values(analogySets).flat(),compare:compareIds,types:typeIds,paragraphs:paragraphIds,match:matchIds,quest:questIds,test:testIds,write:writeIds,review:reviewIds,quick:[...reviewIds,...functionIds,...writeIds,...Object.values(analogySets).flat()]};
 return !!pools[mode]?.includes(id);
}
function record(v:unknown):v is Record<string,unknown>{return !!v&&typeof v==='object'&&!Array.isArray(v)}
function positive(v:unknown):v is number{return Number.isSafeInteger(v)&&Number(v)>0&&Number(v)<1000000000}
function validSelection(t:Task,v:unknown,full=false):v is string[]{
 if(!Array.isArray(v)||v.length>t.answer.length||full&&v.length!==t.answer.length||!v.every(x=>typeof x==='string'&&(x===''&&!full||t.choices.some(c=>c.id===x))))return false;
 const filled=v.filter(Boolean);return !['bank','label'].includes(t.kind)||new Set(filled).size===filled.length;
}
export function parse(raw:string|null):Saved{
 if(raw===null)return fresh();const v:unknown=JSON.parse(raw);
 if(!record(v)||v.version!==1||!positive(v.next)||!['animal','plant','prokaryote'].includes(String(v.cell))||!Array.isArray(v.discovered)||!v.discovered.every(id=>typeof id==='string'&&id in partById)||!record(v.drafts)||!Object.entries(v.drafts).every(([id,text])=>taskById.get(id)?.kind==='written'&&typeof text==='string'&&text.length<=LIMIT)||!Array.isArray(v.seen)||!v.seen.every(id=>typeof id==='string'&&taskById.has(id))||!Array.isArray(v.evidence))throw Error('Invalid Concept 2 save');
 const seen=new Set<string>();
 for(const e of v.evidence){
  if(!record(e)||!positive(e.session)||e.session>=v.next||typeof e.task!=='string'||!taskById.has(e.task)||!modes.includes(e.mode as Mode)||!allowed(e.task,e.mode as Mode)||typeof e.assisted!=='boolean'||typeof e.text!=='string'||e.text.length>LIMIT||!validSelection(taskById.get(e.task)!,e.first,true)||taskById.get(e.task)!.kind==='written'&&!e.text.trim()||seen.has(`${e.session}:${e.task}`))throw Error('Invalid answer record');
  seen.add(`${e.session}:${e.task}`);
 }
 if(v.session!==null){
  const ss=v.session;
  if(!record(ss)||!positive(ss.id)||ss.id>=v.next||!modes.includes(ss.mode as Mode)||!Array.isArray(ss.ids)||ss.ids.length>50||new Set(ss.ids).size!==ss.ids.length||!ss.ids.every(id=>typeof id==='string'&&taskById.has(id)&&allowed(id,ss.mode as Mode))||!Number.isInteger(ss.index)||Number(ss.index)<0||Number(ss.index)>ss.ids.length||typeof ss.complete!=='boolean'||ss.complete!==(ss.index===ss.ids.length)||typeof ss.feedback!=='boolean'||typeof ss.retry!=='boolean'||typeof ss.hint!=='boolean'||typeof ss.text!=='string'||ss.text.length>LIMIT)throw Error('Invalid session');
  if(ss.mode==='test'&&(!equal(ss.ids as string[],testIds)||ss.hint||ss.feedback||ss.retry))throw Error('Invalid test');
  if(!ss.complete&&!validSelection(taskById.get(ss.ids[ss.index as number] as string)!,ss.selection))throw Error('Invalid selection');
  const own=(v.evidence as Record<string,unknown>[]).filter(e=>e.session===ss.id);
  if(own.some(e=>e.mode!==ss.mode||!(ss.ids as string[]).includes(e.task as string)))throw Error('Invalid session answers');
  if(!ss.complete&&(ss.feedback||ss.retry)&&!seen.has(`${ss.id}:${ss.ids[ss.index as number]}`))throw Error('Missing first answer');
  for(let i=0;i<Number(ss.index);i++)if(!seen.has(`${ss.id}:${ss.ids[i]}`))throw Error('Missing first response');
 }
 return v as unknown as Saved;
}
export function availableTargets(t:Task):PartId[]{return t.targets??cellParts(t.cell??'animal').map(p=>p.id)}
