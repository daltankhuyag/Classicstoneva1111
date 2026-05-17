import { useState, useMemo, useEffect } from 'react'

const PLAN_PDF_MARGIN = 42
const PLAN_PDF_TEXT = [30, 40, 48]
const PLAN_PDF_MUTED = [108, 117, 125]
const PLAN_PDF_COPPER = [181, 98, 30]
const PLAN_PDF_SOFT = [247, 243, 238]
const PLAN_PDF_BORDER = [226, 218, 208]

function loadPlanImageForPdf(plan) {
  if (!plan.image) {
    return Promise.resolve(null)
  }

  return new Promise((resolve) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.decoding = 'async'

    image.onload = () => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d', { alpha: false })

      if (!context) {
        resolve(null)
        return
      }

      const maxWidth = 1800
      const scale = Math.min(1, maxWidth / image.naturalWidth)
      canvas.width = Math.round(image.naturalWidth * scale)
      canvas.height = Math.round(image.naturalHeight * scale)

      context.fillStyle = '#ffffff'
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, canvas.width, canvas.height)

      resolve({
        dataUrl: canvas.toDataURL('image/jpeg', 0.96),
        width: canvas.width,
        height: canvas.height,
      })
    }

    image.onerror = () => resolve(null)
    image.src = plan.image
  })
}

function addPdfFooter(pdf, plan) {
  const pageCount = pdf.getNumberOfPages()

  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
    pdf.setPage(pageNumber)
    pdf.setDrawColor(...PLAN_PDF_BORDER)
    pdf.line(PLAN_PDF_MARGIN, 748, 612 - PLAN_PDF_MARGIN, 748)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    pdf.setTextColor(...PLAN_PDF_MUTED)
    pdf.text(plan.name, PLAN_PDF_MARGIN, 765)
    pdf.text(`Page ${pageNumber} of ${pageCount}`, 612 - PLAN_PDF_MARGIN, 765, { align: 'right' })
  }
}

