import {storyScenes, reviewTurns, type StoryConcept, type StoryTurn} from './story-content.ts';

export const STORY_KEY = 'yusuf.spanish.school-day.v1';
export const allStoryTurns = storyScenes.flatMap(scene => scene.turns);
const allTurns = [...allStoryTurns, ...reviewTurns];
export type StoryEvidence = {attempts:number; firstCorrect:boolean; assisted:boolean; complete:boolean};
export type StoryProgress = {
  version:1; started:boolean; cursor:string; english:boolean; guided:boolean;
  evidence:Record<string,StoryEvidence>; seenObjects:string[];
};
export const newStory = ():StoryProgress => ({version:1, started:false, cursor:allStoryTurns[0].id, english:true, guided:true, evidence:{}, seenObjects:[]});
const normalize = (value:string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es').trim().replace(/[¡!¿?.,;:]/g,'').replace(/\s+/g,' ');
export function matchesStoryAnswer(turn:Pick<StoryTurn,'answers'>, answer:string) {
  return !!answer.trim() && turn.answers.some(accepted => normalize(accepted) === normalize(answer));
}
export function recordStoryAttempt(progress:StoryProgress, turn:StoryTurn, correct:boolean, assisted:boolean):StoryProgress {
  const old = progress.evidence[turn.id];
  if(old?.complete) return progress;
  return {...progress, evidence:{...progress.evidence, [turn.id]:{
    attempts:Math.min(999,(old?.attempts??0)+1), firstCorrect:old&&old.attempts>0?old.firstCorrect:correct,
    assisted:!!old?.assisted||assisted, complete:correct,
  }}};
}
export function markStorySupport(progress:StoryProgress, turn:StoryTurn):StoryProgress {
  const old=progress.evidence[turn.id];
  if(old?.complete||old?.assisted)return progress;
  return {...progress,evidence:{...progress.evidence,[turn.id]:old?{...old,assisted:true}:{attempts:0,firstCorrect:false,assisted:true,complete:false}}};
}
export function conceptEvidence(progress:StoryProgress) {
  const result:Partial<Record<StoryConcept,{attempted:number; independent:number; completed:number}>> = {};
  for(const turn of allTurns) {
    const answer=progress.evidence[turn.id]; if(!answer||answer.attempts===0) continue;
    const row=result[turn.concept]??{attempted:0,independent:0,completed:0};
    result[turn.concept]={attempted:row.attempted+1, independent:row.independent+(answer.firstCorrect&&!answer.assisted?1:0), completed:row.completed+(answer.complete?1:0)};
  }
  return result;
}
export function suggestedReview(progress:StoryProgress):StoryTurn[] {
  const practiced = new Set(reviewTurns.filter(t=>progress.evidence[t.id]?.complete).map(t=>t.concept));
  const concepts = new Set(allStoryTurns.filter(t=>{
    const e=progress.evidence[t.id]; return e&&(!e.firstCorrect||e.assisted)&&!practiced.has(t.concept);
  }).map(t=>t.concept));
  return reviewTurns.filter(t=>concepts.has(t.concept));
}
export function completedScene(progress:StoryProgress, sceneIndex:number) {
  return storyScenes[sceneIndex].turns.every(t=>progress.evidence[t.id]?.complete);
}
export function availableScene(progress:StoryProgress, sceneIndex:number) {
  return sceneIndex===0||storyScenes.slice(0,sceneIndex).every((_,i)=>completedScene(progress,i));
}
export function parseStory(raw:string|null):StoryProgress {
  if(!raw)return newStory();
  const saved=JSON.parse(raw); if(!saved||saved.version!==1)throw Error('Unknown story save');
  const progress=newStory(); progress.started=saved.started===true; progress.english=saved.english!==false; progress.guided=saved.guided!==false;
  for(const turn of allTurns) {
    const e=saved.evidence?.[turn.id];
    if(e&&typeof e==='object'&&Number.isSafeInteger(e.attempts)&&e.attempts>=0) {
      progress.evidence[turn.id]={attempts:Math.min(999,e.attempts),firstCorrect:e.attempts>0&&e.firstCorrect===true,assisted:e.assisted===true,complete:e.attempts>0&&e.complete===true};
    }
  }
  const sceneIndex=storyScenes.findIndex(s=>s.turns.some(t=>t.id===saved.cursor));
  if(sceneIndex>=0&&availableScene(progress,sceneIndex))progress.cursor=saved.cursor;
  else progress.cursor=allStoryTurns.find(t=>!progress.evidence[t.id]?.complete)?.id??allStoryTurns[0].id;
  progress.seenObjects=Array.isArray(saved.seenObjects)?[...new Set(saved.seenObjects.filter((x:unknown):x is string=>typeof x==='string'&&/^[a-z-]{1,30}$/.test(x)))].slice(0,50) as string[]:[];
  return progress;
}
