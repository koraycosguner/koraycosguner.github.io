# Yusuf's 7th Grade Quizzes

A growing, multi-subject practice hub for Yusuf's seventh-grade classes.

## Spanish proficiency revision — October 5, 2026

The new Unit 2 revision is prepared on **feature/spanish-proficiency-prep** for review
and a feature-branch push. It has **not been deployed**. The published GitHub Pages
baseline remains commit `61ae563`; a feature-branch push alone does not change that site.
The latest build brief requests no live deployment. Keep publication as a separate,
explicitly authorized action.

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
- **Spanish — Unit 2 learn, practice, and proficiency prep**
  - `/quizzes/spanish/` now connects four study paths: Learn, Practice in context,
    Unit 2 Vocabulary & Grammar Test Prep, and Full Practice Proficiency Test.
  - Ten short lessons lead immediately to 30 guided practice questions. Lessons teach
    pronouns, visual IN / TO / ABOUT perspective, WHO → PRONOUN → SER, articles,
    HAY, backpack and classroom vocabulary, subjects, descriptions, and DOCTOR uses.
  - Balanced mixed rounds contain 12 questions following the same school day, from
    arrival through the backpack, classroom, schedule, friends, and band room.
  - The full practice test contains **88 questions and 94 scored responses**. Six
    questions pair pronoun choice with SER; eight use Cierto/Falso. Four connected
    reading passages support 11 questions. All other choices use exactly three options.
  - Forty fresh targeted-review questions cover 22 separate skills, with at least two
    distinct examples available for each skill. Review appears in batches of up to six.
    Readiness requires two varied independent first answers after a concern; repeating
    the same question or correcting an answer does not create mastery evidence.
  - Clear progress, large choices, optional English and speech, a collapsible field guide,
    saved sessions, and Pause & save support small steps. Full-test hints and the in-app
    guide are unavailable during an active test; answers appear only after submission.
  - Scores are local practice results. The full-test score uses the first response to
    each of the 94 steps; a later correction never rewrites that score. Skill labels are
    **Ready**, **A little more practice**, and **Review this**.
- **Spanish — preserved Un día en la escuela adventure**
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

Short lessons: `http://localhost:3000/quizzes/spanish/unit-2/learn/`

Mixed test prep: `http://localhost:3000/quizzes/spanish/unit-2/test-prep/`

Full proficiency practice: `http://localhost:3000/quizzes/spanish/unit-2/proficiency/`

Connected story: `http://localhost:3000/quizzes/spanish/unit-2/`

Checkpoint: `http://localhost:3000/quizzes/spanish/unit-2/checkpoint/`

Big graded quiz: `http://localhost:3000/quizzes/spanish/unit-2/quiz/`

Preserved 3D / 2D exploration: `http://localhost:3000/quizzes/spanish/unit-2/explore/`

