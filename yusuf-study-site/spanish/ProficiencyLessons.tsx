'use client';

import {useEffect, useRef, useState, type ReactNode} from 'react';
import {Portrait, SupplyArt} from './LearningVisuals';
import './proficiency-lessons.css';

export const lessonIds = ['pronouns','perspective','ser','articles','hay','backpack','classroom','subjects','descriptions','doctor'] as const;
export const lessonLabels:Record<string,string> = {
  pronouns:'Who are we talking about?', perspective:'IN · TO · ABOUT', ser:'Connect the person to SER',
  articles:'Small words that match', hay:'What is in the backpack?', backpack:'Mi mochila',
  classroom:'Mi clase', subjects:'Mis clases', descriptions:'Mis compañeros', doctor:'Why use SER?',
};

type WordCard = {word:string; meaning:string; cue:string; sentence:string; person?:string; art?:string; symbol?:string};
const backpackWords:WordCard[] = [
  {word:'el borrador',meaning:'eraser',cue:'There is a pencil mistake on your name card.',sentence:'Yo uso un borrador para borrar.',art:'borrador'},
  {word:'la calculadora',meaning:'calculator',cue:'Mateo checks a long calculation.',sentence:'Mateo usa la calculadora.',art:'calculadora'},
  {word:'la cinta',meaning:'tape',cue:'Attach the paper sign to your desk.',sentence:'Yo uso la cinta con el papel.',symbol:'◉'},
  {word:'el cuaderno',meaning:'notebook',cue:'Sra. Abarca asks you to take notes.',sentence:'Escribo en el cuaderno.',art:'cuaderno'},
  {word:'el estuche',meaning:'pencil pouch',cue:'Keep your pencils together.',sentence:'Hay dos lápices en el estuche.',art:'estuche'},
  {word:'la goma',meaning:'glue · on this class list',cue:'Stick the paper star to your name card.',sentence:'Uso la goma para pegar papel.',art:'goma'},
  {word:'el lápiz',meaning:'pencil',cue:'Write your name before class starts.',sentence:'Yo uso un lápiz para escribir.',art:'lapiz'},
  {word:'los lápices de colores',meaning:'colored pencils',cue:'Ana adds colors to the class poster.',sentence:'Ana usa los lápices de colores.',symbol:'✎'},
  {word:'el libro',meaning:'book',cue:'Open the story that the class will read.',sentence:'Hay un libro en mi mochila.',art:'libro'},
  {word:'el marcador',meaning:'marker',cue:'Write a large title on the board.',sentence:'Uso el marcador en la pizarra.',symbol:'▰'},
  {word:'la mochila',meaning:'backpack',cue:'Carry your supplies to the next class.',sentence:'Hay útiles en la mochila.',symbol:'🎒'},
  {word:'el papel',meaning:'paper',cue:'Ana needs a sheet for her drawing.',sentence:'Ana usa el papel en arte.',symbol:'▤'},
  {word:'la pluma / el bolígrafo',meaning:'pen · two names for the same tool',cue:'Write your final answer in ink.',sentence:'Yo uso un bolígrafo para escribir.',symbol:'✒'},
  {word:'la regla',meaning:'ruler',cue:'Measure a straight line on the poster.',sentence:'Yo uso una regla para medir.',art:'regla'},
  {word:'las tijeras',meaning:'scissors',cue:'Cut out the paper star.',sentence:'Uso las tijeras para cortar papel.',art:'tijeras'},
];
const classroomWords:WordCard[] = [
  {word:'el escritorio',meaning:'desk',cue:'Sra. Abarca puts her book on her desk.',sentence:'Hay un libro en el escritorio.',symbol:'▰'},
  {word:'la mesa',meaning:'table',cue:'Your group shares a table for the poster.',sentence:'Hay papel en la mesa.',symbol:'▱'},
  {word:'la papelera',meaning:'wastebasket',cue:'Put the scraps away after the activity.',sentence:'Hay papel en la papelera.',art:'papelera'},
  {word:'la pizarra',meaning:'board',cue:'Look where the teacher writes the example.',sentence:'La pizarra es verde.',symbol:'▣'},
  {word:'la puerta',meaning:'door',cue:'Mateo opens the way into the classroom.',sentence:'Hay una puerta.',art:'puerta'},
  {word:'el reloj',meaning:'clock',cue:'Check the time before music class.',sentence:'Hay un reloj en la clase.',art:'reloj'},
  {word:'la silla',meaning:'chair',cue:'Take a seat beside Ana.',sentence:'Hay una silla para Yusuf.',art:'silla'},
  {word:'la ventana',meaning:'window',cue:'Sofía looks outside at the school garden.',sentence:'La ventana es grande.',art:'ventana'},
  {word:'la clase',meaning:'class',cue:'You and Mateo are learning Spanish together.',sentence:'La clase de español es divertida.',person:'Mateo'},
  {word:'el curso',meaning:'course',cue:'Spanish is a course on your school schedule.',sentence:'Tengo un curso de español.',symbol:'▤'},
  {word:'el examen',meaning:'test',cue:'Show what you have learned after practice.',sentence:'Tengo un examen de español.',symbol:'✓'},
  {word:'el horario',meaning:'schedule',cue:'Find which class comes next.',sentence:'Miro mi horario.',symbol:'▦'},
  {word:'la prueba',meaning:'quiz',cue:'Try a short check of today’s learning.',sentence:'Tengo una prueba en la clase.',symbol:'✓'},
  {word:'el semestre',meaning:'semester',cue:'Think about this part of the school year.',sentence:'Este semestre tengo español.',symbol:'▦'},
  {word:'la tarea',meaning:'homework',cue:'Sra. Abarca gives you practice for home.',sentence:'La tarea es fácil.',art:'cuaderno'},
  {word:'el almuerzo',meaning:'lunch',cue:'Meet Mateo when it is time to eat.',sentence:'Tengo el almuerzo a las doce.',symbol:'◒'},
];
const subjectWords:WordCard[] = [
  {word:'el arte',meaning:'art',cue:'Ana paints a bright class poster.',sentence:'Tengo la clase de arte.',art:'arte'},
  {word:'las ciencias',meaning:'science',cue:'Sofía observes a plant growing.',sentence:'Tengo la clase de ciencias.',art:'ciencias'},
  {word:'la computación',meaning:'computing',cue:'Carlos works on a computer.',sentence:'Tengo la clase de computación.',symbol:'▣'},
  {word:'la educación física',meaning:'physical education',cue:'Mateo runs and plays a sport.',sentence:'Tengo la clase de educación física.',symbol:'⚽'},
  {word:'el español',meaning:'Spanish',cue:'Greet Sra. Abarca: ¡Buenos días!',sentence:'Tengo la clase de español.',person:'Sra. Abarca'},
  {word:'los estudios sociales',meaning:'social studies',cue:'Explore people and places on a map.',sentence:'Tengo la clase de estudios sociales.',art:'mapa'},
  {word:'el inglés',meaning:'English',cue:'Read and write in English.',sentence:'Tengo la clase de inglés.',art:'libro'},
  {word:'el lenguaje',meaning:'language arts',cue:'Explore how a story uses words.',sentence:'Tengo la clase de lenguaje.',art:'cuaderno'},
  {word:'las matemáticas',meaning:'mathematics',cue:'Use numbers to solve a problem.',sentence:'Tengo la clase de matemáticas.',art:'matematicas'},
  {word:'la música',meaning:'music',cue:'Meet your friends in the band room.',sentence:'Tengo la clase de música.',art:'musica'},
];
const descriptionWords:WordCard[] = [
  {word:'trabajador / trabajadora',meaning:'hardworking',cue:'Mateo keeps working carefully on the poster.',sentence:'Mateo es trabajador.',person:'Mateo'},
  {word:'perezoso / perezosa · flojo / floja',meaning:'lazy · two alternatives',cue:'In this invented scene, Pablo avoids every job.',sentence:'En esta escena, Pablo es perezoso.',person:'Pablo'},
  {word:'aburrido / aburrida',meaning:'boring',cue:'The invented lesson repeats the same thing all hour.',sentence:'La clase es aburrida.',art:'cuaderno'},
  {word:'divertido / divertida',meaning:'fun',cue:'Music class includes a game with friends.',sentence:'La clase de música es divertida.',art:'musica'},
  {word:'organizado / organizada',meaning:'organized',cue:'Ana puts every paper into its right place.',sentence:'Ana es organizada.',person:'Ana'},
  {word:'desordenado / desordenada',meaning:'messy',cue:'In this scene, Carlos leaves papers everywhere.',sentence:'En esta escena, Carlos es desordenado.',person:'Carlos'},
  {word:'artístico / artística',meaning:'artistic',cue:'Ana makes a beautiful drawing for the poster.',sentence:'Ana es artística.',person:'Ana'},
  {word:'atlético / atlética',meaning:'athletic',cue:'Mateo enjoys running and playing sports.',sentence:'Mateo es atlético.',person:'Mateo'},
  {word:'chistoso / chistosa',meaning:'funny',cue:'Carlos tells a joke that makes his friends laugh.',sentence:'Carlos es chistoso.',person:'Carlos'},
  {word:'fácil',meaning:'easy',cue:'This practice task has just one familiar step.',sentence:'La tarea es fácil.',art:'cuaderno'},
  {word:'difícil',meaning:'difficult',cue:'This new task takes several tries.',sentence:'La tarea es difícil.',art:'cuaderno'},
  {word:'exigente',meaning:'demanding',cue:'The fictional teacher expects careful, complete work.',sentence:'La profesora ficticia es exigente.',person:'Profesora ficticia'},
  {word:'estudioso / estudiosa',meaning:'studious',cue:'Sofía likes spending time learning from books.',sentence:'Sofía es estudiosa.',person:'Sofía'},
  {word:'responsable',meaning:'responsible',cue:'Mateo returns the book he promised to bring.',sentence:'Mateo es responsable.',person:'Mateo'},
  {word:'estricto / estricta',meaning:'strict',cue:'In this scene, the teacher follows every class rule.',sentence:'La profesora ficticia es estricta.',person:'Profesora ficticia'},
  {word:'simpático / simpática',meaning:'nice / friendly',cue:'Mateo helps you find your backpack.',sentence:'Mateo es simpático.',person:'Mateo'},
];

