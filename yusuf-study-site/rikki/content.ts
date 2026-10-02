/**
 * Content is based on the user's typed handoff, not independently inspected
 * worksheet photographs or a verified edition of Kipling's story.
 * Narrative examples are paraphrases. New practice is labeled separately from
 * the handoff's supplied quick checks. No direct Kipling quotations are used.
 */

export type TechniqueId =
  | "point-of-view"
  | "personification"
  | "foreshadowing"
  | "suspense-tension"
  | "imagery";
export type ConceptId = TechniqueId | "characterization";
export type LessonVisual = "camera" | "human" | "clue" | "danger" | "senses" | "tells-shows";

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  conceptId: ConceptId;
  prompt: string;
  options: QuestionOption[];
  correctOptionIds: string[];
  feedback: string;
  hint: string;
  sourceLabel: "Quick check supplied in handoff" | "New practice based on supplied handoff";
  mode: "single" | "multiple";
}

export interface LessonDetail {
  title: string;
  text: string;
  memoryHook?: string;
}

export interface Lesson {
  id: ConceptId;
  section: number;
  title: string;
  icon: string;
  visual: LessonVisual;
  status: "complete" | "pending";
  explanation: string;
  memoryHook: string;
  exampleLabel: "Story example (paraphrased)";
  example: string | null;
  quickCheck: Question | null;
  memoryCheck: Question | null;
  details?: LessonDetail[];
  pendingMessage?: string;
}

export const completeTechniqueIds: TechniqueId[] = [
  "point-of-view", "personification", "foreshadowing", "suspense-tension", "imagery",
];

export const contentSourceNotice =
  "Based on the supplied typed study-guide handoff. Story examples are paraphrased; practice questions marked New practice are original study activities, not missing worksheet questions.";
export const characterizationNotice =
  "Only the characterization introduction is available. More coming soon when the remaining worksheet pages are supplied.";

const supplied = "Quick check supplied in handoff" as const;
const practice = "New practice based on supplied handoff" as const;

function single(
  id: string,
  conceptId: ConceptId,
  prompt: string,
  choices: [string, string, string],
  correctIndex: number,
  feedback: string,
  hint: string,
  sourceLabel: Question["sourceLabel"] = practice,
): Question {
  return {
    id, conceptId, prompt,
    options: choices.map((text, index) => ({ id: `${id}-${index + 1}`, text })),
    correctOptionIds: [`${id}-${correctIndex + 1}`],
    feedback, hint, sourceLabel, mode: "single",
  };
}

function multiple(
  id: string,
  conceptId: TechniqueId,
  prompt: string,
  choices: [string, string, string, string],
  correctIndices: number[],
  feedback: string,
  hint: string,
): Question {
  return {
    id, conceptId, prompt,
    options: choices.map((text, index) => ({ id: `${id}-${index + 1}`, text })),
    correctOptionIds: correctIndices.map((index) => `${id}-${index + 1}`),
    feedback, hint, sourceLabel: practice, mode: "multiple",
  };
}

