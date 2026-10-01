export default function SocialSciencesPage() {
  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Yusuf's 7th Grade Quizzes home">
          <span className="brand-mark" aria-hidden="true">Y7</span>
          <span>Yusuf&apos;s 7th Grade Quizzes</span>
        </a>
        <a className="home-link" href="/">All subjects</a>
      </header>

      <main className="subject-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><a href="/">Subjects</a><span aria-hidden="true">/</span><span>Social Sciences</span></nav>

        <section className="subject-hero subject-social-hero" aria-labelledby="subject-title">
          <div className="subject-hero-icon" aria-hidden="true">S</div>
          <div>
            <p className="eyebrow">Subject shelf</p>
            <h1 id="subject-title">Social Sciences</h1>
            <p>Explore geography, history, cultures, people, and places—one focused quiz at a time.</p>
          </div>
        </section>

        <section className="topic-quizzes" aria-labelledby="quizzes-title">
          <div className="section-heading compact-heading">
            <div><p className="eyebrow">Available now</p><h2 id="quizzes-title">Choose a quiz.</h2></div>
            <p>One quiz is ready. More Social Sciences topics can be added here later.</p>
          </div>

          <article className="quiz-card">
            <div className="quiz-thumbnail">
              <img src="/sw-asia-map.webp" alt="Study map of Southwest Asia labeled with letters" />
              <span>Geography</span>
            </div>
            <div className="quiz-card-copy">
              <p className="card-kicker">Geography · Southwest Asia</p>
              <h3>Learn About the Middle East</h3>
              <p>Review countries, capitals, rivers, seas, and political features in a 26-question interactive challenge.</p>
              <ul className="topic-list" aria-label="Topics covered"><li>Capitals</li><li>Political map</li><li>Physical features</li></ul>
            </div>
            <div className="quiz-card-action">
              <div className="question-total"><strong>26</strong><span>questions</span></div>
              <a className="button button-secondary" href="/quizzes/southwest-asia/">Start quiz <span aria-hidden="true">→</span></a>
            </div>
          </article>
        </section>
      </main>

      <footer><p>Social Sciences · Yusuf&apos;s 7th Grade Quizzes</p><a href="/">Back to subjects ↑</a></footer>
    </div>
  );
}