function Example({sentence,meaning,children}:{sentence:string;meaning?:string;children?:ReactNode}) {
  return <div className="pl-example">{children}<div><p lang="es">{sentence}</p>{meaning&&<p className="pl-meaning" lang="en">{meaning}</p>}</div></div>;
}
function Chain({who,pronoun,verb}:{who:string;pronoun:string;verb:string}) {
  return <ol className="pl-chain" aria-label="WHO, then PRONOUN, then SER"><li><small>WHO?</small><b>{who}</b></li><li><small>PRONOUN</small><b lang="es">{pronoun}</b></li><li><small>SER</small><b lang="es">{verb}</b></li></ol>;
}
function People({names,label}:{names:string[];label:string}) {
  return <div className="pl-people"><span className="pl-role">{label}</span><div>{names.map(name=><span className="pl-person" key={name}><Portrait name={name}/><b>{name}</b></span>)}</div></div>;
}
function Perspective({kind,allFemale=false}:{kind:'in'|'to'|'about';allFemale?:boolean}) {
  const targets=allFemale?['Ana','Sofía']:['Mateo','Ana'];
  return <figure className={`pl-perspective pl-perspective-${kind}`}>
    {kind==='in'?<><People names={['Yusuf','Mateo']} label="Our group · Yusuf is IN it"/><figcaption><strong>IN → nosotros</strong><span>Yusuf is speaking for himself and Mateo.</span></figcaption></>:
      <><div className="pl-talk"><People names={['Yusuf']} label="Speaker"/><span className="pl-arrow" aria-hidden="true">→<small>speaks to</small></span><People names={kind==='to'?targets:['Sra. Abarca']} label="Listener(s)"/></div>{kind==='about'&&<div className="pl-about"><span>Yusuf tells the teacher ABOUT:</span><People names={targets} label="People being discussed"/></div>}<figcaption><strong>{kind==='to'?'TO → ustedes':`ABOUT → ${allFemale?'ellas':'ellos'}`}</strong><span>{kind==='to'?'The classmates are listening to Yusuf.':'The teacher is listening. The classmates are being discussed.'}</span></figcaption></>}
  </figure>;
}

