import assert from 'node:assert/strict';
import test from 'node:test';
import {tutorLessons,tutorQuestions,tutorSkills,tutorWords} from '../spanish/tutor-content.ts';
import {vocabulary as assignedVocabulary} from '../spanish/content.ts';

const question=(id:string)=>{const q=tutorQuestions.find(q=>q.id===id);assert.ok(q,`Missing ${id}`);return q;};
const answers=(id:string)=>{const q=question(id);return q.answer.map(id=>q.choices.find(c=>c.id===id)!.label);};

test('every item has stable keys, supported skills, a teaching path, and usable correction',()=>{
 for(const collection of [tutorSkills,tutorLessons,tutorWords,tutorQuestions]) assert.equal(new Set(collection.map(x=>x.id)).size,collection.length);
 const skills=new Set(tutorSkills.map(s=>s.id)),lessons=new Set(tutorLessons.map(l=>l.id));
 for(const skill of tutorSkills) assert.ok(lessons.has(skill.lessonId),skill.id);
 for(const q of tutorQuestions){
  assert.ok(lessons.has(q.lessonId),q.id);
  assert.ok(q.skills.length&&q.skills.every(s=>skills.has(s)),q.id);
  assert.ok(q.prompt.trim()&&q.model.trim()&&q.explanation.trim()&&q.parallelGroup,q.id);
  assert.ok(q.hints.length>=2&&q.hints.every(h=>h.trim()),q.id);
  assert.equal(new Set(q.choices.map(c=>c.id)).size,q.choices.length,q.id);
  assert.equal(new Set(q.choices.map(c=>c.label)).size,q.choices.length,q.id);
  assert.ok(q.choices.length>=3&&q.choices.length<=4,q.id);
  assert.ok(q.answer.length&&q.answer.every(id=>q.choices.some(c=>c.id===id)),q.id);
  assert.equal(new Set(q.answer).size,q.answer.length,q.id);
  if(q.format!=='sentence-build')assert.equal(q.answer.length,1,q.id);
  if(q.format.startsWith('listen-'))assert.ok(q.audio?.trim(),q.id);
  if(q.teacher)assert.ok(['choice','word-bank','sentence-build'].includes(q.format),q.id);
 }
});

test('all twelve pronouns have multiple fresh reasoning examples with correct subject-person keys',()=>{
 const expected:Record<string,string>={yo:'yo',tu:'tú',el:'él',ella:'ella',usted:'usted',nosotros:'nosotros',nosotras:'nosotras',vosotros:'vosotros',vosotras:'vosotras',ellos:'ellos',ellas:'ellas',ustedes:'ustedes'};
 for(const [id,label] of Object.entries(expected)){
  const qs=tutorQuestions.filter(q=>q.parallelGroup===`pronoun:${id}`);
  assert.ok(qs.length>=6,id);
  assert.equal(new Set(qs.map(q=>q.context)).size,qs.length,id);
  for(const q of qs) assert.deepEqual(answers(q.id),[label],q.id);
 }
 assert.match(question('pronoun-nosotras-1').context!,/Ana.*Mercedes y yo.*chicas/);
 assert.match(question('pronoun-nosotros-2').context!,/Ustedes y yo/);
 assert.match(question('pronoun-usted-1').context!,/directamente.*Joaquín.*formal/);
 assert.match(question('pronoun-el-1').context!,/sobre Vicente/);
 assert.match(question('pronoun-ella-1').context!,/sobre la señora Williams/);
 assert.match(question('pronoun-ellos-1').context!,/profesora.*chicos y chicas/);
 for(const q of tutorQuestions.filter(q=>q.parallelGroup==='pronoun:vosotros'||q.parallelGroup==='pronoun:vosotras'))assert.match(q.context!,/España.*informal/,q.id);
});