export const lessons: Lesson[] = [
  {
    id: "point-of-view", section: 1, title: "Point of View", icon: "👀", visual: "camera", status: "complete",
    explanation: "Point of view is the perspective telling the story. A third-person narrator tells Rikki's story and can reveal his thoughts, other animals' plans, and dangers the humans do not know about.",
    memoryHook: "POINT OF VIEW = THE CAMERA. Who tells the story, and what can that camera know?",
    exampleLabel: "Story example (paraphrased)",
    example: "The narrator shares Rikki's curiosity and his determination to protect the family. We also learn about the cobras' plans. Seeing more than one character knows can make us worry about what happens next.",
    quickCheck: single(
      "pov-quick", "point-of-view", "Why can the point of view create suspense?",
      ["We may learn about danger before some characters do.", "It makes the garden bigger.", "It removes the conflict."], 0,
      "Exactly. Knowing about the cobras' plans can make us worry about what will happen.",
      "Think about information the reader knows before the humans do.", supplied,
    ),
    memoryCheck: single(
      "pov-memory", "point-of-view", "The CAMERA memory hook reminds you to ask…",
      ["How bright is the scene?", "Who tells the story, and what can the narrator know?", "How many scenes are there?"], 1,
      "Yes. Point of view controls the perspective and information we receive.",
      "The camera is a reminder about perspective, not actual photography.",
    ),
    details: [{
      title: "What the narrator reveals",
      text: "Rikki's thoughts help us understand his choices. Information about the cobras helps us understand the conflict. Readers can know about a threat while the family is still unaware.",
    }],
  },
  {
    id: "personification", section: 2, title: "Personification", icon: "🗣", visual: "human", status: "complete",
    explanation: "Personification gives human qualities to animals, objects, or nature. In this story, animals talk, reason, and plan like people. That helps us understand their motives and conflicts.",
    memoryHook: "PERSONIFICATION = ACTING HUMAN. Is an animal doing something we associate with people?",
    exampleLabel: "Story example (paraphrased)",
    example: "Nag and Nagaina talk through their plans and use strategy. This makes them seem intelligent and threatening. Rikki's choices, loyalty, and courage help readers understand why his actions are heroic.",
    quickCheck: single(
      "person-quick", "personification", "Which is the BEST example of personification?",
      ["Nag and Nagaina make a plan together.", "A snake moves through grass.", "The sun shines on the garden."], 0,
      "Yes. Making a plan together shows humanlike reasoning and strategy.",
      "Look for humanlike thinking or planning, rather than ordinary movement.", supplied,
    ),
    memoryCheck: single(
      "person-memory", "personification", "Which phrase matches personification?",
      ["A clue about later", "Words for the five senses", "An animal reasons like a person"], 2,
      "Right. Humanlike reasoning is personification.",
      "Remember ACTING HUMAN.",
    ),
  },
  {
    id: "foreshadowing", section: 3, title: "Foreshadowing", icon: "🔮", visual: "clue", status: "complete",
    explanation: "Foreshadowing is a clue that hints at something that may happen later. It prepares us for important events and builds anticipation. A hint suggests a possibility; it does not have to announce the ending.",
    memoryHook: "FORESHADOWING = THE AUTHOR DROPS A HINT. CLUE → LATER EVENT.",
    exampleLabel: "Story example (paraphrased)",
    example: "The cobras appear early as a threat, preparing us for Rikki's later conflict with them. The cobra eggs appear before the climax, signaling that they will matter later.",
    quickCheck: single(
      "foreshadow-quick", "foreshadowing", "What does introducing the cobras as a threat early foreshadow?",
      ["Rikki will probably face them later.", "The family will immediately leave.", "The garden will disappear."], 0,
      "Right. The early threat prepares us for Rikki's later conflict with the cobras.",
      "Connect the early threat to a conflict that could happen later.", supplied,
    ),
    memoryCheck: single(
      "foreshadow-memory", "foreshadowing", "Which pattern helps you spot foreshadowing?",
      ["Early clue → later event", "Sound → silence", "Narrator → camera angle"], 0,
      "Exactly. Notice an early hint, then connect it with what happens later.",
      "The hint points forward in the story.",
    ),
  },
  {
    id: "suspense-tension", section: 4, title: "Suspense & Tension", icon: "😬", visual: "danger", status: "complete",
    explanation: "Suspense is uncertainty about what happens next. Tension is pressure from danger or conflict right now. They can happen together, but they are different: an unknown outcome versus immediate pressure.",
    memoryHook: "SUSPENSE = WHAT HAPPENS NEXT? TENSION = DANGER RIGHT NOW.",
    exampleLabel: "Story example (paraphrased)",
    example: "During the bathroom fight with Nag, physical danger creates tension. When Rikki follows Nagaina into the burrow, readers do not know whether he will survive. That uncertain outcome creates suspense.",
    quickCheck: single(
      "suspense-quick", "suspense-tension", "Why is following Nagaina into the burrow so suspenseful?",
      ["We do not know whether Rikki will survive.", "Rikki is taking a nap.", "The narrator explains the ending first."], 0,
      "Yes. The outcome is uncertain, so we want to know whether Rikki will make it out.",
      "Think about what the reader does not know yet.", supplied,
    ),
    memoryCheck: single(
      "suspense-memory", "suspense-tension", "Which pair keeps suspense and tension distinct?",
      ["Suspense: garden size. Tension: narrator.", "Suspense: unknown outcome. Tension: danger right now.", "Suspense and tension always mean exactly the same thing."], 1,
      "Exactly. Suspense asks what happens next; tension adds pressure right now.",
      "Match uncertainty with suspense and immediate danger with tension.",
    ),
    details: [
      {
        title: "Suspense: the unknown outcome",
        text: "Rikki enters Nagaina's burrow. We do not know whether he will survive. Waiting for that answer creates suspense.",
        memoryHook: "WHAT WILL HAPPEN NEXT?",
      },
      {
        title: "Tension: danger right now",
        text: "The fight with Nag in the bathroom puts Rikki in immediate physical danger. That pressure creates tension. We can also feel suspense about who will win.",
        memoryHook: "THIS IS DANGEROUS RIGHT NOW.",
      },
      {
        title: "Dramatic irony: we know more",
        text: "Readers hear the snakes' plans before some characters know them. This is dramatic irony: the reader knows something a character does not. It makes us worry about the family.",
        memoryHook: "READER KNOWS → CHARACTER DOES NOT.",
      },
      {
        title: "Pacing: control the speed",
        text: "Description and waiting can slow the action. Attacks and fights can speed it up. Changing the pace makes the danger feel more intense.",
        memoryHook: "WAITING / WATCHING → SLOW. ATTACK / FIGHT → FAST.",
      },
    ],
  },
  {
    id: "imagery", section: 5, title: "Imagery", icon: "🌿", visual: "senses", status: "complete",
    explanation: "Imagery helps readers experience a scene. Sensory language appeals to sight, hearing, touch, smell, or taste. Description can make a setting beautiful and still show places where danger hides.",
    memoryHook: "IMAGERY = MAKE A MOVIE IN YOUR HEAD. SEE • HEAR • FEEL • SMELL • TASTE.",
    exampleLabel: "Story example (paraphrased)",
    example: "The large, colorful garden is full of vegetation, but snakes can hide there. Their quiet movement makes a beautiful place feel mysterious and threatening. Battle descriptions help readers picture the action and danger.",
    quickCheck: single(
      "imagery-quick", "imagery", "What effect does the snakes' quiet movement through the garden have?",
      ["It makes the setting feel mysterious and threatening.", "It proves the garden is completely safe.", "It makes the story funny."], 0,
      "Correct. The beautiful garden can hide danger, which adds suspense.",
      "A snake may be nearby even when the garden looks beautiful.", supplied,
    ),
    memoryCheck: single(
      "imagery-memory", "imagery", "Which memory hook belongs to imagery?",
      ["The author drops a hint", "Acting human", "Make a movie in your head"], 2,
      "Yes. Sensory details help you imagine experiencing the scene.",
      "Think about details you can see, hear, or feel.",
    ),
    details: [{
      title: "Beauty + hidden danger",
      text: "Color and vegetation help us picture a beautiful garden. Hiding places and quiet movement also make it threatening. Both impressions can exist at the same time.",
    }],
  },
  {
    id: "characterization", section: 6, title: "Characterization", icon: "🎭", visual: "tells-shows", status: "pending",
    explanation: "Characterization is how an author develops a character. Direct characterization tells us a trait. Indirect characterization shows actions, thoughts, words, appearance, or interactions so we can infer a trait.",
    memoryHook: "DIRECT = TELLS. INDIRECT = SHOWS.",
    exampleLabel: "Story example (paraphrased)", example: null, quickCheck: null, memoryCheck: null,
    details: [
      { title: "Direct characterization", text: "The author tells the reader exactly what a character is like.", memoryHook: "AUTHOR → TELLS → TRAIT" },
      { title: "Indirect characterization", text: "The author shows a character's actions, thoughts, words, appearance, or interactions. The reader uses those clues to figure out a trait.", memoryHook: "CLUES → READER INFERS → TRAIT" },
    ],
    pendingMessage: characterizationNotice,
  },
];

