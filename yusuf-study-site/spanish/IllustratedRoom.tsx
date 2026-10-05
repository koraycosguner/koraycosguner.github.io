import {useState} from 'react';
import {Portrait,SupplyArt} from './LearningVisuals';
import './room.css';
const ART='/quizzes/spanish/school-day/';
const spots=[
 {id:'teacher',name:'Sra. Abarca',en:'Your teacher',es:'Soy la profesora Abarca.',x:62,y:45},
 {id:'supplies',name:'Los útiles',en:'School supplies',es:'Uso un lápiz para escribir.',x:39,y:75},
 {id:'backpack',name:'La mochila',en:'Backpack',es:'Hay un cuaderno en mi mochila.',x:12,y:76},
 {id:'schedule',name:'El horario',en:'Class schedule',es:'Tengo la clase de español.',x:27,y:40},
 {id:'doctor',name:'La pizarra',en:'Classroom board',es:'Ella es profesora. Nosotros somos estudiantes.',x:58,y:24},
 {id:'group',name:'Los compañeros',en:'Classmates',es:'Somos compañeros. Somos amigos.',x:83,y:64},
 {id:'mateo',name:'Mateo',en:'Your classmate',es:'¡Hola! Soy Mateo. ¿Y tú?',x:59,y:70},
 {id:'band',name:'La sala de música',en:'Band room',es:'¡Somos músicos!',x:77,y:38},
];
export default function IllustratedRoom({onSelect,onInspect,english=true,unlocked=false,compact=false}:{onSelect?:(id:string)=>void;onInspect?:()=>void;english?:boolean;unlocked?:boolean;compact?:boolean}){
 const [selected,setSelected]=useState<string|null>(null);const spot=spots.find(s=>s.id===selected);
 return <section className={`illustrated-room ${compact?'compact':''}`} aria-label="Illustrated interactive classroom">
  <div className="illustrated-room-view"><img src={ART+'classroom-panorama.webp'} alt="A warm classroom with desks, a whiteboard, bookshelves, art materials, and a doorway into the school hall." width="1280" height="853"/>
   <div className="room-scene-label"><span>UN DÍA EN LA ESCUELA</span><b>{english?'Your classroom':'Tu clase'}</b></div>
   {spots.map(s=><button key={s.id} className={`room-hotspot hotspot-${s.id} ${selected===s.id?'active':''}`} style={{left:s.x+'%',top:s.y+'%'}} aria-label={`${s.name}${onSelect&&s.id==='band'&&!unlocked?' · locked':''}`} aria-pressed={selected===s.id} onClick={()=>{onInspect?.();setSelected(s.id)}}><span>{s.id==='teacher'||s.id==='mateo'?<Portrait name={s.id==='teacher'?'Sra. Abarca':'Mateo'}/>:s.id==='supplies'?<SupplyArt id="lapiz"/>:s.id==='band'?'♫':s.id==='backpack'?'▣':s.id==='schedule'?'▦':s.id==='group'?'●●':'✎'}</span><b>{s.name}</b></button>)}
  </div>
  {spot?<div className="room-inspection" role="status"><div><b>{spot.name}</b>{english&&<small>{spot.en}</small>}<p lang="es">{spot.es}</p></div>{onSelect&&<button onClick={()=>onSelect(spot.id)} className="room-enter" disabled={spot.id==='band'&&!unlocked}>{spot.id==='band'&&!unlocked?(english?'Complete 4 missions first':'Completa 4 misiones'):(english?'Go here →':'Ir aquí →')}</button>}<button aria-label="Close object preview" onClick={()=>setSelected(null)}>×</button></div>:<p className="room-tap-help">{english?'Tap a marker to meet someone or inspect an object.':'Toca un marcador para conocer a alguien o descubrir un objeto.'}</p>}
  {onSelect&&<details className="room-accessible"><summary>{english?'All places · accessible list':'Todos los lugares · lista accesible'}</summary><div>{spots.map(s=><button key={s.id} disabled={s.id==='band'&&!unlocked} onClick={()=>onSelect(s.id)}>{s.name}</button>)}</div></details>}
 </section>;
}
