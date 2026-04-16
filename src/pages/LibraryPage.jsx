import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
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
        <Link to="/" className="nav-logo">AutoWorkflows.ai</Link>
        <Link to="/quiz" className="btn-primary btn-small">Take the Quiz</Link>
      </nav>

      <header className="library-hero">
        <div className="hero-badge">ARCHETYPE LIBRARY</div>
        <h1 className="library-title">
          Meet the <span className="hero-highlight">16 Operational Archetypes</span>
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
          <h2>Not sure which one you are?</h2>
          <p>Take the 2-minute quiz and get a personalized archetype report delivered to your inbox.</p>
          <Link to="/quiz" className="btn-primary btn-large">
            Take the Quiz
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4.167 10h11.666M10 4.167L15.833 10 10 15.833" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} AutoWorkflows.ai. All rights reserved.</p>
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
