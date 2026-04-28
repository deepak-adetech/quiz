import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import archetypes, { archetypeCategories } from '../data/archetypes';
import ArchetypeCard from '../components/ArchetypeCard';
import ArchetypeDetailModal from '../components/ArchetypeDetailModal';
import SiteLogo from '../components/SiteLogo';

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
        <SiteLogo gradId="logoGradLib" />
        <div className="nav-links">
          <a href="https://quiz-nine-sooty.vercel.app/" className="nav-link">Quiz</a>
          <Link to="/quiz" className="btn-primary btn-small">
            Take the Quiz
            <ArrowUpRight size={14} strokeWidth={1.75} />
          </Link>
        </div>
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
