import assert from 'node:assert/strict';
import test from 'node:test';
import { completeQuestionIds, questions, references, schedule, skillLabels, stories } from '../spanish/unit3/content.ts';

const q = (id: string) => { const item = questions.find(item => item.id === id); assert.ok(item, id); return item; };
const answer = (id: string) => { const item = q(id); return item.answer.map(key => item.choices.find(c => c.id === key)!.label); };

test('Unit 3 question keys resolve uniquely and every task has useful feedback and a reference', () => {
  assert.equal(new Set(questions.map(item => item.id)).size, questions.length);
  assert.equal(new Set(stories.map(item => item.id)).size, stories.length);
  assert.equal(new Set(references.map(item => item.skill)).size, references.length);
  for (const item of questions) {
    assert.ok(skillLabels[item.skill] && references.some(r => r.skill === item.skill), item.id);
    assert.ok(item.prompt.trim() && item.hint.trim() && item.explanation.trim() && item.parallelGroup.trim(), item.id);
    assert.equal(new Set(item.choices.map(c => c.id)).size, item.choices.length, item.id);
    assert.equal(new Set(item.choices.map(c => c.label)).size, item.choices.length, item.id);
    assert.ok(item.answer.length && item.answer.every(key => item.choices.some(c => c.id === key)), item.id);
    assert.equal(new Set(item.answer).size, item.answer.length, item.id);
    if (item.format === 'choice') { assert.equal(item.answer.length, 1, item.id); assert.ok(item.choices.length >= 3 && item.choices.length <= 4, item.id); }
    if (item.storyId) assert.ok(stories.some(story => story.id === item.storyId), item.id);
  }
});

test('five brief contextual stories form one consistent Tuesday and each has six tasks plus two fresh checks', () => {
  assert.deepEqual(stories.map(s => s.id), ['arrival', 'calendar', 'schedule', 'map', 'departure']);
  const allIds: string[] = [];
  for (const story of stories) {
    assert.ok(story.paragraph.split(/\s+/).length <= 65, story.id);
    assert.ok(story.english && story.visual, story.id);
    assert.equal(story.questionIds.length, 6, story.id);
    assert.equal(story.checkpointIds.length, 2, story.id);
    for (const id of [...story.questionIds, ...story.checkpointIds]) { assert.equal(q(id).storyId, story.id, id); assert.equal(q(id).test, false, id); allIds.push(id); }
  }
  assert.equal(new Set(allIds).size, 40);
  assert.match(stories[0].paragraph, /martes/);
  assert.match(stories[1].paragraph, /martes, el veinte de octubre/);
  assert.match(stories[3].paragraph, /Antes del segundo período/);
  assert.ok(!stories[3].paragraph.includes('Después del almuerzo'));
  assert.equal(new Date('2026-10-20T12:00:00Z').getUTCDay(), 2, 'The illustrated October 20, 2026 is Tuesday.');
});

test('every pronoun maps to the correct ESTAR form, including formal singular and Spain forms', () => {
  const expected = [['yo', 'estoy'], ['tú', 'estás'], ['él', 'está'], ['ella', 'está'], ['usted', 'está'], ['nosotros', 'estamos'], ['nosotras', 'estamos'], ['vosotros', 'estáis'], ['vosotras', 'estáis'], ['ustedes', 'están'], ['ellos', 'están'], ['ellas', 'están']];
  expected.forEach(([who, form], index) => {
    for (const id of [`estar-pronoun-${index}`, `estar-fresh-${index}`]) { assert.ok(q(id).prompt.startsWith(who), id); assert.deepEqual(answer(id), [form], id); }
    assert.ok(references.find(r => r.skill === 'estar')!.entries.some(e => e.spanish === `${who} ${form}`));
  });
  assert.deepEqual(answer('estar-context-us'), ['estamos']);
  assert.deepEqual(answer('estar-context-you'), ['está']);
  assert.deepEqual(answer('estar-feelings-you'), ['estás']);
  assert.deepEqual(answer('ser-estar-0'), ['es']);
  assert.deepEqual(answer('ser-estar-1'), ['está']);
  assert.deepEqual(answer('ser-estar-2'), ['está']);
  assert.deepEqual(answer('ser-estar-3'), ['es']);
  assert.equal(q('ser-estar-2').parallelGroup, 'ser-estar-location');
  assert.equal(q('ser-estar-3').parallelGroup, 'ser-estar-identity');
  assert.equal(q('estar-feelings-you').parallelGroup, q('estar-fresh-1').parallelGroup);
});

