import { test, expect, type Page } from '@playwright/test';
import { studyPath } from './paths';
import { wordStories } from '../../spanish/word-stories';
import { WORD_STORY_KEY, type WordStoryState } from '../../spanish/word-story-learning';

const route = '/quizzes/spanish/unit-2/complete-story/';
const activity = (page: Page) => page.locator('.ws-activity');
const word = (page: Page, index: number) => activity(page).locator('.ws-word').nth(index);
const blank = (page: Page, index: number) => activity(page).locator('.ws-blank').nth(index);
async function open(page: Page) {
  await page.goto(studyPath(route));
  await expect(activity(page).getByRole('heading', { name: wordStories[0].title })).toBeVisible();
}
async function saved(page: Page): Promise<WordStoryState> {
  return page.evaluate(key => JSON.parse(localStorage.getItem(key)!), WORD_STORY_KEY);
}
async function place(page: Page, token: number, position: number) {
  await word(page, token).click();
  await blank(page, position).click();
}
async function finish(page: Page, storyIndex: number) {
  const story = wordStories[storyIndex];
  for (let i = 0; i < story.lines.length; i++) await place(page, story.words.indexOf(story.lines[i].answer), i);
  await activity(page).getByRole('button', { name: 'Check story', exact: true }).click();
  await expect(activity(page).locator('.ws-feedback')).toContainText('The whole story fits');
}

test('desktop dragging places and moves a tile without duplicating it', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await open(page);
  await expect(activity(page).getByRole('button', { name: 'Check story', exact: true })).toBeDisabled();
  await word(page, 2).dragTo(blank(page, 0));
  await expect(blank(page, 0)).toHaveText('son');
  await blank(page, 0).dragTo(blank(page, 1));
  await expect(blank(page, 0)).toContainText('______');
  await expect(blank(page, 1)).toHaveText('son');
  expect((await saved(page)).stories.classmates.slots).toEqual([null, 2, null, null, null]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: test.info().outputPath('word-story-desktop.png'), fullPage: true });
});

test('keyboard placement, replacement, removal and contextual help work', async ({ page }) => {
  await open(page);
  await word(page, 0).focus(); await page.keyboard.press('Enter');
  await expect(word(page, 0)).toHaveAttribute('aria-pressed', 'true');
  await blank(page, 0).focus(); await page.keyboard.press('Space');
  await place(page, 1, 1);
  await word(page, 0).focus(); await page.keyboard.press('Enter');
  await blank(page, 1).focus(); await page.keyboard.press('Enter');
  await expect(blank(page, 0)).toContainText('______');
  await expect(blank(page, 1)).toHaveText('somos');
  await blank(page, 1).click();
  expect((await saved(page)).stories.classmates.slots).toEqual([null, null, null, null, null]);
  await activity(page).getByRole('button', { name: 'Need help?', exact: true }).click();
  await expect(activity(page).locator('.ws-help')).toContainText('Mateo and Pablo');
  expect((await saved(page)).stories.classmates.usedHelp).toBe(true);
  await activity(page).getByRole('button', { name: 'Close help', exact: true }).click();
  await expect(activity(page).locator('.ws-help')).toHaveCount(0);
});

