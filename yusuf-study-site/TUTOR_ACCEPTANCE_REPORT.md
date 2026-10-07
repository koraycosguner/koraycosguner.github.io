# Spanish Unit 2 tutor — implementation and acceptance audit

October 7, 2026. The owner authorized this revision and publication to the existing
GitHub Pages hub. The editable source is `yusuf-study-site/`; the published build is
`yusufs-quizzes/` in `koraycosguner/koraycosguner.github.io`.

## Scope and source handling

All three supplied master-brief parts were read, including all numbered sections
1–132 and the continuation inside section 108. The pasted interruption text was
not treated as a product feature. The new brief's calm tutor direction takes
precedence over earlier requests for a game-heavy Spanish landing screen.

Work began from the clean authorized repository at `d0c3884`, containing the
October 6 calm-study revision. The older separate output checkout was not copied
over it. No original class documents, private handoffs, learner records or credentials
are included. New examples and characters are fictional. Existing non-Spanish source
and public subject assets remain unchanged.

The inspected source corpus and missing-source boundaries are documented in
`TUTOR_COVERAGE.md` and `TUTOR_CONTENT_AUDIT.md`. The separate later articles handout,
chart image and actual study-guide photographs were not available. This is original
practice based on the available materials and explicit supplied examples; it is not
an official assessment, official answer key or a new standards-alignment claim.

## What the learner can do

- Start studying from one obvious primary button. A short session combines tiny
  teaching frames, worked practice, picture vocabulary, listening, retrieval and
  teacher-style questions, with a checkpoint after five questions.
- Choose Learn, Practice, Vocabulary, Listening, Test or My Progress. Learn has six
  readable concept groups, with articles/HAY under a supplementary disclosure.
- Follow the same subject through connected pronoun/SER, adjective and ownership
  sentence builders; or follow an ordered six-stop school day from arrival to test.
- Hear words and complete examples on demand. Replay cancels the previous clip.
  Reading support is available when speech cannot start or no Spanish voice exists.
- Study all 66 assigned/enriched words with context, meaningful images, pronunciation
  controls and optional English meanings. Eight priority words have seven activity
  representations; the rest have four plus the preserved older activities.
- Use multiple choice, picture-to-word, word-to-picture, five listening formats,
  tap/drag word banks and tap/drag sentence builders. Typing is not required.
- Get a brief correction and a different example of the same concept after a miss.
  Remediation is bounded to three extra questions, so mistakes cannot create an
  endless session or block access to the rest of the website.
- Take an 18-question test covering pronouns (4), SER (4), SER + de (3), adjectives
  (3) and vocabulary (4). Teaching pictures, hints, reference and immediate answer
  feedback are hidden until the test ends. Pause/resume retains the first answers.
- See first-answer scores by group, review individual misses and start fresh targeted
  practice. Listening is measured separately and is not inferred from a written test.
- Resume locally saved sessions and inspect per-skill/per-word evidence, recent tests
  and common confusions. A confirmed reset affects only the new tutor's record.
- Reach the earlier long tests, field guides, illustrated school-day adventure and
  classroom exploration through More Unit 2 activities. Ecology, Rikki-Tikki-Tavi
  and Social Sciences remain available from the main subject hub.

## Learning and scoring audit

The content bank is authored and validated; there is no runtime-generated Spanish.
Stable question/choice IDs separate presentation order from answer keys. Pronoun
contexts explicitly distinguish the speaker, addressee, people discussed, all-female
and mixed groups, formality and Spain's informal plural. SER follows the grammatical
subject; possession follows the number of owned objects. Adjectives include gender,
number, invariant-gender forms and accented plurals.

First answers remain immutable. Worked examples, lesson mode, supplied sentence pieces,
hints, reference and reading support count as assisted learning. A correction does not rewrite a score.
Readiness requires two distinct independent examples after the most recent concern,
and two activity representations where that skill has multiple available formats.
Repeating a supported or previously missed item cannot manufacture readiness. Correct
teaching revisits also do not erase existing independent readiness; actual errors and
learner-requested help identify concerns.

Review prioritizes actual concerns and uses unseen examples, with reteaching followed
by reduced support. Once the finite fresh bank is exhausted, the UI says so and offers
learning/practice rather than presenting an empty screen or claiming new evidence.
Older strong skills reappear according to later session counts, not calendar-based
notifications. Readiness labels are practice estimates, not predicted school grades.

## Visual and audio audit

