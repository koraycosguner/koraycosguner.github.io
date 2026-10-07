# Detailed content and pedagogy audit — October 7, 2026

## Scope and evidence

The three user-supplied text parts were read completely. Numbered directions **1–132**
are present, including the continuation of 108. This audit covers curriculum data and
read-only inspection of the integrated tutor UI/learning engine. It does not substitute
for the root agent's browser, accessibility, real-device audio, deployment or preservation
checks. A source-code inspection is identified separately from an executed test below.

The available class-source basis remains the five pages documented in `CONTENT_NOTES.md`:
the two vocabulary pages, two subject-pronoun/SER pages and DOCTOR page. The later study-guide
photographs, separate articles handout and later SER image are not available. Teacher-style
format claims rely on the explicit transcription in the brief and the original supplied
charts. No actual teacher exam, unseen worksheet or official grading key is claimed verified.

## Findings corrected during this audit

1. **Teacher-test reasoning leak.** A SER question involving `Roberto y tú` had context
   stating `ustedes para el plural`, giving away the intermediate pronoun. This now states
   only the American classroom usage. The test receives regional disambiguation without
   a worked reasoning step. A targeted content assertion protects teacher contexts.
2. **Ownership picture contradicted its sentence.** The original generic diagram showed
   several books belonging to students while some examples referred to one book or books
   owned by Julia. Dedicated one-book/Julia, books/Julia, three-pencils/Julia and maps/class
   diagrams now match the instructional models. Other mismatched possession pictures were
   removed. Exact counts in grammatical illustrations matter for learning `es` versus `son`.
3. **Adjective picture overgeneralized an ending.** A visual showing -o/-a accompanied
   trabajador/trabajadora, whose masculine form does not end in -o. The visual now labels
   the people rather than asserting a universal ending rule. Mixed and all-female plural
   examples have separate diagrams.
4. **Overlapping traits as distractors.** A picture of someone working could support
   hardworking, studious and responsible simultaneously. Such traits now do not compete
   as exclusive picture keys. The same safeguard applies to demanding/strict and funny/fun/nice.
   The adjective scenes include short behavioral captions. They do not infer personality
   from appearance or present abstract traits as literal objects.
5. **Too few fresh core grammar variants after correction.** Added two new finite, validated
   contexts for each of twelve pronouns and six SER forms. There are now six pronoun examples
   per pronoun and six or seven conjugation examples per form, leaving more fresh examples
   after guided work and remediation. No unbounded text generation is used.
6. **Combined-grammar prerequisites.** The engine audit identified origin questions using
   `somos` after only a one-person `es` example and plural `fáciles` before its spelling pattern.
   The engine now inserts the relevant pronoun/SER teaching frames and the fácil/difícil
   plural frame before those new combinations. Dedicated engine tests cover these cases.
7. **Connected builders missing from the new tutor.** Related individual choices did not
   by themselves guarantee the requested same-subject reasoning sequence. Added a three-step
   Marcos+speaker pronoun→SER→sentence sequence, a three-step Ana+Sofía gender/number→adjective→sentence
   sequence and a four-step Julia's-books object-number→SER→de→sentence sequence. Each has
   an individual teaching frame per stage and stable ordered question data. These remain
   supported practice; provided correct sentence pieces are not proof of independent conjugation.
8. **New tutor lacked an ordered school-day mini-story.** Older stories were preserved, but
   adaptive mixing alone did not satisfy the explicit sequence. Added six linked scenes:
   arrival/backpack, classroom, computer, schedule, lunch/listening and assessment. Each scene
   pairs a useful visual/spoken teaching frame with one short interaction.
9. **Vocabulary speech punctuation.** Slash-separated alternative forms could be pronounced
   as punctuation. The audio helper now speaks variants as separate phrases. Full model
   sentences remain complete Spanish utterances.

## Coverage against the numbered brief

The following review accounts for every numbered section. “Implemented” below means
supported by content and the inspected implementation; execution evidence is specified
separately in the validation section. Device-dependent behavior still requires the final
browser/media audit.

