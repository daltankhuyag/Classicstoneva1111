import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DEFAULT_FINISH, DOOR_STYLES, FILTERS } from '../data/fabuwoodDoorStyles'

export default function FabuwoodDoorStyles() {
  const [activeFilter, setActiveFilter] = useState('all')

  const visibleStyles = activeFilter === 'all'
    ? DOOR_STYLES
    : DOOR_STYLES.filter(style => style.family === activeFilter)

  return (
    <section
      className="fds-section"
      style={{
        '--fds-door': DEFAULT_FINISH.door,
        '--fds-door-dark': DEFAULT_FINISH.doorDark,
        '--fds-door-edge': DEFAULT_FINISH.edge,
        '--fds-grain': DEFAULT_FINISH.grain,
      }}
    >
      <div className="container">
        <div className="fds-header">
          <p className="section-label">Fabuwood Door Styles</p>
          <h2 className="section-title">Compare cabinet profiles before you choose your kitchen look.</h2>
          <div className="divider" />
          <p className="fds-intro">
            Review the most requested Fabuwood door fronts side by side,
            and shortlist the profile that fits your remodel before we move into stone
            selection and final detailing.
          </p>
        </div>

        <div className="fds-controls">
          <div>
            <p className="fds-control-label">Door Family</p>
            <div className="fds-filters" role="tablist" aria-label="Door style filters">
              {FILTERS.map(filter => {
                const isActive = filter.id === activeFilter

                return (
                  <button
                    type="button"
                    key={filter.id}
                    className={`fds-filter-btn${isActive ? ' active' : ''}`}
                    onClick={() => setActiveFilter(filter.id)}
                    aria-pressed={isActive}
                  >
                    {filter.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="fds-grid">
          {visibleStyles.map(style => (
              <Link
                key={style.id}
                to={`/door-styles/${style.id}`}
                className="fds-door-card"
              >
                <div className="fds-door-stage">
                  <div className={`fds-door ${style.variant}`} aria-hidden="true">
                    <div className="fds-panel" />
                    <div className="fds-pull" />
                  </div>
                </div>
                <div className="fds-door-meta">
                  <div className="fds-meta-row">
                    <h3 className="fds-door-name">{style.name}</h3>
                    <span className="fds-door-tag">{style.tag}</span>
                  </div>
                  <p className="fds-door-desc">{style.description}</p>
                  <span className="fds-card-hint">Open finishes for {style.name}</span>
                </div>
              </Link>
          ))}
        </div>

        <p className="fds-note">
          Door shapes above are visual references for profile comparison. Final finish,
          grain direction, and exact manufacturer availability are confirmed during your
          design consultation.
        </p>

        <div className="fds-cta">
          <div>
            <p className="fds-cta-kicker">Next step</p>
            <h3 className="fds-cta-title">Choose a door profile to open its finish page and compare cabinet color options.</h3>
          </div>
          <a href="/schedule" className="btn btn-fill">Book A Design Visit</a>
        </div>
      </div>
    </section>
  )
}