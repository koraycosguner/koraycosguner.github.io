/** Static entry points; each gets its own index.html for direct links and refreshes. */
export const pagesBase = '/yusufs-quizzes/';
export const pageRoutes = [
  '/', '/subjects/science/', '/subjects/social-sciences/', '/subjects/language-arts/',
  '/quizzes/spanish/', '/quizzes/spanish/unit-2/', '/quizzes/spanish/unit-2/explore/',
  '/quizzes/spanish/unit-2/checkpoint/', '/quizzes/spanish/unit-2/quiz/',
  '/quizzes/spanish/unit-2/guide/', '/quizzes/rikki-tikki-tavi/',
] as const;
