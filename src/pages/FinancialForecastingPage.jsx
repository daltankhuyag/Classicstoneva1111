import { useMemo, useState } from 'react'
import Seo from '../components/Seo'
import { getPageSeo } from '../data/seo'

const FINISH_LEVELS = {
  classic: { label: 'Classic build', costPerSqft: 235 },
  premium: { label: 'Premium build', costPerSqft: 285 },
  luxury: { label: 'Luxury build', costPerSqft: 345 },
}

const SITE_CONDITIONS = {
  straightforward: { label: 'Straightforward lot', cost: 18000 },
  sloped: { label: 'Sloped lot', cost: 42000 },
  complex: { label: 'Complex access or retaining needs', cost: 78000 },
}

const GARAGE_OPTIONS = {
  none: { label: 'No garage', cost: 0 },
  twoCar: { label: '2-car garage', cost: 38000 },
  threeCar: { label: '3-car garage', cost: 62000 },
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function clampNumber(value, fallback) {
  const parsed = Number(value)

  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback
  }

  return parsed
}

function estimateMonthlyPayment(principal, annualRate, years) {
  if (principal <= 0) {
    return 0
  }

  const monthlyRate = annualRate / 100 / 12
  const totalPayments = years * 12

  if (monthlyRate === 0) {
    return principal / totalPayments
  }

  return principal * monthlyRate / (1 - (1 + monthlyRate) ** -totalPayments)
}

