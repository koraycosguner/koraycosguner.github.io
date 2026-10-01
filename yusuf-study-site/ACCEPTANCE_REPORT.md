# Verification — October 1, 2026

This reports executed checks, rather than treating the handoff's proposed tests as passed.

## Executed results

| Check | Actual result |
| --- | --- |
| `pnpm typecheck` | Passed |
| `pnpm test` | 10/10 content, grading, inventory and persistence tests passed |
| `pnpm build` | Passed; all four Spanish routes built alongside the existing hub and subject routes |
| `pnpm test:production` | 1/1 production output/asset check passed |
| `pnpm test:browser` | 8/8 Chromium browser tests passed in the final run (19.8 seconds) |
| Desktop/mobile screenshots | Captured and visually inspected: 1280px desktop classroom and 390px phone classroom/quiz |
| Ecology source comparison | `git diff` against original source has no changes under `public/quizzes/ecology/` |

The browser tests actually exercised:

- Home-to-Spanish access, every Spanish deep link and reload, and original Ecology navigation.
- Rendered WebGL geometry, camera movement via buttons/keyboard, pointer selection and Escape exit.
- Every classroom mission, all perspective prompts, fictional schedule, DOCTOR and band reward.
- Equivalent 2D mission access; inventory addition/removal with immediately updated hay questions.
- Once-only discovery XP, completion unlock, reload/resume, confirmed Spanish-only reset.
- A whole 60-question graded quiz with one wrong first answer: 59/60 → 98%, A;
  saved grade history and alternate targeted review were checked.
- Eight-question supported practice, typed HTML rendered as text, corrected response separated
  from first score, and duplicate same-event submission producing only one first result.
- Browser back navigation preserving progress; mobile overflow checks and keyboard dialog entry/exit.
- Corrupt and blocked local storage; simulated unavailable WebGL correctly using 2D;
  simulated missing Spanish voices keeping listen controls disabled and text available.
- Reduced-motion preference while using the phone layout.

Unit/content tests cover every answer key, stable shuffled IDs, every chart SER form,
article/pronoun accent distinction, natural subject omission, wrong agreement rejection,
gender/number, plural hay, fifteen backpacks, DOCTOR ambiguity exclusion, current-inventory
grading, grade boundaries, idempotent rewards, separate first/correction/hint metrics,
safe storage parsing and private-file exclusion from public asset names.

## Scope and limitations

- Ecology is original source, including 72 questions, labs and assets. Its local navigation
  was smoke tested; the full 72-question ecology bank and every ecology lab were not replayed.
  The public reference quiz and food-chain lab were sampled during the reference inspection.
- Desktop Chromium and a phone-sized Chromium viewport were tested. Physical phones,
  Safari/Firefox, screen-reader software and real speech playback were not tested.
- Classroom graphics are genuine navigable **stylized 3D**, rather than photorealistic
  character models. DOM conversations, station navigation and guide remain available without 3D.
- Full build emits a nonfatal chunk-size warning (>500 KB) and Vinext's existing route
  classification note. Slow devices may load the 3D code more slowly.
- Completed progress/grades are saved, but an in-progress quiz session restarts on reload.
  There is no cross-device synchronization, backend or online grade dashboard.
- Root application routes were checked. The GitHub subfolder stores editable source;
  no arbitrary deployment path or GitHub Pages deployment was tested or configured.
- Detailed Fulton County standard-code alignment was not verified. Only the official
  program goals support the documented novice-level design; no district endorsement is claimed.
- No deployment was performed. The existing live site remains separate from the local preview.

Private references, the handoff ZIP, learner grades and credentials are excluded from Git
and public assets. Test learners/grades exist only in isolated browser test storage;
screenshots and browser results are ignored by Git.
