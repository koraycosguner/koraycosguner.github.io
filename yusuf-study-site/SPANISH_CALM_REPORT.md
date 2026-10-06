# Spanish Unit 2 — calm study-guide update

Verified October 6, 2026. This implements the latest MASTER CODEX UPDATE and supersedes
its earlier dashboard-style brief. Delivery is on a feature branch only; no deployment.

## Repository and delivery

- Repository: https://github.com/koraycosguner/koraycosguner.github.io
- Branch: `feature/spanish-calm-study-guide`
- Base: `161437e75858a216f5764bee96dd1c7d67fb41d7`
- Editable source: `yusuf-study-site/`
- Tested generated output: `yusufs-quizzes/`
- GitHub Pages configuration was checked: it publishes `main`, not this feature branch.
- Both the current GitHub Pages publication and the older `chatgpt.site` publication
  remain unchanged. The feature branch needs separate owner authorization to deploy.

## What changed

The Spanish home now has exactly four main choices: **Learn**, **Story Practice**,
**Complete the Story**, and **Unit 2 Practice Test**. It uses a quiet background,
large controls, whitespace, a short context, and one question at a time. No XP,
lives, permanent reference walls, or competing task panels appear in the new modes.

- **Learn:** 14 mini-lessons, one example per screen, followed immediately by 2–4
  questions each (47 questions total). Includes pronouns, IN/TO/ABOUT, all SER forms,
  formal usted, explicit Spain cases, origin, possession, agreement, articles, HAY,
  vocabulary, subjects/likes and DOCTOR.
- **Story Practice:** 28 connected school-day scenes (30 responses). Recurring
  classmates, changing group perspective, backpack/classroom tasks, schedule,
  descriptions, and a music-class finish. The adjective scaffold asks pronoun,
  SER, and ending separately before asking for complete sentences.
- **Complete the Story:** four short paragraphs, 20 blanks, small banks of six words
  including a distractor. Desktop dragging and touch/keyboard selection both work.
  Words can be moved, replaced, and removed without duplicating a token.
- **Sra. Abarca’s Study Guide Review:** a dedicated ten-stage sequence reached from
  Learn, including vocabulary banks, paragraph completion, and a mixed challenge.
- **Practice Test:** 90 questions / 93 scored responses. Mostly three choices,
  some four-choice teacher-style questions, seven Cierto/Falso items, short readings,
  and connected paragraph completion. Fresh examples use the supplied concepts.
- **Help and saving:** relevant references open on request and close with progression.
  Gentle practice retries preserve first responses. The test records help separately
  and scores each response once. Local progress survives reloads and pauses;
  replacing an unfinished answered session requires confirmation.

Earlier Spanish adventure, 60-question quiz, proficiency lessons/test, field guide,
and saved records remain available at their existing routes. Ecology, Social Sciences,
Rikki-Tikki-Tavi and other subject source content and original assets are unchanged.

## Files changed

Main source additions:

- `spanish/Unit2StudyApp.tsx`, `study.css`, `study-types.ts`
- `spanish/study-content.ts`, `study-learning.ts`
- `spanish/CompleteStory.tsx`, `complete-story.css`
- `spanish/word-stories.ts`, `word-story-learning.ts`
- Five page entries: `study/`, `story-practice/`, `complete-story/`, `practice-test/`,
  `study-guide/` under `app/quizzes/spanish/unit-2/`

Integration: `app/quizzes/spanish/page.tsx`, `static-pages/main.tsx`,
`static-pages/routes.ts`, `package.json`, the scoped hydration lint exception in
`eslint.config.mjs`, `CONTENT_NOTES.md`, and `README.md`.

Tests: new `study-content.test.ts`, `study-learning.test.ts`, `word-story.test.ts`,
`browser/study.spec.ts`, and `browser/word-story.spec.ts`. Two existing browser
navigation tests were updated to recognize the intentionally replaced Spanish home;
all earlier content and interaction assertions remain intact.

The generated `yusufs-quizzes/` route entries and bundles match the tested static
build byte-for-byte (81 files). Ecology and Southwest Asia generated assets are
unchanged. The build now supplies 21 directly loadable routes.

## Verification actually performed

| Check | Result |
| --- | --- |
| `pnpm test` | 69 tests passed |
| `pnpm typecheck` | Passed |
| `pnpm lint` | 0 errors; 16 pre-existing image advisories |
| `pnpm build` | Production Sites build passed |
| `pnpm build:pages` | Production static build passed; 21 direct routes |
| `pnpm test:production` | 1 test passed |
| Existing browser suite | 32 checks passed, including corrected home-navigation recheck |
| New study browser suite | 11 checks passed |
| New story-bank browser suite | 8 checks passed |
| Total unique browser checks | 51 passed |
| Generated output vs tested build | 81/81 files identical |
| Unrelated sources and original public assets | No changes |
| Private source documents in public output | None |

Browser checks used the actual production static output at a local server under the
GitHub Pages `/yusufs-quizzes` prefix. They exercised every new mini-lesson and its
questions, all 28 story scenes, the full 93-response test, the ten-stage study guide,
and all 20 word-bank blanks. Deliberate incorrect answers, assistance, corrected
retries, mid-question reload, result recovery, new-session confirmation, corrupt or
blocked storage, and preservation of other subjects’ saved records were verified.

The original full 94-response proficiency test, 60-question quiz, story adventure,
optional 3D room, Rikki paths and original Ecology navigation were also exercised.
One old navigation test initially failed because its selector recognized only the
old Spanish roots. Both the ready-state and heading selectors were updated for the
new root; the corrected test passed. Browser launch initially required macOS
permission beyond the sandbox; the approved Chromium runs completed successfully.

Responsive checks covered 320, 390, 768 and 1280 pixels. Touch alternatives, keyboard
navigation, focus, readable accented forms, large tap targets and horizontal overflow
were checked. Actual desktop and phone screenshots of the home, question, and paragraph
screens were visually inspected. This was Chromium plus the in-app browser; it does
not claim physical-device, Safari, or Firefox testing.

## Source boundaries and remaining issues

The five available class-material pages were inspected: two vocabulary pages, two
subject-pronoun/SER pages, and one DOCTOR page. The additional Nouns + Articles
handout, later SER image, and actual study-guide photographs were not available in
the supplied files. Their requested concepts and formats follow the explicit text
in the latest brief. No unseen worksheet was claimed as inspected and no actual
exam was reproduced. Private originals are excluded from the repository/output.

The two builds retain the existing optional-3D chunk-size advisory. Vinext also
reports its existing route-classification limitation; both builds succeeded. No
known functional blocker remains in the tested scope.
