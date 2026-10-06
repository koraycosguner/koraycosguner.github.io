'use client';
import {useEffect,useRef,useState} from 'react';
import {studyLessons,storyQuestions,studyGuideQuestions,testQuestions,studyHelp} from './study-content';
import type {StudyQuestion} from './study-types';
import {STUDY_KEY,emptyStudy,parseStudy,startStudy,chooseStudy,helpStudy,checkStudy,retryStudy,advanceStudy,studyScore,answerKey,studyOptions,type StudySaved,type StudyMode} from './study-learning';
import CompleteStory from './CompleteStory';
import './study.css';
const ROOT='/quizzes/spanish/unit-2/';
const allQuestions=[...studyLessons.flatMap(l=>l.questions),...storyQuestions,...studyGuideQuestions,...testQuestions];
const names:Record<StudyMode,string>={story:'Story practice',test:'Unit 2 Practice Test',guide:"Sra. Abarca’s Study Guide Review",lesson:'Learn'};
export type StudyEntry='home'|'learn'|'story'|'complete'|'test'|'guide';
type Screen='intro'|'lesson'|'question'|'result';
function ModeIcon({mode}:{mode:number}){
  return <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{mode===1?<><path d="M24 13c-5-4-12-4-18-2v25c6-2 13-2 18 2 5-4 12-4 18-2V11c-6-2-13-2-18 2Z"/><path d="M24 13v25M11 17c3-1 6 0 8 1M11 23c3-1 6 0 8 1M30 18l6-1M30 24l6-1"/></>:mode===2?<><path d="M7 9h28v21H21l-9 7v-7H7Z"/><path d="M35 17h7v24l-9-6h-8M14 17h14M14 23h9"/></>:mode===3?<><path d="M8 11h32M8 24h11M31 24h9M8 37h32"/><rect x="19" y="18" width="12" height="12" rx="3"/><path d="m22 24 2 2 4-5"/></>:<><rect x="10" y="8" width="28" height="34" rx="3"/><rect x="18" y="5" width="12" height="7" rx="2"/><path d="m16 22 3 3 5-6M28 22h4m-16 12 3 3 5-6M28 34h4"/></>}</svg>;
}
export default function Unit2StudyApp({entry='home'}:{entry?:StudyEntry}){
  const [saved,setSaved]=useState<StudySaved>(emptyStudy),[ready,setReady]=useState(false),[notice,setNotice]=useState('');
  const [screen,setScreen]=useState<Screen>(entry==='learn'?'lesson':'intro');
  const [lessonId,setLessonId]=useState(studyLessons[0].id),[exampleIndex,setExampleIndex]=useState(0),[help,setHelp]=useState(false);
  const [pending,setPending]=useState<{mode:StudyMode;questions:StudyQuestion[];lessonId?:string}|null>(null);
  const dialog=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLElement|null>(null),title=useRef<HTMLHeadingElement>(null),feedback=useRef<HTMLDivElement>(null);
  useEffect(()=>{try{const parsed=parseStudy(localStorage.getItem(STUDY_KEY),allQuestions,studyLessons.map(l=>l.id));setSaved(parsed);setLessonId(studyLessons.find(l=>!parsed.lessons.includes(l.id))?.id??studyLessons[0].id)}catch{setNotice('Saving is unavailable. You can still practice during this visit.')}setReady(true)},[]);
  useEffect(()=>{if(ready)try{localStorage.setItem(STUDY_KEY,JSON.stringify(saved))}catch{setNotice('Saving is unavailable. You can still practice during this visit.')}},[ready,saved]);
  const s=saved.session,q=s&&!s.complete?allQuestions.find(x=>x.id===s.ids[s.index]):null,step=q?.steps[s?.step??0];
  const lesson=studyLessons.find(l=>l.id===lessonId)!;
  useEffect(()=>{title.current?.focus();setHelp(false)},[screen,s?.index,s?.step,lessonId,exampleIndex]);
  useEffect(()=>{if(s?.feedback&&screen==='question')feedback.current?.focus()},[s?.feedback,screen]);
  useEffect(()=>{if(pending){trigger.current=document.activeElement as HTMLElement;dialog.current?.showModal()}else trigger.current?.focus()},[pending]);
  function begin(mode:StudyMode,questions:StudyQuestion[],id?:string){setSaved(old=>startStudy(old,mode,questions,id));setScreen('question');setHelp(false)}
  function requestStart(mode:StudyMode,questions:StudyQuestion[],id?:string){if(s&&!s.complete&&Object.keys(s.answers).length>0)setPending({mode,questions,lessonId:id});else begin(mode,questions,id)}
  function next(){if(!q)return;const nextState=advanceStudy(saved,q);setSaved(nextState);if(nextState.session?.complete)setScreen('result')}
  const currentTitle=screen==='question'||screen==='result'?names[s?.mode??'story']:screen==='lesson'?'Learn':entry==='story'?'Story practice':entry==='complete'?'Complete the Story':entry==='test'?'Unit 2 Practice Test':entry==='guide'?names.guide:'Your Unit 2 study guide';
  const score=s?studyScore(s,allQuestions):null;
  const entryMode=entry==='story'?'story':entry==='test'?'test':'guide';
  const entryQuestions=entry==='story'?storyQuestions:entry==='test'?testQuestions:studyGuideQuestions;
  return <div className="u2-shell" data-ready={ready}>
    <a className="u2-skip" href="#study-main">Skip to activity</a>
    <header className="u2-header"><a href="/" className="u2-brand"><span>Y</span>Yusuf’s study club</a><a href="/quizzes/spanish/">Spanish home <span aria-hidden="true">↗</span></a></header>
    <main id="study-main" className={entry==='home'&&screen==='intro'?'u2-main u2-home':'u2-main'} aria-busy={!ready}>
      {notice&&<p className="u2-notice" role="status">{notice}</p>}
      <div className="u2-title"><p className="u2-eyebrow">Español 1 <span>•</span> Unit 2</p><h1>{currentTitle}</h1>{entry==='home'&&screen==='intro'&&<p className="u2-lede">A little practice. One step at a time.</p>}</div>
      {(screen==='intro'||screen==='lesson')&&entry!=='complete'&&s&&<div className="u2-resume"><button className="u2-text-button" disabled={!ready} onClick={()=>setScreen(s.complete?'result':'question')}>{s.complete?'View last result':'Continue where I left off'} <span aria-hidden="true">→</span></button>{!s.complete&&<span>{names[s.mode]} · {s.index+1} of {s.ids.length}</span>}</div>}
      {entry==='home'&&screen==='intro'&&<>
        <div className="u2-modes">{[
          ['Learn','A quick example. Then give it a try.','study/'],
          ['Story Practice','Spend a school day with Yusuf and friends.','story-practice/'],
          ['Complete the Story','Fill the blanks with a small word bank.','complete-story/'],
          ['Unit 2 Practice Test','Put vocabulary and grammar together.','practice-test/'],
        ].map(([label,description,path],i)=><a key={path} className={`u2-mode u2-mode-${i+1}`} href={ROOT+path}><span className="u2-mode-icon"><ModeIcon mode={i+1}/></span><span><small>0{i+1}</small><h2>{label}</h2><p>{description}</p></span><span className="u2-arrow" aria-hidden="true">↗</span></a>)}</div>
        <p className="u2-footnote">Mis clases y mis compañeros <span>·</span> No timer. Help when you need it.</p>
      </>}
      {entry==='complete'&&screen==='intro'&&<CompleteStory/>}
      {screen==='lesson'&&<>
        <div className="u2-lesson-tools"><details className="u2-topic-picker"><summary>Choose a topic</summary><div>{studyLessons.map(l=><button key={l.id} aria-current={l.id===lessonId?'step':undefined} onClick={e=>{setLessonId(l.id);setExampleIndex(0);e.currentTarget.closest('details')?.removeAttribute('open')}}>{saved.lessons.includes(l.id)?'✓ ':''}{l.title}</button>)}<a href={ROOT+'study-guide/'}>Sra. Abarca’s Study Guide Review →</a></div></details><span>1–2 minutes</span></div>
        <section className="u2-card u2-lesson"><p className="u2-count">Example {exampleIndex+1} of {lesson.examples.length}</p><h2 ref={title} tabIndex={-1}>{lesson.title}</h2><p>{lesson.summary}</p>
          <div className="u2-example" aria-label="Example">{lesson.examples[exampleIndex].split('\n').map((line,i)=><p key={i}>{line}</p>)}</div>
          {lesson.id==='perspective'&&<div className="u2-perspective" aria-label="Group perspective"><span><b>IN</b>me + others</span><span><b>TO</b>you all</span><span><b>ABOUT</b>they</span></div>}
          <div className="u2-actions">{exampleIndex>0&&<button className="u2-secondary" onClick={()=>setExampleIndex(i=>i-1)}>Back</button>}{exampleIndex<lesson.examples.length-1?<button className="u2-primary" onClick={()=>setExampleIndex(i=>i+1)}>Next example →</button>:<button className="u2-primary" disabled={!ready} onClick={()=>requestStart('lesson',lesson.questions,lesson.id)}>Try {lesson.questions.length} questions →</button>}</div>
        </section><a className="u2-guide-link" href={ROOT+'study-guide/'}>Ready to mix the skills? Sra. Abarca’s Study Guide Review →</a>
      </>}
      {screen==='intro'&&['story','test','guide'].includes(entry)&&<section className="u2-card u2-intro">
        <p className="u2-count">{entry==='story'?'Un día en la escuela':entry==='test'?'Your own pace':'Find WHO. Choose the form.'}</p>
        <h2 ref={title} tabIndex={-1}>{entry==='story'?'Meet us in Spanish class.':entry==='test'?'Ready to put it together?':'One skill builds on the next.'}</h2>
        <p>{entry==='story'?'Meet your classmates, pack your bag, and follow the school day. There’s one question at a time.':entry==='test'?'Fresh practice of the Unit 2 concepts. First answers count toward your practice score. Help is available and recorded separately.':'Move from pronouns to SER, descriptions, and story blanks. These are fresh examples of the concepts in your study guide.'}</p>
        <p className="u2-meta">{entryQuestions.length} questions <span>·</span> {entry==='test'?'Pause whenever you need':'Small hints and gentle retries'}</p>
        <button className="u2-primary" disabled={!ready} onClick={()=>requestStart(entryMode,entryQuestions)}> {entry==='test'?'Start practice test':entry==='guide'?'Start study guide review':'Start the school day'} →</button>
      </section>}
      {screen==='question'&&s&&q&&step&&<section className="u2-question" data-question={q.id} data-step={s.step}>
        <div className="u2-progress-label"><span>{q.chapter}</span><span>{s.index+1} of {s.ids.length}</span></div><progress className="u2-progress" value={s.index} max={s.ids.length} aria-label="Question progress"/>
        <div className="u2-card">
          <div className="u2-context">{q.speaker&&<strong>{q.speaker}</strong>}<p>{q.context}</p></div>
          {q.reading&&<blockquote className="u2-reading">{q.reading}</blockquote>}
          {q.steps.length>1&&<p className="u2-count">Step {s.step+1} of {q.steps.length}</p>}
          <h2 ref={title} tabIndex={-1}>{step.prompt}</h2>
          <p className="u2-wordbank-label">{step.options.length===2?'Choose one':'Word bank · choose one'}</p>
          <div className="u2-options" role="group" aria-label="Answer choices">{studyOptions(step.options,`${q.id}:${s.step}`).map(option=><button key={option} disabled={s.feedback} aria-pressed={s.choice===option} onClick={()=>setSaved(old=>chooseStudy(old,option,q))}>{option}<span aria-hidden="true">{s.choice===option?'●':'○'}</span></button>)}</div>
          {!s.feedback?<div className="u2-actions"><button className="u2-text-button" aria-expanded={help} aria-controls="question-help" onClick={()=>{setHelp(v=>!v);if(!help)setSaved(helpStudy)}}>Need help?</button><button className="u2-primary" disabled={!s.choice} onClick={()=>setSaved(old=>checkStudy(old,q))}>Check answer</button></div>:<div className={`u2-feedback ${s.answers[answerKey(s)]?.correct?'is-correct':''}`} role="status" tabIndex={-1} ref={feedback}>
            <strong>{s.answers[answerKey(s)]?.correct?'Yes!':'Let’s look again.'}</strong><p>{s.answers[answerKey(s)]?.correct||s.mode==='test'?step.explanation:`Try again. ${step.hint}`}</p>
            {s.answers[answerKey(s)]?.correct||s.mode==='test'?<button className="u2-primary" onClick={next}>{s.index===s.ids.length-1&&s.step===q.steps.length-1?'Finish':'Continue'} →</button>:<button className="u2-primary" onClick={()=>setSaved(retryStudy)}>Try again</button>}
          </div>}
          {help&&!s.feedback&&<aside className="u2-help" id="question-help"><h3>{studyHelp[step.help].title}</h3><p>{step.hint}</p>{studyHelp[step.help].lines.map(line=><p key={line}>{line}</p>)}<button className="u2-text-button" onClick={()=>setHelp(false)}>Close help</button></aside>}
        </div><a className="u2-pause" href="/quizzes/spanish/">Pause & save my place</a>
      </section>}
      {screen==='result'&&s&&score&&<section className="u2-card u2-result"><span className="u2-finish-mark" aria-hidden="true">✓</span><h2 ref={title} tabIndex={-1}>{s.mode==='lesson'?'A little more confident.':s.mode==='story'?'You made it through the school day.':'Practice complete.'}</h2>
        {s.mode==='test'?<><p className="u2-score">{score.correct} <span>/ {score.total}</span></p><p>First answers correct · {Math.round(score.correct/score.total*100)}%</p>{score.assisted>0&&<p className="u2-meta">Help used on {score.assisted} {score.assisted===1?'response':'responses'}.</p>}<p className="u2-meta">Practice feedback, not a school grade.</p></>:<p>{s.mode==='lesson'?'You tried the examples and worked through the questions.': 'Good work. Take a break, or try another small step.'}</p>}
        {s.mode==='test'&&<details className="u2-review"><summary>Review what to practice</summary>{s.ids.flatMap(id=>{const question=allQuestions.find(q=>q.id===id)!;return question.steps.flatMap((st,i)=>{const row=s.answers[`${id}:${i}`];return row&&(row.first!==st.answer||row.assisted)?[<div key={`${id}:${i}`}><p><b>{st.prompt}</b></p><p>{st.explanation}</p></div>]:[]})})}{score.correct===score.total&&score.assisted===0&&<p>You answered every question independently.</p>}</details>}
        <div className="u2-actions">{s.mode==='lesson'?<button className="u2-primary" onClick={()=>{setLessonId(studyLessons[(studyLessons.findIndex(l=>l.id===s.lessonId)+1)%studyLessons.length].id);setExampleIndex(0);setScreen('lesson')}}>Next lesson →</button>:<a className="u2-primary" href={ROOT+'study/'}>Try a short lesson →</a>}<a className="u2-text-button" href="/quizzes/spanish/">Spanish home</a></div>
      </section>}
    </main><footer className="u2-footer"><span>Made for small steps.</span><a href="/">All subjects</a></footer>
    <dialog ref={dialog} className="u2-dialog" onCancel={()=>setPending(null)}><h2>Start a new activity?</h2><p>This replaces your unfinished {s?names[s.mode].toLowerCase():'practice'}. Finished lessons stay saved.</p><div className="u2-actions"><button className="u2-secondary" onClick={()=>{dialog.current?.close();setPending(null)}}>Keep my place</button><button className="u2-primary" onClick={()=>{if(pending)begin(pending.mode,pending.questions,pending.lessonId);dialog.current?.close();setPending(null)}}>Start new activity</button></div></dialog>
  </div>;
}
