/** Original practice for the latest Unit 2 brief. Private class documents are not bundled. */
import {lessonPractice, proficiencyQuestions, proficiencyReview, type PrepQuestion, type PrepSkill} from './proficiency-content.ts';
import type {StudyHelp, StudyLesson, StudyQuestion, StudyStep} from './study-types.ts';

export const studyHelp: Record<StudyHelp,{title:string;lines:string[]}> = {
  pronouns:{title:'Who are we talking about?',lines:['yo = I · tú = one informal you · usted = one formal you','él / ella = he / she · nosotros / nosotras = we','ustedes = you all · ellos = male/mixed they · ellas = all-female they','In Spain: vosotros / vosotras = informal plural you.']},
  perspective:{title:'IN · TO · ABOUT',lines:['I am IN the group → nosotros / nosotras.','I speak TO a group → ustedes.','I speak ABOUT a group → ellos / ellas.','One formal listener → usted. In Spain, informal plural you → vosotros / vosotras.']},
  ser:{title:'WHO → pronoun → SER',lines:['yo → soy · tú → eres','él / ella / usted → es','nosotros / nosotras → somos','ustedes / ellos / ellas → son','vosotros / vosotras → sois (Spain)']},
  articles:{title:'Match gender + number',lines:['“the”: el / la for one; los / las for more than one.','“a / some”: un / una for one; unos / unas for more than one.','el chico → los chicos · el lápiz → los lápices']},
  adjectives:{title:'WHO → SER → adjective',lines:['-o: one masculine · -a: one feminine','-os: masculine/mixed plural · -as: feminine plural','responsable → responsables · exigente → exigentes','trabajador → trabajadora · fácil → fáciles']},
  hay:{title:'There is / there are',lines:['Hay una mochila. Hay dos libros.','HAY stays the same for one or more than one.','¿Hay un libro? → Sí, hay. / No, no hay.']},
  vocabulary:{title:'Use the clue in the scene',lines:['Ask what the person needs to do or find.','Write → a writing tool. Cut → scissors.','Horario = schedule · materia = subject · curso = course.','On this class list, goma = glue; pluma and bolígrafo both mean pen.']},
  origin:{title:'SER + de: origin',lines:['yo soy de… · tú eres de…','one person: es de… · a group: son de…','the speaker + others: somos de…','¿De dónde eres? = Where are you from?']},
  possession:{title:'SER + de: whose?',lines:['El cuaderno es de Ana. = The notebook belongs to Ana.','Los cuadernos son de Ana. = The notebooks belong to Ana.','Choose es / son from the object(s), not the owner.']},
};

function step(help:StudyHelp,prompt:string,answer:string,distractors:string[],explanation:string,hint?:string):StudyStep {
  const options=[answer,...distractors];
  const offset=[...prompt].reduce((sum,c)=>sum+c.charCodeAt(0),0)%options.length;
  return {help,prompt,answer,options:[...options.slice(offset),...options.slice(0,offset)],explanation,hint:hint??'Pause and use the clue in the scene.'};
}
function question(id:string,chapter:string,context:string,help:StudyHelp,prompt:string,answer:string,distractors:string[],explanation:string,hint?:string):StudyQuestion {
  return {id,chapter,context,steps:[step(help,prompt,answer,distractors,explanation,hint)]};
}
const helpForSkill=(skill:PrepSkill):StudyHelp=>{
  if(['yo','tu','el-ella','ellos-ellas'].includes(skill))return 'pronouns';
  if(['nosotros','ustedes'].includes(skill))return 'perspective';
  if(['soy','eres','es','somos','son','ser-uses'].includes(skill))return 'ser';
  if(['articles','plural'].includes(skill))return 'articles';
  if(skill==='hay')return 'hay';
  if(skill==='adjectives')return 'adjectives';
  if(skill==='origin')return 'origin';
  return 'vocabulary';
};
const chapterForWorld:Record<PrepQuestion['world'],string>={arrival:'Meeting the class',backpack:'Mi mochila',classroom:'Mi clase',schedule:'Mis clases',friends:'Mis compañeros',band:'End of the school day'};
const adapt=(item:PrepQuestion,prefix:string):StudyQuestion=>({id:`${prefix}-${item.id}`,chapter:chapterForWorld[item.world],context:item.context,reading:item.reading,steps:item.steps.map(s=>({prompt:s.prompt,options:[...s.options],answer:s.answer,hint:s.hint,explanation:s.explanation.split(/(?<=[.!?])\s/)[0],help:helpForSkill(s.skill)}))});
const lessonBank=(name:keyof typeof lessonPractice)=>lessonPractice[name].map(q=>adapt(q,'calm'));
const fromReview=(id:string)=>{const found=proficiencyReview.find(q=>q.id===id);if(!found)throw new Error(`Missing practice ${id}`);return adapt(found,'calm');};