test('all assigned prepositions have two contextual examples and synonyms are not marked as competing wrong keys', () => {
  const expected = ['adentro de', 'afuera de', 'al lado de', 'a la derecha de', 'a la izquierda de', 'cerca de', 'con', 'debajo de', 'delante de', 'detrás de', 'en', 'encima de', 'entre', 'lejos de', 'sin', 'sobre'];
  for (const word of expected) {
    const items = questions.filter(item => item.parallelGroup === `prep-${word}` && !item.storyId);
    assert.equal(items.length, 2, word);
    assert.equal(new Set(items.map(item => item.context)).size, 2, word);
    assert.ok(items.every(item => item.context?.includes(word)), word);
  }
  for (const item of questions) {
    const labels = item.choices.map(c => c.label.toLowerCase());
    assert.ok(!(labels.includes('sobre') && labels.includes('encima de')), item.id);
    assert.ok(!(labels.includes('empieza') && labels.includes('comienza')), item.id);
    assert.ok(!(labels.includes('el primero de diciembre') && labels.includes('el uno de diciembre')), item.id);
  }
  assert.match(references.find(r => r.skill === 'prepositions')!.entries.at(-2)!.english, /Both can mean/);
  assert.deepEqual(answer('map-science'), ['a la derecha']);
  assert.deepEqual(answer('map-between'), ['entre']);
  assert.deepEqual(answer('map-check-left'), ['A la izquierda de la clase de ciencias.']);
});

test('all 14 supplied places or break terms have context and both translation directions', () => {
  const expected = ['la clase', 'el baño', 'la oficina', 'la oficina del director', 'el gimnasio', 'la cafetería', 'el recreo / el receso', 'la biblioteca', 'el pasillo', 'los casilleros', 'el campo', 'la cancha', 'la parada de autobús', 'la casa'];
  for (const [index, word] of expected.entries()) {
    assert.ok(q(`place-${index}`).prompt.includes(word));
    assert.deepEqual(answer(`place-fresh-${index}`), [word]);
    assert.ok(q(`place-${index}`).context);
  }
  assert.match(answer('place-6')[0], /recess \/ break time/);
  assert.match(q('place-6').context!, /no es el nombre de un edificio/);
});

test('days and months cover complete sequences including week wrap and all twelve spellings', () => {
  const days = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  days.forEach((word, index) => { assert.ok(q(`day-${index}`).prompt.includes(word)); assert.deepEqual(answer(`day-fresh-${index}`), [days[(index + 1) % 7]]); });
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  months.forEach((word, index) => { assert.ok(q(`month-${index}`).prompt.includes(word)); assert.deepEqual(answer(`month-fresh-${index}`), [word]); });
  assert.deepEqual(answer('calendar-yesterday'), ['lunes']);
  assert.deepEqual(answer('calendar-tomorrow'), ['miércoles']);
  assert.deepEqual(answer('calendar-repeat'), ['On Tuesdays.']);
});

test('numbers include exactly the requested 1–33 and tens through 100 with independent key spot checks', () => {
  const required = [...Array.from({ length: 33 }, (_, index) => index + 1), 40, 50, 60, 70, 80, 90, 100];
  for (const number of required) {
    assert.deepEqual(answer(`number-${number}`), [String(number)]);
    assert.ok(q(`number-fresh-${number}`).prompt.includes(String(number)));
  }
  const spelling = { 16: 'dieciséis', 21: 'veintiuno', 22: 'veintidós', 23: 'veintitrés', 26: 'veintiséis', 31: 'treinta y uno', 33: 'treinta y tres', 40: 'cuarenta', 60: 'sesenta', 70: 'setenta', 100: 'cien' };
  for (const [number, word] of Object.entries(spelling)) assert.deepEqual(answer(`number-fresh-${number}`), [word]);
  assert.equal(questions.filter(item => /^number-\d+$/.test(item.id)).length, 40);
});

test('ordinals through ninth agree with period and class and first/third use the shortened masculine form', () => {
  const expected = ['primer', 'segundo', 'tercer', 'cuarto', 'quinto', 'sexto', 'séptimo', 'octavo', 'noveno'];
  expected.forEach((word, index) => assert.deepEqual(answer(`ordinal-${index + 1}`), [word]));
  assert.deepEqual(answer('ordinal-fresh-1'), ['la primera clase']);
  assert.deepEqual(answer('ordinal-fresh-3'), ['la tercera clase']);
  assert.deepEqual(answer('ordinal-fresh-9'), ['la novena clase']);
});

test('date builder and two story banks form grammatical full passages with every word used exactly once', () => {
  assert.equal(answer('calendar-build-date').join(' '), 'Hoy es el veinte de octubre.');
  assert.equal(answer('review-build-date').join(' '), 'Hoy es el catorce de noviembre.');
  assert.deepEqual(completeQuestionIds, ['complete-location', 'complete-schedule']);
  for (const id of completeQuestionIds) {
    const item = q(id);
    assert.equal(item.format, 'bank'); assert.equal(item.answer.length, 5); assert.equal(item.choices.length, 5);
    assert.equal(item.segments!.length, item.answer.length + 1);
    assert.deepEqual(new Set(item.answer), new Set(item.choices.map(c => c.id)));
  }
  const render = (id: string) => q(id).segments!.map((segment, index) => segment + (answer(id)[index] ?? '')).join('');
  assert.match(render('complete-location'), /Yusuf está en la escuela.*biblioteca para buscar un libro.*al lado de los casilleros.*gimnasio para jugar al baloncesto.*Ana y Mateo están en el pasillo/);
  assert.match(render('complete-schedule'), /martes, el veinte de octubre.*nueve de la mañana.*español en el noveno período.*termina.*parada de autobús\.$/);
});

