export type StudyHelp = 'pronouns' | 'perspective' | 'ser' | 'articles' | 'adjectives' | 'hay' | 'vocabulary' | 'origin' | 'possession';
export type StudyStep = {prompt: string; options: string[]; answer: string; hint: string; explanation: string; help: StudyHelp};
export type StudyQuestion = {id: string; chapter: string; context: string; speaker?: string; reading?: string; steps: StudyStep[]};
export type StudyLesson = {id: string; title: string; summary: string; examples: string[]; questions: StudyQuestion[]};
export type WordStory = {id: string; title: string; intro: string; words: string[]; lines: {before: string; answer: string; after: string; hint: string}[]};
