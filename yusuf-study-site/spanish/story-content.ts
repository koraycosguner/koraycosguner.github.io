/** Original fictional practice dialogue, based on the supplied Unit 2 terminology.
 * Classmates, their behavior, origins and the school-day schedule are fictional.
 * No learner biography, school enrollment, diagnosis or actual preferences are assumed.
 * Choice strings and accepted responses are data, never HTML.
 */
export type StoryConcept = 'self' | 'tu' | 'usted' | 'ella' | 'nosotros' | 'ustedes' | 'ellos' | 'ellas' | 'hay' | 'objects' | 'classes' | 'likes' | 'adjectives' | 'uses';
export type StoryUse = 'Identificación' | 'Ocupación' | 'Descripción' | 'Características' | 'Tiempo' | 'Origen' | 'Relaciones' | 'Eventos' | 'Posesión';
export type StoryVisual = 'classroom' | 'people' | 'desk' | 'backpack' | 'schedule' | 'clock' | 'hallway' | 'band';
export type StoryStage = { prompt:string; options:[string,string,string]; answer:string };
export type StoryTurn = {
  id:string; kind:'choice'|'builder'|'response'; speaker:string; context:string; prompt:string; help:string;
  concept:StoryConcept; visual?:StoryVisual; focusPeople?:string[]; responseAs?:string;
  options?:[string,string,string]; answers:string[]; model:string; hint:string; success:string;
  serUse?:StoryUse; stages?:StoryStage[]; starter?:string;
  /** Exact scene inventory, separate from the free-exploration backpack. */
  inventory?:Record<string,number>;
  /** Apply only after a correct action, not when rendering or trying a wrong option. */
  inventorySet?:Record<string,number>;
};
export type StoryScene = { id:string; title:string; location:string; intro:string; turns:StoryTurn[] };

export const storyCharacters = [
  {id:'teacher',name:'Sra. Abarca',role:'La profesora',color:'#e88b63'},
  {id:'mateo',name:'Mateo',role:'Tu compañero',color:'#39a895'},
  {id:'sofia',name:'Sofía',role:'Tu compañera',color:'#ad79b7'},
  {id:'carlos',name:'Carlos',role:'Tu compañero',color:'#dfad38'},
  {id:'ana',name:'Ana',role:'Tu compañera',color:'#608fca'},
] as const;
export const storySchedule = [
  {time:'9:00',subject:'español'},
  {time:'10:00',subject:'ciencias'},
  {time:'11:00',subject:'matemáticas'},
  {time:'13:00',subject:'música'},
] as const;
export const storyInitialInventory = {cuaderno:1,lapiz:2,tijeras:0};
export const storyPackedInventory = {cuaderno:1,lapiz:2,tijeras:1};

const choice = (t:Omit<StoryTurn,'kind'|'answers'|'model'> & {options:[string,string,string];answer:string;model?:string}):StoryTurn => {
  const {answer,...rest}=t; return {...rest,kind:'choice',answers:[answer],model:t.model??answer};
};
const builder = (t:Omit<StoryTurn,'kind'|'answers'> & {stages:StoryStage[]}):StoryTurn => ({...t,kind:'builder',answers:[t.model]});
const response = (t:Omit<StoryTurn,'kind'>):StoryTurn => ({...t,kind:'response'});

