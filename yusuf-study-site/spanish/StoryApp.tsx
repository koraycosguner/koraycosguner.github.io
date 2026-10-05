"use client";
import {useEffect,useRef,useState} from 'react';
import {storyScenes, storySchedule, reviewTurns, type StoryTurn} from './story-content';
import {allStoryTurns,availableScene,completedScene,conceptEvidence,markStorySupport,matchesStoryAnswer,newStory,parseStory,recordStoryAttempt,STORY_KEY,suggestedReview,type StoryProgress} from './story-learning';
import {packItems,vocabulary} from './content';
import {shuffle} from './learning';
import StoryGuide from './StoryGuide';
import {actionFor,responseBuilders,storyCues,builderHelp} from './intuitive';
import {ChoiceVisual,Portrait,SupplyArt,TeachingExample} from './LearningVisuals';
import IllustratedRoom from './IllustratedRoom';
import {useSpanishSpeech} from './useSpanishSpeech';
import './story.css';

const ROOT='/quizzes/spanish/unit-2/';
const ART='/quizzes/spanish/school-day/';
const art=['friends','friends','backpack','classes','teamwork','conversation','band'];
const artAlt=['La profesora y los compañeros se reúnen en una clase luminosa.','Los compañeros preparan juntos sus tarjetas en la mesa.','Una mochila abierta sobre una mesa de clase.','Un pasillo lleno de clases por descubrir.','Los compañeros colaboran y organizan sus materiales.','La profesora y los compañeros conversan al final del día.','Una banda de compañeros toca instrumentos en la sala de música.'];
const conceptNames:Record<string,string>={self:'Yo · soy',tu:'Tú · eres',usted:'Usted · es',ella:'Ella · es',nosotros:'Nosotros/as · somos',ustedes:'Ustedes · son',ellos:'Ellos · son',ellas:'Ellas · son',hay:'Hay',objects:'Los útiles',classes:'Mis clases',likes:'Mis gustos',adjectives:'Descripciones',uses:'Usos de SER'};

function Inventory({items,english}:{items:Record<string,number>;english:boolean}) {
  return <section className="day-inventory" aria-label="Mochila de esta actividad"><h3>{english?'Look inside your backpack':'Dentro de tu mochila'}</h3><div>{Object.entries(items).map(([id,count])=>{
    const item=packItems.find(i=>i.id===id);return <div key={id} className={count?'':'day-missing'}><div className="day-packed-pictures">{Array.from({length:count||1},(_,i)=><SupplyArt id={id} key={i}/>)}</div><b>{item?.name??id}</b><small>{count?`${count===1&&id==='tijeras'?'1 par':count} dentro`:'0 · todavía no'}</small></div>;
  })}</div></section>;
}

/** Stable choices and one stage per action, including rapid double clicks. */
function ChoiceBank({options,disabled,wrong,choose,refocus,english}:{options:string[];disabled:boolean;wrong:string;choose:(value:string)=>void;refocus:()=>void;english:boolean}) {
  return <div className="day-choices">{options.map((value,i)=><button key={value} aria-label={value} disabled={disabled} className={wrong===value?'day-try-choice':''} onMouseDown={event=>{if(event.detail>1)event.preventDefault()}} onClick={event=>{if(event.detail<2)choose(value);else refocus()}}><span className="day-choice-number" aria-hidden="true">{i+1}</span><ChoiceVisual value={value} english={english}/><span className="day-choice-arrow" aria-hidden="true">↗</span></button>)}</div>;
}

