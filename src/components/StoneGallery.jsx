import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const TYPE_COLORS = {
  granite: { bg: '#2c2c2a', fg: '#d3d1c7', pill: '#f1efe8', pillFg: '#444441' },
  quartz: { bg: '#185fa5', fg: '#e6f1fb', pill: '#e6f1fb', pillFg: '#0c447c' },
  quartzite: { bg: '#7f77dd', fg: '#eeedfe', pill: '#eeedfe', pillFg: '#3c3489' },
  marble: { bg: '#993556', fg: '#fbeaf0', pill: '#fbeaf0', pillFg: '#72243e' },
  soapstone: { bg: '#0f6e56', fg: '#e1f5ee', pill: '#e1f5ee', pillFg: '#085041' },
}

const STONES = [
  {
    name: 'Absolute Black',
    origin: 'South India',
    type: 'granite',
    image: '/Absolute_Black.jpg',
    useLabels: ['Countertop', 'Flooring', 'Accent wall'],
    desc: 'Pure jet-black with minimal variation. Mirror-like polished sheen. Pairs brilliantly with white cabinetry and brass hardware. One of the most popular choices for modern and contemporary kitchens.',
    bg: '#1e1e1e',
    speckle: [['#3a3a3a', 0.4], ['#111111', 0.3]],
    maint: 'Seal annually',
    best: 'Modern kitchens',
    dur: 'Excellent',
  },
  {
    name: 'Kashmir White',
    origin: 'Tamil Nadu, India',
    type: 'granite',
    image: '/Granite.jpg',
    useLabels: ['Countertop', 'Island', 'Vanity'],
    desc: 'Creamy white base with burgundy and garnet flecks. Versatile with both warm and cool palettes. One of the most popular granites worldwide, brightening smaller kitchens beautifully.',
    bg: '#ddd0c2',
    speckle: [['#8b4a4a', 0.25], ['#6b3a3a', 0.2], ['#555555', 0.15]],
    maint: 'Seal every 1-2 years',
    best: 'Any kitchen style',
    dur: 'Very good',
  },
  {
    name: 'Blue Pearl',
    origin: 'Norway',
    type: 'granite',
    image: '/Granite.jpg',
    useLabels: ['Statement countertop', 'Floor', 'Feature wall'],
    desc: 'Dark blue-gray with iridescent labradorescence. Each slab is completely unique. The shimmer changes dramatically with light direction, making it a bold designer choice for bathrooms and statement kitchens.',
    bg: '#1e2a3a',
    speckle: [['#4a6a8a', 0.4], ['#6a8aaa', 0.3], ['#8aaacc', 0.2]],
    maint: 'Seal annually',
    best: 'Statement surfaces',
    dur: 'Excellent',
  },
  {
    name: 'Santa Cecilia',
    origin: 'Brazil',
    type: 'granite',
    image: '/Granite.jpg',
    useLabels: ['Countertop', 'Floor tile', 'Backsplash pairing'],
    desc: 'Warm gold and cream background with dark brown and black flecks. Highly consistent patterning slab-to-slab. Ideal for traditional and transitional kitchen styles and hides everyday wear well.',
    bg: '#c9a96e',
    speckle: [['#3a2a1a', 0.35], ['#5a4a2a', 0.3], ['#1a1a0a', 0.2]],
    maint: 'Seal every 2 years',
    best: 'Traditional kitchens',
    dur: 'Very good',
  },
  {
    name: 'Ubatuba',
    origin: 'Brazil',
    type: 'granite',
    image: '/Granite.jpg',
    useLabels: ['Countertop', 'Outdoor kitchen', 'Flooring'],
    desc: 'Deep forest-green to near-black with gold and green mineral flecks. Extremely durable and frost-resistant, which makes it excellent for outdoor use and rustic homes.',
    bg: '#1a2a1a',
    speckle: [['#4a6a2a', 0.4], ['#c8a020', 0.25], ['#2a4a1a', 0.3]],
    maint: 'Seal annually',
    best: 'Outdoor and rustic spaces',
    dur: 'Excellent',
  },
  {
    name: 'Tan Brown',
    origin: 'India',
    type: 'granite',
    image: '/Granite.jpg',
    useLabels: ['Countertop', 'Floor', 'Vanity'],
    desc: 'Rich reddish-brown with black and gray mineral patterns. Warm and earthy, with consistent slab-to-slab movement that simplifies larger multi-slab projects.',
    bg: '#5a3020',
    speckle: [['#8a5040', 0.4], ['#1a1010', 0.35], ['#6a4030', 0.3]],
    maint: 'Seal every 1-2 years',
    best: 'Warm interiors',
    dur: 'Very good',
  },
  {
    name: 'Bianco Romano',
    origin: 'Brazil',
    type: 'granite',
    image: '/Granite.jpg',
    useLabels: ['Countertop', 'Backsplash', 'Vanity'],
    desc: 'White base with dramatic gray veining and subtle movement. It evokes marble with less upkeep and remains a favorite for bright, editorial kitchen spaces.',
    bg: '#e8e8e6',
    speckle: [['#7a7a7a', 0.4], ['#5a5a5a', 0.25], ['#9a9a9a', 0.2]],
    maint: 'Seal every 1-2 years',
    best: 'Marble-look kitchens',
    dur: 'Excellent',
  },
  {
    name: 'Jet Mist',
    origin: 'Canada',
    type: 'granite',
    image: '/Granite.jpg',
    useLabels: ['Patio', 'Stepping stone', 'Feature floor'],
    desc: 'Dark charcoal with subtle silver and white flecking. Extremely frost-resistant and especially effective for outdoor paths, pool surrounds, and northern climates.',
    bg: '#2a2a2e',
    speckle: [['#aaaaaa', 0.3], ['#cccccc', 0.2], ['#7a7a8a', 0.25]],
    maint: 'Seal every 2 years',
    best: 'Outdoor cold-climate use',
    dur: 'Outstanding',
  },
  {
    name: 'Calacatta Quartz',
    origin: 'Engineered',
    type: 'quartz',
    image: '/quartzite.jpg',
    useLabels: ['Countertop', 'Island', 'Vanity'],
    desc: 'White background with bold gray and gold veining. Engineered for consistency across slabs and a non-porous, low-maintenance surface for busy family kitchens.',
    bg: '#f0ede8',
    speckle: [['#c8b090', 0.2], ['#9a9a9a', 0.3], ['#d4b878', 0.15]],
    maint: 'None required',
    best: 'Busy kitchens',
    dur: 'Excellent',
  },
  {
    name: 'Silestone Eternal Noir',
    origin: 'Engineered (Spain)',
    type: 'quartz',
    image: '/quartzite.jpg',
    useLabels: ['Countertop', 'Feature island', 'Vanity'],
    desc: 'Dramatic black with fine white veining. The uniform appearance and high stain resistance make it a strong fit for luxury kitchens without ongoing sealing.',
    bg: '#1a1a1e',
    speckle: [['#eeeeee', 0.25], ['#cccccc', 0.15], ['#aaaaaa', 0.1]],
    maint: 'None required',
    best: 'Luxury kitchens',
    dur: 'Outstanding',
  },
  {
    name: 'Caesarstone Statuario',
    origin: 'Engineered (Israel)',
    type: 'quartz',
    image: '/quartzite.jpg',
    useLabels: ['Countertop', 'Bathroom wall', 'Island'],
    desc: 'Bright white with subtle gray movement. Its clean consistency makes it well suited to minimalist and Scandinavian interiors with easy day-to-day care.',
    bg: '#ececec',
    speckle: [['#b0b0b0', 0.25], ['#888888', 0.15], ['#d0d0d0', 0.2]],
    maint: 'None required',
    best: 'Minimalist interiors',
    dur: 'Excellent',
  },
  {
    name: 'Super White Quartzite',
    origin: 'Brazil',
    type: 'quartzite',
    image: '/quartzite.jpg',
    useLabels: ['Countertop', 'Feature wall', 'Floor'],
    desc: 'White with subtle gray-blue veining. Often mistaken for marble, but more durable and better suited for large-format feature walls and heavy-use spaces.',
    bg: '#e8eaec',
    speckle: [['#a0b0c0', 0.3], ['#808898', 0.2], ['#c0c8d0', 0.25]],
    maint: 'Seal every 1-2 years',
    best: 'Feature walls and floors',
    dur: 'Very good',
  },
  {
    name: 'Taj Mahal Quartzite',
    origin: 'Brazil',
    type: 'quartzite',
    image: '/quartzite.jpg',
    useLabels: ['Countertop', 'Vanity', 'Feature wall'],
    desc: 'Creamy white-gold base with soft gray veining. Warmer and richer than typical white stones, with strong heat resistance near cooktops and outdoor kitchens.',
    bg: '#d8c8a8',
    speckle: [['#8a7a5a', 0.3], ['#c0a870', 0.2], ['#6a5a40', 0.2]],
    maint: 'Seal every 1-2 years',
    best: 'Warm-toned kitchens',
    dur: 'Very good',
  },
  {
    name: 'Sea Pearl Quartzite',
    origin: 'Brazil',
    type: 'quartzite',
    image: '/quartzite.jpg',
    useLabels: ['Feature countertop', 'Vanity', 'Island'],
    desc: 'Dark green-gray with silver and white movement. It is one of the most dramatic natural stones on the market and works best when the slab is allowed to take visual priority.',
    bg: '#2a3830',
    speckle: [['#aaaabb', 0.35], ['#8a9898', 0.3], ['#d0d8d0', 0.2]],
    maint: 'Seal every 1-2 years',
    best: 'Statement interiors',
    dur: 'Very good',
  },
  {
    name: 'Calacatta Marble',
    origin: 'Carrara, Italy',
    type: 'marble',
    image: '/marble.jpg',
    useLabels: ['Countertop', 'Floor', 'Feature wall'],
    desc: 'The iconic white marble with bold gold and gray veining. Prestigious and timeless, though better reserved for lower-traffic applications that justify the upkeep.',
    bg: '#f2eeea',
    speckle: [['#c8b890', 0.2], ['#9a9898', 0.3], ['#d0c8b8', 0.15]],
    maint: 'Seal every 6 months',
    best: 'Feature and low-traffic use',
    dur: 'Moderate',
  },
  {
    name: 'Nero Marquina',
    origin: 'Basque Country, Spain',
    type: 'marble',
    image: '/marble.jpg',
    useLabels: ['Floor tile', 'Vanity', 'Accent'],
    desc: 'Jet black with bright white veining. One of the most dramatic marbles available, and most effective in bathrooms or smaller accent applications.',
    bg: '#1a1a1a',
    speckle: [['#eeeeee', 0.3], ['#cccccc', 0.2], ['#ffffff', 0.15]],
    maint: 'Seal every 6 months',
    best: 'Bathrooms and accents',
    dur: 'Moderate',
  },
  {
    name: 'Emperador Dark',
    origin: 'Spain',
    type: 'marble',
    image: '/marble.jpg',
    useLabels: ['Floor', 'Vanity', 'Feature wall'],
    desc: 'Rich chocolate-brown with cream and white veining. It brings warmth and hospitality, especially in luxury bathrooms and reception-style interiors.',
    bg: '#3a2218',
    speckle: [['#d0b898', 0.3], ['#c8a878', 0.25], ['#e8d0b0', 0.2]],
    maint: 'Seal every 6 months',
    best: 'Luxury bathrooms',
    dur: 'Moderate',
  },
  {
    name: 'Arabescato Marble',
    origin: 'Italy',
    type: 'marble',
    image: '/marble.jpg',
    useLabels: ['Countertop', 'Backsplash', 'Floor'],
    desc: 'White base with intricate gray arabesque veining. Finer and more ornate than Calacatta, with a strong fit for classical, Mediterranean, and traditional interiors.',
    bg: '#ebebeb',
    speckle: [['#888888', 0.35], ['#606060', 0.2], ['#aaaaaa', 0.25]],
    maint: 'Seal every 6 months',
    best: 'Classical interiors',
    dur: 'Moderate',
  },
  {
    name: 'Classic Soapstone',
    origin: 'Brazil / Virginia, USA',
    type: 'soapstone',
    image: '/soapstone.jpg',
    useLabels: ['Countertop', 'Sink surround', 'Outdoor use'],
    desc: 'Gray to charcoal with subtle veining. Naturally non-porous, heat-resistant, and capable of developing a rich farmhouse-style patina over time.',
    bg: '#3a3c40',
    speckle: [['#6a6c70', 0.3], ['#8a8c90', 0.2], ['#505258', 0.35]],
    maint: 'Oil periodically',
    best: 'Farmhouse kitchens',
    dur: 'Very good',
  },
  {
    name: 'Green Soapstone',
    origin: 'India',
    type: 'soapstone',
    image: '/soapstone.jpg',
    useLabels: ['Countertop', 'Outdoor kitchen', 'Bar top'],
    desc: 'Deep olive-green with dark mineral veining. Rarer and more expressive than gray soapstone, with a patina that deepens with regular oiling.',
    bg: '#2a3828',
    speckle: [['#4a5a48', 0.35], ['#6a7a68', 0.25], ['#3a4838', 0.3]],
    maint: 'Oil periodically',
    best: 'Statement kitchens',
    dur: 'Very good',
  },
  {
    name: 'Santa Rita Soapstone',
    origin: 'Brazil',
    type: 'soapstone',
    image: '/soapstone.jpg',
    useLabels: ['Countertop', 'Vanity', 'Feature wall'],
    desc: 'Lighter gray with delicate white movement. It is the most marble-like of the soapstones, with a soft, velvety finish that deepens beautifully over time.',
    bg: '#9a9c9e',
    speckle: [['#d0d2d4', 0.3], ['#b8babb', 0.25], ['#7a7c7e', 0.25]],
    maint: 'Oil periodically',
    best: 'Transitional bathrooms',
    dur: 'Good',
  },
]

