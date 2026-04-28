/**
 * Grid of icon+label options. Pick one.
 * Options may optionally include a `sub` field shown beneath the main label.
 * `opt.Icon` is a lucide-react component (preferred); `opt.icon` is a legacy
 * Unicode emoji fallback so older step data still renders.
 */
export default function SingleChoiceStep({ step, value, onChange }) {
  return (
    <div className="q-card">
      <h2 className="q-title">{step.title}</h2>
      {step.subtitle && <p className="q-subtitle">{step.subtitle}</p>}
      <div className={`q-options q-grid q-grid-${step.columns || 2}`}>
        {step.options.map((opt) => {
          const Icon = opt.Icon;
          return (
            <button
              key={opt.id}
              type="button"
              className={`q-option q-option-icon ${opt.sub ? 'q-option-with-sub' : ''} ${value === opt.id ? 'selected' : ''}`}
              onClick={() => onChange(opt.id)}
            >
              <span className="q-option-icon-box">
                {Icon ? <Icon size={20} strokeWidth={1.75} /> : opt.icon}
              </span>
              <span className="q-option-text">
                <span className="q-option-label">{opt.label}</span>
                {opt.sub && <span className="q-option-sub-desc">{opt.sub}</span>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
