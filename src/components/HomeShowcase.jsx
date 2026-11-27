import { useEffect, useState } from 'react'

const inspirationImages = [
  {
    src: '/Inspiration Gallery/hermitage-kitchen-alex-lukey-soda-pop-design-001-25_IG-1240x1240.avif',
    alt: 'Warm, light-filled kitchen with a natural stone island',
  },
  {
    src: '/Inspiration Gallery/inverness-bristol-bay-bathroom-transitional-001-23_IG-1240x1240.avif',
    alt: 'Bright bathroom finished with natural stone',
  },
  {
    src: '/Inspiration Gallery/brittanicca-living-room-henke-dpdsm-cs16-004-17_IG-1240x1240.avif',
    alt: 'Elegant living room with expressive stone details',
  },
]

const materials = [
  { name: 'Marble', image: '/marble.jpg' },
  { name: 'Quartzite', image: '/quartzite.jpg' },
  { name: 'Quartz', image: '/Quartz/Statuario Picasso.JPG' },
  { name: 'Granite', image: '/Granite.jpg' },
]

const heroSlides = [
  '/Inspiration Gallery/inverness-bristol-bay-kitchen-modern-001-23_IG-1240x1240.avif',
  '/Inspiration Gallery/seacourt-kitchen-carter-dodd-001-24_IG-1240x1240.avif',
  '/Kitchen island design/0.4.jpg',
]

