import type {StoryConcept,StoryStage,StoryTurn} from './story-content.ts';

export type TeachingExample={title:string;titleEs:string;person:string;phrase:string;meaning:string;pattern:[string,string,string];object?:string};
export const examples:Record<StoryConcept,TeachingExample>={
 self:{title:'Talking about myself',titleEs:'Hablo de mí',person:'Mateo',phrase:'Yo soy Mateo.',meaning:'I am Mateo.',pattern:['Me','yo','soy']},
 tu:{title:'Talking to one friend',titleEs:'Hablo contigo',person:'Mateo',phrase:'Mateo, tú eres estudiante.',meaning:'Mateo, you are a student.',pattern:['You','tú','eres']},
 usted:{title:'Talking to the teacher',titleEs:'Hablo con la profesora',person:'Sra. Abarca',phrase:'Usted es profesora.',meaning:'You are a teacher (formal).',pattern:['Teacher · you','usted','es']},
 ella:{title:'Talking about a classmate',titleEs:'Hablo de una compañera',person:'Sofía',phrase:'Ella es Sofía.',meaning:'She is Sofía.',pattern:['Sofía','ella','es']},
 nosotros:{title:'A group that includes me',titleEs:'El grupo me incluye',person:'Yusuf + Mateo',phrase:'Nosotros somos estudiantes.',meaning:'We are students.',pattern:['Mateo + me','nosotros','somos']},
 ustedes:{title:'Talking to two friends',titleEs:'Hablo con dos compañeros',person:'Ana + Sofía',phrase:'Ustedes son estudiantes.',meaning:'You are students (all of you).',pattern:['You + you','ustedes','son']},
 ellos:{title:'Talking about a group',titleEs:'Hablo de un grupo',person:'Mateo + Carlos',phrase:'Ellos son estudiantes.',meaning:'They are students.',pattern:['Mateo + Carlos','ellos','son']},
 ellas:{title:'Talking about Ana and Sofía',titleEs:'Hablo de Ana y Sofía',person:'Ana + Sofía',phrase:'Ellas son estudiantes.',meaning:'They are students.',pattern:['Ana + Sofía','ellas','son']},
 hay:{title:'Look inside the backpack',titleEs:'Mira dentro de la mochila',person:'Mateo',phrase:'Hay un lápiz. Hay dos lápices.',meaning:'There is one pencil. There are two pencils.',pattern:['One or more','hay','same word'],object:'lapiz'},
 objects:{title:'Choose a tool for the job',titleEs:'Elige el útil para la tarea',person:'Mateo',phrase:'Yo uso un lápiz para escribir.',meaning:'I use a pencil to write.',pattern:['Write','un lápiz','escribir'],object:'lapiz'},
 classes:{title:'Find your next class',titleEs:'Busca tu próxima clase',person:'Carlos',phrase:'Tengo la clase de español.',meaning:'I have Spanish class.',pattern:['My class','tengo','español']},
 likes:{title:'Say what you like',titleEs:'Di lo que te gusta',person:'Mateo',phrase:'Me gusta la música. Me gustan las matemáticas.',meaning:'I like music. I like mathematics.',pattern:['One / more','gusta / gustan','the thing liked']},
 adjectives:{title:'Describe what a friend does',titleEs:'Describe a tu compañero',person:'Ana',phrase:'Ana organiza sus apuntes. Ella es organizada.',meaning:'Ana puts her notes in order. She is organized.',pattern:['Ana','es','organizada']},
 uses:{title:'Tell someone useful information',titleEs:'Comparte información útil',person:'Ana',phrase:'El libro es de Ana.',meaning:'The book belongs to Ana.',pattern:['Whose book?','es de','Ana'],object:'libro'},
};

