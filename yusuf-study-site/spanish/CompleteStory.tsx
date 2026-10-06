'use client';

import { useEffect, useRef, useState } from 'react';
import type { DragEvent } from 'react';
import { wordStories } from './word-stories';
import { checkWordStory, emptyWordStories, parseWordStories, placeStoryWord, removeStoryWord, sameSlots, storyAnswers, WORD_STORY_KEY } from './word-story-learning';
import type { WordStoryProgress } from './word-story-learning';
import './complete-story.css';

const DRAG_TYPE = 'application/x-yusuf-wordstory';

export default function CompleteStory({ onComplete }: { onComplete?: () => void } = {}) {
  const [state, setState] = useState(() => emptyWordStories(wordStories));
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [activeBlank, setActiveBlank] = useState(0);
  const [help, setHelp] = useState(false);
  const [notice, setNotice] = useState('');
  const [message, setMessage] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    try {
      const saved = parseWordStories(window.localStorage.getItem(WORD_STORY_KEY), wordStories);
      setState(saved.state);
      if (saved.recovered) setNotice('This activity’s saved progress could not be read. Start here again.');
    } catch { setNotice('Progress cannot be saved in this browser right now. You can still practice.'); }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { window.localStorage.setItem(WORD_STORY_KEY, JSON.stringify(state)); }
    catch { setNotice('Progress cannot be saved in this browser right now. You can still practice.'); }
  }, [loaded, state]);

  const story = wordStories[state.currentStory];
  const progress = story ? state.stories[story.id] : null;

  function update(fn: (value: WordStoryProgress) => WordStoryProgress) {
    if (!story) return;
    setState(current => ({ ...current, stories: { ...current.stories, [story.id]: fn(current.stories[story.id]) } }));
  }

  function place(token: number, blank: number) {
    if (!story || !progress || progress.complete) return;
    update(value => placeStoryWord(story, value, token, blank));
    setSelected(null); setActiveBlank(blank); setMessage(`${story.words[token]} placed in blank ${blank + 1}.`);
  }

  function chooseBlank(blank: number) {
    if (!story || !progress) return;
    setActiveBlank(blank);
    if (selected !== null) place(selected, blank);
    else if (progress.slots[blank] !== null) {
      update(value => removeStoryWord(value, blank));
      setMessage('Word returned to the bank. Choose a word, then choose a blank.');
    } else setMessage('Choose a word from the bank, then choose this blank.');
  }

  function drag(event: DragEvent<HTMLButtonElement>, token: number) {
    event.dataTransfer.setData(DRAG_TYPE, `${story.id}:${token}`);
    event.dataTransfer.effectAllowed = 'move';
    setSelected(token);
  }

  function drop(event: DragEvent<HTMLButtonElement>, blank: number) {
    event.preventDefault();
    const value = event.dataTransfer.getData(DRAG_TYPE);
    const [id, index] = value.split(':');
    if (id === story.id && /^\d+$/.test(index ?? '')) {
      const token = Number(index);
      if (token < story.words.length) place(token, blank);
    }
  }

  function next() {
    setState(current => ({ ...current, currentStory: current.currentStory + 1 }));
    setSelected(null); setActiveBlank(0); setHelp(false); setMessage('');
    requestAnimationFrame(() => heading.current?.focus());
  }

  if (!loaded) return <section className="ws-activity" aria-busy="true"><p>Opening your story…</p></section>;

  if (!story || !progress) {
    const checks = wordStories.map(item => state.stories[item.id].firstCheck);
    const firstCorrect = checks.reduce((total, check) => total + (check?.correct ?? 0), 0);
    const total = wordStories.reduce((count, item) => count + item.lines.length, 0);
    return <section className="ws-activity">
      <p className="ws-progress">4 of 4 stories</p>
      <h2 ref={heading} tabIndex={-1}>Every story is complete.</h2>
      <p>You filled all {total} blanks and corrected anything that needed another look.</p>
      <p className="ws-summary">First check: <strong>{firstCorrect} of {total}</strong>{checks.some(check => check?.usedHelp) ? ' · Help used' : ''}</p>
      {notice && <p className="ws-notice" role="status">{notice}</p>}
      <div className="ws-actions">
        {onComplete && <button className="ws-primary" onClick={onComplete}>Back to Spanish</button>}
        <button className="ws-secondary" onClick={() => { setState(emptyWordStories(wordStories)); setHelp(false); setSelected(null); setMessage(''); requestAnimationFrame(() => heading.current?.focus()); }}>Practice these stories again</button>
      </div>
    </section>;
  }

  const checked = sameSlots(progress.checkedSlots, progress.slots);
  const results = checked ? storyAnswers(story, progress.slots) : [];
  const remaining = progress.slots.filter(token => token === null).length;

  return <section className="ws-activity" aria-labelledby="ws-heading">
    <p className="ws-progress">Story {state.currentStory + 1} of {wordStories.length}</p>
    <h2 id="ws-heading" ref={heading} tabIndex={-1}>{story.title}</h2>
    <p className="ws-intro">{story.intro}</p>
    <p className="ws-directions">Choose a word, then a blank. You can also drag. One word will be left over.</p>
    <div className="ws-bank" role="group" aria-label="Word bank">
      {story.words.map((word, token) => {
        const used = progress.slots.indexOf(token);
        return <button key={token} className={`ws-word${used >= 0 ? ' ws-used' : ''}`} aria-pressed={selected === token}
          aria-label={used >= 0 ? `${word}, in blank ${used + 1}. Select to move.` : word}
          disabled={progress.complete} draggable={!progress.complete} onDragStart={event => drag(event, token)} onDragEnd={() => setSelected(null)}
          onClick={() => { setSelected(selected === token ? null : token); setMessage(selected === token ? 'Word selection cleared.' : `${word} selected. Choose a blank.`); }}>
          {word}{used >= 0 && <span className="ws-used-label" aria-hidden="true"> · {used + 1}</span>}
        </button>;
      })}
    </div>
    <p className="ws-paragraph">
      {story.lines.map((line, blank) => {
        const token = progress.slots[blank];
        return <span className="ws-line" key={blank}>{line.before}<button
          className={`ws-blank${checked ? results[blank] ? ' ws-correct' : ' ws-retry' : ''}`}
          aria-label={`Blank ${blank + 1}: ${token === null ? 'empty' : story.words[token]}${checked ? results[blank] ? ', correct' : ', try another word' : ''}`}
          disabled={progress.complete} draggable={token !== null && !progress.complete}
          onDragStart={event => { if (token !== null) drag(event, token); }} onDragEnd={() => setSelected(null)}
          onDragOver={event => { if (!progress.complete) { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; } }}
          onDrop={event => drop(event, blank)} onClick={() => chooseBlank(blank)}>
          {token === null ? <span aria-hidden="true">{blank + 1}. ______</span> : story.words[token]}
          {checked && <span aria-hidden="true">{results[blank] ? ' ✓' : ' ↻'}</span>}
        </button>{line.after}{' '}</span>;
      })}
    </p>
    <div className="ws-feedback" role="status" aria-live="polite">
      {progress.complete ? <p>Yes! The whole story fits. {progress.attempts > 1 ? 'You worked through the corrections.' : 'Ready for the next story.'}</p>
        : checked ? <p>Some words need another look. Choose a word and replace a blank marked ↻.</p>
          : <p>{message || `${remaining} ${remaining === 1 ? 'blank' : 'blanks'} to fill.`}</p>}
    </div>
    {help && !progress.complete && <div className="ws-help" id="ws-help"><p>{story.lines[activeBlank].hint}</p><p>To remove a word, clear your selection and tap its filled blank.</p></div>}
    {notice && <p className="ws-notice" role="status">{notice}</p>}
    <div className="ws-actions">
      {progress.complete ? <button className="ws-primary" onClick={next}>{state.currentStory === wordStories.length - 1 ? 'Finish stories' : 'Next story'}</button>
        : <button className="ws-primary" disabled={remaining > 0 || checked} onClick={() => { update(value => checkWordStory(story, value)); setSelected(null); setHelp(false); const wrong = storyAnswers(story, progress.slots).findIndex(value => !value); if (wrong >= 0) setActiveBlank(wrong); }}>Check story</button>}
      {!progress.complete && <button className="ws-help-toggle" aria-expanded={help} aria-controls="ws-help" onClick={() => { setHelp(!help); if (!help) update(value => ({ ...value, usedHelp: true })); }}>{help ? 'Close help' : 'Need help?'}</button>}
    </div>
  </section>;
}
