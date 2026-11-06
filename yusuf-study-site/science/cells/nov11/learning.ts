import {byId,correct,lessons,major,review,skillNames} from './content.ts';
import type {Attempt,Question,Saved,Skill} from './types.ts';
export const KEY='yusuf.science.cells.nov11.v1';
export const fresh=():Saved=>({version:1,next:1,lesson:'diffusion',slide:0,session:null,history:[],sheets:{}});
const copy=(s:Saved):Saved=>structuredClone(s);
export const current=(s:Saved)=>s.session?byId.get(s.session.ids[s.session.index]):undefined;
export function start(s:Saved,mode:Attempt['mode'],skill?:Skill):Saved{
 let ids=mode==='test'?major.map(q=>q.id):mode==='practice'?lessons.find(l=>l.id===skill)?.questions.map(q=>q.id)??[]:review.filter(q=>(!skill||q.skill===skill)&&!seen(s).has(q.id)).slice(0,5).map(q=>q.id);
 if(!ids.length)return s;
 const n=copy(s);n.session={id:s.next,mode,ids,index:0,draft:[],text:'',help:false,feedback:false,retry:false,submitted:false,answers:{}};n.next++;return n;
}
export function seen(s:Saved){return new Set([...s.history,s.session].filter((v):v is Attempt=>!!v).flatMap(v=>Object.keys(v.answers)))}
export function choose(s:Saved,value:string,slot?:number):Saved{
 const q=current(s),a=s.session;if(!q||!a||a.submitted||a.feedback||!q.choices.includes(value))return s;
 const n=copy(s),v=n.session!;if(q.kind==='choice')v.draft=[value];else if(q.kind==='order'){
 const i=slot??v.draft.findIndex(x=>!x);const target=slot??(i<0?v.draft.length:i);
 if(target<0||target>=q.answer.length)return s;
 while(v.draft.length<q.answer.length)v.draft.push('');const old=v.draft.indexOf(value);if(old>=0)v.draft[old]='';v.draft[target]=value;
 }return n;
}
export function edit(s:Saved,text:string):Saved{const q=current(s);if(q?.kind!=='written'||!s.session||s.session.submitted)return s;const n=copy(s);n.session!.text=text.slice(0,12000);return n}
export function help(s:Saved):Saved{if(!s.session||s.session.mode==='test'||s.session.submitted)return s;const n=copy(s);n.session!.help=true;return n}
export function ready(q:Question,a:Attempt){return q.kind==='written'?!!a.text.trim():a.draft.length===q.answer.length&&a.draft.every(v=>q.choices.includes(v))&&new Set(a.draft).size===a.draft.length}
export function saveAnswer(s:Saved):Saved{
 const q=current(s),a=s.session;if(!q||!a||a.submitted||a.feedback||!ready(q,a))return s;
 const n=copy(s),v=n.session!;
 if(!v.retry)v.answers[q.id]={selection:[...v.draft],text:v.text,help:v.help};
 if(v.mode==='test')return go(n,v.index+1);v.feedback=true;return n;
}
export function go(s:Saved,index:number):Saved{
 const a=s.session;if(!a||a.submitted||index<0||index>a.ids.length)return s;
 const n=copy(s),v=n.session!,stored=v.answers[v.ids[index]];v.index=index;v.draft=stored?[...stored.selection]:[];v.text=stored?.text??'';v.help=stored?.help??false;v.feedback=false;v.retry=false;return n;
}
export function retry(s:Saved):Saved{if(!s.session||s.session.mode==='test'||!s.session.feedback)return s;const n=copy(s);n.session!.draft=[];n.session!.text='';n.session!.help=false;n.session!.feedback=false;n.session!.retry=true;return n}
export function finish(s:Saved):Saved{
 const a=s.session;if(!a||a.submitted||a.ids.some(id=>!a.answers[id]))return s;
 const n=copy(s);n.session!.submitted=true;n.session!.index=a.ids.length;n.history=[...n.history.filter(v=>v.id!==a.id),structuredClone(n.session!)].slice(-80);return n;
}
export function score(a:Attempt){const qs=a.ids.map(id=>byId.get(id)!).filter(q=>q.kind!=='written');const points=qs.filter(q=>correct(q,a.answers[q.id]?.selection??[])).length;const percent=qs.length?Math.round(points/qs.length*100):0;return {points,total:qs.length,percent,grade:percent>=90?'A':percent>=80?'B':percent>=70?'C':percent>=60?'D':'F',written:a.ids.map(id=>byId.get(id)!).filter(q=>q.kind==='written').length}}
export function skills(s:Saved){
 const sessions=[...s.history,...(s.session&&!s.history.some(a=>a.id===s.session!.id)&&s.session.submitted?[s.session]:[])];
 return (Object.keys(skillNames) as Skill[]).map(skill=>{
 const qs=new Map<string,{correct:boolean;help:boolean}>();
 for(const a of sessions)for(const [id,answer] of Object.entries(a.answers)){const q=byId.get(id);if(q?.skill===skill&&q.kind!=='written'&&!qs.has(id))qs.set(id,{correct:correct(q,answer.selection),help:answer.help})}
 const independent=[...qs.values()].filter(x=>x.correct&&!x.help).length,needs=[...qs.values()].some(x=>!x.correct||x.help);
 const sequence=[...qs.values()];const lastConcern=sequence.findLastIndex(x=>!x.correct||x.help);const recovery=sequence.slice(lastConcern+1).filter(x=>x.correct&&!x.help).length;
 const status=!qs.size?'Not checked yet':needs&&recovery<2?'Review suggested':independent>=3?'Ready for a new check':'Building confidence';
 return {skill,label:skillNames[skill],answered:qs.size,independent,status,available:review.filter(q=>q.skill===skill&&!seen(s).has(q.id)).length};
 });
}
const record=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
const integer=(v:unknown):v is number=>typeof v==='number'&&Number.isSafeInteger(v)&&v>=0&&v<1e9;
function readAttempt(value:unknown):Attempt|null{
 if(!record(value)||!integer(value.id)||value.id<1||!['practice','review','test'].includes(String(value.mode))||!Array.isArray(value.ids)||!value.ids.length||value.ids.length>50||new Set(value.ids).size!==value.ids.length||!value.ids.every(id=>typeof id==='string'&&byId.has(id))||!record(value.answers))return null;
 const ids=value.ids as string[],mode=value.mode as Attempt['mode'];
 if(mode==='test'&&(ids.length!==major.length||!ids.every((id,i)=>id===major[i].id)))return null;
 if(mode==='review'&&!ids.every(id=>review.some(q=>q.id===id)))return null;
 if(mode==='practice'&&!lessons.some(l=>ids.length===l.questions.length&&ids.every((id,i)=>id===l.questions[i].id)))return null;
 const answers:Attempt['answers']={};
 const valid=(selection:unknown,q:Question,complete=false):selection is string[]=>Array.isArray(selection)&&selection.length<=q.answer.length&&(!complete||selection.length===q.answer.length)&&new Set(selection.filter(Boolean)).size===selection.filter(Boolean).length&&selection.every(v=>typeof v==='string'&&(!v&&!complete||q.choices.includes(v)));
 for(const id of ids){const v=value.answers[id],q=byId.get(id)!;if(record(v)&&valid(v.selection,q,true)&&typeof v.text==='string'&&(q.kind!=='written'||v.text.trim()))answers[id]={selection:[...v.selection],text:v.text.slice(0,12000),help:mode!=='test'&&v.help===true}}
 const missing=ids.findIndex(id=>!answers[id]);let index=integer(value.index)?Math.min(value.index,ids.length):0;if(missing>=0&&index>missing)index=missing;
 const q=byId.get(ids[index]);const submitted=value.submitted===true&&missing<0;
 return {id:value.id,mode,ids:[...ids],index:submitted?ids.length:index,answers,draft:q&&valid(value.draft,q)?[...value.draft]:[],text:typeof value.text==='string'?value.text.slice(0,12000):'',help:mode!=='test'&&value.help===true,feedback:mode!=='test'&&!!q&&!!answers[q.id]&&value.feedback===true,retry:mode!=='test'&&!!q&&!!answers[q.id]&&value.retry===true,submitted};
}
/** Reject unknown/corrupt saves rather than overwrite the original record. Scores are derived. */
export function parse(raw:string|null):Saved{
 if(!raw)return fresh();const value:unknown=JSON.parse(raw);if(!record(value)||value.version!==1)throw Error('Unsupported save');
 const s=fresh();if(lessons.some(l=>l.id===value.lesson))s.lesson=value.lesson as Skill;
 if(integer(value.slide))s.slide=Math.min(value.slide,4);
 if(Array.isArray(value.history)){const seenIds=new Set<number>();s.history=value.history.slice(-80).map(readAttempt).filter((a):a is Attempt=>!!a&&a.submitted&&!seenIds.has(a.id)&&!!seenIds.add(a.id));}
 s.session=readAttempt(value.session);s.next=Math.max(integer(value.next)?value.next:1,1,...s.history.map(a=>a.id+1),(s.session?.id??0)+1);
 if(record(value.sheets))for(const [key,v] of Object.entries(value.sheets))if(/^(sheet-[0-9]+|explain-[a-z]+)$/.test(key)&&typeof v==='string')s.sheets[key]=v.slice(0,12000);
 return s;
}