/** Definition review may use Section 6's supplied introduction, but it does not
 * mark characterization mastered or pretend its missing worksheet is complete. */
export const fastReviewQuestions: Question[] = [
  single("fast-pov", "point-of-view", "Who tells the story?", ["Personification", "Point of view", "Imagery"], 1,
    "Point of view is the story's perspective.", "Remember the CAMERA."),
  single("fast-person", "personification", "An animal thinks and plans like a person?", ["Personification", "Foreshadowing", "Tension"], 0,
    "Personification gives animals human qualities.", "Remember ACTING HUMAN."),
  single("fast-foreshadow", "foreshadowing", "The author drops a clue about later?", ["Imagery", "Point of view", "Foreshadowing"], 2,
    "Foreshadowing is an early clue about a later event.", "A hint points forward."),
  single("fast-suspense", "suspense-tension", "Wondering what happens next?", ["Tension", "Suspense", "Imagery"], 1,
    "Suspense comes from an uncertain outcome.", "Ask WHAT HAPPENS NEXT?"),
  single("fast-tension", "suspense-tension", "Danger or pressure right now?", ["Tension", "Foreshadowing", "Point of view"], 0,
    "Tension is immediate danger, conflict, or pressure.", "Focus on RIGHT NOW."),
  single("fast-imagery", "imagery", "Words make a picture in your head?", ["Personification", "Suspense", "Imagery"], 2,
    "Imagery lets you imagine the scene through your senses.", "Remember the movie in your head."),
  single("fast-direct", "characterization", "The author TELLS a character's trait?", ["Indirect characterization", "Direct characterization", "Foreshadowing"], 1,
    "Direct characterization tells you the trait.", "DIRECT = TELLS."),
  single("fast-indirect", "characterization", "The author SHOWS clues so you figure out a trait?", ["Indirect characterization", "Direct characterization", "Imagery"], 0,
    "Indirect characterization shows clues; the reader infers the trait.", "INDIRECT = SHOWS."),
];