test('SER conjugation keys match every validated subject; corrections contrast the specific confusion',()=>{
 const expected:Record<string,string[]>={soy:['Yo'],eres:['Tú','¿De dónde'],es:['Fernando','La señora Williams','Usted','Teresa','Rocío','Ana','El maestro López'],somos:['Marcos y yo','Mariela y yo','Nosotras','Mi amigo y yo','Nosotros','Lucía y yo','Luis y yo'],sois:['Vosotros','Vosotras'],son:['María y Mariela','Marcos y usted','Roberto y tú','La profesora y los estudiantes','Ellas','Los estudiantes','Ustedes']};
 for(const [form,subjects] of Object.entries(expected)){
  const qs=tutorQuestions.filter(q=>q.id.startsWith(`ser-${form}-`));
  assert.ok(qs.length>=6,form);
  for(const q of qs){assert.deepEqual(answers(q.id),[form]);assert.ok(subjects.some(s=>q.prompt.startsWith(s)),q.id);assert.equal(q.chain!.at(-2),form,q.id);}
 }
 assert.match(question('ser-somos-1').explanation,/yo.*nosotros.*somos/i);
 assert.deepEqual(question('ser-somos-1').contrast,[{label:'Speaker included',spanish:'Nosotros somos.'},{label:'Speaker not included',spanish:'Ellos son.'}]);
 assert.deepEqual(answers('ser-es-4'),['es']); assert.match(question('ser-es-4').model,/Teresa es de Perú/);
 assert.deepEqual(answers('ser-es-5'),['es']); assert.match(question('ser-es-5').model,/Rocío es de México/);
});

test('origin and ownership answer keys follow the subject, not the country or owner',()=>{
 const origin=['es de','es de','somos de','son de','son de','somos de'];
 origin.forEach((answer,i)=>assert.deepEqual(answers(`origin-${i+1}`),[answer]));
 const ownership=['es de','son de','son de','son de','es de','son de'];
 ownership.forEach((answer,i)=>assert.deepEqual(answers(`possession-${i+1}`),[answer]));
 assert.equal(question('possession-1').model,'El libro es de Julia.');
 assert.equal(question('possession-3').model,'Los lápices son de Julia.');
 assert.equal(question('possession-4').model,'Los mapas son de la clase.');
 assert.ok(!tutorQuestions.filter(q=>q.skills.includes('origin')).some(q=>q.model.includes('Yusuf es de')),'No inferred learner origin');
});

test('adjective agreement covers gender, number, mixed groups, invariant gender forms and written accents',()=>{
 const gender=['trabajador','trabajadora','estricta','perezoso','organizada','estricto'];
 gender.forEach((word,i)=>assert.deepEqual(answers(`adjective-gender-${i+1}`),[word]));
 const number=['trabajadoras','exigentes','responsables','fáciles','organizadas','organizados','difíciles'];
 number.forEach((word,i)=>assert.deepEqual(answers(`adjective-number-${i+1}`),[word]));
 assert.match(question('adjective-number-2').explanation,/Gender does not change/);
 assert.match(question('adjective-number-6').explanation,/mixed/);
 assert.match(tutorLessons.find(l=>l.id==='adjectives')!.frames[3].body,/same gender form/);
});

test('all eight articles, pencil spelling and invariant HAY are keyed consistently',()=>{
 for(const article of ['el','la','los','las','un','una','unos','unas'])assert.deepEqual(answers(`art-${article}`),[article]);
 assert.deepEqual(answers('plural-1'),['los lápices']);
 assert.deepEqual(answers('plural-2'),['unos libros']);
 assert.deepEqual(answers('plural-3'),['las mochilas']);
 assert.deepEqual(answers('plural-4'),['unas clases']);
 assert.deepEqual(answers('hay-1'),['Sí, hay.']); assert.deepEqual(answers('hay-2'),['No, no hay.']);
 assert.deepEqual(answers('hay-3'),['Hay']); assert.deepEqual(answers('hay-4'),['Hay']);
 assert.match(question('hay-1').context!,/dos libros/); assert.match(question('hay-2').context!,/No hay tijeras/);
});

