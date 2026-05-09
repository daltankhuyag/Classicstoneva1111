import { useState } from 'react'
import StepIndicator from './StepIndicator'
import Step1Plan from './Step1Plan'
import Step2Addons from './Step2Addons'
import Step3Details from './Step3Details'
import Step4Summary from './Step4Summary'

const EMPTY_DETAILS = {
  name: '', email: '', company: '', phone: '',
  launchDate: '', industry: '', goal: '',
}

export default function Builder({ onBack }) {
  const [step, setStep] = useState(0)
  const [plan, setPlan] = useState(null)
  const [addons, setAddons] = useState([])
  const [details, setDetails] = useState(EMPTY_DETAILS)
  const [submitted, setSubmitted] = useState(false)

  const toggleAddon = (addon) =>
    setAddons((prev) =>
      prev.some((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    )

  const updateDetail = (key, value) =>
    setDetails((prev) => ({ ...prev, [key]: value }))

  const total = (plan?.price ?? 0) + addons.reduce((sum, a) => sum + a.price, 0)

  if (submitted) {
    return (
      <div className="builder-page">
        <div className="builder-body">
          <div className="builder-card">
            <div className="success-screen">
              <div className="success-icon">✓</div>
              <div className="success-title">Quote Submitted!</div>
              <p className="success-sub">
                Thanks, <strong>{details.name.split(' ')[0]}</strong>! We received your quote
                and will send a full proposal to <strong>{details.email}</strong> within 24 hours.
              </p>
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  <span style={{ fontSize: 16, color: 'var(--text-light)' }}>Estimated total:</span>
                  <span className="summary-total-price">${total.toLocaleString()}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn btn-primary" onClick={onBack}>Back to Home</button>
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    setSubmitted(false)
                    setStep(0)
                    setPlan(null)
                    setAddons([])
                    setDetails(EMPTY_DETAILS)
                  }}
                >
                  Start New Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="builder-page">
      <div className="builder-header">
        <div className="section-tag">Package Configurator</div>
        <h1>Build Your Custom Package</h1>
        <p>Configure, price, and submit your quote in under 3 minutes.</p>
      </div>
      <div className="builder-body">
        <StepIndicator current={step} />
        {step === 0 && (
          <Step1Plan selected={plan} onSelect={setPlan} onNext={() => setStep(1)} />
        )}
        {step === 1 && (
          <Step2Addons
            selected={addons}
            onToggle={toggleAddon}
            total={total}
            onBack={() => setStep(0)}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <Step3Details
            details={details}
            onChange={updateDetail}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <Step4Summary
            plan={plan}
            addons={addons}
            details={details}
            total={total}
            onBack={() => setStep(2)}
            onSubmit={() => setSubmitted(true)}
          />
        )}
      </div>
    </div>
  )
}