export const studyLessons: StudyLesson[] = [
  {id:'pronouns',title:'Find the pronoun',summary:'A subject pronoun tells WHO we mean. Start with the person or people in the scene.',examples:['yo = I · tú = one informal you · usted = one formal you','él = he · ella = she · nosotros / nosotras = we','ustedes = you all · ellos = male/mixed they · ellas = all-female they'],questions:[
    question('learn-meaning-tu','Find the pronoun','Yusuf speaks informally to one friend.','pronouns','Which pronoun means “you, informal singular”?','tú',['usted','ellas'],'Tú means you when speaking informally to one person.','There is one friend listening.'),
    question('learn-meaning-ustedes','Find the pronoun','Sra. Abarca greets the whole class: «Ustedes».','pronouns','What does ustedes mean?','you all',['we, all girls','I'],'Ustedes means plural you: the people being addressed.'),
    question('learn-meaning-ellas','Find the pronoun','Ana and Sofía are the two girls in a story.','pronouns','Which meaning fits ellas?','they, all female',['we, all female','you, informal singular'],'Ellas means they for an all-female group.'),
    question('learn-single-pablo','Find the pronoun','Yusuf tells Ana ABOUT Pablo.','pronouns','Pablo → ?','él',['tú','ellos'],'One boy being talked ABOUT → él.','Pablo is the topic, not the listener.'),
  ]},
  {id:'perspective',title:'IN · TO · ABOUT',summary:'Find the speaker first. Being IN a group is different from speaking TO it or ABOUT it.',examples:['Yusuf + Mateo speak for themselves → nosotros','Yusuf → Ana + Pablo (TO) → ustedes','Yusuf → teacher, ABOUT Ana + Pablo → ellos'],questions:lessonBank('perspective')},
  {id:'ser',title:'WHO → pronoun → SER',summary:'SER means “to be.” Choose the form from the subject, even in a question.',examples:['yo → soy · tú → eres · él / ella / usted → es','nosotros / nosotras → somos','ustedes / ellos / ellas → son'],questions:[...lessonBank('ser'),question('learn-ser-color','WHO → pronoun → SER','Sofía tells the class her favorite color.','ser','Mi color favorito ___ el verde.','es',['eres','son'],'One color is a singular subject → es.','The subject is mi color, not Sofía.')]},
  {id:'address',title:'Formal you · Spain you all',summary:'Use usted for one formal listener. When a prompt specifically says Spain and informal plural, use vosotros or vosotras.',examples:['TO Sra. Abarca formally → usted → es','TO boys or a mixed group informally in Spain → vosotros → sois','TO an all-female group informally in Spain → vosotras → sois'],questions:[
    question('learn-formal-usted','Formal you','Ana speaks directly to Don Rafael, formally.','perspective','Which pronoun addresses Don Rafael?','usted',['él','tú'],'A formal singular listener → usted.','Talking TO one person formally.'),
    question('learn-spain-vosotros','Spain: plural you','In Spain, Ana speaks informally to Mateo and Pablo.','perspective','Which informal plural pronoun fits?','vosotros',['ellos','nosotros'],'In this Spain prompt, informal plural you → vosotros.','They are listeners; Ana is not included.'),
    question('learn-spain-vosotras','Spain: plural you','In Spain, Pablo addresses Ana and Sofía informally.','ser','Pablo: «Vosotras ___ mis amigas».','sois',['son','somos'],'Vosotras → sois.','Use the vosotros / vosotras row.'),
  ]},
  {id:'origin',title:'SER + origin',summary:'SER + de tells where someone is from. These places belong to our fictional practice characters.',examples:['Lucía es de Perú.','Lucía y Ana son de México.','Ana includes herself: «Somos de México».'],questions:[
    question('learn-origin-one','SER + origin','In the story, Isabel comes from Chile.','origin','Isabel ___ de Chile.','es',['eres','son'],'Isabel → ella → es de.','One person is being talked about.'),
    question('learn-origin-two','SER + origin','In the story, Lucía and Camila come from Perú.','origin','Lucía y Camila ___ de Perú.','son',['somos','es'],'Two people being talked about → son de.'),
    question('learn-origin-we','SER + origin','Ana and Sofía come from México in this story. Ana speaks for both.','origin','Ana: «Nosotras ___ de México».','somos',['son','soy'],'Ana is IN the group → nosotras somos.'),
  ]},
  {id:'possession',title:'SER + de: whose is it?',summary:'SER + de can show who owns something. Match SER to the object, not the owner.',examples:['El libro es de Mateo.','Los libros son de Mateo.','One owner can own several objects.'],questions:[
    question('learn-owner-one','Whose is it?','One notebook belongs to Ana.','possession','El cuaderno ___ de Ana.','es',['son','eres'],'One notebook → es de Ana.','Count notebooks, not owners.'),
    question('learn-owner-many','Whose is it?','Three pencils belong to Sofía.','possession','Los lápices ___ de Sofía.','son',['es','somos'],'Several pencils → son de Sofía.','The subject is los lápices.'),
    question('learn-owner-meaning','Whose is it?','El marcador es de Mateo.','possession','Who owns the marker?','Mateo',['Ana','Yusuf'],'Es de Mateo tells us it belongs to Mateo.'),
  ]},
  {id:'adjective-agreement',title:'WHO → SER → adjective',summary:'First choose SER. Then make the adjective fit the person or group.',examples:['Pablo es organizado. Ana es organizada.','Pablo y Ana son organizados. Ana y Sofía son organizadas.','responsable → responsables · exigente → exigentes · fácil → fáciles'],questions:[
    {id:'learn-adjective-build',chapter:'Build one sentence',context:'Ana and Sofía keep every school supply in its place.',steps:[
      step('pronouns','Talking ABOUT Ana + Sofía: which pronoun?','ellas',['ellos','ustedes'],'Two girls being talked ABOUT → ellas.'),
      step('ser','Ellas ___ organizadas.','son',['somos','es'],'Ellas → son.'),
      step('adjectives','Choose the sentence for both girls.','Ana y Sofía son organizadas.',['Ana y Sofía son organizados.','Ana y Sofía es organizada.'],'Two girls → feminine plural → organizadas.','Two girls: look for -as.'),
    ]},
    question('learn-adjective-worker','Adjective endings','Sofía works hard on her project.','adjectives','Sofía es ___. (hardworking)','trabajadora',['trabajador','trabajadoras'],'One girl → trabajadora.'),
    question('learn-adjective-responsibles','Adjective endings','Yusuf speaks for himself and Mateo. Both return their books on time.','adjectives','Mateo y yo somos ___.','responsables',['responsable','responsablos'],'Responsable becomes responsables for a group.','This adjective does not switch to -os.'),
  ]},
  {id:'articles',title:'Nouns + articles',summary:'Articles match the noun’s gender and number. Change both words when making a phrase plural.',examples:['the: el / la / los / las · a/some: un / una / unos / unas','el escritorio · la computadora · los libros · las mesas','el chico → los chicos · el lápiz → los lápices'],questions:lessonBank('articles')},
  {id:'hay',title:'HAY: there is / there are',summary:'HAY does not change for one object or several. Answer from what the scene actually contains.',examples:['Hay una mochila. Hay dos libros.','¿Hay un lápiz? Sí, hay.','No, no hay.'],questions:lessonBank('hay')},
  {id:'backpack',title:'Mi mochila: what do I need?',summary:'Use what someone needs to DO to choose the school supply. Learn a few objects at a time.',examples:['write → el lápiz · erase pencil → el borrador','cut → las tijeras · measure → la regla','On our list: la goma = glue · la pluma / el bolígrafo = pen'],questions:[...lessonBank('backpack'),question('learn-map','Mi mochila','Ana carries a picture showing countries and their locations in her backpack.','vocabulary','¿Qué consulta Ana para localizar los países?','el mapa',['el reloj','la silla'],'El mapa shows places and their locations.')]},
  {id:'classroom',title:'Mi clase: objects + school day',summary:'A clue tells you whether to choose furniture, a school activity, or a plan for the day.',examples:['el escritorio = desk · la mesa = table · la papelera = wastebasket','el horario = schedule · la materia = subject · el curso = course','On our list: la prueba = quiz · el examen = test'],questions:[
    ...lessonBank('classroom').filter(q=>q.id!=='calm-learn-classroom-desk'),
    question('learn-materia','School-day word bank','Sofía names Spanish as a subject she studies.','vocabulary','El español es una ___.','materia',['prueba','computadora'],'Materia means a school subject.'),
    question('learn-curso','School-day word bank','Mateo enrolls in a Spanish course for the semester.','vocabulary','Este semestre, Mateo toma un ___ de español.','curso',['almuerzo','horario'],'Curso means a course of study.'),
  ]},
  {id:'subjects',title:'Mis clases: classes + likes',summary:'Name the class, then say what you like. Gusta or gustan agrees with the thing liked.',examples:['¿Qué clases tienes? Yo tengo la clase de música.','¿Qué clases te gustan? A mí me gusta el español.','A mí me gustan las matemáticas.'],questions:lessonBank('subjects')},
  {id:'descriptions',title:'Mis compañeros: helpful clues',summary:'Use the action in the scene to choose a description. Then match its ending to the subject.',examples:['trabajador = hardworking · estudioso = studious · responsable = responsible','perezoso / flojo = lazy · estricto = strict · exigente = demanding','fácil = easy · difícil = difficult'],questions:[fromReview('review-adjectives'),fromReview('review-demanding'),fromReview('review-strict'),fromReview('review-lazy-word')]},
  {id:'ser-uses',title:'What does SER tell us?',summary:'The DOCTOR reminder covers description, occupation, characteristics, time, origin, and relationships. Focus on what the sentence means.',examples:['Soy profesora. → a job · Son las dos. → time','Es de Chile. → origin · Es mi amiga. → a relationship','Description and characteristics can overlap.'],questions:lessonBank('doctor')},
];

