/**
 * Vertical list of single-choice options, each with an icon tile and a label.
 * Options may have `highlight: true` to render in the rust accent color.
 */
export default function ChoiceIconListStep({ step, value, onChange }) {
  return (
    <div className="q-card">
      <h2 className="q-title">{step.title}</h2>
      {step.subtitle && <p className="q-subtitle">{step.subtitle}</p>}
      <div className="q-options q-options-vertical">
        {step.options.map((opt) => {
          const Icon = opt.Icon;
          return (
            <button
              key={opt.id}
              type="button"
              className={`q-option q-option-icon q-option-list ${value === opt.id ? 'selected' : ''} ${opt.highlight ? 'q-option-highlight' : ''}`}
              onClick={() => onChange(opt.id)}
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
  );
}
