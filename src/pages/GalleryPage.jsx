import { useEffect, useState } from 'react'
import Seo from '../components/Seo'
import { getPageSeo } from '../data/seo'

const INSPIRATION_IMAGES = [
  {
    title: 'Brittanicca Living Room',
    image: '/Inspiration Gallery/brittanicca-living-room-henke-dpdsm-cs16-004-17_IG-1240x1240.avif',
  },
  {
    title: 'Delamere Living Room',
    image: '/Inspiration Gallery/delamere-living-room-la-light-photography-sophea-designs-006-24_IG-1240x1240.avif',
  },
  {
    title: 'Everleigh Living Room',
    image: '/Inspiration Gallery/everleigh-living-room-design-001-24_IG-1240x1240.avif',
  },
  {
    title: 'Hermitage Kitchen',
    image: '/Inspiration Gallery/hermitage-kitchen-alex-lukey-soda-pop-design-001-25_IG-1240x1240.avif',
  },
  {
    title: 'Hermitage Wentwood Bar',
    image: '/Inspiration Gallery/hermitage-wentwood-bar-kbd-karlisch-001-21_IG-1240x1240.avif',
  },
  {
    title: 'Inverness Bristol Bay Bathroom',
    image: '/Inspiration Gallery/inverness-bristol-bay-bathroom-transitional-001-23_IG-1240x1240.avif',
  },
  {
    title: 'Inverness Bristol Bay Kitchen',
    image: '/Inspiration Gallery/inverness-bristol-bay-kitchen-modern-001-23_IG-1240x1240.avif',
  },
  {
    title: 'Inverness Frost Kitchen',
    image: '/Inspiration Gallery/inverness-frost-kitchen-struxture-004-24_IG-1240x1240.avif',
  },
  {
    title: 'Inverness Platinum Kitchen',
    image: '/Inspiration Gallery/inverness-platinum-kitchen-ethan-charles-public-311-design-002-24_IG-1240x1240.avif',
  },
  {
    title: 'Ivybridge Kitchen',
    image: '/Inspiration Gallery/ivybridge-kitchen-dodd-001-24.avif',
  },
  {
    title: 'Sculpted Waterfall Marble Island',
    image: '/Kitchen island design/0.1.jpg',
  },
  {
    title: 'Honey Veined Stone Island with Brass Fixtures',
    image: '/Kitchen island design/0.2.jpg',
  },
  {
    title: 'Charcoal Waterfall Island with Globe Pendants',
    image: '/Kitchen island design/0.3.jpg',
  },
  {
    title: 'Backlit Charcoal Stone Entertaining Island',
    image: '/Kitchen island design/0.4.jpg',
  },
  {
    title: 'Curved Fluted Marble Kitchen Island',
    image: '/Kitchen island design/0.5.jpg',
  },
  {
    title: 'Dramatic Black Veined Stone Island',
    image: '/Kitchen island design/0.6.jpg',
  },
  {
    title: 'Warm Taupe Waterfall Island with Pendant Trio',
    image: '/Kitchen island design/0.7.jpg',
  },
  {
    title: 'Symmetrical Limestone Kitchen Island',
    image: '/Kitchen island design/0.8.jpg',
  },
  {
    title: 'Macbeth Bathroom',
    image: '/Inspiration Gallery/macbeth-bathroom-design-001-24_IG-1240x1240.avif',
  },
  {
    title: 'Portrush Matte Bathroom',
    image: '/Inspiration Gallery/portrush-matte-bathroom-dodd-004-25_IG-1240x1240.avif',
  },
  {
    title: 'Seacourt Kitchen',
    image: '/Inspiration Gallery/seacourt-kitchen-carter-dodd-001-24_IG-1240x1240.avif',
  },
  {
    title: 'Southport Bathroom',
    image: '/Inspiration Gallery/southport-bathroom-gisele-parra-jennifer-kizzee-001-25_IG-1240x1240.avif',
  },
]

