import type { WordStory } from './study-types.ts';

// Original practice paragraphs, following the Unit 2 vocabulary and grammar.
export const wordStories: WordStory[] = [
  {
    id: 'classmates', title: 'Friends in Spanish class',
    intro: 'Sra. Abarca welcomes Yusuf and his classmates.',
    words: ['somos', 'eres', 'son', 'Ellos', 'es', 'soy'],
    lines: [
      { before: 'Mateo y Pablo ', answer: 'son', after: ' estudiantes.', hint: 'Mateo + Pablo → ellos → son.' },
      { before: '', answer: 'Ellos', after: ' son compañeros de Yusuf.', hint: 'We are talking ABOUT Mateo and Pablo: they.' },
      { before: 'Ana ', answer: 'es', after: ' de México.', hint: 'Ana is one person: ella → es.' },
      { before: 'Ana pregunta: «Yusuf, ¿de dónde ', answer: 'eres', after: '?»', hint: 'Ana is talking TO Yusuf informally: tú → eres.' },
      { before: 'Yusuf dice a Mateo: «Tú y yo ', answer: 'somos', after: ' amigos».', hint: 'Yusuf includes himself and Mateo: nosotros → somos.' },
    ],
  },
  {
    id: 'school-day', title: 'From one class to the next',
    intro: 'Yusuf follows his schedule through the school day.',
    words: ['almuerzo', 'examen', 'computadora', 'horario', 'música', 'libro'],
    lines: [
      { before: 'Yusuf mira su ', answer: 'horario', after: ' para ver sus clases.', hint: 'Which word means the schedule of classes?' },
      { before: 'En computación, usa una ', answer: 'computadora', after: '.', hint: 'Think of the machine used in computing class.' },
      { before: 'En español, lee las páginas de un ', answer: 'libro', after: ' de cuentos.', hint: 'Which object has pages of stories to read?' },
      { before: 'Después, come con Mateo en el ', answer: 'almuerzo', after: '.', hint: 'At which part of the day does he eat lunch?' },
      { before: 'En su última clase, estudia para un ', answer: 'examen', after: ' de ciencias.', hint: 'He is studying for a science test.' },
    ],
  },
  {
    id: 'backpack', title: 'Ready to take notes',
    intro: 'Yusuf returns to Spanish class and gets ready to write.',
    words: ['borrador', 'pizarra', 'mochila', 'cuaderno', 'lápiz', 'regla'],
    lines: [
      { before: 'Yusuf abre su ', answer: 'mochila', after: ' para sacar sus útiles.', hint: 'This bag carries his school supplies.' },
      { before: 'Saca un ', answer: 'cuaderno', after: ' para tomar apuntes.', hint: 'He takes notes in a notebook.' },
      { before: 'Escribe su nombre con un ', answer: 'lápiz', after: '.', hint: 'He writes with a pencil.' },
      { before: 'Para corregir una letra, usa el ', answer: 'borrador', after: '.', hint: 'Which supply erases a pencil mark?' },
      { before: 'Luego mira la ', answer: 'pizarra', after: ', donde escribe Sra. Abarca.', hint: 'The teacher writes on the classroom board.' },
    ],
  },
  {
    id: 'working-together', title: 'A group that works together',
    intro: 'The classmates describe their group after finishing an activity.',
    words: ['responsables', 'son', 'simpático', 'trabajadora', 'organizadas', 'organizados'],
    lines: [
      { before: 'Ana y Sofía ', answer: 'son', after: ' compañeras de Yusuf.', hint: 'Ana + Sofía → ellas → son.' },
      { before: 'Sus apuntes están en orden: Ana y Sofía son ', answer: 'organizadas', after: '.', hint: 'Two girls → feminine plural: look for -as.' },
      { before: 'Ana estudia mucho. Ella es ', answer: 'trabajadora', after: '.', hint: 'Ana is one girl who works hard: trabajadora.' },
      { before: 'Mateo ayuda al grupo. Él es ', answer: 'simpático', after: '.', hint: 'Mateo is kind and helpful. Match the adjective to él.' },
      { before: 'Yusuf dice: «Mateo y yo hacemos la tarea. Somos ', answer: 'responsables', after: '».', hint: 'Responsable does not change gender; add -s for a group.' },
    ],
  },
];
