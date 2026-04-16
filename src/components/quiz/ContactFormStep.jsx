/**
 * Lead capture form (step 9). Fields are data-driven from step.fields.
 * Supports a consent checkbox and half-width fields (for first/last name).
 */
export default function ContactFormStep({ step, value, onChange }) {
  const data = value || {};

  const updateField = (id) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    onChange({ ...data, [id]: val });
  };

  return (
    <div className="q-card">
      <h2 className="q-title">{step.title}</h2>
      {step.subtitle && <p className="q-subtitle">{step.subtitle}</p>}
      <div className="q-contact-form">
        <div className="q-form-grid">
          {step.fields.map((f) => (
            <div
              key={f.id}
              className={`q-form-row ${f.half ? 'q-form-row-half' : ''}`}
            >
              <label className="q-form-label" htmlFor={`f-${f.id}`}>
                {f.label}
                {f.required && <span className="q-form-required"> *</span>}
              </label>
              <input
                id={`f-${f.id}`}
                type={f.type}
                placeholder={f.placeholder}
                className="q-form-input"
                value={data[f.id] || ''}
                onChange={updateField(f.id)}
                required={f.required}
              />
            </div>
          ))}
        </div>

        {step.consentCheckbox && (
          <label className="q-form-checkbox">
            <input
              type="checkbox"
              checked={
                data[step.consentCheckbox.id] === undefined
                  ? !!step.consentCheckbox.defaultChecked
                  : !!data[step.consentCheckbox.id]
              }
              onChange={updateField(step.consentCheckbox.id)}
            />
            <span>{step.consentCheckbox.label}</span>
          </label>
        )}
      </div>
    </div>
  );
}
