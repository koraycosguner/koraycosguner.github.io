# ELA Sentence Studio media notes

Generated on 2026-10-24 for the Phrases vs. Clauses study guide. These are AI-created fictional scenes, generated with the built-in `image_gen.imagegen` tool using thirteen separate calls, one per asset. No CLI or external image API was used. No student or family photographs, worksheet scans, credentials, logos, or classroom originals are included.

## Delivery and review

All final assets are local WebP files in `public/quizzes/phrases-clauses/`, 1200 × 800 pixels. Each is under 200,000 bytes. Original generated PNG files were left in the tool’s default generated-images directory. Final processing used Pillow for RGB conversion, proportional Lanczos downscaling and WebP compression only. No compositing, cropping or generative edits were performed after generation.

The puppy, bus, train, trail and book scenes have an illustrated finish. Dinner and mural have more photographic detail. Warm sunlight and a teal, cream, cobalt and soft orange palette connect the set. The pictures support each sentence’s context, while the actual visible words determine grammar answers. Do not use the image’s depiction to resolve a phrase versus clause question, and do not hide test answers inside image alt text.

All thirteen generated scenes and all thirteen final WebPs were inspected individually for subject, legibility at web size, visual quality, missing/unwanted text, anatomy and private content. No text, school names, brands or identifying details were found. People are fictional. The train contains decorative trim; it carries no legible words. No animation or flashing is baked into the assets.

| Asset | Final bytes | WebP quality | Suggested alt text |
| --- | ---: | ---: | --- |
| `puppy.webp` | 174,172 | 82 | A golden-and-white puppy barks on a sunny garden path beside a teal gate. |
| `bus.webp` | 175,074 | 86 | A student with a blue backpack runs along a sidewalk toward a parked school bus. |
| `train.webp` | 194,040 | 70 | A blue steam train crosses a stone bridge through a sunlit green valley. |
| `dinner.webp` | 148,534 | 86 | Four fictional people share dinner around a wooden table in a sunny room. |
| `trail.webp` | 187,680 | 74 | Two young hikers walk uphill along a mountain trail. |
| `mural.webp` | 185,510 | 82 | An artist paints blue leaves and an orange sun on a courtyard mural. |
| `book.webp` | 177,252 | 86 | A student takes a blue book from a library shelf. |

## Exact generation prompts

Each call used `transparent_background: false`; both reference-image arguments were omitted because every scene was generated from text. The exact first-pass prompts for dinner, trail, mural and book below retain their accidental literal `undefined` prefix, caused by a shared prompt lookup before an earlier running generation completed. Those assets passed visual inspection; the four later context images each include the full style prompt directly.

### puppy.webp

```text
Use case: illustration-story. Asset type: individual landscape website educational illustration, landscape 3:2. Style: premium editorial painted-paper illustration with subtle gouache grain, sculpted layered forms, confident clean silhouettes and softly dimensional light, sophisticated for a 12-year-old, never babyish. Rich deep teal, warm cream, cobalt blue, warm soft orange accents, muted sage foliage. Calm warm sunlight, polished art direction, expressive but believable character design. One scene only. No text, no letters, no numbers, no typography, no symbols that look like writing, no logos, no watermark, no UI, no border, no collage. Do not include worksheet, book pages, diagram, or other school writing. Primary request: A cheerful small golden-and-white puppy barking one gentle bark in a sunlit leafy garden, its mouth naturally open, ears lifted and tail curled. The puppy is the clear focal subject in the middle-right, full body on a stepping-stone path. Behind it a modest teal garden gate and soft simple flowering foliage, generous cream sky and peaceful garden negative space on left. Friendly lively movement, not loud or frantic. Wide cinematic composition, tactile fur and soft paper-like shadows.
```

### bus.webp