test('all existing vocabulary survives and priority words have seven meaningful activity representations',()=>{
 for(const [id,word] of assignedVocabulary){const current=tutorWords.find(w=>w.id===id);assert.ok(current,id);assert.equal(current.word,word,id);}
 for(const id of ['libro','computadora','materia','curso','horario','prueba','examen','almuerzo']){
  const qs=tutorQuestions.filter(q=>q.vocabulary?.includes(id));
  for(const format of ['picture-word','word-picture','listen-word','listen-picture','word-bank','listen-sentence','listen-fill'])assert.ok(qs.some(q=>q.format===format),`${id} ${format}`);
  assert.ok(qs.some(q=>q.teacher),id);
  assert.ok(tutorSkills.some(s=>s.id===`word:${id}`),id);
  assert.ok(tutorLessons.flatMap(l=>l.frames).some(f=>f.visual===id&&f.audio),id);
 }
 for(const w of tutorWords){assert.ok(w.visual&&w.sentence&&w.scene,w.id);assert.ok(tutorQuestions.filter(q=>q.vocabulary?.includes(w.id)).length>=4,w.id);}
 assert.equal(tutorWords.length,66);
});

test('ambiguous classroom vocabulary is contextualized and synonyms never become competing picture keys',()=>{
 for(const pair of [['prueba','examen'],['materia','curso']]){
  for(const id of pair){
   const w=tutorWords.find(w=>w.id===id)!;assert.ok(w.confusedWith?.includes(pair.find(v=>v!==id)!));
   for(const q of tutorQuestions.filter(q=>q.vocabulary?.includes(id)&&!['listen-word','listen-fill'].includes(q.format)))assert.ok(!q.choices.some(c=>c.label===pair.find(v=>v!==id)),q.id);
   assert.match(tutorLessons.flatMap(l=>l.frames).find(f=>f.visual===id)!.body,/overlap/);
  }
 }
 assert.match(tutorWords.find(w=>w.id==='goma')!.english,/on this class list/);
 assert.match(question('word-goma-picture').explanation,/glue/);
 assert.match(tutorWords.find(w=>w.id==='carpeta')!.english,/enrichment/);
 for(const q of tutorQuestions.filter(q=>q.vocabulary?.includes('flojo')||q.vocabulary?.includes('perezoso'))){
  const labels=q.choices.map(c=>c.label);assert.ok(!(labels.includes('flojo')&&labels.includes('perezoso')));
 }
});

test('listening spans all five required formats and uses short natural Spanish audio',()=>{
 for(const format of ['listen-picture','listen-word','listen-sentence','listen-fill','listen-contrast'])assert.ok(tutorQuestions.some(q=>q.format===format));
 for(const q of tutorQuestions.filter(q=>q.format.startsWith('listen-'))){
  assert.ok(q.audio&&q.audio.length<180,q.id);
  assert.ok(!q.prompt.includes(q.audio),`Prompt must not print audio transcript: ${q.id}`);
  assert.ok(q.skills.includes(q.format==='listen-picture'||q.format==='listen-word'?'listening:word':'listening:sentence'),q.id);
 }
 assert.equal(question('word-computadora-listen-sentence').audio,'Uso una computadora para hacer la tarea.');
 assert.equal(question('word-almuerzo-listen-sentence').audio,'Tengo el almuerzo a las doce.');
 assert.deepEqual(answers('listen-contrast-one'),['Ella es estudiante.']);
 assert.deepEqual(answers('listen-contrast-we'),['Nosotros somos estudiantes.']);
 for(const frame of tutorLessons.flatMap(l=>l.frames))assert.equal(frame.audio,frame.spanish);
});

test('teacher pool supports a balanced 18-question test without English translation clues',()=>{
 const bySkill=new Map(tutorSkills.map(s=>[s.id,s]));
 const pool=tutorQuestions.filter(q=>q.teacher);
 for(const [group,min] of [['Pronouns',4],['SER',4],['SER + de',3],['Adjectives',3],['Vocabulary',4]] as const){
  assert.ok(pool.filter(q=>q.skills.some(s=>bySkill.get(s)?.group===group)).length>=min,group);
 }
 for(const q of pool){
  assert.ok(!q.audio,q.id);
  assert.ok(!/→|\b(?:WHO|PRONOUN|FORM)\b|ustedes para el plural/i.test(q.context??''),`No intermediate reasoning cue in teacher context: ${q.id}`);
  assert.ok(!/\b(English|means|means that|which|choose|computer|lunch|schedule|quiz)\b/i.test(q.prompt),q.id);
 }
 assert.ok(tutorQuestions.filter(q=>q.format==='sentence-build').length>=6);
 for(const q of tutorQuestions.filter(q=>q.format==='sentence-build'))assert.equal(answers(q.id).join(' '),q.model,q.id);
});

