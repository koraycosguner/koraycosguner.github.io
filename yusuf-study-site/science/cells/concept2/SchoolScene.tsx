'use client';
import type {PartId} from './types';
export const schoolAreas:{part:PartId;name:string;job:string}[]=[
 {part:'nucleus',name:'Principal’s office',job:'Direct activities'},
 {part:'membrane',name:'Controlled entrance',job:'Manage entry and exit'},
 {part:'wall',name:'Exterior wall',job:'Support and protection'},
 {part:'mitochondria',name:'Power supply',job:'Provide usable energy'},
 {part:'ribosomes',name:'Production workshop',job:'Build products'},
 {part:'golgi',name:'Mailroom',job:'Sort and package'},
 {part:'lysosomes',name:'Recycling area',job:'Break down materials'},
 {part:'vacuole',name:'Storage room',job:'Store supplies'},
 {part:'cytoskeleton',name:'Building framework',job:'Internal support'}
];
export function SchoolIcon({part}:{part:PartId}){
 const stroke='#254f56';
 return <g fill="none" stroke={stroke} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
 {part==='nucleus'?<><path d="M-43 18H43M-32 18V42M32 18V42M-20 13V-8H18V13"/><rect x="-9" y="-42" width="33" height="29" rx="4" fill="#e9f2e2"/><path d="M-2-34H15M-2-26H10M-26 40V27H-5V40"/></>:
 part==='membrane'?<><path d="M-40 38V-31M40 38V-31M-40-24H40M-36 5H36M-23-24V33M-7-24V33M10-24V33M26-24V33"/><path d="M-6-43L0-49 6-43"/></>:
 part==='wall'?<>{[-20,0,20].map((y,i)=><g key={y}><rect x="-44" y={y-11} width="88" height="20" fill="#f2d9af"/>{(i%2?[-22,22]:[0]).map(x=><path key={x} d={`M${x} ${y-11}V${y+9}`}/>)}</g>)}</>:
 part==='mitochondria'?<><path d="M-43 34V-13L-16 2V-13L15 2V-13L43 1V34Z" fill="#f2b970"/><path d="M-30-17V-38H-14V-8M-14-38H-30M-29 17H-19M-4 17H6M22 17H32"/><path d="M8-47L-5-28H10L-2-10" stroke="#aa5f20"/></>:
 part==='ribosomes'?<><rect x="-42" y="-5" width="84" height="33" rx="12" fill="#c7d4e4"/><path d="M-27 5V17M-9 5V17M9 5V17M27 5V17M-30 28V40M30 28V40"/><path d="M-22-14V-31H-2V-14M6-14V-31H26V-14"/></>:
 part==='golgi'?<><rect x="-39" y="-11" width="32" height="41" fill="#e8bdad"/><rect x="5" y="-26" width="35" height="56" fill="#f2d4ae"/><path d="M-23-11V4M22-26V-9M-23 16H-13M13 17H32M-35-37H-5M-10-43L-4-37-10-31"/></>:
 part==='lysosomes'?<><path d="M-29-10H29L24 39H-24ZM-36-16H36M-15-23V-32H15V-23" fill="#c7ddc7"/><path d="M0-3L14 18H5M14 18L9 27M-13 18L-20 7-13-2M-13 18H-1"/></>:
 part==='vacuole'?<><path d="M-44-34V41M44-34V41M-44-5H44M-44 29H44"/>{[-25,8].map(x=><g key={x}><rect x={x} y="-31" width="21" height="23" fill="#badbe3"/><rect x={x} y="4" width="21" height="22" fill="#e9c99b"/></g>)}</>:
 part==='vesicles'?<><rect x="-45" y="-19" width="53" height="44" rx="4" fill="#e7c87c"/><path d="M8-6H31L45 9V25H8M-43 25H45"/><circle cx="-26" cy="29" r="10" fill="#c7d4d5"/><circle cx="28" cy="29" r="10" fill="#c7d4d5"/></>:
 part==='chloroplasts'?<><path d="M-44 38V-5L0-32 44-5V38ZM0-32V38M-44-5H44" fill="#d6e7bf"/><path d="M-24 36V17M24 36V17M-24 23L-33 14M24 23L33 14"/><circle cx="37" cy="-39" r="11" fill="#f4d179"/></>:
 part==='smooth-er'?<><path d="M-30-39H-7M-26-39V-10L-44 30Q-45 38-35 38H0Q10 38 8 30L-11-10V-39M-34 17H-3" fill="#bad9d1"/><path d="M15-30H34M19-30V-5L8 29H43L30-5V-30M15 15H37" fill="#f0d49c"/></>:
 part==='rough-er'?<><path d="M-43 32H43M-37 32V43M37 32V43"/><rect x="-43" y="5" width="86" height="22" rx="10" fill="#bfd7e6"/><rect x="-30" y="-20" width="23" height="23" fill="#e9cf99"/><path d="M-4-30H31V-15H7V-3M-26 14V20M-6 14V20M14 14V20M34 14V20"/></>:
 part==='cytoplasm'?<><rect x="-43" y="-35" width="86" height="73" rx="5" fill="#efe2b6"/><path d="M-43 13H43M-8-35V38M-43-11H43" stroke="#b4a778"/><rect x="8" y="-22" width="21" height="19" fill="#c3d5c1"/><rect x="-34" y="19" width="18" height="12" fill="#c1d5e1"/></>:
 <><path d="M-42 38V-35H42V38M-42-35L42 38M42-35L-42 38M-42 1H42M0-35V38"/><circle r="7" fill="#f3d47b"/></>}
 </g>;
}
export default function SchoolScene({selected,onSelect}:{selected:PartId;onSelect:(id:PartId)=>void}){
 return <figure className="c2-school-figure"><svg viewBox="0 0 820 620" role="group" aria-label="A school as a cell analogy: select one of nine areas"><rect x="9" y="12" width="802" height="594" rx="32" fill="#d9e6ce"/><path d="M19 601V42Q19 20 42 20H788Q802 20 802 42V601" fill="#f0e5cc" stroke="#b3b99f" strokeWidth="5"/><path d="M276 30V590M543 30V590M30 207H790M30 404H790" stroke="#fffaf0" strokeWidth="23"/>{schoolAreas.map((area,i)=>{const x=34+(i%3)*267,y=37+Math.floor(i/3)*197;return <g key={area.part} role="button" tabIndex={0} aria-label={area.name} aria-pressed={selected===area.part} onClick={()=>onSelect(area.part)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect(area.part)}}} className="c2-school-area" data-school={area.part}><rect x={x} y={y} width="218" height="153" rx="13" fill={selected===area.part?'#e1efdc':'#fffdf4'} stroke={selected===area.part?'#346b57':'#b5c5b1'} strokeWidth={selected===area.part?4:2}/><path d={`M${x+18} ${y+4}h35M${x+162} ${y+4}h35`} stroke="#99c8d4" strokeWidth="8"/><g transform={`translate(${x+109} ${y+63}) scale(.7)`}><SchoolIcon part={area.part}/></g><text x={x+109} y={y+123} textAnchor="middle" fontSize="18" fontWeight="700" fill="#23464d">{area.name}</text><path d={`M${x+90} ${y+153}h38`} stroke="#c79869" strokeWidth="8"/></g>})}</svg><figcaption>A school is a comparison model. A cell is alive and works differently.</figcaption></figure>;
}