export const actions:Record<string,[string,string]>={
 'welcome-self':['Introduce yourself.','Preséntate.'],'welcome-yo':['Start your name card.','Empieza tu tarjeta.'],
 'welcome-tu':['Ask Mateo about himself.','Pregunta a Mateo.'],'welcome-reply':['Answer for yourself.','Responde por ti.'],
 'welcome-usted':['Talk to the teacher politely.','Habla con la profesora.'],'welcome-sofia':['Introduce Sofía.','Presenta a Sofía.'],
 'supplies-write':['Write your name. Choose a tool.','Escribe tu nombre. Elige un útil.'],'supplies-erase':['Erase a pencil mistake.','Borra el error de lápiz.'],
 'supplies-notes':['Find a place to write notes.','Busca dónde escribir apuntes.'],'supplies-glue':['Stick the paper star on your card.','Pega la estrella de papel.'],
 'supplies-folder':['Keep your loose notes together.','Guarda tus apuntes juntos.'],'supplies-possession':['Give Ana her book back.','Devuelve el libro a Ana.'],
 'bag-present':['Check for a notebook.','Busca un cuaderno.'],'bag-absent':['Check for scissors.','Busca las tijeras.'],
 'bag-pack':['Pack the tool for cutting paper.','Guarda el útil para cortar.'],'bag-plural':['Count the pencils.','Cuenta los lápices.'],
 'bag-describe':['Tell Mateo what is inside.','Dile a Mateo qué hay.'],'schedule-next':['Find the class after Spanish.','Busca la clase después de español.'],
 'schedule-time':['Read the clock.','Mira el reloj.'],'schedule-music-like':['Say you like music.','Di que te gusta la música.'],
 'schedule-math-like':['Build a phrase about mathematics.','Construye una frase sobre matemáticas.'],'schedule-dislike':['Say what you do not like.','Di lo que no te gusta.'],
 'hall-origin':['Ask Sofía where she is from.','Pregunta a Sofía de dónde es.'],'hall-mateo-kind':['Describe Mateo after he helps you.','Describe a Mateo después de su ayuda.'],
 'hall-ana-organized':['Ana puts her notes in order. Describe her.','Describe los apuntes de Ana.'],'hall-address-group':['Talk to Ana and Sofía.','Habla con Ana y Sofía.'],
 'hall-address-ser':['Tell them they are students.','Diles que son estudiantes.'],'hall-about-ellas':['Tell Carlos about Ana and Sofía.','Habla con Carlos sobre ellas.'],
 'rehearsal-ellos':['Talk about Mateo and Carlos.','Habla de Mateo y Carlos.'],'rehearsal-nosotros':['Speak for Mateo and yourself.','Habla por Mateo y por ti.'],
 'rehearsal-nosotras':['Choose what Sofía says.','Elige lo que dice Sofía.'],'rehearsal-class-description':['Describe a fun music class.','Describe una clase divertida.'],
 'rehearsal-event':['Find the rehearsal room.','Busca la sala del ensayo.'],'rehearsal-friend':['Tell the teacher about your friend.','Habla de tu amigo.'],
 'final-self':['Introduce yourself again.','Preséntate otra vez.'],'final-tu':['Ask Mateo if he is a student.','Pregunta si Mateo es estudiante.'],
 'final-bag':['Describe the pencils and notebook.','Describe los lápices y el cuaderno.'],'final-group':['Answer for yourself and Mateo.','Responde por ti y por Mateo.'],
 'final-like':['Say that you like music.','Di que te gusta la música.'],'final-event':['Tell Sofía where the rehearsal is.','Dile a Sofía dónde es el ensayo.'],
};
const stage=(prompt:string,options:[string,string,string],answer:string):StoryStage=>({prompt,options,answer});
export const responseBuilders:Record<string,StoryStage[]>={
 'rehearsal-class-description':[stage('La clase…',['La clase','Las clases','Yo'], 'La clase'),stage('Una clase…',['es','son','eres'],'es'),stage('Una clase divertida.',['divertida','divertido','divertidas'],'divertida')],
 'rehearsal-friend':[stage('Tu amigo:',['Mateo','Sofía','Nosotros'],'Mateo'),stage('Una persona:',['es','son','eres'],'es'),stage('Tu relación con Mateo:',['mi amigo','mi amiga','mis amigos'],'mi amigo')],
 'final-self':[stage('Hablas de ti:',['Yo','Tú','Ellos'],'Yo'),stage('Yo…',['soy','eres','son'],'soy'),stage('Tu nombre en esta historia:',['Yusuf','Mateo','Sofía'],'Yusuf')],
 'final-tu':[stage('Hablas con Mateo:',['Tú','Él','Nosotros'],'Tú'),stage('Tú…',['eres','soy','somos'],'eres'),stage('Pregunta si va a clases:',['estudiante','profesora','estudiantes'],'estudiante')],
 'final-bag':[stage('Algo está dentro:',['Hay','Soy','Somos'],'Hay'),stage('Cuenta los lápices:',['dos lápices','un lápiz','tres lápices'],'dos lápices'),stage('Añade el objeto con páginas:',['y un cuaderno','y una regla','y un libro'],'y un cuaderno')],
 'final-group':[stage('Mateo y tú:',['Nosotros','Ustedes','Ellos'],'Nosotros'),stage('Nosotros…',['somos','son','es'],'somos'),stage('Los dos van a clases:',['estudiantes','estudiante','profesora'],'estudiantes')],
 'final-like':[stage('Un gusto:',['Me gusta','Me gustan','Yo soy'],'Me gusta'),stage('¿Qué te gusta?',['la música','las ciencias','las matemáticas'],'la música')],
 'final-event':[stage('El evento:',['El ensayo','La mochila','Mateo'],'El ensayo'),stage('El lugar de un evento:',['es en','es de','son'],'es en'),stage('Mira el cartel:',['la sala de música','la clase de ciencias','la clase de arte'],'la sala de música')],
};
const nouns:Record<string,string>={lapiz:'pencil',borrador:'eraser',cuaderno:'notebook',tijeras:'scissors',regla:'ruler',libro:'book',calculadora:'calculator',estuche:'pencil pouch',goma:'glue',carpeta:'folder',reloj:'clock',puerta:'door',ventana:'window',papelera:'wastebasket',silla:'chair',mapa:'map',musica:'music',ciencias:'science',matematicas:'mathematics',arte:'art'};
const clean=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function choiceObject(value:string):string|undefined {const text=clean(value);return Object.keys(nouns).find(id=>new RegExp('\\b(?:'+(id==='lapiz'?'lapiz|lapices':id)+')\\b').test(text));}
export function choiceGloss(value:string):string {
 const lookup:Record<string,string>={'yo':'I','tú':'you · one person','él':'he','ella':'she','ellos':'they','ellas':'they · girls','usted':'you · formal','ustedes':'you · a group','nosotros':'we','nosotras':'we · girls','soy':'I am','eres':'you are','es':'is / formal you are','somos':'we are','son':'are · they / all of you','hay':'there is / there are','Sí, hay.':'Yes, there is / are.','No, no hay.':'No, there is not / are not.','Yo soy.':'I am.','me gusta':'I like · one thing','me gustan':'I like · more than one','gusta':'like · singular thing','gustan':'like · plural things','A mí':'To me','estudiante':'student','estudiantes':'students','profesora':'teacher','simpático':'friendly','difícil':'difficult','desordenado':'messy','organizada':'organized · feminine','organizado':'organized · masculine','desordenada':'messy · feminine','divertida':'fun · feminine','divertido':'fun · masculine','divertidas':'fun · feminine plural','mi amigo':'my friend','mi amiga':'my friend · feminine','mis amigos':'my friends','es en':'takes place in','es de':'belongs to / comes from'};
 const key=Object.keys(lookup).find(k=>clean(k)===clean(value));if(key)return lookup[key];
 const sentence:Record<string,string>={
 'sí, tú eres estudiante.':'Yes, you are a student.','sí, yo soy estudiante.':'Yes, I am a student.','sí, ellos son estudiantes.':'Yes, they are students.',
 'no soy una clase aburrida.':'I am not a boring class.','no me gusta una clase aburrida.':'I do not like a boring class.','no me gustan una clase aburrida.':'I do not like a boring class · check agreement.',
 'nosotras somos amigas.':'We are friends · Sofía includes herself.','ellas son amigas.':'They are friends.','ustedes son amigas.':'You are friends · talking to a group.',
 'hay dos lápices.':'There are two pencils.','hay un lápiz.':'There is one pencil.','hay tres lápices.':'There are three pencils.',
 'son las diez.':'It is ten o’clock.','son las dos.':'It is two o’clock.','es la una.':'It is one o’clock.',
 'la clase':'the class','las clases':'the classes','y un cuaderno':'and a notebook','y una regla':'and a ruler','y un libro':'and a book',
 };
 const full=Object.keys(sentence).find(k=>clean(k)===clean(value));if(full)return sentence[full];
 const owner=value.match(/^El libro es de (.+)\.$/);if(owner)return `The book belongs to ${owner[1]}.`;
 if(/^El ensayo es en/.test(value))return 'The rehearsal takes place in the music room.';
 if(/^El ensayo es de/.test(value))return 'The rehearsal belongs to Mateo.';
 if(/^El ensayo es a/.test(value))return 'The rehearsal is at ten o’clock.';
 const object=choiceObject(value);if(object)return nouns[object];
 if(/^(Yo soy|Soy) Yusuf/.test(value))return 'I am Yusuf.';
 if(/^Tú eres Yusuf/.test(value))return 'You are Yusuf.';
 if(/^Ellos son Yusuf/.test(value))return 'They are Yusuf.';
 if(/^Ella es/.test(value))return 'She is…';if(/^Tú eres/.test(value))return 'You are…';if(/^Ellos son/.test(value))return 'They are…';
 return '';
}
export function actionFor(turn:StoryTurn,english:boolean){return actions[turn.id]?.[english?0:1]??(english?'Choose what to say next.':'Elige lo que dices.');}

