import {lessons, completeTechniqueIds, fastReviewQuestions, mixedQuestions, challengeQuestions, finalQuestions, type ConceptId, type TechniqueId, type Question} from './content.ts';

export const STORAGE_KEY = 'yusuf.rikki.v1';
export type Evidence = {questionId:string; conceptId:ConceptId; firstCorrect:boolean; attempts:number};
export type RoundMode = 'review'|'mixed'|'challenge'|'final'|'targeted';
export type RoundResult = {id:string; mode:RoundMode; evidence:Evidence[]};
export type Progress = {version:1; completed:TechniqueId[]; awards:string[]; current:{lessonId:ConceptId; step:number}|null; results:RoundResult[]; needsReview:TechniqueId[]};
export const questionBank = [...lessons.flatMap(l=>[l.quickCheck,l.memoryCheck].filter((q):q is Question=>q!==null)),...fastReviewQuestions,...mixedQuestions,...challengeQuestions,...finalQuestions];
const questions = new Map(questionBank.map(q=>[q.id,q]));
const modes:RoundMode[] = ['review','mixed','challenge','final','targeted'];
export function emptyProgress():Progress{return {version:1,completed:[],awards:[],current:null,results:[],needsReview:[]};}
export function correctAnswer(question:Question,selected:string[]):boolean{return selected.length===question.correctOptionIds.length && new Set(selected).size===selected.length && question.correctOptionIds.every(id=>selected.includes(id));}
export function parseProgress(raw:string|null):Progress{
 const base=emptyProgress();if(!raw)return base;
 try{
  const p=JSON.parse(raw);if(!p||p.version!==1)return base;
  base.completed=completeTechniqueIds.filter(id=>Array.isArray(p.completed)&&p.completed.includes(id));
  base.awards=Array.isArray(p.awards)?[...new Set<string>(p.awards.filter((id:unknown):id is string=>typeof id==='string'&&questions.has(id)))]:[];
  base.needsReview=completeTechniqueIds.filter(id=>Array.isArray(p.needsReview)&&p.needsReview.includes(id));
  const lesson=lessons.find(l=>l.id===p.current?.lessonId);
  if(lesson&&Number.isInteger(p.current.step)&&p.current.step>=0&&p.current.step<=(lesson.status==='pending'?0:4+(lesson.details?.length??0)))base.current={lessonId:lesson.id,step:p.current.step};
  if(Array.isArray(p.results))base.results=p.results.slice(-10).flatMap((r:unknown)=>{
   if(!r||typeof r!=='object')return[];const v=r as Record<string,unknown>;
   if(typeof v.id!=='string'||v.id.length>80||!modes.includes(v.mode as RoundMode)||!Array.isArray(v.evidence))return[];
   const seen=new Set<string>();const evidence:Evidence[]=[];
   for(const e of v.evidence){const q=questions.get(e?.questionId);if(!q||q.conceptId!==e.conceptId||seen.has(q.id)||typeof e.firstCorrect!=='boolean'||!Number.isInteger(e.attempts)||e.attempts<1||e.attempts>1000)continue;seen.add(q.id);evidence.push({questionId:q.id,conceptId:q.conceptId,firstCorrect:e.firstCorrect,attempts:e.attempts});}
   return evidence.length?[{id:v.id,mode:v.mode as RoundMode,evidence}]:[];
  });
  return base;
 }catch{return base;}
}
export function award(progress:Progress,questionId:string):Progress{return questions.has(questionId)&&!progress.awards.includes(questionId)?{...progress,awards:[...progress.awards,questionId]}:progress;}
export function finishLesson(progress:Progress,id:ConceptId):Progress{return completeTechniqueIds.includes(id as TechniqueId)?{...progress,completed:[...new Set([...progress.completed,id as TechniqueId])],current:null}:progress;}
export function addResult(progress:Progress,result:RoundResult):Progress{
 if(progress.results.some(r=>r.id===result.id))return progress;
 let needsReview=progress.needsReview;
 if(result.mode==='final')needsReview=reviewConcepts(result);
 else if(result.mode!=='challenge'){
  const missed=completeTechniqueIds.filter(id=>result.evidence.some(e=>e.conceptId===id&&!e.firstCorrect));
  needsReview=[...new Set([...needsReview,...missed])];
  if(result.mode==='targeted')needsReview=needsReview.filter(id=>{const entries=result.evidence.filter(e=>e.conceptId===id);return !entries.length||entries.some(e=>!e.firstCorrect);});
 }
 return {...progress,needsReview,results:[...progress.results,result].slice(-10)};
}
export function masteredConcepts(result:RoundResult):TechniqueId[]{return completeTechniqueIds.filter(id=>{const items=result.evidence.filter(e=>e.conceptId===id);return items.length>=2&&items.every(e=>e.firstCorrect);});}
export function reviewConcepts(result:RoundResult):TechniqueId[]{const mastered=masteredConcepts(result);return completeTechniqueIds.filter(id=>!mastered.includes(id));}
export function latestFinal(progress:Progress):RoundResult|undefined{return [...progress.results].reverse().find(r=>r.mode==='final');}
