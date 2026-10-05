# Spanish beginner-flow and classroom update — October 5, 2026

## Result

The first screen now has one primary action. The full route map and additional activities
are available on demand. Core teaching follows a worked example, a contextual attempt,
and gentle feedback, rather than introducing a new concept through a cold question.
The existing 40-turn curriculum, nine SER uses, complete chart, seven places, fourteen
fresh review conversations, eight-step checkpoint and 60-question graded quiz remain.

- First encounters introduce concepts with a short model and person/object illustration.
- Short action headings explain the immediate job. One Spanish dialogue bubble follows.
  Longer scene narration and explanations are optional disclosures; essential story facts
  and people remain visible when needed to answer.
- Choices include polished school-object pictures and concise optional English meanings.
  The backpack shows its exact items, including two pencil sprites and visibly absent scissors.
- All eight formerly typed story responses have three-choice word-tile support. Typing remains
  optional, and both methods use the same complete-sentence validator and answer keys.
  Builder stages have optional plain-English directions.
- Six-turn and five-turn chapters offer a natural stop after their first three turns. The next
  cursor is saved before the break, so leaving/reloading returns to the correct step.
- English help and guidance start enabled for new saves; explicit older preferences are kept.
  Optional Spanish audio requires an available browser voice and only plays when requested.
  No microphone, recording, countdown, lives or loss of access is introduced.
- A professional generated classroom illustration has clickable people/place/object markers,
  visible vocabulary previews and equivalent accessible station buttons. It is the default
  free-exploration view. The separate real 3D room has improved tone mapping, soft shadows,
  wood planks, rounded desks/chairs, shelves/books, plants and procedural expressive figures.
  Movement and raycast selection remain functional.
- Support from a model, guided word tiles, hints, the guide or story-room inspection is recorded
  separately from independent answers. Checkpoint results do not inherit historical story help.
  Saves are still local; typed input, private reference originals and personal information are
  absent from saved progress/public assets. Story reset preserves existing quiz grades.

## Teaching rationale and limits

Combining graphics and language, using concrete examples, interleaving worked examples
with practice, and retrieval with feedback follow the general recommendations in the
[IES practice guide](https://ies.ed.gov/ncee/wwc/PracticeGuide/1). Graduated support and
multiple ways to respond follow [CAST's practice guidance](https://udlguidelines.cast.org/action-expression/expression-communication/fluencies-practice-performance/).
These support the design choices; they do not establish this app's effectiveness for an
individual learner. The three-turn break is a usability choice, not a validated optimal dose.
Real learner feedback and later independent recall still need to be assessed.

The graphics are a polished browser study adventure, not a claim of commercial AAA game
production or superiority to another learning product. High-detail environment art is 2D;
the optional 3D room uses handcrafted procedural geometry rather than rigged cinematic
character assets. No user portrait or real teacher likeness was used. One additional
character-atlas generation returned no usable asset; existing fictional portraits were reused.

## Actual validation

- `pnpm test`: **26 passed, 0 failed**, including all eight response-builder keys and preference migration.
- `pnpm test:browser`: **22 passed, 0 failed** in the final full Chromium run (1.2 minutes).
  Coverage includes worked-example support before answering, local save/resume, three-turn break,
  classroom inspection support, optional typing, picture choices, semantic hotspots, restored
  conversation focus, full 40-turn story, band reward, actual 3D movement/selection, checkpoint
  independence, safe input, blocked/corrupt storage, the full 60-question grade and other subjects.
- `pnpm typecheck`: **passed**.
- `pnpm lint`: **0 errors**, 11 nonfatal image-optimization warnings.
- `pnpm build`: **passed**. Nonfatal large-3D-chunk and Vinext route-classification notices remain.
- `pnpm test:production`: **1 passed**, checking built server and Ecology, Rikki and all eight
  Spanish visual assets; this verifies build artifacts, not public deployment.
- `git diff --check`: **passed**. Subject hub, Ecology and Rikki source/assets are unchanged
  from pre-update commit `3e8681c`.

Development checks caught a new test selector pointing at the wrong app wrapper, a helper
name mistaken for a React hook, and mobile portrait/label styling. These were corrected.
A final isolated browser pass also checked the portrait-marker styling after visual adjustment.

Desktop 1280px and phone 390px screenshots were visually reviewed, including the first
model, picture-answer cards, classroom hotspots, the sentence-builder surface and real 3D.
Browser overflow checks covered 320px, 390px and 768px. Existing Ecology, Rikki and subject
hub files are preserved; the full sixty-question quiz and its grade were exercised.
No actual screen reader, physical-device test, Safari/Firefox run, voice-quality assessment
or live deployment check was performed. The new experience has not yet been tried by Yusuf.

## Editing and delivery

Editable models/actions/word banks live in `spanish/intuitive.ts`; curriculum/accepted
answers remain in `spanish/story-content.ts`. The rendering is in StoryApp, LearningVisuals,
IllustratedRoom and Classroom. Setup is unchanged: Node 22.13+, `pnpm install`, `pnpm dev`
from the application's folder. Preview: `http://localhost:3000/quizzes/spanish/unit-2/`.

The authorized destination is `koraycosguner/koraycosguner.github.io`, folder
`yusuf-study-site/`, feature branch `feature/spanish-school-day`. No personal-repository
root files, main branch, other subjects or live-hosting configuration are changed.
A GitHub source push does not publish this Vinext app to GitHub Pages. No production
website deployment is part of this update.
