import {useState} from 'react';
import type {U3Visual} from './types';
import {schedule} from './content';
import './visuals.css';

const assetRoot='/quizzes/spanish/unit-3';
const monthNames=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const weekNames=['lunes','martes','miércoles','jueves','viernes','sábado','domingo'];
const scheduleIcons=['compass','science','math','band','world','lunch','recess','book','talk'];
function readableTime(value:string){const [h,m]=value.split(':').map(Number);return `${h%12||12}:${String(m).padStart(2,'0')} ${h<12?'a. m.':'p. m.'}`;}

function Student({x=0,y=0,scale=1,bag=false}:{x?:number;y?:number;scale?:number;bag?:boolean}){return <g transform={`translate(${x} ${y}) scale(${scale})`}>
 {bag&&<path d="M36 70q25-8 28 18v50H35Z" fill="#e5b949" stroke="#966c2e" strokeWidth="3"/>}
 <path d="M-25 147v59M24 147v59" stroke="#26475b" strokeWidth="19" strokeLinecap="round"/><path d="M-39 215h22M13 215h24" stroke="#fffaf0" strokeWidth="15" strokeLinecap="round"/>
 <path d="M-39 82Q-33 61 0 62Q33 61 39 82L33 154H-33Z" fill="#197d77"/>
 <path d="M-38 85l-9 54M38 85l9 54" stroke="#c58d67" strokeWidth="12" strokeLinecap="round"/>
 <ellipse cy="32" rx="29" ry="35" fill="#d5a17b"/><path d="M-29 29L-28 7-18-9 28-6 31 18 19 5-6 9-20 17Z" fill="#273333"/><path d="M-29 17v17M28 14v18" stroke="#62554b" strokeWidth="5"/>
 <circle cx="-10" cy="31" r="2.5" fill="#293b41"/><circle cx="10" cy="31" r="2.5" fill="#293b41"/><path d="M-8 46q8 7 16 0" stroke="#80543d" strokeWidth="2" fill="none"/>
 </g>;}
function Backpack({x=0,y=0,scale=1}:{x?:number;y?:number;scale?:number}){return <g transform={`translate(${x} ${y}) scale(${scale})`}><path d="M-13-24v-8q13-14 26 0v8" stroke="#84612a" strokeWidth="6" fill="none"/><rect x="-31" y="-27" width="62" height="75" rx="16" fill="#e9b843" stroke="#8f692d" strokeWidth="3"/><rect x="-23" y="10" width="46" height="28" rx="7" fill="#f6d77b"/><path d="M-20 16h40" stroke="#8f692d" strokeWidth="3"/></g>;}
function Table({x=0,y=0,scale=1,back=false}:{x?:number;y?:number;scale?:number;back?:boolean}){return <g transform={`translate(${x} ${y}) scale(${scale})`}><path d="M-64 18V97M64 18V97" stroke="#6e8a88" strokeWidth="12"/><path d="M-77-9l22-23H68L86-9 68 14H-77Z" fill={back?'#d4ac72':'#deb984'} stroke="#9c784a" strokeWidth="3"/><path d="M-77-9H86v15H-77Z" fill="#bd935e"/></g>;}
function Icon({name}:{name:string}){return <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
 {name==='science'?<><path d="M25 9h14M28 9v19L14 50q-2 5 5 5h26q7 0 5-5L36 28V9M22 40h20"/><circle cx="29" cy="46" r="2"/><circle cx="35" cy="35" r="2"/></>:name==='math'?<><path d="M12 14h17M20.5 6v16M40 16h14M12 44l15 15M27 44L12 59M40 44h14M40 53h14"/></>:name==='band'?<><path d="M25 44V14l26-6v30M25 22l26-6"/><ellipse cx="18" cy="47" rx="8" ry="6"/><ellipse cx="44" cy="41" rx="8" ry="6"/></>:name==='world'?<><circle cx="32" cy="32" r="24"/><ellipse cx="32" cy="32" rx="11" ry="24"/><path d="M8 32h48M13 17h38M13 47h38"/></>:name==='lunch'?<><rect x="6" y="16" width="52" height="37" rx="7"/><circle cx="23" cy="34" r="10"/><path d="M40 23h10M40 32h10M40 41h10"/></>:name==='recess'?<><circle cx="32" cy="31" r="23"/><path d="M11 21l42 21M21 10l21 42M18 50q-2-29 26-37M14 14q30 3 36 31"/></>:name==='talk'?<><path d="M9 11h46v32H30L18 54V43H9Z"/><path d="M19 23h26M19 32h18"/></>:name==='compass'?<><circle cx="32" cy="32" r="24"/><path d="M40 16l-2 22-14 10 2-22Z"/></>:<><path d="M7 12q17-5 25 5 8-10 25-5v40q-17-5-25 3-8-8-25-3ZM32 17v38"/><path d="M15 25h8M15 35h8M40 25h9M40 35h9"/></>}
 </svg>;}

