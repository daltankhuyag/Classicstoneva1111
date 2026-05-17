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
    </>
  )
}
