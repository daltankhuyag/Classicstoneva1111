const STEPS = ['Choose Plan', 'Add-ons', 'Your Details', 'Summary']

export default function StepIndicator({ current }) {
  return (
    <div className="step-indicator">
      {STEPS.map((label, i) => {
        const state = i < current ? 'completed' : i === current ? 'active' : ''
        return (
          <div key={label} className={`step-indicator-item ${state}`}>
            <div className="step-dot">
              {i < current ? '✓' : i + 1}
            </div>
            <div className="step-indicator-label">{label}</div>
          </div>
        )
      })}
    </div>
  )
}
