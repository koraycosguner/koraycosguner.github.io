import assert from 'node:assert/strict';
import test from 'node:test';
import {lessonPractice,prepSkillLabels,proficiencyQuestions,proficiencyReview,type PrepQuestion,type PrepSkill} from '../spanish/proficiency-content.ts';

const practice=Object.values(lessonPractice).flat();
const all=[...proficiencyQuestions,...proficiencyReview,...practice];
const byId=(id:string):PrepQuestion=>{const found=all.find(q=>q.id===id);assert.ok(found,`Missing ${id}`);return found;};
const key=(id:string)=>byId(id).steps.map(s=>s.answer);

test('full proficiency bank is substantial, uses three choices predominantly and has valid deterministic keys',()=>{
  assert.ok(proficiencyQuestions.length>=60);
  assert.equal(new Set(all.map(q=>q.id)).size,all.length,'IDs stay unique across test, review and lessons');
  const steps=all.flatMap(q=>q.steps);
  for(const q of all){
    assert.ok(q.context.trim()&&q.help.trim()&&q.source.trim(),q.id);
    assert.ok(q.steps.length>=1&&q.steps.length<=2,q.id);
    for(const s of q.steps){
      assert.ok(s.options.length===2||s.options.length===3,q.id);
      assert.equal(new Set(s.options).size,s.options.length,q.id);
      assert.equal(s.options.filter(option=>option===s.answer).length,1,q.id);
      assert.ok(s.prompt.trim()&&s.hint.trim()&&s.explanation.trim(),q.id);
      assert.ok(s.skill in prepSkillLabels,q.id);
      if(s.options.length===2) assert.deepEqual([...s.options].sort(),['Cierto','Falso'],q.id);
    }
  }
  assert.ok(steps.filter(s=>s.options.length===3).length/steps.length>.8,'Three choices predominate');
  const positions=[0,0,0];
  for(const s of proficiencyQuestions.flatMap(q=>q.steps).filter(s=>s.options.length===3)) positions[s.options.indexOf(s.answer)]++;
  assert.ok(positions.every(count=>count>=15),'Correct choices are distributed, not always the first option');
  assert.ok(proficiencyQuestions.filter(q=>q.steps[0].options.length===2).length>=6);
});

test('all six worlds, ten teaching modules and every independently tracked skill are covered',()=>{
  assert.deepEqual([...new Set(proficiencyQuestions.map(q=>q.world))].sort(),['arrival','backpack','band','classroom','friends','schedule']);
  assert.deepEqual(Object.keys(lessonPractice).sort(),['articles','backpack','classroom','descriptions','doctor','hay','perspective','pronouns','ser','subjects']);
  for(const [id,items] of Object.entries(lessonPractice)) assert.ok(items.length>=2&&items.length<=3,id);
  const expected=Object.keys(prepSkillLabels).sort();
  assert.equal(expected.length,22);
  for(const bank of [proficiencyQuestions,proficiencyReview]) assert.deepEqual([...new Set(bank.flatMap(q=>q.steps.map(s=>s.skill)))].sort(),expected);
  for(const skill of expected) assert.ok(proficiencyReview.filter(q=>q.steps.some(s=>s.skill===skill)).length>=2,`${skill} needs two fresh independent review examples`);
  const prompts=all.flatMap(q=>q.steps.map(s=>s.prompt));
  assert.equal(new Set(prompts).size,prompts.length,'Targeted review and guided practice use fresh prompts');
});

test('WHO → pronoun → SER keys follow perspective and maintain the speaker in visual metadata',()=>{
  const pairs:Record<string,string[]>={
    'prep-pair-in':['nosotros','somos'],'prep-pair-to':['ustedes','son'],'prep-pair-about':['ellos','son'],
    'prep-pair-ellas':['ellas','son'],'prep-pair-nosotras':['nosotras','somos'],'prep-finale-pair':['nosotros','somos'],
  };
  assert.ok(proficiencyQuestions.filter(q=>q.steps.length===2).length>=4);
  for(const [id,answers] of Object.entries(pairs)) assert.deepEqual(key(id),answers,id);
  for(const q of all.filter(q=>q.people)){
    const person=q.people!;
    if(person.perspective==='in') assert.ok(person.about?.includes(person.speaker),q.id);
    if(person.perspective==='to') assert.ok(person.listener?.length,q.id);
    if(person.perspective==='about'){
      assert.ok(person.about?.length,q.id);
      assert.ok(!person.about?.includes(person.speaker),q.id);
    }
  }
  for(const [id,answer] of [
    ['prep-arrival-yo','yo'],['prep-arrival-tu','tú'],['prep-arrival-el','él'],['prep-arrival-ella','ella'],
    ['prep-arrival-usted','es'],['prep-arrival-soy','soy'],['prep-arrival-eres','eres'],['prep-arrival-es','es'],
  ]) assert.deepEqual(key(id),[answer],id);
});

