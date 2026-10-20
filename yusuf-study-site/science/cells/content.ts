import type { CellPrinciple, CellQuestion, CellScene, CellSkill, CellTypedPrompt, ScientistId } from './types.ts';

export const skillLabels: Record<CellSkill, string> = {
  scientists: 'Scientists and discoveries', principles: 'Three parts of Cell Theory',
  chronology: 'The order of discoveries', microscopes: 'Why microscopes mattered', evidence: 'Observations and conclusions',
};

export const scenes: CellScene[] = [
  {
    id: 'hooke', name: 'Robert Hooke', year: 1665, title: 'The first clue',
    sentences: [
      'In 1665, Robert Hooke placed a thin slice of cork under his microscope.',
      'He noticed hundreds of tiny, box-like compartments.',
      'They reminded him of little rooms, so he called them cells.',
      'What he saw were the walls of dead plant cells.',
    ],
    discovery: 'Hooke introduced the name “cells.”',
    why: 'A microscope revealed tiny structures inside plant material.',
    bridge: 'Were these tiny compartments found only in cork, or were there living microscopic things too?',
  },
  {
    id: 'leeuwenhoek', name: 'Anton van Leeuwenhoek', year: 1673, title: 'A hidden living world',
    sentences: [
      'In 1673, Anton van Leeuwenhoek began sharing reports of his microscope observations.',
      'In the years that followed, he examined pond water and other samples with powerful, small microscopes.',
      'He saw tiny living organisms that the naked eye could not see and called them animalcules.',
      'His later observations also included bacteria.',
    ],
    discovery: 'Microscopic living organisms exist.',
    why: 'Some living things are so small that we need a microscope to see them.',
    bridge: 'If tiny living organisms exist, could larger living things also be made of cells?',
  },
  {
    id: 'schleiden', name: 'Matthias Schleiden', year: 1838, title: 'The plant connection',
    sentences: [
      'More than a century later, Matthias Schleiden looked for a pattern in larger living things.',
      'He studied many different plant tissues under a microscope.',
      'Again and again, he found cells.',
      'In 1838, he concluded that all plants are made of cells.',
    ],
    discovery: 'All plants are made of cells.',
    why: 'Cells were a pattern across plants, not just something found in cork.',
    bridge: 'What about animals? Are they made of cells too?',
  },
  {
    id: 'schwann', name: 'Theodor Schwann', year: 1839, title: 'The animal connection',
    sentences: [
      'Theodor Schwann studied animal tissues and compared them with plant tissues.',
      'In 1839, he concluded that animals are also made of cells.',
      'Schleiden’s plant work and Schwann’s animal work helped establish the first two parts of Cell Theory.',
      'Living things are made of one or more cells.',
      'Cells make up living things and perform basic life functions: they are the basic unit of structure and function.',
    ],
    discovery: 'Animals are made of cells, too.',
    why: 'Together, the plant and animal discoveries supported a shared basic unit of life: the cell.',
    bridge: 'Scientists now understood that living things are made of cells. But where do new cells come from?',
  },
  {
    id: 'virchow', name: 'Rudolf Virchow', year: 1858, title: 'Where new cells come from',
    sentences: [
      'The next question was about the origin of new cells.',
      'Rudolf Virchow helped establish and spread the idea that new cells arise from cells that already exist.',
      'His 1858 book helped communicate this idea.',
      'Cells dividing into new cells illustrate the third part of Cell Theory: all cells come from other cells.',
    ],
    discovery: 'All cells come from pre-existing cells.',
    why: 'The story now connects what living things are made of, what their basic units do, and where new cells come from.',
    bridge: 'One story, three ideas: living things are made of cells; cells are the basic unit of life; new cells come from existing cells.',
  },
];

export const principles: CellPrinciple[] = [
  { id: 'living-things', number: 1, title: 'Made of cells', statement: 'All living organisms are made of one or more cells.', explanation: 'An organism can have just one cell or many cells. Plants and animals are both made of cells.', scientists: ['schleiden', 'schwann'] },
  { id: 'basic-unit', number: 2, title: 'The basic unit of life', statement: 'The cell is the basic unit of structure and function in living organisms.', explanation: 'Structure: cells make up living things. Function: cells perform the basic processes of life.', scientists: ['schleiden', 'schwann'] },
  { id: 'existing-cells', number: 3, title: 'Cells come from cells', statement: 'All cells come from pre-existing cells.', explanation: 'Pre-existing means already there. New cells arise when existing cells divide.', scientists: ['virchow'] },
];

