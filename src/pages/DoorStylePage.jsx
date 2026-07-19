import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Seo from '../components/Seo'
import {
  DEFAULT_FINISH,
  getDoorStyleById,
  getFinishSectionsForDoorStyle,
  getFinishesForDoorStyle,
} from '../data/fabuwoodDoorStyles'

function getFinishType(label) {
  const normalizedLabel = label.toLowerCase()

  if (normalizedLabel.includes('stain')) {
    return 'Stained'
  }

  if (normalizedLabel.includes('textured')) {
    return 'Textured'
  }

  if (normalizedLabel.includes('gloss')) {
    return 'Gloss'
  }

  if (normalizedLabel.includes('matte')) {
    return 'Matte'
  }

  return 'Painted'
}

export default function DoorStylePage() {
  const { styleId } = useParams()
  const style = getDoorStyleById(styleId)
  const availableFinishes = getFinishesForDoorStyle(style)
  const finishSections = getFinishSectionsForDoorStyle(style)
  const [selectedFinishId, setSelectedFinishId] = useState(availableFinishes[0]?.id || DEFAULT_FINISH.id)

  useEffect(() => {
    setSelectedFinishId(availableFinishes[0]?.id || DEFAULT_FINISH.id)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [styleId])

  if (!style) {
    return (
      <>
        <Seo
          title="Door Style Not Found | Classic Stone"
          description="The requested Fabuwood door style could not be found."
          path="/door-styles"
        />
        <div className="fp-page-banner">
          <div className="container">
            <p className="section-label">Cabinet Door styles we offer</p>
            <h1 className="fp-page-banner-title">Door profile not found.</h1>
            <p className="fp-page-banner-sub">
              Return to the style gallery to choose a valid cabinet profile.
            </p>
          </div>
        </div>
        <section className="fds-detail-section">
          <div className="container">
            <Link to="/" className="btn btn-dark">Back To Home</Link>
          </div>
        </section>
      </>
    )
  }

  const selectedFinish = availableFinishes.find(finish => finish.id === selectedFinishId) || DEFAULT_FINISH
  const pagePath = `/door-styles/${style.id}`
  const selectedFinishType = getFinishType(selectedFinish.label)
  const selectedFinishImage = selectedFinish.media?.image

  return (
    <>
      <Seo
        title={`${style.name} Door Style | Classic Stone`}
        description={`Explore ${style.name} cabinet door styling and available finish options for Classic Stone kitchen projects in Virginia.`}
        path={pagePath}
      />
      <div className="fp-page-banner">
        <div className="container">
          <p className="section-label">Fabuwood Door Profile</p>
          <h1 className="fp-page-banner-title">Build your door, one finish at a time</h1>
          <p className="fp-page-banner-sub">
            Pick any finish on the right and watch it apply to the {style.name} profile instantly. Your selection stays in view while you browse, then carry it into pricing and material selections.
          </p>
        </div>
      </div>

      <section
        className="fds-detail-section"
        style={{
          '--fds-door': selectedFinish.door,
          '--fds-door-dark': selectedFinish.doorDark,
          '--fds-door-edge': selectedFinish.edge,
          '--fds-grain': selectedFinish.grain,
        }}
      >
        <div className="container">
          <div className="fds-detail-topbar">
            <a href="/#door-profiles" className="fds-back-link">Back to door profiles</a>
            <span className="fds-detail-tag">{style.tag}</span>
          </div>

          <div className="fds-detail-shell">
            <aside className="fds-detail-sidebar">
              <div className="fds-door-panel">
                <div className="fds-detail-preview-stage">
                  {selectedFinishImage ? (
                    <img
                      className="fds-detail-preview-image"
                      src={selectedFinishImage}
                      alt={`${style.name} in ${selectedFinish.name} finish`}
                    />
                  ) : (
                    <div className={`fds-door fds-detail-door ${style.variant}`} aria-hidden="true">
                      <div className="fds-panel" />
                      <div className="fds-pull" />
                    </div>
                  )}
                </div>

                <div className="fds-detail-copy">
                  <dl className="fds-detail-facts">
                    <div>
                      <dt>Door style</dt>
                      <dd>{style.name} · {style.tag}</dd>
                    </div>
                    <div>
                      <dt>Applied finish</dt>
                      <dd className="fds-detail-finish-name">{selectedFinish.name}</dd>
                    </div>
                    <div>
                      <dt>Finish type</dt>
                      <dd>{selectedFinishType}</dd>
                    </div>
                  </dl>

                  <p className="fds-detail-note">{selectedFinish.note}</p>

                  <div className="fds-detail-actions">
                    <a href="/schedule" className="btn btn-fill fds-detail-cta">Request a Quote With This Finish</a>
                  </div>

                  <p className="fds-detail-helper">No obligation. We reply within one business day.</p>
                </div>
              </div>
            </aside>

            <div className="fds-detail-content">
              <div className="fds-finishes-panel">
                {finishSections.map(section => (
                  <div key={section.id} className="fds-finish-section">
                    <div className="fds-finish-section-head">
                      <p className="section-label">{section.kicker}</p>
                      <h3 className="fds-finish-section-title">{section.title}</h3>
                      <p className="fds-finish-section-note">{section.note}</p>
                    </div>

                    <div className="fds-finish-grid">
                      {section.finishes.map(finish => {
                        const isSelected = finish.id === selectedFinish.id
                        const finishType = getFinishType(finish.label)

                        return (
                          <button
                            type="button"
                            key={finish.id}
                            className={`fds-finish-card${isSelected ? ' selected' : ''}`}
                            onClick={() => setSelectedFinishId(finish.id)}
                            aria-pressed={isSelected}
                          >
                            <div
                              className="fds-finish-chip"
                              style={finish.media ? undefined : {
                                '--fds-chip': finish.door,
                                '--fds-chip-dark': finish.doorDark,
                              }}
                            >
                              {finish.media ? (
                                <img
                                  className="fds-finish-chip-image"
                                  src={finish.media.image}
                                  alt=""
                                  loading="lazy"
                                />
                              ) : null}
                            </div>
                            <div className="fds-finish-body">
                              <span className="fds-finish-name">{finish.name}</span>
                              <span className="fds-finish-kind">{finishType}</span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}