function WordDeck({cards,label}:{cards:WordCard[];label:string}) {
  const [index,setIndex]=useState(0);
  const [revealed,setRevealed]=useState(false);
  const card=cards[index];
  function move(change:number){setIndex(value=>(value+change+cards.length)%cards.length);setRevealed(false)}
  return <section className="pl-word-deck" aria-label={label}>
    <div className="pl-deck-top"><b>{label}</b><span>{index+1} / {cards.length}</span></div>
    <div className="pl-word-scene" aria-live="polite"><div className="pl-word-art" aria-hidden="true">{card.person?<Portrait name={card.person} size="large"/>:card.art?<SupplyArt id={card.art}/>:<span>{card.symbol}</span>}</div><p>{card.cue}</p><h3 lang="es">{card.word}</h3><p className="pl-word-sentence" lang="es">{card.sentence}</p></div>
    <button type="button" className="pl-help" aria-expanded={revealed} onClick={()=>setRevealed(!revealed)}>{revealed?'Hide English meaning':'Show English meaning'}</button>
    {revealed&&<p className="pl-gloss" lang="en">{card.meaning}</p>}
    <div className="pl-deck-nav"><button type="button" onClick={()=>move(-1)} aria-label={`Previous item in ${label}`}>← Previous item</button><button type="button" onClick={()=>move(1)} aria-label={`Next item in ${label}`}>Next item →</button></div>
  </section>;
}

