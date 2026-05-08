import { useState } from 'react';
import SiteLogo from '../components/SiteLogo';

// ── Step data ──────────────────────────────────────────────────────────────────

const STEP1_OPTIONS = [
  {
    id: 'founder',
    label: 'Founder / CEO',
    desc: 'I run the company and own the vision',
  },
  {
    id: 'ops',
    label: 'Operations / RevOps',
    desc: 'I manage processes, systems, and execution',
  },
  {
    id: 'other',
    label: 'Other Leader',
    desc: 'Director, VP, or department head',
  },
];

const STEP2_OPTIONS = [
  {
    id: 'curious',
    label: 'Just exploring',
    desc: 'I\'m researching what AI could do for us',
  },
  {
    id: 'experimenting',
    label: 'Experimenting',
    desc: 'We\'ve tried a few things but nothing sticks',
  },
  {
    id: 'scaling',
    label: 'Ready to scale',
    desc: 'We have wins and want to go deeper',
  },
];

const STEP4_OPTIONS = [
  { id: 'asap',    label: 'ASAP',       desc: 'We have an urgent problem to solve' },
  { id: '1-3mo',   label: '1–3 months', desc: 'Planning for the near term' },
  { id: '3-6mo',   label: '3–6 months', desc: 'Building toward something bigger' },
  { id: 'exploring', label: 'Just exploring', desc: 'No rush, learning the landscape' },
];

// ── Component ──────────────────────────────────────────────────────────────────

