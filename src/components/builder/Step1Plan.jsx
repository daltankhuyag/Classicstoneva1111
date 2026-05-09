const PLANS = [
  {
    id: 'starter',
    icon: '🌱',
    name: 'Starter',
    price: 999,
    features: ['5-page website', 'Mobile responsive', 'Contact form', '1 revision round', '2-week delivery'],
  },
  {
    id: 'pro',
    icon: '🚀',
    name: 'Pro',
    price: 2499,
    popular: true,
    features: ['15-page website', 'Custom animations', 'CMS integration', '3 revision rounds', 'Priority support'],
  },
  {
    id: 'enterprise',
    icon: '🏢',
    name: 'Enterprise',
    price: 5999,
    features: ['Unlimited pages', 'Custom backend', 'API integrations', 'Unlimited revisions', 'Dedicated manager'],
  },
]

export default function Step1Plan({ selected, onSelect, onNext }) {
  return (
    <div className="builder-card">
      <div className="builder-card-title">Choose Your Base Plan</div>
      <div className="builder-card-sub">Select the package that best fits your project scope.</div>

      <div className="plan-grid">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`plan-card ${plan.popular ? 'popular' : ''} ${selected?.id === plan.id ? 'selected' : ''}`}
            onClick={() => onSelect(plan)}
          >
            {plan.popular && <div className="popular-badge">Most Popular</div>}
            <div className="plan-check">✓</div>
            <div className="plan-icon">{plan.icon}</div>
            <div className="plan-name">{plan.name}</div>
            <div className="plan-price">${plan.price.toLocaleString()} <span>/ project</span></div>
            <ul className="plan-features-list">
              {plan.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <div className="builder-nav" style={{ marginTop: 32 }}>
        <span />
        <button className="btn btn-primary" onClick={onNext} disabled={!selected}>
          Next: Add-ons →
        </button>
      </div>
    </div>
  )
}