Three original built-in imagegen assets show one book, a complete laptop and a cafeteria
lunch. Their optimized WebP files total 146,226 bytes. Existing school-day art is reused;
schedules, pronoun groups, ownership and abstract-word contexts use editable SVG.
Every referenced visual has a specific accessible name. Later independent picture
activities can use alternate drawings of familiar objects to support transfer. Failed rasters fall back to
vector renditions. Images support learning; optional contextual images fade with
readiness, and teacher tests hide teaching visuals.

The visual audit corrected a plural stack used for singular libro, mixed-group
composition, ownership count/owner mismatches, overlapping adjective distractors and
an overgeneralized adjective-ending diagram. It also corrected integrated SVG sizing,
mobile hero caption positioning, disclosure affordances and low-contrast small text.

Audio uses the browser/device's available Spanish speech voices, preferring appropriate
es-US/es-MX and natural/enhanced voices, then other Spanish locales. It never silently
uses English speech. The hook handles delayed voices, replay cancellation, stale events,
errors, blocked starts, navigation and reference-panel closing. A listening event counts
only after the actual speech-start callback. Reading fallback does not earn independent
listening evidence. No speech recognition, microphone or learner recording is used.

The exact art prompts, asset paths, voice-selection policy and media audit are recorded
in `TUTOR_MEDIA_NOTES.md`. `TUTOR_UX_AUDIT.md` records the independent interface audit.

## Requirement traceability

Every numbered part is represented below. Related directions share evidence rather
than creating 132 separate user-facing features.

| Brief parts | Implementation / audit evidence |
|---|---|
| 1–4 | Simple home; generated short session; tiny teach-before-practice frames; reasoning chains |
| 5–11 | Twelve pronouns, six SER forms, origin, ownership and adjective lessons and keyed practice |
| 12–15 | 66-word catalog; meaningful pictures; picture→word and word→picture activities |
| 16–19 | Tap-to-play Spanish words/sentences; five listening formats; replay and fallback |
| 20–22 | Ordered school-day lesson, contextual vocabulary and tap/drag word banks |
| 23–26 | Kind precise correction, fresh parallel examples, per-skill evidence and fading scaffolds |
| 27–28 | 18-question teacher-style test, grouped score, missed-question review and next practice |
| 29–36 | Quiet progress, short activities, contextual variety, retrieval, hints and bounded correction |
| 37–41 | Dedicated vocabulary/listening; optimized local illustrations; isolated audio lifecycle |
| 42–45 | Supplied study-guide patterns; natural sentence models; six Learn groups; reference dialog |
| 46–50 | Local session memory; independent evidence; weak-skill priority; Why; test-to-learning loop |
| 51–54 | No timers/lives/noisy rewards; responsive touch and keyboard controls; lazy local assets |
| 55–60 | Separate content/types/engine/UI/media; reusable formats; validated deterministic keys |
| 61–64 | Immediate first step; optional modes; finite session summary; factual progress disclosure |
| 65–69 | Protected older subjects/saves; phased implementation; pure, browser and production checks |
| 70–74 | Tutor-first flow, component prerequisites, grammar/vocabulary connections and varied formats |
| 75–80 | Image-first and listening models; contextual prueba/examen; confusion tracking and contrasts |
| 81–89 | Optional English; accented typography; no typing burden; connected sentence builders |
| 90–94 | Replay lifecycle; reading fallback; optional slow-rate helper; abstract visuals; test hiding |
| 95–100 | Varied review, bounded difficulty, feedback timing, misses and limited readiness estimates |
| 101–106 | Confirmed scoped reset, failure states, editable content depth and coverage audit |
| 107–113 | Full guided/test walkthroughs; viewport, key, image, audio and pedagogical audits |
| 114–118 | Relevant visual/audio context, non-question teaching screens, progressive disclosures |
| 119–124 | Current Unit 2 coverage, school-style practice and simple six-mode navigation |
| 125–130 | Visual polish, empty/error states, factual progress, extension structure and acceptance checks |
| 131–132 | This report, linked detailed audits, verified repository delivery and public URL |

## Validation results

- **110/110 pure/content/state/audio tests passed** in the final unit run. This includes
  14 new content checks, 22 tutor-engine checks, five audio helpers and the existing
  subject/Spanish state tests.
- **58/58 full browser regression scenarios passed**, covering the preserved subjects,
  legacy Spanish flows and the first seven tutor scenarios. After the audit added
  connected lessons and tightened scoring, **10/10 follow-up browser checks passed**:
  eight tutor scenarios plus both Pages route/subject checks. Final visual refinements
  were then checked by rerunning the eight tutor scenarios.
