import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Seo from '../components/Seo'
import {
  DEFAULT_FINISH,
  getDoorStyleById,
  getFinishesForDoorStyle,
} from '../data/fabuwoodDoorStyles'

export default function DoorStylePage() {
  const { styleId } = useParams()
  const style = getDoorStyleById(styleId)
  const availableFinishes = getFinishesForDoorStyle(style)
  const finishSections = style?.id === 'galaxy'
    ? [
      {
        id: 'signature',
        kicker: 'Signature Finishes',
        title: 'Our most popular stocked finishes, ready when you are.',
        finishes: availableFinishes.filter(finish => finish.group !== 'designer'),
      },
      {
        id: 'designer',
        kicker: 'Designer Finishes',
        title: 'Curated, custom colors crafted to inspire, made to order with intention.',
        finishes: availableFinishes.filter(finish => finish.group === 'designer'),
      },
    ].filter(section => section.finishes.length)
    : [
      {
        id: 'all',
        kicker: 'Available Finishes',
        title: `Finish options for ${style?.name}.`,
        finishes: availableFinishes,
      },
    ]
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
            <p className="section-label">Fabuwood Door Styles</p>
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
          <h1 className="fp-page-banner-title">{style.name}</h1>
          <p className="fp-page-banner-sub">
            {style.description} Review the finishes most often paired with this profile before moving into material and countertop selections.
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
            <Link to="/" className="fds-back-link">Back to door profiles</Link>
            <span className="fds-detail-tag">{style.tag}</span>
          </div>

          <div className="fds-detail-hero">
            <div className="fds-detail-preview-stage">
              <div className={`fds-door fds-detail-door ${style.variant}`} aria-hidden="true">
                <div className="fds-panel" />
                <div className="fds-pull" />
              </div>
            </div>

            <div className="fds-detail-copy">
              <p className="fds-detail-label">Selected finish</p>
              <h2 className="fds-detail-title">{selectedFinish.name}</h2>
              <p className="fds-detail-note">{selectedFinish.note}</p>
              <div className="fds-detail-actions">
                <a href="/schedule" className="btn btn-fill">Book a Design Visit</a>
                <a href="/stone-gallery" className="btn btn-dark">View Stone Gallery</a>
              </div>
            </div>
          </div>

          <div className="fds-finishes-panel">
            <div className="fds-finishes-head">
              <p className="section-label">Available Finishes</p>
              <h2 className="section-title">Finish options for {style.name}.</h2>
              <div className="divider" />
              <p className="fds-intro">
                Each finish below is previewed on the selected door profile so you can compare tone, depth, and overall mood before final selections.
              </p>
            </div>

            {finishSections.map(section => (
              <div key={section.id} className="fds-finish-section">
                <div className="fds-finish-section-head">
                  <p className="section-label">{section.kicker}</p>
                  <h3 className="fds-finish-section-title">{section.title}</h3>
                </div>

                <div className="fds-finish-grid">
                  {section.finishes.map(finish => {
                    const isSelected = finish.id === selectedFinish.id

                    return (
                      <button
                        type="button"
                        key={finish.id}
                        className={`fds-finish-card${isSelected ? ' selected' : ''}`}
                        onClick={() => setSelectedFinishId(finish.id)}
                        aria-pressed={isSelected}
                      >
                        <div
                          className="fds-finish-preview"
                          style={{
                            '--fds-door': finish.door,
                            '--fds-door-dark': finish.doorDark,
                            '--fds-door-edge': finish.edge,
                            '--fds-grain': finish.grain,
                          }}
                        >
                          <div className={`fds-door fds-finish-door ${style.variant}`} aria-hidden="true">
                            <div className="fds-panel" />
                            <div className="fds-pull" />
                          </div>
                        </div>
                        <div className="fds-finish-body">
                          <div className="fds-meta-row">
                            <h3 className="fds-door-name">{finish.name}</h3>
                            <span className="fds-door-tag">{finish.label}</span>
                          </div>
                          <p className="fds-door-desc">{finish.note}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}