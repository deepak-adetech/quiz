/**
 * Multi-select: pick up to N options. "All of the above" is a
 * shortcut that selects every regular option at once.
 */
export default function MultiChoiceStep({ step, value, onChange }) {
  const selected = Array.isArray(value) ? value : [];
  const maxSelect = step.maxSelect || 3;
  const allOfAboveId = step.allOfAboveOption?.id;

  const toggle = (optId) => {
    // Clicking "all of the above" — select every regular option
    if (optId === allOfAboveId) {
      const allIds = step.options.map((o) => o.id);
      const isAllSelected = allIds.every((id) => selected.includes(id));
      onChange(isAllSelected ? [] : allIds);
      return;
    }

    if (selected.includes(optId)) {
      onChange(selected.filter((id) => id !== optId));
    } else {
      if (selected.length >= maxSelect) return; // cap reached
      onChange([...selected, optId]);
    }
  };

  const allSelected = step.options.every((o) => selected.includes(o.id));

  return (
    <div className="q-card">
      <h2 className="q-title">{step.title}</h2>
      {step.subtitle && <p className="q-subtitle">{step.subtitle}</p>}

      <div className={`q-options q-grid q-grid-${step.columns || 2}`}>
        {step.options.map((opt) => {
          const isSelected = selected.includes(opt.id);
          const disabled = !isSelected && selected.length >= maxSelect;
          return (
            <button
              key={opt.id}
              type="button"
              className={`q-option q-option-icon q-option-checkable ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
              onClick={() => toggle(opt.id)}
              disabled={disabled}
            >
              <span className="q-option-icon-box">{opt.icon}</span>
              <span className="q-option-label">{opt.label}</span>
              {isSelected && <span className="q-option-check">{'\u2713'}</span>}
            </button>
          );
        })}
      </div>

      {step.allOfAboveOption && (
        <button
          type="button"
          className={`q-all-of-above ${allSelected ? 'selected' : ''}`}
          onClick={() => toggle(allOfAboveId)}
        >
          <span className="q-option-icon-box">{step.allOfAboveOption.icon}</span>
          <span>{step.allOfAboveOption.label}</span>
        </button>
      )}

      <p className="q-select-counter">
        {Math.min(selected.length, maxSelect)} of {maxSelect} selected
      </p>
    </div>
  );
}
