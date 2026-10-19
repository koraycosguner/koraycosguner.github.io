import type { U3Question, U3Reference, U3Skill, U3Story, U3Visual } from './types.ts';

// Original practice material based on the supplied Unit 3 scope. Times model a day,
// not the school's actual bell schedule. Teacher documents are not public assets.
export const skillLabels: Record<U3Skill, string> = {
  estar: 'ESTAR: where and how', 'ser-estar': 'SER or ESTAR', prepositions: 'Position words', places: 'School places',
  days: 'Days of the week', months: 'Months', numbers: 'Numbers', ordinals: 'Class periods', dates: 'Dates',
  time: 'Telling time', schedule: 'Reading a schedule', 'start-end': 'Starts, ends, from and until',
};

export const schedule = [
  { period: 1, subject: 'COMPASS', start: '09:00', end: '09:30' },
  { period: 2, subject: 'ciencias', start: '09:30', end: '10:20' },
  { period: 3, subject: 'matemáticas', start: '10:25', end: '11:15' },
  { period: 4, subject: 'banda', start: '11:20', end: '12:10' },
  { period: 5, subject: 'estudios sociales', start: '12:15', end: '13:05' },
  { period: 6, subject: 'almuerzo (pausa de ejemplo)', start: '13:05', end: '13:35' },
  { period: 7, subject: 'receso (pausa de ejemplo)', start: '13:35', end: '14:00' },
  { period: 8, subject: 'artes del lenguaje', start: '14:00', end: '14:50' },
  { period: 9, subject: 'español', start: '14:55', end: '15:45' },
];

const bank: U3Question[] = [];
type Options = Partial<Pick<U3Question, 'context' | 'visual' | 'storyId' | 'test' | 'parallelGroup'>>;
function choice(id: string, skill: U3Skill, prompt: string, correct: string, wrong: [string, string], explanation: string, hint: string, options: Options = {}) {
  const q: U3Question = { id, skill, format: 'choice', prompt, choices: [correct, ...wrong].map((label, index) => ({ id: `${id}-${index}`, label })), answer: [`${id}-0`], explanation, hint, test: false, parallelGroup: `${skill}-${id}`, ...options };
  bank.push(q);
  return q.id;
}
const story = (storyId: string, visual?: U3Visual): Options => ({ storyId, visual });

const arrivalQuestions = [
  choice('arrival-estar', 'estar', 'Yusuf _____ en la escuela.', 'está', ['estoy', 'estamos'], 'Yusuf is one person: él está.', 'Yusuf → él → está.', story('arrival')),
  choice('arrival-backpack', 'prepositions', '¿Dónde está la mochila?', 'Al lado de los casilleros.', ['Debajo de la mesa.', 'Lejos de la escuela.'], 'The story places the backpack beside the lockers: al lado de.', 'Find the sentence about la mochila.', story('arrival', { kind: 'arrival' })),
  choice('arrival-near', 'prepositions', 'La biblioteca está cerca de la cafetería. What does cerca de mean?', 'near', ['behind', 'outside'], 'Cerca de means near.', 'The two places are close together.', story('arrival')),
  choice('arrival-group', 'estar', 'Mateo y Yusuf _____ en la escuela.', 'están', ['está', 'estamos'], 'Mateo and Yusuf are two people you are talking about: ellos están.', 'Talking about them → ellos.', story('arrival')),
  choice('arrival-hall', 'places', 'Mateo está en el pasillo. Where is Mateo?', 'In the hallway.', ['In the bathroom.', 'At home.'], 'El pasillo is the hallway.', 'Students walk along el pasillo between rooms.', story('arrival')),
  choice('arrival-feeling', 'estar', 'Yusuf dice: «Yo _____ contento de ver a Mateo».', 'estoy', ['estás', 'están'], 'Talking about your own feeling: yo estoy contento.', 'Who is speaking? Yo.', story('arrival')),
];
const arrivalCheck = [
  choice('arrival-check-us', 'estar', 'Mateo dice: «Yusuf y yo _____ en el pasillo».', 'estamos', ['están', 'está'], 'Yusuf y yo includes the speaker: nosotros estamos.', 'A group including me → nosotros.', story('arrival')),
  choice('arrival-check-behind', 'prepositions', 'El gimnasio está detrás de la biblioteca. Where is the gym?', 'Behind the library.', ['Beside the lockers.', 'Inside the library.'], 'Detrás de means behind.', 'Detrás is the opposite of delante.', story('arrival')),
];

const calendarQuestions = [
  choice('calendar-today', 'days', '¿Qué día es hoy?', 'martes', ['lunes', 'miércoles'], 'The calendar and story show martes.', 'Look at the highlighted column.', story('calendar', { kind: 'calendar', day: 'martes', month: 'octubre', date: 20 })),
  choice('calendar-yesterday', 'days', 'Hoy es martes. ¿Qué día fue ayer?', 'lunes', ['miércoles', 'domingo'], 'Lunes comes immediately before martes.', 'Ayer is the day before today.', story('calendar')),
  choice('calendar-tomorrow', 'days', 'Hoy es martes. ¿Qué día es mañana?', 'miércoles', ['lunes', 'viernes'], 'Miércoles comes immediately after martes.', 'Mañana is the next day.', story('calendar')),
  choice('calendar-repeat', 'days', '«Tenemos ciencias los martes». What does los martes mean?', 'On Tuesdays.', ['Only yesterday.', 'Tomorrow morning.'], 'Los + a day means on that day regularly: los martes = on Tuesdays.', 'Los shows a recurring day.', story('calendar')),
  choice('calendar-month', 'months', 'El calendario dice octubre. Which month is it?', 'October', ['August', 'December'], 'Octubre means October.', 'It is the tenth month.', story('calendar')),
  'calendar-build-date',
];
bank.push({ id: 'calendar-build-date', skill: 'dates', storyId: 'calendar', format: 'order', prompt: 'Build the date: Today is October 20.', choices: [{ id: 'date-hoy', label: 'Hoy es' }, { id: 'date-el', label: 'el veinte' }, { id: 'date-de', label: 'de octubre.' }], answer: ['date-hoy', 'date-el', 'date-de'], explanation: 'Hoy es el veinte de octubre: day number before month, connected by de.', hint: 'Start with Hoy es. Then the day number, then de + month.', test: false, parallelGroup: 'date-order' });
bank.push({ id: 'review-build-date', skill: 'dates', format: 'order', prompt: 'Build the date: Today is November 14.', choices: [{ id: 'fresh-date-hoy', label: 'Hoy es' }, { id: 'fresh-date-el', label: 'el catorce' }, { id: 'fresh-date-de', label: 'de noviembre.' }], answer: ['fresh-date-hoy', 'fresh-date-el', 'fresh-date-de'], explanation: 'Hoy es el catorce de noviembre. Put the day number before de + month.', hint: 'Start the sentence, add the day number, then add de + month.', test: false, parallelGroup: 'date-order' });
const calendarCheck = [
  choice('calendar-check-date', 'dates', 'Which date matches October 21?', 'el veintiuno de octubre', ['el octubre de veintiuno', 'el veinte de noviembre'], 'Spanish dates use el + day number + de + month.', 'Number first, then de, then the month.', story('calendar')),
  choice('calendar-check-next', 'days', 'Mañana es miércoles. ¿Qué día es después de miércoles?', 'jueves', ['martes', 'sábado'], 'Jueves follows miércoles.', 'Say miércoles, jueves, viernes.', story('calendar')),
];

