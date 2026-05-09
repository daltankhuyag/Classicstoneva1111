export default function Step3Details({ details, onChange, onBack, onNext }) {
  const isValid =
    details.name.trim() &&
    details.email.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)

  return (
    <div className="builder-card">
      <div className="builder-card-title">Your Details</div>
      <div className="builder-card-sub">Tell us about yourself so we can prepare your personalised quote.</div>

      <div className="form-grid">
        <div className="form-group">
          <label>First & Last Name *</label>
          <input
            type="text"
            placeholder="Jane Smith"
            value={details.name}
            onChange={(e) => onChange('name', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Email Address *</label>
          <input
            type="email"
            placeholder="jane@company.com"
            value={details.email}
            onChange={(e) => onChange('email', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Company / Business Name</label>
          <input
            type="text"
            placeholder="Acme Corp"
            value={details.company}
            onChange={(e) => onChange('company', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={details.phone}
            onChange={(e) => onChange('phone', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Ideal Launch Date</label>
          <input
            type="date"
            value={details.launchDate}
            onChange={(e) => onChange('launchDate', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Industry</label>
          <select value={details.industry} onChange={(e) => onChange('industry', e.target.value)}>
            <option value="">Select industry…</option>
            <option>Retail & E-Commerce</option>
            <option>Professional Services</option>
            <option>Healthcare</option>
            <option>Hospitality & Food</option>
            <option>Technology & SaaS</option>
            <option>Real Estate</option>
            <option>Education</option>
            <option>Other</option>
          </select>
        </div>
        <div className="form-group full">
          <label>What's the main goal of your website?</label>
          <textarea
            rows={3}
            placeholder="e.g. Generate leads, sell products online, build brand awareness…"
            value={details.goal}
            onChange={(e) => onChange('goal', e.target.value)}
          />
        </div>
      </div>

      <div className="builder-nav" style={{ marginTop: 32 }}>
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        <button className="btn btn-primary" onClick={onNext} disabled={!isValid}>
          Review Summary →
        </button>
      </div>
    </div>
  )
}