export default function GalleryPage() {
  const pageSeo = getPageSeo('/gallery')
  const [selectedImage, setSelectedImage] = useState(null)
  const [carouselIndex, setCarouselIndex] = useState(0)

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setCarouselIndex(currentIndex => (currentIndex + 1) % INSPIRATION_IMAGES.length)
    }, 4500)

    return () => {
      window.clearInterval(timerId)
    }
  }, [])

  useEffect(() => {
    if (!selectedImage) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedImage(null)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedImage])

  const shiftCarousel = direction => {
    setCarouselIndex(currentIndex => {
      const nextIndex = currentIndex + direction

      if (nextIndex < 0) {
        return INSPIRATION_IMAGES.length - 1
      }

      return nextIndex % INSPIRATION_IMAGES.length
    })
  }

  const carouselSlides = [-2, -1, 0, 1, 2].map(offset => {
    const imageIndex = (carouselIndex + offset + INSPIRATION_IMAGES.length) % INSPIRATION_IMAGES.length

    return {
      ...INSPIRATION_IMAGES[imageIndex],
      imageIndex,
      offset,
    }
  })

  return (
    <>
      <Seo title={pageSeo.title} description={pageSeo.description} path={pageSeo.path} />
      <div className="fp-page-banner">
        <div className="container">
          <h1 className="fp-page-banner-title">Gallery</h1>
          <p className="fp-page-banner-sub">
            Browse recent Classic Stone project work across restaurants, kitchens,
            hospitality spaces, and custom stone installations completed in Virginia.
          </p>
        </div>
      </div>

      <section className="inspiration-gallery-section">
        <div className="container">
          <div className="inspiration-gallery-head">
            <p className="section-label">Inspiration Gallery</p>
            <h2 className="section-title">Design references worth saving.</h2>
            <div className="divider" />
            <p className="inspiration-gallery-intro">
              Explore a curated set of interiors and surfaces that capture the look, tone,
              and material direction many clients use as inspiration for their own projects.
            </p>
          </div>

          <section className="inspiration-gallery-carousel" aria-label="Featured gallery inspiration">
            <div className="inspiration-gallery-carousel-head">
              <p className="inspiration-gallery-carousel-kicker">Featured Slider</p>
              <div className="inspiration-gallery-carousel-controls" aria-label="Gallery slider controls">
                <button
                  type="button"
                  className="inspiration-gallery-carousel-btn"
                  onClick={() => shiftCarousel(-1)}
                  aria-label="Previous gallery slide"
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="inspiration-gallery-carousel-btn"
                  onClick={() => shiftCarousel(1)}
                  aria-label="Next gallery slide"
                >
                  Next
                </button>
              </div>
            </div>

            <div className="inspiration-gallery-carousel-stage">
              {carouselSlides.map(item => (
                <button
                  key={`${item.image}-${item.offset}`}
                  type="button"
                  className="inspiration-gallery-carousel-card"
                  data-offset={item.offset}
                  aria-current={item.offset === 0 ? 'true' : undefined}
                  aria-label={item.offset === 0 ? `Open ${item.title}` : `View ${item.title}`}
                  onClick={() => {
                    if (item.offset === 0) {
                      setSelectedImage(item)
                      return
                    }

                    setCarouselIndex(item.imageIndex)
                  }}
                >
                  <div className="inspiration-gallery-carousel-image-shell">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="inspiration-gallery-carousel-image"
                      loading="lazy"
                    />
                  </div>
                  <div className="inspiration-gallery-carousel-caption">
                    <span className="inspiration-gallery-carousel-index">
                      {String(item.imageIndex + 1).padStart(2, '0')}
                    </span>
                    <span className="inspiration-gallery-carousel-title">{item.title}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="inspiration-gallery-carousel-dots" aria-label="Gallery slide indicators">
              {INSPIRATION_IMAGES.map((item, index) => (
                <button
                  key={item.image}
                  type="button"
                  className={`inspiration-gallery-carousel-dot${index === carouselIndex ? ' active' : ''}`}
                  onClick={() => setCarouselIndex(index)}
                  aria-label={`Go to ${item.title}`}
                  aria-pressed={index === carouselIndex}
                />
              ))}
            </div>
          </section>

          <div className="inspiration-gallery-grid">
            {INSPIRATION_IMAGES.map(item => (
              <figure key={item.image} className="inspiration-gallery-card">
                <img src={item.image} alt={item.title} className="inspiration-gallery-image" loading="lazy" />
                <figcaption className="inspiration-gallery-caption">{item.title}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {selectedImage && (
        <div
          className="inspiration-gallery-modal-overlay"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedImage(null)
            }
          }}
        >
          <div
            className="inspiration-gallery-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="inspiration-gallery-modal-title"
          >
            <button
              type="button"
              className="inspiration-gallery-modal-close"
              onClick={() => setSelectedImage(null)}
              aria-label="Close gallery image"
            >
              x
            </button>
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="inspiration-gallery-modal-image"
            />
            <p className="inspiration-gallery-modal-caption" id="inspiration-gallery-modal-title">
              {selectedImage.title}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