// Visible story facts needed to answer; these are observations, not answer keys.
export const storyCues:Record<string,string>={
 'welcome-sofia':'Sofía: «¡Hola! Soy Sofía».',
 'supplies-possession':'Ana: «Este es mi libro».',
 'hall-mateo-kind':'Mateo te ayuda con la mochila.',
 'hall-ana-organized':'Ana ordena sus apuntes.',
 'rehearsal-nosotras':'Sofía habla por Ana y por ella misma.',
 'review-story-ella':'Ana muestra su tarjeta.',
 'review-story-nosotros':'Tú y Carlos responden juntos.',
 'review-story-ustedes':'Mateo y Carlos escuchan tu pregunta.',
 'review-story-ellas':'Hablas con Mateo sobre Sofía y Ana.',
 'review-story-adjectives':'Carlos hace un dibujo de colores.',
 'review-story-uses':'Sofía: «Este cuaderno es mío».',
};

export const builderHelp:Record<string,string[]>={
 'bag-describe':['Say that something is inside.','Count the pencils you can see.','Add the notebook.'],
 'schedule-math-like':['Start with your own preference.','Mathematics uses a plural word in Spanish.','Choose the subject Carlos mentioned.'],
 'hall-mateo-kind':['You are talking about Mateo.','Match the verb to one person.','Choose a word for his friendly action.'],
 'hall-ana-organized':['You are talking about Ana.','Match the verb to one person.','Choose the feminine word for organized.'],
 'hall-address-ser':['Speak directly to both girls.','Choose the verb that matches the first tile.','Both go to classes.'],
 'hall-about-ellas':['Talk about both girls to Carlos.','Choose the verb that matches the first tile.','Both go to classes.'],
 'rehearsal-ellos':['Talk about Mateo and Carlos.','Choose the verb that matches the first tile.','Both go to classes.'],
 'rehearsal-nosotros':['The group includes you.','Choose the verb that matches the first tile.','You and Mateo go to classes.'],
 'rehearsal-class-description':['Start with the class.','Choose the verb for one class.','Use the feminine word for fun.'],
 'rehearsal-friend':['Name your friend.','Choose the verb for one person.','Say how you know Mateo.'],
 'final-self':['Start with yourself.','Choose the verb that matches the first tile.','Choose your story name.'],
 'final-tu':['Speak directly to Mateo.','Choose the verb that matches the first tile.','Ask whether he goes to classes.'],
 'final-bag':['Say that something is inside.','Count the pencils you can see.','Add the notebook.'],
 'final-group':['The group includes you and Mateo.','Choose the verb that matches the first tile.','Both go to classes.'],
 'final-like':['Music is one thing you like.','Choose music.'],
 'final-event':['Start with the rehearsal.','Say where an event takes place.','Choose the place on the poster.'],
};
