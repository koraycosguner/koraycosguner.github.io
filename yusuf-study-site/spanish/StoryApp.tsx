"use client";
import {useEffect,useRef,useState} from 'react';
import {storyScenes, storySchedule, reviewTurns, type StoryTurn} from './story-content';
import {allStoryTurns,availableScene,completedScene,conceptEvidence,markStorySupport,matchesStoryAnswer,newStory,parseStory,recordStoryAttempt,STORY_KEY,suggestedReview,type StoryProgress} from './story-learning';
import {packItems,vocabulary} from './content';
import {shuffle} from './learning';
import StoryGuide from './StoryGuide';
import './story.css';

const ROOT='/quizzes/spanish/unit-2/';
const ART='/quizzes/spanish/school-day/';
const art=['friends','friends','backpack','classes','teamwork','conversation','band'];
const artAlt=['La profesora y los compañeros se reúnen en una clase luminosa.','Los compañeros preparan juntos sus tarjetas en la mesa.','Una mochila abierta sobre una mesa de clase.','Un pasillo lleno de clases por descubrir.','Los compañeros colaboran y organizan sus materiales.','La profesora y los compañeros conversan al final del día.','Una banda de compañeros toca instrumentos en la sala de música.'];
const objectSymbols:Record<string,string>={lapiz:'✏️',cuaderno:'📓',tijeras:'✂️',borrador:'▱',regla:'📏',libro:'📚',calculadora:'🧮',carpeta:'📂',boligrafo:'🖊️'};
const conceptNames:Record<string,string>={self:'Yo · soy',tu:'Tú · eres',usted:'Usted · es',ella:'Ella · es',nosotros:'Nosotros/as · somos',ustedes:'Ustedes · son',ellos:'Ellos · son',ellas:'Ellas · son',hay:'Hay',objects:'Los útiles',classes:'Mis clases',likes:'Mis gustos',adjectives:'Descripciones',uses:'Usos de SER'};

function Inventory({items}:{items:Record<string,number>}) {
  return <section className="day-inventory" aria-label="Mochila de esta actividad"><h3>Dentro de tu mochila</h3><div>{Object.entries(items).map(([id,count])=>{
    const item=packItems.find(i=>i.id===id);return <div key={id} className={count?'':'day-missing'}><span aria-hidden="true">{objectSymbols[id]??'◈'}</span><b>{item?.name??id}</b><small>{count?`${count===1&&id==='tijeras'?'1 par':count} dentro`:'0 · todavía no'}</small></div>;
  })}</div></section>;
}

/** One reusable three-choice bank. Choice order is stable during retries. */
function ChoiceBank({options,disabled,wrong,choose,refocus}:{options:string[];disabled:boolean;wrong:string;choose:(value:string)=>void;refocus:()=>void}) {
  return <div className="day-choices">{options.map((value,i)=><button key={value} disabled={disabled} className={wrong===value?'day-try-choice':''} onMouseDown={event=>{if(event.detail>1)event.preventDefault()}} onClick={event=>{if(event.detail<2)choose(value);else refocus()}}><span aria-hidden="true">{i+1}</span><b lang="es">{value}</b><span className="day-choice-arrow" aria-hidden="true">↗</span></button>)}</div>;
}