export const sourceNotes = [
  { title: 'Checked against the classroom materials', text: 'The five scientists, classroom timeline markers and three Cell Theory ideas were checked against the Unit Map, Cell Theory Inquiry slides and Cell Theory 2024 Notes. This lesson covers the Cell Theory and scientists portion of Concept 1.' },
  { title: 'The same ideas in a different order', text: 'The Notes list living things being made of cells before the basic-unit idea. Inquiry slide 29 reverses those two. Both sources agree on the ideas. This story follows the Notes order; practice checks what each idea means, not its position in a list.' },
  { title: 'More in the class unit', text: 'The Unit Map also includes Brown and Janssen, microscope handling and focusing, specimen drawings, and prokaryotic versus eukaryotic cells. Those topics are beyond this five-scientist story and its quiz; this is not the full Concept 1 assessment.' },
  { title: 'A timeline marker, not a single moment', text: '1673 marks Leeuwenhoek’s first reports to the Royal Society. Microorganism observations followed in 1674 and later years; a 1676 letter describes organisms in water and infusions. The lesson keeps the supplied 1673 marker.', url: 'https://www.royalsociety.org/blog/2023/07/celebrating-leeuwenhoek/' },
  { title: 'Why 1858?', text: '1858 is the year of Virchow’s Cellular Pathology book. He had expressed the cells-from-cells idea in 1855, and other researchers, including Robert Remak, contributed earlier evidence. The lesson keeps the supplied 1858 marker.', url: 'https://www.loc.gov/item/06041231/' },
  { title: 'Hooke’s microscope, not an invented portrait', text: 'No authenticated portrait of Robert Hooke is established. His scene uses an instrument and explanatory cell diagrams.', url: 'https://royalsociety.org/blog/2010/12/hooke-newton-and-the-missing-portrait/' },
];

const names: { id: ScientistId; label: string }[] = scenes.map(scene => ({ id: scene.id, label: scene.name }));
const byName = (...ids: ScientistId[]) => ids.map(id => names.find(item => item.id === id)!);
const choices = (...labels: string[]) => labels.map((label, index) => ({ id: `c${index + 1}`, label }));
const principleChoices = principles.map(principle => ({ id: principle.id, label: principle.statement }));
const q = (id: string, skill: CellSkill, prompt: string, options: string[], answerIndex: number, explanation: string, hint: string, extra: Partial<CellQuestion> = {}): CellQuestion => ({
  id, skill, format: 'choice', prompt, choices: choices(...options), answer: [`c${answerIndex + 1}`], explanation, hint, quiz: false, review: false, ...extra,
});
const quiz = (id: string, skill: CellSkill, prompt: string, options: string[], answerIndex: number, explanation: string, hint: string) => q(id, skill, prompt, options, answerIndex, explanation, hint, { quiz: true });
const review = (id: string, skill: CellSkill, prompt: string, options: string[], answerIndex: number, explanation: string, hint: string) => q(id, skill, prompt, options, answerIndex, explanation, hint, { review: true });

export const timelineId = 'worksheet-timeline';
export const paragraphId = 'story-paragraph';

