import assert from 'node:assert/strict';
import test from 'node:test';
import {studyHelp, studyLessons, storyQuestions, studyGuideQuestions, testQuestions} from '../spanish/study-content.ts';
import type {StudyQuestion} from '../spanish/study-types.ts';

const lessons=studyLessons.flatMap(lesson=>lesson.questions);
const all=[...lessons,...storyQuestions,...studyGuideQuestions,...testQuestions];
function byId(id:string):StudyQuestion {const q=all.find(item=>item.id===id);assert.ok(q,`Missing ${id}`);return q;}
function answers(id:string):string[]{return byId(id).steps.map(step=>step.answer);}

test('each calm question offers one valid key, a compact bank and relevant help',()=>{
  assert.equal(new Set(all.map(q=>q.id)).size,all.length,'Question IDs are unique across all modes');
  for(const q of all){
    assert.ok(q.context.trim()&&q.chapter.trim(),q.id);
    assert.ok(q.steps.length>=1&&q.steps.length<=3,q.id);
    for(const step of q.steps){
      assert.ok(step.prompt.trim()&&step.hint.trim()&&step.explanation.trim(),q.id);
      assert.ok(step.help in studyHelp,q.id);
      assert.ok(step.options.length>=2&&step.options.length<=4,q.id);
      assert.equal(new Set(step.options).size,step.options.length,q.id);
      assert.equal(step.options.filter(option=>option===step.answer).length,1,q.id);
      if(step.options.length===2)assert.deepEqual([...step.options].sort(),['Cierto','Falso'],q.id);
    }
  }
  for(const help of Object.values(studyHelp)){assert.ok(help.title);assert.ok(help.lines.length>=2&&help.lines.length<=5);}
});

test('mini-lessons stay short and lead immediately to two to four questions',()=>{
  assert.equal(studyLessons.length,14);
  assert.equal(new Set(studyLessons.map(lesson=>lesson.id)).size,studyLessons.length);
  for(const lesson of studyLessons){
    assert.ok(lesson.title&&lesson.summary,lesson.id);
    assert.ok(lesson.examples.length<=3,lesson.id);
    assert.ok(lesson.questions.length>=2&&lesson.questions.length<=4,lesson.id);
    assert.ok(lesson.summary.length<250,lesson.id);
  }
  assert.deepEqual(answers('learn-adjective-build'),['ellas','son','Ana y Sofía son organizadas.']);
  assert.deepEqual(answers('learn-adjective-responsibles'),['responsables']);
});

test('school-day story advances in order with recurring characters and three-option steps',()=>{
  assert.equal(storyQuestions.length,28);
  assert.deepEqual(storyQuestions.map(q=>q.id),Array.from({length:28},(_,i)=>`story-${String(i+1).padStart(2,'0')}`));
  for(const q of storyQuestions)for(const step of q.steps)assert.equal(step.options.length,3,q.id);
  assert.match(storyQuestions[0].context,/enters Spanish class/);
  assert.match(byId('story-13').context,/lends Yusuf scissors/);
  assert.deepEqual(answers('story-12'),['No, no hay.']);
  assert.match(storyQuestions.at(-1)!.context,/reach music class/);
  assert.deepEqual(answers('story-25'),['ellas','son','Ana y Sofía son organizadas.']);
  assert.deepEqual(answers('story-28'),['somos']);
});

test('study guide review follows the ten requested reasoning stages',()=>{
  assert.equal(studyGuideQuestions.length,10);
  const headings=['Find the pronoun','IN · TO · ABOUT','Pronoun → SER','SER sentence completion','SER + origin','SER + de','SER + adjective agreement','Vocabulary word bank','Complete the Story','Mixed Study Guide Challenge'];
  assert.deepEqual(studyGuideQuestions.map(q=>q.chapter),headings.map((heading,i)=>`${i+1}. ${heading}`));
  assert.deepEqual(answers('guide-03'),['ellos','son']);
  assert.deepEqual(answers('guide-07'),['son','Ana y Camila son trabajadoras.']);
  assert.deepEqual(answers('guide-09'),['son','es']);
  assert.deepEqual(answers('guide-10'),['Ellos son organizados.']);
});

test('full test covers the new pronoun, origin, ownership and agreement requirements',()=>{
  assert.ok(testQuestions.length>=65&&testQuestions.length<=90,testQuestions.length.toString());
  const expected:Record<string,string[]>={
    'test-meaning-tu':['tú'],'test-meaning-ustedes':['you all'],'test-meaning-ellas':['they, all female'],
    'test-formal-person':['usted'],'test-spain-mixed':['vosotros'],'test-spain-girls':['vosotras'],'test-spain-ser':['sois'],
    'test-you-and-ana':['ustedes'],'test-you-and-me':['nosotros'],'test-teacher-group':['ellos'],'test-female-self':['nosotras'],
    'test-origin-we':['somos'],'test-origin-plural':['son'],'test-owner-singular':['es'],'test-owner-plural':['son'],
    'test-adjective-pair':['Lucía y Ana son organizadas.'],'test-responsables':['responsables'],'test-exigentes':['exigentes'],'test-faciles':['fáciles'],
    'test-connected-blanks':['son','es','trabajadoras'],
  };
  for(const [id,key] of Object.entries(expected))assert.deepEqual(answers(id),key,id);
  for(const id of ['test-spain-mixed','test-spain-girls']){
    assert.match(byId(id).context,/Spain/);assert.match(byId(id).context,/informally/);
  }
  assert.match(byId('test-owner-singular').context,/One textbook/);
  assert.match(byId('test-owner-plural').context,/Several markers/);
  assert.ok(testQuestions.filter(q=>q.reading).length>=6);
  assert.ok(testQuestions.filter(q=>q.steps.some(step=>step.options.length===2)).length>=6);
});

test('assigned vocabulary remains available across the calm curriculum',()=>{
  const content=JSON.stringify({studyLessons,storyQuestions,studyGuideQuestions,testQuestions,studyHelp});
  const vocabulary=[
    'borrador','calculadora','cinta','cuaderno','estuche','goma','lápiz','lápices de colores','libro','marcador','mochila','papel','pluma','bolígrafo','regla','tijeras',
    'escritorio','mesa','papelera','pizarra','puerta','reloj','silla','ventana','clase','curso','examen','horario','prueba','semestre','tarea','almuerzo','materia','mapa',
    'arte','ciencias','computación','educación física','español','estudios sociales','inglés','lenguaje','matemáticas','música',
    'trabajador','perezoso','flojo','aburrido','divertido','organizado','desordenado','artístico','atlético','chistoso','fácil','difícil','exigente','estudioso','responsable','estricto','simpático',
  ];
  for(const word of vocabulary)assert.ok(content.includes(word),word);
  assert.match(byId('calm-test-prep-glue').context,/pegamento líquido/);
  assert.match(byId('calm-learn-classroom-tests').context,/prueba.*quiz corto.*examen.*test largo/);
  assert.ok(!content.match(/\.docx|\.pdf|private-references|ADHD|diagnosis/),'Private source material and health information do not appear in learning content');
});
