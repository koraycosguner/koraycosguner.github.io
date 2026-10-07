import {tutorLessons, tutorQuestions, tutorSkills, tutorWords} from './tutor-content.ts';
import type {TutorEvidence, TutorFormat, TutorGroup, TutorMode, TutorQuestion, TutorSaved, TutorTask} from './tutor-types.ts';

export const TUTOR_KEY='yusuf.spanish.tutor.v1';
export type TutorStatus='new'|'developing'|'almost'|'strong'|'ready';
export type TutorStartOptions={lessonId?:string;wordGroup?:string;skill?:string};
const questions=new Map(tutorQuestions.map(question=>[question.id,question]));
const lessons=new Map(tutorLessons.map(lesson=>[lesson.id,lesson]));
const skillMap=new Map(tutorSkills.map(skill=>[skill.id,skill]));
const modes:TutorMode[]=['guided','lesson','practice','vocabulary','listening','review','test'];
const listening=(question:TutorQuestion)=>question.format.startsWith('listen-');
const visual=(question:TutorQuestion)=>['picture-word','word-picture'].includes(question.format);
const textQuestion=(question:TutorQuestion)=>['choice','word-bank','sentence-build'].includes(question.format);
const equal=(left:string[],right:string[])=>left.length===right.length&&left.every((value,index)=>value===right[index]);
const clone=(state:TutorSaved):TutorSaved=>({...state,taught:[...state.taught],seen:[...state.seen],evidence:[...state.evidence],completedSessionIds:[...(state.completedSessionIds??[])],session:state.session?{...state.session,tasks:[...state.session.tasks],selection:[...state.session.selection],introduced:[...state.session.introduced]}:null});

export function newTutor():TutorSaved {
  return {version:1,nextSession:1,session:null,taught:[],evidence:[],seen:[],sessionsCompleted:0,completedSessionIds:[]};
}
export function currentTask(state:TutorSaved):TutorTask|undefined {
  return state.session&&!state.session.complete?state.session.tasks[state.session.index]:undefined;
}
export function currentQuestion(state:TutorSaved):TutorQuestion|undefined {
  const task=currentTask(state);return task?.kind==='question'?questions.get(task.questionId):undefined;
}
export function currentTutorEvidence(state:TutorSaved):TutorEvidence|undefined {
  const question=currentQuestion(state);return question?state.evidence.find(entry=>entry.sessionId===state.session?.id&&entry.questionId===question.id):undefined;
}

/** Readiness is an estimate from fresh independent examples since the latest concern. */
export function tutorSkillStatus(state:TutorSaved) {
  return tutorSkills.map(skill=>{
    const history=state.evidence.filter(entry=>entry.skills.includes(skill.id)&&(skill.group!=='Listening'||entry.audioPlayed&&!entry.assisted)).sort((a,b)=>a.order-b.order);
    const latestConcern=history.findLastIndex(entry=>!entry.firstCorrect||(entry.assisted&&entry.mode!=='lesson'&&entry.scaffold!==2&&entry.format!=='sentence-build'));
    const before=new Set(history.slice(0,latestConcern+1).map(entry=>entry.questionId));
    const successful=history.slice(latestConcern+1).filter(entry=>entry.firstCorrect&&!entry.assisted&&!before.has(entry.questionId));
    const independent=new Set(successful.map(entry=>entry.questionId)).size;
    const representations=new Set(successful.map(entry=>entry.format)).size;
    const possibleRepresentations=new Set(tutorQuestions.filter(question=>question.skills.includes(skill.id)&&question.format!=='sentence-build').map(question=>question.format)).size;
    const enoughRepresentations=representations>=Math.min(2,possibleRepresentations);
    const needsPractice=latestConcern>=0&&(independent<2||!enoughRepresentations);
    const status:TutorStatus=!history.length?'new':independent>=2&&enoughRepresentations?'ready':independent>=2?'strong':independent===1?'almost':'developing';
    return {id:skill.id,label:skill.label,group:skill.group,status,independent,representations,attempts:history.length,correct:history.filter(entry=>entry.firstCorrect&&!entry.assisted).length,accuracy:history.length?Math.round(history.filter(entry=>entry.firstCorrect).length/history.length*100):null,lastSession:history.at(-1)?.sessionId??0,needsPractice};
  });
}
export function reviewSkills(state:TutorSaved):string[] {
  return tutorSkillStatus(state).filter(skill=>skill.needsPractice).sort((a,b)=>b.lastSession-a.lastSession||a.independent-b.independent).map(skill=>skill.id);
}
export function tutorConfusions(state:TutorSaved) {
  const pairs=new Map<string,{from:string;to:string;skills:string[];count:number;lastSession:number}>();
  for(const entry of state.evidence.filter(entry=>!entry.firstCorrect)) {
    const question=questions.get(entry.questionId);if(!question)continue;
    const label=(ids:string[])=>ids.map(id=>question.choices.find(choice=>choice.id===id)?.label??'').join(' ');
    const from=label(entry.first),to=label(question.answer);if(!from||from===to)continue;
    const key=`${from}\u0000${to}`;const prior=pairs.get(key);
    pairs.set(key,{from,to,skills:[...new Set([...(prior?.skills??[]),...question.skills])],count:(prior?.count??0)+1,lastSession:entry.sessionId});
  }
  return [...pairs.values()].sort((a,b)=>b.lastSession-a.lastSession||b.count-a.count);
}

