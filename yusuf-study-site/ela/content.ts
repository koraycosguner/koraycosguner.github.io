import type {Art,ElaMode,ElaQuestion,ElaSkill,Option} from './types';
export const ROOT='/quizzes/phrases-clauses/';
export const skillLabels:Record<ElaSkill,string>={subject:'Finding subjects',verb:'Finding verbs','phrase-clause':'Phrases & clauses','independent-dependent':'Independent & dependent',fragments:'Spotting fragments',building:'Building sentences'};
export const artInfo:Record<Art,{alt:string;caption:string}>={
 playground:{alt:'Children playing on a sunny school playground.',caption:'A setting does not supply words missing from a prompt.'},
 park:{alt:'A fictional young runner on a green park path.',caption:'Picture the scene. Answer from the words.'},
 snow:{alt:'A park bench and trees covered in fresh snow.',caption:'A description can be a phrase.'},
 bell:{alt:'A school bell beside a classroom door.',caption:'What happened when the bell rang?'},
 bird:{alt:'A small bird singing on a leafy branch.',caption:'Who or what? What happens?'},
 movie:{alt:'Welcoming cinema seats and popcorn before a movie begins.',caption:'Build a complete thought.'},
 puppy:{alt:'A golden-and-white puppy barking on a sunny garden path.',caption:'A small scene. A clear idea.'},
 bus:{alt:'An illustrated student running toward a parked school bus.',caption:'Picture the scene. Decide from the words.'},
 train:{alt:'An illustrated old train moving along railroad tracks.',caption:'Look for who or what, then what happens.'},
 dinner:{alt:'Four fictional people sharing dinner around a table in a sunny room.',caption:'Picture the scene. Decide from the words.'},
 trail:{alt:'Illustrated hikers on a steep, green hillside trail.',caption:'One thought can connect to another.'},
 mural:{alt:'An illustrated artist painting a colorful mural.',caption:'A sentence can contain a smaller clause.'},
 book:{alt:'An illustrated student finding a book in a welcoming library.',caption:'Read the highlighted words carefully.'},
};
const opts=(...labels:string[]):Option[]=>labels.map((label,i)=>({id:`c${i+1}`,label}));
const binary=(id:string,text:string,skill:ElaSkill,labels:string[],key:number,explanation:string,art:Art,extra:Partial<ElaQuestion>={}):ElaQuestion=>({id,text,prompt:skill==='phrase-clause'?'Phrase or clause?':skill==='independent-dependent'?'Independent or dependent?':'Choose the best answer.',format:'choice',skill,options:opts(...labels),answer:`c${key+1}`,explanation,help:skill==='phrase-clause'?'Look for a subject and a verb working together. Both are needed for a clause.':skill==='independent-dependent'?'A clause needs a subject and verb. Can these words stand alone as a complete thought?':'Look for who or what, what happens, and a complete thought.',art,...extra});
const pc=(id:string,text:string,clause:boolean,explanation:string,art:Art,extra:Partial<ElaQuestion>={})=>binary(id,text,'phrase-clause',['Phrase','Clause'],clause?1:0,explanation,art,extra);
const ic=(id:string,text:string,independent:boolean,explanation:string,art:Art,extra:Partial<ElaQuestion>={})=>binary(id,text,'independent-dependent',['Independent','Dependent'],independent?0:1,explanation,art,extra);
const pair=(id:string,text:string,subjectWords:string[],verbWords:string[],subjectKey:string,verbKey:string,explanation:string,art:Art,extra:Partial<ElaQuestion>={}):ElaQuestion=>({id,text,prompt:'Find the subject and the verb or verb form.',format:'pair',skill:'subject',subjectOptions:[...subjectWords.map(label=>({id:label.toLowerCase(),label})),{id:'missing',label:'No subject'}],verbOptions:[...verbWords.map(label=>({id:label.toLowerCase(),label})),{id:'missing',label:'No verb or verb form'}],subjects:[subjectKey],verbs:[verbKey],explanation,help:'Ask who or what the words are about, then look for an action or state. A verb form such as running does not make a clause by itself.',art,...extra});
const writing=(id:string,text:string,model:string,alternatives:string[],art:Art,extra:Partial<ElaQuestion>={}):ElaQuestion=>({id,text,prompt:'Turn this fragment into a complete sentence.',format:'write',skill:'building',art,model,alternatives,explanation:'There is more than one good answer. Compare your sentence with the checklist; it is not automatically marked right or wrong.',help:'You can add a subject, a main verb or an independent clause. Sometimes removing a dependent-clause starter also works.',...extra});
const teacher=(level:number,number:number)=>({teacher:{level,number}});
export const questions:ElaQuestion[]=[
 pair('g1-bird','The small bird chirped.',['bird','small'],['chirped','small'],'bird','chirped','Bird tells who; chirped tells what the bird did. Together they form a clause.','bird',{guided:true}),
 pair('g1-bridge','Under the tall bridge',['bridge','tall'],['Under','tall'],'missing','missing','Under the tall bridge tells where. There is no subject–verb pair doing a job here.','train',{guided:true}),
 pair('t1-1','The puppy barked.',['puppy','The'],['barked','puppy'],'puppy','barked','Puppy is the subject. Barked is the verb.','puppy',teacher(1,1)),
 pair('t1-2','Across the busy playground',['playground','busy'],['Across','busy'],'missing','missing','Playground is inside a location phrase. There is no subject and verb working together.','playground',teacher(1,2)),
 pair('t1-3','Running quickly toward the bus',['bus','Running'],['Running','quickly'],'missing','running','Running is a verb form, but these words name no subject doing the running and have no complete main verb. The group is a phrase.','bus',teacher(1,3)),
 pair('t1-4','The old train rumbled.',['train','old'],['rumbled','old'],'train','rumbled','Train is the subject. Rumbled is the verb.','train',teacher(1,4)),
 pc('g2-window','Near the window',false,'This tells where. It has no subject and verb working together.','book',{guided:true}),
 pc('g2-bird','The bird sang',true,'Bird is the subject; sang is the verb. That makes a clause.','bird',{guided:true}),
 pc('t2-1','Before dinner',false,'Before dinner tells when, but there is no subject–verb pair.','dinner',teacher(2,1)),
 pc('t2-2','Before dinner was served',true,'Dinner is the subject; was served is the full verb. It is a clause, even though before makes it dependent.','dinner',teacher(2,2)),
 pc('t2-3','The guests arrived',true,'Guests is the subject; arrived is the verb.','dinner',teacher(2,3)),
 pc('t2-4','Running quickly through the park',false,'Running is a verb form. The words do not name a subject doing the running or form a complete subject–verb clause.','park',teacher(2,4)),
 pc('t2-5','The runners were moving quickly',true,'Runners is the subject; were moving is the full verb.','trail',teacher(2,5)),
 pc('t2-6','After the long practice',false,'This tells when. It has no subject and verb working together.','park',teacher(2,6)),
 pc('t2-7','After practice ended',true,'Practice is the subject; ended is the verb. It is a dependent clause.','park',teacher(2,7)),
 pc('t2-8','Covered in fresh snow',false,'Covered describes something, but no subject and complete verb work together here.','snow',teacher(2,8)),
 ic('g3-because','Because the rain stopped',false,'Rain and stopped form a clause. Because leaves us waiting for what happened next.','trail',{guided:true}),
 ic('g3-rain','The rain stopped',true,'Rain is the subject; stopped is the verb. This is a complete thought.','trail',{guided:true}),
 ic('t3-1','Although the trail was steep',false,'Trail is the subject; was is the verb. Although leaves the thought needing another clause.','trail',teacher(3,1)),
 ic('t3-2','The hikers rested',true,'Hikers and rested form a complete thought that can stand alone.','trail',teacher(3,2)),
 ic('t3-3','When the bell rang',false,'Bell is the subject; rang is the verb. When leaves us waiting for what happened.','bell',teacher(3,3)),
 ic('t3-4','Students packed their books',true,'Students is the subject; packed is the verb. The thought can stand alone.','book',teacher(3,4)),
 ic('t3-5','If the library is open',false,'Library is the subject; is is the verb. If introduces a condition that needs another clause.','book',teacher(3,5)),
 ic('t3-6','We will return tomorrow',true,'We is the subject; will return is the full verb. It is a complete thought.','bus',teacher(3,6)),
 ic('t3-7','The artist who painted the mural',false,'Who painted the mural is a dependent relative clause describing artist. The whole line is a noun phrase; it still needs a main verb.','mural',{...teacher(3,7),focus:'who painted the mural',scopeNote:'Classify the highlighted words only, not the whole line.'}),
 ic('t3-8','I found the book that you recommended',false,'That you recommended is dependent and describes book. The whole sentence is complete: I found the book is its independent main clause.','book',{...teacher(3,8),focus:'that you recommended',scopeNote:'Classify the highlighted words only, not the whole sentence.'}),
 binary('g4-light','Because the power went out.','fragments',['A complete sentence','A fragment'],1,'Because starts a dependent clause. Add a complete thought: Because the power went out, we used flashlights.','book',{guided:true}),
 binary('g4-fix','Which revision is a complete sentence?','building',['While the puppy was sleeping.','While the puppy was sleeping, we read.','Sleeping on the rug.'],1,'The added clause we read completes the thought. A comma separates the opening dependent clause.','puppy',{guided:true}),
 writing('t4-1','Before the movie began.','Before the movie began, we bought popcorn.',['The movie began.','We bought popcorn before the movie began.'],'movie',teacher(4,1)),
 writing('t4-2','Running quickly down the sidewalk.','The child was running quickly down the sidewalk.',['A runner hurried down the sidewalk.'],'bus',teacher(4,2)),
 writing('t4-3','Although the test was difficult.','Although the test was difficult, I did my best.',['The test was difficult.','Although the test was difficult, I finished it.'],'book',teacher(4,3)),
 // Fresh mixed-review questions are distinct from the teacher practice.
 pair('r-pair','The young artist smiled.',['artist','young'],['smiled','young'],'artist','smiled','Artist is the subject; smiled is the verb.','mural'),
 pc('r-phrase','Beside the library door',false,'These words give a location without a subject–verb pair.','book'),
 ic('r-dependent','While the guests waited',false,'Guests waited is a subject–verb pair, but while leaves this thought unfinished.','dinner'),
 ic('r-independent','Our class visited the library',true,'Class is the subject; visited is the verb. This thought can stand alone.','book'),
 binary('r-fragment','Under the bus shelter.','fragments',['Complete sentence','Fragment'],1,'This location phrase does not have a subject and a main verb. A period alone cannot complete it.','bus'),
 binary('r-complete','The train was late.','fragments',['Complete sentence','Fragment'],0,'Train is the subject; was is the verb. This is a complete thought.','train'),
 writing('r-write','Because the train arrived.','Because the train arrived, we boarded.',['The train arrived.'],'train'),
 writing('r-write-two','Walking through the library.','The students were walking through the library.',['We walked through the library.'],'book'),
 // An unseen bank for review after assessment; never used in the graded test.
 binary('fresh-subject-1','The friendly librarian waved.','subject',['librarian','friendly','waved'],0,'Librarian tells who did the waving.','book',{targeted:true,prompt:'Which word is the subject?'}),
 binary('fresh-subject-2','Three hikers crossed the bridge.','subject',['crossed','hikers','bridge'],1,'Hikers tells who crossed. Bridge is what they crossed.','trail',{targeted:true,prompt:'Which word is the subject?'}),
 binary('fresh-verb-1','The artist was painting.','verb',['artist','painting only','was painting'],2,'Was painting is the full verb: helping verb plus main verb form.','mural',{targeted:true,prompt:'Which is the full verb?'}),
 binary('fresh-verb-2','The library is quiet.','verb',['quiet','is','library'],1,'Is is a linking verb. A verb can describe a state of being.','book',{targeted:true,prompt:'Which word is the verb?'}),
 pc('fresh-phrase-1','Around the dinner table',false,'This gives a location without a subject–verb pair.','dinner',{targeted:true}),
 pc('fresh-phrase-2','After the bus stopped',true,'Bus is the subject; stopped is the verb. A dependent clause is still a clause.','bus',{targeted:true}),
 ic('fresh-dependent-1','Unless the weather changes',false,'Weather and changes form a clause. Unless leaves a condition needing another clause.','trail',{targeted:true}),
 ic('fresh-independent-1','We packed our lunch',true,'We and packed form a complete thought.','dinner',{targeted:true}),
 binary('fresh-fragment-1','Because the library closed.','fragments',['Complete sentence','Fragment'],1,'Because leaves a dependent clause without a main clause.','book',{targeted:true}),
 binary('fresh-fragment-2','The puppy is sleepy.','fragments',['Complete sentence','Fragment'],0,'Puppy is the subject; is is the verb. This is a complete thought.','puppy',{targeted:true}),
 binary('fresh-build-1','Complete: Although it was cold, …','building',['we wore coats.','near the coats.','wearing coats.'],0,'We wore coats supplies an independent clause after the opening dependent clause.','trail',{targeted:true}),
 binary('fresh-build-2','Choose the correctly joined sentence.','building',['When the train arrived we, cheered.','When the train arrived, we cheered.','When the train arrived. We cheered.'],1,'An opening dependent clause is followed by a comma and the independent clause.','train',{targeted:true}),
 {id:'build-1',text:'Make a complete sentence.',prompt:'Tap the parts in order. You can move or remove them.',format:'build',skill:'building',art:'bus',parts:[{id:'after',label:'after school.'},{id:'played',label:'played'},{id:'children',label:'The children'}],order:['children','played','after'],explanation:'The children is the subject; played is the verb. After school adds when.','help':'Start with who, then what they did, then when.'},
 {id:'build-2',text:'Because it was raining, …',prompt:'Connect the dependent clause to a complete thought.',format:'build',skill:'building',art:'book',parts:[{id:'inside',label:'we stayed inside.'},{id:'because',label:'Because it was raining,'}],order:['because','inside'],explanation:'Because it was raining needs the independent clause we stayed inside. The comma joins this opening dependent clause to it.','help':'Put the because clause first. Follow it with a complete thought.'},
];
export const questionById=(id:string)=>questions.find(q=>q.id===id);
export const modes:Record<ElaMode,{title:string;short:string;blurb:string;art:Art;ids:string[]}>={
 'level-1':{title:'Find the Subject and Verb',short:'Level 1',blurb:'Who or what? What happens? First try two guided examples, then the four teacher questions.',art:'bird',ids:['g1-bird','g1-bridge','t1-1','t1-2','t1-3','t1-4']},
 'level-2':{title:'Phrase or Clause?',short:'Level 2',blurb:'Look for a subject and verb working together. Two warm-ups lead to all eight teacher questions.',art:'bird',ids:['g2-window','g2-bird',...Array.from({length:8},(_,i)=>`t2-${i+1}`)]},
 'level-3':{title:'Independent or Dependent?',short:'Level 3',blurb:'Can the clause stand alone? Try two warm-ups, then the eight teacher questions, including two carefully highlighted clauses.',art:'trail',ids:['g3-because','g3-rain',...Array.from({length:8},(_,i)=>`t3-${i+1}`)]},
 'level-4':{title:'Fix and Combine',short:'Level 4',blurb:'Try two warm-ups, then write your own complete sentences for all three teacher fragments.',art:'book',ids:['g4-light','g4-fix','t4-1','t4-2','t4-3']},
 review:{title:'Study Guide Review',short:'Mixed review',blurb:'Twelve small checks mix familiar teacher questions with new examples. Take a break whenever you need one.',art:'mural',ids:['r-pair','t1-4','r-phrase','t2-2','t2-5','r-dependent','r-independent','t3-8','r-fragment','r-complete','r-write','r-write-two']},
 test:{title:'Phrases vs. Clauses — Practice Test',short:'Practice test',blurb:'Nineteen questions: 16 automatically checked items and three written responses. Answers and self-checks appear at the end.',art:'train',ids:['t1-1','t1-2','t1-3','t1-4','t2-1','t2-2','t2-3','t2-4','t2-5','t2-7','t3-1','t3-2','t3-3','t3-5','t3-7','t3-8','t4-1','t4-2','t4-3']},
 builder:{title:'Build a Complete Sentence',short:'Sentence builder',blurb:'Two short builds. Tap sentence parts into place; use a keyboard or touch. No dragging needed.',art:'bus',ids:['build-1','build-2']},
 targeted:{title:'A little more practice',short:'Focused review',blurb:'Fresh examples focus on the concepts that need another look.',art:'book',ids:[]},
};
export const lessons=[
 {id:'subject',title:'Who or what?',body:'The subject tells who or what the sentence is about.',text:'The puppy barked.',subject:'puppy',art:'puppy' as Art,tip:'Puppy tells who did something.',label:'Subject'},
 {id:'verb',title:'What happens?',body:'A verb tells what someone or something does, or describes a state of being.',text:'The puppy barked.',verb:'barked',art:'puppy' as Art,tip:'Barked tells what the puppy did. In “The puppy is sleepy,” is is a verb too.',label:'Verb'},
 {id:'together',title:'A pair that works together.',body:'A clause has a subject and a verb working together.',text:'The puppy barked.',subject:'puppy',verb:'barked',art:'puppy' as Art,tip:'Puppy + barked: who + what happens.',label:'Clause'},
 {id:'phrase',title:'A scene is not always a sentence.',body:'A phrase does not contain a complete subject–verb combination working as a clause.',text:'Across the busy playground',art:'playground' as Art,tip:'This tells where. It does not name who is doing something. Judge the words, not people you see in the picture.',label:'Phrase'},
 {id:'running',title:'An action-like word needs a partner.',body:'Running is a verb form. Here it has no subject and no complete main verb.',text:'Running quickly toward the bus',verb:'Running',art:'bus' as Art,tip:'Compare: The student was running. Student + was running makes a clause.',label:'Phrase'},
 {id:'clause',title:'Find both pieces.',body:'A clause has a subject and a verb. Some clauses can stand alone; others need more.',text:'The old train rumbled.',subject:'train',verb:'rumbled',art:'train' as Art,tip:'Train is the subject. Rumbled is the verb.',label:'Clause'},
 {id:'independent',title:'A thought that stands on its own.',body:'An independent clause can stand alone as a complete sentence.',text:'The hikers rested.',subject:'hikers',verb:'rested',art:'trail' as Art,tip:'We know who, what happened, and a complete thought.',label:'Independent'},
 {id:'dependent',title:'A thought that needs a connection.',body:'A dependent clause has a subject and verb, but it needs another clause to complete the thought.',text:'Although the trail was steep',subject:'trail',verb:'was',art:'trail' as Art,tip:'Connect it: Although the trail was steep, the hikers continued walking.',label:'Dependent'},
];
export const writingChecks=[
 'My sentence has a subject and a main verb.',
 'My sentence expresses a complete thought.',
 'Any dependent clause connects to an independent clause.',
 'I checked the capital letter, comma if needed, and ending punctuation.',
];
export const intros:Record<'level-1'|'level-2'|'level-3'|'level-4',{rule:string;example:string;subject?:string;verb?:string;detail:string}>={
 'level-1':{rule:'Find who or what, then find the action or state.',example:'The small bird chirped.',subject:'bird',verb:'chirped',detail:'Bird = subject. Chirped = verb. Some groups are missing one or both.'},
 'level-2':{rule:'A subject + a verb working together makes a clause.',example:'The bird sang',subject:'bird',verb:'sang',detail:'Near the window is a phrase. The bird sang is a clause.'},
 'level-3':{rule:'An independent clause is a complete thought. A dependent clause needs another clause.',example:'Because the rain stopped',subject:'rain',verb:'stopped',detail:'The rain stopped can stand alone. Because the rain stopped leaves us waiting for more.'},
 'level-4':{rule:'A fragment is an incomplete sentence. Add what is missing, or revise the beginning.',example:'Because the power went out.',subject:'power',verb:'went',detail:'Possible revision: Because the power went out, we used flashlights.'},
};
