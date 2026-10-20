# Cell Theory content audit

## Source boundaries

The lesson follows the supplied **Concept 1: The Story of Cell Theory** build brief. The three named classroom documents—*Unit Map: Cells and Body Systems*, *Cell Theory Inquiry 2021*, and *Cell Theory 2024 Notes*—were not available in the current attachments or project. A targeted filename search of Documents and Downloads did not locate them. Exact agreement with those originals and the teacher's assessment cannot be certified. No copy of a classroom document is included in the public assets or commits.

The supplied five-scientist order and timeline are preserved: **Robert Hooke (1665), Anton van Leeuwenhoek (1673), Matthias Schleiden (1838), Theodor Schwann (1839), Rudolf Virchow (1858)**. These are lesson markers supplied in the brief; see the historical qualifications below. The lesson does not claim that a single scientist completed the whole theory or that only these five scientists contributed.

## Historical verification and date qualifications

- **Hooke, 1665:** The Royal Society holds the microscope plate and cork-cell illustration from *Micrographia* (1665). The story describes the walls of dead cork cells, not living pond organisms. [Microscope plate](https://pictures.royalsociety.org/image-rs-1871); [cork illustration](https://prints.royalsociety.org/products/microscopic-view-of-cells-in-a-sliver-of-cork-rs-8428).
- **Hooke's appearance:** No authenticated portrait is established. The lesson uses his microscope and an explanatory cork diagram, not an invented authentic face. [Royal Society account of the missing portrait](https://royalsociety.org/blog/2010/12/hooke-newton-and-the-missing-portrait/).
- **Leeuwenhoek, 1673:** This marks the beginning of his reports to the Royal Society. The institution's biographical record places his microorganism discovery in 1674, and its surviving letter of 9 October 1676 describes microscopic organisms in water and infusions, including a possible bacterial form. The scene keeps 1673 but describes observations made across the years that followed, rather than claiming that bacteria were first observed in 1673. [First correspondence](https://www.royalsociety.org/blog/2023/07/celebrating-leeuwenhoek/); [biographical archive](https://catalogues.royalsociety.org/CalmView/Record.aspx?id=NA8438&src=CalmView.Persons); [1676 letter](https://catalogues.royalsociety.org/CalmView/Record.aspx?id=EL%2FL1%2F22&src=CalmView.Catalog).
- **Schleiden, 1838; Schwann, 1839:** The Marine Biological Laboratory's exhibit reproduces their original cell illustrations and identifies the corresponding publications. These support the classroom distinction between plant and animal tissue and their combined contribution to the cell as a fundamental unit. Their historical accounts of how cells formed were not wholly correct; the lesson does not repeat those discarded mechanisms. [MBL rare-book exhibit](https://www.mbl.edu/research/research-centers/eugene-bell-center/featured-projects/seeing-cells-exhibit/theory-cells-basic-units-life).
- **Virchow, 1858:** The Library of Congress holds the 1858 *Cellular Pathology* book, based on that year's lectures. The “cells from cells” maxim was already published in 1855, and Robert Remak's earlier cell-division work also contributed. The lesson therefore says Virchow **helped establish/popularize** the principle, not that he alone first discovered cell division in 1858. [Original 1858 book](https://www.loc.gov/item/06041231/); [MBL exhibit, including Remak](https://www.mbl.edu/research/research-centers/eugene-bell-center/featured-projects/seeing-cells-exhibit/theory-cells-basic-units-life); [OpenStax historical explanation](https://openstax.org/books/microbiology/pages/3-2-foundations-of-modern-cell-theory).

## Scientific language and grading boundaries

The three classroom principles are stated as: living organisms consist of one or more cells; cells are the basic unit of structure and function in living organisms; cells come from pre-existing cells. “Structure” means cells make up organisms; “function” means cells perform basic life processes. A living single-celled organism is explicitly compatible with the first principle.

The narrative treats Hooke and Leeuwenhoek as early observations, followed by broader conclusions about plants, animals and cell origins. It does not claim that Hooke formulated all three principles, or that the five discoveries alone constituted the entire history of cell biology. “Discovery” is used as a classroom summary; historical qualifications are available outside the question flow.

Questions distinguish an observation (“I see small compartments in this sample”) from a supported general conclusion (“plants are made of cells”). Principle-application prompts ask for the **most direct** principle when more than one broad statement might also be compatible. Distractors avoid correct synonyms. No microscope-invention credit or first-bacteria year is graded.

The five typed worksheet responses are open-ended self-review with sample ideas, not automated semantic grading. They may be edited freely. The quiz uses explicit answer keys for choice, matching and ordering tasks. Targeted review uses different prompts and situations from the graded questions; it is practice, not a new formal mastery claim.

## Content coverage

- Five connected scenes, each with 4–5 short narrative sentences, one discovery, one reason it matters and a bridge to the next question.
- Three explicit principles and their scientist connections. Hooke and Leeuwenhoek remain early contributors rather than being assigned later principles.
- Eighteen graded questions: 13 multiple choice, 3 matching and 2 timeline-order questions. All five skills appear: scientists, principles, chronology, microscopes, and evidence. Multi-slot items count as one question and require all slots correct; partial work does not silently create extra points.
- Twelve distinct review questions: three for scientists, three for principles, and two each for chronology, microscopes and evidence. None is included in the 18-question quiz. Review uses new situations such as leaves/stems/roots, a single-celled amoeba, a growing leaf, a counted tissue sample and instrument-assisted observations.
- Worksheet A–E: three principle blanks, five scientist matches, five-card timeline, four multiple-choice questions and three principle links. Activity F has five editable typed-response prompts with self-review models.
- One five-blank story paragraph, using cork, pond water, plants, animals and existing cells exactly once each.

## Validation performed

`node --experimental-strip-types --test tests/cells-content.test.ts`: **10 passed, 0 failed**. These tests verify key resolution and uniqueness, all requested names/dates, short connected scenes, historical caveats, exact principles, quiz size/format/skill coverage, scientist and concept keys, fresh review separation, worksheet coverage, completed word-bank sentences and private-data exclusions.

The content tests do not establish teacher-document equivalence or browser usability. Those are separate boundaries: the originals remain unavailable, and the application/browser audit is reported in the acceptance report.
