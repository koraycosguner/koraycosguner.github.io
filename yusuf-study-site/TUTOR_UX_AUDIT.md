# Independent tutor interface and media audit

Audit scope: TutorCenter.tsx, tutor.css, TutorVisual.tsx and useTutorAudio.ts, with
the October 7 visual/audio/adaptive-learning brief. This audit complements the
separate content, learning-engine and regression test reports. It does not claim
that automated checks prove learning effectiveness.

## Rendered interface

The local GitHub Pages build was opened in Chromium at the Spanish home route,
Learn, Vocabulary, Listening, Test and My Progress. Each route was checked at
320, 768 and 1280 CSS pixels. The first teaching step was additionally inspected
at 320 pixels, together with an intentional incorrect response.

- No horizontal overflow in the six routes at any of the three widths.
- No page JavaScript errors in this walkthrough.
- No unlabeled or empty buttons in the inspected routes.
- No missing accessible image names in the inspected routes.
- Quick reference opens as a native modal; Escape closes it and restores focus
  to the button that opened it.
- Wrong-answer feedback receives keyboard focus and presents a relevant short
  explanation and a fresh-example action.
- The mobile lesson and vocabulary card retain their complete text and controls.
- Six secondary choices remain separate from the dominant Start studying action.
- Learn begins with a small model, rather than displaying a question bank.
- Vocabulary uses one word, a relevant image, an optional meaning and audio controls.
- Test introduction clearly describes eighteen questions and delayed explanations.
- Existing activities remain under a secondary disclosure.

Screenshots were rendered and visually inspected for desktop home, mobile home,
mobile vocabulary, mobile teaching, mobile incorrect feedback and tablet Learn.
Temporary captures used the ux-audit prefix. The test runner clears its output
between runs; the final feedback screenshot was retained outside the repository
in the local private-audits folder. These are synthetic checks, not learner data.

## Instructional visuals and alternatives

All 87 visual IDs referenced by the current 66-word catalog, lesson frames and
questions resolve to specific meaningful descriptions. There are no missing keys.
Generated images, the existing supply atlas and editable diagrams were reviewed
in rendered galleries. Abstract words use contextual representations, rather
than arbitrary decorative icons.

The image descriptions explain the pictured meaning for screen-reader access.
They are not Spanish answer labels hidden in an accessibility-only element.
Consequently a picture question remains a vocabulary/meaning task; it must not
be described as independent spelling dictation or a test of visual acuity.
Listening controls use a neutral accessible label while the clip is hidden.
Reading instead is explicitly identified as supported reading practice.

A network-failure walkthrough blocked all WebP requests. The generated computer
and atlas eraser both changed to useful vector versions, retained their accessible
names, and remained within the 320-pixel layout. No broken image blocked navigation.

The image audit corrected specific instructional issues before delivery:

- A single generated book replaced an existing plural stack for singular libro.
- Ownership scenes distinguish one book, several books and the correct owner.
- Pencils and maps have plural ownership scenes.
- A mixed group now visibly contains the intended mix of fictional roles.
- Adjective count diagrams avoid implying that trabajador follows an -o/-a rule.
- The Spain label no longer obscures a character's face.

## Findings addressed during audit

The first source review found that speech could continue after closing Quick
reference or changing its selected word. The implementation was updated to stop
speech on reference open, close/Escape, section changes and word changes.

The initial small-text contrast check found ratios below 4.5:1 for new-status text,
footer details, choice letters, card metadata, progress-attempt text and listening
instructions. Secondary text colors were darkened in the implementation. The
primary green button already passed at 6.72:1.

The initial mobile correction screen duplicated a full worked example above and
inside feedback, then repeated the sentence in a one-item comparison. The audit
recommended hiding the earlier worked model after answering and showing a
comparison only when it actually compares two or more entries.

## Final rebuilt-runtime verification

Ten targeted Chromium runtime checks passed after rebuilding:

1. Opening Quick reference stops the previous speech.
2. Selecting another reference word stops speech.
3. Selecting another reference section stops speech.
4. Escape stops speech and restores focus to Quick reference.
5. The close button stops speech.
6. A closed Learn disclosure shows its plus marker.
7. An open Learn disclosure shows its minus marker.
8. Answer selection uses a dot, reserving the correctness checkmark for feedback.
9. Incorrect feedback hides the earlier worked model and omits one-item comparisons.
10. The simplified feedback remains inside the mobile viewport width.

The final mobile feedback screenshot was inspected. It retains the question,
chosen answer and one correction, while removing duplicated support. The complete
page decreased from 2071 to 1593 pixels at a 320-pixel viewport; feedback receives
focus, so the learner does not need to find the correction manually.
Later unsupported picture questions use alternate visual representations, while
early lessons retain familiar generated art.

Computed final small-text contrast ratios:

| Element | Ratio |
| --- | ---: |
| Card metadata | 6.02:1 |
| Footer detail | 5.70:1 |
| New skill status | 5.39:1 |
| Progress attempts | 6.01:1 |
| Choice letter | 5.23:1 |

These sampled elements now exceed 4.5:1. This is a targeted contrast check, not a
claim that every possible pixel state has received a full accessibility certification.

A reported blank backpack screenshot was investigated separately. The actual
image had valid dimensions and decoded correctly. The test had captured a transient
render before image decoding; screenshot synchronization was corrected. No
application change was needed for that report.

## Limits of verification

Chromium desktop emulation covers layout, DOM semantics and keyboard actions.
It is not a physical iPhone/iPad/Safari or full assistive-technology certification.
Browser speech lifecycle checks use a deterministic Spanish-voice mock and cannot
prove natural audible pronunciation on every device. The text sent to speech,
locale selection, cancellation, replay and graceful fallback are inspectable;
the learner's actual device still controls voice quality and sound availability.

The user interface supports short, low-pressure learning, meaningful visuals,
repeated examples, optional assistance and focused correction. Actual comprehension
still needs observation of the learner; the app's readiness estimates are practice
evidence rather than a diagnosis or a promise of assessment success.
