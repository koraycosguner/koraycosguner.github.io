import assert from 'node:assert/strict';
import test from 'node:test';
import { paragraphId, principles, questions, quizIds, scenes, skillLabels, sourceNotes, timelineId, typedPrompts, worksheetIds } from '../science/cells/content.ts';

const question = (id: string) => { const value = questions.find(item => item.id === id); assert.ok(value, `Missing ${id}`); return value; };
const answers = (id: string) => { const item = question(id); return item.answer.map(key => item.choices.find(choice => choice.id === key)!.label); };
const completedBank = (id: string) => { const item = question(id); return item.segments!.map((segment, index) => segment + (answers(id)[index] ?? '')).join(''); };

test('cell questions have resolvable unique keys, usable feedback and complete slots', () => {
  assert.equal(new Set(questions.map(item => item.id)).size, questions.length);
  for (const item of questions) {
    assert.ok(skillLabels[item.skill], item.id);
    assert.ok(item.prompt.trim() && item.explanation.trim() && item.hint.trim(), item.id);
    assert.equal(new Set(item.choices.map(choice => choice.id)).size, item.choices.length, item.id);
    assert.equal(new Set(item.choices.map(choice => choice.label)).size, item.choices.length, item.id);
    assert.ok(item.answer.length && item.answer.every(key => item.choices.some(choice => choice.id === key)), item.id);
    assert.equal(new Set(item.answer).size, item.answer.length, item.id);
    if (item.format === 'choice') {
      assert.equal(item.answer.length, 1, item.id);
      assert.ok(item.choices.length >= 3 && item.choices.length <= 4, item.id);
    } else {
      assert.equal(item.answer.length, item.choices.length, item.id);
      if (item.format === 'match') assert.equal(item.slots?.length, item.answer.length, item.id);
      if (item.format === 'bank') assert.equal(item.segments?.length, item.answer.length + 1, item.id);
    }
  }
});

test('five connected scenes preserve the assigned names, chronology and brief story length', () => {
  assert.deepEqual(scenes.map(scene => [scene.id, scene.name, scene.year]), [
    ['hooke', 'Robert Hooke', 1665], ['leeuwenhoek', 'Anton van Leeuwenhoek', 1673],
    ['schleiden', 'Matthias Schleiden', 1838], ['schwann', 'Theodor Schwann', 1839], ['virchow', 'Rudolf Virchow', 1858],
  ]);
  for (const scene of scenes) {
    assert.ok(scene.sentences.length >= 3 && scene.sentences.length <= 5, scene.id);
    assert.ok(scene.sentences.join(' ').split(/\s+/).length <= 95, scene.id);
    assert.ok(scene.discovery && scene.why && scene.bridge, scene.id);
  }
  assert.match(scenes[0].sentences.join(' '), /walls of dead plant cells/);
  assert.match(scenes[0].bridge, /living microscopic things/);
  assert.match(scenes[1].bridge, /larger living things.*made of cells/);
  assert.equal(scenes[2].bridge, 'What about animals? Are they made of cells too?');
  assert.match(scenes[3].bridge, /where do new cells come from/);
  assert.match(scenes[4].bridge, /made of cells.*basic unit.*existing cells/);
});

test('the lesson keeps supplied years without misdating every Leeuwenhoek observation or exclusive Virchow credit', () => {
  assert.match(scenes[1].sentences[0], /1673.*began sharing reports/);
  assert.match(scenes[1].sentences.join(' '), /years that followed/);
  assert.match(scenes[1].sentences.join(' '), /later observations also included bacteria/);
  assert.match(scenes[4].sentences.join(' '), /helped establish/);
  assert.match(scenes[4].sentences.join(' '), /1858 book/);
  const notes = JSON.stringify(sourceNotes);
  assert.match(notes, /1674/); assert.match(notes, /1676/); assert.match(notes, /1855/); assert.match(notes, /Remak/);
  assert.match(notes, /not available for direct comparison/);
  assert.match(notes, /No authenticated portrait/);
  assert.doesNotMatch(JSON.stringify(questions), /first.*bacteria.*1673|Virchow alone|invented the microscope/i);
});

test('the three principles correctly connect plant/animal evidence and existing cells', () => {
  assert.deepEqual(principles.map(item => item.statement), [
    'All living organisms are made of one or more cells.',
    'The cell is the basic unit of structure and function in living organisms.',
    'All cells come from pre-existing cells.',
  ]);
  assert.deepEqual(principles.map(item => item.scientists), [['schleiden', 'schwann'], ['schleiden', 'schwann'], ['virchow']]);
  assert.match(principles[1].explanation, /Structure:.*Function:/);
  assert.match(principles[2].explanation, /already there.*divide/);
  assert.ok(principles.every(item => !item.scientists.includes('hooke') && !item.scientists.includes('leeuwenhoek')));
});

