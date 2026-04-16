import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { questions, categoryLabels } from '../data/questions';
import { calculateArchetype } from '../data/scoring';

const TOTAL = questions.length;

export default function QuizPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [phase, setPhase] = useState('quiz'); // quiz | email | loading
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);
  const [animating, setAnimating] = useState(false);

  // ── Select an option ──
  const selectOption = useCallback((optIndex) => {
    if (animating) return;
    setAnswers((prev) => ({ ...prev, [current]: optIndex }));
    setAnimating(true);

    setTimeout(() => {
      if (current < TOTAL - 1) {
        setCurrent((c) => c + 1);
      } else {
        setPhase('email');
      }
      setAnimating(false);
    }, 350);
  }, [current, animating]);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    function handleKey(e) {
      if (phase !== 'quiz') return;
      const map = { a: 0, b: 1, c: 2, d: 3, '1': 0, '2': 1, '3': 2, '4': 3 };
      if (map[e.key.toLowerCase()] !== undefined) {
        selectOption(map[e.key.toLowerCase()]);
      }
      if (e.key === 'ArrowLeft' && current > 0) {
        setCurrent((c) => c - 1);
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [phase, current, selectOption]);

  // ── Loading animation ──
  useEffect(() => {
    if (phase !== 'loading') return;
    const timers = [0, 1, 2, 3].map((i) =>
      setTimeout(() => setLoadingStep(i + 1), 800 * (i + 1))
    );
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  // ── Submit to API ──
  const submitQuiz = async (skipEmail = false) => {
    setPhase('loading');

    const result = calculateArchetype(answers);

    try {
      const res = await fetch('/api/generate-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          name: skipEmail ? '' : name,
          email: skipEmail ? '' : email,
          company: skipEmail ? '' : company,
          result,
        }),
      });
      const data = await res.json();

      // Store everything in sessionStorage
      sessionStorage.setItem('quizResults', JSON.stringify({
        ...result,
        details: data.details,
        user: { name: skipEmail ? '' : name, email: skipEmail ? '' : email, company: skipEmail ? '' : company },
      }));
    } catch {
      // If API fails, store with null details (results page will use fallback)
      sessionStorage.setItem('quizResults', JSON.stringify({
        ...result,
        details: null,
        user: { name: skipEmail ? '' : name, email: skipEmail ? '' : email, company: skipEmail ? '' : company },
      }));
    }

    setTimeout(() => navigate('/results'), 2500);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    submitQuiz(false);
  };

  const progress = ((current + 1) / TOTAL) * 100;
  const q = questions[current];

  return (
    <div className="quiz-page">
      <nav className="nav">
        <Link to="/" className="nav-logo">AutoWorkflows.ai</Link>
        {phase === 'quiz' && (
          <div className="nav-progress">
            <span className="progress-text">Question {current + 1} of {TOTAL}</span>
          </div>
        )}
      </nav>

      <div className="quiz-container">
        {/* Progress Bar */}
        {phase === 'quiz' && (
          <div className="progress-bar-wrap">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
        )}

        {/* ── Quiz Phase ── */}
        {phase === 'quiz' && (
          <div className="question-slide active" key={current}>
            <div className="question-category">
              {categoryLabels[q.dimension]}
            </div>
            <h2 className="question-text">{q.text}</h2>
            <div className="options-list">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  className={`option-btn ${answers[current] === i ? 'selected' : ''}`}
                  onClick={() => selectOption(i)}
                >
                  <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                  <span className="option-text">{opt.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Email Phase ── */}
        {phase === 'email' && (
          <div className="question-slide active">
            <div className="email-capture">
              <div className="email-icon">{'\uD83D\uDCE8'}</div>
              <h2 className="question-text">Almost there! Where should we send your results?</h2>
              <p className="email-subtitle">
                Get your personalized Operational Archetype report with detailed insights and action steps.
              </p>
              <form className="email-form" onSubmit={handleEmailSubmit}>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Your name"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <div className="form-row">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Company name (optional)"
                    className="form-input"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn-primary btn-large btn-full">
                  See My Results
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4.167 10h11.666M10 4.167L15.833 10 10 15.833" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </form>
              <button className="skip-link" onClick={() => submitQuiz(true)}>
                Skip and see results
              </button>
            </div>
          </div>
        )}

        {/* ── Loading Phase ── */}
        {phase === 'loading' && (
          <div className="question-slide active">
            <div className="loading-state">
              <div className="loading-spinner" />
              <h2 className="loading-title">Analyzing your operational DNA...</h2>
              <p className="loading-text">Our AI is generating your personalized archetype report.</p>
              <div className="loading-steps">
                {[
                  'Calculating dimension scores...',
                  'Identifying your archetype...',
                  'Generating insights and recommendations...',
                  'Preparing your report...',
                ].map((text, i) => (
                  <div
                    key={i}
                    className={`loading-step ${loadingStep > i ? 'done' : ''} ${loadingStep === i + 1 ? 'active' : ''}`}
                  >
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Navigation ── */}
        {phase === 'quiz' && (
          <div className="quiz-nav">
            <button
              className="btn-secondary"
              disabled={current === 0}
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M15.833 10H4.167M10 15.833L4.167 10 10 4.167" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back
            </button>
            <div className="quiz-dots">
              {questions.map((_, i) => (
                <span
                  key={i}
                  className={`dot ${i === current ? 'active' : ''} ${answers[i] !== undefined ? 'answered' : ''}`}
                />
              ))}
            </div>
            <div style={{ width: 80 }} />
          </div>
        )}
      </div>
    </div>
  );
}
