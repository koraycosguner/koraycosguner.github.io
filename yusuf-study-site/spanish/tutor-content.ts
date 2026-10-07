/** Validated Unit 2 practice. Classroom scenarios are fictional; source documents stay private. */
import {vocabulary as assignedVocabulary} from './content.ts';
import type {TutorChoice,TutorFrame,TutorLesson,TutorQuestion,TutorSkill,TutorWord} from './tutor-types.ts';

const priority=['libro','computadora','materia','curso','horario','prueba','examen','almuerzo'];
const backpack=['utiles','borrador','calculadora','cinta','cuaderno','estuche','goma','lapiz','colores','libro','marcador','mochila','papel','boligrafo','regla','tijeras','carpeta'];
const classroom=['escritorio','mapa','mesa','papelera','pizarra','puerta','reloj','silla','ventana'];
const people=['escuela','estudiante','profesor'];
const groupFor=(id:string)=>backpack.includes(id)?'In my backpack':classroom.includes(id)?'In the classroom':people.includes(id)?'People at school':'My school day';
const sceneFor=(id:string)=>id==='almuerzo'?'lunch':['prueba','examen','tarea'].includes(id)?'assessment':['computadora','computacion'].includes(id)?'computer':backpack.includes(id)?'backpack':priority.includes(id)?'schedule':'classroom';
const extras: [string,string,string,string,string][]=[
 ['computadora','la computadora','computer','Uso una computadora para hacer la tarea.','My school day'],
 ['materia','la materia','school subject','El español es una materia.','My school day'],
 ['arte','el arte','art','Dibujamos y pintamos en la clase de arte.','Classes & schedule'],
 ['ciencias','las ciencias','science','Estudiamos las plantas en la clase de ciencias.','Classes & schedule'],
 ['computacion','la computación','computer science','Usamos computadoras en la clase de computación.','Classes & schedule'],
 ['educacion-fisica','la educación física','physical education','Hacemos ejercicio en la clase de educación física.','Classes & schedule'],
 ['espanol','el español','Spanish','Practicamos español en la clase de español.','Classes & schedule'],
 ['estudios-sociales','los estudios sociales','social studies','Estudiamos la historia en la clase de estudios sociales.','Classes & schedule'],
 ['ingles','el inglés','English','Leemos en inglés en la clase de inglés.','Classes & schedule'],
 ['lenguaje','el lenguaje','language arts','Practicamos la lectura y la escritura en la clase de lenguaje.','Classes & schedule'],
 ['matematicas','las matemáticas','mathematics','Trabajamos con números en la clase de matemáticas.','Classes & schedule'],
 ['musica','la música','music','Tocamos instrumentos en la clase de música.','Classes & schedule'],
 ['trabajador','trabajador / trabajadora','hardworking','La estudiante es trabajadora.','Descriptions'],
 ['perezoso','perezoso / perezosa','lazy','El personaje del cuento es perezoso.','Descriptions'],
 ['flojo','flojo / floja','lazy','En este cuento, el personaje es flojo.','Descriptions'],
 ['aburrido','aburrido / aburrida','boring','En el cuento, la clase es aburrida.','Descriptions'],
 ['divertido','divertido / divertida','fun','La clase de música es divertida.','Descriptions'],
 ['organizado','organizado / organizada','organized','Ana guarda todo en su lugar; es organizada.','Descriptions'],
 ['desordenado','desordenado / desordenada','messy','En el cuento, el estudiante es desordenado.','Descriptions'],
 ['artistico','artístico / artística','artistic','La estudiante pinta cuadros; es artística.','Descriptions'],
 ['atletico','atlético / atlética','athletic','El estudiante practica muchos deportes; es atlético.','Descriptions'],
 ['chistoso','chistoso / chistosa','funny','El personaje cuenta chistes; es chistoso.','Descriptions'],
 ['facil','fácil','easy','Este ejercicio es fácil.','Descriptions'],
 ['dificil','difícil','difficult','Este ejercicio es difícil.','Descriptions'],
 ['exigente','exigente','demanding','La profesora del cuento pide mucho trabajo; es exigente.','Descriptions'],
 ['estudioso','estudioso / estudiosa','studious','Ana estudia todos los días; es estudiosa.','Descriptions'],
 ['responsable','responsable','responsible','Mateo devuelve los libros a tiempo; es responsable.','Descriptions'],
 ['estricto','estricto / estricta','strict','El profesor del cuento aplica todas las reglas; es estricto.','Descriptions'],
 ['simpatico','simpático / simpática','nice','El compañero saluda y ayuda a todos; es simpático.','Descriptions'],
];
const confusion:Record<string,string[]>={prueba:['examen'],examen:['prueba'],materia:['curso'],curso:['materia','horario'],horario:['curso']};
export const tutorWords:TutorWord[]=[
 ...assignedVocabulary.map(([id,word,english,sentence])=>({id,word,english,group:groupFor(id),sentence,visual:id,scene:sceneFor(id),confusedWith:confusion[id]})),
 ...extras.map(([id,word,english,sentence,group])=>({id,word,english,sentence,group,visual:id,scene:sceneFor(id),confusedWith:confusion[id]})),
];
const wordLesson=(word:TutorWord)=>({'In my backpack':'vocabulary-backpack','In the classroom':'vocabulary-classroom','My school day':'vocabulary-day','Classes & schedule':'vocabulary-subjects','People at school':'vocabulary-people','Descriptions':'vocabulary-descriptions'}[word.group]!);
const baseSkills: [string,string,TutorSkill['group'],string][]=[
 ['pronoun:yo','yo · I','Pronouns','pronouns-self'],['pronoun:tu','tú · one informal you','Pronouns','pronouns-self'],
 ['pronoun:el','él · he','Pronouns','pronouns-about'],['pronoun:ella','ella · she','Pronouns','pronouns-about'],
 ['pronoun:usted','usted · one formal you','Pronouns','pronouns-to'],['pronoun:nosotros','nosotros · we','Pronouns','pronouns-in'],['pronoun:nosotras','nosotras · all-female we','Pronouns','pronouns-in'],
 ['pronoun:vosotros','vosotros · Spain informal you all','Pronouns','pronouns-spain'],['pronoun:vosotras','vosotras · Spain all-female you all','Pronouns','pronouns-spain'],
 ['pronoun:ellos','ellos · male/mixed they','Pronouns','pronouns-about'],['pronoun:ellas','ellas · all-female they','Pronouns','pronouns-about'],['pronoun:ustedes','ustedes · you all','Pronouns','pronouns-to'],
 ['perspective:in','I am IN the group','Pronouns','pronouns-in'],['perspective:female','All-female groups','Pronouns','pronouns-in'],['perspective:mixed','Mixed groups','Pronouns','pronouns-about'],['perspective:to-about','TO or ABOUT?','Pronouns','pronouns-to'],['perspective:formal','Formal one-person address','Pronouns','pronouns-to'],['perspective:spain','Informal plural in Spain','Pronouns','pronouns-spain'],
 ...(['soy','eres','es','somos','sois','son'] as const).map(form=>[`ser:${form}`,form,'SER','ser'] as [string,string,TutorSkill['group'],string]),
 ['origin','SER + de: origin','SER + de','origin'],['possession','SER + de: whose?','SER + de','possession'],
 ['adjective:gender','Adjectives: gender','Adjectives','adjectives'],['adjective:number','Adjectives: number','Adjectives','adjectives'],
 ['articles','Articles match nouns','Articles & HAY','articles-hay'],['plural','Making nouns plural','Articles & HAY','articles-hay'],['hay','HAY: present or absent','Articles & HAY','articles-hay'],
 ['listening:word','Recognize a spoken word','Listening','listening'],['listening:sentence','Understand a short spoken sentence','Listening','listening'],
];
export const tutorSkills:TutorSkill[]=[...baseSkills.map(([id,label,group,lessonId])=>({id,label,group,lessonId})),...tutorWords.map(w=>({id:`word:${w.id}`,label:w.word,group:'Vocabulary' as const,lessonId:wordLesson(w)}))];
const F=(title:string,body:string,spanish:string,visual:string,chain?:string[],contrast?:TutorFrame['contrast']):TutorFrame=>({title,body,spanish,audio:spanish,visual,chain,contrast});
const L=(id:string,title:string,summary:string,frames:TutorFrame[]):TutorLesson=>({id,title,summary,frames,skills:tutorSkills.filter(s=>s.lessonId===id).map(s=>s.id)});
export const tutorLessons:TutorLesson[]=[
 L('pronouns-self','Me and you','Start with the speaker and one listener.',[
  F('I am speaking','Talking about myself uses yo.','Yo soy estudiante.','people:self',['ME','yo','soy','Yo soy estudiante.']),
  F('I speak TO one friend','An informal singular listener is tú.','Tú eres mi amigo.','people:one-listener',['TO one friend','tú','eres','Tú eres mi amigo.']),
 ]),
 L('pronouns-about','Talking ABOUT people','One person or a group: who is the topic?',[
  F('One boy','Talking ABOUT Vicente uses él.','Vicente es estudiante.','people:one-boy',['Vicente','él','es','Vicente es estudiante.']),
  F('One girl','Talking ABOUT Rocío uses ella.','Rocío es estudiante.','people:one-girl',['Rocío','ella','es','Rocío es estudiante.']),
  F('A mixed group','ABOUT a male or mixed group → ellos.','La profesora y los estudiantes son responsables.','people:about-mixed',['profesora + students','ellos','son']),
  F('An all-female group','ABOUT two girls → ellas.','María y Ana son amigas.','people:about-female',['María + Ana','ellas','son'],[{label:'One girl',spanish:'Ella es estudiante.'},{label:'Two girls',spanish:'Ellas son estudiantes.'}]),
 ]),
 L('pronouns-in','I am IN the group','Look for yo. The speaker changes the pronoun.',[
  F('Marcos + me','The speaker is included. This male/mixed group uses nosotros.','Marcos y yo somos estudiantes.','people:we',['Marcos + YO','nosotros','somos','Marcos y yo somos estudiantes.'],[{label:'I am IN',spanish:'Nosotros somos estudiantes.'},{label:'I speak ABOUT them',spanish:'Ellos son estudiantes.'}]),
  F('Ana + Mercedes','Ana speaks about herself and Mercedes. Both are female.','Mercedes y yo somos amigas.','people:we-female',['Mercedes + YO (Ana)','nosotras','somos','Mercedes y yo somos amigas.']),
  F('You all + me','Adding yo makes the group include its speaker.','Ustedes y yo somos compañeros.','people:we',['ustedes + YO','nosotros','somos']),
 ]),
 L('pronouns-to','TO or ABOUT?','A listener is different from the topic.',[
  F('TO one adult formally','Speak respectfully to Don Joaquín with usted.','Usted es profesor.','people:formal',['TO Don Joaquín formally','usted','es']),
  F('TO several people','In our class convention, plural you is ustedes.','María y tú son estudiantes.','people:to-group',['TO María + tú','ustedes','son'],[{label:'TO the group',spanish:'Ustedes son estudiantes.'},{label:'ABOUT the group',spanish:'Ellos son estudiantes.'}]),
  F('One or more listeners?','Usted is singular. Ustedes is plural.','Usted es profesor. Ustedes son profesores.','people:formal',undefined,[{label:'One formal listener',spanish:'usted → es'},{label:'Several listeners',spanish:'ustedes → son'}]),
 ]),
 L('pronouns-spain','Informal you all in Spain','Use this row when the prompt specifies Spain.',[
  F('TO boys or a mixed group','Informal plural you in Spain: vosotros.','Vosotros sois estudiantes.','people:spain',['TO a group in Spain','vosotros','sois']),
  F('TO an all-female group','Informal plural you in Spain, all female: vosotras.','Vosotras sois estudiantes.','people:spain-female',['TO girls in Spain','vosotras','sois']),
 ]),
 L('ser','WHO → pronoun → SER','Choose the verb from WHO, one pattern at a time.',[
  F('Talking about myself','Yo takes soy.','Yo soy estudiante.','people:self',['I','yo','soy']),
  F('One informal listener','Tú takes eres.','Tú eres responsable.','people:one-listener',['one friend','tú','eres']),
  F('One person','Él, ella and usted all take es.','Ella es estudiante. Usted es profesor.','people:one-girl',['one person','él / ella / usted','es']),
  F('The speaker + others','Nosotros and nosotras take somos.','Marcos y yo somos estudiantes.','people:we',['Marcos + YO','nosotros','somos'],[{label:'I am IN',spanish:'Nosotros somos.'},{label:'I speak ABOUT them',spanish:'Ellos son.'}]),
  F('Informal plural in Spain','Vosotros and vosotras take sois.','Vosotras sois responsables.','people:spain-female',['Spain: informal plural you','vosotras','sois']),
  F('They or you all','Ellos, ellas and ustedes take son.','Ellas son estudiantes. Ustedes son compañeros.','people:about-female',['a group without the speaker','ellas / ellos / ustedes','son']),
 ]),
 L('origin','SER + de: origin','Say where a fictional person comes from.',[
  F('Teresa + Perú','SER + de introduces a place of origin.','Teresa es de Perú.','origin:peru',['Teresa','ella','es','Teresa es de Perú.']),
  F('Two people','Match SER to the people in the subject.','Fernando y el señor García son de Ecuador.','people:about-mixed',['Fernando + señor García','ellos','son','Son de Ecuador.']),
  F('My friend + me','The speaker is included, so choose somos.','Mi amigo y yo somos de Uruguay.','people:we',['mi amigo + YO','nosotros','somos','Somos de Uruguay.']),
 ]),
 L('possession','SER + de: whose is it?','Count the objects, not their owners.',[
  F('One book','SER + de can tell who owns an object.','El libro es de Julia.','ownership:one-book-julia',['one book','el libro','es','El libro es de Julia.']),
  F('Several books','The books are plural, even with one owner.','Los libros son de Julia.','ownership:books-julia',['several books','los libros','son','Los libros son de Julia.'],[{label:'One object',spanish:'El libro es de Julia.'},{label:'Several objects',spanish:'Los libros son de Julia.'}]),
  F('The classroom maps','De can show association too.','Los mapas son de la clase.','ownership:maps-class',['several maps','los mapas','son','Los mapas son de la clase.']),
 ]),
 L('adjectives','Match the adjective','Notice the person or thing, then the ending.',[
  F('One person','Some adjective endings change with gender.','Roberto es trabajador. María es trabajadora.','adjectives:gender',undefined,[{label:'One boy',spanish:'trabajador'},{label:'One girl',spanish:'trabajadora'}]),
  F('Two girls','A feminine plural group uses trabajadoras.','María y Ana son trabajadoras.','adjectives:number',['two girls','ellas','son','trabajadoras']),
  F('A mixed group','Organizado changes to organizados for this group.','Marcos y Ana son organizados.','people:about-mixed',['mixed group','ellos','son','organizados']),
  F('Not every adjective ends in -o','Responsable and exigente keep the same gender form; add -s for plural.','Ana es responsable. Ana y Marcos son responsables.','adjectives:number-mixed',undefined,[{label:'One',spanish:'responsable · exigente'},{label:'More than one',spanish:'responsables · exigentes'}]),
  F('Fácil and difícil','Add -es in the plural and keep the written accent.','La clase es fácil. Las clases son fáciles.','facil',undefined,[{label:'One class',spanish:'fácil · difícil'},{label:'Several classes',spanish:'fáciles · difíciles'}]),
 ]),
 L('articles-hay','Articles, plurals and HAY','Match the noun; check what is present.',[
  F('One object','El / la mean the. Un / una mean a.','El libro. La mochila. Un libro. Una mochila.','libro',undefined,[{label:'Masculine',spanish:'el libro · un libro'},{label:'Feminine',spanish:'la mochila · una mochila'}]),
  F('More than one','Los / las mean the. Unos / unas mean some.','Los libros. Las mochilas. Unos libros. Unas mochilas.','mochila',undefined,[{label:'Masculine plural',spanish:'los libros · unos libros'},{label:'Feminine plural',spanish:'las mochilas · unas mochilas'}]),
  F('A spelling change','A final z changes to c before -es.','El lápiz. Los lápices.','lapiz',['el lápiz','los lápices']),
  F('Is it there?','HAY stays the same for one or several objects.','Hay un libro. Hay dos libros.','libro'),
  F('Present or absent','Answer from the inventory, not from guessing.','¿Hay un lápiz? Sí, hay. ¿Hay tijeras? No, no hay.','mochila'),
 ]),
 ...(['In my backpack','In the classroom','My school day','Classes & schedule','People at school','Descriptions']).map(group=>{
  const words=tutorWords.filter(w=>w.group===group); const id=wordLesson(words[0]);
  return L(id,group,'See one word, hear it, then use it.',words.map(w=>F(w.word,w.id==='goma'?'On this class list, goma means glue. Other regions may use it for eraser.':w.id==='carpeta'?'Folder is useful exercise enrichment.':w.id==='prueba'?'Our class list labels a short quiz prueba. Everyday meanings can overlap with examen.':w.id==='examen'?'Our class list labels a test examen. Everyday meanings can overlap with prueba.':['materia','curso'].includes(w.id)?'Materia names a subject; curso often names a course of study. Some contexts overlap.':'Look at the scene. Listen to the Spanish.',w.sentence,w.visual,undefined,['prueba','examen'].includes(w.id)?[{label:'Class-list quiz',spanish:'Tengo una prueba.'},{label:'Class-list test',spanish:'Tengo un examen.'}]:['materia','curso'].includes(w.id)?[{label:'A subject',spanish:'El español es una materia.'},{label:'A course of study',spanish:'Tomo un curso de español.'}]:undefined)));
 }),
 L('listening','Listen, then choose','Replay as often as you like.',[
  F('Start with a word','Listen for the object. Replaying is part of learning.','La computadora.','computadora'),
  F('Then a short sentence','Listen for the action and the thing it names.','Uso una computadora para hacer la tarea.','computadora'),
  F('The school day','Hear a complete sentence, then find its meaning.','Como pizza en el almuerzo.','almuerzo'),
 ]),
];

