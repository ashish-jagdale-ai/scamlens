
import { useState } from 'react'
import './App.css'

type Analysis = { risk: { label: string; tone: 'high' | 'medium' | 'low' }; signals: { key: string; label: string }[]; explanation: string | null; aiAvailable: boolean; safetyGuidance: string[] }

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

function App() {
  const [message, setMessage] = useState('')
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  async function analyzeMessage() {
    setLoading(true); setError(''); setAnalysis(null)
    try { const response = await fetch(`${API_BASE_URL}/api/analyze`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || 'The message could not be analyzed.'); setAnalysis(data) }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'The analysis service is unavailable.') } finally { setLoading(false) }
  }

  function fillSample(text: string) {
    setMessage(text)
    setAnalysis(null)
    setError('')
  }

  const riskMeterPercent = analysis
    ? analysis.risk.tone === 'high' ? 100 : analysis.risk.tone === 'medium' ? 55 : 18
    : 0

  return (
    <main className="app">
      <header className="topbar">
        <a className="brand" href="/">
          <span className="brand-icon">S</span>
          ScamLens
        </a>
        <span className="local-badge">● Privacy-first analysis</span>
      </header>

      <section className="hero">
        <span className="eyebrow">YOUR PERSONAL SCAM AWARENESS ASSISTANT</span>
        <h1>Look closer.<br /><span>Stay safer.</span></h1>
        <p>
          Suspicious message? Let ScamLens examine the evidence,
          explain possible warning signs, and help you decide what
          to verify before you act.
        </p>
      </section>

      {/* ── How-it-works strip ── */}
      <section className="how-strip">
        <div className="how-step">
          <span className="how-num">1</span>
          <span className="how-label">Paste message</span>
        </div>
        <span className="how-divider" aria-hidden="true" />
        <div className="how-step">
          <span className="how-num">2</span>
          <span className="how-label">Rules check warning signs</span>
        </div>
        <span className="how-divider" aria-hidden="true" />
        <div className="how-step">
          <span className="how-num">3</span>
          <span className="how-label">Get explanation &amp; safe steps</span>
        </div>
      </section>

      <section className="analyzer">
        <div className="section-heading">
          <span className="step">01</span>
          <div>
            <h2>Analyze a message</h2>
            <p>Paste an SMS, delivery alert, job offer, or payment request.</p>
          </div>
        </div>

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
            disabled={!message.trim()}
            onClick={analyzeMessage}
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

          <p className="result-explanation">{analysis.explanation || 'No local AI explanation was available, so this result is based on the visible rule signals below.'}</p>

          <div className="signal-list">
            <h3>RULE-BASED SIGNALS</h3>
            {analysis.signals.length
              ? analysis.signals.map((signal) => <div className="signal" key={signal.key}><span>✓</span><strong>{signal.label}</strong></div>)
              : <p className="muted">No common warning signals were detected.</p>}
          </div>

          <div className="guidance">
            <h3>SAFER NEXT STEPS</h3>
            {analysis.safetyGuidance.map((item) => <p key={item}>→ {item}</p>)}
          </div>

          {!analysis.aiAvailable && <p className="muted ai-status">Ollama was unavailable. The deterministic rule analysis and safety guidance still worked.</p>}
        </section>
      )}

      <section className="examples">
        <h3>TRY A SAMPLE MESSAGE</h3>
        <div className="sample-list">
          <button onClick={() => fillSample(
            'URGENT: Your parcel is on hold. Pay ₹25 immediately using this link or your delivery will be cancelled!'
          )}>
            <span className="sample-icon">↗</span>
            <span><strong>Delivery fee request</strong><small>Urgent payment request</small></span>
            <span className="sample-hint">Click to analyze →</span>
          </button>

          <button onClick={() => fillSample(
            'Your parcel has been delivered. Tracking ID: AB123456789. Check the courier\u2019s official app for details.'
          )}>
            <span className="sample-icon">□</span>
            <span><strong>Delivery confirmation</strong><small>Routine delivery update</small></span>
            <span className="sample-hint">Click to analyze →</span>
          </button>

          <button onClick={() => fillSample(
            'Your delivery is pending. Confirm your address to avoid delays. Reply with your full address.'
          )}>
            <span className="sample-icon">!</span>
            <span><strong>Address confirmation</strong><small>Request for personal information</small></span>
            <span className="sample-hint">Click to analyze →</span>
          </button>
        </div>
      </section>

      <footer>
        <span>ScamLens · Built for safer digital decisions</span>
        <span>AI can make mistakes. Verify independently.</span>
      </footer>
    </main>
  )
}

export default App