function TurnCard({turn,english,alreadyDone=false,onAttempt,onNext,nextLabel,onHelp,onSupport,assisted=false,guided=false,autoExample=false}:{turn:StoryTurn;english:boolean;alreadyDone?:boolean;onAttempt:(correct:boolean,assisted:boolean)=>void;onNext:()=>void;nextLabel:string;onHelp:()=>void;onSupport:()=>void;assisted?:boolean;guided?:boolean;autoExample?:boolean}) {
  const [success,setSuccess]=useState(alreadyDone),[wrong,setWrong]=useState(''),[hint,setHint]=useState(false),[answer,setAnswer]=useState(''),[stage,setStage]=useState(0),[words,setWords]=useState<string[]>([]),[support,setSupport]=useState(false);
  const [exampleOpen,setExampleOpen]=useState(autoExample&&!alreadyDone);
  const [wordMode,setWordMode]=useState(guided&&turn.kind==='response');
  const [options]=useState(()=>shuffle(turn.options??[]));
  const stages=turn.stages??responseBuilders[turn.id];
  const [stageOptions]=useState(()=>stages?.map(s=>shuffle(s.options))??[]);
  const isBuilder=turn.kind==='builder'||(turn.kind==='response'&&wordMode&&!!stages);
  const helped=useRef(false),supportSaved=useRef(false),guard=useRef(alreadyDone),nextGuard=useRef(false),stageGuard=useRef(false);
  const input=useRef<HTMLInputElement>(null),heading=useRef<HTMLHeadingElement>(null),feedback=useRef<HTMLDivElement>(null),stagePrompt=useRef<HTMLParagraphElement>(null),exampleFocus=useRef<HTMLDivElement>(null);
  const speech=useSpanishSpeech();
  useEffect(()=>{if(exampleOpen)exampleFocus.current?.focus();else heading.current?.focus()},[exampleOpen]);
  useEffect(()=>{if(success)feedback.current?.focus()},[success]);
  useEffect(()=>{if(stage>0){stagePrompt.current?.focus();stageGuard.current=false}},[stage]);
  useEffect(()=>{if(!alreadyDone&&(autoExample||wordMode)&&!supportSaved.current){supportSaved.current=true;helped.current=true;onSupport()}},[alreadyDone,autoExample,wordMode,onSupport]);
  function markHelp(){helped.current=true;onSupport()}
  function submit(value:string) {
    if(guard.current||stageGuard.current||!value.trim())return;
    if(isBuilder){
      const current=stages![stage];
      if(value!==current.answer){setWrong(value);setHint(true);onAttempt(false,helped.current||assisted);return;}
      const newWords=[...words,value];setWords(newWords);setWrong('');setHint(false);
      if(stage+1<stages!.length){stageGuard.current=true;setStage(stage+1);return;}
      // Word tiles use the same complete-sentence validator as typing.
      const correct=matchesStoryAnswer(turn,newWords.join(' '));
      if(correct){guard.current=true;setSuccess(true)}else{setHint(true)}
      onAttempt(correct,helped.current||assisted);return;
    }
    const correct=matchesStoryAnswer(turn,value);setAnswer(value);
    if(correct){guard.current=true;setSuccess(true);setWrong('')}else{setWrong(value);setHint(true)}
    onAttempt(correct,helped.current||assisted);
  }
  const shownInventory=success&&turn.inventorySet?turn.inventorySet:turn.inventory;
  return <section className="day-turn" data-turn={turn.id} aria-label="Conversación de la historia">
    {exampleOpen&&!success?<div ref={exampleFocus} tabIndex={-1}><TeachingExample concept={turn.concept} turn={turn} english={english} tryIt={()=>setExampleOpen(false)} listen={speech.listen} canListen={speech.canListen}/></div>:<>
      <span className="learn-task-label" lang={english?'en':'es'}>{english?'Your turn':'Tu turno'}</span>
      <h2 ref={heading} tabIndex={-1} className="learn-action" lang={english?'en':'es'}>{actionFor(turn,english)}</h2>
      <div className="day-speaker"><Portrait name={turn.speaker}/><div><small lang={english?'en':'es'}>{english?'Talking to you':'Te habla'}</small><b>{turn.speaker}</b></div><span className="day-response-as" lang={english?'en':'es'}>{english?'You answer as':'Respondes como'} <b>{turn.responseAs??'Yusuf'}</b></span></div>
      <div className="learn-dialogue"><p lang="es">{turn.prompt}</p><button onClick={()=>speech.listen(turn.prompt)} disabled={!speech.canListen} aria-label="Listen to Spanish dialogue">♫</button></div>
      {storyCues[turn.id]&&<p className="learn-story-cue" lang="es">{storyCues[turn.id]}</p>}
      {turn.focusPeople&&<div className="day-people" aria-label="Personas en esta conversación">{turn.focusPeople.map(p=><span key={p}><Portrait name={p}/>{p==='Yusuf'?(english?'Me · Yusuf':'Yo · Yusuf'):p}</span>)}</div>}
      {shownInventory&&<Inventory items={shownInventory} english={english}/>}
      {turn.visual==='schedule'&&<div className="day-schedule" aria-label="Horario ficticio">{storySchedule.map(row=><div key={row.time}><time>{row.time}</time><span>{row.subject}</span></div>)}</div>}
      {turn.visual==='clock'&&<div className="day-clock" aria-label="Reloj: diez en punto"><span aria-hidden="true">◷</span><time>10:00</time><small>Hora de ciencias</small></div>}
      {(turn.id==='rehearsal-event'||turn.id==='final-event')&&<div className="day-event-poster"><b>ENSAYO</b><span>Sala de música · 13:00</span></div>}
      {!success&&isBuilder&&<div className="day-builder"><div aria-label="Tu frase" aria-live="polite">{words.length?words.map((w,i)=><span key={i}>{w}</span>):<small>{english?'Tap words to build your sentence…':'Toca palabras para construir tu frase…'}</small>}<span className="day-word-slot" aria-hidden="true">…</span></div><p ref={stagePrompt} tabIndex={-1} aria-live="polite"><b>{stage+1} / {stages!.length}</b> {stages![stage].prompt}{english&&builderHelp[turn.id]?.[stage]&&<small className="learn-stage-translation" lang="en">{builderHelp[turn.id][stage]}</small>}</p></div>}
      {!success&&(turn.kind==='choice'||isBuilder)&&<ChoiceBank options={isBuilder?stageOptions[stage]:options} english={english} disabled={success} wrong={wrong} choose={submit} refocus={()=>stagePrompt.current?.focus()}/>}
      {!success&&turn.kind==='response'&&!wordMode&&<form onSubmit={e=>{e.preventDefault();submit(answer)}}><label htmlFor="day-answer">Tu respuesta en español</label><div className="day-input-row"><input ref={input} id="day-answer" value={answer} autoComplete="off" maxLength={180} onChange={e=>setAnswer(e.target.value)} placeholder={turn.starter??'Escribe una frase corta…'}/><button className="day-primary" disabled={!answer.trim()}>Comprobar</button></div><div className="day-accent-keys">{['á','é','í','ó','ú','ñ','¿'].map(c=><button key={c} type="button" aria-label={`Añadir ${c}`} onClick={()=>{const start=input.current?.selectionStart??answer.length,end=input.current?.selectionEnd??answer.length;setAnswer(answer.slice(0,start)+c+answer.slice(end));requestAnimationFrame(()=>{input.current?.focus();input.current?.setSelectionRange(start+1,start+1)})}}>{c}</button>)}</div>{support&&<p className="day-writing-support">Empieza: <b>{turn.starter??turn.model.split(' ').slice(0,2).join(' ')+'…'}</b> <span>La guía tiene las palabras y los patrones.</span></p>}</form>}
      {!success&&turn.kind==='response'&&stages&&<button className="learn-mode-switch" onClick={()=>{if(!wordMode)markHelp();setWordMode(v=>!v);setWrong('');setHint(false);setStage(0);setWords([]);stageGuard.current=false}}>{wordMode?(english?'I want to type instead':'Prefiero escribir'):(english?'Build with word tiles':'Construir con palabras')}</button>}
      {!success&&<details className="learn-help"><summary>{english?'Help me':'Ayúdame'}</summary><div className="day-hint-actions"><button onClick={()=>{markHelp();setHint(true)}}>Una pista</button><button onClick={()=>{markHelp();setExampleOpen(true)}}>{english?'Show an example':'Ver un ejemplo'}</button>{turn.kind==='response'&&!wordMode&&<button onClick={()=>{markHelp();setSupport(true);requestAnimationFrame(()=>input.current?.focus())}}>Ayúdame a empezar</button>}<button onClick={()=>{markHelp();onHelp()}}>Abrir mi guía ↗</button></div></details>}
      {!success&&hint&&<div className="day-hint" role="status"><b>{wrong?'Casi. Prueba otra vez.':'Una pista para ti'}</b><p>{isBuilder?stages![stage].prompt:turn.hint}</p>{english&&<small>{isBuilder?'Check the person, then choose the matching word.':turn.help}</small>}</div>}
      <details className="learn-context"><summary>{english?'What is happening? · English help':'¿Qué pasa aquí?'}</summary><p lang="es">{turn.context}</p>{english&&<p lang="en">{turn.help}</p>}</details>
      {success&&<div ref={feedback} tabIndex={-1} className="day-success" role="status"><span className="day-success-check" aria-hidden="true">✓</span><div><b>¡Lo tienes!</b><p className="day-model" lang="es">{turn.model}</p><details><summary>{english?'Why it works':'¿Por qué funciona?'}</summary><p>{turn.success}</p>{turn.serUse&&<small>✦ Guía de SER · {turn.serUse}</small>}</details></div><button className="day-primary" onClick={()=>{if(nextGuard.current)return;nextGuard.current=true;onNext()}}>{nextLabel} →</button></div>}
    </>}
    {!speech.canListen&&<small className="learn-audio-note" lang="en">Audio is optional. No Spanish voice is available here.</small>}
    {speech.notice&&<small className="learn-audio-note" role="status" lang="en">{speech.notice}</small>}
  </section>;
}

