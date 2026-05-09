import { useState, useMemo, useEffect } from 'react'

function downloadPlanFile(plan) {
  const fileName = `${plan.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-floor-plan.txt`
  const fileContents = [
    `${plan.name} Floor Plan`,
    '',
    `Style: ${plan.style}`,
    `Square Feet: ${plan.sqft.toLocaleString()}`,
    `Bedrooms: ${plan.bed}`,
    `Bathrooms: ${plan.bath}`,
    `Stories: ${plan.stories}`,
    `Garage: ${plan.garage}`,
    `Starting Price: ${plan.price}`,
    '',
    'Description',
    plan.description,
    '',
    'Room Dimensions',
    ...plan.features.map(feature => `${feature.label}: ${feature.value}`),
    '',
    'Included Highlights',
    ...plan.highlights.map(highlight => `- ${highlight}`),
  ].join('\n')

  const blob = new Blob([fileContents], { type: 'text/plain;charset=utf-8' })
  const downloadUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = downloadUrl
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(downloadUrl)
}

const PLANS = [
  {
    id: 1,
    name: 'The Ridgeline',
    style: 'Craftsman',
    sqft: 3400,
    bed: 4,
    bath: 3,
    stories: 2,
    garage: '2-car',
    price: '$680k+',
    priceNum: 680,
    badge: 'Most popular',
    badgeType: 'popular',
    bg: 'fp-warm',
    description:
      'A thoughtfully designed Craftsman home that celebrates Virginia\'s natural landscape. The open main floor flows seamlessly between living and entertaining spaces, while the primary suite offers a peaceful retreat with mountain views and a spa-style bath.',
    features: [
      { label: 'Primary suite',  value: '18 × 16 ft' },
      { label: 'Great room',     value: '22 × 20 ft' },
      { label: 'Kitchen',        value: '16 × 14 ft' },
      { label: 'Dining room',    value: '14 × 12 ft' },
      { label: 'Home office',    value: '12 × 11 ft' },
      { label: '2-car garage',   value: 'included'   },
    ],
    highlights: ['Main floor primary', 'Open concept', 'Covered front porch', 'Walk-in pantry', 'Mudroom entry'],
    tags: ['Main floor primary', 'Open concept'],
  },
  {
    id: 2,
    name: 'The Meadowbrook',
    style: 'Farmhouse',
    sqft: 2800,
    bed: 4,
    bath: 2.5,
    stories: 2,
    garage: '2-car',
    price: '$560k+',
    priceNum: 560,
    badge: 'New plan',
    badgeType: 'new',
    bg: 'fp-sage',
    description:
      'Inspired by Virginia\'s rural heritage, The Meadowbrook wraps you in warmth from the moment you step onto the wraparound porch. Shiplap walls, farmhouse finishes, and an open-concept kitchen make this home as livable as it is beautiful.',
    features: [
      { label: 'Primary suite',    value: '16 × 15 ft' },
      { label: 'Wraparound porch', value: '680 sq ft'  },
      { label: 'Great room',       value: '20 × 18 ft' },
      { label: 'Mudroom',          value: '12 × 10 ft' },
      { label: 'Laundry room',     value: '10 × 8 ft'  },
      { label: '2-car garage',     value: 'included'   },
    ],
    highlights: ['Farmhouse sink', 'Shiplap walls', 'Wraparound porch', 'Exposed ceiling beams', 'Apron front sink'],
    tags: ['Farmhouse sink', 'Shiplap walls'],
  },
  {
    id: 3,
    name: 'The Shenandoah',
    style: 'Colonial',
    sqft: 4200,
    bed: 5,
    bath: 4,
    stories: 2,
    garage: '3-car',
    price: '$820k+',
    priceNum: 820,
    badge: null,
    badgeType: null,
    bg: 'fp-dusk',
    description:
      'A commanding presence with timeless Colonial elegance. The dual-staircase foyer, formal dining, and private library define refined Virginia living. Generous room proportions and classic symmetry make The Shenandoah an enduring statement.',
    features: [
      { label: 'Primary suite',  value: '20 × 18 ft' },
      { label: 'Formal dining',  value: '16 × 14 ft' },
      { label: 'Library',        value: '14 × 12 ft' },
      { label: 'Family room',    value: '22 × 20 ft' },
      { label: 'Guest suite',    value: '15 × 13 ft' },
      { label: '3-car garage',   value: 'included'   },
    ],
    highlights: ['Dual staircases', "Butler's pantry", 'Formal living room', 'Private library', 'Grand foyer'],
    tags: ['Dual staircases', "Butler's pantry"],
  },
  {
    id: 4,
    name: 'The Blue Ridge',
    style: 'Contemporary',
    sqft: 2600,
    bed: 3,
    bath: 2.5,
    stories: 1,
    garage: '2-car',
    price: '$520k+',
    priceNum: 520,
    badge: null,
    badgeType: null,
    bg: 'fp-slate',
    description:
      'Clean lines and expansive glass define The Blue Ridge — a modern retreat that frames Virginia\'s landscape like a work of art. The open-plan main floor and flat roofline create a serene, gallery-like atmosphere perfect for contemporary living.',
    features: [
      { label: 'Open kitchen',   value: '20 × 18 ft' },
      { label: 'Primary suite',  value: '15 × 14 ft' },
      { label: 'Home office',    value: '12 × 11 ft' },
      { label: 'Great room',     value: '24 × 20 ft' },
      { label: 'Outdoor deck',   value: '18 × 14 ft' },
      { label: '2-car garage',   value: 'included'   },
    ],
    highlights: ['Floor-to-ceiling windows', 'Flat roof', 'Polished concrete floors', 'Indoor-outdoor flow', 'Smart home ready'],
    tags: ['Floor-to-ceiling windows', 'Flat roof'],
  },
  {
    id: 5,
    name: 'The Appalachian',
    style: 'Craftsman',
    sqft: 3100,
    bed: 4,
    bath: 3,
    stories: 2,
    garage: '2-car',
    price: '$620k+',
    priceNum: 620,
    badge: null,
    badgeType: null,
    bg: 'fp-earth',
    description:
      'Rooted in the spirit of the mountains, The Appalachian combines Craftsman warmth with an airy vaulted great room. A covered porch and flexible bonus room make it ideal for families who love to entertain and value everyday comfort.',
    features: [
      { label: 'Primary suite', value: '17 × 15 ft' },
      { label: 'Great room',    value: '20 × 18 ft' },
      { label: 'Bonus room',    value: '18 × 16 ft' },
      { label: 'Kitchen',       value: '15 × 13 ft' },
      { label: 'Covered porch', value: '24 × 10 ft' },
      { label: '2-car garage',  value: 'included'   },
    ],
    highlights: ['Covered porch', 'Vaulted great room', 'Bonus/flex room', 'Stone fireplace', 'Main floor laundry'],
    tags: ['Covered porch', 'Vaulted great room'],
  },
  {
    id: 6,
    name: 'The Piedmont',
    style: 'Farmhouse',
    sqft: 3300,
    bed: 4,
    bath: 3.5,
    stories: 2,
    garage: '2-car',
    price: '$660k+',
    priceNum: 660,
    badge: null,
    badgeType: null,
    bg: 'fp-moss',
    description:
      'Rolling fields and open skies inspired The Piedmont\'s generous screened porch and wide-open floor plan. Exposed beams, a walk-in pantry, and natural materials connect you deeply to Virginia\'s farmland character and four-season beauty.',
    features: [
      { label: 'Primary suite',  value: '18 × 16 ft' },
      { label: 'Screened porch', value: '20 × 14 ft' },
      { label: 'Great room',     value: '22 × 18 ft' },
      { label: 'Laundry room',   value: '12 × 10 ft' },
      { label: 'Walk-in pantry', value: '10 × 8 ft'  },
      { label: '2-car garage',   value: 'included'   },
    ],
    highlights: ['Exposed beams', 'Walk-in pantry', 'Screened porch', 'Hardwood floors', 'Double vanity'],
    tags: ['Exposed beams', 'Walk-in pantry'],
  },
]