const scheduleQuestions = [
  choice('schedule-science', 'schedule', '¿Qué clase tiene Yusuf en el segundo período?', 'ciencias', ['banda', 'español'], 'P2 is ciencias. The class order matches the supplied schedule.', 'Segundo means second.', story('schedule', { kind: 'schedule', period: 2 })),
  choice('schedule-after-math', 'schedule', '¿Qué clase tiene después de matemáticas?', 'banda', ['COMPASS', 'artes del lenguaje'], 'Matemáticas is P3; banda follows in P4.', 'Find P3, then move to P4.', story('schedule')),
  choice('schedule-start', 'time', '¿A qué hora empieza la escuela?', 'A las nueve de la mañana.', ['A la una de la tarde.', 'A las tres de la tarde.'], 'The model day starts at 9:00 a.m.: a las nueve de la mañana.', 'The hour hand points to 9 and the minute hand to 12.', story('schedule', { kind: 'clock', hour: 9, minute: 0 })),
  choice('schedule-end', 'time', 'The clock shows the end of school. ¿Qué hora es?', 'Son las tres y cuarenta y cinco de la tarde.', ['Son las tres y quince de la tarde.', 'Son las nueve de la mañana.'], '3:45 p.m. is las tres y cuarenta y cinco de la tarde.', 'Forty-five minutes past three.', story('schedule', { kind: 'clock', hour: 15, minute: 45 })),
  choice('schedule-fifth', 'ordinals', 'Which phrase means fifth class?', 'la quinta clase', ['la segunda clase', 'la novena clase'], 'Quinta means fifth. Clase is feminine, so use quinta.', 'Count first through fifth: primera, segunda, tercera, cuarta, quinta.', story('schedule')),
  choice('schedule-ninth', 'ordinals', 'Español está en el _____ período.', 'noveno', ['tercer', 'cuarto'], 'Spanish is in P9: el noveno período.', 'Noveno means ninth.', story('schedule')),
];
const scheduleCheck = [
  choice('schedule-check-eighth', 'schedule', '¿Qué clase está en P8?', 'artes del lenguaje', ['ciencias', 'banda'], 'P8 is artes del lenguaje, before Spanish in P9.', 'Find the eighth row of the model schedule.', story('schedule', { kind: 'schedule', period: 8 })),
  choice('schedule-check-half', 'time', 'Son las nueve y media. Which clock time is this?', '9:30', ['9:15', '10:30'], 'Y media means half past: thirty minutes.', 'Media is half of one hour.', story('schedule')),
];

const mapQuestions = [
  choice('map-science', 'prepositions', 'La clase de ciencias está _____ de la biblioteca.', 'a la derecha', ['a la izquierda', 'debajo'], 'On this map, science is to the right of the library.', 'Read left and right as you look at the map.', story('map', { kind: 'map' })),
  choice('map-between', 'prepositions', 'La clase de ciencias está _____ el gimnasio y la oficina.', 'entre', ['sin', 'con'], 'Entre means between; science is in the middle.', 'Find the room between the top and bottom rooms on the right.', story('map', { kind: 'map' })),
  choice('map-mateo', 'prepositions', 'Mateo está _____ de la biblioteca.', 'delante', ['detrás', 'lejos'], 'Mateo is in front of the library, toward the bottom of this map.', 'The map labels which direction is delante.', story('map', { kind: 'map' })),
  choice('map-people', 'estar', 'Ana y Mateo _____ en la escuela.', 'están', ['está', 'estoy'], 'Talking about two classmates: ellos están.', 'Two people you are talking about → ellos.', story('map')),
  choice('map-room', 'places', 'Yusuf necesita encontrar la clase. What is la clase here?', 'The classroom.', ['The playing field.', 'The bus stop.'], 'In this location context, la clase means the classroom.', 'He is looking for a room for science.', story('map')),
  choice('map-us', 'estar', 'Ana dice: «Mateo y yo _____ cerca de la biblioteca».', 'estamos', ['están', 'estáis'], 'Mateo y yo includes the speaker: nosotros estamos.', 'A group that includes me uses estamos.', story('map')),
];
const mapCheck = [
  choice('map-check-left', 'prepositions', 'On this map, the library is where in relation to science?', 'A la izquierda de la clase de ciencias.', ['A la derecha de la clase de ciencias.', 'Dentro de la clase de ciencias.'], 'The library is on the left of science.', 'Read the map from your point of view.', story('map', { kind: 'map' })),
  choice('map-check-office', 'places', 'Ana dice: «La oficina está debajo de ciencias en el mapa». Which place is la oficina?', 'The office.', ['The gym.', 'The cafeteria.'], 'La oficina means the office. Here debajo refers to its position on the flat map.', 'Office → oficina.', story('map')),
];

const departureQuestions = [
  choice('departure-start', 'start-end', 'La escuela empieza a las nueve. What does empieza mean?', 'starts', ['ends', 'is located'], 'Empieza means starts. Comienza can also mean starts.', 'Look for the beginning of the day.', story('departure')),
  choice('departure-end', 'start-end', 'La escuela _____ a las tres y cuarenta y cinco.', 'termina', ['estamos', 'desde'], 'Termina means ends.', 'The school day finishes at 3:45 p.m.', story('departure')),
  choice('departure-from-until', 'start-end', '«Desde las nueve hasta las tres y cuarenta y cinco» means…', 'From 9:00 until 3:45.', ['At 9:45 only.', 'From 3:45 until 9:00.'], 'Desde marks the beginning; hasta marks the end.', 'Desde = from; hasta = until.', story('departure')),
  choice('departure-bus', 'places', '¿Dónde está Yusuf después de la escuela?', 'En la parada de autobús.', ['En el gimnasio.', 'En la biblioteca.'], 'The story ends with Yusuf at the bus stop.', 'La parada de autobús is where the bus stops.', story('departure', { kind: 'departure' })),
  choice('departure-time', 'time', '3:45 p.m. belongs to which part of the day?', 'de la tarde', ['de la mañana', 'medianoche'], '3:45 p.m. is in the afternoon: de la tarde.', 'It is after noon and before evening.', story('departure')),
  choice('departure-feeling', 'estar', 'Yusuf dice: «Yo _____ cansado, pero contento».', 'estoy', ['está', 'estamos'], 'Use estoy to express how I feel: yo estoy cansado.', 'Yo → estoy.', story('departure')),
];
const departureCheck = [
  choice('departure-check-begin', 'start-end', '«La escuela comienza a las nueve». Comienza means…', 'starts', ['ends', 'until'], 'Comienza and empieza both mean starts in this sentence.', 'Comienza describes the beginning.', story('departure')),
  choice('departure-check-them', 'estar', 'Yusuf y Mateo _____ en la parada de autobús.', 'están', ['estamos', 'estás'], 'Talking about Yusuf and Mateo: ellos están.', 'The speaker is not included in this group.', story('departure')),
];