function TurnCard({turn,english,alreadyDone=false,onAttempt,onNext,nextLabel,onHelp,onSupport,assisted=false}:{turn:StoryTurn;english:boolean;alreadyDone?:boolean;onAttempt:(correct:boolean,assisted:boolean)=>void;onNext:()=>void;nextLabel:string;onHelp:()=>void;onSupport:()=>void;assisted?:boolean}) {
  const [success,setSuccess]=useState(alreadyDone);const [wrong,setWrong]=useState('');const [hint,setHint]=useState(false);const [answer,setAnswer]=useState('');const [stage,setStage]=useState(0);const [words,setWords]=useState<string[]>([]);const [support,setSupport]=useState(false);
  const [options]=useState(()=>shuffle(turn.options??[]));
  const [stageOptions]=useState(()=>turn.stages?.map(s=>shuffle(s.options))??[]);
  const helped=useRef(false);const guard=useRef(alreadyDone);const nextGuard=useRef(false);const input=useRef<HTMLInputElement>(null);const heading=useRef<HTMLHeadingElement>(null);const feedback=useRef<HTMLDivElement>(null);const stagePrompt=useRef<HTMLParagraphElement>(null);const stageGuard=useRef(false);
  useEffect(()=>{heading.current?.focus()},[]);
  useEffect(()=>{if(success)feedback.current?.focus()},[success]);
  useEffect(()=>{if(stage>0){stagePrompt.current?.focus();stageGuard.current=false}},[stage]);
  function submit(value:string) {
    if(guard.current||stageGuard.current||!value.trim())return;
    if(turn.kind==='builder'){
      const current=turn.stages![stage];
      if(value!==current.answer){setWrong(value);setHint(true);onAttempt(false,helped.current||assisted);return;}
      const newWords=[...words,value];setWords(newWords);setWrong('');
      if(stage+1<turn.stages!.length){stageGuard.current=true;setStage(stage+1);return;}
      guard.current=true;setSuccess(true);onAttempt(true,helped.current||assisted);return;
    }
    const correct=matchesStoryAnswer(turn,value);
    setAnswer(value);
    if(correct){guard.current=true;setSuccess(true);setWrong('');}else{setWrong(value);setHint(true);}
    onAttempt(correct,helped.current||assisted);
  }
  const shownInventory=success&&turn.inventorySet?turn.inventorySet:turn.inventory;
  return <section className="day-turn" data-turn={turn.id} aria-label="Conversación de la historia">
    <div className="day-speaker"><span className="day-person-dot" aria-hidden="true">{turn.speaker==='Sra. Abarca'?'SA':turn.speaker.slice(0,1)}</span><div><small>Te habla</small><b>{turn.speaker}</b></div><span className="day-response-as">Respondes como <b>{turn.responseAs??'Yusuf'}</b></span></div>
    <p className="day-context" lang="es">{turn.context}</p>
    {turn.focusPeople&&<div className="day-people" aria-label="Personas en esta conversación">{turn.focusPeople.map(p=><span key={p}>{p==='Yusuf'?'Tú · Yusuf':p}</span>)}</div>}
    {shownInventory&&<Inventory items={shownInventory}/>}
    {turn.visual==='schedule'&&<div className="day-schedule" aria-label="Horario ficticio">{storySchedule.map(row=><div key={row.time}><time>{row.time}</time><span>{row.subject}</span></div>)}</div>}
    {turn.visual==='clock'&&<div className="day-clock" aria-label="Reloj: diez en punto"><span aria-hidden="true">◷</span><time>10:00</time><small>Hora de ciencias</small></div>}
    {turn.id==='rehearsal-event'&&<div className="day-event-poster"><b>ENSAYO</b><span>Sala de música · 13:00</span></div>}
    <h2 ref={heading} tabIndex={-1} lang="es">{turn.prompt}</h2>
    {english&&<p className="day-translation" lang="en">{turn.help}</p>}
    {turn.kind==='builder'&&!success&&<div className="day-builder"><div aria-label="Tu frase" aria-live="polite">{words.length?words.map((w,i)=><span key={i}>{w}</span>):<small>Tu frase empieza aquí…</small>}<span className="day-word-slot" aria-hidden="true">…</span></div><p ref={stagePrompt} tabIndex={-1} aria-live="polite"><b>{stage+1} / {turn.stages!.length}</b> {turn.stages![stage].prompt}</p></div>}
    {!success&&(turn.kind==='choice'||turn.kind==='builder')&&<ChoiceBank options={turn.kind==='builder'?stageOptions[stage]:options} disabled={success} wrong={wrong} choose={submit} refocus={()=>stagePrompt.current?.focus()}/>}
    {!success&&turn.kind==='response'&&<form onSubmit={e=>{e.preventDefault();submit(answer)}}><label htmlFor="day-answer">Tu respuesta en español</label><div className="day-input-row"><input ref={input} id="day-answer" value={answer} autoComplete="off" maxLength={180} onChange={e=>setAnswer(e.target.value)} placeholder={turn.starter??'Escribe una frase corta…'}/><button className="day-primary" disabled={!answer.trim()}>Comprobar</button></div><div className="day-accent-keys">{['á','é','í','ó','ú','ñ','¿'].map(c=><button key={c} type="button" aria-label={`Añadir ${c}`} onClick={()=>{const start=input.current?.selectionStart??answer.length,end=input.current?.selectionEnd??answer.length;setAnswer(answer.slice(0,start)+c+answer.slice(end));requestAnimationFrame(()=>{input.current?.focus();input.current?.setSelectionRange(start+1,start+1)})}}>{c}</button>)}</div>{support&&<p className="day-writing-support">Empieza: <b>{turn.starter??turn.model.split(' ').slice(0,2).join(' ')+'…'}</b> <span>La guía tiene las palabras y los patrones.</span></p>}</form>}
    {!success&&<div className="day-hint-actions"><button onClick={()=>{helped.current=true;onSupport();setHint(true)}}>Una pista</button>{turn.kind==='response'&&<button onClick={()=>{helped.current=true;onSupport();setSupport(true);requestAnimationFrame(()=>input.current?.focus())}}>Ayúdame a empezar</button>}<button onClick={()=>{helped.current=true;onSupport();onHelp()}}>Abrir mi guía ↗</button></div>}
    {!success&&hint&&<div className="day-hint" role="status"><b>{wrong?'Casi. Prueba otra vez.':'Una pista para ti'}</b><p>{turn.hint}</p></div>}
    {success&&<div ref={feedback} tabIndex={-1} className="day-success" role="status"><span className="day-success-check" aria-hidden="true">✓</span><div><b>¡Lo tienes!</b><p className="day-model" lang="es">{turn.model}</p><p>{turn.success}</p>{turn.serUse&&<small>✦ Guía de SER · {turn.serUse}</small>}</div><button className="day-primary" onClick={()=>{if(nextGuard.current)return;nextGuard.current=true;onNext()}}>{nextLabel} →</button></div>}
  </section>;
}