test('connected novice readings support several skills without copying the same question',()=>{
  const passages=new Map<string,PrepQuestion[]>();
  for(const q of proficiencyQuestions.filter(q=>q.reading)) passages.set(q.reading!,[...(passages.get(q.reading!)??[]),q]);
  assert.ok(passages.size>=3);
  assert.ok(proficiencyQuestions.filter(q=>q.reading).length>=6);
  assert.ok([...passages.values()].filter(items=>items.length>=2).length>=3);
  for(const [id,answer] of [
    ['prep-reading-referent','Mateo y Ana'],['prep-reading-ser','son'],['prep-reading-description','organizado'],
    ['prep-reading-hay-false','Falso'],['prep-reading-music','la música'],['prep-reading-easy','fácil'],
    ['prep-finale-referent','Yusuf y Mateo'],['prep-finale-address','Yusuf y Mateo, sus oyentes'],['prep-finale-count','Hay tres sillas.'],
  ]) assert.deepEqual(key(id),[answer],id);
});

test('assigned backpack, classroom, subjects and adjective vocabulary is represented in the content',()=>{
  const terms=new Set(all.flatMap(q=>q.terms??[]));
  const assigned=[
    'el borrador','la calculadora','la cinta','el cuaderno','el estuche','la goma','el lápiz','los lápices de colores','el libro',
    'el marcador','la mochila','el papel','la pluma / el bolígrafo','la regla','las tijeras',
    'el escritorio','la mesa','la papelera','la pizarra','la puerta','el reloj','la silla','la ventana',
    'la clase','el curso','el examen','el horario','la prueba','el semestre','la tarea','el almuerzo',
    'el arte','las ciencias','la computación','la educación física','el español','los estudios sociales','el inglés','el lenguaje','las matemáticas','la música',
    'trabajador','perezoso','flojo','aburrido','divertido','organizado','desordenado','artístico','atlético','chistoso','fácil','difícil','exigente','estudioso','responsable','estricto','simpático',
  ];
  for(const term of assigned) assert.ok(terms.has(term),`Missing assigned term: ${term}`);
});

test('object functions, article agreement, HAY inventories and likes have unambiguous answer keys',()=>{
  for(const [id,answer] of [
    ['prep-pencil','un lápiz'],['prep-eraser','el borrador'],['prep-glue','la goma'],['prep-pen','un bolígrafo'],['prep-ruler','la regla'],['prep-scissors','las tijeras'],
    ['prep-el-article','el'],['prep-la-article','la'],['prep-unos-article','unos'],['prep-unas-article','unas'],['prep-pencil-plural','unos lápices'],['prep-chico-plural','los chicos'],
    ['prep-inventory-present','Sí, hay dos libros.'],['prep-inventory-absent','No, no hay tijeras.'],['prep-hay-false','Falso'],
    ['prep-like-singular','gusta'],['prep-like-plural','gustan'],['prep-dislike','no me'],['prep-fun-classes','divertidas'],
  ]) assert.deepEqual(key(id),[answer],id);
  assert.equal(byId('prep-inventory-present').inventory?.find(i=>i.id==='libro')?.count,2);
  assert.equal(byId('prep-inventory-absent').inventory?.find(i=>i.id==='tijeras')?.count,0);
  assert.match(byId('prep-glue').steps[0].explanation,/glue on this class list/i);
  assert.match(byId('prep-glue').help,/liquid glue/i);
  assert.ok(!byId('prep-glue').help.includes('goma'),'English context must not reveal the Spanish answer');
  assert.ok(!byId('prep-language').help.includes('lenguaje'),'English context must not reveal the Spanish answer');
  assert.match(byId('prep-eraser').help,/pencil/i);
  assert.match(byId('prep-pen').context,/tinta/);
  for(const q of all) for(const i of q.inventory??[]) assert.ok(Number.isInteger(i.count)&&i.count>=0,q.id);
});

test('SER uses avoid overlapping categories as competing keys and do not infer learner origin',()=>{
  for(const [id,answer] of [
    ['prep-occupation','Ocupación'],['prep-relationship','Relaciones'],['prep-time','Tiempo'],['prep-material','el material de la mesa'],['review-ser-uses','Origen'],
  ]) assert.deepEqual(key(id),[answer],id);
  for(const q of all){
    for(const s of q.steps.filter(s=>s.skill==='ser-uses')) assert.ok(!(s.options.includes('Descripción')&&s.options.includes('Características')),q.id);
    if(q.steps.some(s=>s.skill==='origin')) assert.ok(!q.context.includes('Yusuf es de'),q.id);
  }
  assert.ok(!JSON.stringify(all).includes('Para estudiar necesito un bolígrafo'),'Ambiguous old exercise is excluded');
  assert.ok(!JSON.stringify(all).match(/fifteen desks|private-references|\.docx|\.pdf|ADHD|diagnosis|nationality/i),'No private source metadata or learner inferences');
  const knownSkills=new Set<PrepSkill>(Object.keys(prepSkillLabels) as PrepSkill[]);
  assert.equal(knownSkills.size,22);
});