const bank:TutorQuestion[]=[];
function add(q:Omit<TutorQuestion,'choices'|'answer'>&{correct:string;others:string[]}):void {
 const {correct,others,...rest}=q;
 const labels=[correct,...others]; const offset=[...q.id].reduce((n,c)=>n+c.charCodeAt(0),0)%labels.length;
 const choices=labels.map((label,i)=>({id:`${q.id}-c${i}`,label}));
 bank.push({...rest,choices:[...choices.slice(offset),...choices.slice(0,offset)],answer:[`${q.id}-c0`]});
}
const pronounData:{id:string;word:string;lesson:string;visual:string;extras:string[];scenes:[string,string][];others:string[];ser:string;explanation:string}[]=[
 {id:'yo',word:'yo',lesson:'pronouns-self',visual:'people:self',extras:[],scenes:[['Hablo de mí.','Yo soy estudiante.'],['Me presento ante la clase.','Yo soy compañero de Ana.'],['Digo mi nombre.','Yo soy Marcos.'],['Hablo de mí, una sola persona.','Yo soy responsable.']],others:['tú','él'],ser:'soy',explanation:'The speaker talks about themself → yo → soy.'},
 {id:'tu',word:'tú',lesson:'pronouns-self',visual:'people:one-listener',extras:['perspective:to-about'],scenes:[['Hablo directamente a un amigo, de manera informal.','Tú eres mi amigo.'],['Ana habla directamente a su amiga Sofía, de manera informal.','Tú eres mi amiga.'],['Mateo habla directamente a su compañero Pablo, de manera informal.','Tú eres estudiante.'],['Hablo de manera informal a una sola compañera.','Tú eres responsable.']],others:['él','usted'],ser:'eres',explanation:'Talking TO one informal listener → tú → eres.'},
 {id:'el',word:'él',lesson:'pronouns-about',visual:'people:one-boy',extras:['perspective:to-about'],scenes:[['Hablo sobre Vicente.','Vicente es estudiante.'],['Hablo sobre Fernando.','Fernando es responsable.'],['Hablo sobre el profesor García.','El profesor García es estricto.'],['Hablo sobre Roberto.','Roberto es trabajador.']],others:['tú','ellos'],ser:'es',explanation:'ABOUT one male person → él → es. Él needs its accent.'},
 {id:'ella',word:'ella',lesson:'pronouns-about',visual:'people:one-girl',extras:['perspective:to-about'],scenes:[['Hablo sobre la señora Williams.','La señora Williams es profesora.'],['Hablo sobre Rocío.','Rocío es estudiante.'],['Hablo sobre Teresa.','Teresa es responsable.'],['Hablo sobre la profesora.','La profesora es trabajadora.']],others:['usted','ellas'],ser:'es',explanation:'ABOUT one female person → ella → es.'},
 {id:'usted',word:'usted',lesson:'pronouns-to',visual:'people:formal',extras:['perspective:formal','perspective:to-about'],scenes:[['Hablo directamente a don Joaquín, de manera formal.','Usted es profesor.'],['Hablo directamente a la señora García, de manera formal.','Usted es profesora.'],['Hablo directamente al doctor López, de manera formal.','Usted es responsable.'],['Hablo directamente a la profesora Morris, de manera formal.','Usted es trabajadora.']],others:['él','ustedes'],ser:'es',explanation:'TO one person formally → usted → es. The listener is not being talked ABOUT.'},
 {id:'nosotros',word:'nosotros',lesson:'pronouns-in',visual:'people:we',extras:['perspective:in'],scenes:[['Marcos dice: «Fernando y yo».','Fernando y yo somos amigos.'],['Roberto dice: «Ustedes y yo».','Ustedes y yo somos compañeros.'],['Mateo dice: «Mariela y yo».','Mariela y yo somos estudiantes.'],['Pablo dice: «Mi amigo y yo».','Mi amigo y yo somos responsables.']],others:['ellos','ustedes'],ser:'somos',explanation:'YO is IN this male/mixed group → nosotros → somos.'},
 {id:'nosotras',word:'nosotras',lesson:'pronouns-in',visual:'people:we-female',extras:['perspective:in','perspective:female'],scenes:[['Ana dice: «Mercedes y yo». Las dos son chicas.','Mercedes y yo somos amigas.'],['Sofía dice: «Ana y yo». Las dos son chicas.','Ana y yo somos estudiantes.'],['Camila dice: «Rocío y yo». Las dos son chicas.','Rocío y yo somos responsables.'],['Lucía dice: «Mi amiga y yo». Las dos son chicas.','Mi amiga y yo somos compañeras.']],others:['ellas','ustedes'],ser:'somos',explanation:'The female speaker is IN an all-female group → nosotras → somos.'},
 {id:'vosotros',word:'vosotros',lesson:'pronouns-spain',visual:'people:spain',extras:['perspective:spain','perspective:to-about'],scenes:[['En España, hablo a Juan y a otro chico de manera informal.','Vosotros sois estudiantes.'],['En España, hablo a Pablo y Ana de manera informal.','Vosotros sois responsables.'],['En España, hablo a Mateo y Roberto de manera informal.','Vosotros sois compañeros.'],['En España, hablo informalmente a un grupo de chicos y chicas.','Vosotros sois amigos.']],others:['ellos','vosotras'],ser:'sois',explanation:'Spain + TO an informal male/mixed group → vosotros → sois.'},
 {id:'vosotras',word:'vosotras',lesson:'pronouns-spain',visual:'people:spain-female',extras:['perspective:spain','perspective:female','perspective:to-about'],scenes:[['En España, hablo a Ana y Sofía de manera informal.','Vosotras sois estudiantes.'],['En España, hablo a María y Rocío de manera informal.','Vosotras sois amigas.'],['En España, hablo informalmente a un grupo formado solo por chicas.','Vosotras sois responsables.'],['En España, hablo a Lucía y Camila de manera informal.','Vosotras sois compañeras.']],others:['ellas','vosotros'],ser:'sois',explanation:'Spain + TO an informal all-female group → vosotras → sois.'},
 {id:'ellos',word:'ellos',lesson:'pronouns-about',visual:'people:about-mixed',extras:['perspective:mixed','perspective:to-about'],scenes:[['Hablo sobre la profesora y los estudiantes (chicos y chicas).','La profesora y los estudiantes son responsables.'],['Hablo sobre Fernando y el señor García.','Fernando y el señor García son de Ecuador.'],['Hablo sobre Roberto y Ana.','Roberto y Ana son estudiantes.'],['Hablo sobre Mateo y Pablo.','Mateo y Pablo son compañeros.']],others:['ustedes','ellas'],ser:'son',explanation:'ABOUT a male or mixed group, without the speaker → ellos → son.'},
 {id:'ellas',word:'ellas',lesson:'pronouns-about',visual:'people:about-female',extras:['perspective:female','perspective:to-about'],scenes:[['Hablo sobre María y Mariela.','María y Mariela son inteligentes.'],['Hablo sobre Ana y Rocío.','Ana y Rocío son estudiantes.'],['Hablo sobre las profesoras Hurst y Morris.','Las profesoras Hurst y Morris son trabajadoras.'],['Hablo sobre Mercedes y Lucía.','Mercedes y Lucía son amigas.']],others:['ustedes','nosotras'],ser:'son',explanation:'ABOUT an all-female group, without the speaker → ellas → son.'},
 {id:'ustedes',word:'ustedes',lesson:'pronouns-to',visual:'people:to-group',extras:['perspective:to-about'],scenes:[['En la convención de nuestra clase, hablo directamente a María y a ti.','María y tú son estudiantes.'],['En la convención de nuestra clase, hablo directamente a Roberto y a ti.','Roberto y tú son responsables.'],['Hablo directamente a varios estudiantes en nuestra clase.','Ustedes son estudiantes.'],['Hablo formalmente a dos profesores.','Ustedes son profesores.']],others:['ellos','nosotros'],ser:'son',explanation:'TO several people in our class convention → ustedes → son.'},
];
// Two additional contexts leave fresh same-skill examples after supported practice and correction.
const morePronouns:Record<string,[string,string][]>={
 yo:[['Respondo con información sobre mí.','Yo soy amigo de Luis.'],['Hablo de mi papel en la clase.','Yo soy compañero de Lucía.']],
 tu:[['Lucía habla directamente a su amigo Diego, de manera informal.','Tú eres mi compañero.'],['Hablo directamente a una amiga en una conversación informal.','Tú eres estudiosa.']],
 el:[['Hablo sobre Diego.','Diego es estudiante.'],['Hablo sobre el maestro López.','El maestro López es profesor.']],
 ella:[['Hablo sobre Isabel.','Isabel es estudiante.'],['Hablo sobre la doctora Ruiz.','La doctora Ruiz es responsable.']],
 usted:[['Hablo directamente a la directora Ruiz, de manera formal.','Usted es la directora.'],['Hablo directamente al señor Torres, de manera formal.','Usted es profesor.']],
 nosotros:[['Luis dice: «Diego y yo».','Diego y yo somos estudiantes.'],['Andrés dice: «Mi compañera y yo».','Mi compañera y yo somos responsables.']],
 nosotras:[['Isabel dice: «Lucía y yo». Las dos son chicas.','Lucía y yo somos estudiantes.'],['Elena dice: «Mi profesora y yo». Las dos son mujeres.','Mi profesora y yo somos organizadas.']],
 vosotros:[['En España, Sofía habla informalmente a Juan y a otro chico: «Juan y tú».','Juan y tú sois estudiantes.'],['En España, hablo directamente a Diego y Lucía de manera informal.','Vosotros sois responsables.']],
 vosotras:[['En España, hablo directamente a Isabel y Elena de manera informal.','Vosotras sois compañeras.'],['En España, hablo informalmente a tres amigas.','Vosotras sois estudiosas.']],
 ellos:[['Hablo sobre Luis y Elena.','Luis y Elena son estudiantes.'],['Hablo sobre el profesor Torres y la profesora Ruiz.','El profesor Torres y la profesora Ruiz son responsables.']],
 ellas:[['Hablo sobre Isabel y Elena.','Isabel y Elena son estudiantes.'],['Hablo sobre la doctora Ruiz y la señora Torres.','La doctora Ruiz y la señora Torres son responsables.']],
 ustedes:[['En nuestra clase, hablo directamente a Luis y a Elena.','Ustedes son compañeros.'],['Hablo formalmente a la directora Ruiz y al señor Torres.','Ustedes son responsables.']],
};
for(const p of pronounData)p.scenes.push(...morePronouns[p.id]);
for(const p of pronounData) p.scenes.forEach(([context,model],i)=>add({id:`pronoun-${p.id}-${i+1}`,skills:[`pronoun:${p.id}`,...p.extras],lessonId:p.lesson,format:'choice',prompt:'¿Qué pronombre corresponde?',context,correct:p.word,others:p.others,model,hints:['Find the speaker. Is the person a listener or the topic?',p.explanation],explanation:p.explanation,chain:[context,p.word,p.ser,model],contrast:[{label:'Look for the perspective',spanish:model}],teacher:true,difficulty:i<2?1:2,parallelGroup:`pronoun:${p.id}`,visual:p.visual}));