export function ClockFace({hour=9,minute=0,small=false}:{hour?:number;minute?:number;small?:boolean}){
 const normalizedHour=((hour%24)+24)%24,normalizedMinute=((minute%60)+60)%60;
 const time=`${normalizedHour%12||12}:${String(normalizedMinute).padStart(2,'0')}`;
 const period=normalizedHour===0&&normalizedMinute===0?'medianoche':normalizedHour===12&&normalizedMinute===0?'mediodía':normalizedHour<12?'de la mañana':normalizedHour<19?'de la tarde':'de la noche';
 return <div className={'u3v-clock'+(small?' is-small':'')}><svg viewBox="0 0 300 300" width="300" height="300" role="img" aria-label={`Analog clock showing ${time}, ${period}. Short blue hand: hour. Long dark hand: minutes.`}>
 <circle cx="150" cy="150" r="144" fill="#e0ebe5"/><circle cx="150" cy="150" r="133" fill="#fffef8" stroke="#1d5356" strokeWidth="6"/>
 {Array.from({length:60},(_,i)=><line key={i} x1="150" y1="24" x2="150" y2={i%5===0?37:30} stroke={i%5===0?'#1d5356':'#91a9a5'} strokeWidth={i%5===0?3:1.5} transform={`rotate(${i*6} 150 150)`}/>)}
 {Array.from({length:12},(_,i)=>{const n=i+1,a=n*Math.PI/6;return <text key={n} x={150+Math.sin(a)*102} y={150-Math.cos(a)*102+7} textAnchor="middle" fontSize="24" fontWeight="650" fill="#1d4145">{n}</text>;})}
 <path d="M150 150V86" stroke="#247d91" strokeWidth="13" strokeLinecap="round" transform={`rotate(${normalizedHour%12*30+normalizedMinute*.5} 150 150)`}/>
 <path d="M150 150V50" stroke="#203e42" strokeWidth="7" strokeLinecap="round" transform={`rotate(${normalizedMinute*6} 150 150)`}/><circle cx="150" cy="150" r="9" fill="#ce8952"/>
 </svg><span className="u3v-period" lang="es">{period}</span></div>;
}

function Calendar({visual}:{visual:U3Visual}){
 const month=visual.month&&monthNames.includes(visual.month)?visual.month:'octubre';
 const index=monthNames.indexOf(month),selected=Math.min(new Date(Date.UTC(2026,index+1,0)).getUTCDate(),Math.max(1,visual.date??20));
 const offset=(new Date(Date.UTC(2026,index,1)).getUTCDay()+6)%7,days=new Date(Date.UTC(2026,index+1,0)).getUTCDate();
 const selectedWeekday=weekNames[(new Date(Date.UTC(2026,index,selected)).getUTCDay()+6)%7];
 return <div className="u3v-calendar-scene"><div className="u3v-calendar"><header><span lang="es">{month}</span><span>2026</span></header><div className="u3v-calendar-grid" role="table" aria-label={`Calendar for ${month} 2026; ${selectedWeekday} ${selected} is highlighted.`}>
 <div role="row" className="u3v-calendar-week">{weekNames.map(day=><span key={day} role="columnheader" aria-label={day}>{day.slice(0,2)}</span>)}</div>
 {Array.from({length:Math.ceil((offset+days)/7)},(_,week)=><div role="row" className="u3v-calendar-week" key={week}>{Array.from({length:7},(_,day)=>{const date=week*7+day-offset+1;return <span role="cell" key={day} className={date===selected?'is-today':undefined} aria-label={date>0&&date<=days?`${weekNames[day]}, ${date} de ${month}${date===selected?', selected date':''}`:undefined}>{date>0&&date<=days?date:''}</span>;})}</div>)}
 </div><p lang="es"><strong>{selectedWeekday}</strong> · {selected} de {month}</p></div><svg className="u3v-calendar-student" viewBox="0 0 150 270" width="150" height="270" aria-hidden="true"><Student x={75} y={30}/></svg></div>;
}

