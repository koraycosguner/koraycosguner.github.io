'use client';

import {useEffect, useRef, useState} from 'react';
import ProficiencyLessons, {lessonIds, lessonLabels} from './ProficiencyLessons';
import {lessonPractice, proficiencyQuestions, type PrepQuestion} from './proficiency-content';
import {PREP_KEY, newPrep, parsePrep, startPrep, currentPrepQuestion, currentPrepEvidence, getPrepQuestion, choosePrep, markPrepHint, submitPrep, retryPrep, advancePrep, prepScore, prepSkillStatus, reviewPrepQuestions, mixedPrepQuestions, type SavedPrep, type PrepMode} from './proficiency-learning';
import {Portrait, SupplyArt} from './LearningVisuals';
import {vocabulary, doctor} from './content';
import StoryGuide from './StoryGuide';
import {newStory} from './story-learning';
import {useSpanishSpeech} from './useSpanishSpeech';
import './story.css';
import './proficiency.css';

const ROOT='/quizzes/spanish/unit-2/';
const ART='/quizzes/spanish/school-day/';
const worldInfo={arrival:['La bienvenida','friends.webp'],backpack:['Mi mochila','backpack.webp'],classroom:['Mi clase','classroom-panorama.webp'],schedule:['Mis clases','classes.webp'],friends:['Mis compañeros','teamwork.webp'],band:['La sala de música','band.webp']} as const;
type Screen='home'|'lesson'|'question'|'result'|'pause';
type Entry='home'|'learn'|'prep'|'test';
const modeNames:Record<PrepMode,string>={guided:'Guided practice',prep:'Unit 2 test prep',test:'Practice proficiency test',review:'Fresh review'};

// A stable permutation prevents the answer position becoming a cue and survives reloads.
function orderedOptions(options:string[],seed:string) {
  let hash=0;for(const c of seed)hash=(Math.imul(hash,31)+c.charCodeAt(0))>>>0;
  const copy=[...options];for(let i=copy.length-1;i>0;i--){hash=(Math.imul(hash,1664525)+1013904223)>>>0;const j=hash%(i+1);[copy[i],copy[j]]=[copy[j],copy[i]]}return copy;
}

function QuestionScene({question}:{question:PrepQuestion}) {
  const people=question.people;
  return <aside className="prep-scene" aria-label="School-day scene">
    <img src={ART+worldInfo[question.world][1]} alt="" width="960" height="640"/>
    <div className="prep-scene-caption"><span className="prep-kicker">Nuestro día</span><h2>{worldInfo[question.world][0]}</h2></div>
    {people&&<div className="prep-people" aria-label="Who is speaking, listening, and being discussed">
      <div><small>Speaking</small><span><Portrait name={people.speaker}/><b>{people.speaker}</b></span></div>
      {!!people.listener?.length&&<div><small>Talking TO →</small><span>{people.listener.map(name=><span className="prep-person" key={name}><Portrait name={name}/>{name}</span>)}</span></div>}
      {!!people.about?.length&&<div className={people.about.includes(people.speaker)?'prep-in-group':''}><small>{people.about.includes(people.speaker)?'IN this group · speaker included':'Talking ABOUT'}</small><span>{people.about.map(name=><span className="prep-person" key={name}><Portrait name={name}/>{name}</span>)}</span></div>}
    </div>}
    {question.inventory&&<div className="prep-inventory" aria-label="Visible backpack contents">{question.inventory.filter(item=>item.count>0).map(item=><div key={item.id}><SupplyArt id={item.id}/><span><b>{item.count}</b> × {vocabulary.find(v=>v[0]===item.id)?.[1]??item.id}</span></div>)}{!question.inventory.some(i=>i.count>0)&&<p>La mochila está vacía. No hay útiles.</p>}</div>}
  </aside>;
}