const bagItems=[{id:'lapiz',name:'lápiz',single:'un lápiz',plural:'lápices'},{id:'libro',name:'libro',single:'un libro',plural:'libros'},{id:'cuaderno',name:'cuaderno',single:'un cuaderno',plural:'cuadernos'}] as const;
function LiveBackpack(){
  const [counts,setCounts]=useState<Record<string,number>>({lapiz:1,libro:0,cuaderno:1});
  const [active,setActive]=useState<string>('lapiz');
  const item=bagItems.find(value=>value.id===active)!;
  const count=counts[active];
  return <div className="pl-bag"><p className="pl-mini-label">Your practice backpack · change what is inside</p><div className="pl-bag-items">{bagItems.map(value=><div key={value.id} className="pl-bag-item"><SupplyArt id={value.id}/><b lang="es">{value.name}</b><div className="pl-counter"><button type="button" aria-label={`Remove one ${value.name}`} disabled={!counts[value.id]} onClick={()=>{setCounts({...counts,[value.id]:counts[value.id]-1});setActive(value.id)}}>−</button><output aria-label={`Number of ${value.plural}`}>{counts[value.id]}</output><button type="button" aria-label={`Add one ${value.name}`} disabled={counts[value.id]>=3} onClick={()=>{setCounts({...counts,[value.id]:counts[value.id]+1});setActive(value.id)}}>+</button></div></div>)}</div><div className="pl-bag-answer" aria-live="polite"><p lang="es">¿Hay {item.single} en la mochila?</p><strong lang="es">{count?`Sí, hay ${count===1?item.single:`${count} ${item.plural}`}.`:`No, no hay ${item.plural}.`}</strong></div><small>Add or remove an item. The sentence follows what you can see.</small></div>;
}

function ArticleMatch({gender}:{gender:'masculine'|'feminine'|'plural'}){
  const examples=gender==='masculine'?[['el escritorio','the desk'],['un escritorio','a desk']]:gender==='feminine'?[['la computadora','the computer'],['una computadora','a computer']]:[['los libros / unos libros','the books / some books'],['las mesas / unas mesas','the tables / some tables']];
  return <div className="pl-matches">{examples.map(([es,en])=><Example key={es} sentence={es} meaning={en}/>)}</div>;
}

function PronounFlip({kind}:{kind:'one'|'group'|'we'}){
  const cards=kind==='one'?[
    {names:['Pablo'],pronoun:'él',meaning:'he',sentence:'Él es estudiante.'},
    {names:['Ana'],pronoun:'ella',meaning:'she',sentence:'Ella es estudiante.'},
  ]:kind==='we'?[
    {names:['Yusuf','Mateo'],pronoun:'nosotros',meaning:'we · includes the speaker',sentence:'Nosotros somos estudiantes.'},
    {names:['Ana','Sofía'],pronoun:'nosotras',meaning:'we · all-female group, Ana is speaking',sentence:'Nosotras somos amigas.'},
  ]:[
    {names:['Pablo','Carlos'],pronoun:'ellos',meaning:'they · male group',sentence:'Ellos son estudiantes.'},
    {names:['Ana','Sofía'],pronoun:'ellas',meaning:'they · all-female group',sentence:'Ellas son estudiantes.'},
    {names:['Pablo','Ana'],pronoun:'ellos',meaning:'they · mixed group',sentence:'Ellos son estudiantes.'},
  ];
  const [index,setIndex]=useState(0);const card=cards[index];
  return <div className="pl-flip"><People names={card.names} label={kind==='we'?'The first person is speaking for the group':'People being discussed'}/><div aria-live="polite"><div className="pl-pronoun-result"><span aria-hidden="true">→</span><b lang="es">{card.pronoun}</b><span>{card.meaning}</span></div><Example sentence={card.sentence}/></div><button type="button" className="pl-help" onClick={()=>setIndex((index+1)%cards.length)}>Show another example ({index+1}/{cards.length}) →</button></div>;
}

