import {lessonPractice, prepSkillLabels, proficiencyQuestions, proficiencyReview, type PrepQuestion, type PrepSkill} from './proficiency-content.ts';

export const PREP_KEY = 'yusuf.spanish.proficiency.v1';
export type PrepMode = 'guided' | 'prep' | 'test' | 'review';
export type PrepEvidence = {
  sessionId:string; mode:PrepMode; questionId:string; step:number; skill:PrepSkill; attempts:number;
  firstChoice:string|null; firstCorrect:boolean; assisted:boolean; correct:boolean; lastChoice:string|null;
};
export type PrepSession = {
  id:string; mode:PrepMode; questionIds:string[]; questionIndex:number; stepIndex:number;
  choice:string|null; feedback:boolean; complete:boolean; lessonId?:string;
};
export type SavedPrep = {
  version:1; english:boolean; completedLessons:string[]; evidence:Record<string,PrepEvidence>;
  seenQuestions:string[]; nextSession:number; currentSession?:PrepSession;
};
export type PrepSkillStatus = {
  skill:PrepSkill; label:string; status:'ready'|'little-more'|'review'|'unseen'; attempted:number; independent:number;
};

const allQuestions = [...proficiencyQuestions, ...proficiencyReview, ...Object.values(lessonPractice).flat()];
const questionMap = new Map(allQuestions.map(question => [question.id,question]));
const skills = Object.keys(prepSkillLabels) as PrepSkill[];
const modes:PrepMode[] = ['guided','prep','test','review'];
const own = (value:object,key:string) => Object.prototype.hasOwnProperty.call(value,key);
const isObject = (value:unknown):value is Record<string,unknown> => !!value && typeof value==='object' && !Array.isArray(value);
const validSessionId = (value:unknown):value is string => typeof value==='string' && /^session-[1-9]\d{0,8}$/.test(value);
const sessionNumber = (id:string) => Number(id.slice('session-'.length));
const evidenceKey = (sessionId:string,questionId:string,step:number) => `${sessionId}:${questionId}:${step}`;

export const newPrep = ():SavedPrep => ({version:1,english:true,completedLessons:[],evidence:{},seenQuestions:[],nextSession:1});
export const getPrepQuestion = (id:string):PrepQuestion|undefined => questionMap.get(id);
export function currentPrepQuestion(state:SavedPrep):PrepQuestion|undefined {
  const session=state.currentSession;
  return session && !session.complete ? getPrepQuestion(session.questionIds[session.questionIndex]) : undefined;
}
export function currentPrepEvidence(state:SavedPrep):PrepEvidence|undefined {
  const session=state.currentSession, question=currentPrepQuestion(state);
  return session && question ? state.evidence[evidenceKey(session.id,question.id,session.stepIndex)] : undefined;
}

/** Starts a distinct run. Repeated examples never count as distinct mastery evidence. */
export function startPrep(state:SavedPrep,mode:PrepMode,questionIds:string[],lessonId?:string):SavedPrep {
  const ids=[...new Set(questionIds.filter(id=>questionMap.has(id)))];
  if(!modes.includes(mode)||!ids.length)return state;
  const session:PrepSession={id:`session-${state.nextSession}`,mode,questionIds:ids,questionIndex:0,stepIndex:0,choice:null,feedback:false,complete:false};
  if(lessonId && own(lessonPractice,lessonId))session.lessonId=lessonId;
  return {...state,nextSession:state.nextSession+1,currentSession:session,seenQuestions:[...new Set([...state.seenQuestions,ids[0]])]};
}

export function choosePrep(state:SavedPrep,choice:string):SavedPrep {
  const session=state.currentSession,question=currentPrepQuestion(state);
  if(!session||!question||session.feedback||!question.steps[session.stepIndex]?.options.includes(choice))return state;
  return {...state,currentSession:{...session,choice}};
}

function emptyEvidence(session:PrepSession,question:PrepQuestion):PrepEvidence {
  return {sessionId:session.id,mode:session.mode,questionId:question.id,step:session.stepIndex,skill:question.steps[session.stepIndex].skill,
    attempts:0,firstChoice:null,firstCorrect:false,assisted:session.mode==='guided',correct:false,lastChoice:null};
}

/** Save help before an answer, including if the learner reloads immediately. */
export function markPrepHint(state:SavedPrep):SavedPrep {
  const session=state.currentSession,question=currentPrepQuestion(state);
  if(!session||!question||session.mode==='test'||session.feedback)return state;
  const key=evidenceKey(session.id,question.id,session.stepIndex),old=state.evidence[key];
  if(old?.assisted||old?.correct)return state;
  return {...state,evidence:{...state.evidence,[key]:{...(old??emptyEvidence(session,question)),assisted:true}}};
}