export const storyQuestions: StudyQuestion[] = [
  question('story-01','At the classroom door','Yusuf enters Spanish class. Sra. Abarca says, «¡Hola!»','perspective','Yusuf greets his teacher formally. Which pronoun addresses her?','usted',['ella','tú'],'Talking TO one adult formally → usted.','She is the listener.'),
  question('story-02','A first introduction','Sra. Abarca asks Yusuf, «¿Quién eres?»','ser','Yusuf: «Yo ___ Yusuf».','soy',['es','eres'],'Yo → soy.'),
  question('story-03','Meet María and Camila','María and Camila wave from the next table. Yusuf tells Mateo ABOUT the two girls.','pronouns','María + Camila → ?','ellas',['ustedes','ellos'],'Talking ABOUT two girls → ellas.'),
  question('story-04','The same two classmates','Yusuf continues introducing María and Camila to Mateo.','ser','«Ellas ___ compañeras de español».','son',['somos','es'],'Ellas → son.'),
  question('story-05','Mateo joins Yusuf','Mateo sits beside Yusuf. Yusuf now introduces the two of them together.','perspective','Yusuf: «Mateo y yo…» Which pronoun?','nosotros',['ellos','ustedes'],'The speaker is IN this group → nosotros.'),
  question('story-06','We are classmates','Yusuf finishes the introduction for himself and Mateo.','ser','«Nosotros ___ compañeros».','somos',['son','soy'],'Nosotros → somos.'),
  question('story-07','Pablo and Ana arrive','Pablo and Ana arrive together. Yusuf turns and speaks directly TO both of them.','perspective','Yusuf: «___ son mis amigos».','ustedes',['ellos','nosotros'],'Speaking TO a group → ustedes.'),
  question('story-08','Now talking about them','Pablo and Ana unpack. Yusuf tells Sra. Abarca ABOUT them.','perspective','Yusuf: «___ son mis amigos».','ellos',['ustedes','ellas'],'ABOUT a mixed group → ellos.'),
  question('story-09','Open the backpack','The introductions are over. Yusuf opens his backpack and needs to write a note in pencil.','vocabulary','¿Qué necesita para escribir a lápiz?','un lápiz',['un borrador','unas tijeras'],'Un lápiz makes the pencil marks.'),
  question('story-10','A small mistake','Yusuf writes the wrong number in that note and wants to remove the pencil mark.','vocabulary','¿Qué quita la marca de lápiz?','el borrador',['la regla','la pluma'],'El borrador erases a pencil mark.'),
  question('story-11','Keep the notes together','Mateo suggests using a notebook for all their notes, rather than loose sheets.','vocabulary','¿Dónde escriben estos apuntes?','en el cuaderno',['en el estuche','en la calculadora'],'El cuaderno holds written notes.'),
  question('story-12','Look inside','Yusuf checks his bag: one notebook, two books, one ruler. There are no scissors.','hay','¿Hay tijeras en la mochila?','No, no hay.',['Sí, hay.','Hay dos tijeras.'],'No scissors are in this bag → No, no hay.'),
  question('story-13','Borrow scissors','Ana lends Yusuf scissors for the paper activity. Now he cuts out a small star.','vocabulary','¿Qué usa Yusuf para cortar?','las tijeras',['la cinta','el libro'],'Las tijeras cut the paper.'),
  question('story-14','The shared table','Yusuf and Mateo place the paper star on their shared flat work surface.','vocabulary','El proyecto está en…','la mesa',['la ventana','la puerta'],'La mesa is their table.'),
  question('story-15','One more star','Sra. Abarca points to the classroom board so everyone can read the next instruction.','vocabulary','¿Dónde leen la instrucción de la pared?','en la pizarra',['en el reloj','en la papelera'],'La pizarra is the classroom board.'),
  question('story-16','Count the supplies','For the next activity, there are three pencils on the table.','articles','El plural de «el lápiz» es…','los lápices',['los lápiz','el lápices'],'Change the article and noun: los lápices.'),
  question('story-17','Finish the inventory','Ana checks the same three pencils before returning them to their owners.','hay','Completa: «___ tres lápices».','Hay',['Son de','Somos'],'Hay means there are, even for three objects.'),
  question('story-18','Return the notebook','The pencil activity ends. Yusuf sees Ana’s name on the one notebook.','possession','El cuaderno ___ de Ana.','es',['son','somos'],'One notebook → es de Ana.'),
  question('story-19','Plan the rest of the day','Before leaving Spanish class, Yusuf looks at the list of his classes and their times.','vocabulary','¿Qué consulta Yusuf?','el horario',['el almuerzo','el examen'],'El horario is his schedule.'),
  question('story-20','A class on the schedule','That schedule has a class for drawing and painting after Spanish.','vocabulary','Yusuf: «Tengo la clase de ___».','arte',['computación','educación física'],'Drawing and painting → arte.'),
  question('story-21','Compare favorite subjects','Mateo asks what Yusuf likes. In this story, Yusuf enjoys music.','vocabulary','Yusuf: «A mí me ___ la música».','gusta',['gustan','son'],'La música is singular → me gusta.'),
  question('story-22','Sofía joins the conversation','Sofía enjoys mathematics and says so to both boys.','vocabulary','Sofía: «A mí me ___ las matemáticas».','gustan',['gusta','soy'],'Las matemáticas is plural → me gustan.'),
  question('story-23','Meet Juan and Luis','Juan and Luis join the group. In this fictional story, both come from Perú.','origin','Juan y Luis ___ de Perú.','son',['es','somos'],'Two people being talked ABOUT → son de.'),
  question('story-24','A helpful classmate','On the way out, Mateo helps Yusuf find a book left under the table.','adjectives','¿Cómo es Mateo por ser amable?','simpático',['perezoso','difícil'],'Mateo is being kind and helpful → simpático.'),
  {id:'story-25',chapter:'Build a description',context:'Ana and Sofía sort every book and pencil before leaving. Yusuf describes the two girls.',steps:[
    step('pronouns','Ana + Sofía, talking ABOUT them → ?','ellas',['ellos','ustedes'],'Two girls being talked ABOUT → ellas.'),
    step('ser','Ellas ___ organizadas.','son',['es','somos'],'Ellas → son.'),
    step('adjectives','Choose the complete description.','Ana y Sofía son organizadas.',['Ana y Sofía son organizados.','Ana y Sofía es organizada.'],'Two girls → son organizadas.','For two girls, look for -as.'),
  ]},
  question('story-26','Describe the whole team','Yusuf includes himself and Mateo: they both returned every borrowed supply.','adjectives','Choose Yusuf’s sentence.','Mateo y yo somos responsables.',['Mateo y yo son responsables.','Mateo y yo somos responsable.'],'Speaker included → somos; more than one → responsables.'),
  question('story-27','A quick message from Spain','Before music class, Ana practices a message to two friends in Spain, informally. She uses vosotros.','ser','«Vosotros ___ mis amigos».','sois',['son','somos'],'Vosotros → sois in this Spain example.'),
  question('story-28','Together in music class','The friends reach music class. Sra. Abarca asks Yusuf and Mateo, «¿Ustedes son amigos?» Yusuf answers for both.','ser','«Sí, nosotros ___ amigos».','somos',['son','es'],'The listeners become the speakers: ustedes son → nosotros somos.'),
];