function Timetable({period}:{period?:number}){return <div className="u3v-timetable"><header><span lang="es">Mi horario</span><div className="u3v-schedule-hours"><ClockFace hour={9} minute={0} small/><span>9:00 a. m. → 3:45 p. m.</span><ClockFace hour={15} minute={45} small/></div></header><ol aria-label="Sample class schedule">
 {schedule.map(item=><li key={item.period} className={(period===item.period?'is-highlighted ':'')+([6,7].includes(item.period)?'is-break':'')}><span className="u3v-period-number" aria-label={`Period ${item.period}`}>P{item.period}</span><Icon name={scheduleIcons[item.period-1]}/><span className="u3v-subject" lang="es">{item.subject}</span><span className="u3v-time-range">{readableTime(item.start)}<span>– {readableTime(item.end)}</span></span></li>)}
 </ol><p>Sample times. P6 and P7 are example breaks.</p></div>;}

function SchoolMap(){return <div className="u3v-map"><div className="u3v-map-heading"><strong lang="es">Nuestro colegio</strong><span>View from above</span></div><div className="u3v-map-grid">
 <div className="u3v-map-orientation"><span>← left</span><span>right →</span><small>Front = entrance side ↓</small></div>
 <div className="u3v-room u3v-gym"><Icon name="recess"/><strong lang="es">el gimnasio</strong></div>
 <div className="u3v-room u3v-library"><Icon name="book"/><strong lang="es">la biblioteca</strong><span className="u3v-library-door">entrada</span><span className="u3v-mateo"><svg viewBox="0 0 110 240" width="22" height="48" aria-hidden="true"><Student x={55} y={10}/></svg><span>Mateo</span></span></div>
 <div className="u3v-room u3v-science"><Icon name="science"/><strong lang="es">la clase<br/>de ciencias</strong></div>
 <div className="u3v-room u3v-cafe"><Icon name="lunch"/><strong lang="es">la cafetería</strong></div>
 <div className="u3v-room u3v-office"><Icon name="compass"/><strong lang="es">la oficina</strong></div>
 </div><p className="u3v-map-caption">Simplified practice map. Room positions follow the story.</p></div>;}

const relationDescriptions:Record<string,string>={
 'adentro de':'The backpack is inside the open locker.','afuera de':'The backpack is outside the locker.','al lado de':'The backpack is beside the desk.','a la derecha de':'The backpack is on the right side of the desk, from your view.','a la izquierda de':'The backpack is on the left side of the desk, from your view.','cerca de':'The backpack is near the desk.','con':'A student has a backpack.','debajo de':'The backpack is under the desk.','delante de':'The backpack is in front of the desk, on the side nearest you.','detrás de':'The backpack is behind the desk, on the side farthest from you.','en':'A student is in the classroom.','encima de':'The backpack is on top of the desk.','entre':'The backpack is between two desks.','lejos de':'The backpack is far from the desk.','sin':'A student does not have a backpack.','sobre':'The backpack is on top of the desk.',
};
function Relation({relation='al lado de'}:{relation?:string}){
 let drawing;
 if(relation==='con'||relation==='sin')drawing=<><Student x={230} y={22} scale={.95} bag={relation==='con'}/>{relation==='con'&&<Backpack x={274} y={119} scale={.65}/>}</>;
 else if(relation==='adentro de'||relation==='afuera de')drawing=<><rect x="160" y="28" width="124" height="204" rx="8" fill="#c4d9d2" stroke="#467b78" strokeWidth="5"/><rect x="176" y="46" width="92" height="172" rx="3" fill="#4a7774"/><path d="M160 29l-50 22v199l50-20Z" fill="#9dc3b8" stroke="#467b78" strokeWidth="4"/><Backpack x={relation==='adentro de'?223:335} y={160} scale={.9}/></>;
 else if(relation==='en')drawing=<><rect x="101" y="21" width="258" height="218" rx="15" fill="#e5eede" stroke="#648e7e" strokeWidth="4"/><rect x="122" y="38" width="70" height="47" fill="#4f8274"/><Student x={248} y={51} scale={.77}/><Table x={151} y={140} scale={.42}/></>;
 else if(relation==='entre')drawing=<><Table x={100} y={130} scale={.67}/><Table x={360} y={130} scale={.67}/><Backpack x={230} y={144}/></>;
 else if(relation==='debajo de')drawing=<><Backpack x={230} y={159} scale={.75}/><Table x={230} y={95} scale={1.16}/></>;
 else if(relation==='encima de'||relation==='sobre')drawing=<><Table x={230} y={151} scale={1.16}/><Backpack x={230} y={91} scale={1}/></>;
 else if(relation==='detrás de'||relation==='delante de')drawing=<><rect x="142" y="105" width="176" height="62" rx="5" fill="#deb984" stroke="#9c784a" strokeWidth="3"/><path d="M149 164h162" stroke="#8c6739" strokeWidth="5"/><text x="230" y="141" textAnchor="middle" fill="#5c482d" fontSize="17">mesa</text><Backpack x={230} y={relation==='detrás de'?48:207} scale={.85}/><path d="M371 112v49m-8-9 8 9 8-9" fill="none" stroke="#5b8072" strokeWidth="3"/></>;
 else if(relation==='a la izquierda de')drawing=<><Table x={295} y={131} scale={.86}/><Backpack x={125} y={147}/></>;
 else if(relation==='lejos de')drawing=<><Table x={88} y={131} scale={.72}/><path d="M160 211h178" stroke="#7c9891" strokeDasharray="5 7" strokeWidth="2"/><Backpack x={393} y={147}/></>;
 else drawing=<><Table x={186} y={131} scale={.86}/><Backpack x={relation==='cerca de'?330:319} y={147}/></>;
 return <div className="u3v-relation"><svg viewBox="0 0 460 270" width="460" height="270" role="img" aria-label={relationDescriptions[relation]||'School location example'}><rect x="8" y="8" width="444" height="252" rx="24" fill="#f2f4e9"/><ellipse cx="230" cy="231" rx="187" ry="15" fill="#d9e5dc"/>{drawing}</svg>{['a la izquierda de','a la derecha de','delante de','detrás de'].includes(relation)&&<p>{relation.includes('izquierda')||relation.includes('derecha')?'Left and right use your view.':'View from above. Front is toward the bottom ↓.'}</p>}</div>;
}