```text
Use case: illustration-story. Asset type: individual landscape website educational illustration, landscape 3:2. Style: premium editorial painted-paper illustration with subtle gouache grain, sculpted layered forms, confident clean silhouettes and softly dimensional light, sophisticated for a 12-year-old, never babyish. Rich deep teal, warm cream, cobalt blue, warm soft orange accents, muted sage foliage. Calm warm sunlight, polished art direction, expressive but believable character design. One scene only. No text, no letters, no numbers, no typography, no symbols that look like writing, no logos, no watermark, no UI, no border, no collage. Do not include worksheet, book pages, diagram, or other school writing. Primary request: A fictional middle-school student with dark curly hair, teal jacket and cobalt backpack running lightly along a wide safe sidewalk toward a parked yellow-orange school bus. The bus has no lettering or numbers. The student is on the sidewalk and far from traffic, feet naturally posed, relaxed determined expression. A simple modern school and leafy trees in the distance. Clear full-figure running pose; broad calm open space and long soft morning shadows. A welcoming everyday journey, no urgency or distress.
```

### train.webp

```text
Use case: illustration-story. Asset type: individual landscape website educational illustration, landscape 3:2. Style: premium editorial painted-paper illustration with subtle gouache grain, sculpted layered forms, confident clean silhouettes and softly dimensional light, sophisticated for a 12-year-old, never babyish. Rich deep teal, warm cream, cobalt blue, warm soft orange accents, muted sage foliage. Calm warm sunlight, polished art direction, expressive but believable character design. One scene only. No text, no letters, no numbers, no typography, no symbols that look like writing, no logos, no watermark, no UI, no border, no collage. Do not include worksheet, book pages, diagram, or other school writing. Primary request: A handsome old cobalt-and-teal passenger train rumbling gently across a short stone railway viaduct in a green valley. Locomotive and two carriages, soft small puffs of cream steam, warm orange details. Side three-quarter view so the moving train reads clearly. Low rolling hills, a few stylized trees and a pale sunlit sky. Confident elegant composition, model-like material detail, peaceful rich landscape, no people needed.
```

### dinner.webp

```text
undefinedPrimary request: A warm welcoming family-style dinner in a sunlit cozy dining room: three fictional young guests and an adult host around a round wooden table, sharing a simple meal from bowls. The central visual is the round dinner table with plates and vegetables, clearly a dinner scene, hands naturally relaxed and eyes open, no gestures that distract. Teal cabinetry, cream curtains, cobalt chair backs and orange ceramic plates. No written signs. Calm welcoming connection, medium-wide composition, no lavish clutter.
```

### trail.webp

```text
undefinedPrimary request: Two fictional middle-school hikers with small cobalt and orange backpacks walking on a safe gently winding but visibly steep hillside trail. A teal mountain ridge rises above, layered sage trees and warm light clouds, a clear trail crossing the image diagonally. Both hikers lean slightly uphill with grounded natural walking poses and friendly determined expressions, no precipice or danger. Wide expansive inviting landscape, rhythmic sophisticated paper-cut textures and warm sun.
```

### mural.webp

```text
undefinedPrimary request: A fictional young artist in teal overalls carefully painting a large beautiful abstract botanical mural on a school courtyard wall. Bright cobalt leaves, soft orange sun, warm cream background, no text anywhere in the mural. Painter holds one brush naturally toward the wall and a small paint pot in the other hand, viewed three-quarter from behind so the action is clear. Two paint pots neatly on a drop cloth, calm courtyard greenery at edges. Wide composition with the artist and mural as focal subjects; polished saturated art, soft shadows.
```

### book.webp

```text
undefinedPrimary request: A fictional middle-school student in a soft orange sweatshirt happily finding and lifting one beautiful cobalt-blue closed book from a low library shelf. No letters, title, writing or symbols on any book spines. The student has short dark curly hair, warm brown skin and a calm curious expression. Cozy sunlit modern library with teal shelves, simple cream reading chair and one leafy plant; orderly warm book shapes with blank spines. Clear single-subject action, medium-wide landscape composition, sophisticated tactile painted-paper texture.
```


## Additional context illustrations

The playground, park, snow and bell scenes were each generated in a separate built-in call with the complete style prompt directly included. These four illustrations prevent visual context mismatches in worksheet examples. Original PNGs and final WebPs were each inspected individually. They contain no legible text, logos or personal information.