async function downloadPlanFile(plan) {
  const { jsPDF } = await import('jspdf')

  const fileName = `${plan.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-floor-plan.pdf`
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
    compress: true,
  })
  const imageData = await loadPlanImageForPdf(plan)
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const contentWidth = pageWidth - PLAN_PDF_MARGIN * 2
  let cursorY = PLAN_PDF_MARGIN

  const ensureSpace = (requiredHeight = 24) => {
    if (cursorY + requiredHeight <= pageHeight - PLAN_PDF_MARGIN - 28) {
      return
    }

    pdf.addPage('letter', 'portrait')
    cursorY = PLAN_PDF_MARGIN
  }

  const writeParagraph = (text, options = {}) => {
    const {
      fontSize = 11,
      lineHeight = 16,
      color = PLAN_PDF_TEXT,
      fontStyle = 'normal',
      spacingAfter = 12,
      x = PLAN_PDF_MARGIN,
      width = contentWidth,
    } = options

    pdf.setFont('helvetica', fontStyle)
    pdf.setFontSize(fontSize)
    pdf.setTextColor(...color)

    const lines = pdf.splitTextToSize(text, width)
    ensureSpace(lines.length * lineHeight + spacingAfter)
    pdf.text(lines, x, cursorY)
    cursorY += lines.length * lineHeight + spacingAfter
  }

  const drawPills = (items, options = {}) => {
    const {
      x = PLAN_PDF_MARGIN,
      width = contentWidth,
      fill = [255, 255, 255],
      textColor = PLAN_PDF_TEXT,
      borderColor = PLAN_PDF_BORDER,
    } = options

    let currentX = x
    let currentY = cursorY
    const bottomLimit = pageHeight - PLAN_PDF_MARGIN - 28

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(10)

    items.forEach((item) => {
      const pillWidth = pdf.getTextWidth(item) + 24
      const pillHeight = 22

      if (currentX + pillWidth > x + width) {
        currentX = x
        currentY += 30
      }

      if (currentY + pillHeight > bottomLimit) {
        pdf.addPage('letter', 'portrait')
        currentX = x
        currentY = PLAN_PDF_MARGIN
      }

      pdf.setFillColor(...fill)
      pdf.setDrawColor(...borderColor)
      pdf.roundedRect(currentX, currentY, pillWidth, pillHeight, 11, 11, 'FD')
      pdf.setTextColor(...textColor)
      pdf.text(item, currentX + 12, currentY + 14)
      currentX += pillWidth + 8
    })

    cursorY = currentY + 34
  }

  pdf.setFillColor(248, 244, 239)
  pdf.rect(0, 0, pageWidth, 120, 'F')

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(10)
  pdf.setTextColor(...PLAN_PDF_COPPER)
  pdf.text(plan.style.toUpperCase(), PLAN_PDF_MARGIN, cursorY)

  if (plan.badge) {
    const badgeWidth = pdf.getTextWidth(plan.badge) + 20
    pdf.setFillColor(...PLAN_PDF_COPPER)
    pdf.roundedRect(pageWidth - PLAN_PDF_MARGIN - badgeWidth, cursorY - 11, badgeWidth, 18, 9, 9, 'F')
    pdf.setFontSize(9)
    pdf.setTextColor(255, 255, 255)
    pdf.text(plan.badge, pageWidth - PLAN_PDF_MARGIN - badgeWidth / 2, cursorY + 1, { align: 'center' })
    pdf.setFontSize(10)
  }

  cursorY += 24
  pdf.setFont('times', 'bold')
  pdf.setFontSize(28)
  pdf.setTextColor(...PLAN_PDF_TEXT)
  const titleLines = pdf.splitTextToSize(plan.name, contentWidth)
  pdf.text(titleLines, PLAN_PDF_MARGIN, cursorY)
  cursorY += titleLines.length * 30

  writeParagraph(
    `${plan.sqft.toLocaleString()} sq ft · ${plan.bed} bedrooms · ${plan.bath} bathrooms · ${plan.stories} ${plan.stories === 1 ? 'story' : 'stories'} · ${plan.garage} garage`,
    { fontSize: 11, color: PLAN_PDF_MUTED, spacingAfter: 18 }
  )

  if (imageData) {
    const heroHeight = Math.min(240, (imageData.height * contentWidth) / imageData.width)
    ensureSpace(heroHeight + 18)
    pdf.addImage(imageData.dataUrl, 'JPEG', PLAN_PDF_MARGIN, cursorY, contentWidth, heroHeight, undefined, 'MEDIUM')
    cursorY += heroHeight + 18
  }

  const statGap = 8
  const statWidth = (contentWidth - statGap * 4) / 5
  const statHeight = 52
  const stats = [
    { label: 'SQ FT', value: plan.sqft.toLocaleString() },
    { label: 'BEDS', value: String(plan.bed) },
    { label: 'BATHS', value: String(plan.bath) },
    { label: 'STORIES', value: String(plan.stories) },
    { label: 'GARAGE', value: plan.garage },
  ]

  ensureSpace(statHeight + 20)
  stats.forEach((stat, index) => {
    const x = PLAN_PDF_MARGIN + index * (statWidth + statGap)
    pdf.setFillColor(...PLAN_PDF_SOFT)
    pdf.setDrawColor(...PLAN_PDF_BORDER)
    pdf.roundedRect(x, cursorY, statWidth, statHeight, 10, 10, 'FD')
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(13)
    pdf.setTextColor(...PLAN_PDF_COPPER)
    pdf.text(stat.value, x + statWidth / 2, cursorY + 22, { align: 'center' })
    pdf.setFontSize(8)
    pdf.setTextColor(...PLAN_PDF_MUTED)
    pdf.text(stat.label, x + statWidth / 2, cursorY + 38, { align: 'center' })
  })
  cursorY += statHeight + 20

  writeParagraph('Overview', { fontSize: 15, fontStyle: 'bold', spacingAfter: 10 })
  writeParagraph(plan.description, { fontSize: 11, lineHeight: 17, spacingAfter: 16 })
  writeParagraph('Plan tags', { fontSize: 15, fontStyle: 'bold', spacingAfter: 10 })
  drawPills(plan.tags)
  writeParagraph('Quick highlights', { fontSize: 15, fontStyle: 'bold', spacingAfter: 10 })
  drawPills([
    plan.stories === 1 ? 'Single-story option' : `${plan.stories}-story layout`,
    `${plan.garage} garage`,
    ...plan.highlights.slice(0, 3),
  ], {
    fill: PLAN_PDF_SOFT,
    textColor: PLAN_PDF_COPPER,
  })

  pdf.addPage('letter', 'portrait')
  cursorY = PLAN_PDF_MARGIN

  pdf.setFont('times', 'bold')
  pdf.setFontSize(22)
  pdf.setTextColor(...PLAN_PDF_TEXT)
  pdf.text('Room Dimensions & Features', PLAN_PDF_MARGIN, cursorY)
  cursorY += 26

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(11)
  pdf.setTextColor(...PLAN_PDF_MUTED)
  pdf.text('A clean printable summary of the selected floor plan.', PLAN_PDF_MARGIN, cursorY)
  cursorY += 24

  const columnGap = 20
  const columnWidth = (contentWidth - columnGap) / 2
  let leftY = cursorY
  let rightY = cursorY

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(13)
  pdf.setTextColor(...PLAN_PDF_TEXT)
  pdf.text('Room dimensions', PLAN_PDF_MARGIN, leftY)
  leftY += 14

  plan.features.forEach((feature, index) => {
    const rowY = leftY + index * 30
    pdf.setFillColor(index % 2 === 0 ? 255 : 250, index % 2 === 0 ? 255 : 250, index % 2 === 0 ? 255 : 250)
    pdf.setDrawColor(...PLAN_PDF_BORDER)
    pdf.roundedRect(PLAN_PDF_MARGIN, rowY, columnWidth, 24, 8, 8, 'FD')
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    pdf.setTextColor(...PLAN_PDF_TEXT)
    pdf.text(feature.label, PLAN_PDF_MARGIN + 10, rowY + 15)
    pdf.setFont('helvetica', 'bold')
    pdf.text(feature.value, PLAN_PDF_MARGIN + columnWidth - 10, rowY + 15, { align: 'right' })
  })
  leftY += plan.features.length * 30 + 20

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(13)
  pdf.setTextColor(...PLAN_PDF_TEXT)
  pdf.text('Included highlights', PLAN_PDF_MARGIN + columnWidth + columnGap, rightY)
  rightY += 18

  plan.highlights.forEach((highlight) => {
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10.5)
    pdf.setTextColor(...PLAN_PDF_TEXT)
    const lines = pdf.splitTextToSize(`• ${highlight}`, columnWidth - 12)
    pdf.text(lines, PLAN_PDF_MARGIN + columnWidth + columnGap, rightY)
    rightY += lines.length * 15 + 8
  })

  rightY += 10
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(13)
  pdf.text('Plan tags', PLAN_PDF_MARGIN + columnWidth + columnGap, rightY)
  cursorY = rightY + 12
  drawPills(plan.tags, {
    x: PLAN_PDF_MARGIN + columnWidth + columnGap,
    width: columnWidth,
    fill: [255, 255, 255],
  })

  const nextSectionY = Math.max(leftY, cursorY) + 4
  cursorY = nextSectionY
  writeParagraph('Plan summary', { fontSize: 13, fontStyle: 'bold', spacingAfter: 8 })
  writeParagraph(
    `${plan.name} blends ${plan.style.toLowerCase()} character with a practical layout for modern living. This PDF preserves text as selectable PDF content for crisp viewing and printing.`,
    { fontSize: 10.5, lineHeight: 16, color: PLAN_PDF_MUTED, spacingAfter: 0 }
  )

  addPdfFooter(pdf, plan)
  pdf.save(fileName)
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
    image: '/HERO_IMAGE.png',
    imageAlt: 'Craftsman house rendering with bright exterior lighting',
    imagePosition: 'center 55%',
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
    image: '/HERO_IMAGE.png',
    imageAlt: 'Farmhouse-style exterior rendering in a snowy landscape',
    imagePosition: 'center 52%',
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
    image: '/HERO_IMAGE.png',
    imageAlt: 'Colonial-inspired home exterior concept render',
    imagePosition: 'center 48%',
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
    image: '/HERO_IMAGE.png',
    imageAlt: 'Contemporary house render with tall windows',
    imagePosition: 'center 42%',
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
    image: '/HERO_IMAGE.png',
    imageAlt: 'Craftsman-inspired house artwork for floor plan presentation',
    imagePosition: 'center 58%',
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
    image: '/HERO_IMAGE.png',
    imageAlt: 'Farmhouse exterior render used for floor plan artwork',
    imagePosition: 'center 50%',
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

