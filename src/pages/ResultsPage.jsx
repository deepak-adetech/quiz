import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { generateFallback } from '../data/fallback';
import { downloadPdf, generatePdfBase64 } from '../utils/generatePdf';

function loadResults() {
  const stored = sessionStorage.getItem('quizResults');
  if (!stored) return null;
  const parsed = JSON.parse(stored);
  if (!parsed.details) {
    parsed.details = generateFallback(parsed.code, parsed.archetype);
  }
  return parsed;
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const results = useMemo(() => loadResults(), []);
  const barsAnimated = useRef(false);
  const emailSentRef = useRef(false);
  const [pdfReady, setPdfReady] = useState(false);
  // email status: 'idle' | 'sending' | 'sent' | 'failed' | 'no-email'
  const [emailStatus, setEmailStatus] = useState('idle');

  const handleDownloadPdf = async () => {
    if (!results) return;
    await downloadPdf(results);
    setPdfReady(true);
  };

  useEffect(() => {
    if (!results) navigate('/');
  }, [results, navigate]);

  // Auto-send email with PDF attachment once on mount
  useEffect(() => {
    if (!results || emailSentRef.current) return;
    if (!results.user?.email) return;
    emailSentRef.current = true;

    (async () => {
      setEmailStatus('sending');
      try {
        const pdfBase64 = await generatePdfBase64(results);
        const res = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: results.user.email,
            name: results.user.name,
            pdfBase64,
            archetypeName: results.archetype.name,
            archetypeCode: results.code,
            tagline: results.archetype.tagline,
            userInfo: results.user,
          }),
        });
        const data = await res.json();
        setEmailStatus(data.sent ? 'sent' : 'failed');
      } catch (err) {
        console.error('Email send failed:', err);
        setEmailStatus('failed');
      }
    })();
  }, [results]);

  // Animate bars on mount
  useEffect(() => {
    if (!results || barsAnimated.current) return;
    barsAnimated.current = true;
    const fills = document.querySelectorAll('.dim-bar-fill');
    const markers = document.querySelectorAll('.dim-bar-marker');
    fills.forEach((bar, i) => {
      const pct = bar.getAttribute('data-pct');
      bar.style.width = '0%';
      setTimeout(() => {
        bar.style.transition = 'width 1s cubic-bezier(0.4, 0, 0.2, 1)';
        bar.style.width = pct + '%';
      }, 200 + i * 150);
    });
    markers.forEach((marker, i) => {
      const left = marker.getAttribute('data-left');
      marker.style.left = '0%';
      setTimeout(() => {
        marker.style.transition = 'left 1s cubic-bezier(0.4, 0, 0.2, 1)';
        marker.style.left = left + '%';
      }, 200 + i * 150);
    });
  }, [results]);

  if (!results) return null;

  const { code, percentages, archetype: arch, details: d } = results;

  const shareResult = (platform) => {
    const text = `I'm ${arch.name} (${code}) — ${arch.tagline} Take the quiz:`;
    const url = window.location.origin;
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url).then(() => {
          // visual feedback handled by caller
        });
        break;
    }
  };

  const dimRows = [
    { key: 'execution', low: 'Manual', high: 'Automated', label: 'Execution' },
    { key: 'data', low: 'Fragmented', high: 'Centralized', label: 'Data' },
    { key: 'connection', low: 'Siloed', high: 'Integrated', label: 'Connection' },
    { key: 'control', low: 'Reactive', high: 'Proactive', label: 'Control' },
  ];

  return (
    <div className="results-page">
      <nav className="nav">
        <Link to="/" className="nav-logo">AutoWorkflows.ai</Link>
        <Link to="/quiz" className="btn-secondary btn-small">Retake Quiz</Link>
      </nav>

      <main className="results-container">
        {/* ── Hero ── */}
        <section className="result-hero">
          <div className="archetype-icon">{arch.emoji}</div>
          <h1 className="archetype-name">{arch.name}</h1>
          <div className="archetype-code">{code}</div>
          <p className="archetype-tagline"><em>{arch.tagline}</em></p>
        </section>

        {/* ── Dimension Scores ── */}
        <section className="result-section scores-section">
          <h2 className="section-heading">Your Operational DNA</h2>
          <div className="dimension-scores">
            {dimRows.map((dim) => (
              <div className="dimension-row" key={dim.key}>
                <div className="dim-labels">
                  <span className="dim-low">{dim.low}</span>
                  <span className="dim-name">{dim.label}</span>
                  <span className="dim-high">{dim.high}</span>
                </div>
                <div className="dim-bar-track">
                  <div className="dim-bar-fill" data-pct={percentages[dim.key]} />
                  <div className="dim-bar-marker" data-left={percentages[dim.key]} />
                </div>
                <div className="dim-score">{percentages[dim.key]}%</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Two Column: Characteristics + Superpowers/Kryptonite ── */}
        <section className="result-section result-two-col">
          <div className="result-card card-characteristics">
            <h2 className="card-heading">
              <span className="card-icon">{'\uD83D\uDCC4'}</span>
              Characteristics
            </h2>
            {[
              { label: 'EXECUTION STYLE', text: d.execution_style },
              { label: 'DATA APPROACH', text: d.data_approach },
              { label: 'CONNECTION PATTERN', text: d.connection_pattern },
              { label: 'CONTROL POSTURE', text: d.control_posture },
              { label: 'CULTURAL DNA', text: d.cultural_dna },
            ].map((item) => (
              <div className="char-item" key={item.label}>
                <h4 className="char-label">{item.label}</h4>
                <p>{item.text}</p>
              </div>
            ))}
          </div>

          <div className="result-right-col">
            <div className="result-card card-superpowers">
              <h2 className="card-heading">
                <span className="card-icon">{'\u2728'}</span>
                Superpowers
              </h2>
              <ul className="trait-list">
                {d.superpowers.map((s, i) => (
                  <li key={i}>
                    <span className="trait-emoji">{d.superpower_emojis?.[i] || '\u2714'}</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="result-card card-kryptonite">
              <h2 className="card-heading">
                <span className="card-icon">{'\u26A0\uFE0F'}</span>
                Kryptonite
              </h2>
              <ul className="trait-list">
                {d.kryptonite.map((k, i) => (
                  <li key={i}>
                    <span className="trait-emoji">{d.kryptonite_emojis?.[i] || '\u274C'}</span>
                    {k}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Three Column ── */}
        <section className="result-section result-three-col">
          <div className="result-card card-starting">
            <h2 className="card-heading">
              <span className="card-icon">{'\uD83C\uDFAF'}</span>
              Ideal Starting Point
            </h2>
            <ol className="starting-list">
              {d.ideal_starting_points.map((step, i) => (
                <li key={i}>
                  <span className="step-num">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="result-card card-famous">
            <h2 className="card-heading">
              <span className="card-icon">{'\uD83D\uDCAC'}</span>
              Famous Last Words
            </h2>
            <p className="famous-quote">{d.famous_last_words}</p>
          </div>

          <div className="result-card card-example">
            <h2 className="card-heading">Real World Example</h2>
            <p>{d.real_world_example}</p>
          </div>
        </section>

        {/* ── Spirit Animal ── */}
        <section className="result-section">
          <div className="result-card card-animal">
            <div className="animal-header">
              <span className="animal-emoji">{arch.animalEmoji}</span>
              <h2 className="card-heading">Why {arch.animal}?</h2>
            </div>
            <p className="animal-text">{d.why_animal}</p>
          </div>
        </section>

        {/* ── PDF Download + Email Status ── */}
        <section className="result-section">
          <div className="pdf-download-card">
            <div className="pdf-icon">{'\uD83D\uDCC4'}</div>
            <h2>Your Full Report is Ready</h2>
            <p>A beautifully formatted PDF with all your results, insights, and action plan.</p>

            {/* Email status banner */}
            {emailStatus === 'sending' && (
              <div className="email-status status-sending">
                <span className="status-spinner" />
                <span>Sending a copy to <strong>{results.user?.email}</strong>...</span>
              </div>
            )}
            {emailStatus === 'sent' && (
              <div className="email-status status-sent">
                <span>{'\u2709\uFE0F'}</span>
                <span>We've sent your PDF report to <strong>{results.user?.email}</strong>. Check your inbox!</span>
              </div>
            )}
            {emailStatus === 'failed' && (
              <div className="email-status status-failed">
                <span>{'\u26A0\uFE0F'}</span>
                <span>Couldn't email your report right now. Please use the download button below.</span>
              </div>
            )}

            <button className="btn-primary btn-large" onClick={handleDownloadPdf}>
              {pdfReady ? '\u2713 Downloaded!' : '\u{1F4E5} Download PDF Report'}
            </button>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="result-section result-cta">
          <div className="cta-card">
            <h2>Ready to Transform Your Operations?</h2>
            <p>Now that you know your archetype, let's build a roadmap to level up your operational maturity.</p>
            <div className="cta-buttons">
              <a href="https://autoworkflows.ai" className="btn-primary btn-large" target="_blank" rel="noreferrer">
                Book a Strategy Call
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4.167 10h11.666M10 4.167L15.833 10 10 15.833" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <button className="btn-secondary btn-large" onClick={handleDownloadPdf}>
                {'\uD83D\uDDA8'} Download Report
              </button>
            </div>
            <div className="share-section">
              <p className="share-label">Share your archetype:</p>
              <div className="share-buttons">
                <button className="share-btn" onClick={() => shareResult('twitter')} title="Share on X/Twitter">
                  &#120143;
                </button>
                <button className="share-btn" onClick={() => shareResult('linkedin')} title="Share on LinkedIn">
                  in
                </button>
                <button className="share-btn" onClick={() => shareResult('copy')} title="Copy link">
                  {'\uD83D\uDD17'}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} AutoWorkflows.ai. All rights reserved.</p>
      </footer>
    </div>
  );
}