export default function HomeShowcase() {
  const [activeHeroSlide, setActiveHeroSlide] = useState(0)
  const [isHeroPaused, setIsHeroPaused] = useState(false)
  const [prefersReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    if (isHeroPaused || prefersReducedMotion) {
      return undefined
    }

    const timerId = window.setTimeout(() => {
      setActiveHeroSlide(index => (index + 1) % heroSlides.length)
    }, 6500)

    return () => window.clearTimeout(timerId)
  }, [activeHeroSlide, isHeroPaused, prefersReducedMotion])

  const changeHeroSlide = direction => {
    setActiveHeroSlide(index => (index + direction + heroSlides.length) % heroSlides.length)
  }

  return (
    <main className="home-showcase">
      <section
        className="showcase-hero"
        id="home"
        aria-labelledby="showcase-title"
        aria-roledescription="carousel"
        aria-label="Featured Classic Stone spaces"
        onMouseEnter={() => setIsHeroPaused(true)}
        onMouseLeave={() => setIsHeroPaused(false)}
        onFocusCapture={() => setIsHeroPaused(true)}
        onBlurCapture={event => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsHeroPaused(false)
          }
        }}
      >
        {heroSlides.map((image, index) => (
          <img
            key={image}
            className={`showcase-hero-image${activeHeroSlide === index ? ' is-active' : ''}`}
            src={image}
            alt=""
            loading={index === 0 ? 'eager' : 'lazy'}
            aria-hidden="true"
          />
        ))}
        <div className="showcase-hero-shade" />
        <div className="showcase-hero-copy">
          <p className="showcase-eyebrow">Natural stone · Timeless design</p>
          <h1 id="showcase-title">Natural Stone.<br />Timeless Spaces.</h1>
          <p className="showcase-hero-description">
            Premium stone surfaces, custom cabinetry, and exceptional craftsmanship.
          </p>
          <a className="showcase-button" href="/stone-gallery">
            Explore our work <span aria-hidden="true">→</span>
          </a>
        </div>
        <a className="showcase-scroll" href="#featured-projects">Discover Classic Stone</a>
        <div className="showcase-hero-controls" role="group" aria-label="Featured space controls">
          <span aria-live="polite" aria-atomic="true">
            {String(activeHeroSlide + 1).padStart(2, '0')} <i /> {String(heroSlides.length).padStart(2, '0')}
          </span>
          <button type="button" aria-label="Previous featured space" onClick={() => changeHeroSlide(-1)}>
            <svg viewBox="0 0 16 12" aria-hidden="true"><path d="M6 11 1 6l5-5M1 6h14" /></svg>
          </button>
          <button type="button" aria-label="Next featured space" onClick={() => changeHeroSlide(1)}>
            <svg viewBox="0 0 16 12" aria-hidden="true"><path d="m10 1 5 5-5 5m5-5H1" /></svg>
          </button>
        </div>
      </section>

      <section className="showcase-featured" id="featured-projects" aria-labelledby="featured-title">
        <div className="showcase-featured-copy">
          <p className="showcase-kicker">Featured projects</p>
          <h2 id="featured-title">Spaces made exceptional.</h2>
          <p>From elegant kitchens to luxurious baths, our work brings natural stone to life in extraordinary ways.</p>
          <a className="showcase-text-link" href="/gallery">View portfolio <span aria-hidden="true">→</span></a>
        </div>
        <a className="showcase-featured-main showcase-image-link" href="/gallery" aria-label="Explore our kitchen and bath projects">
          <img
            src="/Inspiration Gallery/inverness-bristol-bay-bathroom-transitional-001-23_IG-1240x1240.avif"
            alt="Freestanding tub in an elegant stone bathroom"
            loading="lazy"
          />
        </a>
        <div className="showcase-featured-side">
          <a className="showcase-image-link" href="/gallery" aria-label="View a contemporary stone kitchen">
            <img
              src="/Inspiration Gallery/seacourt-kitchen-carter-dodd-001-24_IG-1240x1240.avif"
              alt="Contemporary kitchen featuring a stone island"
              loading="lazy"
            />
          </a>
          <a className="showcase-image-link" href="/gallery" aria-label="Browse more Classic Stone projects">
            <img
              src="/Inspiration Gallery/hermitage-wentwood-bar-kbd-karlisch-001-21_IG-1240x1240.avif"
              alt="Custom bar with natural stone surfaces"
              loading="lazy"
            />
          </a>
        </div>
      </section>

      <section className="showcase-stones" id="stone-collection" aria-labelledby="stones-title">
        <div className="showcase-stones-copy">
          <p className="showcase-kicker">The stone collection</p>
          <h2 id="stones-title">Discover the beauty of stone.</h2>
          <p>Explore our curated selection of marble, quartzite, quartz, and granite.</p>
          <a className="showcase-outline-link" href="/stone-gallery">Explore stone gallery <span aria-hidden="true">→</span></a>
        </div>
        <div className="showcase-material-grid">
          {materials.map(material => (
            <a className="showcase-material" href="/stone-gallery" key={material.name}>
              <img src={material.image} alt="" loading="lazy" />
              <span>{material.name}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="showcase-cabinetry" id="services" aria-labelledby="cabinetry-title">
        <a className="showcase-cabinetry-image showcase-image-link" href="/schedule" aria-label="Discuss a custom cabinetry project">
          <img
            src="/Kitchen island design/0.4.jpg"
            alt="Custom cabinetry and a sculpted natural stone kitchen island"
            loading="lazy"
          />
        </a>
        <div className="showcase-cabinetry-copy">
          <p className="showcase-kicker">Cabinetry &amp; interiors</p>
          <h2 id="cabinetry-title">Beautifully designed.<br />Thoughtfully finished.</h2>
          <p>Thoughtful cabinetry, finishes, and details designed to complement your stone surfaces.</p>
          <a className="showcase-dark-link" href="/cabinetry">Plan your cabinetry <span aria-hidden="true">→</span></a>
        </div>
      </section>

      <section className="showcase-craft" aria-labelledby="craft-title">
        <div className="showcase-craft-copy">
          <p className="showcase-kicker">Our craftsmanship</p>
          <h2 id="craft-title">From slab selection<br />to final installation.</h2>
          <p>Our in-house team brings precision and care to every detail.</p>
          <a className="showcase-text-link" href="/stone-gallery">Learn more <span aria-hidden="true">→</span></a>
        </div>
        <div className="showcase-craft-media">
          <video
            src="/Hero video/Generated Video July 24, 2026 - 10_23PM.mp4"
            poster="/Kitchen island design/0.4.jpg"
            autoPlay={!prefersReducedMotion}
            muted
            loop
            playsInline
            preload={prefersReducedMotion ? 'none' : 'auto'}
            controls
            aria-label="Watch our stone fabrication video"
          />
        </div>
      </section>

      <section className="showcase-inspiration" id="about" aria-labelledby="inspiration-title">
        <div className="showcase-inspiration-copy">
          <p className="showcase-kicker">Inspiration</p>
          <h2 id="inspiration-title">Ideas worth living in.</h2>
          <p>Explore inspiring spaces featuring natural stone.</p>
          <a className="showcase-text-link" href="/gallery">View inspiration <span aria-hidden="true">→</span></a>
        </div>
        <div className="showcase-inspiration-grid">
          {inspirationImages.map(image => (
            <a className="showcase-image-link" href="/gallery" key={image.src}>
              <img src={image.src} alt={image.alt} loading="lazy" />
            </a>
          ))}
        </div>
        <div className="showcase-contact">
          <p className="showcase-kicker">Let’s create something lasting</p>
          <h2>Your vision.<br />Our craftsmanship.</h2>
          <a className="showcase-phone" href="tel:+12022270788">(202) 227-0788</a>
          <a className="showcase-button" href="/schedule">Contact us <span aria-hidden="true">→</span></a>
        </div>
      </section>
    </main>
  )
}