function PlanArtwork({ plan, className, large = false }) {
  if (plan.image) {
    return (
      <img
        src={plan.image}
        alt={plan.imageAlt || `${plan.name} exterior rendering`}
        className={className}
        style={{ objectPosition: plan.imagePosition || 'center' }}
      />
    )
  }

  return <HouseSVG large={large} />
}

function buildPlanSlides(plan) {
  return [
    {
      id: 'overview',
      title: `${plan.style} overview`,
      subtitle: `${plan.sqft.toLocaleString()} sq ft · ${plan.bed} bed · ${plan.bath} bath`,
      type: 'visual',
    },
    {
      id: 'dimensions',
      title: 'Key room sizes',
      subtitle: 'Core spaces at a glance',
      type: 'dimensions',
      items: plan.features.slice(0, 4),
    },
    {
      id: 'highlights',
      title: 'Included highlights',
      subtitle: 'Features homeowners ask for most',
      type: 'highlights',
      items: plan.highlights.slice(0, 5),
    },
  ]
}

function PlanDetail({ plan, onClose }) {
  const slides = useMemo(() => buildPlanSlides(plan), [plan])
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  useEffect(() => {
    setActiveSlide(0)
  }, [plan])

  const currentSlide = slides[activeSlide]

  const goToPreviousSlide = () => {
    setActiveSlide(index => (index === 0 ? slides.length - 1 : index - 1))
  }

  const goToNextSlide = () => {
    setActiveSlide(index => (index === slides.length - 1 ? 0 : index + 1))
  }

  return (
    <div className="pd-overlay" onClick={onClose}>
      <div className="pd-modal" onClick={e => e.stopPropagation()}>

        <div className={`pd-hero ${plan.bg}`}>
          <PlanArtwork plan={plan} className="pd-plan-image" large />
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
          </div>

          <div className="pd-gallery" aria-label="Floor plan gallery slider">
            <div className="pd-gallery-head">
              <div>
                <p className="pd-gallery-title">{currentSlide.title}</p>
                <p className="pd-gallery-subtitle">{currentSlide.subtitle}</p>
              </div>
              <div className="pd-gallery-controls">
                <button type="button" className="pd-gallery-btn" onClick={goToPreviousSlide} aria-label="Previous gallery slide">
                  Prev
                </button>
                <button type="button" className="pd-gallery-btn" onClick={goToNextSlide} aria-label="Next gallery slide">
                  Next
                </button>
              </div>
            </div>

            <div className={`pd-gallery-frame ${plan.bg}`}>
              {currentSlide.type === 'visual' && (
                <div className="pd-gallery-visual">
                  <PlanArtwork plan={plan} className="pd-gallery-plan-image" large />
                  <div className="pd-gallery-visual-copy">
                    <span>{plan.stories === 1 ? 'Single-story option' : `${plan.stories}-story layout`}</span>
                    <span>{plan.garage} garage</span>
                  </div>
                </div>
              )}

              {currentSlide.type === 'dimensions' && (
                <div className="pd-gallery-dimensions">
                  {currentSlide.items.map(item => (
                    <div key={item.label} className="pd-gallery-dimension-card">
                      <span className="pd-gallery-dimension-label">{item.label}</span>
                      <span className="pd-gallery-dimension-value">{item.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {currentSlide.type === 'highlights' && (
                <div className="pd-gallery-highlights">
                  {currentSlide.items.map(item => (
                    <span key={item} className="pd-gallery-highlight-chip">{item}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="pd-gallery-dots" aria-label="Gallery slide pagination">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  className={`pd-gallery-dot${activeSlide === index ? ' active' : ''}`}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`View ${slide.title}`}
                  aria-current={activeSlide === index ? 'true' : undefined}
                />
              ))}
            </div>
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
                  <PlanArtwork plan={plan} className="fp-plan-image" />
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
                    <a href="#contact" className="fp-price-link">
                      Contact for price
                    </a>
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