export const stories: U3Story[] = [
  { id: 'arrival', title: 'Llegando a la escuela', subtitle: 'Arrive and find familiar places', paragraph: 'Es martes por la mañana. Yusuf está en la escuela. Su mochila está al lado de los casilleros. Mateo está en el pasillo. La biblioteca está cerca de la cafetería. El gimnasio está detrás de la biblioteca.', english: 'It is Tuesday morning. Yusuf is at school. His backpack is beside the lockers. Mateo is in the hallway. The library is near the cafeteria. The gym is behind the library.', visual: { kind: 'arrival' }, questionIds: arrivalQuestions, checkpointIds: arrivalCheck },
  { id: 'calendar', title: '¿Qué día es?', subtitle: 'Read today, yesterday and tomorrow', paragraph: 'Hoy es martes, el veinte de octubre. Ayer fue lunes y mañana es miércoles. Yusuf mira el calendario antes de COMPASS. Tiene ciencias los martes. Hoy también tiene español en el noveno período.', english: 'Today is Tuesday, October 20. Yesterday was Monday and tomorrow is Wednesday. Yusuf looks at the calendar before COMPASS. He has science on Tuesdays. Today he also has Spanish in ninth period.', visual: { kind: 'calendar', day: 'martes', month: 'octubre', date: 20 }, questionIds: calendarQuestions, checkpointIds: calendarCheck },
  { id: 'schedule', title: 'El horario de Yusuf', subtitle: 'Follow the day from 9:00 to 3:45', paragraph: 'La escuela empieza a las nueve de la mañana. Yusuf tiene COMPASS primero, ciencias segundo, matemáticas tercero y banda cuarto. Después tiene estudios sociales. Más tarde tiene artes del lenguaje y español. La escuela termina a las tres y cuarenta y cinco de la tarde.', english: 'School starts at 9:00 a.m. Yusuf has COMPASS first, science second, math third and band fourth. Then he has social studies. Later he has language arts and Spanish. School ends at 3:45 p.m.', visual: { kind: 'schedule' }, questionIds: scheduleQuestions, checkpointIds: scheduleCheck },
  { id: 'map', title: 'Buscando la clase', subtitle: 'Use the map before science', paragraph: 'Antes del segundo período, Yusuf busca ciencias. Ana dice: «La clase está a la derecha de la biblioteca, entre el gimnasio y la oficina». Mateo está delante de la biblioteca. Ana y Mateo están listos para ayudar.', english: 'Before second period, Yusuf looks for science. Ana says, “The classroom is to the right of the library, between the gym and the office.” Mateo is in front of the library. Ana and Mateo are ready to help.', visual: { kind: 'map' }, questionIds: mapQuestions, checkpointIds: mapCheck },
  { id: 'departure', title: 'El final del día', subtitle: 'Finish class and catch the bus', paragraph: 'La escuela empieza a las nueve y termina a las tres y cuarenta y cinco de la tarde. Yusuf está en la escuela desde las nueve hasta las tres y cuarenta y cinco. Después, está en la parada de autobús con Mateo. Está cansado, pero contento.', english: 'School starts at nine and ends at 3:45 in the afternoon. Yusuf is at school from nine until 3:45. Afterward, he is at the bus stop with Mateo. He is tired but happy.', visual: { kind: 'departure' }, questionIds: departureQuestions, checkpointIds: departureCheck },
];

const estarRows = [
  ['yo', 'estoy', 'I am'], ['tú', 'estás', 'you are (one familiar person)'], ['él', 'está', 'he is'], ['ella', 'está', 'she is'], ['usted', 'está', 'you are (one person, formal)'],
  ['nosotros', 'estamos', 'we are (boys or a mixed group)'], ['nosotras', 'estamos', 'we are (girls only)'], ['vosotros', 'estáis', 'you all are (Spain, boys or mixed)'], ['vosotras', 'estáis', 'you all are (Spain, girls only)'],
  ['ustedes', 'están', 'you all are'], ['ellos', 'están', 'they are (boys or mixed)'], ['ellas', 'están', 'they are (girls only)'],
];
estarRows.forEach(([who, form], index) => {
  const wrong = ['estoy', 'estás', 'está', 'estamos', 'estáis', 'están'].filter(x => x !== form).slice(index % 3, index % 3 + 2) as [string, string];
  const fallback = wrong.length === 2 ? wrong : ['estoy', 'estás', 'está', 'estamos'].filter(x => x !== form).slice(0, 2) as [string, string];
  choice(`estar-pronoun-${index}`, 'estar', `${who} _____ en la biblioteca.`, form, fallback, `${who} → ${form}. ESTAR tells where someone is.`, `Choose the ESTAR form that matches ${who}.`, { test: true, parallelGroup: `estar-${who}` });
  choice(`estar-fresh-${index}`, 'estar', `${who} _____ cerca de la cancha.`, form, fallback, `${who} ${form} cerca de la cancha. The pronoun chooses the verb form.`, `Who? ${who}. Then choose the matching ESTAR form.`, { parallelGroup: `estar-${who}` });
});
choice('estar-context-us', 'estar', 'Ana dice: «Lucía y yo _____ contentas».', 'estamos', ['están', 'está'], 'Lucía y yo → nosotras → estamos. The speaker is included.', 'A group including me uses nosotros/as.', { test: true, parallelGroup: 'estar-nosotras' });
choice('estar-context-you', 'estar', 'You speak to a principal politely: «¿Cómo _____ usted?»', 'está', ['estás', 'estáis'], 'Usted uses está, even though it means you.', 'Formal singular you → usted.', { test: true, parallelGroup: 'estar-usted' });
choice('estar-feelings-you', 'estar', 'Mateo, ¿tú _____ nervioso antes del examen?', 'estás', ['estoy', 'está'], 'Tú estás expresses how the person you address feels.', 'Tú → estás.', { test: true, parallelGroup: 'estar-tú' });

