import { useState } from 'react'

const SERVICES = [
  { id: 'new-home',   icon: '🏠', label: 'New Home Consultation', duration: '60 min',
    desc: 'Walk through your vision, budget, and lot with our lead project consultant.' },
  { id: 'remodel',   icon: '🔨', label: 'Remodeling Consultation', duration: '45 min',
    desc: 'Explore scope, materials, and timelines for your renovation project.' },
  { id: 'floor-plan', icon: '📐', label: 'Floor Plan Review', duration: '30 min',
    desc: 'Go over a specific plan in detail — dimensions, options, and customisations.' },
  { id: 'site-visit', icon: '📍', label: 'On-Site Visit', duration: '90 min',
    desc: 'We visit your property to assess the land, access, and site conditions.' },
]

const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM',
  '1:00 PM', '2:00 PM',  '3:00 PM', '4:00 PM',
]

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

const STEPS = ['Service', 'Date & Time', 'Your Info', 'Confirmed']

/* ─── Calendar ─────────────────────────────────────────────── */
function Calendar({ selected, onSelect }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [vm, setVm] = useState(today.getMonth())
  const [vy, setVy] = useState(today.getFullYear())

  const prevMonth = () => { if (vm === 0) { setVm(11); setVy(y => y - 1) } else setVm(m => m - 1) }
  const nextMonth = () => { if (vm === 11) { setVm(0);  setVy(y => y + 1) } else setVm(m => m + 1) }

  const firstDow   = new Date(vy, vm, 1).getDay()
  const daysInMonth = new Date(vy, vm + 1, 0).getDate()

  const canGoPrev = new Date(vy, vm, 1) > new Date(today.getFullYear(), today.getMonth(), 1)

  const cells = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div className="sc-calendar">
      <div className="sc-cal-nav">
        <button className="sc-cal-arrow" onClick={prevMonth} disabled={!canGoPrev}>‹</button>
        <span className="sc-cal-month">{MONTH_NAMES[vm]} {vy}</span>
        <button className="sc-cal-arrow" onClick={nextMonth}>›</button>
      </div>
      <div className="sc-cal-dow">
        {DAY_NAMES.map(d => <span key={d}>{d}</span>)}
      </div>
      <div className="sc-cal-grid">
        {cells.map((day, i) => {
          if (!day) return <span key={`_${i}`} />
          const date   = new Date(vy, vm, day)
          const past   = date < today
          const sunday = date.getDay() === 0
          const sel    = selected &&
            selected.getDate() === day &&
            selected.getMonth() === vm &&
            selected.getFullYear() === vy
          return (
            <button
              key={day}
              disabled={past || sunday}
              onClick={() => onSelect(new Date(vy, vm, day))}
              className={`sc-cal-day${sel ? ' sel' : ''}${past || sunday ? ' dis' : ''}`}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Step indicator ───────────────────────────────────────── */
function StepBar({ step }) {
  return (
    <div className="sc-stepbar">
      {STEPS.map((label, i) => (
        <div key={label} className={`sc-step${i === step ? ' active' : ''}${i < step ? ' done' : ''}`}>
          <div className="sc-step-dot">
            {i < step ? '✓' : i + 1}
          </div>
          <span className="sc-step-label">{label}</span>
          {i < STEPS.length - 1 && <div className="sc-step-line" />}
        </div>
      ))}
    </div>
  )
}

/* ─── Booking summary sidebar ──────────────────────────────── */
function Summary({ service, date, time }) {
  const fmt = d => d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  return (
    <div className="sc-summary">
      <p className="sc-summary-title">Your appointment</p>
      {service && (
        <div className="sc-summary-row">
          <span>{service.icon}</span>
          <div>
            <p className="sc-summary-val">{service.label}</p>
            <p className="sc-summary-sub">{service.duration}</p>
          </div>
        </div>
      )}
      {date && (
        <div className="sc-summary-row">
          <span>📅</span>
          <div>
            <p className="sc-summary-val">{fmt(date)}</p>
            {time && <p className="sc-summary-sub">{time}</p>}
          </div>
        </div>
      )}
      <div className="sc-summary-note">
        Classic Stone · Virginia · In-person or virtual
      </div>
    </div>
  )
}

/* ─── Main Scheduler ───────────────────────────────────────── */
export default function Scheduler() {
  const [step, setStep]       = useState(0)
  const [service, setService] = useState(null)
  const [date, setDate]       = useState(null)
  const [time, setTime]       = useState(null)
  const [form, setForm]       = useState({ name: '', email: '', phone: '', notes: '' })
  const [errors, setErrors]   = useState({})

  const next = () => setStep(s => s + 1)
  const back = () => setStep(s => s - 1)

  const validate = () => {
    const e = {}
    if (!form.name.trim())                         e.name  = 'Name is required'
    if (!/\S+@\S+\.\S+/.test(form.email))          e.email = 'Valid email required'
    if (!/^\+?[\d\s\-().]{7,}$/.test(form.phone))  e.phone = 'Valid phone required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (validate()) next()
  }

  const fmtDate = d => d ? d.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  }) : ''

  return (
    <div className="sc-wrap">
      <StepBar step={step} />

      <div className="sc-body">

        {/* ── Step 0: Service ── */}
        {step === 0 && (
          <div className="sc-panel sc-panel-wide">
            <h2 className="sc-panel-title">What can we help you with?</h2>
            <p className="sc-panel-sub">Choose a consultation type to get started.</p>
            <div className="sc-service-grid">
              {SERVICES.map(svc => (
                <button
                  key={svc.id}
                  className={`sc-service-card${service?.id === svc.id ? ' sel' : ''}`}
                  onClick={() => { setService(svc); next() }}
                >
                  <span className="sc-svc-icon">{svc.icon}</span>
                  <h3 className="sc-svc-label">{svc.label}</h3>
                  <p className="sc-svc-dur">{svc.duration}</p>
                  <p className="sc-svc-desc">{svc.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 1: Date & Time ── */}
        {step === 1 && (
          <div className="sc-panel sc-panel-split">
            <div className="sc-split-main">
              <h2 className="sc-panel-title">Pick a date</h2>
              <p className="sc-panel-sub">Monday – Saturday, excluding public holidays.</p>
              <Calendar selected={date} onSelect={d => { setDate(d); setTime(null) }} />
              {date && (
                <>
                  <h3 className="sc-time-heading">
                    Available times · {date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </h3>
                  <div className="sc-time-grid">
                    {TIME_SLOTS.map(t => (
                      <button
                        key={t}
                        className={`sc-time-btn${time === t ? ' sel' : ''}`}
                        onClick={() => setTime(t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </>
              )}
              <div className="sc-nav-row">
                <button className="sc-btn-ghost" onClick={back}>← Back</button>
                <button
                  className="sc-btn-primary"
                  disabled={!date || !time}
                  onClick={next}
                >
                  Continue →
                </button>
              </div>
            </div>
            <Summary service={service} date={date} time={time} />
          </div>
        )}

        {/* ── Step 2: Contact info ── */}
        {step === 2 && (
          <div className="sc-panel sc-panel-split">
            <div className="sc-split-main">
              <h2 className="sc-panel-title">Your details</h2>
              <p className="sc-panel-sub">We'll send a confirmation to your email.</p>
              <form className="sc-form" onSubmit={handleSubmit} noValidate>
                <div className="sc-form-row">
                  <div className="sc-field">
                    <label>Full name</label>
                    <input
                      type="text"
                      placeholder="Jane Smith"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    />
                    {errors.name && <span className="sc-error">{errors.name}</span>}
                  </div>
                  <div className="sc-field">
                    <label>Phone number</label>
                    <input
                      type="tel"
                      placeholder="(540) 555-0100"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    />
                    {errors.phone && <span className="sc-error">{errors.phone}</span>}
                  </div>
                </div>
                <div className="sc-field">
                  <label>Email address</label>
                  <input
                    type="email"
                    placeholder="jane@example.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                  {errors.email && <span className="sc-error">{errors.email}</span>}
                </div>
                <div className="sc-field">
                  <label>Notes <span className="sc-optional">(optional)</span></label>
                  <textarea
                    placeholder="Tell us about your project, lot location, timeline, or any questions…"
                    rows={4}
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  />
                </div>
                <div className="sc-nav-row">
                  <button type="button" className="sc-btn-ghost" onClick={back}>← Back</button>
                  <button type="submit" className="sc-btn-primary">Confirm booking →</button>
                </div>
              </form>
            </div>
            <Summary service={service} date={date} time={time} />
          </div>
        )}

        {/* ── Step 3: Confirmed ── */}
        {step === 3 && (
          <div className="sc-panel sc-confirmed">
            <div className="sc-confirmed-icon">✓</div>
            <h2 className="sc-confirmed-title">You're booked!</h2>
            <p className="sc-confirmed-sub">
              A confirmation has been sent to <strong>{form.email}</strong>. Our team will
              reach out within 2 business hours to confirm your appointment.
            </p>
            <div className="sc-confirmed-card">
              <div className="sc-conf-row">
                <span className="sc-conf-label">Service</span>
                <span className="sc-conf-val">{service?.icon} {service?.label}</span>
              </div>
              <div className="sc-conf-row">
                <span className="sc-conf-label">Date</span>
                <span className="sc-conf-val">{fmtDate(date)}</span>
              </div>
              <div className="sc-conf-row">
                <span className="sc-conf-label">Time</span>
                <span className="sc-conf-val">{time}</span>
              </div>
              <div className="sc-conf-row">
                <span className="sc-conf-label">Name</span>
                <span className="sc-conf-val">{form.name}</span>
              </div>
              <div className="sc-conf-row">
                <span className="sc-conf-label">Contact</span>
                <span className="sc-conf-val">{form.phone} · {form.email}</span>
              </div>
            </div>
            <div className="sc-confirmed-actions">
              <a href="/" className="sc-btn-primary">Back to home</a>
              <button
                className="sc-btn-ghost"
                onClick={() => {
                  setStep(0); setService(null); setDate(null)
                  setTime(null); setForm({ name: '', email: '', phone: '', notes: '' })
                }}
              >
                Book another
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
