import { useEffect, useMemo, useState } from 'react'
import Seo from '../components/Seo'
import { getPageSeo } from '../data/seo'

const COST_MODES = {
  percent: 'percent',
  fixed: 'fixed',
}

const SAVED_SCENARIOS_KEY = 'classicstone.builder-pro-forma.scenarios'

const CASH_FLOW_PHASES = [
  { key: 'precon', label: 'Preconstruction', share: 0.08, laborShare: 0.45, materialShare: 0.15, subcontractorShare: 0.4 },
  { key: 'sitework', label: 'Site and foundation', share: 0.14, laborShare: 0.18, materialShare: 0.22, subcontractorShare: 0.6 },
  { key: 'framing', label: 'Framing and dry-in', share: 0.2, laborShare: 0.28, materialShare: 0.42, subcontractorShare: 0.3 },
  { key: 'mep', label: 'MEP rough-ins', share: 0.16, laborShare: 0.12, materialShare: 0.18, subcontractorShare: 0.7 },
  { key: 'insulation', label: 'Insulation and drywall', share: 0.12, laborShare: 0.16, materialShare: 0.24, subcontractorShare: 0.6 },
  { key: 'interiors', label: 'Interior finishes', share: 0.2, laborShare: 0.24, materialShare: 0.36, subcontractorShare: 0.4 },
  { key: 'closeout', label: 'Closeout and punch', share: 0.1, laborShare: 0.4, materialShare: 0.2, subcontractorShare: 0.4 },
]

const PROJECT_PRESETS = {
  entrySpec: {
    label: 'Entry spec',
    squareFeet: 2200,
    finishLevel: 'classic',
    siteCondition: 'straightforward',
    garageType: 'twoCar',
    contingencyPercent: 6,
    designPercent: 6,
    targetMarginPercent: 18,
    overheadPercent: 7,
    contingencyMode: COST_MODES.percent,
    overheadMode: COST_MODES.percent,
    scheduleMonths: 8,
  },
  moveUp: {
    label: 'Move-up custom',
    squareFeet: 2800,
    finishLevel: 'premium',
    siteCondition: 'sloped',
    garageType: 'twoCar',
    contingencyPercent: 8,
    designPercent: 10,
    targetMarginPercent: 20,
    overheadPercent: 8,
    contingencyMode: COST_MODES.percent,
    overheadMode: COST_MODES.percent,
    scheduleMonths: 10,
  },
  customEstate: {
    label: 'Luxury custom',
    squareFeet: 4200,
    finishLevel: 'luxury',
    siteCondition: 'complex',
    garageType: 'threeCar',
    contingencyPercent: 10,
    designPercent: 12,
    targetMarginPercent: 22,
    overheadPercent: 10,
    contingencyMode: COST_MODES.percent,
    overheadMode: COST_MODES.percent,
    scheduleMonths: 14,
  },
}

const FINISH_LEVELS = {
  classic: { label: 'Classic build', costPerSqft: 235 },
  premium: { label: 'Premium build', costPerSqft: 285 },
  luxury: { label: 'Luxury build', costPerSqft: 345 },
}

const FINISH_LEVEL_ORDER = ['classic', 'premium', 'luxury']

const SITE_CONDITIONS = {
  straightforward: { label: 'Straightforward lot', cost: 18000 },
  sloped: { label: 'Sloped lot', cost: 42000 },
  complex: { label: 'Complex access or retaining needs', cost: 78000 },
}

const SITE_CONDITION_ORDER = ['straightforward', 'sloped', 'complex']

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

function clampNonNegativeNumber(value, fallback) {
  const parsed = Number(value)

  if (Number.isNaN(parsed) || parsed < 0) {
    return fallback
  }

  return parsed
}

function createScenarioSnapshot(name, forecast, inputs) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    createdAt: new Date().toISOString(),
    squareFeet: forecast.normalizedSquareFeet,
    projectedCost: forecast.projectedCost,
    totalCashNeed: forecast.totalCashNeed,
    targetSellPrice: forecast.targetSellPrice,
    grossProfit: forecast.grossProfit,
    netProfit: forecast.netProfit,
    netMarginPercent: forecast.netMarginPercent,
    monthlyBurn: forecast.monthlyBurn,
    finishLabel: FINISH_LEVELS[inputs.finishLevel].label,
    siteLabel: SITE_CONDITIONS[inputs.siteCondition].label,
    scheduleMonths: forecast.normalizedScheduleMonths,
    contingencyMode: forecast.normalizedContingencyMode,
    contingencyValue: forecast.normalizedContingency,
    overheadMode: forecast.normalizedOverheadMode,
    overheadValue: forecast.normalizedOverhead,
  }
}