const serRows:[string,string,string,string,string[]][]=[
 ['soy','Yo ___ estudiante.','Yo soy estudiante.','people:self',['yo']],['soy','Yo ___ compañero de Ana.','Yo soy compañero de Ana.','people:self',['yo']],['soy','Yo ___ responsable.','Yo soy responsable.','people:self',['yo']],['soy','Yo ___ de Chile.','Yo soy de Chile.','people:self',['yo']],
 ['eres','Tú ___ estudiante.','Tú eres estudiante.','people:one-listener',['tú']],['eres','Tú ___ mi amigo.','Tú eres mi amigo.','people:one-listener',['tú']],['eres','¿De dónde ___ tú?','¿De dónde eres tú?','people:one-listener',['tú']],['eres','Tú ___ responsable.','Tú eres responsable.','people:one-listener',['tú']],
 ['es','Fernando ___ estudiante.','Fernando es estudiante.','people:one-boy',['Fernando','él']],['es','La señora Williams ___ profesora.','La señora Williams es profesora.','people:one-girl',['la señora Williams','ella']],['es','Usted ___ profesor.','Usted es profesor.','people:formal',['one formal listener','usted']],['es','Teresa ___ de Perú.','Teresa es de Perú.','people:one-girl',['Teresa','ella']],['es','Rocío ___ de México.','Rocío es de México.','people:one-girl',['Rocío','ella']],
 ['somos','Marcos y yo ___ estudiantes.','Marcos y yo somos estudiantes.','people:we',['Marcos + yo','nosotros']],['somos','Mariela y yo ___ amigos.','Mariela y yo somos amigos.','people:we',['Mariela + yo','nosotros']],['somos','Nosotras ___ responsables.','Nosotras somos responsables.','people:we-female',['female speaker + others','nosotras']],['somos','Mi amigo y yo ___ de Uruguay.','Mi amigo y yo somos de Uruguay.','people:we',['mi amigo + yo','nosotros']],['somos','Nosotros ___ exigentes.','Nosotros somos exigentes.','people:we',['speaker + others','nosotros']],
 ['sois','Vosotros ___ estudiantes.','Vosotros sois estudiantes.','people:spain',['vosotros']],['sois','Vosotras ___ responsables.','Vosotras sois responsables.','people:spain-female',['vosotras']],['sois','Vosotros ___ mis amigos.','Vosotros sois mis amigos.','people:spain',['vosotros']],['sois','Vosotras ___ trabajadoras.','Vosotras sois trabajadoras.','people:spain-female',['vosotras']],
 ['son','María y Mariela ___ inteligentes.','María y Mariela son inteligentes.','people:about-female',['María + Mariela','ellas']],['son','Marcos y usted ___ profesores.','Marcos y usted son profesores.','people:to-group',['Marcos + usted','ustedes']],['son','Roberto y tú ___ responsables.','Roberto y tú son responsables.','people:to-group',['Roberto + tú','ustedes']],['son','La profesora y los estudiantes ___ organizados.','La profesora y los estudiantes son organizados.','people:about-mixed',['profesora + students','ellos']],['son','Ellas ___ de Ecuador.','Ellas son de Ecuador.','people:about-female',['ellas']],
];
serRows.push(
 ['soy','Yo ___ amigo de Luis.','Yo soy amigo de Luis.','people:self',['yo']],
 ['soy','Yo ___ compañero de Lucía.','Yo soy compañero de Lucía.','people:self',['yo']],
 ['eres','Tú ___ de Ecuador.','Tú eres de Ecuador.','people:one-listener',['tú']],
 ['eres','Tú ___ compañero de Diego.','Tú eres compañero de Diego.','people:one-listener',['tú']],
 ['es','Ana ___ estudiante.','Ana es estudiante.','people:one-girl',['Ana','ella']],
 ['es','El maestro López ___ responsable.','El maestro López es responsable.','people:one-boy',['el maestro López','él']],
 ['somos','Lucía y yo ___ estudiantes.','Lucía y yo somos estudiantes.','people:we',['Lucía + yo','nosotros']],
 ['somos','Luis y yo ___ compañeros.','Luis y yo somos compañeros.','people:we',['Luis + yo','nosotros']],
 ['sois','Vosotros ___ organizados.','Vosotros sois organizados.','people:spain',['vosotros']],
 ['sois','Vosotras ___ de Chile.','Vosotras sois de Chile.','people:spain-female',['vosotras']],
 ['son','Los estudiantes ___ responsables.','Los estudiantes son responsables.','people:about-mixed',['los estudiantes','ellos']],
 ['son','Ustedes ___ artísticos.','Ustedes son artísticos.','people:to-group',['ustedes']],
);
const serCounts:Record<string,number>={};
for(const [form,prompt,model,visual,who] of serRows){
 const n=serCounts[form]=(serCounts[form]??0)+1;
 const others:Record<string,string[]>={soy:['eres','es'],eres:['soy','es'],es:['son','somos'],somos:['son','soy'],sois:['son','somos'],son:['es','somos']};
 add({id:`ser-${form}-${n}`,skills:[`ser:${form}`,...(form==='somos'?['perspective:in']:[])],lessonId:'ser',format:'choice',prompt,context:form==='sois'?'España: tratamiento informal plural.':prompt.includes(' y tú')?'Español de nuestra clase: uso americano.':undefined,correct:form,others:others[form],model,hints:['Look only at WHO the sentence is about.',`${who.at(-1)} → ${form}`],explanation:`${who.join(' → ')} → ${form}.`,chain:[...who,form,model],contrast:form==='somos'?[{label:'Speaker included',spanish:'Nosotros somos.'},{label:'Speaker not included',spanish:'Ellos son.'}]:form==='es'||form==='son'?[{label:'One person',spanish:'Ella es estudiante.'},{label:'Several people',spanish:'Ellas son estudiantes.'}]:undefined,teacher:true,difficulty:2,parallelGroup:`ser:${form}`,visual});
}
const originRows:[string,string,string,string][]=[['Teresa','es','Perú','ella'],['Rocío','es','México','ella'],['Mi amigo y yo','somos','Uruguay','nosotros'],['Fernando y el señor García','son','Ecuador','ellos'],['Ana y Camila','son','Chile','ellas'],['Nosotras','somos','Colombia','nosotras']];
originRows.forEach(([subject,verb,country,pronoun],i)=>add({id:`origin-${i+1}`,skills:['origin'],lessonId:'origin',format:i%2?'word-bank':'choice',prompt:`${subject} ___ ${country}.`,correct:`${verb} de`,others:[verb==='es'?'son de':'es de',verb==='somos'?'son de':'somos de'].filter((v,i,a)=>a.indexOf(v)===i),model:`${subject} ${verb} de ${country}.`,hints:['SER + de introduces where someone is from.',`${subject} → ${pronoun} → ${verb}`],explanation:`${subject} → ${pronoun} → ${verb}. Add de before the place of origin.`,chain:[subject,pronoun,verb,`${subject} ${verb} de ${country}.`],teacher:true,difficulty:2,parallelGroup:'origin',visual:country==='Perú'?'origin:peru':undefined}));
const possessRows:[string,string,string][]=[['El libro','es','Julia'],['Los libros','son','los estudiantes'],['Los lápices','son','Julia'],['Los mapas','son','la clase'],['La computadora','es','la profesora'],['Los cuadernos','son','Ana']];
possessRows.forEach(([subject,verb,owner],i)=>add({id:`possession-${i+1}`,skills:['possession'],lessonId:'possession',format:i%2?'word-bank':'choice',prompt:`${subject} ___ ${owner}.`,correct:`${verb} de`,others:[verb==='es'?'son de':'es de','somos de'],model:`${subject} ${verb} de ${owner}.`,hints:['Count the objects in the subject, not the owners.',`${subject} is ${verb==='es'?'one object':'more than one object'} → ${verb}`],explanation:`${subject} → ${verb}. De introduces the owner or association.`,chain:[subject,verb,'de',owner],contrast:[{label:'One book',spanish:'El libro es de Julia.'},{label:'Several books',spanish:'Los libros son de Julia.'}],teacher:true,difficulty:2,parallelGroup:'possession',visual:subject==='El libro'?'ownership:one-book-julia':subject==='Los libros'?'ownership:books':subject==='Los lápices'?'ownership:pencils-julia':subject==='Los mapas'?'ownership:maps-class':undefined}));
const adjectiveRows:[string,string,string,string,string,string[]][]=[
 ['gender','Roberto es ___. (trabajador)','trabajador','Roberto es trabajador.','One male person → trabajador.',['trabajadora','trabajadoras']],
 ['gender','María es ___. (trabajador)','trabajadora','María es trabajadora.','One female person → trabajadora.',['trabajador','trabajadores']],
 ['gender','La profesora es ___. (estricto)','estricta','La profesora es estricta.','One female person → estricta.',['estricto','estrictas']],
 ['gender','Rubén es ___. (perezoso)','perezoso','Rubén es perezoso.','This fictional male character → perezoso.',['perezosa','perezosas']],
 ['gender','Ana es ___. (organizado)','organizada','Ana es organizada.','One female person → organizada.',['organizado','organizadas']],
 ['gender','El doctor Kidd es ___. (estricto)','estricto','El doctor Kidd es estricto.','One male person → estricto.',['estricta','estrictos']],
 ['number','Las profesoras Hurst y Morris son ___. (trabajador)','trabajadoras','Las profesoras Hurst y Morris son trabajadoras.','Two women → feminine plural → trabajadoras.',['trabajadora','trabajadores']],
 ['number','Marcos y yo somos ___. (exigente)','exigentes','Marcos y yo somos exigentes.','More than one person → exigentes. Gender does not change exigente.',['exigente','exigentas']],
 ['number','Roberto y tú son ___. (responsable)','responsables','Roberto y tú son responsables.','More than one person → responsables.',['responsable','responsablos']],
 ['number','La clase de español y la clase de ciencias son ___. (fácil)','fáciles','La clase de español y la clase de ciencias son fáciles.','Several classes → fáciles; keep the accent.',['fácil','fácila']],
 ['number','Ana y Sofía son ___. (organizado)','organizadas','Ana y Sofía son organizadas.','An all-female group → organizadas.',['organizada','organizados']],
 ['number','Marcos y Ana son ___. (organizado)','organizados','Marcos y Ana son organizados.','A mixed group → organizados.',['organizado','organizadas']],
 ['number','Los exámenes son ___. (difícil)','difíciles','Los exámenes son difíciles.','More than one exam → difíciles; keep the accent.',['difícil','difícila']],
];
const adjectiveCounts:Record<string,number>={};
for(const [skill,prompt,correct,model,explanation,others] of adjectiveRows){const n=adjectiveCounts[skill]=(adjectiveCounts[skill]??0)+1;add({id:`adjective-${skill}-${n}`,skills:[`adjective:${skill}`],lessonId:'adjectives',format:'choice',prompt,correct,others,model,hints:[skill==='gender'?'Who is being described: one male or one female person?':'One person or thing, or more than one?',explanation],explanation,teacher:true,difficulty:2,parallelGroup:`adjective:${skill}`,visual:`adjectives:${skill}`,contrast:[{label:'One girl',spanish:'Ella es trabajadora.'},{label:'Two girls',spanish:'Ellas son trabajadoras.'}]});}
const articleRows:[string,string,string,string[]][]=[['art-el','Artículo definido singular: ___ libro.','el',['la','los']],['art-la','Artículo definido singular: ___ mochila.','la',['el','las']],['art-los','Artículo definido plural: ___ libros.','los',['el','las']],['art-las','Artículo definido plural: ___ mochilas.','las',['la','los']],['art-un','Artículo indefinido singular: ___ lápiz.','un',['una','unos']],['art-una','Artículo indefinido singular: ___ regla.','una',['un','unas']],['art-unos','Artículo indefinido plural: ___ cuadernos.','unos',['un','unas']],['art-unas','Artículo indefinido plural: ___ mesas.','unas',['una','unos']]];
articleRows.forEach(([id,prompt,correct,others])=>add({id,skills:['articles'],lessonId:'articles-hay',format:'choice',prompt,correct,others,model:prompt.split(': ')[1].replace('___',correct),hints:['Match the noun’s gender and number.','Check whether the prompt asks for definite (the) or indefinite (a/some).'],explanation:`${correct} matches this noun’s gender, number, and requested article type.`,teacher:true,difficulty:2,parallelGroup:'articles'}));
const pluralRows:[string,string,string[]][]=[['el lápiz','los lápices',['los lápiz','el lápices']],['un libro','unos libros',['un libros','unas libros']],['la mochila','las mochilas',['la mochilas','los mochilas']],['una clase','unas clases',['unos clases','una clases']]];
pluralRows.forEach(([singular,correct,others],i)=>add({id:`plural-${i+1}`,skills:['plural'],lessonId:'articles-hay',format:'choice',prompt:`El plural de «${singular}» es…`,correct,others,model:correct,hints:['Make both the article and noun plural.',singular.includes('lápiz')?'Final z changes to c before -es.':'Keep the noun’s gender.'],explanation:`${singular} → ${correct}. Both article and noun become plural.`,teacher:true,difficulty:2,parallelGroup:'plural'}));
const hayRows:[string,string,string,string[]][]=[['En la mochila: dos libros y una regla.','¿Hay libros?','Sí, hay.',['No, no hay.','Soy estudiante.']],['En la mochila: un cuaderno y dos lápices. No hay tijeras.','¿Hay tijeras?','No, no hay.',['Sí, hay.','Somos estudiantes.']],['En la mesa: tres libros.','___ tres libros en la mesa.','Hay',['Soy','Somos']],['En el estuche: un lápiz.','___ un lápiz en el estuche.','Hay',['Son','Soy']]];
hayRows.forEach(([context,prompt,correct,others],i)=>add({id:`hay-${i+1}`,skills:['hay'],lessonId:'articles-hay',format:'choice',prompt,context,correct,others,model:i===0?'Sí, hay dos libros.':i===1?'No, no hay tijeras.':i===2?'Hay tres libros en la mesa.':'Hay un lápiz en el estuche.',hints:['Use the written inventory as the source of truth.','HAY is unchanged for one or more objects.'],explanation:i<2?'The inventory tells what is present or absent. HAY does not change.':'HAY means there is or there are.',teacher:true,difficulty:1,parallelGroup:'hay'}));