export default function StoryApp({checkpoint=false}:{checkpoint?:boolean}) {
  const [progress,setProgress]=useState<StoryProgress>(newStory);const [ready,setReady]=useState(false);const [warning,setWarning]=useState('');
  const [screen,setScreen]=useState<'home'|'story'|'break'|'reward'|'review'|'checkpoint'|'result'>('home');const [guide,setGuide]=useState(false);const [reset,setReset]=useState(false);
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
    if(turnIndex+1<scene.turns.length)setProgress(p=>({...p,cursor:scene.turns[turnIndex+1].id}));
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
  return <div className="school-day" lang="es" data-ready={ready} aria-busy={!ready}>
    <a className="day-skip" href="#day-main">Ir a la actividad</a>
    <header className="day-topbar"><a className="day-brand" href="/"><span>Y7</span><b>Yusuf’s study club</b></a><nav aria-label="Spanish study navigation"><a href={ROOT} aria-current={!checkpoint?'page':undefined}>Aventura</a><a href={ROOT+'quiz/'}>Quiz con nota</a><button onClick={openGuide}>Mi guía</button></nav><button className="day-english" aria-pressed={progress.english} onClick={()=>setProgress(p=>({...p,english:!p.english}))}>English {progress.english?'on':'off'}</button></header>
    <main id="day-main">
      {warning&&<p className="day-save-warning" role="status">{warning}{progress.english&&' Progress can stay in this visit even if browser storage is unavailable.'}</p>}
      <div className="day-page-heading"><div><span className="day-kicker">Español · Unidad 2</span><h1>Un día en la escuela</h1></div>{ready&&<div className="day-total-progress"><span>{completed} / {allStoryTurns.length} pasos</span><progress aria-label="Progreso de la historia" value={completed} max={allStoryTurns.length}/></div>}</div>
      {displayHome&&<>
        <section className="day-welcome"><div className="day-welcome-art"><img src={ART+'friends.webp'} alt={artAlt[0]} width="1536" height="1024" fetchPriority="high"/><span className="day-art-label">Tu historia empieza aquí</span></div><div className="day-welcome-copy"><span className="day-kicker">Una clase. Un grupo. Tu aventura.</span><h2 ref={screenHeading} tabIndex={-1}>{checkpoint?'Una pequeña parada':'¡La banda nos espera!'}</h2><p lang="es">Conoce a tus compañeros, prepara tu mochila y llega a la sala de música. Una conversación a la vez.</p>{progress.english&&<p className="day-translation" lang="en">Meet the class and get ready for the band room. Short conversations, three choices, and help whenever you need it.</p>}<div className="day-welcome-facts"><span>7 lugares</span><span>Sin reloj</span><span>A tu ritmo</span></div><button className="day-primary" disabled={!ready} onClick={()=>{if(checkpoint)startPractice('checkpoint');else if(canCelebrate)setScreen('reward');else{setProgress(p=>({...p,started:true}));setScreen('story')}}}>{checkpoint?'Comenzar checkpoint':canCelebrate?'Volver a la banda':progress.started?'Continuar mi día':'Entrar en la clase'} <span aria-hidden="true">→</span></button><small>{progress.started&&!checkpoint&&!canCelebrate?`Continúas en: ${scene.location}`:'Puedes parar y volver cuando quieras.'}</small></div></section>
        <section className="day-map" aria-labelledby="day-map-title"><div className="day-section-heading"><div><span className="day-kicker">Sigue el camino</span><h2 id="day-map-title">Tu día, lugar por lugar</h2></div><span>{storyScenes.filter((_,i)=>completedScene(progress,i)).length} de 7 visitados</span></div><div className="day-map-grid">{storyScenes.map((s,i)=><button key={s.id} disabled={!ready||!availableScene(progress,i)} onClick={()=>goToScene(i)} aria-label={`${i+1}. ${s.location}${completedScene(progress,i)?' · completado':''}`}><img src={ART+art[i]+'.webp'} alt="" width="384" height="256" loading="lazy"/><span className="day-map-number">{completedScene(progress,i)?'✓':i+1}</span><div><small>{s.location}</small><b>{s.title}</b><span>{completedScene(progress,i)?'Volver a visitar':availableScene(progress,i)?'Adelante →':'Después de la parada anterior'}</span></div></button>)}</div></section>
        <div className="day-side-paths"><a href={ROOT+'quiz/'}><b>El gran quiz · 60 preguntas ↗</b><span>Una nota de práctica privada, solo en este navegador.</span></a><button onClick={()=>startPractice('checkpoint')}><b>Checkpoint · 8 pasos →</b><span>Elige, construye una frase y conversa.</span></button><a href={ROOT+'explore/'}><b>Explora la clase en 3D ↗</b><span>Muévete, toca los objetos o usa la lista 2D.</span></a></div>
      </>}
      {(screen==='story'||screen==='review'||screen==='checkpoint')&&<>
        <div className="day-journey-toolbar"><button onClick={()=>setScreen('home')}>← Mi día</button><span>{screen==='story'?`Parada ${sceneIndex+1} de 7 · ${turnIndex+1} / ${scene.turns.length}`:`${screen==='review'?'Otra charla':'Checkpoint'} · ${practiceIndex+1} / ${practice.length}`}</span><button onClick={openGuide}>Guía de campo</button></div>
        <div className="day-conversation-layout"><aside className="day-scene-panel"><img src={ART+(screen==='story'?art[sceneIndex]:'friends')+'.webp'} alt={screen==='story'?artAlt[sceneIndex]:artAlt[1]} width="1536" height="1024"/><div><span className="day-kicker">{screen==='story'?scene.location:'Un poco más con tus compañeros'}</span><h2>{screen==='story'?scene.title:'¡Vamos juntos!'}</h2><p>{screen==='story'?scene.intro:'Unas conversaciones cortas antes de seguir. Las pistas y tu guía siguen aquí.'}</p></div><div className="day-scene-dots" aria-label="Lugares del día">{storyScenes.map((s,i)=><span key={s.id} className={i===sceneIndex?'active':completedScene(progress,i)?'done':''} aria-label={`${s.location}${i===sceneIndex?' · aquí':''}`}>{completedScene(progress,i)?'✓':i+1}</span>)}</div></aside>
          {screen==='story'?<TurnCard key={turn.id} turn={turn} english={progress.english} alreadyDone={!!progress.evidence[turn.id]?.complete} onAttempt={(correct,assisted)=>setProgress(p=>recordStoryAttempt(p,turn,correct,assisted))} onNext={advance} nextLabel={turnIndex+1===scene.turns.length?'Terminar esta parada':'Continuar'} onHelp={openGuide} onSupport={markSupport} assisted={!!progress.evidence[turn.id]?.assisted}/>:currentPractice&&<TurnCard key={currentPractice.id+'-'+practiceIndex} turn={currentPractice} english={progress.english} onAttempt={practiceAttempt} onNext={()=>{if(practiceIndex+1<practice.length)setPracticeIndex(i=>i+1);else setScreen('result')}} nextLabel={practiceIndex+1===practice.length?'Ver mi recorrido':'Continuar'} onHelp={openGuide} onSupport={markSupport} assisted={!!practiceSupport[currentPractice.id]||(screen==='review'&&!progress.evidence[currentPractice.id]?.complete&&!!progress.evidence[currentPractice.id]?.assisted)}/>}
        </div>
      </>}
      {screen==='break'&&<section className="day-stop"><img src={ART+art[sceneIndex]+'.webp'} alt={artAlt[sceneIndex]} width="1536" height="1024"/><div><span className="day-kicker">✓ Parada {sceneIndex+1} completada</span><h2 ref={screenHeading} tabIndex={-1}>¡Un paso más juntos!</h2><p>{storyScenes[sceneIndex+1]?.intro}</p><button className="day-primary" onClick={()=>goToScene(sceneIndex+1)}>Ir a {storyScenes[sceneIndex+1]?.location.toLocaleLowerCase('es')} →</button><button className="day-text-button" onClick={()=>setScreen('home')}>Guardar mi lugar y descansar</button>{review.length>0&&<button className="day-text-button" onClick={()=>startPractice('review')}>Otra charla con mis compañeros</button>}</div></section>}
      {screen==='result'&&<section className="day-practice-result"><span className="day-reward-symbol" aria-hidden="true">✦</span><h2 ref={screenHeading} tabIndex={-1}>¡Conversación completada!</h2><p><b>{Object.values(practiceResults).filter(r=>r.first&&!r.assisted).length} / {practice.length}</b> respuestas al primer intento, sin pistas.</p><p>Las otras respuestas también son práctica. Sigue explorando a tu ritmo.</p><div className="day-result-tags">{[...new Set(practice.map(t=>t.concept))].map(c=><span key={c}>{conceptNames[c]}</span>)}</div><button className="day-primary" onClick={()=>setScreen('home')}>Volver a mi día →</button><a href={ROOT+'quiz/'}>Ir al quiz con nota ↗</a></section>}
      {screen==='reward'&&canCelebrate&&<>
        <section className="day-reward"><img src={ART+'band.webp'} alt={artAlt[6]} width="1536" height="1024"/><div><span className="day-kicker">✦ Los 7 lugares completados</span><h2 ref={screenHeading} tabIndex={-1}>¡Somos una banda!</h2><p>«Yo soy músico. Tú eres músico. ¡Nosotros somos músicos!»</p><p>Mateo, Sofía, Carlos y Ana te esperan. Elige un sonido y crea tu propio final.</p><button aria-pressed={sound} onClick={()=>setSound(s=>!s)}>Sonido {sound?'activado':'desactivado'}</button><div className="day-band-keys">{[['Do',261.63],['Mi',329.63],['Sol',392]].map(([name,f])=><button key={name} onClick={()=>playNote(Number(f))} disabled={!sound}>{name}<span aria-hidden="true">♫</span></button>)}</div><small>Solo suena al tocar. Sin grabación ni micrófono.</small></div></section>
        <div className="day-reward-actions"><button className="day-primary" onClick={()=>startPractice('review')}>Otra charla con mis compañeros</button><button onClick={()=>startPractice('checkpoint')}>Probar el checkpoint</button><a href={ROOT+'quiz/'}>El gran quiz con nota ↗</a><button onClick={()=>setScreen('home')}>Ver mi día</button></div>
      </>}
      {(displayHome||screen==='reward')&&<details className="day-discover"><summary>Más descubrimientos · los objetos de la clase</summary><p>Toca un objeto para descubrir cómo se usa.</p><div className="day-object-bank">{vocabulary.slice(objectIndex,objectIndex+3).map(([id,es])=><button key={id} onClick={()=>{setObjectOpen(id);setProgress(p=>({...p,seenObjects:[...new Set([...p.seenObjects,id])]}))}}><span aria-hidden="true">{objectSymbols[id]??'✦'}</span>{es}{progress.seenObjects.includes(id)&&<small>✓</small>}</button>)}</div>{objectOpen&&<p className="day-object-detail" role="status">{vocabulary.find(v=>v[0]===objectOpen)?.[3]} {progress.english&&vocabulary.find(v=>v[0]===objectOpen)?.[2]}</p>}<div className="day-object-pager"><button disabled={objectIndex===0} onClick={()=>{setObjectIndex(i=>Math.max(0,i-3));setObjectOpen(null)}}>← Anteriores</button><span>{Math.floor(objectIndex/3)+1} / {Math.ceil(vocabulary.length/3)}</span><button disabled={objectIndex+3>=vocabulary.length} onClick={()=>{setObjectIndex(i=>i+3);setObjectOpen(null)}}>Más objetos →</button></div></details>}
      {displayHome&&completed>0&&<details className="day-evidence"><summary>Mi cuaderno de práctica</summary><p>Primer intento sin pistas / conversaciones intentadas. Tus correcciones también quedan registradas.</p><div>{Object.entries(conceptEvidence(progress)).map(([id,s])=><p key={id}><b>{conceptNames[id]}</b><span>{s.independent} / {s.attempted} · {s.completed} completadas</span></p>)}</div>{review.length>0&&<button onClick={()=>startPractice('review')}>Otra charla con mis compañeros</button>}</details>}
      <footer className="day-footer"><span>Tu progreso se guarda solo en este navegador.</span><span>Personajes e ilustraciones de práctica ficticios.</span><button onClick={()=>setReset(true)}>Reiniciar esta historia</button></footer>
    </main>
    {guide&&<StoryGuide progress={progress} close={()=>setGuide(false)}/>}
    {reset&&<dialog ref={resetDialog} className="day-reset" aria-labelledby="day-reset-title" onCancel={e=>{e.preventDefault();setReset(false)}}><h2 id="day-reset-title">¿Empezar otro día?</h2><p>Se borra solo el progreso de esta historia en este navegador. Tus notas del quiz y las otras materias se conservan.</p><button className="day-primary" onClick={()=>{setProgress(newStory());setScreen('home');setReset(false)}}>Reiniciar historia</button><button onClick={()=>setReset(false)}>Conservar mi progreso</button></dialog>}
  </div>;
}
