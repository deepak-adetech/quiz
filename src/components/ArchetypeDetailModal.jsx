import { useEffect } from 'react';
import { generateFallback } from '../data/fallback';

/**
 * Modal showing the full archetype breakdown (same structure as results page).
 */
export default function ArchetypeDetailModal({ code, archetype, onClose }) {
  const details = generateFallback(code, archetype);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-content theme-${archetype.theme}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>

        <div className="modal-hero">
          <div className="modal-emoji">{archetype.emoji}</div>
          <div className="modal-code">{code}</div>
          <h2 className="modal-name">{archetype.name}</h2>
          <p className="modal-tagline"><em>{archetype.tagline}</em></p>
        </div>

        <div className="modal-body">
          <section className="modal-section">
            <h3 className="modal-section-heading">About this archetype</h3>
            <p className="modal-description">{archetype.shortDescription}</p>
          </section>

          <section className="modal-section modal-two-col">
            <div className="detail-card detail-superpowers">
              <h3>{'\u2728'} Superpowers</h3>
              <ul>
                {details.superpowers.map((s, i) => (
                  <li key={i}>
                    <span>{details.superpower_emojis?.[i] || '\u2714'}</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="detail-card detail-kryptonite">
              <h3>{'\u26A0\uFE0F'} Kryptonite</h3>
              <ul>
                {details.kryptonite.map((k, i) => (
                  <li key={i}>
                    <span>{details.kryptonite_emojis?.[i] || '\u274C'}</span>
                    {k}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="modal-section">
            <h3 className="modal-section-heading">
              {'\uD83C\uDFAF'} Ideal starting points
            </h3>
            <ol className="modal-steps">
              {details.ideal_starting_points.map((step, i) => (
                <li key={i}>
                  <span className="step-circle">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </section>

          <section className="modal-section modal-animal">
            <span className="modal-animal-emoji">{archetype.animalEmoji}</span>
            <div>
              <h3>Spirit animal: {archetype.animal}</h3>
              <p>{details.why_animal}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
