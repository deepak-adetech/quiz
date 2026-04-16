/**
 * Two single-choice questions on one screen. Options are horizontal
 * pills with a main label and a sub label ("1-10 / Startup").
 */
export default function DualChoiceStep({ step, value, onChange }) {
  return (
    <div className="q-card">
      {step.questions.map((q, idx) => (
        <div className={`q-subquestion ${idx > 0 ? 'q-subquestion-divider' : ''}`} key={q.id}>
          <div className="q-title-row">
            <span className="q-title-icon">{q.icon}</span>
            <h2 className="q-title">{q.title}</h2>
          </div>
          {q.subtitle && <p className="q-subtitle">{q.subtitle}</p>}
          <div className="q-options q-options-horizontal">
            {q.options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`q-option q-option-stacked ${value[q.id] === opt.id ? 'selected' : ''}`}
                onClick={() => onChange(q.id, opt.id)}
              >
                <span className="q-option-main">{opt.main}</span>
                <span className="q-option-sub">{opt.sub}</span>
              </button>
            ))}
          </div>
          {q.note && (
            <div className="q-note">
              <span className="q-note-icon">{'\u2139\uFE0F'}</span>
              <span>{q.note}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