export function tutorScore(state:TutorSaved,sessionId=state.session?.id) {
  const evidence=state.evidence.filter(entry=>entry.sessionId===sessionId);
  const tasks=state.session&&state.session.id===sessionId?state.session.tasks.filter(task=>task.kind==='question'):[];
  const total=tasks.length||evidence.length,firstCorrect=evidence.filter(entry=>entry.firstCorrect).length;
  const groups=([...new Set(tutorSkills.map(skill=>skill.group))] as TutorGroup[]).map(group=>{
    const rows=evidence.filter(entry=>entry.skills.some(id=>skillMap.get(id)?.group===group)&&(group!=='Listening'||entry.audioPlayed&&!entry.assisted));
    const correct=rows.filter(entry=>entry.firstCorrect).length;
    const expected=tasks.filter(task=>task.kind==='question'&&questions.get(task.questionId)!.skills.some(id=>skillMap.get(id)?.group===group)).length;
    return {group,answered:rows.length,total:expected||rows.length,correct,independent:rows.filter(entry=>entry.firstCorrect&&!entry.assisted).length,percent:rows.length>=2?Math.round(correct/rows.length*100):null};
  });
  return {answered:evidence.length,total,firstCorrect,percent:evidence.length?Math.round(firstCorrect/evidence.length*100):0,assisted:evidence.filter(entry=>entry.assisted).length,groups};
}
export function sessionSummary(state:TutorSaved) {
  const score=tutorScore(state);
  return {questions:score.total,answered:score.answered,remaining:Math.max(0,score.total-score.answered),complete:state.session?.complete??false,score,reviewSkills:reviewSkills(state)};
}