test('contextual adjective illustrations do not make overlapping traits competing keys',()=>{
 const overlap=['trabajador','estudioso','responsable','organizado'];
 const social=['divertido','chistoso','simpático'];
 for(const q of tutorQuestions.filter(q=>q.vocabulary?.some(id=>tutorWords.find(w=>w.id===id)?.group==='Descriptions'))){
  const labels=q.choices.map(c=>c.label.replace(/^(el|la|los|las) /,'').split(' / ')[0]);
  for(const cluster of [overlap,social,['exigente','estricto']])assert.ok(labels.filter(label=>cluster.includes(label)).length<=1,q.id);
 }
});

test('ordered grammar builders keep the same subject through each decision and whole-sentence assembly',()=>{
 const specifications:[string,string[],string][]=[
  ['builder-ser',['nosotros','somos'],'Marcos y yo somos estudiantes.'],
  ['builder-adjectives',['femenino plural','organizadas'],'Ana y Sofía son organizadas.'],
  ['builder-de',['más de uno','son','de'],'Los libros son de Julia.'],
 ];
 for(const [lessonId,expected,model] of specifications){
  const lesson=tutorLessons.find(l=>l.id===lessonId)!;
  const sequence=tutorQuestions.filter(q=>q.lessonId===lessonId);
  assert.equal(sequence.length,expected.length+1,lessonId);
  assert.equal(lesson.frames.length,sequence.length,lessonId);
  expected.forEach((answer,i)=>assert.deepEqual(answers(sequence[i].id),[answer],sequence[i].id));
  assert.equal(sequence.at(-1)!.format,'sentence-build');
  assert.equal(answers(sequence.at(-1)!.id).join(' '),model);
  assert.ok(sequence.every(q=>!q.teacher),lessonId);
 }
 assert.ok(tutorQuestions.filter(q=>q.lessonId==='builder-de').every(q=>q.visual==='ownership:books-julia'));
});

test('the school-day mini-story supplies six connected scenes, speech and concrete school tasks',()=>{
 const sequence=tutorQuestions.filter(q=>q.lessonId==='school-day-story');
 const lesson=tutorLessons.find(l=>l.id==='school-day-story')!;
 assert.equal(sequence.length,6);assert.equal(lesson.frames.length,6);
 assert.deepEqual(sequence.map(q=>q.id),Array.from({length:6},(_,i)=>`school-day-${i+1}`));
 assert.deepEqual(sequence.map(q=>answers(q.id)[0]),['Hay','en la pizarra','computadora','horario','en el almuerzo','examen']);
 assert.ok(sequence.every(q=>q.context&&!q.teacher));
 assert.equal(sequence[4].format,'listen-sentence');assert.equal(sequence[4].audio,'Como pizza en el almuerzo.');
 assert.ok(lesson.frames.every(frame=>frame.visual&&frame.audio));
});

test('every tracked skill is taught and practiced with several independent examples',()=>{
 for(const s of tutorSkills){
  const lesson=tutorLessons.find(l=>l.id===s.lessonId)!;
  assert.ok(lesson.skills.includes(s.id)&&lesson.frames.length,s.id);
  const variants=tutorQuestions.filter(q=>q.skills.includes(s.id));
  assert.ok(variants.length>=3,`${s.id} needs at least three distinct evidence items`);
 }
 assert.ok(!JSON.stringify({tutorWords,tutorLessons,tutorQuestions}).match(/TODO|Lorem ipsum|IMAGE HERE|\.docx|\.pdf|ADHD|diagnosis|private-references/),'No unfinished assets or private source metadata');
});