- The browser flows completed a guided session with an intentional miss and a fresh
  correction; an 18-question test with five intentional domain-specific misses scored
  **13/18 = 72%**, retained that first score on reload, reviewed misses and launched
  unseen targeted practice. They also completed all four connected lessons through
  normal Learn/Practice navigation.
- Every one of the **27 published routes** loaded directly and after refresh; the
  subject hub linked to Spanish, original Ecology, Rikki and Social Sciences.
- All ten interaction formats passed. Word banks and sentence builders were tested
  with actual HTML5 drag/drop and with tap/keyboard-compatible placement. Tested
  controls remained unclipped and at least 44 pixels high at widths **320, 390, 768
  and 1280**. The older interfaces retain their own responsive regression coverage.
- The independent visual audit exercised 20 route/viewport combinations, inspected
  screenshot pixels, checked all 87 visual descriptions and simulated failed WebP
  loads. Raster failures retained meaningful vector alternatives.
- Keyboard navigation, Escape/focus return, selected-answer persistence, completed
  results, confirmed scoped reset, malformed/blocked storage and old-save isolation
  passed. Test mode had no teaching aids or answer feedback before completion.
- Audio tests verified Spanish-only voice selection, confirmed-start evidence, replay
  cancellation, no-start fallback and exclusion of supported reading from Listening
  readiness/scores. The independent UI audit checked reference-panel audio cleanup.
- **Type checking, both production builds and the production-output test passed.**
  ESLint reported **0 errors**, with 18 native-image optimization advisories. The
  build reports the pre-existing large optional Three.js classroom chunk; it remains
  separate from the new tutor bundle. `git diff --check` passed.
- Privacy/scope checks found no private source attachments or learner saves in new
  tracked/public files, no credentials, and no edits to protected non-Spanish source
  or original subject assets. Static route entry files and bundle names regenerate
  normally when the shared build changes.

Detailed local run logs and screenshots are in the ignored `test-results/` directory.
The executable checks are committed under `tests/`; generated reports do not contain
real learner records. Browser check totals above describe successive runs rather than
adding repeated cases together.

## Practical limits

- This audit verifies implementation and content logic, not learning effectiveness for
  an individual learner. The length estimate is approximate and no timer penalizes pace.
- Actual audible voice quality depends on the device's installed Spanish voice and
  speakers. Mocked lifecycle checks do not certify audible pronunciation on every device.
  No professionally recorded voice library is claimed. The optional slow-rate helper is
  available to future controls; the current learner interface uses normal replay.
- Chromium and responsive/touch emulation are tested. Native iPhone/iPad Safari, VoiceOver
  and a physical touchscreen were not independently exercised in this release.
- No question bank is infinite. Exhausted fresh review is disclosed. A single short
  test samples five domains and cannot assess every vocabulary item or listening skill.
- Saves are local to one browser/origin. The GitHub Pages address does not import progress
  from the older chatgpt.site address. Publishing here does not update that older host.
- Original worksheet omissions and overlapping classroom terms are documented; no
  missing document, exact official answer key or universal prueba/examen distinction is invented.

## Setup and editing

From the editable `yusuf-study-site/` folder, with Node 22.13+ and pnpm:

```sh
pnpm install
pnpm dev
# http://localhost:3000/quizzes/spanish/

pnpm build:pages
pnpm preview:pages
# http://localhost:4173/yusufs-quizzes/quizzes/spanish/
```

For this audit, an additional preview used port 4175 so an existing preview was left
running. Change authored content in `spanish/tutor-content.ts`; change learning logic in
`tutor-learning.ts`, UI in `TutorCenter.tsx`/`tutor.css`, and media in `TutorVisual.tsx`/
`useTutorAudio.ts`. Add new routes to both static route maps. Rebuild static output before
copying it to the repository-root `yusufs-quizzes/` directory; source-only pushes do not
update the public site. Full instructions are in `README.md`.

## Repository delivery

Remote verified: `https://github.com/koraycosguner/koraycosguner.github.io.git`.
Feature branch: `feature/spanish-visual-audio-tutor`; publication branch: `main`.
The tested editable source and its generated static output are committed together.
The owner explicitly authorized the public update. No force push or other hosting
provider change is part of this release. The delivery message records the final commit
and actual live deployment check, which are verified after this source report is saved.