const guideParagraph='Ana y Sofía ___ estudiantes. Ellas tienen un libro. El libro ___ de Ana.';
export const studyGuideQuestions: StudyQuestion[] = [
  question('guide-01','1. Find the pronoun','Yusuf tells Mateo ABOUT Lucía, one girl.','pronouns','Lucía → ?','ella',['ellas','tú'],'ABOUT one girl → ella.'),
  question('guide-02','2. IN · TO · ABOUT','Ana says «Sofía y yo» and includes herself.','perspective','Which pronoun replaces Sofía y yo when Ana speaks?','nosotras',['ellas','ustedes'],'Ana is IN an all-female group → nosotras.'),
  {id:'guide-03',chapter:'3. Pronoun → SER',context:'Yusuf tells Sra. Abarca ABOUT Pablo and Luis.',steps:[step('pronouns','Pablo + Luis → ?','ellos',['nosotros','ustedes'],'Talking ABOUT two boys → ellos.'),step('ser','Ellos ___ compañeros.','son',['somos','es'],'Ellos → son.')]},
  question('guide-04','4. SER sentence completion','Mateo asks one friend a question informally.','ser','«¿Tú ___ estudiante de música?»','eres',['es','soy'],'Tú → eres, also in a question.'),
  question('guide-05','5. SER + origin','In the practice story, Camila and María come from Chile.','origin','Camila y María ___ de Chile.','son',['somos','es'],'Two people being talked ABOUT → son de.'),
  question('guide-06','6. SER + de','Two pencils belong to Juan.','possession','Los lápices ___ de Juan.','son',['es','eres'],'Several pencils → son de Juan.'),
  {id:'guide-07',chapter:'7. SER + adjective agreement',context:'Ana and Camila work hard. Yusuf describes both girls.',steps:[step('ser','Ana y Camila ___ trabajadoras.','son',['es','somos'],'Two people → son.'),step('adjectives','Choose the whole sentence.','Ana y Camila son trabajadoras.',['Ana y Camila son trabajadores.','Ana y Camila es trabajadora.'],'Two girls → trabajadoras.','Feminine plural: look for -as.')]},
  question('guide-08','8. Vocabulary word bank','Yusuf checks which classes he has at each time.','vocabulary','Yusuf mira su ___.','horario',['almuerzo','examen'],'Horario = schedule.'),
  {id:'guide-09',chapter:'9. Complete the Story',context:'Finish this short paragraph, one blank at a time.',reading:guideParagraph,steps:[step('ser','First blank: Ana y Sofía ___ estudiantes.','son',['somos','es'],'Ana + Sofía → ellas → son.'),step('possession','Second blank: El libro ___ de Ana.','es',['son','eres'],'The singular book takes es, even though two girls share the scene.')]},
  question('guide-10','10. Mixed Study Guide Challenge','Sra. Abarca tells Ana ABOUT Yusuf and Mateo. Both boys keep their supplies in order.','adjectives','Choose her complete description.','Ellos son organizados.',['Ustedes son organizados.','Nosotros somos organizados.'],'ABOUT two boys → ellos son organizados.','The teacher is not included and is not addressing the boys.'),
];

