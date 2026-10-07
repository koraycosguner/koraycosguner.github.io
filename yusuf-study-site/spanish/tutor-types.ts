export type TutorGroup='Pronouns'|'SER'|'SER + de'|'Adjectives'|'Vocabulary'|'Listening'|'Articles & HAY';
export type TutorFormat='choice'|'picture-word'|'word-picture'|'listen-picture'|'listen-word'|'listen-sentence'|'listen-fill'|'listen-contrast'|'word-bank'|'sentence-build';
export type TutorChoice={id:string;label:string;visual?:string};
export type TutorFrame={title:string;body:string;spanish:string;audio:string;visual?:string;chain?:string[];contrast?:{label:string;spanish:string}[]};
export type TutorLesson={id:string;title:string;summary:string;skills:string[];frames:TutorFrame[]};
export type TutorSkill={id:string;label:string;group:TutorGroup;lessonId:string};
export type TutorWord={id:string;word:string;english:string;group:string;sentence:string;visual:string;scene:string;confusedWith?:string[]};
export type TutorQuestion={
  id:string;skills:string[];lessonId:string;format:TutorFormat;
  prompt:string;context?:string;choices:TutorChoice[];answer:string[];
  audio?:string;visual?:string;model:string;hints:string[];explanation:string;
  chain?:string[];contrast?:{label:string;spanish:string}[];
  teacher:boolean;difficulty:1|2|3;parallelGroup:string;vocabulary?:string[];
};
export type TutorMode='guided'|'lesson'|'practice'|'vocabulary'|'listening'|'review'|'test';
export type TutorTask={kind:'teach';lessonId:string;frame:number}|{kind:'question';questionId:string;scaffold:0|1|2;parallel?:boolean}|{kind:'checkpoint'};
export type TutorEvidence={sessionId:number;questionId:string;skills:string[];first:string[];last:string[];correct:boolean;firstCorrect:boolean;assisted:boolean;attempts:number;order:number;format:TutorFormat;mode?:TutorMode;scaffold?:0|1|2;audioPlayed?:boolean;hintLevel?:number};
export type TutorSession={id:number;mode:TutorMode;tasks:TutorTask[];index:number;selection:string[];feedback:boolean;hintLevel:number;complete:boolean;assisted:boolean;audioPlayed:boolean;introduced:string[];remediations:number};
export type TutorSaved={version:1;nextSession:number;session:TutorSession|null;taught:string[];evidence:TutorEvidence[];seen:string[];sessionsCompleted:number;completedSessionIds?:number[]};