| Asset | Final bytes | WebP quality | Suggested alt text |
| --- | ---: | ---: | --- |
| `playground.webp` | 180,478 | 82 | Students play and walk across a sunny school playground. |
| `park.webp` | 177,074 | 82 | A young runner follows a green park path beside a lake. |
| `snow.webp` | 191,724 | 78 | A park bench and surrounding trees are covered in fresh snow. |
| `bell.webp` | 99,194 | 86 | A blue school bell hangs beside an open classroom door. |

### playground.webp

```text
Use case: illustration-story. Asset type: individual landscape website educational illustration, landscape 3:2. Style: premium editorial painted-paper illustration with subtle gouache grain, sculpted layered forms, confident clean silhouettes and softly dimensional light, sophisticated for a 12-year-old, never babyish. Rich deep teal, warm cream, cobalt blue, warm soft orange accents, muted sage foliage. Calm warm sunlight, polished art direction, expressive but believable character design. One scene only. No text, no letters, no numbers, no typography, no symbols that look like writing, no logos, no watermark, no UI, no border, no collage. Do not include worksheets, book pages, diagrams, or other school writing. Clearly a polished illustrated scene, not a photograph. Primary request: A welcoming busy school playground on a sunny day, with a few fictional middle-school children playing safely. A girl in a teal jacket throws a soft orange ball to a friend on a broad play court; another pair walks past a simple cobalt climbing frame in the background. A cream school building and a few leafy trees frame the scene. Natural relaxed poses and generous open space; enough activity to suggest a busy playground without visual clutter. No school bus, no signage, no letters or sports jersey numbers. Wide level composition, warm sun and soft gentle shadows.
```

### park.webp

```text
Use case: illustration-story. Asset type: individual landscape website educational illustration, landscape 3:2. Style: premium editorial painted-paper illustration with subtle gouache grain, sculpted layered forms, confident clean silhouettes and softly dimensional light, sophisticated for a 12-year-old, never babyish. Rich deep teal, warm cream, cobalt blue, warm soft orange accents, muted sage foliage. Calm warm sunlight, polished art direction, expressive but believable character design. One scene only. No text, no letters, no numbers, no typography, no symbols that look like writing, no logos, no watermark, no UI, no border, no collage. Do not include worksheets, book pages, diagrams, or other school writing. Clearly a polished illustrated scene, not a photograph. Primary request: One fictional young runner with dark curly hair, a cobalt T-shirt and teal shorts running at a gentle relaxed pace along a curving path through a lush green neighborhood park. Full figure, natural anatomy and grounded running pose, warm determined expression. Soft orange flowers, sage trees, a simple blank bench and broad cream patches of sunlight on the path. A calm open park with no bus, school, playground or traffic. Medium-wide side three-quarter composition, subtle motion in loose clothing, no graphic motion lines.
```

### snow.webp

```text
Use case: illustration-story. Asset type: individual landscape website educational illustration, landscape 3:2. Style: premium editorial painted-paper illustration with subtle gouache grain, sculpted layered forms, confident clean silhouettes and softly dimensional light, sophisticated for a 12-year-old, never babyish. Rich deep teal, warm cream, cobalt blue, warm soft orange accents, muted sage foliage. Calm warm sunlight, polished art direction, expressive but believable character design. One scene only. No text, no letters, no numbers, no typography, no symbols that look like writing, no logos, no watermark, no UI, no border, no collage. Do not include worksheets, book pages, diagrams, or other school writing. Clearly a polished illustrated scene, not a photograph. Primary request: A peaceful park bench and graceful trees covered in fresh white snow on a quiet winter morning. Deep teal and cobalt shadows in the snow, warm cream sunbeams and one restrained soft orange accent on the bench's wood. Clear thick fresh snow caps on bench and branches. No people, animals, words, letters, signs, bicycles or road traffic. Elegant spacious landscape with visible snowy ground and a softly receding path. Sophisticated tranquil painted-paper illustration, tactile snow and layered gouache foliage.
```

### bell.webp

