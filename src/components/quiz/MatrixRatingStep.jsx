/**
 * 8 workflow areas × 4 rating buttons. Each area needs a rating.
 * Laid out as 2 columns of area cards, each with a row of 4 rating pills.
 */
export default function MatrixRatingStep({ step, value, onChange }) {
  const ratings = value || {};

  const setRating = (areaId, ratingId) => {
    onChange({ ...ratings, [areaId]: ratingId });
  };

  return (
    <div className="q-card">
      <h2 className="q-title">{step.title}</h2>
      {step.subtitle && <p className="q-subtitle">{step.subtitle}</p>}

      <div className="q-matrix-grid">
        {step.areas.map((area) => (
          <div className="q-matrix-area" key={area.id}>
            <div className="q-matrix-area-head">
              <span className="q-matrix-area-icon">{area.icon}</span>
              <h3 className="q-matrix-area-title">{area.title}</h3>
            </div>
            <p className="q-matrix-area-desc">{area.desc}</p>
            <div className="q-matrix-ratings">
              {step.ratings.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className={`q-rating-pill ${ratings[area.id] === r.id ? 'selected' : ''} q-rating-${r.id}`}
                  onClick={() => setRating(area.id, r.id)}
                >
                  <span className="q-rating-dot">{r.dot}</span>
                  <span className="q-rating-label">{r.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