const wordContexts:Record<string,[string,string]>={
 libro:['Para leer este cuento, abro mi ___.','libro'],computadora:['Para hacer la tarea digital, uso una ___.','computadora'],materia:['El español es una ___ que estudio en la escuela.','materia'],curso:['Este semestre tomo un ___ de español.','curso'],horario:['Consulto las horas de mis clases en mi ___.','horario'],prueba:['Según la convención de clase, una evaluación breve de cinco preguntas es una ___.','prueba'],examen:['No es una prueba. Es un ___ de toda la unidad.','examen'],almuerzo:['Como pizza y fruta en el ___.','almuerzo'],
};
const wordLabel=(w:TutorWord)=>w.word.split(' / ')[0].replace(/^(el|la|los|las) /,'');
function distractorsFor(w:TutorWord):TutorWord[]{
 // Avoid synonyms and the acknowledged curso/materia and prueba/examen overlap in single-key items.
 if(w.group==='Descriptions'){
  // Read the illustrated behavior; near-synonymous interpretations never compete as unique keys.
  const clearContrasts:Record<string,string[]>={atletico:['artistico','perezoso'],artistico:['atletico','perezoso'],perezoso:['trabajador','atletico'],flojo:['trabajador','atletico'],aburrido:['divertido','atletico'],divertido:['aburrido','atletico'],organizado:['desordenado','atletico'],desordenado:['organizado','atletico'],chistoso:['atletico','perezoso'],facil:['dificil','atletico'],dificil:['facil','atletico']};
  return (clearContrasts[w.id]??['artistico','atletico']).map(id=>tutorWords.find(word=>word.id===id)!);
 }
 const excluded=new Set([w.id,...(w.confusedWith??[]),'flojo','perezoso','profesor','estudiante','escuela']);
 const pool=tutorWords.filter(other=>!excluded.has(other.id)&&other.group===w.group);
 const fallback=tutorWords.filter(other=>!excluded.has(other.id)&&['libro','computadora','almuerzo','horario','regla','tijeras','mochila','silla'].includes(other.id));
 return [...pool,...fallback].filter((other,i,arr)=>arr.findIndex(x=>x.id===other.id)===i).slice(0,2);
}
for(const w of tutorWords){
 const lessonId=wordLesson(w),other=distractorsFor(w),parallelGroup=`word:${w.id}`,skills=[parallelGroup],others=other.map(wordLabel),correct=wordLabel(w);
 const explanation=w.id==='goma'?'On our class list, goma is glue. The scene shows gluing paper.':w.id==='prueba'||w.id==='examen'?'This uses our class’s quiz/test vocabulary. The everyday meanings of prueba and examen can overlap.':w.id==='curso'||w.id==='materia'?'In this context, materia names a subject and curso a course of study. Their uses can overlap elsewhere.':`${w.word}: ${w.english}. ${w.sentence}`;
 const common={skills,lessonId,model:w.sentence,hints:['Use the object or action in the scene.',w.english],explanation,parallelGroup,vocabulary:[w.id]};
 add({...common,id:`word-${w.id}-picture`,format:'picture-word',prompt:w.group==='Descriptions'?'Lee la escena. ¿Qué descripción corresponde?':'¿Qué palabra corresponde a la imagen?',correct,others,visual:w.visual,teacher:false,difficulty:1});
 const pictureChoices:TutorChoice[]=[w,...other].map(word=>({id:`word-${w.id}-image-${word.id}`,label:word.word,visual:word.visual}));
 bank.push({...common,id:`word-${w.id}-word-picture`,format:'word-picture',prompt:`${w.word} → elige la imagen.`,choices:[pictureChoices[1],pictureChoices[0],pictureChoices[2]],answer:[pictureChoices[0].id],teacher:false,difficulty:1});
 add({...common,id:`word-${w.id}-listen-word`,skills:[...skills,'listening:word'],format:'listen-word',prompt:'Escucha. ¿Qué palabra oyes?',correct,others:w.confusedWith?.length?[wordLabel(tutorWords.find(other=>other.id===w.confusedWith![0])!),others[0]]:others,audio:w.word.split(' / ')[0],teacher:false,difficulty:2});
 if(priority.includes(w.id)){
  bank.push({...common,id:`word-${w.id}-listen-picture`,skills:[...skills,'listening:word'],format:'listen-picture',prompt:'Escucha y elige la imagen.',audio:w.word,choices:[pictureChoices[2],pictureChoices[1],pictureChoices[0]],answer:[pictureChoices[0].id],teacher:false,difficulty:1});
  const [prompt,answer]=wordContexts[w.id];
  add({...common,id:`word-${w.id}-context`,format:'word-bank',prompt,correct:answer,others:other.map(wordLabel),teacher:true,difficulty:3});
  add({...common,id:`word-${w.id}-listen-fill`,skills:[...skills,'listening:sentence'],format:'listen-fill',prompt:w.sentence.replace(new RegExp(`\\b${answer}\\b`),'___'),audio:w.sentence,correct,others:w.confusedWith?.length?[wordLabel(tutorWords.find(other=>other.id===w.confusedWith![0])!),others[0]]:others,teacher:false,difficulty:2});
  add({...common,id:`word-${w.id}-listen-sentence`,skills:[...skills,'listening:sentence'],format:'listen-sentence',prompt:'Escucha. ¿Qué palabra de la escuela aparece?',audio:w.sentence,correct,others,teacher:false,difficulty:3});
 }else{
  // A meaning-recall form keeps the original assigned vocabulary accessible without a picture.
  add({...common,id:`word-${w.id}-recall`,format:'choice',prompt:`¿Qué palabra significa «${w.english}»?`,correct,others,teacher:false,difficulty:3});
 }
}
const listeningRows:[string,string,string,string,string,string[]][]=[
 ['fill-computer','Uso una computadora para hacer la tarea.','Uso una ___ para hacer la tarea.','computadora','computadora',['mochila','regla']],
 ['fill-lunch','Como pizza en el almuerzo.','Como pizza en el ___.','almuerzo','almuerzo',['horario','curso']],
 ['contrast-one','Ella es estudiante.','¿Qué frase oyes?','Ella es estudiante.','libro',['Ellas son estudiantes.','Yo soy estudiante.']],
 ['contrast-we','Nosotros somos estudiantes.','¿Qué frase oyes?','Nosotros somos estudiantes.','estudiante',['Ellos son estudiantes.','Tú eres estudiante.']],
];
listeningRows.forEach(([id,audio,prompt,correct,word,others])=>add({id:`listen-${id}`,skills:['listening:sentence',...(id.startsWith('fill')?[`word:${word}`]:[])],lessonId:'listening',format:id.startsWith('fill')?'listen-fill':'listen-contrast',prompt,audio,correct,others,model:audio,hints:['Replay and listen for the changing word.',id==='contrast-we'?'Listen for the speaker being included.':'Listen to the subject and the verb.'],explanation:id==='contrast-one'?'One person: ella es. Several people: ellas son.':id==='contrast-we'?'Nosotros includes the speaker and takes somos.':`The spoken sentence uses ${correct}.`,teacher:false,difficulty:2,parallelGroup:'listening:sentence'}));
const builds:[string,string,string[],string,string][]=[
 ['we','Marcos y yo somos estudiantes.',['Marcos y yo','somos','estudiantes.'],'ser:somos','ser'],
 ['we-parallel','Ana y yo somos compañeros.',['Ana y yo','somos','compañeros.'],'ser:somos','ser'],
 ['owner','Los libros son de los estudiantes.',['Los libros','son','de los estudiantes.'],'possession','possession'],
 ['owner-parallel','El cuaderno es de Ana.',['El cuaderno','es','de Ana.'],'possession','possession'],
 ['origin','Teresa es de Perú.',['Teresa','es','de Perú.'],'origin','origin'],
 ['origin-parallel','Rocío es de México.',['Rocío','es','de México.'],'origin','origin'],
];
for(const [id,model,pieces,skill,lessonId] of builds){const choices=pieces.map((label,i)=>({id:`build-${id}-p${i}`,label}));bank.push({id:`build-${id}`,skills:[skill],lessonId,format:'sentence-build',prompt:'Forma la oración. Empieza con la persona o las cosas.',choices:[choices[2],choices[0],choices[1]],answer:choices.map(c=>c.id),model,hints:['WHO comes first. Then SER. Then the rest.',pieces.slice(0,2).join(' → ')],explanation:`${pieces.join(' → ')}`,teacher:false,difficulty:2,parallelGroup:skill,visual:skill==='possession'?(id==='owner'?'ownership:books':undefined):skill==='origin'?(id==='origin'?'origin:peru':'people:one-girl'):'people:we'});}

