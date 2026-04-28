import { Link } from 'react-router-dom';
import {
  Cog,
  BarChart3,
  Network,
  Compass,
  Fingerprint,
  Sparkles,
  AlertTriangle,
  Route,
  ArrowUpRight,
  ArrowRight,
} from 'lucide-react';
import archetypes from '../data/archetypes';

const dimensions = [
  { Icon: Cog, label: 'Execution' },
  { Icon: BarChart3, label: 'Data' },
  { Icon: Network, label: 'Connection' },
  { Icon: Compass, label: 'Control' },
];

const previews = [
  { Icon: Fingerprint, title: 'Your Archetype', desc: 'One of 16 unique operational profiles that reveals how your organization truly works.' },
  { Icon: Sparkles, title: 'Your Superpowers', desc: 'The operational strengths you should double down on and leverage for growth.' },
  { Icon: AlertTriangle, title: 'Your Kryptonite', desc: 'Hidden weaknesses that silently drain time, money, and team morale.' },
  { Icon: Route, title: 'Action Plan', desc: 'Concrete starting points tailored to your specific operational profile.' },
];

const previewCodes = ['MCSP', 'ACIP', 'MFIR', 'ACSR', 'MCIP', 'AFIP', 'MFSR', 'ACSP'];

export default function LandingPage() {
  return (
    <div className="landing-page">
      <nav className="nav">
        <Link to="/" className="nav-logo">
          <span className="nav-mark" aria-hidden>
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0A84FF" />
                  <stop offset="55%" stopColor="#5E5CE6" />
                  <stop offset="100%" stopColor="#BF5AF2" />
                </linearGradient>
              </defs>
              <path
                d="M 15 2 C 15 11, 15 11, 26 14 C 15 17, 15 17, 15 26 C 15 17, 15 17, 4 14 C 15 11, 15 11, 15 2 Z"
                fill="url(#logoGrad)"
              />
            </svg>
          </span>
          AutoWorkFlow<span className="nav-logo-accent">.AI</span>
        </Link>
        <div className="nav-links">
          <Link to="/library" className="nav-link">Library</Link>
          <Link to="/quiz" className="btn-primary btn-small">
            Take the Quiz
            <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      <main className="landing-hero">
        <div className="aurora" aria-hidden />
        <div className="hero-gradient-bg" aria-hidden />

        <div className="hero-content">
          <span className="hero-badge">Free Assessment</span>
          <h1 className="hero-title">
            What's your<br />
            <span className="hero-highlight">operational archetype?</span>
          </h1>
          <p className="hero-subtitle">
            Discover how your organization really operates. This 2-minute quiz reveals your
            unique operational DNA across 4 critical dimensions — and shows you exactly
            where to start improving.
          </p>

          <div className="hero-dimensions">
            {dimensions.map(({ Icon, label }) => (
              <div className="dimension-pill" key={label}>
                <span className="pill-icon"><Icon size={14} strokeWidth={1.75} /></span>
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="hero-ctas">
            <Link to="/quiz" className="btn-grad btn-large">
              Take the Quiz
              <ArrowUpRight size={16} strokeWidth={1.75} />
            </Link>
            <Link to="/library" className="btn-ghost btn-large">
              Browse Library
              <ArrowRight size={16} strokeWidth={1.75} />
            </Link>
          </div>
          <p className="hero-meta mono">12 questions · ~2 minutes · Free</p>

          <div className="hero-social-proof">
            <div className="proof-avatars">
              {['A', 'M', 'K', 'S', 'R'].map((l, i) => {
                const colors = ['#0071E3', '#5E5CE6', '#BF5AF2', '#B0852C', '#A04A2A'];
                return <div className="avatar" style={{ background: colors[i] }} key={l}>{l}</div>;
              })}
            </div>
            <span className="proof-text mono">Trusted by 500+ business leaders</span>
          </div>
        </div>
      </main>

      <section className="landing-preview">
        <div className="eyebrow eyebrow-center">01 · What you'll discover</div>
        <h2 className="section-title">A field report on how your team actually runs.</h2>
        <div className="preview-grid">
          {previews.map(({ Icon, title, desc }) => (
            <div className="preview-card" key={title}>
              <div className="preview-icon"><Icon size={20} strokeWidth={1.75} /></div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-library">
        <div className="library-section-head">
          <div>
            <div className="eyebrow">02 · The archetype library</div>
            <h2 className="section-title section-title-left">
              16 operational personalities.<br />
              <span className="section-title-muted">Which one is yours?</span>
            </h2>
          </div>
          <Link to="/library" className="u-link">
            See all 16
            <ArrowUpRight size={14} strokeWidth={1.75} />
          </Link>
        </div>

        <div className="landing-archetype-grid">
          {previewCodes.map((code) => {
            const arch = archetypes[code];
            return (
              <Link
                to="/library"
                className={`mini-archetype-card theme-${arch.theme}`}
                key={code}
              >
                <div className="mini-card-top">
                  <span className="mini-emoji" aria-hidden>{arch.emoji}</span>
                  <span className="mini-code mono">{code}</span>
                </div>
                <h4 className="mini-name">{arch.name}</h4>
                <p className="mini-tagline">"{arch.tagline}"</p>
                <div className="mini-animal">
                  <span aria-hidden>{arch.animalEmoji}</span>
                  <span>{arch.animal}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-inner">
          <span className="mono">© {new Date().getFullYear()} AutoWorkFlow.AI</span>
          <span className="mono footer-muted">All rights reserved</span>
        </div>
      </footer>
    </div>
  );
}