| Sections | Requirement cluster | Audit result |
|---|---|---|
| 1, 29–31, 51, 61–64, 70–71 | Clear entry, age-appropriate focus, short progress, tutor rather than worksheet | Home has one Start studying action; secondary paths and a collapsed earlier-activities section. No new timers, coins or punitive lives. Sessions show one activity, not the bank. Parent detail stays in My Progress. |
| 2–4, 26, 34–36, 44, 48–49 | Short guided teaching, WHO→pronoun→SER, scaffold fading | Engine constructs eight-question guided sessions with teaching frames and a checkpoint; guided models are marked supported. Hints separate from first independent evidence. Prerequisites for combined origin and adjective items were checked. |
| 5–7, 42, 72, 76, 86–87 | All pronouns, all SER forms, teacher subject patterns | Twelve individual pronoun skills, six conjugation skills, 72 pronoun examples and 39 conjugation examples. Formal TO, ABOUT, speaker IN, all-female, mixed and Spain cases are explicit. The required teacher patterns and parallel examples are represented. A new connected builder follows Marcos+the speaker through pronoun, SER and whole sentence. |
| 8–11, 73, 88–89 | Origin, possession/association, adjective gender and number | Six origin and six possession contexts; connected ownership and adjective builders; thirteen stand-alone adjective questions. Ownership follows objects, not owners. -o/-a, trabajador/trabajadora, invariant-gender -e and fácil/difícil patterns are distinguished. |
| 12–15, 20–22, 37, 59, 74–75, 93, 95 | Visual vocabulary, school context, word bank, repeated representations | All 37 existing vocabulary labels plus two priority additions, ten subjects and seventeen adjective entries: 66 words. Eight priority words each have seven formats. A new six-scene ordered school-day path and the existing connected stories are available. Vocabulary is grouped, one card at a time. |
| 16–19, 38–41, 77, 90–92, 112, 116 | Audio, replay, listening variety and fallbacks | Data supplies natural Spanish words/sentences. Five listening formats exist: picture, word, sentence, fill and contrast. Audio is tap-controlled; replay is free. The helper handles Spanish voice choice, cancellation and fallback. Actual voice quality is device-dependent, not certified by content tests. |
| 23–25, 33, 46–50, 79–80, 96–99 | Specific remediation, evidence, retrieval, adaptive review, misses | First answers stay immutable; support is recorded. A miss displays the exact explanation/model and chooses a fresh parallel item. Sessions bound remediation. Test mistakes feed targeted review; confusion pairs are observable wrong→right choices. Fresh variants are finite; exhausted banks are not presented as newly generated. |
| 27–28, 94, 100, 120–122 | Teacher test, results, independent transfer and focused scope | Eighteen text-compatible questions; separate pronoun, SER, SER+de, adjective and vocabulary coverage. No test hint/model/image/audio or immediate correction in inspected UI. Results distinguish not-assessed areas, including listening. Earlier longer assessments stay available. |
| 32, 43, 57–58, 78, 81–85, 105–106, 110–111 | Accuracy, natural Spanish, ambiguity, typing burden, coverage | All exported keys and templates reviewed. Prueba/examen and materia/curso overlap is explicit; no competing ambiguous picture keys. Tap/select/build activities avoid unnecessary typing. Spanish accents are preserved. The detailed concept map is in `TUTOR_COVERAGE.md`. |
| 45, 60, 97, 117–118, 124, 127–128 | Small explanations, optional reference, supportive language | Concise example/contrast fields; feedback neutral-positive. Quick reference is optional and separated from primary study. Supported performance is described factually, with no claim of school certification or perfect understanding. |
| 52–54, 107–109 | Responsive, touch, keyboard, accessibility, performance walkthroughs | Data is compatible with large choices, semantic controls and tap alternatives. UI inspection confirms semantic buttons and separate text/audio fallback. Actual desktop/tablet/mobile walkthrough results belong in the root implementation report; content tests alone do not verify this group. |
| 55–56, 65–67, 101–104, 123, 129 | Reuse, preservation, logical phases, local saves, no bloat | Structured reusable types/data; new isolated browser-local record. Old routes and banks remain referenced. No chatbot, account system, multiplayer or future-unit expansion. Reset is confirmed and scoped. Repository diff and production checks remain the release owner's responsibility. |
| 68–69 | Learning and technical scenarios | Pure tests execute errors, fresh remediation, weak-skill review, test results, refresh, supported listening, scaffold effects and prerequisites. Root browser suite covers interaction and media lifecycle. |
| 113–115, 119, 125–126 | Learning purpose, polish, visuals, twelve success outcomes, empty states | Every item has a skill, lesson, explanation and meaning-bearing visual where applicable. Abstract pictures use behavioral context; unhelpful pictures removed. Missing-audio and empty-review flows exist. No placeholder teaching cards. Visual polish and empirical effectiveness require observation beyond static audit. |
| 130–132 | Final acceptance, report and implemented delivery | Curriculum and engine evidence recorded here; final root report must combine these findings with screenshots, browser results, preservation checks and verified deployed URL. This document does not claim deployment. |