export function FinancialForecastingSection() {
  const [squareFeet, setSquareFeet] = useState(2800)
  const [finishLevel, setFinishLevel] = useState('premium')
  const [siteCondition, setSiteCondition] = useState('sloped')
  const [garageType, setGarageType] = useState('twoCar')
  const [contingencyPercent, setContingencyPercent] = useState(8)
  const [designPercent, setDesignPercent] = useState(10)
  const [downPaymentPercent, setDownPaymentPercent] = useState(20)
  const [interestRate, setInterestRate] = useState(6.75)

  const forecast = useMemo(() => {
    const normalizedSquareFeet = clampNumber(squareFeet, 2800)
    const normalizedContingency = clampNumber(contingencyPercent, 8)
    const normalizedDesign = clampNumber(designPercent, 10)
    const normalizedDownPayment = clampNumber(downPaymentPercent, 20)
    const normalizedRate = clampNumber(interestRate, 6.75)

    const baseConstruction = normalizedSquareFeet * FINISH_LEVELS[finishLevel].costPerSqft
    const siteWork = SITE_CONDITIONS[siteCondition].cost
    const garage = GARAGE_OPTIONS[garageType].cost
    const utilitiesAndDriveway = normalizedSquareFeet * 14
    const permitsAndDesign = (baseConstruction + garage) * (normalizedDesign / 100)
    const subtotal = baseConstruction + siteWork + garage + utilitiesAndDriveway + permitsAndDesign
    const contingency = subtotal * (normalizedContingency / 100)
    const projectedBudget = subtotal + contingency
    const downPayment = projectedBudget * (normalizedDownPayment / 100)
    const estimatedLoan = Math.max(0, projectedBudget - downPayment)
    const estimatedMonthly = estimateMonthlyPayment(estimatedLoan, normalizedRate, 30)

    return {
      normalizedSquareFeet,
      baseConstruction,
      siteWork,
      garage,
      utilitiesAndDriveway,
      permitsAndDesign,
      contingency,
      projectedBudget,
      downPayment,
      estimatedLoan,
      estimatedMonthly,
      budgetRangeLow: projectedBudget * 0.94,
      budgetRangeHigh: projectedBudget * 1.08,
    }
  }, [squareFeet, finishLevel, siteCondition, garageType, contingencyPercent, designPercent, downPaymentPercent, interestRate])

  const breakdownRows = [
    ['Base construction', formatCurrency(forecast.baseConstruction)],
    ['Site work', formatCurrency(forecast.siteWork)],
    ['Garage', formatCurrency(forecast.garage)],
    ['Utilities and driveway allowance', formatCurrency(forecast.utilitiesAndDriveway)],
    ['Design, permits, and engineering', formatCurrency(forecast.permitsAndDesign)],
    ['Contingency reserve', formatCurrency(forecast.contingency)],
  ]

  return (
    <section className="forecast-page-section">
      <div className="container">
        <div className="forecast-shell">
          <div className="forecast-copy">
            <p className="section-label">Single-Home Planning</p>
            <h2>Turn an idea into a construction budget you can pressure-test.</h2>
            <p>
              This estimator is built for early planning. Adjust square footage, finish level, lot
              complexity, and financing inputs to see how quickly the total project range moves.
            </p>
          </div>

          <div className="forecast-kpis">
            <article className="forecast-kpi-card">
              <span className="forecast-kpi-label">Projected budget</span>
              <strong>{formatCurrency(forecast.projectedBudget)}</strong>
              <p>Includes construction, site work, soft costs, and contingency.</p>
            </article>
            <article className="forecast-kpi-card">
              <span className="forecast-kpi-label">Planning range</span>
              <strong>{formatCurrency(forecast.budgetRangeLow)} - {formatCurrency(forecast.budgetRangeHigh)}</strong>
              <p>Use this as a first-pass range before bids and construction drawings.</p>
            </article>
            <article className="forecast-kpi-card">
              <span className="forecast-kpi-label">Est. monthly payment</span>
              <strong>{formatCurrency(forecast.estimatedMonthly)}</strong>
              <p>Based on a 30-year loan using your down payment and rate assumptions.</p>
            </article>
          </div>

          <div className="forecast-grid">
            <form className="forecast-panel forecast-form" onSubmit={event => event.preventDefault()}>
              <div className="forecast-panel-head">
                <h3>Forecast inputs</h3>
                <p>Change the core drivers to model a realistic starting budget.</p>
              </div>

                <label className="forecast-field">
                  <span>Conditioned square footage</span>
                  <input type="number" min="600" step="50" value={squareFeet} onChange={event => setSquareFeet(event.target.value)} />
                </label>

                <label className="forecast-field">
                  <span>Finish level</span>
                  <select value={finishLevel} onChange={event => setFinishLevel(event.target.value)}>
                    {Object.entries(FINISH_LEVELS).map(([value, option]) => (
                      <option key={value} value={value}>{option.label} · {formatCurrency(option.costPerSqft)}/sq ft</option>
                    ))}
                  </select>
                </label>

                <label className="forecast-field">
                  <span>Lot and site condition</span>
                  <select value={siteCondition} onChange={event => setSiteCondition(event.target.value)}>
                    {Object.entries(SITE_CONDITIONS).map(([value, option]) => (
                      <option key={value} value={value}>{option.label} · {formatCurrency(option.cost)}</option>
                    ))}
                  </select>
                </label>

                <label className="forecast-field">
                  <span>Garage program</span>
                  <select value={garageType} onChange={event => setGarageType(event.target.value)}>
                    {Object.entries(GARAGE_OPTIONS).map(([value, option]) => (
                      <option key={value} value={value}>{option.label} · {formatCurrency(option.cost)}</option>
                    ))}
                  </select>
                </label>

                <div className="forecast-two-up">
                  <label className="forecast-field">
                    <span>Design and permits %</span>
                    <input type="number" min="4" max="20" step="0.5" value={designPercent} onChange={event => setDesignPercent(event.target.value)} />
                  </label>
                  <label className="forecast-field">
                    <span>Contingency %</span>
                    <input type="number" min="3" max="20" step="0.5" value={contingencyPercent} onChange={event => setContingencyPercent(event.target.value)} />
                  </label>
                </div>

                <div className="forecast-two-up">
                  <label className="forecast-field">
                    <span>Down payment %</span>
                    <input type="number" min="5" max="50" step="1" value={downPaymentPercent} onChange={event => setDownPaymentPercent(event.target.value)} />
                  </label>
                  <label className="forecast-field">
                    <span>Interest rate %</span>
                    <input type="number" min="1" max="15" step="0.125" value={interestRate} onChange={event => setInterestRate(event.target.value)} />
                  </label>
                </div>

                <div className="forecast-note">
                  <strong>Assumption:</strong> driveway, utility tie-ins, and basic exterior allowances are modeled as a per-square-foot budget placeholder until site-specific pricing is available.
                </div>
            </form>

            <div className="forecast-panel forecast-results">
              <div className="forecast-panel-head">
                <h3>Budget breakdown</h3>
                <p>{forecast.normalizedSquareFeet.toLocaleString()} sq ft modeled at the {FINISH_LEVELS[finishLevel].label.toLowerCase()} level.</p>
              </div>

              <div className="forecast-summary-list">
                {breakdownRows.map(([label, value]) => (
                  <div key={label} className="forecast-summary-row">
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>

              <div className="forecast-total-card">
                <span>Total forecasted budget</span>
                <strong>{formatCurrency(forecast.projectedBudget)}</strong>
                <p>Estimated loan after {downPaymentPercent}% down: {formatCurrency(forecast.estimatedLoan)}</p>
              </div>
            </div>
          </div>

          <div className="forecast-insights">
            <article className="forecast-panel">
              <div className="forecast-panel-head">
                <h3>What moves the budget fastest</h3>
              </div>
              <div className="forecast-bullet-list">
                <p>Square footage is still the strongest cost driver. Every extra 100 square feet compounds structure, systems, finishes, and labor.</p>
                <p>Lot difficulty changes the budget earlier than most owners expect. Grading, retaining walls, drainage, and difficult access can materially shift the first estimate.</p>
                <p>Contingency is not spare money. It is protection against scope gaps, late selections, and field conditions that only show up after engineering and excavation.</p>
              </div>
            </article>

            <article className="forecast-panel">
              <div className="forecast-panel-head">
                <h3>How to use this page</h3>
              </div>
              <div className="forecast-bullet-list">
                <p>Start with the finish level that matches your real expectations, not your minimum target.</p>
                <p>Raise design and permit allowances if you expect structural complexity, custom details, or HOA review.</p>
                <p>Use the planning range when you compare land, financing options, and timing with your lender or builder.</p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function FinancialForecastingPage() {
  const pageSeo = getPageSeo('/financial-forecasting')

  return (
    <>
      <Seo title={pageSeo.title} description={pageSeo.description} path={pageSeo.path} />
      <div className="fp-page-banner">
        <div className="container">
          <p className="section-label">Classic Stone</p>
          <h1 className="fp-page-banner-title">Financial Forecasting</h1>
          <p className="fp-page-banner-sub">
            Build a working budget for a single-home construction project with editable cost drivers,
            financing assumptions, and a clear forecast range before you commit to design.
          </p>
        </div>
      </div>
      <FinancialForecastingSection />
    </>
  )
}