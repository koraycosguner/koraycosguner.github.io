'use client';

import {useState} from 'react';
import type {ScientistId} from './types';
import './visuals.css';

const assetRoot='/quizzes/cells/concept-1';
const visuals:Record<ScientistId,{title:string;alt:string;detail:string}>={
 hooke:{title:'Tiny compartments in cork',alt:'Conceptual illustration of a historical compound microscope and a cork slice. The enlarged view shows empty tan compartments bounded by the walls of dead plant cells, with no nuclei or green living contents.',detail:'The brown outlines represent cell walls. Hooke saw the empty compartments of dead cork cells, not living green cells.'},
 leeuwenhoek:{title:'A hidden living world',alt:'Conceptual illustration of a hand holding a small single-lens microscope beside pond water. An enlarged view shows tiny living microorganisms, including much smaller rod-shaped bacteria without nuclei.',detail:'The large shape represents a single-celled microorganism; the tiny rods and dots represent bacteria. These are simplified examples from observations across years, not one exact sample or the same scale.'},
 schleiden:{title:'Plants contain cells',alt:'Conceptual illustration of a researcher preparing a leaf beside a historical microscope. The enlarged leaf tissue shows green plant cells with firm cell walls, chloroplasts and nuclei.',detail:'These example leaf cells have firm walls. Schleiden studied different plant tissues and concluded that all plants are made of cells. Not every plant cell contains chloroplasts.'},
 schwann:{title:'Animals contain cells, too',alt:'Conceptual illustration of a researcher examining animal tissue with a historical microscope. The enlarged animal tissue has soft pink cells with thin membranes and nuclei, without cell walls or chloroplasts.',detail:'The pink shapes represent animal cells. Each has a cell membrane, and the purple dot represents a nucleus. These animal cells do not have plant cell walls or chloroplasts.'},
 virchow:{title:'New cells come from existing cells',alt:'Conceptual illustration of a historical laboratory and a three-stage cell-division drawing: one parent cell, the cell pinching into two, and two daughter cells. Each daughter cell comes from the parent.',detail:'Follow the arrows. One existing cell divides to form two daughter cells. The simplified picture shows their origin; it does not show every stage of cell division.'},
};