export default function ProficiencyApp({entry='home'}:{entry?:Entry}) {
  const [saved,setSaved]=useState<SavedPrep>(newPrep);
  const [ready,setReady]=useState(false);
  const [notice,setNotice]=useState('');
  const [screen,setScreen]=useState<Screen>(entry==='learn'?'lesson':'home');
  const [lessonId,setLessonId]=useState<string>('pronouns');
  const [guide,setGuide]=useState(false);
  const [reset,setReset]=useState(false);
  const [showHint,setShowHint]=useState(false);
  const [noReview,setNoReview]=useState(false);
  const heading=useRef<HTMLHeadingElement>(null);
  const feedback=useRef<HTMLDivElement>(null);
  const resetDialog=useRef<HTMLDialogElement>(null);
  const resetTrigger=useRef<HTMLElement|null>(null);
  const audio=useSpanishSpeech();
  useEffect(()=>{
    try{const state=parsePrep(localStorage.getItem(PREP_KEY));setSaved(state);setLessonId(lessonIds.find(id=>!state.completedLessons.includes(id))??'pronouns')}
    catch{setNotice('Your saved practice could not be opened. You can still learn here and start a fresh record.')}
    setReady(true);
  },[]);
  useEffect(()=>{if(ready)try{localStorage.setItem(PREP_KEY,JSON.stringify(saved))}catch{setNotice('Saving is unavailable in this browser. You can keep learning during this visit.')}},[saved,ready]);
  const session=saved.currentSession;
  const question=currentPrepQuestion(saved);
  const evidence=currentPrepEvidence(saved);
  const step=question?.steps[session?.stepIndex??0];
  const score=prepScore(saved);
  useEffect(()=>{heading.current?.focus();setShowHint(false)},[screen,session?.questionIndex,session?.stepIndex]);
  useEffect(()=>{if(session?.feedback)feedback.current?.focus()},[session?.feedback]);
  useEffect(()=>{if(reset){resetTrigger.current=document.activeElement as HTMLElement;resetDialog.current?.showModal()}else resetTrigger.current?.focus()},[reset]);
  const statuses=prepSkillStatus(saved);
  const emptyReviewMessage=statuses.some(s=>s.status==='review')?'You have tried every fresh review example for these skills. Revisit a lesson or try another mixed round.':statuses.some(s=>s.attempted>0)?'No missed skills to review right now. Try another mixed round for more examples.':'Take a practice round first. Your next review will follow what you need.';
  const currentStatuses=(()=>{
    const rows=Object.values(saved.evidence).filter(row=>session?.questionIds.includes(row.questionId));
    return statuses.filter(s=>rows.some(r=>r.skill===s.skill));
  })();
  const discoveredUses=Object.values(saved.evidence).filter(row=>row.correct&&row.skill==='ser-uses').flatMap(row=>[row.lastChoice??'',...(getPrepQuestion(row.questionId)?.terms??[])]).filter(name=>doctor.some(use=>use[1]===name));
  const inTest=(screen==='question'||screen==='pause')&&session?.mode==='test';
  function launch(mode:PrepMode,ids:string[],lesson?:string){if(!ids.length){setNoReview(true);return}setSaved(p=>startPrep(p,mode,ids,lesson));setNoReview(false);setScreen('question')}
  function startMixed(){launch('prep',mixedPrepQuestions(saved).map(q=>q.id))}
  function next(){setSaved(advancePrep);setShowHint(false)}
  useEffect(()=>{if(screen==='question'&&session?.complete)setScreen('result')},[screen,session?.complete]);
  function openGuide(){if(inTest)return;if(screen==='question')setSaved(markPrepHint);setGuide(true)}
  const pageTitle=entry==='learn'?'Learn one small step':entry==='prep'?'Unit 2 Vocabulary & Grammar Test Prep':entry==='test'?'Practice proficiency test':'Your Spanish school day';
  const serPair=question&&question.steps.length>1&&['soy','eres','es','somos','son'].includes(question.steps[1].skill);
  const activeId=session?`${session.id}-${session.questionIndex}-${session.stepIndex}`:'none';
  return <div className="prep-shell" data-ready={ready}>
    <a className="prep-skip" href="#prep-main">Skip to activity</a>
    <header className="prep-header"><a className="prep-brand" href="/"><span>Y7</span>Yusuf’s study club</a><nav aria-label="Spanish study navigation"><a href="/quizzes/spanish/">Spanish home</a><a href={ROOT}>School-day adventure</a><button onClick={openGuide} disabled={inTest}>Field guide</button></nav><button className="prep-help-toggle" aria-pressed={saved.english} onClick={()=>setSaved(p=>({...p,english:!p.english}))}>English {saved.english?'on':'off'}</button></header>
    <main id="prep-main" aria-busy={!ready}>
      {notice&&<p className="prep-notice" role="status">{notice}</p>}
      <div className="prep-page-title"><div><p className="prep-kicker">Español 1 · Mis clases y mis compañeros</p><h1>{pageTitle}</h1></div><span className="prep-saved">Saved on this browser</span></div>
      {(screen==='home'||screen==='lesson')&&<>
        {session&&!session.complete&&<section className="prep-resume"><div><b>Your place is saved</b><p>{modeNames[session.mode]} · question {session.questionIndex+1} of {session.questionIds.length}</p></div><button className="prep-primary" onClick={()=>setScreen('question')}>Resume my session →</button></section>}
        {session?.complete&&<section className="prep-resume"><div><b>Your latest result is saved</b><p>{modeNames[session.mode]}</p></div><button onClick={()=>setScreen('result')}>View last results →</button></section>}
      </>}
      {screen==='home'&&<>
        <section className="prep-welcome"><div className="prep-welcome-copy"><span className="prep-pill">One small win at a time</span><h2 ref={heading} tabIndex={-1}>{entry==='test'?'Show what you know.':entry==='prep'?'Put the pieces together.':'First understand. Then try.'}</h2><p>{entry==='test'?'A full school day of fresh vocabulary and grammar questions. No timer; your place saves automatically.':entry==='prep'?'Help Mateo, pack your bag, find your classes, and get ready for the band room.':'Meet the same classmates as you learn, practice, and prepare for your Unit 2 test.'}</p>
          {entry==='home'?<a className="prep-primary" href={ROOT+'learn/'}>Start with a short lesson <span aria-hidden="true">→</span></a>:<button className="prep-primary" disabled={!ready} onClick={()=>entry==='test'?launch('test',proficiencyQuestions.map(q=>q.id)):startMixed()}>{entry==='test'?`Start full test · ${proficiencyQuestions.length} questions`:'Start mixed practice · 12 questions'} →</button>}
          <p className="prep-small">{entry==='test'?`${proficiencyQuestions.reduce((sum,q)=>sum+q.steps.length,0)} responses, including two-step questions. First answers determine your score.`:'Short lessons · three choices · help when you need it'}</p>
        </div><div className="prep-welcome-art"><img src={ART+'classroom-panorama.webp'} alt="A sunlit Spanish classroom with books, supplies, and colorful student artwork." width="1280" height="853"/><div className="prep-cast"><Portrait name="Mateo"/><Portrait name="Sofía"/><span>Your class is here.</span></div></div></section>
        <section className="prep-path" aria-label="Four ways to study">
          {[['01','Learn','A short explanation, then try it with help.',ROOT+'learn/'],['02','Practice in context','Continue your illustrated school-day adventure.',ROOT],['03','Unit 2 test prep','A dozen mixed questions, hints, and gentle retries.',ROOT+'test-prep/'],['04','Full practice test',`${proficiencyQuestions.length} fresh questions with a private score and skill review.`,ROOT+'proficiency/']].map(([number,title,detail,href])=><a href={href} key={number}><span>{number}</span><h3>{title}</h3><p>{detail}</p><b>Open →</b></a>)}
        </section>
        <section className="prep-review-entry"><div><h2>Practice the tricky parts</h2><p>Fresh examples focus on skills you missed or tried with help.</p></div><button disabled={!ready} onClick={()=>launch('review',reviewPrepQuestions(saved).slice(0,6).map(q=>q.id))}>Review my skills →</button>{noReview&&<p role="status">{emptyReviewMessage}</p>}</section>
        <details className="prep-details"><summary>My learning record · {saved.completedLessons.length} / {lessonIds.length} lessons practiced</summary><div className="prep-skill-grid">{statuses.map(row=><div key={row.skill}><b>{row.label}</b><span>{row.status==='ready'?'Ready':row.status==='review'?'Review this':row.status==='little-more'?'A little more practice':'Not tried yet'}</span><small>{row.independent} independent examples / {row.attempted} tried</small></div>)}</div><p>Readiness uses varied first answers without help. Finishing a supported lesson is practice, not a mastery grade.</p><a href={ROOT+'quiz/'}>Open the earlier 60-question quiz and its saved grades →</a></details>
      </>}
      {screen==='lesson'&&<>
        <div className="prep-lesson-top"><div><span className="prep-kicker">Learn → guided practice</span><h2 ref={heading} tabIndex={-1}>{lessonLabels[lessonId]}</h2></div><details className="prep-lesson-picker"><summary>Choose a lesson · {saved.completedLessons.length}/{lessonIds.length}</summary><div>{lessonIds.map((id,i)=><button key={id} onClick={()=>setLessonId(id)} aria-current={id===lessonId?'step':undefined}>{saved.completedLessons.includes(id)?'✓':String(i+1).padStart(2,'0')} {lessonLabels[id]}</button>)}</div></details></div>
        <ProficiencyLessons key={lessonId} lessonId={lessonId} onPractice={()=>launch('guided',lessonPractice[lessonId].map(q=>q.id),lessonId)}/>
      </>}
      {screen==='question'&&session&&question&&step&&<>
        <div className="prep-run-top"><button onClick={()=>setScreen('pause')}>Pause & save</button><span>{modeNames[session.mode]} · {session.questionIndex+1} / {session.questionIds.length}</span><progress value={session.questionIndex} max={session.questionIds.length} aria-label="Session progress"/></div>
        <div className="prep-play-layout"><QuestionScene question={question}/><section className="prep-question" key={activeId} data-question={question.id} data-step={session.stepIndex}>
          <span className="prep-kicker">{question.steps.length>1?`${serPair?'WHO → PRONOUN → SER':'Two connected steps'} · Step ${session.stepIndex+1} of ${question.steps.length}`:'Tu turno · your turn'}</span>
          <p className="prep-context" lang="es">{question.context}</p>
          {saved.english&&question.help&&<p className="prep-english" lang="en">{question.help}</p>}
          {question.reading&&<blockquote className="prep-reading" lang="es">{question.reading}</blockquote>}
          <h2 ref={heading} tabIndex={-1} lang="es">{step.prompt}</h2>
          <div className="prep-options" role="group" aria-label="Choose one answer">{orderedOptions(step.options,question.id+session.stepIndex).map((option,i)=><button key={option} disabled={session.feedback} aria-pressed={session.choice===option} className={session.choice===option?'selected':''} onClick={()=>setSaved(p=>choosePrep(p,option))}><span aria-hidden="true">{String.fromCharCode(65+i)}</span><b lang="es">{option}</b></button>)}</div>
          {!session.feedback&&<div className="prep-answer-tools"><button className="prep-primary" disabled={!session.choice} onClick={()=>setSaved(submitPrep)}>Check answer →</button>{session.mode!=='test'&&<button onClick={()=>{setSaved(markPrepHint);setShowHint(true)}}>A small hint</button>}<button disabled={!audio.canListen} onClick={()=>audio.listen(step.prompt)} aria-label="Listen to the question">♫ Listen</button></div>}
          {showHint&&!session.feedback&&<p className="prep-hint" role="status">{step.hint}</p>}
          {session.feedback&&<div className={`prep-feedback ${evidence?.correct?'correct':'retry'}`} role="status" ref={feedback} tabIndex={-1}>
            <b>{evidence?.correct?'¡Bien hecho!':'A useful thing to practice.'}</b><p lang="es">{step.answer}</p><p>{step.explanation}</p>
            <div>{!evidence?.correct&&session.mode!=='test'&&<button className="prep-primary" onClick={()=>{setSaved(retryPrep);setShowHint(false)}}>Try it again</button>}{(evidence?.correct||session.mode!=='guided')&&<button className={evidence?.correct||session.mode==='test'?'prep-primary':''} onClick={next}>{session.stepIndex+1<question.steps.length?(serPair?'Now choose SER':'Next part'):session.questionIndex+1===session.questionIds.length?'See my results':'Next small step'} →</button>}</div>
          </div>}
          {audio.notice&&<p className="prep-small" role="status">{audio.notice}</p>}
          {session.mode==='test'&&<p className="prep-small">Your first answer counts. Explanations appear after you answer.</p>}
        </section></div>
      </>}
      {screen==='pause'&&<section className="prep-pause"><Portrait name="Mateo" size="large"/><span className="prep-kicker">Your place is saved</span><h2 ref={heading} tabIndex={-1}>Take the break you need.</h2><p>Stretch, get some water, or come back later. You can continue from this step.</p><button className="prep-primary" onClick={()=>setScreen('question')}>Continue my session →</button><button onClick={()=>setScreen('home')}>Back to study choices</button></section>}
      {screen==='result'&&session&&<>
        <section className="prep-result"><div><span className="prep-kicker">{session.mode==='guided'?'Lesson practiced':'Your practice result'}</span><h2 ref={heading} tabIndex={-1}>{session.mode==='guided'?'One more piece makes sense.':'¡Terminaste! A school day completed.'}</h2>{session.mode!=='guided'&&<div className="prep-score"><strong>{score.percent}%</strong><span>{score.firstCorrect} / {score.total} first answers correct</span></div>}<p>{session.mode==='guided'?'You saw the pattern and practiced it with your classmates. Keep building at your pace.':`${score.assisted} responses used support. Retries help you learn and do not replace your first-answer score.`}</p><div className="prep-result-actions">{session.mode==='guided'?<button className="prep-primary" onClick={()=>{const i=lessonIds.indexOf(session.lessonId as typeof lessonIds[number]);setLessonId(lessonIds[(i+1)%lessonIds.length]);setScreen('lesson')}}>Next short lesson →</button>:<button className="prep-primary" onClick={()=>launch('review',reviewPrepQuestions(saved).slice(0,6).map(q=>q.id))}>Review with new examples →</button>}<a href={ROOT}>Join the school-day adventure</a><button onClick={()=>setScreen('home')}>Back to study choices</button></div>{noReview&&<p role="status">{emptyReviewMessage}</p>}</div><img src={ART+'band.webp'} alt="Fictional classmates celebrate together in the band room." width="960" height="640"/></section>
        {session.mode!=='guided'&&<section className="prep-results-skills" aria-label="Skill results"><h2>Your next small steps</h2><p>These labels use your saved evidence across varied questions. The score above is this session only.</p><div className="prep-skill-grid">{currentStatuses.map(row=><div key={row.skill} className={'status-'+row.status}><b>{row.label}</b><span>{row.status==='ready'?'Ready':row.status==='review'?'Review this':'A little more practice'}</span><small>{row.independent} independent examples / {row.attempted} tried</small></div>)}</div></section>}
      </>}
      <footer className="prep-footer"><span>Fictional practice scenes · progress stays in this browser</span>{!inTest&&<a href={ROOT+'guide/'}>Sources & full reference guide</a>}<button onClick={()=>setReset(true)}>Reset this prep record</button></footer>
    </main>
    {guide&&<StoryGuide progress={{...newStory(),english:saved.english}} encounteredUses={discoveredUses} close={()=>setGuide(false)}/>}
    {reset&&<dialog className="prep-reset" ref={resetDialog} aria-labelledby="prep-reset-heading" onCancel={e=>{e.preventDefault();setReset(false)}}><h2 id="prep-reset-heading">Start a new prep record?</h2><p>This resets only these lessons and proficiency sessions. Your school-day adventure, earlier quiz grades, and other subjects stay saved.</p><button onClick={()=>setReset(false)}>Keep my progress</button><button className="prep-primary" onClick={()=>{setSaved(newPrep());setScreen('home');setReset(false)}}>Reset prep record</button></dialog>}
  </div>;
}