/** Only a persisted, available choice can be submitted. Feedback gates duplicate clicks. */
export function submitPrep(state:SavedPrep):SavedPrep {
  const session=state.currentSession,question=currentPrepQuestion(state);
  if(!session||!question||session.feedback||session.choice===null)return state;
  const step=question.steps[session.stepIndex];
  if(!step?.options.includes(session.choice))return state;
  const key=evidenceKey(session.id,question.id,session.stepIndex),old=state.evidence[key]??emptyEvidence(session,question);
  if(old.correct)return state;
  const correct=session.choice===step.answer;
  const evidence:PrepEvidence={...old,attempts:Math.min(999,old.attempts+1),firstChoice:old.attempts>0?old.firstChoice:session.choice,
    firstCorrect:old.attempts>0?old.firstCorrect:correct,correct,lastChoice:session.choice};
  return {...state,evidence:{...state.evidence,[key]:evidence},currentSession:{...session,feedback:true}};
}

export function retryPrep(state:SavedPrep):SavedPrep {
  const session=state.currentSession,evidence=currentPrepEvidence(state);
  if(!session||!session.feedback||!evidence||evidence.correct)return state;
  return {...state,currentSession:{...session,choice:null,feedback:false}};
}

export function completePrepLesson(state:SavedPrep,id:string):SavedPrep {
  if(!own(lessonPractice,id)||state.completedLessons.includes(id))return state;
  return {...state,completedLessons:[...state.completedLessons,id]};
}

/** Test/prep can move on after a miss; guided UI may instead offer a supported retry. */
export function advancePrep(state:SavedPrep):SavedPrep {
  const session=state.currentSession,question=currentPrepQuestion(state),evidence=currentPrepEvidence(state);
  if(!session||!question||!session.feedback||!evidence?.attempts)return state;
  const anotherStep=session.stepIndex+1<question.steps.length;
  const questionIndex=anotherStep?session.questionIndex:session.questionIndex+1;
  const complete=questionIndex>=session.questionIds.length;
  let next:SavedPrep={...state,currentSession:{...session,questionIndex,stepIndex:anotherStep?session.stepIndex+1:0,choice:null,feedback:false,complete},
    seenQuestions:complete?state.seenQuestions:[...new Set([...state.seenQuestions,session.questionIds[questionIndex]])]};
  if(complete&&session.mode==='guided'&&session.lessonId) {
    const allCorrect=session.questionIds.every(id=>getPrepQuestion(id)!.steps.every((_,index)=>state.evidence[evidenceKey(session.id,id,index)]?.correct));
    if(allCorrect)next=completePrepLesson(next,session.lessonId);
  }
  return next;
}

function skillRows(entries:PrepEvidence[]):PrepSkillStatus[] {
  return skills.map(skill=>{
    // Only a first encounter can supply independent evidence; fresh mistakes can still reveal a concern.
    const observations=entries.filter(e=>e.skill===skill&&e.attempts>0);
    const first=new Map<string,{entry:PrepEvidence;order:number}>();
    observations.forEach((entry,order)=>{const key=`${entry.questionId}:${entry.step}`;if(!first.has(key))first.set(key,{entry,order});});
    const distinct=[...first.values()];
    const lastConcern=observations.reduce((last,entry,order)=>!entry.firstCorrect||entry.assisted?order:last,-1);
    const independentIds=new Set(distinct.filter(row=>row.order>lastConcern&&row.entry.firstCorrect&&!row.entry.assisted).map(row=>row.entry.questionId));
    const independent=independentIds.size;
    const status=independent>=2?'ready':lastConcern>=0?'review':distinct.length?'little-more':'unseen';
    return {skill,label:prepSkillLabels[skill],status,attempted:distinct.length,independent};
  });
}

