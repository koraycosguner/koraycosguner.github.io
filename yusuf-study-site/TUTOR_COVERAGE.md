# Unit 2 tutor content coverage — October 7, 2026

This is an internal content audit, not learner-facing material. The Oct. 7 brief's
three supplied text parts were read in full, including numbered sections 1–132.
The repeated Section 70 boundary and the paste-repair note inside Section 108 were
interpreted as formatting artifacts. All original Spanish routes and banks remain.

## Source basis and limits

The existing content notes document the supplied two-page vocabulary list, two-page
pronoun/SER chart and one-page DOCTOR chart. This revision uses that validated local
corpus plus the explicit study-guide examples transcribed in the new brief. The separate
articles handout, later chart image and actual study-guide photographs remain unavailable;
this audit does not claim to have inspected them. The new questions are original practice,
not an official assessment or answer key. There are no new standards-alignment claims.

## Content inventory

`spanish/tutor-content.ts` exports 21 short lesson collections, 99 independently tracked
skills, 66 vocabulary entries and 466 activities. The engine selects short sessions from
this bank; learners do not encounter a 466-question assignment. There are 160 text-compatible
teacher-test candidates. Each ordinary choice has one stable answer ID; sentence builders
have an ordered list of stable piece IDs. Presentation is responsible for hiding teaching
visuals, hints, chains and feedback while a teacher-style test is active.

| Concept | Taught | Practiced | Assessed |
|---|---|---|---|
| All 12 individual pronouns | Five visual pronoun lessons | Six distinct contexts per pronoun | 72 teacher-style identification candidates |
| IN / TO / ABOUT | Speaker/listener/group diagrams and contrast | Mixed, all-female, formal, informal, Spain contexts | Embedded in pronoun candidates |
| All 6 SER forms | Six short visual patterns | Six or seven distinct subjects per form; sentence building | 39 conjugation candidates |
| SER + de: origin | Individual, group and speaker-in-group | Six distinct contexts and two sentence builds | Six origin candidates |
| SER + de: ownership/association | One object vs multiple objects; objects determine verb | Six contexts and two sentence builds | Six possession candidates |
| Adjective gender | trabajador/trabajadora, organized and strict descriptions | Six contexts | Six candidates |
| Adjective number | All-female/mixed groups; -e adjectives; fácil/difícil | Seven contexts | Seven candidates |
| Articles | All eight definite/indefinite forms | One exact-key item per form | Eight candidates |
| Noun plural | Article+noun agreement; lápiz → lápices | Four distinct noun phrases | Four candidates |
| HAY | Invariant one/many; present/absent | Four exact written inventories | Four candidates |
| Priority eight words | Visual word/context frames and spoken forms | Seven representations per word | Eight context/word-bank candidates |
| Other assigned vocabulary | Six meaningful vocabulary groups | Four representations per word | Existing full-unit banks preserved |
| Connected school day | Six paired teaching scenes | Six ordered activities from arrival to assessment | Supported practice; not an independent test |
| Grammar builders | Short stage-specific frames | WHO→pronoun→SER→sentence; gender/number→adjective→sentence; object number→SER→de→sentence | Supported formulation; test uses independent choice items |
| Spoken word recognition | Short audio teaching models | Hear word → picture or written word | Dedicated practice/readiness evidence |
| Spoken sentence comprehension | Complete spoken sentences | Sentence choice, fill and contrast | Dedicated practice/readiness evidence |

The 18-question teacher-style session samples the five principal teacher-test domains;
it is not a claim that every skill can be measured in a single short session. Listening
has its own readiness evidence and is not silently inferred from a text-only test.

## Vocabulary preservation

All 37 existing `content.ts` vocabulary entries are retained with their original Spanish
labels. The new catalog also includes `computadora`, `materia`, all ten assigned subjects
and 17 adjective entries, counting `perezoso` and `flojo` separately because both were
assigned synonyms. Each vocabulary entry has its own `word:ID` skill.

The eight current priorities—libro, computadora, materia, curso, horario, prueba, examen,
almuerzo—have picture → word, word → picture, spoken word → written word, spoken word →
picture, contextual word-bank, spoken sentence comprehension and spoken sentence fill.
The remaining words have picture recognition, picture selection, spoken-word recognition
and independent meaning recall, in addition to their existing study-site activities.

## Key decisions from the item-by-item accuracy audit

- Talking **to** someone is distinguished from talking **about** someone in every pronoun
  prompt. `nosotras` prompts explicitly identify a female speaker and an all-female group.
  Spain informal plural prompts explicitly identify Spain. The classroom convention for
  `ustedes` and `Roberto y tú son…` is stated where needed.
- SER maps yo→soy, tú→eres, él/ella/usted→es, nosotros/nosotras→somos,
  vosotros/vosotras→sois, ellos/ellas/ustedes→son. Teresa and Rocío parallel items
  explicitly support the requested one-person ES remediation scenario.
- Possession agreement follows the number of objects, not the owner. One owner can own
  several books. `Los mapas son de la clase` is association, not inferred personal ownership.
- Adjective instruction does not imply every adjective follows -o/-a. It includes
  trabajador→trabajadora, responsable→responsables, exigente→exigentes and fácil→fáciles.
  Teacher and student traits in these practice examples are fictional.
- Prueba/examen and materia/curso can overlap in ordinary usage. Their classroom meanings
  are explicitly contextualized. Neither pair competes as exclusive image-answer keys.
  The pairs do appear together in listening recognition, where the exact spoken word makes
  the answer determinate. Comparative teaching frames demonstrate the class convention.
- Goma retains the assigned glue meaning and a regional-usage note; the picture/activity
  must show gluing paper. Pluma and bolígrafo remain pen synonyms. Flojo/perezoso do not
  compete as exclusive meaning keys. Carpeta is marked exercise enrichment.
- HAY uses explicit authoritative written inventories. A decorative backpack picture does
  not establish counts. HAY remains unchanged for singular/plural.
- New teacher-style candidate prompts contain Spanish rather than English translation
  clues. Explanations, models and optional learning hints are separate fields.
- Ownership illustrations were audited against named owners and object counts. Julia receives
  one book or several books as appropriate; other scenes show three pencils owned by Julia
  and two maps associated with a class. Unhelpful mismatched visuals were removed.
- Similar adjective interpretations (hardworking/studious/responsible, demanding/strict,
  funny/fun/nice) do not compete as exclusive image keys. Their pictures include short
  behavior captions rather than claiming a facial expression proves a character trait.
- Every model and teaching audio string was inspected for accents, grammar and subject
  agreement. Listening audio uses short words or complete Spanish sentences. Audio service
  behavior and actual voice intelligibility require the separate media/browser audit.
- Origin examples are fictional and do not infer Yusuf's origin. No original source files,
  grades, health details, credentials or learner progress are embedded in these exports.

## Validation

`node --experimental-strip-types --test tests/tutor-content.test.ts`:
**14 tests passed**. The assertions independently check all pronoun/verb mappings,
fixed origin/possession and adjective keys, all eight articles, exact HAY inventories,
source-vocabulary preservation, confusion-set ambiguity, all five listening formats,
audio/model correspondence, balanced teacher-pool coverage, stable IDs, referenced skills,
and at least three different evidence items for every tracked skill.

`eslint spanish/tutor-content.ts tests/tutor-content.test.ts`: **passed**.

This file audits curriculum data only. The main implementation report records the actual
engine, accessibility, viewport, audio lifecycle, persistence and production-site checks.
