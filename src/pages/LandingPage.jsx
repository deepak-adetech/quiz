import { Link } from 'react-router-dom';

const dimensions = [
  { icon: '\u2699\uFE0F', label: 'Execution' },
  { icon: '\uD83D\uDCCA', label: 'Data' },
  { icon: '\uD83D\uDD17', label: 'Connection' },
  { icon: '\uD83C\uDFAF', label: 'Control' },
];

const previews = [
  { icon: '\uD83D\uDCD1', title: 'Your Archetype', desc: 'One of 16 unique operational profiles that reveals how your organization truly works.' },
  { icon: '\u2728', title: 'Your Superpowers', desc: 'The operational strengths you should double down on and leverage for growth.' },
  { icon: '\u26A0\uFE0F', title: 'Your Kryptonite', desc: 'Hidden weaknesses that silently drain time, money, and team morale.' },
  { icon: '\uD83C\uDFC1', title: 'Action Plan', desc: 'Concrete starting points tailored to your specific operational profile.' },
];

export default function LandingPage() {
  return (
    <div className="landing-page">
      <nav className="nav">
        <Link to="/" className="nav-logo">AutoWorkflows.ai</Link>
      </nav>

      <main className="landing-hero">
        <div className="hero-badge">FREE ASSESSMENT</div>
        <h1 className="hero-title">
          What's Your<br />
          <span className="hero-highlight">Operational Archetype?</span>
        </h1>
        <p className="hero-subtitle">
          Discover how your organization really operates. This 2-minute quiz reveals your
          unique operational DNA across 4 critical dimensions — and shows you exactly
          where to start improving.
        </p>

        <div className="hero-dimensions">
          {dimensions.map((d) => (
            <div className="dimension-pill" key={d.label}>
              <span className="pill-icon">{d.icon}</span>
              <span>{d.label}</span>
            </div>
          ))}
        </div>

        <Link to="/quiz" className="btn-primary btn-large">
          Take the Quiz
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4.167 10h11.666M10 4.167L15.833 10 10 15.833" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <p className="hero-meta">12 questions &middot; Takes ~2 minutes &middot; Free</p>

        <div className="hero-social-proof">
          <div className="proof-avatars">
            {['A', 'M', 'K', 'S', 'R'].map((l, i) => {
              const colors = ['#4F46E5', '#059669', '#DC2626', '#D97706', '#7C3AED'];
              return <div className="avatar" style={{ background: colors[i] }} key={l}>{l}</div>;
            })}
          </div>
          <span className="proof-text">Trusted by 500+ business leaders</span>
        </div>
      </main>

      <section className="landing-preview">
        <h2 className="section-title">What You'll Discover</h2>
        <div className="preview-grid">
          {previews.map((p) => (
            <div className="preview-card" key={p.title}>
              <div className="preview-icon">{p.icon}</div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} AutoWorkflows.ai. All rights reserved.</p>
      </footer>
    </div>
  );
}