function buildCashFlow(totalDirectCost, overheadCost, scheduleMonths) {
  const months = Math.max(1, Math.round(scheduleMonths))
  const monthlyOverhead = overheadCost / months
  let cumulativeShare = 0

  const phases = CASH_FLOW_PHASES.map(phase => {
    const startMonth = Math.min(months, Math.floor(cumulativeShare * months) + 1)
    cumulativeShare += phase.share
    const endMonth = Math.min(months, Math.max(startMonth, Math.ceil(cumulativeShare * months)))
    const durationMonths = endMonth - startMonth + 1
    const directCost = totalDirectCost * phase.share
    const monthlyDirectCost = directCost / durationMonths
    const laborCost = directCost * phase.laborShare
    const materialCost = directCost * phase.materialShare
    const subcontractorCost = directCost * phase.subcontractorShare

    return {
      ...phase,
      startMonth,
      endMonth,
      durationMonths,
      directCost,
      laborCost,
      materialCost,
      subcontractorCost,
      monthlyDirectCost,
      monthlyLaborCost: laborCost / durationMonths,
      monthlyMaterialCost: materialCost / durationMonths,
      monthlySubcontractorCost: subcontractorCost / durationMonths,
    }
  })

  const monthlyRows = Array.from({ length: months }, (_, index) => {
    const month = index + 1
    const activePhases = phases.filter(phase => month >= phase.startMonth && month <= phase.endMonth)
    const directCost = activePhases.reduce((sum, phase) => sum + phase.monthlyDirectCost, 0)
    const laborCost = activePhases.reduce((sum, phase) => sum + phase.monthlyLaborCost, 0)
    const materialCost = activePhases.reduce((sum, phase) => sum + phase.monthlyMaterialCost, 0)
    const subcontractorCost = activePhases.reduce((sum, phase) => sum + phase.monthlySubcontractorCost, 0)

    return {
      month,
      phaseLabels: activePhases.map(phase => phase.label),
      directCost,
      laborCost,
      materialCost,
      subcontractorCost,
      overheadCost: monthlyOverhead,
      totalCashNeed: directCost + monthlyOverhead,
    }
  })

  return {
    phases,
    monthlyRows,
  }
}

function buildForecast({
  squareFeet,
  finishLevel,
  finishCostPerSqft,
  siteCondition,
  siteWorkCost,
  garageType,
  garageCost,
  utilitiesAllowancePerSqft,
  contingencyMode,
  contingencyPercent,
  designPercent,
  targetMarginPercent,
  overheadMode,
  overheadPercent,
  scheduleMonths,
}) {
  const normalizedSquareFeet = clampNumber(squareFeet, 2800)
  const normalizedContingency = clampNumber(contingencyPercent, 8)
  const normalizedDesign = clampNumber(designPercent, 10)
  const normalizedTargetMargin = clampNumber(targetMarginPercent, 20)
  const normalizedOverhead = clampNonNegativeNumber(overheadPercent, 8)
  const normalizedScheduleMonths = clampNumber(scheduleMonths, 10)
  const normalizedFinishCostPerSqft = clampNumber(finishCostPerSqft, FINISH_LEVELS[finishLevel].costPerSqft)
  const normalizedSiteWorkCost = clampNonNegativeNumber(siteWorkCost, SITE_CONDITIONS[siteCondition].cost)
  const normalizedGarageCost = clampNonNegativeNumber(garageCost, GARAGE_OPTIONS[garageType].cost)
  const normalizedUtilitiesAllowancePerSqft = clampNonNegativeNumber(utilitiesAllowancePerSqft, 14)
  const normalizedContingencyMode = contingencyMode === COST_MODES.fixed ? COST_MODES.fixed : COST_MODES.percent
  const normalizedOverheadMode = overheadMode === COST_MODES.fixed ? COST_MODES.fixed : COST_MODES.percent

  const baseConstruction = normalizedSquareFeet * normalizedFinishCostPerSqft
  const siteWork = normalizedSiteWorkCost
  const garage = normalizedGarageCost
  const utilitiesAndDriveway = normalizedSquareFeet * normalizedUtilitiesAllowancePerSqft
  const permitsAndDesign = (baseConstruction + garage) * (normalizedDesign / 100)
  const subtotal = baseConstruction + siteWork + garage + utilitiesAndDriveway + permitsAndDesign
  const contingency = normalizedContingencyMode === COST_MODES.percent
    ? subtotal * (normalizedContingency / 100)
    : normalizedContingency
  const projectedCost = subtotal + contingency
  const overheadCost = normalizedOverheadMode === COST_MODES.percent
    ? projectedCost * (normalizedOverhead / 100)
    : normalizedOverhead
  const totalCashNeed = projectedCost + overheadCost
  const targetSellPrice = projectedCost / Math.max(0.05, 1 - normalizedTargetMargin / 100)
  const grossProfit = targetSellPrice - projectedCost
  const netProfit = targetSellPrice - projectedCost - overheadCost
  const monthlyBurn = normalizedScheduleMonths > 0 ? totalCashNeed / normalizedScheduleMonths : totalCashNeed
  const cashFlow = buildCashFlow(projectedCost, overheadCost, normalizedScheduleMonths)

  return {
    normalizedSquareFeet,
    normalizedContingency,
    normalizedDesign,
    normalizedTargetMargin,
    normalizedOverhead,
    normalizedScheduleMonths,
    normalizedFinishCostPerSqft,
    normalizedSiteWorkCost,
    normalizedGarageCost,
    normalizedUtilitiesAllowancePerSqft,
    normalizedContingencyMode,
    normalizedOverheadMode,
    baseConstruction,
    siteWork,
    garage,
    utilitiesAndDriveway,
    permitsAndDesign,
    contingency,
    projectedCost,
    overheadCost,
    totalCashNeed,
    targetSellPrice,
    grossProfit,
    netProfit,
    monthlyBurn,
    grossMarginPercent: targetSellPrice > 0 ? (grossProfit / targetSellPrice) * 100 : 0,
    netMarginPercent: targetSellPrice > 0 ? (netProfit / targetSellPrice) * 100 : 0,
    budgetRangeLow: projectedCost * 0.94,
    budgetRangeHigh: projectedCost * 1.08,
    cashFlow,
  }
}