export const storyScenes:StoryScene[] = [
  {
    id:'bienvenida',title:'¡Hola, compañeros!',location:'La clase de español',
    intro:'Entra en la clase. Sra. Abarca y Mateo te esperan. Hoy el grupo prepara una visita a la sala de música.',
    turns:[
      choice({id:'welcome-self',speaker:'Sra. Abarca',context:'Sra. Abarca te saluda junto a la puerta.',
        prompt:'¡Hola! Soy la profesora Abarca. ¿Quién eres tú?',help:'The teacher greets you. Introduce yourself.',
        concept:'self',visual:'classroom',focusPeople:['Yusuf','Sra. Abarca'],
        options:['Yo soy Yusuf.','Tú eres Yusuf.','Ellos son Yusuf.'],answer:'Yo soy Yusuf.',
        hint:'Hablas de ti mismo. Busca la frase que empieza con «yo».',success:'¡Mucho gusto! Yo → soy. También puedes decir «Soy Yusuf».',serUse:'Identificación'}),
      choice({id:'welcome-yo',speaker:'Sra. Abarca',context:'La profesora te da una tarjeta para tu presentación.',
        prompt:'En tu tarjeta: «___ soy Yusuf». ¿Cómo empiezas?',help:'You are writing your own introduction on a name card.',
        concept:'self',visual:'desk',focusPeople:['Yusuf'],options:['Tú','Él','Yo'],answer:'Yo',model:'Yo soy Yusuf.',
        hint:'La tarjeta habla de la persona que está hablando: tú mismo.',success:'Para hablar de mí, uso yo. Yo soy Yusuf.'}),
      choice({id:'welcome-tu',speaker:'Mateo',context:'Mateo se acerca: «Soy Mateo». Quieres saber si es estudiante.',
        prompt:'Pregúntale a Mateo: «¿Tú ___ estudiante?»',help:'Ask Mateo directly whether he is a student.',
        concept:'tu',visual:'people',focusPeople:['Yusuf','Mateo'],options:['soy','eres','son'],answer:'eres',model:'¿Tú eres estudiante?',
        hint:'Hablas a un compañero: tú. No hablas de ti mismo.',success:'¡Eso! Al hablarte a ti: tú eres.'}),
      choice({id:'welcome-reply',speaker:'Mateo',context:'Mateo responde: «Sí, soy estudiante». Ahora te pregunta a ti.',
        prompt:'¿Y tú? ¿Eres estudiante?',help:'Mateo asks you the same question. Answer for yourself in the story.',
        concept:'self',visual:'people',focusPeople:['Yusuf','Mateo'],options:['Sí, tú eres estudiante.','Sí, yo soy estudiante.','Sí, ellos son estudiantes.'],answer:'Sí, yo soy estudiante.',
        hint:'Mateo dice «tú». Al responder por ti, cambia la perspectiva.',success:'Mateo pregunta «¿eres?». Tú respondes «soy».'}),
      choice({id:'welcome-usted',speaker:'Sra. Abarca',context:'La profesora explica: «Yo enseño español». Le hablas con respeto.',
        prompt:'Sí, profesora. Usted ___ profesora de español.',help:'Address the teacher formally with usted.',
        concept:'usted',visual:'classroom',focusPeople:['Yusuf','Sra. Abarca'],options:['soy','son','es'],answer:'es',model:'Usted es profesora de español.',
        hint:'Usted se refiere a una sola persona; va con la misma forma que ella.',success:'Usted → es. Profesora es una ocupación.',serUse:'Ocupación'}),
      choice({id:'welcome-sofia',speaker:'Sra. Abarca',context:'Sofía entra y saluda: «¡Hola! Soy Sofía». Mateo quiere conocerla.',
        prompt:'Presenta a Sofía a Mateo. ¿Quién es ella?',help:'Introduce Sofía to Mateo. You are talking about her.',
        concept:'ella',visual:'people',focusPeople:['Sofía','Mateo'],options:['Ella es Sofía.','Tú eres Sofía.','Ellos son Sofía.'],answer:'Ella es Sofía.',
        hint:'Hablas sobre una compañera, no le preguntas su nombre.',success:'Sofía → ella → es. ¡Mateo ya conoce a Sofía!'})
    ]
  },
  {
    id:'utiles',title:'Manos a la obra',location:'La mesa de los útiles',
    intro:'Sofía y Ana preparan las tarjetas para la visita. Mateo te invita a ayudar en la mesa.',
    turns:[
      choice({id:'supplies-write',speaker:'Mateo',context:'Tienes una tarjeta de papel. Falta escribir tu nombre.',
        prompt:'¿Qué usas para escribir tu nombre?',help:'Choose a tool for writing your name on the paper card.',
        concept:'objects',visual:'desk',options:['Yo uso unas tijeras.','Yo uso un lápiz.','Yo uso un borrador.'],answer:'Yo uso un lápiz.',
        hint:'Busca el útil que deja letras en el papel.',success:'Yo uso un lápiz para escribir. ¡Tu tarjeta ya tiene nombre!'}),
      choice({id:'supplies-erase',speaker:'Sofía',context:'¡Uy! Hay una letra de más escrita con lápiz.',
        prompt:'Hay un error. ¿Qué usas para borrarlo?',help:'The pencil-written name has a mistake. Choose how to erase it.',
        concept:'objects',visual:'desk',options:['el reloj','la puerta','el borrador'],answer:'el borrador',model:'Yo uso el borrador.',
        hint:'Necesitas quitar una marca de lápiz.',success:'El borrador corrige el error. Ahora puedes volver a escribir.'}),
      choice({id:'supplies-notes',speaker:'Ana',context:'Ana explica el plan de la visita. Quieres escribir unas notas.',
        prompt:'¿Dónde puedes escribir tus apuntes?',help:'Choose a place to write notes about the class visit.',
        concept:'objects',visual:'desk',options:['en un cuaderno','en una silla','en una papelera'],answer:'en un cuaderno',model:'Puedo escribir en un cuaderno.',
        hint:'Busca el objeto con páginas para escribir.',success:'Puedo escribir en un cuaderno. Cuaderno: páginas para mis apuntes.'}),
      choice({id:'supplies-glue',speaker:'Sofía',context:'Sofía dibuja una estrella de papel. Hay que pegarla en la tarjeta.',
        prompt:'En nuestra lista, la goma es para pegar. ¿Qué usas?',help:'On the class vocabulary list, goma means glue. Attach the paper star.',
        concept:'objects',visual:'desk',options:['la regla','la goma','el mapa'],answer:'la goma',model:'Yo uso la goma.',
        hint:'La estrella tiene que quedar pegada a la tarjeta.',success:'La goma pega el papel. Aquí usamos el significado de tu lista de clase.'}),
      choice({id:'supplies-folder',speaker:'Ana',context:'Ana trae una carpeta: un objeto para guardar hojas y apuntes juntos.',
        prompt:'Tienes hojas sueltas. ¿Qué usas para guardarlas juntas?',help:'Ana introduces carpeta (folder), an extra word from the exercises. Keep loose notes together.',
        concept:'objects',visual:'desk',options:['una carpeta','un reloj','una ventana'],answer:'una carpeta',model:'Yo uso una carpeta.',
        hint:'Elige el objeto que Ana acaba de mostrarte para organizar las hojas.',success:'Uso una carpeta para guardar mis apuntes. Carpeta es una palabra extra del ejercicio.'}),
      choice({id:'supplies-possession',speaker:'Mateo',context:'Ana deja su libro en la mesa: «Este es mi libro». Mateo lo encuentra.',
        prompt:'¿De quién es el libro?',help:'Ana just said the book is hers. Tell Mateo who owns it.',
        concept:'uses',visual:'desk',focusPeople:['Ana','Mateo'],options:['El libro es de Mateo.','El libro es de Sofía.','El libro es de Ana.'],answer:'El libro es de Ana.',
        hint:'Recuerda quién dijo «mi libro».',success:'Es de Ana indica posesión: el libro pertenece a Ana.',serUse:'Posesión'})
    ]
  },
  {
    id:'mochila',title:'¿Listo para salir?',location:'La mochila',
    intro:'Devuelves el libro a Ana. Antes de salir, Mateo te ayuda a revisar tu mochila.',
    turns:[
      choice({id:'bag-present',speaker:'Mateo',context:'Abres la mochila: hay un cuaderno y dos lápices.',
        prompt:'¿Hay un cuaderno en la mochila?',help:'Answer using only the items visible in this story backpack.',
        concept:'hay',visual:'backpack',inventory:storyInitialInventory,options:['No, no hay.','Sí, hay.','Yo soy.'],answer:'Sí, hay.',
        hint:'Mira las páginas del objeto que está dentro de la mochila.',success:'Sí, hay un cuaderno. Hay significa que algo está presente.'}),
      choice({id:'bag-absent',speaker:'Mateo',context:'El cuaderno y los lápices ya están guardados. Falta revisar las tijeras.',
        prompt:'¿Hay tijeras en la mochila?',help:'Inspect the backpack. Scissors have not been packed yet.',
        concept:'hay',visual:'backpack',inventory:storyInitialInventory,options:['Sí, hay.','Yo soy.','No, no hay.'],answer:'No, no hay.',
        hint:'Compara la pregunta con los objetos que ves dentro.',success:'No, no hay tijeras. No hay habla de lo que falta.'}),
      choice({id:'bag-pack',speaker:'Sofía',context:'Sofía recuerda: «En música vamos a cortar las tarjetas de papel».',
        prompt:'Elige el útil para cortar y guárdalo en la mochila.',help:'Choose the tool for cutting paper. A correct choice adds it to the story backpack.',
        concept:'objects',visual:'backpack',inventory:storyInitialInventory,inventorySet:storyPackedInventory,
        options:['las tijeras','el borrador','el reloj'],answer:'las tijeras',model:'Guardo las tijeras en la mochila.',
        hint:'Busca el útil con dos hojas que se abren y se cierran.',success:'¡Listo! Ahora sí hay tijeras. Las usamos para cortar papel.'}),
      choice({id:'bag-plural',speaker:'Mateo',context:'Ahora hay un cuaderno, dos lápices y unas tijeras en la mochila.',
        prompt:'¿Cuántos lápices hay en la mochila?',help:'Describe the number of pencils you can see. Hay works for one or several items.',
        concept:'hay',visual:'backpack',inventory:storyPackedInventory,
        options:['Hay un lápiz.','Hay dos lápices.','No hay lápices.'],answer:'Hay dos lápices.',
        hint:'Cuenta los lápices antes de elegir.',success:'Un cuaderno: hay. Dos lápices: también hay. La palabra no cambia.'}),
      builder({id:'bag-describe',speaker:'Ana',context:'Ana quiere saber qué llevas para escribir apuntes: lápices y un cuaderno.',
        prompt:'Describe los lápices y el cuaderno, una parte cada vez.',help:'Build a sentence about the visible pencils and notebook. You can leave out the scissors.',
        concept:'hay',visual:'backpack',inventory:storyPackedInventory,model:'Hay dos lápices y un cuaderno.',
        stages:[
          {prompt:'Algo está presente en la mochila.',options:['Soy','Hay','Son'],answer:'Hay'},
          {prompt:'Cuenta los lápices que ves.',options:['dos lápices','un lápiz','tres lápices'],answer:'dos lápices'},
          {prompt:'Añade el objeto donde escribes tus apuntes.',options:['y un libro','y una regla','y un cuaderno'],answer:'y un cuaderno'},
        ],hint:'Mira los objetos antes de elegir cada parte. Cuenta los lápices.',success:'Hay dos lápices y un cuaderno. Y une los objetos en una sola frase.'})
    ]
  },
  {
    id:'horario',title:'La próxima clase',location:'El horario',
    intro:'Suena la campana. Carlos llega con el horario del día. El grupo se reúne otra vez antes de música.',
    turns:[
      choice({id:'schedule-next',speaker:'Carlos',context:'El horario de la historia muestra ciencias a las 10:00, después de español.',
        prompt:'Después de español, ¿qué clase tienes?',help:'Read the fictional schedule. Which class follows Spanish?',
        concept:'classes',visual:'schedule',options:['Yo tengo la clase de música.','Yo tengo la clase de ciencias.','Yo tengo la clase de arte.'],answer:'Yo tengo la clase de ciencias.',
        hint:'Busca la fila de las 10:00.',success:'Yo tengo la clase de ciencias. Tengo comunica qué clase tienes.'}),
      choice({id:'schedule-time',speaker:'Sofía',context:'El reloj marca las 10:00. Es hora de ir a ciencias.',
        prompt:'¿Qué hora es?',help:'The clock reads ten o’clock. Choose the sentence that matches it.',
        concept:'uses',visual:'clock',options:['Es la una.','Son las dos.','Son las diez.'],answer:'Son las diez.',
        hint:'Busca el número que aparece en el reloj.',success:'Son las diez. SER también sirve para decir la hora.',serUse:'Tiempo'}),
      choice({id:'schedule-music-like',speaker:'Mateo',context:'Más tarde, Mateo habla del ensayo: «A mí me gusta la música».',
        prompt:'Practica responder: «A mí también ___ la música».',help:'Practice saying that you also like music in this conversation.',
        concept:'likes',visual:'schedule',options:['me gustan','me gusta','soy'],answer:'me gusta',model:'A mí también me gusta la música.',
        hint:'La música es singular. Fíjate en la frase de Mateo.',success:'Me gusta + la música. En esta práctica hablamos de un gusto, no de una identidad.'}),
      builder({id:'schedule-math-like',speaker:'Carlos',context:'Carlos dice: «Las matemáticas son divertidas». Practica decir que te gustan.',
        prompt:'Construye tu respuesta, una parte cada vez.',help:'Practice saying that you like mathematics. Choose one part at a time.',
        concept:'likes',visual:'schedule',model:'A mí me gustan las matemáticas.',
        stages:[
          {prompt:'Empieza hablando de tu gusto.',options:['A mí','Ellas','Nosotros'],answer:'A mí'},
          {prompt:'Las matemáticas es plural.',options:['soy','me gusta','me gustan'],answer:'me gustan'},
          {prompt:'¿De qué clase habla Carlos?',options:['la música','las matemáticas','el arte'],answer:'las matemáticas'},
        ],hint:'Mira el número: las matemáticas. El gusto se expresa en plural.',success:'Me gustan + las matemáticas. Gusta con singular; gustan con plural.'}),
      choice({id:'schedule-dislike',speaker:'Ana',context:'Ana prefiere las clases divertidas. Ahora practicas expresar lo contrario.',
        prompt:'¿Cómo dices que no te gusta una clase aburrida?',help:'Practice a negative preference about a boring class, without naming a real teacher or class.',
        concept:'likes',visual:'schedule',options:['No soy una clase aburrida.','No me gusta una clase aburrida.','No me gustan una clase aburrida.'],answer:'No me gusta una clase aburrida.',
        hint:'Añade no a la expresión de gusto. Una clase es singular.',success:'No me gusta… expresa lo que no te gusta. Puedes cambiar de opinión.'})
    ]
  },
  {
    id:'pasillo',title:'¡Nos vemos otra vez!',location:'El pasillo',
    intro:'Después de las clases, todos se reúnen para música. Sofía, Mateo y Ana vuelven con sus tarjetas.',
    turns:[
      choice({id:'hall-origin',speaker:'Sofía',context:'Sofía, un personaje de esta historia, cuenta: «Soy de México». Le preguntas para confirmar.',
        prompt:'Sofía, ¿tú ___ de México?',help:'Confirm fictional Sofía’s statement by asking her directly whether she is from Mexico.',
        concept:'tu',visual:'hallway',focusPeople:['Yusuf','Sofía'],options:['soy','eres','es'],answer:'eres',model:'Sofía, ¿tú eres de México?',
        hint:'Hablas a Sofía con tú, como antes hablaste a Mateo.',success:'Tú → eres. Sofía responde «Sí, soy de México». Ser de comunica origen.',serUse:'Origen'}),
      builder({id:'hall-mateo-kind',speaker:'Ana',context:'Tu mochila se cae. Mateo la recoge y te ayuda a guardar los útiles.',
        prompt:'¿Cómo es Mateo? Construye una frase.',help:'Mateo helps you pick up your supplies. Describe the friendly behavior you just saw.',
        concept:'adjectives',visual:'hallway',focusPeople:['Mateo'],model:'Él es simpático.',
        stages:[
          {prompt:'Hablas sobre Mateo.',options:['Él','Tú','Nosotros'],answer:'Él'},
          {prompt:'Hablas de una persona: él.',options:['es','eres','somos'],answer:'es'},
          {prompt:'Mateo te ayuda con amabilidad.',options:['difícil','desordenado','simpático'],answer:'simpático'},
        ],hint:'Piensa en lo que acaba de hacer para ayudarte.',success:'Mateo → él → es simpático. La acción ayuda a entender su característica.',serUse:'Características'}),
      builder({id:'hall-ana-organized',speaker:'Sofía',context:'Ana ordena sus apuntes en la carpeta. Cada cosa tiene su sitio.',
        prompt:'Describe a Ana con una frase.',help:'Ana puts her notes in order. Describe her using feminine agreement.',
        concept:'adjectives',visual:'hallway',focusPeople:['Ana'],model:'Ella es organizada.',
        stages:[
          {prompt:'Hablas sobre Ana.',options:['Tú','Ellos','Ella'],answer:'Ella'},
          {prompt:'Una compañera: ella…',options:['son','es','soy'],answer:'es'},
          {prompt:'Sus apuntes están en orden.',options:['organizada','organizado','desordenada'],answer:'organizada'},
        ],hint:'Hablas de Ana. Su carpeta está en orden.',success:'Ana → ella → es organizada. El adjetivo concuerda con ella.',serUse:'Características'}),
      choice({id:'hall-address-group',speaker:'Mateo',context:'Ana y Sofía están delante de ti. Vas a hablarles a las dos.',
        prompt:'Para hablar A Ana y Sofía: «¿___ son estudiantes?»',help:'Address Ana and Sofía together. They are your listeners, not people you are describing to someone else.',
        concept:'ustedes',visual:'people',focusPeople:['Yusuf','Ana','Sofía'],options:['Ellas','Ustedes','Nosotros'],answer:'Ustedes',model:'¿Ustedes son estudiantes?',
        hint:'Mira a quién hablas: directamente a dos personas.',success:'A dos personas les hablas con ustedes. Ustedes → son.'}),
      builder({id:'hall-address-ser',speaker:'Ana',context:'Ana y Sofía muestran sus tarjetas. Les dices lo que tienen en común.',
        prompt:'Habla A Ana y Sofía: las dos asisten a clases.',help:'Tell Ana and Sofía directly that they are students. Use the U.S. classroom plural-you form.',
        concept:'ustedes',visual:'people',focusPeople:['Yusuf','Ana','Sofía'],model:'Ustedes son estudiantes.',
        stages:[
          {prompt:'Hablas a las dos personas.',options:['Ellas','Nosotros','Ustedes'],answer:'Ustedes'},
          {prompt:'Ustedes…',options:['son','somos','es'],answer:'son'},
          {prompt:'Las dos asisten a clases.',options:['profesora','estudiantes','estudiante'],answer:'estudiantes'},
        ],hint:'La persona que escucha cambia: ahora son dos personas.',success:'Ustedes → son. Es la misma forma aunque hables a chicos, chicas o un grupo mixto.'}),
      builder({id:'hall-about-ellas',speaker:'Carlos',context:'Carlos te pregunta por Ana y Sofía. Ahora hablas SOBRE ellas.',
        prompt:'Dile a Carlos que Ana y Sofía son estudiantes.',help:'Now tell Carlos about Ana and Sofía. They are the people being discussed.',
        concept:'ellas',visual:'people',focusPeople:['Ana','Sofía','Carlos'],model:'Ellas son estudiantes.',
        stages:[
          {prompt:'Hablas sobre Ana y Sofía.',options:['Ellas','Ustedes','Nosotros'],answer:'Ellas'},
          {prompt:'Ellas…',options:['somos','son','es'],answer:'son'},
          {prompt:'Las dos asisten a clases.',options:['estudiante','profesora','estudiantes'],answer:'estudiantes'},
        ],hint:'Antes les hablabas a ellas. Ahora le cuentas a Carlos quiénes son.',success:'Ana + Sofía → ellas → son. El verbo sigue en plural.'})
    ]
  },
  {
    id:'ensayo',title:'Ya casi llegamos',location:'La puerta de música',
    intro:'Sra. Abarca recibe al grupo junto al cartel del ensayo. Mateo y Carlos traen las tarjetas.',
    turns:[
      builder({id:'rehearsal-ellos',speaker:'Sra. Abarca',context:'La profesora señala a Mateo y Carlos, que esperan juntos.',
        prompt:'¿Quiénes son Mateo y Carlos?',help:'Talk about Mateo and Carlos together, not directly to them.',
        concept:'ellos',visual:'people',focusPeople:['Mateo','Carlos'],model:'Ellos son estudiantes.',
        stages:[
          {prompt:'Hablas sobre Mateo y Carlos.',options:['Ustedes','Ellos','Nosotros'],answer:'Ellos'},
          {prompt:'Ellos…',options:['es','somos','son'],answer:'son'},
          {prompt:'Los dos asisten a clases.',options:['estudiantes','estudiante','profesora'],answer:'estudiantes'},
        ],hint:'Hablas sobre dos compañeros; tú no estás incluido en ese grupo.',success:'Mateo + Carlos → ellos → son.'}),
      builder({id:'rehearsal-nosotros',speaker:'Mateo',context:'Mateo se pone a tu lado: «Vamos juntos. Tú y yo somos un equipo».',
        prompt:'Habla por Mateo y por ti: ¿quiénes son?',help:'Answer for a group including Mateo and yourself, using nosotros.',
        concept:'nosotros',visual:'people',focusPeople:['Yusuf','Mateo'],model:'Nosotros somos estudiantes.',
        stages:[
          {prompt:'El grupo te incluye a ti.',options:['Nosotros','Ellos','Ustedes'],answer:'Nosotros'},
          {prompt:'Nosotros…',options:['son','somos','eres'],answer:'somos'},
          {prompt:'Tú y Mateo van a clases.',options:['estudiante','profesora','estudiantes'],answer:'estudiantes'},
        ],hint:'Una persona más yo: yo formo parte del grupo.',success:'Mateo + yo → nosotros → somos.'}),
      choice({id:'rehearsal-nosotras',speaker:'Sofía',context:'Sofía toma la mano de Ana y habla por las dos.',
        prompt:'Elige la frase que dice Sofía sobre Ana y ella misma.',help:'Choose Sofía’s own words for a group that includes herself and Ana.',
        concept:'nosotros',visual:'people',focusPeople:['Sofía','Ana'],responseAs:'Sofía',options:['Ellas son amigas.','Nosotras somos amigas.','Ustedes son amigas.'],answer:'Nosotras somos amigas.',
        hint:'Sofía está dentro del grupo del que habla.',success:'Sofía + Ana, hablando Sofía: nosotras somos. Nosotros y nosotras llevan somos.',serUse:'Relaciones'}),
      response({id:'rehearsal-class-description',speaker:'Ana',context:'En música hay canciones, tarjetas de colores y un juego. Ana sonríe.',
        prompt:'Escribe la frase completa con divertida: «La clase es…»',help:'Describe music class as fun. Finish the whole sentence using the given adjective.',
        concept:'adjectives',visual:'band',starter:'La clase es…',answers:['La clase es divertida','La clase de música es divertida'],model:'La clase es divertida.',
        hint:'Clase es femenino singular. Mantén la frase completa.',success:'La clase es divertida. SER ayuda a describir la clase.',serUse:'Descripción'}),
      choice({id:'rehearsal-event',speaker:'Sra. Abarca',context:'El cartel dice: «Ensayo • sala de música • 13:00».',
        prompt:'¿Dónde es el ensayo?',help:'Read the rehearsal poster. Choose the event’s location.',
        concept:'uses',visual:'band',options:['El ensayo es en la sala de música.','El ensayo es de Mateo.','El ensayo es a las diez.'],answer:'El ensayo es en la sala de música.',
        hint:'Busca el lugar del evento en el cartel.',success:'El ensayo es en… comunica dónde ocurre un evento.',serUse:'Eventos'}),
      response({id:'rehearsal-friend',speaker:'Sra. Abarca',context:'Mateo te ha acompañado y ayudado todo el día. Es tu amigo en esta historia.',
        prompt:'¿Quién es Mateo para ti? Escribe la frase completa: «Mateo es…»',help:'Tell the teacher that Mateo is your friend in the story.',
        concept:'uses',visual:'people',focusPeople:['Yusuf','Mateo'],starter:'Mateo es…',answers:['Mateo es mi amigo','Él es mi amigo','Es mi amigo'],model:'Mateo es mi amigo.',
        hint:'La pregunta habla de la relación entre ustedes. Incluye mi.',success:'Mateo es mi amigo. SER expresa una relación.',serUse:'Relaciones'})
    ]
  },
  {
    id:'final',title:'¡La conversación final!',location:'La sala de música',
    intro:'La profesora les da la bienvenida. Usa lo que has descubierto para entrar con tus compañeros.',
    turns:[
      response({id:'final-self',speaker:'Sra. Abarca',context:'La profesora comienza una última conversación de práctica contigo.',
        prompt:'¡Hola! ¿Quién eres?',help:'Introduce yourself. You have done this before; the hint stays available.',
        concept:'self',visual:'band',focusPeople:['Yusuf','Sra. Abarca'],answers:['Soy Yusuf','Yo soy Yusuf','Hola soy Yusuf','Hola yo soy Yusuf'],model:'Yo soy Yusuf.',
        hint:'Al responder por ti mismo, cambia tú a yo.',success:'¡Hola, Yusuf! Hablar de mí: yo soy.'}),
      response({id:'final-tu',speaker:'Mateo',context:'Mateo te saluda. Ahora te toca hacerle una pregunta.',
        prompt:'Pregunta a Mateo si es estudiante.',help:'Ask Mateo directly whether he is a student. Write a short question.',
        concept:'tu',visual:'people',focusPeople:['Yusuf','Mateo'],answers:['¿Tú eres estudiante?','¿Eres estudiante?','¿Eres tú estudiante?','Mateo ¿eres estudiante?','Mateo ¿tú eres estudiante?'],model:'¿Tú eres estudiante?',
        hint:'Hablas a una persona conocida. Recuerda la pregunta de esta mañana.',success:'Tú → eres. Mateo responde: «Sí, soy estudiante». '}),
      response({id:'final-bag',speaker:'Ana',context:'Ana necesita saber si puedes prestar útiles. Muestra tu mochila preparada.',
        prompt:'Dile que hay dos lápices y un cuaderno.',help:'Describe the visible pencils and notebook in one sentence. You do not need to mention the scissors.',
        concept:'hay',visual:'backpack',inventory:storyPackedInventory,answers:['Hay dos lápices y un cuaderno','Hay un cuaderno y dos lápices','En la mochila hay dos lápices y un cuaderno','En la mochila hay un cuaderno y dos lápices','Hay dos lápices y un cuaderno en la mochila','Hay un cuaderno y dos lápices en la mochila'],model:'Hay dos lápices y un cuaderno.',
        hint:'Una sola palabra de presencia sirve para uno y para varios objetos.',success:'¡Perfecto! Hay funciona para el cuaderno y para los lápices.'}),
      response({id:'final-group',speaker:'Sra. Abarca',context:'Tú y Mateo forman un grupo. La profesora les habla a los dos.',
        prompt:'¿Ustedes son estudiantes?',help:'Answer for yourself and Mateo together.',
        concept:'nosotros',visual:'people',focusPeople:['Yusuf','Mateo','Sra. Abarca'],answers:['Somos estudiantes','Nosotros somos estudiantes','Sí somos estudiantes','Sí nosotros somos estudiantes'],model:'Sí, nosotros somos estudiantes.',
        hint:'Ella dice ustedes. Tú respondes por un grupo que te incluye.',success:'Ustedes preguntado → nosotros respondido. Nosotros somos.'}),
      response({id:'final-like',speaker:'Carlos',context:'Carlos oye el primer acorde. La conversación vuelve a la música.',
        prompt:'Practica una respuesta positiva: ¿te gusta la música?',help:'For this practice line, say that you like music. This does not record your personal preferences.',
        concept:'likes',visual:'band',answers:['Me gusta la música','A mí me gusta la música','Sí me gusta la música','Sí a mí me gusta la música'],model:'Sí, me gusta la música.',
        hint:'La música es singular. Recuerda cómo respondió Mateo.',success:'Me gusta la música. ¡Ya puedes hablar de un gusto!'}),
      response({id:'final-event',speaker:'Sofía',context:'Sofía mira el cartel: «Ensayo • sala de música • 13:00». Todos se reúnen.',
        prompt:'¿Dónde es el ensayo?',help:'Use the poster to say where the rehearsal takes place.',
        concept:'uses',visual:'band',answers:['El ensayo es en la sala de música','Es en la sala de música'],model:'El ensayo es en la sala de música.',
        hint:'Para el lugar de un evento, empieza con es en.',success:'¡Sí! El ensayo es aquí. ¡Entra con Mateo, Sofía, Carlos y Ana!',serUse:'Eventos'})
    ]
  }
];

