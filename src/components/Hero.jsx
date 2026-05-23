import { useRef } from 'react'

const HERO_IMAGE = '/HERO_IMAGE.png'

const HOTSPOTS = [
  {
    title: 'Crafted Homes',
    detail: 'See how Classic Stone approaches timeless residential design.',
    href: '#about',
    top: '95%',
    left: '28%',
  },
  {
    title: 'Material Library',
    detail: 'Browse stone selections and finish directions.',
    href: '#stone-gallery',
    top: '95%',
    left: '50%',
  },
  {
    title: 'Start the Visit',
    detail: 'Book a consultation and walk the project together.',
    href: '#contact',
    top: '95%',
    left: '72%',
  },
]

export default function Hero({ onOpenNewsletter }) {
  const heroRef = useRef(null)

  const handleOpenNewsletter = () => {
    onOpenNewsletter?.('hero', { triggerType: 'manual' })
  }

  const updateHeroDepth = (clientX, clientY) => {
    const hero = heroRef.current

    if (!hero) {
      return
    }

    const rect = hero.getBoundingClientRect()
    const x = (clientX - rect.left) / rect.width
    const y = (clientY - rect.top) / rect.height
    const shiftX = ((x - 0.5) * 24).toFixed(2)
    const shiftY = ((y - 0.5) * 18).toFixed(2)
    const overlayOpacity = (0.66 + y * 0.08).toFixed(3)

    hero.style.setProperty('--hero-shift-x', `${shiftX}px`)
    hero.style.setProperty('--hero-shift-y', `${shiftY}px`)
    hero.style.setProperty('--hero-glow-x', `${(x * 100).toFixed(2)}%`)
    hero.style.setProperty('--hero-glow-y', `${(y * 100).toFixed(2)}%`)
    hero.style.setProperty('--hero-overlay-opacity', overlayOpacity)
  }

  const resetHeroDepth = () => {
    const hero = heroRef.current

    if (!hero) {
      return
    }

    hero.style.removeProperty('--hero-shift-x')
    hero.style.removeProperty('--hero-shift-y')
    hero.style.removeProperty('--hero-glow-x')
    hero.style.removeProperty('--hero-glow-y')
    hero.style.removeProperty('--hero-overlay-opacity')
  }

  const handlePointerMove = (event) => {
    if (event.pointerType === 'touch') {
      return
    }

    updateHeroDepth(event.clientX, event.clientY)
  }

  return (
    <section
      ref={heroRef}
      className="hero"
      id="home"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetHeroDepth}
    >

      <div
        className="hero-bg"
        style={{ backgroundImage: `url(${HERO_IMAGE})` }}
      />

      <div className="hero-overlay" />
      <div className="hero-glow" />
      <div className="hero-texture" />
      <div className="hero-fade" />

      <div className="hero-content">
        <p className="hero-eyebrow">Virginia's Home Builder</p>
        <h1>
          Built with <em>Stone.</em><br />
          Crafted with Heart.
        </h1>
        <p className="hero-desc">
          Classic Stone builds homes that stand for generations, rooted in Virginia's natural beauty and timeless craftsmanship.
        </p>
        <div className="hero-actions">
          <a href="#contact" className="btn btn-fill">Get a Free Consultation</a>
          <button type="button" className="btn" onClick={handleOpenNewsletter}>
            Get Design Updates
          </button>
          <a href="#portfolio" className="btn">View Our Work</a>
        </div>

        <div className="hero-hotspots" aria-label="Featured paths through the hero image">
          {HOTSPOTS.map((hotspot) => (
            <a
              key={hotspot.title}
              className="hero-hotspot"
              href={hotspot.href}
              style={{ '--hotspot-top': hotspot.top, '--hotspot-left': hotspot.left }}
            >
              <span className="hero-hotspot-title">{hotspot.title}</span>
              <span className="hero-hotspot-detail">{hotspot.detail}</span>
            </a>
          ))}
        </div>
      </div>

      <a className="scroll-hint" href="#about">
        Explore the Process
      </a>
    </section>
  )
}


