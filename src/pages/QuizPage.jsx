import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { quizSteps, getTotalQuestionCount, getQuestionNumberForStep } from '../data/quizSteps';
import { calculateArchetype } from '../data/scoring';
import SiteLogo from '../components/SiteLogo';
import StarField from '../components/StarField';
import SingleChoiceStep from '../components/quiz/SingleChoiceStep';
import DualChoiceStep from '../components/quiz/DualChoiceStep';
import MultiChoiceStep from '../components/quiz/MultiChoiceStep';
import ChoicePlusSliderStep from '../components/quiz/ChoicePlusSliderStep';
import ChoiceDescribedStep from '../components/quiz/ChoiceDescribedStep';
import MatrixRatingStep from '../components/quiz/MatrixRatingStep';
import ChoiceIconListStep from '../components/quiz/ChoiceIconListStep';
import ContactFormStep from '../components/quiz/ContactFormStep';

const TOTAL_STEPS = quizSteps.length;
const TOTAL_QUESTIONS = getTotalQuestionCount();

function isStepComplete(step, answer) {
  if (!answer) return false;
  switch (step.type) {
    case 'single-choice':
    case 'choice-described':
    case 'choice-icon-list':
      return !!answer;
    case 'dual-choice':
      return step.questions.every((q) => !!answer[q.id]);
    case 'multi-choice':
      return Array.isArray(answer) && answer.length > 0;
    case 'choice-plus-slider':
      return !!answer[step.choice.id] && !!answer[step.slider.id];
    case 'matrix-rating':
      return step.areas.every((a) => !!answer[a.id]);
    case 'contact-form':
      return step.fields
        .filter((f) => f.required)
        .every((f) => !!(answer[f.id] && String(answer[f.id]).trim()));
    default:
      return false;
  }
}