function prioritizedSkills(state:TutorSaved):string[] {
  const rows=tutorSkillStatus(state);
  const priority=(row:typeof rows[number])=>row.needsPractice?0:row.status==='new'?1:row.status!=='ready'?2:state.nextSession-row.lastSession>=3?3:4;
  return rows.sort((a,b)=>priority(a)-priority(b)||(priority(a)===0?b.lastSession-a.lastSession:a.lastSession-b.lastSession)).map(row=>row.id);
}
function chooseFrom(state:TutorSaved,pool:TutorQuestion[],used:Set<string>,offset=0,preferFresh=true) {
  const available=pool.filter(question=>!used.has(question.id));
  if(!available.length)return undefined;
  const unseen=available.filter(question=>!state.seen.includes(question.id));
  const list=preferFresh&&unseen.length?unseen:available;
  // Session-based rotation supplies spaced retrieval without storing clock or personal data.
  return list[((state.nextSession-1)*3+offset)%list.length];
}
function testQuestions(state:TutorSaved):TutorQuestion[] {
  const selected:TutorQuestion[]=[],used=new Set<string>();
  const quotas:[TutorGroup,number][]=[['Pronouns',4],['SER',4],['SER + de',3],['Adjectives',3],['Vocabulary',4]];
  for(const [group,count] of quotas) {
    const pool=tutorQuestions.filter(question=>question.teacher&&textQuestion(question)&&skillMap.get(question.skills[0])?.group===group);
    for(let index=0;index<count;index++) {
      const concepts=[...new Set(pool.map(question=>question.skills[0]))];
      const concept=concepts[((state.nextSession-1)*3+index)%concepts.length];
      const question=chooseFrom(state,pool.filter(item=>item.skills.includes(concept)),used,index)??chooseFrom(state,pool,used,index);if(question){selected.push(question);used.add(question.id);}
    }
  }
  while(selected.length<18) {
    const question=chooseFrom(state,tutorQuestions.filter(question=>question.teacher&&textQuestion(question)),used,selected.length);
    if(!question)break;selected.push(question);used.add(question.id);
  }
  return selected.slice(0,18);
}
function plannedQuestions(state:TutorSaved,mode:TutorMode,options:TutorStartOptions):{question:TutorQuestion;scaffold:0|1|2}[] {
  if(mode==='test')return testQuestions(state).map(question=>({question,scaffold:0}));
  const selected:{question:TutorQuestion;scaffold:0|1|2}[]=[],used=new Set<string>();
  const statuses=tutorSkillStatus(state),weak=reviewSkills(state),priorities=prioritizedSkills(state);
  if(options.lessonId&&connectedLessons.has(options.lessonId)) {
    const sequence=tutorQuestions.filter(question=>question.lessonId===options.lessonId);
    const known=sequence.every(question=>question.skills.every(id=>statuses.find(row=>row.id===id)?.status==='ready'));
    const selected=mode==='practice'&&options.lessonId.startsWith('builder-')&&known?sequence.slice(-1):sequence;
    return selected.map(question=>({question,scaffold:(mode==='practice'&&!known?2:0) as 0|2}));
  }
  const add=(pool:TutorQuestion[],scaffold?:0|1|2,freshOnly=false)=>{
    const candidates=freshOnly?pool.filter(question=>!state.seen.includes(question.id)):pool;
    const question=chooseFrom(state,candidates,used,selected.length);if(!question)return false;
    used.add(question.id);
    const known=question.skills.every(id=>statuses.find(row=>row.id===id)?.independent);
    selected.push({question,scaffold:scaffold??(known?0:1)});return true;
  };
  const linked=(skill:string)=>tutorQuestions.filter(question=>question.skills.includes(skill));
  if(mode==='review') {
    // Fresh IDs keep the review from rewarding memorization of a missed item.
    const targets=options.skill&&weak.includes(options.skill)?[options.skill]:weak;
    for(let round=0;round<3&&selected.length<6;round++)for(const skill of targets){if(selected.length>=6)break;add(linked(skill),round===0?1:0,true);}
  } else if(mode==='lesson') {
    const lesson=lessons.get(options.lessonId??'');
    const pool=tutorQuestions.filter(question=>question.lessonId===lesson?.id&&!listening(question));
    for(let i=0;i<Math.min(4,pool.length);i++)add(pool,i<2?2:0);
  } else if(mode==='listening') {
    const pool=tutorQuestions.filter(question=>listening(question));
    const formats:TutorFormat[]=['listen-picture','listen-word','listen-sentence','listen-fill','listen-contrast'];
    for(const format of formats)add(pool.filter(question=>question.format===format));
    while(selected.length<6&&add(pool)){ /* Selection occurs in add. */ }
  } else if(mode==='vocabulary') {
    const wordIds=new Set(tutorWords.filter(word=>!options.wordGroup||word.group===options.wordGroup).map(word=>word.id));
    const pool=tutorQuestions.filter(question=>question.vocabulary?.some(id=>wordIds.has(id))||question.skills.some(id=>id.startsWith('word:')&&wordIds.has(id.slice(5))));
    const ready=new Set(statuses.filter(row=>['strong','ready'].includes(row.status)).map(row=>row.id));
    // Strong words transfer into sentence/listening use rather than another labelled picture.
    const preferred=pool.filter(question=>!question.skills.some(id=>ready.has(id))||!visual(question));
    for(let index=0;index<8;index++)if(!add(preferred))break;
  } else if(mode==='practice'&&(options.skill||options.lessonId)) {
    const pool=tutorQuestions.filter(question=>options.skill?question.skills.includes(options.skill):question.lessonId===options.lessonId);
    while(selected.length<8&&add(pool)){ /* Selection occurs in add. */ }
  } else {
    const primary=options.skill??priorities.find(id=>skillMap.get(id)?.group!=='Listening'&&skillMap.get(id)?.group!=='Vocabulary');
    const primaryPool=primary?linked(primary).filter(question=>!listening(question)):[];
    const primaryKnown=primary&&statuses.find(row=>row.id===primary)?.independent;
    add(primaryPool,primaryKnown?0:2);add(primaryPool,primaryKnown?0:2);
    const coreWords=['libro','computadora','materia','curso','horario','prueba','examen','almuerzo'];
    const focusWord=coreWords.find(word=>statuses.find(row=>row.id===`word:${word}`)?.needsPractice)??coreWords.find(word=>statuses.find(row=>row.id===`word:${word}`)?.status==='new');
    const vocabulary=tutorQuestions.filter(question=>visual(question)&&(!focusWord||question.vocabulary?.includes(focusWord)||question.skills.includes(`word:${focusWord}`)));
    add(vocabulary);
    // Revisit the same newly seen word through sound when a matching activity exists.
    const word=selected.at(-1)?.question.vocabulary?.[0];
    const audioPool=tutorQuestions.filter(question=>listening(question));
    if(!add(audioPool.filter(question=>word&&question.vocabulary?.includes(word))))add(audioPool);
    const retrieval=statuses.filter(row=>row.independent>0&&state.nextSession-row.lastSession>=2).sort((a,b)=>a.lastSession-b.lastSession);
    for(let index=0;index<2;index++) {
      const skill=retrieval[index]?.id??priorities[(index+1)%priorities.length];
      if(!add(linked(skill),0))add(tutorQuestions.filter(question=>textQuestion(question)),0);
    }
    add(tutorQuestions.filter(question=>question.teacher&&textQuestion(question)&&question.skills.some(skill=>skill===primary)),0);
    add(weak.length?linked(weak[0]):primaryPool,0,true);
    while(selected.length<8&&add(tutorQuestions)){ /* Selection occurs in add. */ }
  }
  return selected;
}
function enter(state:TutorSaved):TutorSaved {
  const session=state.session;if(!session)return state;
  if(session.index>=session.tasks.length) {
    session.complete=true;
    const completed=new Set(state.completedSessionIds??[]);completed.add(session.id);
    state.completedSessionIds=[...completed];state.sessionsCompleted=completed.size;
  } else {
    const task=session.tasks[session.index];
    if(task.kind==='question'&&!state.seen.includes(task.questionId))state.seen.push(task.questionId);
  }
  return state;
}
const connectedLessons=new Set(['school-day-story','builder-ser','builder-adjectives','builder-de']);
const normalize=(text:string)=>text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function teachingFrames(skillId:string):{lessonId:string;frame:number}[] {
  const skill=skillMap.get(skillId),lesson=skill&&lessons.get(skill.lessonId);if(!skill||!lesson)return [];
  let frames:number[]=[];
  if(skillId.startsWith('word:'))frames=[lesson.frames.findIndex(frame=>frame.visual===skillId.slice(5))];
  else if(skillId.startsWith('pronoun:')||skillId.startsWith('ser:')) {
    const token=skillId.split(':')[1];frames=[lesson.frames.findIndex(frame=>frame.chain?.some(part=>normalize(part).split(/\s*\/\s*/).includes(token)))];
  } else {
    const map:Record<string,number[]>={'perspective:in':[0],'perspective:female':[1],'perspective:mixed':[2],'perspective:to-about':[0,1],'perspective:formal':[0],'perspective:spain':[0],origin:[0],possession:[0,1],'adjective:gender':[0],'adjective:number':[1,3],articles:[0,1],plural:[2],hay:[3,4],'listening:word':[0],'listening:sentence':[1]};
    frames=map[skillId]??[0];
  }
  return frames.filter(frame=>frame>=0&&frame<lesson.frames.length).map(frame=>({lessonId:lesson.id,frame}));
}
export function startTutor(state:TutorSaved,mode:TutorMode,options:TutorStartOptions={}):TutorSaved {
  if(!modes.includes(mode)||options.lessonId&&!lessons.has(options.lessonId)||options.skill&&!skillMap.has(options.skill)||options.wordGroup&&!tutorWords.some(word=>word.group===options.wordGroup))return state;
  const planned=plannedQuestions(state,mode,options),tasks:TutorTask[]=[],introduced=new Set(state.taught),framesQueued=new Set<string>();
  const teachFrame=(lessonId:string,frame:number)=>{const key=`${lessonId}:${frame}`;if(!framesQueued.has(key)){tasks.push({kind:'teach',lessonId,frame});framesQueued.add(key);}};
  if(mode==='lesson'&&options.lessonId&&!connectedLessons.has(options.lessonId)) {
    const lesson=lessons.get(options.lessonId)!;
    lesson.frames.forEach((_,frame)=>teachFrame(lesson.id,frame));lesson.skills.forEach(skill=>introduced.add(skill));
  }
  for(const [index,entry] of planned.entries()) {
    if(options.lessonId&&connectedLessons.has(options.lessonId)) {
      const lesson=lessons.get(options.lessonId)!;
      // Keep each short school scene or reasoning stage together with its question.
      const frame=tutorQuestions.filter(question=>question.lessonId===options.lessonId).findIndex(question=>question.id===entry.question.id);
      if(frame>=0&&frame<lesson.frames.length&&(mode==='lesson'||planned.length>1))teachFrame(lesson.id,frame);
      tasks.push({kind:'question',questionId:entry.question.id,scaffold:entry.scaffold});
      if(index===4&&planned.length>5)tasks.push({kind:'checkpoint'});
      continue;
    }
    if(mode!=='test') {
      // A relevant tiny frame introduces the exact concept, never an entire vocabulary deck.
      for(const skill of entry.question.skills)if(!introduced.has(skill)||mode==='review'&&index===0) {
        const primary=entry.question.skills[0];
        // A pronoun's own scene already establishes its IN/TO/ABOUT perspective.
        const redundant=skill.startsWith('perspective:')&&primary.startsWith('pronoun:');
        if(!redundant)teachingFrames(skill).forEach(({lessonId,frame})=>teachFrame(lessonId,frame));
        introduced.add(skill);
      }
      // Origin combines earlier pronoun and SER concepts. Teach its actual subject pattern first.
      if(entry.question.skills.includes('origin')) {
        for(const token of [...(entry.question.chain??[]),...entry.question.model.replace(/[.,¿?¡!]/g,'').split(/\s+/)]) {
          const pronoun=`pronoun:${normalize(token)}`,verb=`ser:${normalize(token)}`;
          for(const prerequisite of [pronoun,verb])if(skillMap.has(prerequisite)&&!introduced.has(prerequisite)) {
            teachingFrames(prerequisite).forEach(({lessonId,frame})=>teachFrame(lessonId,frame));introduced.add(prerequisite);
          }
        }
      }
      if(entry.question.skills.includes('adjective:number')&&/fácil|difícil/.test(entry.question.prompt)&&!introduced.has('adjectives'))teachFrame('adjectives',4);
    }
    tasks.push({kind:'question',questionId:entry.question.id,scaffold:entry.scaffold});
    if(mode!=='test'&&index===4&&planned.length>5)tasks.push({kind:'checkpoint'});
  }
  const next=clone(state);
  next.session={id:state.nextSession,mode,tasks,index:0,selection:[],feedback:false,hintLevel:0,complete:false,assisted:false,audioPlayed:false,introduced:[],remediations:0};
  next.nextSession=state.nextSession+1;
  // Empty review is an honest empty state, not a completed learning session.
  if(!tasks.length){next.session.complete=true;return next;}
  return enter(next);
}
export function chooseTutor(state:TutorSaved,id:string):TutorSaved {
  const question=currentQuestion(state),session=state.session;
  if(!question||!session||session.feedback||!question.choices.some(choice=>choice.id===id))return state;
  const next=clone(state),selection=next.session!.selection;
  if(question.format==='sentence-build') {
    if(selection.includes(id)||selection.length>=question.answer.length)return state;
    selection.push(id);
  } else next.session!.selection=[id];
  return next;
}
export function removeTutorChoice(state:TutorSaved,index:number):TutorSaved {
  const session=state.session;if(!currentQuestion(state)||!session||session.feedback||!Number.isInteger(index)||index<0||index>=session.selection.length)return state;
  const next=clone(state);next.session!.selection.splice(index,1);return next;
}
export function hintTutor(state:TutorSaved):TutorSaved {
  const question=currentQuestion(state),session=state.session;
  if(!question||!session||session.mode==='test'||session.feedback||session.hintLevel>=question.hints.length)return state;
  const next=clone(state);next.session!.hintLevel++;next.session!.assisted=true;return next;
}
export function markTutorSupport(state:TutorSaved):TutorSaved {
  if(!currentQuestion(state)||!state.session||state.session.mode==='test'||state.session.feedback||state.session.assisted)return state;
  const next=clone(state);next.session!.assisted=true;return next;
}
export function markTutorAudio(state:TutorSaved):TutorSaved {
  if(!currentQuestion(state)||!state.session||state.session.mode==='test'||state.session.audioPlayed)return state;
  const next=clone(state);next.session!.audioPlayed=true;return next;
}
function moveNext(state:TutorSaved):TutorSaved {
  const session=state.session!;session.index++;session.selection=[];session.feedback=false;session.hintLevel=0;session.assisted=false;session.audioPlayed=false;return enter(state);
}
export function submitTutor(state:TutorSaved):TutorSaved {
  const question=currentQuestion(state),session=state.session,task=currentTask(state);
  if(!question||!session||task?.kind!=='question'||session.feedback||session.selection.length!==question.answer.length||currentTutorEvidence(state))return state;
  // Listening cannot receive independent credit without confirmed playback.
  const assisted=session.assisted||session.hintLevel>0||task.scaffold===2||session.mode==='lesson'||question.format==='sentence-build'||listening(question)&&!session.audioPlayed;
  const correct=equal(session.selection,question.answer),next=clone(state);
  next.evidence.push({sessionId:session.id,questionId:question.id,skills:[...question.skills],first:[...session.selection],last:[...session.selection],correct,firstCorrect:correct,assisted,attempts:1,order:Math.max(0,...state.evidence.map(entry=>entry.order))+1,format:question.format,mode:session.mode,scaffold:task.scaffold,audioPlayed:session.audioPlayed,hintLevel:session.hintLevel});
  if(session.mode==='test')return moveNext(next);
  next.session!.feedback=true;return next;
}
function freshParallel(state:TutorSaved,question:TutorQuestion) {
  const queued=new Set(state.session?.tasks.filter(task=>task.kind==='question').map(task=>task.questionId));
  const pool=tutorQuestions.filter(candidate=>candidate.id!==question.id&&!state.seen.includes(candidate.id));
  const key=(item:TutorQuestion)=>item.answer.map(id=>item.choices.find(choice=>choice.id===id)?.label).join(' ');
  const group=pool.filter(candidate=>candidate.parallelGroup===question.parallelGroup);
  const closest=group.filter(candidate=>candidate.format===question.format&&key(candidate)===key(question));
  const sameAnswer=group.filter(candidate=>key(candidate)===key(question));
  const sameFormat=group.filter(candidate=>candidate.format===question.format);
  const exact=closest.length?closest:sameAnswer.length?sameAnswer:sameFormat.length?sameFormat:group;
  const related=pool.filter(candidate=>candidate.skills.some(skill=>question.skills.includes(skill))&&candidate.lessonId===question.lessonId);
  return chooseFrom(state,exact.filter(candidate=>!queued.has(candidate.id)),new Set())??chooseFrom(state,exact,new Set())??chooseFrom(state,related.filter(candidate=>!queued.has(candidate.id)),new Set());
}
export function canTutorRemediate(state:TutorSaved):boolean {
  const question=currentQuestion(state),entry=currentTutorEvidence(state);
  return !!(question&&entry&&!entry.firstCorrect&&state.session?.mode!=='test'&&state.session&&state.session.remediations<3&&freshParallel(state,question));
}
export function advanceTutor(state:TutorSaved):TutorSaved {
  const session=state.session,task=currentTask(state);if(!session||!task)return state;
  if(task.kind==='question'&&!session.feedback)return state;
  const next=clone(state);
  if(task.kind==='teach') {
    const completed=next.session!.tasks.slice(0,session.index+1).filter(item=>item.kind==='teach');
    const hasFrame=(lessonId:string,frame:number)=>completed.some(item=>item.kind==='teach'&&item.lessonId===lessonId&&item.frame===frame);
    const mark=(id:string)=>{if(!next.taught.includes(id))next.taught.push(id);if(!next.session!.introduced.includes(id))next.session!.introduced.push(id);};
    for(const skill of tutorSkills) {
      const required=teachingFrames(skill.id);
      if(required.length&&required.every(frame=>hasFrame(frame.lessonId,frame.frame)))mark(skill.id);
    }
    const lesson=lessons.get(task.lessonId)!;
    if(connectedLessons.has(task.lessonId))tutorQuestions.filter(question=>question.lessonId===task.lessonId)[task.frame]?.skills.forEach(mark);
    if(lesson.frames.every((_,frame)=>hasFrame(lesson.id,frame)))mark(lesson.id);
  } else if(task.kind==='question') {
    const evidence=currentTutorEvidence(state),question=currentQuestion(state)!;
    if(evidence&&!evidence.firstCorrect&&session.remediations<3) {
      const parallel=freshParallel(state,question);
      if(parallel){
        const future=next.session!.tasks.findIndex((item,index)=>index>session.index&&item.kind==='question'&&item.questionId===parallel.id);
        if(future>=0)next.session!.tasks.splice(future,1);
        const preparation:TutorTask[]=[],prepared=new Set<string>();
        const prepare=(skill:string)=>{if(state.taught.includes(skill))return;for(const frame of teachingFrames(skill)){const key=`${frame.lessonId}:${frame.frame}`;if(!prepared.has(key)){preparation.push({kind:'teach',...frame});prepared.add(key);}}};
        for(const skill of parallel.skills)if(!skill.startsWith('perspective:')||!parallel.skills[0].startsWith('pronoun:'))prepare(skill);
        if(parallel.skills.includes('origin'))for(const token of [...(parallel.chain??[]),...parallel.model.replace(/[.,¿?¡!]/g,'').split(/\s+/)]){prepare(`pronoun:${normalize(token)}`);prepare(`ser:${normalize(token)}`);}
        next.session!.tasks.splice(session.index+1,0,...preparation,{kind:'question',questionId:parallel.id,scaffold:1,parallel:true});next.session!.remediations++;
      }
    }
  }
  return moveNext(next);
}