function getNextOptionValue(order, currentValue) {
  const currentIndex = order.indexOf(currentValue)

  if (currentIndex === -1 || currentIndex === order.length - 1) {
    return null
  }

  return order[currentIndex + 1]
}

function getBudgetStatus(netMarginPercent) {
  if (netMarginPercent >= 12) {
    return 'Healthy'
  }

  if (netMarginPercent >= 8) {
    return 'Tight'
  }

  return 'At risk'
}

function getGapTone(value) {
  return value >= 8 ? 'good' : 'alert'
}

export function FinancialForecastingSection() {
  const [squareFeet, setSquareFeet] = useState(2800)
  const [finishLevel, setFinishLevel] = useState('premium')
  const [finishCostPerSqft, setFinishCostPerSqft] = useState(FINISH_LEVELS.premium.costPerSqft)
  const [siteCondition, setSiteCondition] = useState('sloped')
  const [siteWorkCost, setSiteWorkCost] = useState(SITE_CONDITIONS.sloped.cost)
  const [garageType, setGarageType] = useState('twoCar')
  const [garageCost, setGarageCost] = useState(GARAGE_OPTIONS.twoCar.cost)
  const [utilitiesAllowancePerSqft, setUtilitiesAllowancePerSqft] = useState(14)
  const [contingencyMode, setContingencyMode] = useState(COST_MODES.percent)
  const [contingencyPercent, setContingencyPercent] = useState(8)
  const [designPercent, setDesignPercent] = useState(10)
  const [targetMarginPercent, setTargetMarginPercent] = useState(20)
  const [overheadMode, setOverheadMode] = useState(COST_MODES.percent)
  const [overheadPercent, setOverheadPercent] = useState(8)
  const [scheduleMonths, setScheduleMonths] = useState(10)
  const [scenarioName, setScenarioName] = useState('Current scenario')
  const [savedScenarios, setSavedScenarios] = useState([])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const storedValue = window.localStorage.getItem(SAVED_SCENARIOS_KEY)

    if (!storedValue) {
      return
    }

    try {
      const parsed = JSON.parse(storedValue)

      if (Array.isArray(parsed)) {
        setSavedScenarios(parsed)
      }
    } catch {
      window.localStorage.removeItem(SAVED_SCENARIOS_KEY)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(SAVED_SCENARIOS_KEY, JSON.stringify(savedScenarios))
  }, [savedScenarios])

  const forecast = useMemo(() => {
    return buildForecast({
      squareFeet,
      finishLevel,
      finishCostPerSqft,
      siteCondition,
      siteWorkCost,
      garageType,
      garageCost,
      utilitiesAllowancePerSqft,
      contingencyMode,
      contingencyPercent,
      designPercent,
      targetMarginPercent,
      overheadMode,
      overheadPercent,
      scheduleMonths,
    })
  }, [squareFeet, finishLevel, finishCostPerSqft, siteCondition, siteWorkCost, garageType, garageCost, utilitiesAllowancePerSqft, contingencyMode, contingencyPercent, designPercent, targetMarginPercent, overheadMode, overheadPercent, scheduleMonths])

  const sensitivity = useMemo(() => {
    const largerHome = buildForecast({
      squareFeet: forecast.normalizedSquareFeet + 100,
      finishLevel,
      finishCostPerSqft: forecast.normalizedFinishCostPerSqft,
      siteCondition,
      siteWorkCost: forecast.normalizedSiteWorkCost,
      garageType,
      garageCost: forecast.normalizedGarageCost,
      utilitiesAllowancePerSqft: forecast.normalizedUtilitiesAllowancePerSqft,
      contingencyMode: forecast.normalizedContingencyMode,
      contingencyPercent: forecast.normalizedContingency,
      designPercent: forecast.normalizedDesign,
      targetMarginPercent: forecast.normalizedTargetMargin,
      overheadMode: forecast.normalizedOverheadMode,
      overheadPercent: forecast.normalizedOverhead,
      scheduleMonths: forecast.normalizedScheduleMonths,
    })

    const nextFinishLevel = getNextOptionValue(FINISH_LEVEL_ORDER, finishLevel)
    const nextSiteCondition = getNextOptionValue(SITE_CONDITION_ORDER, siteCondition)

    const upgradedFinish = nextFinishLevel
      ? buildForecast({
          squareFeet: forecast.normalizedSquareFeet,
          finishLevel: nextFinishLevel,
          finishCostPerSqft: FINISH_LEVELS[nextFinishLevel].costPerSqft,
          siteCondition,
          siteWorkCost: forecast.normalizedSiteWorkCost,
          garageType,
          garageCost: forecast.normalizedGarageCost,
          utilitiesAllowancePerSqft: forecast.normalizedUtilitiesAllowancePerSqft,
          contingencyMode: forecast.normalizedContingencyMode,
          contingencyPercent: forecast.normalizedContingency,
          designPercent: forecast.normalizedDesign,
          targetMarginPercent: forecast.normalizedTargetMargin,
          overheadMode: forecast.normalizedOverheadMode,
          overheadPercent: forecast.normalizedOverhead,
          scheduleMonths: forecast.normalizedScheduleMonths,
        })
      : null

    const moreComplexSite = nextSiteCondition
      ? buildForecast({
          squareFeet: forecast.normalizedSquareFeet,
          finishLevel,
          finishCostPerSqft: forecast.normalizedFinishCostPerSqft,
          siteCondition: nextSiteCondition,
          siteWorkCost: SITE_CONDITIONS[nextSiteCondition].cost,
          garageType,
          garageCost: forecast.normalizedGarageCost,
          utilitiesAllowancePerSqft: forecast.normalizedUtilitiesAllowancePerSqft,
          contingencyMode: forecast.normalizedContingencyMode,
          contingencyPercent: forecast.normalizedContingency,
          designPercent: forecast.normalizedDesign,
          targetMarginPercent: forecast.normalizedTargetMargin,
          overheadMode: forecast.normalizedOverheadMode,
          overheadPercent: forecast.normalizedOverhead,
          scheduleMonths: forecast.normalizedScheduleMonths,
        })
      : null

    return {
      costPer100Sqft: largerHome.projectedCost - forecast.projectedCost,
      upgradedFinishDelta: upgradedFinish ? upgradedFinish.projectedCost - forecast.projectedCost : null,
      upgradedFinishLabel: nextFinishLevel ? FINISH_LEVELS[nextFinishLevel].label : null,
      moreComplexSiteDelta: moreComplexSite ? moreComplexSite.projectedCost - forecast.projectedCost : null,
      moreComplexSiteLabel: nextSiteCondition ? SITE_CONDITIONS[nextSiteCondition].label : null,
    }
  }, [forecast, finishLevel, siteCondition, garageType])

  const breakdownRows = [
    ['Base construction', forecast.baseConstruction],
    ['Site work', forecast.siteWork],
    ['Garage', forecast.garage],
    ['Utilities and driveway allowance', forecast.utilitiesAndDriveway],
    ['Design, permits, and engineering', forecast.permitsAndDesign],
    ['Contingency reserve', forecast.contingency],
    ['Builder overhead', forecast.overheadCost],
  ].map(([label, amount]) => ({
    label,
    amount,
    share: forecast.totalCashNeed > 0 ? (amount / forecast.totalCashNeed) * 100 : 0,
  }))

  const budgetStatus = getBudgetStatus(forecast.netMarginPercent)
  const affordabilityTone = getGapTone(forecast.netMarginPercent)

  const currentScenario = useMemo(() => {
    return createScenarioSnapshot(scenarioName || 'Current scenario', forecast, {
      finishLevel,
      siteCondition,
    })
  }, [scenarioName, forecast, finishLevel, siteCondition])

  const comparisonScenarios = [currentScenario, ...savedScenarios]

  const applyPreset = presetKey => {
    const preset = PROJECT_PRESETS[presetKey]

    if (!preset) {
      return
    }

    setSquareFeet(preset.squareFeet)
    setFinishLevel(preset.finishLevel)
    setFinishCostPerSqft(FINISH_LEVELS[preset.finishLevel].costPerSqft)
    setSiteCondition(preset.siteCondition)
    setSiteWorkCost(SITE_CONDITIONS[preset.siteCondition].cost)
    setGarageType(preset.garageType)
    setGarageCost(GARAGE_OPTIONS[preset.garageType].cost)
    setUtilitiesAllowancePerSqft(14)
    setContingencyMode(preset.contingencyMode)
    setContingencyPercent(preset.contingencyPercent)
    setDesignPercent(preset.designPercent)
    setTargetMarginPercent(preset.targetMarginPercent)
    setOverheadMode(preset.overheadMode)
    setOverheadPercent(preset.overheadPercent)
    setScheduleMonths(preset.scheduleMonths)
    setScenarioName(preset.label)
  }

  const saveCurrentScenario = () => {
    const trimmedName = scenarioName.trim() || `Scenario ${savedScenarios.length + 1}`
    const snapshot = createScenarioSnapshot(trimmedName, forecast, {
      finishLevel,
      siteCondition,
    })

    setSavedScenarios(current => [snapshot, ...current].slice(0, 4))
  }

  const removeSavedScenario = scenarioId => {
    setSavedScenarios(current => current.filter(scenario => scenario.id !== scenarioId))
  }

  return (
    <section className="forecast-page-section">
      <div className="container forecast-wide-container">
        <div className="forecast-shell">
          <div className="forecast-copy">
            <p className="section-label">Builder Pro Forma</p>
            <h2>Pressure-test project cost, sell price, and margin before the job goes live.</h2>
            <p>
              This forecast is for internal builder use. Adjust direct-cost categories, markup, and
              overhead assumptions to model target pricing and profit exposure before contract.
            </p>
          </div>

          <div className="forecast-dashboard">
            <aside className="forecast-sidebar">
              <div className="forecast-panel forecast-control-panel">
                <div className="forecast-panel-head">
                  <h3>Templates and setup</h3>
                  <p>Start from a builder template, name the working scenario, and tune the assumptions in one place.</p>
                </div>

                <div className="forecast-presets" aria-label="Forecast presets">
                  {Object.entries(PROJECT_PRESETS).map(([key, preset]) => (
                    <button key={key} type="button" className="forecast-preset-chip" onClick={() => applyPreset(key)}>
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div className="forecast-scenario-toolbar forecast-scenario-toolbar--stacked">
                  <div className="forecast-panel-head">
                    <h3>Scenario comparison</h3>
                    <p>Save the current pro forma and compare it side by side with up to four stored builder scenarios.</p>
                  </div>
                  <div className="forecast-scenario-actions forecast-scenario-actions--stacked">
                    <label className="forecast-field">
                      <span>Scenario name</span>
                      <input type="text" value={scenarioName} onChange={event => setScenarioName(event.target.value)} />
                    </label>
                    <button type="button" className="forecast-save-button" onClick={saveCurrentScenario}>Save current scenario</button>
                  </div>
                </div>
              </div>

              <form className="forecast-panel forecast-form" onSubmit={event => event.preventDefault()}>
                <div className="forecast-panel-head">
                  <h3>Forecast inputs</h3>
                  <p>Change the cost stack and pricing assumptions to model a realistic internal job pro forma.</p>
                </div>

                <div className="forecast-form-group">
                  <h4>Project scope and allowances</h4>

                  <label className="forecast-field">
                    <span>Conditioned square footage</span>
                    <input type="number" min="600" step="50" value={squareFeet} onChange={event => setSquareFeet(event.target.value)} />
                  </label>

                  <label className="forecast-field">
                    <span>Finish level</span>
                    <select value={finishLevel} onChange={event => {
                      const value = event.target.value
                      setFinishLevel(value)
                      setFinishCostPerSqft(FINISH_LEVELS[value].costPerSqft)
                    }}>
                      {Object.entries(FINISH_LEVELS).map(([value, option]) => (
                        <option key={value} value={value}>{option.label} · {formatCurrency(option.costPerSqft)}/sq ft</option>
                      ))}
                    </select>
                  </label>

                  <label className="forecast-field">
                    <span>Base construction cost per sq ft</span>
                    <input type="number" min="1" step="5" value={finishCostPerSqft} onChange={event => setFinishCostPerSqft(event.target.value)} />
                  </label>

                  <label className="forecast-field">
                    <span>Lot and site condition</span>
                    <select value={siteCondition} onChange={event => {
                      const value = event.target.value
                      setSiteCondition(value)
                      setSiteWorkCost(SITE_CONDITIONS[value].cost)
                    }}>
                      {Object.entries(SITE_CONDITIONS).map(([value, option]) => (
                        <option key={value} value={value}>{option.label} · {formatCurrency(option.cost)}</option>
                      ))}
                    </select>
                  </label>

                  <label className="forecast-field">
                    <span>Site work allowance</span>
                    <input type="number" min="0" step="1000" value={siteWorkCost} onChange={event => setSiteWorkCost(event.target.value)} />
                  </label>

                  <label className="forecast-field">
                    <span>Garage program</span>
                    <select value={garageType} onChange={event => {
                      const value = event.target.value
                      setGarageType(value)
                      setGarageCost(GARAGE_OPTIONS[value].cost)
                    }}>
                      {Object.entries(GARAGE_OPTIONS).map(([value, option]) => (
                        <option key={value} value={value}>{option.label} · {formatCurrency(option.cost)}</option>
                      ))}
                    </select>
                  </label>

                  <label className="forecast-field">
                    <span>Garage allowance</span>
                    <input type="number" min="0" step="1000" value={garageCost} onChange={event => setGarageCost(event.target.value)} />
                  </label>

                  <label className="forecast-field">
                    <span>Utilities and driveway allowance per sq ft</span>
                    <input type="number" min="0" step="1" value={utilitiesAllowancePerSqft} onChange={event => setUtilitiesAllowancePerSqft(event.target.value)} />
                  </label>
                </div>

                <div className="forecast-form-group">
                  <h4>Margin, risk, and schedule</h4>

                  <div className="forecast-two-up">
                    <label className="forecast-field">
                      <span>Design and permits %</span>
                      <input type="number" min="4" max="20" step="0.5" value={designPercent} onChange={event => setDesignPercent(event.target.value)} />
                    </label>
                    <div className="forecast-field">
                      <span>Contingency</span>
                      <div className="forecast-mode-toggle" role="group" aria-label="Contingency mode">
                        <button type="button" className={contingencyMode === COST_MODES.percent ? 'is-active' : ''} onClick={() => setContingencyMode(COST_MODES.percent)}>Percent</button>
                        <button type="button" className={contingencyMode === COST_MODES.fixed ? 'is-active' : ''} onClick={() => setContingencyMode(COST_MODES.fixed)}>Fixed</button>
                      </div>
                      <input type="number" min="0" max={contingencyMode === COST_MODES.percent ? '25' : undefined} step={contingencyMode === COST_MODES.percent ? '0.5' : '1000'} value={contingencyPercent} onChange={event => setContingencyPercent(event.target.value)} />
                    </div>
                  </div>

                  <div className="forecast-two-up">
                    <label className="forecast-field">
                      <span>Target gross margin %</span>
                      <input type="number" min="1" max="45" step="0.5" value={targetMarginPercent} onChange={event => setTargetMarginPercent(event.target.value)} />
                    </label>
                    <div className="forecast-field">
                      <span>Builder overhead</span>
                      <div className="forecast-mode-toggle" role="group" aria-label="Overhead mode">
                        <button type="button" className={overheadMode === COST_MODES.percent ? 'is-active' : ''} onClick={() => setOverheadMode(COST_MODES.percent)}>Percent</button>
                        <button type="button" className={overheadMode === COST_MODES.fixed ? 'is-active' : ''} onClick={() => setOverheadMode(COST_MODES.fixed)}>Fixed</button>
                      </div>
                      <input type="number" min="0" max={overheadMode === COST_MODES.percent ? '25' : undefined} step={overheadMode === COST_MODES.percent ? '0.5' : '1000'} value={overheadPercent} onChange={event => setOverheadPercent(event.target.value)} />
                    </div>
                  </div>

                  <div className="forecast-two-up">
                    <label className="forecast-field">
                      <span>Projected schedule in months</span>
                      <input type="number" min="1" max="36" step="1" value={scheduleMonths} onChange={event => setScheduleMonths(event.target.value)} />
                    </label>
                  </div>
                </div>

                <div className="forecast-note">
                  <strong>Internal-use note:</strong> selectors still load common starting allowances, but every budget category can be overwritten with your estimating assumptions for builder-side review.
                </div>
              </form>
            </aside>

            <div className="forecast-main">
              <div className="forecast-kpis">
                <article className="forecast-kpi-card">
                  <span className="forecast-kpi-label">Projected job cost</span>
                  <strong>{formatCurrency(forecast.projectedCost)}</strong>
                  <p>Direct construction cost including site work, soft costs, and contingency.</p>
                </article>
                <article className="forecast-kpi-card">
                  <span className="forecast-kpi-label">Planning range</span>
                  <strong>{formatCurrency(forecast.budgetRangeLow)} - {formatCurrency(forecast.budgetRangeHigh)}</strong>
                  <p>Use this range before trade buyout, final engineering, and locked allowances.</p>
                </article>
                <article className="forecast-kpi-card">
                  <span className="forecast-kpi-label">Target sell price</span>
                  <strong>{formatCurrency(forecast.targetSellPrice)}</strong>
                  <p>Derived from your direct-cost forecast and target gross margin.</p>
                </article>
                <article className="forecast-kpi-card">
                  <span className="forecast-kpi-label">Projected net profit</span>
                  <strong>{formatCurrency(forecast.netProfit)}</strong>
                  <p>After direct costs and builder overhead are applied to the target sell price.</p>
                </article>
              </div>

              <div className="forecast-panel forecast-comparison-section">
                <div className="forecast-panel-head">
                  <h3>Scenario dashboard</h3>
                  <p>Review the live pro forma against saved alternatives without leaving the builder workspace.</p>
                </div>

                <div className="forecast-comparison-grid">
                  {comparisonScenarios.map((scenario, index) => (
                    <article key={scenario.id || `current-${index}`} className={`forecast-panel forecast-compare-card${index === 0 ? ' forecast-compare-card--current' : ''}`}>
                      <div className="forecast-compare-head">
                        <div>
                          <span className="forecast-kpi-label">{index === 0 ? 'Live scenario' : 'Saved scenario'}</span>
                          <h3>{scenario.name}</h3>
                        </div>
                        {index !== 0 ? (
                          <button type="button" className="forecast-compare-remove" onClick={() => removeSavedScenario(scenario.id)}>Remove</button>
                        ) : null}
                      </div>
                      <div className="forecast-compare-meta">
                        <span>{scenario.finishLabel}</span>
                        <span>{scenario.siteLabel}</span>
                        <span>{scenario.squareFeet.toLocaleString()} sq ft</span>
                      </div>
                      <div className="forecast-compare-stats">
                        <div>
                          <span>Job cost</span>
                          <strong>{formatCurrency(scenario.projectedCost)}</strong>
                        </div>
                        <div>
                          <span>Sell price</span>
                          <strong>{formatCurrency(scenario.targetSellPrice)}</strong>
                        </div>
                        <div>
                          <span>Net profit</span>
                          <strong>{formatCurrency(scenario.netProfit)}</strong>
                        </div>
                        <div>
                          <span>Net margin</span>
                          <strong>{scenario.netMarginPercent.toFixed(1)}%</strong>
                        </div>
                      </div>
                      <div className="forecast-compare-footnote">
                        <span>Schedule: {scenario.scheduleMonths} months</span>
                        <span>Contingency: {scenario.contingencyMode === COST_MODES.percent ? `${scenario.contingencyValue}%` : formatCurrency(scenario.contingencyValue)}</span>
                        <span>Overhead: {scenario.overheadMode === COST_MODES.percent ? `${scenario.overheadValue}%` : formatCurrency(scenario.overheadValue)}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="forecast-results-grid">
                <div className="forecast-panel forecast-results">
                  <div className="forecast-panel-head">
                    <h3>Budget breakdown</h3>
                    <p>{forecast.normalizedSquareFeet.toLocaleString()} sq ft modeled at the {FINISH_LEVELS[finishLevel].label.toLowerCase()} level for internal pricing review.</p>
                  </div>

                  <div className="forecast-summary-list">
                    {breakdownRows.map(row => (
                      <div key={row.label} className="forecast-summary-row">
                        <div>
                          <span>{row.label}</span>
                          <div className="forecast-summary-meter" aria-hidden="true">
                            <span style={{ width: `${Math.min(row.share, 100)}%` }} />
                          </div>
                        </div>
                        <strong>{formatCurrency(row.amount)}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="forecast-total-card">
                    <span>Total forecasted job cost</span>
                    <strong>{formatCurrency(forecast.projectedCost)}</strong>
                    <p>Total cash need including overhead: {formatCurrency(forecast.totalCashNeed)}</p>
                  </div>

                  <div className="forecast-affordability-card">
                    <div className="forecast-affordability-head">
                      <h4>Profitability snapshot</h4>
                      <span className={`forecast-status-badge forecast-status-badge--${affordabilityTone}`}>{budgetStatus}</span>
                    </div>
                    <div className="forecast-affordability-grid">
                      <div>
                        <span>Net margin</span>
                        <strong>{forecast.netMarginPercent.toFixed(1)}%</strong>
                      </div>
                      <div>
                        <span>Monthly burn</span>
                        <strong>{formatCurrency(forecast.monthlyBurn)}</strong>
                      </div>
                    </div>
                    <p>
                      {forecast.netProfit >= 0
                        ? `At a ${forecast.normalizedTargetMargin}% target gross margin, this scenario leaves ${formatCurrency(forecast.netProfit)} in projected net profit after overhead.`
                        : `At a ${forecast.normalizedTargetMargin}% target gross margin, this scenario is underwater by ${formatCurrency(Math.abs(forecast.netProfit))} after overhead.`}
                    </p>
                  </div>
                </div>

                <div className="forecast-cashflow-card forecast-panel">
                  <div className="forecast-panel-head">
                    <h4>Phase cash flow by month</h4>
                    <p>Monthly cash need aligns direct job spend to phase timing and spreads overhead across the active schedule.</p>
                  </div>

                  <div className="forecast-phase-list">
                    {forecast.cashFlow.phases.map(phase => (
                      <div key={phase.key} className="forecast-phase-row">
                        <div>
                          <strong>{phase.label}</strong>
                          <span>Months {phase.startMonth}-{phase.endMonth}</span>
                        </div>
                        <span>{formatCurrency(phase.laborCost)} labor</span>
                        <span>{formatCurrency(phase.materialCost)} materials</span>
                        <span>{formatCurrency(phase.subcontractorCost)} subcontractors</span>
                        <strong>{formatCurrency(phase.directCost)}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="forecast-month-table" role="table" aria-label="Monthly builder cash flow">
                    <div className="forecast-month-table-head" role="row">
                      <span role="columnheader">Month</span>
                      <span role="columnheader">Active phases</span>
                      <span role="columnheader">Labor</span>
                      <span role="columnheader">Material</span>
                      <span role="columnheader">Subcontractor</span>
                      <span role="columnheader">Cash need</span>
                    </div>
                    {forecast.cashFlow.monthlyRows.map(row => (
                      <div key={row.month} className="forecast-month-table-row" role="row">
                        <span role="cell">Month {row.month}</span>
                        <span role="cell">{row.phaseLabels.join(', ')}</span>
                        <span role="cell">{formatCurrency(row.laborCost)}</span>
                        <span role="cell">{formatCurrency(row.materialCost)}</span>
                        <span role="cell">{formatCurrency(row.subcontractorCost)}</span>
                        <strong role="cell">{formatCurrency(row.totalCashNeed)}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="forecast-insights">
            <article className="forecast-panel">
              <div className="forecast-panel-head">
                <h3>What moves the budget fastest</h3>
              </div>
              <div className="forecast-bullet-list">
                <p>Square footage is still the strongest direct-cost driver. Every extra 100 square feet expands structure, MEP scope, finishes, and labor exposure.</p>
                <p>Lot difficulty often destroys margin before the field team notices it. Grading, retaining, drainage, and access should be stress-tested early.</p>
                <p>Contingency protects the estimate, not the markup. Underfunding it usually shows up later as margin erosion during buyout and field execution.</p>
              </div>
            </article>

            <article className="forecast-panel">
              <div className="forecast-panel-head">
                <h3>Fast scenario shifts</h3>
                <p>Use these deltas to see which one change moves direct job cost fastest from the current builder scenario.</p>
              </div>
              <div className="forecast-bullet-list forecast-bullet-list--plain">
                <p>Add 100 square feet: <strong>{formatCurrency(sensitivity.costPer100Sqft)}</strong></p>
                <p>
                  {sensitivity.upgradedFinishLabel
                    ? `Move up to ${sensitivity.upgradedFinishLabel.toLowerCase()}: ${formatCurrency(sensitivity.upgradedFinishDelta)}`
                    : 'You are already modeling the highest finish level.'}
                </p>
                <p>
                  {sensitivity.moreComplexSiteLabel
                    ? `Shift to ${sensitivity.moreComplexSiteLabel.toLowerCase()}: ${formatCurrency(sensitivity.moreComplexSiteDelta)}`
                    : 'You are already modeling the most complex site condition.'}
                </p>
              </div>
            </article>

            <article className="forecast-panel">
              <div className="forecast-panel-head">
                <h3>How builders should use this</h3>
              </div>
              <div className="forecast-bullet-list">
                <p>Use presets as estimating templates, then override each category with current vendor pricing and allowance strategy.</p>
                <p>Review target gross margin and overhead together. A healthy markup can still become a weak net if schedule and indirect cost drift.</p>
                <p>Use monthly burn and net margin as an early filter before promising price, pace, or scope to sales and preconstruction teams.</p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function BuilderProFormaPage() {
  const pageSeo = getPageSeo('/builder-pro-forma')

  return (
    <>
      <Seo title={pageSeo.title} description={pageSeo.description} path={pageSeo.path} />
      <div className="fp-page-banner">
        <div className="container">
          <p className="section-label">Classic Stone</p>
          <h1 className="fp-page-banner-title">Builder Pro Forma</h1>
          <p className="fp-page-banner-sub">
            Internal builder forecast for single-home projects with editable cost drivers, pricing
            assumptions, and margin visibility before preconstruction locks the job.
          </p>
        </div>
      </div>
      <FinancialForecastingSection />
    </>
  )
}