function Arrow({x,y,width=30}:{x:number;y:number;width?:number}){return <g fill="none" stroke="#305a5c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d={`M${x} ${y}h${width}m-9-8 9 8-9 8`}/></g>;}

function Observation({scene}:{scene:ScientistId}){
 return <svg className="ctv-diagram" viewBox="0 0 440 230" width="440" height="230" role="img" aria-label={visuals[scene].detail}>
 <rect width="440" height="230" rx="18" fill={scene==='hooke'?'#fff4df':scene==='schleiden'?'#f2f7e5':'#f2f7f5'}/>
 {scene==='hooke'?<>
  <g stroke="#9d6639" strokeWidth="7" fill="#f5dfb3" strokeLinejoin="round">
   <path d="M40 36 102 28 115 75 93 112 37 109 22 73Z"/><path d="M102 28 174 33 191 78 158 115 115 75Z"/><path d="M174 33 238 29 258 68 231 111 191 78Z"/>
   <path d="M37 109 93 112 115 158 93 198 32 191 20 150Z"/><path d="M93 112 158 115 184 155 160 204 93 198 115 158Z"/><path d="M158 115 191 78 231 111 257 158 233 198 160 204 184 155Z"/>
  </g><path d="M259 68h22V51h37" fill="none" stroke="#785031" strokeWidth="2"/><text x="294" y="40" fontSize="19" fill="#62472f">Cell walls</text><path d="M215 152h68v18h20" fill="none" stroke="#785031" strokeWidth="2"/><text x="301" y="164" fontSize="18" fill="#62472f">Empty</text><text x="301" y="188" fontSize="18" fill="#62472f">inside</text>
 </>:scene==='leeuwenhoek'?<>
  <g transform="translate(121 105) rotate(-23)"><ellipse rx="74" ry="37" fill="#b1dcd3" stroke="#2b827d" strokeWidth="3"/><ellipse cx="-3" cy="-1" rx="17" ry="12" fill="#5f9fb1"/><circle cx="-40" cy="5" r="6" fill="#ebf8e7"/><circle cx="36" cy="-6" r="7" fill="#ebf8e7"/>{Array.from({length:24},(_,i)=>{const a=i*Math.PI/12;return <path key={i} d={`M${Math.cos(a)*75} ${Math.sin(a)*38}l${Math.cos(a)*8} ${Math.sin(a)*8}`} stroke="#2b827d" strokeWidth="2"/>;})}</g>
  <g fill="#267c77">{[[287,66],[339,103],[286,139],[366,59]].map(([x,y],i)=><rect key={i} x={x} y={y} width="23" height="9" rx="4.5" transform={`rotate(${i%2?35:-30} ${x} ${y})`}/>)}<circle cx="376" cy="138" r="5"/><circle cx="260" cy="105" r="5"/><circle cx="330" cy="54" r="5"/></g>
  <text x="120" y="195" textAnchor="middle" fontSize="19" fill="#245a5b">Microorganism</text><text x="321" y="195" textAnchor="middle" fontSize="19" fill="#245a5b">Bacteria</text>
 </>:scene==='schleiden'?<>
  <g stroke="#527733" strokeWidth="6" fill="#e1edb9">{[0,1,2].map(i=><rect key={i} x={29+i*126} y="33" width="126" height="151" rx="13"/>)}</g>
  {[0,1,2].map(i=><g key={i} transform={`translate(${i*126} 0)`}><circle cx="90" cy="106" r="15" fill="#9e89a7"/>{[[50,57],[123,58],[50,151],[124,152],[49,102],[125,105]].map(([x,y],j)=><ellipse key={j} cx={x} cy={y} rx="6" ry="11" fill="#639940" transform={`rotate(${j%2?35:-35} ${x} ${y})`}/>)}</g>)}
  <text x="220" y="213" textAnchor="middle" fontSize="19" fill="#42662d">Example leaf cells with firm cell walls</text>
 </>:scene==='schwann'?<>
  <g fill="#f3c6d0" stroke="#b57692" strokeWidth="2.5"><path d="M36 54Q70 20 112 47L145 93Q120 135 66 139Q23 117 36 54Z"/><path d="M112 47Q162 21 209 43L234 93Q216 137 169 149L145 93Z"/><path d="M209 43Q260 23 306 53L318 118Q275 151 234 93Z"/><path d="M306 53Q355 19 396 58Q420 103 382 145L318 118Z"/><path d="M66 139Q120 135 145 93L169 149 144 190Q85 209 49 178Z"/><path d="M169 149Q216 137 234 93Q275 151 318 118L325 181Q280 210 234 185Q190 204 144 190Z"/><path d="M318 118 382 145Q403 187 365 199L325 181Z"/></g>
  <g fill="#88538d">{[[81,88],[176,86],[268,79],[362,93],[103,164],[228,164],[355,171]].map(([x,y],i)=><ellipse key={i} cx={x} cy={y} rx="12" ry="10"/>)}</g>
  <text x="220" y="223" textAnchor="middle" fontSize="18" fill="#75415e">Animal cells: membranes, no cell walls</text>
 </>:<>
  <circle cx="62" cy="94" r="41" fill="#f3c6d0" stroke="#b57692" strokeWidth="3"/><circle cx="62" cy="94" r="12" fill="#88538d"/>
  <Arrow x={115} y={94} width={28}/>
  <path d="M155 95C155 46 190 40 210 65C229 40 266 46 266 95C266 142 231 150 210 123C189 150 155 142 155 95Z" fill="#f3c6d0" stroke="#b57692" strokeWidth="3"/><circle cx="183" cy="94" r="11" fill="#88538d"/><circle cx="239" cy="94" r="11" fill="#88538d"/>
  <Arrow x={276} y={94} width={28}/>
  <ellipse cx="337" cy="94" rx="25" ry="34" fill="#f3c6d0" stroke="#b57692" strokeWidth="3"/><ellipse cx="400" cy="94" rx="25" ry="34" fill="#f3c6d0" stroke="#b57692" strokeWidth="3"/><circle cx="337" cy="94" r="9" fill="#88538d"/><circle cx="400" cy="94" r="9" fill="#88538d"/>
  <text x="62" y="174" textAnchor="middle" fontSize="18" fill="#75415e">1 parent cell</text><text x="210" y="174" textAnchor="middle" fontSize="18" fill="#75415e">Divides</text><text x="369" y="174" textAnchor="middle" fontSize="18" fill="#75415e">2 new cells</text><text x="220" y="211" textAnchor="middle" fontSize="17" fill="#496761">New cells arise from the existing cell.</text>
 </>}
 </svg>;
}

export default function CellVisual({scene,compact=false}:{scene:ScientistId;compact?:boolean}){
 const [failedSource,setFailedSource]=useState<string|null>(null);
 const source=`${assetRoot}/${scene}.webp`;
 const data=visuals[scene];
 const failed=failedSource===source;
 return <figure className={'ctv-figure'+(compact?' ctv-compact':'')} data-cell-visual={scene}>
  <div className="ctv-picture">
   {failed?<div className="ctv-fallback"><Observation scene={scene}/><p>{data.detail}</p></div>:<img src={source} width="1280" height="853" alt={data.alt} decoding="async" loading={compact?'lazy':'eager'} onError={()=>setFailedSource(source)}/>}
   <span className="ctv-art-label">Conceptual historical illustration</span>
  </div>
  <figcaption><strong>{data.title}</strong>{!compact&&!failed&&<details className="ctv-look" key={scene}><summary>Look closer at the discovery <span aria-hidden="true">＋</span></summary><div className="ctv-closeup"><Observation scene={scene}/><p>{data.detail}</p><small>Simplified teaching diagram. Colors and scale are illustrative.</small></div></details>}</figcaption>
 </figure>;
}