/** Reuse the already source-checked vocabulary scenarios; replace repeated basics with the new brief's grammar. */
const omittedTestIds=new Set([
  'prep-arrival-yo','prep-arrival-tu','prep-arrival-el','prep-arrival-ella','prep-arrival-eres','prep-arrival-es',
  'prep-pair-to','prep-pair-about','prep-pair-ellas','prep-pair-nosotras','prep-in-false','prep-dislike',
  'prep-school-lunch-reading','prep-reading-ser','prep-finale-referent','prep-finale-address','prep-finale-count','prep-finale-pair',
]);
const testAdditions:StudyQuestion[]=[
  question('test-meaning-tu','Pronoun meaning','Choose the subject pronoun for speaking to one friend informally.','pronouns','“You, informal singular” → ?','tú',['usted','yo','ellas'],'Tú is informal singular you.'),
  question('test-meaning-ustedes','Pronoun meaning','Sra. Abarca addresses several students.','pronouns','What does ustedes mean?','you all',['we','they, all female','I'],'Ustedes = plural you.'),
  question('test-meaning-ellas','Pronoun meaning','The subject pronoun is ellas.','pronouns','Which English meaning fits?','they, all female',['we, all female','mixed-group they','you, informal singular'],'Ellas refers to an all-female group being talked about.'),
  question('test-formal-person','Formal you','Yusuf speaks directly TO Don Álvaro, formally.','perspective','Which pronoun addresses him?','usted',['él','tú'],'Formal singular TO → usted.'),
  question('test-spain-mixed','Spain: informal plural','In Spain, Mateo speaks informally TO Ana and Luis together.','perspective','Which informal plural pronoun fits?','vosotros',['ellos','nosotros'],'The explicit Spain/informal prompt calls for vosotros.'),
  question('test-spain-girls','Spain: informal plural','In Spain, Juan speaks informally TO Sofía and Camila together.','perspective','Which informal plural pronoun fits?','vosotras',['ellas','nosotras'],'All-female informal listeners in this Spain prompt → vosotras.'),
  question('test-spain-ser','Spain: SER','Sofía writes to friends in Spain using vosotros.','ser','«Vosotros ___ compañeros de música».','sois',['son','somos','es'],'Vosotros → sois.'),
  question('test-you-and-ana','Names → pronoun','Sra. Abarca addresses Mateo and says «Ana y tú». Use the class convention outside Spain.','perspective','Which pronoun addresses this whole group?','ustedes',['ellos','nosotros'],'Ana + the listener → plural you → ustedes.'),
  question('test-you-and-me','Speaker included','Yusuf says to two friends: «Ustedes y yo». He includes himself.','perspective','Which pronoun includes everyone Yusuf names?','nosotros',['ellos','ustedes'],'The speaker is IN the group → nosotros.'),
  question('test-teacher-group','Talking ABOUT a group','Pablo tells Yusuf ABOUT a female teacher and her male and female students.','pronouns','La profesora y los estudiantes → ?','ellos',['ellas','ustedes'],'This is a mixed group being talked ABOUT → ellos.'),
  question('test-female-self','Speaker included','Sofía speaks for herself and Ana.','perspective','Sofía: «Ana y yo» → ?','nosotras',['ellas','nosotros'],'The speaker is included in an all-female group → nosotras.'),
  question('test-origin-we','SER + origin','In the story, Elena and Isabel come from Ecuador. Elena speaks for both.','origin','«Nosotras ___ de Ecuador».','somos',['son','soy'],'Nosotras → somos de.'),
  question('test-origin-plural','SER + origin','In the story, Juan and Luis come from Chile.','origin','Juan y Luis ___ de Chile.','son',['es','somos','eres'],'Two people being talked about → son de.'),
  question('test-owner-singular','SER + de','One textbook belongs to María and Camila together.','possession','El libro ___ de María y Camila.','es',['son','somos'],'The subject is one book → es. The two owners do not change it.'),
  question('test-owner-plural','SER + de','Several markers belong to just one student, Ana.','possession','Los marcadores ___ de Ana.','son',['es','eres'],'The subject is several markers → son, even with one owner.'),
  question('test-adjective-pair','SER + adjective','Lucía and Ana keep their desks organized. Describe both girls.','adjectives','Which sentence is correct?','Lucía y Ana son organizadas.',['Lucía y Ana son organizados.','Lucía y Ana es organizada.'],'Two girls → son + feminine plural organizadas.'),
  question('test-responsables','Adjective agreement','Yusuf and Mateo finish their work on time. Yusuf describes them both.','adjectives','Mateo y yo somos ___.','responsables',['responsable','responsablos'],'The plural of responsable is responsables.'),
  question('test-exigentes','Adjective agreement','Two fictional teachers expect a lot of effort and high-quality work.','adjectives','Los profesores son ___. (demanding)','exigentes',['exigente','exigentas'],'Exigente becomes exigentes for a plural subject.'),
  question('test-faciles','Adjective agreement','In the story, two classroom activities are easy.','adjectives','Las actividades son ___. (easy)','fáciles',['fácil','fácilas'],'Fácil becomes fáciles in the plural; the accent remains.'),
  {id:'test-connected-blanks',chapter:'Complete a paragraph',context:'Complete the same short paragraph, one blank at a time.',reading:'María y Ana ___ estudiantes. Su materia favorita ___ la música. Ellas son ___. (hardworking)',steps:[step('ser','First blank: María y Ana ___ estudiantes.','son',['somos','es'],'Two girls being talked about → son.'),step('ser','Second blank: Su materia favorita ___ la música.','es',['son','eres'],'One favorite subject → es.'),step('adjectives','Third blank: Ellas son ___. (hardworking)','trabajadoras',['trabajadores','trabajadora'],'Ellas → feminine plural → trabajadoras.')]},
];
export const testQuestions:StudyQuestion[]=[...proficiencyQuestions.filter(q=>!omittedTestIds.has(q.id)).map(q=>adapt(q,'calm-test')),...testAdditions];