const serEstar = [
  ['Yusuf _____ estudiante.', 'es', 'está', 'SER identifies who someone is: Yusuf es estudiante.'],
  ['Yusuf _____ en el gimnasio.', 'está', 'es', 'ESTAR gives location: Yusuf está en el gimnasio.'],
  ['Ana _____ cansada después de banda.', 'está', 'es', 'ESTAR expresses a current feeling: Ana está cansada.'],
  ['Mateo _____ mi compañero de clase.', 'es', 'está', 'SER identifies who Mateo is: my classmate.'],
];
serEstar.forEach(([prompt, correct, wrong, explanation], index) => choice(`ser-estar-${index}`, 'ser-estar', prompt, correct, [wrong, 'somos'], explanation, 'Who or what → SER. Where or how someone feels → ESTAR.', { test: true, parallelGroup: correct === 'es' ? 'ser-estar-identity' : 'ser-estar-location' }));
choice('ser-estar-fresh-location', 'ser-estar', 'La mochila _____ debajo de la mesa.', 'está', ['es', 'soy'], 'ESTAR gives the backpack’s location: está debajo de la mesa.', 'Where something is → ESTAR.', { parallelGroup: 'ser-estar-location' });
choice('ser-estar-fresh-identity', 'ser-estar', 'Ana _____ mi amiga de la clase de español.', 'es', ['está', 'estoy'], 'SER identifies who Ana is: Ana es mi amiga.', 'Who someone is → SER.', { parallelGroup: 'ser-estar-identity' });

const prepositions = [
  ['adentro de', 'inside', 'Yusuf está adentro de la escuela.', 'La mochila está adentro del casillero.'],
  ['afuera de', 'outside', 'Mateo espera afuera de la oficina.', 'La mochila está afuera del casillero.'],
  ['al lado de', 'beside', 'La mochila está al lado de los casilleros.', 'La mochila está al lado de la mesa.'],
  ['a la derecha de', 'to the right of', 'La clase está a la derecha de la biblioteca.', 'La mochila está a la derecha de la mesa.'],
  ['a la izquierda de', 'to the left of', 'La biblioteca está a la izquierda de ciencias.', 'La mochila está a la izquierda de la mesa.'],
  ['cerca de', 'near', 'La biblioteca está cerca de la cafetería.', 'La mochila está cerca de la mesa.'],
  ['con', 'with', 'Yusuf está con Mateo.', 'El estudiante está con su mochila.'],
  ['debajo de', 'under', 'El lápiz está debajo del cuaderno.', 'La mochila está debajo de la mesa.'],
  ['delante de', 'in front of', 'Mateo está delante de la biblioteca.', 'La mochila está delante de la mesa.'],
  ['detrás de', 'behind', 'El gimnasio está detrás de la biblioteca.', 'La mochila está detrás de la mesa.'],
  ['en', 'in / at / on (depending on context)', 'Yusuf está en la escuela.', 'El estudiante está en la clase.'],
  ['encima de', 'on top of', 'El cuaderno está encima de la mesa.', 'La mochila está encima de la mesa.'],
  ['entre', 'between', 'Ciencias está entre el gimnasio y la oficina.', 'La mochila está entre las dos mesas.'],
  ['lejos de', 'far from', 'La casa está lejos de la escuela.', 'La mochila está lejos de la mesa.'],
  ['sin', 'without', 'Mateo llega sin su mochila.', 'El estudiante está sin su mochila.'],
  ['sobre', 'on / on top of', 'El libro está sobre la mesa.', 'La mochila está sobre la mesa.'],
];
prepositions.forEach(([spanish, english, context, fresh], index) => {
  const distractors = spanish === 'en' ? ['behind', 'without'] : ['inside', 'outside', 'with', 'without', 'between', 'far from'].filter(w => w !== english).slice((index % 3), (index % 3) + 2);
  choice(`prep-${index}`, 'prepositions', `In this sentence, what does «${spanish}» mean?`, english, distractors as [string, string], `${spanish} means ${english}. ${context}`, 'Use the position or relationship described in the sentence.', { context, test: true, parallelGroup: `prep-${spanish}` });
  choice(`prep-fresh-${index}`, 'prepositions', `Choose the meaning of «${spanish}».`, english, distractors as [string, string], `${fresh} Here, ${spanish} means ${english}.`, 'Picture the people or objects in this sentence.', { context: fresh, visual: { kind: 'relation', relation: spanish }, parallelGroup: `prep-${spanish}` });
});
choice('test-map-location', 'prepositions', 'Según el mapa, ciencias está _____ el gimnasio y la oficina.', 'entre', ['lejos de', 'afuera de'], 'The science classroom is between the gym and the office.', 'Use the three rooms on the right side of the map.', { visual: { kind: 'map' }, test: true, parallelGroup: 'map-between' });

const places = [
  ['la clase', 'the classroom (in this location context)', 'Yusuf entra para estudiar ciencias.'], ['el baño', 'the bathroom', 'Yusuf necesita lavarse las manos.'],
  ['la oficina', 'the office', 'Ana busca información de la escuela.'], ['la oficina del director', "the principal’s office", 'Yusuf va a hablar con el director.'],
  ['el gimnasio', 'the gym', 'La clase juega al baloncesto adentro.'], ['la cafetería', 'the cafeteria', 'Yusuf compra el almuerzo.'],
  ['el recreo / el receso', 'recess / break time', 'Es una pausa entre actividades; no es el nombre de un edificio.'], ['la biblioteca', 'the library', 'Mateo busca un libro para leer.'],
  ['el pasillo', 'the hallway', 'Ana camina entre las clases.'], ['los casilleros', 'the lockers', 'Yusuf guarda sus materiales escolares.'],
  ['el campo', 'the field', 'Los estudiantes juegan al fútbol en el césped.'], ['la cancha', 'the court', 'Mateo juega al tenis en una superficie marcada.'],
  ['la parada de autobús', 'the bus stop', 'Yusuf espera el autobús después de la escuela.'], ['la casa', 'the house / home', 'Yusuf llega después del viaje en autobús.'],
];
places.forEach(([spanish, english, context], index) => {
  const wrongEnglish = places.filter((_, i) => i !== index && !(index === 2 && i === 3) && !(index === 3 && i === 2)).map(row => row[1]).slice(index % 6, index % 6 + 2) as [string, string];
  const wrongSpanish = places.filter((_, i) => i !== index && !(index === 2 && i === 3) && !(index === 3 && i === 2)).map(row => row[0]).slice(index % 6, index % 6 + 2) as [string, string];
  choice(`place-${index}`, 'places', `What does «${spanish}» mean here?`, english, wrongEnglish, `${spanish} means ${english}.`, 'Use the action in the short school scene.', { context, test: true, parallelGroup: `place-${index}` });
  choice(`place-fresh-${index}`, 'places', `Choose the Spanish for ${english}.`, spanish, wrongSpanish, `${spanish}: ${english}. ${context}`, 'Remember the place or break in this school scene.', { context, parallelGroup: `place-${index}` });
});

