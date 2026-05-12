export default function CalendarBookingStep({ step, onSkip }) {
  return (
    <div className="q-card q-calendar-card">
      <h2 className="q-title">{step.title}</h2>
      {step.subtitle && <p className="q-subtitle">{step.subtitle}</p>}
      <div className="q-calendar-embed">
        <iframe
          src="https://cal.cometlab.in/comet/30min?user=comet&layout=month_view&hideEventTypeDetails=true"
          width="100%"
          height="680"
          frameBorder="0"
          style={{ borderRadius: 12, display: 'block', border: 'none' }}
          title="Book a call with Comet Lab"
        />
      </div>
      <p className="q-calendar-skip">
        Rather read it yourself?{' '}
        <button type="button" className="q-skip-link" onClick={onSkip}>
          Skip to your results →
        </button>
      </p>
    </div>
  );
}
