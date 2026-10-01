type Subject = {
  name: string;
  initial: string;
  note: string;
  description: string;
  className: string;
  href?: string;
  ready: boolean;
};

const subjects: Subject[] = [
  {
    name: "Social Sciences",
    initial: "S",
    note: "1 quiz ready",
    description: "Geography, history, cultures, and the world around us.",
    className: "subject-social",
    href: "/subjects/social-sciences/",
    ready: true,
  },
  {
    name: "Math",
    initial: "M",
    note: "Next subject",
    description: "Numbers, equations, geometry, and problem-solving.",
    className: "subject-math",
    ready: false,
  },
  {
    name: "Spanish",
    initial: "Ñ",
    note: "Unit 2 adventure",
    description: "Explore a classroom, meet classmates, and practice Spanish in context.",
    className: "subject-spanish",
    href: "/quizzes/spanish/",
    ready: true,
  },
  {
    name: "Science",
    initial: "⚗",
    note: "1 quiz ready",
    description: "Life, Earth, matter, energy, and experiments.",
    className: "subject-science",
    href: "/subjects/science/",
    ready: true,
  },
];

const practiceBenefits = [
  { number: "01", title: "Know right away", text: "Every answer includes instant feedback and a short explanation." },
  { number: "02", title: "Focus on tricky parts", text: "Missed questions collect into a quick retry round." },
  { number: "03", title: "Practice anywhere", text: "Every quiz works on a computer, tablet, or phone." },
];

function SubjectTile({ subject }: { subject: Subject }) {
  const contents = (
    <>
      <span className="subject-icon" aria-hidden="true">{subject.initial}</span>
      <div>
        <strong>{subject.name}</strong>
        <span>{subject.note}</span>
      </div>
      {subject.ready && <span className="ready-label">Open</span>}
    </>
  );

  return subject.href ? (
    <a className={`subject-tile ${subject.className}`} href={subject.href}>{contents}</a>
  ) : (
    <div className={`subject-tile ${subject.className}`} aria-label={`${subject.name}, coming next`}>{contents}</div>
  );
}

export default function Home() {
  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Yusuf's 7th Grade Quizzes home">
          <span className="brand-mark" aria-hidden="true">Y7</span>
          <span>Yusuf&apos;s 7th Grade Quizzes</span>
        </a>
        <div className="library-status"><span className="status-dot" aria-hidden="true" />Growing quiz library</div>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">One practice spot · Every subject</p>
            <h1 id="hero-title">Quiz. Learn.<span>Level up.</span></h1>
            <p className="hero-intro">
              Pick a school subject, choose a topic, and start practicing. Yusuf&apos;s
              quiz library can grow from Social Sciences to Math, Spanish, Science,
              and whatever comes next.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#subject-library">Explore subjects <span aria-hidden="true">↓</span></a>
              <a className="text-link" href="/subjects/social-sciences/">Open Social Sciences</a>
            </div>
            <ul className="quick-facts" aria-label="Quiz highlights">
              <li><span aria-hidden="true">✓</span> No account needed</li>
              <li><span aria-hidden="true">✓</span> Instant feedback</li>
              <li><span aria-hidden="true">✓</span> Mobile friendly</li>
            </ul>
          </div>

          <aside className="subject-board" aria-label="Subject areas">
            <div className="board-heading">
              <div><span>Yusuf&apos;s subjects</span><strong>Choose a shelf</strong></div>
              <span className="board-sticker" aria-hidden="true">★</span>
            </div>
            <div className="subject-grid">
              {subjects.map((subject) => <SubjectTile subject={subject} key={subject.name} />)}
            </div>
            <a className="latest-quiz" href="/quizzes/ecology/">
              <span><small>Latest quiz</small>Ecology Expedition</span>
              <strong aria-hidden="true">→</strong>
            </a>
          </aside>
        </section>

        <section className="subject-library" id="subject-library" aria-labelledby="library-title">
          <div className="section-heading">
            <div><p className="eyebrow">Subject library</p><h2 id="library-title">What are we studying today?</h2></div>
            <p>Choose a subject to see its quizzes. New topics can be added as Yusuf moves through the school year.</p>
          </div>

          <div className="subject-library-grid">
            {subjects.map((subject) => {
              const content = (
                <>
                  <div className="library-card-top">
                    <span className={`large-subject-icon ${subject.className}`} aria-hidden="true">{subject.initial}</span>
                    <span className={subject.ready ? "availability ready" : "availability"}>{subject.ready ? "1 quiz" : "Coming next"}</span>
                  </div>
                  <h3>{subject.name}</h3>
                  <p>{subject.description}</p>
                  <span className="library-card-link">{subject.ready ? "See quizzes →" : "Shelf ready"}</span>
                </>
              );

              return subject.href ? (
                <a className="subject-library-card is-ready" href={subject.href} key={subject.name}>{content}</a>
              ) : (
                <article className="subject-library-card" key={subject.name}>{content}</article>
              );
            })}
          </div>
        </section>

        <section className="practice-strip" aria-labelledby="practice-title">
          <div className="practice-intro"><p className="eyebrow">Built for practice</p><h2 id="practice-title">Small wins add up.</h2></div>
          <div className="benefit-grid">
            {practiceBenefits.map((benefit) => (
              <article key={benefit.number}><span>{benefit.number}</span><h3>{benefit.title}</h3><p>{benefit.text}</p></article>
            ))}
          </div>
        </section>
      </main>

      <footer><p>Made for Yusuf · Grade 7 · Keep going!</p><a href="#hero-title">Back to top ↑</a></footer>
    </div>
  );
}
