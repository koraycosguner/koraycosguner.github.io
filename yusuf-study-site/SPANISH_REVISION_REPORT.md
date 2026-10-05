# Spanish school-day revision — October 5, 2026

## Delivered behavior

Spanish now opens **Un día en la escuela**, one connected day with Sra. Abarca and the
recurring fictional classmates Mateo, Sofía, Carlos and Ana. Seven linked places contain
forty interactions: 24 contextual three-choice turns, eight sentence builders with exactly
three options at each step, and eight supported short responses. Choice/building support
precedes typing. The final six-turn conversation unlocks the band-room reward, with an
optional, explicitly enabled three-note instrument. No continuous animation or automatic audio.

The story repeats yo → soy and tú → eres, connects addressed/discussed groups to pronouns,
and teaches object functions, hay, classes/preferences, adjective agreement and all nine
SER uses in the supplied guide. The compact guide opens without losing the current turn;
SER discovery sections fill as encountered. Optional English context remains available.
Wrong responses give a small hint and allow immediate retry; models/explanations appear
after success. Completed steps never revoke access or award repeated completion.

A visible backpack panel is the source of truth for inventory questions. Scissors change
from absent to one pair after the correct packing action. The decorative backpack art is
not used as an exact-count key. Class times, character behavior, origins and preferences
are fictional practice examples, not learner biography. Source ambiguities remain in
CONTENT_NOTES.md: goma/glue, pluma/bolígrafo, carpeta enrichment, mixed-group ellos and
DOCTOR description/characteristics overlap.

Six original illustrations establish a consistent school world. Optimized WebPs total
about 1 MB. The classroom artwork is reused for welcome and supplies; there is no claim
of seven distinct originals. All selected scenes were visually inspected. One proposed
extra welcome illustration failed generation; the successful classroom scene is used
instead, with no unresolved asset placeholder. Exact selected prompts and provenance
are recorded in SPANISH_VISUALS.md and ASSET_LICENSES.md.

The original 60-question graded quiz, full field guide and 3D/2D free classroom exploration
are preserved. Free exploration is now at `/quizzes/spanish/unit-2/explore/`. The quiz has
three-choice backpack items and clue-only incorrect feedback. An eight-step separate
checkpoint adds choices, builders and short conversation. Fourteen fresh review turns
select the concepts previously used with support, without negative labels.

## Progress and privacy

Story saves use `yusuf.spanish.school-day.v1`; original quiz grades and free exploration
retain `yusuf.spanish.unit2.v1`. Hint/guide use persists before an answer, including after
reload. First-response evidence stays distinct from corrections. A fresh checkpoint uses
only help from its current session, even if the same story concept was previously hinted.
Resetting the story preserves historical quiz grades and other subjects. Storage errors
allow continued play during the current visit. Typed responses are never stored.

No source worksheet, scanned chart, pasted handoff, real grade, private learner diagnosis,
family information or credential is in the application assets or committed revision.
No analytics, login, microphone, uploads or server learner-data storage was added.
The existing limited Fulton County goals statement remains; no unverified detailed
standards codes, district endorsement or proficiency certification were added.

## Actual validation results

- `pnpm test`: **24 passed, 0 failed** (content, grading, state, privacy and review).
- `pnpm typecheck`: **passed**.
- `pnpm lint`: **passed, 0 errors**, 10 nonfatal image-optimization warnings.
- `pnpm test:browser`: **20 passed, 0 failed** in one final Chromium run (48.2 seconds).
  This includes six new story cases, eight preserved Spanish cases and six Rikki cases.
- `pnpm build`: **passed**. Nonfatal large-chunk warning for the existing 3D dependency
  and Vinext's route-classification notice remain.
- `pnpm test:production`: **1 passed**, checking built worker and original Ecology,
  Rikki and all six new image assets. This is a build-artifact check, not a live deployment test.
- `git diff --check`: **passed**.
- Ecology assets are byte-for-byte unchanged from original source commit `2b3f9a4`.
  Root homepage, subject shelves and Rikki source/assets are unchanged from `f16034c`.
- Screenshots reviewed: desktop 1280px, phone 390px, completed sentence-builder surface.
  Browser overflow checks passed at 320px, 390px and 768px. Keyboard stage focus,
  double-click protection, modal Escape/focus restoration, blocked/corrupt storage,
  saved hint/resume state, checkpoint independence and safe typed-input retry passed.
  The full forty-turn journey, exact backpack change, final conversation, band reward,
  60-question quiz grade and targeted review were exercised through the browser.

Earlier development runs caught a keyboard-focus issue and test-selector/ID mistakes;
these were corrected before the final all-green run. A read-only curriculum and state
review also caught checkpoint assistance inheritance, corrected and covered by the
final checkpoint test. Actual screen-reader software, Safari/Firefox, physical devices
and browser voice quality were not tested.

## Files and editing

- `spanish/story-content.ts`: all editable story/review dialogue and accepted answers.
- `spanish/StoryApp.tsx`, `StoryGuide.tsx`, `story-learning.ts`, `story.css`: story,
  compact reference, progress/adaptivity and responsive presentation.
- `app/quizzes/spanish/`: main story routes plus new explore/checkpoint routes.
- `public/quizzes/spanish/school-day/`: six original illustrations.
- `spanish/content.ts`, `SpanishApp.tsx`: small preserved-quiz feedback/choice updates.
- `tests/story.test.ts`, `tests/browser/story.spec.ts`: new coverage.
  Existing Spanish browser routes and production asset coverage updated.
- `package.json`, `eslint.config.mjs`: new test command and browser-save hydration rule.
- README, CONTENT_NOTES, ASSET_LICENSES, SPANISH_VISUALS and this report updated.

From the authorized repository's `yusuf-study-site/` folder, use Node 22.13+ and pnpm:

```sh
pnpm install
pnpm dev
```

Local story: `http://localhost:3000/quizzes/spanish/unit-2/`.
The folder is editable source; a GitHub push does not publish this Vinext application
through GitHub Pages. This revision is for the feature branch `feature/spanish-school-day`
in `https://github.com/koraycosguner/koraycosguner.github.io`.
No live deployment, main-branch merge or force-push is part of this revision.
