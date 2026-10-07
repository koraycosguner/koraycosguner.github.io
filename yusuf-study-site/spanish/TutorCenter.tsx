'use client';

import {useEffect,useRef,useState} from 'react';
import type {DragEvent,ReactNode} from 'react';
import {tutorLessons,tutorQuestions,tutorSkills,tutorWords} from './tutor-content';
import {TUTOR_KEY,newTutor,parseTutor,startTutor,currentTask,currentQuestion,chooseTutor,removeTutorChoice,hintTutor,markTutorSupport,markTutorAudio,submitTutor,advanceTutor,tutorScore,tutorSkillStatus,reviewSkills,tutorConfusions,canTutorRemediate} from './tutor-learning';
import type {TutorMode,TutorQuestion,TutorSaved,TutorFrame} from './tutor-types';
import TutorVisual from './TutorVisual';
import {useTutorAudio} from './useTutorAudio';
import {studyOptions} from './study-learning';
import './tutor.css';

const ROOT='/quizzes/spanish/unit-2/';
type Entry='home'|'learn'|'vocabulary'|'listening'|'practice'|'test'|'progress';
type Screen='home'|'topics'|'vocabulary'|'intro'|'session'|'pause'|'result'|'progress'|'misses';
type Request={mode:TutorMode;options?:{lessonId?:string;wordGroup?:string;skill?:string}};
const modeNames:Record<TutorMode,string>={guided:'Today’s mission',lesson:'Learn',practice:'Practice',vocabulary:'Vocabulary',listening:'Listening',review:'Practice what I missed',test:'Unit 2 test practice'};
const statusNames={new:'Not tried yet',developing:'Developing',almost:'Almost there',strong:'Strong',ready:'Ready'};
const DRAG='application/x-yusuf-tutor';

