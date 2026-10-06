import type { WordStory } from './study-types.ts';

export const WORD_STORY_KEY = 'spanish.wordstories.v1';
export type FirstStoryCheck = { correct: number; total: number; usedHelp: boolean };
export type WordStoryProgress = {
  slots: (number | null)[];
  attempts: number;
  firstCheck: FirstStoryCheck | null;
  checkedSlots: (number | null)[] | null;
  usedHelp: boolean;
  complete: boolean;
};
export type WordStoryState = { version: 1; currentStory: number; stories: Record<string, WordStoryProgress> };

export function emptyStory(story: WordStory): WordStoryProgress {
  return { slots: story.lines.map(() => null), attempts: 0, firstCheck: null, checkedSlots: null, usedHelp: false, complete: false };
}

export function emptyWordStories(stories: WordStory[]): WordStoryState {
  return { version: 1, currentStory: 0, stories: Object.fromEntries(stories.map(story => [story.id, emptyStory(story)])) };
}

export function storyAnswers(story: WordStory, slots: (number | null)[]): boolean[] {
  return story.lines.map((line, index) => slots[index] !== null && story.words[slots[index] as number] === line.answer);
}

export function sameSlots(a: (number | null)[] | null, b: (number | null)[]): boolean {
  return a !== null && a.length === b.length && a.every((token, index) => token === b[index]);
}

// A tile is a token, not a copy of its text. Moving it frees the earlier blank.
export function placeStoryWord(story: WordStory, progress: WordStoryProgress, token: number, blank: number): WordStoryProgress {
  if (progress.complete || !Number.isInteger(token) || token < 0 || token >= story.words.length || !Number.isInteger(blank) || blank < 0 || blank >= story.lines.length) return progress;
  if (progress.slots[blank] === token) return progress;
  const slots = progress.slots.map((value, index) => index === blank ? token : value === token ? null : value);
  return { ...progress, slots, checkedSlots: null };
}

export function removeStoryWord(progress: WordStoryProgress, blank: number): WordStoryProgress {
  if (progress.complete || !Number.isInteger(blank) || blank < 0 || blank >= progress.slots.length || progress.slots[blank] === null) return progress;
  return { ...progress, slots: progress.slots.map((token, index) => index === blank ? null : token), checkedSlots: null };
}

export function checkWordStory(story: WordStory, progress: WordStoryProgress): WordStoryProgress {
  if (progress.complete || sameSlots(progress.checkedSlots, progress.slots)) return progress;
  // Filling every blank first avoids recording accidental empty submissions.
  if (progress.slots.some(token => token === null)) return progress;
  const results = storyAnswers(story, progress.slots);
  const correct = results.filter(Boolean).length;
  return {
    ...progress, attempts: progress.attempts + 1,
    firstCheck: progress.firstCheck ?? { correct, total: story.lines.length, usedHelp: progress.usedHelp },
    checkedSlots: [...progress.slots], complete: correct === story.lines.length,
  };
}

const record = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);

function validSlots(value: unknown, story: WordStory): value is (number | null)[] {
  return Array.isArray(value) && value.length === story.lines.length
    && value.every(token => token === null || (Number.isInteger(token) && token >= 0 && token < story.words.length))
    && new Set(value.filter(token => token !== null)).size === value.filter(token => token !== null).length;
}

export function parseWordStories(raw: string | null, stories: WordStory[]): { state: WordStoryState; recovered: boolean } {
  const fresh = emptyWordStories(stories);
  if (raw === null) return { state: fresh, recovered: false };
  try {
    const data: unknown = JSON.parse(raw);
    if (!record(data) || data.version !== 1 || !record(data.stories) || !Number.isInteger(data.currentStory) || Number(data.currentStory) < 0 || Number(data.currentStory) > stories.length) throw new Error('Invalid saved activity');
    for (const story of stories) {
      const value = data.stories[story.id];
      if (!record(value) || !validSlots(value.slots, story) || !Number.isInteger(value.attempts) || Number(value.attempts) < 0 || Number(value.attempts) > 100000 || typeof value.usedHelp !== 'boolean' || typeof value.complete !== 'boolean') throw new Error('Invalid saved story');
      if (value.checkedSlots !== null && (!validSlots(value.checkedSlots, story) || !sameSlots(value.checkedSlots, value.slots) || value.checkedSlots.some(token => token === null))) throw new Error('Invalid saved check');
      if (value.firstCheck !== null && (!record(value.firstCheck) || !Number.isInteger(value.firstCheck.correct) || Number(value.firstCheck.correct) < 0 || Number(value.firstCheck.correct) > story.lines.length || value.firstCheck.total !== story.lines.length || typeof value.firstCheck.usedHelp !== 'boolean')) throw new Error('Invalid saved score');
      if ((value.attempts === 0) !== (value.firstCheck === null) || (value.checkedSlots !== null && value.firstCheck === null)) throw new Error('Inconsistent saved score');
      const complete = value.checkedSlots !== null && storyAnswers(story, value.slots).every(Boolean);
      if (value.complete !== complete) throw new Error('Inconsistent completion');
      fresh.stories[story.id] = {
        slots: [...value.slots], attempts: Number(value.attempts),
        firstCheck: value.firstCheck === null ? null : { correct: Number((value.firstCheck as Record<string, unknown>).correct), total: story.lines.length, usedHelp: Boolean((value.firstCheck as Record<string, unknown>).usedHelp) },
        checkedSlots: value.checkedSlots === null ? null : [...value.checkedSlots as (number | null)[]],
        usedHelp: value.usedHelp, complete,
      };
    }
    fresh.currentStory = Number(data.currentStory);
    // Do not skip unfinished paragraphs after a damaged or edited save.
    if (stories.slice(0, fresh.currentStory).some(story => !fresh.stories[story.id].complete)) throw new Error('Missing earlier story');
    return { state: fresh, recovered: false };
  } catch {
    return { state: emptyWordStories(stories), recovered: true };
  }
}
