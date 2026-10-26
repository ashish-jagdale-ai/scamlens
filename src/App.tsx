import { useEffect, useRef, useState } from 'react'
import './App.css'

type Analysis = { risk: { label: string; tone: 'high' | 'medium' | 'low' }; signals: { key: string; label: string }[]; explanation: string | null; aiAvailable: boolean; safetyGuidance: string[] }

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

const SAMPLES = [
  {
    icon: '↗',
    title: 'Delivery fee request',
    sub: 'Urgent payment request',
    text: 'URGENT: Your parcel is on hold. Pay ₹25 immediately using this link or your delivery will be cancelled!',
  },
  {
    icon: '□',
    title: 'Delivery confirmation',
    sub: 'Routine delivery update',
    text: 'Your parcel has been delivered. Tracking ID: AB123456789. Check the courier\u2019s official app for details.',
  },
  {
    icon: '!',
    title: 'Address confirmation',
    sub: 'Request for personal information',
    text: 'Your delivery is pending. Confirm your address to avoid delays. Reply with your full address.',
  },
]

const SIGNAL_DESCRIPTIONS: Record<string, string> = {
  urgency: 'Pressure to act fast — urgency is often used to stop you checking first.',
  payment: 'Asking for money, a fee, or a UPI payment.',
  link: 'Contains a link to click — check where it really goes before tapping it.',
  personalData: 'Asking for OTP, password, address, or card details.',
  threat: 'Warning of cancellation, blocking, or a penalty if you do not act.',
}