const TYPES = [
  ['all', 'All types'],
  ['granite', 'Granite'],
  ['quartz', 'Quartz'],
  ['quartzite', 'Quartzite'],
  ['marble', 'Marble'],
  ['soapstone', 'Soapstone'],
]

const STONES_PER_PAGE = 8

function drawSwatch(canvas, stone, height) {
  if (!canvas) {
    return
  }

  const context = canvas.getContext('2d')
  const width = canvas.clientWidth || canvas.offsetWidth || 500
  canvas.width = width
  canvas.height = height

  context.fillStyle = stone.bg
  context.fillRect(0, 0, width, height)

  for (const [color, density] of stone.speckle || []) {
    context.fillStyle = color
    const dotCount = Math.max(24, Math.round(width * height * density * 0.015))

    for (let index = 0; index < dotCount; index += 1) {
      const x = Math.random() * width
      const y = Math.random() * height
      const radius = Math.random() * 2.4 + 0.5
      context.beginPath()
      context.arc(x, y, radius, 0, Math.PI * 2)
      context.fill()
    }

    for (let index = 0; index < 10; index += 1) {
      const startX = Math.random() * width
      const startY = Math.random() * height
      context.strokeStyle = `${color}55`
      context.lineWidth = Math.random() * 1.6 + 0.3
      context.beginPath()
      context.moveTo(startX, startY)
      context.bezierCurveTo(
        startX + Math.random() * 100 - 50,
        startY + Math.random() * 50 - 25,
        startX + Math.random() * 100 - 50,
        startY + Math.random() * 50 - 25,
        startX + Math.random() * 130 - 65,
        startY + Math.random() * 90 - 45,
      )
      context.stroke()
    }
  }
}