const days = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
const englishDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
days.forEach((day, index) => {
  choice(`day-${index}`, 'days', `El plan escolar dice «${day}». Which day is that?`, englishDays[index], [englishDays[(index + 1) % 7], englishDays[(index + 3) % 7]], `${day} means ${englishDays[index]}. Spanish day names use lowercase.`, 'Think of the days in order.', { test: true, parallelGroup: `day-${day}` });
  choice(`day-fresh-${index}`, 'days', `Hoy es ${day}. ¿Qué día es mañana?`, days[(index + 1) % 7], [day, days[(index + 6) % 7]], `After ${day} comes ${days[(index + 1) % 7]}.`, 'Mañana is the next day; the week wraps from domingo to lunes.', { parallelGroup: `day-${day}` });
});

const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const englishMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
months.forEach((month, index) => {
  choice(`month-${index}`, 'months', `La nota del calendario dice «${month}». Which month is it?`, englishMonths[index], [englishMonths[(index + 2) % 12], englishMonths[(index + 5) % 12]], `${month} means ${englishMonths[index]}.`, 'Look at the month name, not the day number.', { test: true, parallelGroup: `month-${month}` });
  choice(`month-fresh-${index}`, 'months', `Write ${englishMonths[index]} on the class calendar in Spanish.`, month, [months[(index + 1) % 12], months[(index + 4) % 12]], `The month is ${month}. Spanish months use lowercase.`, 'Think of the month on the classroom calendar.', { parallelGroup: `month-${month}` });
});

const numbers = [
  [1, 'uno'], [2, 'dos'], [3, 'tres'], [4, 'cuatro'], [5, 'cinco'], [6, 'seis'], [7, 'siete'], [8, 'ocho'], [9, 'nueve'], [10, 'diez'], [11, 'once'], [12, 'doce'], [13, 'trece'], [14, 'catorce'], [15, 'quince'], [16, 'dieciséis'], [17, 'diecisiete'], [18, 'dieciocho'], [19, 'diecinueve'], [20, 'veinte'], [21, 'veintiuno'], [22, 'veintidós'], [23, 'veintitrés'], [24, 'veinticuatro'], [25, 'veinticinco'], [26, 'veintiséis'], [27, 'veintisiete'], [28, 'veintiocho'], [29, 'veintinueve'], [30, 'treinta'], [31, 'treinta y uno'], [32, 'treinta y dos'], [33, 'treinta y tres'], [40, 'cuarenta'], [50, 'cincuenta'], [60, 'sesenta'], [70, 'setenta'], [80, 'ochenta'], [90, 'noventa'], [100, 'cien'],
] as const;
numbers.forEach(([number, word], index) => {
  const context = number <= 31 ? 'Yusuf reads a number on the classroom calendar.' : 'Yusuf reads a numbered page in his school book.';
  choice(`number-${number}`, 'numbers', `Which numeral matches «${word}»?`, String(number), [String(numbers[(index + 1) % numbers.length][0]), String(numbers[(index + 3) % numbers.length][0])], `${word} is ${number}.`, 'Read each part of the number.', { context, test: true, parallelGroup: `number-${number}` });
  choice(`number-fresh-${number}`, 'numbers', `El número de la página es ${number}. Choose the number word.`, word, [numbers[(index + 2) % numbers.length][1], numbers[(index + 4) % numbers.length][1]], `${number} is ${word}.`, 'Use the number on the book page.', { parallelGroup: `number-${number}` });
});

const ordinals = ['primer', 'segundo', 'tercer', 'cuarto', 'quinto', 'sexto', 'séptimo', 'octavo', 'noveno'];
const ordinalFull = ['primero / primera', 'segundo / segunda', 'tercero / tercera', 'cuarto / cuarta', 'quinto / quinta', 'sexto / sexta', 'séptimo / séptima', 'octavo / octava', 'noveno / novena'];
const englishOrdinals = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth'];
ordinals.forEach((word, index) => {
  choice(`ordinal-${index + 1}`, 'ordinals', `P${index + 1} is el _____ período.`, word, [ordinals[(index + 1) % 9], ordinals[(index + 3) % 9]], `P${index + 1} is el ${word} período (${englishOrdinals[index]} period).`, 'Match the position, not a clock time.', { test: true, parallelGroup: `ordinal-${index + 1}` });
  const feminine = ordinalFull[index].split(' / ')[1];
  choice(`ordinal-fresh-${index + 1}`, 'ordinals', `Choose «the ${englishOrdinals[index]} class».`, `la ${feminine} clase`, [`la ${ordinalFull[(index + 2) % 9].split(' / ')[1]} clase`, `la ${ordinalFull[(index + 4) % 9].split(' / ')[1]} clase`], `La ${feminine} clase means the ${englishOrdinals[index]} class.`, 'Clase is feminine, so the ordinal ends in a.', { parallelGroup: `ordinal-${index + 1}` });
});

[
  ['date-1', 'The class trip is November 3. Choose the date.', 'el tres de noviembre', ['el noviembre de tres', 'el trece de noviembre'], 'Spanish dates use el + day number + de + month.'],
  ['date-2', 'El examen es el quince de marzo. When is the test?', 'March 15', ['May 3', 'March 5'], 'Quince is fifteen; marzo is March.'],
  ['date-3', 'The band event is December 1. Choose the date.', 'el primero de diciembre', ['el diciembre primero de', 'el trece de diciembre'], 'Primero is commonly used for the first day of a month. El uno de diciembre is also used and is not a wrong-answer option.'],
  ['date-4', 'La reunión es el treinta y uno de enero. When is it?', 'January 31', ['June 13', 'January 30'], 'Treinta y uno is thirty-one; enero is January.'],
] .forEach(([id, prompt, correct, wrong, explanation]) => choice(id as string, 'dates', prompt as string, correct as string, wrong as [string, string], explanation as string, 'Read the day number, then the month.', { test: true, parallelGroup: 'date-reading' }));
choice('test-calendar-date', 'dates', '¿Cuál es la fecha que muestra el calendario?', 'el veinte de octubre', ['el doce de octubre', 'el veinte de noviembre'], 'The highlighted date is October 20.', 'Use the month header and highlighted day number.', { visual: { kind: 'calendar', day: 'martes', month: 'octubre', date: 20 }, test: true, parallelGroup: 'date-reading' });
choice('date-fresh-1', 'dates', 'La excursión es el veintidós de abril. When is it?', 'April 22', ['August 2', 'April 12'], 'Veintidós is 22; abril is April.', 'Number first, then month.', { parallelGroup: 'date-reading' });
choice('date-fresh-2', 'dates', 'Write February 14 for a school event.', 'el catorce de febrero', ['el febrero de catorce', 'el cuatro de febrero'], 'El catorce de febrero follows number + de + month.', 'Use el + day + de + month.', { parallelGroup: 'date-reading' });

