export default function Step4Summary({ plan, addons, details, total, onBack, onSubmit }) {
  return (
    <div className="builder-card">
      <div className="builder-card-title">Your Quote Summary</div>
      <div className="builder-card-sub">Review everything before submitting — you can still go back and make changes.</div>

      <div className="summary-plan">
        <div className="summary-plan-info">
          <div className="summary-plan-icon">{plan.icon}</div>
          <div>
            <div className="summary-plan-name">{plan.name} Plan</div>
            <div className="summary-plan-sub">Base package</div>
          </div>
        </div>
        <div className="summary-plan-price">${plan.price.toLocaleString()}</div>
      </div>

      {addons.length > 0 && (
        <div className="summary-addons">
          <div className="summary-addons-title">Selected Add-ons</div>
          {addons.map((a) => (
            <div key={a.id} className="summary-addon-row">
              <span>{a.icon} {a.name}</span>
              <span>+${a.price.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}

      <div className="summary-customer">
        <div className="summary-customer-title">Your Information</div>
        {[
          { label: 'Name', value: details.name },
          { label: 'Email', value: details.email },
          details.company && { label: 'Company', value: details.company },
          details.phone && { label: 'Phone', value: details.phone },
          details.industry && { label: 'Industry', value: details.industry },
          details.launchDate && { label: 'Launch', value: details.launchDate },
          details.goal && { label: 'Goal', value: details.goal },
        ]
          .filter(Boolean)
          .map((row) => (
            <div key={row.label} className="summary-customer-row">
              <span className="label">{row.label}</span>
              <span className="value">{row.value}</span>
            </div>
          ))}
      </div>

      <div className="summary-total">
        <div className="summary-total-label">Total Investment</div>
        <div className="summary-total-price">${total.toLocaleString()}</div>
      </div>

      <div className="builder-nav" style={{ marginTop: 32 }}>
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        <button className="btn btn-primary btn-lg" onClick={onSubmit}>
          Submit My Quote →
        </button>
      </div>
    </div>
  )
}