function formatType(type) {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

function StoneVisual({ stone, className, canvasRef, height, alt }) {
  if (stone.image) {
    return <img src={stone.image} alt={alt} className={className} />
  }

  return <canvas ref={canvasRef} className={className} style={{ height }} />
}

export default function StoneGallery() {
  const [activeType, setActiveType] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedStone, setSelectedStone] = useState(null)
  const cardCanvasRefs = useRef(new Map())
  const modalCanvasRef = useRef(null)

  const visibleStones = useMemo(() => {
    if (activeType === 'all') {
      return STONES
    }

    return STONES.filter((stone) => stone.type === activeType)
  }, [activeType])

  const shouldPaginate = activeType !== 'all'

  const pageCount = shouldPaginate ? Math.ceil(visibleStones.length / STONES_PER_PAGE) : 1

  const paginatedStones = useMemo(() => {
    if (!shouldPaginate) {
      return visibleStones
    }

    const startIndex = (currentPage - 1) * STONES_PER_PAGE
    return visibleStones.slice(startIndex, startIndex + STONES_PER_PAGE)
  }, [currentPage, shouldPaginate, visibleStones])

  useEffect(() => {
    setCurrentPage(1)
  }, [activeType])

  useEffect(() => {
    if (currentPage > pageCount) {
      setCurrentPage(Math.max(1, pageCount))
    }
  }, [currentPage, pageCount])

  useEffect(() => {
    paginatedStones.forEach((stone) => {
      const canvas = cardCanvasRefs.current.get(stone.name)
      drawSwatch(canvas, stone, 110)
    })
  }, [paginatedStones])

  useEffect(() => {
    if (!selectedStone) {
      return undefined
    }

    drawSwatch(modalCanvasRef.current, selectedStone, 250)

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedStone(null)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedStone])

  return (
    <section className="stone-gallery-section" id="stone-gallery">
      <div className="container">
        <div className="stone-gallery-shell">
          <div className="stone-gallery-copy">
            <p className="section-label">Material Explorer</p>
            <h2 className="section-title">Natural stone inspiration for kitchens, baths, and statement surfaces.</h2>
            <p className="stone-gallery-intro">
              Filter by material family, inspect the movement, and open any surface for a closer look at origin,
              maintenance, durability, and best-fit applications.
            </p>
          </div>

          <div className="stone-gallery-filter-label">Stone type</div>
          <div className="stone-gallery-chips" role="tablist" aria-label="Stone type filters">
            {TYPES.map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`stone-gallery-chip${activeType === value ? ' is-active' : ''}`}
                onClick={() => setActiveType(value)}
                aria-pressed={activeType === value}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="stone-gallery-divider" />

          <div className="stone-gallery-grid">
            {paginatedStones.map((stone) => {
              const typeColors = TYPE_COLORS[stone.type]

              return (
                <button
                  key={stone.name}
                  type="button"
                  className="stone-gallery-card"
                  onClick={() => setSelectedStone(stone)}
                >
                  <StoneVisual
                    stone={stone}
                    alt={stone.name}
                    className="stone-gallery-swatch"
                    height={110}
                    canvasRef={(node) => {
                      if (node) {
                        cardCanvasRefs.current.set(stone.name, node)
                      } else {
                        cardCanvasRefs.current.delete(stone.name)
                      }
                    }}
                  />
                  <span className="stone-gallery-card-body">
                    <span className="stone-gallery-card-name">{stone.name}</span>
                    <span className="stone-gallery-card-origin">{stone.origin}</span>
                    <span
                      className="stone-gallery-card-type"
                      style={{ backgroundColor: typeColors.pill, color: typeColors.pillFg }}
                    >
                      {formatType(stone.type)}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>

          {shouldPaginate && pageCount > 1 && (
            <div className="pw-pagination" aria-label="Stone gallery pagination">
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

          <div className="stone-gallery-cta">
            <div>
              <p className="stone-gallery-cta-label">Need help choosing?</p>
              <h3>Bring your favorite surfaces into a design consultation.</h3>
            </div>
            <Link to="/schedule" className="btn btn-fill">Schedule consultation</Link>
          </div>
        </div>
      </div>

      {selectedStone && (
        <div
          className="stone-gallery-modal-overlay"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedStone(null)
            }
          }}
        >
          <div className="stone-gallery-modal" role="dialog" aria-modal="true" aria-labelledby="stone-gallery-modal-title">
            <StoneVisual
              stone={selectedStone}
              alt={selectedStone.name}
              className="stone-gallery-modal-swatch"
              height={250}
              canvasRef={modalCanvasRef}
            />
            <div className="stone-gallery-modal-body">
              <div className="stone-gallery-modal-header">
                <div>
                  <p className="stone-gallery-modal-title" id="stone-gallery-modal-title">{selectedStone.name}</p>
                  <p className="stone-gallery-modal-origin">{selectedStone.origin}</p>
                </div>
                <button
                  type="button"
                  className="stone-gallery-modal-close"
                  onClick={() => setSelectedStone(null)}
                  aria-label="Close stone details"
                >
                  x
                </button>
              </div>

              <span
                className="stone-gallery-modal-badge"
                style={{
                  backgroundColor: TYPE_COLORS[selectedStone.type].bg,
                  color: TYPE_COLORS[selectedStone.type].fg,
                }}
              >
                {formatType(selectedStone.type)}
              </span>

              <p className="stone-gallery-modal-desc">{selectedStone.desc}</p>

              <div className="stone-gallery-modal-grid">
                <div className="stone-gallery-info-cell">
                  <p className="stone-gallery-info-label">Type</p>
                  <p className="stone-gallery-info-value">{formatType(selectedStone.type)}</p>
                </div>
                <div className="stone-gallery-info-cell">
                  <p className="stone-gallery-info-label">Maintenance</p>
                  <p className="stone-gallery-info-value">{selectedStone.maint}</p>
                </div>
                <div className="stone-gallery-info-cell">
                  <p className="stone-gallery-info-label">Best for</p>
                  <p className="stone-gallery-info-value">{selectedStone.best}</p>
                </div>
                <div className="stone-gallery-info-cell">
                  <p className="stone-gallery-info-label">Durability</p>
                  <p className="stone-gallery-info-value">{selectedStone.dur}</p>
                </div>
              </div>

              <div className="stone-gallery-uses">
                {selectedStone.useLabels.map((label) => (
                  <span key={label} className="stone-gallery-use-chip">{label}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}