import { useEffect, useRef, useState } from 'react'

const HERO_HOLD_MS = 6500
const HERO_TRANSITION_MS = 900

const HERO_SLIDES = [
  {
    id: 'stone-yard',
    eyebrow: 'Fabricated in-house',
    title: 'Every counter starts as a slab in our yard',
    description:
      'Granite, quartz, and marble are templated, cut, polished, and installed by our own crew for one continuous standard from selection to final fit.',
    ctaLabel: 'Browse our stone',
    ctaHref: '/stone-gallery#stone-gallery',
    image: '/Inspiration Gallery/hermitage-kitchen-alex-lukey-soda-pop-design-001-25_IG-1240x1240.avif',
    progressLabel: 'Slide 1: Stone gallery',
  },
  {
    id: 'door-styles',
    eyebrow: 'Fabuwood Cabinetry',
    title: 'Pick your door, then watch the finish change',
    description:
      'Compare shaker and slab cabinet profiles, then open each style to review the real finish collections before making your final selection.',
    ctaLabel: 'Explore door profiles',
    ctaHref: '/#door-profiles',
    image: '/Inspiration Gallery/inverness-bristol-bay-kitchen-modern-001-23_IG-1240x1240.avif',
    progressLabel: 'Slide 2: Door profiles',
  },
  {
    id: 'portfolio',
    eyebrow: 'Recent Classic Stone work',
    title: 'See our stone craftsmanship in real projects',
    description:
      'Review installed kitchens, hospitality projects, and custom surfaces to see how materials, edges, and layouts come together in finished spaces.',
    ctaLabel: 'View our portfolio',
    ctaHref: '/#portfolio',
    image: '/Inspiration Gallery/seacourt-kitchen-carter-dodd-001-24_IG-1240x1240.avif',
    progressLabel: 'Slide 3: Portfolio',
  },
]

export default function Hero({ onOpenNewsletter }) {
  const heroRef = useRef(null)
  const leavingSlideTimeoutRef = useRef(null)
  const touchStartXRef = useRef(null)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [leavingSlideIndex, setLeavingSlideIndex] = useState(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) {
      return undefined
    }

    const timerId = window.setTimeout(() => {
      goToSlide((currentSlideIndex + 1) % HERO_SLIDES.length)
    }, HERO_HOLD_MS)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [currentSlideIndex, isPaused])

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.hidden)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.clearTimeout(leavingSlideTimeoutRef.current)
    }
  }, [])

  const handleOpenNewsletter = () => {
    onOpenNewsletter?.('hero', { triggerType: 'manual' })
  }

  const goToSlide = (nextIndex) => {
    if (nextIndex === currentSlideIndex) {
      return
    }

    window.clearTimeout(leavingSlideTimeoutRef.current)
    setLeavingSlideIndex(currentSlideIndex)
    setCurrentSlideIndex(nextIndex)
    leavingSlideTimeoutRef.current = window.setTimeout(() => {
      setLeavingSlideIndex(null)
    }, HERO_TRANSITION_MS)
  }

  const goToNextSlide = () => {
    goToSlide((currentSlideIndex + 1) % HERO_SLIDES.length)
  }

  const goToPreviousSlide = () => {
    goToSlide((currentSlideIndex - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
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

  const handleTouchStart = (event) => {
    touchStartXRef.current = event.touches[0]?.clientX ?? null
  }

  const handleTouchEnd = (event) => {
    if (touchStartXRef.current === null) {
      return
    }

    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartXRef.current
    const deltaX = touchEndX - touchStartXRef.current

    if (Math.abs(deltaX) > 48) {
      if (deltaX < 0) {
        goToNextSlide()
      } else {
        goToPreviousSlide()
      }
    }

    touchStartXRef.current = null
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goToNextSlide()
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goToPreviousSlide()
    }
  }

  const handleBlurCapture = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsPaused(false)
    }
  }

  const activeSlide = HERO_SLIDES[currentSlideIndex]

  return (
    <section
      ref={heroRef}
      className={`hero${isPaused ? ' is-paused' : ''}`}
      id="home"
      aria-roledescription="carousel"
      aria-label="Classic Stone highlights"
      tabIndex={0}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetHeroDepth}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={handleBlurCapture}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
    >

      {HERO_SLIDES.map((slide, index) => {
        const isActive = index === currentSlideIndex
        const isLeaving = index === leavingSlideIndex

        return (
          <article
            key={slide.id}
            className={`hero-slide${isActive ? ' is-active' : ''}${isLeaving ? ' is-leaving' : ''}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${HERO_SLIDES.length}`}
            aria-hidden={!isActive}
          >
            <div
              className="hero-media"
              style={{ backgroundImage: `url("${slide.image}")` }}
            />

            <div className="hero-overlay" />
            <div className="hero-glow" />
            <div className="hero-fade" />

            <div className="hero-content">
              <p className="hero-eyebrow">{slide.eyebrow}</p>
              <h1>{slide.title}</h1>
              <p className="hero-desc">{slide.description}</p>
              <div className="hero-actions">
                <a href={slide.ctaHref} className="btn btn-fill hero-slide-cta">
                  {slide.ctaLabel}
                  <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
                    <path d="M10 1l5 5-5 5M15 6H1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <button type="button" className="btn hero-secondary-action" onClick={handleOpenNewsletter}>
                  Get Design Updates
                </button>
              </div>
            </div>
          </article>
        )
      })}

      <div className="hero-controls">
        <div className="hero-strips" role="tablist" aria-label="Choose hero slide">
          {HERO_SLIDES.map((slide, index) => {
            const isCurrent = index === currentSlideIndex

            return (
              <button
                key={slide.id}
                type="button"
                className={`hero-strip${isCurrent ? ' is-current' : ''}`}
                role="tab"
                aria-selected={isCurrent}
                aria-label={slide.progressLabel}
                onClick={() => goToSlide(index)}
              />
            )
          })}
        </div>

        <div className="hero-controls-meta">
          <p className="hero-slide-count">
            <b>{String(currentSlideIndex + 1).padStart(2, '0')}</b> / <span>{String(HERO_SLIDES.length).padStart(2, '0')}</span>
          </p>
          <div className="hero-arrows">
            <button type="button" className="hero-arrow" aria-label="Previous slide" onClick={goToPreviousSlide}>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
                <path d="M6 11L1 6l5-5M1 6h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button type="button" className="hero-arrow" aria-label="Next slide" onClick={goToNextSlide}>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
                <path d="M10 1l5 5-5 5M15 6H1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <a className="scroll-hint" href="#about">
        Explore the Process
      </a>
    </section>
  )
}