/** Early practice asks about one specified feature, so each item has one clear
 * best answer even when the full story event could involve several techniques. */
export const mixedQuestions: Question[] = [
  single("mix-pov", "point-of-view", "A narrator outside the story tells us Rikki's thoughts. Which technique controls that perspective?",
    ["Point of view", "Imagery", "Foreshadowing"], 0,
    "Yes. Point of view determines who tells us the story and what we can know.", "Ask who is telling us what Rikki thinks."),
  single("mix-person", "personification", "Nag and Nagaina reason together like people. Which technique gives them that human quality?",
    ["Tension", "Personification", "Imagery"], 1,
    "Right. Humanlike reasoning makes this personification.", "Focus on the animals acting like people."),
  single("mix-foreshadow", "foreshadowing", "The eggs appear before the climax and matter later. Which technique connects the early clue with the later event?",
    ["Point of view", "Personification", "Foreshadowing"], 2,
    "Exactly. The eggs prepare us for a later event.", "Remember CLUE → LATER EVENT."),
  single("mix-suspense", "suspense-tension", "Rikki enters the burrow, and we do not know whether he will survive. What does that uncertainty create?",
    ["Suspense", "Direct characterization", "Personification"], 0,
    "Yes. An uncertain outcome creates suspense.", "Focus on the answer the reader is waiting for."),
  single("mix-tension", "suspense-tension", "During the bathroom fight, Rikki faces immediate physical danger. What does that danger create right now?",
    ["Foreshadowing", "Imagery", "Tension"], 2,
    "Right. Immediate danger creates tension.", "The question asks about pressure right now."),
  single("mix-imagery", "imagery", "Details about the garden's colors and vegetation help us picture the setting. Which technique uses those visual details?",
    ["Foreshadowing", "Imagery", "Point of view"], 1,
    "Yes. Visual description is imagery.", "Think about what you can see in your mind."),
  single("mix-irony", "suspense-tension", "Readers know the cobras' plans before the family does. What is the name for that difference in knowledge?",
    ["Dramatic irony", "Personification", "Sensory language"], 0,
    "Exactly. Dramatic irony means readers know something a character does not.", "Compare what the reader knows with what the family knows."),
  single("mix-pacing", "suspense-tension", "Waiting slows a scene; an attack speeds it up. What is the author changing?",
    ["The narrator", "The setting", "The pacing"], 2,
    "Right. Pacing is the speed at which the action unfolds.", "Focus on SLOW → FAST."),
];