function record(value:unknown):value is Record<string,unknown> {return !!value&&typeof value==='object'&&!Array.isArray(value);}
function positive(value:unknown):value is number {return typeof value==='number'&&Number.isSafeInteger(value)&&value>0;}
function validSelection(value:unknown,question:TutorQuestion,complete=false):value is string[] {
  return Array.isArray(value)&&value.length<=(question.format==='sentence-build'?question.answer.length:1)&&(!complete||value.length===question.answer.length)&&new Set(value).size===value.length&&value.every(id=>typeof id==='string'&&question.choices.some(choice=>choice.id===id));
}
/** Persistence accepts only bank-backed IDs and re-derives all scores from selected answers. */
export function parseTutor(raw:string|null|undefined):TutorSaved {
  if(!raw)return newTutor();
  const value:unknown=JSON.parse(raw);
  if(!record(value)||value.version!==1)throw new Error('Unrecognized study save');
  const state=newTutor();
  const knownList=(list:unknown,known:Map<string,unknown>)=>Array.isArray(list)?[...new Set(list.filter((id):id is string=>typeof id==='string'&&known.has(id)))]:[];
  const taughtIds=new Map<string,unknown>([...lessons,...skillMap]);
  state.taught=knownList(value.taught,taughtIds);state.seen=knownList(value.seen,questions);
  const keys=new Set<string>();
  if(Array.isArray(value.evidence))for(const candidate of value.evidence.slice(-10000)) {
    if(!record(candidate)||!positive(candidate.sessionId)||!positive(candidate.order)||candidate.attempts!==1||typeof candidate.questionId!=='string')continue;
    const question=questions.get(candidate.questionId),key=`${candidate.sessionId}:${candidate.questionId}`;
    if(!question||keys.has(key)||!validSelection(candidate.first,question,true)||!validSelection(candidate.last,question,true)||!equal(candidate.first,candidate.last))continue;
    const mode=modes.includes(candidate.mode as TutorMode)?candidate.mode as TutorMode:undefined;
    const scaffold=[0,1,2].includes(candidate.scaffold as number)?candidate.scaffold as 0|1|2:undefined;
    const hintLevel=typeof candidate.hintLevel==='number'&&Number.isInteger(candidate.hintLevel)?Math.max(0,Math.min(question.hints.length,candidate.hintLevel)):0;
    const audioPlayed=candidate.audioPlayed===true;
    const assisted=candidate.assisted===true||!mode||scaffold===undefined||scaffold===2||mode==='lesson'||question.format==='sentence-build'||hintLevel>0||listening(question)&&!audioPlayed;
    const correct=equal(candidate.first,question.answer);
    state.evidence.push({sessionId:candidate.sessionId,questionId:question.id,skills:[...question.skills],first:[...candidate.first],last:[...candidate.last],correct,firstCorrect:correct,assisted,attempts:1,order:candidate.order,format:question.format,mode,scaffold,audioPlayed,hintLevel});keys.add(key);
  }
  state.evidence.sort((a,b)=>a.order-b.order);
  // Normalize order: impossible saved timestamps cannot move an error into the past.
  state.evidence=state.evidence.map((entry,index)=>({...entry,order:index+1}));
  const saved=value.session;
  if(record(saved)&&positive(saved.id)&&modes.includes(saved.mode as TutorMode)&&Array.isArray(saved.tasks)&&saved.tasks.length<=100&&Number.isInteger(saved.index)&&Number(saved.index)>=0&&Number(saved.index)<=saved.tasks.length) {
    const tasks:TutorTask[]=[],questionIds=new Set<string>();let valid=true;
    for(const rawTask of saved.tasks) {
      if(!record(rawTask)){valid=false;break;}
      if(rawTask.kind==='question'&&typeof rawTask.questionId==='string'&&questions.has(rawTask.questionId)&&!questionIds.has(rawTask.questionId)&&[0,1,2].includes(Number(rawTask.scaffold))) {
        if(saved.mode==='test'&&(!questions.get(rawTask.questionId)!.teacher||!textQuestion(questions.get(rawTask.questionId)!))){valid=false;break;}
        tasks.push({kind:'question',questionId:rawTask.questionId,scaffold:saved.mode==='test'?0:Number(rawTask.scaffold) as 0|1|2,...(rawTask.parallel===true?{parallel:true}:{})});questionIds.add(rawTask.questionId);
      } else if(rawTask.kind==='teach'&&saved.mode!=='test'&&typeof rawTask.lessonId==='string'&&lessons.has(rawTask.lessonId)&&Number.isInteger(rawTask.frame)&&Number(rawTask.frame)>=0&&Number(rawTask.frame)<lessons.get(rawTask.lessonId)!.frames.length)tasks.push({kind:'teach',lessonId:rawTask.lessonId,frame:Number(rawTask.frame)});
      else if(rawTask.kind==='checkpoint'&&saved.mode!=='test')tasks.push({kind:'checkpoint'});
      else {valid=false;break;}
    }
    if(saved.mode==='test'&&tasks.length!==18||tasks.filter(task=>task.kind==='question'&&task.parallel).length>3)valid=false;
    if(valid) {
      let index=Number(saved.index);
      const evidenceById=new Map(state.evidence.filter(entry=>entry.sessionId===saved.id).map(entry=>[entry.questionId,entry]));
      const missing=tasks.findIndex((task,at)=>at<index&&task.kind==='question'&&!evidenceById.has(task.questionId));
      if(missing!==-1)index=missing;
      const task=tasks[index],question=task?.kind==='question'?questions.get(task.questionId):undefined;
      const entry=question?evidenceById.get(question.id):undefined;
      const hintLevel=question&&Number.isInteger(saved.hintLevel)?Math.max(0,Math.min(question.hints.length,Number(saved.hintLevel))):0;
      state.session={id:saved.id,mode:saved.mode as TutorMode,tasks,index,selection:question&&validSelection(saved.selection,question)?[...saved.selection]:[],feedback:saved.mode!=='test'&&!!entry,hintLevel:saved.mode==='test'?0:hintLevel,complete:index===tasks.length,assisted:saved.mode!=='test'&&(saved.assisted===true||hintLevel>0),audioPlayed:saved.audioPlayed===true,introduced:knownList(saved.introduced,taughtIds),remediations:tasks.filter(task=>task.kind==='question'&&task.parallel).length};
      const allowed=new Set(tasks.slice(0,index+1).filter(task=>task.kind==='question').map(task=>task.questionId));
      state.evidence=state.evidence.filter(evidence=>evidence.sessionId!==saved.id||allowed.has(evidence.questionId)).map(evidence=>{
        if(evidence.sessionId!==saved.id)return evidence;
        const source=tasks.find(task=>task.kind==='question'&&task.questionId===evidence.questionId);
        const scaffold=source?.kind==='question'?source.scaffold:0;
        return {...evidence,mode:state.session!.mode,scaffold,assisted:evidence.assisted||scaffold===2||saved.mode==='lesson'};
      });
      if(entry)state.session.selection=[...entry.first];
      if(saved.mode==='test'&&entry)moveNext(state);
    }
  }
  const maxSession=Math.max(0,...state.evidence.map(entry=>entry.sessionId),state.session?.id??0);
  state.nextSession=Math.max(maxSession+1,positive(value.nextSession)?value.nextSession:1);
  state.completedSessionIds=Array.isArray(value.completedSessionIds)?[...new Set(value.completedSessionIds.filter((id):id is number=>positive(id)&&id<state.nextSession&&state.evidence.some(entry=>entry.sessionId===id)))]:[];
  if(state.session?.complete&&state.session.tasks.length&&!state.completedSessionIds.includes(state.session.id))state.completedSessionIds.push(state.session.id);
  state.sessionsCompleted=state.completedSessionIds.length;
  if(state.session&&!state.session.complete){const task=state.session.tasks[state.session.index];if(task?.kind==='question'&&!state.seen.includes(task.questionId))state.seen.push(task.questionId);}
  return state;
}
