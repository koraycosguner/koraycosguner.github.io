export type ElaSkill='subject'|'verb'|'phrase-clause'|'independent-dependent'|'fragments'|'building';
export type ElaMode='level-1'|'level-2'|'level-3'|'level-4'|'review'|'test'|'builder'|'targeted';
export type Art='puppy'|'bus'|'train'|'dinner'|'trail'|'mural'|'book'|'playground'|'park'|'snow'|'bell'|'bird'|'movie';
export type Option={id:string;label:string};
export type ElaAnswer={choice?:string;subject?:string;verb?:string;text?:string;parts?:string[]};
export type ElaQuestion={
 id:string;text:string;prompt:string;format:'choice'|'pair'|'write'|'build';skill:ElaSkill;art:Art;
 options?:Option[];answer?:string;subjectOptions?:Option[];verbOptions?:Option[];subjects?:string[];verbs?:string[];
 parts?:Option[];order?:string[];explanation:string;help:string;model?:string;alternatives?:string[];
 focus?:string;scopeNote?:string;teacher?:{level:number;number:number};guided?:boolean;targeted?:boolean;
};
export type ElaResponse={first:ElaAnswer;current:ElaAnswer;helped:boolean;tries:number;checks:boolean[]};
export type ElaSession={mode:ElaMode;ids:string[];index:number;phase:'active'|'feedback'|'complete';draft:ElaAnswer;responses:Record<string,ElaResponse>;helped:boolean;number:number};
export type ElaEvidence={id:string;answer:ElaAnswer;helped:boolean;mode:ElaMode;run:number};
export type ElaWriting={text:string;submitted:boolean;checks:boolean[]};
export type ElaState={writing:Record<string,ElaWriting>;version:1;lessonIndex:number;learned:string[];session:ElaSession|null;evidence:ElaEvidence[];completed:ElaMode[];runs:number;seen:string[]};