const timeItems: { id: string; prompt: string; correct: string; wrong: [string, string]; explanation: string; hour: number; minute: number }[] = [
  { id: 'one', prompt: 'It is 1:00. Choose the time sentence.', correct: 'Es la una.', wrong: ['Son las una.', 'Es las dos.'], explanation: 'One o’clock is singular: Es la una.', hour: 1, minute: 0 },
  { id: 'quarter', prompt: 'It is 9:15 a.m. before science. Choose the time.', correct: 'Son las nueve y cuarto de la mañana.', wrong: ['Son las nueve y media de la mañana.', 'Son las diez y cuarto de la mañana.'], explanation: 'Y cuarto means fifteen minutes past the hour.', hour: 9, minute: 15 },
  { id: 'half', prompt: 'The clock reads 10:30 a.m. during math. Choose the time.', correct: 'Son las diez y media de la mañana.', wrong: ['Son las diez y cuarto de la mañana.', 'Son las once y media de la mañana.'], explanation: 'Y media means thirty minutes past the hour.', hour: 10, minute: 30 },
  { id: 'afternoon', prompt: 'After school, the clock reads 3:45 p.m. Choose the time.', correct: 'Son las tres y cuarenta y cinco de la tarde.', wrong: ['Son las tres y quince de la tarde.', 'Son las tres y cuarenta y cinco de la mañana.'], explanation: '3:45 p.m. is three forty-five in the afternoon.', hour: 15, minute: 45 },
  { id: 'noon', prompt: 'It is 12:00 p.m., during band. Which word names this time?', correct: 'mediodía', wrong: ['medianoche', 'la mañana'], explanation: 'Mediodía is noon: 12:00 p.m.', hour: 12, minute: 0 },
  { id: 'midnight', prompt: 'At home, a clock changes from 11:59 p.m. to 12:00 a.m. Which word names this time?', correct: 'medianoche', wrong: ['mediodía', 'la tarde'], explanation: 'Medianoche is midnight: 12:00 a.m.', hour: 0, minute: 0 },
  { id: 'night', prompt: 'Yusuf reads at home at 8:00 p.m. Which phrase fits?', correct: 'a las ocho de la noche', wrong: ['a las ocho de la mañana', 'a las nueve de la tarde'], explanation: 'Eight in the evening is las ocho de la noche.', hour: 20, minute: 0 },
  { id: 'morning', prompt: 'Before school, it is 7:45 a.m. Which part of the day fits?', correct: 'de la mañana', wrong: ['de la tarde', 'de la noche'], explanation: '7:45 a.m. is in the morning.', hour: 7, minute: 45 },
];
timeItems.forEach(item => {
  choice(`time-${item.id}`, 'time', item.prompt, item.correct, item.wrong, item.explanation, 'Check the hour, minutes and a.m./p.m.', { test: true, parallelGroup: `time-${item.id}` });
});
choice('time-fresh-one', 'time', 'It is afternoon, near lunchtime. Read the clock.', 'Es la una de la tarde.', ['Son las una de la tarde.', 'Es la una de la mañana.'], 'One o’clock uses Es la una; the context makes it afternoon.', 'One o’clock uses Es la, even in the afternoon.', { visual: { kind: 'clock', hour: 13, minute: 0 }, parallelGroup: 'time-one' });
choice('time-fresh-quarter', 'time', 'It is afternoon during language arts. Read the clock.', 'Son las dos y cuarto de la tarde.', ['Son las dos y media de la tarde.', 'Son las tres y cuarto de la tarde.'], '2:15 p.m. is las dos y cuarto de la tarde.', 'The long hand points to 3: fifteen minutes past.', { visual: { kind: 'clock', hour: 14, minute: 15 }, parallelGroup: 'time-quarter' });
choice('time-fresh-half', 'time', 'Science is beginning in the morning. Read the clock.', 'Son las nueve y media de la mañana.', ['Son las nueve y cuarto de la mañana.', 'Son las diez y media de la mañana.'], '9:30 a.m. is las nueve y media de la mañana.', 'The long hand points to 6: thirty minutes past.', { visual: { kind: 'clock', hour: 9, minute: 30 }, parallelGroup: 'time-half' });
choice('time-fresh-afternoon', 'time', 'It is afternoon during language arts. Read the clock.', 'Son las dos y cuarenta y cinco de la tarde.', ['Son las dos y quince de la tarde.', 'Son las dos y cuarenta y cinco de la mañana.'], '2:45 p.m. is las dos y cuarenta y cinco de la tarde.', 'The long hand points to 9: forty-five minutes past.', { visual: { kind: 'clock', hour: 14, minute: 45 }, parallelGroup: 'time-afternoon' });
choice('time-fresh-noon', 'time', 'The band reminder says «mediodía». What time does it mean?', '12:00 p.m.', ['12:00 a.m.', '1:00 p.m.'], 'Mediodía names noon, 12:00 p.m.', 'Medio día: the middle of the day.', { parallelGroup: 'time-noon' });
choice('time-fresh-midnight', 'time', 'A home clock reminder says «medianoche». What time does it mean?', '12:00 a.m.', ['12:00 p.m.', '1:00 p.m.'], 'Medianoche names midnight, 12:00 a.m.', 'Media noche: the middle of the night.', { parallelGroup: 'time-midnight' });
choice('time-fresh-night', 'time', 'The class calendar reminder is for 7:00 p.m. tomorrow. Choose the time phrase.', 'a las siete de la noche', ['a las siete de la mañana', 'a las ocho de la noche'], 'At seven in the evening is a las siete de la noche.', 'P.m. at seven is evening.', { visual: { kind: 'clock', hour: 19, minute: 0 }, parallelGroup: 'time-night' });
choice('time-fresh-morning', 'time', 'An arrival reminder says «a las ocho de la mañana». Choose its time.', '8:00 a.m.', ['8:00 p.m.', '9:00 a.m.'], 'Las ocho de la mañana means eight in the morning.', 'Mañana in this time phrase means morning.', { parallelGroup: 'time-morning' });
choice('test-clock-time', 'time', 'Es por la tarde. ¿Qué hora muestra el reloj?', 'Son las dos y media.', ['Son las dos y cuarto.', 'Son las tres y media.'], 'The clock shows 2:30 p.m.: las dos y media.', 'The minute hand is on 6.', { visual: { kind: 'clock', hour: 14, minute: 30 }, test: true, parallelGroup: 'time-half' });
choice('time-fresh-one-pm', 'time', 'Before lunch, the clock reads 1:00 p.m. ¿Qué hora es?', 'Es la una de la tarde.', ['Son las una de la tarde.', 'Es la una de la mañana.'], 'One o’clock uses Es la una; p.m. here is de la tarde.', 'One hour → Es la una.', { parallelGroup: 'time-one' });

