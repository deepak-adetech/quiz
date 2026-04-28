/**
 * Vertical list of options, each with an icon, a main label,
 * and a short description underneath. Prefers `opt.Icon` (lucide
 * component); falls back to `opt.emoji` if present.
 */
export default function ChoiceDescribedStep({ step, value, onChange }) {
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
              className={`q-option q-option-described ${value === opt.id ? 'selected' : ''}`}
              onClick={() => onChange(opt.id)}
            >
              <span className="q-option-icon-box">
                {Icon ? <Icon size={20} strokeWidth={1.75} /> : opt.emoji}
              </span>
              <span className="q-option-described-text">
                <span className="q-option-label">{opt.label}</span>
                <span className="q-option-desc">{opt.desc}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