export const questions: CellQuestion[] = [
  {
    id: 'worksheet-principles', skill: 'principles', format: 'bank', section: 'A · Complete the three parts',
    prompt: 'Use each word-bank tile once to complete Cell Theory.',
    choices: [{ id: 'cells', label: 'cells' }, { id: 'unit', label: 'basic unit' }, { id: 'existing', label: 'pre-existing cells' }],
    answer: ['cells', 'unit', 'existing'],
    segments: ['All living organisms are made of one or more ', '. The cell is the ', ' of structure and function in living organisms. All cells come from ', '.'],
    explanation: 'Living things are made of cells; the cell is their basic unit; new cells come from existing cells.',
    hint: 'The three ideas answer: What makes up life? What is its basic unit? Where do new cells come from?', quiz: false, review: false,
  },
  {
    id: 'worksheet-match', skill: 'scientists', format: 'match', section: 'B · Match each scientist', prompt: 'Place the scientist beside the discovery.',
    choices: names, slots: ['Observed cork compartments and named them cells.', 'Observed tiny living organisms called animalcules.', 'Concluded that all plants are made of cells.', 'Concluded that animals are made of cells.', 'Helped establish that new cells come from existing cells.'],
    answer: ['hooke', 'leeuwenhoek', 'schleiden', 'schwann', 'virchow'],
    explanation: 'The evidence grew from cork to microscopic life, then plants, animals and the origin of new cells.',
    hint: 'Think of the story pictures: cork → pond water → plant → animal → dividing cell.', quiz: false, review: false,
  },
  {
    id: timelineId, skill: 'chronology', format: 'order', section: 'C · Put the story in order',
    prompt: 'Place the five scientists in order, earliest to latest.', choices: names, slots: ['1665', '1673', '1838', '1839', '1858'],
    answer: ['hooke', 'leeuwenhoek', 'schleiden', 'schwann', 'virchow'],
    explanation: 'Hooke named cells; Leeuwenhoek revealed microscopic life; Schleiden and Schwann connected plants and animals; Virchow helped explain where new cells come from.',
    hint: 'Start with cork. The plant connection came before the animal connection.', quiz: false, review: false,
  },
  q('worksheet-cork', 'scientists', 'Which scientist observed cork and named the structures cells?', ['Robert Hooke', 'Theodor Schwann', 'Rudolf Virchow'], 0, 'Hooke named the compartments he saw in cork cells.', 'Picture the cork and the first microscope scene.', { section: 'D · Choose an answer' }),
  q('worksheet-plants', 'scientists', 'Which scientist concluded that plants are made of cells?', ['Anton van Leeuwenhoek', 'Matthias Schleiden', 'Robert Hooke'], 1, 'Schleiden studied many plant tissues and concluded that plants are made of cells.', 'This was the plant connection, before Schwann’s animal connection.', { section: 'D · Choose an answer' }),
  q('worksheet-pair', 'principles', 'Which two scientists helped establish the first two parts of Cell Theory?', ['Hooke and Virchow', 'Leeuwenhoek and Hooke', 'Schleiden and Schwann'], 2, 'Schleiden’s plant work and Schwann’s animal work supported cells as the common basic unit of living things.', 'Connect the plant evidence with the animal evidence.', { section: 'D · Choose an answer' }),
  q('worksheet-third', 'principles', 'Which scientist helped establish the third part of Cell Theory?', ['Rudolf Virchow', 'Robert Hooke', 'Matthias Schleiden'], 0, 'Virchow helped establish that new cells come from pre-existing cells.', 'The third part answers where new cells come from.', { section: 'D · Choose an answer' }),
  {
    id: 'worksheet-links', skill: 'principles', format: 'match', section: 'E · Connect a discovery to a principle',
    prompt: 'Choose the principle most directly supported by each statement.', choices: principleChoices,
    slots: ['Schleiden and Schwann concluded that plants and animals consist of cells.', 'Their combined work helped establish cells as the units that build organisms and carry out life functions.', 'Virchow helped establish that a new cell comes from an existing cell.'],
    answer: ['living-things', 'basic-unit', 'existing-cells'],
    explanation: 'One idea describes what living things are made of; another explains the cell’s role; another explains where new cells come from.',
    hint: 'Look for the focus: made of, structure and function, or where new cells come from.', quiz: false, review: false,
  },
  {
    id: paragraphId, skill: 'scientists', format: 'bank', prompt: 'Complete the story. Use each tile once.',
    choices: [{ id: 'cork', label: 'cork' }, { id: 'water', label: 'pond water' }, { id: 'plants', label: 'plants' }, { id: 'animals', label: 'animals' }, { id: 'existing', label: 'existing cells' }],
    segments: ['Robert Hooke examined ', ' and named the tiny compartments cells. Anton van Leeuwenhoek observed tiny living organisms in ', '. Matthias Schleiden concluded that ', ' are made of cells. Theodor Schwann concluded that ', ' are made of cells. Rudolf Virchow helped establish that new cells come from ', '.'],
    answer: ['cork', 'water', 'plants', 'animals', 'existing'],
    explanation: 'Each discovery adds to the previous clues: cork, microscopic life, plants, animals and the origin of cells.',
    hint: 'Follow the five story pictures in order.', quiz: false, review: false,
  },
  quiz('quiz-hooke', 'scientists', 'Who gave the name cells to the tiny compartments in cork?', ['Theodor Schwann', 'Robert Hooke', 'Rudolf Virchow'], 1, 'Robert Hooke used the name cells for the cork compartments he observed.', 'Recall the first clue in the story.'),
  quiz('quiz-leeuwenhoek', 'scientists', 'Which scientist observed a hidden world of tiny living organisms?', ['Anton van Leeuwenhoek', 'Matthias Schleiden', 'Theodor Schwann'], 0, 'Leeuwenhoek observed microscopic organisms, including animalcules in water.', 'Think of pond water rather than plant or animal tissue.'),
  quiz('quiz-schleiden', 'scientists', 'Whose conclusion was that all plants are made of cells?', ['Rudolf Virchow', 'Robert Hooke', 'Matthias Schleiden'], 2, 'Schleiden’s observations across plant tissues supported the plant conclusion.', 'This is the scientist who studied plants.'),
  quiz('quiz-schwann', 'scientists', 'Which discovery is associated with Theodor Schwann?', ['Naming compartments in cork', 'Animals are made of cells', 'The first reports of animalcules'], 1, 'Schwann extended the cell connection to animals.', 'His work answered the question raised after the plant connection.'),
  quiz('quiz-virchow', 'scientists', 'What idea did Rudolf Virchow help establish?', ['New cells come from existing cells', 'Only plants are made of cells', 'Every cell is visible without a microscope'], 0, 'Virchow helped establish and spread the idea that cells arise from pre-existing cells.', 'The final scene asks where new cells come from.'),
  quiz('quiz-principle-one', 'principles', 'Which statement correctly describes what living organisms are made of?', ['All organisms contain many cells', 'Only plants contain cells', 'All living organisms are made of one or more cells'], 2, 'One or more includes both single-celled and multicellular organisms.', 'A living organism can have just one cell.'),
  quiz('quiz-principle-two', 'principles', 'What does basic unit of structure and function mean?', ['Cells are only the empty spaces in living things', 'Cells make up living things and perform basic life processes', 'Cells are always the largest parts of organisms'], 1, 'Structure means what an organism is made of; function means what its cells do.', 'Think about both building a living thing and keeping it working.'),
  quiz('quiz-principle-three', 'principles', 'A cell divides and produces new cells. Which principle does this most directly illustrate?', ['Cells come from pre-existing cells', 'All living organisms have exactly one cell', 'Only animals are made of cells'], 0, 'The new cells arise from a cell that was already there.', 'Focus on the source of the new cells.'),
  quiz('quiz-pair', 'principles', 'Why are Schleiden and Schwann connected in the story?', ['They both named the compartments in cork', 'They proved that cells are never alive', 'Their plant and animal evidence helped establish cells as a shared basic unit'], 2, 'Their work linked the plant and animal worlds through cells.', 'Bring the plant and animal evidence together.'),
  {
    id: 'quiz-timeline', skill: 'chronology', format: 'order', prompt: 'Place the scientists in chronological order, earliest to latest.', choices: names,
    answer: ['hooke', 'leeuwenhoek', 'schleiden', 'schwann', 'virchow'],
    explanation: 'Hooke → Leeuwenhoek → Schleiden → Schwann → Virchow. Each step expands or explains the earlier evidence.',
    hint: 'Cork came first; the origin of new cells came last.', quiz: true, review: false,
  },
  quiz('quiz-first', 'chronology', 'Which event came first in this story?', ['Schwann’s conclusion about animals', 'Hooke’s observation of cork compartments', 'Virchow’s explanation of where new cells come from'], 1, 'Hooke’s cork observations in 1665 are the first event in this lesson.', 'Think about the beginning, before plant and animal conclusions.'),
  quiz('quiz-microscope', 'microscopes', 'Why were microscopes important to the development of Cell Theory?', ['They made tiny structures and organisms visible', 'They created cells that did not exist before', 'They made every scientific conclusion automatically correct'], 0, 'Microscopes let scientists gather evidence that was too small to see with the naked eye.', 'The instrument helps scientists observe; they still have to interpret the evidence.'),
  quiz('quiz-cork-walls', 'evidence', 'What did Hooke actually observe in the thin cork slice?', ['Tiny swimming animals', 'The first animal cells ever to divide', 'The walls of dead plant cells'], 2, 'Hooke’s cork compartments were the walls left by dead plant cells.', 'Cork is plant material; his observation was not pond life.'),
  {
    id: 'quiz-evidence', skill: 'evidence', format: 'match', prompt: 'Match each statement to its role in science.',
    choices: [{ id: 'observation', label: 'Observation: something seen or measured' }, { id: 'conclusion', label: 'Conclusion: an explanation or general idea supported by evidence' }],
    slots: ['“Through this microscope, I see small compartments in this cork slice.”', '“Plants are made of cells.”'], answer: ['observation', 'conclusion'],
    explanation: 'Seeing compartments in a sample is an observation. A statement about plants generally is a conclusion supported by many observations.',
    hint: 'Ask whether the statement describes one observed sample or a broader idea.', quiz: true, review: false,
  },
  {
    id: 'quiz-match', skill: 'scientists', format: 'match', prompt: 'Match each scientist to the contribution.',
    choices: byName('leeuwenhoek', 'schwann', 'virchow'),
    slots: ['Observed microscopic living organisms.', 'Concluded that animals are made of cells.', 'Helped establish cells from pre-existing cells.'],
    answer: ['leeuwenhoek', 'schwann', 'virchow'],
    explanation: 'Leeuwenhoek revealed microscopic life, Schwann connected animals to cells, and Virchow helped explain new cells.',
    hint: 'Recall water, animal tissue and dividing cells.', quiz: true, review: false,
  },
  {
    id: 'quiz-principle-match', skill: 'principles', format: 'match', prompt: 'Match each key question to the part of Cell Theory that answers it.', choices: principleChoices,
    slots: ['What are living organisms made of?', 'What is the basic unit of structure and function?', 'Where do new cells come from?'], answer: ['living-things', 'basic-unit', 'existing-cells'],
    explanation: 'The three parts connect an organism’s makeup, its basic unit, and the origin of new cells.',
    hint: 'Each principle focuses on a different question.', quiz: true, review: false,
  },
  quiz('quiz-next-question', 'evidence', 'After plants and animals were understood to be made of cells, which unanswered question leads to the final scene?', ['Can cork be cut into thin slices?', 'Where do new cells come from?', 'Do microscopes have lenses?'], 1, 'Understanding what organisms are made of led to the question of how new cells arise.', 'Follow the question that connects Schwann’s scene to Virchow’s.'),
  {
    id: 'quiz-conclusions-order', skill: 'chronology', format: 'order', prompt: 'Order these three later steps in the development of Cell Theory.',
    choices: [{ id: 'plants', label: 'Schleiden: plants are made of cells' }, { id: 'animals', label: 'Schwann: animals are made of cells' }, { id: 'existing', label: 'Virchow: cells come from existing cells' }],
    answer: ['plants', 'animals', 'existing'], explanation: 'The plant connection came in 1838, the animal connection in 1839, and this lesson uses Virchow’s 1858 book as its final marker.',
    hint: 'First connect plants, then animals, then explain the source of new cells.', quiz: true, review: false,
  },
  review('review-plant-notebook', 'scientists', 'A notebook compares cells in leaves, stems and roots. Which scientist’s main contribution does it best resemble?', ['Matthias Schleiden', 'Anton van Leeuwenhoek', 'Rudolf Virchow'], 0, 'Different parts of plants point to Schleiden’s plant-tissue work.', 'Identify the kind of living thing in every sample.'),
  review('review-animal-notebook', 'scientists', 'A researcher compares animal tissues and finds they are made of cells. Whose contribution does this resemble?', ['Robert Hooke', 'Theodor Schwann', 'Anton van Leeuwenhoek'], 1, 'The evidence comes from animals, matching Schwann’s contribution.', 'Schleiden’s next question was about animals.'),
  review('review-water-clue', 'scientists', 'A clear-looking drop of pond water contains tiny moving organisms under a lens. Which story connection fits?', ['Virchow: the source of new cells', 'Schleiden: plant tissues', 'Leeuwenhoek: microscopic life'], 2, 'A drop can contain living organisms too small to see without magnification.', 'This is a living hidden world, rather than empty cork compartments.'),
  review('review-one-cell', 'principles', 'An amoeba is a living organism with one cell. Does that fit Cell Theory?', ['No; every living thing needs many cells', 'Yes; one or more cells includes a single cell', 'No; cells are never whole organisms'], 1, 'Cell Theory includes both one-celled organisms and organisms made of many cells.', 'Pay attention to the words one or more.'),
  review('review-cell-functions', 'principles', 'A tiny cell takes in materials and uses energy. Which idea is illustrated most directly?', ['Cells are the basic unit of function in living organisms', 'Every cell must be dead', 'Only the whole organism can carry out life processes'], 0, 'A cell can perform basic life processes, which explains the basic-unit-of-function idea.', 'Focus on what the cell does.'),
  review('review-new-leaf', 'principles', 'As a young leaf grows, existing cells divide to form more cells. Which statement explains the source of the new cells?', ['The new cells appear from empty space', 'The new cells are produced by the microscope', 'The new cells come from cells already present'], 2, 'The dividing cells were already present: new cells come from pre-existing cells.', 'Ask where the additional cells started.'),
  {
    id: 'review-early-order', skill: 'chronology', format: 'order', prompt: 'Arrange these clues from earlier to later.',
    choices: [{ id: 'cork', label: 'The name cells is given to cork compartments' }, { id: 'water', label: 'A hidden world of microscopic living organisms is observed' }, { id: 'plants', label: 'Many plant tissues are connected by their cells' }],
    answer: ['cork', 'water', 'plants'], explanation: 'The earliest clues moved from cork compartments to microscopic life, then to a general pattern across plants.',
    hint: 'Start with the first clue in the illustrated story.', quiz: false, review: true,
  },
  review('review-between', 'chronology', 'Which step belongs between Leeuwenhoek’s hidden living world and Schwann’s animal connection?', ['Virchow’s book', 'Schleiden’s plant connection', 'Hooke’s first cork observation'], 1, 'Schleiden’s plant work came before Schwann connected the idea to animals.', 'The question What about animals? follows the plant scene.'),
  review('review-lens-evidence', 'microscopes', 'A student sees a leaf with her eyes, then sees cells in a thin leaf sample under a microscope. What did the microscope add?', ['Evidence of structures too small for her eyes alone', 'Proof that all earlier scientists were wrong', 'New cells that it manufactured in the leaf'], 0, 'Magnification reveals smaller structures that were already present in the sample.', 'The lens changes what can be seen, not what the leaf is made of.'),
  review('review-many-samples', 'microscopes', 'Why examine several tissues with a microscope instead of guessing from a plant’s outside appearance?', ['A microscope removes the need for evidence', 'Every tissue must look identical', 'The tissues provide observations that can support a general conclusion'], 2, 'A general conclusion needs evidence from observations; an outside view cannot reveal the tiny cells.', 'Think about gathering evidence from inside the plant.'),
  review('review-observation', 'evidence', 'Which notebook sentence records an observation rather than a broad conclusion?', ['All plants are made of cells', 'I counted twelve cell outlines in this small tissue sample', 'Cells are the basic unit of life'], 1, 'Counting what appears in a particular sample is an observation. The other statements are broad scientific conclusions.', 'Look for something directly seen or measured in one sample.'),
  review('review-supported-conclusion', 'evidence', 'A student finds cells in several plant samples. Which is a reasonable next step toward a scientific conclusion?', ['Compare more observations and look for a consistent pattern', 'Claim no animals could contain cells', 'Ignore every sample that looks different'], 0, 'Scientists use repeated observations and consider new evidence when building broader explanations.', 'A conclusion should grow from evidence, not ignore it.'),
];

