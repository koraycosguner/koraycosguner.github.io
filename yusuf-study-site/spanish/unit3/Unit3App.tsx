'use client';

import {Fragment,useEffect,useRef,useState} from 'react';
import {questions,references,skillLabels,stories} from './content';
import {advanceU3,canRemediateU3,chooseU3,currentU3,hintU3,newU3,parseU3,removeU3,retryU3,scoreU3,shuffleU3,startU3,statusU3,submitU3,U3_KEY,weakU3} from './learning';
import type {U3Mode,U3Skill} from './types';
import Unit3Visual from './Unit3Visual';
import {useTutorAudio} from '../useTutorAudio';
import './unit3.css';

type Entry='home'|'complete'|'review'|'test';
type Screen='home'|'intro'|'activity'|'result'|'progress';
type Request={mode:U3Mode;storyId?:string;skill?:U3Skill};
const ROOT='/quizzes/spanish/unit-3/';
const labels={new:'Not tried yet',ready:'Ready',practice:'A little more practice',review:'Review again'};
const modeNames:Record<U3Mode,string>={story:'School-day story',review:'Study guide review',test:'Practice test',complete:'Complete the story',targeted:'A little extra practice'};

export default function Unit3App({entry='home'}:{entry?:Entry}){
  const [saved,setSaved]=useState(newU3);
  const [ready,setReady]=useState(false);
  const [screen,setScreen]=useState<Screen>(entry==='home'?'home':'intro');
  const [request,setRequest]=useState<Request>({mode:entry==='home'?'story':entry});
  const [pending,setPending]=useState<Request|'reset'|null>(null);
  const [notice,setNotice]=useState('');
  const [english,setEnglish]=useState(false);
  const [help,setHelp]=useState(false);
  const [slot,setSlot]=useState<number|undefined>();
  const heading=useRef<HTMLHeadingElement>(null);
  const dialog=useRef<HTMLDialogElement>(null);
  const audio=useTutorAudio();
  const session=saved.session,question=currentU3(saved);
  const activeStory=stories.find(story=>story.id===(screen==='intro'?request.storyId:session?.storyId));
  const questionStory=stories.find(story=>story.id===question?.storyId);
  const taskVisual=question?.visual??(['schedule-after-math','schedule-ninth'].includes(question?.id??'')?questionStory?.visual:undefined);
  const taskContext=question?.context;
  const nextStory=stories.find(story=>!saved.completedStories.includes(story.id))??stories[0];
  const result=scoreU3(saved);
  const isTest=session?.mode==='test';
  const record=saved.evidence.find(row=>row.sessionId===session?.id&&row.questionId===question?.id);
  const reference=references.find(item=>item.skill===question?.skill);
  useEffect(()=>{
    try{setSaved(parseU3(localStorage.getItem(U3_KEY)))}catch{setNotice('Your saved Unit 3 record could not open. You can study now; use Reset Unit 3 in My progress to save a fresh record.');}
    setReady(true);
  },[]);
  useEffect(()=>{
    if(!ready||notice.includes('could not open'))return;
    try{localStorage.setItem(U3_KEY,JSON.stringify(saved))}catch{setNotice('Saving is unavailable in this browser. You can keep studying in this tab.');}
  },[saved,ready,notice]);
  useEffect(()=>{if(pending)dialog.current?.showModal()},[pending]);
  useEffect(()=>{heading.current?.focus()},[screen,session?.index,session?.complete]);
  const stop=()=>{audio.stop();setHelp(false);setEnglish(false);setSlot(undefined)};
  const show=(view:Screen)=>{stop();setScreen(view)};
  const prepare=(next:Request)=>{stop();setRequest(next);setScreen('intro')};
  const launch=(next:Request)=>{stop();setSaved(state=>startU3(state,next.mode,{storyId:next.storyId,skill:next.skill}));setScreen('activity')};
  const start=()=>{
    if(session&&!session.complete){setPending(request);return;}
    launch(request);
  };
  const resume=()=>show(session?.complete?'result':'activity');
  const submit=()=>{audio.stop();setHelp(false);setSlot(undefined);setSaved(state=>submitU3(state))};
  const continueQuestion=()=>{stop();setSaved(advanceU3)};
  const completed=screen==='result'||screen==='activity'&&session?.complete;
  const choiceLabel=(id:string)=>question?.choices.find(choice=>choice.id===id)?.label??'';
  const choose=(id:string,target?:number)=>{setSaved(state=>chooseU3(state,id,target));setSlot(undefined)};
  const full=!!question&&!!session&&session.selection.length===question.answer.length&&session.selection.every(Boolean);
  const questionNumber=question&&activeStory?(activeStory.questionIds.indexOf(question.id)+1):0;
  const checkpointNumber=question&&activeStory?(activeStory.checkpointIds.indexOf(question.id)+1):0;

  return <div className="u3-app">
    <a className="u3-skip" href="#unit3-main">Skip to activity</a>
    <header className="u3-header"><a href="/" className="u3-brand"><span aria-hidden="true">Y</span>Yusuf’s study club</a><a href="/quizzes/spanish/">Spanish home</a></header>
    <main id="unit3-main" aria-busy={!ready}>
      {notice&&<p className="u3-notice" role="status">{notice}</p>}
      {screen==='home'&&<>
        <p className="u3-eyebrow">Español · Unidad 3</p>
        <section className="u3-hero"><div><h1 ref={heading} tabIndex={-1}>One school day.<br/><em>A little Spanish at a time.</em></h1><p className="u3-spanish-title" lang="es">Mi Día en la Escuela y Mi Horario</p><p>See a moment from the day. Read a short story. Try one question.</p><button disabled={!ready} className="u3-primary" onClick={()=>prepare({mode:'story',storyId:nextStory.id})}>{saved.completedStories.length?'Choose my next story':'Start my school day'} <span aria-hidden="true">→</span></button><small>One story takes about 5 minutes. No timer.</small></div><Unit3Visual visual={{kind:'arrival'}}/></section>
        {session&&<div className="u3-resume"><button onClick={resume}>{session.complete?'See my last result':'Continue where I left off'} →</button><span>{modeNames[session.mode]}{!session.complete&&` · ${session.index+1} of ${session.ids.length}`}</span></div>}
        <details className="u3-story-list"><summary>Choose a story <span>{saved.completedStories.length} of 5 explored</span></summary><ol>{stories.map((story,index)=><li key={story.id}><button onClick={()=>prepare({mode:'story',storyId:story.id})}><span className="u3-number">{index+1}</span><span><b lang="es">{story.title}</b><small>{story.subtitle}</small></span><span aria-label={saved.completedStories.includes(story.id)?'Explored':'Available'}>{saved.completedStories.includes(story.id)?'✓':'→'}</span></button></li>)}</ol></details>
        <nav className="u3-modes" aria-label="Unit 3 activities"><a href={ROOT+'complete-story/'}><span aria-hidden="true">Aa</span><b>Complete the story</b><small>Two short word-bank stories</small></a><a href={ROOT+'study-guide/'}><span aria-hidden="true">?</span><b>Study guide review</b><small>Pick a skill. Try up to 10 questions.</small></a><a href={ROOT+'practice-test/'}><span aria-hidden="true">✓</span><b>Practice test</b><small>32 questions · Grade at the end</small></a></nav>
        <button className="u3-text" onClick={()=>show('progress')}>My Unit 3 progress →</button>
      </>}
      {screen==='intro'&&<>
        <button className="u3-text" onClick={()=>show('home')}>← Unit 3 home</button>
        <p className="u3-eyebrow">{request.mode==='story'?`Story ${stories.findIndex(story=>story.id===activeStory?.id)+1} of 5`: 'Unidad 3'}</p>
        <h1 ref={heading} tabIndex={-1}>{activeStory?.title??modeNames[request.mode]}</h1>
        {activeStory?<div className="u3-story-intro"><Unit3Visual visual={activeStory.visual}/><section className="u3-reading"><p className="u3-story-text" lang="es">{activeStory.paragraph}</p><div className="u3-tools"><button onClick={()=>audio.playing?audio.stop():audio.listen(activeStory.paragraph,true)}>{audio.playing?'Stop audio':'Listen slowly'}</button><button aria-expanded={english} onClick={()=>setEnglish(!english)}>English help</button></div>{english&&<p>{activeStory.english}</p>}{audio.notice&&<small role="status">{audio.notice}</small>}<p className="u3-muted">6 short questions, then 2 quick check questions.</p></section></div>:<section className="u3-intro-card"><Unit3Visual visual={{kind:request.mode==='complete'?'map':request.mode==='test'?'clock':'calendar',hour:9,minute:0}} compact/><div><p>{request.mode==='test'?'Try 32 mixed questions at your own pace. Choose an answer, then save it and continue. Your first answers are graded at the end.':request.mode==='complete'?'Read a short paragraph. Tap a word to put it in the next blank, or drag it to a blank. You can move words before you check.':'Choose a skill or mix them together. You’ll get up to 10 questions, with feedback after each answer.'}</p>{request.mode==='test'&&<p className="u3-muted">Practice estimate, not a school grade. No timer. Your place saves on this browser.</p>}{request.mode==='review'&&<label className="u3-select">Practice focus<select value={request.skill??''} onChange={event=>setRequest({...request,skill:event.target.value as U3Skill||undefined})}><option value="">Mix the skills</option>{Object.entries(skillLabels).map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label>}</div></section>}
        {session&&!session.complete&&<p><button className="u3-text" onClick={resume}>Continue my saved {modeNames[session.mode].toLowerCase()} instead →</button></p>}
        <button className="u3-primary" disabled={!ready} onClick={start}>{request.mode==='test'?'Start practice test':request.mode==='story'?'Ready · Try the questions':'Let’s begin'} →</button>
      </>}
      {screen==='activity'&&!completed&&question&&session&&<>
        <div className="u3-session-top"><button className="u3-text" onClick={()=>show('home')}>← Save & take a break</button><span>{modeNames[session.mode]}</span></div>
        <div className="u3-progress"><span>{checkpointNumber?`Quick check ${checkpointNumber} of 2`:questionNumber?`Question ${questionNumber} of 6`:session.remediationIds?.includes(question.id)?'One fresh try':`Question ${session.index+1} of ${session.ids.length}`}</span><progress aria-label="Session progress" value={session.index} max={session.ids.length}/></div>
        <section className="u3-task" data-question={question.id}>
          {taskVisual&&<div className="u3-task-visual"><Unit3Visual visual={taskVisual} compact/></div>}
          <div className="u3-question-body">
            {taskContext&&question.format!=='bank'&&<p className="u3-context" lang="es">{taskContext}</p>}{questionStory&&!isTest&&<details className="u3-story-reminder" key={question.id} onToggle={event=>{if(event.currentTarget.open)setSaved(hintU3)}}><summary>Read the story again</summary><p lang="es">{questionStory.paragraph}</p></details>}
            {session.retry&&<p className="u3-muted">Practice retry · Your first result stays recorded.</p>}<h1 ref={heading} tabIndex={-1}>{question.prompt}</h1>
            {question.format==='choice'?<div className="u3-choices" role="group" aria-label="Answer choices">{shuffleU3(question.choices.map(choice=>choice.id),`${session.id}:${question.id}`).map(id=><button key={id} aria-pressed={session.selection[0]===id} disabled={session.feedback} onClick={()=>choose(id)}>{choiceLabel(id)}</button>)}</div>:<>
              <p className="u3-muted">{question.format==='order'?'Tap the words in order, or drag each to the next space. Tap a placed word to undo.':'Tap a word for the next blank, or choose a blank first. You can also drag words into blanks.'}</p>
              <div className={question.format==='bank'?'u3-bank-story':'u3-date-builder'} lang="es">{Array.from({length:question.answer.length},(_,index)=><Fragment key={index}>{question.segments?.[index]}<button className={`u3-slot ${slot===index?'u3-slot-active':''}`} aria-label={`Blank ${index+1}${session.selection[index]?`: ${choiceLabel(session.selection[index])}`:''}`} disabled={session.feedback} onClick={()=>{if(session.selection[index])setSaved(state=>removeU3(state,index));setSlot(index)}} onDragOver={event=>event.preventDefault()} onDrop={event=>{event.preventDefault();choose(event.dataTransfer.getData('text/plain'),question.format==='bank'?index:undefined)}}>{session.selection[index]?choiceLabel(session.selection[index]):`${index+1} …`}</button></Fragment>)}{question.segments?.at(-1)}</div>
              <div className="u3-word-bank" role="group" aria-label="Word bank">{shuffleU3(question.choices.map(choice=>choice.id),`${session.id}:${question.id}`).map(id=><button key={id} draggable={!session.feedback} onDragStart={event=>event.dataTransfer.setData('text/plain',id)} disabled={session.feedback||session.selection.includes(id)} onClick={()=>choose(id,question.format==='bank'?slot:undefined)}>{choiceLabel(id)}</button>)}</div>
            </>}
            {session.feedback?<div className="u3-feedback" role="status"><b>{session.selection.join('|')===question.answer.join('|')?'That’s it.':'Let’s look together.'}</b><p>{question.explanation}</p>{record&&!record.correct&&<button className="u3-text" onClick={()=>{stop();setSaved(retryU3)}}>Try this question again</button>}<button className="u3-primary" onClick={continueQuestion}>{canRemediateU3(saved)?'Try a fresh example':'Continue'} →</button></div>:<div className="u3-answer-actions"><button className="u3-primary" disabled={!full} onClick={submit}>{isTest?'Save answer & continue':'Check answer'}</button>{!isTest&&<button className="u3-text" aria-expanded={help} onClick={()=>{audio.stop();setSaved(hintU3);setHelp(!help)}}>Need help?</button>}</div>}
            {help&&!isTest&&<aside className="u3-help"><h2>A small clue</h2><p>{question.hint}</p>{reference&&<details><summary>{reference.title}</summary><dl>{reference.entries.map((item,index)=><div key={index}><dt lang="es">{item.spanish}</dt><dd>{item.english}</dd></div>)}</dl></details>}</aside>}
          </div>
        </section>
      </>}
      {completed&&session&&<>
        <p className="u3-eyebrow">{modeNames[session.mode]} · Complete</p><h1 ref={heading} tabIndex={-1}>{session.ids.length?'You made time to learn.':'You’ve tried the fresh questions.'}</h1>
        {session.ids.length>0&&<section className="u3-result"><div className="u3-score"><b>{result.percent}%</b><span>{result.correct} of {result.answered} first answers correct</span></div><p>{isTest?'Your practice-test grade is based on your first saved answers.':'Retries help you learn. They never add penalties or change your first-answer record.'}{result.assisted>0&&` ${result.assisted} answer${result.assisted===1?'':'s'} used support or a supplied word bank.`}</p></section>}
        <div className="u3-actions">{session.mode==='story'&&<button className="u3-primary" onClick={()=>prepare(saved.completedStories.length<5?{mode:'story',storyId:nextStory.id}:{mode:'complete'})}>{saved.completedStories.length<5?'Next school-day story':'Complete the story'} →</button>}{weakU3(saved).length>0&&<button className={session.mode==='story'?'':'u3-primary'} onClick={()=>launch({mode:'targeted'})}>Practice my tricky skills</button>}<button onClick={()=>show('home')}>Back to Unit 3</button></div>
        {!session.ids.length&&<p>Try Study guide review to revisit a skill. We won’t repeat a question and call it new.</p>}
        <details className="u3-details"><summary>How each skill is going</summary><p>Ready means two different examples answered correctly without help after the latest difficulty. This is a small practice sample.</p><ul className="u3-skills">{result.groups.filter(row=>row.answered).map(row=><li key={row.skill}><b>{row.label}</b><span>{row.correct}/{row.answered} correct</span><em>{labels[row.status]}</em></li>)}</ul></details>
        <details className="u3-details"><summary>Review my answers</summary><ol className="u3-answer-review">{saved.evidence.filter(row=>row.sessionId===session.id).map(row=>{const q=questions.find(item=>item.id===row.questionId)!;return <li key={row.questionId}><b>{q.prompt}</b>{(q.context||q.storyId)&&<p lang="es">{q.context??stories.find(story=>story.id===q.storyId)?.paragraph}</p>}<p>Your answer: {row.first.map(id=>q.choices.find(choice=>choice.id===id)?.label).join(' · ')} {row.correct?'✓':''}</p>{!row.correct&&<p>Correct answer: {q.answer.map(id=>q.choices.find(choice=>choice.id===id)?.label).join(' · ')}</p>}<p>{q.explanation}</p></li>})}</ol></details>
      </>}
      {screen==='progress'&&<><button className="u3-text" onClick={()=>show('home')}>← Unit 3 home</button><h1 ref={heading} tabIndex={-1}>My Unit 3 progress</h1><p>{saved.completedStories.length} of 5 stories explored. Progress stays on this browser.</p><p className="u3-muted">Ready means two different correct examples without help after the latest difficulty. These are practice signals, not school grades.</p><ul className="u3-skills">{statusU3(saved).map(row=><li key={row.skill}><b>{row.label}</b><em>{labels[row.status]}</em><button onClick={()=>prepare({mode:'review',skill:row.skill})}>Practice</button></li>)}</ul><button className="u3-text" onClick={()=>setPending('reset')}>Reset Unit 3 progress</button></>}
      <footer className="u3-footer"><a href="/">All subjects</a><span>At your pace · Saved on this browser</span>{screen!=='home'&&<a href={ROOT}>Unit 3 home</a>}</footer>
    </main>
    {pending&&<dialog className="u3-dialog" ref={dialog} onCancel={event=>{event.preventDefault();setPending(null)}} aria-labelledby="u3-confirm"><h2 id="u3-confirm">{pending==='reset'?'Reset Unit 3 progress?':'Start a new activity?'}</h2><p>{pending==='reset'?'This clears only the Unit 3 record in this browser. Other units and subjects keep their progress.':'Your skill record stays saved. Your unfinished activity will be replaced.'}</p><div className="u3-actions"><button onClick={()=>setPending(null)}>Keep my place</button><button className="u3-primary" onClick={()=>{if(pending==='reset'){setSaved(newU3());setNotice('');show('home')}else launch(pending);setPending(null)}}>{pending==='reset'?'Reset Unit 3':'Start new activity'}</button></div></dialog>}
  </div>;
}