function App() {
  const [message, setMessage] = useState('')
  const [checkedMessage, setCheckedMessage] = useState('')
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'unavailable'>('checking')
  const analyzerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(`${API_BASE_URL}/api/health`)
      .then((response) => response.json())
      .then((data) => { if (!cancelled) setBackendStatus(data && data.ok ? 'connected' : 'unavailable') })
      .catch(() => { if (!cancelled) setBackendStatus('unavailable') })
    return () => { cancelled = true }
  }, [])

  async function analyzeMessage(override?: string) {
    const textToAnalyze = (override ?? message).trim()
    if (!textToAnalyze) return
    setLoading(true); setError(''); setAnalysis(null); setCheckedMessage(textToAnalyze)
    try { const response = await fetch(`${API_BASE_URL}/api/analyze`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: textToAnalyze }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || 'The message could not be analyzed.'); setAnalysis(data) }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'The analysis service is unavailable.') } finally { setLoading(false) }
  }

  function fillSample(text: string) {
    setMessage(text)
    setAnalysis(null)
    setError('')
    analyzerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    void analyzeMessage(text)
  }

  const riskMeterPercent = analysis
    ? analysis.risk.tone === 'high' ? 100 : analysis.risk.tone === 'medium' ? 55 : 18
    : 0

  return (
    <main className="app">
      <header className="topbar">
        <a className="brand" href="/">
          <span className="brand-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 3v6c0 5-3.5 9.3-8 11-4.5-1.7-8-6-8-11V5l8-3z"/><path d="M9 12l2 2 4-4"/></svg></span>
          ScamLens
        </a>
        <span className="local-badge">● Privacy-first analysis</span>
      </header>

      <section className="hero">
        <div className="hero-shield" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 3v6c0 5-3.5 9.3-8 11-4.5-1.7-8-6-8-11V5l8-3z"/><path d="M9 12l2 2 4-4"/></svg>
        </div>
        <span className="hack-badge">Hacktoberfest Hack Day — AI Belongs to Everyone</span>
        <span className="eyebrow">YOUR PERSONAL SCAM AWARENESS ASSISTANT</span>
        <h1>Look closer.<br /><span>Stay safer.</span></h1>
        <p>
          Suspicious message? Let ScamLens examine the evidence,
          explain possible warning signs, and help you decide what
          to verify before you act.
        </p>
        <p className="hero-scan">Scan &middot; Explain &middot; Verify &mdash; no data stored, no score claimed.</p>
      </section>

      {/* ── How-it-works strip ── */}
      <section className="how-strip">
        <div className="how-step">
          <span className="how-num">1</span>
          <span className="how-label">Paste</span>
        </div>
        <span className="how-divider" aria-hidden="true" />
        <div className="how-step">
          <span className="how-num">2</span>
          <span className="how-label">Analyze</span>
        </div>
        <span className="how-divider" aria-hidden="true" />
        <div className="how-step">
          <span className="how-num">3</span>
          <span className="how-label">Review</span>
        </div>
      </section>

      <section className="examples">
        <h3>TRY A SAMPLE MESSAGE — ONE CLICK ANALYZES IT</h3>
        <p className="examples-sub">Click a sample and it fills the analyzer below and runs the check automatically.</p>
        <div className="sample-list">
          {SAMPLES.map((sample) => (
            <button key={sample.title} className="sample-card" onClick={() => fillSample(sample.text)}>
              <span className="sample-icon">{sample.icon}</span>
              <span><strong>{sample.title}</strong><small>{sample.sub}</small></span>
              <span className="sample-hint">Click to analyze →</span>
            </button>
          ))}
        </div>
      </section>

      <section className="analyzer" id="analyzer" ref={analyzerRef}>
        <div className="section-heading">
          <span className="step">01</span>
          <div>
            <h2>Analyze a message</h2>
            <p>Paste an SMS, delivery alert, job offer, or payment request.</p>
          </div>
        </div>

        <p className={`backend-status ${backendStatus}`} role="status">
          {backendStatus === 'connected' && '● Backend connected'}
          {backendStatus === 'checking' && '○ Checking backend…'}
          {backendStatus === 'unavailable' && '● Backend unavailable — start it / try again in a moment'}
        </p>

        <label htmlFor="message">MESSAGE CONTENT</label>
        <textarea
          id="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Paste the suspicious message here..."
          maxLength={5000}
        />

        <div className="input-footer">
          <span>{message.length}/5000 characters</span>
          <button
            className="analyze-button"
            disabled={!message.trim() || loading}
            onClick={() => void analyzeMessage()}
          >
            {loading ? 'Analyzing…' : 'Analyze message'} <span aria-hidden="true">↗</span>
          </button>
        </div>

        <div className="privacy-note">
          <span aria-hidden="true">⌑</span>
          Your message is analyzed by ScamLens rules, with an optional server-side AI explanation.
          Never paste passwords, OTPs, or sensitive personal information.
        </div>
      </section>

      {!loading && !analysis && !error && <p className="empty-state">Ready. Paste a message above, or click a sample to run a check.</p>}

      {error && <p className="error-message" role="alert">{error} Please try again in a moment.</p>}

      {analysis && (
        <section className="results" aria-live="polite">
          <div className="result-header">
            <div>
              <span className="eyebrow">ANALYSIS RESULT</span>
              <h2>What should you notice?</h2>
            </div>
            <span className={`risk-badge ${analysis.risk.tone}`}>{analysis.risk.label}</span>
          </div>

          {/* ── Risk meter ── */}
          <div className="risk-meter" aria-label={`Risk level: ${analysis.risk.label}`}>
            <div className="risk-meter-labels">
              <span>Low</span>
              <span>Needs verification</span>
              <span>High concern</span>
            </div>
            <div className="risk-meter-track">
              <div
                className={`risk-meter-fill ${analysis.risk.tone}`}
                style={{ width: `${riskMeterPercent}%` }}
              />
            </div>
          </div>

          <div className="checked-message">
            <h3>MESSAGE CHECKED</h3>
            <p>{checkedMessage || message}</p>
          </div>

          <p className="result-explanation">{analysis.explanation || 'No local AI explanation was available, so this result is based on the visible rule signals below.'}</p>

          <div className="signal-list">
            <h3>RULE-BASED SIGNALS</h3>
            {analysis.signals.length
              ? <div className="signal-cards">
                  {analysis.signals.map((signal) => (
                    <div className="signal-card" key={signal.key}>
                      <span className="signal-check">✓</span>
                      <div><strong>{signal.label}</strong><p>{SIGNAL_DESCRIPTIONS[signal.key] || signal.label}</p></div>
                    </div>
                  ))}
                </div>
              : <p className="muted">No common warning signals were detected.</p>}
          </div>

          <div className="guidance">
            <h3>SAFER NEXT STEPS</h3>
            {analysis.safetyGuidance.map((item) => <p key={item}>→ {item}</p>)}
            <p className="guidance-final">Verify through official channels — never share OTP, passwords, or payment details.</p>
          </div>

          {!analysis.aiAvailable && <p className="muted ai-status">Ollama was unavailable. The deterministic rule analysis and safety guidance still worked.</p>}
        </section>
      )}

      <footer>
        <span>ScamLens · <a href="https://github.com/ashish-jagdale-ai/scamlens">GitHub: ashish-jagdale-ai/scamlens</a></span>
        <span>Built with React + Express • Deterministic warning-signal checks • No data stored</span>
        <span>Responsible use: warning signs are clues, not proof. Verify independently through official channels.</span>
      </footer>
    </main>
  )
}

export default App
