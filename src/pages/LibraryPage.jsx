import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import archetypes, { archetypeCategories } from '../data/archetypes';
import ArchetypeCard from '../components/ArchetypeCard';
import ArchetypeDetailModal from '../components/ArchetypeDetailModal';

export default function LibraryPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedCode, setSelectedCode] = useState(null);

  const filteredArchetypes = useMemo(() => {
    const entries = Object.entries(archetypes);
    if (activeCategory === 'all') return entries;
    return entries.filter(([, arch]) => arch.category === activeCategory);
  }, [activeCategory]);

  const selectedArchetype = selectedCode ? archetypes[selectedCode] : null;

  return (
    <div className="library-page">
      <nav className="nav">
        <Link to="/" className="nav-logo">
          <span className="nav-mark" aria-hidden>
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
              <defs>
                <linearGradient id="logoGradLib" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0A84FF" />
                  <stop offset="55%" stopColor="#5E5CE6" />
                  <stop offset="100%" stopColor="#BF5AF2" />
                </linearGradient>
              </defs>
              <path
                d="M 15 2 C 15 11, 15 11, 26 14 C 15 17, 15 17, 15 26 C 15 17, 15 17, 4 14 C 15 11, 15 11, 15 2 Z"
                fill="url(#logoGradLib)"
              />
            </svg>
          </span>
          AutoWorkFlow<span className="nav-logo-accent">.AI</span>
        </Link>
        <Link to="/quiz" className="btn-primary btn-small">
          Take the Quiz
          <ArrowUpRight size={14} strokeWidth={1.75} />
        </Link>
      </nav>

      <header className="library-hero">
        <div className="eyebrow eyebrow-center">Archetype Library</div>
        <h1 className="library-title">
          Meet the <span className="hero-highlight">16 operational archetypes</span>
        </h1>
        <p className="library-subtitle">
          Every organization has a personality. Browse all 16 archetypes to find
          the one that sounds like yours — or take the quiz for a personalized diagnosis.
        </p>
      </header>

      <div className="library-filters">
        {archetypeCategories.map((cat) => (
          <button
            key={cat.id}
            className={`filter-pill ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <main className="library-grid">
        {filteredArchetypes.map(([code, archetype]) => (
          <ArchetypeCard
            key={code}
            code={code}
            archetype={archetype}
            onClick={() => setSelectedCode(code)}
          />
        ))}
      </main>

      <section className="library-cta">
        <div className="library-cta-inner">
          <div className="eyebrow eyebrow-center library-cta-eyebrow">Take the assessment</div>
          <h2>Not sure which one you are?</h2>
          <p>Take the 2-minute quiz and get a personalized archetype report delivered to your inbox.</p>
          <Link to="/quiz" className="btn-grad btn-large">
            Take the Quiz
            <ArrowUpRight size={16} strokeWidth={1.75} />
          </Link>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-inner">
          <span className="mono">© {new Date().getFullYear()} AutoWorkFlow.AI</span>
          <span className="mono footer-muted">All rights reserved</span>
        </div>
      </footer>

      {selectedArchetype && (
        <ArchetypeDetailModal
          code={selectedCode}
          archetype={selectedArchetype}
          onClose={() => setSelectedCode(null)}
        />
      )}
    </div>
  );
}
