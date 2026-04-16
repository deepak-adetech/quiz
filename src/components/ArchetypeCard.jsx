/**
 * Pinterest-style card showing one archetype.
 * Heights vary naturally based on content — perfect for masonry layout.
 */
export default function ArchetypeCard({ code, archetype, onClick }) {
  return (
    <button
      className={`archetype-card theme-${archetype.theme}`}
      onClick={onClick}
      aria-label={`View ${archetype.name} details`}
    >
      <div className="card-top">
        <span className="card-emoji">{archetype.emoji}</span>
        <span className="card-code">{code}</span>
      </div>

      <h3 className="card-name">{archetype.name}</h3>

      <p className="card-tagline">"{archetype.tagline}"</p>

      <p className="card-description">{archetype.shortDescription}</p>

      <div className="card-traits">
        {archetype.traits.map((trait) => (
          <span className="trait-tag" key={trait}>
            {trait}
          </span>
        ))}
      </div>

      <div className="card-bottom">
        <div className="card-animal">
          <span className="animal-icon">{archetype.animalEmoji}</span>
          <span className="animal-label">Spirit: {archetype.animal}</span>
        </div>
        <span className="card-arrow">&rarr;</span>
      </div>
    </button>
  );
}