function orderedEvidence(state:SavedPrep):PrepEvidence[] {
  // Stable sort preserves within-session question order and puts restored histories in run order.
  return Object.values(state.evidence).sort((a,b)=>sessionNumber(a.sessionId)-sessionNumber(b.sessionId));
}
export function prepSkillStatus(state:SavedPrep):PrepSkillStatus[] {
  return skillRows(orderedEvidence(state));
}
export function prepScore(state:SavedPrep,sessionId=state.currentSession?.id) {
  const entries=orderedEvidence(state).filter(e=>e.sessionId===sessionId&&e.attempts>0);
  const firstCorrect=entries.filter(e=>e.firstCorrect).length;
  const session=state.currentSession;
  const total=session&&session.id===sessionId?session.questionIds.reduce((sum,id)=>sum+(getPrepQuestion(id)?.steps.length??0),0):entries.length;
  return {answered:entries.length,total,firstCorrect,percent:total?Math.round(firstCorrect/total*100):0,
    assisted:entries.filter(e=>e.assisted).length,recovered:entries.filter(e=>!e.firstCorrect&&e.correct).length,skills:skillRows(entries)};
}

/** A short, balanced school day. Rotate within skill groups rather than taking a vocabulary-only slice. */
export function mixedPrepQuestions(state:SavedPrep):PrepQuestion[] {
  const round=Math.max(0,state.nextSession-1);
  const selected:PrepQuestion[]=[];
  const hasSkill=(question:PrepQuestion,skill:PrepSkill)=>question.steps.some(step=>step.skill===skill);
  const pick=(world:PrepQuestion['world'],matches:(question:PrepQuestion)=>boolean,rotation=round)=>{
    const pool=proficiencyQuestions.filter(question=>question.world===world&&matches(question)&&!selected.some(chosen=>chosen.id===question.id));
    const question=pool[rotation%pool.length];
    if(question)selected.push(question);
    return question;
  };
  const personalSkills:PrepSkill[]=['yo','tu','el-ella','soy','eres','es'];
  const pronounSkills:PrepSkill[]=['yo','tu','el-ella','nosotros','ustedes','ellos-ellas'];
  const serSkills:PrepSkill[]=['soy','eres','es','somos','son'];
  const paired=(question:PrepQuestion)=>question.steps.length>1&&question.steps.some(step=>pronounSkills.includes(step.skill))&&question.steps.some(step=>serSkills.includes(step.skill));

  // Arrival: meet one person, then contrast two different group perspectives with WHO → PRONOUN → SER.
  pick('arrival',question=>question.steps.length===1&&personalSkills.includes(question.steps[0].skill));
  const perspective=pick('arrival',paired)?.people?.perspective;
  pick('arrival',question=>paired(question)&&question.people?.perspective!==perspective);
  // Backpack and classroom: act on objects, check a visible inventory, and apply noun agreement.
  pick('backpack',question=>hasSkill(question,'backpack'));
  pick('backpack',question=>hasSkill(question,'hay')&&!!question.inventory);
  pick('classroom',question=>hasSkill(question,'classroom'));
  pick('classroom',question=>hasSkill(question,round%2===0?'articles':'plural'),Math.floor(round/2));
  // Schedule: both the class and whether a classmate likes it. Friends: read, then describe or give origin.
  pick('schedule',question=>hasSkill(question,'subjects'));
  pick('schedule',question=>hasSkill(question,'likes'));
  pick('friends',question=>hasSkill(question,'reading')&&!!question.reading);
  pick('friends',question=>hasSkill(question,round%2===0?'adjectives':'origin'),Math.floor(round/2));
  // Finish in the band room with a use of SER or a final two-step group introduction.
  pick('band',question=>round%2===0?hasSkill(question,'ser-uses'):paired(question),Math.floor(round/2));
  return selected;
}

/** Review examples are a separate bank, served once, targeted to unresolved misses/support. */
export function reviewPrepQuestions(state:SavedPrep):PrepQuestion[] {
  const concerns=new Set(prepSkillStatus(state).filter(row=>row.status==='review').map(row=>row.skill));
  const seen=new Set([...state.seenQuestions,...Object.values(state.evidence).map(e=>e.questionId)]);
  return proficiencyReview.filter(question=>!seen.has(question.id)&&question.steps.some(step=>concerns.has(step.skill)));
}

