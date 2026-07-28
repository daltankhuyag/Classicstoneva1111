import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DEFAULT_FINISH, DOOR_STYLES, FILTERS } from '../data/fabuwoodDoorStyles'

export default function FabuwoodDoorStyles() {
  const [activeFilter, setActiveFilter] = useState('all')

  const visibleStyles = activeFilter === 'all'
    ? DOOR_STYLES
    : DOOR_STYLES.filter(style => style.family === activeFilter)

  const activeFilterLabel = FILTERS.find(filter => filter.id === activeFilter)?.label

  return (
    <section
      id="door-profiles"
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
          <p className="section-label">Cabinet Door styles we offer</p>
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
            <div className="fds-filters" role="group" aria-label="Filter door styles by family">
              {FILTERS.map(filter => {
                const isActive = filter.id === activeFilter
                const count = filter.id === 'all'
                  ? DOOR_STYLES.length
                  : DOOR_STYLES.filter(style => style.family === filter.id).length

                return (
                  <button
                    type="button"
                    key={filter.id}
                    className={`fds-filter-btn${isActive ? ' active' : ''}`}
                    onClick={() => setActiveFilter(filter.id)}
                    aria-pressed={isActive}
                  >
                    {filter.label}
                    <span className="fds-filter-count">{count}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {visibleStyles.length > 0 ? (
          <div className="fds-grid">
            {visibleStyles.map((style, index) => (
                <Link
                  key={style.id}
                  to={`/door-styles/${style.id}`}
                  className="fds-door-card"
                  style={{ '--fds-card-index': index }}
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
                    <span className="fds-card-hint">
                      Open finishes for {style.name}
                      <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" focusable="false">
                        <path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </Link>
            ))}
          </div>
        ) : (
          <div className="fds-empty-state" role="status">
            <p>No door profiles found for “{activeFilterLabel}” yet.</p>
            <button type="button" className="fds-empty-reset" onClick={() => setActiveFilter('all')}>
              View all door styles
            </button>
          </div>
        )}

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