export default function QuizPage() {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [phase, setPhase] = useState('quiz'); // quiz | loading
  const [loadingStep, setLoadingStep] = useState(0);

  const currentStep = quizSteps[stepIndex];
  const currentAnswer = answers[currentStep?.id];
  const canProceed = currentStep ? isStepComplete(currentStep, currentAnswer) : false;
  const isFinalStep = stepIndex === TOTAL_STEPS - 1;

  const questionNumber = useMemo(() => getQuestionNumberForStep(stepIndex), [stepIndex]);
  const progress = (questionNumber / TOTAL_QUESTIONS) * 100;

  // Debounce timer ref for multi-choice (advance 1.4s after last selection)
  const multiTimer = useRef(null);

  // Core advance — works off fresh answer value, not stale canProceed
  const advanceAfterAnswer = (newAnswer, delay = 220) => {
    if (!isStepComplete(currentStep, newAnswer)) return;
    setTimeout(() => {
      if (isFinalStep) submitQuiz();
      else {
        setStepIndex((i) => i + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, delay);
  };

  // All single-value steps — includes matrix-rating (passes full ratings obj)
  const handleSingleAnswer = (value) => {
    setAnswers((prev) => ({ ...prev, [currentStep.id]: value }));
    if (currentStep.type === 'multi-choice') {
      // Debounced: wait 1.4s after the last toggle before advancing
      clearTimeout(multiTimer.current);
      if (isStepComplete(currentStep, value)) {
        multiTimer.current = setTimeout(() => {
          setStepIndex((i) => i + 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 1400);
      }
    } else {
      advanceAfterAnswer(value);
    }
  };

  // Nested answer (dual-choice / choice-plus-slider) — auto-advance when both filled
  const handleNestedAnswer = (subKey, value) => {
    const newAnswer = { ...(answers[currentStep.id] || {}), [subKey]: value };
    setAnswers((prev) => ({ ...prev, [currentStep.id]: newAnswer }));
    advanceAfterAnswer(newAnswer);
  };

  const submitQuiz = async () => {
    setPhase('loading');
    const result = calculateArchetype(answers);
    const contact = answers.contactForm || {};
    const user = {
      name: [contact.firstName, contact.lastName].filter(Boolean).join(' '),
      firstName: contact.firstName || '',
      lastName: contact.lastName || '',
      email: contact.email || '',
      phone: contact.phone || '',
      company: contact.company || '',
      role: contact.role || '',
      website: contact.website || '',
      expertCall: !!contact.expertCall,
    };

    try {
      const res = await fetch('/api/generate-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          name: user.name,
          email: user.email,
          company: user.company,
          result,
        }),
      });
      const data = await res.json();
      sessionStorage.setItem('quizResults', JSON.stringify({
        ...result,
        details: data.details,
        leadId: data.leadId,
        user,
        profile: answers,
      }));
    } catch {
      sessionStorage.setItem('quizResults', JSON.stringify({
        ...result,
        details: null,
        leadId: null,
        user,
        profile: answers,
      }));
    }

    setTimeout(() => navigate('/results'), 2500);
  };

  const goNext = () => {
    if (!canProceed) return;
    if (isFinalStep) {
      submitQuiz();
    } else {
      setStepIndex((i) => i + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goBack = () => {
    setStepIndex((i) => Math.max(0, i - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard: Enter to advance, ArrowLeft to go back.
  // Re-binds when canProceed / phase / step type changes so closures stay fresh.
  useEffect(() => {
    const handleKey = (e) => {
      if (phase !== 'quiz') return;
      if (e.key === 'Enter' && canProceed && currentStep?.type !== 'contact-form') {
        e.preventDefault();
        goNext();
      }
      if (e.key === 'ArrowLeft' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        goBack();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);

  }, [phase, canProceed, currentStep?.type]);

  // Loading animation
  useEffect(() => {
    if (phase !== 'loading') return;
    const timers = [0, 1, 2, 3].map((i) =>
      setTimeout(() => setLoadingStep(i + 1), 800 * (i + 1))
    );
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  // ── Render step body based on type ──
  const renderStep = () => {
    switch (currentStep.type) {
      case 'single-choice':
        return <SingleChoiceStep step={currentStep} value={currentAnswer} onChange={handleSingleAnswer} />;
      case 'dual-choice':
        return <DualChoiceStep step={currentStep} value={currentAnswer || {}} onChange={handleNestedAnswer} />;
      case 'multi-choice':
        return <MultiChoiceStep step={currentStep} value={currentAnswer || []} onChange={handleSingleAnswer} />;
      case 'choice-plus-slider':
        return <ChoicePlusSliderStep step={currentStep} value={currentAnswer || {}} onChange={handleNestedAnswer} />;
      case 'choice-described':
        return <ChoiceDescribedStep step={currentStep} value={currentAnswer} onChange={handleSingleAnswer} />;
      case 'matrix-rating':
        return <MatrixRatingStep step={currentStep} value={currentAnswer || {}} onChange={handleSingleAnswer} />;
      case 'choice-icon-list':
        return <ChoiceIconListStep step={currentStep} value={currentAnswer} onChange={handleSingleAnswer} />;
      case 'contact-form':
        return <ContactFormStep step={currentStep} value={currentAnswer || {}} onChange={handleSingleAnswer} />;
      default:
        return null;
    }
  };

  return (
    <div className="quiz-page">
      <StarField />
      <nav className="nav">
        <SiteLogo variant="light" />
      </nav>

      <div className="quiz-container-v2">
        {/* ── Progress Card ── */}
        {phase === 'quiz' && (
          <div className="q-progress-card">
            <div className="q-progress-row">
              <span className="q-progress-label">
                Question {String(questionNumber).padStart(2, '0')} / {String(TOTAL_QUESTIONS).padStart(2, '0')}
              </span>
              <span className="q-progress-pct">{Math.round(progress)}%</span>
            </div>
            <div className="q-progress-bar">
              <div className="q-progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* ── Back button — sits just below progress bar ── */}
        {phase === 'quiz' && stepIndex > 0 && (
          <button
            type="button"
            className="q-back-top"
            onClick={goBack}
          >
            <ArrowLeft size={14} strokeWidth={1.75} />
            Back
          </button>
        )}

        {/* ── Quiz Step ── */}
        {phase === 'quiz' && renderStep()}

        {/* ── Subtle hints for multi-select steps ── */}
        {phase === 'quiz' && currentStep?.type === 'multi-choice' && (
          <p className="q-hint">
            {canProceed
              ? 'Good — select more if needed, we\'ll continue shortly…'
              : 'Select all that apply to move on'}
          </p>
        )}
        {phase === 'quiz' && currentStep?.type === 'matrix-rating' && !canProceed && (
          <p className="q-hint">Rate each dimension above to continue</p>
        )}
        {phase === 'quiz' && currentStep?.type === 'choice-plus-slider' && !canProceed && (
          <p className="q-hint">Choose an option and set the slider to continue</p>
        )}

        {/* ── Submit button — contact form only ── */}
        {phase === 'quiz' && isFinalStep && (
          <div className="q-nav">
            <button
              type="button"
              className="q-nav-btn q-nav-next"
              onClick={goNext}
              disabled={!canProceed}
            >
              Get My Report
              <ArrowRight size={15} strokeWidth={1.75} />
            </button>
          </div>
        )}

        {/* ── Loading ── */}
        {phase === 'loading' && (
          <div className="q-card quiz-loading-card">
            <div className="loading-state">
              <div className="loading-spinner" />
              <h2 className="loading-title">Analyzing your operational DNA</h2>
              <p className="loading-text">Generating your personalized archetype report.</p>
              <div className="loading-steps">
                {[
                  'Calculating dimension scores',
                  'Identifying your archetype',
                  'Generating insights and recommendations',
                  'Preparing your report',
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
      </div>
    </div>
  );
}
