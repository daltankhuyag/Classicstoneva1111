import { useState } from 'react'
import { Link } from 'react-router-dom'

const MATERIALS = [
  { name: 'Granite',    desc: 'Heat-resistant · Durable · Low maintenance',   cls: 'sw-granite',   image: '/Granite.jpg' },
  { name: 'Quartzite',  desc: 'Natural stone · UV-resistant · Elegant',        cls: 'sw-quartz', image: '/quartz.jpg' },
  { name: 'Marble',     desc: 'Timeless beauty · Unique natural veining',      cls: 'sw-marble',    image: '/marble.jpg' },
  { name: 'Limestone',  desc: 'Classic Virginia stone · Warm neutral tones',   cls: 'sw-limestone', image: '/limestone.jpg' },
  { name: 'Soapstone',  desc: 'Heat-tolerant · Vintage character · Smooth',    cls: 'sw-soapstone', image: '/soapstone.jpg' },
]

const APP_ICONS = {
  'Restaurant Countertops': '☕',
  'Kitchen Countertops': '🍳',
  'Vanity Tops':         '🛁',
  'Fireplace':           '🔥',
  'Vertical Wall':       '🧱',
  'Architectural Stone': '🏛️',
}

const PROJECTS = [
  {
    id: 1,
    name: 'Colada Coffee',
    location: 'Arlington, VA',
    material: 'Quartz',
    application: 'Restaurant Countertops',
    desc: 'Clean-lined quartz service counter and bar surfaces installed for a busy Arlington cafe interior.',
    cls: 'sw-quartz',
    image: '/Project portfolio/Colada_ArligntonVA.jpg',
  },
  {
    id: 2,
    name: 'Restraunt Arligton, VA',
    location: 'Arlington, VA',
    material: 'Quartz',
    application: 'Restaurant Tops',
    desc: 'Clean-lined quartz service counter and bar surfaces installed for a busy Arlington cafe interior.',
    cls: 'sw-quartz',
    image: '/Project portfolio/Restaurant, Arlington, VA.jpg',
  },
  {
    id: 3,
    name: 'Gyu-Kaku Japanese Restaurant',
    location: 'Arlington, VA',
    material: 'Quartz',
    application: 'Restaurant Countertops',
    desc: '_',
    cls: 'sw-quartz',
    image: '/Project portfolio/Gyu-Kaku_Arlington,VA.jpg',
  },
  {
    id: 4,
    name: 'South East Impression Restaurant',
    location: 'Fairax, VA',
    material: 'Quartzite',
    application: 'Restaurant Countertops',
    desc: '_',
    cls: 'sw-quartz',
    image: '/Project portfolio/South_east.jpg',
  },
]

export default function Portfolio({
  galleryButtonHref = '/stone-gallery#stone-gallery',
  showHeader = true,
  showFilters = true,
  showProjectInfo = true,
  showAppBadge = true,
  showProjectImages = true,
}) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const currentProject = PROJECTS[currentSlide]

  const goToSlide = index => setCurrentSlide(index)
  const goToPrevious = () => setCurrentSlide(index => (index === 0 ? PROJECTS.length - 1 : index - 1))
  const goToNext = () => setCurrentSlide(index => (index === PROJECTS.length - 1 ? 0 : index + 1))

  return (
    <section className="portfolio" id="portfolio">
      <div className="container">

        {/* Header */}
        {showHeader && (
          <div className="portfolio-header">
            <p className="section-label">Our Stone Work Portolio</p>
            <h2 className="section-title">Stone craftsmanship, in every surface.</h2>
            <div className="divider" />
            <p className="pw-intro">
              From kitchen countertops to architectural stone, every project is cut, fitted,
              and finished by Classic Stone's own craftsmen using Virginia-sourced and
              premium imported stone.
            </p>
            <Link to={galleryButtonHref} className="btn btn-dark pw-gallery-btn">View Stone Gallery</Link>
          </div>
        )}

        {/* Materials strip */}
        <div className="pw-materials">
          {MATERIALS.map(m => (
            <div className="pw-swatch-card" key={m.name}>
              <div
                className={`pw-swatch ${m.cls}`}
                style={{ backgroundImage: `url("${m.image}")` }}
                aria-hidden="true"
              />
              <p className="pw-swatch-name">{m.name}</p>
              <p className="pw-swatch-desc">{m.desc}</p>
            </div>
          ))}
        </div>

        {(showProjectImages || showProjectInfo) && (
          <div className="pw-slider-shell" id="stone-gallery">
            <div className="pw-slider-head">
              <p className="pw-slider-kicker">Project gallery</p>
              <div className="pw-slider-controls" aria-label="Portfolio slider controls">
                <button type="button" className="pw-slider-btn" onClick={goToPrevious} aria-label="Previous project">
                  Prev
                </button>
                <button type="button" className="pw-slider-btn" onClick={goToNext} aria-label="Next project">
                  Next
                </button>
              </div>
            </div>

            <div className="project-card pw-card pw-slide-card">
              {showProjectImages && (
                <div
                  className={`project-img pw-img pw-slide-image ${currentProject.cls}`}
                  style={currentProject.image ? {
                    backgroundImage: `url("${currentProject.image}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  } : undefined}
                >
                  {showAppBadge && (
                    <span className="pw-app-badge">
                      {APP_ICONS[currentProject.application]} {currentProject.application}
                    </span>
                  )}
                </div>
              )}
              {showProjectInfo && (
                <div className="project-info pw-info pw-slide-info">
                  <div className="pw-info-top">
                    <div>
                      <span className="pw-material-chip">{currentProject.material}</span>
                      <h4>{currentProject.name}</h4>
                      <span className="pw-location">{currentProject.location}</span>
                    </div>
                  </div>
                  <p className="pw-desc">{currentProject.desc}</p>
                </div>
              )}
            </div>

            <div className="pw-slider-dots" aria-label="Portfolio slider pagination">
              {PROJECTS.map((project, index) => (
                <button
                  key={project.id}
                  type="button"
                  className={`pw-slider-dot${currentSlide === index ? ' active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`View ${project.name}`}
                  aria-current={currentSlide === index ? 'true' : undefined}
                />
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="pw-bottom-cta">
          <p>Ready to see what stone can do for your home?</p>
          <Link to="/schedule" className="btn btn-fill">Schedule consultation</Link>
        </div>

      </div>
    </section>
  )
}