Requires Node 22.13+ and pnpm. Versions are pinned in `pnpm-lock.yaml`.
When working in `koraycosguner/koraycosguner.github.io`, run these commands from
**yusuf-study-site/**, which contains the editable application source.
The original Sites development and production commands remain available. The separate
GitHub Pages build below publishes the complete hub at `/yusufs-quizzes/`.

## GitHub Pages build and preview

The publication address is **https://koraycosguner.github.io/yusufs-quizzes/**.
This includes Spanish, Ecology, Rikki-Tikki-Tavi, and Social Sciences, with a homepage
that links to all available subjects. Math is still a future shelf.

```bash
pnpm build:pages
pnpm preview:pages
```

The preview command requires Python 3. Open
`http://localhost:4173/yusufs-quizzes/`, or go directly to
`http://localhost:4173/yusufs-quizzes/quizzes/spanish/unit-2/`.
Keep the preview server running while checking the build.

The static output is **pages-dist/yusufs-quizzes/**. It contains the browser bundles,
images, and an `index.html` for each of 16 routes, so direct links and reloads work
without a server-side application. It reuses the existing learning components and
original Ecology and Social Sciences activities. It does not need a database,
Cloudflare credentials, or a learner account.

For publication, copy the contents of that generated folder into the repository-root
**yusufs-quizzes/** directory. Commit the editable **yusuf-study-site/** source and
the generated **yusufs-quizzes/** output together. Publishing the source folder alone
does not update the website. The repository's existing GitHub Pages deployment from
`main` serves the generated directory after its deployment completes. Preserve the
personal website's root files and other folders when updating this directory.

`vite.pages.config.ts` applies the `/yusufs-quizzes/` prefix to this build's links and
assets. `static-pages/routes.ts` lists the React routes, and `scripts/build-pages.mjs` creates
their direct entry points and adjusts the generated Ecology navigation. These steps
leave the original Sites paths and source activities intact. Add any new React route
to both `static-pages/routes.ts` and the component map in `static-pages/main.tsx` before rebuilding.
Do not hand-edit generated bundles; edit the source and rebuild instead.
The static entry folder is named **static-pages/**, not **pages/**, to avoid Vinext
interpreting the static-build entry as its reserved Pages Router directory.

For this proficiency revision, commit and push the source and regenerated output on the
feature branch only. Do not push that branch into `main` or trigger a deployment without
new authorization. The published baseline can remain available while the revision is reviewed.

## Editing and controls

- `rikki/content.ts`: all Rikki lessons, paraphrased examples, questions, answer keys,
  source labels, memory diagrams, and pending-section notices.
- `rikki/RikkiApp.tsx`: topic picker and one-screen learning/practice flows.
- `rikki/learning.ts`: defensive browser-local saves, first-answer evidence,
  idempotent stars, and targeted review.
- `rikki/rikki.css`: responsive field-journal styling and reduced-motion handling.
- `app/quizzes/rikki-tikki-tavi/` and `app/subjects/language-arts/`: adventure and shelf.
- `spanish/proficiency-content.ts`: editable test bank, fresh review bank, guided checks,
  exact answer keys, visible inventories, perspective metadata, and source-scope labels.
- `spanish/ProficiencyLessons.tsx`: ten short teaching modules and contextual vocabulary.
- `spanish/ProficiencyApp.tsx`: Spanish study hub, lessons, mixed practice, full test,
  pause/resume, result screens, and targeted review.
- `spanish/proficiency-learning.ts`: separate defensive saves, first-answer scoring,
  balanced mixed rounds, fresh review selection, and evidence for 22 skills.
- `spanish/proficiency.css`: responsive lesson, question, and result layouts.
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
The new lessons and proficiency flows use **yusuf.spanish.proficiency.v1**. An active
question, selected choice, feedback state, and position in a two-step question survive
reload. The learner can resume the session or view the latest completed result.
Guided practice always counts as supported learning; hint or guide use is recorded
before an answer. Repeated examples do not supply new independent readiness evidence.
Resetting this prep record requires confirmation and preserves the adventure, earlier
quiz results, and other subjects. First-response evidence stays in the browser only.

The earlier 60-question quiz restarts an unfinished session after a reload; its completed
results and skill evidence remain saved. Saves are device/browser local and do not sync between devices.
Browser storage is also separate for each origin: GitHub Pages, the older Sites
address, and local previews each start with their own progress. Moving to the GitHub
Pages address does not transfer or erase progress saved on the older address.
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
classification to a question that intentionally combines techniques.

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

See [SPANISH_PROFICIENCY_REPORT.md](SPANISH_PROFICIENCY_REPORT.md) for the October 5 revision’s actual results and remaining verification limits.

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

To test the GitHub Pages build, keep `pnpm preview:pages` running and use:

```bash
pnpm build:pages
TEST_BASE_URL=http://localhost:4173 TEST_PATH_PREFIX=/yusufs-quizzes pnpm test:browser
```

The path prefix directs learning-interaction tests to the same subdirectory used
online. The Pages-specific checks cover direct routes, subject navigation, and assets.
The proficiency tests cover curriculum breadth and keys, lesson-to-practice flow,
perspective and paired steps, first-answer scoring, supported retries, resumable sessions,
targeted review, defensive storage, desktop/mobile layouts, and preserved subject links.
Run the commands for the checkout being reviewed; this README does not substitute for
the actual validation results reported with the feature-branch delivery.

`worker-configuration.d.ts` contains generated Cloudflare runtime types needed by the
inherited source. Refresh them with `pnpm types` if the runtime configuration changes.
`wrangler.types.json` is for type generation; deployment configuration remains unchanged.

## Source provenance and privacy

The original study-site source was retrieved from its authorized Sites source repository
at commit `2b3f9a4`. Ecology and Social Sciences are the original source and assets,
not reconstructions. The original Ecology source directory is unchanged; the Pages
build only adjusts its generated navigation links for the publication subdirectory.
Third-party classroom rendering uses MIT-licensed Three.js; see `ASSET_LICENSES.md`.

Spanish vocabulary and SER were checked against both pages of the supplied class DOCX
and all three scanned PDF pages. Private originals and the handoff ZIP are excluded from
Git and public assets. All new conversations, classmates, origin examples, and schedules
are fictional; teacher dialogue is a practice simulation. See `CONTENT_NOTES.md` for
ambiguities and the limited mapping to official Fulton County goals.

The final proficiency brief also names a separate Nouns and Articles handout and a later
SER chart image. Those two additional artifacts were not present in the available package
and were not inspected. This revision uses the original DOCX article table, supplied
pronoun/SER charts, and examples explicitly included in the new brief. Fresh questions
practice those skills without reproducing an actual test or claiming an official answer key.

Rikki content follows the supplied typed handoff. Original worksheet photographs and
a full story edition were not supplied in this turn and were not independently inspected.
Existing correct reasoning listed in the handoff is reinforced through the examples.
No direct quotations are presented as Kipling's text. Missing worksheet content stays
pending, and new practice questions are labeled separately from supplied quick checks.
The original handoff and private learner information are not copied into the repository.

## Original Sites production build

```bash
pnpm build
```

This retains the inherited Sites build. Use `pnpm build:pages` for GitHub Pages.
Publishing to GitHub Pages does not update the older `chatgpt.site` address.

The October 5 beginner-flow and graphics update is documented in `SPANISH_INTUITIVE_REPORT.md`.