/** Challenge Mode explicitly permits more than one technique. Learners select
 * every requested answer; each prompt states the number of correct choices. */
export const challengeQuestions: Question[] = [
  multiple("challenge-plans", "personification",
    "Two details work together: the cobras reason like people, and their plan hints at danger later. Select the TWO techniques highlighted.",
    ["Personification", "Imagery", "Foreshadowing", "Direct characterization"], [0, 2],
    "Exactly. Humanlike reasoning is personification; a hint about later danger is foreshadowing.",
    "Match ACTING HUMAN and CLUE → LATER EVENT."),
  multiple("challenge-garden", "imagery",
    "Colorful vegetation helps us picture the garden. Hidden snakes make us wonder what will happen next. Select the TWO effects highlighted.",
    ["Personification", "Imagery", "Suspense", "Direct characterization"], [1, 2],
    "Yes. Visual details create imagery; wondering about the next danger creates suspense.",
    "Match the picture in your head and the uncertain outcome."),
  multiple("challenge-fight", "suspense-tension",
    "In the fight with Nag, Rikki faces danger right now, and readers do not know who will win. Select the TWO feelings highlighted.",
    ["Suspense", "Foreshadowing", "Direct characterization", "Tension"], [0, 3],
    "Exactly. The unknown outcome creates suspense; immediate danger creates tension.",
    "One feeling concerns NEXT; the other concerns RIGHT NOW."),
  multiple("challenge-reader", "point-of-view",
    "The narrator reveals the cobras' plans, which the family does not know. Select the TWO ideas highlighted: narration's access to information and the reader knowing more than a character.",
    ["Imagery", "Point of view", "Dramatic irony", "Indirect characterization"], [1, 2],
    "Right. Point of view lets the narrator share information; dramatic irony is the reader's extra knowledge.",
    "Match the narrator's camera and READER KNOWS → CHARACTER DOES NOT."),
];

/** Ten final questions: exactly two for each complete technique. The pending
 * characterization lesson is intentionally excluded from final mastery. */
