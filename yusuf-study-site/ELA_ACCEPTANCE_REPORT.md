# ELA Sentence Studio acceptance report

Date: October 24, 2026 (America/Indianapolis). Existing source extended in
`koraycosguner/koraycosguner.github.io`, feature branch
`feature/ela-phrases-clauses`. The requested public destination is
`https://koraycosguner.github.io/yusufs-quizzes/`.

## Requirements and implementation

| Requirement | Implemented behavior |
| --- | --- |
| Existing ELA section | Language Arts shelf links to Sentence Studio and retains Rikki-Tikki-Tavi. Home now describes both grammar and story practice. |
| Exact primary materials | All four worksheet photographs inspected; all 23 teacher items preserve word groups and sentence-ending punctuation. Worksheet answer-blank colons are not treated as sentence punctuation. Photos/handwriting stay ignored and private. |
| Learn the Basics | Eight short frames cover subjects, verbs including states of being, subject–verb pairs, phrases, clauses, complete thoughts and dependent clauses. Interactive blue/orange highlighting and stand-alone/connected block visuals are included. |
| Guided then teacher practice | Each of four levels has a short worked example and two guided items before every exact teacher item. Levels 1/2/3/4 contain 4/8/8/3 teacher items. |
| Level 1 | Separate clickable subject and “verb or verb form” banks; missing options are available. Running is accepted as a verb form with no stated subject/complete main verb pair. |
| Level 2 | Two large Phrase/Clause options; feedback explains actual subject/verb evidence. A dependent clause remains a clause. |
| Level 3 | Two Independent/Dependent options. Original artist/book lines remain intact while neutral marks scope the smaller relative clauses. Feedback explains the whole noun phrase versus complete complex sentence. Scope colors do not reveal the classification. |
| Level 4 | Three large editable text fields presented one at a time; no exact-string or keyword grader. Model, alternative revisions and four-point self-check appear after an attempt. Removing the dependency marker is shown as valid where appropriate. |
| Writing persistence | Drafts and submitted/revised writing survive reload and activity changes. “My saved writing” keeps answers editable. Test drafts start blank and are stored separately from practice writing. Editing clears stale self-check marks. |
| Build a Complete Sentence | Two short builds support click/tap and keyboard placement, removal, undo and clearing. No required drag interaction. |
| Study Guide Review | Twelve questions mix familiar teacher items with new examples, including two rewrites; help and retries remain available. |
| Practice Test | 19 screens: 4 subject/verb, 6 phrase/clause, 6 independent/dependent, 3 writing. No hints, model answers or correctness on active test screens. |
| Transparent score | One point per complete automatically checked question; both subject/verb fields must be right on a paired task. First answers determine the 16-point result and percentage. Writing is explicitly separate, with self-check counts. |
| Targeted review | Separate per-skill first-answer records include help usage. A 12-item fresh bank (two per skill) supplies unseen questions for missed concepts and reports exhaustion; retries cannot rewrite first evidence. |
| Calm, concrete visuals | Thirteen original local WebP scenes, each 1200×800 and under 200 KB. One scene per activity, clear captions, generous spacing, large controls, labeled colors, no timer/lives/XP, optional help and Save & take a break. |
| Local progress | Separate `yusuf.ela.phrases-clauses.v1` key. Corrupt raw saves are preserved until explicit reset; denied storage allows studying. Reset is scoped to ELA and requires confirmation. |
| Direct links | Nine ELA routes work with the GitHub Pages prefix. Total static build has 45 direct-loadable routes. |
| Existing subjects | Learning source and save keys for other modules were retained. Existing navigation regression expectations were updated only for the new Language Arts shelf description. |

## Source and limitations

`ELA_CONTENT_AUDIT.md` records every teacher item, exact keys, ambiguity handling
and primary Purdue/Cambridge references. The simplified phrase classification
follows this worksheet's traditional classroom framework; it does not claim to
cover every advanced grammar framework. No teacher endorsement, official
assessment equivalence or standards certification is claimed.