## Content checks performed

- Every item has a known lesson, valid skill IDs, distinct choice IDs, one determinate
  ordinary answer or an ordered sentence-building key, complete correction text and hints.
- Independent expected-key tables check all pronouns and every conjugation subject pattern.
- Origin and ownership keys were checked directly: `Mi amigo y yo somos de Uruguay`,
  `Teresa es de Perú`, `Fernando y el señor García son de Ecuador`, `Los libros son de los
  estudiantes`, `Los lápices son de Julia`, and `Los mapas son de la clase`.
- Adjective keys were individually checked: trabajador/trabajadora, estricto/estricta,
  perezoso, organizada, trabajadoras, exigentes, responsables, fáciles, organizadas,
  organizados and difíciles. Fictional examples avoid claims about real teachers or students.
- All eight article keys and four plural pairs were checked, including lápiz→lápices.
  HAY responses agree with authoritative inventories and retain invariant hay.
- All six required verb forms and all twelve pronouns are taught and independently tracked.
  Conceptual perspective skills are additional evidence categories, not substitutes.
- Every priority vocabulary word has picture-word, word-picture, listen-word, listen-picture,
  context/word-bank, listen-sentence and listen-fill activities. Every other catalog word has
  four formats in addition to its preserved older activities.
- The test bank has Spanish prompts; no embedded English translation key or worked
  intermediate pronoun in its visible contexts. Teaching data fields remain available for
  post-test review; browser tests must continue asserting they stay hidden during a test.
- Audio text is short and natural. Model audio equals the displayed Spanish teaching
  sentence; slash alternatives are normalized only at playback. No microphone scoring.

## Executed validation and honest limits

- `tests/tutor-content.test.ts`: **14/14 passed** after the additional audit fixes.
- `tests/tutor-learning.test.ts`: **22/22 passed** with the expanded item bank.
- Content-file ESLint: passed; the release lint also needs the complete integrated tree.
- No original reference documents, actual grades, learner biography,
  credentials or saved learner records are included in this curriculum.
- Readiness labels are a transparent study aid based on local attempts. They are not a
  validated measurement of proficiency, classroom test scores.
- Natural speech quality varies by installed Spanish voice; automated lifecycle checks do
  not establish native-speaker pronunciation quality on every device.
- Abstract visuals are contextual teaching illustrations. A picture alone cannot establish
  a universally exclusive distinction between course/subject, quiz/exam, or personality traits.
- The finite bank now has more fresh grammar variants, but repeated long-term use can exhaust
  unseen examples. The current interface reports that fresh examples have been used and points back
  to Learn or another practice session; it does not call recycled questions new.
- This audit has not independently heard every clip on a physical phone or certified
  district standards. The source limits above must remain visible in the developer report.

## Final integration recheck

The current `work/github-repository/yusuf-study-site` implementation was re-read after
engine and UI integration, rather than relying on the earlier source snapshot.

- All four connected flows select authored items in order and pair each frame with its
  matching question. The six-scene school day also retains the checkpoint after question five.
  Completing each flow and restoring its saved result passed the engine test.
- Learn exposes the SER, adjective and SER+de builders in the relevant topic groups.
  Practice exposes “Walk through a school day.” The earlier related content is still linked.
- Provided sentence pieces always create supported evidence, including when a previously
  learned builder skips to its final sentence. This cannot generate independent SER or
  adjective mastery. Choosing to revisit a correct supported lesson does not erase earlier
  independent evidence.
- Question numbering uses question tasks only. Teaching frames and checkpoints have their
  own brief labels rather than enlarging the apparent question count.
- Teacher Test mode still selects exactly eighteen text-compatible teacher candidates.
  Reference, hints, worked examples, images, audio and immediate correctness remain hidden
  while that test is active. Listening is reported as not assessed by a text-only test.
- The finite-fresh-bank path retains the existing session and shows an honest empty-state
  message with Learn/practice suggestions. The correction button only promises another
  fresh item when `canTutorRemediate` confirms one is available.
- Joint final curriculum/engine run: **36/36 tests passed** (14 content and 22 engine).

No unresolved content answer-key or connected-learning-flow bug was found in this final
recheck. Physical-device voice quality, viewport screenshots and deployment remain outside
this content audit and are covered separately by the root release report.
