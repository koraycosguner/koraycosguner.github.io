# November Cells Major update: acceptance report

November 6, 2026. Existing repository extended in place: `koraycosguner/koraycosguner.github.io`. Feature branch: `feature/cells-nov11-transport`, based on `d98b9d5`. That baseline includes the previously published ELA and Cell Lab updates plus unrelated repository changes, all preserved. The user explicitly authorized publication after testing in the November 6 conversation, superseding the handoff's feature-only publishing restriction.

## Delivered

- Nine focused mini-lessons with worked examples and 36 three-choice guided questions, covering Concepts 1–3 and the organization hierarchy only.
- A Transport Lab with fifteen selectable starting models, predictions before reveal, legible concentration/volume data, selective permeability, both-way equilibrium, three membrane routes, animal/plant osmosis outcomes and two three-step vesicle storyboards. An optional paired diagram compares endocytosis and exocytosis.
- A 43-item adapted practice major: 41 objective points plus two separate written explanations with six human-review rubric points. Twenty-two items concern transport or energy. Four-choice multiple-choice, both cell diagrams and two ordering tasks are included. Answers and hints remain hidden until final submission; answers can be revised on the final review screen.
- Saved drafts, breaks, completed practice grades and written responses; skill-specific fresh review with 33 new question variants; immutable first-answer practice evidence and separate assistance records.
- Nine typable/printable study sheets and a separate printable website answer key. Original source packages are private rather than public downloads.
- Five new direct-loadable routes, linked through the Science and Cells shelves. Earlier Concept 1, complete Concept 2 labeling/analogy activities and every other subject remain available.

## Verification

- Unit/content/score/save suite: **241 passed, zero failed**.
- TypeScript: **passed** at the final source snapshot.
- Complete browser regression: **107 passed, zero failed, zero skipped, zero flaky**, in 7.8 minutes. Includes the first eight November cases and all 99 existing Science, ELA, Ecology navigation, Spanish Units 2/3, classroom, stories, audio fallback, Rikki-Tikki-Tavi, Social Sciences and Pages routing cases.
- Final focused browser verification: **9 passed, zero failed, zero skipped, zero flaky**, in 45 seconds, after the final visual, grade-history, focus and full-review confirmation changes.
- GitHub Pages build and framework production build: **both passed**. Pages includes **65 direct-loadable routes**.
- Production artifact checks: **6 passed, zero failed**.
- Build/privacy integrity: **210 generated files match** the tested Pages output byte-for-byte. Hash comparison excludes every original file from the supplied complete package from public output. No original PDF/DOCX/PPTX/ZIP or learner records were staged for this update.
- Responsive verification: 320, 390, 768 and 1280 px, no horizontal overflow, tested answer/bank/placement controls at least 44×44 px. A real touch-emulated phone context exercised tap placement; desktop dragging and keyboard placement were tested independently.
- Visual review: phone osmosis layout, desktop plant plasmolysis and corrected net-water arrows, and the vesicle membrane pocket were inspected. Feedback now focuses/scrolls into view and offers a return to the updated model. Modal focus loops and restores, and the skip target is focusable.
- Print verification checks the print media presentation, full-text note rendering, hidden textarea controls, persistence and the separate 43-item answer key. Physical printing was not tested.

## Findings and fixes during audit

Initial content tests and the eight-case browser run passed. Manual visual review identified opportunities to improve feedback visibility, correct the vesicle pocket's inside/outside fill, and anchor arrows correctly after animal-cell shrinkage. Plant water loss now visibly separates membrane from wall. A final audit added reopening of saved grades/writing and confirmation before replacing a test already on its final review screen.

The first expanded nine-case run passed eight cases. Its single failure was a test locator matching the active vesicle diagram plus two hidden comparison diagrams. It was narrowed to the active model rather than changing valid UI behavior. The final rerun is recorded above. No existing-subject implementation changed after the complete regression run; final changes are limited to the new module and its tests.

Nonfatal inherited build notices remain for the large Spanish/3D chunk and framework route classification. Browser QA uses Chromium and touch emulation, not physical-device/Safari certification. Practice grades are not official school grades. Scientific models are simplified and not to scale; written explanations require human review. District standards certification and an exact copy of the forthcoming classroom test are not claimed. Details and source conflicts appear in `NOV11_CELLS_CONTENT_AUDIT.md`.

## Local preview and editing

Use Node 22.13+ and pnpm. In `yusuf-study-site`, run `pnpm install --frozen-lockfile`, `pnpm build:pages`, then `pnpm preview:pages`. Open `http://localhost:4173/yusufs-quizzes/subjects/science/cells/concept-3/`. For editing with reload, use `pnpm dev`. The QA server used port 4178 and is stopped at final delivery. Source is organized in `science/cells/nov11/`; README describes each editable file and route.

The final commit and remote publication identifiers are reported only after verification in the conversation.
