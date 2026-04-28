import { ArrowUpRight } from 'lucide-react';

/**
 * Apple-style "bento" card showing one archetype.
 * Sits on the awf bp-card pattern: hairline border, soft shadow, azure-tinted
 * hover lift. The per-archetype emoji + animal emoji stay as Unicode (browser
 * renders them fine); the action affordance is a lucide icon.
 */
export default function ArchetypeCard({ code, archetype, onClick }) {
  return (
    <button
      className={`archetype-card theme-${archetype.theme}`}
      onClick={onClick}
      aria-label={`View ${archetype.name} details`}
    >
      <div className="card-top">
        <span className="card-emoji" aria-hidden>{archetype.emoji}</span>
        <span className="card-code mono">{code}</span>
      </div>

      <h3 className="card-name">{archetype.name}</h3>

      <p className="card-tagline">"{archetype.tagline}"</p>

      <p className="card-description">{archetype.shortDescription}</p>

      <div className="card-traits">
        {archetype.traits.map((trait) => (
          <span className="trait-tag" key={trait}>{trait}</span>
        ))}
      </div>

      <div className="card-bottom">
        <div className="card-animal">
          <span className="animal-icon" aria-hidden>{archetype.animalEmoji}</span>
          <span className="animal-label">Spirit · {archetype.animal}</span>
        </div>
        <span className="card-arrow"><ArrowUpRight size={16} strokeWidth={1.75} /></span>
      </div>
    </button>
  );
}