export const finalQuestions: Question[] = [
  single("final-pov-1", "point-of-view", "Which description fits the point of view in Rikki-Tikki-Tavi?",
    ["Rikki tells the whole story using I.", "A third-person narrator can share Rikki's thoughts and other animals' plans.", "The story gives only the humans' thoughts."], 1,
    "Yes. A third-person narrator tells the story and reveals information about several animals.", "Remember what the story's camera can know."),
  single("final-pov-2", "point-of-view", "Why does learning the cobras' plans before the family does affect readers?",
    ["It makes us worry about a danger the family does not know.", "It means no conflict can happen.", "It makes Rikki narrate in first person."], 0,
    "Exactly. The narrator's information can make us worry ahead of the characters.", "Compare the reader's knowledge with the family's."),
  single("final-person-1", "personification", "Which behavior most clearly shows personification?",
    ["A cobra slides through grass.", "A bird has feathers.", "The cobras discuss a strategy together."], 2,
    "Right. Discussing strategy gives the cobras humanlike reasoning.", "Look for ACTING HUMAN."),
  single("final-person-2", "personification", "What effect does the cobras' humanlike planning have?",
    ["It makes them seem harmless.", "It makes their motives clearer and them more threatening.", "It removes their conflict with Rikki."], 1,
    "Yes. We can understand their goals, and their intelligence makes the threat stronger.", "Think about an enemy who can plan."),
  single("final-foreshadow-1", "foreshadowing", "The cobra eggs are introduced before the climax. What does that early detail prepare us for?",
    ["The eggs mattering later.", "A guarantee that nothing dangerous happens.", "A change to first-person narration."], 0,
    "Exactly. An early detail prepares us for the eggs' later importance.", "Connect the earlier clue with a later event."),
  single("final-foreshadow-2", "foreshadowing", "What makes a detail foreshadowing?",
    ["It gives a character human qualities.", "It describes only a color.", "It hints at something that may happen later."], 2,
    "Right. Foreshadowing is a hint pointing forward.", "Remember THE AUTHOR DROPS A HINT."),
  single("final-suspense-1", "suspense-tension", "Which explanation correctly compares the bathroom fight with the burrow scene?",
    ["Both are suspenseful only because the garden is colorful.", "Immediate danger adds tension in the fight; Rikki's unknown fate creates suspense in the burrow.", "Tension means a hint, and suspense means a narrator."], 1,
    "Exactly. Danger now creates tension; an uncertain outcome creates suspense.", "Match RIGHT NOW with tension and WHAT NEXT with suspense."),
  single("final-suspense-2", "suspense-tension", "How can pacing make an action scene feel more intense?",
    ["Slow the waiting, then speed up the attack.", "Make every part move at exactly the same speed.", "Explain the ending before any danger begins."], 0,
    "Yes. Slow waiting builds anticipation, and fast attacks intensify the action.", "Remember WAITING → SLOW and ATTACK → FAST."),
  single("final-imagery-1", "imagery", "What contrast can the garden's imagery create?",
    ["Beautiful and completely safe.", "Empty and unrelated to the story.", "Beautiful but full of hidden danger."], 2,
    "Right. A beautiful setting can still contain threatening hiding places.", "Remember BEAUTY + HIDDEN DANGER."),
  single("final-imagery-2", "imagery", "Why does descriptive language about quiet snakes and battle action help readers?",
    ["It removes the need to imagine the scene.", "It helps us experience the scene and feel its danger.", "It tells us the outcome must be safe."], 1,
    "Yes. Imagery makes the scene vivid and can create a threatening atmosphere.", "Think about the movie in your head and its mood."),
];

export const lessonsById = Object.fromEntries(lessons.map((lesson) => [lesson.id, lesson])) as Record<ConceptId, Lesson>;

/** Memory diagrams stay beside the lesson data, never in presentation code. */
export const visualMemory:Record<ConceptId,{label:string;headline?:string;cards?:string[];note?:string;reveal?:string}>={
 'point-of-view':{label:'The camera',headline:'Third-person narrator',cards:['Rikki’s thoughts','The snakes’ plans'],note:'Readers can know more than some characters.'},
 personification:{label:'Acting human',cards:['Animals','Talk · reason · plan'],note:'Humanlike choices reveal motives.'},
 foreshadowing:{label:'Clue → later event',headline:'Early clue: the cobras are a threat.',reveal:'Rikki will probably face them later.'},
 'suspense-tension':{label:'What next? / Danger now',cards:['Suspense: What happens next?','Tension: Danger right now.']},
 imagery:{label:'Make a movie in your head',cards:['👁 See','👂 Hear','✋ Feel','👃 Smell','👅 Taste'],note:'Beautiful garden + hidden danger'},
 characterization:{label:'Direct tells / Indirect shows',cards:['Direct: The author TELLS a trait.','Indirect: Actions, thoughts, and words SHOW a trait.']},
};
