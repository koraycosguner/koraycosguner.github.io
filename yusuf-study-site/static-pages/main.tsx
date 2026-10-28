import {Component, Suspense, lazy, type ComponentType, type ReactNode} from 'react';
import {createRoot} from 'react-dom/client';
import {pagesBase} from './routes';
import '../app/globals.css';

const routes:Record<string,ComponentType>={
  '/subjects/science/cells/concept-2/':lazy(()=>import('../app/subjects/science/cells/concept-2/page')),
  '/subjects/science/cells/concept-2/school/':lazy(()=>import('../app/subjects/science/cells/concept-2/school/page')),
  '/subjects/science/cells/concept-2/systems/':lazy(()=>import('../app/subjects/science/cells/concept-2/systems/page')),
  '/subjects/science/cells/concept-2/explore/':lazy(()=>import('../app/subjects/science/cells/concept-2/explore/page')),
  '/subjects/science/cells/concept-2/label/':lazy(()=>import('../app/subjects/science/cells/concept-2/label/page')),
  '/subjects/science/cells/concept-2/functions/':lazy(()=>import('../app/subjects/science/cells/concept-2/functions/page')),
  '/subjects/science/cells/concept-2/analogies/':lazy(()=>import('../app/subjects/science/cells/concept-2/analogies/page')),
  '/subjects/science/cells/concept-2/compare/':lazy(()=>import('../app/subjects/science/cells/concept-2/compare/page')),
  '/subjects/science/cells/concept-2/types/':lazy(()=>import('../app/subjects/science/cells/concept-2/types/page')),
  '/subjects/science/cells/concept-2/test/':lazy(()=>import('../app/subjects/science/cells/concept-2/test/page')),
  '/subjects/science/cells/concept-2/quick/':lazy(()=>import('../app/subjects/science/cells/concept-2/quick/page')),
  '/subjects/science/cells/concept-2/quest/':lazy(()=>import('../app/subjects/science/cells/concept-2/quest/page')),
  '/subjects/science/cells/concept-2/match/':lazy(()=>import('../app/subjects/science/cells/concept-2/match/page')),
  '/subjects/science/cells/concept-2/paragraphs/':lazy(()=>import('../app/subjects/science/cells/concept-2/paragraphs/page')),
  '/subjects/science/cells/concept-2/write/':lazy(()=>import('../app/subjects/science/cells/concept-2/write/page')),
  '/quizzes/phrases-clauses/':lazy(()=>import('../app/quizzes/phrases-clauses/page')),
  '/quizzes/phrases-clauses/learn/':lazy(()=>import('../app/quizzes/phrases-clauses/learn/page')),
  '/quizzes/phrases-clauses/level-1/':lazy(()=>import('../app/quizzes/phrases-clauses/level-1/page')),
  '/quizzes/phrases-clauses/level-2/':lazy(()=>import('../app/quizzes/phrases-clauses/level-2/page')),
  '/quizzes/phrases-clauses/level-3/':lazy(()=>import('../app/quizzes/phrases-clauses/level-3/page')),
  '/quizzes/phrases-clauses/level-4/':lazy(()=>import('../app/quizzes/phrases-clauses/level-4/page')),
  '/quizzes/phrases-clauses/review/':lazy(()=>import('../app/quizzes/phrases-clauses/review/page')),
  '/quizzes/phrases-clauses/test/':lazy(()=>import('../app/quizzes/phrases-clauses/test/page')),
  '/quizzes/phrases-clauses/builder/':lazy(()=>import('../app/quizzes/phrases-clauses/builder/page')),

  '/subjects/science/cells/':lazy(()=>import('../app/subjects/science/cells/page')),
  '/subjects/science/cells/concept-1/':lazy(()=>import('../app/subjects/science/cells/concept-1/page')),
  '/subjects/science/cells/concept-1/worksheet/':lazy(()=>import('../app/subjects/science/cells/concept-1/worksheet/page')),
  '/subjects/science/cells/concept-1/paragraph/':lazy(()=>import('../app/subjects/science/cells/concept-1/paragraph/page')),
  '/subjects/science/cells/concept-1/quiz/':lazy(()=>import('../app/subjects/science/cells/concept-1/quiz/page')),

  '/quizzes/spanish/unit-3/':lazy(()=>import('../app/quizzes/spanish/unit-3/page')),
  '/quizzes/spanish/unit-3/complete-story/':lazy(()=>import('../app/quizzes/spanish/unit-3/complete-story/page')),
  '/quizzes/spanish/unit-3/study-guide/':lazy(()=>import('../app/quizzes/spanish/unit-3/study-guide/page')),
  '/quizzes/spanish/unit-3/practice-test/':lazy(()=>import('../app/quizzes/spanish/unit-3/practice-test/page')),
  '/quizzes/spanish/unit-2/learn-with-pictures/':lazy(()=>import('../app/quizzes/spanish/unit-2/learn-with-pictures/page')),
  '/quizzes/spanish/unit-2/practice/':lazy(()=>import('../app/quizzes/spanish/unit-2/practice/page')),
  '/quizzes/spanish/unit-2/vocabulary/':lazy(()=>import('../app/quizzes/spanish/unit-2/vocabulary/page')),
  '/quizzes/spanish/unit-2/listening/':lazy(()=>import('../app/quizzes/spanish/unit-2/listening/page')),
  '/quizzes/spanish/unit-2/test/':lazy(()=>import('../app/quizzes/spanish/unit-2/test/page')),
  '/quizzes/spanish/unit-2/progress/':lazy(()=>import('../app/quizzes/spanish/unit-2/progress/page')),

  '/quizzes/spanish/unit-2/study/':lazy(()=>import('../app/quizzes/spanish/unit-2/study/page')),
  '/quizzes/spanish/unit-2/story-practice/':lazy(()=>import('../app/quizzes/spanish/unit-2/story-practice/page')),
  '/quizzes/spanish/unit-2/complete-story/':lazy(()=>import('../app/quizzes/spanish/unit-2/complete-story/page')),
  '/quizzes/spanish/unit-2/practice-test/':lazy(()=>import('../app/quizzes/spanish/unit-2/practice-test/page')),
  '/quizzes/spanish/unit-2/study-guide/':lazy(()=>import('../app/quizzes/spanish/unit-2/study-guide/page')),
  '/':lazy(()=>import('../app/page')),
  '/subjects/science/':lazy(()=>import('../app/subjects/science/page')),
  '/subjects/social-sciences/':lazy(()=>import('../app/subjects/social-sciences/page')),
  '/subjects/language-arts/':lazy(()=>import('../app/subjects/language-arts/page')),
  '/quizzes/spanish/':lazy(()=>import('../app/quizzes/spanish/page')),
  '/quizzes/spanish/unit-2/':lazy(()=>import('../app/quizzes/spanish/unit-2/page')),
  '/quizzes/spanish/unit-2/explore/':lazy(()=>import('../app/quizzes/spanish/unit-2/explore/page')),
  '/quizzes/spanish/unit-2/checkpoint/':lazy(()=>import('../app/quizzes/spanish/unit-2/checkpoint/page')),
  '/quizzes/spanish/unit-2/quiz/':lazy(()=>import('../app/quizzes/spanish/unit-2/quiz/page')),
  '/quizzes/spanish/unit-2/guide/':lazy(()=>import('../app/quizzes/spanish/unit-2/guide/page')),
  '/quizzes/spanish/unit-2/learn/':lazy(()=>import('../app/quizzes/spanish/unit-2/learn/page')),
  '/quizzes/spanish/unit-2/test-prep/':lazy(()=>import('../app/quizzes/spanish/unit-2/test-prep/page')),
  '/quizzes/spanish/unit-2/proficiency/':lazy(()=>import('../app/quizzes/spanish/unit-2/proficiency/page')),
  '/quizzes/rikki-tikki-tavi/':lazy(()=>import('../app/quizzes/rikki-tikki-tavi/page')),
};
class LoadBoundary extends Component<{children:ReactNode},{failed:boolean}> {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true}}
  render(){return this.state.failed?<main style={{fontFamily:'system-ui',padding:'2rem',color:'#173c43'}}><h1>Let’s try opening that again.</h1><p>Your saved progress stays on this browser.</p><button onClick={()=>window.location.reload()}>Try again</button> <a href={pagesBase}>All subjects</a></main>:this.props.children}
}
let path=window.location.pathname.slice(pagesBase.length-1).replace(/\/index\.html$/,'/');
if(!path.endsWith('/'))path+='/';
const Page=routes[path];
if(path.includes('/phrases-clauses/'))document.title='Phrases vs. Clauses · Yusuf’s Sentence Studio';
else if(path.includes('/concept-2/'))document.title='Cell Structure & Analogies · Yusuf’s Cell Lab';
else if(path.includes('/cells/'))document.title='Cell Theory & Scientists · Yusuf’s Study Club';
else if(path.includes('/unit-3/'))document.title='Spanish Unit 3 · Yusuf’s Study Club';
else if(path.includes('spanish'))document.title='Spanish · Yusuf’s Study Club';
else if(path.includes('rikki'))document.title='Rikki-Tikki-Tavi · Yusuf’s Study Club';
createRoot(document.getElementById('root')!).render(<LoadBoundary><Suspense fallback={<p style={{font:'18px system-ui',padding:'2rem',color:'#173c43'}}>Opening your activity…</p>}>{Page?<Page/>:<main><h1>Choose your next activity</h1><a href={pagesBase}>All subjects</a></main>}</Suspense></LoadBoundary>);