export const storyTurns = storyScenes.flatMap(scene=>scene.turns);
export const storyConceptLabels:Record<StoryConcept,string> = {
  self:'Yo soy',tu:'Tú eres',usted:'Usted es',ella:'Él / ella es',nosotros:'Nosotros somos',
  ustedes:'Ustedes son',ellos:'Ellos son',ellas:'Ellas son',hay:'Hay',objects:'Los útiles',
  classes:'Mis clases',likes:'Mis gustos',adjectives:'Describir',uses:'SER en contexto'
};

/** Optional recycled conversation. Choose by concept after a later scene, never
 * interrupt a turn or label a learner as weak. These are new contexts and do not
 * increase the 40-turn core-story denominator. All have exactly three choices.
 */
export const reviewTurns:StoryTurn[] = [
  choice({id:'review-story-self',speaker:'Carlos',context:'Carlos ve tu tarjeta al entrar en música.',
    prompt:'¡Hola! Yo soy Carlos. ¿Y tú?',help:'Reply to Carlos by introducing yourself.',concept:'self',visual:'band',focusPeople:['Yusuf','Carlos'],
    options:['Ella es Yusuf.','Yo soy Yusuf.','Tú eres Yusuf.'],answer:'Yo soy Yusuf.',
    hint:'Carlos habla de sí mismo. Ahora tú hablas de ti mismo.',success:'Yo soy sirve para presentarte en otra conversación.'}),
  choice({id:'review-story-tu',speaker:'Mateo',context:'Mateo te pregunta quién escribió tu tarjeta. Tú quieres preguntarle por la suya.',
    prompt:'Le preguntas: «Mateo, ¿___ tú el autor de esta tarjeta?»',help:'Ask Mateo directly whether he is the author of his card.',concept:'tu',visual:'desk',focusPeople:['Yusuf','Mateo'],
    options:['soy','son','eres'],answer:'eres',model:'Mateo, ¿eres tú el autor de esta tarjeta?',
    hint:'Tu pregunta se dirige a un compañero: tú.',success:'Tú → eres también funciona dentro de una pregunta.'}),
  choice({id:'review-story-usted',speaker:'Sra. Abarca',context:'Sra. Abarca te dice: «Soy profesora». Le respondes de forma formal.',
    prompt:'Sí, usted ___ nuestra profesora.',help:'Respond directly to Sra. Abarca using formal usted.',concept:'usted',visual:'classroom',focusPeople:['Yusuf','Sra. Abarca'],
    options:['es','eres','son'],answer:'es',model:'Sí, usted es nuestra profesora.',
    hint:'Aunque hablas a alguien, usted usa la forma de una sola tercera persona.',success:'Usted → es. Tú → eres: dos formas de dirigirte a una persona.'}),
  choice({id:'review-story-ella',speaker:'Mateo',context:'Ana coloca su tarjeta en la mesa. Mateo te pregunta quién es.',
    prompt:'¿Quién es ella?',help:'Tell Mateo who Ana is.',concept:'ella',visual:'people',focusPeople:['Ana','Mateo'],
    options:['Ellas son Ana.','Tú eres Ana.','Ella es Ana.'],answer:'Ella es Ana.',
    hint:'Hablas sobre una compañera que está junto a la mesa.',success:'Ana → ella → es, igual que Sofía.'}),
  choice({id:'review-story-nosotros',speaker:'Sra. Abarca',context:'Tú y Carlos enseñan las tarjetas que han hecho. La profesora les pregunta a los dos.',
    prompt:'¿Ustedes son estudiantes?',help:'Answer for a group including yourself and Carlos.',concept:'nosotros',visual:'people',focusPeople:['Yusuf','Carlos','Sra. Abarca'],
    options:['Sí, ellos son estudiantes.','Sí, nosotros somos estudiantes.','Sí, ustedes son estudiantes.'],answer:'Sí, nosotros somos estudiantes.',
    hint:'Incluye a Carlos y a la persona que responde: tú.',success:'Carlos + yo → nosotros → somos.'}),
  choice({id:'review-story-ustedes',speaker:'Mateo',context:'Mateo y Carlos están delante de ti. Les haces una pregunta a los dos.',
    prompt:'¿___ son compañeros de clase?',help:'Address Mateo and Carlos together.',concept:'ustedes',visual:'people',focusPeople:['Yusuf','Mateo','Carlos'],
    options:['Nosotros','Ellos','Ustedes'],answer:'Ustedes',model:'¿Ustedes son compañeros de clase?',
    hint:'Ellos escuchan tu pregunta: les hablas directamente.',success:'A Mateo y Carlos → ustedes → son.'}),
  choice({id:'review-story-ellos',speaker:'Ana',context:'Mateo y Sofía van juntos a la mesa. Ana te pregunta por ese grupo mixto.',
    prompt:'Hablas SOBRE Mateo y Sofía: «___ son estudiantes».',help:'Talk about Mateo and Sofía as a mixed group, following the class chart.',concept:'ellos',visual:'people',focusPeople:['Mateo','Sofía','Ana'],
    options:['Ellas','Ellos','Ustedes'],answer:'Ellos',model:'Ellos son estudiantes.',
    hint:'Tú no estás incluido. En la lista de clase, el grupo mixto comparte forma con un grupo masculino.',success:'Mateo + Sofía → ellos → son, según la convención de la lista.'}),
  choice({id:'review-story-ellas',speaker:'Mateo',context:'Sofía y Ana muestran sus carpetas ordenadas. Hablas con Mateo sobre ellas.',
    prompt:'___ son organizadas.',help:'Describe Sofía and Ana to Mateo.',concept:'ellas',visual:'people',focusPeople:['Sofía','Ana','Mateo'],
    options:['Ellas','Ustedes','Nosotras'],answer:'Ellas',model:'Ellas son organizadas.',
    hint:'Sofía y Ana son las personas de las que hablas.',success:'Sofía + Ana → ellas → son.'}),
  choice({id:'review-story-hay',speaker:'Ana',context:'Ana revisa la mochila después de guardar las tijeras.',
    prompt:'Ahora, ¿hay tijeras?',help:'Use the updated visible backpack after the scissors were packed.',concept:'hay',visual:'backpack',inventory:storyPackedInventory,
    options:['No, no hay.','Sí, hay.','Yo soy.'],answer:'Sí, hay.',
    hint:'Recuerda qué objeto guardaste para cortar papel. Mira si sigue dentro.',success:'La respuesta cambia cuando cambia la mochila: ahora sí hay tijeras.'}),
  choice({id:'review-story-objects',speaker:'Sofía',context:'Sofía prepara otra tarjeta y necesita una línea de diez centímetros.',
    prompt:'¿Qué usas para medir la línea?',help:'Choose the tool for measuring a ten-centimeter line.',concept:'objects',visual:'desk',
    options:['las tijeras','el borrador','la regla'],answer:'la regla',model:'Yo uso la regla.',
    hint:'Busca el objeto con números y marcas para medir.',success:'Yo uso la regla para medir. Un útil tiene una función.'}),
  choice({id:'review-story-classes',speaker:'Carlos',context:'Carlos señala la última clase en el horario del día: 13:00.',
    prompt:'A las 13:00, ¿qué clase tienes?',help:'Read the last row of the fictional schedule.',concept:'classes',visual:'schedule',
    options:['Tengo la clase de música.','Tengo la clase de español.','Tengo la clase de ciencias.'],answer:'Tengo la clase de música.',
    hint:'Busca la última fila del horario del grupo.',success:'Tengo la clase de música. El horario da contexto a la frase.'}),
  choice({id:'review-story-likes',speaker:'Sofía',context:'Sofía dice: «Las ciencias son divertidas». Practica decir que te gustan.',
    prompt:'A mí me ___ las ciencias.',help:'Practice expressing a positive preference for science.',concept:'likes',visual:'schedule',
    options:['gusta','soy','gustan'],answer:'gustan',model:'A mí me gustan las ciencias.',
    hint:'Fíjate en las: esta asignatura tiene forma plural.',success:'Las ciencias → me gustan, como las matemáticas.'}),
  choice({id:'review-story-adjectives',speaker:'Ana',context:'Carlos hace un dibujo de colores para el cartel del ensayo.',
    prompt:'¿Qué palabra describe su actividad artística?',help:'Choose an adjective matching Carlos’s drawing activity.',concept:'adjectives',visual:'desk',focusPeople:['Carlos'],
    options:['desordenado','artístico','difícil'],answer:'artístico',model:'Carlos es artístico.',
    hint:'Relaciona el dibujo con la clase de arte.',success:'Carlos es artístico. La escena ayuda a entender la palabra.'}),
  choice({id:'review-story-uses',speaker:'Mateo',context:'Sofía señala su cuaderno: «Este cuaderno es mío». Mateo pregunta de quién es.',
    prompt:'¿De quién es el cuaderno?',help:'Sofía just identified the notebook as hers. Tell Mateo the owner.',concept:'uses',visual:'desk',focusPeople:['Sofía','Mateo'],
    options:['Es de Mateo.','Es de Ana.','Es de Sofía.'],answer:'Es de Sofía.',
    hint:'Recuerda quién dijo que el cuaderno era suyo.',success:'Es de Sofía muestra posesión, como el libro de Ana.',serUse:'Posesión'})
];