[
  ['test-schedule-first', '¿Qué clase tiene Yusuf antes de ciencias?', 'COMPASS', ['banda', 'español'], 'COMPASS is P1; science is P2.'],
  ['test-schedule-third', 'P2 es ciencias y P3 es matemáticas. ¿Qué clase sigue a ciencias?', 'matemáticas', ['banda', 'español'], 'P3 follows P2.'],
  ['test-schedule-fourth', '¿Qué clase está entre matemáticas y estudios sociales?', 'banda', ['español', 'COMPASS'], 'The order is P3 math, P4 band, P5 social studies.'],
  ['test-schedule-last', '¿Qué clase tiene Yusuf en el último período, P9?', 'español', ['ciencias', 'matemáticas'], 'Spanish is in ninth, the final listed period.'],
  ['review-schedule-language', 'P8 es artes del lenguaje. ¿Qué clase tiene antes de español en P9?', 'artes del lenguaje', ['banda', 'ciencias'], 'Language arts in P8 comes immediately before Spanish in P9.'],
].forEach(([id, prompt, correct, wrong, explanation]) => choice(id as string, 'schedule', prompt as string, correct as string, wrong as [string, string], explanation as string, 'Follow the supplied class order.', { context: 'P1 COMPASS → P2 ciencias → P3 matemáticas → P4 banda → P5 estudios sociales → P8 artes del lenguaje → P9 español', test: (id as string).startsWith('test-'), parallelGroup: 'schedule-order' }));
choice('schedule-review-time', 'schedule', 'In the model timetable, band begins at 11:20. Which subject starts then?', 'banda', ['ciencias', 'español'], 'The fictional timetable places band at 11:20 a.m.', 'Find the row beginning 11:20.', { visual: { kind: 'schedule', period: 4 }, parallelGroup: 'schedule-time' });

[
  ['start-begin', 'La clase comienza a las diez. What does comienza mean?', 'starts', ['ends', 'until'], 'Comienza means starts. Empieza is also correct; it is not used as a distractor.'],
  ['start-end', 'El día termina a las tres y cuarenta y cinco. What does termina mean?', 'ends', ['starts', 'from'], 'Termina means ends.'],
  ['start-from', 'La clase es _____ las nueve hasta las diez.', 'desde', ['hasta', 'termina'], 'Desde marks the starting point: from nine.'],
  ['start-until', 'La clase es desde las nueve _____ las diez.', 'hasta', ['desde', 'comienza'], 'Hasta marks the ending point: until ten.'],
  ['start-fresh-from', 'Estoy en banda desde las once y veinte. When does this begin?', 'At 11:20.', ['At 12:10.', 'At 3:45.'], 'Desde identifies the starting time, 11:20.'],
  ['start-fresh-until', 'Estoy en banda hasta las doce y diez. When does this end?', 'At 12:10.', ['At 11:20.', 'At 9:00.'], 'Hasta identifies the ending time, 12:10.'],
].forEach(([id, prompt, correct, wrong, explanation]) => choice(id as string, 'start-end', prompt as string, correct as string, wrong as [string, string], explanation as string, 'Starts: empieza/comienza. Ends: termina. From: desde. Until: hasta.', { test: !(id as string).includes('fresh'), parallelGroup: 'start-end-phrases' }));

choice('test-reading-school-day', 'schedule', 'Según el párrafo, ¿qué hace Yusuf después de español?', 'Espera el autobús con Mateo.', ['Va a ciencias.', 'Empieza COMPASS.'], 'The final sentence says he waits for the bus with Mateo after Spanish.', 'Read the last sentence for what happens next.', { context: 'Hoy es martes. Yusuf tiene ciencias en el segundo período y español en el noveno. Español termina a las tres y cuarenta y cinco. Después de español, Yusuf espera el autobús con Mateo.', test: true, parallelGroup: 'reading-school-day' });
choice('review-reading-school-day', 'schedule', 'Según el párrafo, ¿qué clase tiene Yusuf antes de banda?', 'matemáticas', ['español', 'COMPASS'], 'The passage says math comes before band.', 'Look for antes de banda.', { context: 'Es martes. Yusuf termina ciencias y camina a matemáticas. Tiene matemáticas antes de banda. Después de banda, tiene estudios sociales.', parallelGroup: 'reading-school-day' });

export const completeQuestionIds = ['complete-location', 'complete-schedule'];
bank.push(
  { id: 'complete-location', skill: 'prepositions', format: 'bank', prompt: 'Complete the school scene. Use each phrase once.', context: 'Tap a word for the next blank, or choose an empty blank first. You can also drag words.', choices: [{ id: 'loc-esta', label: 'está' }, { id: 'loc-library', label: 'biblioteca' }, { id: 'loc-beside', label: 'al lado de' }, { id: 'loc-gym', label: 'gimnasio' }, { id: 'loc-estan', label: 'están' }], answer: ['loc-esta', 'loc-library', 'loc-beside', 'loc-gym', 'loc-estan'], segments: ['Yusuf ', ' en la escuela. Va a la ', ' para buscar un libro. Su mochila está ', ' los casilleros. Después camina al ', ' para jugar al baloncesto. Ana y Mateo ', ' en el pasillo.'], explanation: 'One person: está. A place for books: biblioteca. Beside: al lado de. Indoor sports: gimnasio. Two people: están.', hint: 'Match each blank to its job: verb, place, position, place, plural verb.', visual: { kind: 'arrival' }, test: false, parallelGroup: 'complete-location' },
  { id: 'complete-schedule', skill: 'schedule', format: 'bank', prompt: 'Complete the day from morning to afternoon. Use each phrase once.', choices: [{ id: 'sch-tuesday', label: 'martes' }, { id: 'sch-nine', label: 'nueve' }, { id: 'sch-spanish', label: 'español' }, { id: 'sch-ends', label: 'termina' }, { id: 'sch-stop', label: 'parada de autobús' }], answer: ['sch-tuesday', 'sch-nine', 'sch-spanish', 'sch-ends', 'sch-stop'], segments: ['Hoy es ', ', el veinte de octubre. La escuela empieza a las ', ' de la mañana. Yusuf tiene ', ' en el noveno período. La escuela ', ' a las tres y cuarenta y cinco. Después va a la ', '.'], explanation: 'Tuesday is martes. The day begins at nueve, Spanish is ninth, termina means ends, and the bus stop is la parada de autobús.', hint: 'Follow the day: day name → starting hour → last subject → ending verb → place.', visual: { kind: 'departure' }, test: false, parallelGroup: 'complete-schedule' },
);

