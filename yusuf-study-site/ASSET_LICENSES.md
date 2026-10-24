# Assets and licenses

Spanish classroom meshes, canvas text labels, interaction code, and styling are original
work for this application. Characters are abstract, fictional figures; no likeness or
voice of a real person is reproduced. No purchased asset pack or external image/font CDN
is required by the Spanish module.

Three.js 0.180.0 is MIT licensed: https://github.com/mrdoob/three.js/blob/r180/LICENSE
The dependency license is retained in the installed package. React, Vite/Vinext and
Playwright retain their upstream licenses.

Ecology and Social Sciences images are inherited from the original authorized study-site
source. No new third-party claim is made about their provenance. Their original bytes
are preserved. The source package did not provide a separate asset-license manifest.

Parent-provided class worksheets and scanned charts are private teaching references.
They are not distributed with the application or committed.
# Rikki garden illustration

`public/quizzes/rikki-tikki-tavi/garden-adventure.webp` is original artwork generated
for this study adventure with imagegen, then encoded as WebP for loading efficiency.
It illustrates a mongoose, cobra, and tailorbird in a garden; it is not a verified
depiction of the story's exact setting. No worksheet photographs or private references
were included in the generation request.

# Spanish school-day illustrations

The six original illustrations in `public/quizzes/spanish/school-day/` were generated with
built-in imagegen for this application: friends, backpack, classes, teamwork, conversation,
and band. They depict fictional practice characters and a fictional school, not likenesses
of the real teacher or learner. No private worksheet, portrait or family information was
provided to the image generator. Images contain no instructional text and are decorative;
the application's inventory and schedule panels define the scored facts.

Delivery images are 1280×853 WebP, quality 85, approximately 1 MB together. Proportional
resizing and format compression were applied. No external image CDN is required.
The same classroom illustration supports the welcome and supplies scenes. The full
selected prompt set is in `SPANISH_VISUALS.md`.

## October 5 classroom and object assets

`classroom-panorama.webp` is a newly generated polished environment illustration, 1280×853,
162,068 bytes. `supplies-atlas.webp` is a generated 3×3 object atlas, 1254×1254 RGBA,
261,550 bytes. Its true alpha and equal cells are retained for CSS sprite display.
Both were generated with built-in imagegen without private images or reference documents.
Only proportional resizing and WebP encoding were applied. Exact prompts are in
`SPANISH_VISUALS.md`. The illustrated classroom is a 2D scene with semantic hotspots;
it is not a navigable 3D model. The optional navigable classroom is actual Three.js geometry.
Portraits use CSS cropping of the existing fictional `friends.webp` illustration.
No new third-party models, textures, fonts, or asset licenses are required.

## October 7 Spanish tutor instructional media

The computadora.webp, almuerzo.webp, and libro.webp files in
public/quizzes/spanish/tutor/ are original illustrations generated for this app
with built-in imagegen. They contain no real-person likenesses, private worksheets,
learner data or branded logos. Only proportional resizing and WebP encoding were
applied. They are served locally, without a third-party image CDN. Exact prompts,
dimensions and byte sizes are recorded in TUTOR_MEDIA_NOTES.md.

Teaching diagrams in spanish/TutorVisual.tsx are original editable SVG/React code.
They reuse existing local school-day artwork and the supplies atlas where appropriate.
The audio hook uses browser-provided Spanish speech synthesis; no prerecorded voice
library or proprietary voice files are redistributed.

## October 19 Unit 3 instructional media

The files `public/quizzes/spanish/unit-3/arrival.webp` and `departure.webp` are
original illustrations generated for this app using built-in imagegen. They show
fictional students, with no real-person photographs, private records or teacher
surnames. No third-party image library or CDN is required. Source prompts, sizes,
and processing details are in `UNIT3_MEDIA_NOTES.md`.

The calendar, class schedule, school map, clocks, spatial examples and image-failure
fallbacks in `spanish/unit3/Unit3Visual.tsx` are original editable React/HTML/SVG.
The timetable and map are explicitly fictional practice examples. No original
teacher documents or unlicensed third-party art are redistributed.

## October 19 Cell Theory story media

The five WebP files in `public/quizzes/cells/concept-1/` are original conceptual
historical illustrations generated for this app with built-in imagegen. They are
not authentic portraits or archival depictions. Hooke is represented by a microscope;
other researchers have no visible faces. No private documents or personal photographs
were supplied to the generator. No external image service or third-party asset pack
is required at runtime. Proportional resizing and WebP encoding were applied.

The observation diagrams and image-failure alternatives in
`science/cells/CellVisual.tsx` are original editable SVG/React work. Exact prompts,
scientific caveats, inspection notes, dimensions and byte sizes are documented in
`CELLS_MEDIA_NOTES.md`.


## Sentence Studio — Phrases vs. Clauses (2026-10-24)

Thirteen original AI-generated fictional teaching scenes are stored in
`public/quizzes/phrases-clauses/`: puppy, bus, train, dinner, trail, mural, book,
playground, park, snow, bell, bird and movie (WebP). Generated with the built-in
ImageGen tool, inspected individually and optimized locally; no third-party
photo was copied. Exact prompts and final sizes are in `ELA_MEDIA_NOTES.md`.
They depict fictional people and places, not Yusuf, family members or classmates.
The supplied worksheet photographs are private teaching sources, not web assets.