export const quizIds = questions.filter(question => question.quiz).map(question => question.id);
export const worksheetIds = questions.filter(question => question.section).map(question => question.id);

export const typedPrompts: CellTypedPrompt[] = [
  { id: 'typed-three-parts', prompt: 'What are the three parts of Cell Theory?', hint: 'Think: made of, basic unit, new cells.', model: 'Living organisms are made of one or more cells. Cells are the basic unit of structure and function in living organisms. All cells come from pre-existing cells.' },
  { id: 'typed-hooke-bridge', prompt: 'How did Hooke’s discovery lead to further investigation?', hint: 'What new question could the cork compartments raise?', model: 'Hooke saw compartments in cork and named them cells. That raised questions about whether other materials contained these tiny structures and whether microscopic living things existed.' },
  { id: 'typed-pair', prompt: 'Why were Schleiden and Schwann important?', hint: 'Connect their two kinds of living things.', model: 'Schleiden concluded that plants are made of cells. Schwann concluded that animals are too. Together their work helped establish cells as the shared basic units of living organisms.' },
  { id: 'typed-virchow', prompt: 'How did Virchow contribute to Cell Theory?', hint: 'Where do new cells come from?', model: 'Virchow helped establish and spread the idea that new cells come from pre-existing cells, the third part of Cell Theory.' },
  { id: 'typed-microscope', prompt: 'Why was the microscope important?', hint: 'What could scientists see that they could not see with their eyes alone?', model: 'Microscopes made very small structures and organisms visible. Scientists could gather observations of cells and use that evidence to develop Cell Theory.' },
];