export default function StartPage() {
  const [step, setStep]       = useState(1);
  const [answers, setAnswers] = useState({
    situation: '',
    aiJourney: '',
    problem:   '',
    timeline:  '',
  });
  const [contact, setContact] = useState({ name: '', email: '', company: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const TOTAL_STEPS = 5;

  // ── Handlers ────────────────────────────────────────────────────────────────

  function pickStep1(id) {
    setAnswers(a => ({ ...a, situation: id }));
    setStep(2);
  }

  function pickStep2(id) {
    setAnswers(a => ({ ...a, aiJourney: id }));
    setStep(3);
  }

  function pickStep4(id) {
    setAnswers(a => ({ ...a, timeline: id }));
    setStep(5);
  }

  function handleContactChange(e) {
    const { name, value } = e.target;
    setContact(c => ({ ...c, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!contact.name || !contact.email || !contact.company) {
      setError('Please fill in your name, email, and company.');
      return;
    }
    setError('');
    setSubmitting(true);

    // Map situation/aiJourney/timeline ids to readable labels
    const situationLabel = STEP1_OPTIONS.find(o => o.id === answers.situation)?.label || answers.situation;
    const aiJourneyLabel = STEP2_OPTIONS.find(o => o.id === answers.aiJourney)?.label || answers.aiJourney;
    const timelineLabel  = STEP4_OPTIONS.find(o => o.id === answers.timeline)?.label  || answers.timeline;

    try {
      const res = await fetch('/api/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          situation: situationLabel,
          aiJourney: aiJourneyLabel,
          problem:   answers.problem,
          timeline:  timelineLabel,
          name:      contact.name,
          email:     contact.email,
          company:   contact.company,
          phone:     contact.phone,
        }),
      });
      if (!res.ok) throw new Error('Server error');
      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again or email us at hello@cometlab.in');
    } finally {
      setSubmitting(false);
    }
  }

  // ── Thank you screen ─────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="start-page">
        <nav className="start-nav">
          <SiteLogo variant="light" />
        </nav>
        <div className="start-thankyou">
          <div className="start-thankyou-icon">✓</div>
          <h1>You're all set.</h1>
          <p>We've received your details and will be in touch within one business day.</p>
          <p className="start-thankyou-sub">In the meantime, feel free to take our <a href="/">Operational Archetype Quiz</a> to understand where your business stands today.</p>
        </div>
      </div>
    );
  }

  // ── Progress bar ─────────────────────────────────────────────────────────────

  const progress = ((step - 1) / TOTAL_STEPS) * 100;

  return (
    <div className="start-page">
      {/* Nav */}
      <nav className="start-nav">
        <SiteLogo variant="light" />
      </nav>

      {/* Progress */}
      <div className="start-progress-bar">
        <div className="start-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Step counter */}
      <div className="start-step-counter">{step} of {TOTAL_STEPS}</div>

      {/* Step content */}
      <div className="start-content">

        {/* ── Step 1: Situation ───────────────────────────────────────── */}
        {step === 1 && (
          <div className="start-step">
            <h2 className="start-question">What best describes your role?</h2>
            <p className="start-subtext">Help us understand who we're talking to.</p>
            <div className="start-options">
              {STEP1_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  className={`start-option ${answers.situation === opt.id ? 'selected' : ''}`}
                  onClick={() => pickStep1(opt.id)}
                >
                  <span className="start-option-label">{opt.label}</span>
                  <span className="start-option-desc">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 2: AI Journey ──────────────────────────────────────── */}
        {step === 2 && (
          <div className="start-step">
            <button className="start-back" onClick={() => setStep(1)}>← Back</button>
            <h2 className="start-question">Where are you on your AI journey?</h2>
            <p className="start-subtext">There's no wrong answer — this helps us give you the right advice.</p>
            <div className="start-options">
              {STEP2_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  className={`start-option ${answers.aiJourney === opt.id ? 'selected' : ''}`}
                  onClick={() => pickStep2(opt.id)}
                >
                  <span className="start-option-label">{opt.label}</span>
                  <span className="start-option-desc">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 3: Problem description ─────────────────────────────── */}
        {step === 3 && (
          <div className="start-step">
            <button className="start-back" onClick={() => setStep(2)}>← Back</button>
            <h2 className="start-question">What's the biggest operational challenge you're trying to solve?</h2>
            <p className="start-subtext">Be as specific as you like — the more detail, the better we can help.</p>
            <textarea
              className="start-textarea"
              placeholder="e.g. Our sales team spends 3 hours a day manually updating CRM records. We lose deals because follow-ups fall through the cracks and we have no visibility into pipeline health..."
              value={answers.problem}
              onChange={e => setAnswers(a => ({ ...a, problem: e.target.value }))}
              rows={6}
            />
            <button
              className="start-continue"
              onClick={() => setStep(4)}
              disabled={!answers.problem.trim()}
            >
              Continue →
            </button>
          </div>
        )}

        {/* ── Step 4: Timeline ────────────────────────────────────────── */}
        {step === 4 && (
          <div className="start-step">
            <button className="start-back" onClick={() => setStep(3)}>← Back</button>
            <h2 className="start-question">What's your timeline for making progress?</h2>
            <p className="start-subtext">This helps us understand your urgency and plan accordingly.</p>
            <div className="start-options start-options-grid">
              {STEP4_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  className={`start-option ${answers.timeline === opt.id ? 'selected' : ''}`}
                  onClick={() => pickStep4(opt.id)}
                >
                  <span className="start-option-label">{opt.label}</span>
                  <span className="start-option-desc">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 5: Contact form ─────────────────────────────────────── */}
        {step === 5 && (
          <div className="start-step">
            <button className="start-back" onClick={() => setStep(4)}>← Back</button>
            <h2 className="start-question">Almost there — where should we send our thinking?</h2>
            <p className="start-subtext">We'll review your answers and reach out within one business day.</p>
            <form className="start-contact-form" onSubmit={handleSubmit} noValidate>
              <div className="start-field">
                <label className="start-label">Full name *</label>
                <input
                  className="start-input"
                  type="text"
                  name="name"
                  placeholder="Jane Smith"
                  value={contact.name}
                  onChange={handleContactChange}
                  required
                />
              </div>
              <div className="start-field">
                <label className="start-label">Work email *</label>
                <input
                  className="start-input"
                  type="email"
                  name="email"
                  placeholder="jane@company.com"
                  value={contact.email}
                  onChange={handleContactChange}
                  required
                />
              </div>
              <div className="start-field">
                <label className="start-label">Company *</label>
                <input
                  className="start-input"
                  type="text"
                  name="company"
                  placeholder="Acme Inc."
                  value={contact.company}
                  onChange={handleContactChange}
                  required
                />
              </div>
              <div className="start-field">
                <label className="start-label">Phone <span className="start-optional">(optional)</span></label>
                <input
                  className="start-input"
                  type="tel"
                  name="phone"
                  placeholder="+1 555 000 0000"
                  value={contact.phone}
                  onChange={handleContactChange}
                />
              </div>
              {error && <p className="start-error">{error}</p>}
              <button
                className="start-submit"
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Sending…' : 'Send it over →'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