Open-ended grammar is intentionally self-checked, not automatically validated.
Pictures provide context; visible words determine answers. Original artwork
prompts, processing and image review are in `ELA_MEDIA_NOTES.md`.

## Verification

- Full unit suite: **195 passed**, including **22 ELA content/learning checks**.
- TypeScript: passed.
- ESLint: **0 errors, 23 native-image warnings**. Images are precompressed local assets suitable for static GitHub Pages hosting.
- Production build: passed; **4 production artifact checks passed**, including all 13 ELA images and nine source routes.
- GitHub Pages build: passed; **45 direct-loadable routes**.
- Existing-subject browser regressions: **76 passed, 0 failed, 0 skipped**, including Cells, Ecology navigation, all Spanish experiences, Unit 3, Rikki-Tikki-Tavi and Social Sciences.
- Final ELA browser suite: **10 passed, 0 failed** against the final static build, including all teacher questions, model-answer gating, a deliberately imperfect 13/16 = 81% test result, fresh review, writing edits across activities, storage fallback and scoped reset.
- Local reports: `test-results/ela-final-browser-results.json` records the full existing-subject run; `test-results/ela-verified-browser-results.json` records the corrected final ELA run.
- Viewports: **320, 390, 768 and 1280 px** checked without horizontal overflow, with **44×44 px or larger** tested answer targets. Native touch-emulation taps and keyboard sentence building were exercised.
- Screenshots inspected: desktop/phone home, relative-clause scope/feedback, written-response self-check, test result and tablet builder. All 13 artwork originals/final assets were inspected; an internal contact sheet confirms the contexts and overall palette.
- Privacy verification: all four teacher photographs are ignored/untracked, none of their original bytes are present in public assets, and all 13 new scenes meet the size/dimension bounds.

The initial source/learning checks identified retry-resume normalization and
verified its correction across every intermediate session state. Browser review
identified an incorrectly rewritten URL suffix; URL construction was corrected
before release. An independent source review found that purple scope marks
would cue a dependent-clause answer; neutral gold scope marks and a neutral
banner replaced them. Screen-reader text states the exact words to classify. Test development also corrected accessible-name and
entry-route resume expectations. The full 86-case run passed 85 cases; its only failure was a test locator attempting a checkbox inside a closed writing panel. The locator was narrowed to the opened panel. The complete final 10-case ELA rerun passed, so all 86 unique browser cases are covered by passing results (76 existing + 10 ELA). After the full run, final ELA-only changes improved short-screen spacing and contextual intro artwork, and kept saved-writing models/checklists hidden until an in-progress test finishes; the final ELA rerun covers those changes. Final visual QA also hid the unfocused skip link in scrolled full-page captures and added the sentence-builder ingredient legend.

Known nonfatal build output includes the inherited large Spanish/3D chunk and
Vinext route-classification warnings. Browser coverage is Chromium with touch
emulation, not a separate physical-device or Safari certification.

## Files and setup

- Content, learning, types, interface and CSS: `ela/`.
- Routes: `app/quizzes/phrases-clauses/**`, static routes/loader and the Pages URL transformer.
- Navigation: Language Arts shelf and its homepage description.
- Media: `public/quizzes/phrases-clauses/`; generated Pages build in repository `yusufs-quizzes/`.
- Tests: ELA content/engine/browser suites, production artifact check, and one updated existing navigation locator.
- Documentation: README, asset provenance and three ELA audit/media/acceptance documents.

Use Node 22.13+ and pnpm 11.19.0. In `yusuf-study-site`, run `pnpm install`,
`pnpm build:pages`, then `pnpm preview:pages` (default 4173). The current preview
uses `http://127.0.0.1:4176/yusufs-quizzes/quizzes/phrases-clauses/`.

Commit and deployment identifiers are reported only after their remote state is verified.
