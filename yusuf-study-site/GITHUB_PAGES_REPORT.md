# GitHub Pages migration — October 5, 2026

Publication target: https://koraycosguner.github.io/yusufs-quizzes/

The static build reuses the current Spanish school-day adventure, 60-question graded quiz, classroom exploration, Rikki-Tikki-Tavi guide, original Ecology experience, and original Southwest Asia activity. Thirteen physical route entries support direct links and refreshes. Math remains a future shelf.

## Verification

- `pnpm build:pages`: passed; 13 route entries produced.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed with 11 existing image-element warnings, zero errors.
- `pnpm test`: 26 tests passed.
- Browser regression against the static subpath: all 22 learning-interaction checks passed.
- Two additional publication checks passed after fixing a mobile decorative overflow and making image checks wait for lazy images. They cover all 13 direct routes/reloads, local assets, subject navigation, latest Spanish examples, Ecology startup, Social Sciences startup, and mobile overflow.
- An intermediate navigation check waited on an external Ecology resource and timed out. The final check waits for the document and verifies the actual interactive controls instead of waiting for every external resource.
- Desktop Spanish and desktop/mobile hub screenshots inspected.
- Public assets match their source bytes except Ecology HTML navigation, which is rewritten for the subdirectory. No original reference documents, private grades, credentials, or source maps are included in the static output.

## Scope and limits

The optional Three.js exploration bundle retains a nonfatal size warning. Progress remains local to this browser and origin; progress from the older Sites address does not transfer automatically. The older Sites publication is separate and is not updated by this migration. The editable source belongs in `yusuf-study-site/`; generated publication files belong in repository-root `yusufs-quizzes/`. Other personal-site files are outside this change.
