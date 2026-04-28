/**
 * Two-part step: a single-choice "driver" question + a horizontal
 * timeline radio strip backed by a slider for fine drag adjustment.
 *
 * The original implementation showed the timeline as bare text labels
 * under a coloured slider track — users couldn't tell those labels were
 * the "radio buttons" because there was no obvious selection chrome.
 * Now each timeline stop is a clickable pill that shows its lucide icon,
 * label, and a selected-state ring; the slider underneath still drags
 * smoothly between stops for users who prefer that interaction.
 */
export default function ChoicePlusSliderStep({ step, value, onChange }) {
  const driverValue = value[step.choice.id];
  const sliderValue = value[step.slider.id];

  // Default the slider to the middle if nothing selected yet.
  const sliderIdx = sliderValue
    ? step.slider.stops.findIndex((s) => s.id === sliderValue)
    : 2;
  const currentStop = step.slider.stops[sliderIdx] || step.slider.stops[0];
  const CurrentStopIcon = currentStop.Icon;

  const handleSliderChange = (e) => {
    const idx = parseInt(e.target.value);
    onChange(step.slider.id, step.slider.stops[idx].id);
  };

  return (
    <div className="q-card">
      {/* ── Driver choice ── */}
      <div className="q-subquestion">
        <h2 className="q-title">{step.choice.title}</h2>
        <p className="q-subtitle">{step.choice.subtitle}</p>
        <div className={`q-options q-grid q-grid-${step.choice.columns || 2}`}>
          {step.choice.options.map((opt) => {
            const Icon = opt.Icon;
            return (
              <button
                key={opt.id}
                type="button"
                className={`q-option q-option-icon ${driverValue === opt.id ? 'selected' : ''}`}
                onClick={() => onChange(step.choice.id, opt.id)}
              >
                <span className="q-option-icon-box">
                  {Icon ? <Icon size={20} strokeWidth={1.75} /> : opt.icon}
                </span>
                <span className="q-option-label">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Timeline radio strip + slider ── */}
      <div className="q-subquestion q-subquestion-divider">
        <h2 className="q-title">{step.slider.title}</h2>
        {step.slider.subtitle && <p className="q-subtitle">{step.slider.subtitle}</p>}

        {/* Visible radio strip — every stop is a real button, so it's */}
        {/* obvious where to click. */}
        <div className="q-timeline-strip" role="radiogroup" aria-label={step.slider.title}>
          {step.slider.stops.map((stop, i) => {
            const StopIcon = stop.Icon;
            const isActive = i === sliderIdx;
            return (
              <button
                key={stop.id}
                type="button"
                role="radio"
                aria-checked={isActive}
                className={`q-timeline-pill ${isActive ? 'selected' : ''}`}
                onClick={() => onChange(step.slider.id, stop.id)}
              >
                <span className="q-timeline-pill-icon">
                  {StopIcon ? <StopIcon size={18} strokeWidth={1.75} /> : stop.emoji}
                </span>
                <span className="q-timeline-pill-label">{stop.label}</span>
              </button>
            );
          })}
        </div>

        {/* Slider — kept as a drag affordance. The thumb sits on the */}
        {/* azure→indigo→violet brand gradient. */}
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
            aria-label={`${step.slider.title} (drag to adjust)`}
          />
        </div>

        <div className="q-slider-description">
          <div className="q-slider-desc-icon">
            {CurrentStopIcon ? <CurrentStopIcon size={22} strokeWidth={1.75} /> : currentStop.emoji}
          </div>
          <div className="q-slider-desc-label">{currentStop.label}</div>
          <div className="q-slider-desc-text">{currentStop.desc}</div>
        </div>
      </div>
    </div>
  );
}
