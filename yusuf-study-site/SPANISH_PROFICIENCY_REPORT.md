# Spanish Unit 2 proficiency revision — verification report

Checked October 5, 2026. This revision updates the existing application; it is not a
reconstruction. The authorized destination is
`koraycosguner/koraycosguner.github.io`, branch `feature/spanish-proficiency-prep`.
The branch includes editable source in `yusuf-study-site/` and generated preview-ready
output in `yusufs-quizzes/`. Initial delivery was feature-only at GitHub commit `8076ec2`.
The owner subsequently authorized publication on October 5, 2026. This release promotes
that tested revision to `main`, whose previous published baseline was
`61ae563fea6657b05f8cdbc3c17a94f4f992e593`.
The public study hub is https://koraycosguner.github.io/yusufs-quizzes/.

## Delivered

- A Spanish hub connecting Learn, the existing school-day adventure, mixed test prep,
  and the full practice test.
- Ten short lessons, 30 guided questions, and an interactive backpack. Visual people,
  speaker/listener groups, and WHO → PRONOUN → SER connect meaning to grammar.
- Complete assigned backpack/classroom vocabulary, all ten school subjects, articles,
  plurals, HAY, descriptions, likes, origin, and gradual DOCTOR reference material.
- Twelve-question mixed rounds in a recurring school-day setting.
- An 88-question full test with 94 scored responses, six paired questions, eight
  Cierto/Falso items, and 11 questions using four short passages. All remaining
  responses have exactly three choices. Answers appear after submission.
- Forty fresh targeted-review questions across 22 separately tracked skills. Readiness
  requires two distinct independent examples after a miss or supported attempt.
- Browser-local first-answer scores, separate help/retry evidence, pause/resume,
  completed-result recovery, scoped confirmed reset, and storage failure handling.
- Existing Spanish adventure, 60-question quiz and saved grades, optional 3D classroom,
  accessible 2D exploration, Ecology, Rikki-Tikki-Tavi, and Social Sciences retained.

## Actual validation

| Check | Result |
| --- | --- |
| `pnpm test` | 50 passed, 0 failed |
| `pnpm typecheck` | Passed |
| `pnpm lint` | 0 errors; 16 image-element advisories |
| `pnpm build` | Passed |
| `pnpm build:pages` | Passed; 16 physical direct-load routes |
| `pnpm test:production` | 1 passed, 0 failed |
| Complete Playwright regression suite at `/yusufs-quizzes/` | 32 passed, 0 failed |
| Final proficiency browser follow-up after mobile/contrast corrections | 8 passed, 0 failed |
| Protected-subject and public-asset comparison | No original public assets or unrelated subject source changed |
| Public/generated privacy inspection | No private source documents, credential files, or actual learner records found |
| `git diff --check` | Clean |

The complete browser run finished all 94 full-test responses, deliberately missed one,
checked the first-answer score, reloaded the saved result, and completed fresh targeted
review. It also ran the earlier 60-question quiz, the connected 40-turn adventure,
Rikki lessons/practice, Ecology navigation and a quiz entry, and the Social Sciences
quiz entry. Direct loading and refresh were checked across all 16 routes with no missing
local assets or uncaught page errors in that route sweep.

Every new teaching screen was checked at 320, 768, and 1280 pixels wide. Additional
phone checks use 390 pixels. Tests cover keyboard answering, skip-link visibility,
dialog focus return, reduced motion, control clipping, primary-button hover contrast,
visible inventory changes, guided retries, two-step reloads, corrupted/blocked storage,
and reset isolation. Desktop and phone screenshots were visually inspected.

Review found and fixed a crowded legacy navigation row, an internally clipped backpack
control at 320 pixels, pale primary-button hover, missing guided resume controls on the
Learn route, two premature answer clues in English test context, and misleading empty
review wording. Regression assertions cover those behaviors.

## Acceptance coverage

| Requirement | Evidence |
| --- | --- |
| Explain before major grammar practice | Ten lesson modules, each followed by guided checks |
| Visual nosotros / ustedes / ellos / ellas | IN / TO / ABOUT diagrams with explicit speaker/listener/group metadata |
| Pronouns tied to every SER form | Lesson chains, six paired full-test questions, secondary vosotros/sois reference |
| Articles and plurals | Eight articles, gender/number matching, chico/chicos and lápiz/lápices |
| Complete vocabulary worlds | Content coverage assertions plus all vocabulary decks exercised in browser |
| Visual HAY | Live item counters and inventory-based test questions |
| Connected context and teacher-style formats | Six school-day worlds, recurring characters, three-choice items, paired steps and readings |
| Mixed and full-test modes | Dedicated routes and complete browser runs |
| Fresh adaptive review | Disjoint review bank; all 22 skills tested through miss and independent recovery |
| Mobile and keyboard operation | Responsive, clipping, contrast, focus, dialog, and keyboard checks |
| Existing Ecology preserved | Original source/assets unchanged; direct route, navigation, and quiz entry pass |
| Privacy | Original documents excluded; learning records stay in browser storage |

## Source limits and remaining verification

The original vocabulary DOCX, subject-pronoun/SER chart, and DOCTOR chart were available.
The separate Nouns and Articles handout and later SER image named in the final brief were
not available. Article instruction therefore follows the original vocabulary document's
article table and the brief's explicit examples; those two missing files have not been
independently verified. See `CONTENT_NOTES.md` for ambiguity handling and source scope.

Browser automation used Chromium with phone/tablet/desktop viewports. Safari, Firefox,
physical-device testing, and formal accessibility certification were not performed.
Optional speech depends on the browser's installed Spanish voices; missing-voice fallback
was tested. Both builds retain a nonfatal large-chunk warning for the optional legacy 3D
module; Vinext also reports its existing route-classification limitation. No new standards
alignment or learning-outcome certification is claimed.

## Files and preview

Primary new files: `spanish/ProficiencyApp.tsx`, `spanish/ProficiencyLessons.tsx`,
`spanish/proficiency-content.ts`, `spanish/proficiency-learning.ts`,
`spanish/proficiency.css`, and `spanish/proficiency-lessons.css`.

Routes: updated `app/quizzes/spanish/page.tsx`, plus the `unit-2/learn`,
`unit-2/test-prep`, and `unit-2/proficiency` pages. The adventure welcome links to the
new hub; `StoryGuide.tsx` adds perspective/articles and encountered SER uses.

Supporting changes: three proficiency test files, existing browser routing assertions,
test registration, lint configuration, README/content notes, and static-build wiring.
`pages/` was renamed `static-pages/` so Vinext does not treat static entry helpers as
application routes. Generated GitHub Pages HTML and bundle names change with the build.

From the editable source directory:

```sh
pnpm install
pnpm build:pages
pnpm preview:pages
```

Open `http://localhost:4173/yusufs-quizzes/quizzes/spanish/`.
For development, use `pnpm dev` and `http://localhost:3000/quizzes/spanish/`.
The README contains all test commands and editing guidance. Publication of this revision
is authorized; the deployment should be verified at the public GitHub Pages address
separately from confirmation of the Git push.
