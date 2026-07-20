import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Seo from '../components/Seo'
import {
  DEFAULT_FINISH,
  getDoorStyleById,
  getFinishSectionsForDoorStyle,
  getFinishesForDoorStyle,
} from '../data/fabuwoodDoorStyles'

const CABINET_PDF_MARGIN = 44
const CABINET_PDF_TEXT = [37, 34, 29]
const CABINET_PDF_MUTED = [122, 115, 103]
const CABINET_PDF_COPPER = [181, 98, 30]

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function buildCabinetFinishVisual(style, finish) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    return null
  }

  canvas.width = 1200
  canvas.height = 1200

  context.fillStyle = '#f6f2eb'
  context.fillRect(0, 0, canvas.width, canvas.height)

  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height)
  gradient.addColorStop(0, finish.door)
  gradient.addColorStop(1, finish.doorDark)
  context.fillStyle = gradient
  context.fillRect(180, 120, 840, 960)

  context.strokeStyle = finish.edge || 'rgba(0,0,0,.14)'
  context.lineWidth = 10
  context.strokeRect(180, 120, 840, 960)

  if (!style.variant.includes('fds-slab')) {
    context.fillStyle = finish.doorDark
    context.fillRect(300, 240, 600, 720)
    context.strokeStyle = finish.edge || 'rgba(0,0,0,.14)'
    context.lineWidth = 8
    context.strokeRect(300, 240, 600, 720)

    if (style.variant.includes('fds-edge-detail')) {
      context.strokeStyle = 'rgba(255,255,255,0.28)'
      context.lineWidth = 14
      context.strokeRect(282, 222, 636, 756)
    }
  }

  context.fillStyle = '#6f6559'
  context.beginPath()
  context.roundRect(930, 470, 22, 240, 999)
  context.fill()

  return {
    dataUrl: canvas.toDataURL('image/jpeg', 0.95),
    width: canvas.width,
    height: canvas.height,
  }
}

function loadImageForPdf(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.decoding = 'async'
    image.onload = () => resolve({ dataUrl: src, width: image.naturalWidth || 1200, height: image.naturalHeight || 1200 })
    image.onerror = reject
    image.src = src
  })
}

async function downloadCabinetSpec(style, finish, finishType) {
  const [{ jsPDF }, previewImage] = await Promise.all([
    import('jspdf'),
    finish.media?.image ? loadImageForPdf(finish.media.image) : Promise.resolve(buildCabinetFinishVisual(style, finish)),
  ])

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
    compress: true,
  })

  const fileName = `${slugify(style.name)}-${slugify(finish.name)}-cabinet-spec.pdf`
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const contentWidth = pageWidth - CABINET_PDF_MARGIN * 2
  const details = [
    ['Door profile', `${style.name} (${style.tag})`],
    ['Cabinet color', finish.name],
    ['Finish type', finishType],
    ['Style family', style.family],
  ]

  pdf.setFillColor(255, 255, 255)
  pdf.rect(0, 0, pageWidth, pageHeight, 'F')

  let cursorY = 52

  pdf.setFont('times', 'bold')
  pdf.setFontSize(22)
  pdf.setTextColor(...CABINET_PDF_TEXT)
  pdf.text('Classic Stone Granite & Marble LLC', pageWidth / 2, cursorY, { align: 'center' })

  pdf.setFont('times', 'normal')
  pdf.setFontSize(24)
  pdf.setTextColor(...CABINET_PDF_COPPER)
  pdf.text(`${style.name} Cabinet Profile`, pageWidth / 2, cursorY + 40, { align: 'center' })

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(12)
  pdf.setTextColor(...CABINET_PDF_MUTED)
  pdf.text(`Finish selection: ${finish.name}`, pageWidth / 2, cursorY + 66, { align: 'center' })

  cursorY += 96

  if (previewImage) {
    const imageWidth = contentWidth
    const imageHeight = Math.min(280, imageWidth * (previewImage.height / previewImage.width))
    pdf.addImage(previewImage.dataUrl, 'JPEG', CABINET_PDF_MARGIN, cursorY, imageWidth, imageHeight, undefined, 'FAST')
    cursorY += imageHeight + 28
  }

  pdf.setDrawColor(224, 215, 203)
  pdf.line(CABINET_PDF_MARGIN, cursorY, pageWidth - CABINET_PDF_MARGIN, cursorY)
  cursorY += 24

  details.forEach(([label, value]) => {
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(11)
    pdf.setTextColor(...CABINET_PDF_MUTED)
    pdf.text(label.toUpperCase(), CABINET_PDF_MARGIN, cursorY)

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(12)
    pdf.setTextColor(...CABINET_PDF_TEXT)
    pdf.text(String(value), CABINET_PDF_MARGIN + 132, cursorY)
    cursorY += 22
  })

  cursorY += 8
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(11)
  pdf.setTextColor(...CABINET_PDF_MUTED)
  pdf.text('STYLE NOTES', CABINET_PDF_MARGIN, cursorY)
  cursorY += 18

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(12)
  pdf.setTextColor(...CABINET_PDF_TEXT)
  const styleDescriptionLines = pdf.splitTextToSize(style.description, contentWidth)
  pdf.text(styleDescriptionLines, CABINET_PDF_MARGIN, cursorY)
  cursorY += styleDescriptionLines.length * 16 + 12

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(11)
  pdf.setTextColor(...CABINET_PDF_MUTED)
  pdf.text('FINISH NOTES', CABINET_PDF_MARGIN, cursorY)
  cursorY += 18

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(12)
  pdf.setTextColor(...CABINET_PDF_TEXT)
  const finishNoteLines = pdf.splitTextToSize(finish.note, contentWidth)
  pdf.text(finishNoteLines, CABINET_PDF_MARGIN, cursorY)

  pdf.setFont('helvetica', 'italic')
  pdf.setFontSize(10)
  pdf.setTextColor(...CABINET_PDF_MUTED)
  pdf.text('Finish availability and final selections are confirmed during your Classic Stone design consultation.', CABINET_PDF_MARGIN, pageHeight - 34)

  pdf.save(fileName)
}

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
  const [isDownloadingSpec, setIsDownloadingSpec] = useState(false)

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
                    <button
                      type="button"
                      className="btn btn-dark fds-detail-download"
                      onClick={async () => {
                        try {
                          setIsDownloadingSpec(true)
                          await downloadCabinetSpec(style, selectedFinish, selectedFinishType)
                        } finally {
                          setIsDownloadingSpec(false)
                        }
                      }}
                      disabled={isDownloadingSpec}
                    >
                      {isDownloadingSpec ? 'Preparing Spec...' : 'Download Cabinet Spec'}
                    </button>
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