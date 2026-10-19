# Unit 3 implementation and acceptance audit

Date: October 19, 2026. This is an additive revision of the existing source in
`yusuf-study-site`, with the static build in `yusufs-quizzes`. It preserves Unit 2,
Ecology, Language Arts and Social Sciences. The source was present; this revision
is not a reconstruction.

## Delivery scope

Authorized repository: `https://github.com/koraycosguner/koraycosguner.github.io.git`.
Feature branch: `feature/spanish-unit-3-school-day`, based on main commit
`5301a6b66254c62033b3cbb3ecd2a3fcfe41e30d`. Only the two Yusuf project folders
are included. The handoff explicitly requests a feature branch and prohibits a
production deployment without separate instruction. This revision does not merge
main, change hosting, or rerun a deployment. The public URL does not update merely
because this branch is pushed.

The new entry is `/quizzes/spanish/unit-3/`. Spanish home has a prominent Unit 3
link above the existing Unit 2 activities. Direct routes also exist for
`complete-story/`, `study-guide/`, and `practice-test/`.

## Implemented learning experience

| Requirement | Result |
| --- | --- |
| One school day | Five illustrated stories: arrival, calendar, schedule, finding science, departure. |
| Short lesson flow | A paragraph/dialogue, six questions, two checks, then next story. Optional same-concept fresh practice is capped at two extra tasks per session. |
| Low clutter | One question at a time, usually three large choices, calm spacing, no countdown/hearts/XP, optional English help and contextual references. Story re-reading is collapsed during questions and recorded as support. |
| Grammar/vocabulary | All six ESTAR forms and supplied pronouns; SER versus ESTAR; all sixteen prepositions; fourteen school terms; all weekdays/months; all required numbers/ordinals; dates, clocks, class order and start/end phrases. |
| Visuals | Two original game-style illustrations plus editable calendar, timetable, school map, clocks and sixteen relation diagrams. Accurate labels/times are code, not AI-generated text. |
| Complete the Story | Two five-blank paragraphs, native desktop dragging, keyboard/tap placement, clearing and replacement. Date building also supports dragging and tapping. |
| Study Guide Review | Mixed review or any of twelve categories, up to ten questions at a time. |
| Practice Test | 32 questions sampled with fixed category quotas, one reading passage and two visual questions. No in-test hints or correctness feedback. First answers determine the final percentage. |
| Feedback/retries | Immediate explanations in practice; optional same-question retry keeps the first score intact; fresh variants address errors. No access gates or penalties. |
| Adaptive practice | Fresh questions for weaker categories. Readiness requires two different independent correct examples after a concern. Word-bank/order activities remain supported evidence. |
| Persistence/privacy | Separate local key `yusuf.spanish.unit3.v1`; no uploads, account or analytics. Corrupt saves are preserved until explicit reset, and storage failures are visible. Reset affects only Unit 3. |
| Audio | Optional slow Spanish browser speech on each story, with reading fallback and stop-on-navigation. Availability and pronunciation depend on the device/browser voice. |

## Verification

- `pnpm typecheck`: passed.
- `pnpm lint`: passed with zero errors and 19 native-image advisories, including 18 existing advisories. Generated local visual-audit files are excluded from source lint.
- `pnpm test`: **144 passed**, including 13 Unit 3 content and 21 Unit 3 engine checks. Engine coverage includes 100 generated test selections, exact quotas, grade immutability, hint tracking, readiness, damaged saves, fresh dates, and token placement.
- `pnpm build`: production build passed. Vinext emits its existing static-analysis route-classification notice; it is not a build failure.
- `pnpm test:production`: **2 passed**, including preserved assets and new Unit 3 artwork/routes.
- `pnpm build:pages`: passed; **31 direct-loadable routes**, including all four new Unit 3 routes.
- Browser regression result: **67 distinct checks verified**. The full run completed 65 passes and two failures caused by old hub-label selectors. Both selectors were corrected, and both failed checks passed in the targeted rerun (2/2). All eight Unit 3 browser cases passed in the full run.
- New browser coverage: all five complete stories; both word-bank passages; date drag/tap; all 32 test answers and a known 28/32 → 88% grade; hint/retry/refresh preservation; fresh review; keyboard selection; unfinished-session confirmation; scoped reset; corrupted saves; denied storage; audio stop; deep links and mobile layouts.
- Integrated layout checks: 320, 390, 768 and 1280 CSS-pixel widths. No horizontal overflow; primary answers and interactive tiles meet 44-pixel target checks. Desktop/mobile screenshots reviewed.
- Separate visual audit: 28 scene/clock/relation examples at 320, 390, 768 and 1440 pixels. No overflow, broken images or page errors. Image-blocking test confirms the instructional drawing fallback. See `UNIT3_MEDIA_NOTES.md`.
- Manual in-app-browser review confirmed the opening page and first story are legible, uncluttered, and linked to the working local preview.

Initial checks found and corrected a mobile-calendar layout conflict, a saved
`seen`-list recovery edge, unrelated generated-gallery lint input, wrong concept
group labels, and context wording around lunch. Browser harness updates aligned
older hub selectors with “Units 2 & 3” and used a real multi-step mouse movement
for native drag-and-drop. These initial failures are not presented as passing runs.

## Source boundaries and remaining limitations

No separate Unit 3 teacher worksheet, answer key or bell schedule was supplied.
The scope comes from the handoff, with original example questions. Exact teacher
exam alignment and official standards alignment are not claimed. Known class
order and 9:00–3:45 endpoints are preserved. Intermediate times and P6/P7 breaks
are explicitly fictional examples; the map is a practice map. Tuesday October 20,
2026 is a fixed story date, not the viewer's current day.

The brief's after-lunch science-search sample was adapted to before P2 to match
the supplied order. Synonyms such as sobre/encima de and empieza/comienza are never
used as competing wrong answers. Full decisions are in `UNIT3_CONTENT_AUDIT.md`.

Grades are local practice estimates, not school records. Progress does not sync
across devices or browsers. The question bank is finite; exhausted fresh-review
pools are labeled honestly and ordinary review remains available. Responsive
checks use Chromium viewports, not physical iOS/Android devices. The two raster
scenes are illustrations; this unit does not introduce a navigable 3D game.

## Main editable files

- `spanish/unit3/content.ts`, `types.ts`: questions, stories, schedule and contracts.
- `spanish/unit3/learning.ts`: selection, feedback, scoring, review and save validation.
- `spanish/unit3/Unit3App.tsx`, `unit3.css`: screens, input and responsive layout.
- `spanish/unit3/Unit3Visual.tsx`, `visuals.css`: instructional graphics.
- `public/quizzes/spanish/unit-3/`: arrival and departure illustrations.
- Four `app/quizzes/spanish/unit-3/**/page.tsx` files and static route registration.
- `tests/unit3-content.test.ts`, `tests/unit3-learning.test.ts`, `tests/browser/unit3.spec.ts`.
- Integration changes to Spanish home, the subject-hub label, README, asset notes,
  test commands and generated static output. Other subject implementations are unchanged.

## Run locally

```bash
cd yusuf-study-site
pnpm install
pnpm build:pages
python3 -m http.server 4176 --bind 127.0.0.1 --directory pages-dist
```

Open `http://127.0.0.1:4176/yusufs-quizzes/quizzes/spanish/unit-3/`.
For editable development use `pnpm dev` and `/quizzes/spanish/unit-3/` without the
GitHub Pages prefix. `README.md` includes the runtime requirement and editing map.