function SceneFallback({departure}:{departure:boolean}){return <svg viewBox="0 0 600 400" width="600" height="400" role="img" aria-label={departure?'A student with a backpack waits at the bus stop outside school.':'A student enters the school hallway. A backpack is beside the lockers.'}><rect width="600" height="400" fill="#e6f0e4"/><rect x="43" y="53" width="340" height="300" rx="10" fill="#e2c99d"/><path d="M22 65L211 7 402 65Z" fill="#527f7a"/><rect x="75" y="100" width="86" height="125" fill="#b1d4d7"/><rect x="214" y="109" width="122" height="244" fill="#fff5d9"/>{departure?<><path d="M459 94v250" stroke="#426377" strokeWidth="10"/><rect x="424" y="71" width="72" height="78" rx="8" fill="#357990"/><rect x="439" y="88" width="42" height="38" rx="5" fill="#fff9e9"/><circle cx="445" cy="129" r="4" fill="#fff9e9"/><circle cx="474" cy="129" r="4" fill="#fff9e9"/></>:<><rect x="409" y="137" width="132" height="215" rx="6" fill="#5e9d99"/><path d="M453 137v215M497 137v215" stroke="#266d69" strokeWidth="3"/><Backpack x={552} y={303} scale={.7}/></>}<Student x={272} y={113} scale={1.1} bag/></svg>;}

export default function Unit3Visual({visual,compact=false}:{visual:U3Visual;compact?:boolean}){
 const [failedSource,setFailedSource]=useState<string|null>(null);
 const source=`${assetRoot}/${visual.kind}.webp`;
 return <div className={'u3-visual u3-visual-'+visual.kind+(compact?' is-compact':'')} data-unit3-visual={visual.kind}>
 {visual.kind==='calendar'?<Calendar visual={visual}/>:visual.kind==='schedule'?<Timetable period={visual.period}/>:visual.kind==='map'?<SchoolMap/>:visual.kind==='clock'?<ClockFace hour={visual.hour} minute={visual.minute}/>:visual.kind==='relation'?<Relation relation={visual.relation}/>:<div className="u3v-scene">
 {failedSource===source?<SceneFallback departure={visual.kind==='departure'}/>:<img src={source} width="1536" height="1024" alt={visual.kind==='departure'?'A fictional student with straight dark hair and a teal hoodie waits safely at the bus stop outside school in the afternoon.':'A fictional student with straight dark hair and a teal hoodie enters the school hallway in the morning. A yellow backpack is beside the blue lockers.'} decoding="async" onError={()=>setFailedSource(source)}/>}
 <div className="u3v-scene-caption"><span lang="es">{visual.kind==='departure'?'La parada de autobús':'La escuela · El pasillo · Los casilleros'}</span>{visual.kind==='departure'&&<ClockFace hour={15} minute={45} small/>}</div></div>}
 </div>;
}