// Stories and review share concept groups so a retry can offer a different example.
const storyGroups: Record<string, string> = {
  'arrival-estar': 'estar-él', 'arrival-backpack': 'prep-al lado de', 'arrival-near': 'prep-cerca de', 'arrival-group': 'estar-ellos', 'arrival-hall': 'place-8', 'arrival-feeling': 'estar-yo', 'arrival-check-us': 'estar-nosotros', 'arrival-check-behind': 'prep-detrás de',
  'calendar-today': 'day-martes', 'calendar-yesterday': 'day-lunes', 'calendar-tomorrow': 'day-miércoles', 'calendar-repeat': 'day-martes', 'calendar-month': 'month-octubre', 'calendar-check-date': 'date-reading', 'calendar-check-next': 'day-jueves',
  'schedule-science': 'schedule-order', 'schedule-after-math': 'schedule-order', 'schedule-start': 'time-morning', 'schedule-end': 'time-afternoon', 'schedule-fifth': 'ordinal-5', 'schedule-ninth': 'ordinal-9', 'schedule-check-eighth': 'schedule-order', 'schedule-check-half': 'time-half',
  'map-science': 'prep-a la derecha de', 'map-between': 'map-between', 'map-mateo': 'prep-delante de', 'map-people': 'estar-ellos', 'map-room': 'place-0', 'map-us': 'estar-nosotros', 'map-check-left': 'prep-a la izquierda de', 'map-check-office': 'place-2',
  'departure-start': 'start-end-phrases', 'departure-end': 'start-end-phrases', 'departure-from-until': 'start-end-phrases', 'departure-bus': 'place-12', 'departure-time': 'time-afternoon', 'departure-feeling': 'estar-yo', 'departure-check-begin': 'start-end-phrases', 'departure-check-them': 'estar-ellos',
};
for (const item of bank) if (storyGroups[item.id]) item.parallelGroup = storyGroups[item.id];
export const questions: U3Question[] = bank;
export const references: U3Reference[] = [
  { skill: 'estar', title: 'Who? → pronoun → ESTAR', entries: estarRows.map(([pronoun, form, english]) => ({ spanish: `${pronoun} ${form}`, english })).concat([{ spanish: 'Yusuf y yo → nosotros → estamos', english: 'A group including me uses estamos.' }, { spanish: 'Usted está / ustedes están', english: 'Formal one person / addressing a group.' }, { spanish: 'Estoy contento/a. Estoy cansado/a. Estoy nervioso/a.', english: 'I feel happy / tired / nervous. Choose the adjective ending for the speaker.' }]) },
  { skill: 'ser-estar', title: 'A small SER / ESTAR reminder', entries: [{ spanish: 'Soy estudiante.', english: 'SER: who or what someone is.' }, { spanish: 'Estoy en la escuela.', english: 'ESTAR: where someone is.' }, { spanish: 'Estoy contento/a.', english: 'ESTAR: how someone feels.' }] },
  { skill: 'prepositions', title: 'Position words in school scenes', entries: prepositions.map(([spanish, english, example]) => ({ spanish: `${spanish} · ${example}`, english })).concat([{ spanish: 'sobre / encima de', english: 'Both can mean on top of. They are not competing wrong answers.' }, { spanish: 'del / de la', english: 'De + el contracts to del: delante del gimnasio. De la stays separate.' }]) },
  { skill: 'places', title: 'Where are we going?', entries: places.map(([spanish, english]) => ({ spanish, english })) },
  { skill: 'days', title: 'Follow the school week', entries: days.map((spanish, index) => ({ spanish, english: englishDays[index] })).concat([{ spanish: 'ayer / hoy / mañana', english: 'yesterday / today / tomorrow' }, { spanish: 'el martes / los martes', english: 'on Tuesday / on Tuesdays' }]) },
  { skill: 'months', title: 'Read the calendar month', entries: months.map((spanish, index) => ({ spanish, english: englishMonths[index] })) },
  { skill: 'numbers', title: 'Numbers on calendars, pages and clocks', entries: [...numbers.map(([number, word]) => ({ spanish: word, english: String(number) })), { spanish: 'uno → un libro / una clase', english: 'Use un before a masculine noun and una before a feminine noun. The counting form is uno.' }] },
  { skill: 'ordinals', title: 'Which class period?', entries: ordinalFull.map((spanish, index) => ({ spanish, english: englishOrdinals[index] })).concat([{ spanish: 'el primer período / el tercer período', english: 'Primero and tercero shorten before a singular masculine noun.' }, { spanish: 'la primera clase / la tercera clase', english: 'Use feminine endings with clase.' }]) },
  { skill: 'dates', title: 'Build a date', entries: [{ spanish: 'Hoy es el veinte de octubre.', english: 'Today is October 20: el + day number + de + month.' }, { spanish: 'Hoy es martes, el veinte de octubre.', english: 'Add the weekday before the date.' }, { spanish: 'el primero de diciembre', english: 'December 1. El uno de diciembre is also used.' }, { spanish: 'el veinte de octubre de dos mil veintiséis', english: 'October 20, 2026. The year is optional in these activities; year-number recall is not tested.' }] },
  { skill: 'time', title: 'Read the hour, minutes and part of day', entries: [{ spanish: 'Es la una. / Son las dos.', english: 'It is one / It is two. Only one o’clock uses Es la.' }, { spanish: 'A la una. / A las nueve.', english: 'At one / At nine. Use a la(s) when something happens at a time.' }, { spanish: 'y cuarto / y media', english: ':15 / :30 (quarter past / half past)' }, { spanish: 'las tres y cuarenta y cinco', english: '3:45; las cuatro menos cuarto is another valid phrasing.' }, { spanish: 'de la mañana / de la tarde / de la noche', english: 'in the morning / afternoon / evening-night' }, { spanish: 'mediodía / medianoche', english: 'noon (12 p.m.) / midnight (12 a.m.)' }] },
  { skill: 'schedule', title: 'Our example school day', entries: schedule.map(row => ({ spanish: `P${row.period}: ${row.subject} · ${row.start}–${row.end}`, english: 'Model times, not actual school bell times.' })).concat([{ spanish: 'P6 / P7', english: 'Example lunch and break intervals only; no actual courses were supplied for these periods.' }]) },
  { skill: 'start-end', title: 'Start, finish and duration', entries: [{ spanish: 'empieza / comienza', english: 'starts / begins' }, { spanish: 'termina', english: 'ends / finishes' }, { spanish: 'desde las nueve hasta las tres y cuarenta y cinco', english: 'from nine until three forty-five' }, { spanish: 'La escuela empieza a las nueve de la mañana.', english: 'School starts at 9:00 a.m.' }, { spanish: 'La escuela termina a las tres y cuarenta y cinco de la tarde.', english: 'School ends at 3:45 p.m.' }] },
];
