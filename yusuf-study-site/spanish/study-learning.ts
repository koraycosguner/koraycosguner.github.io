import type {StudyQuestion,StudyStep} from './study-types.ts';
export const STUDY_KEY='yusuf.spanish.calm.v1';
export type StudyMode='story'|'test'|'guide'|'lesson';
export type StudyAnswer={first:string;correct:boolean;attempts:number;assisted:boolean;last:string};
export type StudySession={mode:StudyMode;lessonId?:string;ids:string[];index:number;step:number;choice:string|null;feedback:boolean;answers:Record<string,StudyAnswer>;helped:string[];complete:boolean};
export type StudySaved={version:1;session:StudySession|null;lessons:string[]};
export const emptyStudy=():StudySaved=>({version:1,session:null,lessons:[]});
export const answerKey=(s:StudySession)=>`${s.ids[s.index]}:${s.step}`;
export function startStudy(state:StudySaved,mode:StudyMode,questions:StudyQuestion[],lessonId?:string):StudySaved {
  if(!questions.length)return state;
  return {...state,session:{mode,lessonId,ids:questions.map(q=>q.id),index:0,step:0,choice:null,feedback:false,answers:{},helped:[],complete:false}};
}
export function chooseStudy(state:StudySaved,choice:string,question:StudyQuestion):StudySaved {
  const s=state.session;if(!s||s.complete||s.feedback||question.id!==s.ids[s.index]||!question.steps[s.step]?.options.includes(choice))return state;
  return {...state,session:{...s,choice}};
}
export function helpStudy(state:StudySaved):StudySaved {
  const s=state.session;if(!s||s.complete||s.feedback)return state;const key=answerKey(s);
  return {...state,session:{...s,helped:[...new Set([...s.helped,key])]}};
}
export function checkStudy(state:StudySaved,question:StudyQuestion):StudySaved {
  const s=state.session;if(!s||s.complete||s.feedback||!s.choice||question.id!==s.ids[s.index])return state;
  const step=question.steps[s.step];if(!step?.options.includes(s.choice))return state;
  const key=answerKey(s),old=s.answers[key];
  const row:StudyAnswer={first:old?.first??s.choice,correct:s.choice===step.answer,attempts:(old?.attempts??0)+1,assisted:!!old?.assisted||s.helped.includes(key),last:s.choice};
  return {...state,session:{...s,feedback:true,answers:{...s.answers,[key]:row}}};
}
export function retryStudy(state:StudySaved):StudySaved {
  const s=state.session;if(!s||s.complete||s.mode==='test'||!s.feedback||s.answers[answerKey(s)]?.correct!==false)return state;
  return {...state,session:{...s,choice:null,feedback:false}};
}
export function advanceStudy(state:StudySaved,question:StudyQuestion):StudySaved {
  const s=state.session;if(!s||s.complete||!s.feedback||question.id!==s.ids[s.index]||!s.answers[answerKey(s)]||(s.mode!=='test'&&!s.answers[answerKey(s)].correct))return state;
  const more=s.step+1<question.steps.length,index=more?s.index:s.index+1;
  const complete=index===s.ids.length;
  return {...state,lessons:complete&&s.mode==='lesson'&&s.lessonId?[...new Set([...state.lessons,s.lessonId])]:state.lessons,
    session:{...s,index,step:more?s.step+1:0,choice:null,feedback:false,complete}};
}
export function studyScore(s:StudySession,questions:StudyQuestion[]) {
  const rows=s.ids.flatMap(id=>questions.find(q=>q.id===id)?.steps.map((step,index)=>({answer:step.answer,row:s.answers[`${id}:${index}`]}))??[]);
  return {total:rows.length,answered:rows.filter(r=>r.row).length,correct:rows.filter(r=>r.row?.first===r.answer).length,assisted:rows.filter(r=>r.row?.assisted).length};
}
/** Preserve only a structurally valid run from the current question bank. Never interpret stale answers as completion. */
export function parseStudy(raw:string|null,questions:StudyQuestion[],lessonIds:string[]):StudySaved {
  if(!raw)return emptyStudy();
  try{
    const value=JSON.parse(raw);if(value?.version!==1||!Array.isArray(value.lessons))return emptyStudy();
    const state:StudySaved={version:1,session:null,lessons:[...new Set<string>(value.lessons.filter((x:unknown)=>typeof x==='string'&&lessonIds.includes(x)))]};
    const s=value.session;if(s===null)return state;
    if(!s||!['story','test','guide','lesson'].includes(s.mode)||!Array.isArray(s.ids)||!s.ids.length||s.ids.length>250||new Set(s.ids).size!==s.ids.length||s.ids.some((id:unknown)=>typeof id!=='string'||!questions.some(q=>q.id===id)))return state;
    if(s.mode==='lesson'&&!lessonIds.includes(s.lessonId))return state;
    if(!Number.isInteger(s.index)||s.index<0||s.index>s.ids.length||!Number.isInteger(s.step)||s.step<0||typeof s.complete!=='boolean'||typeof s.feedback!=='boolean'||!Array.isArray(s.helped)||!s.answers||typeof s.answers!=='object'||Array.isArray(s.answers))return state;
    if(s.complete!== (s.index===s.ids.length)||s.complete&&(s.step!==0||s.feedback||s.choice!==null))return state;
    const keys=new Map<string,StudyStep>((s.ids as string[]).flatMap((id:string)=>questions.find(q=>q.id===id)!.steps.map((step,i)=>[`${id}:${i}`,step] as const)));
    const answers:Record<string,StudyAnswer>={};
    for(const [key,r] of Object.entries(s.answers) as [string,StudyAnswer][]){
      const st=keys.get(key);
      if(!st||!r||!st.options.includes(r.first)||!st.options.includes(r.last)||!Number.isInteger(r.attempts)||r.attempts<1||r.attempts>10000||typeof r.assisted!=='boolean'||r.correct!==(r.last===st.answer)||s.mode==='test'&&r.attempts!==1)return state;
      answers[key]={first:r.first,last:r.last,attempts:r.attempts,assisted:r.assisted,correct:r.correct};
    }
    const current=s.complete?null:questions.find(q=>q.id===s.ids[s.index])?.steps[s.step];
    if(!s.complete&&(!current||(s.choice!==null&&!current.options.includes(s.choice))))return state;
    if(s.feedback&&(!answers[`${s.ids[s.index]}:${s.step}`]||s.choice!==answers[`${s.ids[s.index]}:${s.step}`].last))return state;
    for(let i=0;i<s.ids.length;i++){
      const q=questions.find(q=>q.id===s.ids[i])!;
      for(let j=0;j<q.steps.length;j++){
        const r=answers[`${q.id}:${j}`];
        if(i<s.index||i===s.index&&j<s.step){if(!r||s.mode!=='test'&&!r.correct)return state}
        if(i>s.index||i===s.index&&j>s.step){if(r)return state}
      }
    }
    state.session={mode:s.mode,lessonId:s.mode==='lesson'?s.lessonId:undefined,ids:s.ids,index:s.index,step:s.step,choice:s.choice,feedback:s.feedback,complete:s.complete,answers,helped:[...new Set<string>(s.helped.filter((k:unknown)=>typeof k==='string'&&keys.has(k)))]};return state;
  }catch{return emptyStudy()}
}
export function studyOptions(options:string[],seed:string){
  let hash=0;for(const char of seed)hash=(Math.imul(hash,31)+char.charCodeAt(0))>>>0;
  const copy=[...options];for(let i=copy.length-1;i>0;i--){hash=(Math.imul(hash,1664525)+1013904223)>>>0;const j=hash%(i+1);[copy[i],copy[j]]=[copy[j],copy[i]]}return copy;
}
