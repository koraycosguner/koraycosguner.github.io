import test from 'node:test';
import assert from 'node:assert/strict';
import { wordStories } from '../spanish/word-stories.ts';
import { checkWordStory, emptyStory, emptyWordStories, parseWordStories, placeStoryWord, removeStoryWord, storyAnswers } from '../spanish/word-story-learning.ts';

test('four complete paragraphs have unique small banks and exactly one extra word', () => {
  assert.equal(wordStories.length, 4);
  for (const story of wordStories) {
    assert.ok(story.lines.length >= 4 && story.lines.length <= 5);
    assert.equal(story.words.length, story.lines.length + 1);
    assert.equal(new Set(story.words).size, story.words.length);
    assert.equal(new Set(story.lines.map(line => line.answer)).size, story.lines.length);
    for (const line of story.lines) { assert.ok(story.words.includes(line.answer)); assert.ok(line.hint.length > 0); }
  }
});

test('a moved token frees its former blank and a replacement returns the displaced token', () => {
  const story = wordStories[0];
  let progress = placeStoryWord(story, emptyStory(story), 0, 0);
  progress = placeStoryWord(story, progress, 1, 1);
  progress = placeStoryWord(story, progress, 0, 1);
  assert.deepEqual(progress.slots, [null, 0, null, null, null]);
  progress = placeStoryWord(story, progress, 1, 0);
  assert.deepEqual(progress.slots, [1, 0, null, null, null]);
  assert.equal(placeStoryWord(story, progress, 1, 0), progress);
  progress = removeStoryWord(progress, 1);
  assert.deepEqual(progress.slots, [1, null, null, null, null]);
});

test('invalid token and blank positions do not modify an activity', () => {
  const story = wordStories[0]; const empty = emptyStory(story);
  for (const token of [-1, 1.2, NaN, 999]) assert.equal(placeStoryWord(story, empty, token, 0), empty);
  for (const blank of [-1, 1.2, NaN, 999]) {
    assert.equal(placeStoryWord(story, empty, 0, blank), empty);
    assert.equal(removeStoryWord(empty, blank), empty);
  }
});

test('first-check score survives corrections and repeated checks are idempotent', () => {
  const story = wordStories[0];
  let progress = emptyStory(story);
  assert.equal(checkWordStory(story, progress), progress);
  const solutions = story.lines.map(line => story.words.indexOf(line.answer));
  const wrong = [...solutions]; [wrong[0], wrong[1]] = [wrong[1], wrong[0]];
  wrong.forEach((token, blank) => { progress = placeStoryWord(story, progress, token, blank); });
  progress = { ...progress, usedHelp: true };
  progress = checkWordStory(story, progress);
  assert.deepEqual(progress.firstCheck, { correct: 3, total: 5, usedHelp: true });
  assert.equal(progress.attempts, 1); assert.equal(progress.complete, false);
  assert.equal(checkWordStory(story, progress), progress);
  solutions.forEach((token, blank) => { progress = placeStoryWord(story, progress, token, blank); });
  progress = checkWordStory(story, progress);
  assert.equal(progress.complete, true); assert.equal(progress.attempts, 2);
  assert.equal(progress.firstCheck?.correct, 3);
  assert.equal(checkWordStory(story, progress), progress);
  assert.equal(placeStoryWord(story, progress, 0, 0), progress);
  assert.equal(removeStoryWord(progress, 0), progress);
});

test('saved placements, scores, and completion resume without affecting other keys', () => {
  const state = emptyWordStories(wordStories); const story = wordStories[0];
  story.lines.forEach((line, blank) => { state.stories[story.id] = placeStoryWord(story, state.stories[story.id], story.words.indexOf(line.answer), blank); });
  state.stories[story.id] = checkWordStory(story, state.stories[story.id]); state.currentStory = 1;
  state.stories[wordStories[1].id] = placeStoryWord(wordStories[1], state.stories[wordStories[1].id], 0, 2);
  const resumed = parseWordStories(JSON.stringify(state), wordStories);
  assert.equal(resumed.recovered, false); assert.deepEqual(resumed.state, state);
  assert.equal(parseWordStories(null, wordStories).recovered, false);
});

test('damaged saves cannot manufacture completion or introduce duplicate tokens', () => {
  for (const raw of ['{', 'null', '[]', '{"version":2}', 'true']) assert.equal(parseWordStories(raw, wordStories).recovered, true);
  for (const corrupt of [
    (state: ReturnType<typeof emptyWordStories>) => { state.stories.classmates.slots = [0, 0, null, null, null]; },
    (state: ReturnType<typeof emptyWordStories>) => { state.stories.classmates.complete = true; },
    (state: ReturnType<typeof emptyWordStories>) => { state.currentStory = 4; },
    (state: ReturnType<typeof emptyWordStories>) => { state.stories.classmates.attempts = 1; },
    (state: ReturnType<typeof emptyWordStories>) => { state.stories.classmates.checkedSlots = [null, null, null, null, null]; },
  ]) {
    const state = emptyWordStories(wordStories); corrupt(state);
    const parsed = parseWordStories(JSON.stringify(state), wordStories);
    assert.equal(parsed.recovered, true); assert.deepEqual(parsed.state, emptyWordStories(wordStories));
  }
});

test('answers and complete-state recovery work for every paragraph', () => {
  const state = emptyWordStories(wordStories);
  for (const story of wordStories) {
    const slots = story.lines.map(line => story.words.indexOf(line.answer));
    assert.ok(storyAnswers(story, slots).every(Boolean));
    state.stories[story.id] = checkWordStory(story, { ...emptyStory(story), slots });
  }
  state.currentStory = wordStories.length;
  const result = parseWordStories(JSON.stringify(state), wordStories);
  assert.equal(result.recovered, false); assert.deepEqual(result.state, state);
});