function Icon({name}:{name:string}) {
  const paths:Record<string,ReactNode>={
    audio:<><path d="m4 9 4 0 5-4v14l-5-4H4Z"/><path d="M16 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/></>,
    learn:<><path d="M3 5c4-2 6-1 9 1 3-2 5-3 9-1v15c-4-2-6-1-9 1-3-2-5-3-9-1Z"/><path d="M12 6v15"/></>,
    vocabulary:<><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m4 17 5-6 4 4 3-3 5 5"/><circle cx="16" cy="8" r="1"/></>,
    practice:<><path d="M20 10a8 8 0 1 0-2 8M20 4v6h-6"/><path d="m9 12 2 2 4-5"/></>,
    test:<><rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 2h6v5H9Zm0 10h6m-6 5h6"/></>,
    progress:<><path d="M4 20V4m0 16h17M8 16v-4m5 4V8m5 8V5"/></>,
    target:<><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="m12 12 9-9m-1-1v4h4"/></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">{paths[name]??paths.audio}</svg>;
}

function Reasoning({parts}:{parts:string[]}) {
  return <ol className="tc-chain" aria-label="Follow the pattern">{parts.map((part,i)=><li key={i}><span>{i===0?'WHO / WHAT?':i===1?'PRONOUN / PATTERN':i===2?'FORM':'SENTENCE'}</span><b>{part}</b>{i<parts.length-1&&<i aria-hidden="true">→</i>}</li>)}</ol>;
}

function AudioButton({text,audio,label,slow=false}:{text:string;audio:ReturnType<typeof useTutorAudio>;label?:string;slow?:boolean}) {
  return <button className="tc-audio" disabled={!audio.canListen} onClick={()=>audio.listen(text,slow)} aria-label={label??`Play Spanish: ${text}`} aria-pressed={audio.playing===text}><Icon name="audio"/><span>{audio.playing===text?'Playing…':slow?'Slower replay':'Listen'}</span></button>;
}

function Frame({frame,audio}:{frame:TutorFrame;audio:ReturnType<typeof useTutorAudio>}) {
  return <div className="tc-teaching">
    {frame.visual&&<div className="tc-teaching-visual"><TutorVisual id={frame.visual}/></div>}
    <p className="tc-small-idea">{frame.body}</p>
    {frame.chain&&<Reasoning parts={frame.chain}/>}
    <div className="tc-model"><p lang="es">{frame.spanish}</p><AudioButton text={frame.audio||frame.spanish} audio={audio}/></div>
    {frame.contrast&&<div className="tc-contrast">{frame.contrast.map(item=><div key={item.label}><small>{item.label}</small><p lang="es">{item.spanish}</p></div>)}</div>}
  </div>;
}

function Reference({audio,close}:{audio:ReturnType<typeof useTutorAudio>;close:()=>void}) {
  const ref=useRef<HTMLDialogElement>(null);
  const [section,setSection]=useState('pronouns');
  const [word,setWord]=useState(tutorWords[0]?.id??'libro');
  const currentWord=tutorWords.find(item=>item.id===word);
  useEffect(()=>{const before=document.activeElement as HTMLElement;ref.current?.showModal();return()=>before?.focus()},[]);
  const referenceLessons=tutorLessons.filter(lesson=>section==='pronouns'?lesson.id.startsWith('pronouns'):section==='ser'?lesson.id==='ser':section==='de'?['origin','possession'].includes(lesson.id):section==='adjectives'?lesson.id==='adjectives':section==='articles'?lesson.id==='articles-hay':false);
  return <dialog ref={ref} className="tc-dialog tc-reference" onCancel={event=>{event.preventDefault();close()}} aria-labelledby="reference-heading">
    <div className="tc-dialog-top"><h2 id="reference-heading">Quick reference</h2><button onClick={close} aria-label="Close quick reference">×</button></div>
    <label htmlFor="tc-reference-section">What do you need?</label><select id="tc-reference-section" value={section} onChange={event=>{audio.stop();setSection(event.target.value)}}><option value="pronouns">Subject pronouns</option><option value="ser">SER</option><option value="de">SER + de</option><option value="adjectives">Adjective agreement</option><option value="articles">Articles + HAY</option><option value="words">My vocabulary</option></select>
    {section==='words'&&currentWord?<><label htmlFor="tc-reference-word">Choose a word</label><select id="tc-reference-word" value={word} onChange={event=>{audio.stop();setWord(event.target.value)}}>{tutorWords.map(item=><option value={item.id} key={item.id}>{item.word}</option>)}</select><TutorVisual id={currentWord.visual} compact/><p lang="es"><b>{currentWord.word}</b></p><p>{currentWord.english}</p><AudioButton audio={audio} text={currentWord.word} label={`Play pronunciation for ${currentWord.word}`}/><p lang="es">{currentWord.sentence}</p><AudioButton audio={audio} text={currentWord.sentence}/></>:referenceLessons.map(lesson=><details key={lesson.id}><summary>{lesson.title}</summary>{lesson.frames.map((frame,index)=><div className="tc-reference-example" key={index}><p>{frame.body}</p><p lang="es"><b>{frame.spanish}</b></p><AudioButton audio={audio} text={frame.audio||frame.spanish}/></div>)}</details>)}
  </dialog>;
}

function VocabularyLibrary({audio,start}:{audio:ReturnType<typeof useTutorAudio>;start:(request:Request)=>void}) {
  const groups=[...new Set(tutorWords.map(word=>word.group))];
  const [group,setGroup]=useState(groups[0]);
  const [index,setIndex]=useState(0);
  const [english,setEnglish]=useState(false);
  const words=tutorWords.filter(word=>word.group===group);
  const word=words[index%words.length];
  function move(delta:number){audio.stop();setIndex(i=>(i+delta+words.length)%words.length);setEnglish(false)}
  return <>
    <div className="tc-library-tools"><label htmlFor="tc-word-group">Choose a collection</label><select id="tc-word-group" value={group} onChange={event=>{setGroup(event.target.value);setIndex(0);setEnglish(false);audio.stop()}}>{groups.map(item=><option key={item}>{item}</option>)}</select></div>
    <article className="tc-card tc-word-card" data-word={word.id}><div className="tc-card-meta"><span>See it. Hear it.</span><span>{index+1} / {words.length}</span></div><TutorVisual id={word.visual}/><div className="tc-word-title"><h2 lang="es">{word.word}</h2><AudioButton text={word.word} audio={audio} label={`Play pronunciation for ${word.word}`}/></div><p className="tc-word-sentence" lang="es">{word.sentence}</p><AudioButton text={word.sentence} audio={audio} label="Play the example sentence"/>
      <button className="tc-text" aria-expanded={english} onClick={()=>setEnglish(!english)}>{english?'Hide English':'Need the English meaning?'}</button>{english&&<p className="tc-help" lang="en">{word.english}</p>}
      <div className="tc-actions"><button onClick={()=>move(-1)}>← Previous word</button><button className="tc-primary" onClick={()=>move(1)}>Next word →</button></div>
    </article><button className="tc-collection-practice" onClick={()=>start({mode:'vocabulary',options:{wordGroup:group}})}>Practice these words <span aria-hidden="true">→</span></button>
  </>;
}

export default function TutorCenter({entry='home'}:{entry?:Entry}) {
  const initialScreen:Screen=entry==='learn'?'topics':entry==='vocabulary'?'vocabulary':entry==='progress'?'progress':entry==='home'?'home':'intro';
  const [screen,setScreen]=useState<Screen>(initialScreen);
  const [saved,setSaved]=useState<TutorSaved>(newTutor);
  const [ready,setReady]=useState(false);
  const [notice,setNotice]=useState('');
  const [reference,setReference]=useState(false);
  const [pending,setPending]=useState<Request|'reset'|null>(null);
  const [picked,setPicked]=useState<string|null>(null);
  const [readAudio,setReadAudio]=useState(false);
  const [why,setWhy]=useState(false);
  const [missIndex,setMissIndex]=useState(0);
  const [noReview,setNoReview]=useState(false);
  const title=useRef<HTMLHeadingElement>(null),feedback=useRef<HTMLDivElement>(null),dialog=useRef<HTMLDialogElement>(null),beforeDialog=useRef<HTMLElement|null>(null);
  const audio=useTutorAudio();
  const stopAudio=audio.stop;
  useEffect(()=>{try{setSaved(parseTutor(localStorage.getItem(TUTOR_KEY)))}catch{setNotice('Your saved record could not be opened. You can still study during this visit.')}setReady(true)},[]);
  useEffect(()=>{if(ready)try{localStorage.setItem(TUTOR_KEY,JSON.stringify(saved))}catch{setNotice('Saving is unavailable in this browser. You can still study during this visit.')}},[saved,ready]);
  const session=saved.session,task=currentTask(saved),question=currentQuestion(saved),score=tutorScore(saved),skills=tutorSkillStatus(saved);
  const activeTest=!!session&&!session.complete&&session.mode==='test'&&['session','pause'].includes(screen);
  const row=question? [...saved.evidence].reverse().find(item=>item.sessionId===session?.id&&item.questionId===question.id):undefined;
  const listenQuestion=!!question?.format.startsWith('listen-');
  const wrongRows=saved.evidence.filter(item=>item.sessionId===session?.id&&!item.firstCorrect);
  const currentMiss=wrongRows[missIndex],missQuestion=currentMiss?tutorQuestions.find(item=>item.id===currentMiss.questionId):undefined;
  const weak=reviewSkills(saved);
  const entryMode:TutorMode=entry==='test'?'test':entry==='listening'?'listening':'practice';
  const headingText=screen==='session'?modeNames[session?.mode??'guided']:screen==='vocabulary'?'Words for your school day':screen==='topics'?'Learn one small idea':screen==='progress'?'My progress':screen==='result'?'A step forward':screen==='misses'?'Look back. Learn the pattern.':screen==='intro'?modeNames[entryMode]:'Spanish · Unit 2';
  useEffect(()=>{stopAudio();setPicked(null);setReadAudio(false);setWhy(false);title.current?.focus()},[screen,session?.id,session?.index,stopAudio]);
  useEffect(()=>{if(session?.feedback)feedback.current?.focus()},[session?.feedback]);
  useEffect(()=>{if(question?.audio&&audio.playing===question.audio&&!session?.audioPlayed)setSaved(markTutorAudio)},[audio.playing,question?.audio,session?.audioPlayed]);
  useEffect(()=>{if(pending){stopAudio();beforeDialog.current=document.activeElement as HTMLElement;dialog.current?.showModal()}else beforeDialog.current?.focus()},[pending,stopAudio]);

  function launch(request:Request) {
    const next=startTutor(saved,request.mode,request.options);
    if(!next.session||!next.session.tasks.length||next.session.id===saved.session?.id){setNoReview(true);return}
    audio.stop();setSaved(next);setNoReview(false);setScreen('session');
  }
  function requestStart(request:Request) {
    if(!ready)return;
    if(request.mode==='review'&&!weak.length){setNoReview(true);return}
    if(session&&!session.complete&&(session.index>0||session.selection.length>0||saved.evidence.some(item=>item.sessionId===session.id)))setPending(request);else launch(request);
  }
  function next() {const updated=advanceTutor(saved);setSaved(updated);if(updated.session?.complete)setScreen('result')}
  function submit() {const updated=submitTutor(saved);setSaved(updated);if(updated.session?.complete)setScreen('result')}
  function place(id:string){setSaved(old=>chooseTutor(old,id));setPicked(null)}
  function drop(event:DragEvent<HTMLButtonElement>){event.preventDefault();const [questionId,id]=event.dataTransfer.getData(DRAG).split('|');if(question?.id===questionId&&question.choices.some(choice=>choice.id===id))place(id)}
  function supportReference(){if(activeTest)return;audio.stop();if(screen==='session'&&question)setSaved(markTutorSupport);setReference(true)}
  function showPictureQuestion(q:TutorQuestion){return ['word-picture','listen-picture','listen-sentence'].includes(q.format)&&q.choices.some(choice=>choice.visual)}
  function questionReady(q:TutorQuestion){return session?.selection.length===(q.format==='sentence-build'?q.answer.length:1)}
  const evidenceLabel=(ids:string[],q:TutorQuestion)=>ids.map(id=>q.choices.find(choice=>choice.id===id)?.label??'').join(' ');

  return <div className="tc-shell" data-ready={ready}>
    <a className="tc-skip" href="#tutor-main">Skip to activity</a>
    <header className="tc-header"><a className="tc-brand" href="/"><span>Y</span>Yusuf’s study club</a><nav aria-label="Study center navigation"><a href="/quizzes/spanish/">Spanish home</a>{!activeTest&&<button className="tc-text" onClick={supportReference}>Quick reference</button>}</nav></header>
    <main id="tutor-main" aria-busy={!ready}>
      {notice&&<p className="tc-notice" role="status">{notice}</p>}
      <div className="tc-heading"><span className="tc-eyebrow">Mis clases y mis compañeros</span><h1>{headingText}</h1></div>
      {screen==='home'&&<>
        <section className="tc-mission"><div className="tc-mission-copy"><span className="tc-eyebrow">Today’s mission</span><h2 ref={title} tabIndex={-1}>A little Spanish.<br/>A little more confidence.</h2><p>See it, hear it, then try it. We’ll take the next step together.</p><button className="tc-primary" disabled={!ready} onClick={()=>requestStart({mode:'guided'})}>Start studying <span aria-hidden="true">→</span></button><small>About 10–15 minutes · No timer</small></div><div className="tc-mission-art"><TutorVisual id="computadora"/><span className="tc-art-caption">Tu día en la escuela</span></div></section>
        {session&&<div className="tc-resume"><button className="tc-text" onClick={()=>setScreen(session.complete?'result':'session')}>{session.complete?'View my last result':'Continue my saved session'} →</button>{!session.complete&&<span>{modeNames[session.mode]} · Step {session.index+1} of {session.tasks.length}</span>}</div>}
        <nav className="tc-paths" aria-label="Choose a study activity">{[['learn','Learn','learn-with-pictures/'],['practice','Practice','practice/'],['vocabulary','Vocabulary','vocabulary/'],['audio','Listening','listening/'],['test','Test','test/'],['progress','My Progress','progress/']].map(([icon,label,path])=><a key={label} href={ROOT+path}><Icon name={icon}/><span>{label}</span><b aria-hidden="true">↗</b></a>)}</nav>
        <button className="tc-review-entry" disabled={!ready} onClick={()=>requestStart({mode:'review'})}><Icon name="target"/><span>Practice what I missed</span><b aria-hidden="true">→</b></button>
        
        <details className="tc-more"><summary>More Unit 2 activities</summary><div><a href={ROOT+'story-practice/'}>School-day story practice</a><a href={ROOT+'complete-story/'}>Complete the story</a><a href={ROOT+'study-guide/'}>Study guide review</a><a href={ROOT+'practice-test/'}>Long practice test · 90 questions</a><a href={ROOT+'study/'}>Earlier lesson record</a><a href={ROOT}>Illustrated school-day adventure</a><a href={ROOT+'quiz/'}>Earlier quiz and saved grades</a><a href={ROOT+'proficiency/'}>Earlier proficiency record</a><a href={ROOT+'explore/'}>Explore the classroom</a></div></details>
      </>}
      {screen==='topics'&&<><p className="tc-intro-copy">One useful pattern, a spoken example, then a chance to try.</p><div className="tc-topic-list tc-topic-groups">
        <details><summary><span>01</span><b>Subject pronouns</b><small>Who is speaking, included, or being addressed?</small></summary><div>{tutorLessons.filter(lesson=>lesson.id.startsWith('pronouns')).map(lesson=><button key={lesson.id} onClick={()=>requestStart({mode:'lesson',options:{lessonId:lesson.id}})}>{lesson.title} →</button>)}</div></details>
        <details><summary><span>02</span><b>SER</b><small>Connect each person to the right form.</small></summary><div><button onClick={()=>requestStart({mode:'lesson',options:{lessonId:'ser'}})}>Learn the six forms →</button><button onClick={()=>requestStart({mode:'lesson',options:{lessonId:'builder-ser'}})}>Build it: who → pronoun → SER →</button></div></details>
        <details><summary><span>03</span><b>SER + DE</b><small>Where someone is from. Who something belongs to.</small></summary><div>{tutorLessons.filter(lesson=>['origin','possession'].includes(lesson.id)).map(lesson=><button key={lesson.id} onClick={()=>requestStart({mode:'lesson',options:{lessonId:lesson.id}})}>{lesson.title} →</button>)}<button onClick={()=>requestStart({mode:'lesson',options:{lessonId:'builder-de'}})}>Build it: objects → SER + de →</button></div></details>
        <details><summary><span>04</span><b>Adjectives</b><small>Make descriptions agree with their people.</small></summary><div><button onClick={()=>requestStart({mode:'lesson',options:{lessonId:'adjectives'}})}>Learn gender and number →</button><button onClick={()=>requestStart({mode:'lesson',options:{lessonId:'builder-adjectives'}})}>Build it: people → description →</button></div></details>
        <a href={ROOT+'vocabulary/'}><span>05</span><div><b>Vocabulary</b><small>See, hear, and use words for your school day.</small></div><i aria-hidden="true">→</i></a>
        <a href={ROOT+'listening/'}><span>06</span><div><b>Listening</b><small>Connect Spanish sounds to their meaning.</small></div><i aria-hidden="true">→</i></a>
        </div><details className="tc-more"><summary>Articles + HAY refresher</summary><button onClick={()=>requestStart({mode:'lesson',options:{lessonId:'articles-hay'}})}>Learn articles, plurals, and HAY →</button></details></>}
      {screen==='vocabulary'&&<VocabularyLibrary audio={audio} start={requestStart}/>}
      {screen==='intro'&&<section className="tc-card tc-intro"><Icon name={entryMode==='test'?'test':entryMode==='listening'?'audio':'practice'}/><h2 ref={title} tabIndex={-1}>{entryMode==='test'?'See what you can do on your own.':entryMode==='listening'?'A word. A picture. A connection.':'Put a familiar idea to work.'}</h2><p>{entryMode==='test'?'18 questions, no hints or translations. See your score and explanations when you finish. Pause whenever you need.':entryMode==='listening'?'Listen to a short Spanish clip, then choose. Replay as often as you like. Reading is always available if sound cannot play.':'Short school-day activities with clues when you need them. A missed answer brings a small explanation and a new example.'}</p><button className="tc-primary" disabled={!ready} onClick={()=>requestStart({mode:entryMode})}>{entryMode==='test'?'Start 18-question test':entryMode==='listening'?'Start listening':'Start practice'} →</button>{entryMode==='practice'&&<button className="tc-text" onClick={()=>requestStart({mode:'lesson',options:{lessonId:'school-day-story'}})}>Walk through a school day →</button>}{session&&!session.complete&&<button className="tc-text" onClick={()=>setScreen('session')}>Continue my saved session →</button>}</section>}
      {screen==='session'&&session&&task&&<>
        <div className="tc-session-bar"><button className="tc-text" onClick={()=>setScreen('pause')}>Pause & save</button><span>{task.kind==='question'?`Question ${session.tasks.slice(0,session.index+1).filter(item=>item.kind==='question').length} of ${session.tasks.filter(item=>item.kind==='question').length}`:task.kind==='teach'?'Learn one small idea':'A moment to pause'}</span></div><progress className="tc-progress" value={session.index} max={session.tasks.length} aria-label="Session progress"/>
        {task.kind==='teach'&&(()=>{const lesson=tutorLessons.find(item=>item.id===task.lessonId);const frame=lesson?.frames[task.frame];return frame?<section className="tc-card tc-lesson" data-lesson={lesson!.id}><p className="tc-eyebrow">One small idea</p><h2 ref={title} tabIndex={-1}>{frame.title}</h2><Frame frame={frame} audio={audio}/><div className="tc-actions"><span className="tc-muted">Look first. There’s no question yet.</span><button className="tc-primary" onClick={next}>Got it. Continue →</button></div></section>:null})()}
        {task.kind==='checkpoint'&&<section className="tc-card tc-checkpoint"><span className="tc-check-mark" aria-hidden="true">✓</span><h2 ref={title} tabIndex={-1}>Nice work. Take a breath.</h2><p>You’ve made a few useful connections. Stretch, get some water, or keep going.</p><button className="tc-primary" onClick={next}>Continue →</button><button className="tc-text" onClick={()=>setScreen('pause')}>Take a break</button></section>}
        {task.kind==='question'&&question&&<section className="tc-card tc-question" data-question={question.id} data-format={question.format} data-scaffold={task.scaffold}>
          {task.parallel&&<p className="tc-eyebrow">Same idea · a fresh example</p>}
          {question.context&&<p className="tc-context">{question.context}</p>}
          {!activeTest&&question.visual&&!listenQuestion&&(task.scaffold>0||question.format==='picture-word')&&<div className="tc-question-visual"><TutorVisual id={question.visual} variant={task.scaffold===0?1:0}/></div>}
          {!activeTest&&!session.feedback&&task.scaffold===2&&!listenQuestion&&<aside className="tc-worked"><span>Watch the pattern first</span>{question.chain&&<Reasoning parts={question.chain}/>}<p lang="es">{question.model}</p><AudioButton audio={audio} text={question.model}/></aside>}
          <h2 ref={title} tabIndex={-1}>{question.prompt}</h2>
          {listenQuestion&&<div className="tc-listening"><AudioButton audio={audio} text={question.audio??question.model} label="Play the listening clip"/><span>{session.audioPlayed?'Replay whenever you need.':'Listen first, then choose.'}</span>{!audio.canListen&&<p>Audio isn’t available right now. You can still continue with reading.</p>}<button className="tc-text" onClick={()=>{setSaved(markTutorSupport);setReadAudio(true)}}>Read instead</button>{readAudio&&<div className="tc-help"><p lang="es">{question.audio??question.model}</p><small>This counts as supported reading practice.</small></div>}</div>}
          {question.format==='sentence-build'?<>
            <p className="tc-instruction">Tap words in order, or drag a word into the sentence.</p><div className="tc-sentence-slots" aria-label="Your sentence">{session.selection.map((id,index)=><button key={`${id}-${index}`} disabled={session.feedback} onClick={()=>setSaved(old=>removeTutorChoice(old,index))} aria-label={`Remove ${question.choices.find(choice=>choice.id===id)?.label}`}>{question.choices.find(choice=>choice.id===id)?.label}<small aria-hidden="true">×</small></button>)}<button className="tc-drop-slot" disabled={session.feedback} onDragOver={event=>event.preventDefault()} onDrop={drop} onClick={()=>{if(picked)place(picked)}} aria-label="Place the next word">{session.selection.length?'＋':'Build your sentence here'}</button></div>
            <div className="tc-word-bank" role="group" aria-label="Word bank">{studyOptions(question.choices.map(choice=>choice.id),`${session.id}:${question.id}`).map(id=>question.choices.find(choice=>choice.id===id)!).map(choice=><button key={choice.id} disabled={session.feedback||session.selection.includes(choice.id)} draggable={!session.feedback} onDragStart={event=>{event.dataTransfer.setData(DRAG,`${question.id}|${choice.id}`);setPicked(choice.id)}} onClick={()=>place(choice.id)}>{choice.label}</button>)}</div>
          </>:question.format==='word-bank'?<>
            <p className="tc-instruction">Choose a word, then tap the blank. You can also drag.</p><button className="tc-fill-slot" disabled={session.feedback} onDragOver={event=>event.preventDefault()} onDrop={drop} onClick={()=>{if(picked)place(picked);else if(session.selection.length)setSaved(old=>removeTutorChoice(old,0))}} aria-label={`Sentence blank: ${session.selection.length?evidenceLabel(session.selection,question):'empty'}`}>{session.selection.length?evidenceLabel(session.selection,question):'Tap to fill the blank'}</button><div className="tc-word-bank" role="group" aria-label="Word bank">{studyOptions(question.choices.map(choice=>choice.id),`${session.id}:${question.id}`).map(id=>question.choices.find(choice=>choice.id===id)!).map(choice=><button key={choice.id} disabled={session.feedback} draggable={!session.feedback} aria-pressed={picked===choice.id} onDragStart={event=>{event.dataTransfer.setData(DRAG,`${question.id}|${choice.id}`);setPicked(choice.id)}} onClick={()=>setPicked(choice.id)}>{choice.label}</button>)}</div><p className="tc-selection-note" role="status">{picked?`${question.choices.find(choice=>choice.id===picked)?.label} selected. Tap the blank.`:' '}</p>
          </>:<div className={`tc-options ${showPictureQuestion(question)?'tc-picture-options':''}`} role="group" aria-label="Answer choices">{studyOptions(question.choices.map(choice=>choice.id),`${session.id}:${question.id}`).map((choiceId,index)=>{const choice=question.choices.find(item=>item.id===choiceId)!;return <button key={choice.id} disabled={session.feedback} aria-pressed={session.selection.includes(choice.id)} onClick={()=>place(choice.id)} data-choice={choice.id}>{showPictureQuestion(question)&&choice.visual?<><TutorVisual id={choice.visual} variant={task.scaffold===0?1:0} compact/><span className="tc-picture-label">Picture {String.fromCharCode(65+index)}</span></>:<><span className="tc-option-letter" aria-hidden="true">{String.fromCharCode(65+index)}</span><span lang="es">{choice.label}</span></>}<span className="tc-choice-marker" aria-hidden="true">{session.selection.includes(choice.id)?'●':''}</span></button>})}</div>}
          {!session.feedback?<><div className="tc-actions"><button className="tc-primary" disabled={!questionReady(question)||(listenQuestion&&!session.audioPlayed&&!readAudio&&!session.assisted)} onClick={submit}>{activeTest?(session.index+1===session.tasks.length?'Finish test':'Save answer & next'):'Check answer'} →</button>{!activeTest&&<button className="tc-text" disabled={session.hintLevel>=question.hints.length} onClick={()=>setSaved(hintTutor)}>{session.hintLevel?'One more clue':'Need a hint?'}</button>}</div>{!activeTest&&session.hintLevel>0&&<p className="tc-help" role="status">{question.hints[Math.min(session.hintLevel-1,question.hints.length-1)]}</p>}</>:<div className={`tc-feedback ${row?.correct?'tc-correct':'tc-reteach'}`} ref={feedback} tabIndex={-1} role="status"><h3>{row?.correct?'✓ You’ve got it.':'Almost. Let’s look at one thing.'}</h3><p>{question.explanation}</p>{!row?.correct&&question.chain&&<Reasoning parts={question.chain}/>}<div className="tc-correct-model"><p lang="es">{question.model}</p><AudioButton text={question.model} audio={audio}/></div>{!row?.correct&&question.contrast&&question.contrast.length>1&&<div className="tc-contrast">{question.contrast.map(item=><div key={item.label}><small>{item.label}</small><p lang="es">{item.spanish}</p></div>)}</div>}{row?.correct&&question.chain&&<><button className="tc-text" aria-expanded={why} onClick={()=>setWhy(!why)}>Why does it work?</button>{why&&<Reasoning parts={question.chain}/>}</>}<button className="tc-primary" onClick={next}>{!row?.correct&&canTutorRemediate(saved)?'Try one like it':'Continue'} →</button></div>}
          {activeTest&&<p className="tc-muted tc-test-note">Your first answer counts. Explanations come after the test.</p>}
        </section>}
      </>}
      {screen==='pause'&&<section className="tc-card tc-pause"><span className="tc-eyebrow">Your place is saved</span><h2 ref={title} tabIndex={-1}>A break is part of studying.</h2><p>Come back to this step whenever you’re ready.</p><button className="tc-primary" onClick={()=>setScreen(session?.complete?'result':'session')}>Continue my session →</button><a href="/quizzes/spanish/">Done for now</a></section>}
      {screen==='result'&&session&&<>
        <section className="tc-card tc-result"><span className="tc-eyebrow">{session.mode==='test'?'Unit 2 readiness':'Session complete'}</span><h2 ref={title} tabIndex={-1}>{session.mode==='test'?'Here’s your next useful step.':'Nice work. You moved forward.'}</h2>{session.mode==='test'?<div className="tc-score"><strong>{score.percent??0}%</strong><span>{score.firstCorrect} / {score.total} first answers correct</span></div>:<p>You practiced {score.answered} activities. {score.assisted>0?'The examples and clues helped you learn the pattern.':'Every independent answer adds a little more evidence.'}</p>}
          <div className="tc-result-groups">{score.groups.map(group=><div key={group.group}><span>{group.group}</span><b>{group.answered===0?'Not assessed':group.percent===null?`${group.correct} / ${group.answered} correct`:`${group.percent}%`}</b></div>)}</div>
          {weak.length>0?<div className="tc-next-skills"><h3>Let’s work on</h3><ul>{weak.slice(0,3).map(id=><li key={id}>{tutorSkills.find(skill=>skill.id===id)?.label??id}</li>)}</ul></div>:<p className="tc-empty">Nothing needs extra review right now. A future session will bring back familiar ideas.</p>}
          <div className="tc-actions"><button className="tc-primary" onClick={()=>requestStart({mode:weak.length?'review':'practice'})}>{weak.length?'Practice what I missed':'Practice a little more'} →</button><a href="/quizzes/spanish/">Done for now</a></div>{wrongRows.length>0&&<button className="tc-text" onClick={()=>{setMissIndex(0);setScreen('misses')}}>Review my misses →</button>}
          <p className="tc-muted">Practice evidence, not a school grade. Help and corrections stay separate from first answers.</p>
        </section>
      </>}
      {screen==='misses'&&currentMiss&&missQuestion&&<section className="tc-card tc-miss"><span className="tc-eyebrow">Miss {missIndex+1} of {wrongRows.length}</span><h2 ref={title} tabIndex={-1}>{missQuestion.prompt}</h2><p>Your answer: <span lang="es">{evidenceLabel(currentMiss.first,missQuestion)}</span></p><div className="tc-model"><p lang="es">{missQuestion.model}</p><AudioButton text={missQuestion.model} audio={audio}/></div><p>{missQuestion.explanation}</p>{missQuestion.chain&&<Reasoning parts={missQuestion.chain}/>}<button className="tc-primary" onClick={()=>requestStart({mode:'review',options:{skill:missQuestion.skills[0]}})}>Practice this skill →</button><div className="tc-actions">{missIndex+1<wrongRows.length&&<button onClick={()=>setMissIndex(i=>i+1)}>Next missed question →</button>}<button className="tc-text" onClick={()=>setScreen('result')}>Back to results</button></div></section>}
      {screen==='progress'&&<>
        <section className="tc-progress-intro"><h2 ref={title} tabIndex={-1}>Small steps add up.</h2><p>{saved.evidence.length?'These estimates use varied first answers. Clues and corrections count as learning, not independent mastery.':'Start a study session and your progress will appear here.'}</p><button className="tc-primary" onClick={()=>requestStart({mode:weak.length?'review':'guided'})}>{weak.length?'Practice what I missed':'Start studying'} →</button></section>
        <div className="tc-progress-groups">{[...new Set(skills.map(skill=>skill.group))].map(group=><details key={group}><summary>{group}<span>{skills.filter(skill=>skill.group===group&&['strong','ready'].includes(skill.status)).length} strong / {skills.filter(skill=>skill.group===group).length}</span></summary><ul>{skills.filter(skill=>skill.group===group).map(skill=><li key={skill.id}><div><b>{skill.label}</b><small>{skill.independent} independent examples · {skill.attempts} attempts</small></div><span className={`tc-status tc-status-${skill.status}`}>{statusNames[skill.status]}</span></li>)}</ul></details>)}</div>
        {saved.evidence.some(item=>item.mode==='test')&&<details className="tc-history"><summary>Recent test practice</summary><ul>{[...new Set(saved.evidence.filter(item=>item.mode==='test').map(item=>item.sessionId))].reverse().slice(0,5).map(id=>{const result=tutorScore(saved,id);const complete=saved.completedSessionIds?.includes(id);return <li key={id}><span>Practice session {id} {complete?'':'· in progress'}</span><b>{result.firstCorrect} / {result.answered} correct{complete?` · ${result.percent}%`:''}</b></li>})}</ul></details>}
        {tutorConfusions(saved).length>0&&<details className="tc-history"><summary>Patterns to look at again</summary><p>These are past mix-ups. Your newest progress is shown above.</p><ul>{tutorConfusions(saved).slice(0,6).map((pair,index)=><li key={index}><span lang="es">{pair.from} → <b>{pair.to}</b></span><small>{pair.count} {pair.count===1?'time':'times'}</small></li>)}</ul></details>}
        <details className="tc-device"><summary>Progress on this device</summary><p>Saved only in this browser. Your earlier Spanish records and other subjects have their own saves.</p><button onClick={()=>setPending('reset')}>Reset this study-center record</button></details>
      </>}
      {noReview&&<p className="tc-empty" role="status">{weak.length?"You’ve tried the available fresh examples for these skills. Revisit Learn for a clear model, or try another practice session.":"Nothing to review yet. Start a short study session to find your next useful step."}</p>}
      {audio.notice&&<p className="tc-notice" role="status">{audio.notice}</p>}
      {!audio.canListen&&['session','vocabulary'].includes(screen)&&!listenQuestion&&<p className="tc-muted tc-audio-fallback">Spanish audio isn’t available in this browser. You can use every lesson with the words and pictures.</p>}
      <footer className="tc-footer"><a href="/">All subjects</a><span>At your pace. Saved in this browser.</span>{screen!=='home'&&<a href="/quizzes/spanish/">Spanish home</a>}</footer>
    </main>
    {reference&&<Reference audio={audio} close={()=>{audio.stop();setReference(false)}}/>}
    {pending&&<dialog ref={dialog} className="tc-dialog" onCancel={event=>{event.preventDefault();setPending(null)}} aria-labelledby="tc-confirm-title"><h2 id="tc-confirm-title">{pending==='reset'?'Reset this study-center record?':'Start a different session?'}</h2><p>{pending==='reset'?'Only this tutor’s progress will reset. Earlier Spanish grades and every other subject stay saved.':'Your learning record stays. This replaces your unfinished session and its saved place.'}</p><div className="tc-actions"><button onClick={()=>setPending(null)}>Keep my progress</button><button className="tc-primary" onClick={()=>{if(pending==='reset'){setSaved(newTutor());setScreen('home');setNoReview(false)}else launch(pending);setPending(null)}}>{pending==='reset'?'Reset this record':'Start new session'}</button></div></dialog>}
  </div>;
}
