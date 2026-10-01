export default function SciencePage() {
  return (
    <div className="site-shell">
      <header className="topbar"><a className="brand" href="/"><span className="brand-mark" aria-hidden="true">Y7</span><span>Yusuf&apos;s 7th Grade Quizzes</span></a><a className="home-link" href="/">All subjects</a></header>
      <main className="subject-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><a href="/">Subjects</a><span aria-hidden="true">/</span><span>Science</span></nav>
        <section className="subject-hero subject-science" aria-labelledby="subject-title"><div className="subject-hero-icon" aria-hidden="true">⚗</div><div><p className="eyebrow">Subject shelf · Grade 7</p><h1 id="subject-title">Science</h1><p>Explore living systems, follow the evidence, and discover how our world works.</p></div></section>
        <section className="topic-quizzes" aria-labelledby="quizzes-title"><div className="section-heading compact-heading"><div><p className="eyebrow">Your next discovery</p><h2 id="quizzes-title">Let curiosity lead.</h2></div><p>Study the ideas, try the experiments, and build confidence one question at a time.</p></div>
          <article className="quiz-card"><div className="quiz-thumbnail"><img src="/quizzes/ecology/forest-ecosystem.png" alt="Colorful forest ecosystem with plants, animals, and a river"/><span>Ecology · Part 1</span></div><div className="quiz-card-copy"><p className="card-kicker">Unit 1 major · On level</p><h3>Ecology Expedition</h3><p>Four quiz missions, illustrated questions, five discovery labs, and a complete vocabulary field guide.</p><ul className="topic-list" aria-label="Topics covered"><li>Living systems</li><li>Energy</li><li>Relationships</li><li>Natural cycles</li></ul></div><div className="quiz-card-action"><div className="question-total"><strong>72</strong><span>questions</span></div><a className="button button-secondary" href="/quizzes/ecology/">Begin expedition ↗</a></div></article>
        </section>
      </main>
      <footer><p>Science · Yusuf&apos;s 7th Grade Quizzes</p><a href="/">Back to subjects ↑</a></footer>
    </div>
  );
}