const doctorCards:WordCard[]=[
  {word:'D · Descripción',meaning:'Description · what something is like, including material',cue:'Look at the color of Yusuf’s backpack.',sentence:'La mochila es azul.',symbol:'🎒'},
  {word:'C · Características',meaning:'Characteristics · a quality of someone or something',cue:'Mateo helps you find the backpack.',sentence:'Mateo es simpático.',person:'Mateo'},
  {word:'T · Tiempo',meaning:'Time · clock time, day or date',cue:'The classroom clock points to two.',sentence:'Son las dos.',art:'reloj'},
];

type LessonStep={title:string;intro:string;content:ReactNode};
function stepsFor(id:string):LessonStep[]{
  switch(id){
    case 'pronouns':return [
      {title:'A small word can stand for a person',intro:'A subject pronoun replaces the person or people we are talking about.',content:<><Example sentence="Yusuf → yo" meaning="Yusuf speaks about himself: I." ><Portrait name="Yusuf" size="large"/></Example><Example sentence="Yo soy Yusuf." meaning="I am Yusuf."/><p className="pl-takeaway">First ask: WHO is the sentence about?</p></>},
      {title:'Talk ABOUT one classmate',intro:'Pablo can become él. Ana can become ella. The person stays the same; the name becomes a pronoun.',content:<PronounFlip kind="one"/>},
      {title:'Talk TO one person',intro:'Use tú with one friend. Use usted when speaking formally to one person, such as your teacher.',content:<><Example sentence="Mateo, tú eres estudiante." meaning="Mateo, you are a student."><Portrait name="Mateo"/></Example><Example sentence="Sra. Abarca, usted es profesora." meaning="Ms. Abarca, you are a teacher (formal)."><Portrait name="Sra. Abarca"/></Example><p className="pl-takeaway">Usted still means YOU. You are speaking directly TO the teacher.</p></>},
      {title:'A group that includes the speaker',intro:'Nosotros / nosotras means we. The person speaking belongs to the group.',content:<PronounFlip kind="we"/>},
      {title:'Talk ABOUT a group',intro:'Ellos means they for a male or mixed group. Ellas means they for an all-female group. Speak directly TO any of these groups with ustedes: you all.',content:<PronounFlip kind="group"/>},
    ];
    case 'perspective':return [
      {title:'IN: I belong to this group',intro:'Yusuf and Mateo introduce themselves together. Yusuf includes himself.',content:<><Perspective kind="in"/><Chain who="Yusuf + Mateo (we)" pronoun="nosotros" verb="somos"/><Example sentence="Nosotros somos estudiantes." meaning="We are students."/></>},
      {title:'TO: the group is listening to me',intro:'Yusuf looks at Mateo and Ana and speaks directly to both of them.',content:<><Perspective kind="to"/><Chain who="Mateo + Ana (you all)" pronoun="ustedes" verb="son"/><Example sentence="Ustedes son estudiantes." meaning="You are students (all of you)."/></>},
      {title:'ABOUT: I tell someone about a group',intro:'Yusuf tells Sra. Abarca about Mateo and Ana. The teacher is the listener.',content:<><Perspective kind="about"/><Chain who="Mateo + Ana (they)" pronoun="ellos" verb="son"/><Example sentence="Ellos son estudiantes." meaning="They are students."/></>},
      {title:'ABOUT an all-female group',intro:'Now Yusuf tells Sra. Abarca about Ana and Sofía. Use ellas for this all-female group.',content:<><Perspective kind="about" allFemale/><Chain who="Ana + Sofía (they)" pronoun="ellas" verb="son"/><p className="pl-takeaway">TO → ustedes. ABOUT → ellos / ellas. Both take son; the viewpoint changes the pronoun.</p></>},
    ];
    case 'ser':return [
      {title:'SER means “to be”',intro:'The form changes with WHO you mean. Begin with yourself, then speak to a friend.',content:<><Chain who="Me" pronoun="yo" verb="soy"/><Example sentence="Yo soy Yusuf." meaning="I am Yusuf."/><Chain who="One friend: you" pronoun="tú" verb="eres"/><Example sentence="Tú eres Mateo." meaning="You are Mateo."/></>},
      {title:'One person: es',intro:'Él and ella take es. Formal usted also takes es, even though it means you.',content:<><Chain who="Ana: she" pronoun="ella" verb="es"/><Example sentence="Él es Pablo. Ella es Ana." meaning="He is Pablo. She is Ana."/><Example sentence="Sra. Abarca, usted es profesora." meaning="You are a teacher (formal)."><Portrait name="Sra. Abarca"/></Example><p className="pl-takeaway">él → es · ella → es · usted → es</p></>},
      {title:'The speaker belongs: somos',intro:'Yusuf and Mateo speak for themselves. Use nosotros somos. An all-female group including its speaker uses nosotras somos.',content:<><Perspective kind="in"/><Chain who="Mateo + me" pronoun="nosotros" verb="somos"/><Example sentence="Mateo y yo somos estudiantes." meaning="Mateo and I are students."/></>},
      {title:'You all / they: son',intro:'Ustedes, ellos and ellas all take son. Still check whether you are talking TO or ABOUT the group.',content:<><Chain who="Mateo + Ana: you all" pronoun="ustedes" verb="son"/><Example sentence="Ustedes son estudiantes." meaning="You are students: speaking TO them."/><Chain who="Mateo + Ana: they" pronoun="ellos" verb="son"/><Example sentence="Ellas son estudiantes." meaning="They are students: ABOUT Ana and Sofía."/></>},
      {title:'Use the same three steps every time',intro:'Look for who is included before choosing the verb. A name plus yo means the speaker is in the group.',content:<><Chain who="Carlos + yo" pronoun="nosotros" verb="somos"/><Example sentence="Carlos y yo somos amigos." meaning="Carlos and I are friends."/><details className="pl-details"><summary>Chart extra: vosotros / vosotras</summary><p>This informal plural “you” is used mainly in Spain. It appears in your class chart.</p><Chain who="You all (Spain)" pronoun="vosotros / vosotras" verb="sois"/><Example sentence="Vosotros sois estudiantes."/></details></>},
    ];
    case 'articles':return [
      {title:'Learn the small word with the noun',intro:'Spanish nouns have a grammatical gender and a number. Masculine singular means one masculine noun.',content:<><ArticleMatch gender="masculine"/><p className="pl-takeaway">el = the · un = a / an. Both match a masculine singular noun.</p></>},
      {title:'One feminine noun: la / una',intro:'La computadora is feminine and singular. Its article matches.',content:<><ArticleMatch gender="feminine"/><p className="pl-takeaway">la = the · una = a / an. Learn the article and noun as a pair.</p></>},
      {title:'More than one: plural articles',intro:'Use los / unos for masculine plural nouns. Use las / unas for feminine plural nouns.',content:<><ArticleMatch gender="plural"/><p className="pl-takeaway">The noun and its small word both show plural.</p></>},
      {title:'Make both words match',intro:'A word ending in a vowel usually adds -s. For a word ending in z, change z to c and add -es.',content:<><Example sentence="el chico → los chicos" meaning="the boy → the boys"/><Example sentence="el lápiz → los lápices" meaning="the pencil → the pencils"><SupplyArt id="lapiz"/></Example><Example sentence="una mochila → unas mochilas" meaning="a backpack → some backpacks"/><p className="pl-takeaway">Ask: masculine or feminine? One or more than one?</p></>},
    ];
    case 'hay':return [
      {title:'HAY: something is here',intro:'Hay means there is or there are. Use the same word for one item or several.',content:<><Example sentence="Hay un lápiz." meaning="There is one pencil."><SupplyArt id="lapiz"/></Example><Example sentence="Hay dos lápices." meaning="There are two pencils."><span className="pl-pair-art"><SupplyArt id="lapiz"/><SupplyArt id="lapiz"/></span></Example><p className="pl-takeaway">One → hay. More than one → hay.</p></>},
      {title:'Open Yusuf’s practice backpack',intro:'Add and remove supplies. Watch the Spanish change when an item is present or missing.',content:<LiveBackpack/>},
      {title:'Look first. Then answer.',intro:'Mateo asks what is inside. Your answer depends on the backpack you can see.',content:<><Example sentence="¿Hay un libro?" meaning="Is there a book?"><Portrait name="Mateo"/></Example><Example sentence="Sí, hay. / No, no hay." meaning="Yes, there is. / No, there is not."/><Example sentence="¿Qué hay en la mochila?" meaning="What is in the backpack?"/><p className="pl-takeaway">Hay describes what is present. Soy describes who I am.</p></>},
    ];
    case 'backpack':return [
      {title:'Pack for your school day',intro:'Mateo helps you get ready. Learn each tool by what you can do with it.',content:<><img className="pl-scene-image" src="/quizzes/spanish/school-day/backpack.webp" alt="Illustrated school supplies beside an open backpack"/><Example sentence="¿Qué usas en la clase?" meaning="What do you use in class?"/><Example sentence="Yo uso un lápiz para escribir." meaning="I use a pencil to write."/></>},
      {title:'One useful object at a time',intro:'Read the situation. Picture yourself doing the action. Explore the 15 assigned supplies at your own pace.',content:<WordDeck cards={backpackWords} label="Mi mochila · supplies"/>},
      {title:'Choose the tool for the job',intro:'You are making a name card with Ana. Think about the action before naming the tool.',content:<><Example sentence="Escribir → un lápiz" meaning="Write → a pencil"><SupplyArt id="lapiz"/></Example><Example sentence="Borrar → un borrador" meaning="Erase → an eraser"><SupplyArt id="borrador"/></Example><Example sentence="Cortar → unas tijeras" meaning="Cut → scissors"><SupplyArt id="tijeras"/></Example><p className="pl-takeaway">Keep its article with it: el lápiz, la regla, las tijeras.</p></>},
    ];
    case 'classroom':return [
      {title:'Step into Sra. Abarca’s classroom',intro:'The same friends, a familiar room. Name the things you use and the parts of your school day.',content:<><img className="pl-scene-image" src="/quizzes/spanish/school-day/classroom-panorama.webp" alt="A bright illustrated classroom with desks, chairs, windows and a board"/><Example sentence="Hay mesas y sillas en la clase." meaning="There are tables and chairs in the classroom."/></>},
      {title:'Explore your classroom words',intro:'Start with a real situation, then connect it to the Spanish word. There are 16 assigned classroom and school-day terms.',content:<WordDeck cards={classroomWords} label="Mi clase · room & school day"/>},
      {title:'Build a classroom sentence',intro:'You put your notebook on the desk. Add an article and use hay to tell Mateo what is there.',content:<><Example sentence="el escritorio · un escritorio" meaning="the desk · a desk"/><Example sentence="Hay un cuaderno en el escritorio." meaning="There is a notebook on the desk."><SupplyArt id="cuaderno"/></Example><Example sentence="Hay dos cuadernos en la mesa." meaning="There are two notebooks on the table."/><p className="pl-takeaway">A desk is el escritorio. A table is la mesa. Both can hold your supplies.</p></>},
    ];
    case 'subjects':return [
      {title:'Find your next class',intro:'Carlos shows you the schedule. Each subject connects to something you do at school.',content:<WordDeck cards={subjectWords} label="Mis clases · 10 subjects"/>},
      {title:'Tell Mateo what classes you have',intro:'Start with tengo la clase de… Then add the subject without its article.',content:<><Example sentence="¿Qué clases tienes?" meaning="What classes do you have?"><Portrait name="Mateo"/></Example><Example sentence="Yo tengo la clase de música." meaning="I have music class."><SupplyArt id="musica"/></Example><Example sentence="Tengo la clase de matemáticas." meaning="I have mathematics class."/></>},
      {title:'Say what you like',intro:'Look at the thing you like. A singular subject, such as la música, takes gusta.',content:<><Example sentence="¿Qué clases te gustan?" meaning="What classes do you like?"/><Example sentence="A mí me gusta la música." meaning="I like music."><SupplyArt id="musica"/></Example><p className="pl-takeaway">la música → me gusta · el arte → me gusta</p></>},
      {title:'Plural likes and dislikes',intro:'A plural subject, such as las matemáticas, takes gustan. Put no before me to say you do not like something.',content:<><Example sentence="A mí me gustan las matemáticas." meaning="I like mathematics."><SupplyArt id="matematicas"/></Example><Example sentence="No me gustan las ciencias." meaning="I do not like science."/><Example sentence="No me gusta el arte." meaning="I do not like art."/><p className="pl-takeaway">The subject name decides gusta / gustan. These are practice preferences; yours can be different.</p></>},
    ];
    case 'descriptions':return [
      {title:'Notice what a friend does',intro:'Mateo helps you find your backpack. His helpful action gives you a clue about how to describe him.',content:<><Example sentence="Mateo te ayuda." meaning="Mateo helps you."><Portrait name="Mateo" size="large"/></Example><Chain who="Mateo" pronoun="él" verb="es"/><Example sentence="Él es simpático." meaning="He is nice / friendly."/></>},
      {title:'Show it, then name it',intro:'Each short scene gives a clue to one of your 16 assigned adjectives. These describe fictional practice scenes.',content:<WordDeck cards={descriptionWords} label="Mis compañeros · descriptions"/>},
      {title:'Make the description match',intro:'Many adjectives change for gender and number. Look at who or what you describe.',content:<><Example sentence="Mateo es organizado. Ana es organizada." meaning="One boy: organizado. One girl: organizada."/><Example sentence="Ana y Sofía son organizadas." meaning="More than one girl: organizadas."/><Example sentence="La clase es divertida. Las clases son divertidas." meaning="One class / more than one class."/><p className="pl-takeaway">Fácil, difícil, exigente and responsable keep the same masculine/feminine form. Plurals still change: fáciles, difíciles, exigentes, responsables.</p></>},
      {title:'Keep getting to know your classmates',intro:'Use SER for origin and descriptions. These characters and origins are fictional; you can answer as a story character.',content:<><Example sentence="¿De dónde eres? Soy de México." meaning="Where are you from? I am from Mexico."/><Example sentence="¿De dónde es Sofía? Es de México." meaning="Where is Sofía from? She is from Mexico."/><details className="pl-details"><summary>More ways to ask about our class</summary><p lang="es">¿Quién es tu profesora? Es Sra. Abarca.</p><p lang="es">¿Cómo es tu profesora? Es simpática.</p><p lang="es">¿Cómo son tus clases? Son divertidas.</p><p lang="es">¿Cómo son tus compañeros? Son responsables.</p><p lang="es">¿Cómo eres? Soy estudioso.</p></details></>},
    ];
    case 'doctor':return [
      {title:'O: a person’s occupation',intro:'DOCTOR is a memory aid for uses of SER. Discover one use at a time. Begin with Sra. Abarca’s job.',content:<><Example sentence="Sra. Abarca es profesora." meaning="Ms. Abarca is a teacher."><Portrait name="Sra. Abarca" size="large"/></Example><div className="pl-doctor-reveal"><b>O</b><span>Ocupación · occupation</span></div><p className="pl-takeaway">SER tells you what her job is.</p></>},
      {title:'O: where someone is from',intro:'Sofía shares her fictional origin with Yusuf. A different O in DOCTOR means origin.',content:<><Example sentence="Sofía es de México." meaning="Sofía is from Mexico."><Portrait name="Sofía" size="large"/></Example><div className="pl-doctor-reveal"><b>O</b><span>Origen · origin</span></div><Chain who="Sofía" pronoun="ella" verb="es"/></>},
      {title:'R: how people are connected',intro:'Yusuf and Mateo reach the band room together. They can describe their relationship.',content:<><Example sentence="Mateo es mi amigo." meaning="Mateo is my friend."><Portrait name="Mateo" size="large"/></Example><div className="pl-doctor-reveal"><b>R</b><span>Relaciones · relationships</span></div><Chain who="Mateo + me" pronoun="nosotros" verb="somos"/><Example sentence="Somos amigos." meaning="We are friends."/></>},
      {title:'Discover D, C and T',intro:'Explore the remaining three clues one at a time. Description and characteristics can overlap; the meaning of the sentence matters.',content:<><WordDeck cards={doctorCards} label="DOCTOR · three more clues"/><details className="pl-details"><summary>One o’clock is different</summary><Example sentence="Es la una. Son las dos." meaning="It is one o’clock. It is two o’clock."/></details></>},
    ];
    default:return stepsFor('pronouns');
  }
}

