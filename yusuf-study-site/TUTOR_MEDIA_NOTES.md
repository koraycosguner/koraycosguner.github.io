# Unit 2 tutor: instructional media

The October 7 tutor adds local illustrations, reusable teaching diagrams, and
tap-to-play browser Spanish speech. No private reference pages, learner grades,
recordings of a real teacher, or third-party image hotlinks are included.

## Images and diagrams

TutorVisual.tsx supports every one of the 66 vocabulary keys in tutor-content.ts,
plus 21 people, origin, ownership and agreement diagrams. Its id, alt, variant and
compact properties keep these visuals reusable. The diagrams are deterministic
SVG; their instructional labels are editable text.

New built-in imagegen artwork, all under public/quizzes/spanish/tutor/:

| File | Dimensions | Bytes | Instructional meaning |
| --- | --- | ---: | --- |
| computadora.webp | 720 × 720 | 32,880 | One complete laptop without competing objects |
| almuerzo.webp | 720 × 720 | 68,024 | A cafeteria lunch tray |
| libro.webp | 720 × 720 | 45,322 | One book, rather than the old stack image |

Combined new raster delivery: 146,226 bytes. Originals were generated with built-in
imagegen, then proportionally resized and encoded as WebP, quality 84. Selected
project assets reside in the repository; runtime loading never depends on the
generation folder. Images have lazy loading and fixed intrinsic dimensions.

Existing school-day artwork and the nine-cell supplies atlas are preserved and
reused. The new tutor uses the atlas for eight supplies and a new single book for
libro. It does not replace the existing atlas used by older activities.

Horarios show times beside classes; materia shows separate subjects; curso connects
Spanish 1 lessons across a semester. Prueba and examen show the short quiz and
broader unit-assessment contexts used by the supplied brief. Visual length is a
teaching convention here, not a universal distinction in Spanish. Adjective scenes
use short contextual captions: a static drawing alone cannot uniquely prove that
someone is responsible, hardworking, nice or funny.

People diagrams distinguish speaker, addressee and people being discussed. Groups
including the speaker have a shared outline. Mixed and all-female groups are
explicitly represented. Those fictional roles support the stated lesson context;
the app does not infer a real person's gender from appearance.

Each component has a meaningful accessible image name. Image children are decorative
within that named group to avoid duplicate announcements. Failed rasters fall back
to an original vector rendition of the same concept. All current catalog keys have
explicit visuals. Some supplies and schedules have alternate diagram variants.
Computer, book and lunch also switch to accurate vector examples in variant 1.
Later unsupported picture questions use that variant; early lessons retain the
familiar generated image. This varies the representation without changing the concept.

### Exact generation prompts

**Computer**

> Use case: scientific-educational. Asset type: one instructional vocabulary illustration for a polished middle-school Spanish learning app. Primary request: make the meaning of 'computer' immediately recognizable with one contemporary open laptop, full keyboard and trackpad, screen showing a simple school document with abstract lines and no readable words. Style: premium stylized 3D game illustration with subtle painted texture, realistic proportions, refined warm daylight and soft grounded shadows, age appropriate for a 13-year-old, calm teal and coral details. Composition: square, laptop in three-quarter front view centered large, complete object fully inside frame, pale warm cream background, only the laptop. No people, no books, no school desk, no extra objects, no logos, no letters, no watermark.

**Lunch**

> Use case: scientific-educational. Asset type: one instructional vocabulary illustration for a polished middle-school Spanish learning app. Primary request: make the meaning 'school lunch' immediately recognizable. One complete teal cafeteria lunch tray viewed from three-quarter overhead, with a slice of cheese pizza in the main compartment, apple slices and a few green vegetables in two side compartments, and a plain glass of water. Style: premium stylized 3D game illustration with subtle painted texture, appetizing realistic proportions, refined warm daylight and soft grounded shadows, age appropriate for a 13-year-old. Composition: square, entire tray large and centered on pale warm cream cafeteria tabletop; a very soft out-of-focus hint of cafeteria seating only in the distant top background. Do not include people, school books, computers, other meals or extra trays. No words, no labels, no logos, no watermark. Calm polished visuals teaching lunch clearly, no decorative confetti.

**Book**

> Use case: scientific-educational. Asset type: one precise vocabulary illustration for a polished middle-school Spanish learning app. Primary request: exactly ONE closed hardcover school book, upright in three-quarter view with visible cream page block and blue cloth spine. It must unmistakably be a single book, not a notebook or stack. Style: premium stylized 3D educational game illustration with refined realistic materials and warm soft daylight, blue and teal cover, calm cream background, no text. Square framing, the complete single object centered large with generous safe margin and soft ground shadow. No people, no letters, no labels, no logos, no extra objects, no watermark.

## Audio

useTutorAudio.ts provides canListen, listen(text, slow?), stop, playing, notice, and
source. tutor-audio.ts contains the pure voice, rate, punctuation and cancellation
helpers.

The implementation uses available browser Spanish voices, preferring appropriate
es-US/es-MX voices, then es-ES/other Spanish locales. Natural/enhanced voice names
receive preference; novelty variants receive lower preference. The actual voice
and locale are reported. No English voice is substituted. No new audio API, paid
service, credential or background music is used.

Playback starts only on a learner tap. Replay cancels earlier speech, with generation
guards preventing late events from overwriting the newest clip state. Playing state
becomes non-null only after the actual onstart callback, rather than after queuing.
The hook handles delayed voice lists, voice-list changes, normal completion,
cancellation, exceptions, errors and a 10-second start timeout. Unmounting stops
speech. Missing voices disable listening controls; other study activities remain
available. Normal rate is 0.92, optional slow rate 0.72. Whole sentences are synthesized
together. Slash/semicolon vocabulary variants become phrase pauses; accents and
the remaining wording are preserved.

Installed macOS Spanish voices were inspected read-only. No voice was installed,
downloaded or redistributed. Browser availability and naturalness vary by device:
this implementation does **not** claim that every platform's voice quality has
been heard and approved. Actual sound requires a Spanish voice, working speakers
and an unmuted device. Headless browser mocks validate playback logic, not audible
pronunciation quality. Reviewed recordings can replace synthesis through this
isolated hook later without rewriting activities.

## Media checks

- Rendered and visually inspected galleries covering all 87 registered visuals.
- Corrected the mixed-group diagram, moved the Spain label away from faces, and
  replaced the plural stack used for singular libro with a new single book.
- Corrected the ownership diagram to display plural books.
- Verified generated media dimensions and local files after WebP encoding.
- Five pure audio helper tests passed: language guard, locale preference, natural
  voice preference, cancellation/error handling, and variant punctuation.
- Type checking passed after the media implementation.
- Component lint has no errors; native image advisories remain because GitHub Pages
  serves already-optimized local images directly.

The final implementation report records integrated UI, responsive, persistence,
audio lifecycle, image-failure and deployment checks separately.