/** Unknown free-form values are discarded. Malformed/version-incompatible saves let the UI explain recovery. */
export function parsePrep(raw:string|null):SavedPrep {
  if(!raw)return newPrep();
  const saved:unknown=JSON.parse(raw);
  if(!isObject(saved)||saved.version!==1)throw new Error('This Spanish practice save could not be read.');
  const state=newPrep();
  state.english=saved.english!==false;
  if(Array.isArray(saved.completedLessons))state.completedLessons=[...new Set(saved.completedLessons.filter((id):id is string=>typeof id==='string'&&own(lessonPractice,id)))];
  if(Array.isArray(saved.seenQuestions))state.seenQuestions=[...new Set(saved.seenQuestions.filter((id):id is string=>typeof id==='string'&&questionMap.has(id)))];
  if(isObject(saved.evidence))for(const [key,value] of Object.entries(saved.evidence)) {
    if(!isObject(value)||!validSessionId(value.sessionId)||typeof value.mode!=='string'||!modes.includes(value.mode as PrepMode)||typeof value.questionId!=='string'||!Number.isSafeInteger(value.step)||typeof value.step!=='number')continue;
    const question=getPrepQuestion(value.questionId),step=question?.steps[value.step];
    if(!step||key!==evidenceKey(value.sessionId,value.questionId,value.step)||value.skill!==step.skill)continue;
    if(typeof value.attempts!=='number'||!Number.isSafeInteger(value.attempts)||value.attempts<0||value.attempts>999)continue;
    const attempts=value.attempts;
    if(attempts===0 && (value.firstChoice!==null||value.lastChoice!==null||value.assisted!==true))continue;
    if(attempts>0 && (typeof value.firstChoice!=='string'||typeof value.lastChoice!=='string'||!step.options.includes(value.firstChoice)||!step.options.includes(value.lastChoice)))continue;
    const firstChoice=attempts>0?value.firstChoice as string:null,lastChoice=attempts>0?value.lastChoice as string:null;
    // Derive correctness from validated choices, rather than trusting saved score booleans.
    if(attempts===1&&firstChoice!==lastChoice)continue;
    state.evidence[key]={sessionId:value.sessionId,mode:value.mode as PrepMode,questionId:value.questionId,step:value.step,skill:step.skill,attempts,firstChoice,
      firstCorrect:attempts>0&&firstChoice===step.answer,assisted:value.mode==='guided'||value.assisted===true,correct:attempts>0&&lastChoice===step.answer,lastChoice};
    state.nextSession=Math.max(state.nextSession,sessionNumber(value.sessionId)+1);
  }
  const candidate=saved.currentSession;
  if(isObject(candidate)&&validSessionId(candidate.id)&&typeof candidate.mode==='string'&&modes.includes(candidate.mode as PrepMode)&&Array.isArray(candidate.questionIds)) {
    // A changed/deleted content ID invalidates this run instead of silently changing its score denominator.
    const ids=candidate.questionIds;
    const validIds=ids.length>0&&ids.length<=allQuestions.length&&ids.every((id):id is string=>typeof id==='string'&&questionMap.has(id))&&new Set(ids).size===ids.length;
    if(validIds&&Number.isSafeInteger(candidate.questionIndex)&&typeof candidate.questionIndex==='number'&&Number.isSafeInteger(candidate.stepIndex)&&typeof candidate.stepIndex==='number') {
      const index=candidate.questionIndex,stepIndex=candidate.stepIndex,complete=candidate.complete===true;
      const question=index>=0&&index<ids.length?getPrepQuestion(ids[index] as string):undefined;
      if((complete&&index===ids.length&&stepIndex===0)||(!complete&&question&&stepIndex>=0&&stepIndex<question.steps.length)) {
        const session:PrepSession={id:candidate.id,mode:candidate.mode as PrepMode,questionIds:ids as string[],questionIndex:index,stepIndex,choice:null,feedback:false,complete};
        if(typeof candidate.lessonId==='string'&&own(lessonPractice,candidate.lessonId))session.lessonId=candidate.lessonId;
        const current=question?state.evidence[evidenceKey(session.id,question.id,stepIndex)]:undefined;
        const step=question?.steps[stepIndex];
        if(typeof candidate.choice==='string'&&step?.options.includes(candidate.choice))session.choice=candidate.choice;
        session.feedback=!complete&&candidate.feedback===true&&!!current?.attempts;
        if(session.feedback)session.choice=current!.lastChoice;
        // A correct submitted answer always remains submitted after restoring, never resubmitted.
        if(!complete&&current?.correct){session.feedback=true;session.choice=current.lastChoice;}
        const priorStepsAnswered=session.questionIds.every((id,questionIndex)=>questionIndex>index||getPrepQuestion(id)!.steps.every((_,previousStep)=>
          (questionIndex===index&&previousStep>=stepIndex)||!!state.evidence[evidenceKey(session.id,id,previousStep)]?.attempts));
        if(priorStepsAnswered) {
          state.currentSession=session;
          state.nextSession=Math.max(state.nextSession,sessionNumber(session.id)+1);
          state.seenQuestions=[...new Set([...state.seenQuestions,...session.questionIds.slice(0,index+1)])];
        }
      }
    }
  }
  return state;
}
