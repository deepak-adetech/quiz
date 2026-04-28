import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Sparkles,
  AlertTriangle,
  Target,
  Quote,
  ArrowUpRight,
  ArrowRight,
  Mail,
  Download,
  Check,
  Link as LinkIcon,
  Linkedin,
  Twitter,
  Building2,
} from 'lucide-react';
import { generateFallback } from '../data/fallback';
import { downloadPdf, generatePdfBase64 } from '../utils/generatePdf';
import SiteLogo from '../components/SiteLogo';

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
  const [emailStatus, setEmailStatus] = useState('idle');

  const handleDownloadPdf = async () => {
    if (!results) return;
    await downloadPdf(results);
    setPdfReady(true);
  };

  useEffect(() => {
    if (!results) navigate('/');
  }, [results, navigate]);

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
            leadId: results.leadId,
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
        navigator.clipboard.writeText(url).then(() => {});
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
        <SiteLogo gradId="logoGradRes" />
        <Link to="/quiz" className="btn-secondary btn-small">Retake Quiz</Link>
      </nav>

      <main className="results-container">
        <section className="result-hero">
          <div className="aurora" aria-hidden />
          <div className="result-hero-inner">
            <div className="archetype-icon" aria-hidden>
              <span className="archetype-icon-emoji">{arch.emoji}</span>
            </div>
            <span className="archetype-code">{code}</span>
            <h1 className="archetype-name">{arch.name}</h1>
            <p className="archetype-tagline">{arch.tagline}</p>
          </div>
        </section>

        <section className="result-section scores-section">
          <div className="eyebrow eyebrow-center">Your operational DNA</div>
          <h2 className="section-heading">Where you sit on the four axes.</h2>
          <div className="dimension-scores bp-card">
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
                <div className="dim-score mono">{percentages[dim.key]}%</div>
              </div>
            ))}
          </div>
        </section>

        <section className="result-section result-two-col">
          <div className="result-card bp-card card-characteristics">
            <h2 className="card-heading">
              <span className="card-icon"><FileText size={18} strokeWidth={1.75} /></span>
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
            <div className="result-card bp-card card-superpowers">
              <h2 className="card-heading">
                <span className="card-icon card-icon-azure"><Sparkles size={18} strokeWidth={1.75} /></span>
                Superpowers
              </h2>
              <ul className="trait-list">
                {d.superpowers.map((s, i) => (
                  <li key={i}>
                    <span className="trait-bullet"><Check size={14} strokeWidth={2.25} /></span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="result-card bp-card card-kryptonite">
              <h2 className="card-heading">
                <span className="card-icon card-icon-rust"><AlertTriangle size={18} strokeWidth={1.75} /></span>
                Kryptonite
              </h2>
              <ul className="trait-list">
                {d.kryptonite.map((k, i) => (
                  <li key={i}>
                    <span className="trait-bullet trait-bullet-rust"><AlertTriangle size={12} strokeWidth={2.25} /></span>
                    {k}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="result-section result-three-col">
          <div className="result-card bp-card card-starting">
            <h2 className="card-heading">
              <span className="card-icon"><Target size={18} strokeWidth={1.75} /></span>
              Ideal Starting Point
            </h2>
            <ol className="starting-list">
              {d.ideal_starting_points.map((step, i) => (
                <li key={i}>
                  <span className="step-num mono">{String(i + 1).padStart(2, '0')}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="result-card bp-card card-famous">
            <h2 className="card-heading">
              <span className="card-icon"><Quote size={18} strokeWidth={1.75} /></span>
              Famous Last Words
            </h2>
            <p className="famous-quote">{d.famous_last_words}</p>
          </div>

          <div className="result-card bp-card card-example">
            <h2 className="card-heading">
              <span className="card-icon"><Building2 size={18} strokeWidth={1.75} /></span>
              Real World Example
            </h2>
            <p>{d.real_world_example}</p>
          </div>
        </section>

        <section className="result-section">
          <div className="result-card bp-card card-animal">
            <div className="animal-header">
              <span className="animal-emoji" aria-hidden>{arch.animalEmoji}</span>
              <h2 className="card-heading">Why {arch.animal}?</h2>
            </div>
            <p className="animal-text">{d.why_animal}</p>
          </div>
        </section>

        <section className="result-section">
          <div className="pdf-download-card">
            <div className="pdf-icon" aria-hidden><FileText size={28} strokeWidth={1.5} /></div>
            <div className="eyebrow eyebrow-center">Your full report</div>
            <h2>Beautifully formatted, ready to share.</h2>
            <p>A polished PDF with all your results, insights, and action plan.</p>

            {emailStatus === 'sending' && (
              <div className="email-status status-sending">
                <span className="status-spinner" />
                <span>Sending a copy to <strong>{results.user?.email}</strong>...</span>
              </div>
            )}
            {emailStatus === 'sent' && (
              <div className="email-status status-sent">
                <Mail size={14} strokeWidth={1.75} />
                <span>We've sent your PDF report to <strong>{results.user?.email}</strong>. Check your inbox.</span>
              </div>
            )}
            {emailStatus === 'failed' && (
              <div className="email-status status-failed">
                <AlertTriangle size={14} strokeWidth={1.75} />
                <span>Couldn't email your report right now. Use the download button below.</span>
              </div>
            )}

            <button className="btn-grad btn-large" onClick={handleDownloadPdf}>
              {pdfReady ? <><Check size={16} strokeWidth={2} /> Downloaded</> : <><Download size={16} strokeWidth={1.75} /> Download PDF Report</>}
            </button>
          </div>
        </section>

        <section className="result-section result-cta">
          <div className="cta-card bp-card">
            <div className="eyebrow eyebrow-center">Engage</div>
            <h2>Ready to transform your operations?</h2>
            <p>Now that you know your archetype, let's build a roadmap to level up your operational maturity.</p>
            <div className="cta-buttons">
              <a href="https://autoworkflows.ai" className="btn-grad btn-large" target="_blank" rel="noreferrer">
                Book a Strategy Call
                <ArrowUpRight size={16} strokeWidth={1.75} />
              </a>
              <button className="btn-ghost btn-large" onClick={handleDownloadPdf}>
                <Download size={16} strokeWidth={1.75} /> Download Report
              </button>
            </div>
            <div className="share-section">
              <p className="share-label mono">Share your archetype</p>
              <div className="share-buttons">
                <button className="share-btn" onClick={() => shareResult('twitter')} title="Share on X/Twitter" aria-label="Share on Twitter">
                  <Twitter size={15} strokeWidth={1.75} />
                </button>
                <button className="share-btn" onClick={() => shareResult('linkedin')} title="Share on LinkedIn" aria-label="Share on LinkedIn">
                  <Linkedin size={15} strokeWidth={1.75} />
                </button>
                <button className="share-btn" onClick={() => shareResult('copy')} title="Copy link" aria-label="Copy link">
                  <LinkIcon size={15} strokeWidth={1.75} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-inner">
          <span className="mono">© {new Date().getFullYear()} AutoWorkFlow.AI</span>
          <span className="mono footer-muted">All rights reserved</span>
        </div>
      </footer>
    </div>
  );
}
