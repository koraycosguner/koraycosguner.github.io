// Retained question snapshots allow existing labeling saves to resume after the expanded curriculum.
import type {Task} from './types';
export const legacyLabels:Task[]=[
 {
  "id": "label-animal-1-0",
  "kind": "label",
  "skill": "labels",
  "prompt": "Match each name to its numbered structure.",
  "context": "Select a name, then its number on the cell.",
  "cell": "animal",
  "targets": [
   "nucleus",
   "membrane",
   "mitochondria",
   "cytoplasm"
  ],
  "choices": [
   {
    "id": "nucleus",
    "label": "Nucleus"
   },
   {
    "id": "membrane",
    "label": "Cell membrane"
   },
   {
    "id": "mitochondria",
    "label": "Mitochondria"
   },
   {
    "id": "cytoplasm",
    "label": "Cytoplasm"
   }
  ],
  "answer": [
   "nucleus",
   "membrane",
   "mitochondria",
   "cytoplasm"
  ],
  "explanation": "Structure 1: Nucleus. Contains DNA and helps control cell activities. Structure 2: Cell membrane. Controls what enters and leaves the cell. Structure 3: Mitochondria. Release usable energy from food, producing ATP. Structure 4: Cytoplasm. Jelly-like material that holds organelles and supports cell processes.",
  "hint": "1: Look for the large purple structure with a darker center. 2: Look for the thin boundary around the cytoplasm, inside the wall in a plant. 3: Look for orange bean-shaped structures with folded inner membranes. 4: Look at the pale material filling the spaces between the organelles."
 },
 {
  "id": "label-animal-2-0",
  "kind": "label",
  "skill": "labels",
  "prompt": "Label this group of cell parts.",
  "context": "Look at each structure’s shape and location.",
  "cell": "animal",
  "targets": [
   "membrane",
   "nucleus",
   "cytoplasm",
   "mitochondria"
  ],
  "choices": [
   {
    "id": "membrane",
    "label": "Cell membrane"
   },
   {
    "id": "nucleus",
    "label": "Nucleus"
   },
   {
    "id": "cytoplasm",
    "label": "Cytoplasm"
   },
   {
    "id": "mitochondria",
    "label": "Mitochondria"
   }
  ],
  "answer": [
   "membrane",
   "nucleus",
   "cytoplasm",
   "mitochondria"
  ],
  "explanation": "Structure 1: Cell membrane. Controls what enters and leaves the cell. Structure 2: Nucleus. Contains DNA and helps control cell activities. Structure 3: Cytoplasm. Jelly-like material that holds organelles and supports cell processes. Structure 4: Mitochondria. Release usable energy from food, producing ATP.",
  "hint": "1: Look for the thin boundary around the cytoplasm, inside the wall in a plant. 2: Look for the large purple structure with a darker center. 3: Look at the pale material filling the spaces between the organelles. 4: Look for orange bean-shaped structures with folded inner membranes."
 },
 {
  "id": "label-animal-2-1",
  "kind": "label",
  "skill": "labels",
  "prompt": "Label this group of cell parts.",
  "context": "Look at each structure’s shape and location.",
  "cell": "animal",
  "targets": [
   "ribosomes",
   "lysosomes"
  ],
  "choices": [
   {
    "id": "ribosomes",
    "label": "Ribosomes"
   },
   {
    "id": "lysosomes",
    "label": "Lysosomes"
   }
  ],
  "answer": [
   "ribosomes",
   "lysosomes"
  ],
  "explanation": "Structure 1: Ribosomes. Make proteins. Structure 2: Lysosomes. Break down unwanted materials and help manage waste.",
  "hint": "1: Look for the tiny dark paired dots, some beside the folded ER. 2: Look for small pink sacs with speckled contents."
 },
 {
  "id": "label-animal-3-0",
  "kind": "label",
  "skill": "labels",
  "prompt": "Label this group of cell parts.",
  "context": "Look at each structure’s shape and location.",
  "cell": "animal",
  "targets": [
   "membrane",
   "nucleus",
   "cytoplasm",
   "mitochondria"
  ],
  "choices": [
   {
    "id": "membrane",
    "label": "Cell membrane"
   },
   {
    "id": "nucleus",
    "label": "Nucleus"
   },
   {
    "id": "cytoplasm",
    "label": "Cytoplasm"
   },
   {
    "id": "mitochondria",
    "label": "Mitochondria"
   }
  ],
  "answer": [
   "membrane",
   "nucleus",
   "cytoplasm",
   "mitochondria"
  ],
  "explanation": "Structure 1: Cell membrane. Controls what enters and leaves the cell. Structure 2: Nucleus. Contains DNA and helps control cell activities. Structure 3: Cytoplasm. Jelly-like material that holds organelles and supports cell processes. Structure 4: Mitochondria. Release usable energy from food, producing ATP.",
  "hint": "1: Look for the thin boundary around the cytoplasm, inside the wall in a plant. 2: Look for the large purple structure with a darker center. 3: Look at the pale material filling the spaces between the organelles. 4: Look for orange bean-shaped structures with folded inner membranes."
 },
 {
  "id": "label-animal-3-1",
  "kind": "label",
  "skill": "labels",
  "prompt": "Label this group of cell parts.",
  "context": "Look at each structure’s shape and location.",
  "cell": "animal",
  "targets": [
   "ribosomes",
   "lysosomes",
   "vacuole"
  ],
  "choices": [
   {
    "id": "ribosomes",
    "label": "Ribosomes"
   },
   {
    "id": "lysosomes",
    "label": "Lysosomes"
   },
   {
    "id": "vacuole",
    "label": "Vacuole"
   }
  ],
  "answer": [
   "ribosomes",
   "lysosomes",
   "vacuole"
  ],
  "explanation": "Structure 1: Ribosomes. Make proteins. Structure 2: Lysosomes. Break down unwanted materials and help manage waste. Structure 3: Vacuole. Stores water and other materials.",
  "hint": "1: Look for the tiny dark paired dots, some beside the folded ER. 2: Look for small pink sacs with speckled contents. 3: Look for a blue storage sac; the plant cell has one very large central sac."
 },
 {
  "id": "identify-animal-membrane",
  "kind": "diagram-choice",
  "skill": "labels",
  "prompt": "Which cell part is highlighted?",
  "choices": [
   {
    "id": "membrane",
    "label": "Cell membrane"
   },
   {
    "id": "cytoplasm",
    "label": "Cytoplasm"
   },
   {
    "id": "mitochondria",
    "label": "Mitochondria"
   }
  ],
  "answer": [
   "membrane"
  ],
  "part": "membrane",
  "hint": "Look for the thin boundary around the cytoplasm, inside the wall in a plant.",
  "explanation": "Cell membrane: Controls what enters and leaves the cell.",
  "cell": "animal",
  "highlight": "membrane"
 },
 {
  "id": "identify-animal-nucleus",
  "kind": "diagram-choice",
  "skill": "labels",
  "prompt": "Which cell part is highlighted?",
  "choices": [
   {
    "id": "nucleus",
    "label": "Nucleus"
   },
   {
    "id": "mitochondria",
    "label": "Mitochondria"
   },
   {
    "id": "ribosomes",
    "label": "Ribosomes"
   }
  ],
  "answer": [
   "nucleus"
  ],
  "part": "nucleus",
  "hint": "Look for the large purple structure with a darker center.",
  "explanation": "Nucleus: Contains DNA and helps control cell activities.",
  "cell": "animal",
  "highlight": "nucleus"
 },
 {
  "id": "identify-animal-cytoplasm",
  "kind": "diagram-choice",
  "skill": "labels",
  "prompt": "Which cell part is highlighted?",
  "choices": [
   {
    "id": "cytoplasm",
    "label": "Cytoplasm"
   },
   {
    "id": "ribosomes",
    "label": "Ribosomes"
   },
   {
    "id": "lysosomes",
    "label": "Lysosomes"
   }
  ],
  "answer": [
   "cytoplasm"
  ],
  "part": "cytoplasm",
  "hint": "Look at the pale material filling the spaces between the organelles.",
  "explanation": "Cytoplasm: Jelly-like material that holds organelles and supports cell processes.",
  "cell": "animal",
  "highlight": "cytoplasm"
 },
 {
  "id": "identify-animal-mitochondria",
  "kind": "diagram-choice",
  "skill": "labels",
  "prompt": "Which cell part is highlighted?",
  "choices": [
   {
    "id": "mitochondria",
    "label": "Mitochondria"
   },
   {
    "id": "lysosomes",
    "label": "Lysosomes"
   },
   {
    "id": "vacuole",
    "label": "Vacuole"
   }
  ],
  "answer": [
   "mitochondria"
  ],
  "part": "mitochondria",
  "hint": "Look for orange bean-shaped structures with folded inner membranes.",
  "explanation": "Mitochondria: Release usable energy from food, producing ATP.",
  "cell": "animal",
  "highlight": "mitochondria"
 },
 {
  "id": "identify-animal-ribosomes",
  "kind": "diagram-choice",
  "skill": "labels",
  "prompt": "Which cell part is highlighted?",
  "choices": [
   {
    "id": "ribosomes",
    "label": "Ribosomes"
   },
   {
    "id": "wall",
    "label": "Cell wall"
   },
   {
    "id": "membrane",
    "label": "Cell membrane"
   }
  ],
  "answer": [
   "ribosomes"
  ],
  "part": "ribosomes",
  "hint": "Look for the tiny dark paired dots, some beside the folded ER.",
  "explanation": "Ribosomes: Make proteins.",
  "cell": "animal",
  "highlight": "ribosomes"
 },
 {
  "id": "identify-animal-lysosomes",
  "kind": "diagram-choice",
  "skill": "labels",
  "prompt": "Which cell part is highlighted?",
  "choices": [
   {
    "id": "lysosomes",
    "label": "Lysosomes"
   },
   {
    "id": "membrane",
    "label": "Cell membrane"
   },
   {
    "id": "nucleus",
    "label": "Nucleus"
   }
  ],
  "answer": [
   "lysosomes"
  ],
  "part": "lysosomes",
  "hint": "Look for small pink sacs with speckled contents.",
  "explanation": "Lysosomes: Break down unwanted materials and help manage waste.",
  "cell": "animal",
  "highlight": "lysosomes"
 },
 {
  "id": "identify-animal-vacuole",
  "kind": "diagram-choice",
  "skill": "labels",
  "prompt": "Which cell part is highlighted?",
  "choices": [
   {
    "id": "vacuole",
    "label": "Vacuole"
   },
   {
    "id": "nucleus",
    "label": "Nucleus"
   },
   {
    "id": "cytoplasm",
    "label": "Cytoplasm"
   }
  ],
  "answer": [
   "vacuole"
  ],
  "part": "vacuole",
  "hint": "Look for a blue storage sac; the plant cell has one very large central sac.",
  "explanation": "Vacuole: Stores water and other materials.",
  "cell": "animal",
  "highlight": "vacuole"
 },
 {
  "id": "label-animal-5-0",
  "kind": "label",
  "skill": "labels",
  "prompt": "Label this group of cell parts.",
  "context": "Extension: ER and Golgi join the core structures.",
  "cell": "animal",
  "targets": [
   "membrane",
   "nucleus",
   "cytoplasm",
   "mitochondria"
  ],
  "choices": [
   {
    "id": "membrane",
    "label": "Cell membrane"
   },
   {
    "id": "nucleus",
    "label": "Nucleus"
   },
   {
    "id": "cytoplasm",
    "label": "Cytoplasm"
   },
   {
    "id": "mitochondria",
    "label": "Mitochondria"
   }
  ],
  "answer": [
   "membrane",
   "nucleus",
   "cytoplasm",
   "mitochondria"
  ],
  "explanation": "Structure 1: Cell membrane. Controls what enters and leaves the cell. Structure 2: Nucleus. Contains DNA and helps control cell activities. Structure 3: Cytoplasm. Jelly-like material that holds organelles and supports cell processes. Structure 4: Mitochondria. Release usable energy from food, producing ATP.",
  "hint": "1: Look for the thin boundary around the cytoplasm, inside the wall in a plant. 2: Look for the large purple structure with a darker center. 3: Look at the pale material filling the spaces between the organelles. 4: Look for orange bean-shaped structures with folded inner membranes."
 },
 {
  "id": "label-animal-5-1",
  "kind": "label",
  "skill": "labels",
  "prompt": "Label this group of cell parts.",
  "context": "Extension: ER and Golgi join the core structures.",
  "cell": "animal",
  "targets": [
   "ribosomes",
   "lysosomes",
   "vacuole",
   "er"
  ],
  "choices": [
   {
    "id": "ribosomes",
    "label": "Ribosomes"
   },
   {
    "id": "lysosomes",
    "label": "Lysosomes"
   },
   {
    "id": "vacuole",
    "label": "Vacuole"
   },
   {
    "id": "er",
    "label": "Endoplasmic reticulum"
   }
  ],
  "answer": [
   "ribosomes",
   "lysosomes",
   "vacuole",
   "er"
  ],
  "explanation": "Structure 1: Ribosomes. Make proteins. Structure 2: Lysosomes. Break down unwanted materials and help manage waste. Structure 3: Vacuole. Stores water and other materials. Structure 4: Endoplasmic reticulum. Helps make and move proteins and lipids.",
  "hint": "1: Look for the tiny dark paired dots, some beside the folded ER. 2: Look for small pink sacs with speckled contents. 3: Look for a blue storage sac; the plant cell has one very large central sac. 4: Look for folded blue membranes near the nucleus."
 },
 {
  "id": "label-animal-5-2",
  "kind": "label",
  "skill": "labels",
  "prompt": "Label this group of cell parts.",
  "context": "Extension: ER and Golgi join the core structures.",
  "cell": "animal",
  "targets": [
   "golgi"
  ],
  "choices": [
   {
    "id": "golgi",
    "label": "Golgi apparatus"
   }
  ],
  "answer": [
   "golgi"
  ],
  "explanation": "Structure 1: Golgi apparatus. Modifies, sorts, and packages materials for transport.",
  "hint": "1: Look for a separate stack of curved pink membranes."
 },
 {
  "id": "label-plant-1-0",
  "kind": "label",
  "skill": "labels",
  "prompt": "Match each name to its numbered structure.",
  "context": "Select a name, then its number on the cell.",
  "cell": "plant",
  "targets": [
   "nucleus",
   "membrane",
   "mitochondria",
   "cytoplasm"
  ],
  "choices": [
   {
    "id": "nucleus",
    "label": "Nucleus"
   },
   {
    "id": "membrane",
    "label": "Cell membrane"
   },
   {
    "id": "mitochondria",
    "label": "Mitochondria"
   },
   {
    "id": "cytoplasm",
    "label": "Cytoplasm"
   }
  ],
  "answer": [
   "nucleus",
   "membrane",
   "mitochondria",
   "cytoplasm"
  ],
  "explanation": "Structure 1: Nucleus. Contains DNA and helps control cell activities. Structure 2: Cell membrane. Controls what enters and leaves the cell. Structure 3: Mitochondria. Release usable energy from food, producing ATP. Structure 4: Cytoplasm. Jelly-like material that holds organelles and supports cell processes.",
  "hint": "1: Look for the large purple structure with a darker center. 2: Look for the thin boundary around the cytoplasm, inside the wall in a plant. 3: Look for orange bean-shaped structures with folded inner membranes. 4: Look at the pale material filling the spaces between the organelles."
 },
 {
  "id": "label-plant-2-0",
  "kind": "label",
  "skill": "labels",
  "prompt": "Label this group of cell parts.",
  "context": "Look at each structure’s shape and location.",
  "cell": "plant",
  "targets": [
   "wall",
   "membrane",
   "nucleus",
   "cytoplasm"
  ],
  "choices": [
   {
    "id": "wall",
    "label": "Cell wall"
   },
   {
    "id": "membrane",
    "label": "Cell membrane"
   },
   {
    "id": "nucleus",
    "label": "Nucleus"
   },
   {
    "id": "cytoplasm",
    "label": "Cytoplasm"
   }
  ],
  "answer": [
   "wall",
   "membrane",
   "nucleus",
   "cytoplasm"
  ],
  "explanation": "Structure 1: Cell wall. Gives the cell shape, support, and protection. Structure 2: Cell membrane. Controls what enters and leaves the cell. Structure 3: Nucleus. Contains DNA and helps control cell activities. Structure 4: Cytoplasm. Jelly-like material that holds organelles and supports cell processes.",
  "hint": "1: Look for the thick outer layer of the plant cell. 2: Look for the thin boundary around the cytoplasm, inside the wall in a plant. 3: Look for the large purple structure with a darker center. 4: Look at the pale material filling the spaces between the organelles."
 },
 {
  "id": "label-plant-2-1",
  "kind": "label",
  "skill": "labels",
  "prompt": "Label this group of cell parts.",
  "context": "Look at each structure’s shape and location.",
  "cell": "plant",
  "targets": [
   "mitochondria",
   "ribosomes"
  ],
  "choices": [
   {
    "id": "mitochondria",
    "label": "Mitochondria"
   },
   {
    "id": "ribosomes",
    "label": "Ribosomes"
   }
  ],
  "answer": [
   "mitochondria",
   "ribosomes"
  ],
  "explanation": "Structure 1: Mitochondria. Release usable energy from food, producing ATP. Structure 2: Ribosomes. Make proteins.",
  "hint": "1: Look for orange bean-shaped structures with folded inner membranes. 2: Look for the tiny dark paired dots, some beside the folded ER."
 },
 {
  "id": "label-plant-3-0",
  "kind": "label",
  "skill": "labels",
  "prompt": "Label this group of cell parts.",
  "context": "Look at each structure’s shape and location.",
  "cell": "plant",
  "targets": [
   "wall",
   "membrane",
   "nucleus",
   "cytoplasm"
  ],
  "choices": [
   {
    "id": "wall",
    "label": "Cell wall"
   },
   {
    "id": "membrane",
    "label": "Cell membrane"
   },
   {
    "id": "nucleus",
    "label": "Nucleus"
   },
   {
    "id": "cytoplasm",
    "label": "Cytoplasm"
   }
  ],
  "answer": [
   "wall",
   "membrane",
   "nucleus",
   "cytoplasm"
  ],
  "explanation": "Structure 1: Cell wall. Gives the cell shape, support, and protection. Structure 2: Cell membrane. Controls what enters and leaves the cell. Structure 3: Nucleus. Contains DNA and helps control cell activities. Structure 4: Cytoplasm. Jelly-like material that holds organelles and supports cell processes.",
  "hint": "1: Look for the thick outer layer of the plant cell. 2: Look for the thin boundary around the cytoplasm, inside the wall in a plant. 3: Look for the large purple structure with a darker center. 4: Look at the pale material filling the spaces between the organelles."
 },
 {
  "id": "label-plant-3-1",
  "kind": "label",
  "skill": "labels",
  "prompt": "Label this group of cell parts.",
  "context": "Look at each structure’s shape and location.",
  "cell": "plant",
  "targets": [
   "mitochondria",
   "ribosomes",
   "vacuole",
   "chloroplasts"
  ],
  "choices": [
   {
    "id": "mitochondria",
    "label": "Mitochondria"
   },
   {
    "id": "ribosomes",
    "label": "Ribosomes"
   },
   {
    "id": "vacuole",
    "label": "Vacuole"
   },
   {
    "id": "chloroplasts",
    "label": "Chloroplasts"
   }
  ],
  "answer": [
   "mitochondria",
   "ribosomes",
   "vacuole",
   "chloroplasts"
  ],
  "explanation": "Structure 1: Mitochondria. Release usable energy from food, producing ATP. Structure 2: Ribosomes. Make proteins. Structure 3: Vacuole. Stores water and other materials. Structure 4: Chloroplasts. Use sunlight to make sugars through photosynthesis.",
  "hint": "1: Look for orange bean-shaped structures with folded inner membranes. 2: Look for the tiny dark paired dots, some beside the folded ER. 3: Look for a blue storage sac; the plant cell has one very large central sac. 4: Look for green ovals with stacks of little disks."
 },
 {
  "id": "identify-plant-wall",
  "kind": "diagram-choice",
  "skill": "labels",
  "prompt": "Which cell part is highlighted?",
  "choices": [
   {
    "id": "wall",
    "label": "Cell wall"
   },
   {
    "id": "nucleus",
    "label": "Nucleus"
   },
   {
    "id": "cytoplasm",
    "label": "Cytoplasm"
   }
  ],
  "answer": [
   "wall"
  ],
  "part": "wall",
  "hint": "Look for the thick outer layer of the plant cell.",
  "explanation": "Cell wall: Gives the cell shape, support, and protection.",
  "cell": "plant",
  "highlight": "wall"
 },
 {
  "id": "identify-plant-membrane",
  "kind": "diagram-choice",
  "skill": "labels",
  "prompt": "Which cell part is highlighted?",
  "choices": [
   {
    "id": "membrane",
    "label": "Cell membrane"
   },
   {
    "id": "cytoplasm",
    "label": "Cytoplasm"
   },
   {
    "id": "mitochondria",
    "label": "Mitochondria"
   }
  ],
  "answer": [
   "membrane"
  ],
  "part": "membrane",
  "hint": "Look for the thin boundary around the cytoplasm, inside the wall in a plant.",
  "explanation": "Cell membrane: Controls what enters and leaves the cell.",
  "cell": "plant",
  "highlight": "membrane"
 },
 {
  "id": "identify-plant-nucleus",
  "kind": "diagram-choice",
  "skill": "labels",
  "prompt": "Which cell part is highlighted?",
  "choices": [
   {
    "id": "nucleus",
    "label": "Nucleus"
   },
   {
    "id": "mitochondria",
    "label": "Mitochondria"
   },
   {
    "id": "ribosomes",
    "label": "Ribosomes"
   }
  ],
  "answer": [
   "nucleus"
  ],
  "part": "nucleus",
  "hint": "Look for the large purple structure with a darker center.",
  "explanation": "Nucleus: Contains DNA and helps control cell activities.",
  "cell": "plant",
  "highlight": "nucleus"
 },
 {
  "id": "identify-plant-cytoplasm",
  "kind": "diagram-choice",
  "skill": "labels",
  "prompt": "Which cell part is highlighted?",
  "choices": [
   {
    "id": "cytoplasm",
    "label": "Cytoplasm"
   },
   {
    "id": "ribosomes",
    "label": "Ribosomes"
   },
   {
    "id": "lysosomes",
    "label": "Lysosomes"
   }
  ],
  "answer": [
   "cytoplasm"
  ],
  "part": "cytoplasm",
  "hint": "Look at the pale material filling the spaces between the organelles.",
  "explanation": "Cytoplasm: Jelly-like material that holds organelles and supports cell processes.",
  "cell": "plant",
  "highlight": "cytoplasm"
 },
 {
  "id": "identify-plant-mitochondria",
  "kind": "diagram-choice",
  "skill": "labels",
  "prompt": "Which cell part is highlighted?",
  "choices": [
   {
    "id": "mitochondria",
    "label": "Mitochondria"
   },
   {
    "id": "lysosomes",
    "label": "Lysosomes"
   },
   {
    "id": "vacuole",
    "label": "Vacuole"
   }
  ],
  "answer": [
   "mitochondria"
  ],
  "part": "mitochondria",
  "hint": "Look for orange bean-shaped structures with folded inner membranes.",
  "explanation": "Mitochondria: Release usable energy from food, producing ATP.",
  "cell": "plant",
  "highlight": "mitochondria"
 },
 {
  "id": "identify-plant-ribosomes",
  "kind": "diagram-choice",
  "skill": "labels",
  "prompt": "Which cell part is highlighted?",
  "choices": [
   {
    "id": "ribosomes",
    "label": "Ribosomes"
   },
   {
    "id": "wall",
    "label": "Cell wall"
   },
   {
    "id": "membrane",
    "label": "Cell membrane"
   }
  ],
  "answer": [
   "ribosomes"
  ],
  "part": "ribosomes",
  "hint": "Look for the tiny dark paired dots, some beside the folded ER.",
  "explanation": "Ribosomes: Make proteins.",
  "cell": "plant",
  "highlight": "ribosomes"
 },
 {
  "id": "identify-plant-vacuole",
  "kind": "diagram-choice",
  "skill": "labels",
  "prompt": "Which cell part is highlighted?",
  "choices": [
   {
    "id": "vacuole",
    "label": "Vacuole"
   },
   {
    "id": "nucleus",
    "label": "Nucleus"
   },
   {
    "id": "cytoplasm",
    "label": "Cytoplasm"
   }
  ],
  "answer": [
   "vacuole"
  ],
  "part": "vacuole",
  "hint": "Look for a blue storage sac; the plant cell has one very large central sac.",
  "explanation": "Vacuole: Stores water and other materials.",
  "cell": "plant",
  "highlight": "vacuole"
 },
 {
  "id": "identify-plant-chloroplasts",
  "kind": "diagram-choice",
  "skill": "labels",
  "prompt": "Which cell part is highlighted?",
  "choices": [
   {
    "id": "chloroplasts",
    "label": "Chloroplasts"
   },
   {
    "id": "cytoplasm",
    "label": "Cytoplasm"
   },
   {
    "id": "mitochondria",
    "label": "Mitochondria"
   }
  ],
  "answer": [
   "chloroplasts"
  ],
  "part": "chloroplasts",
  "hint": "Look for green ovals with stacks of little disks.",
  "explanation": "Chloroplasts: Use sunlight to make sugars through photosynthesis.",
  "cell": "plant",
  "highlight": "chloroplasts"
 },
 {
  "id": "label-plant-5-0",
  "kind": "label",
  "skill": "labels",
  "prompt": "Label this group of cell parts.",
  "context": "Extension: ER and Golgi join the core structures.",
  "cell": "plant",
  "targets": [
   "wall",
   "membrane",
   "nucleus",
   "cytoplasm"
  ],
  "choices": [
   {
    "id": "wall",
    "label": "Cell wall"
   },
   {
    "id": "membrane",
    "label": "Cell membrane"
   },
   {
    "id": "nucleus",
    "label": "Nucleus"
   },
   {
    "id": "cytoplasm",
    "label": "Cytoplasm"
   }
  ],
  "answer": [
   "wall",
   "membrane",
   "nucleus",
   "cytoplasm"
  ],
  "explanation": "Structure 1: Cell wall. Gives the cell shape, support, and protection. Structure 2: Cell membrane. Controls what enters and leaves the cell. Structure 3: Nucleus. Contains DNA and helps control cell activities. Structure 4: Cytoplasm. Jelly-like material that holds organelles and supports cell processes.",
  "hint": "1: Look for the thick outer layer of the plant cell. 2: Look for the thin boundary around the cytoplasm, inside the wall in a plant. 3: Look for the large purple structure with a darker center. 4: Look at the pale material filling the spaces between the organelles."
 },
 {
  "id": "label-plant-5-1",
  "kind": "label",
  "skill": "labels",
  "prompt": "Label this group of cell parts.",
  "context": "Extension: ER and Golgi join the core structures.",
  "cell": "plant",
  "targets": [
   "mitochondria",
   "ribosomes",
   "vacuole",
   "chloroplasts"
  ],
  "choices": [
   {
    "id": "mitochondria",
    "label": "Mitochondria"
   },
   {
    "id": "ribosomes",
    "label": "Ribosomes"
   },
   {
    "id": "vacuole",
    "label": "Vacuole"
   },
   {
    "id": "chloroplasts",
    "label": "Chloroplasts"
   }
  ],
  "answer": [
   "mitochondria",
   "ribosomes",
   "vacuole",
   "chloroplasts"
  ],
  "explanation": "Structure 1: Mitochondria. Release usable energy from food, producing ATP. Structure 2: Ribosomes. Make proteins. Structure 3: Vacuole. Stores water and other materials. Structure 4: Chloroplasts. Use sunlight to make sugars through photosynthesis.",
  "hint": "1: Look for orange bean-shaped structures with folded inner membranes. 2: Look for the tiny dark paired dots, some beside the folded ER. 3: Look for a blue storage sac; the plant cell has one very large central sac. 4: Look for green ovals with stacks of little disks."
 },
 {
  "id": "label-plant-5-2",
  "kind": "label",
  "skill": "labels",
  "prompt": "Label this group of cell parts.",
  "context": "Extension: ER and Golgi join the core structures.",
  "cell": "plant",
  "targets": [
   "er",
   "golgi"
  ],
  "choices": [
   {
    "id": "er",
    "label": "Endoplasmic reticulum"
   },
   {
    "id": "golgi",
    "label": "Golgi apparatus"
   }
  ],
  "answer": [
   "er",
   "golgi"
  ],
  "explanation": "Structure 1: Endoplasmic reticulum. Helps make and move proteins and lipids. Structure 2: Golgi apparatus. Modifies, sorts, and packages materials for transport.",
  "hint": "1: Look for folded blue membranes near the nucleus. 2: Look for a separate stack of curved pink membranes."
 }
];