const STYLES = ['All styles', 'Craftsman', 'Farmhouse', 'Contemporary', 'Colonial']

const SORT_OPTIONS = [
  { label: 'Most popular',       value: 'popular'    },
  { label: 'Price: Low to High', value: 'price-asc'  },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest',             value: 'new'        },
]

function HouseSVG({ large }) {
  return (
    <svg
      className={large ? 'fp-house-svg fp-house-svg-lg' : 'fp-house-svg'}
      viewBox="0 0 280 180"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon points="140,16 248,82 32,82"          fill="rgba(0,0,0,0.18)" />
      <polygon points="55,46 108,82 2,82"            fill="rgba(0,0,0,0.12)" />
      <polygon points="225,52 272,82 178,82"         fill="rgba(0,0,0,0.10)" />
      <rect x="32"  y="80" width="216" height="90"  fill="rgba(0,0,0,0.14)" />
      <rect x="2"   y="80" width="60"  height="60"  fill="rgba(0,0,0,0.09)" />
      <rect x="58"  y="96" width="36"  height="26" rx="2" fill="rgba(255,255,255,0.17)" />
      <rect x="186" y="96" width="36"  height="26" rx="2" fill="rgba(255,255,255,0.17)" />
      <rect x="107" y="110" width="66" height="60" rx="2" fill="rgba(0,0,0,0.10)" />
      <line x1="107" y1="130" x2="173" y2="130" stroke="rgba(255,255,255,0.10)" strokeWidth="1.5" />
      <line x1="107" y1="150" x2="173" y2="150" stroke="rgba(255,255,255,0.10)" strokeWidth="1.5" />
    </svg>
  )
}