export default function StoryApp({checkpoint=false}:{checkpoint?:boolean}) {
  const [progress,setProgress]=useState<StoryProgress>(newStory);const [ready,setReady]=useState(false);const [warning,setWarning]=useState('');
  const [screen,setScreen]=useState<'home'|'story'|'pause'|'break'|'reward'|'review'|'checkpoint'|'result'>('home');const [guide,setGuide]=useState(false);const [reset,setReset]=useState(false);
  const [practice,setPractice]=useState<StoryTurn[]>([]);const [practiceIndex,setPracticeIndex]=useState(0);const [practiceResults,setPracticeResults]=useState<Record<string,{first:boolean;assisted:boolean}>>({});const [practiceKind,setPracticeKind]=useState('checkpoint');const [practiceSupport,setPracticeSupport]=useState<Record<string,boolean>>({});
  const [objectIndex,setObjectIndex]=useState(0);const [objectOpen,setObjectOpen]=useState<string|null>(null);const [sound,setSound]=useState(false);const audio=useRef<AudioContext|null>(null);
  const resetDialog=useRef<HTMLDialogElement>(null);const previousResetFocus=useRef<HTMLElement|null>(null);const screenHeading=useRef<HTMLHeadingElement>(null);
  useEffect(()=>{try{setProgress(parseStory(window.localStorage.getItem(STORY_KEY)))}catch{setWarning('No se pudo leer tu progreso. Puedes jugar y empezar un registro nuevo.')}setReady(true)},[]);
  useEffect(()=>{if(!ready)return;try{window.localStorage.setItem(STORY_KEY,JSON.stringify(progress))}catch{setWarning('Guardado no disponible. Puedes seguir jugando durante esta visita.')}},[progress,ready]);
  useEffect(()=>{screenHeading.current?.focus()},[screen]);
  useEffect(()=>{if(reset){previousResetFocus.current=document.activeElement as HTMLElement;resetDialog.current?.showModal()}else previousResetFocus.current?.focus()},[reset]);
  useEffect(()=>()=>{audio.current?.close().catch(()=>{})},[]);
  const sceneIndex=Math.max(0,storyScenes.findIndex(s=>s.turns.some(t=>t.id===progress.cursor)));
  const scene=storyScenes[sceneIndex];const turnIndex=Math.max(0,scene.turns.findIndex(t=>t.id===progress.cursor));const turn=scene.turns[turnIndex];
  const completed=allStoryTurns.filter(t=>progress.evidence[t.id]?.complete).length;
  const canCelebrate=storyScenes.every((_,i)=>completedScene(progress,i));
  const review=suggestedReview(progress);
  function goToScene(index:number) {
    if(!availableScene(progress,index))return;
    const first=storyScenes[index].turns.find(t=>!progress.evidence[t.id]?.complete)??storyScenes[index].turns[0];
    setProgress(p=>({...p,started:true,cursor:first.id}));setScreen('story');
  }
  function advance() {
    if(turnIndex+1<scene.turns.length){setProgress(p=>({...p,cursor:scene.turns[turnIndex+1].id}));if(turnIndex===2)setScreen('pause');}
    else setScreen(sceneIndex===storyScenes.length-1?'reward':'break');
  }
  function startPractice(kind:'review'|'checkpoint') {
    const ids=['welcome-reply','welcome-tu','bag-absent','supplies-erase','schedule-next','schedule-math-like','hall-ana-organized','final-group'];
    const chosen=kind==='review'?(review.length?review:reviewTurns.slice(0,4)):ids.map(id=>allStoryTurns.find(t=>t.id===id)).filter((t):t is StoryTurn=>!!t);
    setPractice(chosen);setPracticeIndex(0);setPracticeResults({});setPracticeSupport({});setPracticeKind(kind);setScreen(kind);
  }
  function markSupport() {
    if(screen==='story')setProgress(p=>markStorySupport(p,turn));
    else if((screen==='review'||screen==='checkpoint')&&practice[practiceIndex]){
      const q=practice[practiceIndex];setPracticeSupport(s=>({...s,[q.id]:true}));
      if(screen==='review')setProgress(p=>markStorySupport(p,q));
    }
  }
  function openGuide() {markSupport();setGuide(true)}
  function practiceAttempt(correct:boolean,assisted:boolean) {
    const q=practice[practiceIndex];setPracticeResults(r=>r[q.id]?r:{...r,[q.id]:{first:correct,assisted}});
    if(practiceKind==='review')setProgress(p=>recordStoryAttempt(p,q,correct,assisted));
  }
  function playNote(frequency:number) {
    if(!sound)return;
    try{audio.current??=new AudioContext();void audio.current.resume();const context=audio.current;const tone=context.createOscillator();const volume=context.createGain();tone.type='sine';tone.frequency.value=frequency;tone.connect(volume);volume.connect(context.destination);volume.gain.setValueAtTime(.0001,context.currentTime);volume.gain.exponentialRampToValueAtTime(.18,context.currentTime+.025);volume.gain.exponentialRampToValueAtTime(.0001,context.currentTime+.5);tone.start();tone.stop(context.currentTime+.55)}catch{setWarning('Audio no disponible. Puedes seguir con las palabras y los instrumentos.');setSound(false)}
  }
  const currentPractice=practice[practiceIndex];
  const displayHome=screen==='home';
  return <div className="school-day" lang="es" data-ready={ready} data-screen={screen} aria-busy={!ready}>
    <a className="day-skip" href="#day-main">Ir a la actividad</a>
    <header className="day-topbar"><a className="day-brand" href="/"><span>Y7</span><b>Yusuf’s study club</b></a><nav aria-label="Spanish study navigation"><a href={ROOT} aria-current={!checkpoint?'page':undefined}>Aventura</a><a href={ROOT+'quiz/'}>Quiz con nota</a><button onClick={openGuide}>Mi guía</button></nav><button className="day-english" aria-pressed={progress.english} onClick={()=>setProgress(p=>({...p,english:!p.english}))}>English {progress.english?'on':'off'}</button></header>
    <main id="day-main">
      {warning&&<p className="day-save-warning" role="status">{warning}{progress.english&&' Progress can stay in this visit even if browser storage is unavailable.'}</p>}
      <div className="day-page-heading"><div><span className="day-kicker">Español · Unidad 2</span><h1>Un día en la escuela</h1></div>{ready&&<div className="day-total-progress"><span>{storyScenes.filter((_,i)=>completedScene(progress,i)).length} / 7 lugares</span><progress aria-label="Progreso de la historia" value={completed} max={allStoryTurns.length}/></div>}</div>
      {displayHome&&<>
        <section className="day-welcome"><div className="day-welcome-art"><img src={ART+'classroom-panorama.webp'} alt="Una clase acogedora con materiales, libros y un pasillo por descubrir." width="1280" height="853" fetchPriority="high"/><span className="day-art-label">Tu clase · tu aventura</span></div><div className="day-welcome-copy"><span className="day-kicker">Español en pequeños pasos</span><h2 ref={screenHeading} tabIndex={-1}>{checkpoint?'Una pequeña parada':progress.english?'Ready to meet your class?':'¿Conocemos a tu clase?'}</h2><p>{progress.english?'See an example. Tap your answer. Meet a new friend.':'Mira un ejemplo. Toca tu respuesta. Conoce a un compañero.'}</p><div className="learn-welcome-steps"><span><b>1</b>{progress.english?'Watch':'Mira'}</span><span><b>2</b>{progress.english?'Try':'Prueba'}</span><span><b>3</b>{progress.english?'Celebrate':'Celebra'}</span></div><button className="day-primary" disabled={!ready} onClick={()=>{if(checkpoint)startPractice('checkpoint');else if(canCelebrate)setScreen('reward');else{setProgress(p=>({...p,started:true}));setScreen('story')}}}>{checkpoint?'Comenzar checkpoint':canCelebrate?'Volver a la banda':progress.started?'Continuar mi día':'Entrar en la clase'} <span aria-hidden="true">→</span></button><small>{progress.started&&!checkpoint&&!canCelebrate?`Continúas en: ${scene.location}`:progress.english?'No timer. Take a break whenever you like.':'Sin reloj. Descansa cuando quieras.'}</small></div></section>
        <details className="learn-path"><summary>{progress.english?'Show my school-day map':'Ver el mapa de mi día'}</summary><section className="day-map" aria-labelledby="day-map-title"><div className="day-section-heading"><div><span className="day-kicker">Sigue el camino</span><h2 id="day-map-title">Tu día, lugar por lugar</h2></div><span>{storyScenes.filter((_,i)=>completedScene(progress,i)).length} de 7 visitados</span></div><div className="day-map-grid">{storyScenes.map((s,i)=><button key={s.id} disabled={!ready||!availableScene(progress,i)} onClick={()=>goToScene(i)} aria-label={`${i+1}. ${s.location}${completedScene(progress,i)?' · completado':''}`}><img src={ART+art[i]+'.webp'} alt="" width="384" height="256" loading="lazy"/><span className="day-map-number">{completedScene(progress,i)?'✓':i+1}</span><div><small>{s.location}</small><b>{s.title}</b><span>{completedScene(progress,i)?'Volver a visitar':availableScene(progress,i)?'Adelante →':'Después de la parada anterior'}</span></div></button>)}</div></section></details>
        <details className="learn-more"><summary>{progress.english?'More activities · quiz and classroom':'Más actividades · quiz y clase'}</summary><div className="day-side-paths"><a href={ROOT+'quiz/'}><b>El gran quiz · 60 preguntas ↗</b><span>Una nota de práctica privada, solo en este navegador.</span></a><button onClick={()=>startPractice('checkpoint')}><b>Checkpoint · 8 pasos →</b><span>Elige, construye una frase y conversa.</span></button><a href={ROOT+'explore/'}><b>Explora tu clase ↗</b><span>Una clase ilustrada interactiva y una vista 3D opcional.</span></a></div></details>
      </>}
      {(screen==='story'||screen==='review'||screen==='checkpoint')&&<>
        <div className="day-journey-toolbar"><button onClick={()=>setScreen('home')}>← Mi día</button><span>{screen==='story'?`Parada ${sceneIndex+1} de 7 · ${turnIndex+1} / ${scene.turns.length}`:`${screen==='review'?'Otra charla':'Checkpoint'} · ${practiceIndex+1} / ${practice.length}`}</span><button onClick={openGuide}>Guía de campo</button></div>
        <div className="day-conversation-layout"><aside className="day-scene-panel">{screen==='story'&&sceneIndex<2?<IllustratedRoom compact english={progress.english} onInspect={markSupport}/>:<img src={ART+(screen==='story'?art[sceneIndex]:'friends')+'.webp'} alt={screen==='story'?artAlt[sceneIndex]:artAlt[1]} width="1536" height="1024"/>}<div><span className="day-kicker">{screen==='story'?scene.location:'Un poco más con tus compañeros'}</span><h2>{screen==='story'?scene.title:'¡Vamos juntos!'}</h2><details className="learn-scene-story"><summary>{progress.english?'About this place':'Sobre este lugar'}</summary><p>{screen==='story'?scene.intro:'Unas conversaciones cortas antes de seguir. Las pistas y tu guía siguen aquí.'}</p></details></div><div className="day-scene-dots" aria-label="Lugares del día">{storyScenes.map((s,i)=><span key={s.id} className={i===sceneIndex?'active':completedScene(progress,i)?'done':''} aria-label={`${s.location}${i===sceneIndex?' · aquí':''}`}>{completedScene(progress,i)?'✓':i+1}</span>)}</div></aside>
          {screen==='story'?<TurnCard key={turn.id} turn={turn} english={progress.english} guided={progress.guided} autoExample={progress.guided&&!allStoryTurns.some(t=>t.concept===turn.concept&&progress.evidence[t.id]?.complete)} alreadyDone={!!progress.evidence[turn.id]?.complete} onAttempt={(correct,assisted)=>setProgress(p=>recordStoryAttempt(p,turn,correct,assisted))} onNext={advance} nextLabel={turnIndex+1===scene.turns.length?'Terminar esta parada':'Continuar'} onHelp={openGuide} onSupport={markSupport} assisted={!!progress.evidence[turn.id]?.assisted}/>:currentPractice&&<TurnCard key={currentPractice.id+'-'+practiceIndex} turn={currentPractice} english={progress.english} onAttempt={practiceAttempt} onNext={()=>{if(practiceIndex+1<practice.length)setPracticeIndex(i=>i+1);else setScreen('result')}} nextLabel={practiceIndex+1===practice.length?'Ver mi recorrido':'Continuar'} onHelp={openGuide} onSupport={markSupport} assisted={!!practiceSupport[currentPractice.id]||(screen==='review'&&!progress.evidence[currentPractice.id]?.complete&&!!progress.evidence[currentPractice.id]?.assisted)}/>}
        </div>
      </>}
      {screen==='pause'&&<section className="day-mini-break"><div className="learn-break-cast"><Portrait name="Mateo" size="large"/><Portrait name="Sofía" size="large"/></div><span className="day-kicker">✓ 3 pequeños pasos</span><h2 ref={screenHeading} tabIndex={-1}>{progress.english?'Nice work. Ready for more?':'¡Muy bien! ¿Seguimos?'}</h2><p>{progress.english?'Your place is saved. Stretch, or try the next small step.':'Tu lugar está guardado. Descansa o prueba el siguiente paso.'}</p><button className="day-primary" onClick={()=>setScreen('story')}>{progress.english?'Keep going':'Seguir'} →</button><button onClick={()=>setScreen('home')}>{progress.english?'Take a break':'Descansar'}</button></section>}
      {screen==='break'&&<section className="day-stop"><img src={ART+art[sceneIndex]+'.webp'} alt={artAlt[sceneIndex]} width="1536" height="1024"/><div><span className="day-kicker">✓ Parada {sceneIndex+1} completada</span><h2 ref={screenHeading} tabIndex={-1}>¡Un paso más juntos!</h2><p>{storyScenes[sceneIndex+1]?.intro}</p><button className="day-primary" onClick={()=>goToScene(sceneIndex+1)}>Ir a {storyScenes[sceneIndex+1]?.location.toLocaleLowerCase('es')} →</button><button className="day-text-button" onClick={()=>setScreen('home')}>Guardar mi lugar y descansar</button>{review.length>0&&<button className="day-text-button" onClick={()=>startPractice('review')}>Otra charla con mis compañeros</button>}</div></section>}
      {screen==='result'&&<section className="day-practice-result"><span className="day-reward-symbol" aria-hidden="true">✦</span><h2 ref={screenHeading} tabIndex={-1}>¡Conversación completada!</h2><p><b>{Object.values(practiceResults).filter(r=>r.first&&!r.assisted).length} / {practice.length}</b> respuestas al primer intento, sin pistas.</p><p>Las otras respuestas también son práctica. Sigue explorando a tu ritmo.</p><div className="day-result-tags">{[...new Set(practice.map(t=>t.concept))].map(c=><span key={c}>{conceptNames[c]}</span>)}</div><button className="day-primary" onClick={()=>setScreen('home')}>Volver a mi día →</button><a href={ROOT+'quiz/'}>Ir al quiz con nota ↗</a></section>}
      {screen==='reward'&&canCelebrate&&<>
        <section className="day-reward"><img src={ART+'band.webp'} alt={artAlt[6]} width="1536" height="1024"/><div><span className="day-kicker">✦ Los 7 lugares completados</span><h2 ref={screenHeading} tabIndex={-1}>¡Somos una banda!</h2><p>«Yo soy músico. Tú eres músico. ¡Nosotros somos músicos!»</p><p>Mateo, Sofía, Carlos y Ana te esperan. Elige un sonido y crea tu propio final.</p><button aria-pressed={sound} onClick={()=>setSound(s=>!s)}>Sonido {sound?'activado':'desactivado'}</button><div className="day-band-keys">{[['Do',261.63],['Mi',329.63],['Sol',392]].map(([name,f])=><button key={name} onClick={()=>playNote(Number(f))} disabled={!sound}>{name}<span aria-hidden="true">♫</span></button>)}</div><small>Solo suena al tocar. Sin grabación ni micrófono.</small></div></section>
        <div className="day-reward-actions"><button className="day-primary" onClick={()=>startPractice('review')}>Otra charla con mis compañeros</button><button onClick={()=>startPractice('checkpoint')}>Probar el checkpoint</button><a href={ROOT+'quiz/'}>El gran quiz con nota ↗</a><button onClick={()=>setScreen('home')}>Ver mi día</button></div>
      </>}
      {(displayHome||screen==='reward')&&<details className="day-discover"><summary>Más descubrimientos · los objetos de la clase</summary><p>Toca un objeto para descubrir cómo se usa.</p><div className="day-object-bank">{vocabulary.slice(objectIndex,objectIndex+3).map(([id,es])=><button key={id} onClick={()=>{setObjectOpen(id);setProgress(p=>({...p,seenObjects:[...new Set([...p.seenObjects,id])]}))}}><SupplyArt id={id}/>{es}{progress.seenObjects.includes(id)&&<small>✓</small>}</button>)}</div>{objectOpen&&<p className="day-object-detail" role="status">{vocabulary.find(v=>v[0]===objectOpen)?.[3]} {progress.english&&vocabulary.find(v=>v[0]===objectOpen)?.[2]}</p>}<div className="day-object-pager"><button disabled={objectIndex===0} onClick={()=>{setObjectIndex(i=>Math.max(0,i-3));setObjectOpen(null)}}>← Anteriores</button><span>{Math.floor(objectIndex/3)+1} / {Math.ceil(vocabulary.length/3)}</span><button disabled={objectIndex+3>=vocabulary.length} onClick={()=>{setObjectIndex(i=>i+3);setObjectOpen(null)}}>Más objetos →</button></div></details>}
      {displayHome&&completed>0&&<details className="day-evidence"><summary>Mi cuaderno de práctica</summary><p>Primer intento sin pistas / conversaciones intentadas. Tus correcciones también quedan registradas.</p><div>{Object.entries(conceptEvidence(progress)).map(([id,s])=><p key={id}><b>{conceptNames[id]}</b><span>{s.independent} / {s.attempted} · {s.completed} completadas</span></p>)}</div>{review.length>0&&<button onClick={()=>startPractice('review')}>Otra charla con mis compañeros</button>}</details>}
      <footer className="day-footer"><button aria-pressed={progress.guided} onClick={()=>setProgress(p=>({...p,guided:!p.guided}))}>{progress.english?'Examples & word tiles':'Ejemplos y palabras'}: {progress.guided?'on':'off'}</button><span>Tu progreso se guarda solo en este navegador.</span><span>Personajes e ilustraciones de práctica ficticios.</span><button onClick={()=>setReset(true)}>Reiniciar esta historia</button></footer>
    </main>
    {guide&&<StoryGuide progress={progress} close={()=>setGuide(false)}/>}
    {reset&&<dialog ref={resetDialog} className="day-reset" aria-labelledby="day-reset-title" onCancel={e=>{e.preventDefault();setReset(false)}}><h2 id="day-reset-title">¿Empezar otro día?</h2><p>Se borra solo el progreso de esta historia en este navegador. Tus notas del quiz y las otras materias se conservan.</p><button className="day-primary" onClick={()=>{setProgress(newStory());setScreen('home');setReset(false)}}>Reiniciar historia</button><button onClick={()=>setReset(false)}>Conservar mi progreso</button></dialog>}
  </div>;
}