test('model timetable preserves supplied course order, stays inside 9–3:45 and labels missing periods as sample breaks', () => {
  const expected = new Map([[1, 'COMPASS'], [2, 'ciencias'], [3, 'matemáticas'], [4, 'banda'], [5, 'estudios sociales'], [8, 'artes del lenguaje'], [9, 'español']]);
  for (const [period, subject] of expected) assert.equal(schedule.find(row => row.period === period)!.subject, subject);
  const minutes = (value: string) => { const [hour, minute] = value.split(':').map(Number); return hour * 60 + minute; };
  assert.equal(schedule[0].start, '09:00'); assert.equal(schedule.at(-1)!.end, '15:45');
  schedule.forEach((row, index) => {
    assert.match(row.start, /^\d\d:\d\d$/); assert.match(row.end, /^\d\d:\d\d$/);
    assert.ok(minutes(row.end) > minutes(row.start));
    if (index) assert.ok(minutes(row.start) >= minutes(schedule[index - 1].end));
    if (row.period === 6 || row.period === 7) assert.match(row.subject, /pausa de ejemplo/);
  });
  assert.match(references.find(r => r.skill === 'schedule')!.entries.at(-1)!.english, /no actual courses/);
});

test('time keys distinguish singular one, quarter/half, noon/midnight and day parts without synonym traps', () => {
  assert.deepEqual(answer('time-one'), ['Es la una.']);
  assert.deepEqual(answer('time-quarter'), ['Son las nueve y cuarto de la mañana.']);
  assert.deepEqual(answer('time-half'), ['Son las diez y media de la mañana.']);
  assert.deepEqual(answer('time-noon'), ['mediodía']);
  assert.deepEqual(answer('time-midnight'), ['medianoche']);
  assert.deepEqual(answer('time-night'), ['a las ocho de la noche']);
  assert.deepEqual(answer('time-morning'), ['de la mañana']);
  assert.deepEqual(answer('test-clock-time'), ['Son las dos y media.']);
  assert.deepEqual(q('test-clock-time').visual, { kind: 'clock', hour: 14, minute: 30 });
  assert.deepEqual(answer('start-from'), ['desde']); assert.deepEqual(answer('start-until'), ['hasta']);
  assert.match(references.find(r => r.skill === 'time')!.entries[3].english, /menos cuarto/);
  for (const concept of ['one', 'quarter', 'half', 'afternoon', 'noon', 'midnight', 'night', 'morning']) {
    assert.notEqual(q(`time-${concept}`).prompt, q(`time-fresh-${concept}`).prompt, `Fresh ${concept} requires a new prompt.`);
    assert.notDeepEqual(answer(`time-${concept}`), answer(`time-fresh-${concept}`), `Fresh ${concept} requires new recall, not the same response.`);
  }
  assert.equal(q('arrival-estar').parallelGroup, q('estar-pronoun-2').parallelGroup);
  assert.equal(q('map-between').parallelGroup, q('test-map-location').parallelGroup);
  assert.match(q('time-fresh-one-pm').prompt, /^Before lunch/);
});

test('mixed test pool supports 32 balanced fresh choices, one reading passage and map/calendar/clock selection', () => {
  const quotas = { estar: 4, 'ser-estar': 1, prepositions: 4, places: 3, days: 3, months: 2, numbers: 2, ordinals: 2, dates: 2, time: 4, schedule: 3, 'start-end': 2 };
  assert.equal(Object.values(quotas).reduce((sum, value) => sum + value, 0), 32);
  const pool = questions.filter(item => item.test);
  for (const [skill, minimum] of Object.entries(quotas)) assert.ok(pool.filter(item => item.skill === skill && !item.visual).length >= minimum, skill);
  assert.ok(pool.every(item => item.format === 'choice' && !item.storyId));
  assert.equal(pool.filter(item => item.parallelGroup === 'reading-school-day').length, 1);
  assert.ok(q('test-reading-school-day').context!.split(/\s+/).length < 55);
  assert.deepEqual(new Set(pool.filter(item => item.visual).map(item => item.visual!.kind)), new Set(['map', 'calendar', 'clock']));
  for (const skill of Object.keys(skillLabels)) assert.ok(questions.filter(item => !item.test && item.skill === skill).length >= 2, `Fresh review for ${skill}`);
});

test('new public curriculum omits private staff names, learner diagnosis, grades and source-document paths', () => {
  const text = JSON.stringify({ questions, stories, references, schedule });
  assert.doesNotMatch(text, /Runzo|Kaiser|Bacchus|Stallings|Wilson|McDonald|Abarca|ADHD|diagnos|\.codex\/attachments|Pasted text\.txt/i);
});
