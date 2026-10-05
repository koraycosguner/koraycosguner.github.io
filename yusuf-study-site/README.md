# Yusuf's 7th Grade Quizzes

A growing, multi-subject practice hub for Yusuf's seventh-grade classes.

## Current content

- **Language Arts — Rikki-Tikki-Tavi Study Adventure**
  - Five complete narrative-technique lessons: point of view, personification,
    foreshadowing, suspense and tension, and imagery.
  - One idea per screen, labeled story paraphrases, quick checks, memory challenges,
    encouraging retry feedback, stars, and saved lesson positions.
  - Eight-question Fast Review, eight-question mixed practice, four explicit
    multiple-technique challenges, and a ten-question final with targeted review.
  - Characterization contains only its supplied introduction and is clearly pending.
    Its definition-review questions do not count toward the five complete techniques.
  - Open `/quizzes/rikki-tikki-tavi/` or choose Language Arts on the homepage.
- **Social Sciences**
  - **Learn About the Middle East** - a 26-question interactive geography quiz
    covering countries, capitals, rivers, seas, and political features.
- **Science**
  - **Ecology Expedition** — 72 illustrated questions covering the Ecology Part 1 study guide,
    five discovery labs, 42 vocabulary cards, and 18 study notes.
    Open `/quizzes/ecology/` or use the Science shelf.
    Quiz progress and optional sound preferences are stored only in the current browser.
- **Spanish — Un día en la escuela**
  - A connected, seven-stop school-day adventure with Sra. Abarca and recurring fictional
    classmates Mateo, Sofía, Carlos and Ana. Forty short interactions build toward a band-room finale.
  - Twenty-four contextual three-choice conversations, eight step-by-step sentence builders,
    plus eight short responses that now default to word tiles, with typing optional.
    First encounters show a worked example. Wrong answers give a clue and allow immediate retry.
    Short action headings, English help, picture choices and breaks after three turns support beginners.
    No countdown, lives, penalties or lost access.
  - Eight original, optimized school illustrations/atlases, visual backpack changes, a fictional schedule,
    discoverable classroom objects and a compact field guide with gradually encountered SER uses.
  - Fourteen fresh concept-based review conversations and a separate eight-step checkpoint.
  - The existing **60-question graded quiz**, complete field guide, original navigable Three.js
    classroom and equivalent 2D station navigation remain available. The illustrated interactive
    classroom is the default exploration view; the optional 3D room now has rounded furniture,
    wood flooring, plants, shelves, expressive procedural characters and improved lighting.
  - Story progress and completed quiz grades stay only in this browser. No analytics, account,
    microphone, uploaded responses or learner-data backend is used.
- Math remains a future shelf.

## Local development

```bash
pnpm install
pnpm dev
```

Then open `http://localhost:3000`.

Spanish: `http://localhost:3000/quizzes/spanish/`

Connected story: `http://localhost:3000/quizzes/spanish/unit-2/`

Checkpoint: `http://localhost:3000/quizzes/spanish/unit-2/checkpoint/`

Big graded quiz: `http://localhost:3000/quizzes/spanish/unit-2/quiz/`

Preserved 3D / 2D exploration: `http://localhost:3000/quizzes/spanish/unit-2/explore/`

