const VIEWBOX = '0 0 500 400'

function Preview({ id, active, children }) {
  return (
    <svg id={id} viewBox={VIEWBOX} className={active ? 'nav-pv on' : 'nav-pv'} aria-hidden="true">
      {children}
    </svg>
  )
}

/* In-house fabrication: slab with veining, for About */
function AboutPreview({ active }) {
  return (
    <Preview id="pv-about" active={active}>
      <rect className="pv pv-draw" x="80" y="120" width="340" height="180" />
      <path className="pv pv-soft pv-draw" d="M88,160 C 150,148 210,172 280,156 S 380,148 412,164" />
      <path className="pv pv-soft pv-draw" d="M96,220 C 170,208 240,232 320,214 S 390,206 410,218" />
      <path className="pv pv-soft pv-draw" d="M140,128 C 150,170 138,220 152,292" />
      <line className="pv pv-draw" x1="80" y1="330" x2="420" y2="330" />
      <line className="pv pv-draw" x1="80" y1="322" x2="80" y2="338" />
      <line className="pv pv-draw" x1="420" y1="322" x2="420" y2="338" />
    </Preview>
  )
}

/* Shaker cabinet door pair, for Services */
function ServicesPreview({ active }) {
  return (
    <Preview id="pv-services" active={active}>
      <rect className="pv pv-draw" x="120" y="80" width="120" height="240" />
      <rect className="pv pv-soft pv-draw" x="142" y="102" width="76" height="196" />
      <rect className="pv pv-draw" x="260" y="80" width="120" height="240" />
      <rect className="pv pv-soft pv-draw" x="282" y="102" width="76" height="196" />
      <line className="pv pv-draw" x1="232" y1="180" x2="232" y2="220" />
      <line className="pv pv-draw" x1="268" y1="180" x2="268" y2="220" />
      <line className="pv pv-soft pv-draw" x1="100" y1="340" x2="400" y2="340" />
    </Preview>
  )
}

/* Architectural floor plan: room outline, door swing, window */
function FloorPlansPreview({ active }) {
  return (
    <Preview id="pv-floorplans" active={active}>
      <rect className="pv pv-draw" x="90" y="90" width="320" height="220" />
      <line className="pv pv-soft pv-draw" x1="250" y1="90" x2="250" y2="310" />
      <rect className="pv pv-soft pv-draw" x="270" y="90" width="70" height="10" />
      <line className="pv pv-draw" x1="120" y1="230" x2="120" y2="310" />
      <path className="pv pv-soft pv-draw" d="M120,230 A80,80 0 0 1 200,310" />
    </Preview>
  )
}

/* Renovation: room outline with a refresh/transform arrow */
function RemodelingPreview({ active }) {
  return (
    <Preview id="pv-remodeling" active={active}>
      <rect className="pv pv-draw" x="100" y="100" width="300" height="200" />
      <path className="pv pv-soft pv-draw" d="M290,150 a55,55 0 1 1 -38,17" />
      <polyline className="pv pv-soft pv-draw" points="240,151 252,168 269,157" />
    </Preview>
  )
}

/* House facade, for Gallery */
function GalleryPreview({ active }) {
  return (
    <Preview id="pv-gallery" active={active}>
      <polyline className="pv pv-draw" points="90,320 90,190 250,110 410,190 410,320" />
      <line className="pv pv-draw" x1="60" y1="320" x2="440" y2="320" />
      <polyline className="pv pv-draw" points="70,200 250,105 430,200" />
      <rect className="pv pv-soft pv-draw" x="130" y="230" width="60" height="60" />
      <rect className="pv pv-soft pv-draw" x="310" y="230" width="60" height="60" />
      <rect className="pv pv-draw" x="225" y="240" width="50" height="80" />
      <line className="pv pv-soft pv-draw" x1="160" y1="230" x2="160" y2="290" />
      <line className="pv pv-soft pv-draw" x1="130" y1="260" x2="190" y2="260" />
      <line className="pv pv-soft pv-draw" x1="340" y1="230" x2="340" y2="290" />
      <line className="pv pv-soft pv-draw" x1="310" y1="260" x2="370" y2="260" />
    </Preview>
  )
}

/* Compass / service area, for Contact */
function ContactPreview({ active }) {
  return (
    <Preview id="pv-contact" active={active}>
      <circle className="pv pv-draw" cx="250" cy="200" r="110" />
      <circle className="pv pv-soft pv-draw" cx="250" cy="200" r="6" />
      <polyline className="pv pv-draw" points="250,110 262,188 250,200" />
      <polyline className="pv pv-soft pv-draw" points="250,290 238,212 250,200" />
      <line className="pv pv-soft pv-draw" x1="250" y1="70" x2="250" y2="90" />
      <line className="pv pv-soft pv-draw" x1="250" y1="310" x2="250" y2="330" />
      <line className="pv pv-soft pv-draw" x1="120" y1="200" x2="140" y2="200" />
      <line className="pv pv-soft pv-draw" x1="360" y1="200" x2="380" y2="200" />
    </Preview>
  )
}

/* Calendar with a confirmed check, for Book a Visit */
function SchedulePreview({ active }) {
  return (
    <Preview id="pv-schedule" active={active}>
      <rect className="pv pv-draw" x="110" y="110" width="280" height="220" rx="4" />
      <line className="pv pv-draw" x1="110" y1="160" x2="390" y2="160" />
      <line className="pv pv-soft pv-draw" x1="160" y1="90" x2="160" y2="130" />
      <line className="pv pv-soft pv-draw" x1="340" y1="90" x2="340" y2="130" />
      <polyline className="pv pv-soft pv-draw" points="200,240 235,275 300,190" />
    </Preview>
  )
}

const PREVIEW_COMPONENTS = {
  'pv-about': AboutPreview,
  'pv-services': ServicesPreview,
  'pv-floorplans': FloorPlansPreview,
  'pv-remodeling': RemodelingPreview,
  'pv-gallery': GalleryPreview,
  'pv-contact': ContactPreview,
  'pv-schedule': SchedulePreview,
}

export default function PreviewFrame({ activeId, caption }) {
  return (
    <div className="nav-preview-frame">
      {Object.entries(PREVIEW_COMPONENTS).map(([id, Component]) => (
        <Component key={id} active={activeId === id} />
      ))}
      <span className="nav-preview-caption">{caption}</span>
    </div>
  )
}