export default function ProficiencyLessons({lessonId,onPractice}:{lessonId:string;onPractice:()=>void}){
  const [step,setStep]=useState(0);
  const heading=useRef<HTMLHeadingElement>(null);
  const steps=stepsFor(lessonId);const current=steps[Math.min(step,steps.length-1)];
  useEffect(()=>{heading.current?.focus({preventScroll:true})},[step]);
  function move(next:number){setStep(next);heading.current?.scrollIntoView({block:'start',behavior:'instant'})}
  return <section className="pl-lesson" aria-label={lessonLabels[lessonId]??'Spanish lesson'}>
    <div className="pl-topline"><span>LEARN · {lessonLabels[lessonId]}</span><span>Step {step+1} of {steps.length}</span></div>
    <progress className="pl-progress" aria-label="Lesson progress" value={step+1} max={steps.length}/>
    <div className="pl-card" key={`${lessonId}-${step}`}><div className="pl-step-heading"><span className="pl-mini-label">One small idea</span><h2 ref={heading} tabIndex={-1}>{current.title}</h2><p>{current.intro}</p></div><div className="pl-step-body">{current.content}</div></div>
    <nav className="pl-lesson-nav" aria-label="Lesson steps"><button type="button" disabled={step===0} onClick={()=>move(step-1)}>← Back</button>{step===steps.length-1?<button type="button" className="pl-primary" onClick={onPractice}>Try guided practice →</button>:<button type="button" className="pl-primary" onClick={()=>move(step+1)}>Next small step →</button>}</nav>
    <p className="pl-footer-note">Go at your own pace. You can revisit these examples whenever you need them.</p>
  </section>;
}
