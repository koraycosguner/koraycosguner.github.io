# Yusuf's 7th Grade Quizzes

A growing, multi-subject practice hub for Yusuf's seventh-grade classes.

## Current content

- **Social Sciences**
  - **Learn About the Middle East** - a 26-question interactive geography quiz
    covering countries, capitals, rivers, seas, and political features.
- **Science**
  - **Ecology Expedition** — 72 illustrated questions covering the Ecology Part 1 study guide,
    five discovery labs, 42 vocabulary cards, and 18 study notes.
    Open `/quizzes/ecology/` or use the Science shelf.
    Quiz progress and optional sound preferences are stored only in the current browser.
- **Spanish — Unit 2: Mis clases y mis compañeros**
  - A navigable, stylized Three.js classroom and equivalent 2D station navigation.
  - Eight short missions: teacher, classmate, classroom objects, shared backpack inventory,
    fictional schedule, changing perspective, DOCTOR, and a band-room reward after four missions.
  - A complete field guide, an 8-question practice session, a **60-question graded quiz**,
    and fresh targeted review examples. Percentage and letter grades use independent first
    responses. Hints/corrections are separate; these are practice grades, not school-issued grades.
  - Progress and the latest ten practice grades stay only in this browser. No analytics,
    account, microphone, or backend is used for Spanish learner data.
- Math remains a future shelf.

## Local development

```bash
pnpm install
pnpm dev
```

Then open `http://localhost:3000`.

Spanish: `http://localhost:3000/quizzes/spanish/`

Big graded quiz: `http://localhost:3000/quizzes/spanish/unit-2/quiz/`

Requires Node 22.13+ and pnpm. Versions are pinned in `pnpm-lock.yaml`.
When this project is stored inside the personal GitHub repository, run these commands
from **yusuf-study-site/**. The folder is a complete application with its own root;
putting it in the repository does not mount it at `/yusuf-study-site/` on GitHub Pages.
No live deployment is part of this change.

## Editing and controls

- `spanish/content.ts`: vocabulary, pronouns, SER, DOCTOR, questions and missions.
- `spanish/learning.ts`: answer validation, private local saves, grade calculations.
- `spanish/SpanishApp.tsx`: exploration, conversations, guide, quiz and grade history.
- `spanish/Classroom.tsx`: original programmatic classroom geometry and controls.
- `spanish/spanish.css`, `spanish/grades.css`: responsive styling.
- `app/quizzes/spanish/`: direct-loadable routes; `app/page.tsx` activates the Spanish shelf.

Drag the scene to look; use WASD/arrow keys while it has focus, or the movement buttons.
Select a person or object, or use the station list. The 2D option provides the same
content and missions. Audio is optional and user-initiated; it needs an available
Spanish browser voice. Escape closes conversations, and native dialogs manage focus.
Reduced-motion preferences disable camera damping and interface animation.

Saved progress resumes across reloads and route changes in the same browser.
An unfinished quiz session restarts after a reload; completed results and skill evidence
remain saved. Saves are device/browser local and do not sync between devices.
Resetting Spanish requires confirmation and touches only `yusuf.spanish.unit2.v1`.

## Validation

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm test:production
pnpm exec playwright install chromium
# Keep pnpm dev running in another terminal:
pnpm test:browser
```

`worker-configuration.d.ts` contains generated Cloudflare runtime types needed by the
inherited source. Refresh them with `pnpm types` if the runtime configuration changes.
`wrangler.types.json` is for type generation; deployment configuration remains unchanged.

## Source provenance and privacy

The original study-site source was retrieved from its authorized Sites source repository
at commit `2b3f9a4`. Ecology and Social Sciences are the original source and assets,
not reconstructions. The original Ecology directory is unchanged by this implementation.
Third-party classroom rendering uses MIT-licensed Three.js; see `ASSET_LICENSES.md`.

Spanish vocabulary and SER were checked against both pages of the supplied class DOCX
and all three scanned PDF pages. Private originals and the handoff ZIP are excluded from
Git and public assets. All new conversations, classmates, origin examples, and schedules
are fictional; teacher dialogue is a practice simulation. See `CONTENT_NOTES.md` for
ambiguities and the limited mapping to official Fulton County goals.

## Production build

```bash
pnpm build
```