test('the graded quiz has eighteen questions, all requested formats and all five skills', () => {
  assert.equal(quizIds.length, 18); assert.equal(new Set(quizIds).size, 18);
  assert.deepEqual(new Set(quizIds.map(id => question(id).format)), new Set(['choice', 'match', 'order']));
  assert.deepEqual(new Set(quizIds.map(id => question(id).skill)), new Set(Object.keys(skillLabels)));
  assert.ok(quizIds.every(id => question(id).quiz && !question(id).review && !question(id).section));
  assert.deepEqual(question('quiz-timeline').answer, ['hooke', 'leeuwenhoek', 'schleiden', 'schwann', 'virchow']);
  assert.deepEqual(question('quiz-conclusions-order').answer, ['plants', 'animals', 'existing']);
  assert.deepEqual(question('quiz-evidence').answer, ['observation', 'conclusion']);
  assert.deepEqual(question('quiz-principle-match').answer, ['living-things', 'basic-unit', 'existing-cells']);
});

test('answer keys distinguish scientists, living organisms, cork walls and the role of microscopes', () => {
  const expected: Record<string, string[]> = {
    'quiz-hooke': ['Robert Hooke'], 'quiz-leeuwenhoek': ['Anton van Leeuwenhoek'],
    'quiz-schleiden': ['Matthias Schleiden'], 'quiz-schwann': ['Animals are made of cells'],
    'quiz-virchow': ['New cells come from existing cells'],
    'quiz-principle-one': ['All living organisms are made of one or more cells'],
    'quiz-principle-two': ['Cells make up living things and perform basic life processes'],
    'quiz-principle-three': ['Cells come from pre-existing cells'],
    'quiz-cork-walls': ['The walls of dead plant cells'],
    'quiz-microscope': ['They made tiny structures and organisms visible'],
    'quiz-next-question': ['Where do new cells come from?'],
    'worksheet-cork': ['Robert Hooke'], 'worksheet-plants': ['Matthias Schleiden'],
    'worksheet-pair': ['Schleiden and Schwann'], 'worksheet-third': ['Rudolf Virchow'],
  };
  for (const [id, expectedLabels] of Object.entries(expected)) assert.deepEqual(answers(id), expectedLabels, id);
});

test('targeted review has at least two genuinely new prompts per skill and is excluded from the graded quiz', () => {
  const review = questions.filter(item => item.review);
  assert.equal(review.length, 12);
  assert.equal(new Set(review.map(item => item.prompt)).size, review.length);
  for (const skill of Object.keys(skillLabels)) {
    assert.ok(review.filter(item => item.skill === skill).length >= 2, skill);
    for (const item of review.filter(item => item.skill === skill)) {
      assert.ok(!item.quiz && !quizIds.includes(item.id), item.id);
      assert.ok(!quizIds.some(id => question(id).prompt === item.prompt), item.id);
    }
  }
  assert.deepEqual(answers('review-one-cell'), ['Yes; one or more cells includes a single cell']);
  assert.deepEqual(answers('review-observation'), ['I counted twelve cell outlines in this small tissue sample']);
  assert.match(question('review-new-leaf').prompt, /young leaf/);
  assert.match(question('review-lens-evidence').prompt, /student.*thin leaf sample/);
});

test('worksheet A–E includes three-principle blanks, five-way matching, order, four choices and principle links', () => {
  assert.equal(worksheetIds.length, 8);
  assert.deepEqual(worksheetIds, ['worksheet-principles', 'worksheet-match', timelineId, 'worksheet-cork', 'worksheet-plants', 'worksheet-pair', 'worksheet-third', 'worksheet-links']);
  assert.equal(new Set(worksheetIds.map(id => question(id).section!.slice(0, 1))).size, 5);
  assert.equal(question('worksheet-principles').answer.length, 3);
  assert.equal(question('worksheet-match').answer.length, 5);
  assert.equal(worksheetIds.filter(id => question(id).format === 'choice').length, 4);
  assert.deepEqual(question(timelineId).slots, ['1665', '1673', '1838', '1839', '1858']);
  assert.deepEqual(question('worksheet-links').answer, ['living-things', 'basic-unit', 'existing-cells']);
});

test('the two word-bank passages form accurate statements with each tile exactly once', () => {
  assert.equal(completedBank('worksheet-principles'), 'All living organisms are made of one or more cells. The cell is the basic unit of structure and function in living organisms. All cells come from pre-existing cells.');
  assert.equal(question(paragraphId).answer.length, 5);
  assert.equal(completedBank(paragraphId), 'Robert Hooke examined cork and named the tiny compartments cells. Anton van Leeuwenhoek observed tiny living organisms in pond water. Matthias Schleiden concluded that plants are made of cells. Theodor Schwann concluded that animals are made of cells. Rudolf Virchow helped establish that new cells come from existing cells.');
});

test('five open response prompts supply distinct self-review ideas without private information', () => {
  assert.equal(typedPrompts.length, 5); assert.equal(new Set(typedPrompts.map(item => item.id)).size, 5);
  assert.ok(typedPrompts.every(item => item.prompt && item.hint && item.model));
  assert.match(typedPrompts[0].model, /one or more cells.*structure and function.*pre-existing cells/);
  assert.match(typedPrompts[1].model, /raised questions/);
  assert.match(typedPrompts[2].model, /Schleiden.*plants.*Schwann.*animals/);
  assert.match(typedPrompts[3].model, /helped establish/);
  assert.match(typedPrompts[4].model, /observations.*evidence/);
  assert.doesNotMatch(JSON.stringify({ scenes, questions, typedPrompts, principles, sourceNotes }), /\.codex\/attachments|Pasted text\.txt|ADHD|diagnos|password|token/i);
});
