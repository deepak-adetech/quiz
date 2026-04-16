/**
 * Two-part step: a single-choice "driver" question + an urgency slider
 * with a descriptive card that updates based on slider position.
 */
export default function ChoicePlusSliderStep({ step, value, onChange }) {
  const driverValue = value[step.choice.id];
  const sliderValue = value[step.slider.id];

  // Default the slider to the middle if nothing selected
  const sliderIdx = sliderValue
    ? step.slider.stops.findIndex((s) => s.id === sliderValue)
    : 2;
  const currentStop = step.slider.stops[sliderIdx] || step.slider.stops[0];

  const handleSliderChange = (e) => {
    const idx = parseInt(e.target.value);
    onChange(step.slider.id, step.slider.stops[idx].id);
  };

  return (
    <div className="q-card">
      {/* Driver choice */}
      <div className="q-subquestion">
        <h2 className="q-title">{step.choice.title}</h2>
        <p className="q-subtitle">{step.choice.subtitle}</p>
        <div className={`q-options q-grid q-grid-${step.choice.columns || 2}`}>
          {step.choice.options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`q-option q-option-icon ${driverValue === opt.id ? 'selected' : ''}`}
              onClick={() => onChange(step.choice.id, opt.id)}
            >
              <span className="q-option-icon-box">{opt.icon}</span>
              <span className="q-option-label">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Urgency slider */}
      <div className="q-subquestion q-subquestion-divider">
        <h2 className="q-title">{step.slider.title}</h2>
        <div className="q-slider-wrap">
          <div className="q-slider-track-bg" />
          <input
            type="range"
            min="0"
            max={step.slider.stops.length - 1}
            step="1"
            value={sliderIdx}
            onChange={handleSliderChange}
            className="q-slider"
            aria-label={step.slider.title}
          />
          <div className="q-slider-labels">
            {step.slider.stops.map((stop, i) => (
              <span
                key={stop.id}
                className={`q-slider-label ${i === sliderIdx ? 'active' : ''}`}
              >
                {stop.label}
              </span>
            ))}
          </div>
        </div>

        <div className="q-slider-description">
          <div className="q-slider-desc-emoji">{currentStop.emoji}</div>
          <div className="q-slider-desc-label">{currentStop.label}</div>
          <div className="q-slider-desc-text">{currentStop.desc}</div>
        </div>
      </div>
    </div>
  );
}