test('a first mistake survives retry and refresh; checking the same answers cannot rescore', async ({ page }) => {
  await open(page);
  const story = wordStories[0];
  const wrong = story.lines.map(line => story.words.indexOf(line.answer));
  [wrong[0], wrong[1]] = [wrong[1], wrong[0]];
  for (let i = 0; i < wrong.length; i++) await place(page, wrong[i], i);
  await activity(page).getByRole('button', { name: 'Check story', exact: true }).click();
  await expect(activity(page).locator('.ws-retry')).toHaveCount(2);
  await expect(activity(page).getByRole('button', { name: 'Check story', exact: true })).toBeDisabled();
  expect((await saved(page)).stories.classmates.firstCheck).toEqual({ correct: 3, total: 5, usedHelp: false });
  await page.reload();
  await expect(activity(page).locator('.ws-retry')).toHaveCount(2);
  expect((await saved(page)).stories.classmates.attempts).toBe(1);
  await place(page, story.words.indexOf(story.lines[0].answer), 0);
  await place(page, story.words.indexOf(story.lines[1].answer), 1);
  await activity(page).getByRole('button', { name: 'Check story', exact: true }).click();
  await expect(activity(page).getByRole('button', { name: 'Next story', exact: true })).toBeVisible();
  expect((await saved(page)).stories.classmates.firstCheck?.correct).toBe(3);
  expect((await saved(page)).stories.classmates.attempts).toBe(2);
  await page.reload();
  await expect(activity(page).getByRole('button', { name: 'Next story', exact: true })).toBeVisible();
});

test('four stories complete, summary resumes, and replay preserves other activities', async ({ page }) => {
  await open(page);
  const keep = { 'ecology-progress-keep': 'yes', 'yusuf.spanish.unit2.v1': '{"grades":[{"percent":97}]}', 'unrelated-classroom-save': 'keep' };
  await page.evaluate(values => { for (const [key, value] of Object.entries(values)) localStorage.setItem(key, value); }, keep);
  for (let i = 0; i < wordStories.length; i++) {
    await finish(page, i);
    await activity(page).getByRole('button', { name: i === wordStories.length - 1 ? 'Finish stories' : 'Next story', exact: true }).click();
  }
  await expect(activity(page).getByRole('heading', { name: 'Every story is complete.' })).toBeVisible();
  await expect(activity(page).locator('.ws-summary')).toContainText('20 of 20');
  await page.reload();
  await expect(activity(page).getByRole('heading', { name: 'Every story is complete.' })).toBeVisible();
  await activity(page).getByRole('button', { name: 'Practice these stories again', exact: true }).click();
  await expect(activity(page).getByRole('heading', { name: wordStories[0].title })).toBeVisible();
  expect((await saved(page)).stories.classmates.firstCheck).toBeNull();
  expect(await page.evaluate(keys => Object.fromEntries(keys.map(key => [key, localStorage.getItem(key)])), Object.keys(keep))).toEqual(keep);
});

test('malformed saved progress recovers with a notice and usable activity', async ({ page }) => {
  await page.addInitScript(key => localStorage.setItem(key, '{broken'), WORD_STORY_KEY);
  await open(page);
  await expect(activity(page).locator('.ws-notice')).toContainText('could not be read');
  await place(page, 2, 0);
  await expect(blank(page, 0)).toHaveText('son');
});

test('blocked browser storage still allows completing a paragraph', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error('blocked'); };
    Storage.prototype.setItem = () => { throw new Error('blocked'); };
  });
  await open(page);
  await expect(activity(page).locator('.ws-notice')).toContainText('You can still practice');
  await finish(page, 0);
  await expect(activity(page).getByRole('button', { name: 'Next story', exact: true })).toBeVisible();
});

test.describe('phone word-bank interaction', () => {
  test.use({ hasTouch: true, isMobile: true });
  for (const width of [320, 390]) test(`${width}px tap placement has readable text, large targets and no overflow`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await word(page, 2).tap(); await blank(page, 0).tap();
    await expect(blank(page, 0)).toHaveText('son');
    await word(page, 3).tap(); await blank(page, 1).tap();
    await expect(blank(page, 1)).toHaveText('Ellos');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const sizes = await activity(page).locator('button').evaluateAll(buttons => buttons.map(button => ({ height: button.getBoundingClientRect().height, width: button.getBoundingClientRect().width })));
    expect(sizes.every(size => size.height >= 44 && size.width >= 44)).toBe(true);
    await page.screenshot({ path: test.info().outputPath(`word-story-mobile-${width}.png`), fullPage: true });
  });
});