function PlanDetail({ plan, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="pd-overlay" onClick={onClose}>
      <div className="pd-modal" onClick={e => e.stopPropagation()}>

        <div className={`pd-hero ${plan.bg}`}>
          <HouseSVG large />
          {plan.badge && (
            <span className={`fp-badge fp-badge-${plan.badgeType}`}>{plan.badge}</span>
          )}
          <button className="pd-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="pd-body">
          <div className="pd-top">
            <div>
              <span className="pd-style-chip">{plan.style}</span>
              <h2 className="pd-name">{plan.name}</h2>
            </div>
            <span className="pd-price">{plan.price}</span>
          </div>

          <div className="pd-stats">
            <div className="pd-stat">
              <span className="pd-stat-num">{plan.sqft.toLocaleString()}</span>
              <span className="pd-stat-label">sq ft</span>
            </div>
            <div className="pd-stat">
              <span className="pd-stat-num">{plan.bed}</span>
              <span className="pd-stat-label">bedrooms</span>
            </div>
            <div className="pd-stat">
              <span className="pd-stat-num">{plan.bath}</span>
              <span className="pd-stat-label">bathrooms</span>
            </div>
            <div className="pd-stat">
              <span className="pd-stat-num">{plan.stories}</span>
              <span className="pd-stat-label">{plan.stories === 1 ? 'story' : 'stories'}</span>
            </div>
            <div className="pd-stat">
              <span className="pd-stat-num">{plan.garage}</span>
              <span className="pd-stat-label">garage</span>
            </div>
          </div>

          <p className="pd-desc">{plan.description}</p>

          <div className="pd-columns">
            <div className="pd-col">
              <h4 className="pd-section-title">Room dimensions</h4>
              <table className="fp-feat-table pd-table">
                <tbody>
                  {plan.features.map(f => (
                    <tr key={f.label}>
                      <td className="fp-feat-label">{f.label}</td>
                      <td className="fp-feat-val">{f.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pd-col">
              <h4 className="pd-section-title">Included highlights</h4>
              <ul className="pd-highlights">
                {plan.highlights.map(h => (
                  <li key={h}>{h}</li>
                ))}
              </ul>

              <div className="fp-tags" style={{ marginTop: '1.2rem' }}>
                {plan.tags.map(t => (
                  <span className="fp-tag" key={t}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="pd-actions">
            <a href="#contact" className="fp-cta fp-cta-primary pd-quote-btn" onClick={onClose}>
              Get a free quote ↗
            </a>
            <button
              className="fp-cta fp-cta-secondary pd-download-btn"
              onClick={() => downloadPlanFile(plan)}
              type="button"
            >
              Floor Plan Download
            </button>
            <button className="fp-cta pd-back-btn" onClick={onClose}>
              ← Back to plans
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default function FloorPlans() {
  const [activeStyle, setActiveStyle] = useState('All styles')
  const [sort, setSort] = useState('popular')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => {
    let list = activeStyle === 'All styles'
      ? [...PLANS]
      : PLANS.filter(p => p.style === activeStyle)

    if (sort === 'popular')    list.sort((a, b) => (a.badgeType === 'popular' ? -1 : b.badgeType === 'popular' ? 1 : 0))
    if (sort === 'new')        list.sort((a, b) => (a.badgeType === 'new' ? -1 : b.badgeType === 'new' ? 1 : 0))
    if (sort === 'price-asc')  list.sort((a, b) => a.priceNum - b.priceNum)
    if (sort === 'price-desc') list.sort((a, b) => b.priceNum - a.priceNum)
    return list
  }, [activeStyle, sort])

  return (
    <>
      <section className="floor-plans">
        <div className="container">

          <div className="fp-header">
            <div>
              <p className="fp-subtitle">{filtered.length} plans available · Virginia</p>
            </div>
            <div className="fp-sort-wrap">
              <span className="fp-sort-label">Sort:</span>
              <select className="fp-sort" value={sort} onChange={e => setSort(e.target.value)}>
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="fp-filters">
            {STYLES.map(s => (
              <button
                key={s}
                className={`fp-filter-btn${activeStyle === s ? ' active' : ''}`}
                onClick={() => setActiveStyle(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="fp-grid">
            {filtered.map(plan => (
              <div className="fp-card" key={plan.id}>
                <div className={`fp-card-img ${plan.bg}`}>
                  <HouseSVG />
                  {plan.badge && (
                    <span className={`fp-badge fp-badge-${plan.badgeType}`}>{plan.badge}</span>
                  )}
                </div>

                <div className="fp-card-body">
                  <div className="fp-card-top">
                    <div>
                      <h3 className="fp-plan-name">{plan.name}</h3>
                      <p className="fp-plan-meta">
                        {plan.style} · {plan.sqft.toLocaleString()} sq ft · {plan.bed} bed · {plan.bath} bath
                      </p>
                    </div>
                    <span className="fp-plan-price">{plan.price}</span>
                  </div>

                  <table className="fp-feat-table">
                    <tbody>
                      {plan.features.slice(0, 4).map(f => (
                        <tr key={f.label}>
                          <td className="fp-feat-label">{f.label}</td>
                          <td className="fp-feat-val">{f.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="fp-tags">
                    {plan.tags.map(t => (
                      <span className="fp-tag" key={t}>{t}</span>
                    ))}
                  </div>

                  <div className="fp-card-actions">
                    <button
                      className={`fp-cta${plan.badgeType === 'popular' ? ' fp-cta-primary' : ''}`}
                      onClick={() => setSelected(plan)}
                      type="button"
                    >
                      View details ↗
                    </button>
                    <button
                      className="fp-cta fp-cta-secondary"
                      onClick={() => downloadPlanFile(plan)}
                      type="button"
                    >
                      Floor Plan Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {selected && <PlanDetail plan={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
