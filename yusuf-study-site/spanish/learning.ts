import {initialInventory, skillLabels, stations, type Question, type Skill} from './content.ts';
export const STORAGE_KEY='yusuf.spanish.unit2.v1';
export type SkillResult={firstCorrect:number;firstTotal:number;independentCorrect:number;corrections:number;hints:number};
export type PracticeGrade={date:number;total:number;correct:number;percent:number;letter:string};
export type Progress={version:1;discoveries:string[];missions:string[];inventory:Record<string,number>;skills:Partial<Record<Skill,SkillResult>>;xp:number;bandReward:boolean;english:boolean;mode:'2d'|'3d';quiet:boolean;grades:PracticeGrade[]};
export const emptyProgress=():Progress=>({version:1,discoveries:[],missions:[],inventory:{...initialInventory},skills:{},xp:0,bandReward:false,english:true,mode:'3d',quiet:true,grades:[]});
export function practiceGrade(correct:number,total:number,date=Date.now()):PracticeGrade{const percent=total?Math.round(correct/total*100):0;return {date,total,correct,percent,letter:percent>=90?'A':percent>=80?'B':percent>=70?'C':percent>=60?'D':'More practice'};}
const normalize=(s:string)=>s.normalize('NFC').toLocaleLowerCase('es').trim().replace(/[¡!¿?.,;:]/g,'').replace(/\s+/g,' ');
const accentless=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'');
export function grade(q:Question,answer:string) {
 const cleaned=normalize(answer); const exact=!!cleaned&&q.answers.some(a=>normalize(a)===cleaned);
 const spelling=!!cleaned&&!q.strictAccent&&!exact&&q.answers.some(a=>accentless(normalize(a))===accentless(cleaned));
 const correct=exact||spelling;let meaning:boolean|null=correct?true:null;let grammar:boolean|null=correct?true:null;
 if(!correct&&['self-intro','review-self','target-self'].includes(q.id)){meaning=/\byusuf\b/.test(cleaned);grammar=/^(yo )?soy [\p{L} ]+$/u.test(cleaned);}
 if(!correct&&(/\b(yo (es|eres|somos|son|sois)|nosotr[oa]s (soy|es|eres|son|sois)|tú (soy|es|somos|son|sois))\b/.test(cleaned)||q.skill==='ser'))grammar=false;
 return {correct,spelling:spelling?'Meaning and grammar work. Notice the accent/spelling in: '+q.model:'',message:correct?'¡Bien! '+q.explanation:'Try again. '+q.explanation,meaning,grammar,diagnostic:correct?'':meaning===false?'Meaning: the person or perspective does not match this scene. '+(grammar===false?'Grammar: also check the SER form.':'Grammar: the sentence form works; change whom it describes.'):grammar===false?'Grammar: the subject and SER form do not agree. Meaning: check who is speaking.':'Meaning: reread what the scene asks. Grammar: compare your articles, verb and word endings with the model.'};
}
const count=(v:unknown)=>typeof v==='number'&&Number.isFinite(v)?Math.max(0,Math.min(100000,Math.floor(v))):0;
export function parseProgress(raw:string|null):Progress {
 if(!raw)return emptyProgress(); const p=JSON.parse(raw); if(!p||p.version!==1)throw new Error('Unknown save'); const fresh=emptyProgress();
 const list=(v:unknown)=>Array.isArray(v)?[...new Set(v.filter(x=>typeof x==='string'&&x.length<80))].slice(0,200):[];
 fresh.discoveries=list(p.discoveries); fresh.missions=list(p.missions).filter(id=>stations.some(s=>s.id===id));
 for(const id of Object.keys(fresh.inventory))fresh.inventory[id]=Math.min(5,count(p.inventory?.[id]));
 for(const id of Object.keys(skillLabels) as Skill[]){const s=p.skills?.[id];if(s&&typeof s==='object'){const total=count(s.firstTotal); fresh.skills[id]={firstTotal:total,firstCorrect:Math.min(total,count(s.firstCorrect)),independentCorrect:Math.min(total,count(s.independentCorrect)),corrections:count(s.corrections),hints:count(s.hints)};}}
 fresh.grades=Array.isArray(p.grades)?p.grades.filter((g:PracticeGrade)=>g&&Number.isFinite(g.date)&&g.total>0&&g.total<=100&&g.correct>=0&&g.correct<=g.total).slice(-10).map((g:PracticeGrade)=>practiceGrade(count(g.correct),count(g.total),g.date)):[];
 fresh.xp=count(p.xp);fresh.bandReward=p.bandReward===true;fresh.english=p.english!==false;fresh.quiet=p.quiet!==false;fresh.mode=p.mode==='2d'?'2d':'3d';return fresh;
}
export function loadProgress(storage:Pick<Storage,'getItem'>):{progress:Progress;warning:string} {try{return {progress:parseProgress(storage.getItem(STORAGE_KEY)),warning:''}}catch{return {progress:emptyProgress(),warning:'Your save could not be read. You can still play; a new save starts here.'}}}
export function saveProgress(storage:Pick<Storage,'setItem'>,progress:Progress){try{storage.setItem(STORAGE_KEY,JSON.stringify(progress));return ''}catch{return 'Saving is unavailable in this browser. Your progress lasts for this visit.'}}
export function discover(p:Progress,id:string):Progress{return p.discoveries.includes(id)?p:{...p,discoveries:[...p.discoveries,id],xp:p.xp+5};}
export function completeMission(p:Progress,id:string):Progress {if(p.missions.includes(id))return p;return {...p,missions:[...p.missions,id],xp:p.xp+25,bandReward:p.bandReward||id==='band'};}
export function recordAnswer(p:Progress,skill:Skill,correct:boolean,first:boolean,hinted:boolean):Progress {
 const s=p.skills[skill]??{firstCorrect:0,firstTotal:0,independentCorrect:0,corrections:0,hints:0};
 return {...p,skills:{...p.skills,[skill]:{...s,firstTotal:s.firstTotal+(first?1:0),firstCorrect:s.firstCorrect+(first&&correct?1:0),independentCorrect:s.independentCorrect+(first&&correct&&!hinted?1:0),corrections:s.corrections+(!first&&correct?1:0),hints:s.hints+(first&&hinted?1:0)}}};
}
export const missedSkills=(p:Progress)=>(Object.keys(skillLabels) as Skill[]).filter(id=>{const s=p.skills[id];return s&&s.independentCorrect<s.firstTotal});
export function shuffle<T>(items:T[],random= Math.random):T[]{const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]]}return result;}