```text
Use case: illustration-story. Asset type: individual landscape website educational illustration, landscape 3:2. Style: premium editorial painted-paper illustration with subtle gouache grain, sculpted layered forms, confident clean silhouettes and softly dimensional light, sophisticated for a 12-year-old, never babyish. Rich deep teal, warm cream, cobalt blue, warm soft orange accents, muted sage foliage. Calm warm sunlight, polished art direction, expressive but believable character design. One scene only. No text, no letters, no numbers, no typography, no symbols that look like writing, no logos, no watermark, no UI, no border, no collage. Do not include worksheets, book pages, diagrams, or other school writing. Clearly a polished illustrated scene, not a photograph. Primary request: A single classic round metal school bell with two small external bells mounted high on a cream wall just beside an open teal classroom door, in a calm sunlit school hallway. The bell is cobalt blue with a small soft orange clapper, beautifully rendered and clearly recognizable as a school bell rather than a clock. No dial, clock face, letters, numbers or symbols. Through the doorway, only a few softly blurred desks and a green plant; no writing, no posters, no people. The bell is a prominent focal object in the upper middle of a wide landscape composition, warm daylight and soft sculpted painted-paper texture.
```

## Final teacher-example illustrations

The bird and movie scenes were each generated with a complete style prompt in a separate built-in call, then inspected as originals and final WebPs. They connect the teacher's singing-bird and before-the-movie examples with matching imagery. No grammar classifications appear in the assets or proposed alt text.

| Asset | Final bytes | WebP quality | Suggested alt text |
| --- | ---: | ---: | --- |
| `bird.webp` | 155,778 | 86 | A small blue-and-orange bird sings from a leafy branch. |
| `movie.webp` | 91,114 | 86 | Popcorn and a drink sit beside blue cinema seats facing a blank screen. |

### bird.webp

```text
Use case: illustration-story. Asset type: individual landscape website educational illustration, landscape 3:2. Style: premium editorial painted-paper illustration with subtle gouache grain, sculpted layered forms, confident clean silhouettes and softly dimensional light, sophisticated for a 12-year-old, never babyish. Rich deep teal, warm cream, cobalt blue, warm soft orange accents, muted sage foliage. Calm warm sunlight, polished art direction, expressive but believable character design. One scene only. No text, no letters, no numbers, no typography, no symbols that look like writing, no logos, no watermark, no UI, no border, no collage. Do not include worksheets, book pages, diagrams, or other school writing. Clearly a polished illustrated scene, not a photograph. Primary request: A small beautiful blue-and-teal songbird with a warm orange breast singing on a leafy branch in a sunlit garden. The bird is the clear focal subject, beak gently open and head tilted upward, natural feet gripping the branch, anatomically believable wings and tail. Soft cream sky and a little sage foliage frame the bird with ample open space. Delicate tactile feather detail and warm gentle light, calm inviting scene. No musical notes, sound graphics, speech bubbles or writing.
```

### movie.webp

```text
Use case: illustration-story. Asset type: individual landscape website educational illustration, landscape 3:2. Style: premium editorial painted-paper illustration with subtle gouache grain, sculpted layered forms, confident clean silhouettes and softly dimensional light, sophisticated for a 12-year-old, never babyish. Rich deep teal, warm cream, cobalt blue, warm soft orange accents, muted sage foliage. Calm warm sunlight, polished art direction, expressive but believable character design. One scene only. No text, no letters, no numbers, no typography, no symbols that look like writing, no logos, no watermark, no UI, no border, no collage. Do not include worksheets, book pages, diagrams, or other school writing. Clearly a polished illustrated scene, not a photograph. Primary request: A welcoming small cinema just before a movie starts: a few orderly rows of plush cobalt-blue cinema seats facing a wide blank cream projection screen. A close foreground seat holds a plain soft-orange popcorn tub filled with fresh popcorn, and a simple teal drink cup with no branding. Warm amber aisle lighting creates a cozy relaxed atmosphere, with soft dimensional painted-paper shadows. The screen is completely blank and softly glowing, no movie picture or words. No people, ticket text, seat numbers, logos, signs, writing or UI. Wide cinematic landscape composition.
```