Requires Node 22.13+ and pnpm. Versions are pinned in `pnpm-lock.yaml`.
When this project is stored inside the personal GitHub repository, run these commands
from **yusuf-study-site/**. The folder is a complete application with its own root;
putting it in the repository does not mount it at `/yusuf-study-site/` on GitHub Pages.
The existing live site uses Sites hosting. GitHub is the editable source copy;
pushing this folder alone does not deploy it through GitHub Pages.

## Editing and controls

- `rikki/content.ts`: all Rikki lessons, paraphrased examples, questions, answer keys,
  source labels, memory diagrams, and pending-section notices.
- `rikki/RikkiApp.tsx`: topic picker and one-screen learning/practice flows.
- `rikki/learning.ts`: defensive browser-local saves, first-answer evidence,
  idempotent stars, and targeted review.
- `rikki/rikki.css`: responsive field-journal styling and reduced-motion handling.
- `app/quizzes/rikki-tikki-tavi/` and `app/subjects/language-arts/`: adventure and shelf.
- `spanish/story-content.ts`: editable school-day dialogue, three-choice banks, builders,
  accepted responses, visible inventory snapshots and fresh review turns.
- `spanish/StoryApp.tsx`: connected story, checkpoint, visual inventory and band reward.
- `spanish/StoryGuide.tsx`: compact vocabulary, grammar and gradually encountered SER reference.
- `spanish/story-learning.ts`: separate story save, first-response evidence, hint persistence,
  scene unlocking and concept-based review.
- `spanish/story.css`: responsive story layout and reduced-motion support.
- `public/quizzes/spanish/school-day/`: eight original WebP illustrations/atlases (about 1.4 MB total).
- `spanish/content.ts`: vocabulary, pronouns, SER, DOCTOR, questions and missions.
- `spanish/learning.ts`: answer validation, private local saves, grade calculations.
- `spanish/SpanishApp.tsx`: exploration, conversations, guide, quiz and grade history.
- `spanish/Classroom.tsx`: navigable programmatic 3D classroom geometry, lighting and controls.
- `spanish/IllustratedRoom.tsx`, `room.css`: semantic clickable illustrated classroom and accessible list.
- `spanish/intuitive.ts`, `LearningVisuals.tsx`, `learning-visuals.css`: editable models, word tiles,
  short actions, translations, portrait crops and picture vocabulary.
- `spanish/useSpanishSpeech.ts`: optional on-demand browser Spanish voice.
- `spanish/spanish.css`, `spanish/grades.css`: responsive styling.
- `app/quizzes/spanish/`: direct-loadable routes; `app/page.tsx` activates the Spanish shelf.

Drag the scene to look; use WASD/arrow keys while it has focus, or the movement buttons.
Select a person or object, or use the station list. The 2D option provides the same
content and missions. Audio is optional and user-initiated; it needs an available
Spanish browser voice. Escape closes conversations, and native dialogs manage focus.
Reduced-motion preferences disable camera damping and interface animation.

Saved progress resumes across reloads and route changes in the same browser.
An unfinished quiz session restarts after a reload; completed results and skill evidence
remain saved. Saves are device/browser local and do not sync between devices.
The story uses `yusuf.spanish.school-day.v1`; its reset preserves the graded quiz and other
subjects. Hints used before an answer persist through reload. Worked examples, word-tile support and classroom help are recorded as supported practice,
not independent first-answer evidence. New saves start with English help and guidance enabled;
existing explicit preferences are preserved. Story scene progress resumes,
while an unfinished checkpoint restarts. The legacy exploration/quiz reset still touches only
`yusuf.spanish.unit2.v1`. The two backpack activities are separate: the story shows exact
before/after snapshots; free exploration and the graded quiz use the editable legacy inventory.
Practice grades use first answers, with hinted answers and corrections tracked separately.

Rikki saves use the separate `yusuf.rikki.v1` key. Reset requires confirmation and
preserves other subjects. A lesson resumes from its saved screen via **Resume**;
an unfinished practice round restarts after reload. Completed rounds and weak concepts
remain saved. Final mastery requires both questions for a technique to be correct on
the first try. Retrying still earns a question's star once and never removes access.
A successful targeted round clears that review need without rewriting the original
final result. Challenge Mode records round results without assigning a single-concept
diagnosis to a question that intentionally combines techniques.

## Adding worksheet sections

Keep content in `rikki/content.ts`. When new pages arrive, review their definitions,
questions, evidence, and the learner's reasoning before adding material. Add or update
a lesson's `status`, `explanation`, `memoryHook`, `example`, optional short `details`,
`quickCheck`, and `memoryCheck`; also add its memory diagram in `visualMemory`.
Promote a complete section in `TechniqueId` and `completeTechniqueIds`, and add at least
two final questions with unique IDs for it. Progress totals and final mastery then adapt
automatically. Do not use pending sections in final mastery. Update source labels and
tests, then run the validation commands below. Exact quotations require verified story
text; otherwise retain the **Story example (paraphrased)** label.

## Validation

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm test:production
pnpm exec playwright install chromium
# Keep pnpm dev running in another terminal:
pnpm test:browser
```

`worker-configuration.d.ts` contains generated Cloudflare runtime types needed by the
inherited source. Refresh them with `pnpm types` if the runtime configuration changes.
`wrangler.types.json` is for type generation; deployment configuration remains unchanged.

## Source provenance and privacy

The original study-site source was retrieved from its authorized Sites source repository
at commit `2b3f9a4`. Ecology and Social Sciences are the original source and assets,
not reconstructions. The original Ecology directory is unchanged by this implementation.
Third-party classroom rendering uses MIT-licensed Three.js; see `ASSET_LICENSES.md`.

Spanish vocabulary and SER were checked against both pages of the supplied class DOCX
and all three scanned PDF pages. Private originals and the handoff ZIP are excluded from
Git and public assets. All new conversations, classmates, origin examples, and schedules
are fictional; teacher dialogue is a practice simulation. See `CONTENT_NOTES.md` for
ambiguities and the limited mapping to official Fulton County goals.

Rikki content follows the supplied typed handoff. Original worksheet photographs and
a full story edition were not supplied in this turn and were not independently inspected.
Existing correct reasoning listed in the handoff is reinforced through the examples.
No direct quotations are presented as Kipling's text. Missing worksheet content stays
pending, and new practice questions are labeled separately from supplied quick checks.
The original handoff and private learner information are not copied into the repository.

## Production build

```bash
pnpm build
```

The October 5 beginner-flow and graphics update is documented in `SPANISH_INTUITIVE_REPORT.md`.
