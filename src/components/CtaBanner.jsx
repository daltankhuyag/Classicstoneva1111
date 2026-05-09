import { useState, useMemo } from 'react'

const PROJECTS_PER_PAGE = 3

const MATERIALS = [
  { name: 'Granite',    desc: 'Heat-resistant · Durable · Low maintenance',   cls: 'sw-granite'    },
  { name: 'Quartzite',  desc: 'Natural stone · UV-resistant · Elegant',        cls: 'sw-quartzite'  },
  { name: 'Marble',     desc: 'Timeless beauty · Unique natural veining',      cls: 'sw-marble'     },
  { name: 'Limestone',  desc: 'Classic Virginia stone · Warm neutral tones',   cls: 'sw-limestone'  },
  { name: 'Soapstone',  desc: 'Heat-tolerant · Vintage character · Smooth',    cls: 'sw-soapstone'  },
]

const APP_ICONS = {
  'Kitchen Countertops': '🍳',
  'Vanity Tops':         '🛁',
  'Fireplace':           '🔥',
  'Vertical Wall':       '🧱',
  'Architectural Stone': '🏛️',
}

const PROJECTS = [
  {
    id: 1,
    name: 'Morrison Kitchen',
    location: 'McLean, VA',
    material: 'Quartzite',
    application: 'Kitchen Countertops',
    desc: 'Calacatta quartzite island and perimeter counters with a live-edge waterfall detail.',
    cls: 'sw-quartzite',
  },
  {
    id: 2,
    name: 'Blue Ridge Master Bath',
    location: 'Charlottesville, VA',
    material: 'Granite',
    application: 'Vanity Tops',
    desc: 'Absolute Black granite double vanity with ogee profile and under-mount sinks.',
    cls: 'sw-granite',
  },
  {
    id: 3,
    name: 'Shenandoah Fireplace',
    location: 'Front Royal, VA',
    material: 'Limestone',
    application: 'Fireplace',
    desc: 'Virginia limestone full-surround with hand-carved mantel detail and herringbone hearth.',
    cls: 'sw-limestone',
  },
  {
    id: 4,
    name: 'Whitmore Feature Wall',
    location: 'Arlington, VA',
    material: 'Quartzite',
    application: 'Vertical Wall',
    desc: 'Book-matched quartzite floor-to-ceiling accent wall in an open-plan living room.',
    cls: 'sw-quartzite-alt',
  },
  {
    id: 5,
    name: 'Ridgeline Entry Arch',
    location: 'Warrenton, VA',
    material: 'Granite',
    application: 'Architectural Stone',
    desc: 'Carved granite arch columns and entry surround installed on a Craftsman-style home.',
    cls: 'sw-granite-light',
  },
  {
    id: 6,
    name: 'Cedar Creek Kitchen',
    location: 'Winchester, VA',
    material: 'Granite',
    application: 'Kitchen Countertops',
    desc: 'White Galaxy granite counters with farmhouse sink cutout and matching full-height backsplash.',
    cls: 'sw-granite-light',
  },
  {
    id: 7,
    name: 'Hillcrest Spa Bath',
    location: 'Herndon, VA',
    material: 'Marble',
    application: 'Vanity Tops',
    desc: 'Carrara marble vanity top with honed finish, mitered edges, and integrated trough sink.',
    cls: 'sw-marble',
  },
  {
    id: 8,
    name: 'Piedmont Stone Mantel',
    location: 'Culpeper, VA',
    material: 'Soapstone',
    application: 'Fireplace',
    desc: 'Virginia soapstone fireplace surround and raised hearth with traditional carved profile.',
    cls: 'sw-soapstone',
  },
  {
    id: 9,
    name: 'Stonewall Dining Feature',
    location: 'Staunton, VA',
    material: 'Limestone',
    application: 'Vertical Wall',
    desc: 'Stacked Virginia limestone accent wall behind a custom built-in dining buffet.',
    cls: 'sw-limestone',
  },
]

const APPLICATIONS = ['All', 'Kitchen Countertops', 'Vanity Tops', 'Fireplace', 'Vertical Wall', 'Architectural Stone']

export default function Portfolio() {
  const [activeApp, setActiveApp] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)

  const visible = useMemo(() =>
    activeApp === 'All' ? PROJECTS : PROJECTS.filter(p => p.application === activeApp),
  [activeApp])

  const pageCount = Math.ceil(visible.length / PROJECTS_PER_PAGE)

  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE

    return visible.slice(startIndex, startIndex + PROJECTS_PER_PAGE)
  }, [currentPage, visible])

  const handleFilterChange = (application) => {
    setActiveApp(application)
    setCurrentPage(1)
  }

  return (
    <section className="portfolio" id="portfolio">
      <div className="container">

        {/* Header */}
        <div className="portfolio-header">
          <p className="section-label">Our Work</p>
          <h2 className="section-title">Stone craftsmanship, in every surface.</h2>
          <div className="divider" />
          <p className="pw-intro">
            From kitchen countertops to architectural stone, every project is cut, fitted,
            and finished by Classic Stone's own craftsmen using Virginia-sourced and
            premium imported stone.
          </p>
        </div>

        {/* Materials strip */}
        <div className="pw-materials">
          {MATERIALS.map(m => (
            <div className="pw-swatch-card" key={m.name}>
              <div className={`pw-swatch ${m.cls}`} />
              <p className="pw-swatch-name">{m.name}</p>
              <p className="pw-swatch-desc">{m.desc}</p>
            </div>
          ))}
        </div>

        {/* Application filter */}
        <div className="pw-filters">
          {APPLICATIONS.map(a => (
            <button
              key={a}
              className={`fp-filter-btn${activeApp === a ? ' active' : ''}`}
              onClick={() => handleFilterChange(a)}
            >
              {a !== 'All' && <span className="pw-filter-icon">{APP_ICONS[a]}</span>}
              {a}
            </button>
          ))}
        </div>

        {/* Project grid */}
        <div className="portfolio-grid">
          {paginatedProjects.map(p => (
            <div className="project-card pw-card" key={p.id}>
              <div className={`project-img pw-img ${p.cls}`}>
                <span className="pw-app-badge">
                  {APP_ICONS[p.application]} {p.application}
                </span>
              </div>
              <div className="project-info pw-info">
                <div className="pw-info-top">
                  <div>
                    <span className="pw-material-chip">{p.material}</span>
                    <h4>{p.name}</h4>
                    <span className="pw-location">{p.location}</span>
                  </div>
                </div>
                <p className="pw-desc">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {pageCount > 1 && (
          <div className="pw-pagination" aria-label="Portfolio pagination">
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                className={`pw-page-btn${currentPage === pageNumber ? ' active' : ''}`}
                onClick={() => setCurrentPage(pageNumber)}
                aria-current={currentPage === pageNumber ? 'page' : undefined}
              >
                {pageNumber}
              </button>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="pw-bottom-cta">
          <p>Ready to see what stone can do for your home?</p>
          <a href="/schedule" className="btn btn-fill">Schedule a Stone Consultation</a>
        </div>

      </div>
    </section>
  )
}