/** Ordered, brief experiences: engine pairs each frame with the following question. */
const orderedLessons:TutorLesson[]=[
 L('school-day-story','One school day','Six short scenes: arrive, learn, use a computer, plan, eat and check your learning.',[
  F('1 · Arrive with your backpack','The written inventory tells you what is inside.','Hay un libro en la mochila.','mochila'),
  F('2 · In the classroom','The board is where the teacher writes for everyone.','La profesora escribe en la pizarra.','pizarra'),
  F('3 · Computer class','Use a familiar object to do schoolwork.','Uso una computadora para hacer la tarea.','computadora'),
  F('4 · Check the next class','A timetable connects classes to their times.','Consulto las horas de mis clases en mi horario.','horario'),
  F('5 · Lunch','Hear the school-day word in a complete sentence.','Como pizza en el almuerzo.','almuerzo'),
  F('6 · Check your learning','Our class uses prueba for a short quiz and examen for a test; meanings can overlap elsewhere.','No es una prueba. Es un examen.','examen',undefined,[{label:'Our class-list quiz',spanish:'la prueba'},{label:'Our class-list test',spanish:'el examen'}]),
 ]),
 L('builder-ser','Build WHO → pronoun → SER','Stay with Marcos and the speaker through three connected steps.',[
  F('1 · Find WHO','Marcos and the speaker are in this group. Look for yo.','Marcos y yo somos estudiantes.','people:we',['Marcos + YO','nosotros']),
  F('2 · Choose SER','Keep the same group. Nosotros takes somos.','Nosotros somos estudiantes.','people:we',['nosotros','somos']),
  F('3 · Put it together','Keep the subject, verb and rest of the sentence in order.','Marcos y yo somos estudiantes.','people:we',['Marcos + YO','nosotros','somos','Marcos y yo somos estudiantes.']),
 ]),
 L('builder-adjectives','Build an adjective match','Describe Ana and Sofía through three connected steps.',[
  F('1 · Look at the group','Ana and Sofía are two girls: feminine and plural.','Ana y Sofía son estudiantes.','people:about-female',['Ana + Sofía','feminine plural']),
  F('2 · Match the ending','One girl: organizada. Two girls: organizadas.','Ana es organizada. Ana y Sofía son organizadas.','adjectives:number',undefined,[{label:'One girl',spanish:'organizada'},{label:'Two girls',spanish:'organizadas'}]),
  F('3 · Use the whole sentence','The description agrees with both girls.','Ana y Sofía son organizadas.','people:about-female',['Ana + Sofía','ellas','son','Ana y Sofía son organizadas.']),
 ]),
 L('builder-de','Build SER + de: whose?','Follow Julia’s books through four short decisions.',[
  F('1 · Count the objects','Los libros means more than one book. The number of owners does not decide SER.','Los libros son de Julia.','ownership:books-julia',['los libros','more than one object']),
  F('2 · Choose SER','Several books take son, even when Julia is their only owner.','Los libros son de Julia.','ownership:books-julia',['los libros','plural subject','son']),
  F('3 · Show whose','Use de to connect the objects to their owner.','Los libros son de Julia.','ownership:books-julia',undefined,[{label:'Objects',spanish:'los libros'},{label:'Owner',spanish:'de Julia'}]),
  F('4 · Put it together','Subject, SER, then de + owner.','Los libros son de Julia.','ownership:books-julia',['los libros','plural subject','son','Los libros son de Julia.']),
 ]),
];
tutorLessons.push(...orderedLessons);
const orderedChoice=(id:string,lessonId:string,skills:string[],prompt:string,correct:string,others:string[],model:string,explanation:string,extra:Partial<TutorQuestion>={})=>add({id,lessonId,skills,format:'choice',prompt,correct,others,model,hints:['Return to the one pattern on the teaching screen.',explanation],explanation,teacher:false,difficulty:2,parallelGroup:skills[0],...extra});
const orderedBuild=(id:string,lessonId:string,skills:string[],pieces:string[],visual:string)=>{
 const choices=pieces.map((label,i)=>({id:`${id}-piece-${i}`,label}));
 bank.push({id,lessonId,skills,format:'sentence-build',prompt:'Ordena las partes para formar la oración.',choices:[choices[2],choices[0],choices[1]],answer:choices.map(c=>c.id),model:pieces.join(' '),hints:['Start with WHO or WHAT. Then SER. Then the rest.',pieces.slice(0,2).join(' → ')],explanation:pieces.join(' → '),teacher:false,difficulty:2,parallelGroup:skills[0],visual});
};
orderedChoice('school-day-1','school-day-story',['hay'],'___ un libro en la mochila.','Hay',['Soy','Somos'],'Hay un libro en la mochila.','HAY tells what is present. It stays the same for one or several objects.',{context:'Al llegar a la escuela. Inventario: un libro en la mochila.',visual:'libro'});
orderedChoice('school-day-2','school-day-story',['word:pizarra'],'¿Dónde escribe la profesora para toda la clase?','en la pizarra',['en el reloj','en la ventana'],'La profesora escribe en la pizarra.','La pizarra is the classroom writing board.',{context:'Ahora estás en la clase.',visual:'pizarra',vocabulary:['pizarra']});
orderedChoice('school-day-3','school-day-story',['word:computadora'],'Uso una ___ para hacer la tarea digital.','computadora',['regla','mochila'],'Uso una computadora para hacer la tarea digital.','The computer supports this digital schoolwork.',{context:'Después, vas a la clase de computación.',format:'word-bank',visual:'computadora',vocabulary:['computadora']});
orderedChoice('school-day-4','school-day-story',['word:horario'],'Consulto las horas de mis clases en mi ___.','horario',['almuerzo','examen'],'Consulto las horas de mis clases en mi horario.','El horario connects each class to its time.',{context:'Antes de salir, buscas la hora de la próxima clase.',format:'word-bank',visual:'horario',vocabulary:['horario']});
orderedChoice('school-day-5','school-day-story',['word:almuerzo','listening:sentence'],'Escucha. ¿En qué parte del día como pizza?','en el almuerzo',['en el curso','en el examen'],'Como pizza en el almuerzo.','The speaker eats pizza at lunch: en el almuerzo.',{context:'Llegas a la cafetería.',format:'listen-sentence',audio:'Como pizza en el almuerzo.',vocabulary:['almuerzo']});
orderedChoice('school-day-6','school-day-story',['word:examen'],'No es una prueba. Es un ___ de toda la unidad.','examen',['horario','almuerzo'],'No es una prueba. Es un examen de toda la unidad.','This uses our class’s test vocabulary. Prueba and examen can overlap in everyday Spanish.',{context:'Al final del día, compruebas lo que has aprendido.',format:'word-bank',visual:'examen',vocabulary:['examen']});
orderedChoice('builder-ser-1','builder-ser',['pronoun:nosotros','perspective:in'],'Marcos y yo → ¿qué pronombre?','nosotros',['ellos','ustedes'],'Marcos y yo somos estudiantes.','YO is included, so the group uses nosotros.',{context:'Hablo por Marcos y por mí.',visual:'people:we',chain:['Marcos + YO','nosotros']});
orderedChoice('builder-ser-2','builder-ser',['ser:somos','perspective:in'],'Marcos y yo ___ estudiantes.','somos',['son','es'],'Marcos y yo somos estudiantes.','The same group: nosotros → somos.',{context:'El mismo grupo: Marcos y yo.',visual:'people:we',chain:['Marcos + YO','nosotros','somos']});
orderedBuild('builder-ser-3','builder-ser',['ser:somos','perspective:in'],['Marcos y yo','somos','estudiantes.'],'people:we');
orderedChoice('builder-adjectives-1','builder-adjectives',['adjective:gender','adjective:number'],'Ana y Sofía → ¿qué grupo forman?','femenino plural',['femenino singular','masculino plural'],'Ana y Sofía son estudiantes.','Two girls form a feminine plural group.',{context:'Vamos a describir a Ana y Sofía.',visual:'people:about-female'});
orderedChoice('builder-adjectives-2','builder-adjectives',['adjective:number','adjective:gender'],'Ana y Sofía son ___. (organizado)','organizadas',['organizada','organizados'],'Ana y Sofía son organizadas.','Both girls: organizada becomes organizadas.',{context:'El mismo grupo: Ana y Sofía.',visual:'adjectives:number'});
orderedBuild('builder-adjectives-3','builder-adjectives',['adjective:number','adjective:gender'],['Ana y Sofía','son','organizadas.'],'people:about-female');
orderedChoice('builder-de-1','builder-de',['possession'],'Los libros → ¿cuántos objetos indica el sujeto?','más de uno',['uno','ninguno'],'Los libros son de Julia.','Los libros is plural. Count the objects, not their owner.',{context:'Los libros pertenecen a Julia.',visual:'ownership:books-julia'});
orderedChoice('builder-de-2','builder-de',['possession','ser:son'],'Los libros ___ de Julia.','son',['es','somos'],'Los libros son de Julia.','Several books → son.',{context:'Los mismos libros y la misma dueña.',visual:'ownership:books-julia',chain:['los libros','plural subject','son']});
orderedChoice('builder-de-3','builder-de',['possession'],'Los libros son ___ Julia.','de',['en','con'],'Los libros son de Julia.','SER + de connects the objects with their owner.',{context:'Julia es la dueña de los libros.',format:'word-bank',visual:'ownership:books-julia'});
orderedBuild('builder-de-4','builder-de',['possession'],['Los libros','son','de Julia.'],'ownership:books-julia');
for(const lesson of orderedLessons)lesson.skills=[...new Set(bank.filter(q=>q.lessonId===lesson.id).flatMap(q=>q.skills))];
export const tutorQuestions:TutorQuestion[]=bank;
