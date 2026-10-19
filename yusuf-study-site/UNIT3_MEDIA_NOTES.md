# Unit 3 instructional visuals

The Unit 3 artwork is new and does not replace Unit 2 or any other subject's assets.
No school worksheets, teacher surnames, real photographs or learner records are embedded.

## Saved raster assets

| File | Dimensions | Bytes |
| --- | --- | ---: |
| public/quizzes/spanish/unit-3/arrival.webp | 1536 × 1024 | 244806 |
| public/quizzes/spanish/unit-3/departure.webp | 1536 × 1024 | 273716 |

Generated with the built-in image-generation tool, not the fallback CLI or a paid third-party asset API. The selected PNG originals remain in the tool's generated-images directory; the site consumes these project-local WebP files. Only RGB conversion and WebP encoding at quality 88 were applied. The fictional boy has straight dark hair with a fade, a teal hoodie and a yellow backpack in both scenes. The second scene used the first as a style and fictional-character reference.

## Exact generation prompts

### Arrival

Use case: illustration-story. Asset type: school-day educational adventure scene for a middle-school Spanish web lesson. Primary request: an exceptionally polished, warm, calm, high-end animated game environment illustration of arriving at school on a bright morning, panoramic 3:2 landscape. Subject: fictional 12-year-old boy with short STRAIGHT dark hair with a tidy fade (never curls or waves), olive skin, teal zip hoodie, cream t-shirt, navy trousers, white sneakers, mustard-yellow backpack, friendly natural expression. One fictional classmate in a coral hoodie is nearby. Scene: a welcoming contemporary school entry with a glass door, an uncluttered slice of hallway and teal lockers visible inside; a second mustard backpack rests clearly on the floor beside the lockers. A school bus and simple bus stop are visible outside. Clear legible shapes with gently rounded architectural forms, rich tactile materials, soft global illumination, sophisticated color grading and beautiful subtle details, like a polished 3D animated feature game still. Prioritize spacious composition and visual storytelling. The boy is entering school, not leaving. Bright blue sky and sunlit morning, landscaped planters. No lettering, no numbers, no clocks, no logos, no text, no UI, no watermark. All people wholly fictional, no photographic likenesses. Educational game quality, visually delightful, calm rather than busy.

### Departure

Use case: illustration-story. Asset type: matching end-of-school-day educational adventure illustration. Use the attached image only as a character and style reference; create a NEW SCENE in the same school and animated game world, 3:2 landscape. Preserve the fictional main boy’s appearance exactly: short STRAIGHT dark hair with a tidy fade, olive skin, teal zip hoodie, cream t-shirt, navy trousers, white sneakers, mustard-yellow backpack. Show the boy OUTSIDE the school at the bus stop in late afternoon, waiting safely on the sidewalk beside a clean blue bus-stop pole with a simple white bus pictogram. A yellow school bus approaches in the midground. The inviting school entrance is behind him, two quiet classmates farther away, planted garden, bright soft afternoon light with slightly longer shadows. Express peaceful satisfaction at finishing school. Luxurious high-end animated family game still, beautiful physically based materials and global illumination, calm spacious composition, tasteful teal/golden palette. No text, no numbers, no clocks, no labels, no logos, no watermark. Boy's hair must remain straight, never wavy or curly. Do not copy the arrival composition. All characters fictional.

## Editable teaching visuals

`spanish/unit3/Unit3Visual.tsx` and `visuals.css` implement:
- The October 2026 calendar, with Tuesday October 20 highlighted. Calendar dates and weekdays are computed from the same month/date; text remains real HTML.
- The canonical fictional timetable imported from `content.ts`, with supplied class order preserved, example P6/P7 breaks clearly identified, and accurate start/end clock icons.
- The school map with science right of the library, between the gym and office. Mateo stands in front of the library entrance. The viewing convention is explicit. This is a practice map, not a map of the actual school.
- Analog clocks with 60 ticks, all twelve numerals, a short hour hand and a long minute hand. Hour-hand rotation includes half a degree for each minute. Time-of-day labels distinguish morning, afternoon, night, noon and midnight.
- All 16 requested prepositions. Near/far use visibly different distances; inside/outside use an open locker; above/on and under use a desk; between uses two desks. Front/behind use a clearly marked top-down convention. Right/left use the learner's view. With/without compare a student with and without a backpack. These are examples, not claims that overlapping prepositions have unique translations.
- Meaningful drawn arrival/departure fallbacks when an image cannot load.

Every raster has fixed intrinsic dimensions and a specific alternate description. Each diagram has equivalent visible labels or SVG alternative text. No external CDN, animation loop, canvas or WebGL dependency is needed. The departure clock is generated in code, never baked into AI artwork.

## Media verification

The 28-item gallery renders the five scenes, seven clocks and all sixteen relations at 320, 390, 768 and 1440 CSS-pixel widths. Browser checks found no page errors, horizontal page overflow or broken raster assets. Blocking arrival.webp produced the intended contextual SVG fallback. The contact sheet was visually inspected, leading to a correction from perspective desk drawings to explicit overhead diagrams for front/behind. The final post-correction gallery passed the same four viewport checks. Mobile screenshots also revealed a calendar SVG specificity conflict; it was fixed so the student illustration hides on phones and leaves the dates readable. Integrated-page checks are recorded in the parent acceptance report. Gallery/screenshot files are local test artifacts under ignored `outputs/unit3-gallery/`.

The generated arrival illustration establishes the school entry, hallway, lockers and backpack. Library/cafeteria/gym relationships are taught with the separate explicit school map and story text; the illustration does not claim to depict every room. Teacher-specific actual building layouts and actual bell times were not supplied.
